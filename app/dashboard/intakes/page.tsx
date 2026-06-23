import Link from 'next/link';
import { createDbClient } from '@/lib/dbClient';

interface IntakeRow {
  id: string;
  created_at: string;
  project_name: string;
  business_name: string | null;
  budget_range: string | null;
  client_name: string | null;
  client_email: string | null;
  ai_architecture: string | null;
}

export const dynamic = 'force-dynamic';

export default async function IntakesDashboard() {
  const sql = createDbClient();
  const intakes = (await sql`
    SELECT
      id,
      created_at,
      project_name,
      business_name,
      budget_range,
      client_name,
      client_email,
      ai_architecture
    FROM project_intakes
    ORDER BY created_at DESC
    LIMIT 50;
  `) as IntakeRow[];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">
              D Web Studios
            </p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Project Intakes</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {intakes.length} intake{intakes.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
          <Link
            href="/start-project"
            className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            + New Intake
          </Link>
        </div>

        {intakes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Desktop Table ──────────────────────────────────────────── */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800">
                    {['Date', 'Project', 'Business', 'Budget', 'Client', 'Email', 'AI Status'].map(
                      (col) => (
                        <th
                          key={col}
                          className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {intakes.map((intake, idx) => (
                    <tr
                      key={intake.id}
                      className={`border-b border-slate-800/50 transition hover:bg-slate-800/30 ${
                        idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'
                      }`}
                    >
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {formatDate(intake.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-100 max-w-[160px] truncate">
                        {intake.project_name}
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-[140px] truncate">
                        {intake.business_name ?? <Dash />}
                      </td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                        {intake.budget_range ?? <Dash />}
                      </td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                        {intake.client_name ?? <Dash />}
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-[180px] truncate">
                        {intake.client_email ?? <Dash />}
                      </td>
                      <td className="px-4 py-3">
                        <AIBadge hasAI={intake.ai_architecture !== null} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ───────────────────────────────────────────── */}
            <div className="md:hidden space-y-4">
              {intakes.map((intake) => (
                <div
                  key={intake.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{intake.project_name}</p>
                      {intake.business_name && (
                        <p className="text-slate-400 text-xs mt-0.5">{intake.business_name}</p>
                      )}
                    </div>
                    <AIBadge hasAI={intake.ai_architecture !== null} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                    <CardRow label="Date" value={formatDate(intake.created_at)} />
                    <CardRow label="Budget" value={intake.budget_range} />
                    <CardRow label="Client" value={intake.client_name} />
                    <CardRow label="Email" value={intake.client_email} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function AIBadge({ hasAI }: { hasAI: boolean }) {
  return hasAI ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
      AI Scoped
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
      Pending AI
    </span>
  );
}

function Dash() {
  return <span className="text-slate-600">—</span>;
}

function CardRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <span className="text-slate-600">{label}: </span>
      <span className="text-slate-300">{value ?? '—'}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-slate-600 text-5xl mb-4">💭</p>
      <h2 className="text-slate-400 font-medium text-lg">No intakes yet</h2>
      <p className="text-slate-600 text-sm mt-1">
        Submit your first intake via{' '}
        <Link href="/start-project" className="text-indigo-400 hover:underline">
          /start-project
        </Link>
        .
      </p>
    </div>
  );
}
