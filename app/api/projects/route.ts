// app/api/projects/route.ts
import { NextResponse }        from 'next/server';
import { createDbClient }      from '@/lib/dbClient';
import type { ProjectSummary } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sql = createDbClient();

  try {
    const rows = await sql`
      SELECT
        id, slug, title, subtitle,
        category, stack, tags,
        thumbnail_url, live_url, github_url,
        roi_label, roi_value, roi_context,
        testimonial_quote, testimonial_author, testimonial_avatar,
        problem_statement, approach, process_notes,
        learnings, artifact_urls,
        featured, sort_order, built_at, created_at
      FROM   projects
      WHERE  status = 'published'
      ORDER  BY featured DESC, sort_order ASC
    `;

    return NextResponse.json(rows as ProjectSummary[]);
  } catch (err) {
    console.error('[api/projects] DB error:', err);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}
