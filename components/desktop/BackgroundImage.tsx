// components/desktop/BackgroundImage.tsx
// Flag background for the entire spatial UI
'use client';

import { memo } from 'react';

export const BackgroundImage = memo(function BackgroundImage() {
  return (
    <>
      {/* Flag Background Image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/flag-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: 0,
        }}
      />

      {/* Dark Overlay for Readability - Makes text stand out */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
          zIndex: 1,
        }}
      />

      {/* Subtle Vignette Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          zIndex: 2,
        }}
      />

      {/* Animated Gradient Overlay - Optional for color tone */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          zIndex: 3,
        }}
      />
    </>
  );
});
