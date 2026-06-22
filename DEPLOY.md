# DWS Spatial Portfolio OS v2.0 — Deployment Guide

This guide walks through deploying to **Vercel** (recommended), **Railway**, or **Docker**.

## Option 1: Vercel (Recommended)

Vercel is the fastest path to production. It's built for Next.js and integrates with Postgres directly.

### Prerequisites

- Vercel account (free tier works) — https://vercel.com
- Neon account — https://neon.tech (free tier)
- GitHub repo (Vercel prefers git deploys, but manual works too)

### Steps

#### 1. Push code to GitHub (optional, but recommended)

```bash
git init
git add .
git commit -m "Initial commit: DWS Portfolio OS"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

#### 2. Create/connect to Vercel

1. Go to https://vercel.com/import
2. Select "Continue with GitHub" (or email)
3. Authorize Vercel to access your GitHub account
4. Select the repo (`portfolio`)
5. Click "Import"

#### 3. Configure environment variables

In Vercel's project settings:

1. Go to **Settings → Environment Variables**
2. Add:
   - `DATABASE_URL` = your Neon pooled connection string
   - `ANTHROPIC_API_KEY` = your API key
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.vercel.app` (or your custom domain)

3. Set **Environment** to `Production, Preview, Development` for all three

#### 4. Deploy

Click **Deploy**. Vercel will:
- Build your Next.js app
- Run `npm run build`
- Deploy to CDN with auto-scaling

Your site is live at `https://your-project.vercel.app`.

#### 5. Add a custom domain (optional)

In Vercel:
1. Go to **Settings → Domains**
2. Add your domain (e.g., `dwebstudios.com`)
3. Follow DNS instructions for your registrar

#### 6. Enable serverless caching (optional)

In `next.config.ts`:
```ts
export const config = {
  unstable_allowDynamic: [
    '/lib/dbClient.ts', // Neon client factory
  ],
};
```

This reduces cold-start time on `/api/*` routes.

---

## Option 2: Railway

Railway is simpler than Vercel for mixed deployments (web + database).

### Prerequisites

- Railway account — https://railway.app
- Neon OR Railway Postgres

### Steps

#### 1. Prepare project

```bash
npm run build
npm test  # (optional)
```

#### 2. Connect GitHub to Railway

1. Go to https://railway.app/dashboard
2. Click **New Project → Deploy from GitHub**
3. Select your repo
4. Railway auto-detects `package.json` and starts building

#### 3. Add environment variables

In Railway project settings:
- `DATABASE_URL` = Neon pooled connection
- `ANTHROPIC_API_KEY` = your API key
- `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.up.railway.app`

#### 4. Configure Postgres (if using Railway)

Click **Add Service → PostgreSQL**. Railway provisions a database and injects `DATABASE_URL` automatically.

Then run migrations via the Railway CLI:
```bash
railway run psql < db/migration_portfolio.sql
railway run psql < db/migration_portfolio_realworld_seed.sql
```

#### 5. Deploy

Railway auto-deploys on git push. Monitor logs in the dashboard.

Your site is live at `https://yourdomain.up.railway.app`.

---

## Option 3: Docker + Any Host

For full control, use Docker.

### Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

### Docker Compose (with Postgres)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://portfolio:password@postgres:5432/portfolio
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: password
      POSTGRES_DB: portfolio
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up --build
```

App is at `http://localhost:3000`.

### Deploy Docker image to a VPS

1. Build and push to Docker Hub:
   ```bash
   docker build -t yourusername/portfolio:latest .
   docker push yourusername/portfolio:latest
   ```

2. On your VPS (Ubuntu 22.04+):
   ```bash
   ssh user@your.vps.com
   
   # Install Docker
   sudo apt-get update && sudo apt-get install docker.io docker-compose -y
   
   # Pull and run
   docker pull yourusername/portfolio:latest
   docker run -d \
     -p 80:3000 \
     -e DATABASE_URL="postgresql://..." \
     -e ANTHROPIC_API_KEY="sk-ant-..." \
     -e NEXT_PUBLIC_SITE_URL="https://yourdomain.com" \
     yourusername/portfolio:latest
   ```

3. Set up reverse proxy (Nginx):
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
   
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

   Enable with:
   ```bash
   sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl restart nginx
   ```

---

## Pre-Deployment Checklist

- [ ] `.env.local.template` is committed (not `.env.local`)
- [ ] Database migrations run successfully
- [ ] Sample data seeded (or real data loaded)
- [ ] `ANTHROPIC_API_KEY` set in environment
- [ ] `DATABASE_URL` uses pooled connection (not direct)
- [ ] `NEXT_PUBLIC_SITE_URL` set correctly
- [ ] `npm run build` succeeds locally
- [ ] All API routes tested (`/api/projects`, `/api/assistant`, etc.)
- [ ] AI Sidekick responds with real portfolio data
- [ ] Windows draggable and responsive
- [ ] No console errors in DevTools
- [ ] Meta tags render correctly (og-image.png exists)

---

## Performance Tuning

### Database

**Neon (cloud)** — Use pooled connection (hostname ends in `-pooler`):
```bash
DATABASE_URL=postgresql://user:pass@ep-cool-project-pooler.us-east-2.postgres.neon.tech/neondb?sslmode=require
```

**Indexes** — Already created in migrations:
```sql
CREATE INDEX idx_project_intakes_created_at ON project_intakes (created_at DESC);
CREATE INDEX idx_projects_featured_sort_order ON projects (featured DESC, sort_order ASC);
```

### API Caching

Add to `app/api/projects/route.ts`:
```ts
export const revalidate = 3600; // Cache for 1 hour
```

Then deploy with ISR (Incremental Static Regeneration).

### CDN

Vercel automatically serves static assets from their edge CDN. For Railway:
1. Use Cloudflare in front (free tier)
2. Set cache rules for `/api/static/*`

### Serverless Concurrency

Vercel: **Settings → Serverless Function → Max Duration: 30s** (enough for streaming)

Railway: No concurrency limits on web services.

---

## Monitoring & Logs

### Vercel

1. Go to **Deployments → (specific deployment) → Logs**
2. Stream live with CLI:
   ```bash
   npm i -g vercel
   vercel logs --tail
   ```

### Railway

1. Dashboard → Service → Logs
2. Or CLI:
   ```bash
   npm i -g @railway/cli
   railway logs
   ```

### Docker (VPS)

```bash
docker logs -f <container-id>
```

---

## Troubleshooting Deployment

### Build fails: "MODULE_NOT_FOUND"

→ Run `npm ci` (clean install) instead of `npm install` before pushing.

### API returns 500

→ Check logs for missing `DATABASE_URL` or `ANTHROPIC_API_KEY`.

→ Verify Neon connection: `psql $DATABASE_URL -c "SELECT version();"`

### AI Sidekick returns empty responses

→ Ensure sample data is seeded:
```bash
psql $DATABASE_URL < db/migration_portfolio_realworld_seed.sql
```

→ Check `/api/assistant` response in DevTools → Network.

### Connection timeout

→ Verify DATABASE_URL is **pooled** (hostname ends in `-pooler`).

→ Add `?sslmode=require` to DATABASE_URL.

### Cold start slow

→ Normal on Vercel/Railway first request (~2-3s). Subsequent requests cached.

→ Enable WebCrypto polyfill in `next.config.ts` if needed.

---

## Zero-Downtime Migrations

To update database schema without downtime:

1. On deployed instance, run migration:
   ```bash
   railway run psql < db/migration_new.sql
   ```

2. Deploy new code to pick up the change (auto via git push)

3. Rollback if needed:
   ```bash
   git revert <commit-hash> && git push
   ```

---

## Summary

| Platform | Setup Time | Cost | Scalability | Notes |
|----------|-----------|------|-------------|-------|
| **Vercel** | 5 min | Free tier | Automatic | Best for Next.js, fastest. |
| **Railway** | 10 min | ~$5–20/mo | Semi-automatic | Good for full-stack. |
| **Docker VPS** | 30 min | ~$5–20/mo | Manual | Full control. |

**Recommendation:** Start with **Vercel** + **Neon** (free tiers). Scale to Railway/Docker when needed.

---

**Deployed with confidence. Running like clockwork.**
