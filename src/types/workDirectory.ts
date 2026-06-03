export type DirectoryEntityType =
  | 'Person'
  | 'Team'
  | 'Unit'
  | 'Service Owner'
  | 'Fulfilment Contact'
  | 'Support Contact'
  | 'Expert'
  | 'Governance Owner'
  | 'Queue';

export type DirectoryAvailability = 'Available' | 'Busy' | 'Escalation only';
export type DirectoryWorkload = 'Low' | 'Medium' | 'High';
export type DirectoryActionType =
  | 'Contact'
  | 'Route Request'
  | 'Assign Task'
  | 'Request Review'
  | 'Handoff Work'
  | 'Escalate'
  | 'Open Queue'
  | 'View Related Work';

export interface DirectoryEntry {
  id: string;
  name: string;
  entityType: DirectoryEntityType;
  roleLabel: string;
  unit: string;
  team?: string;
  lead?: string;
  members?: number;
  availability: DirectoryAvailability;
  workload: DirectoryWorkload;
  ownershipAreas: string[];
  contactRoutes: string[];
  preferredContactRoute: string;
  backupOwner?: string;
  relatedEntryIds: string[];
  queueId?: string;
  queueState?: 'Available' | 'Unavailable';
  routeTargetType: 'Person' | 'Team' | 'Unit' | 'Queue';
  summary: string;
}

export interface OwnershipArea {
  id: string;
  area: string;
  owner: string;
  entityType: 'Person' | 'Team' | 'Unit' | 'Queue';
  coverageState: 'Covered' | 'Needs Backup' | 'Unavailable' | 'At Risk';
  linksTo: string;
}

export interface ContactRoute {
  id: string;
  routeType: string;
  usedFor: string;
  primaryOwner: string;
  backupOwner?: string;
  condition: string;
}

export interface DirectoryLinkedWork {
  id: string;
  relatedDirectoryEntryId: string;
  workItemId: string;
  title: string;
  type: 'Task' | 'Request' | 'Approval' | 'Workflow' | 'Queue' | 'Knowledge' | 'Escalation';
  status: string;
  owner: string;
  restricted?: boolean;
  restrictionReason?: string;
  targetRoute?: string;
}

export interface DirectoryDetailRecord {
  id: string;
  entryId: string;
  responsibilitySummary: string;
  recommendedRoute: string;
  escalationTrigger: string;
  coverageNotes: string;
  serviceContext: string[];
  knowledgeContext: string[];
  governanceContext: string[];
}

export interface DirectoryActivity {
  id: string;
  activity: string;
  actor: string;
  relatedEntry: string;
  time: string;
}

export interface AdminOwnershipReview {
  id: string;
  issue: string;
  directoryEntry: string;
  directoryEntryId?: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Needs Review' | 'At Risk' | 'Reviewed' | 'Issue Flagged';
  action: string;
  configurationReference?: string;
  recommendedFix?: string;
}

export interface OrganisationSignal {
  id: string;
  signal: string;
  value: string;
  status: 'Success' | 'Warning' | 'Danger' | 'Info';
  linksTo: string;
}

export interface DirectoryActionRecord {
  id: string;
  entryId: string;
  actionType: DirectoryActionType;
  targetId?: string;
  reason: string;
  notes?: string;
  status: 'Submitted' | 'Routed' | 'Escalated' | 'Assigned' | 'Requested';
  createdAt: string;
}
