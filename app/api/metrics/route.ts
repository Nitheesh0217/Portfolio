// app/api/metrics/route.ts
import { NextResponse }   from 'next/server';
import { createDbClient } from '@/lib/dbClient';
import type { Metric }    from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sql = createDbClient();

  try {
    const rows = await sql`
      SELECT
        id, label, value, unit,
        display_value, context, icon,
        period, display_order
      FROM   metrics
      WHERE  period = 'all-time'
      ORDER  BY display_order ASC
    `;

    return NextResponse.json(rows as Metric[]);
  } catch (err) {
    console.error('[api/metrics] DB error:', err);
    return NextResponse.json({ error: 'Failed to load metrics' }, { status: 500 });
  }
}
