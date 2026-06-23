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
  Home, Briefcase, Heart, Bell, User, Zap,
  type LucideIcon,
} from 'lucide-react';
import type { WindowId, WindowRecord } from '@/types/windows';

const DOCK_ICONS: Record<Exclude<WindowId, 'terminal'>, LucideIcon> = {
  welcome:      Home,
  projects:     Briefcase,
  certificates: Heart,
  metrics:      Heart,
  contact:      User,
  assistant:    Bell,
  search:       Bell,
  timeline:     Bell,
  skills:       Bell,
  freelance:    Zap,
};

const DOCK_LABELS: Record<Exclude<WindowId, 'terminal'>, string> = {
  welcome:      'Home',
  projects:     'Projects',
  certificates: 'Certs',
  metrics:      'Metrics',
  contact:      'Contact',
  assistant:    'AI Sidekick',
  search:       'Search',
  timeline:     'Timeline',
  skills:       'Skills',
  freelance:    'Start a Project',
};

const ACTIVE_DOCK_IDS: Exclude<WindowId, 'terminal'>[] = [
  'welcome',
  'projects',
  'certificates',
  'assistant',
  'contact',
  'freelance',
];

// ─── Single magnifying dock item ───────────────────────────────────────────
function DockItem({
  id,
  win,
  mouseY,
  onToggle,
}: {
  id: Exclude<WindowId, 'terminal'>;
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

  // Map distance → size (slimmer footprint)
  const sizeTransform = useTransform(distance, [-60, 0, 60], [32, 42, 32]);
  const size = useSpring(sizeTransform, { stiffness: 340, damping: 26 });

  // Translate slightly to the RIGHT when magnified
  const xTransform = useTransform(distance, [-60, 0, 60], [0, 4, 0]);
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
            ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
            : isOpen
            ? 'rgba(255,255,255,0.10)'
            : 'rgba(255,255,255,0.03)',
          borderRadius: '50%',
          border: isFocused
            ? '1px solid rgba(255, 220, 130, 0.55)'
            : '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          boxShadow: isFocused
            ? '0 8px 20px rgba(245,158,11,0.45), inset 0 1px 0 rgba(255,255,255,0.40)'
            : 'none',
          transition: 'background 150ms, border-color 150ms, box-shadow 150ms',
        }}
        whileTap={{ scale: 0.90 }}
      >
        <Icon
          className={`transition-colors ${
            isFocused ? 'text-[#1a1100]' : isOpen ? 'text-white/80' : 'text-white/40'
          }`}
          style={{ width: '46%', height: '46%' }}
        />
      </motion.button>

      {/* Running dot — to the LEFT of icon */}
      {isOpen && !win.isMinimized && (
        <div
          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
          style={{ background: isFocused ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.45)' }}
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
            background: 'rgba(10, 10, 15, 0.85)',
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

export interface DockProps {
  windows:  Record<WindowId, WindowRecord>;
  onToggle: (id: WindowId) => void;
  className?: string;
}

export const Dock = memo(function Dock({ windows, onToggle, className }: DockProps) {
  const mouseY = useMotionValue(Infinity);

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.55, ease: [0.34, 1.2, 0.64, 1] }}
      className={className ?? "fixed left-8 top-1/2 -translate-y-1/2 z-[9998]"}
    >
      <div
        className="flex flex-col items-center gap-2 px-2 py-3.5"
        style={{
          background: 'rgba(5, 5, 5, 0.95)',
          backdropFilter: 'blur(40px) saturate(120%)',
          WebkitBackdropFilter: 'blur(40px) saturate(120%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '9999px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
        onMouseMove={(e) => mouseY.set(e.clientY)}
        onMouseLeave={() => mouseY.set(Infinity)}
      >
        {ACTIVE_DOCK_IDS.map((id) => (
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
