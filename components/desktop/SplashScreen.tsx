// components/desktop/SplashScreen.tsx
// Apple Vision Pro cinematic opening scene — floating glass panel in deep space
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [phase, setPhase] = useState<'init' | 'panel' | 'ready'>('init');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('panel'), 600);
    const t2 = setTimeout(() => setPhase('ready'), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ── Room background: deep space with ambient depth ── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse at 50% 35%, #0e0b1f 0%, #080613 50%, #020208 100%)',
          ].join(', '),
        }}
      />

      {/* Ambient orbs — slow drift, very low opacity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Violet orb — top-left */}
        <div
          className="absolute"
          style={{
            width: 1000, height: 1000, top: '-250px', left: '-200px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 65%)',
            filter: 'blur(100px)',
            animation: 'orbFloat1 20s ease-in-out infinite alternate',
          }}
        />
        {/* Blue orb — bottom-right */}
        <div
          className="absolute"
          style={{
            width: 900, height: 900, bottom: '-200px', right: '-180px',
            background: 'radial-gradient(circle, rgba(30,64,175,0.16) 0%, transparent 65%)',
            filter: 'blur(110px)',
            animation: 'orbFloat2 24s ease-in-out infinite alternate',
          }}
        />
        {/* Fuchsia accent — top-right */}
        <div
          className="absolute"
          style={{
            width: 700, height: 700, top: '5%', right: '10%',
            background: 'radial-gradient(circle, rgba(217,70,239,0.10) 0%, transparent 65%)',
            filter: 'blur(90px)',
            animation: 'orbFloat2 18s ease-in-out infinite alternate-reverse',
          }}
        />
        {/* Cyan center hint */}
        <div
          className="absolute"
          style={{
            width: 600, height: 600, top: '40%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 60%)',
            filter: 'blur(100px)',
            animation: 'orbFloat1 28s ease-in-out infinite alternate-reverse',
          }}
        />
      </div>

      {/* Fine dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floor reflection glow — simulates ambient light from the panel */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '900px', height: '220px',
          background: 'radial-gradient(ellipse at center top, rgba(139,92,246,0.14) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Edge vignette for cinema depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.80) 100%)',
        }}
      />

      {/* ── Floating Vision Pro glass panel ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.84, y: 36 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: 0.25,
          duration: 1.0,
          ease: [0.34, 1.30, 0.64, 1],
        }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Glass card */}
        <div
          style={{
            width: '440px',
            background: 'rgba(10,8,26,0.75)',
            backdropFilter: 'blur(50px) saturate(180%)',
            WebkitBackdropFilter: 'blur(50px) saturate(180%)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: [
              '0 0 0 1px rgba(139,92,246,0.18)',
              '0 40px 100px rgba(0,0,0,0.85)',
              '0 0 80px rgba(139,92,246,0.10)',
              'inset 0 1px 0 rgba(255,255,255,0.08)',
            ].join(', '),
            padding: '44px 40px 36px',
          }}
        >
          {/* DWS OS label chip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex justify-center mb-7"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.28)',
              }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-violet-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.20em]"
                style={{ color: 'rgba(167,139,250,0.85)' }}
              >
                DWS OS v2.0
              </span>
            </div>
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.70, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex justify-center mb-5"
          >
            <div
              style={{
                width: 100, height: 100, borderRadius: '26px', overflow: 'hidden',
                boxShadow: [
                  '0 0 0 2.5px rgba(139,92,246,0.40)',
                  '0 0 0 5px rgba(139,92,246,0.10)',
                  '0 12px 40px rgba(0,0,0,0.70)',
                ].join(', '),
                position: 'relative',
              }}
            >
              {!avatarError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/avatar.jpg"
                  alt="Nitheesh Donepudi"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center top',
                  }}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                /* Gradient initials fallback */
                <div
                  style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '30px', fontWeight: 800, color: 'white',
                    letterSpacing: '-0.02em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
                  }}
                >
                  ND
                </div>
              )}
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="text-center mb-1"
            style={{
              fontSize: '28px', fontWeight: 800, color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-0.03em', lineHeight: 1.1,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif',
            }}
          >
            Nitheesh Donepudi
          </motion.h1>

          {/* Title + availability */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            className="text-center mb-7"
          >
            <p
              className="font-semibold"
              style={{ color: 'rgba(167,139,250,0.85)', fontSize: '13px', letterSpacing: '0.01em' }}
            >
              Full-Stack AI Engineer · D Web Studios
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span style={{ color: 'rgba(52,211,153,0.75)', fontSize: '11px', fontWeight: 600 }}>
                Open to opportunities
              </span>
            </div>
          </motion.div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }} />

          {/* Enter button — fades in when ready */}
          <AnimatePresence>
            {phase === 'ready' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <motion.button
                  onClick={onEnter}
                  className="w-full flex items-center justify-center gap-2.5 font-semibold text-white"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.92) 0%, rgba(109,40,217,0.92) 100%)',
                    borderRadius: '14px',
                    padding: '14px 24px',
                    fontSize: '14px',
                    boxShadow: '0 0 0 1px rgba(124,58,237,0.5), 0 8px 28px rgba(124,58,237,0.35)',
                    border: 'none', cursor: 'pointer',
                    transition: 'box-shadow 200ms, transform 100ms',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 0 1px rgba(124,58,237,0.7), 0 12px 36px rgba(124,58,237,0.5)' as never }}
                  whileTap={{ scale: 0.97 }}
                >
                  Enter Portfolio
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7h10M7 2l5 5-5 5" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading dots — visible until ready */}
          <AnimatePresence>
            {phase !== 'ready' && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-1.5 py-3"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 1.1, delay: i * 0.22, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Panel reflection glow on "floor" */}
        <div
          style={{
            width: '340px', height: '20px', marginTop: '6px',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.28) 0%, transparent 70%)',
            filter: 'blur(14px)',
          }}
        />
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-5 text-center font-mono"
        style={{ fontSize: '11px', color: 'white', letterSpacing: '0.06em' }}
      >
        Spatial UI Engine · {new Date().getFullYear()}
      </motion.p>
    </motion.div>
  );
}
