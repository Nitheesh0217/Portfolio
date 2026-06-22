/**
 * End-to-end test for POST /api/intake
 * Run with: npx tsx scripts/test-intake.ts
 */

const BASE_URL = 'http://localhost:3000';

interface ApiResponse {
  success?: boolean;
  intakeId?: string;
  aiGenerated?: boolean;
  ai?: {
    summary: Record<string, unknown>;
    architecture: Record<string, unknown>;
    user_flows: unknown[];
    phased_scope: Record<string, unknown>;
    budget_guidance: Record<string, unknown>;
  };
  error?: string;
}

const mockPayload = {
  project_name: 'Acme SaaS Dashboard',
  project_type: 'SaaS',
  timeline: 'Q3 2026 — approximately 3 months',
  business_name: 'Acme Corp',
  industry: 'FinTech',
  target_audience: 'Small and medium-sized business owners in North America',
  primary_goal: 'Provide real-time financial insights and automated reporting to reduce manual accounting work by 80%',
  user_personas:
    'Persona 1: Sarah, CFO of a 50-person startup — needs quick P&L snapshots\n' +
    'Persona 2: Mike, freelance accountant — manages 15 client dashboards',
  user_stories:
    'As a CFO, I want to see a live cash-flow chart so I can make daily decisions\n' +
    'As an accountant, I want to import QuickBooks data so I can consolidate client accounts\n' +
    'As an admin, I want to manage user roles so I can control data access',
  must_have_features:
    '- User authentication with RBAC\n' +
    '- QuickBooks & Xero OAuth integration\n' +
    '- Real-time dashboard with key financial KPIs\n' +
    '- PDF report generation\n' +
    '- Multi-tenant data isolation',
  nice_to_have_features:
    '- AI-generated monthly commentary\n' +
    '- Slack notifications for anomalies\n' +
    '- White-label theming for accountants',
  existing_systems: 'QuickBooks Online, Xero, Stripe, existing Postgres warehouse',
  preferred_stack: 'Next.js 14, TypeScript, Neon Postgres, Stripe, AWS',
  constraints: 'SOC-2 Type II compliance required; EU GDPR for EU customers; no vendor lock-in',
  budget_range: '$15k–$50k',
  engagement_type: 'Fixed',
  client_name: 'Jane Smith',
  client_email: 'jane.smith@acmecorp.example',
  client_company: 'Acme Corp',
  source: 'test_script',
};

async function main(): Promise<void> {
  console.log('🧪 D Web Studios — Intake API Test\n');
  console.log(`→ POST ${BASE_URL}/api/intake`);
  console.log(`→ Payload: ${mockPayload.project_name} (${mockPayload.project_type})\n`);

  let status: number;
  let data: ApiResponse;

  try {
    const res = await fetch(`${BASE_URL}/api/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload),
    });

    status = res.status;
    data = (await res.json()) as ApiResponse;
  } catch (err) {
    console.error('❌ Network error — is the dev server running on port 3000?');
    console.error(err);
    process.exit(1);
  }

  console.log(`Status : ${status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  console.log('');

  if (status !== 200 || !data.success) {
    console.error(`❌ Request failed. Status: ${status}, error: ${data.error ?? 'unknown'}`);
    process.exit(1);
  }

  if (data.intakeId) {
    console.log(`✅ DB insert confirmed — intakeId: ${data.intakeId}`);
  } else {
    console.warn('⚠️  No intakeId returned — DB insert may have failed.');
    process.exit(1);
  }

  if (data.aiGenerated) {
    console.log('✅ AI scoping confirmed — AI results attached to record.');
  } else {
    console.warn('⚠️  AI not generated — intake was saved, but AI scoping did not run.');
    console.warn('   Check AI_API_URL / AI_API_KEY in .env.local and server logs.');
  }

  console.log('\n🎉 Test complete.');
}

main().catch((err: unknown) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
