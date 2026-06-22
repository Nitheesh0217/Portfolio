// app/page-apple-vision.tsx
// Apple Vision Pro inspired portfolio
'use client';

import { AppleVisionLayout } from '@/components/layouts/AppleVisionLayout';
import { ProfileCard } from '@/components/cards/ProfileCard';
import { ProjectsCard } from '@/components/cards/ProjectsCard';
import { SkillsCard } from '@/components/cards/SkillsCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { ContactCard } from '@/components/cards/ContactCard';

export default function AppleVisionPortfolio() {
  return (
    <AppleVisionLayout>
      {/* Profile - Large card at top */}
      <ProfileCard />

      {/* Projects - Featured projects */}
      <ProjectsCard />

      {/* Skills Grid */}
      <SkillsCard />

      {/* Experience */}
      <ExperienceCard />

      {/* Contact/CTA */}
      <ContactCard />

      {/* Additional Stats Card */}
      <div className="spatial-card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon">📊</div>
            <div>By The Numbers</div>
          </div>
        </div>
        <div className="card-content">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">20+</div>
              <div className="stat-label">Systems Shipped</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$2.4M</div>
              <div className="stat-label">Savings Delivered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Card */}
      <div className="spatial-card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon">🏆</div>
            <div>Certifications</div>
          </div>
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                AWS Solutions Architect Associate
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                SAA-C03 Certified
              </p>
            </div>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                DeepLearning.AI LangChain
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                Specialization Completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Card */}
      <div className="spatial-card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon">🛠️</div>
            <div>Tech Stack</div>
          </div>
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#0a84ff', fontWeight: '600', marginBottom: '6px' }}>
                Languages & Frameworks
              </p>
              <div className="tags-group">
                <span className="tag">TypeScript</span>
                <span className="tag">Python</span>
                <span className="tag">React</span>
                <span className="tag">Next.js</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#0a84ff', fontWeight: '600', marginBottom: '6px' }}>
                Databases & Infra
              </p>
              <div className="tags-group">
                <span className="tag">PostgreSQL</span>
                <span className="tag">MongoDB</span>
                <span className="tag">Docker</span>
                <span className="tag">AWS</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#0a84ff', fontWeight: '600', marginBottom: '6px' }}>
                AI & ML Tools
              </p>
              <div className="tags-group">
                <span className="tag">Claude API</span>
                <span className="tag">LangChain</span>
                <span className="tag">RAG</span>
                <span className="tag">Pinecone</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppleVisionLayout>
  );
}
