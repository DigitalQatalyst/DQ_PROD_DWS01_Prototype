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

export interface NavSectionConfig {
  id: string;
  label: string;
  icon: NavIcon;
}

const all: WorkspaceRole[] = ['Associate', 'Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'HRA', 'Admin', 'Support', 'CEO'];
const nonAssociate: WorkspaceRole[] = ['Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'HRA', 'Admin', 'Support', 'CEO'];
const team: WorkspaceRole[] = ['Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'Admin', 'CEO'];
const unit: WorkspaceRole[] = ['Unit Lead', 'Admin', 'CEO'];
const adminOnly: WorkspaceRole[] = ['Admin'];
const serviceQueue: WorkspaceRole[] = ['HRA', 'Admin', 'Support'];
const executive: WorkspaceRole[] = ['Unit Lead', 'Admin', 'CEO'];

export const navSections: NavSectionConfig[] = [
  { id: 'marketplace', label: 'Marketplace', icon: 'briefcase' },
  { id: 'workspace', label: 'Workspace', icon: 'book' },
  { id: 'tasks', label: 'Tasks', icon: 'checkSquare' },
  { id: 'workflows', label: 'Workflows', icon: 'gitBranch' },
  { id: 'trackers', label: 'Trackers', icon: 'database' },
  { id: 'performance', label: 'Performance', icon: 'gauge' },
  { id: 'governance', label: 'Governance', icon: 'shield' },
  { id: 'knowledge', label: 'Knowledge', icon: 'bookOpen' },
  { id: 'services', label: 'Services & Support', icon: 'cloud' },
  { id: 'people', label: 'People', icon: 'users' },
  { id: 'reports', label: 'Reports & Intelligence', icon: 'pie' },
  { id: 'administration', label: 'Administration', icon: 'settings' }
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
  item('marketplace', 'marketplace-services', 'Service Catalogue', '/marketplaces/services', [], all, 'Discover HRA, IT/access, platform support, knowledge/content, admin, approval, and escalation requests.'),
  item('marketplace', 'marketplace-task-templates', 'Task Template Catalogue', '/marketplaces/task-templates', [], all, 'Select governed task templates with checklist, evidence, SLA, and closure criteria.'),
  item('marketplace', 'marketplace-knowledge', 'Knowledge Discovery', '/marketplaces/knowledge', [], all, 'Find GHC, 6xD, playbooks, templates, learning references, and workspace guides.'),
  item('marketplace', 'marketplace-work-directory', 'Work Directory', '/marketplaces/work-directory', [], all, 'Find teams, owners, experts, fulfilment contacts, and responsibility points.'),
  item('marketplace', 'marketplace-analytics', 'Analytics Discovery', '/marketplaces/analytics', [], all, 'Discover permitted dashboards, SLA views, governance reports, and performance surfaces.'),
  item('marketplace', 'marketplace-feedback', 'Marketplace Feedback', '/marketplaces/feedback', [], all, 'Flag unclear services, missing templates, outdated knowledge, incorrect owners, or broken navigation.'),

  // ── Workspace ──────────────────────────────────────────────────────────────
  item('workspace', 'workspace-my-work', 'My Work', '/workspace/my-work', ['workspace:personal'], all, 'Personal execution cockpit across tasks, requests, approvals, blockers, tracker updates, and working-session follow-ups.', 'myWork'),
  item('workspace', 'workspace-my-requests', 'My Requests', '/workspace/my-requests', ['services:personal'], all, 'Personal service and support requests.', 'requests'),
  item('workspace', 'workspace-working-sessions', 'Working Sessions', '/workspace/working-sessions', ['workspace:personal'], all, 'Active working sessions, decisions, and follow-up actions.'),
  item('workspace', 'workspace-notifications', 'Notifications', '/workspace/notifications', ['workspace:personal'], all, 'Workspace notifications requiring review.', 'notifications'),

  item('tasks', 'tasks-my', 'My Tasks', '/tasks/my-tasks', ['tasks:personal'], all, 'Tasks assigned to or owned by the active user.', 'tasks'),
  item('tasks', 'tasks-all', 'All Tasks', '/tasks/all', ['tasks:all'], nonAssociate, 'Authorised task view across team, unit, support, or executive scope.'),
  item('tasks', 'tasks-create', 'Create Task', '/tasks/create', ['tasks:personal'], all, 'Create a governed DWS task with outcome, owner, evidence, and SLA.'),
  item('tasks', 'tasks-templates', 'Task Templates', '/tasks/templates', ['tasks:personal'], all, 'Reusable task templates and required evidence patterns.'),
  item('tasks', 'tasks-review', 'Task Review', '/tasks/review', ['tasks:review'], nonAssociate, 'Task discipline review queue for authorised scopes.', 'reviews'),
  item('tasks', 'tasks-blocked', 'Blocked Tasks', '/tasks/blocked', ['tasks:personal'], all, 'Blocked and overdue task items requiring action.', 'blocked'),
  item('tasks', 'tasks-closure-quality', 'Closure Quality', '/tasks/closure-quality', ['tasks:personal'], all, 'Closure quality checks and missing evidence.', 'quality'),
  item('tasks', 'tasks-evidence', 'Task Evidence', '/tasks/evidence', ['tasks:personal'], all, 'Evidence queue linked to task outcomes.', 'evidence'),

  item('workflows', 'workflows-my', 'My Workflows', '/workflows/my-workflows', ['workflows:personal'], all, 'Workflows assigned to or requiring input from the active user.', 'workflows'),
  item('workflows', 'workflows-centre', 'Workflow Centre', '/workflows/centre', ['workflows:operate'], nonAssociate, 'Operational workflow centre across authorised work.'),
  item('workflows', 'workflows-pending-approvals', 'Pending Approvals', '/workflows/pending-approvals', ['workflows:personal'], all, 'Approvals assigned to the active user.', 'approvals'),
  item('workflows', 'workflows-approver-queue', 'Approval Queue', '/workflow/approvals', ['workflows:operate'], nonAssociate, 'Review and process governed approvals.', 'approvals'),
  item('workflows', 'workflows-handoffs', 'Handoffs', '/workflows/handoffs', ['workflows:operate'], nonAssociate, 'Workflow handoffs and owner transitions.'),
  item('workflows', 'workflows-escalations', 'Escalations', '/workflows/escalations', ['workflows:operate'], nonAssociate, 'Workflow escalations and risk decisions.', 'escalations'),
  item('workflows', 'workflows-sla-risks', 'SLA Risks', '/workflows/sla-risks', ['workflows:personal'], all, 'SLA risks affecting assigned work.', 'slaRisks'),
  item('workflows', 'workflows-decision-log', 'Decision Log', '/workflows/decision-log', ['workflows:operate'], nonAssociate, 'Workflow decisions, rationale, and owners.'),
  item('workflows', 'workflows-templates', 'Workflow Templates', '/workflows/templates', ['workflows:personal'], all, 'Selectable workflow templates for governed work.'),

  item('trackers', 'trackers-hub', 'Tracker Hub', '/trackers', ['trackers:personal'], all, 'Tracker-based operating hub replacing spreadsheet follow-up.', 'trackers'),
  item('trackers', 'trackers-my-items', 'My Tracker Items', '/trackers/my-items', ['trackers:personal'], all, 'Tracker records assigned to or owned by the active user.'),
  item('trackers', 'trackers-features', 'Features Tracker', '/trackers/features', ['trackers:team'], nonAssociate, 'Feature request and product improvement tracker.'),
  item('trackers', 'trackers-strategic', 'Strategic Initiatives Tracker', '/trackers/strategic-initiatives', ['trackers:strategic'], executive, 'Strategic initiative progress, risks, and next actions.'),
  item('trackers', 'trackers-project-health', 'Project Health Tracker', '/trackers/project-health', ['trackers:team'], team, 'Project health records and risk indicators.'),
  item('trackers', 'trackers-workload', 'Workload Distribution Tracker', '/trackers/workload-distribution', ['trackers:team'], team, 'Owner allocation and workload distribution.'),
  item('trackers', 'trackers-squad-backlog', 'Squad Backlog Tracker', '/trackers/squad-backlog', ['trackers:team'], team, 'Squad backlog items and delivery readiness.'),
  item('trackers', 'trackers-governance-actions', 'Governance Actions Tracker', '/trackers/governance-actions', ['governance:assigned'], all, 'Governance action records and controls follow-up.'),
  item('trackers', 'trackers-templates', 'Tracker Templates', '/trackers/templates', ['trackers:personal'], all, 'Tracker templates, fields, and standard views.'),

  item('performance', 'performance-overview', 'My Performance Overview', '/performance/overview', ['performance:personal'], all, 'Personal performance summary and review readiness.'),
  item('performance', 'performance-goals', 'My Goals', '/performance/goals', ['performance:personal'], all, 'Personal goals and progress evidence.'),
  item('performance', 'performance-evaluation', 'My Evaluation', '/performance/evaluation', ['performance:personal'], all, 'Formal performance evaluation cycle.'),
  item('performance', 'performance-feedback', 'My Feedback', '/performance/feedback', ['performance:personal'], all, 'Continuous coaching and feedback input.'),
  item('performance', 'performance-learning', 'My Learning Progress', '/performance/learning-progress', ['performance:personal'], all, 'Required and recommended learning progress.'),
  item('performance', 'performance-contribution', 'My Contribution History', '/performance/contribution-history', ['performance:personal'], all, 'Evidence of work and contribution history.'),
  item('performance', 'performance-team', 'Team Performance', '/performance/team', ['performance:team'], team, 'Team performance, blockers, review completion, and feedback signals.'),
  item('performance', 'performance-unit', 'Unit Performance', '/performance/unit', ['performance:unit'], unit, 'Unit performance and outcome delivery signals.'),
  item('performance', 'performance-role', 'Role Performance', '/performance/role', ['performance:personal'], all, 'Role-specific performance indicators.'),

  item('governance', 'governance-dashboard', 'Governance Dashboard', '/governance/dashboard', ['governance:executive'], executive, 'Governance health, review cycles, and risk exposure.'),
  item('governance', 'governance-reviews', 'Governance Reviews', '/governance/reviews', ['governance:team'], nonAssociate, 'Governance review queue and notes.'),
  item('governance', 'governance-actions', 'Governance Actions', '/governance/actions', ['governance:assigned'], all, 'Assigned governance actions and controls follow-up.', 'governanceActions'),
  item('governance', 'governance-operating', 'Operating Discipline Review', '/governance/operating-discipline', ['governance:team'], nonAssociate, 'Operating discipline review and evidence hygiene.'),
  item('governance', 'governance-risks', 'Risk Register', '/governance/risk-register', ['governance:team'], nonAssociate, 'Risk register, mitigations, and owners.'),
  item('governance', 'governance-controls', 'Control Library', '/governance/control-library', ['governance:team'], nonAssociate, 'Controls, evidence requirements, and review status.'),
  item('governance', 'governance-audit', 'Audit & Compliance View', '/governance/audit-compliance', ['governance:executive'], executive, 'Audit and compliance visibility.'),
  item('governance', 'governance-change', 'Change Governance', '/governance/change-governance', ['governance:executive'], executive, 'Change governance decisions and approvals.'),
  item('governance', 'governance-exceptions', 'Governance Exceptions', '/governance/exceptions', ['governance:team'], nonAssociate, 'Governance exceptions and escalation actions.'),

  item('knowledge', 'knowledge-hub', 'Knowledge Hub', '/knowledge', ['knowledge:view'], all, 'DWS knowledge hub and recommended operating context.'),
  item('knowledge', 'knowledge-ghc', 'GHC References', '/knowledge/ghc', ['knowledge:view'], all, 'GHC references and governance guidance.'),
  item('knowledge', 'knowledge-6xd', '6xD References', '/knowledge/6xd', ['knowledge:view'], all, '6xD references and delivery standards.'),
  item('knowledge', 'knowledge-playbooks', 'Playbooks & Templates', '/knowledge/playbooks-templates', ['knowledge:view'], all, 'Playbooks, templates, and examples.'),
  item('knowledge', 'knowledge-learning', 'Learning References', '/knowledge/learning-references', ['knowledge:view'], all, 'Learning references linked to performance and work readiness.'),
  item('knowledge', 'knowledge-recommendations', 'Knowledge Recommendations', '/knowledge/recommendations', ['knowledge:view'], all, 'AI-assisted knowledge recommendations.'),
  item('knowledge', 'knowledge-review', 'Content Review Queue', '/knowledge/content-review', ['knowledge:review'], serviceQueue, 'Content review queue and publish decisions.'),
  item('knowledge', 'knowledge-feedback', 'Knowledge Feedback', '/knowledge/feedback', ['knowledge:view'], all, 'Feedback and improvement requests for knowledge content.'),

  item('services', 'services-my-requests', 'My Requests', '/services/my-requests', ['services:personal'], all, 'Requests raised by or assigned to the active user.'),
  item('services', 'services-submit-request', 'Submit Request', '/services/submit-request', ['services:personal'], all, 'Submit a request with category, urgency, expected outcome, and linked work.'),
  item('services', 'services-status', 'Request Status', '/services/request-status', ['services:personal'], all, 'Status tracker for requests and SLA health.'),
  item('services', 'services-hra', 'HRA Requests', '/services/hra-requests', ['services:queue'], ['HRA', 'Admin'], 'HRA onboarding, role transition, and policy request queue.'),
  item('services', 'services-it', 'IT & Access Requests', '/services/it-access', ['services:personal'], all, 'IT, access, and system enablement requests.'),
  item('services', 'services-platform', 'Platform Support', '/services/platform-support', ['services:queue'], ['Support', 'Admin'], 'Platform support queue and triage.'),
  item('services', 'services-knowledge-content', 'Knowledge / Content Requests', '/services/knowledge-content', ['services:queue'], serviceQueue, 'Knowledge and content support requests.'),
  item('services', 'services-task-workflow', 'Task / Workflow Support', '/services/task-workflow-support', ['services:queue'], serviceQueue, 'Task and workflow support queue.'),
  item('services', 'services-admin-requests', 'Admin Requests', '/services/admin-requests', ['admin:full'], adminOnly, 'Platform administration requests.'),
  item('services', 'services-central-queue', 'Central Support Queue', '/services/central-support-queue', ['services:queue'], ['Support', 'Admin'], 'Central support triage and routing.'),
  item('services', 'services-fulfilment', 'Fulfilment Owner Queues', '/services/fulfilment-owner-queues', ['services:queue'], serviceQueue, 'Fulfilment queues by owner and SLA.'),
  item('services', 'services-owner-queue', 'Service Owner Queue', '/service-owner/requests', ['services:queue'], ['HRA', 'Admin', 'Support'], 'Routed service requests for service owner review, action, and fulfilment.'),

  item('people', 'people-directory', 'People Directory', '/people/directory', ['people:view'], all, 'People directory with owners, roles, and contact points.'),
  item('people', 'people-teams', 'Teams', '/people/teams', ['people:view'], all, 'Teams and squad membership.'),
  item('people', 'people-units', 'Units', '/people/units', ['people:view'], all, 'Units, leaders, and delivery scope.'),
  item('people', 'people-owners', 'Owners & Experts', '/people/owners-experts', ['people:view'], all, 'Owner and expert responsibility mapping.'),
  item('people', 'people-service-owners', 'Service Owners', '/people/service-owners', ['people:view'], all, 'Service owner directory.'),
  item('people', 'people-roles', 'Role Directory', '/people/roles', ['people:view'], all, 'Role definitions and contact paths.'),
  item('people', 'people-contact-points', 'Contact Points', '/people/contact-points', ['people:view'], all, 'Primary contact points by domain and service.'),

  item('reports', 'reports-execution', 'Execution Dashboard', '/reports/execution-dashboard', ['reports:team'], nonAssociate, 'Execution dashboard with delivery, blockers, and throughput signals.'),
  item('reports', 'reports-sla', 'SLA Dashboard', '/reports/sla-dashboard', ['reports:team'], nonAssociate, 'SLA dashboard and breach exposure.'),
  item('reports', 'reports-governance', 'Governance Dashboard', '/reports/governance-dashboard', ['reports:executive'], executive, 'Governance reporting and risk exposure.'),
  item('reports', 'reports-associate-performance', 'Associate Performance View', '/reports/associate-performance', ['reports:personal'], all, 'Personal and authorised associate performance view.'),
  item('reports', 'reports-team-unit', 'Team & Unit Performance', '/reports/team-unit-performance', ['reports:team'], team, 'Team and unit performance reporting.'),
  item('reports', 'reports-outcome', 'Outcome Tracking', '/reports/outcome-tracking', ['reports:executive'], executive, 'Outcome tracking and strategic delivery indicators.'),
  item('reports', 'reports-service-signals', 'Service Signals', '/intelligence/service-signals', ['reports:executive'], executive, 'Executive intelligence signals for services.', 'signals'),
  item('reports', 'reports-trackers', 'Tracker Reports', '/reports/tracker-reports', ['reports:team'], nonAssociate, 'Tracker reporting across authorised records.'),
  item('reports', 'reports-ai-status', 'AI Status Reports', '/reports/ai-status-reports', ['reports:team'], nonAssociate, 'AI-generated status reports and summaries.'),
  item('reports', 'reports-audit', 'Audit Reports', '/reports/audit-reports', ['reports:executive'], ['Unit Lead', 'Admin', 'CEO'], 'Audit reports and immutable event views.'),

  item('administration', 'admin-overview', 'Admin Overview', '/admin', ['admin:full'], adminOnly, 'Platform health, open changes, pending approvals, and configuration risks.'),
  item('administration', 'admin-users', 'User & Role Management', '/admin/users-roles', ['admin:full'], adminOnly, 'Users, roles, segments, and permission checkboxes.'),
  item('administration', 'admin-org', 'Organisation / Unit / Team Setup', '/admin/org-setup', ['admin:full'], adminOnly, 'Organisation, units, teams, and ownership setup.'),
  item('administration', 'admin-features', 'Feature Configuration', '/admin/features', ['admin:full'], adminOnly, 'Feature flags and configuration status.'),
  item('administration', 'admin-task-model', 'Task Model Configuration', '/admin/task-model', ['admin:full'], adminOnly, 'Task types, required fields, statuses, and evidence rules.'),
  item('administration', 'admin-trackers', 'Tracker Configuration', '/admin/tracker-configuration', ['admin:full'], adminOnly, 'Tracker templates, views, fields, and automation rules.'),
  item('administration', 'admin-requests', 'Request Category Configuration', '/admin/request-categories', ['admin:full'], adminOnly, 'Request categories, required fields, routing, and SLA.'),
  item('administration', 'admin-workflows', 'Workflow & Approval Rules', '/admin/workflow-approval-rules', ['admin:full'], adminOnly, 'Workflow rule builder and approval policies.'),
  item('administration', 'admin-sla', 'SLA & Notification Rules', '/admin/sla-notification-rules', ['admin:full'], adminOnly, 'SLA thresholds and notification rules.'),
  item('administration', 'admin-knowledge-taxonomy', 'Knowledge Taxonomy', '/admin/knowledge-taxonomy', ['admin:full'], adminOnly, 'Knowledge categories, tags, and review ownership.'),
  item('administration', 'admin-marketplace', 'Marketplace Configuration', '/admin/marketplace-configuration', ['admin:full'], adminOnly, '4D marketplace categories and items configuration.'),
  item('administration', 'admin-integrations', 'Integration Settings', '/admin/integrations', ['admin:full'], adminOnly, 'Microsoft and platform integration settings.'),
  item('administration', 'admin-ai', 'AI / Automation Settings', '/admin/ai-automation', ['admin:full'], adminOnly, 'AI guardrails, automation toggles, and review controls.'),
  item('administration', 'admin-audit', 'Audit Logs', '/admin/audit-logs', ['admin:full'], adminOnly, 'Immutable-looking platform audit log.'),
  item('administration', 'admin-system', 'System Settings', '/admin/system-settings', ['admin:full'], adminOnly, 'Platform labels, defaults, and system settings.')
];

export function getNavigationItem(route: string) {
  return navigationItems.find((itemConfig) => itemConfig.route === route);
}

export function getDefaultRouteForRole(role: WorkspaceRole) {
  return navigationItems.some((navItem) => navItem.section === 'workspace' && navItem.allowedSegments.includes(role)) ? '/workspace' : '/workspace/my-work';
}
