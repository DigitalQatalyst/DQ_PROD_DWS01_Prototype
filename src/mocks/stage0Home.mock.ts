import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Compass,
  Headphones,
  KeyRound,
  LayoutTemplate,
  ListChecks,
  MessageSquare,
  Rocket,
  Users
} from 'lucide-react';

export const HOME_USER_NAME = 'Stephane';

export type SetupCardStatus = 'completed' | 'in-progress' | 'not-started';

export interface SetupJourneyCard {
  id: string;
  title: string;
  description: string;
  status: SetupCardStatus;
  progressLabel: string;
  actionLabel?: string;
}

export const setupJourneyCards: SetupJourneyCard[] = [
  {
    id: 'workspace-setup',
    title: 'Complete Workspace Setup',
    description: 'Personalise workspace profile, role context, and preferences.',
    status: 'completed',
    progressLabel: '3 of 3'
  },
  {
    id: 'platform-onboarding',
    title: 'Start Platform Onboarding',
    description: 'Learn DWS.01 basics and next steps.',
    status: 'completed',
    progressLabel: '2 of 2'
  },
  {
    id: 'access-tools',
    title: 'Request Access & Tools',
    description: 'Request systems, tools, and access needed.',
    status: 'in-progress',
    progressLabel: '1 of 2',
    actionLabel: 'Continue'
  },
  {
    id: 'first-checklist',
    title: 'Open First Action Checklist',
    description: 'Review and complete first action checklist.',
    status: 'not-started',
    progressLabel: '0 of 1',
    actionLabel: 'Open checklist'
  }
];

export const operatingRhythmSteps = [
  { label: 'Discover', description: 'Find insights, services, and opportunities.' },
  { label: 'Start Work', description: 'Initiate work with the right templates.' },
  { label: 'Track Execution', description: 'Monitor progress and stay informed.' },
  { label: 'Govern', description: 'Ensure compliance and quality.' },
  { label: 'Improve', description: 'Learn, adapt and drive better outcomes.' }
];

export interface MarketplaceIntro {
  id: string;
  title: string;
  description: string;
  route: string;
  accentClass: string;
}

export const marketplaceIntroCards: MarketplaceIntro[] = [
  {
    id: 'discern',
    title: 'Discern Marketplace',
    description: 'Discover insights, intelligence, and opportunities.',
    route: '/marketplaces/knowledge',
    accentClass: 'bg-info-surface text-info-text'
  },
  {
    id: 'design',
    title: 'Design Marketplace',
    description: 'Design solutions, plans, and experiences.',
    route: '/marketplaces/task-templates',
    accentClass: 'bg-orange-50 text-secondary'
  },
  {
    id: 'deploy',
    title: 'Deploy Marketplace',
    description: 'Deploy services, solutions, and changes.',
    route: '/marketplaces/services',
    accentClass: 'bg-success-surface text-success-text'
  },
  {
    id: 'drive',
    title: 'Drive Marketplace',
    description: 'Drive performance, adoption, and outcomes.',
    route: '/marketplaces/analytics',
    accentClass: 'bg-warning-surface text-warning-text'
  }
];

export const todaysBrief = {
  summary:
    'You have 4 priority actions today. One request is approaching SLA risk, and your last active work item is ready to resume.',
  recommendedNextStep:
    'Review the returned access request and clear the pending evidence update before EoD.',
  sourceContext: 'Based on tasks, requests, risks, and reviews',
  updatedAt: 'Updated 10:42 AM',
  recommendedItemId: 'REQ-2401'
};

export const todaysPriorities = [
  {
    id: 'resume',
    title: 'Resume Last Work Item',
    primary: 'REQ-2401 · Access & Permission Request',
    secondary: 'Pending evidence update'
  },
  {
    id: 'queue',
    title: 'Open Action Queue',
    primary: '6 items require action today',
    secondary: '2 updates · 1 returned request'
  },
  {
    id: 'reviews',
    title: 'View Pending Reviews',
    primary: '3 reviews awaiting input',
    secondary: '1 closure review · 2 handoffs'
  }
];

export interface WorkOverviewCard {
  id: string;
  title: string;
  headline: string;
  items: { label: string; meta?: string; tone?: 'default' | 'high' | 'medium' }[];
  footerAction: string;
}

export const workOverviewCards: WorkOverviewCard[] = [
  {
    id: 'assigned',
    title: 'Assigned Work',
    headline: '18 active · 6 due this week',
    items: [
      { label: 'DWS01 Service Marketplace refinement', meta: 'Due today' },
      { label: 'DIA Stage 01 validation', meta: 'Due tomorrow' },
      { label: 'Corp Web launch support', meta: 'Due Fri' }
    ],
    footerAction: 'View all assigned work'
  },
  {
    id: 'requests',
    title: 'Open Requests',
    headline: '7 open · 2 need response',
    items: [
      { label: 'REQ-2401 Access & Permission Request', meta: 'Pending evidence' },
      { label: 'REQ-2398 Platform Support', meta: 'In fulfilment' },
      { label: 'REQ-2389 HRA Onboarding', meta: 'Waiting approval' }
    ],
    footerAction: 'View requests'
  },
  {
    id: 'activity',
    title: 'Recent Activity',
    headline: '9 updates since last visit',
    items: [
      { label: 'Comment added on Workflow Centre spec', meta: '10:12 AM' },
      { label: 'Task status changed to Review', meta: 'Yesterday' },
      { label: 'Mentioned in Service Marketplace thread', meta: 'Yesterday' }
    ],
    footerAction: 'View activity'
  },
  {
    id: 'risk',
    title: 'Risk Watch',
    headline: '3 active signals',
    items: [
      { label: 'SLA risk: Access request due in 8h', meta: 'High', tone: 'high' },
      { label: 'Blocker: Missing approval owner', meta: 'High', tone: 'high' },
      { label: 'Overdue update: Task evidence pending', meta: 'Medium', tone: 'medium' }
    ],
    footerAction: 'View risk watch'
  }
];

export const platformUpdates = [
  { id: 'pu-1', title: "DWS01 Q2 Platform Release — What's New", date: 'May 10, 2024' },
  { id: 'pu-2', title: 'Upcoming Maintenance Window — May 18', date: 'May 08, 2024' },
  { id: 'pu-3', title: 'New Onboarding Resources Available', date: 'May 06, 2024' }
];

export interface SupportAction {
  id: string;
  label: string;
  icon: LucideIcon;
  iconClass: string;
}

export const supportActionsNewJoiner: SupportAction[] = [
  { id: 'service', label: 'Start Service Request', icon: MessageSquare, iconClass: 'bg-info-surface text-info-text' },
  { id: 'it', label: 'IT & Access Requests', icon: KeyRound, iconClass: 'bg-orange-50 text-secondary' },
  { id: 'hra', label: 'HRA & Onboarding', icon: Users, iconClass: 'bg-success-surface text-success-text' },
  { id: 'platform', label: 'Platform Support', icon: Headphones, iconClass: 'bg-navy-50 text-primary' }
];

export const supportActionsReturning: SupportAction[] = [
  { id: 'my-requests', label: 'View My Requests', icon: ListChecks, iconClass: 'bg-info-surface text-info-text' },
  { id: 'service', label: 'Start Service Request', icon: MessageSquare, iconClass: 'bg-orange-50 text-secondary' },
  { id: 'platform', label: 'Platform Support', icon: Headphones, iconClass: 'bg-success-surface text-success-text' },
  { id: 'hra', label: 'HRA & Onboarding', icon: Users, iconClass: 'bg-navy-50 text-primary' }
];

export const searchSuggestions = [
  'Tasks',
  'Requests',
  'Services',
  'Templates',
  'Knowledge',
  'Dashboards',
  'Owners'
];
