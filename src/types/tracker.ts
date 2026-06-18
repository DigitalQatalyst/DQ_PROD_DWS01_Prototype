export type TrackerHealth = 'Green' | 'Amber' | 'Red';
export type TrackerPriority = 'Low' | 'Medium' | 'High' | 'Critical';

// Extended model for the CRM-style record maintenance page.
// Keep the original RAG concept (`rag`) used elsewhere in the prototype,
// but allow the UI to also represent broader health states.
export type TrackerHealthExtended = TrackerHealth | 'Healthy' | 'Closed';

export type TrackerStatusExtended =
  | 'Created'
  | 'Open'
  | 'In Progress'
  | 'Overloaded'
  | 'Balanced'
  | 'Reviewed'
  | 'Closed'
  | 'Escalated'
  | 'Blocked';

export type TrackerHistoryEvent = {
  id: string;
  eventType: string;
  actor: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
};

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
  unit: string;
  type: string;
  priority: TrackerPriority;
  status: string;
  dueDate: string; // Used as "Review due" on the CRM maintenance page.
  rag: TrackerHealth;
  health: TrackerHealthExtended; // Used as the CRM "Health" control.
  lastUpdated: string;
  opened: string;
  nextAction: string;
  tags: string[];
  savedCount: number;
  workspace: string;
  ownerSlug: string;
  teamSlug: string;
  workflowSlug: string;
  history: TrackerHistoryEvent[];
  evidenceCount: number;
  commentCount: number;
  isOverdue: boolean;
  isBlocked: boolean;
  missingOwner: boolean;
  notUpdatedRecently: boolean;
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
};
