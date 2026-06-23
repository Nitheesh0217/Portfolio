import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Lazily initialized — safe at build time when DATABASE_URL is not available.
let _sql: NeonQueryFunction<false, false> | null = null;

function getDb(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env.local (dev) or Cloudflare Pages env vars (prod).'
    );
  }
  _sql = neon(connectionString);
  return _sql;
}

// Re-export as a tagged-template proxy so callers use `sql\`...\`` unchanged.
const sql: NeonQueryFunction<false, false> = new Proxy(
  {} as NeonQueryFunction<false, false>,
  {
    apply(_target, _thisArg, args) {
      return (getDb() as unknown as (...a: unknown[]) => unknown)(...args);
    },
    get(_target, prop) {
      return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
    },
  }
) as unknown as NeonQueryFunction<false, false>;

export default sql;
