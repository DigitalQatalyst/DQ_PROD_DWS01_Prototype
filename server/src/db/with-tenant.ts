import type pg from 'pg';
import { getPool } from './pool.js';

/**
 * Runs a callback inside a transaction with Pattern-B tenant context set on the
 * connection (see docs/DWS01_Database_Design_Spec_v2_Platform_Aligned.md §3.2).
 */
export async function withTenantContext<T>(
  tenantId: string,
  fn: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const pool = getPool();
  if (!pool) {
    throw new Error('DATABASE_URL is not configured');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`SELECT set_config('app.tenant_id', $1, true)`, [tenantId]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
