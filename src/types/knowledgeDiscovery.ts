import { PersonaId, User } from './platform';
import { SignalStatus } from './serviceLifecycle';

export type KnowledgeAssetStatus = 'Effective' | 'Under Review' | 'Draft' | 'Needs Update' | 'Deprecated';

export type KnowledgeAssetType = 
  | 'Guideline' 
  | 'Operating Standard' 
  | 'Process Reference' 
  | 'Evidence Standard' 
  | 'Playbook' 
  | 'Template' 
  | 'GHC Reference' 
  | '6xD Reference' 
  | 'Workspace Guide' 
  | 'Learning Reference';

export type FeedbackType = 'Useful' | 'Unclear' | 'Outdated' | 'Missing Detail' | 'Wrong Owner';

export type FeedbackStatus = 
  | 'Logged' 
  | 'Pending Review' 
  | 'Update Requested' 
  | 'Pending Owner Review' 
  | 'Reviewed' 
  | 'Action Taken' 
  | 'Dismissed'
  | 'New';

export type ReviewQueueReason = 
  | 'Outdated flag' 
  | 'Missing detail' 
  | 'Unclear guidance' 
  | 'Wrong owner' 
  | 'Update Requested' 
  | 'Outdated Flags' 
  | 'Review Overdue';

export type ReviewQueueStatus = 
  | 'Pending Review' 
  | 'Update Required' 
  | 'Review Scheduled' 
  | 'Owner Review'
  | 'Pending' 
  | 'In Progress' 
  | 'Completed';

export type AcknowledgementState = 'Acknowledged' | 'Pending' | 'Not Required';

export type RelationshipType = 
  | 'Alternative' 
  | 'Prerequisite' 
  | 'Deep Dive' 
  | 'Related'
  | 'Supporting evidence standard'
  | 'Related GHC behaviour reference'
  | 'Related closure evidence standard'
  | 'Related blocker escalation playbook'
  | 'Related delivery review template';

export interface KnowledgeAssetFull {
  id: string;
  title: string;
  type: KnowledgeAssetType;
  status: KnowledgeAssetStatus;
  summary: string;
  purpose: string;
  owner: string;
  ownerUserId?: string;
  reviewer?: string;
  lastReviewed: string;
  reviewDue: string;
  nextReview?: string;
  readTime: string;
  applicability: string[];
  feedbackMarker?: 'Has outdated flags' | 'Needs review' | 'No feedback' | 'Useful';
  linkedWorkCount: number;
  acknowledgementRequired: boolean;
  version: string;
  tags: string[];
  evidenceExpectation?: string;
  whenToUse: string[];
  whenNotToUse: string[];
  closureImpact?: string;
  lifecycleState?: string;
  permissionScope?: string;
  coreGuidance?: {
    principles: string[];
    steps: string[];
    examples: { type: 'good' | 'bad', text: string }[];
    commonMistakes?: string[];
    exceptions?: string[];
  };
  relatedAssetIds: string[];
  linkedWorkIds: string[];
}

export interface KnowledgeDetailRecord {
  id: string;
  assetId: string;
  content: string;
  sections: { id: string; title: string; body: string }[];
  workApplication?: string;
  reviewExpectation?: string;
  acknowledgementExpectation?: string;
  evidenceOutput?: string;
  versionHistory?: { version: string; date: string; summary: string; reviewer: string; status: string }[];
}

export interface ApplicabilityRecord {
  id: string;
  assetId: string;
  workTypes: string[];
  roles: string[];
  contexts?: string[];
  acknowledgementRequired: boolean;
  exceptionPath: string;
}

export interface AcknowledgementRecord {
  id: string;
  assetId: string;
  userId: string;
  userLabel: string;
  required: boolean;
  state: AcknowledgementState;
}

export interface KnowledgeFeedbackRecord {
  id: string;
  assetId: string;
  feedbackType: FeedbackType;
  submittedBy: string;
  status: FeedbackStatus;
  comment?: string;
  createdAt: string;
}

export interface KnowledgeReviewQueueItem {
  id: string;
  assetId: string;
  assetTitle: string;
  queueReason: ReviewQueueReason;
  feedbackType?: FeedbackType;
  owner: string;
  slaDue: string;
  status: ReviewQueueStatus;
}

export interface KnowledgeExecutiveSignal {
  id: string;
  signal: string;
  value: number | string;
  trend?: string;
  status: SignalStatus;
  linksTo?: string;
}

export interface LinkedWorkRecord {
  id: string;
  knowledgeId: string;
  targetId: string;
  targetTitle: string;
  targetType: 'Task' | 'Request';
  targetStatus: string;
  targetOwner?: string;
}

export interface RelatedKnowledgeRecord {
  id: string;
  fromAssetId: string;
  toAssetId: string;
  relationship: RelationshipType;
}
