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

function getTechLogoSvg(name: string, color: string) {
  const norm = name.toLowerCase();
  
  if (norm.includes('react')) {
    return (
      <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#61dafb" strokeWidth="1.8">
        <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(30,12,12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(90,12,12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(150,12,12)"/>
        <circle cx="12" cy="12" r="1.8" fill="#61dafb"/>
      </svg>
    );
  }
  if (norm.includes('typescript') || norm === 'ts') {
    return (
      <svg className="w-7 h-7 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#3178c6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M8 8h5M10.5 8v8M15.5 11.5c.5-.5 1-.5 1.5 0 .5.5.5 1.5 0 2s-1 .5-1.5 0v-2.5" />
      </svg>
    );
  }
  if (norm.includes('javascript') || norm === 'js') {
    return (
      <svg className="w-7 h-7 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#f7df1e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M10 15c.5.5 1.5.5 2 0s.5-1.5 0-2-1.5-.5-2-1c-.5-.5-.5-1.5 0-2s1.5-.5 2 0M16.5 10v4c0 .8-.5 1.5-1.5 1.5" />
      </svg>
    );
  }
  if (norm.includes('python')) {
    return (
      <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#3776ab" strokeWidth="1.8">
        <path d="M12 2C7.5 2 7 3.5 7 5.5v1.5h5v1H5.5C3.5 8 2 9.5 2 11.5c0 2.5 1.5 3 3 3h1.5v-1.5c0-2.5 2-4.5 4.5-4.5h3c1.5 0 3-1 3-3V5.5c0-2-1.5-3.5-5-3.5z" />
        <path d="M12 22C16.5 22 17 20.5 17 18.5v-1.5h-5v-1h6.5c2 0 3.5-1.5 3.5-3.5c0-2.5-1.5-3-3-3h-1.5v1.5c0 2.5-2 4.5-4.5 4.5h-3c-1.5 0-3 1-3 3v1.5c0 2 1.5 3.5 5 3.5z" />
      </svg>
    );
  }
  if (norm.includes('aws') || norm.includes('amazon')) {
    return (
      <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#ff9900" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4L3 8l9 4 9-4-9-4z" />
        <path d="M3 12l9 4 9-4" />
        <path d="M3 16l9 4 9-4" />
      </svg>
    );
  }
  if (norm.includes('postgres') || norm.includes('sql') || norm.includes('neon') || norm.includes('snowflake') || norm.includes('database')) {
    return (
      <svg className="w-7 h-7 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#336791" strokeWidth="2">
        <ellipse cx="12" cy="6" rx="8" ry="3"/>
        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
        <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      </svg>
    );
  }
  if (norm.includes('docker') || norm.includes('kubernetes')) {
    return (
      <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#2496ed" strokeWidth="1.8" strokeLinecap="round">
        <rect x="4" y="6" width="3.5" height="3.5" rx="0.5"/>
        <rect x="9" y="6" width="3.5" height="3.5" rx="0.5"/>
        <rect x="14" y="6" width="3.5" height="3.5" rx="0.5"/>
        <rect x="4" y="11" width="3.5" height="3.5" rx="0.5"/>
        <rect x="9" y="11" width="3.5" height="3.5" rx="0.5"/>
        <rect x="14" y="11" width="3.5" height="3.5" rx="0.5"/>
        <path d="M4 18c0 1.5 2 2 8 2s8-0.5 8-2v-2H4v2z" />
      </svg>
    );
  }
  if (norm.includes('openai') || norm.includes('gpt') || norm.includes('claude') || norm.includes('anthropic') || norm.includes('ai') || norm.includes('rag') || norm.includes('langchain') || norm.includes('pinecone') || norm.includes('nlu')) {
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#10a37f" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" strokeDasharray="3 3"/>
        <path d="M12 3v18M3 12h18 M7.5 7.5l9 9 M7.5 16.5l9-9" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" fill="#0d0e15" stroke="#10a37f" strokeWidth="1.5" />
      </svg>
    );
  }
  if (norm.includes('spring') || norm.includes('java')) {
    return (
      <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#6db33f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8 7 9.5L12 22l3-0.5c4-1.5 7-5 7-9.5 0-5.5-4.5-10-10-10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }
  if (norm.includes('node') || norm.includes('express')) {
    return (
      <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#68a063" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
        <path d="M12 22V12 M4 7l8 5 8-5" />
      </svg>
    );
  }
  if (norm.includes('css') || norm.includes('tailwind') || norm.includes('html') || norm.includes('sass')) {
    return (
      <svg className="w-7 h-7 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    );
  }
  
  // Default Generic node
  return (
    <svg className="w-7 h-7 drop-shadow-md text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 16.5l2-2M16.5 7.5l2-2" />
    </svg>
  );
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
                    marginLeft: '-32px', // offset half width
                    marginTop: '-32px',  // offset half height
                    transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px) rotateY(${-rotY}deg) rotateX(${-rotX}deg) scale(${scale})`,
                    transformStyle: 'preserve-3d',
                    zIndex,
                    opacity
                  }}
                >
                  {/* Liquid Glass Orb Container */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden group border cursor-pointer transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 100%)',
                      borderColor: isHov ? color : 'rgba(255,255,255,0.25)',
                      boxShadow: isHov 
                        ? `0 15px 40px ${color}45, inset 0 0 15px rgba(255,255,255,0.35)` 
                        : '0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.20)',
                    }}
                  >
                    {/* Background Radial Glow Effect matching tech theme */}
                    <div 
                      className="absolute inset-0 rounded-full blur-xl opacity-35 group-hover:opacity-65 transition-opacity pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
                    />
                    
                    {/* Centered Logo Content */}
                    <div className="relative z-10 w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      {getTechLogoSvg(node.name, color)}
                    </div>
                  </div>

                  {/* Hover Caption Label */}
                  {isHov && (
                    <div 
                      className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 bg-black/90 text-white font-mono text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10 shadow-xl pointer-events-none whitespace-nowrap z-50 animate-fade-in"
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      {node.name}
                    </div>
                  )}
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
