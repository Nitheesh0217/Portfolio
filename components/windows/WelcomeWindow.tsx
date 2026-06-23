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
import { ArrowRight, Star } from 'lucide-react';

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
    <div className="w-[960px] flex flex-col select-none">

      {/* ─── BRAND WORDMARK ───────────────────────────────────────── */}
      <div className="flex items-center justify-center pt-4 pb-1">
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-sm rotate-45"
            style={{
              background: 'linear-gradient(135deg, #ffffff, #999999)',
              boxShadow: '0 0 8px rgba(255,255,255,0.15)',
            }}
          />
          <span className="text-[12.5px] font-bold tracking-tight text-white/90">D Web Studios</span>
        </div>
      </div>

      {/* ─── HERO ROW ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-[1.15fr_0.85fr_1fr] gap-10 px-12 pt-5 pb-7 items-center">

        {/* COLUMN 1 (Left): Headline & Status Badge */}
        <div className="flex flex-col gap-5">
          <h1
            className="text-white font-black leading-[0.92] tracking-[-0.035em] text-[42px] lg:text-[48px]"
            style={{ textShadow: '0 4px 16px rgba(0,0,0,0.35)' }}
          >
            Production<br />
            AI.<br />
            Honest data.<br />
            <span style={{ color: 'rgba(255,255,255,0.40)' }}>Always</span><br />
            <span style={{ color: 'rgba(255,255,255,0.40)' }}>shipped.</span>
          </h1>

          {/* Status badge */}
          <div className="flex items-center gap-2 self-start mt-1">
            <span className="relative inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <span className="text-[9.5px] font-bold tracking-wider text-emerald-400 uppercase">
              Open to work · STEM OPT · Miramar, FL
            </span>
          </div>
        </div>

        {/* COLUMN 2 (Center): Immersive Portrait Card */}
        <div className="relative flex flex-col items-center justify-center h-[290px]">
          <div
            className="relative w-[230px] h-[245px] rounded-[28px] overflow-hidden flex items-center justify-center pointer-events-none"
            style={{
              background: 'rgba(12, 12, 18, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: [
                '0 16px 36px rgba(0, 0, 0, 0.55)',
                'inset 0 1px 1px rgba(255, 255, 255, 0.06)',
              ].join(', '),
            }}
          >
            {!avatarError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/avatar.png"
                alt="Nitheesh Donepudi"
                className="w-full h-full object-cover object-[center_15%]"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-xl mb-2"
                  style={{
                    background: 'linear-gradient(135deg,#a78bfa,#3b82f6)',
                    boxShadow: '0 8px 24px rgba(124,58,237,0.40)',
                    letterSpacing: '-0.05em',
                  }}
                >
                  ND
                </div>
                <p className="text-[10px] text-white/40 font-mono">add /public/avatar.png</p>
              </div>
            )}

            {/* Inner bottom vignette to blend portrait shoulder line */}
            <div
              className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(12, 12, 18, 0.95), transparent)',
              }}
            />
          </div>

          {/* Floating Caption Badge */}
          <div
            className="absolute bottom-[10px] z-10 flex items-center justify-between px-3.5 py-2.5 rounded-[14px] w-[185px]"
            style={{
              background: 'rgba(10, 10, 15, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex flex-col gap-0.5">
              <div className="text-[7.5px] text-white/45 font-bold uppercase tracking-[0.12em] leading-none">Now Building</div>
              <div className="text-[10.5px] text-white font-bold tracking-tight leading-none">visionOS Portfolio</div>
            </div>
            <span
              className="text-[8.5px] font-bold text-emerald-300 px-1.5 py-0.5 rounded-full leading-none flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.15)', height: '18px' }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* COLUMN 3 (Right): Description Copy & Gold CTA */}
        <div className="flex flex-col gap-5">
          <p
            className="text-[13px] leading-[1.65] text-white/75 font-medium"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            I&rsquo;m <span className="text-white font-bold">Nitheesh Donepudi</span>, a full-stack &amp; data engineer.
            RAG pipelines, multi-agent orchestration, Snowflake ETL, real-time SaaS — I build the system, then I measure the receipts.
          </p>

          <button
            onClick={onOpenServices}
            className="group self-start inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold tracking-tight transition-all active:scale-95 hover:brightness-105"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#0e0d14',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            See My Work
            <ArrowRight className="w-4 h-4 text-[#0e0d14] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* ─── BOTTOM ROW — metadata strip ─────────────────────────── */}
      <div
        className="flex items-center justify-between px-12 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Left: Avatar row + names */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {VOUCHES.map((v) => (
              <div
                key={v.name}
                className="w-7 h-7 rounded-full border flex items-center justify-center text-[9px] font-bold text-white"
                style={{
                  background: v.gradient,
                  borderColor: 'rgba(12,12,18,0.95)',
                }}
              >
                {v.name.charAt(0)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2.5 text-[10.5px] text-white/50">
            {VOUCHES.map((v, i) => (
              <span key={v.name}>
                <span className="text-white/80 font-semibold">{v.name}</span>
                <span className="text-white/30 ml-1">{v.role}</span>
                {i < VOUCHES.length - 1 && <span className="text-white/15 ml-2.5">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Rating chip */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-0.5">
            <span className="text-[17px] font-black text-white leading-none">5.0</span>
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/80 font-bold tracking-tight leading-none">Trusted Engineer</span>
            <span className="text-[9px] text-white/40 leading-none mt-0.5">10+ peer endorsements</span>
          </div>
        </div>
      </div>
    </div>
  );
});
