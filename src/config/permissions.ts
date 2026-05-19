import type { WorkspaceRole } from './segments';

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

export const allSegments: WorkspaceRole[] = [
  'Associate',
  'Scrum Master',
  'Team / Squad Lead',
  'Unit Lead',
  'HRA',
  'Admin',
  'Support',
  'CEO'
];

export const segmentPermissions: Record<WorkspaceRole, Permission[]> = {
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
    'reports:personal'
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
    'reports:team'
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
    'reports:team'
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
    'reports:executive'
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
    'reports:team'
  ],
  Admin: [
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
    'admin:full'
  ],
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
    'reports:team'
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
    'reports:executive'
  ]
};

export function hasPermission(role: WorkspaceRole, permission: Permission) {
  return segmentPermissions[role].includes(permission);
}

export function hasAnyPermission(role: WorkspaceRole, permissions: Permission[] = []) {
  return permissions.length === 0 || permissions.some((permission) => hasPermission(role, permission));
}
