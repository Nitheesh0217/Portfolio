// components/windows/TerminalWindow.tsx
// Boot sequence animation + live polling of /api/activity every 30s
'use client';

import { memo, useState, useEffect, useRef } from 'react';
import type { ActivityEntry } from '@/types/portfolio';

const BOOT_LINES = [
  '$ DWS_OS v2.0 — Spatial Portfolio Engine',
  '$ Initializing Neon Postgres connection...',
  '$ Connected to: neon-serverless (pooler)',
  '$ Loading portfolio index...',
  '$ Mounting window registry...',
  '$ Starting activity feed (30s interval)...',
  '',
  '$ System ready. Type anything or click Dock icons.',
  '──────────────────────────────────────────────',
];

const BOOT_DELAY_MS = 80;

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TYPE_COLORS: Record<string, string> = {
  deploy:    'text-emerald-400',
  commit:    'text-violet-400',
  cert:      'text-amber-400',
  collab:    'text-sky-400',
  milestone: 'text-fuchsia-400',
};

export const TerminalWindow = memo(function TerminalWindow() {
  const [bootLines, setBootLines]   = useState<string[]>([]);
  const [activity,  setActivity]    = useState<ActivityEntry[]>([]);
  const [pollErr,   setPollErr]     = useState<string | null>(null);
  const [bootDone,  setBootDone]    = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Boot animation
  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i >= BOOT_LINES.length) { setBootDone(true); return; }
      setBootLines((prev) => [...prev, BOOT_LINES[i++]]);
      setTimeout(tick, BOOT_DELAY_MS);
    };
    tick();
  }, []);

  // Activity polling
  useEffect(() => {
    if (!bootDone) return;
    const poll = async () => {
      try {
        const r = await fetch('/api/activity');
        if (!r.ok) throw new Error(`${r.status}`);
        const data: ActivityEntry[] = await r.json();
        setActivity(data);
        setPollErr(null);
      } catch (e) {
        setPollErr(`ERR: activity feed unreachable (${(e as Error).message})`);
      }
    };
    poll();
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, [bootDone]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bootLines, activity]);

  return (
    <div
      className="font-mono text-[12px] p-10 overflow-y-auto leading-relaxed w-full h-full flex-1"
      style={{
        color: 'rgba(255,255,255,0.55)',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(139,92,246,0.2) transparent',
      }}
    >
      {bootLines.map((line, i) => (
        <p key={i} className={line?.startsWith('$') ? 'text-violet-300/80' : line?.startsWith('──') ? 'text-white/10' : ''}>
          {line || ' '}
        </p>
      ))}

      {bootDone && (
        <>
          {pollErr && (
            <p className="text-red-400/70 mt-2">{pollErr}</p>
          )}
          {activity.length > 0 && (
            <div className="mt-2">
              <p className="text-white/20 mb-2">$ recent activity —</p>
              {activity.map((entry) => {
                const colorClass = TYPE_COLORS[entry.event_type] ?? 'text-white/50';
                return (
                  <p key={entry.id} className="flex items-baseline gap-2">
                    <span className={`shrink-0 ${colorClass} font-semibold`}>[{entry.event_type}]</span>
                    <span className="flex-1">{entry.description}</span>
                    <span className="shrink-0 text-white/20 text-[10px] tabular-nums">{formatRelative(entry.created_at)}</span>
                  </p>
                );
              })}
            </div>
          )}
          <p className="mt-2 flex items-center gap-0.5">
            <span className="text-violet-300/70">$</span>
            <span className="inline-block w-[7px] h-[13px] bg-violet-400/50 animate-pulse ml-1" />
          </p>
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
});
