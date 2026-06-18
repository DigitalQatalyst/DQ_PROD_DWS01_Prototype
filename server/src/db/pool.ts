import pg from 'pg';
import { config } from '../config.js';

let pool: pg.Pool | null = null;

/**
 * Returns a shared Postgres pool when DATABASE_URL is configured (Supabase or
 * any Postgres), otherwise null. Callers fall back to the in-memory seed store.
 */
export function getPool(): pg.Pool | null {
  if (!config.database.enabled) return null;
  if (!pool) {
    pool = new pg.Pool({
      connectionString: config.database.url,
      // Supabase requires TLS; allow self-signed in non-production pooled hosts.
      ssl: config.database.url.includes('localhost') ? undefined : { rejectUnauthorized: false },
      max: 5,
    });
    pool.on('error', (err) => {
      console.error('[db] unexpected pool error', err);
    });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
