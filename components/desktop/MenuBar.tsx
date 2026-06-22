// components/desktop/MenuBar.tsx
// visionOS doesn't have a Mac-style menu bar. Replaced with a floating
// status pill in the top-right — the actual visionOS pattern.
import { memo, useEffect, useState } from 'react';

export interface MenuBarProps {
  onOpenAll:  () => void;
  onCloseAll: () => void;
}

export const MenuBar = memo(function MenuBar({ onOpenAll: _onOpenAll, onCloseAll: _onCloseAll }: MenuBarProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(
      new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-2 select-none"
      style={{
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '9999px',
        boxShadow: [
          'inset 0 1px 0 rgba(255,255,255,0.20)',
          '0 8px 24px rgba(0,0,0,0.30)',
        ].join(', '),
      }}
    >
      {/* Live indicator */}
      <span className="flex items-center gap-1.5">
        <span className="relative inline-flex">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </span>
        <span className="text-[11px] font-semibold tracking-wide text-emerald-300">LIVE</span>
      </span>

      <span className="w-px h-3 bg-white/15" />

      {/* Clock */}
      <span className="text-[12px] font-medium tabular-nums text-white/85">{time}</span>
    </div>
  );
});
