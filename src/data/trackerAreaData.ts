export type TrackerClass = 'Executive' | 'Lead' | 'Associate';
export type TrackerSlaState = 'On Track' | 'At Risk' | 'Breached' | 'Resolved';
export type RiskReason = 'Gap' | 'Blocker' | 'Missing Evidence' | 'Missing Owner' | 'SLA Breach' | 'No Update';
export type RequestCategory = 'HRA' | 'IT & Access' | 'Platform Support' | 'Knowledge' | 'Admin' | 'Approval' | 'Escalation';
export type AgeBucket = '1 day' | '2-3 days' | '4-7 days' | '8+ days';
export type SlaTimeBand = 'Less than 4 hours' | 'Due today' | 'Due tomorrow' | 'Due this week';
export type BlockerSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type DecisionStatus = 'Proposed' | 'Under Review' | 'Approved' | 'Actioned' | 'Superseded' | 'Rejected';
export type EvidenceStatus = 'Missing' | 'Submitted' | 'Accepted' | 'Returned';
export type ClosureState = 'Closure pending' | 'Evidence missing' | 'Returned' | 'Closed accepted';

export interface TrackerSourceMeta {
  sourceFile: string;
  version: string;
  lastModified: string;
  modifiedBy: string;
}

export interface TrackerAuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  eventType: string;
  description: string;
}

export interface TrackerEvidence {
  id: string;
  title: string;
  type: string;
  status: EvidenceStatus;
  submittedBy?: string;
  submittedAt?: string;
}

export interface TrackerRow {
  id: string;
  title: string;
  trackerName: string;
  trackerClass: TrackerClass;
  itemType: string;
  owner: string;
  status: string;
  progress: number;
  gap?: string;
  evidence: string;
  nextAction: string;
  source: TrackerSourceMeta;
  riskReason?: RiskReason;
  daysOpen?: number;
  lastUpdate?: string;
  timeRemaining?: string;
  slaState?: TrackerSlaState;
  category?: RequestCategory;
  severity?: BlockerSeverity;
  ageBucket?: AgeBucket;
  slaBand?: SlaTimeBand;
  closureNote?: string;
  closedAt?: string;
  closedBy?: string;
  auditEvents?: TrackerAuditEvent[];
  evidenceItems?: TrackerEvidence[];
}

export interface TrackerDocument {
  id: string;
  name: string;
  trackerClass: TrackerClass;
  owner: string;
  version: string;
  sourceFile: string;
  rowCount: number;
  lastOpened?: string;
  status: string;
}

export interface TeamTrackerTab {
  id: string;
  label: string;
  documentId: string;
}

export interface TeamMemberWorkload {
  name: string;
  open: number;
  atRisk: number;
  blocked: number;
  overdue: number;
}

export interface WorkingSession {
  id: string;
  title: string;
  date: string;
  participants: string[];
  actionCount: number;
  convertedCount: number;
}

export interface SessionAction {
  id: string;
  sessionId: string;
  text: string;
  owner: string;
  conversionStatus: 'Unlinked' | 'Linked to Task' | 'Linked to Request' | 'Follow-up Only';
  linkedRecord?: string;
}

export interface MeetingGroup {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  decisions: string[];
  followUps: Array<{ id: string; text: string; owner: string; status: string; completionNote?: string; linkedRecords?: string[] }>;
}

export interface RequestDraft {
  id: string;
  title: string;
  category: RequestCategory;
  completionLevel: 'Almost ready' | 'Missing key fields' | 'Stale drafts';
  missingFields: string[];
  sourceFile: string;
  version: string;
  lastEdited: string;
}

export interface RequestRecord {
  id: string;
  title: string;
  category: RequestCategory;
  stage: string;
  owner: string;
  sla: TrackerSlaState;
  slaRemaining?: string;
  fulfilmentNotes?: string;
  linkedRecords?: string[];
  auditEvents?: Array<{ timestamp: string; event: string; user: string }>;
  lifecycleStages?: Array<{ id: string; label: string; status: 'complete' | 'current' | 'pending' }>;
  closureState?: string;
}

export interface PendingInfoRecord {
  id: string;
  title: string;
  waitingOn: 'Requester' | 'Fulfilment owner' | 'Approval owner';
  missingFields: string[];
  daysPending: number;
  slaImpact: string;
  owner: string;
}

export interface BlockerRecord {
  id: string;
  title: string;
  severity: BlockerSeverity;
  owner: string;
  daysOpen: number;
  lastUpdate: string;
  reason: string;
  resolutionPath?: string;
  hasRecoveryPlan?: boolean;
}

export interface SlaRecord {
  id: string;
  title: string;
  owner: string;
  timeRemaining: string;
  slaBand: SlaTimeBand;
  slaState: TrackerSlaState;
  breachReason?: string;
  recoveryPlan?: string;
  resolutionNote?: string;
  quality?: 'Resolved with evidence' | 'Resolved after breach' | 'Resolved without evidence' | 'Recurring issue flagged';
}

export interface DecisionRecord {
  id: string;
  title: string;
  source: string;
  category: string;
  status: DecisionStatus;
  rationale: string;
  owner: string;
  linkedRecords: string[];
  auditEvents: TrackerAuditEvent[];
}

export interface OutcomeRecord {
  id: string;
  title: string;
  baseline: string;
  currentProgress: string;
  progressPercent: number;
  evidenceState: string;
  nextMilestone: string;
  linkedTasks: string[];
}

export const currentUser = 'Amina Hassan';

export const TRACKER_CLASSES: TrackerClass[] = ['Executive', 'Lead', 'Associate'];
export const REQUEST_CATEGORIES: RequestCategory[] = ['HRA', 'IT & Access', 'Platform Support', 'Knowledge', 'Admin', 'Approval', 'Escalation'];
export const RISK_REASONS: RiskReason[] = ['Gap', 'Blocker', 'Missing Evidence', 'Missing Owner', 'SLA Breach', 'No Update'];
export const AGE_BUCKETS: AgeBucket[] = ['1 day', '2-3 days', '4-7 days', '8+ days'];
export const SLA_TIME_BANDS: SlaTimeBand[] = ['Less than 4 hours', 'Due today', 'Due tomorrow', 'Due this week'];
export const TEAM_TRACKER_TABS: TeamTrackerTab[] = [
  { id: 'wip', label: 'WiP Backlog', documentId: 'DOC-WIP' },
  { id: 'team', label: 'Team Backlog', documentId: 'DOC-TEAM' },
  { id: 'perf', label: 'Team Performance Backlog', documentId: 'DOC-PERF' },
  { id: 'features', label: 'Features Backlog', documentId: 'DOC-FEAT' },
];

const src = (file: string, version = 'v2.1'): TrackerSourceMeta => ({
  sourceFile: file,
  version,
  lastModified: '2026-06-07',
  modifiedBy: 'System',
});

export const trackerDocuments: TrackerDocument[] = [
  { id: 'DOC-WIP', name: 'WiP Backlog', trackerClass: 'Lead', owner: 'Daniel Okafor', version: 'v3.2', sourceFile: 'wip-backlog.xlsx', rowCount: 42, lastOpened: '2026-06-08', status: 'Active' },
  { id: 'DOC-TEAM', name: 'Team Backlog', trackerClass: 'Lead', owner: 'Daniel Okafor', version: 'v2.8', sourceFile: 'team-backlog.xlsx', rowCount: 38, lastOpened: '2026-06-07', status: 'Active' },
  { id: 'DOC-EXEC', name: 'Executive Trackers', trackerClass: 'Executive', owner: 'Priya Menon', version: 'v1.4', sourceFile: 'exec-trackers.xlsx', rowCount: 15, lastOpened: '2026-06-06', status: 'Active' },
  { id: 'DOC-REQ', name: 'Request Status Tracker', trackerClass: 'Associate', owner: currentUser, version: 'v4.1', sourceFile: 'request-tracker.xlsx', rowCount: 28, lastOpened: '2026-06-08', status: 'Active' },
  { id: 'DOC-FU', name: 'Follow-up Register', trackerClass: 'Associate', owner: currentUser, version: 'v2.3', sourceFile: 'followup-register.xlsx', rowCount: 19, status: 'Active' },
];

export const trackerRows: TrackerRow[] = [
  { id: 'TRK-101', title: 'Request status pending update', trackerName: 'Request Status Tracker', trackerClass: 'Associate', itemType: 'Request', owner: currentUser, status: 'Open', progress: 45, gap: 'Missing fulfilment note', evidence: 'Partial', nextAction: 'Add fulfilment update', source: src('request-tracker.xlsx'), riskReason: 'Gap' },
  { id: 'TRK-142', title: 'Working session follow-up overdue', trackerName: 'Follow-up Register', trackerClass: 'Associate', itemType: 'Follow-up', owner: currentUser, status: 'Overdue', progress: 30, evidence: 'None', nextAction: 'Complete follow-up note', source: src('followup-register.xlsx'), riskReason: 'No Update', daysOpen: 5 },
  { id: 'BLK-119', title: 'Active blocker ageing beyond threshold', trackerName: 'Blocker Tracker', trackerClass: 'Lead', itemType: 'Blocker', owner: 'Daniel Okafor', status: 'Open', progress: 10, gap: 'No resolution path', evidence: 'None', nextAction: 'Assign resolution owner', source: src('blocker-tracker.xlsx'), riskReason: 'Blocker', severity: 'High', daysOpen: 8 },
  { id: 'REQ-2271', title: 'HRA request awaiting required inputs', trackerName: 'Request Status Tracker', trackerClass: 'Associate', itemType: 'Request', owner: 'Nadia Ali', status: 'Awaiting Input', progress: 55, gap: 'Employee ID missing', evidence: 'Partial', nextAction: 'Request missing info', source: src('request-tracker.xlsx'), category: 'HRA', slaState: 'At Risk', riskReason: 'Missing Evidence' },
  { id: 'DEC-077', title: 'Decision awaiting confirmation', trackerName: 'Decision Log', trackerClass: 'Executive', itemType: 'Decision', owner: 'Priya Menon', status: 'Under Review', progress: 70, evidence: 'Submitted', nextAction: 'Confirm decision rationale', source: src('decision-log.xlsx', 'v1.2') },
  { id: 'OUT-305', title: 'Outcome evidence pending review', trackerName: 'Outcome Progress', trackerClass: 'Executive', itemType: 'Outcome', owner: 'Michael Chen', status: 'In Progress', progress: 62, gap: 'Evidence not accepted', evidence: 'Submitted', nextAction: 'Review evidence pack', source: src('outcome-tracker.xlsx'), riskReason: 'Missing Evidence' },
  { id: 'TRK-201', title: 'Platform access provisioning', trackerName: 'Request Status Tracker', trackerClass: 'Associate', itemType: 'Request', owner: 'Ibrahim Njoroge', status: 'In Progress', progress: 80, evidence: 'Partial', nextAction: 'Complete provisioning', source: src('request-tracker.xlsx'), category: 'IT & Access', slaState: 'On Track' },
  { id: 'TRK-202', title: 'Knowledge article update', trackerName: 'Knowledge Tracker', trackerClass: 'Lead', itemType: 'Request', owner: 'Grace Wanjiku', status: 'Open', progress: 25, evidence: 'None', nextAction: 'Draft article content', source: src('knowledge-tracker.xlsx'), category: 'Knowledge' },
];

export const myRowInbox: TrackerRow[] = trackerRows.filter((r) => r.owner === currentUser || r.status === 'Overdue');

export const teamMemberWorkloads: TeamMemberWorkload[] = [
  { name: 'Amina Shah', open: 8, atRisk: 2, blocked: 1, overdue: 0 },
  { name: 'Daniel Okafor', open: 12, atRisk: 4, blocked: 2, overdue: 2 },
  { name: 'Priya Menon', open: 6, atRisk: 1, blocked: 0, overdue: 0 },
  { name: 'Michael Chen', open: 10, atRisk: 3, blocked: 1, overdue: 1 },
  { name: 'Grace Wanjiku', open: 7, atRisk: 2, blocked: 3, overdue: 1 },
];

export const closedItems: TrackerRow[] = [
  { id: 'TRK-089', title: 'GHC onboarding closure', trackerName: 'Request Status Tracker', trackerClass: 'Associate', itemType: 'Request', owner: currentUser, status: 'Closed', progress: 100, evidence: 'Accepted', nextAction: '—', source: src('request-tracker.xlsx', 'v4.0'), closureNote: 'All checklist items complete with HRA sign-off.', closedAt: '2026-06-03', closedBy: currentUser, auditEvents: [{ id: 'A1', timestamp: '2026-06-03T14:00:00Z', actor: currentUser, eventType: 'Closed', description: 'Closure accepted with evidence.' }], evidenceItems: [{ id: 'EV-01', title: 'HRA confirmation', type: 'Approval Note', status: 'Accepted', submittedBy: currentUser, submittedAt: '2026-06-03' }] },
  { id: 'FU-044', title: 'Meeting follow-up completed', trackerName: 'Follow-up Register', trackerClass: 'Associate', itemType: 'Follow-up', owner: 'Daniel Okafor', status: 'Closed', progress: 100, evidence: 'Accepted', nextAction: '—', source: src('followup-register.xlsx'), closureNote: 'Linked to TSK-2401 with completion proof.', closedAt: '2026-05-28', closedBy: 'Daniel Okafor' },
];

export const requestRecords: RequestRecord[] = [
  { id: 'REQ-2198', title: 'Access approval pending', category: 'HRA', stage: 'Approval', owner: 'Amina Shah', sla: 'On Track', slaRemaining: '2 days', fulfilmentNotes: 'Awaiting manager approval.', linkedRecords: ['TSK-2401'], lifecycleStages: [{ id: 'submitted', label: 'Submitted', status: 'complete' }, { id: 'triage', label: 'Triage', status: 'complete' }, { id: 'fulfilment', label: 'Fulfilment', status: 'current' }, { id: 'approval', label: 'Approval', status: 'pending' }, { id: 'closed', label: 'Closed', status: 'pending' }], auditEvents: [{ timestamp: '2026-06-01', event: 'Submitted', user: currentUser }] },
  { id: 'REQ-2271', title: 'Employee setup awaiting info', category: 'HRA', stage: 'Awaiting Input', owner: 'Nadia Ali', sla: 'At Risk', slaRemaining: '6 hours', fulfilmentNotes: 'Employee ID required from requester.', linkedRecords: [], lifecycleStages: [{ id: 'submitted', label: 'Submitted', status: 'complete' }, { id: 'triage', label: 'Triage', status: 'complete' }, { id: 'fulfilment', label: 'Fulfilment', status: 'current' }, { id: 'approval', label: 'Approval', status: 'pending' }, { id: 'closed', label: 'Closed', status: 'pending' }] },
  { id: 'REQ-2304', title: 'Access configuration', category: 'Platform Support', stage: 'Fulfilment', owner: 'Ibrahim Njoroge', sla: 'On Track', slaRemaining: '1 day' },
  { id: 'REQ-2310', title: 'Knowledge article request', category: 'Knowledge', stage: 'Triage', owner: 'Grace Wanjiku', sla: 'On Track' },
  { id: 'REQ-2315', title: 'Admin policy update', category: 'Admin', stage: 'Approval', owner: 'Priya Menon', sla: 'At Risk', slaRemaining: '4 hours' },
];

export const requestDrafts: RequestDraft[] = [
  { id: 'DRF-101', title: 'New associate access request', category: 'IT & Access', completionLevel: 'Almost ready', missingFields: ['Manager approval reference'], sourceFile: 'request-drafts.xlsx', version: 'v0.9', lastEdited: '2026-06-07' },
  { id: 'DRF-102', title: 'Platform support escalation', category: 'Platform Support', completionLevel: 'Missing key fields', missingFields: ['Impact description', 'Affected users', 'Business justification'], sourceFile: 'request-drafts.xlsx', version: 'v0.4', lastEdited: '2026-06-05' },
  { id: 'DRF-103', title: 'HRA policy clarification', category: 'HRA', completionLevel: 'Stale drafts', missingFields: ['Request type', 'Policy reference', 'Urgency'], sourceFile: 'request-drafts.xlsx', version: 'v0.2', lastEdited: '2026-05-20' },
];

export const pendingInfoRecords: PendingInfoRecord[] = [
  { id: 'REQ-2271', title: 'Employee setup awaiting info', waitingOn: 'Requester', missingFields: ['Employee ID', 'Start date'], daysPending: 3, slaImpact: 'SLA at risk — 6 hours remaining', owner: 'Nadia Ali' },
  { id: 'REQ-2288', title: 'Platform config missing specs', waitingOn: 'Fulfilment owner', missingFields: ['Environment details'], daysPending: 1, slaImpact: 'On track', owner: 'Ibrahim Njoroge' },
  { id: 'REQ-2295', title: 'Approval pending sign-off docs', waitingOn: 'Approval owner', missingFields: ['Signed approval form'], daysPending: 5, slaImpact: 'SLA breached', owner: 'Priya Menon' },
];

export const workingSessions: WorkingSession[] = [
  { id: 'WS-301', title: 'Sprint planning session', date: '2026-06-06', participants: [currentUser, 'Daniel Okafor', 'Priya Menon'], actionCount: 5, convertedCount: 2 },
  { id: 'WS-298', title: 'Governance review', date: '2026-06-04', participants: [currentUser, 'Michael Chen'], actionCount: 3, convertedCount: 1 },
];

export const sessionActions: SessionAction[] = [
  { id: 'ACT-501', sessionId: 'WS-301', text: 'Update WiP backlog priorities', owner: currentUser, conversionStatus: 'Linked to Task', linkedRecord: 'TSK-2401' },
  { id: 'ACT-502', sessionId: 'WS-301', text: 'Create HRA routing request', owner: 'Daniel Okafor', conversionStatus: 'Unlinked' },
  { id: 'ACT-503', sessionId: 'WS-301', text: 'Schedule follow-up review', owner: currentUser, conversionStatus: 'Follow-up Only' },
];

export const meetingGroups: MeetingGroup[] = [
  { id: 'MTG-101', title: 'Weekly Team Standup', date: '2026-06-06', attendees: [currentUser, 'Daniel Okafor', 'Grace Wanjiku'], decisions: ['Prioritize blocker resolution for BLK-119'], followUps: [{ id: 'FU-201', text: 'Resolve BLK-119 by Friday', owner: 'Daniel Okafor', status: 'Open', linkedRecords: ['BLK-119'] }, { id: 'FU-202', text: 'Update team backlog sheet', owner: currentUser, status: 'In Progress' }] },
  { id: 'MTG-098', title: 'Governance Checkpoint', date: '2026-06-04', attendees: [currentUser, 'Priya Menon', 'Michael Chen'], decisions: ['Approve outcome tracking approach'], followUps: [{ id: 'FU-198', text: 'Document outcome baseline', owner: 'Michael Chen', status: 'Completed', completionNote: 'Baseline documented in outcome tracker v1.2', linkedRecords: ['OUT-305'] }] },
];

export const followUpRows: TrackerRow[] = [
  { id: 'FU-201', title: 'Resolve BLK-119 by Friday', trackerName: 'Follow-up Register', trackerClass: 'Associate', itemType: 'Follow-up', owner: 'Daniel Okafor', status: 'Open', progress: 20, evidence: 'None', nextAction: 'Assign resolution owner', source: src('followup-register.xlsx'), daysOpen: 2 },
  { id: 'FU-202', title: 'Update team backlog sheet', trackerName: 'Follow-up Register', trackerClass: 'Associate', itemType: 'Follow-up', owner: currentUser, status: 'In Progress', progress: 60, evidence: 'Partial', nextAction: 'Complete row updates', source: src('followup-register.xlsx') },
  { id: 'FU-190', title: 'Review SLA mitigation plan', trackerName: 'Follow-up Register', trackerClass: 'Associate', itemType: 'Follow-up', owner: currentUser, status: 'Overdue', progress: 10, evidence: 'None', nextAction: 'Send reminder to owner', source: src('followup-register.xlsx'), daysOpen: 9, ageBucket: '8+ days' },
];

export const blockerRecords: BlockerRecord[] = [
  { id: 'BLK-119', title: 'Dependency on external vendor', severity: 'Critical', owner: 'Daniel Okafor', daysOpen: 8, lastUpdate: '2026-06-05', reason: 'Vendor SLA exceeded', resolutionPath: 'Escalate to vendor manager' },
  { id: 'BLK-121', title: 'Missing approval authority', severity: 'High', owner: 'Priya Menon', daysOpen: 3, lastUpdate: '2026-06-07', reason: 'Approver unavailable' },
  { id: 'BLK-124', title: 'Environment access delay', severity: 'Medium', owner: 'Ibrahim Njoroge', daysOpen: 1, lastUpdate: '2026-06-08', reason: 'IT queue backlog' },
];

export const slaRecords: SlaRecord[] = [
  { id: 'SLA-401', title: 'HRA request fulfilment', owner: 'Nadia Ali', timeRemaining: '3h 45m', slaBand: 'Less than 4 hours', slaState: 'At Risk' },
  { id: 'SLA-402', title: 'Platform support ticket', owner: 'Ibrahim Njoroge', timeRemaining: 'End of day', slaBand: 'Due today', slaState: 'At Risk' },
  { id: 'SLA-403', title: 'Knowledge article review', owner: 'Grace Wanjiku', timeRemaining: 'Tomorrow 5pm', slaBand: 'Due tomorrow', slaState: 'On Track' },
  { id: 'SLA-410', title: 'Admin policy update', owner: 'Priya Menon', timeRemaining: '—', slaBand: 'Due today', slaState: 'Breached', breachReason: 'Approval delay' },
  { id: 'SLA-415', title: 'Access provisioning', owner: 'Amina Shah', timeRemaining: '—', slaBand: 'Due this week', slaState: 'Resolved', quality: 'Resolved with evidence', resolutionNote: 'Completed with evidence attached.' },
];

export const decisionRecords: DecisionRecord[] = [
  { id: 'DEC-077', title: 'Approve outcome tracking approach', source: 'Governance Checkpoint', category: 'Governance', status: 'Under Review', rationale: 'Standardize outcome evidence requirements across teams.', owner: 'Priya Menon', linkedRecords: ['OUT-305'], auditEvents: [{ id: 'DA1', timestamp: '2026-06-04T10:00:00Z', actor: 'Michael Chen', eventType: 'Proposed', description: 'Decision proposed in governance meeting.' }] },
  { id: 'DEC-080', title: 'Defer platform migration phase 2', source: 'Architecture Review', category: 'Technical', status: 'Approved', rationale: 'Resource constraints require phased approach.', owner: 'Daniel Okafor', linkedRecords: ['TSK-2401', 'REQ-2304'], auditEvents: [{ id: 'DA2', timestamp: '2026-06-01T14:00:00Z', actor: 'Daniel Okafor', eventType: 'Approved', description: 'Decision approved by architecture board.' }] },
];

export const outcomeRecords: OutcomeRecord[] = [
  { id: 'OUT-305', title: 'GHC onboarding compliance', baseline: '65% associates onboarded within SLA', currentProgress: '78% associates onboarded within SLA', progressPercent: 78, evidenceState: 'Submitted — pending review', nextMilestone: '90% by Q3', linkedTasks: ['TSK-2401'] },
  { id: 'OUT-310', title: 'Platform uptime improvement', baseline: '99.2% uptime', currentProgress: '99.5% uptime', progressPercent: 85, evidenceState: 'Accepted', nextMilestone: '99.7% by end of month', linkedTasks: ['REQ-2304'] },
];

export const evidenceRecords: Array<TrackerRow & { evidenceStatus: EvidenceStatus }> = [
  { id: 'EV-301', title: 'GHC profile screenshot', trackerName: 'Outcome Progress', trackerClass: 'Executive', itemType: 'Evidence', owner: currentUser, status: 'Submitted', progress: 100, evidence: 'Submitted', nextAction: 'Await review', source: src('outcome-tracker.xlsx'), evidenceStatus: 'Submitted' },
  { id: 'EV-302', title: 'Uptime report Q2', trackerName: 'Outcome Progress', trackerClass: 'Executive', itemType: 'Evidence', owner: 'Michael Chen', status: 'Accepted', progress: 100, evidence: 'Accepted', nextAction: '—', source: src('outcome-tracker.xlsx'), evidenceStatus: 'Accepted' },
  { id: 'EV-303', title: 'Completion note missing', trackerName: 'Follow-up Register', trackerClass: 'Associate', itemType: 'Evidence', owner: 'Daniel Okafor', status: 'Open', progress: 0, evidence: 'Missing', nextAction: 'Submit evidence', source: src('followup-register.xlsx'), evidenceStatus: 'Missing' },
];

export const interventionPlaybooks: Record<RiskReason, string[]> = {
  Gap: ['Review gap description with owner', 'Define closure criteria', 'Set recovery date'],
  Blocker: ['Assign resolution owner', 'Document resolution path', 'Escalate if ageing > 5 days'],
  'Missing Evidence': ['Request evidence from owner', 'Attach template guidance', 'Set evidence deadline'],
  'Missing Owner': ['Assign owner from team roster', 'Notify new owner', 'Update tracker sheet'],
  'SLA Breach': ['Document breach reason', 'Create recovery plan', 'Notify governance lead'],
  'No Update': ['Send update request', 'Schedule check-in', 'Escalate to line manager'],
};
