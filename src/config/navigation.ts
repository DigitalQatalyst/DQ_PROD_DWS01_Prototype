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
const adminOnly: WorkspaceRole[] = ['Admin'];
const controlRoles: WorkspaceRole[] = ['Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'HRA', 'Admin', 'Support', 'CEO'];

export const navStages: NavStageConfig[] = [
  { id: 'stage-01', label: 'Marketplace', allowedSegments: all },
  { id: 'stage-02', label: 'Workspaces', allowedSegments: all },
  { id: 'stage-03', label: 'Workspaces', allowedSegments: controlRoles },
  { id: 'stage-04', label: 'Platform', allowedSegments: controlRoles }
];

export const navSections: NavSectionConfig[] = [
  { id: 'marketplace', label: 'DWS Marketplace', icon: 'briefcase', stageId: 'stage-01', route: '/marketplace' },
  { id: 'workspace', label: 'Workspace', icon: 'book', stageId: 'stage-02', route: '/workspace' },
  { id: 'tasks', label: 'Work Management', icon: 'checkSquare', stageId: 'stage-02' },
  { id: 'performance', label: 'Performance', icon: 'gauge', stageId: 'stage-02' },
  { id: 'workflows', label: 'Workflows', icon: 'gitBranch', stageId: 'stage-03', allowedSegments: controlRoles },
  { id: 'trackers', label: 'Trackers', icon: 'database', stageId: 'stage-03', allowedSegments: controlRoles },
  { id: 'services', label: 'Requests & Support', icon: 'cloud', stageId: 'stage-03', allowedSegments: controlRoles },
  { id: 'governance', label: 'Governance', icon: 'shield', stageId: 'stage-04', allowedSegments: controlRoles },
  { id: 'reports', label: 'Analytics', icon: 'pie', stageId: 'stage-04' },
  { id: 'administration', label: 'Platform Admin', icon: 'settings', stageId: 'stage-04', allowedSegments: adminOnly }
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
  // ── Workspace ──────────────────────────────────────────────────────────────
  item('workspace', 'workspace-my-work', 'My Work', '/workspace', ['workspace:personal'], all, 'Personal work summary covering tasks, requests, working sessions, activity, performance, approvals, and blockers.', 'myWork'),
  item('tasks', 'workspace-my-tasks', 'Tasks', '/workspace/my-tasks', ['tasks:personal'], all, 'Tasks assigned to or owned by the active user.', 'tasks'),
  item('workspace', 'workspace-working-sessions', 'Working Sessions', '/workspace/working-sessions', ['workspace:personal'], all, 'Active working sessions, decisions, and follow-up actions.'),
  item('workspace', 'workspace-activity', 'Activity', '/workspace/activity', ['workspace:personal'], all, 'Platform activity, notifications, announcements, mentions, approvals, and recent user events.', 'notifications'),

  item('services', 'workspace-my-requests', 'My Requests', '/workspace/my-requests', ['services:personal'], all, 'Personal service and support requests.', 'requests'),
  item('services', 'services-submit-request', 'Submit Request', '/services/submit-request', ['services:personal'], all, 'Submit a new service or support request.'),
  item('services', 'services-request-status', 'Request Status', '/requests/status', ['services:personal'], all, 'Track request progress, fulfilment status, and next actions.', 'requests'),
  item('services', 'services-service-desk', 'Service Desk', '/support/service-desk', ['services:personal'], all, 'Open the service desk and support operations entry point.'),

  item('workflows', 'workflows-my', 'My Workflows', '/workflows/my-workflows', ['workflows:personal'], controlRoles, 'Workflows assigned to or requiring input from the active user.'),
  item('workflows', 'workflows-pending-approvals', 'Pending Approvals', '/workflows/pending-approvals', ['workflows:personal'], controlRoles, 'Approvals assigned to the active user.', 'approvals'),
  item('workflows', 'workflows-sla-risks', 'SLA Risks', '/workflows/sla-risks', ['workflows:personal'], controlRoles, 'SLA risks affecting assigned work.', 'slaRisks'),

  item('trackers', 'trackers-hub', 'Tracker Hub', '/trackers', ['trackers:personal'], controlRoles, 'Tracker-based operating hub replacing spreadsheet follow-up.'),
  item('trackers', 'trackers-my-items', 'My Tracker Items', '/trackers/my-items', ['trackers:personal'], controlRoles, 'Tracker records assigned to or owned by the active user.', 'trackers'),
  item('trackers', 'trackers-governance-actions', 'Governance Actions', '/trackers/governance-actions', ['trackers:personal'], controlRoles, 'Governance actions managed through tracker operations.', 'governanceActions'),

  item('performance', 'performance-overview', 'My Performance', '/performance/overview', ['performance:personal'], all, 'Personal performance summary and review readiness.'),
  item('performance', 'performance-goals', 'Goals', '/performance/goals', ['performance:personal'], all, 'Personal goals and progress evidence.'),
  item('performance', 'performance-evaluation', 'Evaluation', '/performance/evaluation', ['performance:personal'], all, 'Formal performance evaluation cycle.'),
  item('performance', 'performance-feedback', 'Feedback', '/performance/feedback', ['performance:personal'], all, 'Continuous coaching and feedback input.'),
  item('performance', 'performance-learning', 'Learning Progress', '/performance/learning-progress', ['performance:personal'], all, 'Required and recommended learning progress.'),
  item('performance', 'performance-contribution', 'Contribution History', '/performance/contribution-history', ['performance:personal'], all, 'Evidence of work and contribution history.'),

  item('governance', 'governance-actions', 'Governance Actions', '/governance/actions', ['governance:assigned'], controlRoles, 'Assigned governance actions and controls follow-up.', 'governanceActions'),
  item('governance', 'governance-exceptions', 'Exceptions', '/governance/exceptions', ['governance:team'], controlRoles, 'Governance exceptions and escalation actions.'),
  item('governance', 'governance-evidence', 'Evidence', '/governance/evidence', ['governance:team'], controlRoles, 'Compliance evidence and audit readiness.'),
  item('governance', 'governance-control-reviews', 'Control Reviews', '/governance/control-reviews', ['governance:team'], controlRoles, 'Control review cycles, findings, and follow-up actions.'),
  item('governance', 'governance-risks', 'Risk & Escalations', '/governance/risk-register', ['governance:team'], controlRoles, 'Risk register, escalations, mitigations, and owners.', 'escalations'),

  item('services', 'services-request-console', 'Request Console', '/support/operations', [], controlRoles, 'Operational request console for routed service and support work.'),
  item('services', 'services-fulfilment', 'Fulfilment Queues', '/services/fulfilment-owner-queues', [], controlRoles, 'Fulfilment queues by owner and SLA.', 'requests'),
  item('services', 'services-sla-management', 'SLA Management', '/reports/sla-dashboard', [], controlRoles, 'SLA management, breach exposure, and operational risk.', 'slaRisks'),

  item('reports', 'reports-analytics', 'Analytics', '/analytics', ['reports:personal'], all, 'Reports, KPIs, insights, decision support, performance visibility, and outcome tracking.'),
  item('reports', 'reports-associate-performance', 'Associate Performance', '/reports/associate-performance', ['reports:personal'], controlRoles, 'Personal and authorised associate performance view.'),
  item('reports', 'reports-team-performance', 'Team Performance', '/reports/team-unit-performance', ['reports:team'], controlRoles, 'Team and unit performance reporting.'),
  item('reports', 'reports-role-performance', 'Role Performance', '/performance/role', ['performance:personal'], controlRoles, 'Role-specific performance indicators.'),
  item('reports', 'reports-platform-health', 'Platform Health', '/reports/platform-health', ['reports:team'], controlRoles, 'Platform health, delivery signals, and operational intelligence.'),

  item('administration', 'platform-admin', 'Platform Admin', '/platform-admin', ['admin:full'], adminOnly, 'Platform configuration, users, permissions, roles, workflows, controls, marketplace configuration, and governance setup.')
];

export function getNavigationItem(route: string) {
  return navigationItems.find((itemConfig) => itemConfig.route === route);
}

export function getDefaultRouteForRole(role: WorkspaceRole) {
  return navigationItems.some((navItem) => navItem.section === 'workspace' && navItem.allowedSegments.includes(role)) ? '/workspace' : '/workspace';
}
