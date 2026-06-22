// components/windows/WelcomeWindow.tsx
// Exact layout match to the Dotdive reference, repurposed as Nitheesh's portfolio.
// Layout map (matches reference):
//   [browser chrome]
//   ──────────────────────────────────────────────────
//   [brand wordmark — centered, small]
//
//   [HUGE HEADING]                [paragraph copy]
//   [3 lines, left half]          [gold CTA]
//                                 [photo of Nitheesh]
//
//   [avatar row]    [5.0 ★ Trusted Engineer chip]
'use client';

import { memo, useState } from 'react';
import {
  ArrowRight, Star, Lock, RotateCw, ChevronLeft, ChevronRight,
  Share, Plus, Cast,
} from 'lucide-react';

export interface WelcomeWindowProps {
  onOpenServices: () => void;
}

// Hardcoded vouches (replace with real ones)
const VOUCHES = [
  { name: 'Naren A.',  role: 'PM',  gradient: 'linear-gradient(135deg,#a78bfa,#6d28d9)' },
  { name: 'Mike C.',   role: 'CTO', gradient: 'linear-gradient(135deg,#60a5fa,#1e40af)' },
  { name: 'Will H.',   role: 'Eng', gradient: 'linear-gradient(135deg,#f472b6,#9d174d)' },
];

export const WelcomeWindow = memo(function WelcomeWindow({ onOpenServices }: WelcomeWindowProps) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="w-[960px] flex flex-col">

      {/* ─── BROWSER CHROME ───────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="flex items-center gap-1.5 text-white/45">
          <div className="grid grid-cols-2 gap-[2px] w-3.5 h-3.5">
            {[0,1,2,3].map(i => <div key={i} className="bg-white/45 rounded-[1px]" />)}
          </div>
          <div className="w-3.5 h-3.5 border border-white/45 rounded-[2px]" />
        </div>
        <div className="flex items-center gap-1 text-white/45">
          <ChevronLeft className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full"
             style={{ background: 'rgba(255,255,255,0.06)' }}>
          <Lock className="w-3 h-3 text-white/40" />
          <span className="text-[12px] text-white/70 tracking-tight">www.nitheesh.dev</span>
          <RotateCw className="w-3 h-3 ml-auto text-white/40" />
        </div>
        <div className="flex items-center gap-2 text-white/45">
          <Share className="w-4 h-4" />
          <Plus  className="w-4 h-4" />
          <Cast  className="w-4 h-4" />
        </div>
      </div>

      {/* ─── BRAND WORDMARK ───────────────────────────────────────── */}
      <div className="flex items-center justify-center pt-5 pb-1">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm rotate-45"
            style={{ background: 'linear-gradient(135deg,#fff,#999)' }}
          />
          <span className="text-[14px] font-bold tracking-tight text-white">D Web Studios</span>
        </div>
      </div>

      {/* ─── HERO ROW ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-[1.1fr_1fr] gap-8 px-12 pt-6 pb-8 items-start">

        {/* LEFT — huge headline */}
        <div className="flex flex-col gap-6 pt-4">
          <h1
            className="text-white font-black leading-[0.96] tracking-[-0.035em]"
            style={{ fontSize: 'clamp(46px, 5.4vw, 64px)' }}
          >
            Production AI.<br />
            Honest data.<br />
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Always shipped.</span>
          </h1>

          {/* Status badge — sits under the headline like Dotdive's left side */}
          <div className="flex items-center gap-2">
            <span className="relative inline-flex">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-emerald-300 uppercase">
              Open to work · STEM OPT · Miramar, FL
            </span>
          </div>
        </div>

        {/* RIGHT — copy + CTA + photo (matches the Dotdive right-stack) */}
        <div className="flex flex-col gap-5 pt-2">

          {/* Short paragraph (replaces "Stay in style..." copy) */}
          <p className="text-[14px] leading-[1.55] text-white/70 max-w-sm">
            I'm <span className="text-white font-semibold">Nitheesh Donepudi</span>, a full-stack &amp; data engineer.
            RAG pipelines, multi-agent orchestration, Snowflake ETL, real-time SaaS — I build the system,
            then I measure the receipts.
          </p>

          {/* Gold CTA — exactly Dotdive's "Shop Collection" treatment */}
          <button
            onClick={onOpenServices}
            className="group self-start inline-flex items-center gap-2 px-7 py-3 rounded-full text-[13px] font-bold tracking-tight transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%)',
              color: '#1f1300',
              boxShadow: '0 8px 24px rgba(251,191,36,0.30), inset 0 1px 0 rgba(255,255,255,0.30)',
            }}
          >
            See My Work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Photo card — the model in the reference */}
          <div className="relative mt-2">
            <div
              className="w-full h-[200px] overflow-hidden rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.30), rgba(30,58,138,0.30))',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 12px 32px rgba(0,0,0,0.40)',
              }}
            >
              {!avatarError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/avatar.jpg"
                  alt="Nitheesh Donepudi"
                  className="w-full h-full object-cover object-center"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                // Stylish placeholder until /public/avatar.jpg is added
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center font-black text-white text-3xl mb-3"
                    style={{
                      background: 'linear-gradient(135deg,#a78bfa,#3b82f6)',
                      boxShadow: '0 8px 24px rgba(124,58,237,0.40)',
                      letterSpacing: '-0.05em',
                    }}
                  >
                    ND
                  </div>
                  <p className="text-[10px] text-white/40 font-mono">add /public/avatar.jpg</p>
                </div>
              )}
            </div>

            {/* Floating "Now Building" chip on the photo */}
            <div
              className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl"
              style={{
                background: 'rgba(0,0,0,0.60)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <div>
                <div className="text-[9px] text-white/55 font-semibold uppercase tracking-[0.18em]">Now Building</div>
                <div className="text-[12px] text-white font-bold tracking-tight">visionOS Portfolio</div>
              </div>
              <span
                className="text-[9px] font-bold text-emerald-300 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.18)' }}
              >
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM ROW — vouches + rating chip ───────────────────── */}
      <div
        className="flex items-center justify-between px-12 py-5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Avatar row + names (Dotdive's customer-row equivalent) */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            {VOUCHES.map((v) => (
              <div
                key={v.name}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white"
                style={{
                  background: v.gradient,
                  borderColor: 'rgba(8,6,20,0.85)',
                }}
              >
                {v.name.charAt(0)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-white/55">
            {VOUCHES.map((v, i) => (
              <span key={v.name}>
                <span className="text-white/85 font-semibold">{v.name}</span>
                <span className="text-white/35 ml-1">{v.role}</span>
                {i < VOUCHES.length - 1 && <span className="text-white/20 ml-3">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Rating chip — Dotdive's "5.0 ★ Trusted Brand" */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[20px] font-black text-white leading-none">5.0</span>
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-white font-bold tracking-tight">Trusted Engineer</span>
            <span className="text-[10px] text-white/45">10+ peer endorsements</span>
          </div>
        </div>
      </div>
    </div>
  );
});
