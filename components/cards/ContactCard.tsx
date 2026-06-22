// components/cards/ContactCard.tsx
'use client';

import { memo, useState } from 'react';
import { SpatialCard } from '@/components/layouts/AppleVisionLayout';

export const ContactCard = memo(function ContactCard() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <SpatialCard icon="✉️" title="Get in Touch" large>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
            Available for full-time, contract, and project-based opportunities.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <a
              href="mailto:nitheeshd.17@gmail.com"
              style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#0a84ff',
                fontWeight: '500',
                fontSize: '13px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              📧 Email
            </a>
            <a
              href="https://linkedin.com/in/nitheeshd"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#0a84ff',
                fontWeight: '500',
                fontSize: '13px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              🔗 LinkedIn
            </a>
          </div>

          <div>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                fontFamily: 'inherit',
                fontSize: '13px',
                marginBottom: '12px',
              }}
            />
            <textarea
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                fontFamily: 'inherit',
                fontSize: '13px',
                marginBottom: '12px',
                resize: 'none',
              }}
            />
            <button className="primary" style={{ width: '100%' }}>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </SpatialCard>
  );
});
