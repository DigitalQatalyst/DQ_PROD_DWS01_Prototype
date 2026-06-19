import app from './app.js';
import { config } from './config.js';
import { getPool, closePool } from './db/pool.js';

/**
 * Long-running entrypoint (local dev or a traditional Node host). The Vercel
 * serverless deployment never runs this file — it imports the app from
 * `app.ts` directly. Keep all process/port lifecycle concerns here only.
 */
const server = app.listen(config.bffPort, () => {
  console.log(`[bff] DWS.01 BFF listening on http://localhost:${config.bffPort}`);
  console.log(`[bff] frontend origin: ${config.frontendOrigin}`);
  console.log(`[bff] identity: ${config.auth.devMockEnabled ? 'DEV MOCK' : 'Microsoft Entra ID'}`);
  console.log(`[bff] IAM store: ${config.database.enabled ? 'Postgres' : 'in-memory seed (no DATABASE_URL)'}`);
  // Surface DB connectivity early without blocking startup.
  const pool = getPool();
  if (pool) {
    pool
      .query('select 1')
      .then(() => console.log('[bff] Postgres connection OK'))
      .catch((err) => console.error('[bff] Postgres connection FAILED:', err.message));
  }
});

async function shutdown(signal: string): Promise<void> {
  console.log(`[bff] ${signal} received, shutting down`);
  server.close();
  await closePool();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
