export const strategicAspirations = [
{ id: 'ASP-001', title: 'Improve DQ execution discipline' },
{ id: 'ASP-002', title: 'Improve internal service routing' },
{ id: 'ASP-003', title: 'Improve new hire readiness' },
{ id: 'ASP-004', title: 'Reduce execution risk' }];


export const objectives = [
{ id: 'OBJ-001', title: 'Increase governed task completeness' },
{ id: 'OBJ-002', title: 'Standardise service request intake' },
{ id: 'OBJ-003', title: 'Complete onboarding before work assignment' },
{ id: 'OBJ-004', title: 'Improve unit delivery health' },
{ id: 'OBJ-005', title: 'Reduce SLA-at-risk work' }];


export const outcomes = [
{
  id: 'OUT-6001',
  title: 'Improve task governance completeness',
  progress: 72
},
{ id: 'OUT-6002', title: 'Reduce incomplete requests', progress: 58 },
{ id: 'OUT-6003', title: 'Faster workspace readiness', progress: 60 },
{ id: 'OUT-6004', title: 'Improve SLA and closure quality', progress: 84 },
{ id: 'OUT-6005', title: 'Improve SLA adherence', progress: 69 }];


export const executionRegisters = [
{ id: 'REG-001', title: 'DWS.01 Prototype Readiness Register' },
{ id: 'REG-002', title: 'Request Intake Maturity Register' },
{ id: 'REG-003', title: 'New Joiner Readiness Register' },
{ id: 'REG-004', title: 'Digital Platforms Execution Health Register' },
{ id: 'REG-005', title: 'SLA Exposure Reduction Register' }];


export const registerItems = [
{
  id: 'RI-001',
  title: 'Stage 0 activation readiness',
  registerId: 'REG-001'
},
{
  id: 'RI-002',
  title: 'Service intake standardisation',
  registerId: 'REG-002'
},
{ id: 'RI-003', title: 'Closure quality readiness', registerId: 'REG-001' },
{ id: 'RI-004', title: 'SLA exposure reporting', registerId: 'REG-005' },
{
  id: 'RI-005',
  title: 'New joiner onboarding readiness',
  registerId: 'REG-003'
}];


export const customSectionTemplates = [
'Objectives',
'Risks & Dependencies',
'Milestones',
'Review Notes',
'Strategic Contribution',
'HRA Readiness',
'Support Fulfilment'];


export const dynamicFieldLibrary = [
{
  id: 'FLD-001',
  label: 'Objective Statement',
  type: 'Long text',
  required: true,
  editableBy: 'Team Lead, Unit Lead, Admin'
},
{
  id: 'FLD-002',
  label: 'KPI Target',
  type: 'Number/Text',
  required: false,
  editableBy: 'Team Lead, Unit Lead, Admin'
},
{
  id: 'FLD-003',
  label: 'Linked Register Item',
  type: 'Linked record',
  required: true,
  editableBy: 'Lead/Admin'
},
{
  id: 'FLD-004',
  label: 'Evidence Type',
  type: 'Select',
  required: true,
  editableBy: 'Lead/Admin'
},
{
  id: 'FLD-005',
  label: 'Risk Rating',
  type: 'Select',
  required: false,
  editableBy: 'Owner/Lead'
},
{
  id: 'FLD-006',
  label: 'Milestone Date',
  type: 'Date',
  required: false,
  editableBy: 'Owner/Lead'
},
{
  id: 'FLD-007',
  label: 'Closure Criteria',
  type: 'Long text',
  required: true,
  editableBy: 'Lead/Admin'
},
{
  id: 'FLD-008',
  label: 'Strategic Contribution Note',
  type: 'Long text',
  required: false,
  editableBy: 'Owner/Lead/CEO note'
}];


export const governedTasks = [
{
  id: 'TSK-1001',
  title: 'Build Stage 0 orientation shell',
  status: 'In Progress',
  priority: 'High',
  owner: 'Amina Hassan',
  ownerUserId: 'USR-001',
  contributors: ['USR-002', 'USR-003'],
  reviewer: 'USR-003',
  team: 'DWS Core Squad',
  unit: 'Digital Platforms',
  dueDate: '2026-05-20',
  slaState: 'On Track',
  evidenceState: 'Partial',
  structureScore: 86,
  closureQuality: 'Not ready',
  purpose:
  'Validate the Stage 0 entry experience so every DQ user understands what DWS.01 is, how work is governed, what matters for their role, and where to go next.',
  expectedOutput:
  'Clickable Stage 0 shell with role-aware routing, new-joiner onboarding, quick resume, and governed work rules.',
  strategicAspirationId: 'ASP-001',
  objectiveId: 'OBJ-001',
  outcomeId: 'OUT-6001',
  registerId: 'REG-001',
  registerItemId: 'RI-001',
  contributionType: 'Prototype validation',
  kpiTarget:
  'Stage 0 validates role-aware onboarding, quick resume, and governed work routing.',
  contributionStatus: 'In Progress',
  taskObjectives: [
  {
    id: 'OBJ-TASK-001',
    statement: 'Confirm Stage 0 entry value',
    target: 'Stakeholders understand the platform entry purpose',
    owner: 'Amina Hassan',
    status: 'In Progress'
  },
  {
    id: 'OBJ-TASK-002',
    statement: 'Validate role-aware routing',
    target: 'Every persona has a clear next destination',
    owner: 'Amina Hassan',
    status: 'Review Needed'
  }],

  checklist: [
  { id: 1, label: 'Confirm task purpose', group: 'Setup', done: true },
  { id: 2, label: 'Confirm expected output', group: 'Setup', done: true },
  { id: 3, label: 'Link strategic context', group: 'Setup', done: true },
  {
    id: 4,
    label: 'Review linked knowledge',
    group: 'Execution',
    done: true
  },
  { id: 5, label: 'Add progress update', group: 'Execution', done: false },
  { id: 6, label: 'Attach evidence', group: 'Evidence', done: false },
  { id: 7, label: 'Request closure review', group: 'Closure', done: false }],

  updates: [
  {
    id: 1,
    author: 'Amina Hassan',
    role: 'Associate',
    timestamp: '2 hours ago',
    type: 'Progress',
    text: 'Stage 0 hero and routing structure completed.'
  }],

  blocker: null,
  evidence: [
  {
    name: 'stage0_wireframes.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploader: 'Amina Hassan',
    timestamp: '1 day ago',
    note: 'Initial structural wireframes.'
  }],

  approval: null,
  linkedKnowledge: [
  {
    id: 'KNO-001',
    title: 'Agile TMS Task Discipline Guide',
    type: 'Playbook',
    status: 'Effective',
    owner: 'Platform Governance'
  },
  {
    id: 'KNO-003',
    title: 'Evidence Attachment Standard',
    type: 'Standard',
    status: 'Effective',
    owner: 'Platform Governance'
  },
  {
    id: 'KNO-004',
    title: 'Closure Quality Review Guide',
    type: 'Guide',
    status: 'Effective',
    owner: 'Platform Governance'
  }],

  customSections: [
  {
    id: 'SEC-001',
    name: 'Objectives',
    fieldCount: 2,
    required: true,
    visibleTo: 'All',
    editableBy: 'Lead/Admin',
    lastUpdated: '2026-05-10',
    fields: [
    {
      id: 'F-1',
      label: 'Primary Objective',
      type: 'Long text',
      value: 'Validate Stage 0 shell',
      required: true,
      editableBy: 'Lead/Admin',
      visibility: 'All',
      lastUpdated: '2026-05-10'
    }]

  }],

  audit: [
  {
    timestamp: '2026-05-01 09:00',
    actor: 'David Mwangi',
    action: 'Task created',
    object: 'TSK-1001',
    eventId: 'EVT-001'
  },
  {
    timestamp: '2026-05-01 09:05',
    actor: 'David Mwangi',
    action: 'Owner assigned',
    object: 'Amina Hassan',
    eventId: 'EVT-002'
  },
  {
    timestamp: '2026-05-02 10:00',
    actor: 'Priya Nair',
    action: 'Strategic context linked',
    object: 'ASP-001',
    eventId: 'EVT-003'
  }],

  changeHistory: [
  {
    version: 'v1.1',
    changedBy: 'Priya Nair',
    date: '2026-05-02',
    summary: 'Linked strategic context',
    affectedSection: 'Strategic Context',
    reason: 'Alignment with Q2 goals'
  }],

  closureScores: {
    output: 'Pending',
    strategic: 'Complete',
    objective: 'Pending',
    evidence: 'Partial',
    checklist: '4/7',
    sla: 'On Track',
    review: 'Not ready'
  }
},
{
  id: 'TSK-1002',
  title: 'Finalise request intake card pattern',
  status: 'Blocked',
  priority: 'High',
  owner: 'Amina Hassan',
  ownerUserId: 'USR-001',
  contributors: [],
  reviewer: 'USR-003',
  team: 'DWS Core Squad',
  unit: 'Digital Platforms',
  dueDate: '2026-05-18',
  slaState: 'At Risk',
  evidenceState: 'Missing',
  structureScore: 68,
  closureQuality: 'Not ready',
  purpose: 'Standardise how requests are captured.',
  expectedOutput: 'Reusable request intake card component.',
  strategicAspirationId: 'ASP-002',
  objectiveId: 'OBJ-002',
  outcomeId: 'OUT-6002',
  registerId: 'REG-002',
  registerItemId: 'RI-002',
  contributionType: 'Component delivery',
  kpiTarget: 'All new requests use standard card.',
  contributionStatus: 'Blocked',
  taskObjectives: [],
  checklist: [
  { id: 1, label: 'Confirm task purpose', group: 'Setup', done: true },
  { id: 2, label: 'Attach evidence', group: 'Evidence', done: false }],

  updates: [],
  blocker: {
    id: 'BLK-101',
    severity: 'High',
    owner: 'David Mwangi',
    age: '2 days',
    desc: 'Request intake card pattern blocked by missing fulfilment rule.',
    path: 'Confirm routing rule and update request template.',
    escalated: false
  },
  evidence: [],
  approval: null,
  linkedKnowledge: [],
  customSections: [],
  audit: [
  {
    timestamp: '2026-05-05 09:00',
    actor: 'David Mwangi',
    action: 'Task created',
    object: 'TSK-1002',
    eventId: 'EVT-101'
  }],

  changeHistory: [
  {
    version: 'v1.0',
    changedBy: 'David Mwangi',
    date: '2026-05-05',
    summary: 'Task created',
    affectedSection: 'Core',
    reason: 'New requirement'
  }],

  closureScores: {
    output: 'Pending',
    strategic: 'Pending',
    objective: 'Pending',
    evidence: 'Missing',
    checklist: '1/2',
    sla: 'At Risk',
    review: 'Not ready'
  }
},
{
  id: 'TSK-1003',
  title: 'Review closure quality model',
  status: 'Review Needed',
  priority: 'Medium',
  owner: 'David Mwangi',
  ownerUserId: 'USR-002',
  contributors: [],
  reviewer: 'USR-003',
  team: 'DWS Core Squad',
  unit: 'Digital Platforms',
  dueDate: '2026-05-15',
  slaState: 'On Track',
  evidenceState: 'Complete',
  structureScore: 94,
  closureQuality: 'Ready for review',
  purpose: 'Ensure closure criteria are robust.',
  expectedOutput: 'Approved closure quality model document.',
  strategicAspirationId: 'ASP-001',
  objectiveId: 'OBJ-001',
  outcomeId: 'OUT-6001',
  registerId: 'REG-001',
  registerItemId: 'RI-003',
  contributionType: 'Governance model',
  kpiTarget: '100% of tasks have closure criteria.',
  contributionStatus: 'Review Needed',
  taskObjectives: [],
  checklist: [
  { id: 1, label: 'Confirm task purpose', group: 'Setup', done: true },
  { id: 2, label: 'Attach evidence', group: 'Evidence', done: true },
  { id: 3, label: 'Request closure review', group: 'Closure', done: true }],

  updates: [
  {
    id: 1,
    author: 'David Mwangi',
    role: 'Scrum Master',
    timestamp: '1 day ago',
    type: 'Review',
    text: 'Model is ready for final review.'
  }],

  blocker: null,
  evidence: [
  {
    name: 'closure_model_v2.pdf',
    type: 'PDF',
    size: '1.2 MB',
    uploader: 'David Mwangi',
    timestamp: '1 day ago',
    note: 'Final model for approval.'
  }],

  approval: {
    type: 'Closure Review Approval',
    approver: 'Priya Nair',
    status: 'Pending',
    date: '-',
    rationale: 'Pending review of attached model.'
  },
  linkedKnowledge: [],
  customSections: [],
  audit: [
  {
    timestamp: '2026-05-10 09:00',
    actor: 'David Mwangi',
    action: 'Closure review requested',
    object: 'TSK-1003',
    eventId: 'EVT-201'
  }],

  changeHistory: [
  {
    version: 'v1.2',
    changedBy: 'David Mwangi',
    date: '2026-05-10',
    summary: 'Attached evidence',
    affectedSection: 'Evidence',
    reason: 'Ready for closure'
  }],

  closureScores: {
    output: 'Complete',
    strategic: 'Complete',
    objective: 'Complete',
    evidence: 'Complete',
    checklist: '3/3',
    sla: 'On Track',
    review: 'Pending'
  }
},
{
  id: 'TSK-1004',
  title: 'Prepare governance dashboard copy',
  status: 'Missing Update',
  priority: 'Medium',
  owner: 'Priya Nair',
  ownerUserId: 'USR-003',
  contributors: [],
  reviewer: 'USR-004',
  team: 'DWS Core Squad',
  unit: 'Digital Platforms',
  dueDate: '2026-05-16',
  slaState: 'At Risk',
  evidenceState: 'Partial',
  structureScore: 73,
  closureQuality: 'Needs review',
  purpose: 'Draft copy for the new governance dashboard.',
  expectedOutput: 'Finalised copy document.',
  strategicAspirationId: 'ASP-004',
  objectiveId: 'OBJ-005',
  outcomeId: 'OUT-6005',
  registerId: 'REG-005',
  registerItemId: 'RI-004',
  contributionType: 'Content',
  kpiTarget: 'Clear governance messaging.',
  contributionStatus: 'In Progress',
  taskObjectives: [],
  checklist: [
  { id: 1, label: 'Confirm task purpose', group: 'Setup', done: true },
  { id: 2, label: 'Add progress update', group: 'Execution', done: false }],

  updates: [],
  blocker: null,
  evidence: [],
  approval: null,
  linkedKnowledge: [],
  customSections: [],
  audit: [],
  changeHistory: [],
  closureScores: {
    output: 'Pending',
    strategic: 'Complete',
    objective: 'Pending',
    evidence: 'Partial',
    checklist: '1/2',
    sla: 'At Risk',
    review: 'Not ready'
  }
},
{
  id: 'TSK-1005',
  title: 'Align HRA onboarding request flow',
  status: 'In Progress',
  priority: 'Medium',
  owner: 'Grace Wanjiru',
  ownerUserId: 'USR-005',
  contributors: [],
  reviewer: 'USR-004',
  team: 'HRA Squad',
  unit: 'HRA',
  dueDate: '2026-05-22',
  slaState: 'On Track',
  evidenceState: 'Partial',
  structureScore: 81,
  closureQuality: 'Not ready',
  purpose: 'Ensure onboarding requests route correctly.',
  expectedOutput: 'Updated routing rules.',
  strategicAspirationId: 'ASP-003',
  objectiveId: 'OBJ-003',
  outcomeId: 'OUT-6003',
  registerId: 'REG-003',
  registerItemId: 'RI-005',
  contributionType: 'Process update',
  kpiTarget: 'Zero unrouted onboarding requests.',
  contributionStatus: 'In Progress',
  taskObjectives: [],
  checklist: [
  { id: 1, label: 'Confirm task purpose', group: 'Setup', done: true }],

  updates: [],
  blocker: null,
  evidence: [],
  approval: null,
  linkedKnowledge: [],
  customSections: [],
  audit: [],
  changeHistory: [],
  closureScores: {
    output: 'Pending',
    strategic: 'Complete',
    objective: 'Pending',
    evidence: 'Partial',
    checklist: '1/1',
    sla: 'On Track',
    review: 'Not ready'
  }
}];