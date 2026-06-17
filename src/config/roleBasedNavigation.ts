/**
 * Role-Based Navigation Registry
 * 
 * Central navigation configuration with role visibility metadata.
 * This single registry drives all role-specific sidebars.
 */

import {
  Activity,
  BarChart3,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Gauge,
  Handshake,
  HelpCircle,
  Inbox,
  LibraryBig,
  Kanban,
  LayoutTemplate,
  LineChart,
  ListChecks,
  PieChart,
  Route,
  ShieldCheck,
  Siren,
  Star,
  Store,
  Target,
  TimerReset,
  TrendingUp,
  UploadCloud,
  Users,
  Workflow,
  LogOut,
} from 'lucide-react';
import type { NavItem } from '../types/navigation';
import type { DwsRole } from '../types/roles';
import { ALL_ROLES } from '../types/roles';
import { MARKETPLACE_4D_DESTINATIONS } from './marketplace4dRoutes';

/**
 * ORIENTATION — Getting Started · Quick Links (accordion group → feature, same shape as Tasks).
 */
export const orientationFeatureArea: NavItem = {
  id: 'orientation',
  label: 'ORIENTATION',
  route: '/orientation',
  flag: 'orientation.enabled',
  visibleTo: ALL_ROLES,
  children: [
    {
      id: 'home',
      label: 'Home',
      route: '/home',
      icon: Compass,
      flag: 'orientation.home',
      visibleTo: ALL_ROLES,
    },
    {
      id: 'dashboard',
      label: 'MyDashboard',
      route: '/dashboard',
      icon: Gauge,
      flag: 'orientation.myDashboard',
      visibleTo: ALL_ROLES,
    },
    {
      id: 'my-work',
      label: 'My Work',
      route: '/tasks/my-work',
      icon: ClipboardCheck,
      flag: 'orientation.myWork',
      visibleTo: ALL_ROLES,
    },
  ],
};

/**
 * MARKETPLACE — Catalogue · Transaction · Collaboration (features on hub pages only).
 */
export const marketplaceFeatureArea: NavItem = {
  id: 'marketplace',
  label: 'MARKETPLACE',
  route: '/marketplace',
  flag: 'marketplace.enabled',
  visibleTo: ALL_ROLES,
  children: [
    {
      id: 'catalogue',
      label: 'Catalogue',
      route: '/marketplace/catalogue',
      icon: LibraryBig,
      flag: 'marketplace.catalogue',
      visibleTo: ALL_ROLES,
      children: [
        { id: 'discern', label: 'Discern', route: MARKETPLACE_4D_DESTINATIONS.discern, flag: 'marketplace.discern', visibleTo: ALL_ROLES },
        { id: 'design', label: 'Design', route: MARKETPLACE_4D_DESTINATIONS.design, flag: 'marketplace.design', visibleTo: ALL_ROLES },
        { id: 'deploy', label: 'Deploy', route: MARKETPLACE_4D_DESTINATIONS.deploy, flag: 'marketplace.deploy', visibleTo: ALL_ROLES },
        { id: 'drive', label: 'Drive', route: MARKETPLACE_4D_DESTINATIONS.drive, flag: 'marketplace.drive', visibleTo: ALL_ROLES },
      ],
    },
  ],
};

/**
 * UTILITY - visible to all roles
 */
export const utilityNav: NavItem[] = [
  {
    id: 'help-support',
    label: 'Help / Support',
    route: '/help-support',
    icon: HelpCircle,
    visibleTo: ALL_ROLES,
  },
  {
    id: 'logout',
    label: 'Logout',
    route: '/logout',
    icon: LogOut,
    visibleTo: ALL_ROLES,
  },
];

/**
 * FEATURE AREAS - role-based navigation
 */

// TASKS Feature Area
export const tasksFeatureArea: NavItem = {
  id: 'tasks',
  label: 'TASKS',
  route: '/tasks',
  flag: 'tasks.enabled',
  visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
  children: [
    {
      id: 'my-work',
      label: 'My Work',
      route: '/tasks/my-work',
      icon: ClipboardCheck,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'assigned-tasks', label: 'Assigned Tasks', route: '/tasks/my-work/assigned-tasks' },
        { id: 'my-due-actions', label: 'My Due Actions', route: '/tasks/my-work/my-due-actions' },
        { id: 'my-updates', label: 'My Updates', route: '/tasks/my-work/my-updates' },
        { id: 'my-blockers', label: 'My Blockers', route: '/tasks/my-work/my-blockers' },
        { id: 'my-working-sessions', label: 'My Working Sessions', route: '/tasks/my-work/my-working-sessions' },
      ],
    },
    {
      id: 'task-board',
      label: 'Task Board',
      route: '/tasks/task-board',
      icon: Kanban,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'kanban-view', label: 'Kanban View', route: '/tasks/task-board/kanban-view' },
        { id: 'list-view', label: 'List View', route: '/tasks/task-board/list-view' },
        { id: 'calendar-view', label: 'Calendar View', route: '/tasks/task-board/calendar-view' },
        { id: 'priority-view', label: 'Priority View', route: '/tasks/task-board/priority-view' },
        { id: 'team-task-view', label: 'Team Task View', route: '/tasks/task-board/team-task-view', visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
      ],
    },
    {
      id: 'task-creation-templates',
      label: 'Task Creation & Templates',
      route: '/tasks/task-creation-templates',
      icon: LayoutTemplate,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "PlatformAdmin"],
      children: [
        { id: 'create-task', label: 'Create Task', route: '/tasks/task-creation-templates/create-task' },
        { id: 'select-task-template', label: 'Select Task Template', route: '/tasks/task-creation-templates/select-task-template' },
        { id: 'define-purpose-output', label: 'Define Purpose & Output', route: '/tasks/task-creation-templates/define-purpose-output' },
        { id: 'assign-owner-contributors', label: 'Assign Owner / Contributors', route: '/tasks/task-creation-templates/assign-owner-contributors' },
        { id: 'set-sla-due-date', label: 'Set SLA / Due Date', route: '/tasks/task-creation-templates/set-sla-due-date' },
      ],
    },
    {
      id: 'task-updates-evidence',
      label: 'Task Updates & Evidence',
      route: '/tasks/task-updates-evidence',
      icon: UploadCloud,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'progress-update', label: 'Progress Update', route: '/tasks/task-updates-evidence/progress-update' },
        { id: 'evidence-upload-link', label: 'Evidence Upload / Link', route: '/tasks/task-updates-evidence/evidence-upload-link' },
        { id: 'comment-thread', label: 'Comment Thread', route: '/tasks/task-updates-evidence/comment-thread' },
        { id: 'blocker-update', label: 'Blocker Update', route: '/tasks/task-updates-evidence/blocker-update' },
        { id: 'task-history-timeline', label: 'Task History Timeline', route: '/tasks/task-updates-evidence/task-history-timeline' },
      ],
    },
    {
      id: 'closure-reviews',
      label: 'Closure Reviews',
      route: '/tasks/closure-reviews',
      icon: BadgeCheck,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'request-closure-review', label: 'Request Closure Review', route: '/tasks/closure-reviews/request-closure-review', visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
        { id: 'closure-checklist', label: 'Closure Checklist', route: '/tasks/closure-reviews/closure-checklist', visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
        { id: 'evidence-review', label: 'Evidence Review', route: '/tasks/closure-reviews/evidence-review', visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
        { id: 'return-for-rework', label: 'Return for Rework', route: '/tasks/closure-reviews/return-for-rework', visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
        { id: 'close-task', label: 'Close Task', route: '/tasks/closure-reviews/close-task', visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
      ],
    },
  ],
};

// SERVICES Feature Area
export const servicesFeatureArea: NavItem = {
  id: 'services',
  label: 'SERVICES',
  route: '/services',
  flag: 'services.enabled',
  visibleTo: ALL_ROLES,
  children: [
    {
      id: 'service-hub',
      label: 'Service Hub',
      route: '/services/service-hub',
      icon: Store,
      flag: 'services.serviceHub',
      visibleTo: ALL_ROLES,
    },
    {
      id: 'request-queues',
      label: 'Request Queues',
      route: '/services/fulfilment-queues',
      icon: Inbox,
      flag: 'services.requestQueues',
      visibleTo: ALL_ROLES,
    },
    {
      id: 'request-case-management',
      label: 'Request Case Management',
      route: '/support/operations',
      icon: ClipboardCheck,
      flag: 'services.requestCaseManagement',
      visibleTo: ALL_ROLES,
    },
    {
      id: 'sla-escalations',
      label: 'SLA & Escalations',
      route: '/reports/sla-dashboard',
      icon: TimerReset,
      flag: 'services.slaEscalations',
      visibleTo: ALL_ROLES,
    },
    {
      id: 'service-closure-feedback',
      label: 'Service Closure & Feedback',
      route: '/services/service-closure-feedback',
      icon: Star,
      flag: 'services.serviceClosureFeedback',
      visibleTo: ALL_ROLES,
    },
  ],
};

// TRACKER Feature Area
export const trackerFeatureArea: NavItem = {
  id: 'tracker',
  label: 'TRACKERS',
  route: '/tracker',
  flag: 'trackers.enabled',
  visibleTo: ALL_ROLES,
  children: [
    {
      id: 'tracker-hub',
      label: 'Tracker Hub',
      route: '/tracker/tracker-hub',
      icon: Gauge,
      flag: 'trackers.trackerHub',
      visibleTo: ALL_ROLES,
    },
  ],
};

// WORKFLOWS Feature Area
export const workflowsFeatureArea: NavItem = {
  id: 'workflows',
  label: 'WORKFLOWS',
  route: '/workflows',
  flag: 'workflows.enabled',
  visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
  children: [
    {
      id: 'workflow-centre',
      label: 'Workflow Centre',
      route: '/workflows/workflow-centre',
      icon: Workflow,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'active-workflows', label: 'Active Workflows', route: '/workflows/workflow-centre/active-workflows' },
        { id: 'pending-workflows', label: 'Pending Workflows', route: '/workflows/workflow-centre/pending-workflows' },
        { id: 'workflow-detail-view', label: 'Workflow Detail View', route: '/workflows/workflow-centre/workflow-detail-view' },
        { id: 'workflow-timeline', label: 'Workflow Timeline', route: '/workflows/workflow-centre/workflow-timeline' },
        { id: 'workflow-exceptions', label: 'Workflow Exceptions', route: '/workflows/workflow-centre/workflow-exceptions' },
      ],
    },
    {
      id: 'workflow-inbox',
      label: 'Workflow Inbox',
      route: '/workflows/workflow-inbox',
      icon: Inbox,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'my-pending-actions', label: 'My Pending Actions', route: '/workflows/workflow-inbox/my-pending-actions' },
        { id: 'assigned-workflow-steps', label: 'Assigned Workflow Steps', route: '/workflows/workflow-inbox/assigned-workflow-steps' },
        { id: 'review-required', label: 'Review Required', route: '/workflows/workflow-inbox/review-required' },
        { id: 'information-required', label: 'Information Required', route: '/workflows/workflow-inbox/information-required' },
        { id: 'returned-items', label: 'Returned Items', route: '/workflows/workflow-inbox/returned-items' },
      ],
    },
    {
      id: 'handoffs-management',
      label: 'Handoffs Management',
      route: '/workflows/handoffs-management',
      icon: Handshake,
      visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'handoff-queue', label: 'Handoff Queue', route: '/workflows/handoffs-management/handoff-queue' },
        { id: 'handoff-detail', label: 'Handoff Detail', route: '/workflows/handoffs-management/handoff-detail' },
        { id: 'assign-next-owner', label: 'Assign Next Owner', route: '/workflows/handoffs-management/assign-next-owner' },
        { id: 'handoff-notes', label: 'Handoff Notes', route: '/workflows/handoffs-management/handoff-notes' },
        { id: 'handoff-completion', label: 'Handoff Completion', route: '/workflows/handoffs-management/handoff-completion' },
      ],
    },
    {
      id: 'workflow-routing-state-control',
      label: 'Workflow Routing & State Control',
      route: '/workflows/workflow-routing-state-control',
      icon: Route,
      visibleTo: ["PlatformAdmin"],
      children: [
        { id: 'state-transitions', label: 'State Transitions', route: '/workflows/workflow-routing-state-control/state-transitions' },
        { id: 'routing-rules', label: 'Routing Rules', route: '/workflows/workflow-routing-state-control/routing-rules' },
        { id: 'queue-assignment', label: 'Queue Assignment', route: '/workflows/workflow-routing-state-control/queue-assignment' },
        { id: 'sla-timer-trigger', label: 'SLA Timer Trigger', route: '/workflows/workflow-routing-state-control/sla-timer-trigger' },
        { id: 'exception-routing', label: 'Exception Routing', route: '/workflows/workflow-routing-state-control/exception-routing' },
      ],
    },
    {
      id: 'workflow-templates',
      label: 'Workflow Templates',
      route: '/workflows/workflow-templates',
      icon: LayoutTemplate,
      visibleTo: ["PlatformAdmin"],
      children: [
        { id: 'workflow-template-library', label: 'Workflow Template Library', route: '/workflows/workflow-templates/workflow-template-library' },
        { id: 'template-detail', label: 'Template Detail', route: '/workflows/workflow-templates/template-detail' },
        { id: 'approval-path-setup', label: 'Approval Path Setup', route: '/workflows/workflow-templates/approval-path-setup' },
        { id: 'step-configuration', label: 'Step Configuration', route: '/workflows/workflow-templates/step-configuration' },
        { id: 'workflow-preview', label: 'Workflow Preview', route: '/workflows/workflow-templates/workflow-preview' },
      ],
    },
  ],
};

// PERFORMANCE Feature Area
export const performanceFeatureArea: NavItem = {
  id: 'performance',
  label: 'PERFORMANCE',
  route: '/performance',
  flag: 'performance.enabled',
  visibleTo: ALL_ROLES,
  children: [
    {
      id: 'my-performance-snapshot',
      label: 'My Performance Snapshot',
      route: '/performance/my-performance-snapshot',
      icon: Activity,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "PlatformAdmin"],
      children: [
        { id: 'my-completion-rate', label: 'My Completion Rate', route: '/performance/my-performance-snapshot/my-completion-rate' },
        { id: 'my-sla-performance', label: 'My SLA Performance', route: '/performance/my-performance-snapshot/my-sla-performance' },
        { id: 'my-quality-score', label: 'My Quality Score', route: '/performance/my-performance-snapshot/my-quality-score' },
        { id: 'my-evidence-health', label: 'My Evidence Health', route: '/performance/my-performance-snapshot/my-evidence-health' },
      ],
    },
    {
      id: 'team-performance',
      label: 'Team Performance',
      route: '/performance/team-performance',
      icon: Users,
      visibleTo: ["Lead", "ServiceOwner", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'team-completion-rate', label: 'Team Completion Rate', route: '/performance/team-performance/team-completion-rate' },
        { id: 'team-sla-adherence', label: 'Team SLA Adherence', route: '/performance/team-performance/team-sla-adherence' },
        { id: 'team-quality-metrics', label: 'Team Quality Metrics', route: '/performance/team-performance/team-quality-metrics' },
        { id: 'team-workload-balance', label: 'Team Workload Balance', route: '/performance/team-performance/team-workload-balance' },
      ],
    },
    {
      id: 'unit-performance',
      label: 'Unit Performance',
      route: '/performance/unit-performance',
      icon: Building2,
      visibleTo: ["Lead", "GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'unit-execution-health', label: 'Unit Execution Health', route: '/performance/unit-performance/unit-execution-health' },
        { id: 'unit-sla-trends', label: 'Unit SLA Trends', route: '/performance/unit-performance/unit-sla-trends' },
        { id: 'unit-capacity-utilisation', label: 'Unit Capacity Utilisation', route: '/performance/unit-performance/unit-capacity-utilisation' },
        { id: 'unit-outcome-contribution', label: 'Unit Outcome Contribution', route: '/performance/unit-performance/unit-outcome-contribution' },
      ],
    },
    {
      id: 'sla-closure-quality-performance',
      label: 'SLA & Closure Quality Performance',
      route: '/performance/sla-closure-quality-performance',
      icon: TimerReset,
      visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'sla-breach-analysis', label: 'SLA Breach Analysis', route: '/performance/sla-closure-quality-performance/sla-breach-analysis' },
        { id: 'closure-quality-score', label: 'Closure Quality Score', route: '/performance/sla-closure-quality-performance/closure-quality-score' },
        { id: 'evidence-completeness', label: 'Evidence Completeness', route: '/performance/sla-closure-quality-performance/evidence-completeness' },
        { id: 'rework-rate', label: 'Rework Rate', route: '/performance/sla-closure-quality-performance/rework-rate' },
      ],
    },
    {
      id: 'outcome-performance',
      label: 'Outcome Performance',
      route: '/performance/outcome-performance',
      icon: Target,
      visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'outcome-delivery-status', label: 'Outcome Delivery Status', route: '/performance/outcome-performance/outcome-delivery-status' },
        { id: 'value-realisation-tracking', label: 'Value Realisation Tracking', route: '/performance/outcome-performance/value-realisation-tracking' },
        { id: 'initiative-contribution', label: 'Initiative Contribution', route: '/performance/outcome-performance/initiative-contribution' },
        { id: 'outcome-evidence-quality', label: 'Outcome Evidence Quality', route: '/performance/outcome-performance/outcome-evidence-quality' },
      ],
    },
  ],
};

// ANALYTICS Feature Area
export const analyticsFeatureArea: NavItem = {
  id: 'analytics',
  label: 'ANALYTICS',
  route: '/analytics',
  flag: 'advancedAnalyticsWorkspace.enabled',
  visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "Leadership", "PlatformAdmin"],
  children: [
    {
      id: 'execution-analytics',
      label: 'Execution Analytics',
      route: '/analytics/execution-analytics',
      icon: BarChart3,
      visibleTo: ["Lead", "ServiceOwner", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'execution-overview', label: 'Execution Dashboard', route: '/analytics/execution-analytics/execution-overview' },
        { id: 'bottleneck-detection', label: 'Bottleneck Detection', route: '/analytics/execution-analytics/bottleneck-detection' },
        { id: 'cycle-time-analysis', label: 'Cycle Time Analysis', route: '/analytics/execution-analytics/cycle-time-analysis' },
        { id: 'execution-trends', label: 'Execution Trends', route: '/analytics/execution-analytics/execution-trends' },
      ],
    },
    {
      id: 'sla-analytics',
      label: 'SLA Analytics',
      route: '/analytics/sla-analytics',
      icon: LineChart,
      visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'sla-breach-patterns', label: 'SLA Breach Patterns', route: '/analytics/sla-analytics/sla-breach-patterns' },
        { id: 'first-response-time', label: 'First Response Time', route: '/analytics/sla-analytics/first-response-time' },
        { id: 'resolution-time-trends', label: 'Resolution Time Trends', route: '/analytics/sla-analytics/resolution-time-trends' },
        { id: 'sla-predictive-view', label: 'SLA Predictive View', route: '/analytics/sla-analytics/sla-predictive-view' },
      ],
    },
    {
      id: 'workload-capacity-analytics',
      label: 'Workload & Capacity Analytics',
      route: '/analytics/workload-capacity-analytics',
      icon: PieChart,
      visibleTo: ["Lead", "ServiceOwner", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'capacity-pressure-view', label: 'Capacity Pressure View', route: '/analytics/workload-capacity-analytics/capacity-pressure-view' },
        { id: 'queue-volume-trends', label: 'Queue Volume Trends', route: '/analytics/workload-capacity-analytics/queue-volume-trends' },
        { id: 'owner-load-balance', label: 'Owner Load Balance', route: '/analytics/workload-capacity-analytics/owner-load-balance' },
        { id: 'demand-forecast', label: 'Demand Forecast', route: '/analytics/workload-capacity-analytics/demand-forecast' },
      ],
    },
    {
      id: 'governance-analytics',
      label: 'Governance Analytics',
      route: '/analytics/governance-analytics',
      icon: ShieldCheck,
      visibleTo: ["GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'approval-cycle-time', label: 'Approval Cycle Time', route: '/analytics/governance-analytics/approval-cycle-time' },
        { id: 'escalation-trends', label: 'Escalation Trends', route: '/analytics/governance-analytics/escalation-trends' },
        { id: 'evidence-quality-trends', label: 'Evidence Quality Trends', route: '/analytics/governance-analytics/evidence-quality-trends' },
        { id: 'compliance-coverage', label: 'Compliance Coverage', route: '/analytics/governance-analytics/compliance-coverage' },
      ],
    },
    {
      id: 'outcome-value-analytics',
      label: 'Outcome & Value Analytics',
      route: '/analytics/outcome-value-analytics',
      icon: TrendingUp,
      visibleTo: ["Lead", "GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'outcome-attribution-analysis', label: 'Outcome Attribution Analysis', route: '/analytics/outcome-value-analytics/outcome-attribution-analysis' },
        { id: 'value-realisation-metrics', label: 'Value Realisation Metrics', route: '/analytics/outcome-value-analytics/value-realisation-metrics' },
        { id: 'initiative-impact', label: 'Initiative Impact', route: '/analytics/outcome-value-analytics/initiative-impact' },
        { id: 'benefit-tracking', label: 'Benefit Tracking', route: '/analytics/outcome-value-analytics/benefit-tracking' },
      ],
    },
  ],
};

// GOVERNANCE Feature Area
export const governanceFeatureArea: NavItem = {
  id: 'governance',
  label: 'GOVERNANCE',
  route: '/governance',
  flag: 'governance.enabled',
  visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "Leadership", "PlatformAdmin"],
  children: [
    {
      id: 'approvals-management',
      label: 'Approvals Management',
      route: '/governance/approvals-management',
      icon: CheckCircle2,
      visibleTo: ["Lead", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'my-pending-approvals', label: 'My Pending Approvals', route: '/governance/approvals-management/my-pending-approvals' },
        { id: 'approval-queue', label: 'Approval Queue', route: '/governance/approvals-management/approval-queue' },
        { id: 'approval-decision-panel', label: 'Approval Decision Panel', route: '/governance/approvals-management/approval-decision-panel' },
        { id: 'delegated-approvals', label: 'Delegated Approvals', route: '/governance/approvals-management/delegated-approvals' },
        { id: 'approval-history', label: 'Approval History', route: '/governance/approvals-management/approval-history' },
      ],
    },
    {
      id: 'escalation-management',
      label: 'Escalation Management',
      route: '/governance/escalation-management',
      icon: Siren,
      visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'escalation-queue', label: 'Escalation Queue', route: '/governance/escalation-management/escalation-queue' },
        { id: 'severity-assignment', label: 'Severity Assignment', route: '/governance/escalation-management/severity-assignment' },
        { id: 'escalation-owner-assignment', label: 'Escalation Owner Assignment', route: '/governance/escalation-management/escalation-owner-assignment' },
        { id: 'resolution-tracking', label: 'Resolution Tracking', route: '/governance/escalation-management/resolution-tracking' },
        { id: 'escalation-outcomes', label: 'Escalation Outcomes', route: '/governance/escalation-management/escalation-outcomes' },
      ],
    },
    {
      id: 'audit-compliance-control',
      label: 'Audit & Compliance Control',
      route: '/governance/audit-compliance-control',
      icon: ShieldCheck,
      visibleTo: ["GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'audit-log', label: 'Audit Log', route: '/governance/audit-compliance-control/audit-log', visibleTo: ["GovernanceLead", "PlatformAdmin"] },
        { id: 'evidence-trail', label: 'Evidence Trail', route: '/governance/audit-compliance-control/evidence-trail' },
        { id: 'compliance-view', label: 'Compliance View', route: '/governance/audit-compliance-control/compliance-view' },
        { id: 'activity-history', label: 'Activity History', route: '/governance/audit-compliance-control/activity-history', visibleTo: ["GovernanceLead", "PlatformAdmin"] },
        { id: 'access-history', label: 'Access History', route: '/governance/audit-compliance-control/access-history', visibleTo: ["GovernanceLead", "PlatformAdmin"] },
      ],
    },
    {
      id: 'governance-review',
      label: 'Governance Review',
      route: '/governance/governance-review',
      icon: ClipboardCheck,
      visibleTo: ["GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'governance-review-workspace', label: 'Governance Review Workspace', route: '/governance/governance-review/governance-review-workspace' },
        { id: 'evidence-quality-review', label: 'Evidence Quality Review', route: '/governance/governance-review/evidence-quality-review' },
        { id: 'control-review', label: 'Control Review', route: '/governance/governance-review/control-review' },
        { id: 'finding-management', label: 'Finding Management', route: '/governance/governance-review/finding-management' },
        { id: 'governance-reporting', label: 'Governance Reporting', route: '/governance/governance-review/governance-reporting' },
      ],
    },
    {
      id: 'operating-discipline-review',
      label: 'Operating Discipline Review',
      route: '/governance/operating-discipline-review',
      icon: ListChecks,
      visibleTo: ["Lead", "GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'discipline-indicators', label: 'Discipline Indicators', route: '/governance/operating-discipline-review/discipline-indicators' },
        { id: 'missed-update-patterns', label: 'Missed Update Patterns', route: '/governance/operating-discipline-review/missed-update-patterns' },
        { id: 'quality-exceptions', label: 'Quality Exceptions', route: '/governance/operating-discipline-review/quality-exceptions' },
        { id: 'action-plan-tracking', label: 'Action Plan Tracking', route: '/governance/operating-discipline-review/action-plan-tracking' },
        { id: 'discipline-improvement', label: 'Discipline Improvement', route: '/governance/operating-discipline-review/discipline-improvement' },
      ],
    },
  ],
};

// ADMINISTRATION Feature Area
export const administrationFeatureArea: NavItem = {
  id: 'administration',
  label: 'PLATFORM ADMIN',
  route: '/platform-admin',
  flag: 'platformAdmin.enabled',
  visibleTo: ["PlatformAdmin"],
  children: [
    {
      id: 'content-management',
      label: 'Content Management',
      route: '/platform-admin',
      icon: LibraryBig,
      flag: 'platformAdmin.contentManagement',
      visibleTo: ["PlatformAdmin"],
    },
  ],
};

/**
 * All feature areas in sidebar order
 */
export const featureAreas: NavItem[] = [
  tasksFeatureArea,
  servicesFeatureArea,
  trackerFeatureArea,
  workflowsFeatureArea,
  performanceFeatureArea,
  analyticsFeatureArea,
  governanceFeatureArea,
  administrationFeatureArea,
];

/**
 * Filter navigation items by role
 * 
 * Recursively filters navigation based on active role:
 * - If item has no visibleTo, it's visible to all roles
 * - If item has visibleTo, check if role is included
 * - If parent has visibleTo, children inherit unless they define their own
 * - Hide items with no visible children
 * - Hide feature groups with no visible features
 * - Hide feature areas with no visible feature groups
 */
export function filterNavByRole(items: NavItem[], role: DwsRole): NavItem[] {
  return items
    .map((item) => {
      // Check if item is visible to this role
      const itemVisible = !item.visibleTo || item.visibleTo.includes(role);

      // Recursively filter children
      const filteredChildren = item.children
        ? filterNavByRole(item.children, role)
        : undefined;

      // Check if there are visible children
      const hasVisibleChildren =
        filteredChildren && filteredChildren.length > 0;

      // Hide if item is not visible and has no visible children
      if (!itemVisible && !hasVisibleChildren) return null;

      // Hide if item has children but none are visible (Feature Group/Area with no visible children)
      if (item.children && !hasVisibleChildren) return null;

      // Return item with filtered children
      return {
        ...item,
        children: filteredChildren,
      };
    })
    .filter(Boolean) as NavItem[];
}

/**
 * Check if a route is accessible by a role
 * 
 * Searches through all navigation items to find matching route
 * and checks if role has access
 */
export function hasRouteAccess(route: string, role: DwsRole, navItems: NavItem[]): boolean {
  for (const item of navItems) {
    // Check if this item matches the route
    if (item.route === route) {
      return !item.visibleTo || item.visibleTo.includes(role);
    }

    // Recursively check children
    if (item.children) {
      const childAccess = hasRouteAccess(route, role, item.children);
      if (childAccess !== null) return childAccess;
    }
  }

  // Route not found in navigation - allow by default (for non-sidebar routes)
  return true;
}
