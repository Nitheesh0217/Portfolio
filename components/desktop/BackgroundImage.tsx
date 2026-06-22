// components/desktop/BackgroundImage.tsx
// visionOS passthrough-style backdrop. Deep dark space with soft ambient
// light blooms. NO heavy color casts, NO dot grid — visionOS keeps the
// environment quiet so the glass panels are the star.
'use client';

import { memo } from 'react';

export const BackgroundImage = memo(function BackgroundImage() {
  return (
    <>
      {/* Layer 0: Deep, almost-black base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, #0c0c14 0%, #060609 70%, #030305 100%)',
          zIndex: 0,
        }}
      />

      {/* Layer 1: Soft warm-white bloom — top-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 1100, height: 1100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,240,220,0.08) 0%, transparent 60%)',
          top: '-25%', left: '-15%',
          filter: 'blur(60px)',
          zIndex: 1,
          animation: 'orbFloat1 22s ease-in-out infinite alternate',
        }}
      />

      {/* Layer 2: Cool blue bloom — bottom-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 1000, height: 1000,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,160,220,0.10) 0%, transparent 60%)',
          bottom: '-25%', right: '-15%',
          filter: 'blur(70px)',
          zIndex: 1,
          animation: 'orbFloat2 26s ease-in-out infinite alternate',
        }}
      />

      {/* Layer 3: Faint violet accent — top-right (very subtle) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155,130,210,0.06) 0%, transparent 60%)',
          top: '5%', right: '20%',
          filter: 'blur(80px)',
          zIndex: 1,
          animation: 'orbFloat1 30s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Layer 4: Faint warmth — bottom-left (visionOS room-glow feel) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,180,140,0.05) 0%, transparent 60%)',
          bottom: '10%', left: '10%',
          filter: 'blur(80px)',
          zIndex: 1,
          animation: 'orbFloat2 28s ease-in-out infinite alternate',
        }}
      />

      {/* Layer 5: Vignette for window depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
          zIndex: 2,
        }}
      />
    </>
  );
});
