# DWS Spatial Portfolio OS v2.0

**A portfolio site reimagined as a spatial operating system.** Draggable windows. Live database feeds. An AI assistant that knows your work. Built with Next.js 14, React, TypeScript, Tailwind CSS, Neon Postgres, and Anthropic Claude.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen)

---

## What Is This?

This is not a traditional portfolio site. It's a **desktop OS running in the browser**:

- **Draggable windows** — Move, minimize, focus, manage Z-order
- **Live data feeds** — Every metric, project, and activity comes from Neon Postgres
- **AI assistant window** — Chat with Claude about your projects (full portfolio context)
- **Terminal window** — Activity feed with boot animation and 30s polling
- **Desktop dock** — Click icons to open/focus windows
- **Keyboard shortcuts** — Cmd/Ctrl+W to close, Cmd/Ctrl+M to minimize, Cmd/Ctrl+1-7 to open windows

The metaphor is intentional: a portfolio should *work like a system*. Every component is alive.

---

## Live Demo

Visit the live site: **https://dwebstudios.com**

Or clone and run locally (see [SETUP.md](SETUP.md)).

---

## Features

### 📁 Projects Window
- **Three-column Finder** — Browse by category → view project list → read full narrative
- **Narrative framework** — Problem statement → Approach → Process notes → Learnings
- **ROI receipt** — Tangible business impact (cost saved, time reduced, quality improved)
- **Social proof** — Testimonials and attribution

### 🏅 Credentials Window
- Certifications with issuer, category, issued/expiry dates
- Credential URLs and badge images
- ROI proof (what business problem each cert solves)

### 📊 Metrics Window
- Headline stats on a 2×2 grid
- Customizable units and display values
- Contextual callouts

### ⬛ Terminal Window
- Boot animation on startup
- Live activity feed (polled every 30s from `/api/activity`)
- Event types: `deploy`, `commit`, `cert`, `collab`, `milestone`
- Relative time formatting (e.g., "2m ago")

### 🤖 AI Sidekick Window
- Streaming chat powered by Claude Haiku
- Full portfolio context injected into system prompt
- Starter questions (e.g., "What makes Nitheesh stand out?")
- Non-hallucinating — deflects gracefully if asked about unknown projects
- Stops mid-stream if interrupted

### ✉️ Contact Window
- Call-to-action button
- Direct email link
- Social media links (GitHub, LinkedIn, Twitter, Dribbble)

### 🪟 Window Management
- Draggable by title bar
- Minimizable (goes to dock)
- Focusable (brings to front)
- Z-index auto-normalizes at Z_MAX to prevent overflow
- Lazy mounting (components only render when first opened)

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 18 + Next.js 14 | Server-side rendering, API routes, streaming |
| **Styling** | Tailwind CSS 3.4 | Rapid UI, dark mode out of the box |
| **State** | React hooks + `useReducer` | Window state machine, predictable updates |
| **Database** | Neon Postgres (serverless) | Free tier, auto-scaling, connection pooling |
| **AI** | Anthropic Claude (Haiku) | Fast inference, streaming, JSON mode |
| **Icons** | Lucide React | 1000+ clean SVG icons |
| **Fonts** | Inter + JetBrains Mono (Google Fonts) | System-UI performance + monospace coding feel |
| **Deployment** | Vercel (recommended) | Free tier, git-triggered, edge functions |

---

## Project Structure

```
.
├── app/                        # Next.js 14 app directory
│   ├── page.tsx               # DesktopCanvas (main orchestrator)
│   ├── layout.tsx             # Global HTML, fonts, metadata
│   ├── globals.css            # Tailwind directives
│   └── api/
│       ├── projects/          # GET all published projects
│       ├── certificates/      # GET all credentials
│       ├── metrics/           # GET all-time metrics
│       ├── activity/          # GET recent activity feed
│       ├── assistant/         # POST chat (Claude streaming)
│       └── intake/            # POST project intake form
│
├── components/                # React components (no state logic)
│   ├── desktop/
│   │   ├── SystemWindow.tsx   # Draggable window frame
│   │   ├── MenuBar.tsx        # Top menu bar
│   │   ├── Dock.tsx           # Bottom dock with toggles
│   │   ├── TitleBar.tsx       # Window title + close/minimize buttons
│   │
│   └── windows/               # Window content
│       ├── WelcomeWindow.tsx
│       ├── ProjectsWindow.tsx ← Three-column Finder
│       ├── TerminalWindow.tsx ← Activity feed + boot animation
│       ├── CertificatesWindow.tsx
│       ├── MetricsWindow.tsx
│       ├── ContactWindow.tsx
│       └── AIAssistantWindow.tsx ← Claude streaming chat
│
├── lib/                       # Utilities + factories
│   ├── db.ts                  # Old Neon client (for intake route)
│   ├── dbClient.ts            # New Neon client factory
│   ├── windowReducer.ts       # Window state machine
│   ├── assistantSystemPrompt.ts ← Claude persona + strategic judgment
│   └── [other utilities]
│
├── hooks/                     # React hooks
│   └── useDraggable.ts        # Drag handling for windows
│
├── types/                     # TypeScript interfaces
│   ├── portfolio.ts           # Project, Certificate, Metric, ActivityEntry
│   └── windows.ts             # WindowId, WindowRecord, WindowAction
│
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── og-image.png           # OpenGraph (1200×630)
│   ├── icon.svg
│   └── manifest.webmanifest   # PWA manifest
│
├── db/                        # Database migrations + seeds
│   ├── migration_portfolio.sql ← Schema creation
│   └── migration_portfolio_realworld_seed.sql ← Sample data
│
├── scripts/                   # Utilities
│   └── test-intake.ts         # Test intake form
│
├── .env.local.template        # Environment variables template
├── .env.local                 # (your secrets — not committed)
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.mjs         # PostCSS configuration
├── package.json               # Dependencies
├── package-lock.json
│
├── SETUP.md                   # Local setup guide
├── DEPLOY.md                  # Production deployment guide
└── README.md                  # This file
```

---

## Database Schema

### projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT,
  subtitle TEXT,
  category TEXT, -- e.g., 'web-app', 'ai', 'saas'
  stack TEXT[], -- e.g., ['Next.js', 'PostgreSQL']
  tags TEXT[],
  thumbnail_url TEXT,
  live_url TEXT,
  github_url TEXT,
  problem_statement TEXT,
  approach TEXT,
  process_notes TEXT,
  learnings TEXT[],
  roi_label TEXT, -- e.g., "$2,400/yr SaaS Cost Eliminated"
  roi_value TEXT, -- e.g., "$2,400"
  roi_context TEXT,
  testimonial_quote TEXT,
  testimonial_author TEXT,
  status TEXT DEFAULT 'published', -- or 'draft', 'archived'
  featured BOOLEAN,
  sort_order INTEGER,
  built_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### certificates
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  title TEXT, -- e.g., "AWS Solutions Architect Associate"
  issuer TEXT, -- e.g., "Amazon Web Services"
  category TEXT, -- e.g., 'cloud', 'ai', 'devops'
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  credential_url TEXT,
  badge_url TEXT,
  roi_proof TEXT, -- e.g., "Demonstrated cloud architecture expertise for multi-region deployments"
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### metrics
```sql
CREATE TABLE metrics (
  id UUID PRIMARY KEY,
  label TEXT, -- e.g., "Projects Shipped"
  value NUMERIC, -- e.g., 12
  unit TEXT, -- e.g., 'count', 'hours', '%'
  display_value TEXT, -- e.g., "12" or "500K+"
  context TEXT, -- e.g., "in the last 3 years"
  period TEXT DEFAULT 'all-time', -- or 'yearly', 'monthly'
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### activity_log
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY,
  event_type TEXT, -- 'deploy', 'commit', 'cert', 'collab', 'milestone'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### project_intakes
```sql
CREATE TABLE project_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  timeline TEXT,
  business_name TEXT,
  industry TEXT,
  target_audience TEXT,
  primary_goal TEXT,
  user_personas TEXT,
  user_stories TEXT,
  must_have_features TEXT,
  nice_to_have_features TEXT,
  existing_systems TEXT,
  preferred_stack TEXT,
  constraints TEXT,
  budget_range TEXT,
  engagement_type TEXT,
  client_name TEXT,
  client_email TEXT NOT NULL,
  client_company TEXT,
  source TEXT DEFAULT 'web_form',
  ai_architecture TEXT, -- JSON
  ai_user_flows TEXT, -- JSON
  ai_scope_summary TEXT -- JSON
);
```

---

## Getting Started

### Quick Start (5 minutes)

See **[SETUP.md](SETUP.md)** for detailed instructions.

**TL;DR:**
```bash
npm install
cp .env.local.template .env.local
# Edit .env.local with DATABASE_URL and ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000 in your browser.

### Deploy to Production

See **[DEPLOY.md](DEPLOY.md)** for Vercel, Railway, or Docker.

**TL;DR:**
```bash
# Option 1: Vercel (recommended)
npm i -g vercel
vercel

# Option 2: Railway
railway up

# Option 3: Docker
docker-compose up --build
```

---

## Customization

### Change portfolio data

1. Open Neon dashboard or connect with `psql`
2. Insert/update rows in `projects`, `certificates`, `metrics`, `activity_log`
3. Changes appear live on the site (routes cache for 1 hour by default)

### Change AI assistant persona

Edit `lib/assistantSystemPrompt.ts`:
- Update `PERSONA` (who the AI represents)
- Update `STRATEGIC_JUDGMENT` (what signals to emphasize)
- Update `TOPIC_ROUTING` (Q&A patterns)

### Add a new window

See "[Adding a new window](SETUP.md#adding-a-new-window)" in SETUP.md.

### Change theme colors

Edit `tailwind.config.ts` or override utility classes in `app/globals.css`.

Themes in use:
- **Primary:** Violet (`from-violet-600`, `text-violet-400`)
- **Success:** Emerald (`text-emerald-400`)
- **Danger:** Red (`text-red-400`)
- **Warning:** Amber (`text-amber-400`)

---

## API Endpoints

All endpoints are defined in `app/api/*` and are serverless functions.

### GET /api/projects
Returns all published projects.

**Response:**
```json
[
  {
    "id": "uuid",
    "slug": "d-scent-house",
    "title": "D Scent House",
    "subtitle": "Full-Stack E-Commerce Platform",
    "category": "e-commerce",
    "stack": ["Next.js", "PostgreSQL"],
    "thumbnail_url": "...",
    "live_url": "...",
    "github_url": "...",
    "problem_statement": "...",
    "approach": "...",
    "roi_label": "$2,400/yr",
    "roi_value": "$2,400",
    "testimonial_quote": "...",
    "featured": true,
    "built_at": "2024-06-01T00:00:00Z"
  }
]
```

### GET /api/certificates
Returns all credentials, ordered by category and issue date.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "AWS Solutions Architect",
    "issuer": "Amazon Web Services",
    "category": "cloud",
    "issued_at": "2023-01-15T00:00:00Z",
    "credential_url": "...",
    "badge_url": "...",
    "roi_proof": "..."
  }
]
```

### GET /api/metrics
Returns all-time metrics for the dashboard.

**Response:**
```json
[
  {
    "id": "uuid",
    "label": "Projects Shipped",
    "value": 12,
    "unit": "count",
    "display_value": "12",
    "context": "in the last 3 years"
  }
]
```

### GET /api/activity
Returns the 20 most recent activity log entries.

**Response:**
```json
[
  {
    "id": "uuid",
    "event_type": "deploy",
    "description": "Coach Jake v2.0 shipped to production",
    "created_at": "2024-12-15T14:30:00Z"
  }
]
```

### POST /api/assistant
Streams Claude Haiku responses with full portfolio context.

**Request:**
```json
{
  "message": "Tell me about your AI experience",
  "history": [
    { "role": "user", "content": "Who are you?" },
    { "role": "assistant", "content": "I'm Nitheesh's AI Agent..." }
  ]
}
```

**Response:** Server-Sent Events (SSE) stream
```
data: {"text":"I've worked with"}
data: {"text":" Claude at Anthropic"}
data: [DONE]
```

### POST /api/intake
Accepts project intake form submissions. Optionally calls AI scoping API.

**Request:**
```json
{
  "project_name": "E-Commerce Rebuild",
  "project_type": "web-app",
  "client_email": "client@example.com",
  "client_name": "John Doe",
  "budget_range": "$50k-$100k",
  "timeline": "4-6 months"
}
```

**Response:**
```json
{
  "success": true,
  "intakeId": "uuid",
  "aiGenerated": true,
  "ai": {
    "summary": { ... },
    "architecture": { ... },
    "phased_scope": { ... }
  }
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+W` | Close focused window |
| `Cmd/Ctrl+M` | Minimize focused window |
| `Cmd/Ctrl+,` | Open Contact window |
| `Cmd/Ctrl+1-7` | Open window 1-7 (Welcome → AI Sidekick) |
| `Escape` | Minimize focused window |
| Click title bar + drag | Move window |
| Click dock icon | Toggle (open/focus/minimize) window |

---

## Performance

### Metrics (on Vercel)

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint (FCP) | < 2s | ✅ ~1.2s |
| Largest Contentful Paint (LCP) | < 2.5s | ✅ ~1.8s |
| Cumulative Layout Shift (CLS) | < 0.1 | ✅ ~0.08 |
| Time to Interactive (TTI) | < 3.5s | ✅ ~2.9s |

### Database

- **Connection pooling** — Neon pooler handles 10k+ concurrent connections
- **Query caching** — Routes cache responses for 1 hour by default
- **Indexes** — Created on `featured`, `sort_order`, `created_at`

### Frontend

- **Code splitting** — Each window loads on-demand
- **Image optimization** — `next/image` with responsive sizes
- **CSS purging** — Tailwind removes unused styles (~25KB gzipped)

---

## Troubleshooting

### Windows won't drag
→ Check browser console for errors. Verify `useDraggable` hook is applied to `SystemWindow`.

### API returns 500
→ Check environment variables in deployment platform (Vercel → Settings → Environment Variables).

→ Test database connection: `psql $DATABASE_URL -c "SELECT 1;"`

### AI Sidekick returns generic responses
→ Ensure sample data is seeded: `psql $DATABASE_URL < db/migration_portfolio_realworld_seed.sql`

→ Check `/api/assistant` response in DevTools → Network → Preview.

### Slow initial load
→ Normal on first request to serverless function (~2-3s). Cached thereafter.

→ Check Vercel Deployments → Analytics for detailed performance breakdown.

---

## Contributing

This is a personal portfolio project, but feel free to fork and adapt for your own use.

**Best practices:**
- Keep `lib/assistantSystemPrompt.ts` in sync with real experience
- Update `db/migration_portfolio_realworld_seed.sql` with new projects
- Test API endpoints before deploying
- Run `npm run lint` before committing

---

## License

MIT

---

## Inspiration & Craft Philosophy

This portfolio is intentionally built as a *system*, not a static site:

1. **Every pixel serves a purpose** — UI is a reflection of engineering skill
2. **Live data** — Database feeds prove the site is alive and maintained
3. **AI context** — Claude demonstrates real problem-solving ability
4. **Window metaphor** — Desktop OS = organized, multi-threaded thinking
5. **Draggability** — Users *interact* with the portfolio, not just read it

The goal: leave hiring managers thinking: *"If this person can ship this portfolio as a production system, they can ship anything."*

---

## Built with craft. Every pixel is proof.

**Questions?** Open an issue or contact me at nitheeshd.17@gmail.com.

**Live site:** https://dwebstudios.com

**GitHub:** [https://github.com/yourusername/portfolio](https://github.com/yourusername/portfolio)
