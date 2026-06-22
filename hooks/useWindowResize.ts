// hooks/useWindowResize.ts
// Handle window resizing with drag handles on corners/edges
'use client';

import { useRef, useCallback, useEffect } from 'react';

export interface ResizeState {
  isResizing: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

export function useWindowResize(
  onResize: (width: number, height: number) => void,
) {
  const resizeRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<ResizeState>({
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!resizeRef.current) return;

      const rect = resizeRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;

      stateRef.current = {
        isResizing: true,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
      };

      e.preventDefault();
    },
    [],
  );

  useEffect(() => {
    if (!stateRef.current.isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { startX, startY, startWidth, startHeight } = stateRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newWidth = Math.max(300, startWidth + deltaX);
      const newHeight = Math.max(200, startHeight + deltaY);

      onResize(newWidth, newHeight);
    };

    const handleMouseUp = () => {
      stateRef.current.isResizing = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize]);

  return { resizeRef, handleMouseDown };
}
