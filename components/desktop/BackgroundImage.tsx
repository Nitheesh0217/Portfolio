// components/desktop/BackgroundImage.tsx
// visionOS Deep Space Canvas - glassmorphic ambient backdrop
'use client';

import { memo } from 'react';

export const BackgroundImage = memo(function BackgroundImage() {
  return (
    <>
      {/* ── Layer 0: Deep space base ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #0a0a1f 0%, #050510 60%, #03030a 100%)',
          zIndex: 0,
        }}
      />

      {/* ── Layer 1: Violet ambient orb — top-left ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 900, height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
          top: '-15%', left: '-10%',
          filter: 'blur(80px)',
          zIndex: 1,
          animation: 'orbFloat1 18s ease-in-out infinite alternate',
        }}
      />

      {/* ── Layer 2: Blue ambient orb — bottom-right ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 800, height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)',
          bottom: '-15%', right: '-10%',
          filter: 'blur(90px)',
          zIndex: 1,
          animation: 'orbFloat2 22s ease-in-out infinite alternate',
        }}
      />

      {/* ── Layer 3: Cyan accent orb — center ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 60%)',
          top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(100px)',
          zIndex: 1,
          animation: 'orbFloat1 26s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* ── Layer 4: Fuchsia spark — top-right ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,70,239,0.12) 0%, transparent 60%)',
          top: '10%', right: '15%',
          filter: 'blur(80px)',
          zIndex: 1,
          animation: 'orbFloat2 20s ease-in-out infinite alternate',
        }}
      />

      {/* ── Layer 5: Fine dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.5,
          zIndex: 2,
        }}
      />

      {/* ── Layer 6: Edge vignette for depth ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
          zIndex: 3,
        }}
      />
    </>
  );
});
