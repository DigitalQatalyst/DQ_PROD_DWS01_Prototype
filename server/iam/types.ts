export type WorkspaceRole =
  | 'Associate'
  | 'Scrum Master'
  | 'Team / Squad Lead'
  | 'Unit Lead'
  | 'HRA'
  | 'Admin'
  | 'Support'
  | 'CEO';

export type Permission =
  | 'workspace:personal'
  | 'tasks:personal'
  | 'tasks:all'
  | 'tasks:review'
  | 'workflows:personal'
  | 'workflows:operate'
  | 'trackers:personal'
  | 'trackers:team'
  | 'trackers:strategic'
  | 'performance:personal'
  | 'performance:team'
  | 'performance:unit'
  | 'governance:assigned'
  | 'governance:team'
  | 'governance:executive'
  | 'knowledge:view'
  | 'knowledge:review'
  | 'services:personal'
  | 'services:queue'
  | 'people:view'
  | 'reports:personal'
  | 'reports:team'
  | 'reports:executive'
  | 'admin:full';

export interface ResolvedAccessContext {
  subjectId: string;
  displayName: string;
  email: string;
  roles: WorkspaceRole[];
  permissions: Permission[];
  unitScopes: string[];
  teamScopes: string[];
  featureAccess: string[];
  delegations: string[];
}

export interface BootstrapIdentity {
  subjectId: string;
  displayName: string;
  email: string;
  bootstrapGroups: string[];
  bootstrapAppRoles: string[];
}

export interface AuditEvent {
  type:
    | 'login_success'
    | 'login_failure'
    | 'logout'
    | 'access_denied'
    | 'session_read'
    | 'permission_exception_requested';
  subjectId?: string;
  email?: string;
  sessionId?: string;
  resource?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
}
