'use client';
// app/page.tsx — DesktopCanvas
// Root orchestrator for the Spatial UI Engine
// ─────────────────────────────────────────────────────────────────────────────

import {
  useReducer, useRef, useCallback, useEffect,
  useMemo, memo, useState,
} from 'react';
import { BarChart2, Mail, Copy, Check, Lock, RefreshCw } from 'lucide-react';

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
          No metrics yet. Insert rows into the metrics table (period = &apos;all-time&apos;).
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
    <div className="flex-1 w-full h-full flex flex-col md:flex-row items-center justify-center gap-12 px-12 md:px-24">
      {/* Left side: Premium Branding */}
      <div className="flex-1 flex flex-col gap-6 text-left">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">Collaboration</span>
        </div>
        
        <h2 className="text-white font-black leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)' }}>
          Let&rsquo;s build<br />
          <span className="text-white/40">something real.</span>
        </h2>
        
        <p className="text-[14px] leading-relaxed text-white/60 max-w-[420px]">
          Whether you need deep-tech AI agents, high-efficiency data pipelines, custom web systems, or seamless design systems — I bring raw execution and measurable results.
        </p>
      </div>

      {/* Right side: Interactive Contact Bento Card */}
      <div 
        className="w-full max-w-[440px] rounded-3xl p-8 flex flex-col gap-6"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
      >
        <div>
          <h3 className="text-[16px] font-bold text-white tracking-tight">Direct Channels</h3>
          <p className="text-[11px] text-white/40 mt-1">Response time: typically under 12 hours.</p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="mailto:nitheeshd.17@gmail.com"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 active:scale-[0.98] text-[#1a1100] text-[13px] font-extrabold transition-all shadow-lg shadow-amber-500/10"
          >
            <Mail className="w-4 h-4" />
            nitheeshd.17@gmail.com
          </a>
          
          <a
            href="https://linkedin.com/in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.02] text-white/70 hover:text-white text-[13px] font-semibold transition-all active:scale-[0.98]"
          >
            Connect on LinkedIn
          </a>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/[0.06]"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider text-white/20">Social Profiles</span>
          <div className="flex-grow border-t border-white/[0.06]"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'GitHub',   href: 'https://github.com/Nitheesh0217' },
            { label: 'Twitter',  href: 'https://twitter.com/' },
            { label: 'Dribbble', href: 'https://dribbble.com/' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2.5 rounded-xl border border-white/[0.05] bg-white/[0.01] text-white/40 hover:text-white/80 hover:bg-white/[0.03] text-xs font-semibold transition-all"
            >
              {label}
            </a>
          ))}
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

// ── Per-project rich overview metadata (tech pills + headline metric) ─────────
const PROJECT_META: Record<string, { pills: string[]; metric: string }> = {
  'coach-jake': {
    pills: ['Next.js 16', 'NextAuth.js', 'PostgreSQL', 'Chart.js'],
    metric: '50% Admin Overhead Reduced',
  },
  'd-scent-house': {
    pills: ['Next.js 14', 'Stripe', 'pg_notify', 'PostgreSQL'],
    metric: '$2,400/yr SaaS Savings',
  },
  'unick-auto-detailing': {
    pills: ['Next.js', 'OpenAI', 'Twilio', 'PostgreSQL'],
    metric: '4.9★ Google Rating Sustained',
  },
  'citrix-rag-knowledge-assistant': {
    pills: ['LangChain', 'Pinecone', 'GPT-4', 'FastAPI'],
    metric: '60% Support Lookup Reduction',
  },
  'koreai-customer-service-agent': {
    pills: ['Kore.ai', 'Spring Boot', 'NLU', 'PostgreSQL'],
    metric: '28% Escalation Rate Reduced',
  },
  'healthcare-readmission-prediction': {
    pills: ['Python', 'scikit-learn', 'Flask', 'Docker'],
    metric: '84% Prediction Accuracy',
  },
};

export default function DesktopCanvas() {
  const [windows, dispatch] = useReducer(windowReducer, INITIAL_WINDOW_STATE);
  const zCounter = useRef(Z_BASE + 2);
  const [portfolio, setPortfolio] = useState<PortfolioState>(PORTFOLIO_INITIAL);
  const [activeProject, setActiveProject] = useState<ProjectSummary | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const iframeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mindMapData, setMindMapData] = useState<{ nodes: any[]; edges: any[] } | null>(null);
  const [mindMapLoading, setMindMapLoading] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (activeProject) {
      setIframeLoading(true);
      setIframeBlocked(false);
      if (iframeTimeoutRef.current) clearTimeout(iframeTimeoutRef.current);
      // If iframe hasn't fired onLoad within 12s, assume X-Frame-Options blocked it
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
        <div className="relative pointer-events-auto">
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
            /* The 3D Flex Stage Wrapper */
            <div 
              className="w-full h-full flex flex-row items-center justify-center gap-6 px-8 transition-all duration-500 ease-out animate-stage-in"
              style={{
                perspective: '2000px',
                width: '95vw',
                maxWidth: '1720px',
                height: '85vh',
                maxHeight: '920px',
                minHeight: '660px',
              }}
            >
              {/* Left Window (Case Study) */}
              <div
                className="w-[20vw] max-w-sm h-[70vh] flex-shrink-0 bg-black/40 backdrop-blur-3xl rounded-[2rem] flex flex-col z-0 transition-all duration-500 ease-out"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.20)',
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.50)',
                  transform: 'rotateY(12deg)',
                  transformOrigin: 'right center',
                }}
              >
                <div className="flex-1 overflow-y-auto spatial-scroll p-6 flex flex-col gap-5 text-left select-text">
                  <div className="border-b border-white/[0.12] pb-3 mb-1 shrink-0">
                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-400">Case Study</span>
                    <h2 className="text-[20px] font-black text-white mt-1 leading-tight tracking-tight">{activeProject.title}</h2>
                  </div>
                  
                  <div className="prose prose-invert max-w-none text-[11.5px] leading-relaxed text-white/80 font-sans">
                    {activeProject.problem_statement && (
                      <div className="mb-4.5">
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-2 leading-none" style={{ textShadow: '0 0 10px rgba(245, 158, 11, 0.2)' }}>The Challenge</h3>
                        <p className="text-white/85 leading-relaxed m-0 text-justify">{activeProject.problem_statement}</p>
                      </div>
                    )}

                    {activeProject.approach && (
                      <div className="mb-4.5">
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-2 leading-none" style={{ textShadow: '0 0 10px rgba(245, 158, 11, 0.2)' }}>The Solution</h3>
                        <p className="text-white/85 leading-relaxed m-0 text-justify">{activeProject.approach}</p>
                      </div>
                    )}

                    {activeProject.process_notes && (
                      <div className="mb-4.5">
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-2 leading-none" style={{ textShadow: '0 0 10px rgba(245, 158, 11, 0.2)' }}>Architecture & Process</h3>
                        <p className="text-white/85 leading-relaxed m-0 text-justify">{activeProject.process_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Window — Spatial Tablet Browser */}
              <div
                className="w-[50vw] max-w-5xl h-[80vh] flex-shrink-0 bg-black/40 backdrop-blur-3xl rounded-[2rem] flex flex-col transition-all duration-500 ease-out z-10 p-3"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.20)',
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.50)',
                }}
              >
                {/* ── Tablet Chrome / OS Header ── */}
                <div className="h-11 flex items-center justify-between px-3 shrink-0 select-none mb-2">
                  {/* Traffic lights */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-default transition-all" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 cursor-default transition-all" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 cursor-default transition-all" />
                  </div>

                  {/* Dynamic Address Bar */}
                  <div
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10.5px] font-medium text-white/70 max-w-[340px] flex-1 mx-4"
                    style={{
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {iframeLoading && !iframeBlocked ? (
                      <RefreshCw className="w-2.5 h-2.5 text-amber-400 animate-spin shrink-0" />
                    ) : (
                      <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    )}
                    <span className="truncate">
                      {activeProject.live_url
                        ? activeProject.live_url.replace(/^https?:\/\/(www\.)?/, '')
                        : 'No URL'}
                    </span>
                    {iframeLoading && !iframeBlocked && (
                      <span className="ml-auto shrink-0 flex gap-0.5">
                        {[0,1,2].map(i => (
                          <span key={i} className="w-1 h-1 rounded-full bg-amber-400/70 animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
                        ))}
                      </span>
                    )}
                  </div>

                  {/* External actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {activeProject.live_url && (
                      <a
                        href={activeProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-amber-300/80 hover:text-amber-300 transition-colors"
                        title="Open in new tab"
                      >
                        ↗
                      </a>
                    )}
                    {activeProject.github_url && (
                      <a
                        href={activeProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-white/40 hover:text-white/70 transition-colors"
                        title="View source"
                      >
                        GH
                      </a>
                    )}
                  </div>
                </div>

                {/* ── Iframe Viewport ── */}
                <div className="flex-1 relative overflow-hidden rounded-b-[1.25rem] rounded-t-md bg-[#050505]">
                  {iframeBlocked ? (
                    /* Glassmorphic X-Frame fallback */
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(32px)',
                      }}
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-4"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        }}
                      >
                        🔒
                      </div>
                      <h3 className="text-white text-[15px] font-black tracking-tight">Frame Protection Active</h3>
                      <p className="text-[11px] text-white/45 max-w-[300px] mt-2 leading-relaxed">
                        {activeProject.title} enforces strict X-Frame-Options headers. View it directly in your browser.
                      </p>
                      <div className="flex gap-3 mt-6">
                        <a
                          href={activeProject.live_url || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 active:scale-95 text-[#0e0d14] text-[12px] font-bold shadow-lg shadow-amber-400/10 transition-all"
                        >
                          Launch Live App ↗
                        </a>
                        {activeProject.github_url && (
                          <a
                            href={activeProject.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-xl text-white/60 hover:text-white text-[12px] font-semibold transition-all"
                            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                          >
                            View Code
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {iframeLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#050505] z-20">
                          <div className="flex gap-1.5">
                            {[0,1,2].map((i) => (
                              <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                            ))}
                          </div>
                          <p className="text-[10px] font-mono text-white/25">Connecting to live deployment...</p>
                        </div>
                      )}
                      <iframe
                        key={activeProject.slug}
                        src={activeProject.live_url || ''}
                        onLoad={() => {
                          if (iframeTimeoutRef.current) clearTimeout(iframeTimeoutRef.current);
                          setIframeLoading(false);
                        }}
                        className={`w-full h-full border-none transition-opacity duration-700 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
                        title={activeProject.title}
                        allow="clipboard-write"
                        style={{ display: 'block' }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Right Window — Spatial Architecture HUD */}
              <div
                className="w-[20vw] max-w-sm h-[70vh] flex-shrink-0 bg-black/40 backdrop-blur-3xl rounded-[2rem] flex flex-col z-0 transition-all duration-500 ease-out overflow-hidden"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.20)',
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.50)',
                  transform: 'rotateY(-12deg)',
                  transformOrigin: 'left center',
                }}
              >
                {/* ── Part 4: Rich Project Overview Header ── */}
                <div className="shrink-0 px-4 pt-4 pb-3 border-b border-white/[0.12]">
                  <span className="text-[8px] font-black uppercase tracking-[0.18em] text-violet-400">Architecture HUD</span>
                  <h3 className="text-[13px] font-black text-white mt-0.5 leading-tight truncate">
                    {activeProject?.title ?? 'Data Flow Mind Map'}
                  </h3>

                  {/* Tech stack pills */}
                  {activeProject && PROJECT_META[activeProject.slug] && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {PROJECT_META[activeProject.slug].pills.map((pill) => (
                        <span
                          key={pill}
                          className="text-[8px] font-mono px-1.5 py-0.5 rounded-md text-emerald-300/80"
                          style={{
                            background: 'rgba(16,185,129,0.08)',
                            border: '1px solid rgba(16,185,129,0.22)',
                          }}
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Impact metric pill */}
                  {activeProject && PROJECT_META[activeProject.slug] && (
                    <div
                      className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-lg text-[8px] font-bold text-amber-300"
                      style={{
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.25)',
                      }}
                    >
                      ⚡ {PROJECT_META[activeProject.slug].metric}
                    </div>
                  )}
                </div>

                {/* ── Part 3: Smart Suggestion HUD (Demo Credentials) ── */}
                {activeProject && DEMO_CREDENTIALS[activeProject.slug] && (
                  <div
                    className="mx-3 mt-3 shrink-0 rounded-2xl p-3 flex flex-col gap-2"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(24px)',
                      border: '1px solid rgba(234,179,8,0.25)',
                      boxShadow: '0 4px 24px rgba(234,179,8,0.06)',
                    }}
                  >
                    <p className="text-[8px] font-black uppercase tracking-wider text-yellow-400">
                      💡 Test the app — demo keys:
                    </p>
                    {DEMO_CREDENTIALS[activeProject.slug].map((cred, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2"
                        style={{
                          background: 'rgba(0,0,0,0.40)',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[7px] font-bold text-white/35 uppercase tracking-widest">{cred.label}</span>
                          <span className="font-mono text-[9px] text-white/80 truncate">{cred.email}</span>
                          <span className="font-mono text-[9px] text-white/50">{cred.password}</span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${cred.email}\n${cred.password}`);
                            setCopiedIdx(idx);
                            setTimeout(() => setCopiedIdx(null), 1800);
                          }}
                          className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
                          title="Copy credentials"
                        >
                          {copiedIdx === idx
                            ? <Check className="w-3 h-3 text-emerald-400" />
                            : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Parts 1 & 2: React Flow Mind Map Canvas ── */}
                <div className="flex-1 w-full relative min-h-0">
                  {mindMapLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/10 backdrop-blur-sm z-10">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                        ))}
                      </div>
                      <p className="text-[9px] font-mono text-white/30 tracking-wider">Mapping architecture...</p>
                    </div>
                  ) : mindMapData ? (
                    <MindMap initialNodes={mindMapData.nodes} initialEdges={mindMapData.edges} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/25 text-[10px] font-mono">
                      Select a project to view its architecture
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Module C: Main Window Shell (Locked Size & Glass Styles) */
            <div
              key={currentId}
              className={`relative w-[92vw] max-w-[1580px] h-[85vh] max-h-[920px] min-h-[660px] rounded-[2rem] animate-stage-in flex flex-col ${
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
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1);    }
        }
        .animate-stage-in {
          animation: stageIn 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) both;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
