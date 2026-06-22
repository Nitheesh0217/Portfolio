// components/cards/ExperienceCard.tsx
'use client';

import { memo } from 'react';
import { SpatialCard } from '@/components/layouts/AppleVisionLayout';

export const ExperienceCard = memo(function ExperienceCard() {
  const experiences = [
    {
      title: 'Knowledge Systems Engineer',
      company: 'Citrix Systems',
      period: '2022-2023',
      details: 'Built internal RAG pipeline. 60% knowledge lookup reduction.',
    },
    {
      title: 'Enterprise AI Engineer',
      company: 'Kore.ai',
      period: '2021-2022',
      details: 'Conversational AI NLU pipelines. 28% human escalation reduction.',
    },
    {
      title: 'Software Engineer',
      company: 'Cognizant',
      period: '2020-2021',
      details: 'Enterprise full-stack development. Java/Spring Boot systems.',
    },
  ];

  return (
    <SpatialCard icon="📚" title="Experience">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {experiences.map((exp) => (
          <div
            key={exp.title}
            style={{
              padding: '12px',
              borderLeft: '3px solid #0a84ff',
              borderRadius: '4px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
              {exp.title}
            </h3>
            <p style={{ fontSize: '12px', color: '#0a84ff', marginBottom: '4px' }}>
              {exp.company} • {exp.period}
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
              {exp.details}
            </p>
          </div>
        ))}
      </div>
    </SpatialCard>
  );
});
