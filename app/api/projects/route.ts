import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
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
    console.error('[api/projects]', err);
    return Response.json({ error: 'Failed to load projects.' }, { status: 500 });
  }
}
