import type { WorkspaceRole } from './segments';
import type { Permission } from './permissions';

export type NavIcon =
  | 'home'
  | 'briefcase'
  | 'checkSquare'
  | 'gitBranch'
  | 'database'
  | 'gauge'
  | 'shield'
  | 'book'
  | 'cloud'
  | 'users'
  | 'pie'
  | 'brain'
  | 'settings'
  | 'fileText'
  | 'bookOpen'
  | 'barChart2'
  | 'messageSquare';

export interface NavItemConfig {
  id: string;
  label: string;
  icon: NavIcon;
  route: string;
  section: string;
  requiredPermissions: Permission[];
  allowedSegments: WorkspaceRole[];
  badgeCountKey?: string;
  description: string;
}

export type NavStageId = 'stage-01' | 'stage-02' | 'stage-03' | 'stage-04';

export interface NavStageConfig {
  id: NavStageId;
  label: string;
  allowedSegments: WorkspaceRole[];
}

export interface NavSectionConfig {
  id: string;
  label: string;
  icon: NavIcon;
  stageId: NavStageId;
  route?: string;
  allowedSegments?: WorkspaceRole[];
}

const all: WorkspaceRole[] = ['Associate', 'Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'HRA', 'Admin', 'Support', 'CEO'];
const nonAssociate: WorkspaceRole[] = ['Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'HRA', 'Admin', 'Support', 'CEO'];
const team: WorkspaceRole[] = ['Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'Admin', 'CEO'];
const unit: WorkspaceRole[] = ['Unit Lead', 'Admin', 'CEO'];
const adminOnly: WorkspaceRole[] = ['Admin'];
const serviceQueue: WorkspaceRole[] = ['HRA', 'Admin', 'Support'];
const executive: WorkspaceRole[] = ['Unit Lead', 'Admin', 'CEO'];
const controlRoles: WorkspaceRole[] = ['Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'HRA', 'Admin', 'Support', 'CEO'];

export const navStages: NavStageConfig[] = [
  { id: 'stage-01', label: 'Stage 01 — Discovery', allowedSegments: all },
  { id: 'stage-02', label: 'Stage 02 — Workspace', allowedSegments: all },
  { id: 'stage-03', label: 'Stage 03 — Fulfilment & Control', allowedSegments: controlRoles },
  { id: 'stage-04', label: 'Stage 04 — Governance & Intelligence', allowedSegments: controlRoles }
];

export const navSections: NavSectionConfig[] = [
  { id: 'marketplace', label: 'Marketplace', icon: 'briefcase', stageId: 'stage-01', route: '/marketplace/discern' },
  { id: 'workspace', label: 'Workspace', icon: 'book', stageId: 'stage-02', route: '/workspace' },
  { id: 'performance', label: 'Performance', icon: 'gauge', stageId: 'stage-02' },
  { id: 'workflows', label: 'Workflows', icon: 'gitBranch', stageId: 'stage-03', allowedSegments: controlRoles },
  { id: 'trackers', label: 'Trackers', icon: 'database', stageId: 'stage-03', allowedSegments: controlRoles },
  { id: 'services', label: 'Requests & Support', icon: 'cloud', stageId: 'stage-03', allowedSegments: controlRoles },
  { id: 'governance', label: 'Governance', icon: 'shield', stageId: 'stage-04', allowedSegments: controlRoles },
  { id: 'reports', label: 'Reports & Intelligence', icon: 'pie', stageId: 'stage-04', allowedSegments: controlRoles }
];

const item = (
  section: string,
  id: string,
  label: string,
  route: string,
  requiredPermissions: Permission[],
  allowedSegments: WorkspaceRole[],
  description: string,
  badgeCountKey?: string
): NavItemConfig => {
  const icon = navSections.find((navSection) => navSection.id === section)?.icon || 'home';
  return { id, label, icon, route, section, requiredPermissions, allowedSegments, description, badgeCountKey };
};

export const navigationItems: NavItemConfig[] = [
  // ── Marketplace ────────────────────────────────────────────────────────────
  item('marketplace', 'marketplace-discern', 'Discern', '/marketplace/discern', [], all, 'Find knowledge, analytics, and work ownership entry points.'),
  item('marketplace', 'marketplace-design', 'Design', '/marketplace/design', [], all, 'Find templates, knowledge, and ownership context for structuring work.'),
  item('marketplace', 'marketplace-deploy', 'Deploy', '/marketplace/deploy', [], all, 'Start requests, launch task patterns, and route delivery ownership.'),
  item('marketplace', 'marketplace-drive', 'Drive', '/marketplace/drive', [], all, 'Find analytics, service signals, and knowledge for improving outcomes.'),
  item('marketplace', 'marketplace-feedback', 'Marketplace Feedback', '/marketplace/feedback', [], all, 'Flag unclear services, missing templates, outdated knowledge, incorrect owners, or broken navigation.'),

  // ── Workspace ──────────────────────────────────────────────────────────────
  item('workspace', 'workspace-my-tasks', 'My Tasks', '/workspace/my-tasks', ['tasks:personal'], all, 'Tasks assigned to or owned by the active user.', 'tasks'),
  item('workspace', 'workspace-my-requests', 'My Requests', '/workspace/my-requests', ['services:personal'], all, 'Personal service and support requests.', 'requests'),
  item('workspace', 'workspace-working-sessions', 'Working Sessions', '/workspace/working-sessions', ['workspace:personal'], all, 'Active working sessions, decisions, and follow-up actions.'),
  item('workspace', 'workspace-activity', 'Activity', '/workspace/activity', ['workspace:personal'], all, 'Platform activity, notifications, announcements, mentions, approvals, and recent user events.', 'notifications'),

  item('workflows', 'workflows-my', 'My Workflows', '/workflows/my-workflows', ['workflows:personal'], controlRoles, 'Workflows assigned to or requiring input from the active user.'),
  item('workflows', 'workflows-pending-approvals', 'Pending Approvals', '/workflows/pending-approvals', ['workflows:personal'], controlRoles, 'Approvals assigned to the active user.', 'approvals'),
  item('workflows', 'workflows-sla-risks', 'SLA Risks', '/workflows/sla-risks', ['workflows:personal'], controlRoles, 'SLA risks affecting assigned work.', 'slaRisks'),

  item('trackers', 'trackers-hub', 'Tracker Hub', '/trackers', ['trackers:personal'], controlRoles, 'Tracker-based operating hub replacing spreadsheet follow-up.'),
  item('trackers', 'trackers-my-items', 'My Tracker Items', '/trackers/my-items', ['trackers:personal'], controlRoles, 'Tracker records assigned to or owned by the active user.', 'trackers'),

  item('performance', 'performance-overview', 'My Performance', '/performance/overview', ['performance:personal'], all, 'Personal performance summary and review readiness.'),
  item('performance', 'performance-goals', 'Goals', '/performance/goals', ['performance:personal'], all, 'Personal goals and progress evidence.'),
  item('performance', 'performance-evaluation', 'Evaluation', '/performance/evaluation', ['performance:personal'], all, 'Formal performance evaluation cycle.'),
  item('performance', 'performance-feedback', 'Feedback', '/performance/feedback', ['performance:personal'], all, 'Continuous coaching and feedback input.'),
  item('performance', 'performance-learning', 'Learning Progress', '/performance/learning-progress', ['performance:personal'], all, 'Required and recommended learning progress.'),
  item('performance', 'performance-contribution', 'Contribution History', '/performance/contribution-history', ['performance:personal'], all, 'Evidence of work and contribution history.'),

  item('governance', 'governance-actions', 'Governance Actions', '/governance/actions', ['governance:assigned'], controlRoles, 'Assigned governance actions and controls follow-up.', 'governanceActions'),
  item('governance', 'governance-evidence', 'Compliance Evidence', '/governance/audit-compliance', ['governance:team'], controlRoles, 'Compliance evidence and audit readiness.'),
  item('governance', 'governance-exceptions', 'Exceptions', '/governance/exceptions', ['governance:team'], controlRoles, 'Governance exceptions and escalation actions.'),
  item('governance', 'governance-risks', 'Risk & Escalations', '/governance/risk-register', ['governance:team'], controlRoles, 'Risk register, escalations, mitigations, and owners.', 'escalations'),

  item('services', 'services-request-console', 'Request Console', '/support/operations', [], controlRoles, 'Operational request console for routed service and support work.'),
  item('services', 'services-fulfilment', 'Fulfilment Queues', '/services/fulfilment-owner-queues', [], controlRoles, 'Fulfilment queues by owner and SLA.', 'requests'),
  item('services', 'services-sla-management', 'SLA Management', '/reports/sla-dashboard', [], controlRoles, 'SLA management, breach exposure, and operational risk.', 'slaRisks'),

  item('reports', 'reports-associate-performance', 'Associate Performance', '/reports/associate-performance', ['reports:personal'], controlRoles, 'Personal and authorised associate performance view.'),
  item('reports', 'reports-team-performance', 'Team Performance', '/reports/team-unit-performance', ['reports:team'], controlRoles, 'Team and unit performance reporting.'),
  item('reports', 'reports-role-performance', 'Role Performance', '/performance/role', ['performance:personal'], controlRoles, 'Role-specific performance indicators.'),
  item('reports', 'reports-platform-health', 'Platform Health', '/reports/platform-health', ['reports:team'], controlRoles, 'Platform health, delivery signals, and operational intelligence.')
];

export function getNavigationItem(route: string) {
  return navigationItems.find((itemConfig) => itemConfig.route === route);
}

export function getDefaultRouteForRole(role: WorkspaceRole) {
  return navigationItems.some((navItem) => navItem.section === 'workspace' && navItem.allowedSegments.includes(role)) ? '/workspace' : '/workspace';
}
