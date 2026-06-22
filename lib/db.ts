import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Add it to .env.local as your Neon pooled connection string.'
  );
}

const sql = neon(connectionString);

export default sql;
