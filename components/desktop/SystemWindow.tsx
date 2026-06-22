// components/desktop/SystemWindow.tsx
import { memo, useCallback } from 'react';
import type { WindowRecord } from '@/types/windows';
import { useDraggable }       from '@/hooks/useDraggable';
import { TitleBar }           from './TitleBar';

const SPRING           = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const TRANSITION_IN    = `opacity 0.22s ease, transform 0.42s ${SPRING}`;
const TRANSITION_OUT   = 'opacity 0.18s ease-in, transform 0.18s ease-in';

// visionOS Glassmorphism
const ELEVATION_INACTIVE = 'bg-white/[0.04] backdrop-blur-3xl border border-white/[0.12] saturate-150';
const ELEVATION_FOCUSED  = 'bg-white/[0.08] backdrop-blur-3xl border border-white/[0.22] saturate-150';

const SHADOW_FOCUSED = [
  'inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
  '0 0 0 1px rgba(255, 255, 255, 0.08)',
  '0 8px 32px -4px rgba(139, 92, 246, 0.25)',
  '0 24px 80px -12px rgba(0, 0, 0, 0.75)',
  '0 48px 120px -24px rgba(0, 0, 0, 0.55)',
].join(', ');

const SHADOW_INACTIVE = [
  'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
  '0 16px 48px -12px rgba(0, 0, 0, 0.6)',
].join(', ');
const SHADOW_TRANSITION_IN   = `box-shadow 0.38s ${SPRING}`;
const SHADOW_TRANSITION_OUT  = 'box-shadow 0.18s ease-in';

export interface SystemWindowProps {
  win:        WindowRecord;
  isVisible:  boolean;
  onFocus:    () => void;
  onClose:    () => void;
  onMinimize: () => void;
  onMove:     (x: number, y: number) => void;
  children:   React.ReactNode;
}

export const SystemWindow = memo(function SystemWindow({
  win, isVisible, onFocus, onClose, onMinimize, onMove, children,
}: SystemWindowProps) {

  const { onTitleMouseDown } = useDraggable({ position: win.position, onMove, onFocus });

  const handleClose    = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onClose();    }, [onClose]);
  const handleMinimize = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onMinimize(); }, [onMinimize]);

  const isFocusedAndVisible = win.isFocused && isVisible;

  return (
    <div
      role="dialog"
      aria-label={win.title}
      aria-modal={false}
      tabIndex={-1}
      style={{
        position:   'absolute',
        top:        0,
        left:       0,
        width:      win.size.w === 'auto' ? undefined : win.size.w,
        zIndex:     win.zIndex,
        willChange: 'transform, opacity',
        transform:  `translate(${win.position.x}px, ${win.position.y}px) scale(${isFocusedAndVisible ? 1.004 : 1})`,
        opacity:       isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition:    isVisible ? TRANSITION_IN : TRANSITION_OUT,
      }}
      onMouseDown={onFocus}
      className="select-none"
    >
      <div
        className={`rounded-3xl overflow-hidden transition-[backdrop-filter,border-color,background-color] duration-300 ${win.isFocused ? ELEVATION_FOCUSED : ELEVATION_INACTIVE}`}
        style={{
          boxShadow:  win.isFocused ? SHADOW_FOCUSED : SHADOW_INACTIVE,
          transition: win.isFocused ? SHADOW_TRANSITION_IN : SHADOW_TRANSITION_OUT,
          animation:  win.isFocused ? 'windowPulse 3.5s ease-in-out infinite' : 'none',
        }}
      >
        <TitleBar
          title={win.title}
          isFocused={win.isFocused}
          onMouseDown={onTitleMouseDown}
          onClose={handleClose}
          onMinimize={handleMinimize}
        />
        <div
          className="overflow-y-auto overflow-x-hidden"
          style={{ maxHeight: win.size.h === 'auto' ? undefined : win.size.h }}
        >
          {children}
        </div>
      </div>
    </div>
  );
});
