// types/windows.ts

export const WINDOW_IDS = [
  'welcome',
  'terminal',
  'projects',
  'certificates',
  'metrics',
  'contact',
  'assistant',
  'search',
  'timeline',
  'skills',
  'freelance',
] as const;

export type WindowId = typeof WINDOW_IDS[number];

export interface WindowSize {
  w: number | 'auto';
  h: number | 'auto';
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowRecord {
  id:          WindowId;
  title:       string;
  isOpen:      boolean;
  isMinimized: boolean;
  isFocused:   boolean;
  isMounted:   boolean;   // true after first open (lazy mount)
  zIndex:      number;
  position:    WindowPosition;
  size:        WindowSize;
}

// ─── Actions ────────────────────────────────────────────────────────────────

export type WindowAction =
  | { type: 'OPEN';        id: WindowId; nextZ: number }
  | { type: 'CLOSE';       id: WindowId }
  | { type: 'MINIMIZE';    id: WindowId }
  | { type: 'RESTORE';     id: WindowId; nextZ: number }
  | { type: 'FOCUS';       id: WindowId; nextZ: number }
  | { type: 'MOVE';        id: WindowId; x: number; y: number }
  | { type: 'OPEN_ALL';    nextZ: number }
  | { type: 'CLOSE_ALL' }
  | { type: 'NORMALIZE_Z'; assignments: Partial<Record<WindowId, number>> };

export type WindowState = Record<WindowId, WindowRecord>;
