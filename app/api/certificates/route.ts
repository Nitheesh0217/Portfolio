import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT
        id, title, issuer, issuer_logo_url, category,
        credential_url, badge_url,
        issued_at, expires_at, credential_id,
        roi_proof, created_at
      FROM certificates
      ORDER BY issued_at DESC NULLS LAST;
    `;
    return Response.json(rows);
  } catch (err) {
    console.error('[api/certificates]', err);
    return Response.json({ error: 'Failed to load certificates.' }, { status: 500 });
  }
}
