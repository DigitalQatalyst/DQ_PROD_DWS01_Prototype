import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool, migrationName, readSqlFile } from './run-sql-files.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const supabaseSqlDir = path.resolve(here, '../../../supabase/sql');

async function listSupabaseSqlFiles(maxFile?: string): Promise<string[]> {
  const entries = await fs.readdir(supabaseSqlDir);
  const max = maxFile ?? '0010';
  return entries
    .filter((entry) => entry.endsWith('.sql'))
    .filter((entry) => {
      const prefix = entry.slice(0, 4);
      return prefix >= '0001' && prefix <= max;
    })
    .sort()
    .map((entry) => path.join(supabaseSqlDir, entry));
}

async function main(): Promise<void> {
  const maxFile = process.argv[2] ?? '0010';
  const pool = createPool();

  try {
    await pool.query(`
      create schema if not exists app;
      create table if not exists app.supabase_migrations (
        version text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    // One-time move from legacy public.supabase_migrations if present.
    await pool.query(`
      insert into app.supabase_migrations (version, applied_at)
      select version, applied_at from public.supabase_migrations
      on conflict (version) do nothing
    `);
    await pool.query('drop table if exists public.supabase_migrations');

    const files = await listSupabaseSqlFiles(maxFile);
    if (files.length === 0) {
      throw new Error(`No supabase/sql migration files found up to ${maxFile}`);
    }

    for (const file of files) {
      const version = migrationName(file);
      const existing = await pool.query('select 1 from app.supabase_migrations where version = $1', [version]);
      if (existing.rowCount && existing.rowCount > 0) {
        console.log(`[db:migrate:supabase] skip ${version}`);
        continue;
      }

      const sql = await readSqlFile(file);
      // Files manage their own BEGIN/COMMIT; do not wrap in an outer transaction.
      await pool.query(sql);
      await pool.query('insert into app.supabase_migrations (version) values ($1)', [version]);
      console.log(`[db:migrate:supabase] applied ${version}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('[db:migrate:supabase] failed');
  console.error(error);
  process.exit(1);
});
