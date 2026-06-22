// components/windows/WelcomeWindow.tsx
import { memo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface WelcomeWindowProps {
  onOpenServices: () => void;
}

export const WelcomeWindow = memo(function WelcomeWindow({ onOpenServices }: WelcomeWindowProps) {
  return (
    <div className="p-6 w-[360px] flex flex-col gap-5">
      {/* Avatar + name */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-violet-900/50 ring-2 ring-violet-500/30">
          <Image
            src="/avatar.jpg"
            alt="Nitheesh Donepudi"
            width={56}
            height={56}
            className="w-full h-full object-cover object-top"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-[20px] font-extrabold text-white leading-tight">
            Nitheesh Donepudi
          </h1>
          <p className="text-[12px] text-violet-300/80 font-medium mt-0.5">
            Full-Stack AI Engineer · D Web Studios
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400/70">Open to opportunities</span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-400/70">The Stack</span>
        </div>
        <p className="text-[12px] text-white/60 leading-relaxed">
          I ship production AI systems — RAG pipelines, multi-agent orchestration, real-time SaaS — then I measure the ROI.
          Everything in this portfolio has a receipt.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: '5+', label: 'Client Apps' },
          { value: '3yr', label: 'Enterprise AI' },
          { value: '3.6', label: 'M.S. CS GPA' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <span className="text-[22px] font-black text-white leading-none">{value}</span>
            <span className="text-[10px] text-white/35 mt-0.5 font-medium">{label}</span>
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
