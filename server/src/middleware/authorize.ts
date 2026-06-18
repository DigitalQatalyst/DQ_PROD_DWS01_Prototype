import type { NextFunction, Request, Response } from 'express';
import type { Permission } from '../iam/permissions.js';
import { recordAudit } from '../audit/audit.js';

/**
 * Authentication guard. For MVP, the BFF is the single application boundary and
 * the authorization authority (ADR-DWS01-IAM-011): every protected API route
 * must pass through here. Future domain APIs reuse these guards.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.user) {
    void recordAudit({
      eventType: 'session_denied',
      resource: req.originalUrl,
      decision: 'deny',
      detail: { reason: 'no_session' },
    });
    res.status(401).json({ error: 'authentication_required' });
    return;
  }
  next();
}

/** Permission guard. DWS-resolved permissions are the authority, not the client. */
export function requirePermission(...required: Permission[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.session.user;
    if (!user) {
      res.status(401).json({ error: 'authentication_required' });
      return;
    }
    const granted = required.length === 0 || required.some((p) => user.permissions.includes(p));
    if (!granted) {
      void recordAudit({
        eventType: 'session_denied',
        actorEmail: user.email,
        resource: req.originalUrl,
        decision: 'deny',
        detail: { required },
      });
      res.status(403).json({ error: 'forbidden', required });
      return;
    }
    next();
  };
}
