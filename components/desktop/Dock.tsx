// components/desktop/Dock.tsx
// Apple Vision Pro dock — magnification on hover (Framer Motion spring physics)
'use client';

import { memo, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  Terminal, FolderOpen, Award, BarChart2,
  Mail, Bot, LayoutDashboard, Search, Clock, Zap,
} from 'lucide-react';
import type { WindowId, WindowRecord } from '@/types/windows';

const DOCK_ICONS: Record<WindowId, React.FC<{ className?: string }>> = {
  welcome:      LayoutDashboard,
  terminal:     Terminal,
  projects:     FolderOpen,
  certificates: Award,
  metrics:      BarChart2,
  contact:      Mail,
  assistant:    Bot,
  search:       Search,
  timeline:     Clock,
  skills:       Zap,
};

const DOCK_LABELS: Record<WindowId, string> = {
  welcome:      'Home',
  terminal:     'Terminal',
  projects:     'Projects',
  certificates: 'Certs',
  metrics:      'Metrics',
  contact:      'Contact',
  assistant:    'AI Sidekick',
  search:       'Search',
  timeline:     'Timeline',
  skills:       'Skills',
};

// ─── Single magnifying dock item ───────────────────────────────────────────
function DockItem({
  id,
  win,
  mouseX,
  onToggle,
}: {
  id: WindowId;
  win: WindowRecord;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  onToggle: (id: WindowId) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const Icon = DOCK_ICONS[id];
  const isOpen    = win?.isOpen ?? false;
  const isFocused = win?.isFocused && isOpen && !win.isMinimized;

  // Distance from mouse center to icon center
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - (bounds.left + bounds.width / 2);
  });

  // Map distance → size (40 base, 58 at hover peak, shoulders at 48)
  const sizeTransform = useTransform(distance, [-80, 0, 80], [40, 58, 40]);
  const size = useSpring(sizeTransform, { stiffness: 340, damping: 26 });

  // Translate up slightly when magnified
  const yTransform = useTransform(distance, [-80, 0, 80], [0, -6, 0]);
  const y = useSpring(yTransform, { stiffness: 340, damping: 26 });

  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{ y }}
    >
      <motion.button
        ref={ref}
        onClick={() => onToggle(id)}
        title={DOCK_LABELS[id]}
        aria-label={`Toggle ${DOCK_LABELS[id]}`}
        style={{
          width: size,
          height: size,
          background: isFocused
            ? 'rgba(139,92,246,0.28)'
            : isOpen
            ? 'rgba(255,255,255,0.10)'
            : 'rgba(255,255,255,0.055)',
          borderRadius: '14px',
          border: isFocused
            ? '1px solid rgba(139,92,246,0.45)'
            : '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 150ms, border-color 150ms',
        }}
        whileTap={{ scale: 0.90 }}
      >
        <Icon
          className={`transition-colors ${
            isFocused ? 'text-violet-300' : isOpen ? 'text-white/75' : 'text-white/40'
          }`}
          style={{ width: '46%', height: '46%' }}
        />
      </motion.button>

      {/* Running dot */}
      {isOpen && !win.isMinimized && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: isFocused ? 'rgba(167,139,250,0.90)' : 'rgba(255,255,255,0.45)' }}
        />
      )}

      {/* Tooltip (visible in the parent group-hover) */}
      <div
        className="absolute pointer-events-none"
        style={{ bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span
          className="whitespace-nowrap text-[10px] font-semibold text-white/85 px-2 py-0.5 rounded-md opacity-0 transition-opacity"
          id={`dock-tooltip-${id}`}
          style={{
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {DOCK_LABELS[id]}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Dock ──────────────────────────────────────────────────────────────────
export interface DockProps {
  windows:  Record<WindowId, WindowRecord>;
  onToggle: (id: WindowId) => void;
}

export const Dock = memo(function Dock({ windows, onToggle }: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const ids = Object.keys(DOCK_ICONS) as WindowId[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.55, ease: [0.34, 1.2, 0.64, 1] }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998]"
    >
      <div
        className="flex items-end gap-1.5 px-3 py-2.5 rounded-2xl"
        style={{
          background: 'rgba(8,6,20,0.72)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.60), 0 0 0 0.5px rgba(139,92,246,0.08)',
        }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {ids.map((id) => (
          <DockItem
            key={id}
            id={id}
            win={windows[id]}
            mouseX={mouseX}
            onToggle={onToggle}
          />
        ))}
      </div>
    </motion.div>
  );
});
