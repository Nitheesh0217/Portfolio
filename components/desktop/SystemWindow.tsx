// components/desktop/SystemWindow.tsx
import { memo, useCallback } from 'react';
import type { WindowRecord } from '@/types/windows';
import { useDraggable }       from '@/hooks/useDraggable';
import { TitleBar }           from './TitleBar';

const SPRING           = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const TRANSITION_IN    = `opacity 0.22s ease, transform 0.42s ${SPRING}`;
const TRANSITION_OUT   = 'opacity 0.18s ease-in, transform 0.18s ease-in';

const ELEVATION_INACTIVE = 'bg-black/40 backdrop-blur-md border border-white/[0.06]';
const ELEVATION_FOCUSED  = 'bg-black/50 backdrop-blur-2xl border border-violet-500/[0.18]';

const SHADOW_FOCUSED = [
  '0 0 0 1px rgba(139, 92, 246, 0.22)',
  '0 0 50px -8px rgba(139, 92, 246, 0.16)',
  '0 32px 64px -12px rgba(0, 0, 0, 0.80)',
].join(', ');

const SHADOW_INACTIVE        = '0 10px 30px -8px rgba(0, 0, 0, 0.55)';
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
        className={`rounded-xl overflow-hidden transition-[backdrop-filter,border-color] duration-300 ${win.isFocused ? ELEVATION_FOCUSED : ELEVATION_INACTIVE}`}
        style={{
          boxShadow:  win.isFocused ? SHADOW_FOCUSED : SHADOW_INACTIVE,
          transition: win.isFocused ? SHADOW_TRANSITION_IN : SHADOW_TRANSITION_OUT,
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
