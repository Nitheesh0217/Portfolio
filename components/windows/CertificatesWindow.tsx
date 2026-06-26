// components/windows/CertificatesWindow.tsx
'use client';

import { memo, useState, useMemo } from 'react';
import { Award, CheckCircle2, ShieldOff, ExternalLink } from 'lucide-react';
import type { Certificate, DataState } from '@/types/portfolio';
import { TOKENS, accentBox } from '@/lib/designTokens';

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const CATEGORY_LABELS: Record<string, string> = {
  degree:   'Degrees',
  cloud:    'Cloud',
  'ai-ml':  'AI / ML',
  backend:  'Backend',
  frontend: 'Frontend',
  database: 'Databases',
};

function catLabel(c: string) {
  return CATEGORY_LABELS[c] ?? c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function CredentialCard({ cert }: { cert: Certificate }) {
  const expired = isExpired(cert.expires_at);
  const issuedStr = formatDate(cert.issued_at);
  const expiresStr = formatDate(cert.expires_at);

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 transition-all"
      style={{
        background: expired ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${expired ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
        opacity: expired ? 0.55 : 1,
      }}
    >
      {/* Top: logo + title */}
      <div className="flex items-start gap-3">
        {cert.badge_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cert.badge_url} alt={cert.issuer} className="w-10 h-10 rounded-xl object-contain shrink-0" />
        ) : (
          <div
            className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-[13px] font-black"
            style={{
              background: `${TOKENS.violet}15`,
              border: `1px solid ${TOKENS.violet}25`,
              color: TOKENS.violet,
            }}
          >
            {cert.issuer.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-1.5">
            {expired
              ? <ShieldOff style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.20)', flexShrink: 0, marginTop: 2 }} />
              : <CheckCircle2 style={{ width: 12, height: 12, color: TOKENS.emerald, flexShrink: 0, marginTop: 2 }} />}
            <p
              className="text-[12px] font-semibold leading-snug"
              style={{ color: expired ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.85)' }}
            >
              {cert.title}
            </p>
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>{cert.issuer}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {issuedStr && <span>Issued {issuedStr}</span>}
        {expiresStr && (
          <>
            <span>·</span>
            <span style={{ color: expired ? TOKENS.rose : 'rgba(255,255,255,0.25)' }}>
              {expired ? 'Expired' : 'Valid until'} {expiresStr}
            </span>
          </>
        )}
        {!cert.expires_at && (
          <span
            className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: `${TOKENS.emerald}12`, color: TOKENS.emerald, border: `1px solid ${TOKENS.emerald}20` }}
          >
            Lifetime
          </span>
        )}
      </div>

      {/* ROI */}
      {cert.roi_proof && (
        <p
          className="text-[10px] leading-relaxed border-t pt-2"
          style={{ color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          {cert.roi_proof}
        </p>
      )}

      {/* Verify CTA */}
      {cert.credential_url && (
        <a
          href={cert.credential_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95"
          style={{
            background: expired ? 'transparent' : `${TOKENS.violet}10`,
            border: `1px solid ${expired ? 'rgba(255,255,255,0.06)' : `${TOKENS.violet}25`}`,
            color: expired ? 'rgba(255,255,255,0.25)' : TOKENS.violet,
          }}
        >
          <ExternalLink style={{ width: 10, height: 10 }} />
          {expired ? 'View Archived' : 'Verify Credential ↗'}
        </a>
      )}
    </div>
  );
}

export interface CertificatesWindowProps {
  certificates: Certificate[];
  dataState:    DataState;
}

export const CertificatesWindow = memo(function CertificatesWindow({ certificates, dataState }: CertificatesWindowProps) {
  const [selectedCat, setSelectedCat] = useState<string>('__all__');

  const categories = useMemo(() => [...new Set(certificates.map((c) => c.category))].sort(), [certificates]);
  const filtered   = useMemo(() =>
    selectedCat === '__all__' ? certificates : certificates.filter((c) => c.category === selectedCat),
    [certificates, selectedCat],
  );
  const active = filtered.filter((c) => !isExpired(c.expires_at)).length;

  if (dataState.status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: `${TOKENS.violet}80`, animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    );
  }

  if (dataState.status === 'error') {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-xs font-mono" style={{ color: 'rgba(251,113,133,0.60)' }}>{dataState.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-8 pt-7 pb-5 border-b"
        style={{ borderColor: TOKENS.border.base }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={accentBox(TOKENS.amber)}>
          <Award style={{ width: 15, height: 15, color: TOKENS.amber }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-black text-white tracking-tight">Credentials</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {active} active · {certificates.length - active} expired
          </p>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1 flex-wrap justify-end">
          {[{ id: '__all__', label: 'All' }, ...categories.map((c) => ({ id: c, label: catLabel(c) }))].map(({ id, label }) => {
            const active2 = selectedCat === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedCat(id)}
                className="px-3 py-1 rounded-full text-[10px] font-bold transition-all"
                style={{
                  background: active2 ? `${TOKENS.violet}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active2 ? `${TOKENS.violet}40` : 'rgba(255,255,255,0.06)'}`,
                  color: active2 ? TOKENS.violet : 'rgba(255,255,255,0.35)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0" style={{ scrollbarWidth: 'none' }}>
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.20)' }}>No credentials in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((cert) => <CredentialCard key={cert.id} cert={cert} />)}
          </div>
        )}
      </div>
    </div>
  );
});
