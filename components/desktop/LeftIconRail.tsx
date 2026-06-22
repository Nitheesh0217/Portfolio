// components/desktop/LeftIconRail.tsx
// Apple Vision Pro-style fixed left navigation rail
'use client';

import { motion } from 'framer-motion';
import { Home, Grid2x2, Bot, Cpu, Mail } from 'lucide-react';
import type { WindowId } from '@/types/windows';

interface RailItem {
  id: WindowId;
  icon: React.FC<{ style?: React.CSSProperties }>;
  label: string;
}

const RAIL_ITEMS: RailItem[] = [
  { id: 'welcome',   icon: ({ style }) => <Home   style={{ width: 18, height: 18, ...style }} />, label: 'Home' },
  { id: 'projects',  icon: ({ style }) => <Grid2x2 style={{ width: 18, height: 18, ...style }} />, label: 'Projects' },
  { id: 'assistant', icon: ({ style }) => <Bot     style={{ width: 18, height: 18, ...style }} />, label: 'AI Sidekick' },
  { id: 'skills',    icon: ({ style }) => <Cpu     style={{ width: 18, height: 18, ...style }} />, label: 'Skills' },
  { id: 'contact',   icon: ({ style }) => <Mail    style={{ width: 18, height: 18, ...style }} />, label: 'Contact' },
];

interface LeftIconRailProps {
  windows: Record<WindowId, { isOpen: boolean; isFocused: boolean; isMinimized: boolean }>;
  onToggle: (id: WindowId) => void;
}

export function LeftIconRail({ windows, onToggle }: LeftIconRailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-[9980] flex flex-col gap-4 py-5 px-3 rounded-2xl"
      style={{
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {RAIL_ITEMS.map((item, i) => {
        const win = windows[item.id];
        const isActive = win?.isOpen && !win.isMinimized;
        const Icon = item.icon;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
            className="relative group"
          >
            <motion.button
              onClick={() => onToggle(item.id)}
              title={item.label}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.93 }}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
              style={{
                background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
              }}
            >
              <Icon
                style={{
                  color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.38)',
                  transition: 'color 150ms',
                }}
              />
            </motion.button>

            {/* Active indicator dot */}
            {isActive && (
              <div
                className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                style={{ background: 'rgba(167,139,250,0.80)' }}
              />
            )}

            {/* Tooltip */}
            <div
              className="absolute left-full ml-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              style={{ top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}
            >
              <div
                className="px-2.5 py-1 rounded-lg text-white font-medium"
                style={{
                  fontSize: '11px',
                  background: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                {item.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
