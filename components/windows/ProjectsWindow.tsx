// components/windows/ProjectsWindow.tsx
// Three-column Finder: Categories → Project List → Narrative Detail Panel
'use client';

import { memo, useState, useMemo } from 'react';
import {
  ExternalLink, Github, Star, CheckCircle2,
  AlertTriangle, BookOpen, Lightbulb, Zap, Target, Layers,
} from 'lucide-react';
import type { ProjectSummary, DataState } from '@/types/portfolio';

const COL_BORDER = 'border-r border-white/[0.06]';
const PANEL_H    = 'h-[440px]';

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const CATEGORY_LABELS: Record<string, string> = {
  'web-app':       'Web Apps',
  'ai':            'AI / ML',
  'design-system': 'Design Systems',
  'e-commerce':    'E-Commerce',
  'saas':          'SaaS',
  'mobile':        'Mobile',
};
function categoryLabel(c: string) {
  return CATEGORY_LABELS[c] ?? c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function SectionLabel({ icon: Icon, label }: { icon: React.FC<{className?: string}>; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className="w-3 h-3 text-violet-400/60" />
      <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-400/60">{label}</span>
    </div>
  );
}

function NarrativeBlock({ icon, label, text }: { icon: React.FC<{className?: string}>; label: string; text: string }) {
  return (
    <div>
      <SectionLabel icon={icon} label={label} />
      <p className="text-[12px] text-white/60 leading-relaxed pl-1">{text}</p>
    </div>
  );
}

function LoadingPane() {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${PANEL_H}`}>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
      <p className="text-[11px] font-mono text-white/25">Fetching project data…</p>
    </div>
  );
}

function SystemLinkFailure({ message }: { message?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${PANEL_H} bg-black/30 font-mono`}>
      <div className="flex items-center gap-2 text-red-400">
        <AlertTriangle className="w-5 h-5" />
        <span className="text-[13px] font-bold tracking-wide">SYSTEM LINK FAILURE</span>
      </div>
      <div className="text-center space-y-1">
        <p className="text-[11px] text-red-400/70">ERR_DB_CONNECTION</p>
        {message && <p className="text-[10px] text-white/30 max-w-[260px] leading-relaxed">{message}</p>}
        <p className="text-[10px] text-white/20 mt-2">Check DATABASE_URL in .env.local</p>
      </div>
      <div className="text-[10px] text-white/20 space-y-1 text-left">
        <p><span className="text-red-400/50">&gt;</span> Neon cluster unreachable</p>
        <p><span className="text-yellow-400/50">&gt;</span> Retrying in 30s…</p>
        <span className="inline-block w-[6px] h-[11px] bg-white/30 align-middle animate-pulse" />
      </div>
    </div>
  );
}

function RoiReceipt({ label, value, context }: { label: string; value: string; context?: string | null }) {
  return (
    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.4) 6px, rgba(255,255,255,0.4) 7px)' }}
      />
      <div className="relative">
        <div className="flex items-baseline gap-2">
          <p className="text-[36px] font-black text-emerald-400 leading-none tracking-tight">{value}</p>
          <CheckCircle2 className="w-4 h-4 text-emerald-400/60 mb-1" />
        </div>
        <p className="text-[11px] font-semibold text-emerald-300/80 mt-0.5 uppercase tracking-wide">{label}</p>
        {context && <p className="text-[10px] text-white/30 mt-1 leading-relaxed font-sans normal-case">{context}</p>}
      </div>
    </div>
  );
}

function VouchCard({ quote, author, avatar }: { quote: string; author: string; avatar?: string | null }) {
  const initials = author.split(',')[0].split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-br from-violet-500/60 to-fuchsia-600/60 border border-white/10 overflow-hidden">
          {avatar ? <img src={avatar} alt={author} className="w-full h-full object-cover" /> : <span>{initials}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 className="w-3 h-3 text-violet-400/70" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-violet-400/70">Client Vouch</span>
          </div>
          <p className="text-[12px] text-white/65 leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
          <p className="text-[10px] text-white/35 mt-2 font-medium not-italic">— {author}</p>
        </div>
      </div>
    </div>
  );
}

function ArtifactsGallery({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  return (
    <div>
      <SectionLabel icon={Layers} label="Artifacts" />
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {urls.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer"
            className="shrink-0 w-32 h-20 rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.03] hover:border-violet-500/30 transition-colors">
            <img src={url} alt={`Artifact ${i + 1}`} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </a>
        ))}
      </div>
    </div>
  );
}

function LearningsList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <SectionLabel icon={Lightbulb} label="Learnings" />
      <ul className="space-y-1.5 pl-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px] text-white/50 leading-relaxed">
            <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-violet-400/40" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SelectPrompt() {
  return (
    <div className={`flex flex-col items-center justify-center ${PANEL_H} gap-2`}>
      <p className="text-white/10 text-5xl select-none font-black">⌘</p>
      <p className="text-[11px] font-mono text-white/20">Select a project</p>
    </div>
  );
}

function DetailPanel({ project }: { project: ProjectSummary | null }) {
  if (!project) return <SelectPrompt />;

  const hasNarrative = !!(project.problem_statement || project.approach || project.process_notes);
  const hasArtifacts = (project.artifact_urls ?? []).length > 0;
  const hasLearnings = (project.learnings ?? []).length > 0;
  const hasRoi       = !!(project.roi_label && project.roi_value);
  const hasVouch     = !!(project.testimonial_quote && project.testimonial_author);

  return (
    <div className={`overflow-y-auto ${PANEL_H}`} style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.2) transparent' }}>
      <div className="p-5 flex flex-col gap-5">

        {project.thumbnail_url ? (
          <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.04]">
            <img src={project.thumbnail_url} alt={`${project.title} screenshot`} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-transparent border border-white/[0.06] flex items-center justify-center">
            <span className="text-4xl opacity-15 font-black">◈</span>
          </div>
        )}

        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[16px] font-extrabold text-white leading-snug">{project.title}</h3>
            {project.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />}
          </div>
          {project.subtitle && <p className="text-[12px] text-white/45 mt-0.5 leading-relaxed">{project.subtitle}</p>}
          {project.built_at && <p className="text-[10px] font-mono text-white/20 mt-1">Shipped {formatDate(project.built_at)}</p>}
        </div>

        {project.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span key={tech} className="text-[10px] font-mono text-violet-300/70 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        )}

        {hasNarrative && (
          <div className="flex flex-col gap-4 pt-1 border-t border-white/[0.05]">
            {project.problem_statement && <NarrativeBlock icon={Target}   label="Problem"  text={project.problem_statement} />}
            {project.approach          && <NarrativeBlock icon={Zap}      label="Approach" text={project.approach} />}
            {project.process_notes     && <NarrativeBlock icon={BookOpen} label="Process"  text={project.process_notes} />}
          </div>
        )}

        {hasArtifacts && <ArtifactsGallery urls={project.artifact_urls!} />}

        {hasRoi && (
          <div>
            <SectionLabel icon={CheckCircle2} label="Impact" />
            <RoiReceipt label={project.roi_label!} value={project.roi_value!} context={project.roi_context} />
          </div>
        )}

        {hasVouch && <VouchCard quote={project.testimonial_quote!} author={project.testimonial_author!} avatar={project.testimonial_avatar} />}

        {hasLearnings && <LearningsList items={project.learnings!} />}

        <div className="flex gap-2 pt-2 border-t border-white/[0.05]">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 flex-1 justify-center bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-[12px] font-semibold py-2.5 rounded-xl transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> View Live
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 border border-white/[0.10] hover:border-white/[0.22] text-white/55 hover:text-white text-[12px] rounded-xl transition-all active:scale-95" aria-label="View on GitHub">
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyCategory() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 gap-2 text-center">
      <span className="text-2xl select-none">📂</span>
      <p className="text-[12px] text-white/25">No projects in this category yet.</p>
    </div>
  );
}

function CategoryButton({ label, prefix, active, onClick }: { label: string; prefix: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-2 text-[12px] font-medium transition-colors flex items-center gap-2 ${active ? 'bg-violet-500/15 text-violet-300 border-l-2 border-violet-500' : 'text-white/45 hover:text-white/75 hover:bg-white/[0.04] border-l-2 border-transparent'}`}>
      <span className={`text-[10px] shrink-0 ${active ? 'text-violet-400' : 'opacity-30'}`}>{prefix}</span>
      {label}
    </button>
  );
}

function ProjectRow({ project, isSelected, onClick }: { project: ProjectSummary; isSelected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-2.5 transition-colors border-b border-white/[0.04] border-l-2 ${isSelected ? 'bg-violet-500/10 border-l-violet-500' : 'border-l-transparent hover:bg-white/[0.04]'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[12px] font-medium truncate leading-snug ${isSelected ? 'text-violet-200' : 'text-white/65'}`}>{project.title}</span>
        {project.featured && <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />}
      </div>
      {project.roi_value && <span className="text-[10px] text-emerald-400/70 font-mono font-semibold">{project.roi_value}</span>}
    </button>
  );
}

export interface ProjectsWindowProps {
  projects: ProjectSummary[];
  state:    DataState;
}

export const ProjectsWindow = memo(function ProjectsWindow({ projects, state }: ProjectsWindowProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('__all__');
  const [selectedProject,  setSelectedProject]  = useState<ProjectSummary | null>(null);

  const categories      = useMemo(() => [...new Set(projects.map((p) => p.category))].sort(), [projects]);
  const filteredProjects = useMemo(() => selectedCategory === '__all__' ? projects : projects.filter((p) => p.category === selectedCategory), [projects, selectedCategory]);

  if (state.status === 'loading') return <div className="flex"><LoadingPane /></div>;
  if (state.status === 'error')   return <SystemLinkFailure message={state.error} />;

  return (
    <div className="flex">
      <div className={`w-[152px] shrink-0 ${COL_BORDER} overflow-y-auto flex flex-col ${PANEL_H}`}>
        <p className="px-4 pt-3.5 pb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/20">Categories</p>
        <CategoryButton label="All Projects" prefix="◈" active={selectedCategory === '__all__'} onClick={() => { setSelectedCategory('__all__'); setSelectedProject(null); }} />
        {categories.map((cat) => (
          <CategoryButton key={cat} label={categoryLabel(cat)} prefix="▸" active={selectedCategory === cat} onClick={() => { setSelectedCategory(cat); setSelectedProject(null); }} />
        ))}
      </div>

      <div className={`w-[200px] shrink-0 ${COL_BORDER} overflow-y-auto flex flex-col ${PANEL_H}`}>
        <p className="px-4 pt-3.5 pb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/20 flex items-center gap-1.5">
          {selectedCategory === '__all__' ? 'All Projects' : categoryLabel(selectedCategory)}
          <span className="text-white/15 font-normal normal-case">{filteredProjects.length}</span>
        </p>
        {filteredProjects.length === 0 ? <EmptyCategory /> : filteredProjects.map((project) => (
          <ProjectRow key={project.id} project={project} isSelected={selectedProject?.id === project.id} onClick={() => setSelectedProject(project)} />
        ))}
      </div>

      <div className="flex-1 min-w-0">
        <DetailPanel project={selectedProject} />
      </div>
    </div>
  );
});
