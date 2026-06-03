import { PersonaId, Task } from './platform';
import { SignalStatus } from './serviceLifecycle';

export type TaskTemplateCategoryType = 'Team Delivery' | 'Review' | 'Governance' | 'Closure Quality' | 'Personal Work' | 'Working Session';

export interface TaskTemplateCategory {
  id: string;
  name: TaskTemplateCategoryType;
  description: string;
  ownerType: string;
}

export type TemplateType = 'Execution' | 'Review' | 'Governance' | 'Support' | 'HRA' | 'Knowledge' | 'Closure';

export interface TaskTemplateFull {
  id: string;
  category: TaskTemplateCategoryType;
  type: TemplateType;
  title: string;
  description: string;
  purpose: string;
  expectedOutput: string;
  checklistItems: { id: string; text: string; required: boolean }[];
  evidenceRequired: boolean;
  evidenceRule?: string;
  reviewPath: 'Standard' | 'Lead' | 'Governance' | 'No review' | 'Approval required' | 'Review only';
  closureCriteria: string;
  slaGuidance: string;
  dueDateGuidance: string;
  relatedKnowledgeIds: string[];
  relatedTemplateIds: string[];
  auditNote?: string;
  ownerType: string;
  personas: string[];
  checklistDepth?: 'Light' | 'Standard' | 'Detailed';
  bestFor?: string;
}

export interface TaskTemplateDetail {
  id: string;
  templateId: string;
  longDescription: string;
  whenToUse: string[];
  whenNotToUse: string[];
}

export interface TemplatePrefillRule {
  id: string;
  templateId: string;
  prefilledFields: string[];
  editableFields: string[];
  protectedFields: string[];
  overrideRequired: boolean;
}

export type ClosureQualityStateStatus = 'Ready' | 'Missing evidence' | 'Weak closure' | 'Closed';

export interface ClosureQualityState {
  checklistCompletion: number; // percentage
  evidenceCompleteness: 'Complete' | 'Partial' | 'Missing' | 'Not Required';
  outputPresent: boolean;
  reviewDecision: 'Approved' | 'Returned' | 'Pending' | 'Not Required';
  deviationSummary: string[];
  closureOutcome: ClosureQualityStateStatus;
}

export interface TaskInstanceEdit {
  id: string;
  taskId: string;
  fieldEdited: string;
  originalValue: any;
  instanceValue: any;
  overrideReason?: string;
  isGovernanceOverride: boolean;
}

export interface TaskChecklistRecord {
  id: string;
  taskId: string;
  itemText: string;
  requiredForClosure: boolean;
  state: 'Not Started' | 'In Progress' | 'Complete';
}

export interface TaskEvidenceRecord {
  id: string;
  taskId: string;
  evidenceState: 'Attached' | 'Missing' | 'Accepted' | 'Rejected';
  evidenceType: string;
  required: boolean;
  url?: string;
  notes?: string;
}

export interface TaskReviewRecord {
  id: string;
  taskId: string;
  reviewerUserId: string;
  reviewerRole: string;
  decisionState: 'Pending' | 'Approved' | 'Returned' | 'Request Correction';
  rationale?: string;
}

export interface GovernedTaskInstance extends Task {
  templateId?: string;
  templateTitle?: string;
  deviations?: string[];
  closureQualityState?: ClosureQualityState;
  reviewState?: 'Pending' | 'Approved' | 'Returned';
  progressNotes?: { id: string; text: string; date: string; author: string }[];
  blockerState?: 'Blocked' | 'At Risk' | 'Clear';
  editHistory?: TaskInstanceEdit[];
  strategicContext?: {
    aspirationId?: string;
    objectiveId?: string;
    outcomeId?: string;
    registerId?: string;
    registerItemId?: string;
    missingContext?: boolean;
  };
}

export interface TaskExecutiveSignal {
  id: string;
  signal: string;
  value: number | string;
  trend?: string;
  status: SignalStatus;
  linksTo?: string;
}
