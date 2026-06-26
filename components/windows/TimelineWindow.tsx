// components/windows/TimelineWindow.tsx
'use client';

import { memo, useMemo } from 'react';
import { Clock, ExternalLink, Zap } from 'lucide-react';
import type { ProjectSummary } from '@/types/portfolio';
import { TOKENS, accentBox } from '@/lib/designTokens';

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatYear(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).getFullYear().toString();
}

export const TimelineWindow = memo(function TimelineWindow({ projects }: { projects: ProjectSummary[] }) {
  const grouped = useMemo(() => {
    const sorted = [...projects]
      .filter((p) => p.built_at)
      .sort((a, b) => new Date(b.built_at!).getTime() - new Date(a.built_at!).getTime());

    const byYear: Record<string, ProjectSummary[]> = {};
    for (const p of sorted) {
      const yr = formatYear(p.built_at) ?? 'Unknown';
      if (!byYear[yr]) byYear[yr] = [];
      byYear[yr].push(p);
    }
    return Object.entries(byYear).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [projects]);

  if (grouped.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
        <Clock style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.10)' }} />
        <p className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
          No timeline data — set built_at on your projects.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-8 pt-7 pb-5 border-b"
        style={{ borderColor: TOKENS.border.base }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={accentBox(TOKENS.amber)}>
          <Clock style={{ width: 15, height: 15, color: TOKENS.amber }} />
        </div>
        <div>
          <h2 className="text-[15px] font-black text-white tracking-tight">Engineering Chronicle</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {projects.length} projects · {grouped.length} years
          </p>
        </div>
      </div>

      {/* Timeline body */}
      <div className="flex-1 overflow-y-auto px-8 py-7 min-h-0" style={{ scrollbarWidth: 'none' }}>
        <div className="relative">
          {/* Vertical spine */}
          <div
            className="absolute left-[17px] top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, rgba(167,139,250,0.40), rgba(167,139,250,0.05))' }}
          />

          <div className="flex flex-col gap-10">
            {grouped.map(([year, projs], groupIdx) => (
              <div key={year} className="flex flex-col gap-5">
                {/* Year marker */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center z-10"
                    style={{
                      background: groupIdx === 0
                        ? `linear-gradient(135deg, ${TOKENS.violet}40, ${TOKENS.violet}20)`
                        : 'rgba(255,255,255,0.04)',
                      border: `2px solid ${groupIdx === 0 ? TOKENS.violet : 'rgba(255,255,255,0.10)'}`,
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: groupIdx === 0 ? TOKENS.violet : 'rgba(255,255,255,0.25)' }}
                    />
                  </div>
                  <span
                    className="text-[26px] font-black tracking-tight"
                    style={{ color: groupIdx === 0 ? TOKENS.violet : 'rgba(255,255,255,0.18)' }}
                  >
                    {year}
                  </span>
                </div>

                {/* Project cards */}
                <div className="ml-[52px] flex flex-col gap-3">
                  {projs.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl p-4 flex flex-col gap-3 transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-[13px] font-black text-white leading-tight truncate"
                          >
                            {p.title}
                          </h3>
                          {formatDate(p.built_at) && (
                            <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>
                              {formatDate(p.built_at)}
                            </p>
                          )}
                        </div>
                        {p.live_url && (
                          <a
                            href={p.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                            style={{
                              background: 'rgba(251,191,36,0.08)',
                              border: '1px solid rgba(251,191,36,0.20)',
                              color: TOKENS.amber,
                            }}
                          >
                            <ExternalLink style={{ width: 10, height: 10 }} />
                            Live
                          </a>
                        )}
                      </div>

                      {/* Stack pills */}
                      {p.stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {p.stack.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md"
                              style={{
                                background: 'rgba(167,139,250,0.08)',
                                border: '1px solid rgba(167,139,250,0.18)',
                                color: 'rgba(167,139,250,0.80)',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                          {p.stack.length > 5 && (
                            <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                              +{p.stack.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      {/* ROI badge */}
                      {p.roi_value && (
                        <div
                          className="flex items-center gap-2 px-3 py-2 rounded-xl self-start"
                          style={{
                            background: 'rgba(52,211,153,0.07)',
                            border: '1px solid rgba(52,211,153,0.20)',
                          }}
                        >
                          <Zap style={{ width: 10, height: 10, color: TOKENS.emerald }} />
                          <span className="text-[10px] font-bold" style={{ color: TOKENS.emerald }}>
                            {p.roi_value}
                            {p.roi_label && <span className="font-normal opacity-70"> — {p.roi_label}</span>}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
