// components/windows/SearchWindow.tsx
'use client';

import { memo, useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Layers, Award, Tag, BarChart2 } from 'lucide-react';
import type { ProjectSummary, Certificate, Metric } from '@/types/portfolio';
import { searchAll } from '@/lib/searchPortfolio';
import { TOKENS, accentBox } from '@/lib/designTokens';

const TYPE_CONFIG = {
  project:     { label: 'Project',     color: TOKENS.violet,  Icon: Layers  },
  certificate: { label: 'Credential',  color: TOKENS.amber,   Icon: Award   },
  skill:       { label: 'Skill',       color: TOKENS.emerald, Icon: Tag     },
  metric:      { label: 'Metric',      color: TOKENS.sky,     Icon: BarChart2 },
} as const;

export const SearchWindow = memo(function SearchWindow({
  projects, certificates, metrics,
}: {
  projects: ProjectSummary[];
  certificates: Certificate[];
  metrics: Metric[];
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => searchAll(projects, certificates, metrics, query), [query, projects, certificates, metrics]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div
        className="shrink-0 px-8 pt-7 pb-5 border-b"
        style={{ borderColor: TOKENS.border.base }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={accentBox(TOKENS.sky)}>
            <Search style={{ width: 15, height: 15, color: TOKENS.sky }} />
          </div>
          <div>
            <h2 className="text-[15px] font-black text-white tracking-tight">Global Search</h2>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Projects · Skills · Credentials · Metrics
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.25)' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything…"
            className="w-full pl-10 pr-10 py-3 rounded-xl text-[13px] text-white/80 placeholder:text-white/20 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${query ? 'rgba(56,189,248,0.35)' : 'rgba(255,255,255,0.08)'}`,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.50)' }}
            >
              <X style={{ width: 11, height: 11 }} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'none' }}>
        {query.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Search style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.12)' }} />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>Start typing to search</p>
              <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.20)' }}>
                Search across {projects.length} projects, skills, certs and metrics
              </p>
            </div>
            {/* Quick hint pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['Next.js', 'AI', 'PostgreSQL', 'AWS', 'Python'].map((hint) => (
                <button
                  key={hint}
                  onClick={() => setQuery(hint)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.40)',
                  }}
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <X style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.12)' }} />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>No results for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.20)' }}>Try a different keyword or skill name</p>
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 flex flex-col gap-1">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] px-4 pb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.map((result) => {
              const cfg = TYPE_CONFIG[result.type as keyof typeof TYPE_CONFIG];
              const { Icon, color } = cfg ?? { Icon: Tag, color: TOKENS.violet };
              return (
                <div
                  key={`${result.type}-${result.id}`}
                  className="flex items-start gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer group"
                  style={{ background: 'rgba(255,255,255,0.00)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.00)')}
                >
                  {/* Icon */}
                  <div
                    className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                  >
                    <Icon style={{ width: 14, height: 14, color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[12px] font-bold text-white/85 truncate">{result.title}</p>
                      <span
                        className="shrink-0 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: `${color}15`, color }}
                      >
                        {cfg?.label ?? result.type}
                      </span>
                    </div>
                    {result.subtitle && (
                      <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>{result.subtitle}</p>
                    )}
                    {/* Relevance bar */}
                    <div className="mt-1.5 h-[2px] w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${result.relevance * 100}%`, background: `linear-gradient(90deg, ${color}60, ${color})` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="shrink-0 flex items-center justify-center px-8 py-3 border-t"
        style={{ borderColor: TOKENS.border.base }}
      >
        <p className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.18)' }}>
          ↵ Enter to search · ESC to clear
        </p>
      </div>
    </div>
  );
});
