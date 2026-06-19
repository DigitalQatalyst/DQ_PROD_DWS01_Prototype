import { Router, type Request, type Response } from 'express';
import type { AuthorizationUrlRequest, AuthorizationCodeRequest } from '@azure/msal-node';
import { config } from '../config.js';
import { getMsalClient, cryptoProvider } from './msal.js';
import { resolveAccessContext, type EntraIdentity } from '../iam/store.js';
import { recordAudit } from '../audit/audit.js';

export const authRouter = Router();

/** Only allow same-origin relative redirect targets to avoid open redirects. */
function safeRelativePath(value: unknown): string {
  if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }
  return '/';
}

/**
 * GET /auth/login
 * Starts the Entra authorization-code flow (PKCE). The frontend reaches this by
 * a top-level navigation; we end by redirecting the browser to Microsoft.
 */
authRouter.get('/login', async (req: Request, res: Response) => {
  try {
    // Dev mock path: establish a session without contacting Entra.
    if (config.auth.devMockEnabled) {
      return await completeMockLogin(req, res);
    }

    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
    const state = cryptoProvider.createNewGuid();
    const nonce = cryptoProvider.createNewGuid();

    req.session.pkceVerifier = verifier;
    req.session.authState = state;
    req.session.nonce = nonce;
    req.session.postLoginRedirect = safeRelativePath(req.query.returnTo);

    const authCodeUrlParameters: AuthorizationUrlRequest = {
      scopes: config.entra.scopes,
      redirectUri: config.entra.redirectUri,
      codeChallenge: challenge,
      codeChallengeMethod: 'S256',
      state,
      nonce,
    };

    const authUrl = await getMsalClient().getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authUrl);
  } catch (err) {
    console.error('[auth] login error', err);
    res.status(500).send('Unable to start sign-in.');
  }
});

/**
 * GET /auth/callback
 * Entra redirect URI. Validates state, exchanges the code, resolves the DWS
 * access context, establishes the session, and returns the browser to the app.
 */
authRouter.get('/callback', async (req: Request, res: Response) => {
  const loginUrl = `${config.frontendOrigin}/login`;

  if (req.query.error) {
    await recordAudit({
      eventType: 'login_failure',
      decision: 'deny',
      detail: { error: req.query.error, description: req.query.error_description },
    });
    return res.redirect(`${loginUrl}?error=entra`);
  }

  if (!req.query.state || req.query.state !== req.session.authState) {
    await recordAudit({ eventType: 'login_failure', decision: 'deny', detail: { reason: 'state_mismatch' } });
    return res.redirect(`${loginUrl}?error=state`);
  }

  const code = req.query.code;
  const verifier = req.session.pkceVerifier;
  if (typeof code !== 'string' || !verifier) {
    await recordAudit({ eventType: 'login_failure', decision: 'deny', detail: { reason: 'missing_code' } });
    return res.redirect(`${loginUrl}?error=code`);
  }

  try {
    const tokenRequest: AuthorizationCodeRequest = {
      code,
      scopes: config.entra.scopes,
      redirectUri: config.entra.redirectUri,
      codeVerifier: verifier,
    };
    const result = await getMsalClient().acquireTokenByCode(tokenRequest);
    const claims = (result.idTokenClaims ?? {}) as Record<string, unknown>;

    if (req.session.nonce && claims.nonce && claims.nonce !== req.session.nonce) {
      await recordAudit({ eventType: 'login_failure', decision: 'deny', detail: { reason: 'nonce_mismatch' } });
      return res.redirect(`${loginUrl}?error=nonce`);
    }

    const identity: EntraIdentity = {
      oid: String(claims.oid ?? result.uniqueId ?? ''),
      email: String(
        claims.preferred_username ?? claims.email ?? result.account?.username ?? '',
      ).toLowerCase(),
      displayName: String(claims.name ?? result.account?.name ?? ''),
      groups: Array.isArray(claims.groups) ? (claims.groups as string[]) : undefined,
    };

    if (!identity.email) {
      await recordAudit({ eventType: 'login_failure', decision: 'deny', detail: { reason: 'no_email_claim' } });
      return res.redirect(`${loginUrl}?error=identity`);
    }

    const context = await resolveAccessContext(identity);
    const redirectTo = safeRelativePath(req.session.postLoginRedirect);

    // Prevent session fixation: issue a fresh session for the authenticated user.
    await regenerateSession(req);
    req.session.user = context;
    console.log('[auth] session established (callback)', JSON.stringify({ sid: req.sessionID, email: context.email }));

    await recordAudit({
      eventType: 'login_success',
      actorEmail: context.email,
      actorOid: identity.oid,
      decision: 'allow',
      detail: { segment: context.workspaceSegment, roles: context.dwsRoles },
    });

    res.redirect(`${config.frontendOrigin}${redirectTo}`);
  } catch (err) {
    console.error('[auth] callback error', err);
    await recordAudit({ eventType: 'login_failure', decision: 'deny', detail: { reason: 'token_exchange_failed' } });
    res.redirect(`${loginUrl}?error=exchange`);
  }
});

/**
 * GET|POST /auth/logout
 * Clears the local session, then redirects to Entra's logout endpoint so the
 * IdP session is also ended, finally returning to the app login page.
 */
async function handleLogout(req: Request, res: Response): Promise<void> {
  const email = req.session.user?.email ?? null;
  await recordAudit({ eventType: 'logout', actorEmail: email, decision: 'n/a' });

  const cookieName = config.session.cookieName;
  await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
  res.clearCookie(cookieName);

  const postLogout = `${config.frontendOrigin}/login`;
  if (config.auth.devMockEnabled || !config.entra.tenantId) {
    res.redirect(postLogout);
    return;
  }
  const logoutUrl =
    `${config.entra.authority}/oauth2/v2.0/logout` +
    `?post_logout_redirect_uri=${encodeURIComponent(postLogout)}`;
  res.redirect(logoutUrl);
}

authRouter.get('/logout', handleLogout);
authRouter.post('/logout', handleLogout);

function regenerateSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });
}

async function completeMockLogin(req: Request, res: Response): Promise<void> {
  const identity: EntraIdentity = {
    oid: 'dev-mock-oid',
    email: 'amina.hassan@digitalqatalyst.com',
    displayName: 'Amina Hassan (Dev Mock)',
  };
  const context = await resolveAccessContext(identity);
  const redirectTo = safeRelativePath(req.query.returnTo);
  await regenerateSession(req);
  req.session.user = context;
  console.log('[auth] session established (mock)', JSON.stringify({ sid: req.sessionID, email: context.email }));
  await recordAudit({
    eventType: 'login_success',
    actorEmail: context.email,
    decision: 'allow',
    detail: { mock: true, segment: context.workspaceSegment },
  });
  res.redirect(`${config.frontendOrigin}${redirectTo}`);
}
