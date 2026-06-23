// components/windows/FreelanceWindow.tsx
// Multi-step "Start a Project" freelance intake wizard — visionOS glassmorphic style
'use client';

import { memo, useState } from 'react';
import {
  ArrowRight, ArrowLeft, Zap, Globe, Brain, Database,
  BarChart2, Smartphone, Puzzle, Check, Calendar, Send,
  Sparkles,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  projectType: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  description: string;
}

// ─── Step 1: Project Type ────────────────────────────────────────────────────

const PROJECT_TYPES = [
  { id: 'web-app',      label: 'Web App',       icon: Globe,      color: '#60a5fa', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.30)' },
  { id: 'ai-agent',     label: 'AI / Agents',   icon: Brain,      color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.30)' },
  { id: 'data',         label: 'Data Pipeline', icon: Database,   color: '#34d399', bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.30)' },
  { id: 'saas',         label: 'SaaS Platform', icon: BarChart2,  color: '#fbbf24', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.30)' },
  { id: 'mobile-web',   label: 'Mobile-First',  icon: Smartphone, color: '#f472b6', bg: 'rgba(244,114,182,0.10)', border: 'rgba(244,114,182,0.30)' },
  { id: 'custom',       label: 'Something Else',icon: Puzzle,     color: '#fb923c', bg: 'rgba(251,146,60,0.10)',  border: 'rgba(251,146,60,0.30)' },
];

function StepProjectType({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div>
        <h2 className="text-[22px] font-black text-white tracking-tight">What are we building?</h2>
        <p className="text-[12px] text-white/45 mt-1">Pick the closest match — we&apos;ll dial in the details next.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {PROJECT_TYPES.map(({ id, label, icon: Icon, color, bg, border }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-3 py-5 px-3 rounded-2xl transition-all active:scale-95 text-center"
              style={{
                background: selected ? bg : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selected ? border : 'rgba(255,255,255,0.07)'}`,
                boxShadow: selected ? `0 0 24px ${color}22` : 'none',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: selected ? bg : 'rgba(255,255,255,0.04)', border: `1px solid ${selected ? border : 'rgba(255,255,255,0.06)'}` }}
              >
                <Icon style={{ width: 20, height: 20, color: selected ? color : 'rgba(255,255,255,0.35)' }} />
              </div>
              <span
                className="text-[11px] font-bold leading-tight"
                style={{ color: selected ? color : 'rgba(255,255,255,0.55)' }}
              >
                {label}
              </span>
              {selected && (
                <div
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: color }}
                >
                  <Check style={{ width: 10, height: 10, color: '#000' }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Budget & Timeline ────────────────────────────────────────────────

const BUDGET_TIERS = [
  { id: 'small',  label: 'Small',  price: '$2.5k – $5k',   duration: '2–4 wks',  desc: 'Feature, API, or integration sprint' },
  { id: 'medium', label: 'Medium', price: '$5k – $15k',    duration: '4–8 wks',  desc: 'Full-stack app, auth, dashboards',   popular: true },
  { id: 'large',  label: 'Large',  price: '$15k+',         duration: '8+ wks',   desc: 'Complex systems, AI, real-time' },
];

const TIMELINES = [
  { id: 'asap',     label: 'ASAP',          sub: 'Rush available' },
  { id: '1month',   label: '~1 Month',      sub: 'Standard' },
  { id: '3months',  label: '2–3 Months',    sub: 'Comfortable' },
  { id: 'flexible', label: 'Flexible',      sub: 'No hard date' },
];

function StepBudget({ budget, timeline, onBudget, onTimeline }: {
  budget: string; timeline: string;
  onBudget: (v: string) => void; onTimeline: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-[22px] font-black text-white tracking-tight">Scope & Timeline</h2>
        <p className="text-[12px] text-white/45 mt-1">Ballpark is fine — this isn&apos;t a contract.</p>
      </div>

      {/* Budget tiers */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30">Budget range</p>
        <div className="flex flex-col gap-2">
          {BUDGET_TIERS.map((tier) => {
            const selected = budget === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => onBudget(tier.id)}
                className="relative flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-[0.99] text-left"
                style={{
                  background: selected ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selected ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                {tier.popular && (
                  <span className="absolute -top-2.5 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(251,191,36,0.9)', color: '#0e0a00' }}>
                    Popular
                  </span>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold" style={{ color: selected ? '#fbbf24' : 'rgba(255,255,255,0.75)' }}>{tier.label}</span>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{tier.desc}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-[13px] font-black" style={{ color: selected ? '#fbbf24' : 'rgba(255,255,255,0.55)' }}>{tier.price}</span>
                  <span className="text-[10px] flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.30)' }}>
                    <Calendar style={{ width: 9, height: 9 }} />{tier.duration}
                  </span>
                </div>
                {selected && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center ml-3"
                    style={{ background: '#fbbf24' }}>
                    <Check style={{ width: 9, height: 9, color: '#000' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30">When do you need it?</p>
        <div className="grid grid-cols-4 gap-2">
          {TIMELINES.map((t) => {
            const selected = timeline === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTimeline(t.id)}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-center transition-all active:scale-95"
                style={{
                  background: selected ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selected ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <span className="text-[12px] font-bold" style={{ color: selected ? '#34d399' : 'rgba(255,255,255,0.65)' }}>{t.label}</span>
                <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.30)' }}>{t.sub}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Brief ────────────────────────────────────────────────────────────

function StepBrief({ data, onChange }: {
  data: Pick<FormData, 'name' | 'email' | 'description'>;
  onChange: (k: keyof FormData, v: string) => void;
}) {
  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.85)',
    padding: '10px 14px',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    transition: 'border-color 150ms',
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div>
        <h2 className="text-[22px] font-black text-white tracking-tight">Tell me about it</h2>
        <p className="text-[12px] text-white/45 mt-1">A few sentences is plenty — I&apos;ll ask the rest on a call.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">Your name</label>
          <input
            type="text"
            placeholder="Alex Johnson"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">Email</label>
          <input
            type="email"
            placeholder="alex@yourco.com"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">What are you building?</label>
        <textarea
          placeholder="e.g. A SaaS dashboard for a logistics company — needs real-time tracking, role-based access, and Stripe billing..."
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={5}
          style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
        />
      </div>

      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.18)' }}
      >
        <Zap className="w-4 h-4 text-violet-400 shrink-0" />
        <p className="text-[11px] text-white/55 leading-relaxed">
          This sends me a pre-filled email. I&apos;ll reply within <span className="text-white/80 font-bold">12 hours</span> with availability and a rough estimate.
        </p>
      </div>
    </div>
  );
}

// ─── Step 4: Success ─────────────────────────────────────────────────────────

function StepSuccess({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full py-8 text-center">
      <div
        className="w-20 h-20 rounded-[28px] flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(52,211,153,0.25), rgba(16,185,129,0.15))',
          border: '1px solid rgba(52,211,153,0.45)',
          boxShadow: '0 0 40px rgba(52,211,153,0.15)',
        }}
      >
        <Sparkles className="w-9 h-9 text-emerald-400" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-black text-white tracking-tight">
          {name ? `Got it, ${name.split(' ')[0]}!` : "Brief received!"}
        </h2>
        <p className="text-[13px] text-white/50 leading-relaxed max-w-[340px]">
          Your email client just opened with a pre-filled brief. Hit send and I&apos;ll get back to you
          within <span className="text-white/80 font-semibold">12 hours</span>.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-[320px]">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[12px] text-white/60">Project brief captured</span>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[12px] text-white/60">Response in &lt; 12 hours</span>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[12px] text-white/60">Free 30-min scope call included</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const STEPS = ['Type', 'Scope', 'Brief', 'Done'];

export const FreelanceWindow = memo(function FreelanceWindow() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    projectType: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    description: '',
  });

  const updateField = (k: keyof FormData, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const canAdvance = () => {
    if (step === 0) return !!form.projectType;
    if (step === 1) return !!form.budget && !!form.timeline;
    if (step === 2) return !!form.name && !!form.email && form.description.length > 20;
    return true;
  };

  const handleNext = () => {
    if (step === 2) {
      // Build mailto body
      const typeLabel = PROJECT_TYPES.find((t) => t.id === form.projectType)?.label ?? form.projectType;
      const budgetLabel = BUDGET_TIERS.find((t) => t.id === form.budget)?.price ?? form.budget;
      const timelineLabel = TIMELINES.find((t) => t.id === form.timeline)?.label ?? form.timeline;

      const subject = encodeURIComponent(`[Project Brief] ${typeLabel} — ${form.name}`);
      const body = encodeURIComponent(
        `Hi Nitheesh,\n\nI'd like to start a project with you. Here's a quick brief:\n\n` +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n\n` +
        `Project Type: ${typeLabel}\n` +
        `Budget Range: ${budgetLabel}\n` +
        `Timeline: ${timelineLabel}\n\n` +
        `Description:\n${form.description}\n\n` +
        `Looking forward to connecting!\n\n— ${form.name}`
      );
      window.open(`mailto:nitheeshd.17@gmail.com?subject=${subject}&body=${body}`);
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleReset = () => {
    setStep(0);
    setForm({ projectType: '', budget: '', timeline: '', name: '', email: '', description: '' });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div
        className="shrink-0 px-8 pt-8 pb-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                boxShadow: '0 8px 20px rgba(245,158,11,0.35)',
              }}
            >
              <Zap className="w-4 h-4 text-[#1a0e00]" />
            </div>
            <div>
              <h1 className="text-[15px] font-black text-white tracking-tight">Start a Project</h1>
              <p className="text-[10px] text-white/35">Available for freelance · Remote or hybrid</p>
            </div>
          </div>

          {/* Step progress pills */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
                  style={{
                    background: i === step
                      ? 'rgba(251,191,36,0.15)'
                      : i < step
                      ? 'rgba(52,211,153,0.10)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${i === step ? 'rgba(251,191,36,0.40)' : i < step ? 'rgba(52,211,153,0.30)' : 'rgba(255,255,255,0.07)'}`,
                    color: i === step ? '#fbbf24' : i < step ? '#34d399' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {i < step ? <Check style={{ width: 9, height: 9 }} /> : null}
                  {label}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-3 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-7 min-h-0">
        {step === 0 && <StepProjectType value={form.projectType} onChange={(v) => updateField('projectType', v)} />}
        {step === 1 && (
          <StepBudget
            budget={form.budget}
            timeline={form.timeline}
            onBudget={(v) => updateField('budget', v)}
            onTimeline={(v) => updateField('timeline', v)}
          />
        )}
        {step === 2 && (
          <StepBrief
            data={{ name: form.name, email: form.email, description: form.description }}
            onChange={updateField}
          />
        )}
        {step === 3 && <StepSuccess name={form.name} />}
      </div>

      {/* Footer nav */}
      <div
        className="shrink-0 px-8 py-5 flex items-center justify-between border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {step === 3 ? (
          <button
            onClick={handleReset}
            className="text-[12px] font-semibold text-white/40 hover:text-white/70 transition-colors"
          >
            Start another →
          </button>
        ) : (
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-white/40 hover:text-white/70 transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}

        {step < 3 && (
          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: canAdvance()
                ? step === 2
                  ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                  : 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.04)',
              color: step === 2 ? '#1a0e00' : 'rgba(255,255,255,0.85)',
              border: `1px solid ${step === 2 && canAdvance() ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: step === 2 && canAdvance() ? '0 8px 24px rgba(245,158,11,0.30)' : 'none',
            }}
          >
            {step === 2 ? (
              <>
                <Send className="w-3.5 h-3.5" />
                Send Brief
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
});
