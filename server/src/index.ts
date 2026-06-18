import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config.js';
import { createSessionMiddleware } from './session/session.js';
import { authRouter } from './auth/routes.js';
import { sessionRouter } from './session/routes.js';
import { getPool, closePool } from './db/pool.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());

// The frontend dev server proxies /api and /auth, so requests are same-origin.
// CORS with credentials is enabled as a fallback for direct cross-origin calls.
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true,
  }),
);

app.use(createSessionMiddleware());

app.get('/healthz', (_req, res) => {
  res.json({
    ok: true,
    entraConfigured: Boolean(config.entra.clientId),
    devMock: config.auth.devMockEnabled,
    database: config.database.enabled ? 'postgres' : 'in-memory-seed',
  });
});

app.use('/auth', authRouter);
app.use('/api/session', sessionRouter);

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
