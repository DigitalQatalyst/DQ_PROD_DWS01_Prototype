# DWS.01 Prototype

React/Vite prototype with a TypeScript BFF authentication boundary.

## Getting Started

1. Run `npm install`
2. Copy `.env.example` to `.env`
3. Run `npm run dev`

The local dev command starts:

- Vite client on `http://localhost:5173`
- BFF API/auth server on `http://localhost:4000`

Vite proxies `/auth/*` and `/api/*` to the BFF.

## Authentication

DWS.01 uses Microsoft Entra ID for identity and the DWS BFF as the application authorization authority.

For local development, `AUTH_DEV_MOCK_ENABLED=true` allows sign-in without Entra credentials. For Entra-backed sign-in, configure these values in `.env`:

- `ENTRA_TENANT_ID`
- `ENTRA_CLIENT_ID`
- `ENTRA_CLIENT_SECRET`
- `ENTRA_REDIRECT_URI`
- `SESSION_SECRET`

In the Entra app registration, add this as a **Web** platform redirect URI, not a Single-page application redirect URI:

```text
http://localhost:4000/auth/callback
```

If the redirect URI is configured under Single-page application, Entra can return `AADSTS9002325` because it expects PKCE for browser-side code redemption. DWS.01 uses the BFF/server authorization-code flow, so the callback belongs to the Web platform.

The frontend does not store Entra tokens. It reads authenticated session context from `/api/session/me`; the BFF stores session authority behind a secure `httpOnly` cookie.

The MVP IAM database schema is in `docs/architecture/iam-schema-mvp.sql`.
