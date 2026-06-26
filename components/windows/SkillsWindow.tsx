// components/windows/SkillsWindow.tsx
'use client';

import { memo, useMemo, useState } from 'react';
import { Cpu } from 'lucide-react';
import type { ProjectSummary } from '@/types/portfolio';
import { TOKENS, accentBox } from '@/lib/designTokens';

type Category = 'all' | 'ai' | 'backend' | 'frontend' | 'database' | 'devops';

const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: 'all',      label: 'All',       color: TOKENS.violet  },
  { id: 'ai',       label: 'AI / ML',   color: '#e879f9'      },
  { id: 'backend',  label: 'Backend',   color: TOKENS.amber   },
  { id: 'frontend', label: 'Frontend',  color: TOKENS.sky     },
  { id: 'database', label: 'Database',  color: TOKENS.emerald },
  { id: 'devops',   label: 'DevOps',    color: '#fb923c'      },
];

function categorize(skill: string): Category {
  const s = skill.toLowerCase();
  if (['claude', 'openai', 'anthropic', 'ai', 'langchain', 'rag', 'nlp', 'nlü', 'kore', 'scikit', 'sklearn', 'pinecone', 'gpt', 'hugging'].some((k) => s.includes(k))) return 'ai';
  if (['node', 'python', 'java', 'spring', 'fastapi', 'django', 'flask', 'go', 'rust', 'express', 'php'].some((k) => s.includes(k))) return 'backend';
  if (['react', 'vue', 'svelte', 'next', 'astro', 'tailwind', 'css', 'html', 'javascript', 'typescript', 'js', 'ts'].some((k) => s.includes(k))) return 'frontend';
  if (['postgres', 'mysql', 'mongo', 'redis', 'sql', 'neon', 'snowflake', 'supabase'].some((k) => s.includes(k))) return 'database';
  if (['docker', 'kubernetes', 'vercel', 'aws', 'gcp', 'heroku', 'railway', 'github', 'ci', 'nginx', 'linux'].some((k) => s.includes(k))) return 'devops';
  return 'backend';
}

export const SkillsWindow = memo(function SkillsWindow({ projects }: { projects: ProjectSummary[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [hovered, setHovered] = useState<string | null>(null);

  const skills = useMemo(() => {
    const map: Record<string, { name: string; count: number; category: Category }> = {};
    for (const p of projects) {
      for (const s of p.stack ?? []) {
        if (!map[s]) map[s] = { name: s, count: 0, category: categorize(s) };
        map[s].count++;
      }
    }
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [projects]);

  const maxCount = Math.max(...skills.map((s) => s.count), 1);

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const catColor = (cat: Category) => CATEGORIES.find((c) => c.id === cat)?.color ?? TOKENS.violet;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-8 pt-7 pb-5 border-b"
        style={{ borderColor: TOKENS.border.base }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={accentBox(TOKENS.violet)}>
          <Cpu style={{ width: 15, height: 15, color: TOKENS.violet }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-black text-white tracking-tight">Tech Arsenal</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {skills.length} skills across {projects.length} projects
          </p>
        </div>
        {/* Category tabs */}
        <div className="flex items-center gap-1 flex-wrap justify-end">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-3 py-1 rounded-full text-[10px] font-bold transition-all"
                style={{
                  background: active ? `${cat.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? `${cat.color}40` : 'rgba(255,255,255,0.06)'}`,
                  color: active ? cat.color : 'rgba(255,255,255,0.35)',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skill grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0" style={{ scrollbarWidth: 'none' }}>
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.20)' }}>No skills in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((skill) => {
              const color = catColor(skill.category);
              const isHov = hovered === skill.name;
              const barWidth = `${(skill.count / maxCount) * 100}%`;
              return (
                <div
                  key={skill.name}
                  onMouseEnter={() => setHovered(skill.name)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex flex-col gap-2 px-4 py-3 rounded-2xl transition-all cursor-default"
                  style={{
                    background: isHov ? `${color}0d` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isHov ? `${color}30` : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isHov ? `0 0 20px ${color}10` : 'none',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[12px] font-bold leading-none truncate"
                      style={{ color: isHov ? color : 'rgba(255,255,255,0.80)' }}
                    >
                      {skill.name}
                    </span>
                    <span
                      className="shrink-0 ml-2 text-[9px] font-black px-1.5 py-0.5 rounded-md"
                      style={{
                        background: `${color}15`,
                        color: color,
                        border: `1px solid ${color}25`,
                      }}
                    >
                      ×{skill.count}
                    </span>
                  </div>
                  {/* Usage bar */}
                  <div className="h-[3px] w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: barWidth, background: `linear-gradient(90deg, ${color}80, ${color})` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="shrink-0 flex items-center justify-between px-8 py-4 border-t"
        style={{ borderColor: TOKENS.border.base, background: 'rgba(255,255,255,0.01)' }}
      >
        <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.20)' }}>
          Hover a skill to highlight · sorted by usage frequency
        </p>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold"
          style={{
            background: `${TOKENS.violet}10`,
            border: `1px solid ${TOKENS.violet}25`,
            color: TOKENS.violet,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TOKENS.violet }} />
          {skills.length} unique
        </div>
      </div>
    </div>
  );
});
