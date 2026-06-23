// components/windows/ProjectsWindow.tsx
// Luxury visual design gallery bento grid showcase with dynamic mockup simulation.
'use client';

import { memo, useState, useMemo } from 'react';
import {
  ExternalLink, Github, Star, CheckCircle2,
  AlertTriangle, BookOpen, Lightbulb, Zap, Target, X,
} from 'lucide-react';
import type { ProjectSummary, DataState } from '@/types/portfolio';

// Categorized display labels
const CATEGORY_LABELS: Record<string, string> = {
  'web-app':       'Web Systems',
  'ai':            'AI & NLU',
  'design-system': 'Design Systems',
  'e-commerce':    'E-Commerce',
  'saas':          'SaaS Platforms',
};

function categoryLabel(c: string) {
  return CATEGORY_LABELS[c] ?? c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function SectionLabel({ icon: Icon, label }: { icon: React.FC<{className?: string}>; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <Icon className="w-3.5 h-3.5 text-amber-400" />
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">{label}</span>
    </div>
  );
}

function NarrativeBlock({ icon, label, text }: { icon: React.FC<{className?: string}>; label: string; text: string }) {
  return (
    <div className="bg-white/[0.01] border border-white/[0.04] p-4.5 rounded-2xl">
      <SectionLabel icon={icon} label={label} />
      <p className="text-[12.5px] text-white/70 leading-relaxed pl-0.5">{text}</p>
    </div>
  );
}

// Custom UI Mockup simulator to create a premium visual presence without raw images
const ProjectMockupVisual = memo(function ProjectMockupVisual({ slug, category }: { slug: string; category: string }) {
  // Determine accent color and widget markup based on project slug
  const config = useMemo(() => {
    switch (slug) {
      case 'coach-jake':
        return {
          glow: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.2)',
          badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
          widget: (
            <div className="w-[180px] rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-3.5 flex flex-col gap-2">
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-widest font-mono">Athlete Status</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-amber-400/20 bg-amber-400/10 flex items-center justify-center font-mono text-[10px] font-black text-amber-300">
                  JR
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/80">Coach Jake</span>
                  <span className="text-[8px] text-white/40">Active Conditioning</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[8px] text-white/50">Drill Rate</span>
                <span className="text-[10.5px] font-mono font-bold text-amber-300">92%</span>
              </div>
            </div>
          ),
        };
      case 'd-scent-house':
        return {
          glow: 'rgba(236, 72, 153, 0.15)',
          border: 'rgba(236, 72, 153, 0.2)',
          badge: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
          widget: (
            <div className="w-[170px] rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-3.5 flex flex-col gap-2">
              <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-widest font-mono">D Scent House</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10.5px] font-bold text-white/80">Order Summary</span>
                <span className="text-[8.5px] text-pink-300/80">Oud Intense (100ml)</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1">
                <span className="text-[8.5px] text-white/50">Stripe Payment</span>
                <span className="text-[11px] font-mono font-bold text-white">$185.00</span>
              </div>
            </div>
          ),
        };
      case 'unick-auto-detailing':
        return {
          glow: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.2)',
          badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
          widget: (
            <div className="w-[175px] rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-3.5 flex flex-col gap-2">
              <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-widest font-mono">Service Booking</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10.5px] font-bold text-white/85">Detailing CRM</span>
                <span className="text-[8px] text-white/45">Paint Correction & Coating</span>
              </div>
              <div className="flex justify-between items-center mt-1 border-t border-white/5 pt-2">
                <span className="text-[8px] text-emerald-400 bg-emerald-400/15 px-1.5 py-0.5 rounded font-bold uppercase">Confirmed</span>
                <span className="text-[9.5px] font-mono text-white/70">June 25, 2:00 PM</span>
              </div>
            </div>
          ),
        };
      case 'citrix-rag-knowledge-assistant':
        return {
          glow: 'rgba(139, 92, 246, 0.15)',
          border: 'rgba(139, 92, 246, 0.2)',
          badge: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
          widget: (
            <div className="w-[190px] rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-3.5 flex flex-col gap-2">
              <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-widest font-mono">Citrix Citation RAG</span>
              <div className="flex flex-col gap-1">
                <div className="text-[9px] text-white/50 bg-white/5 px-2 py-1 rounded truncate font-mono">
                  kb.citrix.com/article-40892
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-[8.5px] font-bold mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> programmatically verified
                </div>
              </div>
            </div>
          ),
        };
      default: // koreai-customer-service-agent
        return {
          glow: 'rgba(14, 165, 233, 0.15)',
          border: 'rgba(14, 165, 233, 0.2)',
          badge: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
          widget: (
            <div className="w-[180px] rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-3.5 flex flex-col gap-2">
              <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-widest font-mono">Conversational NLU</span>
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="text-[8.5px] text-white/70 bg-white/5 px-2 py-1 rounded-lg self-end">
                  "Analyze webhook retries"
                </div>
                <div className="text-[8.5px] text-sky-300 bg-sky-400/10 px-2 py-1 rounded-lg self-start border border-sky-400/10">
                  Idempotent key enforced.
                </div>
              </div>
            </div>
          ),
        };
    }
  }, [slug]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#07070a] overflow-hidden flex items-center justify-center">
      {/* Dynamic light bloom */}
      <div
        className="absolute w-[200px] h-[200px] rounded-full blur-[80px] -top-1/4 -right-1/4 pointer-events-none transition-all duration-500 group-hover:scale-125"
        style={{ background: config.glow }}
      />
      {/* Background grid line pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      {/* Floating interactive simulated widget */}
      <div className="transform translate-y-1 group-hover:translate-y-[-2px] group-hover:scale-[1.02] transition-all duration-500 ease-out z-10 shadow-2xl">
        {config.widget}
      </div>
    </div>
  );
});

export const ProjectsWindow = memo(function ProjectsWindow({ projects, state }: ProjectsWindowProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('__all__');
  const [activeCaseStudy, setActiveCaseStudy] = useState<ProjectSummary | null>(null);

  const categories = useMemo(() => [...new Set(projects.map((p) => p.category))].sort(), [projects]);
  
  // Curated editorial sorting and filtering
  const filteredProjects = useMemo(() => {
    let list = selectedCategory === '__all__' ? projects : projects.filter((p) => p.category === selectedCategory);
    
    // Hardcoded sort order to align bento grid nicely:
    // 1. coach-jake (Featured, big bento card)
    // 2. d-scent-house (Supporting)
    // 3. unick-auto-detailing (Supporting)
    // 4. citrix-rag-knowledge-assistant (Featured, wide card)
    // 5. koreai-customer-service-agent (Supporting)
    const order = ['coach-jake', 'd-scent-house', 'unick-auto-detailing', 'citrix-rag-knowledge-assistant', 'koreai-customer-service-agent'];
    
    return [...list].sort((a, b) => {
      const idxA = order.indexOf(a.slug);
      const idxB = order.indexOf(b.slug);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }, [projects, selectedCategory]);

  if (state.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
        <p className="text-[11px] font-mono text-white/25">Opening Gallery Showcase…</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full h-full bg-black/20 font-mono rounded-2xl border border-red-500/25 p-8">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[13px] font-bold tracking-wide">GALLERY DISCONNECTED</span>
        </div>
        <p className="text-[11px] text-white/30">{state.error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col relative select-none bg-black/10">
      
      {/* Category Pills Header */}
      <div className="flex items-center justify-between px-10 py-5 shrink-0 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-extrabold tracking-tight text-white/95">Selected Works</span>
          <span className="text-[11px] font-mono text-white/30">({filteredProjects.length})</span>
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setSelectedCategory('__all__')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight transition-all border ${
              selectedCategory === '__all__'
                ? 'bg-white/10 text-white border-white/20 shadow-md shadow-black/30'
                : 'text-white/40 hover:text-white/70 border-transparent'
            }`}
          >
            All Works
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight transition-all border whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white/10 text-white border-white/20 shadow-md shadow-black/30'
                  : 'text-white/40 hover:text-white/70 border-transparent'
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid Editorial Gallery Area */}
      <div className="flex-1 overflow-y-auto px-10 py-6" style={{ scrollbarWidth: 'thin' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px] pb-12">
          {filteredProjects.map((p) => {
            // Coach Jake is the massive featured card (occupies 2 cols wide by 2 rows tall)
            const isFeaturedBig = p.slug === 'coach-jake';
            // Citrix is the wide supporting card (occupies 2 cols wide by 1 row tall)
            const isFeaturedWide = p.slug === 'citrix-rag-knowledge-assistant';
            
            return (
              <div
                key={p.id}
                onClick={() => setActiveCaseStudy(p)}
                className={`group flex flex-col rounded-[28px] overflow-hidden border border-white/[0.06] bg-white/[0.02] cursor-pointer hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1.5 ${
                  isFeaturedBig
                    ? 'md:col-span-2 md:row-span-2'
                    : isFeaturedWide
                    ? 'md:col-span-2 md:row-span-1'
                    : 'col-span-1 md:row-span-1'
                }`}
                style={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                {/* Image Section */}
                <div className="relative overflow-hidden w-full bg-[#08080c] border-b border-white/[0.05] flex-1">
                  {p.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbnail_url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    // Custom mockup illustration simulator
                    <ProjectMockupVisual slug={p.slug} category={p.category} />
                  )}

                  {/* Top Left category/featured overlay badge */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
                    {p.featured && <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />}
                    {categoryLabel(p.category)}
                  </div>

                  {/* Hover reveal text overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-[11px] font-bold text-white/95 tracking-tight flex items-center gap-1.5">
                      Explore Case Study <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col justify-between shrink-0 h-[100px] bg-[#0c0c14]/30">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-bold text-white leading-tight group-hover:text-amber-300 transition-colors">
                      {p.title}
                    </h3>
                    {p.roi_value && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 leading-none">
                        {p.roi_value}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
                    {/* Small stack tags */}
                    <div className="flex items-center gap-1.5 overflow-hidden max-w-[70%]">
                      {p.stack.slice(0, isFeaturedBig ? 4 : 2).map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] font-mono font-medium text-white/40 bg-white/[0.02] border border-white/[0.06] px-1.5 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {p.stack.length > (isFeaturedBig ? 4 : 2) && (
                        <span className="text-[9px] font-mono text-white/20">
                          +{p.stack.length - (isFeaturedBig ? 4 : 2)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Case Study →
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ─── CASE STUDY DETAILS OVERLAY ────────────────────────────── */}
      {activeCaseStudy && (
        <div
          className="absolute inset-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl flex flex-col animate-fade-in"
          style={{ animationDuration: '200ms' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-10 py-5 border-b border-white/[0.06] bg-black/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                  {categoryLabel(activeCaseStudy.category)}
                </span>
                {activeCaseStudy.featured && (
                  <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[8.5px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                    <Star className="w-2 h-2 fill-amber-300" /> Featured Work
                  </span>
                )}
              </div>
              <h2 className="text-[20px] font-black text-white leading-tight mt-0.5">{activeCaseStudy.title}</h2>
            </div>
            <button
              onClick={() => setActiveCaseStudy(null)}
              className="w-8 h-8 rounded-full border border-white/[0.08] hover:border-white/[0.22] bg-white/[0.02] flex items-center justify-center text-white/50 hover:text-white transition-all active:scale-95"
              aria-label="Close Case Study"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Scroll Area */}
          <div className="flex-1 overflow-y-auto px-10 py-8" style={{ scrollbarWidth: 'thin' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 pb-12">
              
              {/* Left Column: visual simulator + links + learnings */}
              <div className="flex flex-col gap-6">
                <div className="w-full aspect-video rounded-[24px] overflow-hidden border border-white/[0.06] relative">
                  {activeCaseStudy.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeCaseStudy.thumbnail_url}
                      alt={activeCaseStudy.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProjectMockupVisual slug={activeCaseStudy.slug} category={activeCaseStudy.category} />
                  )}
                </div>

                {/* Tech Stack Row */}
                <div className="flex flex-wrap gap-2">
                  {activeCaseStudy.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/5 border border-amber-400/15 px-2.5 py-1 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Direct Action Links */}
                <div className="flex gap-3">
                  {activeCaseStudy.live_url && (
                    <a
                      href={activeCaseStudy.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 flex-1 justify-center bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 active:scale-95 text-[#0e0d14] text-[12.5px] font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-400/10"
                    >
                      <ExternalLink className="w-4 h-4" /> View Live Project
                    </a>
                  )}
                  {activeCaseStudy.github_url && (
                    <a
                      href={activeCaseStudy.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-6 py-3 border border-white/[0.10] hover:border-white/[0.22] hover:bg-white/[0.02] text-white/70 hover:text-white text-[12.5px] font-semibold rounded-xl transition-all active:scale-95"
                    >
                      <Github className="w-4 h-4" /> Code Repository
                    </a>
                  )}
                </div>

                {/* Learnings */}
                {(activeCaseStudy.learnings ?? []).length > 0 && (
                  <div className="mt-2 border-t border-white/[0.05] pt-5">
                    <SectionLabel icon={Lightbulb} label="Key Learnings & Takeaways" />
                    <ul className="space-y-2.5 pl-1">
                      {activeCaseStudy.learnings!.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[12.5px] text-white/60 leading-relaxed">
                          <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Case narratives + ROI + Vouch */}
              <div className="flex flex-col gap-6">
                {activeCaseStudy.problem_statement && (
                  <NarrativeBlock
                    icon={Target}
                    label="The Challenge / Problem"
                    text={activeCaseStudy.problem_statement}
                  />
                )}

                {activeCaseStudy.approach && (
                  <NarrativeBlock
                    icon={Zap}
                    label="The Solution / Approach"
                    text={activeCaseStudy.approach}
                  />
                )}

                {activeCaseStudy.process_notes && (
                  <NarrativeBlock
                    icon={BookOpen}
                    label="Process Notes & Architecture"
                    text={activeCaseStudy.process_notes}
                  />
                )}

                {/* Impact stats box */}
                {activeCaseStudy.roi_value && activeCaseStudy.roi_label && (
                  <div className="rounded-[24px] border border-emerald-500/25 bg-emerald-500/[0.04] p-5 relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.4) 6px, rgba(255,255,255,0.4) 7px)' }}
                    />
                    <div className="relative">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[38px] font-black text-emerald-400 leading-none tracking-tight">
                          {activeCaseStudy.roi_value}
                        </span>
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400/60" />
                      </div>
                      <p className="text-[11px] font-bold text-emerald-300/80 mt-1 uppercase tracking-wider">
                        {activeCaseStudy.roi_label}
                      </p>
                      {activeCaseStudy.roi_context && (
                        <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed font-sans">
                          {activeCaseStudy.roi_context}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Client vouch testimonial */}
                {activeCaseStudy.testimonial_quote && activeCaseStudy.testimonial_author && (
                  <div className="rounded-[24px] border border-white/[0.06] bg-white/[0.015] p-5">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br from-amber-400/40 to-orange-500/40 border border-white/10 overflow-hidden">
                        {activeCaseStudy.testimonial_avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={activeCaseStudy.testimonial_avatar}
                            alt={activeCaseStudy.testimonial_author}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {activeCaseStudy.testimonial_author.split(',')[0].split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400/60" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400/60">Professional Vouch</span>
                        </div>
                        <p className="text-[12.5px] text-white/60 leading-relaxed italic">&ldquo;{activeCaseStudy.testimonial_quote}&rdquo;</p>
                        <p className="text-[10px] text-white/35 mt-2.5 font-bold not-italic">
                          — {activeCaseStudy.testimonial_author}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.99); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
      
    </div>
  );
});
