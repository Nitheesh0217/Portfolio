// lib/windowReducer.ts
import type { WindowState, WindowAction, WindowId, WindowRecord } from '@/types/windows';
import { WINDOW_IDS } from '@/types/windows';

export const Z_BASE       = 10;
export const Z_MAX        = 9990;
export const MENUBAR_HEIGHT = 28;

// ─── Default window layout ───────────────────────────────────────────────────

type WindowDef = Omit<WindowRecord, 'isOpen' | 'isMinimized' | 'isFocused' | 'isMounted'>;

const WINDOW_DEFAULTS: Record<WindowId, WindowDef> = {
  // ── Left column (x≈40–180) ──────────────────────────────
  welcome: {
    id:       'welcome',
    title:    '👋 Welcome',
    zIndex:   Z_BASE + 6,
    position: { x: 40, y: MENUBAR_HEIGHT + 24 },
    size:     { w: 'auto', h: 'auto' },
  },
  projects: {
    id:       'projects',
    title:    '📁 Projects',
    zIndex:   Z_BASE + 4,
    position: { x: 40, y: MENUBAR_HEIGHT + 24 },
    size:     { w: 'auto', h: 'auto' },
  },
  skills: {
    id:       'skills',
    title:    '💻 Skills',
    zIndex:   Z_BASE + 3,
    position: { x: 60, y: MENUBAR_HEIGHT + 100 },
    size:     { w: 520, h: 'auto' },
  },

  // ── Center column (x≈440–600) ────────────────────────────
  terminal: {
    id:       'terminal',
    title:    '⬛ Terminal',
    zIndex:   Z_BASE + 5,
    position: { x: 440, y: MENUBAR_HEIGHT + 24 },
    size:     { w: 'auto', h: 'auto' },
  },
  search: {
    id:       'search',
    title:    '🔍 Search',
    zIndex:   Z_BASE + 5,
    position: { x: 440, y: MENUBAR_HEIGHT + 24 },
    size:     { w: 500, h: 'auto' },
  },
  timeline: {
    id:       'timeline',
    title:    '📅 Timeline',
    zIndex:   Z_BASE + 4,
    position: { x: 420, y: MENUBAR_HEIGHT + 160 },
    size:     { w: 500, h: 'auto' },
  },
  contact: {
    id:       'contact',
    title:    '✉️ Contact',
    zIndex:   Z_BASE + 1,
    position: { x: 460, y: MENUBAR_HEIGHT + 360 },
    size:     { w: 300, h: 'auto' },
  },

  // ── Right column (x≈880–960) ─────────────────────────────
  assistant: {
    id:       'assistant',
    title:    '🤖 AI Sidekick',
    zIndex:   Z_BASE + 7,
    position: { x: 880, y: MENUBAR_HEIGHT + 24 },
    size:     { w: 'auto', h: 'auto' },
  },
  certificates: {
    id:       'certificates',
    title:    '🏅 Credentials',
    zIndex:   Z_BASE + 3,
    position: { x: 880, y: MENUBAR_HEIGHT + 24 },
    size:     { w: 'auto', h: 'auto' },
  },
  metrics: {
    id:       'metrics',
    title:    '📊 Metrics',
    zIndex:   Z_BASE + 2,
    position: { x: 900, y: MENUBAR_HEIGHT + 200 },
    size:     { w: 380, h: 'auto' },
  },
};

function makeRecord(def: WindowDef, open = false, focused = false): WindowRecord {
  return {
    ...def,
    isOpen:      open,
    isMinimized: false,
    isFocused:   focused,
    isMounted:   open,
  };
}

export const INITIAL_WINDOW_STATE: WindowState = (() => {
  const state = {} as WindowState;
  for (const id of WINDOW_IDS) {
    // Open welcome + terminal on boot
    const open    = id === 'welcome' || id === 'terminal';
    const focused = id === 'welcome';
    state[id] = makeRecord(WINDOW_DEFAULTS[id], open, focused);
  }
  return state;
})();

// ─── Reducer ─────────────────────────────────────────────────────────────────

export function windowReducer(state: WindowState, action: WindowAction): WindowState {
  switch (action.type) {
    case 'OPEN': {
      return {
        ...unfocusAll(state),
        [action.id]: {
          ...state[action.id],
          isOpen:      true,
          isMinimized: false,
          isFocused:   true,
          isMounted:   true,
          zIndex:      action.nextZ,
        },
      };
    }

    case 'CLOSE': {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          isOpen:    false,
          isFocused: false,
        },
      };
    }

    case 'MINIMIZE': {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          isMinimized: true,
          isFocused:   false,
        },
      };
    }

    case 'RESTORE': {
      return {
        ...unfocusAll(state),
        [action.id]: {
          ...state[action.id],
          isOpen:      true,
          isMinimized: false,
          isFocused:   true,
          zIndex:      action.nextZ,
        },
      };
    }

    case 'FOCUS': {
      return {
        ...unfocusAll(state),
        [action.id]: {
          ...state[action.id],
          isFocused: true,
          zIndex:    action.nextZ,
        },
      };
    }

    case 'MOVE': {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          position: { x: action.x, y: action.y },
        },
      };
    }

    case 'OPEN_ALL': {
      const next = { ...unfocusAll(state) };
      WINDOW_IDS.forEach((id, i) => {
        next[id] = {
          ...next[id],
          isOpen:      true,
          isMinimized: false,
          isMounted:   true,
          isFocused:   i === WINDOW_IDS.length - 1,
          zIndex:      Z_BASE + i,
        };
      });
      return next;
    }

    case 'CLOSE_ALL': {
      const next = { ...state };
      for (const id of WINDOW_IDS) {
        next[id] = { ...next[id], isOpen: false, isFocused: false };
      }
      return next;
    }

    case 'NORMALIZE_Z': {
      const next = { ...state };
      for (const [id, z] of Object.entries(action.assignments) as [WindowId, number][]) {
        next[id] = { ...next[id], zIndex: z };
      }
      return next;
    }

    default:
      return state;
  }
}

function unfocusAll(state: WindowState): WindowState {
  const next = { ...state };
  for (const id of WINDOW_IDS) {
    if (next[id].isFocused) next[id] = { ...next[id], isFocused: false };
  }
  return next;
}
