import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config.js';
import { createSessionMiddleware, sessionStoreKind } from './session/session.js';
import { authRouter } from './auth/routes.js';
import { sessionRouter } from './session/routes.js';

/**
 * Builds the BFF Express app without binding a port. This is the unit of
 * deployment for both runtimes:
 *  - Local dev / long-running host: `src/index.ts` imports this and calls listen().
 *  - Vercel serverless: `/api/index.ts` re-exports the app as the function handler.
 * Vercel rewrites preserve the original request path, so the routers below still
 * match `/auth/*`, `/api/session/*` and `/healthz`.
 */
export function createApp(): Express {
  const app = express();

  // Required on Vercel (and any reverse proxy) so secure cookies and the
  // client IP are honoured behind the platform's TLS-terminating proxy.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(express.json());

  // Frontend and BFF are same-origin on Vercel (rewrites), so CORS is a no-op
  // there. Kept as a fallback for direct cross-origin calls in other setups.
  app.use(
    cors({
      origin: config.frontendOrigin,
      credentials: true,
    }),
  );

  app.use(createSessionMiddleware());

  app.get('/healthz', (req, res) => {
    res.json({
      ok: true,
      entraConfigured: Boolean(config.entra.clientId),
      devMock: config.auth.devMockEnabled,
      database: config.database.enabled ? 'postgres' : 'in-memory-seed',
      // Durable sessions require a postgres store in serverless; 'memory' means
      // logins will not survive between requests.
      sessionStore: sessionStoreKind,
      frontendOrigin: config.frontendOrigin,
      // Whether THIS request carried the session cookie (proves cookie round-trip).
      sessionCookiePresent: (req.headers.cookie ?? '').includes(`${config.session.cookieName}=`),
    });
  });

  app.use('/auth', authRouter);
  app.use('/api/session', sessionRouter);

  return app;
}

const app = createApp();

export default app;
