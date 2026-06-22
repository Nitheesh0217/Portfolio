'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type FormDataState = {
  project_name: string;
  project_type: string;
  timeline: string;
  business_name: string;
  industry: string;
  target_audience: string;
  primary_goal: string;
  user_personas: string;
  user_stories: string;
  must_have_features: string;
  nice_to_have_features: string;
  existing_systems: string;
  preferred_stack: string;
  constraints: string;
  budget_range: string;
  engagement_type: string;
  client_name: string;
  client_email: string;
  client_company: string;
};

interface AIResult {
  summary: Record<string, unknown>;
  architecture: Record<string, unknown>;
  user_flows: unknown[];
  phased_scope: Record<string, unknown>;
  budget_guidance: Record<string, unknown>;
}

interface SuccessResult {
  success: boolean;
  intakeId: string;
  aiGenerated: boolean;
  ai?: AIResult;
}

type FieldErrors = Partial<Record<keyof FormDataState, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormDataState = {
  project_name: '',
  project_type: '',
  timeline: '',
  business_name: '',
  industry: '',
  target_audience: '',
  primary_goal: '',
  user_personas: '',
  user_stories: '',
  must_have_features: '',
  nice_to_have_features: '',
  existing_systems: '',
  preferred_stack: '',
  constraints: '',
  budget_range: '',
  engagement_type: '',
  client_name: '',
  client_email: '',
  client_company: '',
};

const STEPS = [
  'Project Basics',
  'Business & Users',
  'Stories & Features',
  'Technical Context',
  'Budget & Contact',
];

// ─── Shared field classes ─────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-xl border border-slate-600 bg-slate-800/60 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition';

const textareaCls =
  'w-full rounded-xl border border-slate-600 bg-slate-800/60 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none';

const labelCls = 'block text-sm font-medium text-slate-300 mb-1';

const errorCls = 'text-red-400 text-xs mt-1';

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className={errorCls}>{error}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StartProjectPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<SuccessResult | null>(null);

  // ── Input handlers ─────────────────────────────────────────────────────────

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormDataState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  function validateStep(): boolean {
    const newErrors: FieldErrors = {};

    if (step === 0) {
      if (!formData.project_name.trim()) newErrors.project_name = 'Project name is required.';
      if (!formData.project_type) newErrors.project_type = 'Please select a project type.';
    }

    if (step === 4) {
      if (!formData.client_name.trim()) newErrors.client_name = 'Your name is required.';
      if (!formData.client_email.trim()) {
        newErrors.client_email = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) {
        newErrors.client_email = 'Please enter a valid email address.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  function handleNext() {
    if (validateStep()) setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => s - 1);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep()) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = (await res.json()) as SuccessResult & { error?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Submission failed. Please try again.');
      }

      setResult(data);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success View ───────────────────────────────────────────────────────────

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10">
        <div className="max-w-2xl w-full bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 mb-6">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {result.aiGenerated && result.ai ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-2">We scoped your project</h2>
              <p className="text-slate-400 mb-6 text-sm">Intake ID: {result.intakeId}</p>

              {typeof result.ai.summary?.overview === 'string' && (
                <div className="text-left bg-slate-800/60 rounded-xl p-4 mb-5 border border-slate-700">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
                    Overview
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {result.ai.summary.overview}
                  </p>
                </div>
              )}

              {Object.keys(result.ai.phased_scope).length > 0 && (
                <div className="text-left bg-slate-800/60 rounded-xl p-4 mb-5 border border-slate-700">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
                    Phased Scope
                  </h3>
                  <ul className="text-slate-300 text-sm space-y-1">
                    {Object.entries(result.ai.phased_scope).map(([phase, desc]) => (
                      <li key={phase} className="flex gap-2">
                        <span className="text-indigo-400 shrink-0">›</span>
                        <span>
                          <strong className="text-slate-200">{phase}:</strong>{' '}
                          {typeof desc === 'string' ? desc : JSON.stringify(desc)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(result.ai.budget_guidance).length > 0 && (
                <div className="text-left bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
                    Budget Guidance
                  </h3>
                  <ul className="text-slate-300 text-sm space-y-1">
                    {Object.entries(result.ai.budget_guidance).map(([key, val]) => (
                      <li key={key} className="flex gap-2">
                        <span className="text-indigo-400 shrink-0">›</span>
                        <span>
                          <strong className="text-slate-200">{key}:</strong>{' '}
                          {typeof val === 'string' ? val : JSON.stringify(val)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-3">You&apos;re all set!</h2>
              <p className="text-slate-400 text-sm mb-2">Intake ID: {result.intakeId}</p>
              <p className="text-slate-300">
                Intake received — we&apos;ll follow up with a detailed scope.
              </p>
            </>
          )}

          <button
            onClick={() => { setResult(null); setFormData(INITIAL_FORM); setStep(0); }}
            className="mt-8 text-slate-400 hover:text-white text-sm underline underline-offset-2 transition"
          >
            Start another project
          </button>
        </div>
      </div>
    );
  }

  // ── Wizard Layout ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">

          {/* ── Left: Branding + Stepper ─────────────────────────────────── */}
          <aside className="md:w-64 shrink-0">
            {/* Logo */}
            <div className="mb-8">
              <span className="text-indigo-400 font-bold tracking-widest text-xs uppercase">
                D Web Studios
              </span>
              <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight leading-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                Start a<br />Project
              </h1>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Tell us about your vision. We&apos;ll scope it, architect it, and build it — fast.
              </p>
            </div>

            {/* Stepper */}
            <nav className="space-y-1">
              {STEPS.map((label, idx) => {
                const isCompleted = idx < step;
                const isCurrent = idx === step;
                return (
                  <div key={label} className="flex items-center gap-3 py-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-indigo-500 text-white'
                          : isCurrent
                          ? 'bg-indigo-500/20 border-2 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800 border border-slate-600 text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* ── Right: Form Card ─────────────────────────────────────────── */}
          <main className="flex-1">
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl p-6 md:p-8">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Step {step + 1} of {STEPS.length}</span>
                  <span>{STEPS[step]}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* ── Step 0: Project Basics ─────────────────────────────── */}
                {step === 0 && (
                  <div className="space-y-5">
                    <StepHeading icon="🚀" title="Project Basics" />
                    <Field label="Project Name *" error={errors.project_name}>
                      <input
                        id="project_name"
                        name="project_name"
                        type="text"
                        className={inputCls}
                        placeholder="e.g. Acme Customer Portal"
                        value={formData.project_name}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Project Type *" error={errors.project_type}>
                      <select
                        id="project_type"
                        name="project_type"
                        className={inputCls}
                        value={formData.project_type}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select type…</option>
                        <option>Web App</option>
                        <option>Mobile App</option>
                        <option>E-Commerce</option>
                        <option>SaaS</option>
                        <option>Other</option>
                      </select>
                    </Field>
                    <Field label="Desired Timeline" error={errors.timeline}>
                      <input
                        id="timeline"
                        name="timeline"
                        type="text"
                        className={inputCls}
                        placeholder="e.g. 3 months, Q3 launch"
                        value={formData.timeline}
                        onChange={handleChange}
                      />
                    </Field>
                  </div>
                )}

                {/* ── Step 1: Business & Users ───────────────────────────── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <StepHeading icon="🏢" title="Business & Users" />
                    <Field label="Business Name" error={errors.business_name}>
                      <input
                        id="business_name"
                        name="business_name"
                        type="text"
                        className={inputCls}
                        placeholder="Your company or brand name"
                        value={formData.business_name}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Industry" error={errors.industry}>
                      <input
                        id="industry"
                        name="industry"
                        type="text"
                        className={inputCls}
                        placeholder="e.g. FinTech, Healthcare, Retail"
                        value={formData.industry}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Target Audience" error={errors.target_audience}>
                      <input
                        id="target_audience"
                        name="target_audience"
                        type="text"
                        className={inputCls}
                        placeholder="Who are your primary users?"
                        value={formData.target_audience}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Primary Goal" error={errors.primary_goal}>
                      <input
                        id="primary_goal"
                        name="primary_goal"
                        type="text"
                        className={inputCls}
                        placeholder="What is the #1 outcome of this project?"
                        value={formData.primary_goal}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="User Personas" error={errors.user_personas}>
                      <textarea
                        id="user_personas"
                        name="user_personas"
                        className={textareaCls}
                        rows={3}
                        placeholder="Describe your key user types and their goals…"
                        value={formData.user_personas}
                        onChange={handleChange}
                      />
                    </Field>
                  </div>
                )}

                {/* ── Step 2: User Stories & Features ───────────────────── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <StepHeading icon="📋" title="User Stories & Features" />
                    <Field label="User Stories" error={errors.user_stories}>
                      <textarea
                        id="user_stories"
                        name="user_stories"
                        className={textareaCls}
                        rows={4}
                        placeholder="As a [user], I want to… (one per line)"
                        value={formData.user_stories}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Must-Have Features" error={errors.must_have_features}>
                      <textarea
                        id="must_have_features"
                        name="must_have_features"
                        className={textareaCls}
                        rows={4}
                        placeholder="List the features that are non-negotiable for launch…"
                        value={formData.must_have_features}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Nice-to-Have Features" error={errors.nice_to_have_features}>
                      <textarea
                        id="nice_to_have_features"
                        name="nice_to_have_features"
                        className={textareaCls}
                        rows={3}
                        placeholder="Features you'd love but could live without in v1…"
                        value={formData.nice_to_have_features}
                        onChange={handleChange}
                      />
                    </Field>
                  </div>
                )}

                {/* ── Step 3: Technical Context ──────────────────────────── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <StepHeading icon="⚙️" title="Technical Context" />
                    <Field label="Existing Systems / Integrations" error={errors.existing_systems}>
                      <input
                        id="existing_systems"
                        name="existing_systems"
                        type="text"
                        className={inputCls}
                        placeholder="e.g. Salesforce, Stripe, legacy ERP"
                        value={formData.existing_systems}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Preferred Stack / Technologies" error={errors.preferred_stack}>
                      <input
                        id="preferred_stack"
                        name="preferred_stack"
                        type="text"
                        className={inputCls}
                        placeholder="e.g. Next.js, React Native, Python, AWS"
                        value={formData.preferred_stack}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Constraints or Non-Negotiables" error={errors.constraints}>
                      <textarea
                        id="constraints"
                        name="constraints"
                        className={textareaCls}
                        rows={4}
                        placeholder="Security requirements, accessibility standards, deployment restrictions…"
                        value={formData.constraints}
                        onChange={handleChange}
                      />
                    </Field>
                  </div>
                )}

                {/* ── Step 4: Budget & Contact ───────────────────────────── */}
                {step === 4 && (
                  <div className="space-y-5">
                    <StepHeading icon="💼" title="Budget & Contact" />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Budget Range" error={errors.budget_range}>
                        <select
                          id="budget_range"
                          name="budget_range"
                          className={inputCls}
                          value={formData.budget_range}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select range…</option>
                          <option>Under $5k</option>
                          <option>$5k–$15k</option>
                          <option>$15k–$50k</option>
                          <option>$50k+</option>
                        </select>
                      </Field>
                      <Field label="Engagement Type" error={errors.engagement_type}>
                        <select
                          id="engagement_type"
                          name="engagement_type"
                          className={inputCls}
                          value={formData.engagement_type}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select type…</option>
                          <option>Fixed</option>
                          <option>Retainer</option>
                          <option>Hourly</option>
                        </select>
                      </Field>
                    </div>
                    <Field label="Your Name *" error={errors.client_name}>
                      <input
                        id="client_name"
                        name="client_name"
                        type="text"
                        className={inputCls}
                        placeholder="Full name"
                        value={formData.client_name}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Email Address *" error={errors.client_email}>
                      <input
                        id="client_email"
                        name="client_email"
                        type="email"
                        className={inputCls}
                        placeholder="you@company.com"
                        value={formData.client_email}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Company" error={errors.client_company}>
                      <input
                        id="client_company"
                        name="client_company"
                        type="text"
                        className={inputCls}
                        placeholder="Company or organisation name"
                        value={formData.client_company}
                        onChange={handleChange}
                      />
                    </Field>
                  </div>
                )}

                {/* ── Global submit error ────────────────────────────────── */}
                {submitError && (
                  <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-400 text-sm">
                    {submitError}
                  </div>
                )}

                {/* ── Navigation buttons ─────────────────────────────────── */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-2 text-sm font-medium transition"
                    >
                      ← Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-3 font-semibold transition"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-semibold transition flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        'Submit Project →'
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Step Heading helper ──────────────────────────────────────────────────────

function StepHeading({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
  );
}
