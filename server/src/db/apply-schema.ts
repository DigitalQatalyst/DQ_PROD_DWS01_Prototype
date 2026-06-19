import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool, readSqlFile } from './run-sql-files.js';

/**
 * Applies the canonical IAM schema (server/src/db/schema.sql). The file is
 * idempotent (create table if not exists / insert on conflict do nothing), so
 * it is safe to run repeatedly against local or hosted Postgres.
 *
 * Note: this is separate from `db:migrate`, which applies the Services/Knowledge
 * MVP schema under migrations/.
 */
const here = path.dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const pool = createPool();
  try {
    const sql = await readSqlFile(path.resolve(here, 'schema.sql'));
    await pool.query(sql);
    console.log('[db:schema] applied server/src/db/schema.sql (IAM schema)');
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('[db:schema] failed');
  console.error(error);
  process.exit(1);
});
