# Pre-Launch Verification Checklist

Use this checklist before launching to production.

## Environment Setup ✅

- [ ] `.env.local` file created (copied from `.env.local.template`)
- [ ] `DATABASE_URL` is set to Neon pooled connection
- [ ] `DATABASE_URL` is not empty or invalid
- [ ] `ANTHROPIC_API_KEY` is set and valid
- [ ] `NEXT_PUBLIC_SITE_URL` points to your domain
- [ ] `.env.local` is in `.gitignore` (secrets not committed)
- [ ] No console warnings about missing env vars

## Dependencies ✅

```bash
npm install
```

- [ ] Installation completes without major errors
- [ ] `node_modules/` is created
- [ ] `package-lock.json` is up to date
- [ ] No duplicate dependency warnings
- [ ] All peer dependencies satisfied

## Development Server ✅

```bash
npm run dev
```

- [ ] Dev server starts on http://localhost:3000
- [ ] No console errors on startup
- [ ] Page loads without JavaScript errors
- [ ] Welcome window appears
- [ ] Terminal window shows boot animation

## TypeScript & Linting ✅

```bash
npm run lint
```

- [ ] No TypeScript errors
- [ ] No ESLint warnings (except optional ignores)
- [ ] Type checking passes: `npx tsc --noEmit`
- [ ] All imports resolved correctly
- [ ] No unused variables or imports

## Database Setup ✅

### Schema Migration
```bash
psql $DATABASE_URL < db/migration_portfolio.sql
```

- [ ] All 5 tables created successfully
- [ ] Indexes created without errors
- [ ] Extensions enabled (`pgcrypto`)
- [ ] Constraints applied (PRIMARY KEY, UNIQUE, NOT NULL)

### Sample Data
```bash
psql $DATABASE_URL < db/migration_portfolio_realworld_seed.sql
```

- [ ] Projects table has at least 1 row
- [ ] Certificates table populated
- [ ] Metrics table populated
- [ ] Activity log populated
- [ ] Data queries return results:
  ```bash
  psql $DATABASE_URL -c "SELECT COUNT(*) FROM projects;"
  psql $DATABASE_URL -c "SELECT COUNT(*) FROM certificates;"
  psql $DATABASE_URL -c "SELECT COUNT(*) FROM metrics;"
  psql $DATABASE_URL -c "SELECT COUNT(*) FROM activity_log;"
  ```

## API Testing ✅

Start dev server and test each endpoint:

### GET /api/projects
```bash
curl http://localhost:3000/api/projects | jq .
```

- [ ] Returns JSON array
- [ ] HTTP 200 status
- [ ] At least 1 project with `id`, `title`, `slug`
- [ ] No error messages

### GET /api/certificates
```bash
curl http://localhost:3000/api/certificates | jq .
```

- [ ] Returns JSON array
- [ ] HTTP 200 status
- [ ] Certificates have `title`, `issuer`, `category`
- [ ] No error messages

### GET /api/metrics
```bash
curl http://localhost:3000/api/metrics | jq .
```

- [ ] Returns JSON array
- [ ] HTTP 200 status
- [ ] Metrics have `label`, `value`, `unit`
- [ ] No error messages

### GET /api/activity
```bash
curl http://localhost:3000/api/activity | jq .
```

- [ ] Returns JSON array
- [ ] HTTP 200 status
- [ ] Activity entries have `event_type`, `description`
- [ ] No error messages

### POST /api/assistant
```bash
curl -X POST http://localhost:3000/api/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Who are you?",
    "history": []
  }'
```

- [ ] Returns streaming response (SSE)
- [ ] First chunk arrives within 2 seconds
- [ ] Response includes portfolio context
- [ ] Stream ends with `[DONE]`
- [ ] No API key errors

### POST /api/intake
```bash
curl -X POST http://localhost:3000/api/intake \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Test Project",
    "project_type": "web-app",
    "client_email": "test@example.com"
  }'
```

- [ ] Returns 200 status
- [ ] Response includes `success: true`
- [ ] Response includes `intakeId`
- [ ] Data persists in database (verify with `psql`)

## Frontend Testing ✅

### Window Management
- [ ] Welcome window opens on load
- [ ] Terminal window shows boot animation
- [ ] Can drag windows by title bar
- [ ] Can minimize windows (goes to dock)
- [ ] Can focus windows (brings to front)
- [ ] Dock icons update window state
- [ ] Z-index updates on focus
- [ ] No visual glitches or overlaps

### Window Content
- [ ] **Welcome:** Button links to `/start-project`
- [ ] **Terminal:** Shows boot lines, then activity feed
- [ ] **Projects:** Three-column layout (categories, list, details)
- [ ] **Certificates:** Grid of credentials with icons
- [ ] **Metrics:** 2×2 grid of stat cards
- [ ] **Contact:** Email link, social buttons
- [ ] **AI Sidekick:** Chat interface, typing works, responses stream

### Keyboard Shortcuts
- [ ] `Ctrl+W` / `Cmd+W` — Close focused window
- [ ] `Ctrl+M` / `Cmd+M` — Minimize focused window
- [ ] `Ctrl+,` / `Cmd+,` — Open Contact window
- [ ] `Escape` — Minimize focused window
- [ ] `Ctrl+1-7` / `Cmd+1-7` — Open windows 1-7

### Responsive Design
- [ ] Layout works at 1920×1080 (desktop)
- [ ] Windows scale appropriately
- [ ] Text is readable
- [ ] No horizontal scroll on smaller screens

### Accessibility
- [ ] Tab navigation works through focusable elements
- [ ] Buttons have visible focus states
- [ ] Aria labels present on icons
- [ ] Colors have sufficient contrast (WCAG AA)

## Build & Production ✅

### Production Build
```bash
npm run build
```

- [ ] Build completes without errors
- [ ] No warnings in build output
- [ ] `.next/` directory created
- [ ] Build size is reasonable (< 250MB)
- [ ] Static pages generated correctly

### Production Server
```bash
npm start
```

- [ ] Server starts without errors
- [ ] http://localhost:3000 loads site
- [ ] All pages render correctly
- [ ] Performance is acceptable (FCP < 2s)

### Lighthouse Audit (Chrome DevTools)
- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] Best Practices score > 85
- [ ] SEO score > 90

## Meta Tags & SEO ✅

Test with browser DevTools or https://metatags.io:

- [ ] Page title: "Nitheesh Donepudi — D Web Studios"
- [ ] Meta description present
- [ ] Open Graph tags present (og:title, og:description, og:image)
- [ ] og-image.png exists at `public/og-image.png`
- [ ] Twitter card tags present
- [ ] Canonical URL set
- [ ] Robots meta tag allows indexing
- [ ] Viewport meta tag set (for mobile)
- [ ] Favicon loads without 404

## Browser Compatibility ✅

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome for Android (latest)

Expected results:
- [ ] Site loads without JavaScript errors
- [ ] All windows draggable
- [ ] Chat works
- [ ] No missing fonts or images
- [ ] No layout shifts

## Performance Testing ✅

Use Chrome DevTools Performance tab:

- [ ] First Contentful Paint (FCP): < 2s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Time to Interactive (TTI): < 3.5s
- [ ] Total Blocking Time (TBT): < 200ms

## Security Checklist ✅

- [ ] No secrets in source code (API keys, passwords)
- [ ] `.env.local` is in `.gitignore`
- [ ] Environment variables set in deployment platform (not in code)
- [ ] SQL queries use parameterized statements (Neon client handles this)
- [ ] User input validated server-side (intake form)
- [ ] HTTPS enforced in production
- [ ] CORS headers appropriate
- [ ] No console warnings about security issues

## Deployment Preparation ✅

### Git & Version Control
- [ ] Git repo initialized: `git init`
- [ ] All source files committed (except `.env.local`)
- [ ] `.gitignore` includes `.env.local`, `node_modules/`, `.next/`
- [ ] Remote added: `git remote add origin [URL]`
- [ ] Branch created: `git checkout -b main` (or master)

### Vercel Deployment (Recommended)
- [ ] GitHub repo pushed
- [ ] Vercel project created
- [ ] Environment variables set in Vercel dashboard
- [ ] Build settings: `npm run build` / `npm start`
- [ ] Production domain configured
- [ ] HTTPS enabled

### Alternative Deployment (Railway/Docker)
- [ ] `Dockerfile` created (if Docker)
- [ ] `docker-compose.yml` created (if Docker)
- [ ] Railway project created (if Railway)
- [ ] Environment variables configured
- [ ] Build tested locally before deploying

## Post-Deployment Testing ✅

After deploying to production:

- [ ] Site loads at production URL
- [ ] All pages render correctly
- [ ] API endpoints respond (check Network tab)
- [ ] AI Sidekick works with live data
- [ ] Dragging windows works on production
- [ ] No console errors
- [ ] Lighthouse audit score acceptable
- [ ] Database queries are fast (check dev tools timing)
- [ ] Monitoring/logging enabled (Vercel Analytics or similar)

## Documentation ✅

- [ ] README.md is complete and accurate
- [ ] SETUP.md has working instructions
- [ ] DEPLOY.md covers production deployment
- [ ] PROJECT_STATUS.md updated
- [ ] Code comments where necessary (not excessive)
- [ ] API endpoints documented

## Optional Enhancements ✅

- [ ] Google Analytics or Vercel Analytics configured
- [ ] Sitemap generated (`public/sitemap.xml`)
- [ ] robots.txt created (`public/robots.txt`)
- [ ] Newsletter signup (if applicable)
- [ ] Contact form success page
- [ ] Error pages (404, 500) styled

## Final Checks ✅

Before going live:

- [ ] All checklist items completed or explicitly marked as N/A
- [ ] No console errors in production
- [ ] Performance acceptable on 3G connection
- [ ] Mobile experience tested on actual device
- [ ] Email delivery tested (if applicable)
- [ ] Database backups configured
- [ ] Monitoring and alerting configured
- [ ] Team/stakeholders notified
- [ ] Launch plan communicated

---

## Troubleshooting Quick Reference

### Build Fails
→ Run `npm ci` (clean install)  
→ Delete `node_modules/` and `.next/`, then `npm install`  
→ Check Node.js version (`node --version` should be 18+)

### API returns 500
→ Verify `DATABASE_URL` in `.env.local`  
→ Test connection: `psql $DATABASE_URL -c "SELECT 1;"`  
→ Check Vercel logs for error details

### AI Sidekick empty
→ Seed database: `psql $DATABASE_URL < db/migration_portfolio_realworld_seed.sql`  
→ Verify `ANTHROPIC_API_KEY` is set  
→ Check `/api/assistant` response in Network tab

### Windows not dragging
→ Check browser console for errors  
→ Verify JavaScript enabled  
→ Try different browser

### Slow performance
→ Check Lighthouse audit  
→ Enable caching: `revalidate = 3600` in API routes  
→ Verify database indexes created
→ Monitor Vercel Analytics

---

## Sign-Off

**Verification Date:** _______________

**Verified By:** _______________

**Status:** ☐ Ready for Production  |  ☐ Issues Found (list below)

**Issues/Notes:**
```
[Add any issues found]
```

**Next Steps:**
```
[Add action items]
```

---

**When all checks pass, you're ready to launch! 🚀**

**Built with craft. Every pixel is proof.**
