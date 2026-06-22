// components/cards/ProfileCard.tsx
'use client';

import { memo } from 'react';
import { SpatialCard } from '@/components/layouts/AppleVisionLayout';

export const ProfileCard = memo(function ProfileCard() {
  return (
    <SpatialCard icon="👤" title="Profile" large>
      <div>
        <h2>Nitheesh Donepudi</h2>
        <p style={{ marginBottom: '24px', fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)' }}>
          Full-Stack AI Engineer • D Web Studios
        </p>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">5+</div>
            <div className="stat-label">Client Apps</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3yr</div>
            <div className="stat-label">Enterprise AI</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3.6</div>
            <div className="stat-label">M.S. CS GPA</div>
          </div>
        </div>

        <p style={{ marginTop: '24px', fontSize: '15px', lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.75)' }}>
          I ship production AI systems — RAG pipelines, multi-agent orchestration, real-time SaaS — then I measure the ROI. Everything in this portfolio has a receipt.
        </p>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button className="primary">View Resume</button>
          <button className="secondary">Connect</button>
        </div>
      </div>
    </SpatialCard>
  );
});
