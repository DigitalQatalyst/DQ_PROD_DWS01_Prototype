import { Router, type Request, type Response } from 'express';

export const sessionRouter = Router();

/**
 * GET /api/session/me
 * The only way the client learns who it is. Returns the resolved DWS access
 * context (never an Entra token). 401 when there is no established session.
 */
sessionRouter.get('/me', (req: Request, res: Response) => {
  const user = req.session.user;
  if (!user) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json({
    authenticated: true,
    user: {
      id: user.userId,
      email: user.email,
      name: user.displayName,
      workspaceSegment: user.workspaceSegment,
      roles: user.dwsRoles,
      permissions: user.permissions,
      unit: user.unit,
      team: user.team,
    },
  });
});
