import { projects as staticProjects } from '@/data/projects';

export const dynamic = 'force-dynamic';

// Map static data/projects.ts shape → DB row shape so the UI always works
function staticFallback() {
  return staticProjects.map((p, i) => ({
    id:                  p.id,
    slug:                p.id,
    title:               p.name,
    subtitle:            p.description,
    category:            null,
    featured:            i < 3,
    stack:               p.tags ?? [],
    thumbnail_url:       null,
    live_url:            p.liveUrl ?? p.liveLink ?? null,
    github_url:          p.githubUrl ?? p.githubLink ?? null,
    problem_statement:   p.longDescription ?? null,
    approach:            null,
    process_notes:       null,
    roi_value:           p.metrics?.[0]?.value ?? null,
    roi_label:           p.metrics?.[0]?.label ?? null,
    roi_context:         p.impact ?? null,
    testimonial_quote:   null,
    testimonial_author:  null,
    testimonial_avatar:  null,
    learnings:           null,
    sort_order:          i,
  }));
}

export async function GET(): Promise<Response> {
  // ── 1. If DATABASE_URL is missing, serve static data immediately ──
  if (!process.env.DATABASE_URL) {
    console.warn('[api/projects] DATABASE_URL not set — serving static fallback');
    return Response.json(staticFallback());
  }

  // ── 2. Try the live database ──
  try {
    const { getDb } = await import('@/lib/db');
    const sql = getDb();
    const rows = await sql`
      SELECT
        id, slug, title, subtitle, category, featured,
        stack, thumbnail_url, live_url, github_url,
        problem_statement, approach, process_notes,
        roi_value, roi_label, roi_context,
        testimonial_quote, testimonial_author, testimonial_avatar,
        learnings, sort_order
      FROM projects
      ORDER BY sort_order ASC NULLS LAST, created_at DESC;
    `;
    return Response.json(rows);
  } catch (err) {
    // ── 3. DB reachable but query failed → still serve static data ──
    console.error('[api/projects] DB error — serving static fallback:', err);
    return Response.json(staticFallback());
  }
}
