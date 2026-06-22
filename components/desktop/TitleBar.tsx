// components/desktop/TitleBar.tsx
import { memo } from 'react';
import { X, Minus } from 'lucide-react';

export interface TitleBarProps {
  title:       string;
  isFocused:   boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClose:     (e: React.MouseEvent) => void;
  onMinimize:  (e: React.MouseEvent) => void;
}

export const TitleBar = memo(function TitleBar({
  title, isFocused, onMouseDown, onClose, onMinimize,
}: TitleBarProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] cursor-grab active:cursor-grabbing select-none"
      style={{ background: isFocused ? 'rgba(139,92,246,0.04)' : 'transparent' }}
    >
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          aria-label="Close window"
          className="group w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-400 border border-red-400/40 transition-colors flex items-center justify-center"
        >
          <X className="w-1.5 h-1.5 text-red-900/60 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onMinimize}
          aria-label="Minimize window"
          className="group w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-400 border border-yellow-400/40 transition-colors flex items-center justify-center"
        >
          <Minus className="w-1.5 h-1.5 text-yellow-900/60 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <div className="w-3 h-3 rounded-full bg-white/10 border border-white/5" />
      </div>

      {/* Title */}
      <p className="flex-1 text-center text-[13px] font-bold tracking-wider truncate"
        style={{ color: isFocused ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)' }}>
        {title}
      </p>

      {/* Spacer mirrors traffic lights width */}
      <div className="w-[42px] shrink-0" />
    </div>
  );
});
