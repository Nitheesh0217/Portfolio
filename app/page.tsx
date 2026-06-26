'use client';
// app/page.tsx — DesktopCanvas
// Root orchestrator for the Spatial UI Engine
// ─────────────────────────────────────────────────────────────────────────────

import {
  useReducer, useRef, useCallback, useEffect,
  useMemo, memo, useState,
} from 'react';
import { Mail, Copy, Check, Lock, RefreshCw, MessageSquare } from 'lucide-react';

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
import { MindMap }             from '@/components/desktop/MindMap';
import { BackgroundImage }     from '@/components/desktop/BackgroundImage';
import { BrowserToolbar }      from '@/components/desktop/BrowserToolbar';
import { WelcomeWindow }       from '@/components/windows/WelcomeWindow';
import { ProjectsWindow }      from '@/components/windows/ProjectsWindow';
import { TerminalWindow }      from '@/components/windows/TerminalWindow';
import { CertificatesWindow }  from '@/components/windows/CertificatesWindow';
import { AIAssistantWindow }   from '@/components/windows/AIAssistantWindow';
import { SearchWindow }        from '@/components/windows/SearchWindow';
import { TimelineWindow }      from '@/components/windows/TimelineWindow';
import { SkillsWindow }        from '@/components/windows/SkillsWindow';
import { FreelanceWindow }     from '@/components/windows/FreelanceWindow';
import { MetricsWindow }      from '@/components/windows/MetricsWindow';

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
// ContactWindow
// ─────────────────────────────────────────────────────────────────────────────
const ContactWindow = memo(function ContactWindow() {
  return (
    <div className="flex-1 w-full h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-8 pt-7 pb-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)' }}>
          <MessageSquare style={{ width: 15, height: 15, color: '#a78bfa' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-black text-white tracking-tight">Let&rsquo;s Collaborate</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Response within 12 hours · Remote or hybrid</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold" style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#34d399' }} />
          Open to work
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 px-12 py-8 md:px-16 overflow-y-auto min-h-0">
        {/* Left side */}
        <div className="flex-1 flex flex-col gap-6 text-left max-w-[400px]">
          <h2 className="text-white font-black leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(28px, 3.2vw, 44px)' }}>
            AI Engineering.<br />
            Data pipelines.<br />
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>Always shipped.</span>
          </h2>
          <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            RAG pipelines, multi-agent orchestration, Snowflake ETL, real-time SaaS — I build the system, then I measure the receipts.
          </p>
          {/* Social row */}
          <div className="flex gap-2">
            {[
              { label: 'GitHub',   href: 'https://github.com/Nitheesh0217' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
              { label: 'Twitter',  href: 'https://twitter.com/' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 rounded-xl text-[11px] font-semibold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.45)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.80)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Right side: contact card */}
        <div
          className="w-full max-w-[380px] rounded-3xl p-7 flex flex-col gap-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.30)',
          }}
        >
          <div>
            <h3 className="text-[14px] font-black text-white tracking-tight">Direct Channels</h3>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Fastest way to reach me.</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <a
              href="mailto:nitheeshd.17@gmail.com"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl text-[13px] font-extrabold transition-all active:scale-[0.98] hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#1a0e00',
                boxShadow: '0 8px 24px rgba(245,158,11,0.25)',
              }}
            >
              <Mail className="w-4 h-4" />
              nitheeshd.17@gmail.com
            </a>
            <a
              href="https://linkedin.com/in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-2xl text-[13px] font-semibold transition-all active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.70)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.70)'; }}
            >
              Connect on LinkedIn ↗
            </a>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(167,139,250,0.15)' }}>
              <span className="text-[13px]">👋</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/70">Available for freelance</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>STEM OPT · Miramar, FL · Remote-first</p>
            </div>
          </div>
        </div>
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
// ── Per-project demo credentials shown in the Smart Suggestion HUD ───────────
const DEMO_CREDENTIALS: Record<string, { label: string; email: string; password: string }[]> = {
  'coach-jake': [
    { label: 'Head Coach', email: 'coach@demo.com', password: 'demo123' },
    { label: 'Player',     email: 'player@demo.com', password: 'demo123' },
  ],
  'd-scent-house': [
    { label: 'Admin', email: 'admin@demo.com', password: 'demo123' },
  ],
};

export default function DesktopCanvas() {
  const [windows, dispatch] = useReducer(windowReducer, INITIAL_WINDOW_STATE);
  const zCounter = useRef(Z_BASE + 2);
  const [portfolio, setPortfolio] = useState<PortfolioState>(PORTFOLIO_INITIAL);
  const [activeProject, setActiveProject] = useState<ProjectSummary | null>(null);
  const [iframeUrl, setIframeUrl]         = useState<string>('');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const iframeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mindMapData, setMindMapData] = useState<{ nodes: any[]; edges: any[] } | null>(null);
  const [mindMapLoading, setMindMapLoading] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx]   = useState<number | null>(null);
  const [leftFanned, setLeftFanned] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    if (activeProject) {
      const url = activeProject.live_url || '';
      setIframeUrl(url);
      setIframeLoading(true);
      setIframeBlocked(false);
      if (iframeTimeoutRef.current) clearTimeout(iframeTimeoutRef.current);
      iframeTimeoutRef.current = setTimeout(() => {
        setIframeLoading(false);
        setIframeBlocked(true);
      }, 12000);
    }
    return () => {
      if (iframeTimeoutRef.current) clearTimeout(iframeTimeoutRef.current);
    };
  }, [activeProject]);

  useEffect(() => {
    if (!activeProject) {
      setMindMapData(null);
      return;
    }

    setMindMapLoading(true);
    fetch('/api/generate-mindmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: activeProject.slug,
        title: activeProject.title,
        description: activeProject.problem_statement || '',
        approach: activeProject.approach || '',
        stack: activeProject.stack || []
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMindMapData(data);
        setMindMapLoading(false);
      })
      .catch((err) => {
        console.error('Error loading mind map:', err);
        setMindMapLoading(false);
      });
  }, [activeProject]);

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

  // Single-window mode with navigation history tracking
  const [navHistory, setNavHistory] = useState<WindowId[]>(['welcome']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentId = navHistory[historyIndex] ?? 'welcome';

  const navigateTo = useCallback((id: WindowId) => {
    setActiveProject(null); // Reset detail view
    // If navigating to the current page, do nothing
    if (id === navHistory[historyIndex]) return;
    
    // Slice history up to current index
    const newHistory = navHistory.slice(0, historyIndex + 1);
    newHistory.push(id);
    setNavHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [navHistory, historyIndex]);

  const navigateBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  const navigateForward = useCallback(() => {
    if (historyIndex < navHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, navHistory]);

  const toggleWindow = useCallback((id: WindowId) => navigateTo(id), [navigateTo]);
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
        navigateTo(WINDOW_IDS[numKey - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTo]);

  // Render the active panel's content
  const renderPanel = () => {
    switch (currentId) {
      case 'welcome':      return <WelcomeWindow onOpenServices={() => navigateTo('projects')} onStartProject={() => navigateTo('freelance')} />;
      case 'terminal':     return <TerminalWindow />;
      case 'projects':     return <ProjectsWindow projects={portfolio.projects} state={portfolio.dataState} onSelectProject={setActiveProject} />;
      case 'certificates': return <CertificatesWindow certificates={portfolio.certificates} dataState={portfolio.dataState} />;
      case 'metrics':      return <MetricsWindow metrics={portfolio.metrics} dataState={portfolio.dataState} />;
      case 'contact':      return <ContactWindow />;
      case 'assistant':    return <AIAssistantWindow />;
      case 'search':       return <SearchWindow projects={portfolio.projects} certificates={portfolio.certificates} metrics={portfolio.metrics} />;
      case 'timeline':     return <TimelineWindow projects={portfolio.projects} />;
      case 'skills':       return <SkillsWindow projects={portfolio.projects} />;
      case 'freelance':    return <FreelanceWindow />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#000000' }}>
      <BackgroundImage />
      <DesktopBackground />
      <MenuBar onOpenAll={openAll} onCloseAll={closeAll} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 p-6">
        {/* Centered Main Window Container — sits exactly in the center of the screen */}
        <div className="relative pointer-events-auto flex items-center justify-center">
          {/* Module B: Top Browser Bar — centered directly on top of the main window */}
          <BrowserToolbar
            currentId={currentId}
            onNavigate={navigateTo}
            onBack={activeProject ? () => setActiveProject(null) : navigateBack}
            onForward={navigateForward}
            canGoBack={activeProject ? true : historyIndex > 0}
            canGoForward={historyIndex < navHistory.length - 1}
            customPath={activeProject ? `/projects/${activeProject.slug}` : undefined}
            className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 z-[9997] flex items-center gap-3 px-4 py-2"
          />

          {/* Module A: Left Dock Rail — positioned right beside the window without shifting it */}
          {!activeProject && (
            <Dock
              windows={dockWindows}
              onToggle={toggleWindow}
              className="absolute right-full mr-6 top-1/2 -translate-y-1/2 z-[9998]"
            />
          )}

          {activeProject ? (
            /* ── Zero-Bezel Panoramic Spatial Workspace ── */
            <div
              className="flex flex-row items-center justify-center gap-5 animate-stage-in"
              style={{
                perspective: '2400px',
                perspectiveOrigin: '50% 48%',
                width: '97vw',
                maxWidth: '1800px',
                height: '86vh',
                maxHeight: '940px',
                minHeight: '660px',
              }}
            >

              {/* ══════════════════════════════════════════════
                  LEFT — Z-Axis Holo-Deck
                  3 absolute glass cards stacked in 3D space.
                  Hover parent to fan out; click to reorder.
                  ══════════════════════════════════════════════ */}
              <div
                className="spatial-glow-left transform-gpu backface-hidden will-change-[transform,opacity] w-[24vw] min-w-[280px] max-w-[380px] h-[75vh] flex-shrink-0 z-20 rounded-3xl relative flex items-center justify-center"
                style={{ transform: 'translateZ(-50px) scale(0.95)', transformOrigin: 'right center', perspective: '1000px' }}
                onMouseEnter={() => setLeftFanned(true)}
                onMouseLeave={() => setLeftFanned(false)}
              >
                {(() => {
                  const deckCards = [
                    {
                      id: 'impact',
                      label: 'Impact',
                      accent: '#4ade80',
                      accentBg: 'rgba(74,222,128,0.08)',
                      content: activeProject.roi_value ? (
                        <div className="flex flex-col h-full">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">ROI Metric</span>
                          </div>
                          {/* KPI ring */}
                          {(() => {
                            const r = 38; const circ = 2 * Math.PI * r;
                            const raw = parseInt(activeProject.roi_value!.replace(/[^0-9]/g, '')) || 75;
                            const pct = Math.min(raw > 100 ? 80 : raw, 100);
                            const off = circ * (1 - pct / 100);
                            return (
                              <div className="flex flex-col items-center gap-4 flex-1 justify-center">
                                <div className="relative">
                                  <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90 transform-gpu" aria-hidden="true">
                                    <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
                                    <circle cx="50" cy="50" r={r} fill="none" stroke="#4ade80" strokeWidth="6"
                                      strokeLinecap="round" strokeDasharray={circ}
                                      style={{ strokeDashoffset: circ, filter: 'drop-shadow(0 0 8px rgba(74,222,128,0.9))', animation: 'kpiRingFill 1.8s cubic-bezier(0.34,1.2,0.64,1) 0.3s forwards', ['--ring-target' as string]: `${off}` }}
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-[22px] font-black text-white leading-none">{activeProject.roi_value}</span>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <p className="text-[13px] font-bold text-white/90">{activeProject.roi_label}</p>
                                  {activeProject.roi_context && <p className="text-[10px] text-white/40 mt-1 leading-relaxed">{activeProject.roi_context}</p>}
                                </div>
                                {activeProject.stack && activeProject.stack.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                                    {activeProject.stack.slice(0, 5).map(t => (
                                      <span key={t} className="px-2.5 py-0.5 rounded-full text-[8px] font-mono text-emerald-300/80"
                                        style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.22)' }}>{t}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      ) : null,
                    },
                    {
                      id: 'solution',
                      label: 'Solution',
                      accent: '#60a5fa',
                      accentBg: 'rgba(96,165,250,0.08)',
                      content: activeProject.approach ? (
                        <div className="flex flex-col h-full">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">The Approach</span>
                          </div>
                          <p className="text-[12px] text-white/80 leading-relaxed flex-1">{activeProject.approach}</p>
                          {activeProject.process_notes && (
                            <div className="mt-4 pt-4 border-t border-white/[0.06]">
                              <p className="text-[9px] font-black uppercase tracking-widest text-blue-400/60 mb-1.5">Architecture</p>
                              <p className="text-[10.5px] text-white/55 leading-relaxed">{activeProject.process_notes}</p>
                            </div>
                          )}
                        </div>
                      ) : null,
                    },
                    {
                      id: 'challenge',
                      label: 'Challenge',
                      accent: '#a78bfa',
                      accentBg: 'rgba(167,139,250,0.08)',
                      content: activeProject.problem_statement ? (
                        <div className="flex flex-col h-full">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-violet-400">The Problem</span>
                          </div>
                          <p className="text-[12px] text-white/80 leading-relaxed flex-1">{activeProject.problem_statement}</p>
                          {activeProject.testimonial_quote && (
                            <div className="mt-4 pt-4 border-t border-white/[0.06]">
                              <p className="text-[10.5px] italic text-white/55 leading-relaxed">&ldquo;{activeProject.testimonial_quote}&rdquo;</p>
                              <p className="text-[8.5px] font-bold mt-1.5 text-violet-400/60">— {activeProject.testimonial_author}</p>
                            </div>
                          )}
                        </div>
                      ) : null,
                    },
                  ].filter(c => c.content !== null);

                  // Z-stack order: activeCard is front, others recede
                  return deckCards.map((card, i) => {
                    const stackPos = (i - activeCard + deckCards.length) % deckCards.length;
                    const isFront = stackPos === 0;

                    // Default stacked 3D positions
                    const defaultTransforms: Record<number, string> = {
                      0: 'translateZ(0px) translateY(0px) scale(1)',
                      1: 'translateZ(-50px) translateY(-20px) scale(0.95)',
                      2: 'translateZ(-100px) translateY(-40px) scale(0.90)',
                    };
                    // Fanned positions — spread downward so all headers visible
                    const fannedTransforms: Record<number, string> = {
                      0: 'translateZ(0px) translateY(-60px) scale(1)',
                      1: 'translateZ(0px) translateY(30px) scale(0.97)',
                      2: 'translateZ(0px) translateY(120px) scale(0.94)',
                    };
                    const defaultOpacity = [1, 0.55, 0.25][stackPos] ?? 0.25;
                    const defaultBlur = ['none', 'blur(1.5px)', 'blur(3px)'][stackPos] ?? 'blur(3px)';
                    const zIndex = [30, 20, 10][stackPos] ?? 10;

                    const transform = leftFanned ? (fannedTransforms[stackPos] ?? defaultTransforms[stackPos]) : (defaultTransforms[stackPos] ?? defaultTransforms[2]);
                    const opacity = leftFanned ? 1 - stackPos * 0.12 : defaultOpacity;
                    const blur = leftFanned ? 'none' : defaultBlur;

                    return (
                      <div
                        key={card.id}
                        onClick={() => !leftFanned && setActiveCard(i)}
                        className="absolute transform-gpu will-change-[transform,opacity] w-full rounded-3xl p-6 cursor-pointer select-none"
                        style={{
                          height: '82%',
                          background: `linear-gradient(145deg, rgba(0,0,0,0.55) 0%, ${card.accentBg} 100%)`,
                          backdropFilter: 'blur(24px)',
                          border: isFront ? `1px solid ${card.accent}30` : '1px solid rgba(255,255,255,0.07)',
                          borderTop: isFront ? `1px solid ${card.accent}50` : '1px solid rgba(255,255,255,0.14)',
                          boxShadow: isFront
                            ? `0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px ${card.accent}15, inset 0 1px 0 rgba(255,255,255,0.08)`
                            : '0 16px 48px rgba(0,0,0,0.5)',
                          transform,
                          opacity,
                          filter: blur === 'none' ? undefined : blur,
                          zIndex,
                          transition: 'transform 0.7s cubic-bezier(0.23,1,0.32,1), opacity 0.7s ease, filter 0.7s ease, box-shadow 0.3s ease',
                        }}
                        onMouseEnter={e => {
                          if (leftFanned) e.currentTarget.style.borderColor = `${card.accent}50`;
                        }}
                        onMouseLeave={e => {
                          if (leftFanned) e.currentTarget.style.borderColor = isFront ? `${card.accent}30` : 'rgba(255,255,255,0.07)';
                        }}
                      >
                        {/* Card label tab — always visible */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: card.accent, boxShadow: `0 0 6px ${card.accent}` }} />
                          <span className="text-[9px] font-black uppercase tracking-[0.20em]" style={{ color: card.accent }}>{card.label}</span>
                          {isFront && <span className="ml-auto text-[7.5px] text-white/25 font-mono">ACTIVE</span>}
                        </div>
                        {/* Content */}
                        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 28px)' }}>
                          {card.content}
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Deck navigation dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                  {[0, 1, 2].map(i => (
                    <button key={i} onClick={() => setActiveCard(i)}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300 transform-gpu"
                      style={{ background: i === activeCard ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', transform: i === activeCard ? 'scale(1.4)' : 'scale(1)' }}
                    />
                  ))}
                </div>
              </div>

              {/* ══════════════════════════════════════════════
                  CENTER — Zero-Bezel Cinematic Canvas
                  Relative wrapper lets the visionOS pill
                  float above the window at absolute -top-14.
                  ══════════════════════════════════════════════ */}
              <div className="relative flex-shrink-0 z-10 w-[55vw] min-w-[900px] max-w-5xl">

                {/* ── visionOS Floating Top Pill — icon-only buttons, no URL ── */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>

                  {/* Live button */}
                  {activeProject.live_url && (
                    <button
                      onClick={() => { setIframeUrl(activeProject.live_url!); setIframeLoading(true); setIframeBlocked(false); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:bg-white/10"
                      style={{ color: iframeUrl === activeProject.live_url ? '#fbbf24' : 'rgba(255,255,255,0.70)' }}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        {iframeUrl === activeProject.live_url && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />}
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: iframeUrl === activeProject.live_url ? '#fbbf24' : 'rgba(255,255,255,0.30)' }} />
                      </span>
                      Live ↗
                    </button>
                  )}

                  {/* Divider */}
                  {activeProject.live_url && activeProject.github_url && (
                    <span className="w-px h-4 bg-white/15 shrink-0" />
                  )}

                  {/* GitHub button — icon + text */}
                  {activeProject.github_url && (
                    <button
                      onClick={() => { setIframeUrl(activeProject.github_url!); setIframeLoading(true); setIframeBlocked(false); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:bg-white/10"
                      style={{ color: iframeUrl === activeProject.github_url ? '#a78bfa' : 'rgba(255,255,255,0.70)' }}
                    >
                      {/* GitHub SVG logo */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      GitHub
                    </button>
                  )}
                </div>

                {/* GPU-isolated outer — filter here, never on the blur layer */}
                <div
                  className="spatial-glow-center transform-gpu backface-hidden will-change-[transform,opacity] transition-all duration-500 ease-out w-full h-[75vh] rounded-[2rem]"
                  style={{ transform: 'translateZ(0px)' }}
                >
                {/*
                  ┌─ LAYER 1: OLED Canvas ──────────────────────────────────────┐
                  │ overflow:hidden + rounded corners clip EVERYTHING inside,    │
                  │ including the scrollbar pushed out by the +20px iframe trick │
                  └─────────────────────────────────────────────────────────────┘
                */}
                <div
                  className="w-full h-full bg-[#050505] rounded-[2rem] overflow-hidden relative"
                  style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}
                >
                  {iframeBlocked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-[#050505]">
                      <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl mb-5"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
                        🔒
                      </div>
                      <h3 className="text-white text-[16px] font-bold tracking-tight">Frame Protection Active</h3>
                      <p className="text-[12px] text-white/40 max-w-[320px] mt-2.5 leading-relaxed">
                        {activeProject.title} enforces X-Frame-Options. Open it directly.
                      </p>
                      <div className="flex gap-3 mt-7">
                        <a href={activeProject.live_url || undefined} target="_blank" rel="noopener noreferrer"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 active:scale-95 text-[#0e0d14] text-[12px] font-bold shadow-lg shadow-amber-400/15 transition-all">
                          Launch Live ↗
                        </a>
                        {activeProject.github_url && (
                          <a href={activeProject.github_url} target="_blank" rel="noopener noreferrer"
                            className="px-6 py-2.5 rounded-xl text-white/60 hover:text-white text-[12px] font-semibold transition-all"
                            style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
                            View GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {iframeLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#050505] z-20">
                          <div className="flex gap-1.5">
                            {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />)}
                          </div>
                          <p className="text-[10px] font-mono text-white/25">Connecting to live deployment...</p>
                        </div>
                      )}
                      {/* Scrollbar kill: absolute div is 24px wider than container,
                          pushing the scrollbar past the overflow-hidden boundary */}
                      <div className="absolute top-0 left-0 h-full" style={{ width: 'calc(100% + 24px)' }}>
                        <iframe
                          key={iframeUrl}
                          src={iframeUrl}
                          onLoad={() => { if (iframeTimeoutRef.current) clearTimeout(iframeTimeoutRef.current); setIframeLoading(false); }}
                          className={`w-full h-full border-none bg-[#050505] transition-opacity duration-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
                          title={activeProject.title}
                          allow="clipboard-write"
                          style={{ display: 'block', scrollbarWidth: 'none' }}
                        />
                      </div>
                    </>
                  )}
                </div>
                </div>{/* /gpu outer */}
              </div>{/* /relative center wrapper */}

              {/* ══════════════════════════════════════════════
                  RIGHT — Live Telemetry HUD
                  Biometric tilt-card → Siri breathing core
                  → AI pills → SVG neural data pulse map
                  ══════════════════════════════════════════════ */}
              <div
                className="spatial-glow-right transform-gpu backface-hidden will-change-[transform,opacity] transition-all duration-500 ease-out w-[24vw] min-w-[280px] max-w-[380px] h-[75vh] flex-shrink-0 z-20 rounded-3xl"
                style={{ transform: 'translateZ(-50px) scale(0.95)', transformOrigin: 'left center' }}
              >
                <div
                  className="w-full h-full bg-black/60 backdrop-blur-2xl rounded-3xl flex flex-col overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 24px 64px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)' }}
                >
                  {/* ── Module A: Biometric Tilt-Card ── */}
                  {DEMO_CREDENTIALS[activeProject.slug] ? (
                    <div className="mx-3 mt-3 shrink-0 rounded-2xl p-4 relative overflow-hidden transition-all duration-300 cursor-default"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%, rgba(255,255,255,0.05) 100%)',
                        border: '1px solid rgba(255,255,255,0.20)',
                        boxShadow: '0 0 30px rgba(255,255,255,0.05)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.40)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.05)'; }}
                    >
                      {/* Holographic diagonal sheen overlay */}
                      <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                        <div className="absolute inset-0"
                          style={{ background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.12) 50%, transparent 80%)', animation: 'holoSheen 3.5s ease-in-out infinite' }} />
                      </div>
                      {/* Verified badge */}
                      <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-emerald-400/80">Verified</span>
                      </div>
                      <p className="text-[7.5px] font-black uppercase tracking-wider text-yellow-400/80 mb-2.5 relative z-10">
                        ⬡ Demo Access Keys
                      </p>
                      <div className="flex flex-col gap-1.5 relative z-10">
                        {DEMO_CREDENTIALS[activeProject.slug].map((cred, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-[7px] font-bold text-white/35 uppercase tracking-widest">{cred.label}</span>
                              <span className="font-mono text-[9px] text-white/85 truncate">{cred.email}</span>
                              <span className="font-mono text-[8.5px] text-white/45">{cred.password}</span>
                            </div>
                            <button onClick={() => { navigator.clipboard.writeText(`${cred.email}\n${cred.password}`); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 1800); }}
                              className="shrink-0 transform-gpu will-change-[transform,opacity] w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white/80 hover:bg-white/[0.08] transition-all active:scale-90">
                              {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mx-3 mt-3 shrink-0 px-4 py-3 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-[8px] font-black uppercase tracking-[0.22em] text-violet-400">Live Telemetry</span>
                      <p className="text-[11px] text-white/50 mt-1 leading-snug">{activeProject.title}</p>
                    </div>
                  )}

                  {/* ── Module B: Breathing Siri-Core Orb ── */}
                  <div className="mx-3 mt-3 shrink-0 flex items-center gap-3">
                    <div className="relative flex-shrink-0 w-10 h-10 transform-gpu will-change-[transform,opacity]">
                      {/* Outer ping ring */}
                      <div className="absolute inset-0 rounded-full opacity-25"
                        style={{ background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #06b6d4, #6366f1)', animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }} />
                      {/* Core spinning orb */}
                      <div className="absolute inset-0 rounded-full"
                        style={{
                          background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #06b6d4, #6366f1)',
                          boxShadow: '0 0 18px rgba(139,92,246,0.7), 0 0 36px rgba(99,102,241,0.3)',
                          animation: 'siriOrb 4s linear infinite',
                        }} />
                      {/* Frosted glass center dot */}
                      <div className="absolute inset-[6px] rounded-full"
                        style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(4px)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-400 mb-0.5">AI Co-Pilot</p>
                      <p className="text-[9.5px] text-white/45">Ask me anything about this project</p>
                    </div>
                  </div>

                  {/* AI Pills — deeply inset dark glass */}
                  <div className="mx-3 mt-2 shrink-0 flex flex-col gap-1.5">
                    {[
                      activeProject.stack?.includes('LangChain') || activeProject.stack?.includes('Pinecone')
                        ? 'How does the RAG pipeline work?'
                        : activeProject.stack?.includes('NextAuth.js') || activeProject.stack?.includes('NextAuth')
                          ? 'Explain the NextAuth JWT flow'
                          : 'How is the AI integrated here?',
                      activeProject.stack?.some(s => s.toLowerCase().includes('postgres'))
                        ? 'Why PostgreSQL over NoSQL?'
                        : activeProject.stack?.some(s => s.toLowerCase().includes('stripe'))
                          ? 'How does Stripe handle payments?'
                          : 'What was the biggest tech challenge?',
                      `What makes ${activeProject.title.split(' ')[0]} production-ready?`,
                    ].map(q => (
                      <button key={q} onClick={() => navigator.clipboard.writeText(q)} title="Click to copy"
                        className="w-full text-left px-3 py-2 rounded-xl text-[9.5px] text-white/70 transition-all duration-200 transform-gpu will-change-[transform,opacity] hover:text-white hover:bg-white/10 active:scale-[0.98]"
                        style={{ background: 'rgba(0,0,0,0.60)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <span className="text-white/25 mr-1.5">›</span>{q}
                      </button>
                    ))}
                  </div>

                  {/* ── Module C: Neural Data Pulse Map ── */}
                  <div className="flex-1 min-h-0 mx-3 mt-3 mb-3 rounded-2xl relative"
                    style={{ background: 'rgba(0,0,0,0.30)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="absolute top-2.5 left-3 z-10">
                      <span className="text-[7.5px] font-black uppercase tracking-widest text-white/20">Data Flow</span>
                    </div>
                    {(() => {
                      const stack = activeProject.stack || [];
                      const hasLLM    = stack.some(s => ['LangChain','OpenAI','GPT','Claude','Pinecone','Gemini'].some(k => s.includes(k)));
                      const hasDB     = stack.some(s => ['PostgreSQL','MongoDB','MySQL','Supabase','Firebase','Redis','Neon'].some(k => s.includes(k)));
                      const hasFE     = stack.some(s => ['React','Next.js','Vue','Svelte'].some(k => s.includes(k)));
                      const hasStripe = stack.some(s => s.includes('Stripe'));
                      const nodes = [
                        { label: 'User',                      color: '#a78bfa', glyph: '◎' },
                        { label: hasFE ? 'Next.js' : 'Client', color: '#60a5fa', glyph: '▣' },
                        { label: hasLLM ? 'AI Engine' : hasStripe ? 'Payments' : 'API', color: hasLLM ? '#c084fc' : hasStripe ? '#4ade80' : '#34d399', glyph: hasLLM ? '◉' : '⬡' },
                        { label: hasDB ? 'Database' : 'Storage', color: '#fb923c', glyph: '⬢' },
                      ];
                      return (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pb-4 gap-0">
                          {nodes.map((node, i) => (
                            <div key={node.label} className="flex flex-col items-center"
                              style={{ flex: i < nodes.length - 1 ? '1 1 0' : 'none', minHeight: i < nodes.length - 1 ? 60 : 'auto' }}>
                              {/* Glass node circle */}
                              <div className="transform-gpu will-change-[transform,opacity] w-12 h-12 rounded-full flex-shrink-0 flex flex-col items-center justify-center z-10 transition-transform duration-300 hover:scale-110"
                                style={{
                                  background: 'rgba(0,0,0,0.80)',
                                  border: '1px solid rgba(255,255,255,0.20)',
                                  borderTop: `1px solid ${node.color}60`,
                                  boxShadow: `0 0 16px ${node.color}25, inset 0 1px 0 rgba(255,255,255,0.05)`,
                                }}>
                                <span className="text-[13px] leading-none" style={{ color: node.color }}>{node.glyph}</span>
                                <span className="text-[6px] font-bold text-white/45 mt-0.5 tracking-wide">{node.label}</span>
                              </div>
                              {/* SVG wire with animated cyan data packet */}
                              {i < nodes.length - 1 && (
                                <svg className="transform-gpu will-change-[transform,opacity]"
                                  width="2" style={{ flex: 1 }} viewBox="0 0 2 40" preserveAspectRatio="none">
                                  <line x1="1" y1="0" x2="1" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
                                  <line x1="1" y1="0" x2="1" y2="40"
                                    stroke="#22d3ee" strokeWidth="1.5"
                                    strokeDasharray="8 32"
                                    style={{
                                      filter: 'drop-shadow(0 0 3px #22d3ee) drop-shadow(0 0 6px rgba(34,211,238,0.4))',
                                      animation: 'neuralPulse 1.4s linear infinite',
                                      animationDelay: `${i * 0.35}s`,
                                    }}
                                  />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Module C: Main Window Shell (Locked Size & Glass Styles) */
            <div
              key={currentId}
              className={`relative w-[85vw] max-w-7xl h-[80vh] max-h-[850px] min-h-[660px] rounded-[2rem] animate-stage-in flex flex-col ${
                currentId === 'welcome'
                  ? 'bg-[#050505]/95 backdrop-blur-2xl overflow-visible'
                  : 'bg-black/40 backdrop-blur-3xl overflow-hidden'
              }`}
              style={currentId === 'welcome' ? {
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.20)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.06)',
              } : {
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.20)',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.50)',
              }}
            >
              {renderPanel()}
            </div>
          )}
        </div>
      </div>

      <p className="fixed bottom-2 right-4 text-[9px] text-white/15 font-mono pointer-events-none select-none" aria-hidden="true">
        DWS OS v2.0 · Spatial UI Engine · {new Date().getFullYear()}
      </p>

      <style jsx global>{`
        @keyframes stageIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0px); }
        }
        .animate-stage-in {
          animation: stageIn 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) both;
        }

        /* KPI ring fill — drives stroke-dashoffset from full (empty) to --ring-target */
        @keyframes kpiRingFill {
          from { stroke-dashoffset: 188.5; }
          to   { stroke-dashoffset: var(--ring-target, 0); }
        }

        /* Holographic card sheen — diagonal sweep across the tilt-card */
        @keyframes holoSheen {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          60%  { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }

        /* Siri orb — slow conic gradient spin */
        @keyframes siriOrb {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Neural data pulse — drives stroke-dashoffset so packets shoot downward */
        @keyframes neuralPulse {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -40; }
        }

        /* ── Global scrollbar eradication ── */
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }

        /* ── Spatial window glow (outer wrappers only — never on backdrop-blur elements) ── */
        .spatial-glow-left {
          filter: drop-shadow(-6px 0 32px rgba(139,92,246,0.20));
        }
        .spatial-glow-right {
          filter: drop-shadow(6px 0 32px rgba(52,211,153,0.16));
        }
        .spatial-glow-center {
          filter: drop-shadow(0 8px 48px rgba(99,102,241,0.24));
        }
      `}</style>
    </div>
  );
}
