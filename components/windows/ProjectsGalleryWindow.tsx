// components/windows/ProjectsGalleryWindow.tsx
// Visual Gallery Projects Window with Carousel + Spatial Tablet Browser
'use client';

import { memo, useState } from 'react';
import { Lock } from 'lucide-react';
import { GLASS_ENGINE } from '@/lib/glassEngine';
import { projects } from '@/data/projects';

/** Strip protocol and trailing slash for display in the URL bar */
function cleanUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export const ProjectsGalleryWindow = memo(function ProjectsGalleryWindow() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const project = projects[selectedIndex];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div
      className={`absolute w-[860px] h-[760px] rounded-3xl overflow-hidden transition-all duration-300 ${
        isHovered ? GLASS_ENGINE.focused.combined : GLASS_ENGINE.inactive.combined
      }`}
      style={{
        top: '380px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content */}
      <div className="relative w-full h-full flex flex-col bg-gradient-to-br from-slate-900/40 to-slate-950/40">
        {/* ── Spatial Tablet Browser (replaces static hero) ── */}
        <div className="p-3 bg-black/40 backdrop-blur-3xl border border-white/10 border-t-white/20 border-l-white/20 rounded-[2rem] flex flex-col gap-2 shadow-2xl"
          style={{ height: '380px', flexShrink: 0 }}>

          {/* Browser Toolbar */}
          <div className="flex items-center gap-3 px-1">
            {/* Traffic-light dots (decorative) */}
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>

            {/* URL Bar */}
            <div className="flex-1 text-white/60 text-sm bg-black/40 px-4 py-1.5 rounded-full flex items-center gap-2 min-w-0">
              <Lock className="w-3 h-3 shrink-0 text-white/40" />
              <span className="truncate">{cleanUrl(project.liveUrl)}</span>
            </div>

            {/* Action Pills */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-md text-white/90 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border border-white/5"
              >
                Open Site ↗
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-md text-white/90 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border border-white/5"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          {/* Live iframe — fills remaining bezel space */}
          <iframe
            key={project.id}
            src={project.liveUrl}
            className="flex-1 w-full rounded-[1.25rem] bg-[#050505] border-none"
            style={{ animation: 'fade-in 0.5s ease-out' }}
            title={project.name}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Description & Metrics Section */}
        <div className="flex-1 px-8 py-5 overflow-y-auto space-y-4">
          {/* Project name + ROI badge */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white leading-tight">
                {project.name}
              </h2>
              <p className="text-xs text-white/50 mt-0.5">{project.description}</p>
            </div>
            <div
              className="shrink-0 px-4 py-2 rounded-2xl backdrop-blur-xl bg-emerald-500/20 border border-emerald-400/50 text-xs font-mono font-bold text-emerald-300 whitespace-nowrap"
              style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}
            >
              📊 {project.impact}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm leading-relaxed text-white/70">
              {project.longDescription}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/15 transition-all"
              >
                <div className="text-2xl font-black text-violet-300 mb-1">
                  {metric.value}
                </div>
                <div className="text-xs text-white/50 font-medium tracking-wide">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div>
            <p className="text-xs text-white/40 font-bold tracking-widest mb-3 uppercase">
              Technology Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30 hover:bg-violet-500/30 transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="border-t border-white/10 px-8 py-4 flex items-center justify-between bg-gradient-to-t from-slate-950/60 to-transparent">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white/70 hover:text-white transition-all flex items-center justify-center font-semibold"
          >
            ←
          </button>

          {/* Project Carousel */}
          <div className="flex-1 flex gap-3 mx-6 overflow-x-auto scrollbar-hide">
            {projects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => setSelectedIndex(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-semibold tracking-tight transition-all ${
                  idx === selectedIndex
                    ? 'bg-violet-500/40 text-white border border-violet-400/60 shadow-lg shadow-violet-500/20'
                    : 'bg-white/[0.05] text-white/60 border border-white/10 hover:bg-white/[0.1] hover:text-white'
                }`}
              >
                {proj.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white/70 hover:text-white transition-all flex items-center justify-center font-semibold"
          >
            →
          </button>
        </div>
      </div>

      {/* Ambient Shimmer */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});