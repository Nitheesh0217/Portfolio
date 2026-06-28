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
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

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
              className="projects-spatial-zoom flex flex-row items-center justify-center gap-8 animate-stage-in"
              style={{
                perspective: '3200px',
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
                style={{ transform: 'translateZ(-60px) rotateY(10deg) scale(0.95)', transformOrigin: 'right center', perspective: '1200px' }}
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

                    // Default stacked 3D positions — deep z recession for maximum drama
                    const defaultTransforms: Record<number, string> = {
                      0: 'translateZ(0px) translateY(0px) scale(1)',
                      1: 'translateZ(-110px) translateY(-44px) scale(0.91)',
                      2: 'translateZ(-220px) translateY(-88px) scale(0.82)',
                    };
                    // Fanned positions — equal vertical spread so all cards are fully legible
                    const fannedTransforms: Record<number, string> = {
                      0: 'translateZ(0px) translateY(-74px) scale(1)',
                      1: 'translateZ(0px) translateY(0px) scale(0.97)',
                      2: 'translateZ(0px) translateY(74px) scale(0.94)',
                    };

                    const defaultOpacity = [1, 0.45, 0.15][stackPos] ?? 0.15;
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
                          height: '84%',
                          background: isFront
                            ? `linear-gradient(145deg, rgba(4,4,10,0.80) 0%, ${card.accentBg} 60%, rgba(0,0,0,0.70) 100%)`
                            : `linear-gradient(145deg, rgba(2,2,6,0.75) 0%, ${card.accentBg} 100%)`,
                          backdropFilter: 'blur(32px) saturate(160%)',
                          WebkitBackdropFilter: 'blur(32px) saturate(160%)',
                          border: isFront ? `1px solid ${card.accent}35` : '1px solid rgba(255,255,255,0.06)',
                          borderTop: isFront ? `1px solid ${card.accent}70` : '1px solid rgba(255,255,255,0.10)',
                          boxShadow: isFront
                            ? `0 40px 80px rgba(0,0,0,0.90), 0 0 0 1px ${card.accent}18, inset 0 1px 0 rgba(255,255,255,0.10), 0 0 50px ${card.accent}10`
                            : '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.03)',
                          transform,
                          opacity,
                          filter: blur === 'none' ? undefined : blur,
                          zIndex,
                          transition: 'transform 0.7s cubic-bezier(0.23,1,0.32,1), opacity 0.7s ease, filter 0.7s ease, box-shadow 0.4s ease',
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
                <div className="absolute -top-[60px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full transform-gpu will-change-[transform,opacity]"
                  style={{
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderTop: '1px solid rgba(255,255,255,0.35)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.20)',
                  }}>

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

                  {/* GitHub button — loads in iframe; Frame Protection screen shows if blocked */}
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
                  className="w-full h-full bg-[#030308] rounded-[2.5rem] overflow-hidden relative"
                  style={{
                    boxShadow: '0 30px 70px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12)',
                    borderTop: '1px solid rgba(255,255,255,0.18)',
                    borderLeft: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {iframeBlocked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508]">
                      {/* Background grid pattern */}
                      <div className="absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                      {/* Glowing center blob */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[420px] h-[420px] rounded-full opacity-10"
                          style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />
                      </div>
                      {/* Card */}
                      <div className="relative z-10 flex flex-col items-center text-center max-w-[440px] px-8">
                        {/* GitHub mark */}
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative"
                          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.20) 0%, rgba(0,0,0,0.80) 100%)', border: '1px solid rgba(139,92,246,0.35)', borderTop: '1px solid rgba(139,92,246,0.60)', boxShadow: '0 20px 60px rgba(0,0,0,0.80), 0 0 40px rgba(139,92,246,0.20)' }}>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(167,139,250,0.90)" aria-hidden="true">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                          </svg>
                        </div>
                        {/* Repo path */}
                        {activeProject.github_url && (
                          <p className="text-[10px] font-mono text-violet-400/70 mb-2 tracking-wide">
                            {activeProject.github_url.replace('https://github.com/', 'github.com/')}
                          </p>
                        )}
                        <h3 className="text-white text-[20px] font-black tracking-tight mb-2">{activeProject.title}</h3>
                        <p className="text-[12px] text-white/35 mb-8 leading-relaxed max-w-[300px]">
                          GitHub enforces frame protection. Click below to view the full repository.
                        </p>
                        {/* Action buttons */}
                        <div className="flex gap-3">
                          {activeProject.github_url && (
                            <a href={activeProject.github_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold transition-all hover:brightness-110 active:scale-95"
                              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 8px 32px rgba(124,58,237,0.45), 0 0 0 1px rgba(139,92,246,0.40)', color: '#fff', textDecoration: 'none' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                              View Repository ↗
                            </a>
                          )}
                          {activeProject.live_url && (
                            <a href={activeProject.live_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-semibold text-white/60 hover:text-white transition-all"
                              style={{ border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)', textDecoration: 'none' }}>
                              Launch Live ↗
                            </a>
                          )}
                        </div>
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
                style={{ transform: 'translateZ(-60px) rotateY(-10deg) scale(0.95)', transformOrigin: 'left center' }}
              >
                <div
                  className="w-full h-full rounded-3xl flex flex-col overflow-hidden"
                  style={{
                    background: 'rgba(3,3,10,0.75)',
                    backdropFilter: 'blur(40px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(160%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderTop: '1px solid rgba(255,255,255,0.16)',
                    boxShadow: '0 30px 70px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  {/* ── Module A: Biometric Tilt-Card ── */}
                  {DEMO_CREDENTIALS[activeProject.slug] ? (
                    <div className="mx-3 mt-3 shrink-0 rounded-2xl p-4 relative overflow-hidden cursor-default"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.65) 55%, rgba(255,255,255,0.05) 100%)',
                        border: '1px solid rgba(255,255,255,0.22)',
                        borderTop: '1px solid rgba(255,255,255,0.35)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.15)',
                        transformStyle: 'preserve-3d' as const,
                        transform: `perspective(700px) rotateX(${-cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                        transition: cardTilt.x === 0 && cardTilt.y === 0 ? 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease' : 'transform 0.08s ease-out',
                      }}
                      onMouseMove={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientY - rect.top) / rect.height - 0.5;
                        const y = (e.clientX - rect.left) / rect.width - 0.5;
                        setCardTilt({ x: x * 14, y: y * 14 });
                        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.22)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.40)';
                      }}
                      onMouseLeave={e => {
                        setCardTilt({ x: 0, y: 0 });
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                      }}
                    >
                      {/* Holographic conic gradient base */}
                      <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden" style={{ opacity: 0.45 }}>
                        <div className="absolute inset-0" style={{ background: 'conic-gradient(from 180deg at 50% 50%, rgba(139,92,246,0.25) 0deg, rgba(34,211,238,0.18) 120deg, rgba(251,191,36,0.12) 240deg, rgba(139,92,246,0.25) 360deg)' }} />
                      </div>
                      {/* Animated sweeping sheen */}
                      <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                        <div className="absolute inset-0"
                          style={{ background: 'linear-gradient(115deg, transparent 15%, rgba(255,255,255,0.20) 50%, transparent 85%)', animation: 'holoSheen 2.8s ease-in-out infinite' }} />
                      </div>
                      {/* Smart-card chip icon */}
                      <div className="absolute top-3 left-3 z-10 opacity-55">
                        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" aria-hidden="true">
                          <rect x="3" y="2" width="14" height="11" rx="2" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" fill="rgba(255,255,255,0.06)" />
                          <line x1="7" y1="2" x2="7" y2="13" stroke="rgba(255,255,255,0.30)" strokeWidth="0.6" />
                          <line x1="10" y1="2" x2="10" y2="13" stroke="rgba(255,255,255,0.30)" strokeWidth="0.6" />
                          <line x1="13" y1="2" x2="13" y2="13" stroke="rgba(255,255,255,0.30)" strokeWidth="0.6" />
                          <line x1="3" y1="5.5" x2="17" y2="5.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
                          <line x1="3" y1="9.5" x2="17" y2="9.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
                        </svg>
                      </div>
                      {/* Verified badge */}
                      <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-emerald-400/80">Verified</span>
                      </div>
                      <p className="text-[7.5px] font-black uppercase tracking-wider text-amber-400/90 mb-2.5 relative z-10 mt-4">
                        ⬡ Demo Access Keys
                      </p>
                      <div className="flex flex-col gap-1.5 relative z-10">
                        {DEMO_CREDENTIALS[activeProject.slug].map((cred, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/[0.04]"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-[7px] font-bold text-white/35 uppercase tracking-widest">{cred.label}</span>
                              <span className="font-mono text-[9px] text-white/85 truncate">{cred.email}</span>
                              <span className="font-mono text-[8.5px] text-cyan-300/55">{cred.password}</span>
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
                    /* ── Project Identity Card (when no demo credentials) ── */
                    <div className="mx-3 mt-3 shrink-0 rounded-2xl p-4 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(0,0,0,0.60) 60%, rgba(139,92,246,0.06) 100%)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        borderTop: '1px solid rgba(139,92,246,0.40)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.10)',
                      }}>
                      {/* Subtle gradient shimmer */}
                      <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, transparent 20%, rgba(99,102,241,0.08) 50%, transparent 80%)', animation: 'holoSheen 4s ease-in-out infinite' }} />
                      </div>
                      {/* Category badge */}
                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.30)' }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          <span className="text-[7px] font-black uppercase tracking-widest text-indigo-300">Production Live</span>
                        </div>
                        <span className="text-[7px] font-mono text-white/25">v1.0</span>
                      </div>
                      {/* Project title */}
                      <p className="text-[13px] font-black text-white leading-tight mb-1 relative z-10">{activeProject.title}</p>
                      <p className="text-[9px] text-white/40 leading-snug relative z-10 mb-3">{activeProject.subtitle || 'Full-stack production application'}</p>
                      {/* Quick links */}
                      <div className="flex gap-2 relative z-10">
                        {activeProject.live_url && (
                          <a href={activeProject.live_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[8px] font-bold text-amber-300 hover:text-amber-200 transition-colors"
                            style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.25)', textDecoration: 'none' }}>
                            <span className="w-1 h-1 rounded-full bg-amber-400" />Live ↗
                          </a>
                        )}
                        {activeProject.github_url && (
                          <a href={activeProject.github_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[8px] font-bold text-violet-300 hover:text-violet-200 transition-colors"
                            style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.25)', textDecoration: 'none' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                            Code ↗
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Module B: Breathing AI Core ── */}
                  <div className="mx-3 mt-3 shrink-0 flex items-center gap-3">
                    <div className="relative flex-shrink-0 w-14 h-14 transform-gpu will-change-[transform,opacity]">
                      {/* Outer diffused glow halo */}
                      <div className="absolute -inset-2 rounded-full"
                        style={{ background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #22d3ee, #6366f1)', filter: 'blur(10px)', opacity: 0.35, animation: 'aiOrbBreath 4s ease-in-out infinite' }} />
                      {/* Mid ping ring */}
                      <div className="absolute inset-0 rounded-full"
                        style={{ background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #22d3ee, #6366f1)', opacity: 0.18, animation: 'ping 3.5s cubic-bezier(0,0,0.2,1) infinite 0.6s' }} />
                      {/* Core spinning orb */}
                      <div className="absolute inset-0 rounded-full"
                        style={{
                          background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #22d3ee, #6366f1)',
                          boxShadow: '0 0 28px rgba(139,92,246,0.95), 0 0 56px rgba(99,102,241,0.45)',
                          animation: 'aiOrbSpin 5s linear infinite',
                        }} />
                      {/* Frosted glass inner sphere */}
                      <div className="absolute inset-[8px] rounded-full"
                        style={{ background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }} />
                      {/* Inner spark pulse */}
                      <div className="absolute inset-[16px] rounded-full"
                        style={{ background: 'rgba(139,92,246,0.60)', boxShadow: '0 0 14px rgba(139,92,246,0.90)', animation: 'aiOrbBreath 4s ease-in-out infinite 0.6s' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <p className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-400">AI Co-Pilot</p>
                      </div>
                      <p className="text-[9.5px] text-white/45 leading-snug">Ask me anything about this project</p>
                    </div>
                  </div>

                  {/* AI Pills — glowing query nodes */}
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
                        className="w-full text-left px-3 py-2 rounded-xl text-[9.5px] text-white/65 transition-all duration-200 transform-gpu will-change-[transform,opacity] hover:text-white hover:bg-white/[0.07] active:scale-[0.98] group"
                        style={{ background: 'rgba(0,0,0,0.55)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.55)', borderTop: '1px solid rgba(255,255,255,0.06)', borderLeft: '2px solid rgba(255,255,255,0.04)' }}
                      >
                        <span className="text-violet-400/55 mr-1.5 inline-block group-hover:translate-x-0.5 transition-transform duration-200">▸</span>{q}
                      </button>
                    ))}
                  </div>

                  {/* ── Module C: Neural Diamond Map ── */}
                  <div className="flex-1 min-h-0 mx-3 mt-3 mb-3 rounded-2xl relative overflow-hidden"
                    style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.06)', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                    <div className="absolute top-2.5 left-3 z-10">
                      <span className="text-[7.5px] font-black uppercase tracking-widest text-white/25">Live Data Flow</span>
                    </div>
                    {(() => {
                      const stack = activeProject.stack || [];
                      const hasLLM    = stack.some(s => ['LangChain','OpenAI','GPT','Claude','Pinecone','Gemini'].some(k => s.includes(k)));
                      const hasDB     = stack.some(s => ['PostgreSQL','MongoDB','MySQL','Supabase','Firebase','Redis','Neon'].some(k => s.includes(k)));
                      const hasFE     = stack.some(s => ['React','Next.js','Vue','Svelte'].some(k => s.includes(k)));
                      const hasStripe = stack.some(s => s.includes('Stripe'));
                      // Diamond topology: User(top) → FE(left) + AI(right) → DB(bottom)
                      const nodes = [
                        { id: 'user',  label: 'User',                                                                         color: '#a78bfa', glyph: '◎', cx: 140, cy: 52  },
                        { id: 'fe',    label: hasFE ? 'Next.js' : 'Client',                                                   color: '#60a5fa', glyph: '▣', cx: 68,  cy: 148 },
                        { id: 'core',  label: hasLLM ? 'AI Engine' : hasStripe ? 'Payments' : 'API',
                                       color: hasLLM ? '#c084fc' : hasStripe ? '#4ade80' : '#34d399',  glyph: hasLLM ? '◉' : '⬡', cx: 212, cy: 148 },
                        { id: 'db',    label: hasDB  ? 'Database' : 'Storage',                                                color: '#fb923c', glyph: '⬢', cx: 140, cy: 244 },
                      ];
                      const edges = [
                        { from: 0, to: 1, delay: '0s'   },
                        { from: 0, to: 2, delay: '0.5s' },
                        { from: 1, to: 3, delay: '1.0s' },
                        { from: 2, to: 3, delay: '1.5s' },
                      ];
                      const R = 22;
                      return (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 280 300" className="w-full h-full" aria-hidden="true" style={{ overflow: 'visible' }}>
                            <defs>
                              {nodes.map(n => (
                                <radialGradient key={`rg-${n.id}`} id={`rg-${n.id}`} cx="50%" cy="50%" r="50%">
                                  <stop offset="0%" stopColor={n.color} stopOpacity="0.30" />
                                  <stop offset="100%" stopColor={n.color} stopOpacity="0" />
                                </radialGradient>
                              ))}
                            </defs>
                            {/* Ambient glow halos under each node */}
                            {nodes.map(n => (
                              <circle key={`halo-${n.id}`} cx={n.cx} cy={n.cy} r={R + 18}
                                fill={`url(#rg-${n.id})`} />
                            ))}
                            {/* Bezier connection paths */}
                            {edges.map((e, i) => {
                              const n1 = nodes[e.from]; const n2 = nodes[e.to];
                              const mx = (n1.cx + n2.cx) / 2; const my = (n1.cy + n2.cy) / 2;
                              const d = `M ${n1.cx} ${n1.cy} C ${n1.cx} ${my} ${n2.cx} ${my} ${n2.cx} ${n2.cy}`;
                              return (
                                <g key={`edge-${i}`}>
                                  {/* Static wire */}
                                  <path d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
                                  {/* Glowing animated packet */}
                                  <path d={d} fill="none"
                                    stroke={nodes[e.to].color} strokeWidth="2.5" strokeLinecap="round"
                                    strokeDasharray="10 110"
                                    style={{
                                      filter: `drop-shadow(0 0 5px ${nodes[e.to].color}) drop-shadow(0 0 10px ${nodes[e.to].color}80)`,
                                      animation: 'dataPacketFlow 2.2s linear infinite',
                                      animationDelay: e.delay,
                                      strokeDashoffset: 120,
                                    }}
                                  />
                                </g>
                              );
                            })}
                            {/* Node circles with glyphs */}
                            {nodes.map((n, i) => (
                              <g key={n.id}>
                                {/* Pulsing ring on user node only */}
                                {i === 0 && (
                                  <circle cx={n.cx} cy={n.cy} r={R + 8}
                                    fill="none" stroke={n.color} strokeWidth="1"
                                    style={{ animation: 'nodePulseRing 3s ease-out infinite', opacity: 0.5, transformOrigin: `${n.cx}px ${n.cy}px` }}
                                  />
                                )}
                                {/* Node body */}
                                <circle cx={n.cx} cy={n.cy} r={R}
                                  fill="rgba(0,0,0,0.88)"
                                  stroke={n.color} strokeWidth="1"
                                  strokeOpacity="0.55"
                                  style={{ filter: `drop-shadow(0 0 10px ${n.color}70)` }}
                                />
                                {/* Specular top edge */}
                                <path
                                  d={`M ${n.cx - R + 4} ${n.cy - R + 8} Q ${n.cx} ${n.cy - R - 4} ${n.cx + R - 4} ${n.cy - R + 8}`}
                                  fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1"
                                />
                                {/* Glyph */}
                                <text x={n.cx} y={n.cy - 3} textAnchor="middle" dominantBaseline="middle"
                                  fontSize="14" fill={n.color} style={{ userSelect: 'none', fontFamily: 'system-ui' }}>
                                  {n.glyph}
                                </text>
                                {/* Label */}
                                <text x={n.cx} y={n.cy + 12} textAnchor="middle" dominantBaseline="middle"
                                  fontSize="6.5" fill="rgba(255,255,255,0.45)" style={{ userSelect: 'none', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.04em' }}>
                                  {n.label}
                                </text>
                              </g>
                            ))}
                          </svg>
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

        /* ── NEW: Anti-Gravity Animation Suite ── */

        /* AI Orb — slow conic gradient spin */
        @keyframes aiOrbSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* AI Orb — breathing pulse for outer halo and inner spark */
        @keyframes aiOrbBreath {
          0%,  100% { opacity: 0.28; transform: scale(1.00); }
          50%        { opacity: 0.60; transform: scale(1.20); }
        }

        /* Data packet — flows along SVG bezier path via stroke-dashoffset */
        @keyframes dataPacketFlow {
          from { stroke-dashoffset:  120; }
          to   { stroke-dashoffset: -24; }
        }

        /* Node pulse ring — expands outward + fades on User node */
        @keyframes nodePulseRing {
          0%   { transform: scale(1.00); opacity: 0.65; }
          100% { transform: scale(2.60); opacity: 0.00; }
        }

        /* ── Global scrollbar eradication ── */
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }

        /* ── Spatial window glow — massive compound drop-shadows for zero-gravity levitation ── */
        .spatial-glow-left {
          filter:
            drop-shadow(-12px 0 60px rgba(139,92,246,0.35))
            drop-shadow(0 30px 70px rgba(0,0,0,0.80));
        }
        .spatial-glow-right {
          filter:
            drop-shadow(12px 0 60px rgba(52,211,153,0.30))
            drop-shadow(0 30px 70px rgba(0,0,0,0.80));
        }
        .spatial-glow-center {
          filter:
            drop-shadow(0 30px 80px rgba(99,102,241,0.45))
            drop-shadow(0 8px 24px rgba(0,0,0,0.90));
        }
      `}</style>
    </div>
  );
}
