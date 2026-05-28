import { TaskTemplateCategory, TaskTemplateFull, TaskTemplateDetail, TemplatePrefillRule, GovernedTaskInstance, TaskInstanceEdit, TaskChecklistRecord, TaskEvidenceRecord, TaskReviewRecord, TaskExecutiveSignal } from '../types/taskLibrary';

export const taskTemplateCategories: TaskTemplateCategory[] = [
  { id: 'CAT-TEAM', name: 'Team Delivery', description: 'Standard execution tasks for team deliverables.', ownerType: 'Team / Squad Lead' },
  { id: 'CAT-REVIEW', name: 'Review', description: 'Formal review and approval tasks.', ownerType: 'Scrum Master' },
  { id: 'CAT-GOV', name: 'Governance', description: 'Exception handling and audit responses.', ownerType: 'Admin' },
  { id: 'CAT-CLOSURE', name: 'Closure Quality', description: 'Final quality gate before closing complex deliverables.', ownerType: 'Unit Lead' },
  { id: 'CAT-PERSONAL', name: 'Personal Work', description: 'Individual or onboarding tasks.', ownerType: 'Associate' },
  { id: 'CAT-SESSION', name: 'Working Session', description: 'Follow-up actions from meetings.', ownerType: 'Associate' }
];

export const taskTemplatesFull: TaskTemplateFull[] = [
  {
    id: 'TPL-001',
    category: 'Team Delivery',
    type: 'Execution',
    title: 'Structured Delivery Task',
    description: 'Standard task for feature delivery or technical implementation.',
    purpose: 'Provide a structured approach to feature development.',
    expectedOutput: 'Deployed feature or completed implementation.',
    checklistItems: [
      { id: 'chk-1', text: 'Define requirements', required: true },
      { id: 'chk-2', text: 'Implementation', required: true },
      { id: 'chk-3', text: 'Write tests', required: true },
      { id: 'chk-4', text: 'Code review', required: true },
      { id: 'chk-5', text: 'Deploy to staging', required: false }
    ],
    evidenceRequired: true,
    evidenceRule: 'Link to PR or deployment successful log.',
    reviewPath: 'Review only',
    closureCriteria: 'All required checklist items checked, evidence attached, and peer review passed.',
    slaGuidance: '3–5 business days',
    dueDateGuidance: 'Based on sprint planning.',
    relatedKnowledgeIds: ['KNO-001', 'KNO-002'],
    relatedTemplateIds: ['TPL-002'],
    auditNote: 'Standard delivery template. Edits apply to instance only.',
    ownerType: 'Associate',
    personas: ['associate', 'scrum-master', 'team-lead'],
    checklistDepth: 'Standard',
    bestFor: 'Team execution'
  },
  {
    id: 'TPL-002',
    category: 'Review',
    type: 'Review',
    title: 'Review & Approval Task',
    description: 'Task dedicated to reviewing another team member\'s work.',
    purpose: 'Ensure four-eyes principle on critical deliverables.',
    expectedOutput: 'Approved or returned decision with rationale.',
    checklistItems: [
      { id: 'chk-1', text: 'Review linked work', required: true },
      { id: 'chk-2', text: 'Check against standards', required: true },
      { id: 'chk-3', text: 'Provide feedback or approve', required: true }
    ],
    evidenceRequired: true,
    evidenceRule: 'Feedback comments or approval record.',
    reviewPath: 'Approval required',
    closureCriteria: 'Decision recorded in the system.',
    slaGuidance: '1–2 business days',
    dueDateGuidance: 'ASAP to avoid blocking.',
    relatedKnowledgeIds: ['KNO-007'],
    relatedTemplateIds: ['TPL-001'],
    ownerType: 'Scrum Master',
    personas: ['scrum-master', 'team-lead', 'unit-lead'],
    checklistDepth: 'Light',
    bestFor: 'Team execution'
  },
  {
    id: 'TPL-003',
    category: 'Governance',
    type: 'Governance',
    title: 'Governance Follow-up',
    description: 'Address an identified governance exception or audit finding.',
    purpose: 'Close audit gaps.',
    expectedOutput: 'Remediated exception with evidence.',
    checklistItems: [
      { id: 'chk-1', text: 'Review finding', required: true },
      { id: 'chk-2', text: 'Implement fix', required: true },
      { id: 'chk-3', text: 'Verify with auditor', required: true },
      { id: 'chk-4', text: 'Document remediation', required: true }
    ],
    evidenceRequired: true,
    evidenceRule: 'Documented proof of remediation.',
    reviewPath: 'Governance',
    closureCriteria: 'Governance board approval.',
    slaGuidance: '5+ business days',
    dueDateGuidance: 'Driven by audit deadlines.',
    relatedKnowledgeIds: ['KNO-003'],
    relatedTemplateIds: [],
    ownerType: 'Admin',
    personas: ['unit-lead', 'admin', 'ceo'],
    checklistDepth: 'Standard',
    bestFor: 'Governance review'
  },
  {
    id: 'TPL-004',
    category: 'Closure Quality',
    type: 'Closure',
    title: 'Closure Quality Review',
    description: 'Formal review of task outputs against closure criteria.',
    purpose: 'Final gate before marking an epic/feature closed.',
    expectedOutput: 'Quality Score Matrix completed.',
    checklistItems: [
      { id: 'chk-1', text: 'Review all tasks in epic', required: true },
      { id: 'chk-2', text: 'Check evidence completeness', required: true },
      { id: 'chk-3', text: 'Verify acceptance criteria', required: true },
      { id: 'chk-4', text: 'Confirm no open bugs', required: true },
      { id: 'chk-5', text: 'Update documentation', required: false },
      { id: 'chk-6', text: 'Sign off', required: true }
    ],
    evidenceRequired: false,
    reviewPath: 'Lead',
    closureCriteria: 'Quality score calculated and approved by Lead.',
    slaGuidance: '1–2 business days',
    dueDateGuidance: 'End of sprint.',
    relatedKnowledgeIds: ['KNO-001', 'KNO-003'],
    relatedTemplateIds: [],
    ownerType: 'Unit Lead',
    personas: ['scrum-master', 'team-lead', 'unit-lead'],
    checklistDepth: 'Detailed',
    bestFor: 'Governance review'
  },
  {
    id: 'TPL-005',
    category: 'Working Session',
    type: 'Execution',
    title: 'Working Session Action',
    description: 'Action item captured during a working session.',
    purpose: 'Track informal meeting follow-ups.',
    expectedOutput: 'Completed action.',
    checklistItems: [
      { id: 'chk-1', text: 'Acknowledge action', required: false },
      { id: 'chk-2', text: 'Complete action', required: true }
    ],
    evidenceRequired: false,
    reviewPath: 'No review',
    closureCriteria: 'Self-certification of completion.',
    slaGuidance: 'Same day',
    dueDateGuidance: 'Typically very short term.',
    relatedKnowledgeIds: [],
    relatedTemplateIds: [],
    ownerType: 'Associate',
    personas: ['associate', 'scrum-master'],
    checklistDepth: 'Light',
    bestFor: 'Team execution'
  },
  {
    id: 'TPL-006',
    category: 'Personal Work',
    type: 'HRA',
    title: 'Onboarding Task',
    description: 'Complete a required onboarding step or training module.',
    purpose: 'Ensure new joiners are ready to work.',
    expectedOutput: 'Completed training module or checklist.',
    checklistItems: [
      { id: 'chk-1', text: 'Complete module', required: true }
    ],
    evidenceRequired: true,
    evidenceRule: 'Certificate of completion.',
    reviewPath: 'No review',
    closureCriteria: 'Certificate attached.',
    slaGuidance: '1–2 business days',
    dueDateGuidance: 'Within first week of joining.',
    relatedKnowledgeIds: ['KNO-004', 'KNO-009'],
    relatedTemplateIds: [],
    ownerType: 'HRA',
    personas: ['associate', 'hra'],
    checklistDepth: 'Light',
    bestFor: 'Onboarding'
  }
];

export const templatePrefillRules: TemplatePrefillRule[] = [
  {
    id: 'PFR-001',
    templateId: 'TPL-001',
    prefilledFields: ['title', 'purpose', 'expectedOutput', 'checklist', 'evidenceRule', 'reviewPath', 'sla'],
    editableFields: ['title', 'purpose', 'expectedOutput', 'dueDate', 'owner', 'priority'],
    protectedFields: ['checklist', 'evidenceRule', 'reviewPath'],
    overrideRequired: true
  },
  {
    id: 'PFR-002',
    templateId: 'TPL-002',
    prefilledFields: ['purpose', 'checklist', 'reviewPath', 'evidenceRule'],
    editableFields: ['title', 'dueDate', 'owner', 'priority'],
    protectedFields: ['purpose', 'checklist', 'reviewPath', 'evidenceRule'],
    overrideRequired: true
  },
  {
    id: 'PFR-003',
    templateId: 'TPL-005',
    prefilledFields: ['checklist', 'reviewPath'],
    editableFields: ['title', 'purpose', 'expectedOutput', 'dueDate', 'owner', 'priority', 'checklist'],
    protectedFields: ['reviewPath'],
    overrideRequired: false
  }
];

export const governedTasks: GovernedTaskInstance[] = [
  {
    id: 'TSK-2401',
    templateId: 'TPL-001',
    templateTitle: 'Structured Delivery Task',
    title: 'Build Login API',
    purpose: 'Implement JWT authentication API.',
    ownerUserId: 'USR-001',
    teamId: 'TM-001',
    status: 'In Progress',
    priority: 'High',
    slaState: 'On Track',
    dueDate: '2026-05-30',
    expectedOutput: 'Working API endpoints for login.',
    checklistDone: 2,
    checklistTotal: 5,
    evidenceState: 'Partial',
    knowledgeIds: ['KNO-001'],
    deviations: ['Added extra checklist item for security review.'],
    progressNotes: [
      { id: 'pn-1', text: 'Started implementation of JWT strategy.', date: '2026-05-25', author: 'Amina Hassan' }
    ],
    blockerState: 'Clear'
  },
  {
    id: 'TSK-2402',
    templateId: 'TPL-002',
    templateTitle: 'Review & Approval Task',
    title: 'Review Login API PR',
    purpose: 'Ensure four-eyes principle on critical deliverables.',
    ownerUserId: 'USR-003',
    teamId: 'TM-001',
    status: 'Draft',
    priority: 'High',
    slaState: 'On Track',
    dueDate: '2026-06-01',
    expectedOutput: 'Approved PR.',
    checklistDone: 0,
    checklistTotal: 3,
    evidenceState: 'Missing',
    knowledgeIds: ['KNO-007'],
    deviations: [],
    blockerState: 'Clear'
  },
  {
    id: 'TSK-2403',
    templateId: 'TPL-003',
    templateTitle: 'Governance Follow-up',
    title: 'Fix Audit Finding #A45',
    purpose: 'Close audit gaps.',
    ownerUserId: 'USR-004',
    teamId: 'TM-001',
    status: 'Blocked',
    priority: 'Critical',
    slaState: 'At Risk',
    dueDate: '2026-05-28',
    expectedOutput: 'Remediated exception with evidence.',
    checklistDone: 1,
    checklistTotal: 4,
    evidenceState: 'Missing',
    knowledgeIds: ['KNO-003'],
    deviations: [],
    blockerState: 'Blocked',
    progressNotes: [
      { id: 'pn-2', text: 'Blocked on infrastructure access.', date: '2026-05-26', author: 'Omar Farouk' }
    ]
  },
  {
    id: 'TSK-2404',
    templateId: 'TPL-004',
    templateTitle: 'Closure Quality Review',
    title: 'Sprint 42 Closure Review',
    purpose: 'Final gate before marking an epic closed.',
    ownerUserId: 'USR-003',
    teamId: 'TM-001',
    status: 'Review Needed',
    priority: 'Medium',
    slaState: 'On Track',
    dueDate: '2026-05-29',
    expectedOutput: 'Quality Score Matrix completed.',
    checklistDone: 6,
    checklistTotal: 6,
    evidenceState: 'Not Required' as any, // Cast for mock simplicity
    knowledgeIds: ['KNO-001'],
    deviations: [],
    closureQualityState: {
      checklistCompletion: 100,
      evidenceCompleteness: 'Not Required',
      outputPresent: true,
      reviewDecision: 'Pending',
      deviationSummary: [],
      closureOutcome: 'Ready'
    },
    reviewState: 'Pending',
    blockerState: 'Clear'
  },
  {
    id: 'TSK-2405',
    templateId: 'TPL-006',
    templateTitle: 'Onboarding Task',
    title: 'Complete Security Training',
    purpose: 'Ensure new joiners are ready to work.',
    ownerUserId: 'USR-001',
    teamId: 'TM-001',
    status: 'Closed',
    priority: 'Medium',
    slaState: 'Met',
    dueDate: '2026-05-20',
    expectedOutput: 'Completed training module.',
    checklistDone: 1,
    checklistTotal: 1,
    evidenceState: 'Accepted',
    knowledgeIds: ['KNO-009'],
    deviations: [],
    blockerState: 'Clear'
  },
  {
    id: 'TSK-2406',
    title: 'Custom Task (No Template)',
    purpose: 'Explore new library.',
    ownerUserId: 'USR-002',
    teamId: 'TM-001',
    status: 'In Progress',
    priority: 'Low',
    slaState: 'On Track',
    dueDate: '2026-06-15',
    expectedOutput: 'PoC code.',
    checklistDone: 0,
    checklistTotal: 2,
    evidenceState: 'Missing',
    knowledgeIds: [],
    blockerState: 'Clear'
  }
];

export const taskInstanceEdits: TaskInstanceEdit[] = [
  { id: 'EDT-1001', taskId: 'TSK-2401', fieldEdited: 'checklist', originalValue: '5 items', instanceValue: '6 items', overrideReason: 'Needed extra security review step for Auth.', isGovernanceOverride: true },
  { id: 'EDT-1002', taskId: 'TSK-2401', fieldEdited: 'dueDate', originalValue: '2026-05-28', instanceValue: '2026-05-30', isGovernanceOverride: false }
];

export const taskChecklistRecords: TaskChecklistRecord[] = [
  { id: 'CLI-1001', taskId: 'TSK-2401', itemText: 'Define requirements', requiredForClosure: true, state: 'Complete' },
  { id: 'CLI-1002', taskId: 'TSK-2401', itemText: 'Implementation', requiredForClosure: true, state: 'Complete' },
  { id: 'CLI-1003', taskId: 'TSK-2401', itemText: 'Write tests', requiredForClosure: true, state: 'In Progress' },
  { id: 'CLI-1004', taskId: 'TSK-2401', itemText: 'Code review', requiredForClosure: true, state: 'Not Started' },
  { id: 'CLI-1005', taskId: 'TSK-2401', itemText: 'Deploy to staging', requiredForClosure: false, state: 'Not Started' },
  { id: 'CLI-1006', taskId: 'TSK-2401', itemText: 'Security review', requiredForClosure: true, state: 'Not Started' }
];

export const taskEvidenceRecords: TaskEvidenceRecord[] = [
  { id: 'EVD-7001', taskId: 'TSK-2401', evidenceState: 'Attached', evidenceType: 'link', required: true, url: 'https://github.com/dq/pr/123', notes: 'PR for login API' },
  { id: 'EVD-7002', taskId: 'TSK-2405', evidenceState: 'Accepted', evidenceType: 'document', required: true, url: 'cert_123.pdf', notes: 'Security Training Certificate' },
  { id: 'EVD-7003', taskId: 'TSK-2403', evidenceState: 'Missing', evidenceType: 'document', required: true }
];

export const taskReviewRecords: TaskReviewRecord[] = [
  { id: 'REV-3001', taskId: 'TSK-2404', reviewerUserId: 'USR-004', reviewerRole: 'Unit Lead', decisionState: 'Pending' },
  { id: 'REV-3002', taskId: 'TSK-1003', reviewerUserId: 'USR-003', reviewerRole: 'Team / Squad Lead', decisionState: 'Returned', rationale: 'Missing audit evidence link.' }
];

export const taskExecutiveSignals: TaskExecutiveSignal[] = [
  { id: 'SIG-TASK-9001', signal: 'Template Adoption Rate', value: '78%', trend: '+5%', status: 'success' },
  { id: 'SIG-TASK-9002', signal: 'Governed Tasks Created', value: '1,245', trend: '+124', status: 'info' },
  { id: 'SIG-TASK-9003', signal: 'Evidence Missing at Review', value: '12%', trend: '-3%', status: 'success' },
  { id: 'SIG-TASK-9004', signal: 'Review Queue Bottlenecks', value: '45 tasks', trend: '+12', status: 'warning' },
  { id: 'SIG-TASK-9005', signal: 'Closure Quality Score', value: '88%', trend: '+2%', status: 'success' },
  { id: 'SIG-TASK-9006', signal: 'Governance Overrides', value: '5%', trend: '+1%', status: 'info' }
];
