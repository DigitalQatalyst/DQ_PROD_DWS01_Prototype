import type { ViewingMode } from '../context/ViewingModeContext';
import type { WorkspaceRole } from '../context/WorkspaceRoleContext';

export type PerformanceSection =
  | 'overview'
  | 'goals'
  | 'evaluation'
  | 'feedback'
  | 'learning'
  | 'contribution-history'
  | 'role-performance';

export interface PerformanceKpi {
  label: string;
  value: string;
  helper: string;
  status: string;
}

export interface GoalRecord {
  id: string;
  title: string;
  category: string;
  progress: number;
  target: string;
  status: string;
  dueDate: string;
  owner: string;
  linkedTasks: string[];
  linkedWorkflows: string[];
  linkedTrackers: string[];
  latestFeedback: string;
  nextAction: string;
  notes: string[];
}

export interface EvaluationCriterion {
  id: string;
  title: string;
  score: string;
  status: string;
  description: string;
  owner: string;
  dueDate: string;
  nextAction: string;
}

export interface FeedbackRecord {
  id: string;
  source: string;
  sourceRole: string;
  date: string;
  type: string;
  status: string;
  rating: string;
  text: string;
  relatedWork: string;
  suggestedImprovement: string;
  actionStatus: string;
  reviewed: boolean;
}

export interface LearningRecord {
  id: string;
  title: string;
  category: string;
  requirement: string;
  progress: number;
  dueDate: string;
  status: string;
  linkedGoal: string;
  description: string;
}

export interface ContributionRecord {
  id: string;
  date: string;
  type: string;
  title: string;
  linkedWork: string;
  impact: string;
  status: string;
  evidence: string;
  description: string;
}

export interface RoleMetric {
  id: string;
  label: string;
  value: string;
  status: string;
  impact: string;
  description: string;
  nextAction: string;
}

export interface PerformanceEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  status: string;
  description: string;
}

export interface AiInsight {
  id: string;
  title: string;
  description: string;
  status: string;
  prompt: string;
}

export interface EvaluationCycle {
  id: string;
  title: string;
  stage: string;
  rating: string;
  nextReviewDate: string;
  steps: Array<{
    label: string;
    status: string;
    date: string;
  }>;
}

export interface PerformanceDataset {
  kpis: PerformanceKpi[];
  goals: GoalRecord[];
  evaluation: EvaluationCycle;
  criteria: EvaluationCriterion[];
  feedback: FeedbackRecord[];
  learning: LearningRecord[];
  contributions: ContributionRecord[];
  roleMetrics: RoleMetric[];
  aiInsights: AiInsight[];
  events: PerformanceEvent[];
  drivers: RoleMetric[];
}

const baseGoals: GoalRecord[] = [
  {
    id: 'GOAL-201',
    title: 'Improve DQ Ways of Working',
    category: 'Process Excellence',
    progress: 75,
    target: 'Adopt DQ operating practices across assigned work',
    status: 'On Track',
    dueDate: '30 Jun 2025',
    owner: 'Amina Hassan',
    linkedTasks: ['TSK-2041 Review DQ Ways of Working'],
    linkedWorkflows: ['WF-208 Quarterly Governance Review'],
    linkedTrackers: ['TRK-101 My Delivery Tracker'],
    latestFeedback: 'Great initiative in leading the DQ Ways of Working session.',
    nextAction: 'Document two examples of applying the DQ operating model to current work.',
    notes: ['Discussed process ownership with manager.']
  },
  {
    id: 'GOAL-202',
    title: 'Enhance Governance Review Quality',
    category: 'Governance',
    progress: 60,
    target: 'Improve evidence quality and review readiness',
    status: 'At Risk',
    dueDate: '30 Jun 2025',
    owner: 'Amina Hassan',
    linkedTasks: ['CTL-205 Complete Control Assessment'],
    linkedWorkflows: ['WF-208 Quarterly Governance Review'],
    linkedTrackers: ['TRK-129 Control Actions Tracker'],
    latestFeedback: 'Ensure tracker updates are completed before the review cycle.',
    nextAction: 'Close the open evidence gaps before the next governance checkpoint.',
    notes: ['Evidence quality checklist added.']
  },
  {
    id: 'GOAL-203',
    title: 'Complete Learning Path: Risk Management',
    category: 'Learning & Development',
    progress: 50,
    target: 'Complete core risk management modules',
    status: 'On Track',
    dueDate: '15 Jun 2025',
    owner: 'Amina Hassan',
    linkedTasks: ['LRN-018 Complete Role-based Learning Path'],
    linkedWorkflows: ['WF-412 Personal Contribution Review'],
    linkedTrackers: ['TRK-118 Learning Progress Tracker'],
    latestFeedback: 'Learning progress is improving and aligned to current role needs.',
    nextAction: 'Complete the Risk Management Basics module this week.',
    notes: ['Module 2 completed.']
  },
  {
    id: 'GOAL-204',
    title: 'Drive Timely Tracker Updates',
    category: 'Delivery',
    progress: 90,
    target: 'Keep assigned trackers current before review meetings',
    status: 'On Track',
    dueDate: '30 Jun 2025',
    owner: 'Amina Hassan',
    linkedTasks: ['PRJ-031 Update Project Plan'],
    linkedWorkflows: ['WF-301 Access Request Fulfilment'],
    linkedTrackers: ['TRK-101 My Delivery Tracker', 'TRK-118 Learning Progress Tracker'],
    latestFeedback: 'Strong follow-through on workflow updates.',
    nextAction: 'Maintain weekly tracker update rhythm.',
    notes: ['Tracker updates completed before last review.']
  }
];

const newJoinerGoals: GoalRecord[] = [
  {
    ...baseGoals[0],
    id: 'GOAL-101',
    title: 'Complete DWS.01 Onboarding Readiness',
    category: 'Onboarding',
    progress: 35,
    status: 'In Progress',
    dueDate: '15 Jun 2025',
    nextAction: 'Complete profile setup and first onboarding checklist review.'
  },
  {
    ...baseGoals[2],
    id: 'GOAL-102',
    title: 'Complete Learning Path: DQ Essentials',
    progress: 30,
    status: 'Watch',
    dueDate: '20 Jun 2025',
    nextAction: 'Continue DQ Ways of Working and onboarding modules.'
  },
  {
    ...baseGoals[3],
    id: 'GOAL-103',
    title: 'Submit First Contribution Evidence',
    category: 'Contribution',
    progress: 40,
    status: 'In Progress',
    dueDate: '30 Jun 2025',
    nextAction: 'Attach evidence from your first completed task.'
  }
];

const feedback: FeedbackRecord[] = [
  {
    id: 'FB-301',
    source: 'John Wayua',
    sourceRole: 'Manager',
    date: '20 May 2025',
    type: 'Coaching',
    status: 'Positive',
    rating: '4.6',
    text: 'Great initiative in leading the DQ Ways of Working session.',
    relatedWork: 'GOAL-201 Improve DQ Ways of Working',
    suggestedImprovement: 'Document the reusable facilitation approach for future sessions.',
    actionStatus: 'Reviewed',
    reviewed: true
  },
  {
    id: 'FB-302',
    source: 'Naomi Kimani',
    sourceRole: 'Governance Lead',
    date: '19 May 2025',
    type: 'Governance',
    status: 'Action Required',
    rating: '3.8',
    text: 'Ensure tracker updates are completed before the review cycle.',
    relatedWork: 'TRK-129 Control Actions Tracker',
    suggestedImprovement: 'Set a recurring reminder before each governance review.',
    actionStatus: 'Open',
    reviewed: false
  },
  {
    id: 'FB-303',
    source: 'Bilal Waqar',
    sourceRole: 'Project Lead',
    date: '18 May 2025',
    type: 'Delivery',
    status: 'Positive',
    rating: '4.4',
    text: 'Strong follow-through on workflow updates.',
    relatedWork: 'WF-208 Quarterly Governance Review',
    suggestedImprovement: 'Share the update format with the wider team.',
    actionStatus: 'Reviewed',
    reviewed: true
  },
  {
    id: 'FB-304',
    source: 'Sreya Lakshmi',
    sourceRole: 'Peer',
    date: '16 May 2025',
    type: 'Peer',
    status: 'Positive',
    rating: '4.5',
    text: 'Helpful knowledge article on onboarding steps.',
    relatedWork: 'KNO-522 Onboarding FAQ Update',
    suggestedImprovement: 'Add screenshots for common access issues.',
    actionStatus: 'Reviewed',
    reviewed: true
  }
];

const learning: LearningRecord[] = [
  {
    id: 'LRN-401',
    title: 'DQ Ways of Working',
    category: 'Required',
    requirement: 'Required',
    progress: 80,
    dueDate: '31 May 2025',
    status: 'In Progress',
    linkedGoal: 'Improve DQ Ways of Working',
    description: 'Understand how DQ structures, governs, and delivers work in DWS.01.'
  },
  {
    id: 'LRN-402',
    title: 'Risk Management Basics',
    category: 'Recommended',
    requirement: 'Recommended',
    progress: 40,
    dueDate: '15 Jun 2025',
    status: 'In Progress',
    linkedGoal: 'Complete Learning Path: Risk Management',
    description: 'Build foundational risk review and mitigation skills.'
  },
  {
    id: 'LRN-403',
    title: 'Governance Review Process',
    category: 'Required',
    requirement: 'Required',
    progress: 60,
    dueDate: '28 May 2025',
    status: 'Due Soon',
    linkedGoal: 'Enhance Governance Review Quality',
    description: 'Learn the DQ governance review stages and evidence expectations.'
  },
  {
    id: 'LRN-404',
    title: 'Knowledge Contribution Standards',
    category: 'Recommended',
    requirement: 'Recommended',
    progress: 0,
    dueDate: '30 Jun 2025',
    status: 'Not Started',
    linkedGoal: 'Improve DQ Ways of Working',
    description: 'Learn how to author helpful knowledge articles for DWS users.'
  }
];

const contributions: ContributionRecord[] = [
  {
    id: 'CON-501',
    date: '18 May 2025',
    type: 'Completed Task',
    title: 'Update Project Plan: DWS Roadmap',
    linkedWork: 'PRJ-031',
    impact: 'Medium Impact',
    status: 'Completed',
    evidence: 'Evidence attached',
    description: 'Updated roadmap milestones and linked governance dependencies.'
  },
  {
    id: 'CON-502',
    date: '16 May 2025',
    type: 'Tracker Update',
    title: 'Strategic Initiatives Tracker',
    linkedWork: 'TRK-118',
    impact: 'High Impact',
    status: 'Completed',
    evidence: 'Tracker audit trail',
    description: 'Updated initiative health, blockers, and target dates before review.'
  },
  {
    id: 'CON-503',
    date: '14 May 2025',
    type: 'Workflow Contribution',
    title: 'Access Request Review',
    linkedWork: 'WF-301',
    impact: 'Medium Impact',
    status: 'Completed',
    evidence: 'Workflow decision log',
    description: 'Provided context and ownership for access fulfilment review.'
  },
  {
    id: 'CON-504',
    date: '12 May 2025',
    type: 'Knowledge Article',
    title: 'Onboarding FAQ Update',
    linkedWork: 'KNO-522',
    impact: 'Low Impact',
    status: 'Completed',
    evidence: 'Published article',
    description: 'Added onboarding FAQ guidance for new DWS users.'
  },
  {
    id: 'CON-505',
    date: '10 May 2025',
    type: 'Governance Action',
    title: 'Q2 Review Follow-up',
    linkedWork: 'GOV-144',
    impact: 'High Impact',
    status: 'Completed',
    evidence: 'Control review note',
    description: 'Closed follow-up action from Q2 governance review.'
  }
];

const roleMetrics: Record<WorkspaceRole, RoleMetric[]> = {
  Associate: [
    { id: 'ROLE-ASSOC-1', label: 'Delivery Quality', value: '82%', status: 'On Track', impact: 'High Impact', description: 'Quality of assigned task outcomes and supporting evidence.', nextAction: 'Attach final evidence to open delivery items.' },
    { id: 'ROLE-ASSOC-2', label: 'Task Completion', value: '84%', status: 'On Track', impact: 'High Impact', description: 'Completion rate for assigned work in the active cycle.', nextAction: 'Close overdue tasks before the weekly review.' },
    { id: 'ROLE-ASSOC-3', label: 'Learning Readiness', value: '60%', status: 'Watch', impact: 'Medium Impact', description: 'Progress against required and recommended learning.', nextAction: 'Complete Governance Review Process module.' },
    { id: 'ROLE-ASSOC-4', label: 'Tracker Participation', value: '76%', status: 'In Progress', impact: 'Medium Impact', description: 'Consistency of updates in assigned trackers.', nextAction: 'Update tracker records before review meetings.' },
    { id: 'ROLE-ASSOC-5', label: 'Knowledge Contribution', value: '3', status: 'On Track', impact: 'Low Impact', description: 'Knowledge articles and reusable context added.', nextAction: 'Add screenshots to onboarding article.' }
  ],
  'Manager / Lead': [
    { id: 'ROLE-MGR-1', label: 'Team Performance', value: '78%', status: 'On Track', impact: 'High Impact', description: 'Team delivery and completion health.', nextAction: 'Review two blocked items with owners.' },
    { id: 'ROLE-MGR-2', label: 'Workload Balance', value: 'Watch', status: 'Watch', impact: 'High Impact', description: 'Balance of work across assigned team members.', nextAction: 'Reassign one at-risk task.' },
    { id: 'ROLE-MGR-3', label: 'Review Completion', value: '68%', status: 'In Progress', impact: 'High Impact', description: 'Completion rate for manager reviews.', nextAction: 'Finish pending review notes.' },
    { id: 'ROLE-MGR-4', label: 'Team Blockers', value: '4', status: 'At Risk', impact: 'High Impact', description: 'Open blockers impacting team delivery.', nextAction: 'Escalate overdue dependencies.' },
    { id: 'ROLE-MGR-5', label: 'Feedback Given', value: '9', status: 'On Track', impact: 'Medium Impact', description: 'Coaching and feedback provided this cycle.', nextAction: 'Give feedback on two recent contributions.' },
    { id: 'ROLE-MGR-6', label: 'Approval Responsiveness', value: '82%', status: 'On Track', impact: 'Medium Impact', description: 'Timeliness of approval decisions.', nextAction: 'Review pending access approval.' }
  ],
  'Governance Lead': [
    { id: 'ROLE-GOV-1', label: 'Governance SLA', value: '86%', status: 'On Track', impact: 'High Impact', description: 'Timeliness of governance review actions.', nextAction: 'Resolve reviews due this week.' },
    { id: 'ROLE-GOV-2', label: 'Review Quality', value: '4.1/5', status: 'On Track', impact: 'High Impact', description: 'Quality of governance comments and decisions.', nextAction: 'Document rationale on watch items.' },
    { id: 'ROLE-GOV-3', label: 'Compliance Actions', value: '7', status: 'In Progress', impact: 'High Impact', description: 'Open compliance follow-up actions.', nextAction: 'Close overdue evidence item.' },
    { id: 'ROLE-GOV-4', label: 'Control Review Metrics', value: '74%', status: 'Watch', impact: 'Medium Impact', description: 'Control review completion and evidence quality.', nextAction: 'Review CTL-205 evidence pack.' },
    { id: 'ROLE-GOV-5', label: 'Risk Review Completion', value: '80%', status: 'On Track', impact: 'High Impact', description: 'Risk reviews completed in the active cycle.', nextAction: 'Confirm owner for RSK-1024.' },
    { id: 'ROLE-GOV-6', label: 'Escalation Closure', value: '5', status: 'In Progress', impact: 'Medium Impact', description: 'Escalations closed this cycle.', nextAction: 'Close one governance escalation.' }
  ],
  'Product / Admin': [
    { id: 'ROLE-ADM-1', label: 'Feature Delivery', value: '70%', status: 'In Progress', impact: 'High Impact', description: 'Delivery progress for product/admin improvements.', nextAction: 'Confirm acceptance on workspace dashboard updates.' },
    { id: 'ROLE-ADM-2', label: 'Platform Adoption', value: '64%', status: 'Watch', impact: 'High Impact', description: 'Adoption of configured workspace capabilities.', nextAction: 'Review feedback from new users.' },
    { id: 'ROLE-ADM-3', label: 'Backlog Health', value: '12 open', status: 'In Progress', impact: 'Medium Impact', description: 'Health of prototype and platform backlog.', nextAction: 'Triage high-priority feedback.' },
    { id: 'ROLE-ADM-4', label: 'Configuration Quality', value: '88%', status: 'On Track', impact: 'High Impact', description: 'Quality of template, workflow, and permission configuration.', nextAction: 'Review template approval rule.' },
    { id: 'ROLE-ADM-5', label: 'Template Updates', value: '6', status: 'On Track', impact: 'Medium Impact', description: 'Configured templates updated this cycle.', nextAction: 'Publish reviewed governance template.' },
    { id: 'ROLE-ADM-6', label: 'User Feedback Closure', value: '58%', status: 'Watch', impact: 'Medium Impact', description: 'Closure rate for open product feedback.', nextAction: 'Close feedback items linked to onboarding.' }
  ]
};

export function getPerformanceDataset(mode: ViewingMode, role: WorkspaceRole): PerformanceDataset {
  const newJoiner = mode === 'first-time';
  const goals = newJoiner ? newJoinerGoals : baseGoals;
  const kpis: PerformanceKpi[] = newJoiner
    ? [
      { label: 'Overall Progress', value: '42%', helper: 'Onboarding cycle started', status: 'In Progress' },
      { label: 'Goals Progress', value: '35%', helper: 'First goals created', status: 'Watch' },
      { label: 'Task Completion', value: '64%', helper: '4 onboarding tasks open', status: 'In Progress' },
      { label: 'Onboarding Readiness', value: '55%', helper: 'Profile and access in progress', status: 'Watch' },
      { label: 'Learning Progress', value: '30%', helper: '5 modules remaining', status: 'Watch' },
      { label: 'Feedback Pending', value: '1', helper: 'Needs your review', status: 'Pending' }
    ]
    : [
      { label: 'Overall Progress', value: '72%', helper: '8% vs last quarter', status: 'On Track' },
      { label: 'Goals Progress', value: '67%', helper: '3 goals on track', status: 'On Track' },
      { label: 'Task Completion', value: '84%', helper: '6% vs last quarter', status: 'On Track' },
      { label: 'On-time Delivery', value: '78%', helper: '4% below target', status: 'Watch' },
      { label: 'Learning Progress', value: '60%', helper: '5 modules remaining', status: 'In Progress' },
      { label: 'Feedback Pending', value: '2', helper: 'Needs your review', status: 'Pending' }
    ];
  const evaluation: EvaluationCycle = newJoiner
    ? {
      id: 'EVAL-ONB-2025',
      title: 'Onboarding Performance Check',
      stage: 'Self Review',
      rating: '3.6 / 5',
      nextReviewDate: '15 Jun 2025',
      steps: [
        { label: 'Self Review', status: 'In Progress', date: 'Due 5 Jun' },
        { label: 'Manager Review', status: 'Not Started', date: '10 Jun' },
        { label: 'Calibration', status: 'Not Started', date: '12 Jun' },
        { label: 'Final Review', status: 'Not Started', date: '15 Jun' }
      ]
    }
    : {
      id: 'EVAL-Q2-2025',
      title: 'Q2 2025 Performance Review',
      stage: 'Calibration',
      rating: '4.2 / 5',
      nextReviewDate: '10 Jun 2025',
      steps: [
        { label: 'Self Review', status: 'Completed', date: '10 May' },
        { label: 'Manager Review', status: 'Completed', date: '18 May' },
        { label: 'Calibration', status: 'In Progress', date: '24 May' },
        { label: 'Final Review', status: 'Pending', date: '10 Jun' }
      ]
    };
  const criteria: EvaluationCriterion[] = [
    { id: 'CRT-1', title: 'Task Delivery', score: newJoiner ? '3.4 / 5' : '4.2 / 5', status: 'On Track', description: 'Quality and timeliness of assigned task delivery.', owner: 'Manager', dueDate: evaluation.nextReviewDate, nextAction: 'Attach evidence for high-impact completed work.' },
    { id: 'CRT-2', title: 'Workflow Participation', score: newJoiner ? '3.2 / 5' : '4.0 / 5', status: 'On Track', description: 'Participation in assigned workflows and review cycles.', owner: 'Workflow Owner', dueDate: evaluation.nextReviewDate, nextAction: 'Update open workflow inputs.' },
    { id: 'CRT-3', title: 'Tracker Ownership', score: newJoiner ? '2.8 / 5' : '3.6 / 5', status: 'Watch', description: 'Consistency and quality of tracker updates.', owner: 'Tracker Owner', dueDate: evaluation.nextReviewDate, nextAction: 'Refresh stale tracker records before review.' },
    { id: 'CRT-4', title: 'Knowledge Contribution', score: newJoiner ? '2.5 / 5' : '3.2 / 5', status: 'Needs Improvement', description: 'Contribution of useful knowledge assets and reusable context.', owner: 'Knowledge Office', dueDate: evaluation.nextReviewDate, nextAction: 'Add one knowledge update linked to onboarding or delivery.' },
    { id: 'CRT-5', title: 'Learning Completion', score: newJoiner ? '2.9 / 5' : '3.8 / 5', status: 'On Track', description: 'Completion of required and recommended learning.', owner: 'Learning Center', dueDate: evaluation.nextReviewDate, nextAction: 'Complete one required module this week.' }
  ];
  const aiInsights: AiInsight[] = [
    { id: 'AI-PERF-1', title: newJoiner ? 'You have 3 onboarding goals in progress.' : 'You’re on track to achieve 3 of 4 goals.', description: 'Keep goal evidence updated before your next review.', status: 'On Track', prompt: 'Summarise my performance' },
    { id: 'AI-PERF-2', title: '2 tasks are overdue and may impact your on-time delivery score.', description: 'Resolve overdue items or add mitigation notes.', status: 'Watch', prompt: 'Recommend next actions' },
    { id: 'AI-PERF-3', title: role === 'Governance Lead' ? '2 governance modules are recommended.' : '2 learning modules are recommended to improve your governance skills.', description: 'Learning completion can improve your evaluation readiness.', status: 'In Progress', prompt: 'Explain what affects my rating' },
    { id: 'AI-PERF-4', title: newJoiner ? 'You have 1 new feedback item.' : 'You have 2 new feedback items.', description: 'Review feedback and create action items where needed.', status: 'Pending', prompt: 'Prepare my self-review' },
    { id: 'AI-PERF-5', title: newJoiner ? 'Your onboarding check is due in 27 days.' : 'Your self review is due in 17 days.', description: 'Start preparing achievements and evidence now.', status: 'Due Soon', prompt: 'Generate weekly performance update' }
  ];
  const events: PerformanceEvent[] = newJoiner
    ? [
      { id: 'EVT-1', title: 'Onboarding Self Review', date: '05 Jun', time: '10:00 AM', status: 'Due Soon', description: 'Submit onboarding progress reflection.' },
      { id: 'EVT-2', title: 'Learning Deadline', date: '12 Jun', time: '03:00 PM', status: 'Watch', description: 'Complete required DQ Ways of Working modules.' },
      { id: 'EVT-3', title: 'Goal Review', date: '15 Jun', time: '11:00 AM', status: 'Pending', description: 'Review first goals with manager.' }
    ]
    : [
      { id: 'EVT-4', title: 'Self Review Submission', date: '24 May', time: 'Due in 17 days', status: 'Due Soon', description: 'Submit self-review for Q2 cycle.' },
      { id: 'EVT-5', title: 'Q2 Final Review', date: '10 Jun', time: '10:00 AM · With Manager', status: 'Pending', description: 'Final Q2 review discussion.' },
      { id: 'EVT-6', title: 'Calibration Meeting', date: '18 Jun', time: '02:00 PM · Performance Team', status: 'Pending', description: 'Calibration review with performance stakeholders.' },
      { id: 'EVT-7', title: 'Learning Deadline', date: '20 Jun', time: '05:00 PM', status: 'Watch', description: 'Complete linked learning modules.' },
      { id: 'EVT-8', title: 'Goal Review', date: '30 Jun', time: '01:00 PM', status: 'Pending', description: 'Review goal completion before quarter close.' }
    ];
  return {
    kpis,
    goals,
    evaluation,
    criteria,
    feedback: newJoiner ? feedback.slice(0, 2) : feedback,
    learning: newJoiner ? learning.map((module) => module.title === 'DQ Ways of Working' ? { ...module, progress: 45, status: 'In Progress' } : module) : learning,
    contributions: newJoiner ? contributions.slice(0, 3) : contributions,
    roleMetrics: roleMetrics[role],
    aiInsights,
    events,
    drivers: [
      { id: 'DRV-1', label: 'Task Completion', value: newJoiner ? '64%' : '84%', status: 'On Track', impact: 'High Impact', description: 'Task completion rate contributes strongly to performance.', nextAction: 'Close overdue tasks with evidence.' },
      { id: 'DRV-2', label: 'Workflow Participation', value: '6 workflows', status: 'On Track', impact: 'High Impact', description: 'Active workflow participation supports delivery and governance scores.', nextAction: 'Update workflow inputs before review.' },
      { id: 'DRV-3', label: 'Tracker Updates', value: '9 trackers', status: 'Watch', impact: 'Medium Impact', description: 'Timely tracker updates reduce review risk.', nextAction: 'Update stale tracker items.' },
      { id: 'DRV-4', label: 'Learning Progress', value: newJoiner ? '30%' : '60%', status: 'Watch', impact: 'Medium Impact', description: 'Learning progress affects readiness and development signals.', nextAction: 'Complete one required module.' },
      { id: 'DRV-5', label: 'Knowledge Contribution', value: '3 articles', status: 'On Track', impact: 'Low Impact', description: 'Knowledge contributions show reusable DQ impact.', nextAction: 'Improve the onboarding FAQ article.' }
    ]
  };
}
