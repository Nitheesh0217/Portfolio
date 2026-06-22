// components/modals/ProjectGalleryModal.tsx
'use client';

import { memo, useState } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  impact: string;
  tags: string[];
  image?: string;
  liveLink?: string;
  githubLink?: string;
  demoLink?: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

interface ProjectGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  initialIndex?: number;
}

export const ProjectGalleryModal = memo(function ProjectGalleryModal({
  isOpen,
  onClose,
  projects,
  initialIndex = 0,
}: ProjectGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const project = projects[currentIndex];

  if (!isOpen || !project) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(40, 40, 42, 0.9), rgba(50, 50, 52, 0.9))',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#fff' }}>
              {project.name}
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', margin: '4px 0 0 0' }}>
              Project {currentIndex + 1} of {projects.length}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '20px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Project Image/Hero */}
          {project.image && (
            <div
              style={{
                width: '100%',
                height: '300px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.1))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.3)',
                fontSize: '14px',
              }}
            >
              <img
                src={project.image}
                alt={project.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {!project.image && 'Project Screenshot'}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>
              About This Project
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.75)' }}>
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Metrics */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>
              Impact & Metrics
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#0a84ff', marginBottom: '4px' }}>
                    {metric.value}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>
              Technologies Used
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(10, 132, 255, 0.2)',
                    border: '1px solid rgba(10, 132, 255, 0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#0a84ff',
                    fontWeight: '500',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>
              Project Links
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 16px',
                    background: '#0a84ff',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontWeight: '500',
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0066d6';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#0a84ff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🔗 View Live
                </a>
              )}
              {project.demoLink && (
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 16px',
                    background: '#0a84ff',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontWeight: '500',
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0066d6';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#0a84ff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ▶ View Demo
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontWeight: '500',
                    fontSize: '13px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🐙 GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            onClick={handlePrev}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            ←
          </button>

          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            {currentIndex + 1} / {projects.length}
          </div>

          <button
            onClick={handleNext}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
});
