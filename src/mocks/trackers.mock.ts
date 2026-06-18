<<<<<<< HEAD
import type { TrackerDefinition, TrackerHealth, TrackerPriority, TrackerRecord } from '../types/tracker';
=======
import type {
  TrackerDefinition,
  TrackerHealth,
  TrackerPriority,
  TrackerRecord,
  TrackerHealthExtended,
  TrackerHistoryEvent,
} from '../types/tracker';
>>>>>>> origin/Feat/TrackerHub-Rose

export const trackerDefinitions: TrackerDefinition[] = [
  {
    id: 'workload-distribution',
    slug: 'workload-distribution-tracker',
    name: 'Workload Distribution Tracker',
    purpose: 'Balance workload across squads.',
    owner: 'PMO',
    trackerType: 'Workload Tracker',
    requiredFields: ['Title', 'Owner', 'Squad', 'Workload Type', 'Status', 'Due Date', 'Last Update'],
    optionalFields: ['Capacity Notes', 'Priority', 'Links', 'Attachments'],
    defaultStatuses: ['Open', 'In Progress', 'Balanced', 'Overloaded', 'Closed'],
    ownershipModel: 'Squad ownership',
    updateFrequency: 'Weekly',
    governanceRules: 'Overloaded squads require weekly review.',
    healthStatus: 'Green',
    activeRecords: 22,
    overdueRecords: 3,
    lastUpdated: 'Today',
  },
  {
    id: 'squad-backlog',
    slug: 'squad-backlog-tracker',
    name: 'Squad Backlog Tracker',
    purpose: 'Track squad backlog and ageing.',
    owner: 'Delivery Ops',
    trackerType: 'Backlog Tracker',
    requiredFields: ['Title', 'Owner', 'Squad', 'Status', 'Ageing', 'Priority', 'Due Date'],
    optionalFields: ['Dependency', 'Notes', 'Links', 'Attachments'],
    defaultStatuses: ['New', 'Ready', 'In Progress', 'Blocked', 'Done'],
    ownershipModel: 'Squad lead ownership',
    updateFrequency: 'Twice weekly',
    governanceRules: 'Items ageing over 14 days require review.',
    healthStatus: 'Amber',
    activeRecords: 31,
    overdueRecords: 5,
    lastUpdated: 'Today',
  },
  {
    id: 'project-backlog',
    slug: 'project-backlog-tracker',
    name: 'Project Backlog Tracker',
    purpose: 'Monitor project backlog health.',
    owner: 'DQ Operations',
    trackerType: 'Project Backlog Tracker',
    requiredFields: ['Title', 'Owner', 'Project', 'Status', 'Priority', 'Due Date', 'Last Update'],
    optionalFields: ['Dependency', 'Notes', 'Links', 'Attachments'],
    defaultStatuses: ['Open', 'In Progress', 'Blocked', 'On Hold', 'Completed'],
    ownershipModel: 'Project ownership',
    updateFrequency: 'Weekly',
    governanceRules: 'Blocked backlog items require escalation.',
    healthStatus: 'Amber',
    activeRecords: 18,
    overdueRecords: 4,
    lastUpdated: 'Today',
  },
  {
    id: 'strategic-initiatives',
    slug: 'strategic-initiatives-tracker',
    name: 'Strategic Initiatives Tracker',
    purpose: 'Track strategic initiatives and progress.',
    owner: 'Strategy Office',
    trackerType: 'Strategic Initiative Tracker',
    requiredFields: ['Initiative', 'Owner', 'Outcome', 'Milestone', 'Status', 'Due Date', 'RAG'],
    optionalFields: ['Value Contribution', 'Risks', 'Notes', 'Evidence'],
    defaultStatuses: ['Planned', 'In Progress', 'At Risk', 'Completed'],
    ownershipModel: 'Initiative owner',
    updateFrequency: 'Fortnightly',
    governanceRules: 'Red initiatives require leadership review.',
    healthStatus: 'Green',
    activeRecords: 12,
    overdueRecords: 2,
    lastUpdated: 'Yesterday',
  },
  {
    id: 'project-health',
    slug: 'project-health-tracker',
    name: 'Project Health Tracker',
    purpose: 'Monitor project health signals, RAG status, overdue updates, blockers, and evidence across active DQ workstreams.',
    owner: 'DQ Operations',
    trackerType: 'Project Health Tracker',
    requiredFields: ['Title', 'Owner', 'Status', 'Due Date', 'RAG', 'Last Update'],
    optionalFields: ['Impact', 'Priority', 'Notes', 'Links', 'Attachments'],
    defaultStatuses: ['In Progress', 'Needs Update', 'Blocked', 'Awaiting Review', 'On Track', 'Completed'],
    ownershipModel: 'Functional ownership',
    updateFrequency: 'Weekly',
    governanceRules: 'All red items require review.',
    healthStatus: 'Amber',
    activeRecords: 18,
    overdueRecords: 4,
    lastUpdated: 'Today',
  },
  {
    id: 'governance-follow-up',
    slug: 'governance-follow-up-tracker',
    name: 'Governance Follow-up Tracker',
    purpose: 'Track governance follow-ups and action closure.',
    owner: 'Governance Office',
    trackerType: 'Governance Follow-up Tracker',
    requiredFields: ['Action', 'Owner', 'Governance Forum', 'Status', 'Due Date', 'Evidence'],
    optionalFields: ['Notes', 'Escalation', 'Reviewer', 'Attachments'],
    defaultStatuses: ['Open', 'In Progress', 'Awaiting Review', 'Returned', 'Closed'],
    ownershipModel: 'Governance action owner',
    updateFrequency: 'Weekly',
    governanceRules: 'Overdue governance actions require escalation.',
    healthStatus: 'Red',
    activeRecords: 19,
    overdueRecords: 6,
    lastUpdated: 'Today',
  },
  {
    id: 'action-log',
    slug: 'action-log-tracker',
    name: 'Action Log Tracker',
    purpose: 'Track actions from meetings, working sessions, and reviews.',
    owner: 'Delivery Ops',
    trackerType: 'Action Log Tracker',
    requiredFields: ['Action', 'Owner', 'Source', 'Status', 'Due Date', 'Next Action'],
    optionalFields: ['Notes', 'Evidence', 'Links', 'Comments'],
    defaultStatuses: ['Open', 'In Progress', 'Overdue', 'Completed'],
    ownershipModel: 'Action owner',
    updateFrequency: 'Daily',
    governanceRules: 'Overdue actions must be updated before close of business.',
    healthStatus: 'Amber',
    activeRecords: 28,
    overdueRecords: 5,
    lastUpdated: 'Today',
  },
  {
    id: 'decision',
    slug: 'decision-tracker',
    name: 'Decision Tracker',
    purpose: 'Track decisions, decision status, and supporting evidence.',
    owner: 'DQ Operations',
    trackerType: 'Decision Tracker',
    requiredFields: ['Decision', 'Owner', 'Decision Status', 'Review Date', 'Evidence'],
    optionalFields: ['Linked Tasks', 'Linked Requests', 'Notes', 'Impact'],
    defaultStatuses: ['Proposed', 'Awaiting Review', 'Approved', 'Rejected', 'Implemented'],
    ownershipModel: 'Decision owner',
    updateFrequency: 'Weekly',
    governanceRules: 'Decisions awaiting review for more than 7 days require follow-up.',
    healthStatus: 'Amber',
    activeRecords: 16,
    overdueRecords: 3,
    lastUpdated: 'Today',
  },
  {
    id: 'risk-issue',
    slug: 'risk-issue-tracker',
    name: 'Risk / Issue Tracker',
    purpose: 'Track risks, issues, blockers, and mitigation actions.',
    owner: 'Risk Office',
    trackerType: 'Risk / Issue Tracker',
    requiredFields: ['Risk or Issue', 'Owner', 'Severity', 'Status', 'Due Date', 'Mitigation'],
    optionalFields: ['Impact', 'Escalation', 'Evidence', 'Links'],
    defaultStatuses: ['Open', 'Mitigating', 'Blocked', 'Escalated', 'Resolved'],
    ownershipModel: 'Risk owner',
    updateFrequency: 'Weekly',
    governanceRules: 'Critical risks require immediate escalation.',
    healthStatus: 'Red',
    activeRecords: 25,
    overdueRecords: 6,
    lastUpdated: 'Today',
  },
];

type RecordSeed = {
  id: string;
  trackerId: string;
  title: string;
  owner: string;
  teamOrSquad: string;
  priority: TrackerPriority;
  status: string;
  dueDate: string;
  rag: TrackerHealth;
  lastUpdated: string;
  nextAction: string;
  isOverdue?: boolean;
  isBlocked?: boolean;
  missingOwner?: boolean;
  notUpdatedRecently?: boolean;
  description?: string;
};

<<<<<<< HEAD
function record(seed: RecordSeed): TrackerRecord {
  const owner = seed.owner || 'Unassigned';
=======
function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function healthFromStatusAndRag(status: string, rag: TrackerHealth): TrackerHealthExtended {
  const s = status.toLowerCase();
  if (s === 'closed' || s.includes('closed')) return 'Closed';
  if (s === 'reviewed') return 'Healthy';
  if (rag === 'Green') return 'Green';
  if (rag === 'Amber') return 'Amber';
  return 'Red';
}

function typeDefaultsForTracker(trackerId: string) {
  switch (trackerId) {
    case 'workload-distribution':
      return 'Capacity / Workload';
    case 'squad-backlog':
      return 'Backlog';
    case 'project-backlog':
      return 'Project Health';
    case 'strategic-initiatives':
      return 'Decision';
    case 'project-health':
      return 'Risk / Issue';
    case 'governance-follow-up':
      return 'Governance';
    case 'action-log':
      return 'Action Log';
    case 'decision':
      return 'Decision';
    case 'risk-issue':
      return 'Risk / Issue';
    default:
      return 'Capacity / Workload';
  }
}

function unitDefaultsForTracker(trackerId: string) {
  switch (trackerId) {
    case 'workload-distribution':
      return 'Workload Distribution';
    case 'squad-backlog':
      return 'Squad Backlog';
    case 'project-backlog':
      return 'Project Backlog';
    case 'strategic-initiatives':
      return 'Strategic Initiatives';
    case 'project-health':
      return 'Project Health';
    case 'governance-follow-up':
      return 'Governance Follow-ups';
    case 'action-log':
      return 'Action Log';
    case 'decision':
      return 'Decisions';
    case 'risk-issue':
      return 'Risk / Issue';
    default:
      return 'Workspace';
  }
}

function workflowDefaultsForTracker(trackerId: string) {
  switch (trackerId) {
    case 'workload-distribution':
      return 'workload-review';
    case 'squad-backlog':
      return 'squad-backlog-review';
    case 'project-backlog':
      return 'project-backlog-review';
    case 'strategic-initiatives':
      return 'initiative-review';
    case 'project-health':
      return 'project-health-review';
    case 'governance-follow-up':
      return 'governance-follow-up';
    case 'action-log':
      return 'action-follow-up';
    case 'decision':
      return 'decision-review';
    case 'risk-issue':
      return 'risk-mitigation';
    default:
      return 'tracker-workflow';
  }
}

function record(seed: RecordSeed): TrackerRecord {
  const owner = seed.owner || 'Unassigned';
  const unit = unitDefaultsForTracker(seed.trackerId);
  const itemType = typeDefaultsForTracker(seed.trackerId);
  const health = healthFromStatusAndRag(seed.status, seed.rag);
>>>>>>> origin/Feat/TrackerHub-Rose
  return {
    ...seed,
    description: seed.description || `${seed.title} requires governed tracking, owner confirmation, current status, and supporting evidence before the next review cycle.`,
    evidenceCount: seed.rag === 'Green' ? 2 : seed.rag === 'Amber' ? 1 : 0,
    commentCount: seed.status.includes('Review') || seed.isBlocked ? 3 : 1,
    isOverdue: Boolean(seed.isOverdue || seed.status === 'Overdue' || seed.dueDate === 'Today' && seed.rag === 'Red'),
    isBlocked: Boolean(seed.isBlocked || seed.status === 'Blocked'),
    missingOwner: Boolean(seed.missingOwner || !seed.owner),
    notUpdatedRecently: Boolean(seed.notUpdatedRecently || seed.lastUpdated.includes('days')),
<<<<<<< HEAD
=======
    unit,
    type: itemType,
    health,
    opened: '12 May 2026 at 09:30',
    tags: [
      seed.trackerId === 'workload-distribution' ? 'Workload' : unit,
      health,
    ],
    savedCount: 0,
    workspace: 'DWS.01',
    ownerSlug: slugify(owner),
    teamSlug: slugify(seed.teamOrSquad),
    workflowSlug: workflowDefaultsForTracker(seed.trackerId),
    history: buildInitialHistory(seed, health),
>>>>>>> origin/Feat/TrackerHub-Rose
    comments: [
      { id: `${seed.id}-comment-1`, author: owner, body: `${seed.nextAction} is the next action for this tracker record.`, timestamp: seed.lastUpdated },
      { id: `${seed.id}-comment-2`, author: 'DQ Operations', body: 'Status review logged in the tracker workspace.', timestamp: 'Yesterday' },
    ],
    evidence: [
      { id: `${seed.id}-evidence-1`, title: `${seed.id} evidence note`, type: seed.rag === 'Green' ? 'Document' : 'Link', addedBy: owner, addedAt: seed.lastUpdated },
    ],
    activity: [
      { id: `${seed.id}-activity-1`, actor: owner, action: `Updated status to ${seed.status}`, timestamp: seed.lastUpdated },
      { id: `${seed.id}-activity-2`, actor: 'Tracker Hub', action: `RAG set to ${seed.rag}`, timestamp: 'Yesterday' },
    ],
  };
}

<<<<<<< HEAD
export const trackerRecords: TrackerRecord[] = [
  record({ id: 'WLD-1001', trackerId: 'workload-distribution', title: 'Squad Alpha capacity rebalance', owner: 'Maya Khan', teamOrSquad: 'Squad Alpha', priority: 'High', status: 'Overloaded', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Confirm capacity move', isOverdue: true }),
  record({ id: 'WLD-1002', trackerId: 'workload-distribution', title: 'Platform team workload review', owner: 'Rohan Patel', teamOrSquad: 'Platform Team', priority: 'Medium', status: 'In Progress', dueDate: '20 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Update allocation notes' }),
  record({ id: 'WLD-1003', trackerId: 'workload-distribution', title: 'Governance pod overload check', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'High', status: 'Overloaded', dueDate: '18 May', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Escalate resourcing' }),
  record({ id: 'WLD-1004', trackerId: 'workload-distribution', title: 'Delivery Ops assignment cleanup', owner: 'Sara Khan', teamOrSquad: 'Delivery Ops', priority: 'Low', status: 'Balanced', dueDate: '24 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Close review' }),
  record({ id: 'WLD-1005', trackerId: 'workload-distribution', title: 'Unassigned workload intake', owner: '', teamOrSquad: 'PMO', priority: 'Medium', status: 'Open', dueDate: '22 May', rag: 'Amber', lastUpdated: '3 days ago', nextAction: 'Assign owner', missingOwner: true, notUpdatedRecently: true }),
=======
function buildInitialHistory(seed: RecordSeed, health: TrackerHealthExtended): TrackerHistoryEvent[] {
  const created: TrackerHistoryEvent = {
    id: `history-${seed.id}-created`,
    eventType: 'Created',
    actor: 'Tracker Hub',
    timestamp: seed.lastUpdated || 'Today',
  };
  const statusChanged: TrackerHistoryEvent = {
    id: `history-${seed.id}-status`,
    eventType: 'Status',
    actor: 'Tracker Hub',
    timestamp: seed.lastUpdated || 'Today',
    newValue: seed.status,
  };
  const healthSet: TrackerHistoryEvent = {
    id: `history-${seed.id}-health`,
    eventType: 'Health',
    actor: 'Tracker Hub',
    timestamp: 'Yesterday',
    newValue: health,
  };
  return [created, statusChanged, healthSet];
}

export const trackerRecords: TrackerRecord[] = [
  // Workload Distribution tracker fixtures (24 records for prototype pagination).
  record({ id: 'WLD-1001', trackerId: 'workload-distribution', title: 'Squad Alpha capacity rebalance', owner: 'Maya Khan', teamOrSquad: 'Squad Alpha', priority: 'High', status: 'Overloaded', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Confirm capacity move', isOverdue: true }),
  record({ id: 'WLD-1002', trackerId: 'workload-distribution', title: 'Platform team workload review', owner: 'Rohan Patel', teamOrSquad: 'Platform Team', priority: 'Medium', status: 'In Progress', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Update allocation notes' }),
  record({ id: 'WLD-1003', trackerId: 'workload-distribution', title: 'Governance pod overload check', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'High', status: 'Overloaded', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Escalate resourcing' }),
  record({ id: 'WLD-1004', trackerId: 'workload-distribution', title: 'Delivery Ops assignment clearance', owner: 'Sara Khan', teamOrSquad: 'Delivery Ops', priority: 'Low', status: 'Balanced', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Close review' }),
  record({ id: 'WLD-1005', trackerId: 'workload-distribution', title: 'Unassigned workload intake', owner: '', teamOrSquad: 'PMO', priority: 'Medium', status: 'Open', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Assign owner', missingOwner: true, notUpdatedRecently: true }),
  record({ id: 'WLD-1006', trackerId: 'workload-distribution', title: 'Capacity risk review', owner: 'Maya Khan', teamOrSquad: 'Squad Alpha', priority: 'High', status: 'Reviewed', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Publish review summary' }),
  record({ id: 'WLD-1007', trackerId: 'workload-distribution', title: 'Workload escalation tracker', owner: 'Rohan Patel', teamOrSquad: 'Platform Team', priority: 'Medium', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Confirm escalation owner' }),
  record({ id: 'WLD-1008', trackerId: 'workload-distribution', title: 'Squad allocation audit', owner: 'Sara Khan', teamOrSquad: 'Squad Delta', priority: 'Low', status: 'Closed', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Archive audit evidence' }),
  record({ id: 'WLD-1009', trackerId: 'workload-distribution', title: 'Team capacity forecast check', owner: 'Ali Raza', teamOrSquad: 'Squad Beta', priority: 'High', status: 'Overloaded', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Adjust forecast assumptions' }),
  record({ id: 'WLD-1010', trackerId: 'workload-distribution', title: 'Integration workload reprioritisation', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'Critical', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Update reprioritisation plan' }),
  record({ id: 'WLD-1011', trackerId: 'workload-distribution', title: 'Release window resourcing review', owner: 'Musa Kibet', teamOrSquad: 'Delivery Ops', priority: 'Medium', status: 'Balanced', dueDate: 'Today', rag: 'Green', lastUpdated: 'Yesterday', nextAction: 'Confirm release staffing' }),
  record({ id: 'WLD-1012', trackerId: 'workload-distribution', title: 'Unblocking dependencies triage', owner: 'Bilal Waqar', teamOrSquad: 'Platform Team', priority: 'High', status: 'Overloaded', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Escalate blockers' }),
  record({ id: 'WLD-1013', trackerId: 'workload-distribution', title: 'Squad alpha workload balancing', owner: 'Maya Khan', teamOrSquad: 'Squad Alpha', priority: 'High', status: 'Balanced', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Monitor post-transfer' }),
  record({ id: 'WLD-1014', trackerId: 'workload-distribution', title: 'Governance follow-up resourcing', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'High', status: 'Overloaded', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Confirm additional reviewer' }),
  record({ id: 'WLD-1015', trackerId: 'workload-distribution', title: 'Delivery ops capacity calibration', owner: 'Sara Khan', teamOrSquad: 'Delivery Ops', priority: 'Low', status: 'Reviewed', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Close calibration' }),
  record({ id: 'WLD-1016', trackerId: 'workload-distribution', title: 'Workload hygiene sweep', owner: 'Ali Raza', teamOrSquad: 'Squad Beta', priority: 'Medium', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Add update notes' }),
  record({ id: 'WLD-1017', trackerId: 'workload-distribution', title: 'Capacity reallocation audit', owner: 'Musa Kibet', teamOrSquad: 'PMO', priority: 'Critical', status: 'Open', dueDate: 'Today', rag: 'Amber', lastUpdated: '3 days ago', nextAction: 'Assign owners' , notUpdatedRecently: true, missingOwner: true}),
  record({ id: 'WLD-1018', trackerId: 'workload-distribution', title: 'Escalated review follow-up', owner: 'Rohan Patel', teamOrSquad: 'Platform Team', priority: 'High', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Follow up escalation request' }),
  record({ id: 'WLD-1019', trackerId: 'workload-distribution', title: 'Operational workload closure', owner: 'Sara Khan', teamOrSquad: 'Delivery Ops', priority: 'Low', status: 'Closed', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Publish closure notice' }),
  record({ id: 'WLD-1020', trackerId: 'workload-distribution', title: 'Squad allocation health check', owner: 'Maya Khan', teamOrSquad: 'Squad Gamma', priority: 'Medium', status: 'Reviewed', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Confirm review completed' }),
  record({ id: 'WLD-1021', trackerId: 'workload-distribution', title: 'Platform workload review cycle', owner: 'Rohan Patel', teamOrSquad: 'Platform Team', priority: 'High', status: 'Overloaded', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Assess overload drivers' }),
  record({ id: 'WLD-1022', trackerId: 'workload-distribution', title: 'Governance resource re-balance', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'Critical', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Track escalation approval' }),
  record({ id: 'WLD-1023', trackerId: 'workload-distribution', title: 'Delivery ops workload stabilization', owner: 'Sara Khan', teamOrSquad: 'Delivery Ops', priority: 'Medium', status: 'Balanced', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Maintain current balance' }),
  record({ id: 'WLD-1024', trackerId: 'workload-distribution', title: 'Squad beta workload closure', owner: 'Ali Raza', teamOrSquad: 'Squad Beta', priority: 'Low', status: 'Closed', dueDate: 'Today', rag: 'Green', lastUpdated: 'Today', nextAction: 'Archive final evidence' }),
>>>>>>> origin/Feat/TrackerHub-Rose

  record({ id: 'SQB-1001', trackerId: 'squad-backlog', title: 'Ageing API backlog triage', owner: 'James Tan', teamOrSquad: 'Squad Beta', priority: 'High', status: 'Blocked', dueDate: '17 May', rag: 'Red', lastUpdated: '2 days ago', nextAction: 'Resolve dependency', isBlocked: true, isOverdue: true }),
  record({ id: 'SQB-1002', trackerId: 'squad-backlog', title: 'Ready queue grooming', owner: 'Maya Khan', teamOrSquad: 'Squad Alpha', priority: 'Medium', status: 'Ready', dueDate: '21 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Confirm sprint slot' }),
  record({ id: 'SQB-1003', trackerId: 'squad-backlog', title: 'Backlog item evidence gap', owner: 'Ali Raza', teamOrSquad: 'Squad Gamma', priority: 'High', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Attach evidence' }),
  record({ id: 'SQB-1004', trackerId: 'squad-backlog', title: 'Stale backlog cleanup', owner: 'Sara Khan', teamOrSquad: 'Squad Delta', priority: 'Low', status: 'Done', dueDate: '19 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Archive completed items' }),
  record({ id: 'SQB-1005', trackerId: 'squad-backlog', title: 'Blocked story ownership review', owner: 'Hina Adam', teamOrSquad: 'Squad Beta', priority: 'Critical', status: 'Blocked', dueDate: '16 May', rag: 'Red', lastUpdated: '4 days ago', nextAction: 'Escalate blocker', isBlocked: true, isOverdue: true, notUpdatedRecently: true }),

  record({ id: 'PBL-1001', trackerId: 'project-backlog', title: 'Client portal backlog ageing', owner: 'Bilal Waqar', teamOrSquad: 'Client Portal', priority: 'High', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: '09:10 AM', nextAction: 'Add weekly update' }),
  record({ id: 'PBL-1002', trackerId: 'project-backlog', title: 'Data migration dependency', owner: 'Musa Kibet', teamOrSquad: 'Migration Project', priority: 'Critical', status: 'Blocked', dueDate: '17 May', rag: 'Red', lastUpdated: '2 days ago', nextAction: 'Resolve dependency', isBlocked: true, isOverdue: true }),
  record({ id: 'PBL-1003', trackerId: 'project-backlog', title: 'Reporting backlog prioritisation', owner: 'Ali Raza', teamOrSquad: 'Reporting', priority: 'Medium', status: 'Open', dueDate: '23 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Rank backlog' }),
  record({ id: 'PBL-1004', trackerId: 'project-backlog', title: 'Release backlog hold review', owner: 'Sara Khan', teamOrSquad: 'Release Team', priority: 'Medium', status: 'On Hold', dueDate: '24 May', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Review hold reason' }),
  record({ id: 'PBL-1005', trackerId: 'project-backlog', title: 'Completed backlog validation', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'Low', status: 'Completed', dueDate: '20 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Confirm closure' }),

  record({ id: 'STI-1001', trackerId: 'strategic-initiatives', title: 'Customer trust initiative milestone', owner: 'Strategy Office', teamOrSquad: 'Trust Program', priority: 'High', status: 'In Progress', dueDate: '22 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Update milestone progress' }),
  record({ id: 'STI-1002', trackerId: 'strategic-initiatives', title: 'Efficiency initiative benefit review', owner: 'Bilal Waqar', teamOrSquad: 'DQ Ops', priority: 'Medium', status: 'Planned', dueDate: '28 May', rag: 'Green', lastUpdated: 'Yesterday', nextAction: 'Confirm baseline value' }),
  record({ id: 'STI-1003', trackerId: 'strategic-initiatives', title: 'Red initiative leadership review', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'Critical', status: 'At Risk', dueDate: 'Today', rag: 'Red', lastUpdated: '2 days ago', nextAction: 'Prepare leadership review', isOverdue: true, notUpdatedRecently: true }),
  record({ id: 'STI-1004', trackerId: 'strategic-initiatives', title: 'Automation initiative checkpoint', owner: 'Ali Raza', teamOrSquad: 'Automation', priority: 'Medium', status: 'In Progress', dueDate: '25 May', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Add risk note' }),
  record({ id: 'STI-1005', trackerId: 'strategic-initiatives', title: 'Operating rhythm initiative closeout', owner: 'Sara Khan', teamOrSquad: 'Delivery Ops', priority: 'Low', status: 'Completed', dueDate: '18 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Publish closeout note' }),

  record({ id: 'PH-1042', trackerId: 'project-health', title: 'Vendor risk workstream update', owner: 'Bilal Waqar', teamOrSquad: 'DQ Ops', priority: 'High', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: '09:30 AM', nextAction: 'Add weekly update', description: 'Weekly update required for vendor risk workstream status.' }),
  record({ id: 'PH-1087', trackerId: 'project-health', title: 'Service review readiness', owner: 'Sara Khan', teamOrSquad: 'Delivery Ops', priority: 'Medium', status: 'Needs Update', dueDate: '16 May', rag: 'Red', lastUpdated: 'Yesterday', nextAction: 'Upload evidence', description: 'Service review pack requires supporting evidence before review.', isOverdue: true }),
  record({ id: 'PH-1131', trackerId: 'project-health', title: 'Backlog clean-up progress', owner: 'Ali Raza', teamOrSquad: 'Squad Alpha', priority: 'High', status: 'Blocked', dueDate: '18 May', rag: 'Red', lastUpdated: '2 days ago', nextAction: 'Resolve dependency', description: 'Backlog clean-up is blocked by dependency confirmation.', isOverdue: true, isBlocked: true, notUpdatedRecently: true }),
  record({ id: 'PH-1203', trackerId: 'project-health', title: 'Governance review pack', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'Medium', status: 'Awaiting Review', dueDate: '19 May', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Review comments', description: 'Governance pack awaiting review comments before submission.' }),
  record({ id: 'RI-1221', trackerId: 'project-health', title: 'Infrastructure issue log', owner: 'Musa Khan', teamOrSquad: 'Platform Team', priority: 'Low', status: 'On Track', dueDate: '22 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Confirm closure', description: 'Infrastructure issue log is ready for closure confirmation.' }),

  record({ id: 'GOV-1001', trackerId: 'governance-follow-up', title: 'Board action closure evidence', owner: 'Bilal Waqar', teamOrSquad: 'Governance Forum', priority: 'High', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: '08:45 AM', nextAction: 'Attach evidence' }),
  record({ id: 'GOV-1002', trackerId: 'governance-follow-up', title: 'Policy exception follow-up', owner: 'Hina Adam', teamOrSquad: 'Policy Review', priority: 'Critical', status: 'Open', dueDate: '16 May', rag: 'Red', lastUpdated: '3 days ago', nextAction: 'Escalate exception', isOverdue: true, notUpdatedRecently: true }),
  record({ id: 'GOV-1003', trackerId: 'governance-follow-up', title: 'Returned evidence correction', owner: 'Sara Khan', teamOrSquad: 'Evidence Review', priority: 'Medium', status: 'Returned', dueDate: '19 May', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Correct evidence pack' }),
  record({ id: 'GOV-1004', trackerId: 'governance-follow-up', title: 'Audit response confirmation', owner: 'Ali Raza', teamOrSquad: 'Audit', priority: 'Medium', status: 'Awaiting Review', dueDate: '22 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Review response' }),
  record({ id: 'GOV-1005', trackerId: 'governance-follow-up', title: 'Governance action without owner', owner: '', teamOrSquad: 'Governance Office', priority: 'High', status: 'Open', dueDate: '20 May', rag: 'Red', lastUpdated: '2 days ago', nextAction: 'Assign owner', missingOwner: true, notUpdatedRecently: true }),

  record({ id: 'ACT-1001', trackerId: 'action-log', title: 'Close service review action', owner: 'Sara Khan', teamOrSquad: 'Service Review', priority: 'High', status: 'Overdue', dueDate: '16 May', rag: 'Red', lastUpdated: 'Yesterday', nextAction: 'Upload evidence', isOverdue: true }),
  record({ id: 'ACT-1002', trackerId: 'action-log', title: 'Working session follow-up', owner: 'Bilal Waqar', teamOrSquad: 'DQ Ops', priority: 'Medium', status: 'In Progress', dueDate: 'Today', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Add progress note' }),
  record({ id: 'ACT-1003', trackerId: 'action-log', title: 'Meeting decision action', owner: 'Ali Raza', teamOrSquad: 'Delivery Ops', priority: 'Low', status: 'Open', dueDate: '23 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Confirm action owner' }),
  record({ id: 'ACT-1004', trackerId: 'action-log', title: 'Review pack evidence upload', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'High', status: 'In Progress', dueDate: '21 May', rag: 'Amber', lastUpdated: '2 days ago', nextAction: 'Upload pack', notUpdatedRecently: true }),
  record({ id: 'ACT-1005', trackerId: 'action-log', title: 'Completed action verification', owner: 'Musa Kibet', teamOrSquad: 'Platform Team', priority: 'Low', status: 'Completed', dueDate: '19 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Archive action' }),

  record({ id: 'DEC-1001', trackerId: 'decision', title: 'Confirm Q3 delivery sequencing', owner: 'Ali Raza', teamOrSquad: 'Delivery Ops', priority: 'Medium', status: 'Awaiting Review', dueDate: '18 May', rag: 'Amber', lastUpdated: 'Today', nextAction: 'Review decision note' }),
  record({ id: 'DEC-1002', trackerId: 'decision', title: 'Approve platform support model', owner: 'Bilal Waqar', teamOrSquad: 'Platform Team', priority: 'High', status: 'Proposed', dueDate: '21 May', rag: 'Amber', lastUpdated: 'Yesterday', nextAction: 'Add impact note' }),
  record({ id: 'DEC-1003', trackerId: 'decision', title: 'Rejected integration path record', owner: 'Hina Adam', teamOrSquad: 'Governance', priority: 'Low', status: 'Rejected', dueDate: '17 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Publish outcome' }),
  record({ id: 'DEC-1004', trackerId: 'decision', title: 'Stale decision review', owner: 'Sara Khan', teamOrSquad: 'Strategy Office', priority: 'High', status: 'Awaiting Review', dueDate: 'Today', rag: 'Red', lastUpdated: '4 days ago', nextAction: 'Follow up reviewer', isOverdue: true, notUpdatedRecently: true }),
  record({ id: 'DEC-1005', trackerId: 'decision', title: 'Implemented sequencing decision', owner: 'Musa Kibet', teamOrSquad: 'DQ Ops', priority: 'Medium', status: 'Implemented', dueDate: '20 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Link implementation evidence' }),

  record({ id: 'RSK-1001', trackerId: 'risk-issue', title: 'Dependency blocking security rollout', owner: 'Hina Adam', teamOrSquad: 'Security', priority: 'Critical', status: 'Blocked', dueDate: '17 May', rag: 'Red', lastUpdated: 'Today', nextAction: 'Resolve blocker', isBlocked: true, isOverdue: true }),
  record({ id: 'RSK-1002', trackerId: 'risk-issue', title: 'Vendor risk mitigation delay', owner: 'Bilal Waqar', teamOrSquad: 'DQ Ops', priority: 'High', status: 'Mitigating', dueDate: 'Today', rag: 'Amber', lastUpdated: '09:30 AM', nextAction: 'Update mitigation plan' }),
  record({ id: 'RSK-1003', trackerId: 'risk-issue', title: 'Escalated data quality issue', owner: 'Ali Raza', teamOrSquad: 'Data Team', priority: 'High', status: 'Escalated', dueDate: '18 May', rag: 'Red', lastUpdated: '2 days ago', nextAction: 'Confirm escalation owner', notUpdatedRecently: true }),
  record({ id: 'RSK-1004', trackerId: 'risk-issue', title: 'Resolved access issue', owner: 'Sara Khan', teamOrSquad: 'Access Team', priority: 'Medium', status: 'Resolved', dueDate: '19 May', rag: 'Green', lastUpdated: 'Today', nextAction: 'Close evidence loop' }),
  record({ id: 'RSK-1005', trackerId: 'risk-issue', title: 'Open risk without mitigation', owner: '', teamOrSquad: 'Risk Office', priority: 'Critical', status: 'Open', dueDate: '16 May', rag: 'Red', lastUpdated: '3 days ago', nextAction: 'Assign risk owner', missingOwner: true, isOverdue: true, notUpdatedRecently: true }),
];

const customTrackerStorageKey = 'dws-tracker-hub-custom-trackers';

function getCustomTrackers(): TrackerDefinition[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(customTrackerStorageKey);
    return raw ? JSON.parse(raw) as TrackerDefinition[] : [];
  } catch {
    return [];
  }
}

function getAllTrackerDefinitions() {
  const customTrackers = getCustomTrackers();
  return [...customTrackers, ...trackerDefinitions.filter((tracker) => !customTrackers.some((customTracker) => customTracker.slug === tracker.slug))];
}

export function getAllTrackers() {
  return getAllTrackerDefinitions();
}

export function getTrackerBySlug(slug?: string) {
  return getAllTrackerDefinitions().find((tracker) => tracker.slug === slug);
}

export function getTrackerByName(name: string) {
  return getAllTrackerDefinitions().find((tracker) => tracker.name === name);
}

export function getRecordsForTracker(trackerId: string) {
  return trackerRecords.filter((recordItem) => recordItem.trackerId === trackerId);
}
