// lib/generateResume.ts
// Generate a text-based resume from portfolio data (can be enhanced for PDF)
import type { ProjectSummary, Certificate, Metric } from '@/types/portfolio';

export function generateResumeMarkdown(
  name: string,
  email: string,
  projects: ProjectSummary[],
  certificates: Certificate[],
  metrics: Metric[],
): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${name}`);
  lines.push(`📧 ${email}`);
  lines.push(`🌐 https://dwebstudios.com`);
  lines.push('');

  // Profile / Headline
  lines.push('## Professional Summary');
  lines.push(
    'Full-stack engineer with expertise in AI integration, system reliability, and financial outcome ' +
      'measurement. Proven track record shipping production systems across enterprise and startup contexts.',
  );
  lines.push('');

  // Key Metrics
  if (metrics.length > 0) {
    lines.push('## Key Metrics');
    for (const m of metrics) {
      lines.push(`• ${m.display_value ?? m.value} ${m.label}${m.context ? ` — ${m.context}` : ''}`);
    }
    lines.push('');
  }

  // Projects
  lines.push('## Featured Projects');
  for (const p of projects.filter((p) => p.featured)) {
    lines.push(`### ${p.title}`);
    if (p.subtitle) {
      lines.push(`*${p.subtitle}*`);
    }

    lines.push('');

    // Details
    if (p.problem_statement) {
      lines.push(`**Problem:** ${p.problem_statement}`);
    }

    if (p.approach) {
      lines.push(`**Solution:** ${p.approach}`);
    }

    if (p.stack?.length) {
      lines.push(`**Stack:** ${p.stack.join(', ')}`);
    }

    if (p.roi_value && p.roi_label) {
      lines.push(`**Impact:** ${p.roi_value} — ${p.roi_label}`);
    }

    if (p.testimonial_quote && p.testimonial_author) {
      lines.push(`> "${p.testimonial_quote}" — ${p.testimonial_author}`);
    }

    if (p.learnings?.length) {
      lines.push(`**Learnings:**`);
      for (const learning of p.learnings.slice(0, 2)) {
        lines.push(`• ${learning}`);
      }
    }

    lines.push('');
  }

  // Certifications
  if (certificates.length > 0) {
    lines.push('## Certifications & Credentials');
    for (const c of certificates) {
      lines.push(`• **${c.title}** — ${c.issuer} (${c.category})`);
      if (c.roi_proof) {
        lines.push(`  ${c.roi_proof}`);
      }
    }
    lines.push('');
  }

  // All Projects (compact)
  lines.push('## All Projects');
  for (const p of projects.sort((a, b) => {
    const dateA = a.built_at ? new Date(a.built_at).getTime() : 0;
    const dateB = b.built_at ? new Date(b.built_at).getTime() : 0;
    return dateB - dateA;
  })) {
    const date = p.built_at ? new Date(p.built_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '?';
    lines.push(`• **${p.title}** (${date}) — ${p.category}`);
    if (p.stack?.length) {
      lines.push(`  Stack: ${p.stack.slice(0, 3).join(', ')}${p.stack.length > 3 ? `, +${p.stack.length - 3}` : ''}`);
    }
  }
  lines.push('');

  // Footer
  lines.push('---');
  lines.push('*Generated from DWS Spatial Portfolio OS*');

  return lines.join('\n');
}

export function downloadResume(
  markdown: string,
  filename = 'resume.md',
): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateResumeJSON(
  projects: ProjectSummary[],
  certificates: Certificate[],
): {
  projects: ProjectSummary[];
  certificates: Certificate[];
  exportedAt: string;
} {
  return {
    projects,
    certificates,
    exportedAt: new Date().toISOString(),
  };
}
