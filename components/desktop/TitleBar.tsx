// components/desktop/TitleBar.tsx
// visionOS-style: minimal, transparent. Just a drag handle + close pill.
// No traffic-light row (that's macOS chrome, not visionOS).
import { memo } from 'react';
import { X } from 'lucide-react';

export interface TitleBarProps {
  title:       string;
  isFocused:   boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClose:     (e: React.MouseEvent) => void;
  onMinimize:  (e: React.MouseEvent) => void;
}

export const TitleBar = memo(function TitleBar({
  title, isFocused, onMouseDown, onClose,
}: TitleBarProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="relative flex items-center justify-between gap-3 px-6 py-3 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Drag-hint pill — visionOS shows a small handle indicator */}
      <div className="absolute left-1/2 top-1.5 -translate-x-1/2">
        <div
          className="h-1 rounded-full transition-all"
          style={{
            width: isFocused ? 44 : 32,
            background: isFocused ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.22)',
          }}
        />
      </div>

      {/* Title — subtle, doesn't compete with content */}
      <p
        className="text-[15px] font-semibold tracking-tight truncate pt-2"
        style={{
          color: isFocused ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
          textShadow: isFocused ? '0 1px 2px rgba(0,0,0,0.20)' : 'none',
        }}
      >
        {title}
      </p>

      {/* Single circular close button — visionOS style */}
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onClose}
        aria-label="Close window"
        className="group flex items-center justify-center w-7 h-7 rounded-full transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <X
          className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors"
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
});
