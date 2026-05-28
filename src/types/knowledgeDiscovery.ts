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

export interface KnowledgeAssetFull {
  id: string;
  title: string;
  type: KnowledgeAssetType;
  status: KnowledgeAssetStatus;
  summary: string;
  purpose: string;
  owner: string;
  ownerUserId?: string;
  lastReviewed: string;
  reviewDue: string;
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
  coreGuidance?: {
    principles: string[];
    steps: string[];
    examples: { type: 'good' | 'bad', text: string }[];
  };
  relatedAssetIds: string[];
  linkedWorkIds: string[];
}

export interface KnowledgeDetailRecord {
  id: string;
  assetId: string;
  content: string;
  sections: { id: string; title: string; body: string }[];
}

export interface KnowledgeFeedbackRecord {
  id: string;
  assetId: string;
  feedbackType: FeedbackType;
  submittedBy: string;
  status: 'New' | 'Reviewed' | 'Action Taken' | 'Dismissed';
  comment?: string;
  createdAt: string;
}

export interface KnowledgeReviewQueueItem {
  id: string;
  assetId: string;
  assetTitle: string;
  queueReason: 'Update Requested' | 'Outdated Flags' | 'Review Overdue';
  owner: string;
  slaDue: string;
  status: 'Pending' | 'In Progress' | 'Completed';
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
}

export interface RelatedKnowledgeRecord {
  id: string;
  fromAssetId: string;
  toAssetId: string;
  relationship: 'Alternative' | 'Prerequisite' | 'Deep Dive' | 'Related';
}
