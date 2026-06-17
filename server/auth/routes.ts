import express from 'express';
import { config, isEntraConfigured } from '../config';
import { exchangeCodeForToken, getAuthorizationUrl } from './entra';
import { clearSessionCookie, createSession, destroySession, readSessionId, setSessionCookie } from './sessionStore';
import { resolveAccessContext, writeAuditEvent } from '../iam/localIamStore';
import type { BootstrapIdentity } from '../iam/types';

export const authRouter = express.Router();

authRouter.get('/login', async (request, response, next) => {
  try {
    const returnTo = sanitizeReturnTo(String(request.query.returnTo || '/home'));

    if (!isEntraConfigured()) {
      if (!config.devAuthEnabled) {
        response.status(503).json({ error: 'Entra ID is not configured.' });
        return;
      }

      const identity: BootstrapIdentity = {
        subjectId: 'dev-dq-user-001',
        displayName: 'Amina Hassan',
        email: 'amina.hassan@digitalqatalyst.com',
        bootstrapGroups: [],
        bootstrapAppRoles: [],
      };

      const accessContext = await resolveAccessContext(identity);
      const session = createSession(accessContext);
      setSessionCookie(response, session.id);
      await writeAuditEvent({
        type: 'login_success',
        subjectId: accessContext.subjectId,
        email: accessContext.email,
        sessionId: session.id,
        metadata: { provider: 'development-mock' },
      });
      response.redirect(toFrontendUrl(returnTo));
      return;
    }

    const authUrl = await getAuthorizationUrl(encodeState({ returnTo }));
    response.redirect(authUrl);
  } catch (error) {
    next(error);
  }
});

authRouter.get('/callback', async (request, response, next) => {
  try {
    const code = String(request.query.code || '');
    const state = decodeState(String(request.query.state || ''));
    const providerError = String(request.query.error || '');
    const providerErrorDescription = String(request.query.error_description || '');

    if (!code) {
      await writeAuditEvent({
        type: 'login_failure',
        reason: providerError || 'missing_authorization_code',
        metadata: { query: request.query },
      });
      const errorCode = providerError || 'missing_code';
      const errorDescription = providerErrorDescription ? `&error_description=${encodeURIComponent(providerErrorDescription)}` : '';
      response.redirect(toFrontendUrl(`/login?error=${encodeURIComponent(errorCode)}${errorDescription}`));
      return;
    }

    const result = await exchangeCodeForToken(code);
    const claims = (result.idTokenClaims || {}) as Record<string, unknown>;
    const account = result.account;
    const email = getStringClaim(claims, 'preferred_username') || getStringClaim(claims, 'email') || account?.username || '';
    const displayName = getStringClaim(claims, 'name') || account?.name || email;

    const identity: BootstrapIdentity = {
      subjectId: account?.homeAccountId || getStringClaim(claims, 'oid') || email,
      displayName,
      email,
      bootstrapGroups: getStringArrayClaim(claims, 'groups'),
      bootstrapAppRoles: getStringArrayClaim(claims, 'roles'),
    };

    const accessContext = await resolveAccessContext(identity);
    const session = createSession(accessContext);
    setSessionCookie(response, session.id);
    await writeAuditEvent({
      type: 'login_success',
      subjectId: accessContext.subjectId,
      email: accessContext.email,
      sessionId: session.id,
      metadata: { provider: 'entra-id' },
    });
    response.redirect(toFrontendUrl(sanitizeReturnTo(state.returnTo || '/home')));
  } catch (error) {
    await writeAuditEvent({
      type: 'login_failure',
      reason: 'callback_exchange_failed',
      metadata: { message: error instanceof Error ? error.message : String(error) },
    });
    response.redirect(toFrontendUrl('/login?error=callback_exchange_failed'));
  }
});

authRouter.post('/logout', async (request, response) => {
  const sessionId = readSessionId(request);
  destroySession(sessionId);
  clearSessionCookie(response);
  await writeAuditEvent({ type: 'logout', sessionId });
  response.status(204).send();
});

function sanitizeReturnTo(value: string) {
  if (!value.startsWith('/') || value.startsWith('//')) return '/home';
  return value;
}

function toFrontendUrl(path: string) {
  return new URL(path, config.frontendOrigin).toString();
}

function encodeState(state: { returnTo: string }) {
  return Buffer.from(JSON.stringify(state), 'utf8').toString('base64url');
}

function decodeState(raw: string): { returnTo?: string } {
  if (!raw) return {};

  try {
    return JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as { returnTo?: string };
  } catch {
    return {};
  }
}

function getStringClaim(claims: Record<string, unknown>, key: string) {
  const value = claims[key];
  return typeof value === 'string' ? value : '';
}

function getStringArrayClaim(claims: Record<string, unknown>, key: string) {
  const value = claims[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}
