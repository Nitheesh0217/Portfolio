// components/desktop/MenuBar.tsx
import { memo, useState } from 'react';
import { Command }        from 'lucide-react';

export interface MenuBarProps {
  onOpenAll:  () => void;
  onCloseAll: () => void;
}

export const MenuBar = memo(function MenuBar({ onOpenAll, onCloseAll }: MenuBarProps) {
  const [time] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  );

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-4 h-7 select-none"
      style={{
        background:    'rgba(8,8,18,0.80)',
        backdropFilter:'blur(20px)',
        borderBottom:  '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Left — brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-white/90">
          <Command className="w-3 h-3" />
          <span className="text-[11px] font-bold tracking-wide">DWS OS</span>
        </div>

        <div className="flex items-center gap-0.5">
          {[
            { label: 'File',  items: [{ label: 'Open All Windows', action: onOpenAll }, { label: 'Close All', action: onCloseAll }] },
            { label: 'View',  items: [] },
            { label: 'Help',  items: [] },
          ].map(({ label, items }) => (
            <div key={label} className="relative group">
              <button className="px-2 py-0.5 text-[11px] text-white/50 hover:text-white/90 hover:bg-white/[0.08] rounded transition-colors">
                {label}
              </button>
              {items.length > 0 && (
                <div className="absolute top-full left-0 mt-0.5 py-1 rounded-lg border border-white/[0.10] bg-black/80 backdrop-blur-xl hidden group-focus-within:block shadow-2xl min-w-[180px]">
                  {items.map(({ label: itemLabel, action }) => (
                    <button
                      key={itemLabel}
                      onClick={action}
                      className="w-full text-left px-4 py-1.5 text-[11px] text-white/65 hover:text-white hover:bg-white/[0.08] transition-colors"
                    >
                      {itemLabel}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right — clock + status */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-white/30 tabular-nums">{time}</span>
        <span className="text-[9px] font-mono text-emerald-400/60 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-emerald-400/60 animate-pulse inline-block" />
          Live
        </span>
      </div>
    </div>
  );
});
