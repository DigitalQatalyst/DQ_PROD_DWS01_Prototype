/**
 * Role-Based Navigation Registry
 * 
 * Central navigation configuration with role visibility metadata.
 * This single registry drives all role-specific sidebars.
 */

import {
  Activity,
  AlertTriangle,
  BarChart3,
  BadgeCheck,
  Boxes,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Gauge,
  Handshake,
  HelpCircle,
  Inbox,
  LibraryBig,
  Link2,
  Receipt,
  Kanban,
  LayoutTemplate,
  LineChart,
  ListChecks,
  ListOrdered,
  Network,
  PieChart,
  PlugZap,
  Route,
  SearchCheck,
  Send,
  Settings2,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Star,
  Store,
  Target,
  TimerReset,
  TrendingUp,
  UploadCloud,
  Users,
  UsersRound,
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
  visibleTo: ALL_ROLES,
  children: [
    {
      id: 'getting-started',
      label: 'Getting Started',
      route: '/orientation/getting-started',
      icon: Compass,
      visibleTo: ALL_ROLES,
      children: [
        { id: 'home', label: 'Home', route: '/home', visibleTo: ALL_ROLES },
      ],
    },
    {
      id: 'quick-links',
      label: 'Quick Links',
      route: '/orientation/quick-links',
      icon: Link2,
      visibleTo: ALL_ROLES,
      children: [
        { id: 'dashboard', label: 'My Dashboard', route: '/dashboard', visibleTo: ALL_ROLES },
        { id: 'my-work', label: 'My Work', route: '/tasks/my-work', visibleTo: ALL_ROLES },
        { id: 'ai-cockpit', label: 'AI Cockpit', route: '/ai-cockpit', visibleTo: ALL_ROLES },
      ],
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
  visibleTo: ALL_ROLES,
  children: [
    {
      id: 'catalogue',
      label: 'Catalogue',
      route: '/marketplace/catalogue',
      icon: LibraryBig,
      visibleTo: ALL_ROLES,
      children: [
        { id: 'discern', label: 'Discern', route: MARKETPLACE_4D_DESTINATIONS.discern, visibleTo: ALL_ROLES },
        { id: 'design', label: 'Design', route: MARKETPLACE_4D_DESTINATIONS.design, visibleTo: ALL_ROLES },
        { id: 'deploy', label: 'Deploy', route: MARKETPLACE_4D_DESTINATIONS.deploy, visibleTo: ALL_ROLES },
        { id: 'drive', label: 'Drive', route: MARKETPLACE_4D_DESTINATIONS.drive, visibleTo: ALL_ROLES },
      ],
    },
    {
      id: 'transaction',
      label: 'Transaction',
      route: '/marketplace/transaction',
      icon: Receipt,
      visibleTo: ALL_ROLES,
      children: [
        { id: 'my-requests', label: 'My Requests', route: '/workspace/my-requests', visibleTo: ALL_ROLES },
        { id: 'submitted-requests', label: 'Submitted Requests', route: '/tracker/request-status-tracker/submitted-requests', visibleTo: ALL_ROLES },
        { id: 'request-drafts', label: 'Request Drafts', route: '/tracker/request-status-tracker/request-drafts', visibleTo: ALL_ROLES },
        { id: 'request-status', label: 'Request Status', route: '/tracker/request-status-tracker/request-status', visibleTo: ALL_ROLES },
        { id: 'pending-information', label: 'Pending Information', route: '/tracker/request-status-tracker/pending-information', visibleTo: ALL_ROLES },
        { id: 'request-closure', label: 'Request Closure Status', route: '/tracker/request-status-tracker/request-closure-status', visibleTo: ALL_ROLES },
        { id: 'service-requests', label: 'Service Requests', route: '/marketplace/services?from=transaction', visibleTo: ALL_ROLES },
        { id: 'task-requests', label: 'Task Requests', route: '/marketplace/task-library?from=transaction', visibleTo: ALL_ROLES },
      ],
    },
    {
      id: 'collaboration',
      label: 'Collaboration',
      route: '/marketplace/collaboration',
      icon: Handshake,
      visibleTo: ALL_ROLES,
      children: [
        { id: 'work-directory', label: 'Work Directory', route: '/marketplace/work-directory', visibleTo: ALL_ROLES },
        { id: 'working-sessions', label: 'Working Sessions', route: '/workspace/working-sessions', visibleTo: ALL_ROLES },
        { id: 'marketplace-feedback', label: 'Marketplace Feedback', route: '/marketplace/feedback', visibleTo: ALL_ROLES },
        { id: 'knowledge-sharing', label: 'Knowledge Sharing', route: '/marketplace/knowledge-discovery?from=collaboration', visibleTo: ALL_ROLES },
        { id: 'team-ownership', label: 'Team & Ownership', route: '/marketplace/work-directory?from=collaboration', visibleTo: ALL_ROLES },
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
  visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
  children: [
    {
      id: 'service-hub',
      label: 'Service Hub',
      route: '/services/service-hub',
      icon: Store,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'service-overview', label: 'Service Overview', route: '/services/service-hub/service-overview' },
        { id: 'featured-services', label: 'Featured Services', route: '/services/service-hub/featured-services' },
        { id: 'recently-used-services', label: 'Recently Used Services', route: '/services/service-hub/recently-used-services' },
        { id: 'service-categories', label: 'Service Categories', route: '/services/service-hub/service-categories' },
        { id: 'service-guidance', label: 'Service Guidance', route: '/services/service-hub/service-guidance' },
      ],
    },
    {
      id: 'service-catalogue',
      label: 'Service Catalogue',
      route: '/services/service-catalogue',
      icon: LibraryBig,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "PlatformAdmin"],
      children: [
        { id: 'hra-requests', label: 'HRA Requests', route: '/services/service-catalogue/hra-requests' },
        { id: 'it-access-requests', label: 'IT & Access Requests', route: '/services/service-catalogue/it-access-requests' },
        { id: 'platform-support-requests', label: 'Platform Support Requests', route: '/services/service-catalogue/platform-support-requests' },
        { id: 'knowledge-content-requests', label: 'Knowledge / Content Requests', route: '/services/service-catalogue/knowledge-content-requests' },
        { id: 'admin-requests', label: 'Admin Requests', route: '/services/service-catalogue/admin-requests' },
      ],
    },
    {
      id: 'request-intake-submission',
      label: 'Request Intake & Submission',
      route: '/services/request-intake-submission',
      icon: Send,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "PlatformAdmin"],
      children: [
        { id: 'submit-request', label: 'Submit Request', route: '/services/request-intake-submission/submit-request' },
        { id: 'request-form', label: 'Request Form', route: '/services/request-intake-submission/request-form' },
        { id: 'required-inputs', label: 'Required Inputs', route: '/services/request-intake-submission/required-inputs' },
        { id: 'attachment-upload', label: 'Attachment Upload', route: '/services/request-intake-submission/attachment-upload' },
        { id: 'request-confirmation', label: 'Request Confirmation', route: '/services/request-intake-submission/request-confirmation' },
      ],
    },
    {
      id: 'fulfilment-queues',
      label: 'Fulfilment Queues',
      route: '/services/fulfilment-queues',
      icon: ListOrdered,
      visibleTo: ["Lead", "ServiceOwner", "PlatformAdmin"],
      children: [
        { id: 'central-support-queue', label: 'Central Support Queue', route: '/services/fulfilment-queues/central-support-queue' },
        { id: 'fulfilment-owner-queue', label: 'Fulfilment Owner Queue', route: '/services/fulfilment-queues/fulfilment-owner-queue' },
        { id: 'assigned-requests', label: 'Assigned Requests', route: '/services/fulfilment-queues/assigned-requests' },
        { id: 'queue-prioritisation', label: 'Queue Prioritisation', route: '/services/fulfilment-queues/queue-prioritisation' },
        { id: 'sla-queue-view', label: 'SLA Queue View', route: '/services/fulfilment-queues/sla-queue-view' },
      ],
    },
    {
      id: 'service-closure-feedback',
      label: 'Service Closure & Feedback',
      route: '/services/service-closure-feedback',
      icon: Star,
      children: [
        { id: 'fulfilment-evidence', label: 'Fulfilment Evidence', route: '/services/service-closure-feedback/fulfilment-evidence', visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
        { id: 'closure-notes', label: 'Closure Notes', route: '/services/service-closure-feedback/closure-notes', visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
        { id: 'request-closure-review', label: 'Request Closure Review', route: '/services/service-closure-feedback/request-closure-review', visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
        { id: 'service-rating', label: 'Service Rating', route: '/services/service-closure-feedback/service-rating', visibleTo: ["Associate", "Lead", "ServiceOwner", "PlatformAdmin"] },
        { id: 'reopen-request', label: 'Reopen Request', route: '/services/service-closure-feedback/reopen-request', visibleTo: ["Associate", "Lead", "ServiceOwner", "PlatformAdmin"] },
      ],
    },
  ],
};

// TRACKER Feature Area
export const trackerFeatureArea: NavItem = {
  id: 'tracker',
  label: 'TRACKER',
  route: '/tracker',
  visibleTo: ALL_ROLES,
  children: [
    {
      id: 'tracker-hub',
      label: 'Tracker Hub',
      route: '/tracker/tracker-hub',
      icon: Gauge,
      children: [
        { id: 'my-tracker-overview', label: 'My Tracker Overview', route: '/tracker/tracker-hub/my-tracker-overview', visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"] },
        { id: 'team-tracker-overview', label: 'Team Tracker Overview', route: '/tracker/tracker-hub/team-tracker-overview', visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "Leadership", "PlatformAdmin"] },
        { id: 'open-items', label: 'Open Items', route: '/tracker/tracker-hub/open-items', visibleTo: ALL_ROLES },
        { id: 'at-risk-items', label: 'At-Risk Items', route: '/tracker/tracker-hub/at-risk-items', visibleTo: ALL_ROLES },
        { id: 'recently-closed-items', label: 'Recently Closed Items', route: '/tracker/tracker-hub/recently-closed-items', visibleTo: ALL_ROLES },
      ],
    },
    {
      id: 'request-status-tracker',
      label: 'Request Status Tracker',
      route: '/tracker/request-status-tracker',
      icon: SearchCheck,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'submitted-requests', label: 'Submitted Requests', route: '/tracker/request-status-tracker/submitted-requests' },
        { id: 'request-drafts', label: 'Request Drafts', route: '/tracker/request-status-tracker/request-drafts' },
        { id: 'request-status', label: 'Request Status', route: '/tracker/request-status-tracker/request-status' },
        { id: 'pending-information', label: 'Pending Information', route: '/tracker/request-status-tracker/pending-information' },
        { id: 'request-closure-status', label: 'Request Closure Status', route: '/tracker/request-status-tracker/request-closure-status' },
      ],
    },
    {
      id: 'action-follow-up-tracker',
      label: 'Action & Follow-up Tracker',
      route: '/tracker/action-follow-up-tracker',
      icon: ListChecks,
      visibleTo: ["Associate", "Lead", "ServiceOwner", "GovernanceLead", "PlatformAdmin"],
      children: [
        { id: 'working-session-actions', label: 'Working Session Actions', route: '/tracker/action-follow-up-tracker/working-session-actions' },
        { id: 'meeting-follow-ups', label: 'Meeting Follow-ups', route: '/tracker/action-follow-up-tracker/meeting-follow-ups' },
        { id: 'assigned-follow-ups', label: 'Assigned Follow-ups', route: '/tracker/action-follow-up-tracker/assigned-follow-ups' },
        { id: 'overdue-follow-ups', label: 'Overdue Follow-ups', route: '/tracker/action-follow-up-tracker/overdue-follow-ups' },
        { id: 'completed-follow-ups', label: 'Completed Follow-ups', route: '/tracker/action-follow-up-tracker/completed-follow-ups' },
      ],
    },
    {
      id: 'blocker-sla-tracker',
      label: 'Blocker & SLA Tracker',
      route: '/tracker/blocker-sla-tracker',
      icon: AlertTriangle,
      visibleTo: ALL_ROLES,
      children: [
        { id: 'active-blockers', label: 'Active Blockers', route: '/tracker/blocker-sla-tracker/active-blockers' },
        { id: 'blocker-ageing', label: 'Blocker Ageing', route: '/tracker/blocker-sla-tracker/blocker-ageing' },
        { id: 'sla-at-risk', label: 'SLA At Risk', route: '/tracker/blocker-sla-tracker/sla-at-risk' },
        { id: 'sla-breached', label: 'SLA Breached', route: '/tracker/blocker-sla-tracker/sla-breached' },
        { id: 'sla-resolved', label: 'SLA Resolved', route: '/tracker/blocker-sla-tracker/sla-resolved' },
      ],
    },
    {
      id: 'decision-outcome-tracker',
      label: 'Decision & Outcome Tracker',
      route: '/tracker/decision-outcome-tracker',
      icon: Target,
      visibleTo: ["Lead", "ServiceOwner", "GovernanceLead", "Leadership", "PlatformAdmin"],
      children: [
        { id: 'decision-log', label: 'Decision Log', route: '/tracker/decision-outcome-tracker/decision-log' },
        { id: 'decision-status', label: 'Decision Status', route: '/tracker/decision-outcome-tracker/decision-status' },
        { id: 'linked-tasks-requests', label: 'Linked Tasks / Requests', route: '/tracker/decision-outcome-tracker/linked-tasks-requests' },
        { id: 'outcome-progress', label: 'Outcome Progress', route: '/tracker/decision-outcome-tracker/outcome-progress' },
        { id: 'outcome-evidence', label: 'Outcome Evidence', route: '/tracker/decision-outcome-tracker/outcome-evidence' },
      ],
    },
  ],
};

// WORKFLOWS Feature Area
export const workflowsFeatureArea: NavItem = {
  id: 'workflows',
  label: 'WORKFLOWS',
  route: '/workflows',
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
  label: 'ADMINISTRATION',
  route: '/administration',
  visibleTo: ["PlatformAdmin"],
  children: [
    {
      id: 'user-role-management',
      label: 'User & Role Management',
      route: '/administration/user-role-management',
      icon: UsersRound,
      visibleTo: ["PlatformAdmin"],
      children: [
        { id: 'user-directory', label: 'User Directory', route: '/administration/user-role-management/user-directory' },
        { id: 'role-assignment', label: 'Role Assignment', route: '/administration/user-role-management/role-assignment' },
        { id: 'user-status-management', label: 'User Status Management', route: '/administration/user-role-management/user-status-management' },
        { id: 'access-review', label: 'Access Review', route: '/administration/user-role-management/access-review' },
        { id: 'user-audit', label: 'User Audit', route: '/administration/user-role-management/user-audit' },
      ],
    },
    {
      id: 'organisation-unit-team-setup',
      label: 'Organisation / Unit / Team Setup',
      route: '/administration/organisation-unit-team-setup',
      icon: Network,
      visibleTo: ["PlatformAdmin"],
      children: [
        { id: 'organisation-structure', label: 'Organisation Structure', route: '/administration/organisation-unit-team-setup/organisation-structure' },
        { id: 'unit-configuration', label: 'Unit Configuration', route: '/administration/organisation-unit-team-setup/unit-configuration' },
        { id: 'team-setup', label: 'Team Setup', route: '/administration/organisation-unit-team-setup/team-setup' },
        { id: 'reporting-lines', label: 'Reporting Lines', route: '/administration/organisation-unit-team-setup/reporting-lines' },
        { id: 'ownership-mapping', label: 'Ownership Mapping', route: '/administration/organisation-unit-team-setup/ownership-mapping' },
      ],
    },
    {
      id: 'task-request-configuration',
      label: 'Task & Request Configuration',
      route: '/administration/task-request-configuration',
      icon: Settings2,
      visibleTo: ["PlatformAdmin"],
      children: [
        { id: 'task-template-management', label: 'Task Template Management', route: '/administration/task-request-configuration/task-template-management' },
        { id: 'request-category-config', label: 'Request Category Config', route: '/administration/task-request-configuration/request-category-config' },
        { id: 'required-inputs-config', label: 'Required Inputs Config', route: '/administration/task-request-configuration/required-inputs-config' },
        { id: 'status-lifecycle-config', label: 'Status Lifecycle Config', route: '/administration/task-request-configuration/status-lifecycle-config' },
        { id: 'custom-fields', label: 'Custom Fields', route: '/administration/task-request-configuration/custom-fields' },
      ],
    },
    {
      id: 'workflow-approval-sla-rules',
      label: 'Workflow, Approval & SLA Rules',
      route: '/administration/workflow-approval-sla-rules',
      icon: SlidersHorizontal,
      visibleTo: ["PlatformAdmin"],
      children: [
        { id: 'workflow-rule-management', label: 'Workflow Rule Management', route: '/administration/workflow-approval-sla-rules/workflow-rule-management' },
        { id: 'approval-path-configuration', label: 'Approval Path Configuration', route: '/administration/workflow-approval-sla-rules/approval-path-configuration' },
        { id: 'sla-rule-configuration', label: 'SLA Rule Configuration', route: '/administration/workflow-approval-sla-rules/sla-rule-configuration' },
        { id: 'escalation-rules', label: 'Escalation Rules', route: '/administration/workflow-approval-sla-rules/escalation-rules' },
        { id: 'routing-rules', label: 'Routing Rules', route: '/administration/workflow-approval-sla-rules/routing-rules' },
      ],
    },
    {
      id: 'integration-audit-automation-settings',
      label: 'Integration, Audit & Automation Settings',
      route: '/administration/integration-audit-automation-settings',
      icon: PlugZap,
      visibleTo: ["PlatformAdmin"],
      children: [
        { id: 'microsoft-integration', label: 'Microsoft Integration', route: '/administration/integration-audit-automation-settings/microsoft-integration' },
        { id: 'notification-settings', label: 'Notification Settings', route: '/administration/integration-audit-automation-settings/notification-settings' },
        { id: 'audit-settings', label: 'Audit Settings', route: '/administration/integration-audit-automation-settings/audit-settings' },
        { id: 'ai-assistance-settings', label: 'AI Assistance Settings', route: '/administration/integration-audit-automation-settings/ai-assistance-settings' },
        { id: 'automation-rules', label: 'Automation Rules', route: '/administration/integration-audit-automation-settings/automation-rules' },
      ],
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
