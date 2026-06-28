export const dynamic = 'force-dynamic';

// Static fallback certificates — shown when DATABASE_URL is not configured
const STATIC_CERTIFICATES = [
  {
    id: 1, title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services',
    issuer_logo_url: null, category: 'Cloud',
    credential_url: 'https://aws.amazon.com/certification/', badge_url: null,
    issued_at: '2023-06-01', expires_at: null, credential_id: null,
    roi_proof: 'Cloud infrastructure design at enterprise scale', created_at: '2023-06-01',
  },
  {
    id: 2, title: 'Google Professional ML Engineer', issuer: 'Google Cloud',
    issuer_logo_url: null, category: 'AI/ML',
    credential_url: 'https://cloud.google.com/certification/machine-learning-engineer', badge_url: null,
    issued_at: '2023-09-01', expires_at: null, credential_id: null,
    roi_proof: 'ML pipelines for production AI systems', created_at: '2023-09-01',
  },
  {
    id: 3, title: 'Full Stack Web Development', issuer: 'freeCodeCamp',
    issuer_logo_url: null, category: 'Web Dev',
    credential_url: 'https://www.freecodecamp.org/', badge_url: null,
    issued_at: '2022-03-01', expires_at: null, credential_id: null,
    roi_proof: 'React, Node.js, and database fundamentals', created_at: '2022-03-01',
  },
];

export async function GET(): Promise<Response> {
  // ── 1. No DATABASE_URL → serve static fallback ──
  if (!process.env.DATABASE_URL) {
    console.warn('[api/certificates] DATABASE_URL not set — serving static fallback');
    return Response.json(STATIC_CERTIFICATES);
  }

  // ── 2. Try live database ──
  try {
    const { getDb } = await import('@/lib/db');
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
    // ── 3. DB error → static fallback ──
    console.error('[api/certificates] DB error — serving static fallback:', err);
    return Response.json(STATIC_CERTIFICATES);
  }
}
