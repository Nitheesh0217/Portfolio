// components/desktop/VisionBrowserBar.tsx
// Apple Vision Pro-style floating browser bar — floating pill at top center
'use client';

import { motion } from 'framer-motion';
import { Lock, RotateCw, Share2, Plus, ArrowLeft, ArrowRight, LayoutGrid, AppWindow } from 'lucide-react';

export function VisionBrowserBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-3 select-none"
      style={{
        width: '680px',
        padding: '9px 18px',
        background: 'rgba(0,0,0,0.62)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        borderRadius: '9999px',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 4px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Left: Tab/window icons + nav arrows */}
      <div className="flex items-center gap-1.5 shrink-0">
        <BarButton icon={<LayoutGrid className="w-3.5 h-3.5" />} />
        <BarButton icon={<AppWindow className="w-3.5 h-3.5" />} />
        <div className="w-px h-3.5 mx-1" style={{ background: 'rgba(255,255,255,0.10)' }} />
        <BarButton icon={<ArrowLeft className="w-3.5 h-3.5" />} disabled />
        <BarButton icon={<ArrowRight className="w-3.5 h-3.5" />} disabled />
      </div>

      {/* Center: URL pill */}
      <div
        className="flex-1 flex items-center gap-2 px-4 py-1.5 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.055)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Lock className="w-3 h-3 shrink-0" style={{ color: 'rgba(255,255,255,0.28)' }} />
        <span
          className="flex-1 text-center font-medium"
          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.52)', letterSpacing: '0.005em' }}
        >
          dwebstudios.com
        </span>
        <button
          className="shrink-0 transition-all hover:scale-110"
          style={{ color: 'rgba(255,255,255,0.22)', lineHeight: 0 }}
        >
          <RotateCw className="w-3 h-3" />
        </button>
      </div>

      {/* Right: Action icons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <BarButton icon={<Share2 className="w-3.5 h-3.5" />} />
        <BarButton icon={<Plus className="w-3.5 h-3.5" />} />
      </div>
    </motion.div>
  );
}

function BarButton({ icon, disabled }: { icon: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      className="w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-150"
      style={{
        color: disabled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.40)',
        cursor: disabled ? 'default' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.82)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.12)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = disabled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.40)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
    >
      {icon}
    </button>
  );
}
