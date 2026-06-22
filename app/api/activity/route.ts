// app/api/activity/route.ts
// Powers TerminalWindow live feed — polled every 30s by the client
import { NextResponse }       from 'next/server';
import { createDbClient }     from '@/lib/dbClient';
import type { ActivityEntry } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sql = createDbClient();

  try {
    const rows = await sql`
      SELECT id, event_type, description, created_at
      FROM   activity_log
      ORDER  BY created_at DESC
      LIMIT  20
    `;

    return NextResponse.json(rows as ActivityEntry[]);
  } catch (err) {
    console.error('[api/activity] DB error:', err);
    return NextResponse.json({ error: 'Failed to load activity feed' }, { status: 500 });
  }
}
