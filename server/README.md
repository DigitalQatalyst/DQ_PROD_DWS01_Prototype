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
