// Stage 0-specific mock data

export const workRules = [
{
  id: 1,
  title: 'Every task has an owner',
  description: 'Work cannot move without clear accountability.'
},
{
  id: 2,
  title: 'Every task has an expected output',
  description: 'Tasks define what must be produced or changed.'
},
{
  id: 3,
  title: 'Progress is updated against the work record',
  description: 'Updates stay attached to the task or request.'
},
{
  id: 4,
  title: 'Blockers are named, owned, and resolved',
  description: 'Obstacles become visible and actionable.'
},
{
  id: 5,
  title: 'Evidence is attached before closure',
  description: 'Proof travels with the work.'
},
{
  id: 6,
  title: 'Approvals require rationale',
  description: 'Decisions stay connected to the work they affect.'
},
{
  id: 7,
  title: 'Closure quality is reviewed',
  description: 'Work is checked before it is treated as complete.'
},
{
  id: 8,
  title: 'Visibility is role-based',
  description: 'Every role sees the signals they are permitted to act on.'
}];


export const setupChecklistItems = [
{ id: 'profile', label: 'Confirm profile and role', completed: false },
{
  id: 'notifications',
  label: 'Set notification preferences',
  completed: false
},
{
  id: 'ways-of-working',
  label: 'Understand DQ ways of working',
  completed: false
},
{ id: 'task-rules', label: 'Learn structured task rules', completed: false },
{ id: 'requests', label: 'Learn how to submit requests', completed: false },
{
  id: 'evidence',
  label: 'Learn evidence and blocker rules',
  completed: false
},
{
  id: 'expectations',
  label: 'Acknowledge workspace expectations',
  completed: false
},
{ id: 'continue', label: 'Continue to role workspace', completed: false }];


export const onboardingSteps = [
{
  id: 1,
  title: 'Understand DWS.01',
  description:
  'DWS.01 is where DQ work becomes structured, owned, evidenced, governed, and visible.'
},
{
  id: 2,
  title: 'Learn DQ ways of working',
  description:
  'Understand GHC, Agile TMS basics, ownership discipline, updates, blockers, and execution rhythm.'
},
{
  id: 3,
  title: 'Read structured tasks correctly',
  description:
  'Every task has an owner, purpose, expected output, checklist, SLA, blocker state, evidence, and closure rule.'
},
{
  id: 4,
  title: 'Submit and track requests',
  description:
  'Use the service catalogue for HRA, IT/access, platform support, admin, approval, escalation, and workflow support requests.'
},
{
  id: 5,
  title: 'Find knowledge and support',
  description:
  'Use GHC, 6xD, playbooks, templates, workspace guides, and support routes when you need help.'
},
{
  id: 6,
  title: 'Acknowledge and continue',
  description:
  'Confirm that you understand the operating rules before entering your workspace.'
}];


export const roleGuides: Record<
  string,
  {
    purpose: string;
    keyActions: string[];
    recommendedGuide: string;
    metrics: {label: string;value: string;}[];
  }> =
{
  associate: {
    purpose:
    'Start with assigned work, requests, evidence, blockers, and closure actions.',
    keyActions: [
    'Review assigned tasks',
    'Add progress updates',
    'Attach evidence',
    'Raise blockers',
    'Submit and track internal requests'],

    recommendedGuide: 'Agile TMS Task Discipline Guide',
    metrics: [
    { label: 'Assigned tasks', value: '2' },
    { label: 'Blockers', value: '1' },
    { label: 'Open requests', value: '2' }]

  },
  'scrum-master': {
    purpose:
    'Start with flow health, blockers, missing updates, SLA risks, and task hygiene.',
    keyActions: [
    'Review missing updates',
    'Inspect blockers',
    'Send reminders',
    'Escalate repeated task hygiene issues'],

    recommendedGuide: 'Closure Quality Review Guide',
    metrics: [
    { label: 'Missing updates', value: '5' },
    { label: 'Blockers ageing', value: '3' },
    { label: 'SLA risks', value: '2' }]

  },
  'team-lead': {
    purpose:
    'Start with team workload, assignment, blocked work, approvals, and closure quality.',
    keyActions: [
    'Review team workload',
    'Assign or reassign tasks',
    'Inspect overdue work',
    'Review output and closure quality'],

    recommendedGuide: 'Team Execution Governance Guide',
    metrics: [
    { label: 'Active team tasks', value: '11' },
    { label: 'Overdue items', value: '3' },
    { label: 'Pending approvals', value: '2' }]

  },
  'unit-lead': {
    purpose:
    'Start with unit delivery health, SLA trends, governance risks, and outcome progress.',
    keyActions: [
    'Review unit delivery health',
    'Inspect SLA trends',
    'Review governance risks',
    'Track outcome progress'],

    recommendedGuide: 'Unit Governance Review Guide',
    metrics: [
    { label: 'SLA on track', value: '84%' },
    { label: 'Governance risks', value: '2' },
    { label: 'Outcome delayed', value: '1' }]

  },
  hra: {
    purpose:
    'Start with HRA requests, onboarding workflows, role transitions, and policy checks.',
    keyActions: [
    'Review HRA requests',
    'Manage onboarding checklists',
    'Verify policy and record requirements',
    'Approve or return requests'],

    recommendedGuide: 'HRA Onboarding Workflow Guide',
    metrics: [
    { label: 'HRA requests', value: '6' },
    { label: 'Onboarding checklists', value: '2' },
    { label: 'Returned request', value: '1' }]

  },
  admin: {
    purpose:
    'Start with roles, permissions, configuration, SLA rules, and audit controls.',
    keyActions: [
    'Manage users and roles',
    'Configure task and request models',
    'Review SLA and notification rules',
    'Inspect audit logs'],

    recommendedGuide: 'Workspace Configuration Governance Guide',
    metrics: [
    { label: 'Configuration alerts', value: '3' },
    { label: 'Permission exceptions', value: '2' },
    { label: 'Audit events today', value: '4' }]

  },
  support: {
    purpose:
    'Start with request triage, routing, missing inputs, SLA risk, and closure queues.',
    keyActions: [
    'Triage new requests',
    'Validate required inputs',
    'Route to fulfilment owners',
    'Add evidence and close requests'],

    recommendedGuide: 'Support Queue Triage Guide',
    metrics: [
    { label: 'New requests', value: '8' },
    { label: 'At SLA risk', value: '3' },
    { label: 'Routed items', value: '5' }]

  },
  ceo: {
    purpose:
    'Start with enterprise execution, strategy progress, governance health, SLA exposure, and value delivery.',
    keyActions: [
    'Review strategic initiative progress',
    'Inspect governance health',
    'Monitor SLA exposure',
    'Review associate, team, and unit performance'],

    recommendedGuide: 'Enterprise Execution Intelligence Guide',
    metrics: [
    { label: 'Strategic risks', value: '3' },
    { label: 'SLA health', value: '84%' },
    { label: 'Outcome progress', value: '72%' }]

  }
};

export const quickResumeItems: Record<
  string,
  Array<{
    id: string;
    title: string;
    explanation: string;
    cta: string;
    status: 'success' | 'warning' | 'danger' | 'info';
    linkedId?: string;
  }>> =
{
  associate: [
  {
    id: '1',
    title: 'Pending update',
    explanation:
    'Stage 0 orientation shell requires an update before closure review.',
    cta: 'Add update',
    status: 'warning',
    linkedId: 'TSK-1001'
  },
  {
    id: '2',
    title: 'Blocked task',
    explanation:
    'Request intake card pattern is blocked by missing fulfilment rule.',
    cta: 'Review blocker',
    status: 'danger',
    linkedId: 'TSK-1002'
  },
  {
    id: '3',
    title: 'Open request',
    explanation: 'Task / Workflow Support request is pending information.',
    cta: 'Complete request',
    status: 'warning',
    linkedId: 'REQ-2001'
  },
  {
    id: '4',
    title: 'Recent alert',
    explanation: 'SLA risk detected on assigned work due today.',
    cta: 'View alert',
    status: 'danger',
    linkedId: 'ALT-3001'
  }],

  'scrum-master': [
  {
    id: '1',
    title: 'Missing updates',
    explanation: '5 assigned tasks have no update in 48 hours.',
    cta: 'Send reminders',
    status: 'warning'
  },
  {
    id: '2',
    title: 'Blocker ageing',
    explanation: '3 blockers are older than 2 days.',
    cta: 'Review blockers',
    status: 'danger'
  },
  {
    id: '3',
    title: 'Task hygiene risk',
    explanation: '2 tasks lack evidence expectations.',
    cta: 'Open review',
    status: 'warning'
  },
  {
    id: '4',
    title: 'SLA risk',
    explanation: '2 items are approaching breach.',
    cta: 'View SLA risks',
    status: 'danger'
  }],

  'team-lead': [
  {
    id: '1',
    title: 'Overdue team item',
    explanation: 'DWS Core task is 1 day overdue.',
    cta: 'Review task',
    status: 'danger'
  },
  {
    id: '2',
    title: 'Reassignment needed',
    explanation: 'Blocked item has no backup owner.',
    cta: 'Reassign owner',
    status: 'warning'
  },
  {
    id: '3',
    title: 'Pending approval',
    explanation: 'Closure review is waiting for your decision.',
    cta: 'Open approval',
    status: 'info'
  },
  {
    id: '4',
    title: 'Closure risk',
    explanation: '2 tasks have weak evidence.',
    cta: 'Review closure',
    status: 'warning'
  }],

  'unit-lead': [
  {
    id: '1',
    title: 'SLA trend',
    explanation: 'Unit SLA health dropped to 84%.',
    cta: 'Open SLA dashboard',
    status: 'warning'
  },
  {
    id: '2',
    title: 'Governance risk',
    explanation: 'Missing evidence increased this week.',
    cta: 'Review governance',
    status: 'danger'
  },
  {
    id: '3',
    title: 'Outcome delay',
    explanation: 'Execution quality outcome is behind plan.',
    cta: 'View outcome',
    status: 'warning'
  },
  {
    id: '4',
    title: 'Intervention needed',
    explanation: 'Escalation queue has 2 unresolved items.',
    cta: 'Trigger intervention',
    status: 'danger'
  }],

  hra: [
  {
    id: '1',
    title: 'Onboarding checklist',
    explanation: 'New joiner setup is 60% complete.',
    cta: 'Open checklist',
    status: 'info'
  },
  {
    id: '2',
    title: 'Returned request',
    explanation: 'HRA request needs corrected document.',
    cta: 'Review request',
    status: 'warning'
  },
  {
    id: '3',
    title: 'Policy check',
    explanation: 'Role-transition record awaits verification.',
    cta: 'Verify policy',
    status: 'info'
  },
  {
    id: '4',
    title: 'Pending approval',
    explanation: 'Employee readiness request needs approval.',
    cta: 'Open approval',
    status: 'warning'
  }],

  admin: [
  {
    id: '1',
    title: 'Role update',
    explanation: 'Permission update requires audit review.',
    cta: 'Review audit',
    status: 'warning'
  },
  {
    id: '2',
    title: 'Config audit',
    explanation: 'SLA reminder rule was changed today.',
    cta: 'Inspect change',
    status: 'info'
  },
  {
    id: '3',
    title: 'SLA rule review',
    explanation: 'Escalation threshold requires confirmation.',
    cta: 'Review rule',
    status: 'warning'
  },
  {
    id: '4',
    title: 'Permission exception',
    explanation: 'Temporary access expires today.',
    cta: 'Review exception',
    status: 'danger'
  }],

  support: [
  {
    id: '1',
    title: 'New request',
    explanation: 'Platform support request needs triage.',
    cta: 'Triage request',
    status: 'info'
  },
  {
    id: '2',
    title: 'Missing input',
    explanation: 'Access request lacks justification.',
    cta: 'Request information',
    status: 'warning'
  },
  {
    id: '3',
    title: 'Routed item at risk',
    explanation: 'Fulfilment owner has not updated status.',
    cta: 'Follow up',
    status: 'warning'
  },
  {
    id: '4',
    title: 'Closure queue',
    explanation: '5 requests are ready for closure review.',
    cta: 'Review closure',
    status: 'success'
  }],

  ceo: [
  {
    id: '1',
    title: 'Strategic initiative risk',
    explanation: 'Execution quality initiative is at medium risk.',
    cta: 'View initiative',
    status: 'warning'
  },
  {
    id: '2',
    title: 'Governance health issue',
    explanation: 'Closure quality dropped below target.',
    cta: 'Review governance',
    status: 'danger'
  },
  {
    id: '3',
    title: 'SLA exposure',
    explanation: '11 work items are blocked or at risk.',
    cta: 'Open SLA view',
    status: 'warning'
  },
  {
    id: '4',
    title: 'Value delivery trend',
    explanation: 'Outcome progress is 72% against target.',
    cta: 'View outcome',
    status: 'info'
  }]

};