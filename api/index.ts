/**
 * Vercel serverless entrypoint for the DWS.01 BFF.
 *
 * The whole Express app is exported as the default handler, so Vercel runs it
 * as a single function (Fluid compute). `vercel.json` rewrites `/auth/*`,
 * `/api/*` and `/healthz` to this function; the original request path is
 * preserved, so the Express routers in `app.ts` match as they do locally.
 *
 * Runtime requirements on Vercel (set as Project → Environment Variables):
 *   SESSION_SECRET, DATABASE_URL (for durable sessions + IAM store),
 *   FRONTEND_ORIGIN, ENTRA_TENANT_ID, ENTRA_CLIENT_ID, ENTRA_CLIENT_SECRET,
 *   ENTRA_REDIRECT_URI (= https://<vercel-domain>/auth/callback).
 */
import app from '../server/src/app.js';

export default app;
