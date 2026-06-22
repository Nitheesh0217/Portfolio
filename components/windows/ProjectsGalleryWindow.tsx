// components/windows/ProjectsGalleryWindow.tsx
// Visual Gallery Projects Window with Carousel
'use client';

import { memo, useState } from 'react';
import { GLASS_ENGINE } from '@/lib/glassEngine';
import { projects } from '@/data/projects';

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
      className={`absolute w-[800px] h-[680px] rounded-3xl overflow-hidden transition-all duration-300 ${
        isHovered ? GLASS_ENGINE.focused.combined : GLASS_ENGINE.inactive.combined
      }`}
      style={{
        top: '420px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content */}
      <div className="relative w-full h-full flex flex-col bg-gradient-to-br from-slate-900/40 to-slate-950/40">
        {/* Hero Section */}
        <div
          className="relative w-full h-72 bg-gradient-to-b from-violet-500/20 via-violet-500/5 to-transparent overflow-hidden transition-all duration-500"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.08))`,
          }}
        >
          {/* Project Hero Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="space-y-3">
              <h2 className="text-5xl font-black tracking-tighter text-white">
                {project.name}
              </h2>
              <p className="text-sm text-white/60">{project.description}</p>
            </div>
          </div>

          {/* ROI Receipt Badge */}
          <div
            className="absolute top-8 right-8 px-6 py-3 rounded-2xl backdrop-blur-xl bg-emerald-500/20 border border-emerald-400/50 text-sm font-mono font-bold text-emerald-300"
            style={{
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
            }}
          >
            📊 {project.impact}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Description & Metrics Section */}
        <div className="flex-1 px-8 py-6 overflow-y-auto space-y-6">
          {/* Description */}
          <div>
            <p className="text-sm leading-relaxed text-white/75">
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