// components/desktop/Dock.tsx
// visionOS left vertical icon rail (Ref B style — spatial app sidebar).
// Magnifies along the Y axis on hover.
'use client';

import { memo, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  Terminal, FolderOpen, Award, BarChart2,
  Mail, Bot, LayoutDashboard, Search, Clock, Zap,
  type LucideIcon,
} from 'lucide-react';
import type { WindowId, WindowRecord } from '@/types/windows';

const DOCK_ICONS: Record<WindowId, LucideIcon> = {
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
  mouseY,
  onToggle,
}: {
  id: WindowId;
  win: WindowRecord;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  onToggle: (id: WindowId) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const Icon = DOCK_ICONS[id];
  const isOpen    = win?.isOpen ?? false;
  const isFocused = win?.isFocused && isOpen && !win.isMinimized;

  // Distance from mouse Y to icon center Y
  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - (bounds.top + bounds.height / 2);
  });

  // Map distance → size
  const sizeTransform = useTransform(distance, [-80, 0, 80], [44, 60, 44]);
  const size = useSpring(sizeTransform, { stiffness: 340, damping: 26 });

  // Translate slightly to the RIGHT when magnified (away from screen edge)
  const xTransform = useTransform(distance, [-80, 0, 80], [0, 6, 0]);
  const x = useSpring(xTransform, { stiffness: 340, damping: 26 });

  return (
    <motion.div className="relative flex items-center" style={{ x }}>
      <motion.button
        ref={ref}
        onClick={() => onToggle(id)}
        title={DOCK_LABELS[id]}
        aria-label={`Toggle ${DOCK_LABELS[id]}`}
        style={{
          width: size,
          height: size,
          background: isFocused
            ? 'rgba(255,255,255,0.30)'
            : isOpen
            ? 'rgba(255,255,255,0.18)'
            : 'rgba(255,255,255,0.06)',
          borderRadius: '50%',
          border: isFocused
            ? '1px solid rgba(255,255,255,0.35)'
            : '1px solid rgba(255,255,255,0.10)',
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
            isFocused ? 'text-white' : isOpen ? 'text-white/85' : 'text-white/55'
          }`}
          style={{ width: '46%', height: '46%' }}
        />
      </motion.button>

      {/* Running dot — to the LEFT of icon (since rail is on left edge) */}
      {isOpen && !win.isMinimized && (
        <div
          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
          style={{ background: isFocused ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)' }}
        />
      )}

      {/* Tooltip — appears to the RIGHT of the rail */}
      <div
        className="absolute pointer-events-none"
        style={{ left: 'calc(100% + 14px)', top: '50%', transform: 'translateY(-50%)' }}
      >
        <span
          className="whitespace-nowrap text-[11px] font-semibold text-white/90 px-2.5 py-1 rounded-md opacity-0 transition-opacity"
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

// ─── Dock — vertical left rail ─────────────────────────────────────────────
export interface DockProps {
  windows:  Record<WindowId, WindowRecord>;
  onToggle: (id: WindowId) => void;
}

export const Dock = memo(function Dock({ windows, onToggle }: DockProps) {
  const mouseY = useMotionValue(Infinity);
  const ids = Object.keys(DOCK_ICONS) as WindowId[];

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.55, ease: [0.34, 1.2, 0.64, 1] }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-[9998]"
    >
      <div
        className="flex flex-col items-center gap-2.5 px-3 py-4"
        style={{
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(60px) saturate(180%)',
          WebkitBackdropFilter: 'blur(60px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '9999px',
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.25)',
            '0 12px 40px rgba(0,0,0,0.40)',
            '0 24px 64px rgba(0,0,0,0.20)',
          ].join(', '),
        }}
        onMouseMove={(e) => mouseY.set(e.clientY)}
        onMouseLeave={() => mouseY.set(Infinity)}
      >
        {ids.map((id) => (
          <DockItem
            key={id}
            id={id}
            win={windows[id]}
            mouseY={mouseY}
            onToggle={onToggle}
          />
        ))}
      </div>
    </motion.div>
  );
});
