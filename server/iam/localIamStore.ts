import type { AuditEvent, BootstrapIdentity, Permission, ResolvedAccessContext, WorkspaceRole } from './types';

const allPermissions: Permission[] = [
  'workspace:personal',
  'tasks:personal',
  'tasks:all',
  'tasks:review',
  'workflows:personal',
  'workflows:operate',
  'trackers:personal',
  'trackers:team',
  'trackers:strategic',
  'performance:personal',
  'performance:team',
  'performance:unit',
  'governance:assigned',
  'governance:team',
  'governance:executive',
  'knowledge:view',
  'knowledge:review',
  'services:personal',
  'services:queue',
  'people:view',
  'reports:personal',
  'reports:team',
  'reports:executive',
  'admin:full',
];

const permissionsByRole: Record<WorkspaceRole, Permission[]> = {
  Associate: [
    'workspace:personal',
    'tasks:personal',
    'workflows:personal',
    'trackers:personal',
    'performance:personal',
    'governance:assigned',
    'knowledge:view',
    'services:personal',
    'people:view',
    'reports:personal',
  ],
  'Scrum Master': [
    'workspace:personal',
    'tasks:personal',
    'tasks:all',
    'tasks:review',
    'workflows:personal',
    'workflows:operate',
    'trackers:personal',
    'trackers:team',
    'performance:personal',
    'performance:team',
    'governance:assigned',
    'governance:team',
    'knowledge:view',
    'services:personal',
    'people:view',
    'reports:personal',
    'reports:team',
  ],
  'Team / Squad Lead': [
    'workspace:personal',
    'tasks:personal',
    'tasks:all',
    'tasks:review',
    'workflows:personal',
    'workflows:operate',
    'trackers:personal',
    'trackers:team',
    'performance:personal',
    'performance:team',
    'governance:assigned',
    'governance:team',
    'knowledge:view',
    'services:personal',
    'people:view',
    'reports:personal',
    'reports:team',
  ],
  'Unit Lead': [
    'workspace:personal',
    'tasks:personal',
    'tasks:all',
    'tasks:review',
    'workflows:personal',
    'workflows:operate',
    'trackers:personal',
    'trackers:team',
    'trackers:strategic',
    'performance:personal',
    'performance:team',
    'performance:unit',
    'governance:assigned',
    'governance:team',
    'governance:executive',
    'knowledge:view',
    'services:personal',
    'people:view',
    'reports:personal',
    'reports:team',
    'reports:executive',
  ],
  HRA: [
    'workspace:personal',
    'tasks:personal',
    'workflows:personal',
    'workflows:operate',
    'trackers:personal',
    'trackers:team',
    'performance:personal',
    'governance:assigned',
    'knowledge:view',
    'knowledge:review',
    'services:personal',
    'services:queue',
    'people:view',
    'reports:personal',
    'reports:team',
  ],
  Admin: allPermissions,
  Support: [
    'workspace:personal',
    'tasks:personal',
    'workflows:personal',
    'workflows:operate',
    'trackers:personal',
    'trackers:team',
    'performance:personal',
    'governance:assigned',
    'knowledge:view',
    'knowledge:review',
    'services:personal',
    'services:queue',
    'people:view',
    'reports:personal',
    'reports:team',
  ],
  CEO: [
    'workspace:personal',
    'tasks:personal',
    'tasks:all',
    'workflows:personal',
    'workflows:operate',
    'trackers:personal',
    'trackers:strategic',
    'performance:personal',
    'performance:team',
    'performance:unit',
    'governance:assigned',
    'governance:team',
    'governance:executive',
    'knowledge:view',
    'services:personal',
    'people:view',
    'reports:personal',
    'reports:team',
    'reports:executive',
  ],
};

const devAssignedRoles: WorkspaceRole[] = [
  'Associate',
  'Scrum Master',
  'Team / Squad Lead',
  'Unit Lead',
  'HRA',
  'Admin',
  'Support',
  'CEO',
];

const auditEvents: AuditEvent[] = [];

function uniquePermissions(roles: WorkspaceRole[]) {
  return Array.from(new Set(roles.flatMap((role) => permissionsByRole[role])));
}

export async function resolveAccessContext(identity: BootstrapIdentity): Promise<ResolvedAccessContext> {
  const roles = resolveRoles(identity);

  return {
    subjectId: identity.subjectId,
    displayName: identity.displayName,
    email: identity.email,
    roles,
    permissions: uniquePermissions(roles),
    unitScopes: ['DQ_INTERNAL'],
    teamScopes: ['DWS01_PROTOTYPE'],
    featureAccess: ['workspace', 'marketplace', 'tasks', 'services', 'knowledge', 'analytics', 'administration'],
    delegations: [],
  };
}

export async function writeAuditEvent(event: Omit<AuditEvent, 'occurredAt'>) {
  const auditEvent = { ...event, occurredAt: new Date().toISOString() };
  auditEvents.push(auditEvent);

  if (process.env.NODE_ENV !== 'test') {
    console.info('[iam-audit]', JSON.stringify(auditEvent));
  }
}

export async function listAuditEvents() {
  return auditEvents.slice();
}

function resolveRoles(identity: BootstrapIdentity): WorkspaceRole[] {
  const mappedRoles = new Set<WorkspaceRole>();

  for (const role of identity.bootstrapAppRoles) {
    if (isWorkspaceRole(role)) mappedRoles.add(role);
  }

  for (const group of identity.bootstrapGroups) {
    const groupRole = mapGroupToRole(group);
    if (groupRole) mappedRoles.add(groupRole);
  }

  if (mappedRoles.size > 0) return Array.from(mappedRoles);

  if (process.env.NODE_ENV === 'production') return ['Associate'];

  return devAssignedRoles;
}

function isWorkspaceRole(value: string): value is WorkspaceRole {
  return Object.keys(permissionsByRole).includes(value);
}

function mapGroupToRole(group: string): WorkspaceRole | null {
  const normalized = group.toLowerCase();

  if (normalized.includes('admin')) return 'Admin';
  if (normalized.includes('ceo') || normalized.includes('leadership')) return 'CEO';
  if (normalized.includes('unit')) return 'Unit Lead';
  if (normalized.includes('team')) return 'Team / Squad Lead';
  if (normalized.includes('scrum')) return 'Scrum Master';
  if (normalized.includes('hra') || normalized.includes('human')) return 'HRA';
  if (normalized.includes('support')) return 'Support';
  if (normalized.includes('associate')) return 'Associate';

  return null;
}
