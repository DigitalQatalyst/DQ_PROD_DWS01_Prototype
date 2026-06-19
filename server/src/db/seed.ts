import { createPool, listSqlFiles, migrationName, readSqlFile } from './run-sql-files.js';

async function main(): Promise<void> {
  const pool = createPool();

  try {
    const files = await listSqlFiles('seeds');
    for (const file of files) {
      const name = migrationName(file);
      const sql = await readSqlFile(file);
      const client = await pool.connect();
      try {
        await client.query('begin');
        await client.query(sql);
        await client.query('commit');
        console.log(`[db:seed] applied ${name}`);
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
  console.error('[db:seed] failed');
  console.error(error);
  process.exit(1);
});
