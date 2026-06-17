import express from 'express';
import { getSession, readSessionId } from '../auth/sessionStore';
import { listAuditEvents, writeAuditEvent } from '../iam/localIamStore';

export const apiRouter = express.Router();

apiRouter.get('/session/me', async (request, response) => {
  const sessionId = readSessionId(request);
  const session = getSession(sessionId);

  if (!session) {
    response.status(401).json({ authenticated: false });
    return;
  }

  response.json({
    authenticated: true,
    session: {
      id: session.id,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    },
    user: session.user,
  });
});

apiRouter.post('/access/denied', express.json(), async (request, response) => {
  const sessionId = readSessionId(request);
  const session = getSession(sessionId);

  await writeAuditEvent({
    type: 'access_denied',
    subjectId: session?.user.subjectId,
    email: session?.user.email,
    sessionId,
    resource: typeof request.body?.resource === 'string' ? request.body.resource : undefined,
    reason: typeof request.body?.reason === 'string' ? request.body.reason : undefined,
    metadata: {
      activeRole: request.body?.activeRole,
      requiredPermissions: request.body?.requiredPermissions,
    },
  });

  response.status(202).json({ accepted: true });
});

apiRouter.post('/permission-exceptions', express.json(), async (request, response) => {
  const sessionId = readSessionId(request);
  const session = getSession(sessionId);

  if (!session) {
    response.status(401).json({ error: 'Authentication required.' });
    return;
  }

  await writeAuditEvent({
    type: 'permission_exception_requested',
    subjectId: session.user.subjectId,
    email: session.user.email,
    sessionId,
    resource: typeof request.body?.scope === 'string' ? request.body.scope : undefined,
    reason: typeof request.body?.reason === 'string' ? request.body.reason : undefined,
  });

  response.status(202).json({ status: 'submitted' });
});

apiRouter.get('/iam/audit-events', async (request, response) => {
  const sessionId = readSessionId(request);
  const session = getSession(sessionId);

  if (!session || !session.user.roles.includes('Admin')) {
    response.status(403).json({ error: 'Forbidden' });
    return;
  }

  response.json({ events: await listAuditEvents() });
});
