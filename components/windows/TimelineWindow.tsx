// components/windows/TimelineWindow.tsx
// Chronological timeline of projects
'use client';

import { memo, useMemo } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import type { ProjectSummary } from '@/types/portfolio';

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export const TimelineWindow = memo(function TimelineWindow({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const sortedProjects = useMemo(() => {
    return [...projects]
      .filter((p) => p.built_at)
      .sort((a, b) => {
        const dateA = a.built_at ? new Date(a.built_at).getTime() : 0;
        const dateB = b.built_at ? new Date(b.built_at).getTime() : 0;
        return dateB - dateA;
      });
  }, [projects]);

  if (sortedProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[440px] gap-3 p-6">
        <Calendar className="w-8 h-8 text-white/10" />
        <p className="text-[11px] text-white/25 text-center">No timeline data available</p>
      </div>
    );
  }

  return (
    <div className="p-5 overflow-y-auto max-h-[440px]" style={{ scrollbarWidth: 'thin' }}>
      <div className="space-y-6">
        {sortedProjects.map((project, idx) => {
          const date = formatDate(project.built_at);
          const isFirst = idx === 0;
          const isLast = idx === sortedProjects.length - 1;

          return (
            <div key={project.id} className="relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-4 top-10 bottom-0 w-px bg-gradient-to-b from-violet-400/50 to-violet-400/0" />
              )}

              {/* Dot and content */}
              <div className="flex gap-4">
                {/* Timeline dot */}
                <div className="shrink-0 pt-1">
                  <div className="w-9 h-9 rounded-full border-2 border-violet-400/50 bg-violet-400/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[13px] font-bold text-white/90">{project.title}</h3>
                      {date && (
                        <p className="text-[11px] text-white/40 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {date}
                        </p>
                      )}
                    </div>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Subtitle and description */}
                  {project.subtitle && (
                    <p className="text-[11px] text-white/50 mt-1">{project.subtitle}</p>
                  )}

                  {/* Stack badges */}
                  {project.stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] px-2 py-1 rounded-md bg-violet-500/15 text-violet-300/80 border border-violet-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 4 && (
                        <span className="text-[9px] px-2 py-1 text-white/30">
                          +{project.stack.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* ROI */}
                  {project.roi_value && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-[10px] text-emerald-300/80">
                        <span className="font-bold">{project.roi_value}</span>
                        {project.roi_label && <span> — {project.roi_label}</span>}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
