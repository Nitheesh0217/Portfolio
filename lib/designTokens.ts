// lib/designTokens.ts
// Single source of truth for the visionOS spatial UI design system

export const TOKENS = {
  // ── Accent colors ──────────────────────────────────────────────────────────
  amber:   '#fbbf24',
  violet:  '#a78bfa',
  emerald: '#34d399',
  sky:     '#38bdf8',
  rose:    '#fb7185',

  // ── Glass surfaces ─────────────────────────────────────────────────────────
  glass: {
    surface:  'rgba(255,255,255,0.02)',
    surface2: 'rgba(255,255,255,0.04)',
    surface3: 'rgba(255,255,255,0.06)',
  },

  // ── Borders ────────────────────────────────────────────────────────────────
  border: {
    base:    'rgba(255,255,255,0.06)',
    bright:  'rgba(255,255,255,0.10)',
    top:     'rgba(255,255,255,0.20)',
  },
} as const;

/** Accent icon container — amber by default */
export function accentBox(color: string = TOKENS.amber) {
  return {
    background: `linear-gradient(135deg, ${color}22, ${color}11)`,
    border: `1px solid ${color}33`,
  } as React.CSSProperties;
}

/** Shared pill / section-label style props */
export const sectionLabel =
  'text-[9px] font-black uppercase tracking-[0.16em]';

/** Card base glass style */
export const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
};
