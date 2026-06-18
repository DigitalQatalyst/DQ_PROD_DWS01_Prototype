import session from 'express-session';
import type { RequestHandler } from 'express';
import { config } from '../config.js';
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
  return session({
    name: config.session.cookieName,
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProduction,
      maxAge: config.session.ttlMinutes * 60 * 1000,
    },
  });
}
