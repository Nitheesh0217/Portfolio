// components/windows/WelcomeWindow.tsx
// Container C: the Main Canvas.
// Refactored to implement the 3D Hero Overlap Effect with strict layering.
'use client';

import { memo, useState } from 'react';
import { ArrowRight, Star, Cpu, Database, Sparkles, Zap } from 'lucide-react';

export interface WelcomeWindowProps {
  onOpenServices: () => void;
  onStartProject?: () => void;
}

const PROJECT_CARDS = [
  {
    label: 'Agentic AI',
    icon: Sparkles,
    bg: 'linear-gradient(135deg, rgba(167,139,250,0.55), rgba(109,40,217,0.40))',
    ring: 'rgba(167,139,250,0.45)',
  },
  {
    label: 'Data Pipelines',
    icon: Database,
    bg: 'linear-gradient(135deg, rgba(96,165,250,0.55), rgba(30,64,175,0.40))',
    ring: 'rgba(96,165,250,0.45)',
  },
  {
    label: 'visionOS',
    icon: Cpu,
    bg: 'linear-gradient(135deg, rgba(251,191,36,0.55), rgba(180,83,9,0.40))',
    ring: 'rgba(251,191,36,0.45)',
  },
];

const AVATARS = [
  'linear-gradient(135deg,#a78bfa,#6d28d9)',
  'linear-gradient(135deg,#60a5fa,#1e40af)',
  'linear-gradient(135deg,#f472b6,#9d174d)',
  'linear-gradient(135deg,#fbbf24,#b45309)',
];

export const WelcomeWindow = memo(function WelcomeWindow({ onOpenServices, onStartProject }: WelcomeWindowProps) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="w-full h-full p-16 md:p-20 flex flex-col justify-between relative overflow-visible">
      {/* Layer 1: Background Text & UI (z-0) */}
      <div className="relative z-0 w-full h-full flex flex-col justify-between pointer-events-none">

        {/* Middle — Left/Right Typography grid */}
        <div className="relative z-20 grid grid-cols-2 gap-16 w-full items-center flex-1 my-auto">
          
          {/* Left Side Typography */}
          <div className="flex flex-col gap-6 pointer-events-auto">
            <h1
              className="text-white font-black leading-[0.95] tracking-[-0.038em]"
              style={{
                fontSize: 'clamp(38px, 3.8vw, 54px)',
                textShadow: '0 4px 24px rgba(0,0,0,0.55)',
              }}
            >
              AI Engineering.<br />
              Production data.<br />
              <span className="text-white/40">Always shipped.</span>
            </h1>

            <div className="flex items-center gap-2 self-start">
              <span className="relative inline-flex">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </span>
              <span className="text-[10px] font-bold tracking-[0.16em] text-emerald-400 uppercase">
                Open to work · STEM OPT · Miramar, FL
              </span>
            </div>
          </div>

          {/* Right Side Typography */}
          <div className="flex flex-col gap-7 items-end text-right pointer-events-auto">
            <p
              className="text-[14px] leading-[1.65] text-white/80 font-medium text-left max-w-[360px]"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.50)' }}
            >
              I&rsquo;m <span className="text-white font-bold">Nitheesh Donepudi</span>, a full-stack &amp; data engineer.
              RAG pipelines, multi-agent orchestration, Snowflake ETL, real-time SaaS — I build the system,
              then I measure the receipts.
            </p>

            <div className="flex flex-col gap-2.5 items-end self-end">
              <button
                onClick={onStartProject}
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-full text-[14px] font-bold tracking-tight transition-all active:scale-95 hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1a1100',
                  boxShadow: '0 12px 32px rgba(245,158,11,0.45), inset 0 1px 0 rgba(255,255,255,0.40)',
                }}
              >
                <Zap className="w-4 h-4" />
                Start a Project
              </button>
              <button
                onClick={onOpenServices}
                className="group inline-flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold tracking-tight transition-all active:scale-95 text-white/60 hover:text-white/90"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                See My Work
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom — Pinned project cards (Left) and Trusted Engineer card (Right) */}
        <div className="flex justify-between items-end w-full mt-auto pt-4">
          
          {/* Bottom Left UI: Project cards (z-[2] to ensure hover works) */}
          <div className="flex items-end gap-3.5 pointer-events-auto z-[2] relative">
            {PROJECT_CARDS.map(({ label, icon: Icon, bg, ring }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className="w-[92px] h-[92px] rounded-[24px] flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                  style={{
                    background: bg,
                    border: `1px solid ${ring}`,
                    boxShadow: '0 12px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.25)',
                  }}
                >
                  <Icon className="w-9 h-9 text-white" strokeWidth={2} />
                </div>
                <span className="text-[10.5px] font-semibold text-white/70 tracking-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Right UI: Trusted Engineer card */}
          <div
            className="flex items-center gap-4 px-5 py-3 rounded-2xl pointer-events-auto z-[2] relative"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[22px] font-black text-white leading-none">5.0</span>
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              </div>
              <div className="text-[10px] font-bold text-white/85 tracking-tight mt-0.5">
                Trusted Engineer
              </div>
              <div className="text-[9px] text-white/50 mt-0.5">
                Customer Reviews
              </div>
            </div>

            <div className="flex -space-x-2.5">
              {AVATARS.map((bg, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2"
                  style={{
                    background: bg,
                    borderColor: 'rgba(5,5,5,0.95)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Layer 2: 3D Floating Hero Image (z-10 or higher) */}
      <div className="absolute inset-0 flex justify-center items-end pointer-events-none z-10 overflow-visible">
        {!avatarError ? (
          <div
            className="relative h-[98%] w-auto flex items-end pointer-events-none select-none overflow-visible"
            style={{
              bottom: '-12px',
              maskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 68%)',
              WebkitMaskImage: '-webkit-radial-gradient(50% 45%, ellipse, black 20%, transparent 68%)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.png"
              alt="Nitheesh Donepudi"
              onError={() => setAvatarError(true)}
              className="h-full w-auto object-contain select-none pointer-events-none"
              style={{
                mixBlendMode: 'lighten',
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pointer-events-auto">
            <div
              className="w-72 h-72 rounded-full flex items-center justify-center font-black text-white"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #3b82f6)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.65), inset 0 2px 0 rgba(255,255,255,0.30)',
                letterSpacing: '-0.05em',
                fontSize: '120px',
              }}
            >
              ND
            </div>
            <p className="mt-3 text-[9px] text-white/35 font-mono tracking-wide">
              drop /public/avatar.png (transparent PNG)
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
