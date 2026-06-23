import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, label, value, display_value, unit, context, sort_order
      FROM metrics
      WHERE period = 'all-time'
      ORDER BY sort_order ASC NULLS LAST;
    `;
    return Response.json(rows);
  } catch (err) {
    console.error('[api/metrics]', err);
    return Response.json({ error: 'Failed to load metrics.' }, { status: 500 });
  }
}
