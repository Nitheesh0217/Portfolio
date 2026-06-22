// components/ThemeSwitcher.tsx
// Beautiful theme switcher with all light and dark themes
'use client';

import { memo, useState } from 'react';
import { Palette, X } from 'lucide-react';
import { saveTheme, PRESET_THEMES } from '@/lib/themeCustomizer';

interface Theme {
  name: string;
  key: keyof typeof PRESET_THEMES;
  emoji: string;
  category: 'light' | 'dark';
}

const THEMES: Theme[] = [
  // Light Themes
  { name: 'Light', key: 'light', emoji: '☀️', category: 'light' },
  { name: 'Cream', key: 'cream', emoji: '🟫', category: 'light' },
  { name: 'Mint', key: 'mint', emoji: '🌿', category: 'light' },

  // Dark Themes
  { name: 'Violet', key: 'violet', emoji: '🟣', category: 'dark' },
  { name: 'Blue', key: 'blue', emoji: '🔵', category: 'dark' },
  { name: 'Emerald', key: 'emerald', emoji: '💚', category: 'dark' },
  { name: 'Orange', key: 'orange', emoji: '🟠', category: 'dark' },
  { name: 'Slate', key: 'slate', emoji: '⚫', category: 'dark' },
];

export const ThemeSwitcher = memo(function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeKey: keyof typeof PRESET_THEMES) => {
    saveTheme(PRESET_THEMES[themeKey]);
    setIsOpen(false);
  };

  const lightThemes = THEMES.filter((t) => t.category === 'light');
  const darkThemes = THEMES.filter((t) => t.category === 'dark');

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-8 right-8 z-[9999] w-11 h-11 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg ${
          isOpen
            ? 'bg-violet-600 text-white scale-110'
            : 'bg-white/[0.1] text-white/70 hover:bg-white/[0.15] hover:text-white'
        }`}
        aria-label="Toggle theme switcher"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Palette className="w-6 h-6" />}
      </button>

      {/* Theme Picker Panel */}
      {isOpen && (
        <div className="fixed top-20 right-8 z-[9998] w-80 bg-white/[0.95] backdrop-blur-xl rounded-2xl border border-white/[0.2] shadow-2xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-2">
            <h3 className="text-sm font-bold text-white/90">Choose Theme</h3>
            <p className="text-xs text-white/50 mt-1">Light or dark, pick your vibe</p>
          </div>

          {/* Light Themes Section */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 mb-2">
              ☀️ Light Themes
            </p>
            <div className="grid grid-cols-3 gap-2">
              {lightThemes.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => handleThemeChange(theme.key)}
                  className="relative group"
                >
                  {/* Color preview */}
                  <div
                    className="w-full aspect-square rounded-xl border-2 border-white/[0.1] overflow-hidden transition-all hover:border-white/[0.3] hover:shadow-lg"
                    style={{
                      backgroundColor: PRESET_THEMES[theme.key].backgroundDark,
                    }}
                  >
                    {/* Inner accent line */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${PRESET_THEMES[theme.key].primaryColor}20, ${PRESET_THEMES[theme.key].accentColor}20)`,
                      }}
                    />
                  </div>

                  {/* Label */}
                  <p className="text-xs font-medium text-white/70 mt-2 text-center">
                    <span>{theme.emoji}</span> {theme.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Dark Themes Section */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 mb-2">
              🌙 Dark Themes
            </p>
            <div className="grid grid-cols-3 gap-2">
              {darkThemes.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => handleThemeChange(theme.key)}
                  className="relative group"
                >
                  {/* Color preview */}
                  <div
                    className="w-full aspect-square rounded-xl border-2 border-white/[0.1] overflow-hidden transition-all hover:border-white/[0.3] hover:shadow-lg"
                    style={{
                      backgroundColor: PRESET_THEMES[theme.key].backgroundDark,
                    }}
                  >
                    {/* Inner accent line */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${PRESET_THEMES[theme.key].primaryColor}40, ${PRESET_THEMES[theme.key].accentColor}40)`,
                      }}
                    />
                  </div>

                  {/* Label */}
                  <p className="text-xs font-medium text-white/70 mt-2 text-center">
                    <span>{theme.emoji}</span> {theme.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.1] pt-3 px-2">
            <p className="text-[11px] text-white/40 text-center">
              Your preference is saved locally
            </p>
          </div>
        </div>
      )}
    </>
  );
});
