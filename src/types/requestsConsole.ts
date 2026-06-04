export type FulfilmentStatus =
  | 'Routed'
  | 'Assigned'
  | 'In Fulfilment'
  | 'Clarification Needed'
  | 'Blocked'
  | 'Escalated'
  | 'Evidence Added'
  | 'Fulfilled'
  | 'Closure Review'
  | 'Closed'
  | 'Reopened';

export type FulfilmentSlaState =
  | 'On Track'
  | 'Due Soon'
  | 'At Risk'
  | 'Breached'
  | 'Paused'
  | 'Completed';

export type EvidenceState =
  | 'Not Started'
  | 'Pending'
  | 'Added'
  | 'Weak'
  | 'Accepted';

export type RequestPriority = 'High' | 'Medium' | 'Low';

export type RecurrenceType = 'New' | 'Recurring' | 'Reopened';

export type ClosureQualityFilter =
  | 'Pending'
  | 'Accepted'
  | 'Rejected'
  | 'Reopened'
  | 'Not Ready';

export type NextActionType =
  | 'Update Progress'
  | 'Add Evidence'
  | 'Review Blocker'
  | 'Inspect Escalation'
  | 'View Closure'
  | 'Review Closure'
  | 'Escalate'
  | 'Mark Fulfilled'
  | 'Handoff';

export type QueueViewId =
  | 'all'
  | 'platform-support'
  | 'hra'
  | 'knowledge'
  | 'task-workflow'
  | 'approval-support'
  | 'admin';

export interface FulfilmentRequestRow {
  id: string;
  title: string;
  category: string;
  queue: string;
  owner: string;
  ownerUserId?: string;
  requester: string;
  requesterUserId?: string;
  priority: RequestPriority;
  slaState: FulfilmentSlaState;
  fulfilmentStatus: FulfilmentStatus;
  evidenceState: EvidenceState;
  age: string;
  recurrence: RecurrenceType;
  closureQuality: ClosureQualityFilter;
  nextAction: NextActionType;
}

export const REQUESTS_CONSOLE_TABS = [
  'All Requests',
  'My Assigned',
  'Routed',
  'In Fulfilment',
  'Blocked',
  'Escalated',
  'Closure Review',
  'Closed / Reopened',
] as const;

export type RequestsConsoleTab = (typeof REQUESTS_CONSOLE_TABS)[number];

export const QUEUE_VIEW_OPTIONS: { id: QueueViewId; label: string; queueMatch?: string }[] = [
  { id: 'all', label: 'All Queues' },
  { id: 'platform-support', label: 'Platform Support Queue', queueMatch: 'Platform Support Queue' },
  { id: 'hra', label: 'HRA Queue', queueMatch: 'HRA Queue' },
  { id: 'knowledge', label: 'Knowledge Queue', queueMatch: 'Knowledge Queue' },
  { id: 'task-workflow', label: 'Task / Workflow Queue', queueMatch: 'Task / Workflow Queue' },
  { id: 'approval-support', label: 'Approval Support Queue', queueMatch: 'Approval Support Queue' },
  { id: 'admin', label: 'Admin Queue', queueMatch: 'Admin Queue' },
];

export const DEFAULT_ASSIGNED_OWNER = 'Brian Otieno';
