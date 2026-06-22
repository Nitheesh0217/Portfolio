// components/desktop/Dock.tsx
import { memo } from 'react';
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
  welcome:      'Welcome',
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

export interface DockProps {
  windows:  Record<WindowId, WindowRecord>;
  onToggle: (id: WindowId) => void;
}

export const Dock = memo(function Dock({ windows, onToggle }: DockProps) {
  const ids = Object.keys(DOCK_ICONS) as WindowId[];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] flex items-end gap-1.5 px-3 py-2.5 rounded-2xl"
      style={{
        background:    'rgba(10,10,22,0.72)',
        backdropFilter:'blur(28px)',
        border:        '1px solid rgba(255,255,255,0.07)',
        boxShadow:     '0 8px 32px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(139,92,246,0.08)',
      }}
    >
      {ids.map((id) => {
        const Icon = DOCK_ICONS[id];
        const win  = windows[id];
        const isOpen    = win?.isOpen;
        const isFocused = win?.isFocused && isOpen && !win.isMinimized;

        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            title={DOCK_LABELS[id]}
            aria-label={`Toggle ${DOCK_LABELS[id]}`}
            className="relative group flex flex-col items-center gap-0.5 transition-transform hover:-translate-y-1 active:scale-95 duration-150"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isFocused ? 'bg-violet-500/25 ring-1 ring-violet-500/40' : isOpen ? 'bg-white/[0.10] ring-1 ring-white/[0.08]' : 'bg-white/[0.05] hover:bg-white/[0.10]'}`}>
              <Icon className={`w-5 h-5 transition-colors ${isFocused ? 'text-violet-300' : isOpen ? 'text-white/75' : 'text-white/40 group-hover:text-white/65'}`} />
            </div>

            {/* Running dot */}
            {isOpen && !win.isMinimized && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
            )}

            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-white/80 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {DOCK_LABELS[id]}
            </span>
          </button>
        );
      })}
    </div>
  );
});
