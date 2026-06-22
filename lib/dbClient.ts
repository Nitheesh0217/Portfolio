// lib/dbClient.ts
// Factory wrapper around @neondatabase/serverless
// Used by all portfolio API routes (projects, certificates, metrics, activity, assistant)
//
// lib/db.ts (the existing file) remains untouched for the intake route.
// This file exposes the same Neon client via a createDbClient() factory
// so each API route gets a fresh tagged-template executor.
// ─────────────────────────────────────────────────────────────────────────────
import { neon } from '@neondatabase/serverless';

export function createDbClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add your Neon pooled connection string to .env.local.\n' +
      'Example: DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
    );
  }
  return neon(url);
}
