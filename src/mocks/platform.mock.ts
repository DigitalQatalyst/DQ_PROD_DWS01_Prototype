import type {
  Persona,
  User,
  Unit,
  Team,
  Task,
  RequestRecord,
  Approval,
  WorkflowItem,
  Queue,
  KnowledgeAsset,
  AuditEvent,
  KpiSet } from
'../types/platform';

export const personas: Persona[] = [
{
  id: 'associate',
  name: 'Amina Hassan',
  role: 'Associate',
  tier: 'Operator',
  unit: 'eCom.DXP',
  defaultRoute: '/workspace/my-work',
  navDomains: ['Workspace', 'Marketplaces', 'Knowledge']
},
{
  id: 'scrum-master',
  name: 'David Mwangi',
  role: 'Scrum Master',
  tier: 'Domain Leader',
  unit: 'eCom.DXP',
  defaultRoute: '/workspace/agile-execution',
  navDomains: ['Tasks', 'Workflow Centre', 'Intelligence']
},
{
  id: 'team-lead',
  name: 'Priya Nair',
  role: 'Team / Squad Lead',
  tier: 'Domain Leader',
  unit: 'eCom.DXP',
  defaultRoute: '/operations/team-execution',
  navDomains: ['Tasks', 'Workflow Centre', 'Intelligence']
},
{
  id: 'unit-lead',
  name: 'Omar Farouk',
  role: 'Unit Lead',
  tier: 'Domain Leader',
  unit: 'Digital Platforms',
  defaultRoute: '/operations/unit-visibility',
  navDomains: ['Tasks', 'Workflow Centre', 'Intelligence', 'Audit']
},
{
  id: 'hra',
  name: 'Grace Wanjiru',
  role: 'HRA',
  tier: 'Domain Leader',
  unit: 'HRA',
  defaultRoute: '/operations/hra-workflow',
  navDomains: ['Services', 'Requests', 'Knowledge', 'Intelligence']
},
{
  id: 'admin',
  name: 'Elena Costa',
  role: 'Admins',
  tier: 'Platform Control',
  unit: 'Platform Governance',
  defaultRoute: '/admin/console',
  navDomains: ['Administration', 'Audit', 'Workflow Centre', 'Automation']
},
{
  id: 'support',
  name: 'Brian Otieno',
  role: 'Support',
  tier: 'Operator',
  unit: 'Support Operations',
  defaultRoute: '/support/operations',
  navDomains: ['Services', 'Support Queues', 'Knowledge', 'Workflow Centre']
},
{
  id: 'ceo',
  name: 'CEO View',
  role: 'CEO',
  tier: 'Executive',
  unit: 'Enterprise',
  defaultRoute: '/executive/enterprise-execution',
  navDomains: ['Executive Intelligence', 'Governance', 'Audit']
}];


export const users: User[] = [
{
  id: 'USR-001',
  name: 'Amina Hassan',
  role: 'Associate',
  unitId: 'UNT-001',
  teamId: 'TM-001',
  personaId: 'associate'
},
{
  id: 'USR-002',
  name: 'David Mwangi',
  role: 'Scrum Master',
  unitId: 'UNT-001',
  teamId: 'TM-001',
  personaId: 'scrum-master'
},
{
  id: 'USR-003',
  name: 'Priya Nair',
  role: 'Team / Squad Lead',
  unitId: 'UNT-001',
  teamId: 'TM-001',
  personaId: 'team-lead'
},
{
  id: 'USR-004',
  name: 'Omar Farouk',
  role: 'Unit Lead',
  unitId: 'UNT-001',
  personaId: 'unit-lead'
},
{
  id: 'USR-005',
  name: 'Grace Wanjiru',
  role: 'HRA',
  unitId: 'UNT-002',
  personaId: 'hra'
},
{
  id: 'USR-006',
  name: 'Elena Costa',
  role: 'Admins',
  unitId: 'UNT-003',
  personaId: 'admin'
},
{
  id: 'USR-007',
  name: 'Brian Otieno',
  role: 'Support',
  unitId: 'UNT-004',
  personaId: 'support'
},
{
  id: 'USR-008',
  name: 'CEO View',
  role: 'CEO',
  unitId: 'UNT-000',
  personaId: 'ceo'
}];


export const units: Unit[] = [
{
  id: 'UNT-000',
  name: 'Enterprise',
  leadUserId: 'USR-008',
  health: 'Watch',
  outcomeIds: ['OUT-6001']
},
{
  id: 'UNT-001',
  name: 'Digital Platforms',
  leadUserId: 'USR-004',
  health: 'Watch',
  outcomeIds: ['OUT-6001']
},
{
  id: 'UNT-002',
  name: 'HRA',
  leadUserId: 'USR-005',
  health: 'On Track',
  outcomeIds: []
},
{
  id: 'UNT-003',
  name: 'Platform Governance',
  leadUserId: 'USR-006',
  health: 'On Track',
  outcomeIds: []
},
{
  id: 'UNT-004',
  name: 'Support Operations',
  leadUserId: 'USR-007',
  health: 'At Risk',
  outcomeIds: []
}];


export const teams: Team[] = [
{
  id: 'TM-001',
  name: 'eCom.DXP Squad',
  unitId: 'UNT-001',
  leadUserId: 'USR-003',
  flowHealth: 'At Risk'
},
{
  id: 'TM-002',
  name: 'DWS Core Squad',
  unitId: 'UNT-001',
  leadUserId: 'USR-004',
  flowHealth: 'On Track'
}];


export const tasks: Task[] = [
{
  id: 'TSK-1001',
  title: 'Build Stage 0 orientation shell',
  purpose: 'Validate entry and orientation for all DWS.01 users',
  ownerUserId: 'USR-001',
  reviewerUserId: 'USR-003',
  teamId: 'TM-001',
  status: 'In Progress',
  priority: 'High',
  slaState: 'On Track',
  dueDate: '2026-05-13',
  expectedOutput: 'Clickable Stage 0 shell with role next-step routing',
  checklistDone: 4,
  checklistTotal: 6,
  evidenceState: 'Partial',
  knowledgeIds: ['KNO-001', 'KNO-002']
},
{
  id: 'TSK-1002',
  title: 'Finalise request intake card patterns',
  purpose: 'Define request cards for services marketplace',
  ownerUserId: 'USR-001',
  reviewerUserId: 'USR-007',
  teamId: 'TM-001',
  status: 'Blocked',
  priority: 'Critical',
  slaState: 'At Risk',
  dueDate: '2026-05-14',
  expectedOutput:
  'Service cards with category, owner, SLA, required inputs, and submit action',
  checklistDone: 2,
  checklistTotal: 7,
  evidenceState: 'Missing',
  blockerId: 'BLK-101',
  requestId: 'REQ-2001',
  knowledgeIds: ['KNO-003']
},
{
  id: 'TSK-1003',
  title: 'Review closure quality model',
  purpose: 'Confirm closure criteria for governed task completion',
  ownerUserId: 'USR-002',
  reviewerUserId: 'USR-003',
  teamId: 'TM-001',
  status: 'Review Needed',
  priority: 'High',
  slaState: 'On Track',
  dueDate: '2026-05-15',
  expectedOutput: 'Closure quality matrix linked to task review console',
  checklistDone: 5,
  checklistTotal: 5,
  evidenceState: 'Attached',
  knowledgeIds: ['KNO-001']
},
{
  id: 'TSK-1004',
  title: 'Prepare governance dashboard copy',
  purpose: 'Make governance health visible to leads and CEO',
  ownerUserId: 'USR-003',
  reviewerUserId: 'USR-004',
  teamId: 'TM-001',
  status: 'Missing Update',
  priority: 'Medium',
  slaState: 'Breached',
  dueDate: '2026-05-11',
  expectedOutput:
  'Dashboard content for SLA, audit, closure, and blocker indicators',
  checklistDone: 3,
  checklistTotal: 8,
  evidenceState: 'Partial',
  knowledgeIds: []
},
{
  id: 'TSK-1005',
  title: 'Align HRA onboarding request flow',
  purpose: 'Connect new joiner journey to HRA request fulfilment',
  ownerUserId: 'USR-005',
  reviewerUserId: 'USR-006',
  teamId: 'TM-002',
  status: 'In Progress',
  priority: 'High',
  slaState: 'On Track',
  dueDate: '2026-05-17',
  expectedOutput:
  'HRA workflow view with onboarding checklist and readiness status',
  checklistDone: 6,
  checklistTotal: 9,
  evidenceState: 'Attached',
  requestId: 'REQ-2002',
  knowledgeIds: ['KNO-002']
},
{
  id: 'TSK-1006',
  title:
  'Map Discovery Search result groups with a deliberately long task name to test truncation behaviour in table and cards',
  purpose: 'Validate long string handling',
  ownerUserId: 'USR-006',
  teamId: 'TM-002',
  status: 'Draft',
  priority: 'Medium',
  slaState: 'On Track',
  dueDate: '2026-05-20',
  expectedOutput:
  'Search groups for services, templates, knowledge, dashboards, and owners',
  checklistDone: 0,
  checklistTotal: 6,
  evidenceState: 'Missing',
  knowledgeIds: []
}];


export const requests: RequestRecord[] = [
{
  id: 'REQ-2001',
  category: 'Task / Workflow Support',
  title: 'Help resolve blocked request intake task',
  requesterUserId: 'USR-001',
  ownerUserId: 'USR-007',
  queueId: 'QUE-5001',
  status: 'Pending Info',
  urgency: 'High',
  slaState: 'At Risk',
  expectedOutcome: 'Request intake task unblocked and routed correctly',
  linkedTaskId: 'TSK-1002'
},
{
  id: 'REQ-2002',
  category: 'HRA Requests',
  title: 'New joiner onboarding checklist validation',
  requesterUserId: 'USR-001',
  ownerUserId: 'USR-005',
  queueId: 'QUE-5002',
  status: 'In Review',
  urgency: 'Medium',
  slaState: 'On Track',
  expectedOutcome: 'Onboarding checklist approved for DWS.01 orientation'
},
{
  id: 'REQ-2003',
  category: 'IT & Access Requests',
  title: 'Grant access to DWS prototype review workspace',
  requesterUserId: 'USR-003',
  ownerUserId: 'USR-007',
  queueId: 'QUE-5001',
  status: 'New',
  urgency: 'Medium',
  slaState: 'On Track',
  expectedOutcome: 'Reviewer can access prototype validation workspace'
},
{
  id: 'REQ-2004',
  category: 'Platform Support',
  title: 'Fix broken route in governance dashboard placeholder',
  requesterUserId: 'USR-004',
  ownerUserId: 'USR-007',
  queueId: 'QUE-5001',
  status: 'Routed',
  urgency: 'High',
  slaState: 'At Risk',
  expectedOutcome: 'Dashboard placeholder route resolves without dead end'
},
{
  id: 'REQ-2005',
  category: 'Knowledge / Content Requests',
  title: 'Update evidence attachment standard',
  requesterUserId: 'USR-005',
  ownerUserId: 'USR-006',
  queueId: 'QUE-5003',
  status: 'Closed',
  urgency: 'Low',
  slaState: 'Met',
  expectedOutcome: 'Evidence guidance updated and linked to task shell'
}];


export const approvals: Approval[] = [
{
  id: 'APR-3001',
  type: 'Task Closure Review',
  status: 'Pending',
  approverUserId: 'USR-003',
  linkedTaskId: 'TSK-1003'
},
{
  id: 'APR-3002',
  type: 'HRA Request Approval',
  status: 'Returned',
  approverUserId: 'USR-005',
  linkedRequestId: 'REQ-2002',
  rationale: 'Policy acknowledgement evidence is missing.'
},
{
  id: 'APR-3003',
  type: 'SLA Rule Change',
  status: 'Approved',
  approverUserId: 'USR-006',
  rationale: 'Approved for prototype governance testing.'
}];


export const workflows: WorkflowItem[] = [
{
  id: 'WF-4001',
  name: 'Task Closure Workflow',
  state: 'Evidence Review',
  slaLabel: '12h left',
  linkedTaskId: 'TSK-1003',
  approvalId: 'APR-3001'
},
{
  id: 'WF-4002',
  name: 'New Joiner Onboarding',
  state: 'Policy Check',
  slaLabel: '2d left',
  linkedRequestId: 'REQ-2002',
  approvalId: 'APR-3002'
},
{
  id: 'WF-4003',
  name: 'Escalation Review',
  state: 'Lead Intervention',
  slaLabel: 'Breached by 6h',
  linkedRequestId: 'REQ-2004'
}];


export const queues: Queue[] = [
{
  id: 'QUE-5001',
  name: 'Central Support Queue',
  ownerPersonaIds: ['support', 'admin'],
  newCount: 8,
  atRiskCount: 3,
  requestIds: ['REQ-2001', 'REQ-2003', 'REQ-2004']
},
{
  id: 'QUE-5002',
  name: 'HRA Fulfilment Queue',
  ownerPersonaIds: ['hra', 'admin'],
  newCount: 4,
  atRiskCount: 1,
  requestIds: ['REQ-2002']
},
{
  id: 'QUE-5003',
  name: 'Knowledge Content Queue',
  ownerPersonaIds: ['support', 'hra', 'admin'],
  newCount: 2,
  atRiskCount: 0,
  requestIds: ['REQ-2005']
}];


export const knowledgeAssets: KnowledgeAsset[] = [
{
  id: 'KNO-001',
  title: 'Agile TMS Task Discipline Guide',
  type: 'GHC Reference',
  status: 'Effective',
  tags: ['GHC', 'Task Quality', 'Closure'],
  linkedTaskIds: ['TSK-1001', 'TSK-1003']
},
{
  id: 'KNO-002',
  title: '6xD Execution Reference',
  type: '6xD Reference',
  status: 'Effective',
  tags: ['6xD', 'Orientation', 'DQ Ways of Working'],
  linkedTaskIds: ['TSK-1001', 'TSK-1005']
},
{
  id: 'KNO-003',
  title: 'Evidence Attachment Standard',
  type: 'Playbook',
  status: 'Under Review',
  tags: ['Evidence', 'Audit', 'Closure Quality'],
  linkedTaskIds: ['TSK-1002']
},
{
  id: 'KNO-004',
  title: 'Role Transition Checklist',
  type: 'Template',
  status: 'Draft',
  tags: ['HRA', 'Onboarding', 'Readiness'],
  linkedTaskIds: []
}];


export const auditEvents: AuditEvent[] = [
{
  id: 'AUD-7001',
  event: 'Role permission updated',
  actorUserId: 'USR-006',
  timestamp: '2026-05-13 09:25',
  entityType: 'Config',
  entityId: 'CFG-9001',
  severity: 'Info'
},
{
  id: 'AUD-7002',
  event: 'Closure review requested',
  actorUserId: 'USR-002',
  timestamp: '2026-05-13 10:15',
  entityType: 'Task',
  entityId: 'TSK-1003',
  severity: 'Info'
},
{
  id: 'AUD-7003',
  event: 'HRA request returned for missing policy evidence',
  actorUserId: 'USR-005',
  timestamp: '2026-05-13 11:05',
  entityType: 'Request',
  entityId: 'REQ-2002',
  severity: 'Warning'
},
{
  id: 'AUD-7004',
  event: 'SLA breach detected for governance dashboard copy',
  actorUserId: 'USR-006',
  timestamp: '2026-05-13 11:40',
  entityType: 'Task',
  entityId: 'TSK-1004',
  severity: 'Critical'
}];


export const kpiSets: KpiSet[] = [
{
  id: 'KPI-8001',
  name: 'Enterprise Execution',
  scope: 'Enterprise',
  metrics: [
  { label: 'SLA On Track', value: '84%', trend: '+6%', status: 'success' },
  { label: 'Blocked Work', value: '11', trend: '-4', status: 'warning' },
  { label: 'Closure Quality', value: '76%', trend: '+9%', status: 'info' },
  {
    label: 'Governance Exceptions',
    value: '7',
    trend: '+2',
    status: 'danger'
  }]

},
{
  id: 'KPI-8002',
  name: 'Team Execution',
  scope: 'eCom.DXP Squad',
  metrics: [
  { label: 'Open Tasks', value: '28', trend: '+5', status: 'info' },
  { label: 'Missing Updates', value: '6', trend: '-2', status: 'warning' },
  { label: 'Evidence Missing', value: '9', trend: '+1', status: 'danger' },
  { label: 'Ready for Review', value: '4', trend: '+3', status: 'success' }]

},
{
  id: 'KPI-8003',
  name: 'Support Fulfilment',
  scope: 'Support Operations',
  metrics: [
  { label: 'New Requests', value: '8', trend: '+2', status: 'info' },
  { label: 'At Risk', value: '3', trend: '+1', status: 'warning' },
  { label: 'Closed Today', value: '12', trend: '+4', status: 'success' },
  { label: 'Pending Info', value: '5', trend: '-1', status: 'warning' }]

}];