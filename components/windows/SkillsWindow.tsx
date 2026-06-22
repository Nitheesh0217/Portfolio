// components/windows/SkillsWindow.tsx
// Interactive skills and tech stack visualization
'use client';

import { memo, useMemo, useState } from 'react';
import { Code2, TrendingUp } from 'lucide-react';
import type { ProjectSummary } from '@/types/portfolio';

interface SkillStat {
  name: string;
  count: number;
  projects: string[];
}

function categorizeSkill(skill: string): 'frontend' | 'backend' | 'database' | 'devops' | 'ai' | 'other' {
  const lower = skill.toLowerCase();

  if (['react', 'vue', 'svelte', 'next.js', 'astro', 'tailwind', 'css', 'html', 'javascript', 'typescript'].some(s => lower.includes(s))) return 'frontend';
  if (['node.js', 'python', 'java', 'spring', 'fastapi', 'django', 'flask', 'go', 'rust'].some(s => lower.includes(s))) return 'backend';
  if (['postgres', 'mysql', 'mongodb', 'redis', 'sql'].some(s => lower.includes(s))) return 'database';
  if (['docker', 'kubernetes', 'vercel', 'aws', 'gcp', 'heroku', 'railway', 'github'].some(s => lower.includes(s))) return 'devops';
  if (['claude', 'openai', 'anthropic', 'ai', 'langchain', 'rag', 'nlp'].some(s => lower.includes(s))) return 'ai';

  return 'other';
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  frontend: { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/20' },
  backend: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20' },
  database: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/20' },
  devops: { bg: 'bg-orange-500/10', text: 'text-orange-300', border: 'border-orange-500/20' },
  ai: { bg: 'bg-pink-500/10', text: 'text-pink-300', border: 'border-pink-500/20' },
  other: { bg: 'bg-white/5', text: 'text-white/60', border: 'border-white/10' },
};

export const SkillsWindow = memo(function SkillsWindow({ projects }: { projects: ProjectSummary[] }) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skillStats = useMemo(() => {
    const stats: Record<string, SkillStat> = {};

    for (const project of projects) {
      if (project.stack?.length) {
        for (const skill of project.stack) {
          if (!stats[skill]) {
            stats[skill] = { name: skill, count: 0, projects: [] };
          }
          stats[skill].count += 1;
          stats[skill].projects.push(project.title);
        }
      }
    }

    return Object.values(stats).sort((a, b) => b.count - a.count);
  }, [projects]);

  const categorized = useMemo(() => {
    const groups: Record<string, SkillStat[]> = {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      ai: [],
      other: [],
    };

    for (const skill of skillStats) {
      const category = categorizeSkill(skill.name);
      groups[category].push(skill);
    }

    return groups;
  }, [skillStats]);

  return (
    <div className="flex flex-col" style={{ width: '520px', height: '480px' }}>
      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.06] p-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-violet-400" />
          <h3 className="text-[13px] font-bold text-white/80">{skillStats.length} Skills</h3>
          <span className="text-[11px] text-white/30">across {projects.length} projects</span>
        </div>
      </div>

      {/* Skills Grid */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.2) transparent' }}
      >
        {Object.entries(categorized).map(
          ([category, skills]) =>
            skills.length > 0 && (
              <div key={category}>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2 px-2">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const category = categorizeSkill(skill.name);
                    const colors = CATEGORY_COLORS[category];
                    const isHovered = hoveredSkill === skill.name;
                    const maxCount = Math.max(...skillStats.map((s) => s.count));
                    const intensity = skill.count / maxCount;

                    return (
                      <button
                        key={skill.name}
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className={`relative px-3 py-2 rounded-lg border transition-all ${colors.bg} ${colors.border} ${colors.text} text-[11px] font-semibold group`}
                        style={{
                          opacity: hoveredSkill === null || isHovered ? 1 : 0.5,
                        }}
                      >
                        {/* Strength indicator */}
                        <div
                          className="absolute inset-0 rounded-lg opacity-10"
                          style={{
                            background: `linear-gradient(135deg, ${category === 'frontend' ? '#3b82f6' : category === 'backend' ? '#a855f7' : category === 'database' ? '#10b981' : category === 'devops' ? '#f97316' : category === 'ai' ? '#ec4899' : '#ffffff'}, transparent)`,
                          }}
                        />

                        <span className="relative">{skill.name}</span>

                        {/* Tooltip */}
                        {isHovered && (
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/80 text-white text-[10px] whitespace-nowrap border border-white/20">
                            Used in {skill.count} project{skill.count !== 1 ? 's' : ''}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ),
        )}
      </div>

      {/* Footer Stats */}
      <div className="shrink-0 border-t border-white/[0.06] px-4 py-3 bg-white/[0.01]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-white/40 text-[10px] font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>Total tech diversity: {skillStats.length} unique skills</span>
          </div>
        </div>
      </div>
    </div>
  );
});
