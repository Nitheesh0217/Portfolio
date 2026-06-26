// components/windows/MetricsWindow.tsx
'use client';

import { memo } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';
import type { Metric, DataState } from '@/types/portfolio';
import { TOKENS, accentBox } from '@/lib/designTokens';

// Color rotation for metric cards — each card gets a distinct accent
const ACCENT_COLORS = [
  TOKENS.amber,
  TOKENS.emerald,
  TOKENS.violet,
  TOKENS.sky,
  '#f472b6', // pink
  TOKENS.amber,
];

export const MetricsWindow = memo(function MetricsWindow({
  metrics,
  dataState,
}: {
  metrics: Metric[];
  dataState: DataState;
}) {
  if (dataState.status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: `${TOKENS.amber}99`, animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    );
  }

  if (dataState.status === 'error') {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-xs font-mono text-center" style={{ color: 'rgba(251,113,133,0.60)' }}>
          {dataState.error}
        </p>
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
        <BarChart2 style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.10)' }} />
        <p className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
          No metrics yet — insert rows into the metrics table.
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
          <TrendingUp style={{ width: 15, height: 15, color: TOKENS.amber }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-black text-white tracking-tight">Impact Metrics</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {metrics.length} KPIs · all-time · production verified
          </p>
        </div>
        {/* Live indicator */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold"
          style={{ background: `${TOKENS.emerald}10`, border: `1px solid ${TOKENS.emerald}25`, color: TOKENS.emerald }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TOKENS.emerald }} />
          Verified
        </div>
      </div>

      {/* Metric grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0" style={{ scrollbarWidth: 'none' }}>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m, idx) => {
            const color = ACCENT_COLORS[idx % ACCENT_COLORS.length];
            return (
              <div
                key={m.id}
                className="relative p-5 rounded-2xl flex flex-col gap-2 overflow-hidden group transition-all"
                style={{
                  background: `linear-gradient(135deg, ${color}06, rgba(255,255,255,0.01))`,
                  border: `1px solid ${color}20`,
                }}
              >
                {/* Subtle glow accent in corner */}
                <div
                  className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity"
                  style={{ background: color }}
                />

                {/* Value */}
                <div className="flex items-baseline gap-1 relative">
                  <span
                    className="font-black leading-none tracking-tight"
                    style={{ fontSize: 36, color }}
                  >
                    {m.display_value ?? m.value.toLocaleString()}
                  </span>
                  {m.unit !== 'count' && !String(m.display_value).includes(m.unit) && (
                    <span className="text-[18px] font-black" style={{ color: `${color}60` }}>
                      {m.unit}
                    </span>
                  )}
                </div>

                {/* Label */}
                <p className="text-[12px] font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {m.label}
                </p>

                {/* Context */}
                {m.context && (
                  <p className="text-[9.5px] leading-snug font-mono" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    {m.context}
                  </p>
                )}

                {/* Bottom color bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
                  style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
