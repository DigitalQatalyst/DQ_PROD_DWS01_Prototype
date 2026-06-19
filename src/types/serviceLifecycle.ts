// ─── Service Lifecycle Types ───────────────────────────────────────────
// Shared type definitions for the Services Marketplace → Request Lifecycle flow.
// Used across all lifecycle screens (Catalogue, Detail, Request Workflow,
// Request Status, Service Owner Queue, Approval Queue, Executive Signals).

// ─── Enums / Union Types ──────────────────────────────────────────────

export type ApprovalRequirement = 'Required' | 'Conditional' | 'Not Required';

export type ServiceRisk = 'Standard' | 'Governance-sensitive' | 'Review-sensitive' | 'At Risk';

export type ServiceCategoryId =
  | 'CAT-HRA'
  | 'CAT-IT'
  | 'CAT-PLAT'
  | 'CAT-KNOW'
  | 'CAT-TASK'
  | 'CAT-ADMIN'
  | 'CAT-APPROVAL'
  | 'CAT-ESC';

export type ServiceRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Approval'
  | 'In Review'
  | 'In Fulfilment'
  | 'Returned for Information'
  | 'Closed';

export type ApprovalDecisionState =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Returned'
  | 'Escalated';

export type SlaState = 'On Track' | 'At Risk' | 'Breached' | 'Completed';

export type QueueCompleteness = 'Complete' | 'Missing Info';

export type SignalStatus = 'success' | 'warning' | 'danger' | 'info';

// ─── Service Category ─────────────────────────────────────────────────

export interface ServiceCategory {
  id: ServiceCategoryId | string;
  slug?: string;
  name: string;
  description: string;
  ownerType: string;
}

export interface CatalogFilterDefinition {
  key: string;
  label: string;
  filterType: 'single' | 'multi';
  isShared: boolean;
  submarketplaceSlug: string | null;
  sortOrder: number;
  options: { value: string; label: string }[];
}

// ─── Service ──────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  category: string;
  categoryId: ServiceCategoryId | string;
  /** Service domain (listing category) when sourced from discovery catalog */
  domain?: string;
  submarketplace?: string;
  submarketplaceSlug?: string;
  slug?: string;
  description: string;
  owner: string;
  sla: string;
  approval: ApprovalRequirement;
  approvalLabel?: string;
  approvalDetail: string;
  risk: ServiceRisk;
  requiredInputs: string[];
  /** Short purpose statement shown on card and hero */
  purpose: string;
  primaryActionLabel?: string;
  facets?: Record<string, string>;
}

// ─── Service Detail ───────────────────────────────────────────────────

export interface ServiceDetail {
  id: string;
  serviceId: string;
  service: string;
  purpose: string;
  whenToUse: string[];
  whenNotToUse: string[];
  requiredInputs: string[];
  owner: string;
  queue: string;
  sla: string;
  approval: ApprovalRequirement;
  approvalDetail: string;
  escalationTrigger: string;
  fulfilmentPath: string;
  relatedKnowledge: string[];
  relatedServices: string[];
  auditNote: string;
}

// ─── Service Request Record ───────────────────────────────────────────

export interface TimelineEvent {
  timestamp: string;
  label: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

export interface ServiceRequestRecord {
  id: string;
  serviceId: string;
  service: string;
  title?: string;
  category: string;
  requester: string;
  status: ServiceRequestStatus;
  owner: string;
  sla: string;
  slaState: SlaState;
  approval: string;
  approvalId?: string;
  urgency: 'Low' | 'Normal' | 'High' | 'Critical';
  expectedOutcome: string;
  pendingInfo?: string;
  fulfilmentNotes?: string;
  closureOutcome?: string;
  submittedAt: string;
  timeline: TimelineEvent[];
}

// ─── Approval Record ─────────────────────────────────────────────────

export interface ServiceApproval {
  id: string;
  requestId: string;
  service: string;
  requester: string;
  approverRole: string;
  decisionState: ApprovalDecisionState;
  rationale: string;
  reason: string;
  sla: string;
  slaState: SlaState;
}

// ─── Service Owner Queue Item ─────────────────────────────────────────

export interface ServiceQueueItem {
  id: string;
  requestId: string;
  service: string;
  requester: string;
  category: string;
  queue: string;
  completeness: QueueCompleteness;
  slaState: SlaState;
  slaDetail: string;
  status: string;
  actionNeeded: string;
}

// ─── Executive Signal ─────────────────────────────────────────────────

export interface ExecutiveSignal {
  id: string;
  signal: string;
  value: number;
  status: SignalStatus;
  linksTo: string;
}

// ─── Category Demand (Executive View) ─────────────────────────────────

export interface CategoryDemand {
  category: string;
  open: number;
  trend: string;
  risk: 'Low' | 'Medium' | 'High';
}

// ─── Service Owner Performance (Executive View) ───────────────────────

export interface ServiceOwnerPerformance {
  owner: string;
  open: number;
  atRisk: number;
  closed: number;
  avgResponse: string;
}
