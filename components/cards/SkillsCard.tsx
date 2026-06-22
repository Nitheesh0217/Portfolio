// components/cards/SkillsCard.tsx
'use client';

import { memo } from 'react';
import { SpatialCard } from '@/components/layouts/AppleVisionLayout';

export const SkillsCard = memo(function SkillsCard() {
  const skillCategories = [
    {
      category: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    {
      category: 'Backend',
      skills: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL'],
    },
    {
      category: 'AI/ML',
      skills: ['LangChain', 'Claude API', 'RAG', 'Pinecone'],
    },
    {
      category: 'DevOps',
      skills: ['Docker', 'AWS', 'Vercel', 'GitHub Actions'],
    },
  ];

  return (
    <SpatialCard icon="⚙️" title="Core Skills">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {skillCategories.map((cat) => (
          <div key={cat.category}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#0a84ff' }}>
              {cat.category}
            </h3>
            <div className="tags-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {cat.skills.map((skill) => (
                <span key={skill} className="tag" style={{ display: 'inline-block' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SpatialCard>
  );
});
