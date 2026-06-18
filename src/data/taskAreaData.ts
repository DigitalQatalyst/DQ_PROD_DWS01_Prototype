export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Waiting Review' | 'Returned' | 'Completed' | 'Overdue';
export type SlaState = 'On Track' | 'At Risk' | 'Breached' | 'Completed';
export type ClosureQuality = 'Not Ready' | 'Needs Evidence' | 'Review Pending' | 'Accepted' | 'Returned';

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'Completion Note' | 'Proof of Work' | 'Decision Record' | 'Approval Note' | 'Tracker Update';
  linkedChecklistItem?: string;
  submittedBy: string;
  submittedAt: string;
  reviewStatus: 'Pending' | 'Accepted' | 'Returned';
  reviewerNote?: string;
}

export interface Blocker {
  id: string;
  reason: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  raisedBy: string;
  raisedAt: string;
  age: string;
  slaImpact: string;
  resolutionPath: string;
  status: 'Open' | 'Escalated' | 'Resolved';
  resolutionNote?: string;
}

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  isDecision: boolean;
  followUp?: string;
  followUpOwner?: string;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  eventType: string;
  description: string;
  relatedObjectId?: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  purpose: string;
  expectedOutput: string;
  owner: string;
  ownerRole: string;
  ownerUnit: string;
  contributors: string[];
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  slaState: SlaState;
  progressPercent: number;
  checklist: ChecklistItem[];
  evidenceRequired: boolean;
  evidenceItems: EvidenceItem[];
  blockers: Blocker[];
  comments: TaskComment[];
  decisions: TaskComment[];
  linkedWorkingSessionId?: string;
  linkedRequestId?: string;
  linkedKnowledge: string[];
  closureQuality: ClosureQuality;
  lastUpdateAt: string;
  nextAction: string;
  auditEvents: AuditEvent[];
}

export interface TaskTemplate {
  id: string;
  name: string;
  category: string;
  purpose: string;
  typicalOwner: string;
  checklistCount: number;
  evidenceRules: string;
  closureCriteria: string[];
  linkedReferences: string[];
}

export interface WorkingSession {
  id: string;
  title: string;
  date: string;
  participants: string[];
  linkedTaskId?: string;
  linkedRequestId?: string;
  decisions: string[];
  actions: Array<{ text: string; state: 'Linked to Task' | 'Needs Task' | 'Follow-up Only'; owner?: string }>;
}

const currentUser = 'Amina Hassan';

export const taskTemplates: TaskTemplate[] = [
  { id: 'TPL-201', name: 'GHC Onboarding Checklist', category: 'GHC', purpose: 'Ensure new associates complete GHC onboarding requirements within the governed timeline.', typicalOwner: 'HRA', checklistCount: 6, evidenceRules: 'Completion note and access confirmation required.', closureCriteria: ['GHC profile complete', 'Access confirmed', 'Learning started', 'Manager notified'], linkedReferences: ['GHC Reference', 'Onboarding Playbook'] },
  { id: 'TPL-202', name: 'Agile Sprint Task', category: 'Agile TMS', purpose: 'Deliver sprint committed work with traceable output and review.', typicalOwner: 'Associate', checklistCount: 4, evidenceRules: 'Sprint output evidence required.', closureCriteria: ['Output delivered', 'Sprint review complete', 'Acceptance confirmed'], linkedReferences: ['Agile TMS Playbook'] },
  { id: 'TPL-203', name: 'HRA Request Routing', category: 'HRA', purpose: 'Route and fulfil HRA requests with proper intake and closure.', typicalOwner: 'HRA', checklistCount: 5, evidenceRules: 'Intake form and fulfilment note required.', closureCriteria: ['Intake complete', 'Routing confirmed', 'Fulfilment evidence attached'], linkedReferences: ['HRA Routing Guide'] },
  { id: 'TPL-204', name: 'Support Queue Triage', category: 'Support', purpose: 'Triage and assign support queue items with SLA awareness.', typicalOwner: 'Support', checklistCount: 4, evidenceRules: 'Triage decision note required.', closureCriteria: ['Queue item triaged', 'Owner assigned', 'SLA clock set'], linkedReferences: ['Support Operations Guide'] },
  { id: 'TPL-205', name: 'Governance Review Action', category: 'Governance', purpose: 'Close governance review actions with audit-ready evidence.', typicalOwner: 'Governance Lead', checklistCount: 5, evidenceRules: 'Evidence approval required.', closureCriteria: ['Action completed', 'Evidence approved', 'Reviewer sign-off'], linkedReferences: ['Governance Review Playbook'] },
  { id: 'TPL-206', name: 'Execution Task', category: 'Execution', purpose: 'Deliver governed work with clear output, ownership, and closure quality.', typicalOwner: 'Associate', checklistCount: 4, evidenceRules: 'Completion proof required.', closureCriteria: ['Output delivered', 'Checklist complete', 'Evidence attached', 'Review complete'], linkedReferences: ['DQ Ways of Working'] },
];

export const governedTasks: TaskRecord[] = [
  {
    id: 'TSK-2401', title: 'Prepare GHC onboarding checklist for new associates',
    purpose: 'Ensure all new associates complete the governed onboarding checklist within SLA, including access, learning, and profile setup.',
    expectedOutput: 'Completed GHC onboarding checklist with manager sign-off and access confirmation for each new joiner.',
    owner: currentUser, ownerRole: 'Associate', ownerUnit: 'People Operations',
    contributors: ['Bilal Waqar', 'Naomi Kimani'],
    priority: 'High', status: 'In Progress', dueDate: '2026-06-12', slaState: 'On Track',
    progressPercent: 65,
    checklist: [
      { label: 'GHC profile reviewed', done: true },
      { label: 'Access setup confirmed', done: true },
      { label: 'Learning modules started', done: true },
      { label: 'Manager checklist signed off', done: false },
      { label: 'HRA confirmation recorded', done: false },
      { label: 'Onboarding closure note added', done: false },
    ],
    evidenceRequired: true,
    evidenceItems: [
      { id: 'EV-301', title: 'GHC profile screenshot', type: 'Proof of Work', linkedChecklistItem: 'GHC profile reviewed', submittedBy: currentUser, submittedAt: '2026-06-05', reviewStatus: 'Accepted' },
    ],
    blockers: [],
    comments: [
      { id: 'CMT-1', author: 'Bilal Waqar', text: 'GHC profile reviewed and confirmed. Access setup in progress.', isDecision: false, timestamp: '2026-06-05T10:30:00Z' },
    ],
    decisions: [],
    linkedKnowledge: ['GHC Reference', 'Onboarding Playbook'],
    closureQuality: 'Not Ready', lastUpdateAt: '2026-06-05', nextAction: 'Complete manager checklist sign-off and attach HRA confirmation.',
    auditEvents: [
      { id: 'AUD-1', timestamp: '2026-06-01T09:00:00Z', actor: currentUser, eventType: 'Created', description: 'Task created from GHC onboarding operating rhythm.' },
      { id: 'AUD-2', timestamp: '2026-06-03T14:00:00Z', actor: currentUser, eventType: 'Updated', description: 'GHC profile reviewed and access setup started.' },
      { id: 'AUD-3', timestamp: '2026-06-05T10:30:00Z', actor: 'Bilal Waqar', eventType: 'Comment', description: 'Progress update added.' },
    ],
  },
  {
    id: 'TSK-2402', title: 'Review overdue closure evidence for workspace migration tasks',
    purpose: 'Identify workspace migration tasks with missing or weak closure evidence and return them for rework before the governance checkpoint.',
    expectedOutput: 'Closure evidence review report with accepted, returned, and escalated task counts.',
    owner: 'Priya Menon', ownerRole: 'Closure Reviewer', ownerUnit: 'Risk and Control',
    contributors: [currentUser],
    priority: 'Critical', status: 'Waiting Review', dueDate: '2026-06-08', slaState: 'At Risk',
    progressPercent: 80,
    checklist: [
      { label: 'Overdue tasks identified', done: true },
      { label: 'Evidence reviewed per task', done: true },
      { label: 'Weak closures flagged', done: true },
      { label: 'Return instructions prepared', done: false },
    ],
    evidenceRequired: true,
    evidenceItems: [
      { id: 'EV-302', title: 'Closure evidence review spreadsheet', type: 'Completion Note', submittedBy: 'Priya Menon', submittedAt: '2026-06-06', reviewStatus: 'Pending' },
    ],
    blockers: [
      { id: 'BLK-1', reason: 'Waiting for workspace migration team to confirm output dates.', severity: 'High', owner: 'Daniel Okafor', raisedBy: 'Priya Menon', raisedAt: '2026-06-05', age: '2 days', slaImpact: 'Closure review SLA at risk', resolutionPath: 'Confirm migration output dates with Daniel Okafor.', status: 'Open' },
    ],
    comments: [],
    decisions: [
      { id: 'DEC-1', author: 'Priya Menon', text: 'Decision: Return TSK-2398 and TSK-2399 for evidence rework.', isDecision: true, timestamp: '2026-06-06T16:00:00Z' },
    ],
    linkedKnowledge: ['Closure Quality Guide', 'Evidence Standards'],
    closureQuality: 'Review Pending', lastUpdateAt: '2026-06-06', nextAction: 'Complete return instructions and notify task owners.',
    auditEvents: [
      { id: 'AUD-4', timestamp: '2026-06-04T09:00:00Z', actor: 'Priya Menon', eventType: 'Created', description: 'Closure evidence review opened.' },
      { id: 'AUD-5', timestamp: '2026-06-06T16:00:00Z', actor: 'Priya Menon', eventType: 'Decision', description: 'Return decision recorded for two tasks.' },
    ],
  },
  {
    id: 'TSK-2403', title: 'Update HRA request routing checklist',
    purpose: 'Refresh the HRA request routing checklist to reflect current intake requirements and SLA thresholds.',
    expectedOutput: 'Updated HRA routing checklist with current intake fields, routing rules, and SLA tiers.',
    owner: 'Naomi Kimani', ownerRole: 'HRA Owner', ownerUnit: 'People Operations',
    contributors: ['Sreya Lakshmi'],
    priority: 'Medium', status: 'In Progress', dueDate: '2026-06-14', slaState: 'On Track',
    progressPercent: 40,
    checklist: [
      { label: 'Current checklist reviewed', done: true },
      { label: 'Intake requirements updated', done: true },
      { label: 'Routing rules validated', done: false },
      { label: 'SLA thresholds confirmed', done: false },
      { label: 'Peer review completed', done: false },
    ],
    evidenceRequired: true,
    evidenceItems: [],
    blockers: [],
    comments: [
      { id: 'CMT-2', author: 'Naomi Kimani', text: 'Intake requirements updated. Routing rules need validation with Support team.', isDecision: false, timestamp: '2026-06-06T11:00:00Z' },
    ],
    decisions: [],
    linkedKnowledge: ['HRA Routing Guide'],
    closureQuality: 'Not Ready', lastUpdateAt: '2026-06-06', nextAction: 'Validate routing rules with Support and confirm SLA thresholds.',
    auditEvents: [
      { id: 'AUD-6', timestamp: '2026-06-03T09:00:00Z', actor: 'Naomi Kimani', eventType: 'Created', description: 'Task created from HRA operating rhythm.' },
    ],
  },
  {
    id: 'TSK-2404', title: 'Compile SLA risk summary for Unit Lead review',
    purpose: 'Aggregate SLA exposure across all active tasks and prepare a risk summary for Unit Lead governance review.',
    expectedOutput: 'SLA risk summary document with breach counts, at-risk tasks, and recommended recovery actions.',
    owner: currentUser, ownerRole: 'Associate', ownerUnit: 'People Operations',
    contributors: [],
    priority: 'High', status: 'Not Started', dueDate: '2026-06-10', slaState: 'On Track',
    progressPercent: 0,
    checklist: [
      { label: 'Active task SLA data collected', done: false },
      { label: 'Breach and at-risk tasks identified', done: false },
      { label: 'Recovery actions drafted', done: false },
      { label: 'Summary document prepared', done: false },
    ],
    evidenceRequired: true,
    evidenceItems: [],
    blockers: [],
    comments: [],
    decisions: [],
    linkedKnowledge: ['SLA Management Guide'],
    closureQuality: 'Not Ready', lastUpdateAt: '2026-06-04', nextAction: 'Collect SLA data from active tasks and identify breach exposures.',
    auditEvents: [
      { id: 'AUD-7', timestamp: '2026-06-04T09:00:00Z', actor: currentUser, eventType: 'Created', description: 'Task created for SLA risk summary compilation.' },
    ],
  },
  {
    id: 'TSK-2405', title: 'Convert leadership decision into governed execution tasks',
    purpose: 'Translate the recent leadership decision on workspace redesign into structured, owned, reviewable execution tasks.',
    expectedOutput: 'Set of governed execution tasks with purpose, owner, checklist, due date, and evidence expectations.',
    owner: 'Ian Kipkorir', ownerRole: 'Unit Lead', ownerUnit: 'Digital Workspace',
    contributors: [currentUser, 'Bilal Waqar'],
    priority: 'Critical', status: 'In Progress', dueDate: '2026-06-09', slaState: 'At Risk',
    progressPercent: 50,
    checklist: [
      { label: 'Leadership decision documented', done: true },
      { label: 'Execution tasks defined', done: true },
      { label: 'Owners assigned', done: true },
      { label: 'Due dates and SLAs set', done: false },
      { label: 'Checklists and evidence expectations defined', done: false },
    ],
    evidenceRequired: true,
    evidenceItems: [
      { id: 'EV-303', title: 'Leadership decision summary', type: 'Decision Record', submittedBy: 'Ian Kipkorir', submittedAt: '2026-06-05', reviewStatus: 'Accepted' },
    ],
    blockers: [],
    comments: [
      { id: 'CMT-3', author: 'Ian Kipkorir', text: 'Three execution tasks defined. Owners confirmed. Due dates need alignment with sprint planning.', isDecision: false, timestamp: '2026-06-06T09:00:00Z' },
    ],
    decisions: [
      { id: 'DEC-2', author: 'Ian Kipkorir', text: 'Decision: Split workspace redesign into three parallel execution tracks.', isDecision: true, timestamp: '2026-06-05T15:00:00Z' },
    ],
    linkedKnowledge: ['DQ Ways of Working', 'Execution Task Standards'],
    closureQuality: 'Not Ready', lastUpdateAt: '2026-06-06', nextAction: 'Set due dates and SLAs for each execution task and define checklists.',
    auditEvents: [
      { id: 'AUD-8', timestamp: '2026-06-05T09:00:00Z', actor: 'Ian Kipkorir', eventType: 'Created', description: 'Task created to convert leadership decision.' },
      { id: 'AUD-9', timestamp: '2026-06-05T15:00:00Z', actor: 'Ian Kipkorir', eventType: 'Decision', description: 'Split decision recorded.' },
    ],
  },
  {
    id: 'TSK-2406', title: 'Attach SharePoint evidence for completed task outputs',
    purpose: 'Ensure all completed task outputs have SharePoint evidence links attached for audit readiness.',
    expectedOutput: 'All completed tasks have valid SharePoint evidence links and review status confirmed.',
    owner: 'Bilal Waqar', ownerRole: 'Scrum Master', ownerUnit: 'Digital Workspace',
    contributors: [],
    priority: 'Medium', status: 'In Progress', dueDate: '2026-06-15', slaState: 'On Track',
    progressPercent: 30,
    checklist: [
      { label: 'Completed tasks without evidence identified', done: true },
      { label: 'SharePoint links gathered', done: false },
      { label: 'Evidence review status confirmed', done: false },
    ],
    evidenceRequired: false,
    evidenceItems: [],
    blockers: [],
    comments: [],
    decisions: [],
    linkedKnowledge: ['Evidence Standards'],
    closureQuality: 'Not Ready', lastUpdateAt: '2026-06-05', nextAction: 'Gather SharePoint evidence links for completed tasks.',
    auditEvents: [
      { id: 'AUD-10', timestamp: '2026-06-05T09:00:00Z', actor: 'Bilal Waqar', eventType: 'Created', description: 'Task created for evidence attachment.' },
    ],
  },
  {
    id: 'TSK-2407', title: 'Resolve blocker on task template approval path',
    purpose: 'Remove the blocker preventing task template approval path from functioning correctly in the governance workflow.',
    expectedOutput: 'Task template approval path functional with no blockers and governance sign-off recorded.',
    owner: 'Daniel Okafor', ownerRole: 'Team Lead', ownerUnit: 'Operations Support',
    contributors: ['Grace Wanjiku'],
    priority: 'Critical', status: 'Blocked', dueDate: '2026-06-07', slaState: 'Breached',
    progressPercent: 35,
    checklist: [
      { label: 'Blocker root cause identified', done: true },
      { label: 'Fix implemented', done: false },
      { label: 'Approval path tested', done: false },
      { label: 'Governance sign-off obtained', done: false },
    ],
    evidenceRequired: true,
    evidenceItems: [
      { id: 'EV-304', title: 'Blocker root cause analysis', type: 'Decision Record', submittedBy: 'Daniel Okafor', submittedAt: '2026-06-06', reviewStatus: 'Pending' },
    ],
    blockers: [
      { id: 'BLK-2', reason: 'Approval path configuration conflict with latest governance rule update.', severity: 'Critical', owner: 'Grace Wanjiku', raisedBy: 'Daniel Okafor', raisedAt: '2026-06-05', age: '2 days', slaImpact: 'SLA breached. Template approval blocked.', resolutionPath: 'Resolve configuration conflict and retest approval path.', status: 'Escalated' },
    ],
    comments: [
      { id: 'CMT-4', author: 'Daniel Okafor', text: 'Root cause identified: governance rule update changed required approver field. Fix in progress.', isDecision: false, timestamp: '2026-06-06T14:00:00Z' },
    ],
    decisions: [],
    linkedKnowledge: ['Governance Review Playbook', 'Task Template Standards'],
    closureQuality: 'Not Ready', lastUpdateAt: '2026-06-06', nextAction: 'Implement fix for approval path configuration and test with governance rules.',
    auditEvents: [
      { id: 'AUD-11', timestamp: '2026-06-04T09:00:00Z', actor: 'Daniel Okafor', eventType: 'Created', description: 'Task created to resolve blocker.' },
      { id: 'AUD-12', timestamp: '2026-06-05T11:00:00Z', actor: 'Daniel Okafor', eventType: 'Blocked', description: 'Blocker raised: approval path configuration conflict.' },
      { id: 'AUD-13', timestamp: '2026-06-06T14:00:00Z', actor: 'Daniel Okafor', eventType: 'Updated', description: 'Root cause identified.' },
    ],
  },
  {
    id: 'TSK-2408', title: 'Review task hygiene gaps before governance session',
    purpose: 'Identify and prepare task hygiene gaps for review before the next governance session.',
    expectedOutput: 'Task hygiene gap report with weak definitions, missing updates, and closure quality issues.',
    owner: 'Bilal Waqar', ownerRole: 'Scrum Master', ownerUnit: 'Digital Workspace',
    contributors: [currentUser],
    priority: 'High', status: 'In Progress', dueDate: '2026-06-11', slaState: 'On Track',
    progressPercent: 55,
    checklist: [
      { label: 'Task definitions reviewed', done: true },
      { label: 'Missing updates identified', done: true },
      { label: 'Closure quality gaps flagged', done: false },
      { label: 'Hygiene report prepared', done: false },
    ],
    evidenceRequired: true,
    evidenceItems: [
      { id: 'EV-305', title: 'Task hygiene scan results', type: 'Completion Note', submittedBy: 'Bilal Waqar', submittedAt: '2026-06-06', reviewStatus: 'Pending' },
    ],
    blockers: [],
    comments: [
      { id: 'CMT-5', author: 'Bilal Waqar', text: 'Task definitions reviewed. Found 4 tasks with weak purpose statements and 2 with missing expected outputs.', isDecision: false, timestamp: '2026-06-06T16:00:00Z' },
    ],
    decisions: [],
    linkedKnowledge: ['Task Hygiene Standards', 'DQ Ways of Working'],
    closureQuality: 'Not Ready', lastUpdateAt: '2026-06-06', nextAction: 'Complete closure quality gap analysis and prepare hygiene report.',
    auditEvents: [
      { id: 'AUD-14', timestamp: '2026-06-04T09:00:00Z', actor: 'Bilal Waqar', eventType: 'Created', description: 'Task created for hygiene review.' },
    ],
  },
  {
    id: 'TSK-2409', title: 'Define expected outputs for DWS support queue triage',
    purpose: 'Establish clear expected outputs for DWS support queue triage tasks to improve closure quality.',
    expectedOutput: 'Documented expected outputs for each support queue triage task type with closure criteria.',
    owner: 'Omar Ali', ownerRole: 'Support Lead', ownerUnit: 'Support Operations',
    contributors: [],
    priority: 'Medium', status: 'Not Started', dueDate: '2026-06-18', slaState: 'On Track',
    progressPercent: 0,
    checklist: [
      { label: 'Support queue triage task types catalogued', done: false },
      { label: 'Expected outputs defined per type', done: false },
      { label: 'Closure criteria documented', done: false },
      { label: 'Peer review completed', done: false },
    ],
    evidenceRequired: true,
    evidenceItems: [],
    blockers: [],
    comments: [],
    decisions: [],
    linkedKnowledge: ['Support Operations Guide', 'Closure Quality Guide'],
    closureQuality: 'Not Ready', lastUpdateAt: '2026-06-03', nextAction: 'Catalogue support queue triage task types and begin defining expected outputs.',
    auditEvents: [
      { id: 'AUD-15', timestamp: '2026-06-03T09:00:00Z', actor: 'Omar Ali', eventType: 'Created', description: 'Task created for output definition.' },
    ],
  },
  {
    id: 'TSK-2410', title: 'Return incomplete task closure for evidence rework',
    purpose: 'Return tasks with incomplete closure evidence to owners with clear rework instructions.',
    expectedOutput: 'All incomplete closure tasks returned with rework instructions and owner notifications sent.',
    owner: 'Priya Menon', ownerRole: 'Closure Reviewer', ownerUnit: 'Risk and Control',
    contributors: [],
    priority: 'High', status: 'Returned', dueDate: '2026-06-09', slaState: 'At Risk',
    progressPercent: 70,
    checklist: [
      { label: 'Incomplete closures identified', done: true },
      { label: 'Rework instructions prepared', done: true },
      { label: 'Owners notified', done: true },
      { label: 'Rework deadline set', done: false },
    ],
    evidenceRequired: true,
    evidenceItems: [
      { id: 'EV-306', title: 'Closure evidence gap report', type: 'Completion Note', submittedBy: 'Priya Menon', submittedAt: '2026-06-07', reviewStatus: 'Accepted' },
    ],
    blockers: [],
    comments: [
      { id: 'CMT-6', author: 'Priya Menon', text: 'Three tasks returned for evidence rework. Owners notified via task comments.', isDecision: false, timestamp: '2026-06-07T10:00:00Z' },
    ],
    decisions: [
      { id: 'DEC-3', author: 'Priya Menon', text: 'Decision: Return TSK-2385, TSK-2390, TSK-2395 for evidence rework with 3-day deadline.', isDecision: true, timestamp: '2026-06-07T10:00:00Z' },
    ],
    linkedKnowledge: ['Evidence Standards', 'Closure Quality Guide'],
    closureQuality: 'Returned', lastUpdateAt: '2026-06-07', nextAction: 'Monitor rework progress and follow up with task owners.',
    auditEvents: [
      { id: 'AUD-16', timestamp: '2026-06-06T09:00:00Z', actor: 'Priya Menon', eventType: 'Created', description: 'Return rework task created.' },
      { id: 'AUD-17', timestamp: '2026-06-07T10:00:00Z', actor: 'Priya Menon', eventType: 'Returned', description: 'Three tasks returned for evidence rework.' },
    ],
  },
];

export const workingSessions: WorkingSession[] = [
  {
    id: 'WS-101', title: 'DWS Prototype Review', date: '2026-06-05', participants: [currentUser, 'Bilal Waqar', 'Ian Kipkorir'],
    linkedTaskId: 'TSK-2405', decisions: ['Workspace redesign will be split into three parallel tracks.'],
    actions: [
      { text: 'Define execution task due dates', state: 'Linked to Task', owner: currentUser },
      { text: 'Prepare governance session agenda', state: 'Needs Task', owner: 'Ian Kipkorir' },
    ],
  },
  {
    id: 'WS-102', title: 'Squad Stand-up', date: '2026-06-06', participants: [currentUser, 'Bilal Waqar'],
    decisions: ['Blocker on TSK-2407 escalated to Grace Wanjiku.'],
    actions: [
      { text: 'Follow up on blocker resolution', state: 'Linked to Task', owner: 'Daniel Okafor' },
      { text: 'Update task hygiene report', state: 'Follow-up Only' },
    ],
  },
  {
    id: 'WS-103', title: 'Governance Review Working Session', date: '2026-06-04', participants: ['Priya Menon', currentUser, 'Ian Kipkorir'],
    decisions: ['Closure quality standards reinforced for Q2 review.'],
    actions: [
      { text: 'Review overdue closure evidence', state: 'Linked to Task', owner: 'Priya Menon' },
      { text: 'Return incomplete task closures', state: 'Linked to Task', owner: 'Priya Menon' },
    ],
  },
];

export function getTasksByAssignee(owner: string): TaskRecord[] {
  return governedTasks.filter((t) => t.owner === owner);
}

export function getTasksByStatus(status: TaskStatus): TaskRecord[] {
  return governedTasks.filter((t) => t.status === status);
}

export function getBlockedTasks(): TaskRecord[] {
  return governedTasks.filter((t) => t.blockers.some((b) => b.status !== 'Resolved'));
}

export function getTasksDueSoon(): TaskRecord[] {
  return governedTasks.filter((t) => t.slaState === 'At Risk' || t.slaState === 'Breached');
}

export function getTaskById(id: string): TaskRecord | undefined {
  return governedTasks.find((t) => t.id === id);
}
