// components/desktop/SystemWindow.tsx
// visionOS-accurate window: heavy frosted glass, huge corner radius,
// no boxy chrome — floats over passthrough.
import { memo, useCallback } from 'react';
import type { WindowRecord } from '@/types/windows';
import { useDraggable }       from '@/hooks/useDraggable';
import { TitleBar }           from './TitleBar';

const SPRING         = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const TRANSITION_IN  = `opacity 0.22s ease, transform 0.42s ${SPRING}`;
const TRANSITION_OUT = 'opacity 0.18s ease-in, transform 0.18s ease-in';

// visionOS panels are LIGHT frosted glass over dark passthrough.
// The tint is barely-there white — the blur+saturation does the heavy lifting.
const GLASS_INACTIVE = {
  background: 'rgba(255, 255, 255, 0.06)',
  backdropFilter: 'blur(50px) saturate(180%)',
  WebkitBackdropFilter: 'blur(50px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.10)',
};

const GLASS_FOCUSED = {
  background: 'rgba(255, 255, 255, 0.10)',
  backdropFilter: 'blur(60px) saturate(200%)',
  WebkitBackdropFilter: 'blur(60px) saturate(200%)',
  border: '1px solid rgba(255, 255, 255, 0.22)',
};

// Layered shadow stack — soft, diffused, like real depth in space
const SHADOW_FOCUSED = [
  'inset 0 1px 0 rgba(255, 255, 255, 0.25)',   // top edge highlight
  'inset 0 0 0 1px rgba(255, 255, 255, 0.05)', // inner glow
  '0 2px 8px rgba(0, 0, 0, 0.10)',
  '0 24px 64px rgba(0, 0, 0, 0.40)',
  '0 48px 120px rgba(0, 0, 0, 0.30)',
].join(', ');

const SHADOW_INACTIVE = [
  'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
  '0 16px 48px rgba(0, 0, 0, 0.35)',
  '0 32px 80px rgba(0, 0, 0, 0.20)',
].join(', ');

const SHADOW_TRANSITION_IN  = `box-shadow 0.38s ${SPRING}, background-color 0.3s ease`;
const SHADOW_TRANSITION_OUT = 'box-shadow 0.18s ease-in, background-color 0.3s ease';

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
  const glass = win.isFocused ? GLASS_FOCUSED : GLASS_INACTIVE;

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
        transform:  `translate(${win.position.x}px, ${win.position.y}px) scale(${isFocusedAndVisible ? 1.005 : 1})`,
        opacity:       isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition:    isVisible ? TRANSITION_IN : TRANSITION_OUT,
      }}
      onMouseDown={onFocus}
      className="select-none"
    >
      <div
        className="overflow-hidden"
        style={{
          ...glass,
          borderRadius: '36px',          // visionOS-large radius
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
