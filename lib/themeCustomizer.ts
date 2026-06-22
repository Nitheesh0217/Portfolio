// lib/themeCustomizer.ts
// Customize portfolio theme colors and accents
export interface ThemeConfig {
  primaryColor: string; // e.g., '#8b5cf6' (violet)
  accentColor: string; // e.g., '#06b6d4' (cyan)
  backgroundDark: string; // e.g., '#080812' (dark bg)
  borderColor: string; // e.g., 'rgba(255,255,255,0.06)'
  glassOpacity: number; // 0-1
  useGradient: boolean;
}

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#8b5cf6', // Violet
  accentColor: '#ec4899', // Pink
  backgroundDark: '#080812',
  borderColor: 'rgba(255,255,255,0.06)',
  glassOpacity: 0.05,
  useGradient: true,
};

export const PRESET_THEMES: Record<string, ThemeConfig> = {
  violet: {
    primaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    backgroundDark: '#080812',
    borderColor: 'rgba(255,255,255,0.06)',
    glassOpacity: 0.05,
    useGradient: true,
  },
  blue: {
    primaryColor: '#3b82f6',
    accentColor: '#06b6d4',
    backgroundDark: '#0f172a',
    borderColor: 'rgba(255,255,255,0.06)',
    glassOpacity: 0.05,
    useGradient: true,
  },
  emerald: {
    primaryColor: '#10b981',
    accentColor: '#14b8a6',
    backgroundDark: '#051c15',
    borderColor: 'rgba(255,255,255,0.06)',
    glassOpacity: 0.05,
    useGradient: true,
  },
  orange: {
    primaryColor: '#f97316',
    accentColor: '#fb923c',
    backgroundDark: '#1f0f05',
    borderColor: 'rgba(255,255,255,0.06)',
    glassOpacity: 0.05,
    useGradient: true,
  },
  slate: {
    primaryColor: '#64748b',
    accentColor: '#cbd5e1',
    backgroundDark: '#0f172a',
    borderColor: 'rgba(255,255,255,0.08)',
    glassOpacity: 0.03,
    useGradient: false,
  },
  light: {
    primaryColor: '#6366f1',
    accentColor: '#ec4899',
    backgroundDark: '#f8f7f4',
    borderColor: 'rgba(0,0,0,0.08)',
    glassOpacity: 0.04,
    useGradient: true,
  },
  cream: {
    primaryColor: '#92400e',
    accentColor: '#dc2626',
    backgroundDark: '#faf8f3',
    borderColor: 'rgba(0,0,0,0.06)',
    glassOpacity: 0.03,
    useGradient: true,
  },
  mint: {
    primaryColor: '#0891b2',
    accentColor: '#06b6d4',
    backgroundDark: '#f0fdf4',
    borderColor: 'rgba(0,0,0,0.07)',
    glassOpacity: 0.04,
    useGradient: true,
  },
};

const STORAGE_KEY = 'dws_theme_config_v1';

export function saveTheme(theme: ThemeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    applyTheme(theme);
  } catch (err) {
    console.warn('[themeCustomizer] Failed to save theme:', err);
  }
}

export function loadTheme(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  } catch (err) {
    console.warn('[themeCustomizer] Failed to load theme:', err);
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-background-dark', theme.backgroundDark);
  root.style.setProperty('--color-border', theme.borderColor);
  root.style.setProperty('--glass-opacity', theme.glassOpacity.toString());

  // Update background if needed
  if (document.body) {
    document.body.style.backgroundColor = theme.backgroundDark;
  }
}

export function resetTheme(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    applyTheme(DEFAULT_THEME);
  } catch (err) {
    console.warn('[themeCustomizer] Failed to reset theme:', err);
  }
}

export function getThemeCSS(theme: ThemeConfig): string {
  return `
:root {
  --color-primary: ${theme.primaryColor};
  --color-accent: ${theme.accentColor};
  --color-background-dark: ${theme.backgroundDark};
  --color-border: ${theme.borderColor};
  --glass-opacity: ${theme.glassOpacity};
}

body {
  background: ${theme.backgroundDark};
}

.glass-effect {
  background-color: rgba(255, 255, 255, ${theme.glassOpacity});
  border-color: ${theme.borderColor};
}

.primary-text {
  color: ${theme.primaryColor};
}

.accent-text {
  color: ${theme.accentColor};
}
`;
}
