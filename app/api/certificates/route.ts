import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, title, issuer, issued_date, credential_url, image_url, category, sort_order
      FROM certificates
      ORDER BY sort_order ASC NULLS LAST, issued_date DESC;
    `;
    return Response.json(rows);
  } catch (err) {
    console.error('[api/certificates]', err);
    return Response.json({ error: 'Failed to load certificates.' }, { status: 500 });
  }
}
