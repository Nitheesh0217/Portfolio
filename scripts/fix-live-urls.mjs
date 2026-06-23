// One-shot script: update dead custom domains to live Vercel URLs
// Run: node scripts/fix-live-urls.mjs
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env.local manually
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '..', '.env.local');
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && !key.startsWith('#') && rest.length) {
    process.env[key.trim()] = rest.join('=').trim();
  }
}

const sql = neon(process.env.DATABASE_URL);

const updates = [
  ['coach-jake',                        'https://coach-jake-app.vercel.app'],
  ['d-scent-house',                     'https://d-scent-house.vercel.app'],
  ['unick-auto-detailing',              'https://unick-auto-detailing.vercel.app'],
  ['healthcare-readmission-prediction', 'https://healthcare-readmission-prediction.vercel.app'],
];

const results = await Promise.all(
  updates.map(([slug, url]) =>
    sql`UPDATE projects SET live_url = ${url} WHERE slug = ${slug} RETURNING slug, live_url`
  )
);

for (const rows of results) {
  if (rows[0]) {
    console.log(`✓  ${rows[0].slug}  →  ${rows[0].live_url}`);
  } else {
    console.log('⚠  no row matched for one of the slugs');
  }
}
