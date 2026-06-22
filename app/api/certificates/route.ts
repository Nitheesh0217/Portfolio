// app/api/certificates/route.ts
import { NextResponse }    from 'next/server';
import { createDbClient }  from '@/lib/dbClient';
import type { Certificate } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sql = createDbClient();

  try {
    const rows = await sql`
      SELECT
        id, title, issuer, issuer_logo_url,
        category, credential_url, badge_url,
        issued_at, expires_at, credential_id,
        roi_proof, created_at
      FROM   certificates
      ORDER  BY category ASC, issued_at DESC
    `;

    return NextResponse.json(rows as Certificate[]);
  } catch (err) {
    console.error('[api/certificates] DB error:', err);
    return NextResponse.json({ error: 'Failed to load certificates' }, { status: 500 });
  }
}
