export type TrackerHealth = 'Green' | 'Amber' | 'Red';
export type TrackerPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TrackerDefinition = {
  id: string;
  slug: string;
  name: string;
  purpose: string;
  owner: string;
  trackerType: string;
  requiredFields: string[];
  optionalFields: string[];
  defaultStatuses: string[];
  ownershipModel: string;
  updateFrequency: string;
  governanceRules: string;
  healthStatus: TrackerHealth;
  activeRecords: number;
  overdueRecords: number;
  lastUpdated: string;
};

export type TrackerRecord = {
  id: string;
  trackerId: string;
  title: string;
  description: string;
  owner: string;
  ownerAvatar?: string;
  teamOrSquad: string;
  priority: TrackerPriority;
  status: string;
  dueDate: string;
  rag: TrackerHealth;
  lastUpdated: string;
  nextAction: string;
  evidenceCount: number;
  commentCount: number;
  isOverdue: boolean;
  isBlocked: boolean;
  missingOwner: boolean;
  notUpdatedRecently: boolean;
  archived?: boolean;
  createdBy?: string;
  createdAt?: string;
  linkedEntities?: {
    id: string;
    type: 'Task' | 'Request' | 'Squad' | 'Decision' | 'Evidence Pack' | 'Working Session';
    label: string;
  }[];
  comments: {
    id: string;
    author: string;
    body: string;
    timestamp: string;
  }[];
  evidence: {
    id: string;
    title: string;
    type: 'File' | 'Link' | 'Document' | 'Spreadsheet' | 'Dashboard' | 'Teams Thread';
    url?: string;
    addedBy: string;
    addedAt: string;
  }[];
  activity: {
    id: string;
    actor: string;
    action: string;
    timestamp: string;
  }[];
  history?: {
    id: string;
    actor: string;
    action: string;
    field?: string;
    previousValue?: string;
    newValue?: string;
    changedBy?: string;
    timestamp: string;
  }[];
};
