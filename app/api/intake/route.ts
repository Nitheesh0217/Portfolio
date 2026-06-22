import { NextRequest } from 'next/server';
import sql from '@/lib/db';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IntakePayload {
  project_name: string;
  project_type: string;
  timeline?: string;
  business_name?: string;
  industry?: string;
  target_audience?: string;
  primary_goal?: string;
  user_personas?: string;
  user_stories?: string;
  must_have_features?: string;
  nice_to_have_features?: string;
  existing_systems?: string;
  preferred_stack?: string;
  constraints?: string;
  budget_range?: string;
  engagement_type?: string;
  client_name?: string;
  client_email: string;
  client_company?: string;
  source?: string;
}

interface AIScopingResponse {
  summary: Record<string, unknown>;
  normalized_user_stories: unknown[];
  architecture: Record<string, unknown>;
  user_flows: unknown[];
  phased_scope: Record<string, unknown>;
  budget_guidance: Record<string, unknown>;
  open_questions: unknown[];
}

interface IntakeRow {
  id: string;
}

// ─── POST /api/intake ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<Response> {
  // 1. Parse body
  let body: IntakePayload;
  try {
    body = (await req.json()) as IntakePayload;
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // 2. Server-side validation
  if (!body.project_name?.trim()) {
    return Response.json({ error: 'project_name is required.' }, { status: 400 });
  }
  if (!body.project_type?.trim()) {
    return Response.json({ error: 'project_type is required.' }, { status: 400 });
  }
  if (!body.client_email?.trim()) {
    return Response.json({ error: 'client_email is required.' }, { status: 400 });
  }

  // 3. Insert into Neon Postgres
  let row: IntakeRow;
  try {
    const rows = await sql<IntakeRow[]>`
      INSERT INTO project_intakes (
        project_name, project_type, timeline, business_name, industry,
        target_audience, primary_goal, user_personas, user_stories,
        must_have_features, nice_to_have_features, existing_systems,
        preferred_stack, constraints, budget_range, engagement_type,
        client_name, client_email, client_company, source
      ) VALUES (
        ${body.project_name},
        ${body.project_type},
        ${body.timeline ?? null},
        ${body.business_name ?? null},
        ${body.industry ?? null},
        ${body.target_audience ?? null},
        ${body.primary_goal ?? null},
        ${body.user_personas ?? null},
        ${body.user_stories ?? null},
        ${body.must_have_features ?? null},
        ${body.nice_to_have_features ?? null},
        ${body.existing_systems ?? null},
        ${body.preferred_stack ?? null},
        ${body.constraints ?? null},
        ${body.budget_range ?? null},
        ${body.engagement_type ?? null},
        ${body.client_name ?? null},
        ${body.client_email},
        ${body.client_company ?? null},
        ${body.source ?? 'web_form'}
      )
      RETURNING id;
    `;
    row = rows[0];
  } catch (dbError) {
    console.error('[intake] DB insert failed:', dbError);
    return Response.json({ error: 'Database error. Please try again.' }, { status: 500 });
  }

  // 4 & 5. Call AI scoping API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    const aiRes = await fetch(process.env.AI_API_URL!, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptData: {
          systemContext:
            'You are a senior full-stack solutions architect at D Web Studios. ' +
            'Given a project intake form, produce a structured JSON scope document that includes: ' +
            'a summary overview, normalized user stories, a recommended system architecture, ' +
            'user flow diagrams described in text, a phased project scope with milestones, ' +
            'budget guidance with line-item estimates, and open clarifying questions for the client.',
          intake: body,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!aiRes.ok) {
      throw new Error(`AI API responded with status ${aiRes.status}`);
    }

    const aiData = (await aiRes.json()) as AIScopingResponse;

    // 5. Persist AI results
    const aiArchitecture = JSON.stringify(aiData.architecture);
    const aiUserFlows = JSON.stringify(aiData.user_flows);
    const aiScopeSummary = JSON.stringify({
      summary: aiData.summary,
      phased_scope: aiData.phased_scope,
      budget_guidance: aiData.budget_guidance,
      open_questions: aiData.open_questions,
    });

    await sql`
      UPDATE project_intakes
      SET
        ai_architecture   = ${aiArchitecture},
        ai_user_flows     = ${aiUserFlows},
        ai_scope_summary  = ${aiScopeSummary}
      WHERE id = ${row.id};
    `;

    return Response.json({
      success: true,
      intakeId: row.id,
      aiGenerated: true,
      ai: {
        summary: aiData.summary,
        architecture: aiData.architecture,
        user_flows: aiData.user_flows,
        phased_scope: aiData.phased_scope,
        budget_guidance: aiData.budget_guidance,
      },
    });
  } catch (aiError) {
    // 6. AI failure is non-fatal
    console.error('[intake] AI scoping failed:', aiError);

    return Response.json({
      success: true,
      intakeId: row.id,
      aiGenerated: false,
    });
  }
}
