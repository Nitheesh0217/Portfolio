// lib/windowStorage.ts
// Persist window state to localStorage
import type { WindowState } from '@/types/windows';

const STORAGE_KEY = 'dws_window_state_v2';

export function saveWindowState(state: WindowState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[windowStorage] Failed to save state:', err);
  }
}

export function loadWindowState(): WindowState | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.warn('[windowStorage] Failed to load state:', err);
    return null;
  }
}

export function clearWindowState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[windowStorage] Failed to clear state:', err);
  }
}
