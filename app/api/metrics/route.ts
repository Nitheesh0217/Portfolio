export const dynamic = 'force-dynamic';

// Static fallback metrics — shown when DATABASE_URL is not configured
const STATIC_METRICS = [
  { id: 1, label: 'Projects Shipped', value: 6,  display_value: '6',    unit: null, context: 'Full-stack production apps',     icon: '🚀', period: 'all-time', display_order: 1 },
  { id: 2, label: 'Years Experience', value: 4,  display_value: '4+',   unit: 'yrs', context: 'AI/ML & full-stack engineering', icon: '⚡', period: 'all-time', display_order: 2 },
  { id: 3, label: 'Uptime SLA',       value: 99, display_value: '99.9%', unit: '%',  context: 'Across all production services',  icon: '📡', period: 'all-time', display_order: 3 },
  { id: 4, label: 'SaaS Cost Saved',  value: 2400, display_value: '$2.4k/yr', unit: null, context: 'Custom infra vs off-shelf SaaS', icon: '💰', period: 'all-time', display_order: 4 },
];

export async function GET(): Promise<Response> {
  // ── 1. No DATABASE_URL → serve static fallback ──
  if (!process.env.DATABASE_URL) {
    console.warn('[api/metrics] DATABASE_URL not set — serving static fallback');
    return Response.json(STATIC_METRICS);
  }

  // ── 2. Try live database ──
  try {
    const { getDb } = await import('@/lib/db');
    const sql = getDb();
    const rows = await sql`
      SELECT id, label, value, display_value, unit, context, icon, period, display_order
      FROM metrics
      WHERE period = 'all-time'
      ORDER BY display_order ASC NULLS LAST;
    `;
    return Response.json(rows);
  } catch (err) {
    // ── 3. DB error → static fallback ──
    console.error('[api/metrics] DB error — serving static fallback:', err);
    return Response.json(STATIC_METRICS);
  }
}
