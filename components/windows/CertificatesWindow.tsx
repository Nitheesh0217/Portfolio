// components/windows/CertificatesWindow.tsx
'use client';

import { memo, useState, useMemo } from 'react';
import { CheckCircle2, ShieldOff, ExternalLink } from 'lucide-react';
import type { Certificate, DataState } from '@/types/portfolio';

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const CATEGORY_LABELS: Record<string, string> = {
  'degree':     'Degrees',
  'cloud':      'Cloud',
  'ai-ml':      'AI / ML',
  'backend':    'Backend',
  'frontend':   'Frontend',
  'database':   'Databases',
};
function catLabel(c: string) {
  return CATEGORY_LABELS[c] ?? c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function Badge({ cert }: { cert: Certificate }) {
  const expired    = isExpired(cert.expires_at);
  const hasLink    = !!cert.credential_url;
  const issuedStr  = formatDate(cert.issued_at);
  const expiresStr = formatDate(cert.expires_at);

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${expired ? 'border-white/[0.04] bg-white/[0.015] opacity-55' : 'border-white/[0.08] bg-white/[0.03] hover:border-violet-500/25'}`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        {cert.badge_url ? (
          <img src={cert.badge_url} alt={cert.issuer} className="w-10 h-10 object-contain rounded-lg shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-400 text-[14px] font-black shrink-0">
            {cert.issuer.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-1.5">
            {expired
              ? <ShieldOff className="w-3 h-3 text-white/20 shrink-0 mt-0.5" />
              : <CheckCircle2 className="w-3 h-3 text-emerald-400/70 shrink-0 mt-0.5" />}
            <p className={`text-[12px] font-semibold leading-snug ${expired ? 'text-white/35' : 'text-white/80'}`}>
              {cert.title}
            </p>
          </div>
          <p className="text-[10px] text-white/30 mt-0.5">{cert.issuer}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-white/25">
        {issuedStr && <span>Issued {issuedStr}</span>}
        {expiresStr && (
          <>
            <span>·</span>
            <span className={expired ? 'text-red-400/40' : ''}>
              {expired ? 'Expired' : 'Expires'} {expiresStr}
            </span>
          </>
        )}
        {!cert.expires_at && <span className="text-emerald-400/40">No expiry</span>}
      </div>

      {/* ROI proof */}
      {cert.roi_proof && (
        <p className="text-[10px] text-white/35 leading-relaxed border-t border-white/[0.05] pt-2">
          {cert.roi_proof}
        </p>
      )}

      {/* CTA */}
      {hasLink && (
        <a
          href={cert.credential_url!}
          target="_blank"
          rel="noopener noreferrer"
          title={expired ? 'View archived credential' : 'Verify this credential'}
          className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[10px] font-semibold transition-all active:scale-95 ${
            expired
              ? 'border border-white/[0.06] text-white/25 hover:text-white/40'
              : 'border border-violet-500/25 text-violet-300/80 hover:bg-violet-500/10 hover:text-violet-200 hover:border-violet-500/45'
          }`}
        >
          <ExternalLink className="w-3 h-3" />
          {expired ? 'View Archived Credential' : 'Verify Credential ↗'}
        </a>
      )}
    </div>
  );
}

export interface CertificatesWindowProps {
  certificates: Certificate[];
  dataState:    DataState;
}

export const CertificatesWindow = memo(function CertificatesWindow({
  certificates, dataState,
}: CertificatesWindowProps) {
  const [selectedCat, setSelectedCat] = useState<string>('__all__');

  const categories = useMemo(() => [...new Set(certificates.map((c) => c.category))].sort(), [certificates]);
  const filtered   = useMemo(() =>
    selectedCat === '__all__' ? certificates : certificates.filter((c) => c.category === selectedCat),
    [certificates, selectedCat],
  );

  if (dataState.status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400/50 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    );
  }

  if (dataState.status === 'error') {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <p className="text-xs font-mono text-red-400/60 text-center">{dataState.error}</p>
      </div>
    );
  }

  return (
    <div className="flex" style={{ width: '560px', height: '440px' }}>
      {/* Sidebar */}
      <div className="w-[140px] shrink-0 border-r border-white/[0.06] overflow-y-auto flex flex-col pt-2 pb-2">
        <p className="px-4 pb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/20">Categories</p>
        {[{ id: '__all__', label: 'All Credentials' }, ...categories.map((c) => ({ id: c, label: catLabel(c) }))].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSelectedCat(id)}
            className={`text-left px-4 py-2 text-[11px] font-medium transition-colors border-l-2 ${selectedCat === id ? 'border-l-violet-500 bg-violet-500/10 text-violet-300' : 'border-l-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.2) transparent' }}>
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[11px] text-white/20 font-mono">No credentials in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((cert) => <Badge key={cert.id} cert={cert} />)}
          </div>
        )}
      </div>
    </div>
  );
});
