import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { config } from '../config';
import type { ResolvedAccessContext } from '../iam/types';

export interface AppSession {
  id: string;
  user: ResolvedAccessContext;
  createdAt: string;
  expiresAt: string;
}

const sessions = new Map<string, AppSession>();

export function createSession(user: ResolvedAccessContext) {
  const now = Date.now();
  const id = crypto.randomUUID();
  const session: AppSession = {
    id,
    user,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + config.sessionTtlMinutes * 60 * 1000).toISOString(),
  };

  sessions.set(id, session);
  return session;
}

export function getSession(sessionId: string | undefined) {
  if (!sessionId) return null;

  const session = sessions.get(sessionId);
  if (!session) return null;

  if (Date.parse(session.expiresAt) <= Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

export function destroySession(sessionId: string | undefined) {
  if (sessionId) sessions.delete(sessionId);
}

export function setSessionCookie(response: Response, sessionId: string) {
  response.cookie(config.sessionCookieName, signSessionId(sessionId), {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: config.sessionTtlMinutes * 60 * 1000,
  });
}

export function clearSessionCookie(response: Response) {
  response.clearCookie(config.sessionCookieName, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export function readSessionId(request: Request) {
  const value = request.cookies?.[config.sessionCookieName];
  if (typeof value !== 'string') return undefined;

  const [sessionId, signature] = value.split('.');
  if (!sessionId || !signature) return undefined;

  const expected = sign(sessionId);
  return timingSafeEqual(signature, expected) ? sessionId : undefined;
}

function signSessionId(sessionId: string) {
  return `${sessionId}.${sign(sessionId)}`;
}

function sign(value: string) {
  return crypto.createHmac('sha256', config.sessionSecret).update(value).digest('base64url');
}

function timingSafeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
