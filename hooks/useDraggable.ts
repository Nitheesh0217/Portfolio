// hooks/useDraggable.ts
// RAF-gated, transform-only drag — zero layout thrash
import { useCallback, useRef } from 'react';

export interface UseDraggableOptions {
  position: { x: number; y: number };
  onMove:   (x: number, y: number) => void;
  onFocus?: () => void;
}

export function useDraggable({ position, onMove, onFocus }: UseDraggableOptions) {
  const dragging    = useRef(false);
  const startMouse  = useRef({ x: 0, y: 0 });
  const startPos    = useRef({ x: 0, y: 0 });
  const rafId       = useRef<number>(0);
  const latestMouse = useRef({ x: 0, y: 0 });

  const onTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    onFocus?.();

    dragging.current   = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current   = { x: position.x, y: position.y };

    const MENUBAR_H = 28;

    const onMouseMove = (ev: MouseEvent) => {
      latestMouse.current = { x: ev.clientX, y: ev.clientY };
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = 0;
        if (!dragging.current) return;
        const dx  = latestMouse.current.x - startMouse.current.x;
        const dy  = latestMouse.current.y - startMouse.current.y;
        const nx  = Math.max(0, Math.min(startPos.current.x + dx, window.innerWidth - 60));
        const ny  = Math.max(MENUBAR_H, Math.min(startPos.current.y + dy, window.innerHeight - 60));
        onMove(nx, ny);
      });
    };

    const onMouseUp = () => {
      dragging.current = false;
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
  }, [position, onMove, onFocus]);

  return { onTitleMouseDown };
}
