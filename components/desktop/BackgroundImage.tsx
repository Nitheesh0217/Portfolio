// components/desktop/BackgroundImage.tsx
// visionOS passthrough-style backdrop. Deep dark space with soft ambient
// light blooms. NO heavy color casts, NO dot grid — visionOS keeps the
// environment quiet so the glass panels are the star.
'use client';

import { memo } from 'react';

export const BackgroundImage = memo(function BackgroundImage() {
  return (
    <>
      {/* Layer 0: Premium light visionOS style background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/background.png"
        alt="passthrough background"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        style={{
          zIndex: 0,
          filter: 'blur(12px)',
          transform: 'scale(1.05)',
        }}
      />

      {/* Layer 1: Ambient light overlay to ensure glass UI readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)',
          mixBlendMode: 'overlay',
          zIndex: 1,
        }}
      />

      {/* Layer 2: Soft vignette for window depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.12) 100%)',
          zIndex: 2,
        }}
      />
    </>
  );
});
