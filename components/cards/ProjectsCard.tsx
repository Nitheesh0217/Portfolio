// components/cards/ProjectsCard.tsx
'use client';

import { memo, useState } from 'react';
import { SpatialCard } from '@/components/layouts/AppleVisionLayout';
import { ProjectGalleryModal } from '@/components/modals/ProjectGalleryModal';
import { projects } from '@/data/projects';

export const ProjectsCard = memo(function ProjectsCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleProjectClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <SpatialCard icon="💼" title="Featured Projects" large>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {projects.map((project, index) => (
            <div
              key={project.id}
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
              onClick={() => handleProjectClick(index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>
                {project.name}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                {project.description}
              </p>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#0a84ff', marginBottom: '8px' }}>
                ↳ {project.impact}
              </p>
              <div className="tags-group">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className="primary"
          style={{ marginTop: '20px', width: '100%' }}
          onClick={() => {
            setSelectedIndex(0);
            setIsModalOpen(true);
          }}
        >
          View All Projects →
        </button>
      </SpatialCard>

      {/* Project Gallery Modal */}
      <ProjectGalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projects={projects}
        initialIndex={selectedIndex}
      />
    </>
  );
});
