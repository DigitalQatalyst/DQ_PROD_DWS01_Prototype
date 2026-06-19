import session from 'express-session';
import type { RequestHandler } from 'express';
import connectPgSimple from 'connect-pg-simple';
import { config } from '../config.js';
import { getPool } from '../db/pool.js';
import type { AccessContext } from '../iam/store.js';

export type SessionUser = AccessContext;

// Augment express-session with the fields the BFF stores server-side.
// None of this ever reaches the browser; the cookie only carries the session id.
declare module 'express-session' {
  interface SessionData {
    // Transient auth-flow state (set before redirect, cleared on callback).
    pkceVerifier?: string;
    authState?: string;
    nonce?: string;
    postLoginRedirect?: string;
    // Established identity + DWS access context.
    user?: SessionUser;
  }
}

export function createSessionMiddleware(): RequestHandler {
  // Serverless (Vercel) runs each request in a stateless, ephemeral instance, so
  // the default in-memory store would lose sessions between invocations. Back
  // sessions with Postgres whenever DATABASE_URL is configured.
  const pool = getPool();
  let store: session.Store | undefined;
  if (pool) {
    const PgSession = connectPgSimple(session);
    store = new PgSession({
      pool,
      tableName: 'user_sessions',
      // Auto-provision the table on first use (requires CREATE privilege). To
      // manage it via migrations instead, run connect-pg-simple's table.sql and
      // set this to false.
      createTableIfMissing: true,
      pruneSessionInterval: 60 * 15,
    });
  } else if (config.isProduction) {
    console.warn(
      '[session] No DATABASE_URL set — falling back to the in-memory store. ' +
        'Sessions will NOT persist across serverless invocations or restarts. ' +
        'Set DATABASE_URL for a durable session store.',
    );
  }

  return session({
    name: config.session.cookieName,
    secret: config.session.secret,
    store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    // Honour the X-Forwarded-Proto header from Vercel's proxy so the Secure
    // cookie is set correctly over HTTPS.
    proxy: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProduction,
      maxAge: config.session.ttlMinutes * 60 * 1000,
    },
  });
}
