// components/layouts/AppleVisionLayout.tsx
// Apple Vision Pro inspired spatial grid layout
'use client';

import { memo, useState } from 'react';

export interface AppleVisionLayoutProps {
  children: React.ReactNode;
}

export const AppleVisionLayout = memo(function AppleVisionLayout({
  children,
}: AppleVisionLayoutProps) {
  const [activeTab, setActiveTab] = useState<string>('projects');

  const dockItems = [
    { id: 'profile', icon: '👤', label: 'Profile', color: '#0a84ff' },
    { id: 'projects', icon: '💼', label: 'Projects', color: '#0a84ff' },
    { id: 'skills', icon: '⚙️', label: 'Skills', color: '#0a84ff' },
    { id: 'experience', icon: '📚', label: 'Experience', color: '#0a84ff' },
    { id: 'achievements', icon: '🏆', label: 'Achievements', color: '#0a84ff' },
    { id: 'contact', icon: '✉️', label: 'Contact', color: '#0a84ff' },
    { id: 'ai-chat', icon: '🤖', label: 'AI Assistant', color: '#0a84ff' },
  ];

  return (
    <div className="spatial-container">
      {/* MENU BAR */}
      <div className="menu-bar">
        <div className="menu-title">
          ✨ Nitheesh Donepudi
        </div>
        <div className="menu-controls">
          <button className="secondary" style={{ fontSize: '12px' }}>
            Resume
          </button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="main-content">
        {children}
      </div>

      {/* DOCK - Bottom Navigation */}
      <div className="dock">
        {dockItems.map((item) => (
          <button
            key={item.id}
            className={`dock-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            style={{
              backgroundColor: activeTab === item.id ? item.color : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
});

/* ============================================================================
   CARD COMPONENT - Reusable Spatial Card
   ============================================================================ */

export interface SpatialCardProps {
  icon?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  large?: boolean;
  full?: boolean;
  onClose?: () => void;
}

export const SpatialCard = memo(function SpatialCard({
  icon,
  title,
  subtitle,
  children,
  large = false,
  full = false,
  onClose,
}: SpatialCardProps) {
  return (
    <div className={`spatial-card ${large ? 'large' : ''} ${full ? 'full' : ''}`}>
      {/* Card Header */}
      <div className="card-header">
        <div className="card-title">
          {icon && <div className="card-icon">{icon}</div>}
          <div>
            <div>{title}</div>
            {subtitle && (
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {onClose && (
          <div className="card-controls">
            <button className="card-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
});
