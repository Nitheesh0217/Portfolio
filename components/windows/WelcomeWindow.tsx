// components/windows/WelcomeWindow.tsx
import { memo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface WelcomeWindowProps {
  onOpenServices: () => void;
}

export const WelcomeWindow = memo(function WelcomeWindow({ onOpenServices }: WelcomeWindowProps) {
  return (
    <div className="p-7 w-[420px] flex flex-col gap-6">
      {/* Avatar + name */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-violet-900/50 ring-2 ring-violet-500/30">
          <Image
            src="/avatar.jpg"
            alt="Nitheesh Donepudi"
            width={64}
            height={64}
            className="w-full h-full object-cover object-top"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-[24px] font-extrabold text-white leading-tight">
            Nitheesh Donepudi
          </h1>
          <p className="text-[13px] text-violet-300/90 font-semibold mt-1">
            Full-Stack AI Engineer · D Web Studios
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-400/80">Open to opportunities</span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="rounded-xl border border-violet-500/30 bg-violet-500/[0.1] p-5">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-violet-300" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-300/90">The Stack</span>
        </div>
        <p className="text-[13px] text-white/75 leading-relaxed font-medium">
          I ship production AI systems — RAG pipelines, multi-agent orchestration, real-time SaaS — then I measure the ROI.
          Everything in this portfolio has a receipt.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: '5+', label: 'Client Apps' },
          { value: '3yr', label: 'Enterprise AI' },
          { value: '3.6', label: 'M.S. CS GPA' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center py-4 rounded-xl border border-white/[0.12] bg-white/[0.05] hover:bg-white/[0.08] transition-colors">
            <span className="text-[26px] font-black text-white leading-none">{value}</span>
            <span className="text-[11px] text-white/50 mt-1.5 font-semibold uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onOpenServices}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-[13px] font-semibold transition-all"
        >
          <span>View Projects</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <a
          href="mailto:nitheeshd.17@gmail.com"
          className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-white/[0.10] hover:border-violet-500/30 text-white/55 hover:text-white text-[12px] transition-all"
        >
          nitheeshd.17@gmail.com
        </a>
      </div>

      <p className="text-[9px] text-white/15 text-center font-mono">
        Drag any window · Click Dock icons to toggle · ⌘W to close
      </p>
    </div>
  );
});
