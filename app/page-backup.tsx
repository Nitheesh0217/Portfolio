'use client';
// app/page.tsx — DesktopCanvas
// Root orchestrator for the Spatial UI Engine
// ─────────────────────────────────────────────────────────────────────────────

import {
  useReducer, useRef, useCallback, useEffect,
  useMemo, memo, useState,
} from 'react';
import { BarChart2, Mail } from 'lucide-react';

import { WindowId, WindowRecord, WINDOW_IDS } from '@/types/windows';
import {
  windowReducer,
  INITIAL_WINDOW_STATE,
  Z_BASE,
  Z_MAX,
  MENUBAR_HEIGHT,
} from '@/lib/windowReducer';
import { SystemWindow }        from '@/components/desktop/SystemWindow';
import { MenuBar }             from '@/components/desktop/MenuBar';
import { Dock }                from '@/components/desktop/Dock';
import { BackgroundImage }     from '@/components/desktop/BackgroundImage';
import { WelcomeWindow }       from '@/components/windows/WelcomeWindow';
import { ProjectsWindow }      from '@/components/windows/ProjectsWindow';
import { TerminalWindow }      from '@/components/windows/TerminalWindow';
import { CertificatesWindow }  from '@/components/windows/CertificatesWindow';
import { AIAssistantWindow }   from '@/components/windows/AIAssistantWindow';
import { SearchWindow }        from '@/components/windows/SearchWindow';
import { TimelineWindow }      from '@/components/windows/TimelineWindow';
import { SkillsWindow }        from '@/components/windows/SkillsWindow';

import type {
  ProjectSummary, Certificate, Metric, DataState,
} from '@/types/portfolio';

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio data state
// ─────────────────────────────────────────────────────────────────────────────

interface PortfolioState {
  projects:     ProjectSummary[];
  certificates: Certificate[];
  metrics:      Metric[];
  dataState:    DataState;
}

const PORTFOLIO_INITIAL: PortfolioState = {
  projects:     [],
  certificates: [],
  metrics:      [],
  dataState:    { status: 'loading' },
};

// ─────────────────────────────────────────────────────────────────────────────
// DesktopBackground — memo with zero props, renders ONCE
// ─────────────────────────────────────────────────────────────────────────────
const DesktopBackground = memo(function DesktopBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.12) 0%, transparent 60%)',
            'radial-gradient(ellipse at 80% 20%, rgba(217,70,239,0.08) 0%, transparent 50%)',
            'radial-gradient(ellipse at 60% 80%, rgba(59,130,246,0.05) 0%, transparent 40%)',
          ].join(', '),
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.20) 1px, transparent 1px)',
          backgroundSize:  '32px 32px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MetricsWindow — stat cards grid
// ─────────────────────────────────────────────────────────────────────────────
const MetricsWindow = memo(function MetricsWindow({
  metrics, dataState,
}: { metrics: Metric[]; dataState: DataState }) {

  if (dataState.status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        {[0,1,2].map((i) => (
          <span key={i}
            className="w-1.5 h-1.5 rounded-full bg-violet-400/50 animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    );
  }

  if (dataState.status === 'error') {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <p className="text-xs font-mono text-red-400/60 text-center">{dataState.error}</p>
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 p-6">
        <BarChart2 className="w-8 h-8 text-white/10" />
        <p className="text-xs text-white/25 font-mono">
          No metrics yet. Insert rows into the metrics table (period = 'all-time').
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 overflow-y-auto max-h-[440px]">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.id}
            className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
          >
            <p className="text-[34px] font-black text-white leading-none tracking-tight">
              {m.display_value ?? m.value.toLocaleString()}
              {m.unit !== 'count' ? (
                <span className="text-[20px] text-white/40 ml-0.5">{m.unit}</span>
              ) : null}
            </p>
            <p className="text-[12px] font-semibold text-white/55 mt-1">{m.label}</p>
            {m.context && (
              <p className="text-[10px] text-white/25 mt-0.5 leading-snug">{m.context}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ContactWindow
// ─────────────────────────────────────────────────────────────────────────────
const ContactWindow = memo(function ContactWindow() {
  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-[18px] font-bold text-white">Let&rsquo;s build something.</h3>
        <p className="text-sm text-white/45 mt-1 leading-relaxed">
          Full-stack apps, AI integrations, design systems — I&rsquo;m here for it.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <a
          href="/start-project"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all active:scale-95"
        >
          <Mail className="w-4 h-4" />
          Start a Project
        </a>
        <a
          href="mailto:nitheeshd.17@gmail.com"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/[0.10] hover:border-white/[0.20] text-white/60 hover:text-white text-sm transition-all active:scale-95"
        >
          nitheeshd.17@gmail.com
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'GitHub',   href: 'https://github.com/' },
          { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
          { label: 'Twitter',  href: 'https://twitter.com/' },
          { label: 'Dribbble', href: 'https://dribbble.com/' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-2 rounded-lg border border-white/[0.06] text-white/35 hover:text-white/70 text-xs font-medium transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// getDockAction
// ─────────────────────────────────────────────────────────────────────────────
function getDockAction(win: WindowRecord, id: WindowId, nextZ: number) {
  if (!win.isOpen)     return { type: 'OPEN'     as const, id, nextZ };
  if (win.isMinimized) return { type: 'RESTORE'  as const, id, nextZ };
  if (win.isFocused)   return { type: 'MINIMIZE' as const, id };
  return                      { type: 'FOCUS'    as const, id, nextZ };
}

// ─────────────────────────────────────────────────────────────────────────────
// DesktopCanvas
// ─────────────────────────────────────────────────────────────────────────────
export default function DesktopCanvas() {
  const [windows, dispatch] = useReducer(windowReducer, INITIAL_WINDOW_STATE);
  const zCounter = useRef(Z_BASE + 2);
  const [portfolio, setPortfolio] = useState<PortfolioState>(PORTFOLIO_INITIAL);

  // Parallel-fetch all static portfolio data on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then((r) => { if (!r.ok) throw new Error(`/api/projects → ${r.status}`); return r.json(); }),
      fetch('/api/certificates').then((r) => { if (!r.ok) throw new Error(`/api/certificates → ${r.status}`); return r.json(); }),
      fetch('/api/metrics').then((r) => { if (!r.ok) throw new Error(`/api/metrics → ${r.status}`); return r.json(); }),
    ])
      .then(([projects, certificates, metrics]) => {
        setPortfolio({ projects, certificates, metrics, dataState: { status: 'success' } });
      })
      .catch((err: Error) => {
        console.error('[DesktopCanvas] portfolio fetch failed:', err);
        setPortfolio((prev) => ({
          ...prev,
          dataState: { status: 'error', error: err.message },
        }));
      });
  }, []);

  // Z-normalization guard
  useEffect(() => {
    if (zCounter.current < Z_MAX - 5) return;
    const openIds = WINDOW_IDS
      .filter((id) => windows[id].isOpen)
      .sort((a, b) => windows[a].zIndex - windows[b].zIndex);
    const assignments: Partial<Record<WindowId, number>> = {};
    openIds.forEach((id, i) => { assignments[id] = Z_BASE + i; });
    zCounter.current = Z_BASE + openIds.length;
    dispatch({ type: 'NORMALIZE_Z', assignments });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windows]);

  // Stable per-window dispatch wrappers
  const handlers = useMemo(() => {
    const h = {} as Record<WindowId, {
      focus: () => void; close: () => void;
      minimize: () => void; move: (x: number, y: number) => void;
    }>;
    for (const id of WINDOW_IDS) {
      h[id] = {
        focus:    () => dispatch({ type: 'FOCUS',    id, nextZ: ++zCounter.current }),
        close:    () => dispatch({ type: 'CLOSE',    id }),
        minimize: () => dispatch({ type: 'MINIMIZE', id }),
        move:     (x, y) => dispatch({ type: 'MOVE', id, x, y }),
      };
    }
    return h;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleWindow = useCallback((id: WindowId) => {
    dispatch(getDockAction(windows[id], id, ++zCounter.current));
  }, [windows]);

  const openAll  = useCallback(() => { zCounter.current += WINDOW_IDS.length; dispatch({ type: 'OPEN_ALL', nextZ: zCounter.current }); }, []);
  const closeAll = useCallback(() => { dispatch({ type: 'CLOSE_ALL' }); }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.metaKey || e.ctrlKey;
      if (!ctrl) return;
      const focusedId = WINDOW_IDS.find((id) => windows[id].isFocused);
      switch (e.key) {
        case 'w': e.preventDefault(); if (focusedId) dispatch({ type: 'CLOSE',    id: focusedId }); return;
        case 'm': e.preventDefault(); if (focusedId) dispatch({ type: 'MINIMIZE', id: focusedId }); return;
        case ',': e.preventDefault(); dispatch({ type: 'OPEN', id: 'contact', nextZ: ++zCounter.current }); return;
      }
      const numKey = parseInt(e.key, 10);
      if (!isNaN(numKey) && numKey >= 1 && numKey <= WINDOW_IDS.length) {
        e.preventDefault();
        dispatch({ type: 'OPEN', id: WINDOW_IDS[numKey - 1], nextZ: ++zCounter.current });
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const focusedId = WINDOW_IDS.find((id) => windows[id].isFocused);
      if (focusedId) dispatch({ type: 'MINIMIZE', id: focusedId });
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [windows]);

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#000000' }}>
      <BackgroundImage />
      <DesktopBackground />
      <MenuBar onOpenAll={openAll} onCloseAll={closeAll} />

      {WINDOW_IDS.map((id) => {
        const win = windows[id];
        if (!win.isMounted) return null;
        const isVisible = win.isOpen && !win.isMinimized;
        const h = handlers[id];

        return (
          <SystemWindow
            key={id}
            win={win}
            isVisible={isVisible}
            onFocus={h.focus}
            onClose={h.close}
            onMinimize={h.minimize}
            onMove={h.move}
          >
            {id === 'welcome'      && <WelcomeWindow onOpenServices={() => dispatch({ type: 'OPEN', id: 'projects', nextZ: ++zCounter.current })} />}
            {id === 'terminal'     && <TerminalWindow />}
            {id === 'projects'     && <ProjectsWindow projects={portfolio.projects} state={portfolio.dataState} />}
            {id === 'certificates' && <CertificatesWindow certificates={portfolio.certificates} dataState={portfolio.dataState} />}
            {id === 'metrics'      && <MetricsWindow metrics={portfolio.metrics} dataState={portfolio.dataState} />}
            {id === 'contact'      && <ContactWindow />}
            {id === 'assistant'    && <AIAssistantWindow />}
            {id === 'search'       && <SearchWindow projects={portfolio.projects} certificates={portfolio.certificates} metrics={portfolio.metrics} />}
            {id === 'timeline'     && <TimelineWindow projects={portfolio.projects} />}
            {id === 'skills'       && <SkillsWindow projects={portfolio.projects} />}
          </SystemWindow>
        );
      })}

      <Dock windows={windows} onToggle={toggleWindow} />

      <p className="fixed bottom-2 right-4 text-[9px] text-white/10 font-mono pointer-events-none select-none" aria-hidden="true">
        DWS OS v2.0 · Spatial UI Engine · {new Date().getFullYear()}
      </p>
    </div>
  );
}
