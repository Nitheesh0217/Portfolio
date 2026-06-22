// app/api/assistant/route.ts
// RAG streaming endpoint — "Poor man's RAG"
// Fetches all DB records, stuffs into Claude Haiku system prompt, streams SSE
import Anthropic          from '@anthropic-ai/sdk';
import { NextResponse }   from 'next/server';
import { createDbClient } from '@/lib/dbClient';
import { buildSystemPrompt } from '@/lib/assistantSystemPrompt';

export const dynamic = 'force-dynamic';

interface ChatMessage {
  role:    'user' | 'assistant';
  content: string;
}

interface AssistantRequest {
  message: string;
  history: ChatMessage[];
}

interface ProjectRow {
  title?:              string;
  subtitle?:           string;
  description?:        string;
  category?:           string;
  stack?:              string[] | null;
  roi_label?:          string;
  roi_value?:          string;
  roi_context?:        string;
  problem_statement?:  string;
  approach?:           string;
  learnings?:          string[] | null;
  testimonial_quote?:  string;
  testimonial_author?: string;
}

interface CertificateRow {
  title?:     string;
  issuer?:    string;
  category?:  string;
  roi_proof?: string;
}

interface MetricRow {
  label?:         string;
  value?:         string | number;
  unit?:          string;
  display_value?: string;
  context?:       string;
}

function buildContext(data: {
  projects:     ProjectRow[];
  certificates: CertificateRow[];
  metrics:      MetricRow[];
}): string {
  const lines: string[] = [
    '═══════════════════════════════════════',
    'PORTFOLIO CONTEXT — D Web Studios',
    'Owner: Nitheesh Donepudi  ·  nitheeshd.17@gmail.com',
    '═══════════════════════════════════════',
    '',
  ];

  lines.push(`PROJECTS (${data.projects.length} shipped):`);
  for (const p of data.projects) {
    lines.push(`\n[${p.category ?? 'uncategorized'}] ${p.title ?? 'Untitled'}`);
    if (p.subtitle)            lines.push(`  Subtitle: ${p.subtitle}`);
    if (p.description)         lines.push(`  What: ${p.description}`);
    if (p.stack && p.stack.length > 0)
      lines.push(`  Stack: ${p.stack.join(', ')}`);
    if (p.roi_value && p.roi_label)
      lines.push(`  Impact: ${p.roi_value} — ${p.roi_label}${p.roi_context ? ` (${p.roi_context})` : ''}`);
    if (p.problem_statement)   lines.push(`  Problem: ${p.problem_statement}`);
    if (p.approach)            lines.push(`  Approach: ${p.approach}`);
    if (p.testimonial_quote)
      lines.push(`  Vouch: "${p.testimonial_quote}" — ${p.testimonial_author ?? ''}`);
    if (p.learnings && p.learnings.length > 0)
      lines.push(`  Learnings: ${p.learnings.slice(0, 2).join(' | ')}`);
  }

  lines.push('\n\nCERTIFICATIONS:');
  for (const c of data.certificates) {
    lines.push(`  • ${c.title ?? ''} — ${c.issuer ?? ''} [${c.category ?? ''}]${c.roi_proof ? ` → ${c.roi_proof}` : ''}`);
  }

  lines.push('\n\nHEADLINE METRICS:');
  for (const m of data.metrics) {
    const value = m.display_value ?? m.value ?? '';
    const unit  = m.unit && m.unit !== 'count' ? m.unit : '';
    lines.push(`  • ${value}${unit} ${m.label ?? ''}${m.context ? ` (${m.context})` : ''}`);
  }

  lines.push('\n═══════════════════════════════════════');
  return lines.join('\n');
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });
  }

  let body: AssistantRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { message, history = [] } = body;
  if (!message?.trim()) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const sql = createDbClient();
  let contextBlock = '';

  try {
    const [projects, certificates, metrics] = await Promise.all([
      sql`
        SELECT title, subtitle, description, category, stack,
               roi_label, roi_value, roi_context,
               problem_statement, approach, learnings,
               testimonial_quote, testimonial_author
        FROM   projects
        WHERE  status = 'published'
        ORDER  BY featured DESC, sort_order ASC
      `,
      sql`
        SELECT title, issuer, category, roi_proof
        FROM   certificates
        ORDER  BY category ASC, issued_at DESC
      `,
      sql`
        SELECT label, value, unit, display_value, context
        FROM   metrics
        WHERE  period = 'all-time'
        ORDER  BY display_order ASC
      `,
    ]);

    contextBlock = buildContext({
      projects:     projects     as ProjectRow[],
      certificates: certificates as CertificateRow[],
      metrics:      metrics      as MetricRow[],
    });
  } catch (err) {
    console.error('[api/assistant] DB fetch failed — proceeding without context:', err);
    contextBlock = '';
  }

  const systemPrompt = buildSystemPrompt(contextBlock);

  const safeHistory: Anthropic.MessageParam[] = history
    .slice(-10)
    .filter((m) => m.role && m.content)
    .map((m) => ({ role: m.role, content: m.content }));

  const client  = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model:      'claude-haiku-4-5-20251001',
          max_tokens:  1024,
          system:     systemPrompt,
          messages:   [...safeHistory, { role: 'user', content: message }],
        });

        const msgStream = messageStream as unknown as { textStream: AsyncIterable<string> };
        for await (const text of msgStream.textStream) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        const msg = (err as Error).message ?? 'Anthropic stream error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'Connection':        'keep-alive',
    },
  });
}
