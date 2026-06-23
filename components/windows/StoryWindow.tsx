// components/windows/StoryWindow.tsx
// My Story Narrative Window with Visual Layers
'use client';

import { memo, useState } from 'react';
import { GLASS_ENGINE } from '@/lib/glassEngine';

export const StoryWindow = memo(function StoryWindow() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`absolute w-[500px] rounded-3xl overflow-hidden transition-all duration-300 ${
        isHovered ? GLASS_ENGINE.focused.combined : GLASS_ENGINE.inactive.combined
      }`}
      style={{
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Background Layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/flag-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.3)',
          opacity: 0.4,
        }}
      />

      {/* Content Layer */}
      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter text-white">
            My Story
          </h2>
          <p className="text-sm text-violet-300/60 font-medium tracking-wide">
            SYSTEMS THINKER → FINANCIAL OUTCOMES → FULL-STACK
          </p>
        </div>

        {/* Narrative Text */}
        <div className="space-y-4 text-sm leading-relaxed text-white/75">
          <p>
            I don&apos;t just ship features. I ship <span className="text-violet-300 font-semibold">systems that don&apos;t break</span>.
          </p>
          <p>
            Every project starts with a question: <span className="text-violet-300 font-semibold">&ldquo;What does success look like?&rdquo;</span> Then I measure it. Always.
          </p>
          <p>
            RAG pipelines. Multi-agent orchestration. Real-time SaaS. Everything in this portfolio has a receipt—proof that it worked.
          </p>
        </div>

        {/* Signal Badge */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-xs font-semibold text-emerald-300 tracking-wide">
              AVAILABLE FOR SENIOR ROLES
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-500/30 to-blue-500/30 hover:from-violet-500/40 hover:to-blue-500/40 text-white font-semibold text-sm tracking-tight border border-white/20 hover:border-white/30 transition-all duration-300 active:scale-95"
        >
          Read Full Story →
        </button>
      </div>

      {/* Subtle Shimmer Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 3s infinite',
        }}
      />
    </div>
  );
});
