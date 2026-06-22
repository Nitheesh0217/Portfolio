// components/desktop/BackgroundImage.tsx
// Minimal static background — Ken Burns slow zoom + ambient orbs
'use client';

import { memo } from 'react';

export const BackgroundImage = memo(function BackgroundImage() {
  return (
    <>
      {/* ── Layer 0: Photo with Ken Burns slow zoom ── */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-8%',
            backgroundImage: 'url(/flag-background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.5) saturate(1.3)',
            animation: 'kenBurns 28s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* ── Layer 1: Deep base gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #07071a 0%, #0c0c28 50%, #070714 100%)',
          zIndex: 1,
          opacity: 0.72,
        }}
      />

      {/* ── Layer 2: Violet ambient orb — top-left, slow float ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 680, height: 680,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
          top: '-8%', left: '-4%',
          filter: 'blur(60px)',
          zIndex: 2,
          animation: 'orbFloat1 14s ease-in-out infinite alternate',
        }}
      />

      {/* ── Layer 2b: Blue ambient orb — bottom-right ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 560, height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.11) 0%, transparent 70%)',
          bottom: '-4%', right: '-4%',
          filter: 'blur(70px)',
          zIndex: 2,
          animation: 'orbFloat2 18s ease-in-out infinite alternate',
        }}
      />

      {/* ── Layer 3: Readability overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.48) 100%)',
          zIndex: 3,
        }}
      />

      {/* ── Layer 4: Dot grid — static, minimal ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.16) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.4,
          zIndex: 4,
        }}
      />

      {/* ── Layer 5: Edge vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.52) 100%)',
          zIndex: 5,
        }}
      />
    </>
  );
});
