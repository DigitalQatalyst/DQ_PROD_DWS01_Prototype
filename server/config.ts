import dotenv from 'dotenv';

dotenv.config();

function parseCsv(value: string | undefined): string[] {
  return value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function withDefault<T>(value: T[], fallback: T[]) {
  return value.length > 0 ? value : fallback;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.BFF_PORT || process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'dws_session',
  sessionSecret: process.env.SESSION_SECRET || 'development-only-session-secret-change-me',
  sessionTtlMinutes: Number(process.env.SESSION_TTL_MINUTES || 480),
  entra: {
    tenantId: process.env.ENTRA_TENANT_ID || '',
    clientId: process.env.ENTRA_CLIENT_ID || '',
    clientSecret: process.env.ENTRA_CLIENT_SECRET || '',
    redirectUri: process.env.ENTRA_REDIRECT_URI || 'http://localhost:4000/auth/callback',
    scopes: withDefault(parseCsv(process.env.ENTRA_SCOPES), ['openid', 'profile', 'email']),
  },
  devAuthEnabled:
    process.env.AUTH_DEV_MOCK_ENABLED === 'true' ||
    (!process.env.ENTRA_TENANT_ID && process.env.NODE_ENV !== 'production'),
};

export function isEntraConfigured() {
  return Boolean(config.entra.tenantId && config.entra.clientId && config.entra.clientSecret);
}

export function requireProductionSecrets() {
  if (config.nodeEnv === 'production' && config.sessionSecret === 'development-only-session-secret-change-me') {
    throw new Error('SESSION_SECRET must be configured in production.');
  }

  if (config.nodeEnv === 'production' && !isEntraConfigured()) {
    throw new Error('Entra ID configuration is required in production.');
  }
}
