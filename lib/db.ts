import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Safe lazy getter — never throws at module import / build time.
// Will only throw when a DB query is actually executed at runtime.
export function getDb(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add it to Cloudflare Pages env vars (prod) or .env.local (dev).'
    );
  }
  return neon(url);
}

// Default export: a function that acts like the neon tagged-template sql tag.
// Usage: const sql = getDb(); await sql`SELECT 1`;
// OR keep existing call-sites by importing getDb and calling inline.
export default getDb;
