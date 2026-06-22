# DWS Spatial Portfolio OS v2.0 — Setup Guide

This is an interactive desktop OS built with Next.js 14, React, TypeScript, Tailwind CSS, Neon Postgres, and Anthropic Claude. Every window is draggable. Every data feed comes live from the database. The AI Sidekick has full context of your projects and can answer questions about them in real time.

## Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** or **pnpm** (included with Node.js)
- **Git** (for version control)
- A **Neon Postgres** account (free tier works great for this)
- An **Anthropic API key** (for the AI Sidekick)

## Quick Start (5 minutes)

### 1. Clone or navigate to the project

```bash
cd C:\Users\abhir\Claude\Projects\Portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.local.template` to `.env.local` and fill in your credentials:

```bash
cp .env.local.template .env.local
```

Then edit `.env.local` with:

**Option A: Using Neon (recommended)**
```bash
DATABASE_URL=postgresql://[user]:[password]@[host]-pooler.[region].postgres.neon.tech/neondb?sslmode=require
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Option B: Using local PostgreSQL**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Set up the database

**With Neon (cloud):**
1. Go to https://neon.tech and create a free project
2. Copy the **POOLED connection string** (not the direct connection)
3. Paste it into `.env.local` as `DATABASE_URL`
4. Open the **SQL Editor** in your Neon dashboard
5. Run the contents of `db/migration_portfolio.sql`
6. Run the contents of `db/migration_portfolio_realworld_seed.sql` for sample data

**With local PostgreSQL:**
```bash
psql -U postgres -d portfolio < db/migration_portfolio.sql
psql -U postgres -d portfolio < db/migration_portfolio_realworld_seed.sql
```

### 5. Get your Anthropic API key

1. Go to https://console.anthropic.com/settings/keys
2. Create a new API key
3. Paste it into `.env.local` as `ANTHROPIC_API_KEY`

### 6. Start the dev server

```bash
npm run dev
```

The app opens at `http://localhost:3000`. You'll see a desktop OS with draggable windows:
- **Welcome** — Quick intro
- **Terminal** — Live activity feed (30s polling)
- **Projects** — Three-column Finder: categories → projects → details
- **Credentials** — Your certificates and achievements
- **Metrics** — Key stats and KPIs
- **Contact** — Call to action + social links
- **AI Sidekick** — Chat with Claude about your portfolio

## What's Inside

### Project Structure

```
app/
  page.tsx              ← DesktopCanvas: main orchestrator
  layout.tsx            ← Global metadata, fonts, styles
  api/
    projects/           ← GET /api/projects (published projects)
    certificates/       ← GET /api/certificates
    metrics/            ← GET /api/metrics (all-time period)
    activity/           ← GET /api/activity (recent 20 entries)
    assistant/          ← POST /api/assistant (SSE streaming, Claude Haiku)
    intake/             ← POST /api/intake (project intake form)

components/
  desktop/              ← UI building blocks
    SystemWindow.tsx    ← Draggable window frame + title bar
    MenuBar.tsx         ← Top menu + global controls
    Dock.tsx            ← Bottom dock with window toggles
    TitleBar.tsx        ← Window title bar
  windows/              ← Window content components
    WelcomeWindow.tsx
    ProjectsWindow.tsx  ← Three-column file browser
    TerminalWindow.tsx  ← Activity feed with boot animation
    CertificatesWindow.tsx
    AIAssistantWindow.tsx ← Claude streaming chat
    [new windows here]

lib/
  db.ts                 ← Old Neon client (used by intake route)
  dbClient.ts           ← New Neon client factory (all other routes)
  windowReducer.ts      ← Window state machine + Z-index logic
  assistantSystemPrompt.ts ← Claude's persona + strategic judgment

types/
  portfolio.ts          ← Project, Certificate, Metric, ActivityEntry
  windows.ts            ← WindowId, WindowRecord, WindowAction

db/
  migration_portfolio.sql ← Schema: projects, certificates, metrics, activity_log
  migration_portfolio_realworld_seed.sql ← Sample data

scripts/
  test-intake.ts        ← Test the intake form API

public/
  og-image.png          ← OpenGraph image (1200×630)
  favicon.ico, icon.svg, apple-touch-icon.png, manifest.webmanifest

.env.local              ← Your secrets (DATABASE_URL, ANTHROPIC_API_KEY)
.env.local.template     ← Template for .env.local
```

### Database Schema

**projects** — Portfolio showcase
- `id, slug, title, subtitle, category, stack, tags`
- `thumbnail_url, live_url, github_url, video_url`
- `problem_statement, approach, process_notes, learnings, artifact_urls`
- `roi_label, roi_value, roi_context` (impact proof)
- `testimonial_quote, testimonial_author, testimonial_avatar`
- `status, featured, sort_order, built_at, created_at`

**certificates** — Credentials and achievements
- `id, title, issuer, category, issued_at, expires_at`
- `credential_url, badge_url, credential_id`
- `roi_proof` (how this cert matters to the business)

**metrics** — Key stats on the dashboard
- `id, label, value, unit, display_value, context`
- `period` (all-time, yearly, monthly), `display_order`

**activity_log** — Events for the Terminal window
- `id, event_type, description, created_at`
- Event types: `deploy`, `commit`, `cert`, `collab`, `milestone`

**project_intakes** — Contact form submissions (AI scoping optional)
- Core: `project_name, project_type, client_name, client_email`
- Context: `business_name, industry, target_audience, primary_goal, user_personas`
- Requirements: `user_stories, must_have_features, nice_to_have_features`
- Technical: `existing_systems, preferred_stack, constraints`
- Engagement: `budget_range, timeline, engagement_type`
- AI results (async): `ai_architecture, ai_user_flows, ai_scope_summary`

## Environment Variables Reference

```bash
# DATABASE_URL
# Format: postgresql://[user]:[password]@[host]:5432/[database]?sslmode=require
# For Neon: use the POOLED connection (hostname ends in -pooler)
# Why pooler? NextAuth.js, serverless functions, and concurrent requests
# hit connection limits on direct connections.
DATABASE_URL=postgresql://neonuser:neonpassword@ep-cool-project-pooler.us-east-2.postgres.neon.tech/neondb?sslmode=require

# ANTHROPIC_API_KEY
# Create at https://console.anthropic.com/settings/keys
# Powers the AI Sidekick window (Claude Haiku streaming)
ANTHROPIC_API_KEY=sk-ant-v0-your-key-here

# NEXT_PUBLIC_SITE_URL
# Used for OpenGraph meta tags (social sharing, link previews)
# Must start with http:// or https://
NEXT_PUBLIC_SITE_URL=https://dwebstudios.com

# Optional: if you implement project intake + AI scoping
# AI_API_URL=https://api.example.com/scoping
# AI_API_KEY=your-scoping-api-key
```

## Development Workflow

### Running tests

```bash
npm run lint
```

### Building for production

```bash
npm run build
npm start
```

### Seeding fresh data

```bash
# Delete all data and re-seed
psql -U postgres -d portfolio < db/migration_portfolio.sql
psql -U postgres -d portfolio < db/migration_portfolio_realworld_seed.sql
```

### Adding a new window

1. Create `components/windows/MyWindow.tsx` with `export const MyWindow = memo(function MyWindow() { ... })`
2. Add `'my-window'` to `WINDOW_IDS` in `types/windows.ts`
3. Add window defaults to `WINDOW_DEFAULTS` in `lib/windowReducer.ts`
4. Import and render in `app/page.tsx`:
   ```tsx
   import { MyWindow } from '@/components/windows/MyWindow';
   // ...
   {id === 'my-window' && <MyWindow />}
   ```
5. Add to dock via `components/desktop/Dock.tsx`

### Adding a new API endpoint

1. Create `app/api/my-endpoint/route.ts`
2. Export `GET` or `POST`:
   ```ts
   export async function GET() {
     const sql = createDbClient();
     const rows = await sql`SELECT ...`;
     return NextResponse.json(rows);
   }
   ```
3. Client: `fetch('/api/my-endpoint')`

### Customizing the AI Sidekick

Edit `lib/assistantSystemPrompt.ts`:
- Update `PERSONA` — who the AI represents
- Update `STRATEGIC_JUDGMENT` — what signals to emphasize
- Update `TOPIC_ROUTING` — Q&A patterns
- Add `contextBlock` (fetched from DB) to the system prompt

## Troubleshooting

### DATABASE_URL is not set
```
Error: DATABASE_URL is not set. Add it to .env.local...
```
→ Create `.env.local` with your Neon pooled connection string.

### Connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
→ PostgreSQL is not running locally. Start `psql` or use Neon (cloud).

### SSL certificate problem
```
Error: SSL certificate problem
```
→ Use `?sslmode=require` in your DATABASE_URL.

### ANTHROPIC_API_KEY not set
```
Error: ANTHROPIC_API_KEY not set
```
→ Get a key at https://console.anthropic.com/settings/keys and add to `.env.local`.

### Windows won't drag
→ Check that `draggable.ts` is imported and `useDraggable` hook is applied.

### AI Sidekick returns generic responses
→ Ensure sample data is seeded via `migration_portfolio_realworld_seed.sql`.
→ Check `/api/assistant` response in browser DevTools (Network tab).

## Next Steps

1. **Customize portfolio data** — Edit the projects/certificates/metrics in your Neon dashboard
2. **Add your social links** — Edit `app/page.tsx` ContactWindow (GitHub, LinkedIn, etc.)
3. **Deploy to Vercel** — See [DEPLOY.md](DEPLOY.md)
4. **Set up automated activity** — Add cron jobs or webhooks to insert events into `activity_log`

## Support & Questions

- **Next.js docs**: https://nextjs.org/docs
- **Neon docs**: https://neon.tech/docs
- **Anthropic API**: https://docs.anthropic.com
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Built with craft. Every pixel is proof.**
