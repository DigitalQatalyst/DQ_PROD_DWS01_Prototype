import type {
  OwnerQueueView,
  RequestCategory,
  SlaRecord,
  ProgressUpdate,
  EvidenceRecord,
  HandoffEvent,
  EscalationRecord,
  ClosureReviewRecord,
  LinkedWorkRecord,
  HealthSignal,
  ConfigReference,
} from '../types/requestsConsole';

// ─── 6.3 Owner Queue Views ──────────────────────────────────────────

export const ownerQueueViews: OwnerQueueView[] = [
  { id: 'FQVIEW-001', queueName: 'Platform Support Queue', queueType: 'Fulfilment', owner: 'Brian Otieno', activeItems: 9, slaExposure: '3 at risk', closureQuality: '71% accepted', linkedRequestId: 'REQ-FUL-2001' },
  { id: 'FQVIEW-002', queueName: 'Knowledge Queue', queueType: 'Fulfilment', owner: 'Grace Wanjiru', activeItems: 4, slaExposure: '1 due soon', closureQuality: '82% accepted', linkedRequestId: 'REQ-FUL-2002' },
  { id: 'FQVIEW-003', queueName: 'Task / Workflow Queue', queueType: 'Fulfilment', owner: 'Priya Nair', activeItems: 6, slaExposure: '2 at risk', closureQuality: '76% accepted', linkedRequestId: 'REQ-FUL-2003' },
  { id: 'FQVIEW-004', queueName: 'Approval Support Queue', queueType: 'Fulfilment', owner: 'Omar Farouk', activeItems: 5, slaExposure: '2 breached', closureQuality: '70% accepted', linkedRequestId: 'REQ-FUL-2004' },
  { id: 'FQVIEW-005', queueName: 'HRA Queue', queueType: 'Fulfilment', owner: 'HRA Owner', activeItems: 3, slaExposure: '0 at risk', closureQuality: '90% accepted', linkedRequestId: 'REQ-FUL-2005' },
  { id: 'FQVIEW-006', queueName: 'Admin Queue', queueType: 'Fulfilment', owner: 'Workspace Admin', activeItems: 5, slaExposure: '1 at risk', closureQuality: '78% accepted', linkedRequestId: 'REQ-FUL-2006' },
];

// ─── 6.4 Request Categories ─────────────────────────────────────────

export const requestCategories: RequestCategory[] = [
  { id: 'CAT-FUL-001', category: 'HRA Request', defaultQueue: 'HRA Queue', defaultSla: '2 business days', ownerRole: 'Service Owner', linkedQueueId: 'FQVIEW-005' },
  { id: 'CAT-FUL-002', category: 'IT & Access Request', defaultQueue: 'Platform Support Queue', defaultSla: '4 hours', ownerRole: 'Service Owner', linkedQueueId: 'FQVIEW-001' },
  { id: 'CAT-FUL-003', category: 'Platform Support', defaultQueue: 'Platform Support Queue', defaultSla: '8 hours', ownerRole: 'Service Owner', linkedQueueId: 'FQVIEW-001' },
  { id: 'CAT-FUL-004', category: 'Knowledge / Content Request', defaultQueue: 'Knowledge Queue', defaultSla: '3 business days', ownerRole: 'Service Owner', linkedQueueId: 'FQVIEW-002' },
  { id: 'CAT-FUL-005', category: 'Task / Workflow Support', defaultQueue: 'Task / Workflow Queue', defaultSla: '1 business day', ownerRole: 'Service Owner', linkedQueueId: 'FQVIEW-003' },
  { id: 'CAT-FUL-006', category: 'Approval Support', defaultQueue: 'Approval Support Queue', defaultSla: '1 business day', ownerRole: 'Lead', linkedQueueId: 'FQVIEW-004' },
  { id: 'CAT-FUL-007', category: 'Admin Request', defaultQueue: 'Admin Queue', defaultSla: '2 business days', ownerRole: 'Workspace Admin', linkedQueueId: 'FQVIEW-006' },
];

// ─── 6.5 SLA Records ────────────────────────────────────────────────

export const slaRecords: SlaRecord[] = [
  { id: 'SLA-FUL-4001', requestId: 'REQ-FUL-2001', slaState: 'At Risk', started: 'Today 09:00', due: 'Today 13:00', timeRemaining: '45 mins', breachState: 'Not breached' },
  { id: 'SLA-FUL-4002', requestId: 'REQ-FUL-2002', slaState: 'Due Soon', started: 'Yesterday 15:00', due: 'Tomorrow 15:00', timeRemaining: '1 day', breachState: 'Not breached' },
  { id: 'SLA-FUL-4003', requestId: 'REQ-FUL-2003', slaState: 'On Track', started: 'Today 10:00', due: 'Tomorrow 10:00', timeRemaining: '1 day', breachState: 'Not breached' },
  { id: 'SLA-FUL-4004', requestId: 'REQ-FUL-2004', slaState: 'Breached', started: 'Yesterday 09:00', due: 'Yesterday 17:00', timeRemaining: '0', breachState: 'Breached' },
  { id: 'SLA-FUL-4005', requestId: 'REQ-FUL-2005', slaState: 'Completed', started: 'Earlier', due: 'Completed', timeRemaining: 'N/A', breachState: 'Completed' },
  { id: 'SLA-FUL-4006', requestId: 'REQ-FUL-2006', slaState: 'On Track', started: 'Today 11:00', due: '+2 business days', timeRemaining: '2 days', breachState: 'Not breached' },
  { id: 'SLA-FUL-4007', requestId: 'REQ-FUL-2007', slaState: 'At Risk', started: 'Today 07:30', due: 'Today 15:30', timeRemaining: '2h', breachState: 'Not breached' },
  { id: 'SLA-FUL-4008', requestId: 'REQ-FUL-2008', slaState: 'On Track', started: 'Today 08:00', due: 'Today 16:00', timeRemaining: '5h', breachState: 'Not breached' },
];

// ─── 6.6 Progress Updates ───────────────────────────────────────────

export const progressUpdates: ProgressUpdate[] = [
  { id: 'PRG-3001', requestId: 'REQ-FUL-2001', updateType: 'Status Update', note: 'Access role confirmed; waiting for final permission update.', actor: 'Brian Otieno', statusAfter: 'In Fulfilment' },
  { id: 'PRG-3002', requestId: 'REQ-FUL-2002', updateType: 'Evidence Update', note: 'Draft evidence attached for knowledge update.', actor: 'Grace Wanjiru', statusAfter: 'Evidence Added' },
  { id: 'PRG-3003', requestId: 'REQ-FUL-2003', updateType: 'Blocker', note: 'Workflow owner unclear; waiting for ownership confirmation.', actor: 'Priya Nair', statusAfter: 'Blocked' },
  { id: 'PRG-3004', requestId: 'REQ-FUL-2004', updateType: 'Escalation', note: 'Approval owner mismatch is blocking closure.', actor: 'Omar Farouk', statusAfter: 'Escalated' },
  { id: 'PRG-3005', requestId: 'REQ-FUL-2006', updateType: 'Closure Submission', note: 'Admin role update completed and ready for closure review.', actor: 'Workspace Admin', statusAfter: 'Closure Review' },
  { id: 'PRG-3006', requestId: 'REQ-FUL-2008', updateType: 'Evidence Update', note: 'Navigation bug fix verified on staging.', actor: 'Brian Otieno', statusAfter: 'Evidence Added' },
];

// ─── 6.7 Evidence Records ───────────────────────────────────────────

export const evidenceRecords: EvidenceRecord[] = [
  { id: 'EVD-6001', requestId: 'REQ-FUL-2008', evidenceState: 'Added', evidenceNote: 'Screenshot and verification note captured.', outcomeStatement: 'Navigation issue resolved.', quality: 'Accepted' },
  { id: 'EVD-6002', requestId: 'REQ-FUL-2002', evidenceState: 'Pending', evidenceNote: 'Draft evidence requires review.', outcomeStatement: 'Knowledge update in progress.', quality: 'Pending' },
  { id: 'EVD-6003', requestId: 'REQ-FUL-2001', evidenceState: 'Pending', evidenceNote: 'Permission update note pending.', outcomeStatement: 'Access fulfilment pending.', quality: 'Not Ready' },
  { id: 'EVD-6004', requestId: 'REQ-FUL-2007', evidenceState: 'Weak', evidenceNote: 'Evidence does not explain recurrence root cause.', outcomeStatement: 'Access issue recurred.', quality: 'Weak' },
  { id: 'EVD-6005', requestId: 'REQ-FUL-2005', evidenceState: 'Accepted', evidenceNote: 'Policy clarification sent and acknowledged.', outcomeStatement: 'Request completed.', quality: 'Accepted' },
];

// ─── 6.8 Handoff / Reassignment Events ──────────────────────────────

export const handoffEvents: HandoffEvent[] = [
  { id: 'HND-5001', requestId: 'REQ-FUL-2003', fromOwner: 'Priya Nair', toOwner: 'Omar Farouk', fromQueue: 'Task / Workflow Queue', toQueue: 'Approval Support Queue', reason: 'Ownership unclear', status: 'Pending' },
  { id: 'HND-5002', requestId: 'REQ-FUL-2001', fromOwner: 'Support Operator', toOwner: 'Brian Otieno', fromQueue: 'Central Support Queue', toQueue: 'Platform Support Queue', reason: 'Routed after triage', status: 'Complete' },
  { id: 'HND-5003', requestId: 'REQ-FUL-2006', fromOwner: 'Support Operator', toOwner: 'Workspace Admin', fromQueue: 'Central Support Queue', toQueue: 'Admin Queue', reason: 'Admin category mapping', status: 'Complete' },
  { id: 'HND-5004', requestId: 'REQ-FUL-2002', fromOwner: 'Support Operator', toOwner: 'Grace Wanjiru', fromQueue: 'Central Support Queue', toQueue: 'Knowledge Queue', reason: 'Knowledge owner required', status: 'Complete' },
];

// ─── 6.9 Escalation Records ─────────────────────────────────────────

export const escalationRecords: EscalationRecord[] = [
  { id: 'ESC-FUL-5001', requestId: 'REQ-FUL-2004', reason: 'Approval owner correction breached SLA', severity: 'High', slaImpact: 'Breached', owner: 'Lead', resolutionPath: 'Reassign approver and close blocker' },
  { id: 'ESC-FUL-5002', requestId: 'REQ-FUL-2007', reason: 'Recurring access failure after fulfilment', severity: 'High', slaImpact: 'At Risk', owner: 'Lead', resolutionPath: 'Review fulfilment quality and root cause' },
  { id: 'ESC-FUL-5003', requestId: 'REQ-FUL-2001', reason: 'Access fulfilment may breach SLA', severity: 'Medium', slaImpact: 'At Risk', owner: 'Brian Otieno', resolutionPath: 'Complete permission update before breach' },
  { id: 'ESC-FUL-5004', requestId: 'REQ-FUL-2003', reason: 'Workflow owner unclear', severity: 'Medium', slaImpact: 'On Track', owner: 'Priya Nair', resolutionPath: 'Confirm ownership and handoff' },
];

// ─── 6.10 Closure Review Records ────────────────────────────────────

export const closureReviewRecords: ClosureReviewRecord[] = [
  { id: 'CLR-FUL-8001', requestId: 'REQ-FUL-2005', evidenceQuality: 'Accepted', outcomeQuality: 'Accepted', closureStatus: 'Closed', reviewer: 'Support Operator', reopenReason: '' },
  { id: 'CLR-FUL-8002', requestId: 'REQ-FUL-2006', evidenceQuality: 'Accepted', outcomeQuality: 'Pending Review', closureStatus: 'Closure Review', reviewer: 'Lead', reopenReason: '' },
  { id: 'CLR-FUL-8003', requestId: 'REQ-FUL-2007', evidenceQuality: 'Weak', outcomeQuality: 'Failed', closureStatus: 'Reopened', reviewer: 'Lead', reopenReason: 'Access issue recurred after fulfilment' },
  { id: 'CLR-FUL-8004', requestId: 'REQ-FUL-2002', evidenceQuality: 'Pending', outcomeQuality: 'Pending', closureStatus: 'Pending Review', reviewer: 'Support Operator', reopenReason: '' },
  { id: 'CLR-FUL-8005', requestId: 'REQ-FUL-2004', evidenceQuality: 'Missing', outcomeQuality: 'Failed', closureStatus: 'Not Ready', reviewer: 'Lead', reopenReason: 'Approval still blocked' },
];

// ─── 6.11 Linked Work Records ───────────────────────────────────────

export const linkedWorkRecords: LinkedWorkRecord[] = [
  { id: 'LWK-FUL-1001', requestId: 'REQ-FUL-2001', linkedItem: 'TSK-2401 — Access role confirmation', type: 'Task', status: 'In Progress', relationship: 'Fulfilment task' },
  { id: 'LWK-FUL-1002', requestId: 'REQ-FUL-2002', linkedItem: 'KNO-002 — Evidence Attachment Standard', type: 'Knowledge', status: 'Effective', relationship: 'Reference source' },
  { id: 'LWK-FUL-1003', requestId: 'REQ-FUL-2004', linkedItem: 'APR-3001 — Access review', type: 'Approval', status: 'Awaiting Review', relationship: 'Blocked approval' },
  { id: 'LWK-FUL-1004', requestId: 'REQ-FUL-2003', linkedItem: 'WFL-2402 — Workflow routing correction', type: 'Workflow', status: 'In Progress', relationship: 'Related workflow' },
  { id: 'LWK-FUL-1005', requestId: 'REQ-FUL-2007', linkedItem: 'ESC-FUL-5002 — Recurring access issue', type: 'Escalation', status: 'Active', relationship: 'Reopened escalation' },
];

// ─── 6.12 Fulfilment Health Signals ─────────────────────────────────

export const healthSignals: HealthSignal[] = [
  { id: 'SIG-FUL-9001', signal: 'Active fulfilment requests', value: 27, status: 'Info', linkedRoute: '/stage-03/requests-console' },
  { id: 'SIG-FUL-9002', signal: 'SLA at-risk fulfilment requests', value: 6, status: 'Warning', linkedRoute: '/stage-03/requests-console?tab=Escalated' },
  { id: 'SIG-FUL-9003', signal: 'Breached fulfilment requests', value: 2, status: 'Danger', linkedRoute: '/stage-03/requests-console?tab=Escalated' },
  { id: 'SIG-FUL-9004', signal: 'Blocked requests', value: 4, status: 'Warning', linkedRoute: '/stage-03/requests-console?tab=Blocked' },
  { id: 'SIG-FUL-9005', signal: 'Requests in closure review', value: 5, status: 'Info', linkedRoute: '/stage-03/requests-console?tab=Closure+Review' },
  { id: 'SIG-FUL-9006', signal: 'Reopened requests', value: 3, status: 'Warning', linkedRoute: '/stage-03/requests-console?tab=Closed+/+Reopened' },
  { id: 'SIG-FUL-9007', signal: 'Closure quality accepted', value: '76%', status: 'Warning', linkedRoute: '/stage-03/requests-console' },
  { id: 'SIG-FUL-9008', signal: 'Owner load above threshold', value: '2 owners', status: 'Warning', linkedRoute: '/stage-03/requests-console' },
];

// ─── 6.13 Request Configuration Reference ───────────────────────────

export const configReferences: ConfigReference[] = [
  { id: 'CFG-FUL-7001', ruleType: 'Category Mapping', name: 'IT & Access → Platform Support Queue', owner: 'Workspace Admin', status: 'Active', linkedId: 'CAT-FUL-002' },
  { id: 'CFG-FUL-7002', ruleType: 'SLA Rule', name: 'High Priority Access = 4 hours', owner: 'Workspace Admin', status: 'Active', linkedId: 'SLA-FUL-4001' },
  { id: 'CFG-FUL-7003', ruleType: 'Owner Mapping', name: 'Platform Support Queue → Brian Otieno', owner: 'Workspace Admin', status: 'Active', linkedId: 'FQVIEW-001' },
  { id: 'CFG-FUL-7004', ruleType: 'Handoff Rule', name: 'Ownership unclear → Handoff with reason', owner: 'Workspace Admin', status: 'Active', linkedId: 'HND-5001' },
  { id: 'CFG-FUL-7005', ruleType: 'Escalation Rule', name: 'Breached SLA → Lead Escalation', owner: 'Workspace Admin', status: 'Active', linkedId: 'ESC-FUL-5001' },
  { id: 'CFG-FUL-7006', ruleType: 'Closure Rule', name: 'Evidence and outcome required before closure', owner: 'Workspace Admin', status: 'Active', linkedId: 'CLR-FUL-8001' },
];
