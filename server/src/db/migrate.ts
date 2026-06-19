import { createPool, listSqlFiles, migrationName, readSqlFile } from './run-sql-files.js';

async function main(): Promise<void> {
  const pool = createPool();

  try {
    await pool.query(`
      create table if not exists schema_migrations (
        version text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    const files = await listSqlFiles('migrations');
    for (const file of files) {
      const version = migrationName(file);
      const existing = await pool.query('select 1 from schema_migrations where version = $1', [version]);
      if (existing.rowCount && existing.rowCount > 0) {
        console.log(`[db:migrate] skip ${version}`);
        continue;
      }

      const sql = await readSqlFile(file);
      const client = await pool.connect();
      try {
        await client.query('begin');
        await client.query(sql);
        await client.query('insert into schema_migrations (version) values ($1)', [version]);
        await client.query('commit');
        console.log(`[db:migrate] applied ${version}`);
      } catch (error) {
        await client.query('rollback');
        throw error;
      } finally {
        client.release();
      }
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('[db:migrate] failed');
  console.error(error);
  process.exit(1);
});
