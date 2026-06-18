import type { ViewingMode } from '../context/ViewingModeContext';
import { getRoleFamily, type RoleFamily, type WorkspaceRole } from '../config/segments';

export type Stage02Tab = 'Tasks' | 'Workflows' | 'Trackers' | 'Reviews' | 'Performance';
export type Stage02Section = 'tasks' | 'workflows' | 'trackers' | 'performance' | 'governance' | 'knowledge' | 'people' | 'reports';

export interface WorkItem {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  status: string;
  priority: string;
  owner: string;
  dueDate: string;
  stage?: string;
  description: string;
  related: string[];
  nextAction: string;
  meta?: string;
}

export interface KpiItem {
  label: string;
  value: string;
  subtitle: string;
  tone: 'success' | 'info' | 'warning' | 'danger' | 'neutral';
  route: string;
  tab?: Stage02Tab;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  owner: string;
  dueDate: string;
  description: string;
}

export interface PerformanceMetric {
  label: string;
  value: string;
  status: string;
}

export interface Stage02Dataset {
  header: {
    title: string;
    subtitle: string;
  };
  kpis: KpiItem[];
  tabs: Record<Stage02Tab, WorkItem[]>;
  performance: PerformanceMetric[];
  lowerPrimary?: ActivityItem[];
  recentActivity: ActivityItem[];
  announcements: ActivityItem[];
  aiInsights: ActivityItem[];
  calendar: ActivityItem[];
  quickActions: string[];
  sections: Record<Stage02Section, WorkItem[]>;
}

const quickActions = [
  'Create Task',
  'Start Workflow',
  'Submit Request',
  'New Tracker Item',
  'Upload Document',
  'Add Knowledge'
];

const basePerformance: PerformanceMetric[] = [
  { label: 'Goal progress', value: '68%', status: 'On Track' },
  { label: 'Task completion', value: '74%', status: 'In Progress' },
  { label: 'On-time delivery', value: '81%', status: 'On Track' },
  { label: 'Learning progress', value: '52%', status: 'Awaiting Input' },
  { label: 'Feedback pending', value: '2', status: 'Watch' },
  { label: 'Current evaluation cycle', value: 'Q2', status: 'In Progress' }
];

function item(partial: Partial<WorkItem> & Pick<WorkItem, 'id' | 'title' | 'type'>): WorkItem {
  return {
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Amina Hassan',
    dueDate: '22 May 2026',
    description: 'Review the workspace context, update the record, and keep evidence attached to the work item.',
    related: ['DWS.01 Workspace', 'Operating Guide'],
    nextAction: 'Open the item, confirm ownership, and submit the next update.',
    ...partial
  };
}

const roleRows: Record<RoleFamily, WorkItem[]> = {
  Associate: [
    item({ id: 'TSK-2041', title: 'Complete Role-based Learning Path', subtitle: 'Learning Center', type: 'Task', status: 'Not Started', priority: 'Medium', dueDate: '24 May 2026' }),
    item({ id: 'TRK-118', title: 'Update Contribution History', subtitle: 'Personal tracker', type: 'Tracker', status: 'In Progress', priority: 'Low', dueDate: '27 May 2026' })
  ],
  'Manager / Lead': [
    item({ id: 'APR-431', title: 'Review team blocker resolution plan', subtitle: 'Team delivery', type: 'Review', status: 'Due Today', priority: 'High', owner: 'Ian Karanja', dueDate: '19 May 2026', description: 'Review blockers raised by the delivery squad and confirm mitigation owners.' }),
    item({ id: 'TSK-2190', title: 'Approve sprint workload adjustment', subtitle: 'Team workload', type: 'Approval', status: 'Awaiting Input', priority: 'High', owner: 'Amina Hassan', dueDate: '20 May 2026' })
  ],
  'Governance Lead': [
    item({ id: 'GOV-144', title: 'Complete control evidence quality check', subtitle: 'Control assessment', type: 'Governance', status: 'At Risk', priority: 'High', owner: 'Amina Hassan', dueDate: '19 May 2026' }),
    item({ id: 'RSK-1028', title: 'Review escalation on missing risk owner', subtitle: 'Risk review', type: 'Review', status: 'Watch', priority: 'High', owner: 'Ian Karanja', dueDate: '21 May 2026' })
  ],
  'Product / Admin': [
    item({ id: 'ADM-310', title: 'Configure task template approval rule', subtitle: 'Template configuration', type: 'Admin Task', status: 'In Progress', priority: 'High', owner: 'Amina Hassan', dueDate: '21 May 2026' }),
    item({ id: 'FBK-220', title: 'Triage open feedback on workspace prototype', subtitle: 'Prototype backlog', type: 'Feedback', status: 'Awaiting Input', priority: 'Medium', owner: 'Ian Karanja', dueDate: '23 May 2026' })
  ]
};

const newJoinerTasks: WorkItem[] = [
  item({ id: 'ONB-101', title: 'Complete Onboarding Checklist', subtitle: 'Onboarding', type: 'Task', status: 'Due Today', priority: 'High', dueDate: '19 May 2026' }),
  item({ id: 'ONB-102', title: 'Review DQ Ways of Working', subtitle: 'Orientation', type: 'Task', status: 'In Progress', priority: 'Medium', dueDate: '20 May 2026' }),
  item({ id: 'REQ-204', title: 'Submit Access Request', subtitle: 'Access & Tools', type: 'Approval', status: 'Awaiting Input', priority: 'Medium', dueDate: '21 May 2026' }),
  item({ id: 'LRN-018', title: 'Complete Role-based Learning Path', subtitle: 'Learning Center', type: 'Task', status: 'Not Started', priority: 'Medium', dueDate: '24 May 2026' }),
  item({ id: 'CTL-020', title: 'Introduction to Control Assessment Process', subtitle: 'Training', type: 'Task', status: 'Not Started', priority: 'Low', dueDate: '25 May 2026' })
];

const returningTasks: WorkItem[] = [
  item({ id: 'RSK-1024', title: 'Review Risk RSK-1024 — Data Privacy', type: 'Task', status: 'Overdue', priority: 'High', owner: 'Amina Hassan', dueDate: '15 May 2026', description: 'Review current privacy exposure and confirm mitigation evidence before the governance checkpoint.' }),
  item({ id: 'APR-209', title: 'Approve Access Request — John Smith', type: 'Approval', status: 'Due Today', priority: 'Medium', owner: 'Ian Karanja', dueDate: '19 May 2026' }),
  item({ id: 'CTL-205', title: 'Complete Control Assessment CTL-205', type: 'Task', status: 'In Progress', priority: 'High', owner: 'Amina Hassan', dueDate: '21 May 2026' }),
  item({ id: 'WF-208', title: 'Quarterly Risk Review — Q2', type: 'Workflow', status: 'In Progress', priority: 'High', owner: 'Morgan Green', dueDate: '22 May 2026' }),
  item({ id: 'PRJ-031', title: 'Update Project Plan — DWS Roadmap', type: 'Task', status: 'Not Started', priority: 'Medium', owner: 'Ian Karanja', dueDate: '23 May 2026' })
];

function workflowRows(role: WorkspaceRole): WorkItem[] {
  const family = getRoleFamily(role);
  return [
    item({ id: 'WF-301', title: 'Access Request Fulfilment', type: 'Workflow', status: 'Awaiting Input', stage: 'Owner review', owner: 'Amina Hassan', dueDate: '20 May 2026', nextAction: 'Provide access justification and attach manager approval.' }),
    item({ id: 'WF-208', title: 'Quarterly Governance Review', type: 'Workflow', status: 'In Progress', stage: 'Evidence collection', owner: 'Ian Karanja', dueDate: '24 May 2026' }),
    item({ id: 'WF-412', title: family === 'Manager / Lead' ? 'Team Workload Review' : 'Personal Contribution Review', type: 'Workflow', status: 'On Track', stage: 'Review', owner: 'Amina Hassan', dueDate: '27 May 2026' })
  ];
}

function trackerRows(role: WorkspaceRole): WorkItem[] {
  const family = getRoleFamily(role);
  return [
    item({ id: 'TRK-101', title: 'My Delivery Tracker', type: 'Tracker Record', status: 'Needs Update', priority: 'Medium', meta: 'Last updated 2 days ago', dueDate: '20 May 2026' }),
    item({ id: 'TRK-118', title: family === 'Product / Admin' ? 'Feature Tracker Update' : 'Learning Progress Tracker', type: 'Tracker Record', status: 'In Progress', priority: 'Low', meta: 'Update health: Watch', dueDate: '23 May 2026' }),
    item({ id: 'TRK-129', title: family === 'Governance Lead' ? 'Control Actions Tracker' : 'Feedback Follow-up Tracker', type: 'Tracker Record', status: 'On Track', priority: 'Medium', meta: 'Last updated today', dueDate: '26 May 2026' })
  ];
}

function reviewRows(role: WorkspaceRole): WorkItem[] {
  const family = getRoleFamily(role);
  return [
    item({ id: 'REV-101', title: 'Feedback Review', type: 'Review', status: 'In Progress', owner: 'Bilal Waqar', dueDate: '20 May 2026', nextAction: 'Review feedback notes and acknowledge next development action.' }),
    item({ id: 'REV-140', title: family === 'Governance Lead' ? 'Compliance Action Review' : 'Manager Check-in Review', type: 'Review', status: 'Due Today', priority: 'High', owner: 'Sreya Lakshmi', dueDate: '19 May 2026' }),
    item({ id: 'APP-305', title: family === 'Manager / Lead' ? 'Pending Team Approval' : 'Governance Check Acknowledgement', type: 'Approval', status: 'Awaiting Input', priority: 'Medium', owner: 'Amina Hassan', dueDate: '22 May 2026' })
  ];
}

function buildTabs(mode: ViewingMode, role: WorkspaceRole): Record<Stage02Tab, WorkItem[]> {
  const tasks = [...(mode === 'first-time' ? newJoinerTasks : returningTasks), ...roleRows[getRoleFamily(role)]];
  return {
    Tasks: tasks,
    Workflows: workflowRows(role),
    Trackers: trackerRows(role),
    Reviews: reviewRows(role),
    Performance: []
  };
}

function activity(id: string, title: string, subtitle: string): ActivityItem {
  return {
    id,
    title,
    subtitle,
    status: 'In Progress',
    owner: 'DWS.01',
    dueDate: 'This week',
    description: `${title}. ${subtitle}`,
  };
}

export function getStage02Dataset(mode: ViewingMode, role: WorkspaceRole): Stage02Dataset {
  const family = getRoleFamily(role);
  const isNew = mode === 'first-time';
  const tabs = buildTabs(mode, role);
  const roleSignal =
    family === 'Manager / Lead' ? 'Team blockers and pending approvals included' :
    family === 'Governance Lead' ? 'Governance reviews and control checks included' :
    family === 'Product / Admin' ? 'Feature tracker and platform feedback included' :
    'Personal tasks, learning, feedback, and contributions included';

  const kpis: KpiItem[] = isNew ? [
    { label: 'My Tasks', value: '8', subtitle: `3 overdue · ${roleSignal}`, tone: 'danger', route: '/stage02/tasks', tab: 'Tasks' },
    { label: 'Active Workflows', value: '5', subtitle: '1 awaiting input', tone: 'warning', route: '/stage02/workflows', tab: 'Workflows' },
    { label: 'My Trackers', value: '3', subtitle: '1 needs update', tone: 'warning', route: '/stage02/trackers', tab: 'Trackers' },
    { label: 'My Performance', value: '42%', subtitle: 'onboarding cycle', tone: 'info', route: '/stage02/performance', tab: 'Performance' },
    { label: 'Governance Actions', value: '1', subtitle: 'due this week', tone: 'warning', route: '/stage02/governance', tab: 'Reviews' }
  ] : [
    { label: 'My Tasks', value: '12', subtitle: `6 overdue · ${roleSignal}`, tone: 'danger', route: '/stage02/tasks', tab: 'Tasks' },
    { label: 'Active Workflows', value: '8', subtitle: '2 awaiting input', tone: 'warning', route: '/stage02/workflows', tab: 'Workflows' },
    { label: 'My Trackers', value: '6', subtitle: '3 need updates', tone: 'warning', route: '/stage02/trackers', tab: 'Trackers' },
    { label: 'My Performance', value: '72%', subtitle: 'Q2 cycle', tone: 'success', route: '/stage02/performance', tab: 'Performance' },
    { label: 'Governance Reviews', value: '4', subtitle: '1 due this week', tone: 'warning', route: '/stage02/governance', tab: 'Reviews' }
  ];

  const lowerPrimary = isNew ? [
    activity('GS-1', 'Complete Your Profile', 'Add your details and preferences.'),
    activity('GS-2', 'Learn DQ Ways of Working', 'Understand how work gets done in DQ.'),
    activity('GS-3', 'Request Access & Tools', 'Request the systems and tools you need.'),
    activity('GS-4', 'Explore 4D Marketplaces', 'Discover, plan, start, and drive outcomes.')
  ] : undefined;

  const recentActivity = isNew ? [
    activity('ACT-1', 'Welcome to DWS.01', 'Your onboarding journey has started.'),
    activity('ACT-2', 'Manager assigned your first task', 'Review DQ Ways of Working.'),
    activity('ACT-3', 'Learning path available', 'DQ Essentials for Associate.'),
    activity('ACT-4', 'Access request submitted', 'Laptop and collaboration tools.')
  ] : [
    activity('ACT-5', 'You updated Risk RSK-1012', '2 hours ago'),
    activity('ACT-6', 'Bilal Waqar commented on Workflow WF-208', '3 hours ago'),
    activity('ACT-7', 'Sreya Lakshmi approved Control CTL-110', '5 hours ago'),
    activity('ACT-8', 'AI Insight generated for Project Phoenix', 'Yesterday, 4:30 PM')
  ];

  const announcements = isNew ? [
    activity('ANN-1', 'Welcome to DQ', 'Everything you need to know to get started.'),
    activity('ANN-2', 'New Associate Learning Path', 'Complete within your first 30 days.'),
    activity('ANN-3', 'DQ Platform Update', 'Platform improvements and new features.')
  ] : [
    activity('ANN-4', 'DWS Platform Update — May 2025', 'New AI-driven insights and workflow enhancements.'),
    activity('ANN-5', 'Governance Review Cycle — Q2', 'All review owners, please ensure timely submissions.'),
    activity('ANN-6', 'Learning Path: Risk Management', 'New modules available in the Learning Center.')
  ];

  const aiInsights = isNew ? [
    activity('AI-1', '3 onboarding tasks pending', 'Complete your onboarding checklist.'),
    activity('AI-2', '1 workflow needs your input', 'Provide updates to move it forward.'),
    activity('AI-3', 'Start your learning journey', 'Continue your role-based learning.'),
    activity('AI-4', 'Request tools and system access', 'Submit access requests easily.')
  ] : [
    activity('AI-5', '6 tasks are overdue', 'Review and take action to stay on track.'),
    activity('AI-6', '2 workflows need your input', 'Provide updates to unblock progress.'),
    activity('AI-7', getRoleFamily(role) === 'Governance Lead' ? 'Control exposure increased' : 'Risk exposure increased', '3 risks exceed appetite threshold.'),
    activity('AI-8', 'Report ready to generate', 'Q2 Governance Status Report.')
  ];

  const calendar = isNew ? [
    activity('CAL-1', 'Onboarding Kick-off', '10:00 AM EAT'),
    activity('CAL-2', 'DQ Ways of Working Session', '01:00 PM EAT'),
    activity('CAL-3', 'Access Request Review', '03:30 PM EAT')
  ] : [
    activity('CAL-4', 'Risk Review Meeting', '10:00 AM EAT'),
    activity('CAL-5', 'Project Phoenix Stand-up', '01:00 PM EAT'),
    activity('CAL-6', 'Governance Review Call', '03:30 PM EAT')
  ];

  return {
    header: {
      title: isNew ? 'Welcome to DWS.01, Amina!' : 'Welcome back, Ian',
      subtitle: isNew ? 'Let’s get you started and set you up for success in DQ.' : 'Here’s what’s happening across your workspace.'
    },
    kpis,
    tabs,
    performance: basePerformance,
    lowerPrimary,
    recentActivity,
    announcements,
    aiInsights,
    calendar,
    quickActions,
    sections: {
      tasks: tabs.Tasks,
      workflows: tabs.Workflows,
      trackers: tabs.Trackers,
      performance: tabs.Tasks.slice(0, 3),
      governance: [...tabs.Reviews, ...roleRows['Governance Lead']],
      knowledge: [
        item({ id: 'KNO-501', title: 'DQ Ways of Working Guide', type: 'Knowledge', status: 'Published', priority: 'Low', owner: 'Knowledge Office', dueDate: 'Updated May 2026' }),
        item({ id: 'KNO-522', title: 'Control Assessment Playbook', type: 'Knowledge', status: 'Published', priority: 'Medium', owner: 'Governance Office', dueDate: 'Updated May 2026' })
      ],
      people: [
        item({ id: 'PPL-001', title: 'Amina Hassan', subtitle: 'Associate · eCom.DXP', type: 'Person', status: 'Available', priority: 'Low', owner: 'DQ People Directory', dueDate: 'Current' }),
        item({ id: 'PPL-018', title: 'Bilal Waqar', subtitle: 'Manager / Lead · Delivery', type: 'Person', status: 'Available', priority: 'Low', owner: 'DQ People Directory', dueDate: 'Current' }),
        item({ id: 'PPL-027', title: 'Sreya Lakshmi', subtitle: 'Governance Lead', type: 'Person', status: 'Available', priority: 'Low', owner: 'DQ People Directory', dueDate: 'Current' })
      ],
      reports: [
        item({ id: 'RPT-701', title: 'Q2 Governance Status Report', type: 'Report', status: 'Ready', priority: 'Medium', owner: 'AI Status Report Generator', dueDate: 'Today' }),
        item({ id: 'RPT-716', title: 'Personal Performance Snapshot', type: 'Report', status: 'In Progress', priority: 'Low', owner: 'Amina Hassan', dueDate: 'This week' })
      ]
    }
  };
}
