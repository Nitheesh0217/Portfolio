// components/windows/SkillsWindow.tsx
'use client';

import { memo, useMemo, useState, useEffect, useRef } from 'react';
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
    // Ignore audio context block
  }
};

export const SkillsWindow = memo(function SkillsWindow({ projects }: { projects: ProjectSummary[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // 3D rotation state variables
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const catColor = (cat: Category) => CATEGORIES.find((c) => c.id === cat)?.color ?? TOKENS.violet;

  // 3D Spherical Distribution (Fibonacci Sphere Algorithm)
  const radius = 130; 
  const N = Math.min(filtered.length, 30); 
  const nodes = useMemo(() => {
    const list = [];
    const phiIncrement = Math.PI * (1 + Math.sqrt(5)); 
    
    for (let i = 0; i < N; i++) {
      const inclination = Math.acos(1 - 2 * (i + 0.5) / N);
      const azimuth = phiIncrement * i;
      
      const x = radius * Math.sin(inclination) * Math.cos(azimuth);
      const y = radius * Math.sin(inclination) * Math.sin(azimuth);
      const z = radius * Math.cos(inclination);
      
      list.push({
        name: filtered[i].name,
        count: filtered[i].count,
        category: filtered[i].category,
        x,
        y,
        z
      });
    }
    return list;
  }, [filtered, N]);

  // RequestAnimationFrame loop for auto-rotation
  useEffect(() => {
    let frameId: number;
    let currentRotY = 0;
    let currentRotX = 0;
    
    const animate = () => {
      const speed = isHovered ? 0.08 : 0.35;
      currentRotY += speed;
      
      if (isHovered) {
        const targetRotY = mouseRef.current.x * 25;
        const targetRotX = -mouseRef.current.y * 25;
        
        currentRotX += (targetRotX - currentRotX) * 0.1;
        setRotX(currentRotX);
        setRotY(currentRotY + targetRotY);
      } else {
        currentRotX += (0 - currentRotX) * 0.05;
        setRotX(currentRotX);
        setRotY(currentRotY);
      }
      
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    
    mouseRef.current = { x: nx, y: ny };
  };

  // Convert angles to radians for depth calculations
  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-8 pt-7 pb-5 border-b select-none"
        style={{ borderColor: TOKENS.border.base }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={accentBox(TOKENS.violet)}>
          <Cpu style={{ width: 15, height: 15, color: TOKENS.violet }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-black text-white tracking-tight">Tech Arsenal</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            3D Skill Constellation · {filtered.length} nodes active
          </p>
        </div>
        {/* Category tabs */}
        <div className="flex items-center gap-1 flex-wrap justify-end">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playTick();
                  setActiveCategory(cat.id);
                }}
                className="px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer outline-none border-none"
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

      {/* Main 3D Container */}
      <div 
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className="flex-1 relative overflow-hidden flex items-center justify-center min-h-[360px]"
        style={{ perspective: '800px', cursor: 'grab' }}
      >
        {filtered.length === 0 ? (
          <p className="text-[11px] font-mono text-white/20 select-none">No skills in this category.</p>
        ) : (
          <div 
            className="relative w-full h-full flex items-center justify-center transform-gpu"
            style={{ 
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`, 
              transformStyle: 'preserve-3d',
              width: `${radius * 2}px`,
              height: `${radius * 2}px`
            }}
          >
            {nodes.map((node, i) => {
              const color = catColor(node.category);
              const isHov = hoveredNode === node.name;
              
              // Compute depth coordinate (z2) dynamically for opacity and zIndex order
              const x1 = node.x * Math.cos(radY) + node.z * Math.sin(radY);
              const z1 = -node.x * Math.sin(radY) + node.z * Math.cos(radY);
              const z2 = node.y * Math.sin(radX) + z1 * Math.cos(radX);
              
              const depthPercent = (z2 + radius) / (2 * radius); // 0 (back) to 1 (front)
              const opacity = isHov ? 1.0 : (0.15 + depthPercent * 0.85);
              const scale = 0.75 + depthPercent * 0.35;
              const zIndex = Math.round(z2 + radius);

              return (
                <div
                  key={node.name}
                  onMouseEnter={() => {
                    playTick();
                    setHoveredNode(node.name);
                  }}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="absolute pointer-events-auto transform-gpu transition-all duration-150 select-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: '-45px', // offset half width
                    marginTop: '-15px', // offset half height
                    transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px) rotateY(${-rotY}deg) rotateX(${-rotX}deg) scale(${scale})`,
                    transformStyle: 'preserve-3d',
                    zIndex,
                    opacity
                  }}
                >
                  <div 
                    className="px-3.5 py-1.5 rounded-full border text-[11px] font-extrabold flex items-center gap-1.5 whitespace-nowrap shadow-lg cursor-pointer"
                    style={{
                      background: isHov 
                        ? `linear-gradient(135deg, ${color}22, ${color}11)` 
                        : 'rgba(255,255,255,0.06)',
                      borderColor: isHov ? color : 'rgba(255,255,255,0.15)',
                      boxShadow: isHov ? `0 0 25px ${color}40, inset 0 0 6px rgba(255,255,255,0.2)` : '0 4px 12px rgba(0,0,0,0.15)',
                      color: isHov ? '#ffffff' : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                    {node.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="shrink-0 flex items-center justify-between px-8 py-4 border-t select-none"
        style={{ borderColor: TOKENS.border.base, background: 'rgba(255,255,255,0.01)' }}
      >
        <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Constellation auto-rotates · hover to tilt & slow rotation
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
          {skills.length} active
        </div>
      </div>
    </div>
  );
});
