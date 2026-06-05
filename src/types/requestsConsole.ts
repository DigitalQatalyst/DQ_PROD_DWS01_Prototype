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

// ─── Extended Entity Types (Sections 6.3–6.13) ──────────────────────

export interface OwnerQueueView {
  id: string;
  queueName: string;
  queueType: string;
  owner: string;
  activeItems: number;
  slaExposure: string;
  closureQuality: string;
  linkedRequestId: string;
}

export interface RequestCategory {
  id: string;
  category: string;
  defaultQueue: string;
  defaultSla: string;
  ownerRole: string;
  linkedQueueId: string;
}

export interface SlaRecord {
  id: string;
  requestId: string;
  slaState: FulfilmentSlaState;
  started: string;
  due: string;
  timeRemaining: string;
  breachState: string;
}

export interface ProgressUpdate {
  id: string;
  requestId: string;
  updateType: string;
  note: string;
  actor: string;
  statusAfter: FulfilmentStatus;
}

export interface EvidenceRecord {
  id: string;
  requestId: string;
  evidenceState: EvidenceState;
  evidenceNote: string;
  outcomeStatement: string;
  quality: string;
}

export interface HandoffEvent {
  id: string;
  requestId: string;
  fromOwner: string;
  toOwner: string;
  fromQueue: string;
  toQueue: string;
  reason: string;
  status: 'Pending' | 'Complete';
}

export interface EscalationRecord {
  id: string;
  requestId: string;
  reason: string;
  severity: RequestPriority;
  slaImpact: string;
  owner: string;
  resolutionPath: string;
}

export interface ClosureReviewRecord {
  id: string;
  requestId: string;
  evidenceQuality: string;
  outcomeQuality: string;
  closureStatus: string;
  reviewer: string;
  reopenReason: string;
}

export interface LinkedWorkRecord {
  id: string;
  requestId: string;
  linkedItem: string;
  type: string;
  status: string;
  relationship: string;
}

export interface HealthSignal {
  id: string;
  signal: string;
  value: string | number;
  status: 'Info' | 'Warning' | 'Danger';
  linkedRoute: string;
}

export interface ConfigReference {
  id: string;
  ruleType: string;
  name: string;
  owner: string;
  status: string;
  linkedId: string;
}

// ─── Lifecycle State Machine ─────────────────────────────────────────

export const FULFILMENT_STATUS_ORDER: FulfilmentStatus[] = [
  'Routed',
  'Assigned',
  'In Fulfilment',
  'Clarification Needed',
  'Blocked',
  'Escalated',
  'Evidence Added',
  'Fulfilled',
  'Closure Review',
  'Closed',
  'Reopened',
];

export const VALID_TRANSITIONS: Record<FulfilmentStatus, FulfilmentStatus[]> = {
  'Routed': ['Assigned'],
  'Assigned': ['In Fulfilment', 'Clarification Needed', 'Blocked', 'Escalated'],
  'In Fulfilment': ['Evidence Added', 'Fulfilled', 'Blocked', 'Escalated', 'Clarification Needed'],
  'Clarification Needed': ['In Fulfilment', 'Blocked'],
  'Blocked': ['In Fulfilment', 'Escalated', 'Assigned'],
  'Escalated': ['In Fulfilment', 'Blocked', 'Assigned'],
  'Evidence Added': ['Fulfilled', 'In Fulfilment', 'Closure Review'],
  'Fulfilled': ['Closure Review'],
  'Closure Review': ['Closed', 'Reopened'],
  'Closed': ['Reopened'],
  'Reopened': ['Assigned', 'In Fulfilment', 'Blocked'],
};
