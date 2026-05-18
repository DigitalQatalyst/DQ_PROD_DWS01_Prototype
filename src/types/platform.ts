export type PersonaId =
'associate' |
'scrum-master' |
'team-lead' |
'unit-lead' |
'hra' |
'admin' |
'support' |
'ceo';

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  tier: 'Operator' | 'Domain Leader' | 'Platform Control' | 'Executive';
  unit: string;
  defaultRoute: string;
  navDomains: string[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  unitId: string;
  teamId?: string;
  personaId: PersonaId;
}

export interface Unit {
  id: string;
  name: string;
  leadUserId: string;
  health: 'On Track' | 'Watch' | 'At Risk';
  outcomeIds: string[];
}

export interface Team {
  id: string;
  name: string;
  unitId: string;
  leadUserId: string;
  flowHealth: 'On Track' | 'Watch' | 'At Risk';
}

export interface Task {
  id: string;
  title: string;
  purpose: string;
  ownerUserId: string;
  reviewerUserId?: string;
  teamId: string;
  status:
  'Draft' |
  'In Progress' |
  'Blocked' |
  'Missing Update' |
  'Review Needed' |
  'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  slaState: 'On Track' | 'At Risk' | 'Breached' | 'Met';
  dueDate: string;
  expectedOutput: string;
  checklistDone: number;
  checklistTotal: number;
  evidenceState: 'Missing' | 'Partial' | 'Attached' | 'Accepted';
  blockerId?: string;
  requestId?: string;
  knowledgeIds: string[];
}

export interface RequestRecord {
  id: string;
  category:
  'HRA Requests' |
  'IT & Access Requests' |
  'Platform Support' |
  'Knowledge / Content Requests' |
  'Task / Workflow Support' |
  'Admin Requests' |
  'Approvals' |
  'Escalations';
  title: string;
  requesterUserId: string;
  ownerUserId?: string;
  queueId: string;
  status:
  'Draft' |
  'New' |
  'Pending Info' |
  'Routed' |
  'In Review' |
  'Returned' |
  'Closed';
  urgency: 'Low' | 'Medium' | 'High';
  slaState: 'On Track' | 'At Risk' | 'Breached' | 'Met';
  expectedOutcome: string;
  linkedTaskId?: string;
}

export interface Approval {
  id: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned' | 'Delegated';
  approverUserId: string;
  linkedTaskId?: string;
  linkedRequestId?: string;
  rationale?: string;
}

export interface WorkflowItem {
  id: string;
  name: string;
  state: string;
  slaLabel: string;
  linkedTaskId?: string;
  linkedRequestId?: string;
  approvalId?: string;
}

export interface Queue {
  id: string;
  name: string;
  ownerPersonaIds: PersonaId[];
  newCount: number;
  atRiskCount: number;
  requestIds: string[];
}

export interface KnowledgeAsset {
  id: string;
  title: string;
  type:
  'GHC Reference' |
  '6xD Reference' |
  'Playbook' |
  'Template' |
  'Learning Reference' |
  'Workspace Guide';
  status: 'Effective' | 'Under Review' | 'Draft' | 'Retired';
  tags: string[];
  linkedTaskIds: string[];
}

export interface AuditEvent {
  id: string;
  event: string;
  actorUserId: string;
  timestamp: string;
  entityType: string;
  entityId: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

export interface KpiSet {
  id: string;
  name: string;
  scope: string;
  metrics: {
    label: string;
    value: string;
    trend: string;
    status: 'success' | 'warning' | 'danger' | 'info';
  }[];
}