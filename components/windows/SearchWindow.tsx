// components/windows/SearchWindow.tsx
// Global search across projects, certificates, skills
'use client';

import { memo, useState, useMemo } from 'react';
import { Search, X, Badge, Code2, Award } from 'lucide-react';
import type { ProjectSummary, Certificate, Metric } from '@/types/portfolio';
import { searchAll } from '@/lib/searchPortfolio';

const ICON_MAP = {
  project: <Code2 className="w-4 h-4" />,
  certificate: <Award className="w-4 h-4" />,
  skill: <Badge className="w-4 h-4" />,
  metric: <Badge className="w-4 h-4" />,
};

function ResultBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    project: 'bg-violet-500/20 text-violet-300',
    certificate: 'bg-amber-500/20 text-amber-300',
    skill: 'bg-emerald-500/20 text-emerald-300',
    metric: 'bg-sky-500/20 text-sky-300',
  };

  return (
    <span
      className={`text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded ${
        colors[type] || 'bg-white/10 text-white/60'
      }`}
    >
      {type}
    </span>
  );
}

export const SearchWindow = memo(function SearchWindow({
  projects,
  certificates,
  metrics,
}: {
  projects: ProjectSummary[];
  certificates: Certificate[];
  metrics: Metric[];
}) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    return searchAll(projects, certificates, metrics, query);
  }, [query, projects, certificates, metrics]);

  return (
    <div className="flex flex-col" style={{ width: '500px', height: '480px' }}>
      {/* Search Input */}
      <div className="shrink-0 border-b border-white/[0.06] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400/50 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, skills, certificates…"
            className="w-full pl-9 pr-3 py-2.5 bg-white/[0.05] border border-white/[0.08] focus:border-violet-500/40 rounded-xl text-[12px] text-white/80 placeholder:text-white/20 outline-none transition-colors"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.2) transparent' }}
      >
        {query.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
            <Search className="w-8 h-8 text-white/10" />
            <p className="text-[11px] text-white/25 text-center">
              Type to search across projects, skills, and certificates
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 p-6">
            <X className="w-8 h-8 text-white/10" />
            <p className="text-[11px] text-white/25">No results found</p>
            <p className="text-[10px] text-white/15">Try searching for a skill, project name, or issuer</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/40 mt-0.5">
                    {ICON_MAP[result.type as keyof typeof ICON_MAP]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[12px] font-semibold text-white/80 truncate">
                        {result.title}
                      </p>
                      <ResultBadge type={result.type} />
                    </div>
                    {result.subtitle && (
                      <p className="text-[11px] text-white/40 truncate">{result.subtitle}</p>
                    )}
                    <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-violet-600"
                        style={{ width: `${result.relevance * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.06] px-4 py-2 text-center">
        <p className="text-[9px] text-white/20 font-mono">
          {query.length > 0 && results.length > 0
            ? `${results.length} result${results.length !== 1 ? 's' : ''} found`
            : query.length > 0
            ? 'No results'
            : 'Ready to search'}
        </p>
      </div>
    </div>
  );
});
