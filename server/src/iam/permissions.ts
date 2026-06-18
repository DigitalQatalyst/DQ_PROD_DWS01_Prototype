/**
 * Canonical DWS IAM model (server-authoritative).
 *
 * Per ADR-DWS01-IAM-009, DWS — not Entra — is the authorization authority.
 * This module is the authoritative permission catalogue (ADR-DWS01-IAM-004):
 * permission keys are explicit platform configuration, not implicit page
 * ownership. The frontend mirror lives in src/config/permissions.ts and must be
 * kept in step with this file.
 */

export type WorkspaceSegment =
  | 'Associate'
  | 'Scrum Master'
  | 'Team / Squad Lead'
  | 'Unit Lead'
  | 'HRA'
  | 'Admin'
  | 'Support'
  | 'CEO';

export type DwsRole =
  | 'Associate'
  | 'Lead'
  | 'ServiceOwner'
  | 'GovernanceLead'
  | 'Leadership'
  | 'PlatformAdmin';

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

export const ALL_SEGMENTS: WorkspaceSegment[] = [
  'Associate',
  'Scrum Master',
  'Team / Squad Lead',
  'Unit Lead',
  'HRA',
  'Admin',
  'Support',
  'CEO',
];

/** Maps a workspace segment to its canonical DWS role (ADR-DWS01-IAM-003). */
export function normalizeSegmentToRole(segment: WorkspaceSegment): DwsRole {
  switch (segment) {
    case 'Admin':
      return 'PlatformAdmin';
    case 'Scrum Master':
    case 'Team / Squad Lead':
    case 'Unit Lead':
      return 'Lead';
    case 'HRA':
    case 'Support':
      return 'GovernanceLead';
    case 'CEO':
      return 'Leadership';
    case 'Associate':
    default:
      return 'Associate';
  }
}

export const segmentPermissions: Record<WorkspaceSegment, Permission[]> = {
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
    'admin:full',
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

export function permissionsForSegment(segment: WorkspaceSegment): Permission[] {
  return segmentPermissions[segment] ?? segmentPermissions.Associate;
}
