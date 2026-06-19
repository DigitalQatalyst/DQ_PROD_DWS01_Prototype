import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));

// Load the repository-root .env (authoritative), then an optional server-local
// .env without overriding values already set.
dotenv.config({ path: path.resolve(here, '../../.env') });
dotenv.config({ path: path.resolve(here, '../.env') });

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set it in the repository-root .env (see server/.env.example).`,
    );
  }
  return value.trim();
}

function bool(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

const authDevMockEnabled = bool(process.env.AUTH_DEV_MOCK_ENABLED, false);
const isProduction = (process.env.NODE_ENV ?? 'development') === 'production';

// When the dev mock is enabled, Entra settings are optional so the platform can
// run fully offline. Otherwise they are mandatory.
function entraValue(name: string): string {
  const value = process.env[name];
  if (authDevMockEnabled) return (value ?? '').trim();
  return required(name, value);
}

export const config = {
  isProduction,
  bffPort: Number(process.env.BFF_PORT ?? 4000),
  frontendOrigin: (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173').replace(/\/$/, ''),

  session: {
    cookieName: process.env.SESSION_COOKIE_NAME ?? 'dws_session',
    secret: required('SESSION_SECRET', process.env.SESSION_SECRET),
    ttlMinutes: Number(process.env.SESSION_TTL_MINUTES ?? 480),
  },

  auth: {
    devMockEnabled: authDevMockEnabled,
  },

  entra: {
    tenantId: entraValue('ENTRA_TENANT_ID'),
    clientId: entraValue('ENTRA_CLIENT_ID'),
    clientSecret: entraValue('ENTRA_CLIENT_SECRET'),
    redirectUri: (process.env.ENTRA_REDIRECT_URI ?? 'http://localhost:4000/auth/callback').trim(),
    scopes: (process.env.ENTRA_SCOPES ?? 'openid,profile,email')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    get authority(): string {
      return `https://login.microsoftonline.com/${config.entra.tenantId}`;
    },
  },

  // Canonical IAM + audit store. When DATABASE_URL is absent the BFF falls back
  // to an in-memory seed store (prototype validation only).
  database: {
    url: (process.env.DATABASE_URL ?? '').trim(),
    get enabled(): boolean {
      return config.database.url !== '';
    },
  },

  discovery: {
    tenantId: (process.env.DWS_TENANT_ID ?? 'a0000000-0000-4000-8000-000000000001').trim(),
  },
};

export type AppConfig = typeof config;
