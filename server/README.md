# DWS.01 BFF — Entra Authentication & DWS Authorization

Backend-for-Frontend that implements the IAM LLAD decisions
(ADR-DWS01-IAM-009 … 012):

- **Microsoft Entra ID** authenticates the user (OIDC authorization-code flow + PKCE, run server-side).
- **DWS is the authorization authority** — app roles, permissions, unit/team scope, exceptions and delegations come from DWS records (Supabase/Postgres), not from Entra.
- The **frontend never holds Entra tokens**. The BFF establishes a **secure `httpOnly` cookie session** and the client reads its context from `GET /api/session/me`.
- **Supabase/Postgres** is the canonical IAM + audit store. **Redis is not used** in the MVP.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/auth/login` | Start Entra sign-in (redirects to Microsoft). Optional `?returnTo=/path`. |
| GET | `/auth/callback` | Entra redirect URI; exchanges the code, resolves context, sets session. |
| GET/POST | `/auth/logout` | Destroys the session and signs out of Entra. |
| GET | `/api/session/me` | Returns the resolved session context, or `401`. |
| GET | `/healthz` | Liveness + configuration summary. |

## Setup

1. **Configure env.** Values are read from the repository-root `.env` (see `server/.env.example` for the contract). The Entra app registration must list `http://localhost:4000/auth/callback` as a **Web** redirect URI.

2. **Install + run** (from the repo root):

   ```bash
   cd server
   npm install
   npm run dev
   ```

   The BFF starts on `http://localhost:4000`.

3. **Run the frontend** (separate terminal, repo root):

   ```bash
   npm run dev
   ```

   Vite (`http://localhost:5173`) proxies `/api` and `/auth` to the BFF, so cookies stay first-party.

## Canonical IAM store (optional but recommended)

Without `DATABASE_URL` the BFF uses an in-memory seed directory and defaults new
users to the `Associate` segment — fine for prototype validation. For real
authorization records, point `DATABASE_URL` at Supabase/Postgres and apply the
schema:

```bash
psql "$DATABASE_URL" -f src/db/schema.sql
```

The MVP Services + Knowledge launch schema uses the migration runner in
`src/db`:

```bash
npm run db:migrate
npm run db:seed
npm run db:validate:mvp
```

See `src/db/README.md` for the migration and seed scope.

## Offline development

Set `AUTH_DEV_MOCK_ENABLED=true` to bypass Entra and create a local mock session
(useful without network/tenant access). Leave it `false` for real Entra sign-in.

## Deploying on Vercel (serverless)

The same Express app is deployed to Vercel as a single serverless function,
co-located with the Vite frontend:

- `api/index.ts` (repo root) re-exports the app from `server/src/app.ts`.
- `server/src/index.ts` is only used for the long-running local/dev process; it
  is never executed on Vercel.
- `vercel.json` rewrites `/auth/*`, `/api/*`, and `/healthz` to the function and
  falls back to `index.html` for client-side routes. Because these go through
  Vercel rewrites, the frontend and BFF stay **same-origin**, so the `httpOnly`
  `SameSite=Lax` session cookie works without CORS changes.
- The BFF runtime dependencies are mirrored into the **root** `package.json` so
  Vercel's bundler can resolve them when bundling the function.

Required steps:

1. **Set environment variables** in Vercel (Project → Settings → Environment
   Variables): `SESSION_SECRET`, `DATABASE_URL`, `FRONTEND_ORIGIN`,
   `ENTRA_TENANT_ID`, `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET`,
   `ENTRA_REDIRECT_URI`. `NODE_ENV=production` is set by Vercel automatically
   (this makes the session cookie `Secure`).
2. **`DATABASE_URL` is required** — sessions are persisted in Postgres
   (`connect-pg-simple`, table `user_sessions`, auto-created on first use)
   because serverless instances are stateless. Use a pooled connection string
   for serverless (e.g. Supabase pooler on port 6543).
3. **Entra redirect URI must be the Vercel domain**:
   `https://<your-project>.vercel.app/auth/callback`, and register that exact
   URI on the Entra app registration (Web platform). Do **not** point it at a
   separate host — the PKCE/state cookie is first-party to the Vercel domain.
4. Set `FRONTEND_ORIGIN=https://<your-project>.vercel.app` so post-login
   redirects land back on the app.

> Note on connections: each cold function instance opens its own pg pool
> (`max: 5`). Under load this can exhaust direct Postgres connections — prefer a
> pooler (pgbouncer/Supabase pooler) in front of the database.
