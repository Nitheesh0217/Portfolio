'use client';
// app/page.tsx — DesktopCanvas
// Root orchestrator for the Spatial UI Engine
// ─────────────────────────────────────────────────────────────────────────────

import {
  useReducer, useRef, useCallback, useEffect,
  useMemo, memo, useState,
} from 'react';
import { Mail, Copy, Check, Lock, RefreshCw, MessageSquare, Briefcase, User, Settings, ArrowLeft, Download } from 'lucide-react';

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
// Audio Synthesizers for Spatial UI Acoustics
// ─────────────────────────────────────────────────────────────────────────────
const playTick = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Ignore block context
  }
};

const playWhoosh = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.45);
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // Ignore
  }
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
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  const [activeIntent, setActiveIntent] = useState<'job' | 'freelance' | 'networking'>('job');
  const [draftText, setDraftText] = useState('');
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  const TEMPLATES = {
    job: `Hi Nitheesh, I was blown away by your spatial portfolio. We have a Senior Full Stack role at [Company] that fits your background in AI and React. Let's set up a call soon!`,
    freelance: `Hi Nitheesh, I love your Liquid Glass spatial UI work. We have a project for a premium dashboard interface and want to discuss design & consulting rates.`,
    networking: `Hi Nitheesh, your portfolio is outstanding. I'm also building in the AI/spatial space and would love to connect for a casual chat or virtual coffee to exchange ideas.`
  };
  
  const SUBJECTS = {
    job: 'Senior Software Engineer / AI Role Inquiry',
    freelance: 'Freelance Design & Consulting Engagement',
    networking: 'Spatial Computing & AI Networking'
  };

  useEffect(() => {
    const template = TEMPLATES[activeIntent];
    let idx = 0;
    setDraftText('');
    const timer = setInterval(() => {
      setDraftText(template.substring(0, idx + 3));
      idx += 3;
      if (idx >= template.length) {
        clearInterval(timer);
      }
    }, 12);
    return () => clearInterval(timer);
  }, [activeIntent]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setCardTilt({ x: -x * 12, y: y * 12 });
  };
  
  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  const tilesData = {
    'kore-ai': {
      title: 'Full Stack Engineer',
      company: 'Kore.ai',
      date: 'Jan 2024 — Present',
      summary: 'Architected and deployed enterprise Generative AI workflows and conversational agents using React, TypeScript, and Java Spring Boot.',
      tech: ['React', 'TypeScript', 'Java', 'Spring Boot', 'PostgreSQL', 'AWS', 'OpenAI', 'LangChain', 'Pinecone', 'RAG'],
      bullets: [
        'Architected and deployed enterprise Generative AI workflows and conversational agents using React, TypeScript, and Java Spring Boot, scaling to support thousands of daily user interactions.',
        'Engineered a high-performance Retrieval-Augmented Generation (RAG) pipeline utilizing OpenAI embeddings and Pinecone vector databases, significantly improving contextual accuracy for internal knowledge retrieval.',
        'Spearheaded the UI/UX development of AI-powered dashboards in React, directly reducing manual support ticket resolution time by automating common customer queries.'
      ]
    },
    'citrix': {
      title: 'Software Engineer',
      company: 'Citrix',
      date: 'Jun 2022 — Dec 2023',
      summary: 'Developed and optimized scalable enterprise microservices using Java and Spring Boot, reducing latency and deploying OpenAI search.',
      tech: ['Java', 'Spring Boot', 'React', 'Docker', 'Kubernetes', 'AWS ECS', 'CI/CD', 'GitHub Actions'],
      bullets: [
        'Developed and optimized scalable enterprise microservices using Java and Spring Boot, seamlessly integrating with PostgreSQL and reducing backend API latency.',
        'Integrated OpenAI-driven document search capabilities into internal enterprise tools, accelerating knowledge management workflows for cross-functional teams.',
        'Automated CI/CD deployment pipelines utilizing GitHub Actions, Docker, and AWS, decreasing release preparation time and mitigating production deployment risks.'
      ]
    },
    'cognizant': {
      title: 'Software Engineer',
      company: 'Cognizant',
      date: 'Aug 2020 — May 2022',
      summary: 'Designed and maintained transactional microservices, optimized SQL database queries, and automated builds under Agile practices.',
      tech: ['Java', 'Microservices', 'REST APIs', 'SQL', 'Jenkins', 'Agile', 'Scrum'],
      bullets: [
        'Designed and maintained high-volume transactional REST APIs and Java Spring Boot microservices supporting mission-critical business operations.',
        'Optimized complex SQL queries and database schemas, substantially improving data retrieval response times across high-traffic enterprise applications.',
        'Streamlined software delivery by containerizing applications with Docker and automating builds via Jenkins in a fast-paced Agile/Scrum environment.'
      ]
    },
    'fau-grad': {
      title: 'M.S. Computer Science',
      company: 'Florida Atlantic University',
      date: 'Graduated 2020',
      summary: 'Specialized in Machine Learning, advanced database systems, and cloud systems engineering.',
      image: '/fau_graduation.png',
      bullets: [
        'Master of Science degree focusing on computer science foundations and artificial intelligence.',
        'Coursework: Advanced Machine Learning, Cloud Computing, Database Systems, Analysis of Algorithms.',
        'Maintained a high GPA and conducted research projects on predictive modeling.'
      ]
    },
    'fau-ta': {
      title: 'Teaching Assistant',
      company: 'Florida Atlantic University',
      date: '2019 — 2020',
      summary: 'Assisted professors in software engineering principles, databases, and Python data structures.',
      image: '/teaching_assistant.jpg',
      bullets: [
        'Guided undergraduate students through lab assignments covering Python programming and database architectures.',
        'Graded coursework, held weekly office hours, and managed recitation sessions for 60+ students.',
        'Collaborated with computer science department faculty to upgrade curriculum lab material.'
      ]
    }
  };

  return (
    <div className="flex-1 w-full h-full relative text-left bg-[#1c1c1e]/60 backdrop-blur-3xl rounded-[2rem] overflow-hidden">
      {/* 2. Top Right Status */}
      <div className="absolute top-8 right-8 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs flex items-center gap-2 select-none z-30">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
        Open to work
      </div>

      {/* 3. Main Scrollable Container */}
      <div 
        className={`w-full h-full pr-4 select-text scrollbar-none ${selectedTile ? 'overflow-hidden' : 'overflow-y-auto'}`}
        style={{
          scrollbarWidth: 'none',
          WebkitMaskImage: selectedTile ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          maskImage: selectedTile ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-12 pt-16">
          
          {/* Tile 1: Hero Identity (Full Width, col-span-full) - Non-clickable Liquid Glass */}
          <div 
            className="col-span-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[40px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_4px_rgba(255,255,255,0.3)] rounded-3xl p-10 flex flex-col gap-6 relative select-text"
          >
            <h1 className="text-white font-extrabold text-[2.85rem] md:text-[3.5rem] leading-[1.08] tracking-tight">
              Full Stack & AI Engineer.<br />
              <span className="text-white/40">Architecting intelligent systems.</span>
            </h1>
            <p className="text-[13.5px] leading-relaxed text-white/50 max-w-[540px]">
              RAG pipelines, multi-agent orchestration, Snowflake ETL, real-time SaaS — I build the system, then I measure the receipts.
            </p>
          </div>

          {/* Tile 2: Kore.ai (col-span-2) - Liquid Glass styled */}
          <div 
            onMouseEnter={playTick}
            onClick={() => { playWhoosh(); setSelectedTile('kore-ai'); }}
            className="col-span-1 md:col-span-2 transform-gpu will-change-[transform,opacity] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[40px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_4px_rgba(255,255,255,0.3)] hover:bg-white/15 hover:shadow-[0_16px_64px_rgba(255,255,255,0.1),inset_0_0_8px_rgba(255,255,255,0.5)] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-3xl p-8 flex flex-col gap-4 text-left cursor-pointer"
          >
            <div className="flex justify-between items-start gap-4">
              <h4 className="text-[16px] font-extrabold text-white tracking-tight">Full Stack Engineer</h4>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider shrink-0 mt-0.5">Jan 2024 — Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-yellow-500">Kore.ai</span>
            </div>
            <p className="text-[12px] leading-relaxed text-white/60">
              {tilesData['kore-ai'].summary}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {tilesData['kore-ai'].tech.map(t => (
                <span key={t} className="bg-black/30 border border-white/5 rounded-full px-3 py-1 text-[9px] font-mono text-white/55">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Tile 4: FAU Graduation (col-span-1, Square) - Liquid Glass styled */}
          <div 
            onMouseEnter={playTick}
            onClick={() => { playWhoosh(); setSelectedTile('fau-grad'); }}
            className="col-span-1 relative overflow-hidden rounded-3xl group min-h-[250px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_4px_rgba(255,255,255,0.3)] hover:shadow-[0_16px_64px_rgba(255,255,255,0.1),inset_0_0_8px_rgba(255,255,255,0.5)] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu will-change-[transform,opacity] cursor-pointer"
          >
            <img 
              src="/fau_graduation.png" 
              alt="FAU Graduation"
              className="object-cover w-full h-full opacity-85 group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/95 via-black/45 to-transparent p-6 flex flex-col justify-end text-left select-none">
              <span className="text-[8px] font-black uppercase tracking-widest text-yellow-500 mb-1">Academic Milestone</span>
              <h4 className="text-[14px] font-extrabold text-white tracking-tight leading-snug">FAU Graduation</h4>
              <p className="text-[10px] text-white/55 mt-0.5">M.S. Computer Science</p>
            </div>
          </div>

          {/* Tile 5: Teaching Assistant (col-span-1, Square) - Liquid Glass styled */}
          <div 
            onMouseEnter={playTick}
            onClick={() => { playWhoosh(); setSelectedTile('fau-ta'); }}
            className="col-span-1 relative overflow-hidden rounded-3xl group min-h-[250px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_4px_rgba(255,255,255,0.3)] hover:shadow-[0_16px_64px_rgba(255,255,255,0.1),inset_0_0_8px_rgba(255,255,255,0.5)] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu will-change-[transform,opacity] cursor-pointer"
          >
            <img 
              src="/teaching_assistant.jpg" 
              alt="Teaching Assistant at FAU"
              className="object-cover w-full h-full opacity-85 group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/95 via-black/45 to-transparent p-6 flex flex-col justify-end text-left select-none">
              <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400 mb-1">Academic Leadership</span>
              <h4 className="text-[14px] font-extrabold text-white tracking-tight leading-snug">Teaching Assistant</h4>
              <p className="text-[10px] text-white/55 mt-0.5">FAU Computer Science Dept.</p>
            </div>
          </div>

          {/* Tile 3: Citrix (col-span-2) - Liquid Glass styled */}
          <div 
            onMouseEnter={playTick}
            onClick={() => { playWhoosh(); setSelectedTile('citrix'); }}
            className="col-span-1 md:col-span-2 transform-gpu will-change-[transform,opacity] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[40px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_4px_rgba(255,255,255,0.3)] hover:bg-white/15 hover:shadow-[0_16px_64px_rgba(255,255,255,0.1),inset_0_0_8px_rgba(255,255,255,0.5)] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-3xl p-8 flex flex-col gap-4 text-left cursor-pointer"
          >
            <div className="flex justify-between items-start gap-4">
              <h4 className="text-[16px] font-extrabold text-white tracking-tight">Software Engineer</h4>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider shrink-0 mt-0.5">Jun 2022 — Dec 2023</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">Citrix</span>
            </div>
            <p className="text-[12px] leading-relaxed text-white/60">
              {tilesData['citrix'].summary}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {tilesData['citrix'].tech.map(t => (
                <span key={t} className="bg-black/30 border border-white/5 rounded-full px-3 py-1 text-[9px] font-mono text-white/55">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Tile 6: Cognizant (col-span-full) - Liquid Glass styled */}
          <div 
            onMouseEnter={playTick}
            onClick={() => { playWhoosh(); setSelectedTile('cognizant'); }}
            className="col-span-full transform-gpu will-change-[transform,opacity] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[40px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_4px_rgba(255,255,255,0.3)] hover:bg-white/15 hover:shadow-[0_16px_64px_rgba(255,255,255,0.1),inset_0_0_8px_rgba(255,255,255,0.5)] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-3xl p-8 flex flex-col gap-4 text-left cursor-pointer"
          >
            <div className="flex justify-between items-start gap-4">
              <h4 className="text-[16px] font-extrabold text-white tracking-tight">Software Engineer</h4>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider shrink-0 mt-0.5">Aug 2020 — May 2022</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Cognizant</span>
            </div>
            <p className="text-[12px] leading-relaxed text-white/60">
              {tilesData['cognizant'].summary}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {tilesData['cognizant'].tech.map(t => (
                <span key={t} className="bg-black/30 border border-white/5 rounded-full px-3 py-1 text-[9px] font-mono text-white/55">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Footer - Holographic Comm-Link Hub (3D Tilting / Flipping Smart Card) */}
          <div className="col-span-full mt-12 pt-12 border-t border-white/10 flex flex-col items-center justify-center gap-6 pb-16 text-center select-none">
            <h3 className="text-xl font-bold text-white tracking-tight">Holographic Comm-Link Hub</h3>
            <p className="text-[12px] text-white/40 mt-1 max-w-[360px] leading-relaxed">
              Select your inquiry intent below to draft an encrypted transmission, or view the digital business card.
            </p>

            <div 
              className="relative w-full max-w-2xl h-[460px] mt-4"
              style={{ perspective: '2000px' }}
            >
              <div 
                className="w-full h-full relative transition-transform duration-700 ease-out transform-gpu cursor-default"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${flipped ? 180 : 0}deg) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* FRONT FACE: Comm-Link Drafting System */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.7),inset_0_0_8px_rgba(255,255,255,0.2)] text-left"
                  style={{ transform: 'translateZ(0px)', backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                >
                  {/* Top Header */}
                  <div className="flex justify-between items-center select-none">
                    <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">COMM-LINK UPLINK v2.0</span>
                    {/* Live Status indicator */}
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[8px] font-black text-emerald-400 tracking-[0.08em]">UPLINK ESTABLISHED / OPEN TO WORK</span>
                    </div>
                  </div>

                  {/* Intent Selector Pills */}
                  <div className="flex gap-2.5 justify-start my-1 select-none">
                    {(['job', 'freelance', 'networking'] as const).map((intent) => {
                      const label = intent === 'job' ? '💼 Job Opportunity' : intent === 'freelance' ? '🚀 Freelance Project' : '☕ Networking';
                      const active = activeIntent === intent;
                      return (
                        <button
                          key={intent}
                          onMouseEnter={playTick}
                          onClick={() => { playTick(); setActiveIntent(intent); }}
                          className="px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer outline-none border-none"
                          style={{
                            background: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                            color: active ? '#ffffff' : 'rgba(255,255,255,0.45)',
                            boxShadow: active ? '0 0 15px rgba(255,255,255,0.10)' : 'none'
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Drafting Terminal Block */}
                  <div className="bg-black/85 shadow-[inset_0_0_25px_rgba(0,0,0,0.95)] border border-white/10 rounded-xl p-5 font-mono text-[12px] text-green-400/90 h-[210px] relative overflow-hidden flex flex-col">
                    {/* Clipboard copy icon */}
                    <button
                      onClick={() => {
                        playTick();
                        navigator.clipboard.writeText(TEMPLATES[activeIntent]);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 800);
                      }}
                      className={`absolute top-4 right-4 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                        copied ? 'scale-90 border-white bg-white text-black' : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20'
                      }`}
                      title="Copy to Clipboard"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex-1 overflow-y-auto pr-8 text-left select-text scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                      <div className="text-white/25 text-[9px] mb-2 uppercase tracking-wider select-none font-sans font-bold">DRAFT TRANSMISSION PAYLOAD:</div>
                      <p className="leading-relaxed whitespace-pre-wrap">{draftText}</p>
                      <span className="w-2 h-4 bg-green-400 inline-block animate-pulse ml-0.5" />
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-4 items-center justify-between select-none">
                    <a
                      href={`mailto:nitheeshd.17@gmail.com?subject=${encodeURIComponent(SUBJECTS[activeIntent])}&body=${encodeURIComponent(TEMPLATES[activeIntent])}`}
                      onMouseEnter={playTick}
                      onClick={playWhoosh}
                      className="flex-1 bg-white text-black font-extrabold text-xs py-3.5 px-6 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      style={{ textDecoration: 'none' }}
                    >
                      Send Transmission ↗
                    </a>
                    <button
                      onMouseEnter={playTick}
                      onClick={() => { playWhoosh(); setFlipped(true); }}
                      className="px-5 py-3.5 rounded-full text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                      View Digital Card
                    </button>
                  </div>
                </div>

                {/* BACK FACE: SVG QR Code & Business Details */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.7),inset_0_0_8px_rgba(255,255,255,0.2)] text-left"
                  style={{ transform: 'rotateY(180deg) translateZ(0px)', backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                >
                  {/* Top Header */}
                  <div className="flex justify-between items-center select-none">
                    <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">DIGITAL V-CARD v2.0</span>
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[8px] font-black text-emerald-400 tracking-[0.08em]">SECURE DIRECT UPLINK</span>
                    </div>
                  </div>

                  {/* Info Panel with SVG QR */}
                  <div className="flex flex-row items-center justify-center gap-10 my-3">
                    {/* SVG QR Code */}
                    <div className="w-36 h-36 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-center shadow-lg relative group overflow-hidden shrink-0 select-none">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-white/80">
                        <rect x="5" y="5" width="22" height="22" strokeWidth="4.5" rx="2" />
                        <rect x="11" y="11" width="10" height="10" fill="currentColor" />
                        <rect x="73" y="5" width="22" height="22" strokeWidth="4.5" rx="2" />
                        <rect x="79" y="11" width="10" height="10" fill="currentColor" />
                        <rect x="5" y="73" width="22" height="22" strokeWidth="4.5" rx="2" />
                        <rect x="11" y="79" width="10" height="10" fill="currentColor" />
                        <path d="M 38 12 H 45 M 52 12 H 65 M 38 20 H 55 M 38 28 H 48 M 58 28 H 68 M 12 38 H 28 M 38 38 H 42 M 52 38 H 62 M 78 38 H 88 M 12 48 H 22 M 38 48 H 52 M 62 48 H 72 M 82 48 H 88 M 12 58 H 32 M 42 58 H 58 M 72 58 H 82 M 12 68 H 28 M 38 68 H 48 M 58 68 H 68 M 38 78 H 58 M 72 78 H 88 M 38 88 H 48 M 52 88 H 68 M 78 88 H 88" strokeWidth="4.5" strokeLinecap="square" />
                      </svg>
                    </div>

                    {/* Direct Contact Details */}
                    <div className="flex flex-col gap-4 text-left">
                      <div>
                        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Direct Line</div>
                        <a href="tel:+15615550199" onMouseEnter={playTick} className="text-base font-bold text-white hover:text-yellow-500 transition-colors" style={{ textDecoration: 'none' }}>
                          +1 (561) 555-0199
                        </a>
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Direct Mail</div>
                        <a href="mailto:nitheeshd.17@gmail.com" onMouseEnter={playTick} className="text-base font-bold text-white hover:text-yellow-500 transition-colors" style={{ textDecoration: 'none' }}>
                          nitheeshd.17@gmail.com
                        </a>
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Office Location</div>
                        <span className="text-sm font-semibold text-white/70">Florida, United States</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-4 items-center justify-between select-none">
                    <button
                      onMouseEnter={playTick}
                      onClick={() => { playWhoosh(); setFlipped(false); }}
                      className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/25 py-3.5 px-6 rounded-full transition-all cursor-pointer text-xs font-bold"
                    >
                      Flip Back to Comm-Link
                    </button>
                    <a
                      href="/resume.pdf"
                      download
                      onMouseEnter={playTick}
                      className="bg-white text-black font-extrabold text-xs py-3.5 px-6 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      style={{ textDecoration: 'none' }}
                    >
                      <Download className="w-3.5 h-3.5 text-black" />
                      Download CV
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. Apple News Style Expanded Interactive Overlay (Semantic markup for Bots/ATS) */}
      {selectedTile && (() => {
        const data = tilesData[selectedTile as keyof typeof tilesData];
        return (
          <article 
            className="ai-answer-zoom absolute inset-0 z-50 bg-[#0d0e15]/98 backdrop-blur-3xl p-12 overflow-y-auto text-left"
          >
            {/* Back button */}
            <button 
              onClick={() => { playWhoosh(); setSelectedTile(null); }}
              onMouseEnter={playTick}
              className="text-white/60 hover:text-white flex items-center gap-2 mb-8 cursor-pointer select-none border-none bg-transparent outline-none font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back</span>
            </button>

            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {/* Header */}
              <div>
                <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest block mb-2">{data.date}</span>
                <h3 className="text-[2.25rem] font-black text-white leading-tight tracking-tight">{data.title}</h3>
                <h4 className="text-xl font-bold text-white/65 mt-1">{data.company}</h4>
              </div>

              {/* Memory Image (if milestone) */}
              {'image' in data && data.image && (
                <div className="w-full h-[320px] rounded-3xl overflow-hidden border border-white/10 my-4 shadow-2xl">
                  <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Summary / Description */}
              <p className="text-[14px] leading-relaxed text-white/80 border-l-2 border-yellow-500 pl-4 py-1">
                {data.summary}
              </p>

              {/* Detailed Bullet Points (Semantic list for ATS scrapers) */}
              <div className="mt-4">
                <h4 className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-4">Core Work & Outcomes</h4>
                <ul className="flex flex-col gap-3.5 list-none pl-0">
                  {data.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-[13px] leading-relaxed text-white/70">
                      <span className="text-yellow-500 select-none shrink-0 mt-0.5">✦</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Stack */}
              {'tech' in data && data.tech && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h4 className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-3">Technologies Leveraged</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.tech.map(t => (
                      <span key={t} className="bg-white/5 border border-white/10 text-white/70 px-3.5 py-1 rounded-full text-xs font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })()}
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

const AI_ANSWERS_DB: Record<string, Record<string, string>> = {
  'd-scent-house': {
    'How does the custom pg_notify job queue work?': 'pg_notify triggers asynchronous database-level event broadcasts. Next.js API endpoints listen to these events to process background mailers and Stripe webhooks with zero polling overhead.',
    'Why PostgreSQL over NoSQL?': 'PostgreSQL guarantees ACID transactions, crucial for financial/payment state sync, and allows powerful operations like pg_notify for event-driven logic and robust relational querying.',
    'What was the biggest tech challenge?': 'Managing state synchronization across concurrent checkout sessions while ensuring the serverless pg_notify workers handled transactional emails with idempotency.',
    'What makes D-scent-house production-ready?': 'Features margin floor security logic, full Stripe integration, pg_notify background processing, database schema migrations, and high test coverage on core transaction flows.'
  },
  'coach-jake': {
    'Explain the NextAuth JWT claims optimization': 'We optimized token payload size by stripping unnecessary profile data and storing role-based access flags directly inside the encrypted JWT, reducing payload size by 65%.',
    'How is the AI integrated here?': 'The platform utilizes analytical dashboards to model player conditioning logs and head coach KPIs, displaying progress patterns dynamically.',
    'Explain the role-based conditional routing': 'Middleware decodes the optimized JWT claims to enforce server-side redirection. Head coaches, assistants, and players are strictly isolated into distinct dashboard route groups.',
    'What was the biggest tech challenge?': 'Designing a robust dashboard scaling mechanism for complex player logs with quick query lookups under high concurrent access.'
  },
  'unick-auto-detailing': {
    'How is OpenAI function calling utilized?': 'OpenAI analyzes customer booking requests in natural language, extracts target service goals, and maps them to JSON arguments for automated package selection and pricing.',
    'Why PostgreSQL over NoSQL?': 'Unick utilizes PostgreSQL relational structures to map dynamic customer detail schemas and customer history queries reliably with transactions.',
    'Explain the Twilio SMS rebooking automation': 'A cron worker checks completion logs weekly, triggering Twilio REST API calls to send personalized SMS reminders to clients based on their detailing history.',
    'What was the biggest tech challenge?': 'Ensuring NLU parser resilience under variable user prompts while keeping OpenAI API costs minimal via prompt caching.'
  },
  'citrix-rag-knowledge-assistant': {
    'How does the RAG pipeline work?': 'The RAG pipeline retrieves vector matches from Pinecone, formats them as context, and queries the LLM. Enforces post-generation citation validation to prevent hallucinations.',
    'How does the RAG pipeline prevent hallucinations?': 'Strict regex-based post-generation citation validation parses context vectors. If the answer cannot be mapped to source chunk metadata, it is flagged and retried.',
    'Explain the citation validation mechanism': 'Retrieval matches chunks from Pinecone, then passes them with source IDs to the LLM. The validator parses generated brackets [Source 12] against chunk metadata for matching.',
    'What was the biggest tech challenge?': 'Indexing and updating 40k articles in vector space in real-time with efficient cosine-similarity queries.'
  },
  'koreai-customer-service-agent': {
    'How is the AI integrated here?': 'Enterprise chatbot intent retraining pipeline matching Kore.ai NLU models, combined with webhook deduplication middleware.',
    'Explain the Spring Boot webhook idempotency': 'A Redis-backed interceptor hashes incoming Kore.ai webhook payloads. Duplicate transaction IDs within 5 seconds are dropped, resolving race conditions.',
    'How was NLU intent retraining handled?': 'Retraining pipeline parses confusion matrices of misclassified queries, clusters low-confidence intents via K-Means, and retrains the Kore.ai NLU model.',
    'What was the shadow deployment period KPI?': '60 days of parallel run: chatbot generated draft replies without sending them, comparing agent actions to manual human replies to verify intent safety.'
  },
  'healthcare-readmission-prediction': {
    'What features did the ML model utilize?': 'Demographics, diagnostic codes, admission types, medication changes, and historical readmission data, processed using StandardScaler and OneHotEncoder.',
    'Why PostgreSQL over NoSQL?': 'PostgreSQL hosts transaction logs and readmission tracking schemas with foreign keys linking diagnostic code references.',
    'Explain the model deployment architecture': 'A scikit-learn random forest classifier serialized to a pickle file, served via a lightweight Flask API inside a containerized AWS ECS task.',
    'What was the biggest tech challenge?': 'Optimizing random forest model hyperparameters to minimize false negative readmission predictions while processing 15k patient holdouts.'
  }
};

const MOCK_REPO_FILES: Record<string, { files: string[]; content: Record<string, string> }> = {
  'd-scent-house': {
    files: ['package.json', 'lib/jobQueue.ts', 'app/api/checkout/route.ts'],
    content: {
      'package.json': `{
  "name": "d-scent-house",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "pg": "^8.11.5",
    "stripe": "^15.1.0"
  }
}`,
      'lib/jobQueue.ts': `import { Client } from 'pg';

export async function initJobQueue() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  // Listen for database broadcasts
  await client.query('LISTEN new_checkout_job');
  
  client.on('notification', async (msg) => {
    const payload = JSON.parse(msg.payload || '{}');
    console.log('[Queue] Processing order:', payload.orderId);
    await processOrderMail(payload.orderId);
  });
}`,
      'app/api/checkout/route.ts': `import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const sql = getDb();
  
  // Enforce Margin Floor Security
  const minFloor = body.baseCost * 1.15; // 15% minimum margin
  if (body.price < minFloor) {
    return NextResponse.json({ error: 'Margin security breach' }, { status: 400 });
  }

  const order = await sql\`
    INSERT INTO orders (user_id, total, status)
    VALUES (\${body.userId}, \${body.price}, 'pending')
    RETURNING id;
  \`;
  
  return NextResponse.json(order);
}`
    }
  },
  'coach-jake': {
    files: ['middleware.ts', 'app/api/auth/[...nextauth]/route.ts', 'app/dashboard/page.tsx'],
    content: {
      'middleware.ts': `import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = token?.role;

    // Enforce Head Coach / Assistant / Player dashboard partitioning
    if (req.nexturl.pathname.startsWith("/dashboard/coach") && role !== "HEAD_COACH") {
      return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);`,
      'app/api/auth/[...nextauth]/route.ts': `import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Fetch user from DB and verify password hash
        return { id: "1", name: "Jake", role: "HEAD_COACH" };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role; // Optimize JWT payload
      return token;
    }
  }
};`
    }
  },
  'unick-auto-detailing': {
    files: ['app/api/booking/route.ts', 'lib/openai.ts'],
    content: {
      'app/api/booking/route.ts': `import { Configuration, OpenAIApi } from 'openai';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  // Call OpenAI function calling to map goals to package
  const response = await openai.createChatCompletion({
    model: "gpt-4-0613",
    messages: [{ role: "user", content: prompt }],
    functions: [{
      name: "selectPackage",
      parameters: {
        type: "object",
        properties: {
          packageId: { type: "string" },
          frequencyWeeks: { type: "number" }
        }
      }
    }]
  });
  
  return Response.json(response.data);
}`
    }
  },
  'citrix-rag-knowledge-assistant': {
    files: ['rag/pipeline.py', 'rag/validation.py'],
    content: {
      'rag/pipeline.py': `from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings
import pinecone

def query_rag_assistant(user_query: str):
    embeddings = OpenAIEmbeddings()
    vectorstore = Pinecone.from_existing_index("citrix-kb", embeddings)
    
    # Cosine similarity retrieval
    docs = vectorstore.similarity_search(user_query, k=4)
    return docs`,
      'rag/validation.py': `import re

def validate_citations(response: str, sources: list):
    # Enforce strict citation brackets parsing to prevent LLM hallucination
    citations = re.findall(r'\\[([0-9]+)\\]', response)
    valid_sources = {s['id'] for s in sources}
    
    for c in citations:
        if int(c) not in valid_sources:
            return False # Hallucination detected
    return True`
    }
  },
  'koreai-customer-service-agent': {
    files: ['IdempotencyInterceptor.java', 'NluRetraining.py'],
    content: {
      'IdempotencyInterceptor.java': `package com.kore.middleware;

import org.springframework.web.servlet.HandlerInterceptor;
import redis.clients.jedis.Jedis;

public class IdempotencyInterceptor implements HandlerInterceptor {
    private Jedis redis = new Jedis("localhost", 6379);

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        String key = req.getHeader("X-Request-Id");
        if (redis.exists(key)) {
            res.setStatus(409); // Conflict: Duplicate request
            return false;
        }
        redis.setex(key, 5, "processed"); // 5s deduplication window
        return true;
    }
}`
    }
  },
  'healthcare-readmission-prediction': {
    files: ['model/train.py', 'app/predict.py'],
    content: {
      'model/train.py': `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

def train_model(data_path):
    df = pd.read_csv(data_path)
    X = df.drop('readmitted', axis=1)
    y = df['readmitted']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
    clf.fit(X_train, y_train)
    
    with open('model.pkl', 'wb') as f:
        pickle.dump(clf, f)`
    }
  }
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

  const [activeLeftTab, setActiveLeftTab]         = useState<'challenge' | 'solution' | 'impact'>('challenge');
  const [selectedAiQuestion, setSelectedAiQuestion] = useState<string | null>(null);
  const [selectedAiAnswer, setSelectedAiAnswer]     = useState<string | null>(null);
  const [aiAnswerVisible, setAiAnswerVisible]       = useState<boolean>(false);
  const [activeRepoFile, setActiveRepoFile]         = useState<string>('');

  const [booted, setBooted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setBooted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getAiQuestions = () => {
    const slug = activeProject?.slug || '';
    const qList: string[] = [];
    if (slug === 'd-scent-house') {
      qList.push('How does the custom pg_notify job queue work?', 'Why PostgreSQL over NoSQL?', 'What was the biggest tech challenge?', 'What makes D-scent-house production-ready?');
    } else if (slug === 'coach-jake') {
      qList.push('Explain the NextAuth JWT claims optimization', 'How is the AI integrated here?', 'Explain the role-based conditional routing', 'What was the biggest tech challenge?');
    } else if (slug === 'unick-auto-detailing') {
      qList.push('How is OpenAI function calling utilized?', 'Why PostgreSQL over NoSQL?', 'Explain the Twilio SMS rebooking automation', 'What was the biggest tech challenge?');
    } else if (slug === 'citrix-rag-knowledge-assistant') {
      qList.push('How does the RAG pipeline work?', 'How does the RAG pipeline prevent hallucinations?', 'Explain the citation validation mechanism', 'What was the biggest tech challenge?');
    } else if (slug === 'koreai-customer-service-agent') {
      qList.push('How is the AI integrated here?', 'Explain the Spring Boot webhook idempotency', 'How was NLU intent retraining handled?', 'What was the shadow deployment period KPI?');
    } else if (slug === 'healthcare-readmission-prediction') {
      qList.push('What features did the ML model utilize?', 'Why PostgreSQL over NoSQL?', 'Explain the model deployment architecture', 'What was the biggest tech challenge?');
    } else {
      qList.push('How is the AI integrated here?', 'Why PostgreSQL over NoSQL?', 'What was the biggest tech challenge?');
    }
    return qList.slice(0, 3); // Return max 3 questions
  };

  const handleAskQuestion = (question: string) => {
    setAiAnswerVisible(false);
    setTimeout(() => {
      setSelectedAiQuestion(question);
      const slug = activeProject?.slug || '';
      const ans = AI_ANSWERS_DB[slug]?.[question] || 'I am looking into this now. Co-pilot matches current stacks to explain custom integrations.';
      setSelectedAiAnswer(ans);
      setAiAnswerVisible(true);
    }, 200);
  };

  useEffect(() => {
    if (activeProject) {
      const url = activeProject.live_url || '';
      setIframeUrl(url);
      setIframeLoading(true);
      setIframeBlocked(false);
      
      // Reset interactive states for the active project
      setActiveLeftTab('challenge');
      setSelectedAiQuestion(null);
      setSelectedAiAnswer(null);
      setAiAnswerVisible(false);
      
      const slug = activeProject.slug || '';
      const defaultFile = MOCK_REPO_FILES[slug]?.files[0] || 'package.json';
      setActiveRepoFile(defaultFile);

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
    <div
      style={{
        zoom: 0.80,
        width: '125vw',
        height: '125vh',
        overflow: 'hidden',
        background: '#000000',
        position: 'relative',
      }}
    >
      {/* Cinematic boot-up fade & blur for environment background */}
      <div 
        className="transition-all duration-[1500ms] ease-out transform-gpu w-full h-full absolute inset-0"
        style={{
          opacity: booted ? 1 : 0,
          filter: booted ? 'blur(0px)' : 'blur(40px)',
        }}
      >
        <BackgroundImage />
        <DesktopBackground />
      </div>
      <MenuBar onOpenAll={openAll} onCloseAll={closeAll} />

      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 p-6"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* Centered Main Window Container — sits exactly in the center of the screen */}
        <div 
          className="relative pointer-events-auto flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Module A: Left Dock Rail — positioned fixed on the left viewport edge */}
          {!activeProject && (
            <div
              className="transition-all duration-[1000ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu fixed left-8 top-1/2 -translate-y-1/2 z-[9998]"
              style={{
                opacity: booted ? 1 : 0,
                transform: booted 
                  ? 'translateY(-50%) scale(1) translateZ(0)' 
                  : 'translateY(-50%) scale(0.9) translateZ(-200px)',
                transitionDelay: '200ms',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                pointerEvents: booted ? 'auto' : 'none'
              }}
            >
              <Dock
                windows={dockWindows}
                onToggle={toggleWindow}
                className="relative"
              />
            </div>
          )}

          {/* Module B: Top Browser Bar & Workspace Wrap (staggered delay 450ms) */}
          <div
            className="transition-all duration-[1000ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu relative flex flex-col items-center justify-center"
            style={{
              opacity: booted ? 1 : 0,
              transform: booted 
                ? 'translateY(0px) scale(1) translateZ(0)' 
                : 'translateY(48px) scale(0.9) translateZ(-200px)',
              transitionDelay: '450ms',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              pointerEvents: booted ? 'auto' : 'none'
            }}
          >
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
                  LEFT — Unified Case Study Briefing (visionOS UI)
                  ══════════════════════════════════════════════ */}
              <div
                className="spatial-glow-left transform-gpu backface-hidden will-change-[transform,opacity] w-[24vw] min-w-[280px] max-w-[380px] h-[75vh] flex-shrink-0 z-20 rounded-3xl"
                style={{ transform: 'translateZ(-60px) rotateY(10deg) scale(0.95)', transformOrigin: 'right center' }}
              >
                <div
                  className="w-full h-full bg-black/65 backdrop-blur-3xl rounded-3xl flex flex-col p-5 overflow-hidden text-left"
                  style={{
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderTop: '1px solid rgba(255,255,255,0.16)',
                    boxShadow: '0 30px 70px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Category Badge */}
                  <div className="shrink-0 mb-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/5 border border-amber-400/20">
                      {activeProject.category || 'CASE STUDY'}
                    </span>
                  </div>
                  
                  {/* Tab Selector */}
                  <div className="shrink-0 flex rounded-full p-1 bg-black/40 border border-white/5 mb-4 select-none">
                    {['challenge', 'solution', 'impact'].map(t => (
                      <button key={t} onClick={() => { playTick(); setActiveLeftTab(t as any); }}
                        onMouseEnter={playTick}
                        className={`flex-1 px-2 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                          activeLeftTab === t ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/70'
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Active Tab Scrollable Content Area */}
                  <div className="flex-1 overflow-y-auto pr-1 select-text scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                    {activeLeftTab === 'challenge' && (
                      <div className="flex flex-col gap-4">
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-violet-400 mb-1.5 block">The Problem</span>
                          <p className="text-[12px] text-white/80 leading-relaxed">{activeProject.problem_statement || 'Details on the core challenge statement.'}</p>
                        </div>
                        {activeProject.testimonial_quote && (
                          <div className="mt-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] relative">
                            <span className="text-3xl text-violet-400/20 font-serif absolute top-1 left-2 pointer-events-none">&ldquo;</span>
                            <p className="text-[11px] italic text-white/60 leading-relaxed pl-4 pr-1 relative z-10">&ldquo;{activeProject.testimonial_quote}&rdquo;</p>
                            <p className="text-[9px] font-bold mt-2 text-violet-400/70 text-right pr-2">— {activeProject.testimonial_author}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeLeftTab === 'solution' && (
                      <div className="flex flex-col gap-4">
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 mb-1.5 block">The Approach</span>
                          <p className="text-[12px] text-white/80 leading-relaxed">{activeProject.approach || 'Details on the technical execution path.'}</p>
                        </div>
                        {activeProject.process_notes && (
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400 mb-1.5 block">Architecture</span>
                            <p className="text-[11px] text-white/60 leading-relaxed bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-xl">{activeProject.process_notes}</p>
                          </div>
                        )}
                        {activeProject.stack && activeProject.stack.length > 0 && (
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/35 mb-2 block">Technology Stack</span>
                            <div className="flex flex-wrap gap-1.5">
                              {activeProject.stack.map(t => (
                                <span key={t} className="px-2 py-0.5 rounded-full text-[8px] font-mono text-blue-300/80 bg-blue-300/5 border border-blue-300/15">{t}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeLeftTab === 'impact' && (
                      <div className="flex flex-col items-center text-center gap-5">
                        {activeProject.roi_value && (
                          <div className="relative mt-2 shrink-0">
                            {(() => {
                              const r = 38; const circ = 2 * Math.PI * r;
                              const raw = parseInt(activeProject.roi_value!.replace(/[^0-9]/g, '')) || 75;
                              const pct = Math.min(raw > 100 ? 80 : raw, 100);
                              const off = circ * (1 - pct / 100);
                              return (
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
                              );
                            })()}
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-[13px] font-bold text-white/90">{activeProject.roi_label}</p>
                          {activeProject.roi_context && <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed">{activeProject.roi_context}</p>}
                        </div>
                      </div>
                    )}
                  </div>
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

                  {/* GitHub button — loads the repo directly in the iframe */}
                  {activeProject.github_url && (
                    <button
                      onClick={() => {
                        setIframeUrl(activeProject.github_url!);
                        setIframeLoading(true);
                        setIframeBlocked(false);
                      }}
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
                  {iframeUrl === activeProject.github_url ? (
                    /* ── Premium Mock VS Code Editor ── */
                    <div className="absolute inset-0 flex bg-[#0d0e15] font-sans">
                      {/* 1. Sidebar File Tree */}
                      <div className="w-[180px] shrink-0 border-r border-white/5 bg-[#090a0f] flex flex-col text-left py-3.5 select-none">
                        <span className="px-4 text-[9px] font-black uppercase tracking-wider text-white/30 block mb-3">EXPLORER</span>
                        <div className="px-3.5 text-[10px] font-semibold text-white/45 flex items-center gap-1.5 mb-2 truncate">
                          📂 {activeProject.slug}
                        </div>
                        <div className="flex flex-col">
                          {(MOCK_REPO_FILES[activeProject.slug]?.files || ['package.json', 'README.md']).map(f => (
                            <button key={f} onClick={() => setActiveRepoFile(f)}
                              className={`px-6 py-1.5 text-left text-[11px] font-mono flex items-center gap-2 border-l-2 transition-all ${
                                activeRepoFile === f
                                  ? 'bg-white/[0.04] text-cyan-400 border-cyan-400'
                                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.01] border-transparent'
                              }`}>
                              📄 {f.split('/').pop()}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* 2. Main Editor Pane */}
                      <div className="flex-1 flex flex-col min-w-0 bg-[#0d0e15] text-left">
                        {/* Tab Bar */}
                        <div className="h-9 border-b border-white/5 bg-[#090a0f] flex items-center pr-4 select-none">
                          <div className="h-full px-4 border-r border-white/5 bg-[#0d0e15] text-cyan-400 text-[11px] font-mono flex items-center gap-2">
                            📄 {activeRepoFile.split('/').pop()}
                            <span className="text-[9px] text-white/20 hover:text-white/60 cursor-pointer">✕</span>
                          </div>
                          <span className="ml-auto text-[9px] text-white/20 font-mono tracking-widest uppercase">GIT PREVIEW</span>
                        </div>
                        
                        {/* Code editor body with syntax styling */}
                        <div className="flex-1 p-5 overflow-y-auto font-mono text-[11px] leading-relaxed text-white/80 select-text">
                          <pre style={{ margin: 0 }}>
                            <code>
                              {(MOCK_REPO_FILES[activeProject.slug]?.content[activeRepoFile] || '// Code snippet not found.').split('\n').map((line, idx) => (
                                <div key={idx} className="flex hover:bg-white/[0.02]">
                                  <span className="w-8 shrink-0 text-white/20 text-right pr-3 select-none">{idx + 1}</span>
                                  <span className="whitespace-pre">{line}</span>
                                </div>
                              ))}
                            </code>
                          </pre>
                        </div>
                        
                        {/* Status bar */}
                        <div className="h-5 shrink-0 bg-[#090a0f] border-t border-white/5 px-4 flex items-center justify-between text-[9px] font-mono text-white/25 select-none">
                          <div className="flex items-center gap-3">
                            <span className="text-violet-400">main*</span>
                            <span>UTF-8</span>
                          </div>
                          <div>TypeScript</div>
                        </div>
                      </div>
                    </div>
                  ) : iframeBlocked ? (
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
                          className={`border-none bg-[#050505] transition-opacity duration-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
                          title={activeProject.title}
                          allow="clipboard-write"
                          style={{
                            width: '140%',
                            height: '140%',
                            transform: 'scale(0.71428)',
                            transformOrigin: 'top left',
                            display: 'block',
                            scrollbarWidth: 'none'
                          }}
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
                    {getAiQuestions().map(q => (
                      <button key={q} onClick={() => { playWhoosh(); handleAskQuestion(q); }} title="Ask Co-Pilot"
                        onMouseEnter={playTick}
                        className="w-full text-left px-3 py-2 rounded-xl text-[9.5px] text-white/65 transition-all duration-200 transform-gpu will-change-[transform,opacity] hover:text-white hover:bg-white/[0.07] active:scale-[0.98] group"
                        style={{ background: 'rgba(0,0,0,0.55)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.55)', borderTop: '1px solid rgba(255,255,255,0.06)', borderLeft: '2px solid rgba(255,255,255,0.04)' }}
                      >
                        <span className="text-violet-400/55 mr-1.5 inline-block group-hover:translate-x-0.5 transition-transform duration-200">▸</span>{q}
                      </button>
                    ))}
                  </div>

                  {/* ── Module C: Neural Diamond Map OR Active Answer ── */}
                  <div className="flex-1 min-h-0 mx-3 mt-3 mb-3 rounded-2xl relative overflow-hidden"
                    style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.06)', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                    
                    {selectedAiQuestion && aiAnswerVisible ? (
                      /* ── Active Answer Panel (flashes & zooms in) ── */
                      <div className="ai-answer-zoom absolute inset-0 p-4 flex flex-col bg-black/75 backdrop-blur-xl border border-white/5">
                        <div className="flex items-center justify-between mb-2 select-none">
                          <span className="text-[7.5px] font-black uppercase tracking-widest text-violet-400">Response</span>
                          <button onClick={() => { playWhoosh(); setAiAnswerVisible(false); }} onMouseEnter={playTick} className="text-[9px] font-black text-white/30 hover:text-white/60 uppercase tracking-wider">✕ Clear</button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-1 text-left select-text scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                          <span className="text-[9px] font-black text-white/40 block mb-1.5 uppercase leading-snug">Q: {selectedAiQuestion}</span>
                          <p className="text-[11px] text-emerald-300/90 leading-relaxed font-sans">{selectedAiAnswer}</p>
                        </div>
                      </div>
                    ) : (
                      /* ── Live Data Flow Map ── */
                      <>
                        <div className="absolute top-2.5 left-3 z-10 select-none">
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
                                  const mx = (n1.cx + n2.cx) / 2.0; const my = (n1.cy + n2.cy) / 2.0;
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
                      </>
                    )}
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

        @keyframes aiAnswerZoomIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(12px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        .ai-answer-zoom {
          animation: aiAnswerZoomIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

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
