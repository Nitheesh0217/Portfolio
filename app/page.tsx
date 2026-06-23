'use client';
// app/page.tsx — DesktopCanvas
// Root orchestrator for the Spatial UI Engine
// ─────────────────────────────────────────────────────────────────────────────

import {
  useReducer, useRef, useCallback, useEffect,
  useMemo, memo, useState,
} from 'react';
import {
  BarChart2, Mail, Lock, RotateCw, ChevronLeft, ChevronRight,
  Share, Plus, Cast,
} from 'lucide-react';

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
// DesktopBackground — quiet, visionOS keeps the environment minimal so the
// glass panels are the focus. All the ambient light comes from BackgroundImage.
// ─────────────────────────────────────────────────────────────────────────────
const DesktopBackground = memo(function DesktopBackground() {
  return null;
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
    <div className="p-5 overflow-y-auto h-full">
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

  // Single-window mode: only one panel shown at a time, centered.
  // Dock clicks just change which panel is showing.
  const [currentId, setCurrentId] = useState<WindowId>('welcome');
  const toggleWindow = useCallback((id: WindowId) => setCurrentId(id), []);
  const openAll  = useCallback(() => { /* no-op in single-window mode */ }, []);
  const closeAll = useCallback(() => { /* no-op in single-window mode */ }, []);

  // Build a synthetic windows record so the Dock can highlight the current panel.
  const dockWindows: Record<WindowId, WindowRecord> = useMemo(() => {
    const result = {} as Record<WindowId, WindowRecord>;
    for (const id of WINDOW_IDS) {
      result[id] = {
        ...windows[id],
        isOpen:      id === currentId,
        isMinimized: false,
        isFocused:   id === currentId,
      };
    }
    return result;
  }, [currentId, windows]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.metaKey || e.ctrlKey;
      if (!ctrl) return;
      const numKey = parseInt(e.key, 10);
      if (!isNaN(numKey) && numKey >= 1 && numKey <= WINDOW_IDS.length) {
        e.preventDefault();
        setCurrentId(WINDOW_IDS[numKey - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render the active panel's content
  const renderPanel = () => {
    switch (currentId) {
      case 'welcome':      return <WelcomeWindow onOpenServices={() => setCurrentId('projects')} />;
      case 'terminal':     return <TerminalWindow />;
      case 'projects':     return <ProjectsWindow projects={portfolio.projects} state={portfolio.dataState} />;
      case 'certificates': return <CertificatesWindow certificates={portfolio.certificates} dataState={portfolio.dataState} />;
      case 'metrics':      return <MetricsWindow metrics={portfolio.metrics} dataState={portfolio.dataState} />;
      case 'contact':      return <ContactWindow />;
      case 'assistant':    return <AIAssistantWindow />;
      case 'search':       return <SearchWindow projects={portfolio.projects} certificates={portfolio.certificates} metrics={portfolio.metrics} />;
      case 'timeline':     return <TimelineWindow projects={portfolio.projects} />;
      case 'skills':       return <SkillsWindow projects={portfolio.projects} />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#000000' }}>
      <BackgroundImage />
      <DesktopBackground />
      <MenuBar onOpenAll={openAll} onCloseAll={closeAll} />

      {/* Centered single-window stage */}
      <div className="absolute inset-0 flex items-center justify-center pl-24 pr-8 pointer-events-none">
        <div
          className="pointer-events-auto flex flex-col overflow-hidden"
          style={{
            width: currentId === 'welcome' ? '960px' : '88vw',
            height: currentId === 'welcome' ? 'auto' : '82vh',
            maxHeight: '85vh',
            background: 'linear-gradient(135deg, rgba(16, 16, 24, 0.65) 0%, rgba(10, 10, 15, 0.70) 100%)',
            backdropFilter: 'blur(50px) saturate(145%)',
            WebkitBackdropFilter: 'blur(50px) saturate(145%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '32px',
            boxShadow: [
              'inset 0 1px 0 rgba(255,255,255,0.10)',
              '0 24px 60px rgba(0,0,0,0.55)',
              '0 48px 120px rgba(0,0,0,0.40)',
            ].join(', '),
            transition: 'width 0.45s cubic-bezier(0.34, 1.3, 0.64, 1), height 0.45s cubic-bezier(0.34, 1.3, 0.64, 1)',
          }}
        >
          {/* Shared Browser Chrome Navbar */}
          <div
            className="flex items-center gap-4 px-6 py-2 shrink-0 select-none"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(0,0,0,0.15)',
            }}
          >
            {/* Left Side: Traffic / Action Icons */}
            <div className="flex items-center gap-2 text-white/30">
              <div className="grid grid-cols-2 gap-[2px] w-3 h-3 cursor-pointer hover:text-white/60 transition-colors">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="bg-current rounded-[1px]" />
                ))}
              </div>
              <div className="w-3 h-3 border border-current rounded-[2px] cursor-pointer hover:text-white/60 transition-colors" />
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1.5 text-white/30 ml-2">
              <ChevronLeft className="w-3.5 h-3.5 cursor-pointer hover:text-white/60 transition-colors" />
              <ChevronRight className="w-3.5 h-3.5 cursor-pointer hover:text-white/60 transition-colors" />
            </div>

            {/* Center: Address Bar */}
            <div className="flex-1 flex items-center justify-between px-4 py-1 rounded-full relative max-w-[400px] mx-auto"
                 style={{
                   background: 'rgba(255,255,255,0.03)',
                   border: '1px solid rgba(255,255,255,0.04)',
                 }}
            >
              <Lock className="w-3 h-3 text-white/25" />
              <span className="text-[11.5px] text-white/70 tracking-tight font-medium absolute left-1/2 transform -translate-x-1/2 select-text font-mono">
                {currentId === 'welcome' ? 'www.nitheesh.dev' : `www.nitheesh.dev/${currentId}`}
              </span>
              <RotateCw className="w-3 h-3 text-white/25 cursor-pointer hover:text-white/55 transition-colors" />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 text-white/30 ml-auto">
              <Share className="w-3.5 h-3.5 cursor-pointer hover:text-white/60 transition-colors" />
              <Plus  className="w-3.5 h-3.5 cursor-pointer hover:text-white/60 transition-colors" />
              <Cast  className="w-3.5 h-3.5 cursor-pointer hover:text-white/60 transition-colors" />
            </div>
          </div>

          {/* Active Window Body */}
          <div key={currentId} className="flex-1 overflow-auto relative animate-stage-in">
            {renderPanel()}
          </div>
        </div>
      </div>

      <Dock windows={dockWindows} onToggle={toggleWindow} />

      <p className="fixed bottom-2 right-4 text-[9px] text-white/15 font-mono pointer-events-none select-none" aria-hidden="true">
        DWS OS v2.0 · Spatial UI Engine · {new Date().getFullYear()}
      </p>

      <style jsx global>{`
        @keyframes stageIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1);    }
        }
        .animate-stage-in {
          animation: stageIn 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) both;
        }
      `}</style>
    </div>
  );
}
