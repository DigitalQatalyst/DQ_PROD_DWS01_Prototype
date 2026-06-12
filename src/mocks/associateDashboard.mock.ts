import {
  BookOpen,
  CheckSquare,
  Clock,
  FileText,
  FolderOpen,
  Home,
  type LucideIcon,
} from 'lucide-react';

export interface ActionSnapshotKpi {
  label: string;
  value: string;
  subtitle: string;
  route: string;
}

export interface NextBestAction {
  id: string;
  title: string;
  category: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  route: string;
}

export interface PriorityAlert {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'On Track' | 'Attention' | 'At Risk' | 'Active';
  route: string;
}

export interface DashboardActivityItem {
  id: string;
  text: string;
  time: string;
}

export interface DashboardQuickLink {
  label: string;
  route: string;
  icon: LucideIcon;
}

export const actionSnapshotKpis: ActionSnapshotKpi[] = [
  { label: 'Active work items', value: '7', subtitle: 'this week', route: '/tasks/my-work/assigned-tasks' },
  { label: 'Pending approvals', value: '3', subtitle: '2 overdue', route: '/workspace/my-requests' },
  { label: 'Open requests', value: '4', subtitle: 'vs yesterday', route: '/workspace/my-requests' },
  { label: 'Blocked items', value: '1', subtitle: 'needs attention', route: '/tasks/my-work/my-blockers' },
  { label: 'Due this week', value: '5', subtitle: 'next: Fri', route: '/tasks/my-work/my-due-actions' },
];

export const nextBestActions: NextBestAction[] = [
  {
    id: 'nba-1',
    title: 'Review onboarding completion evidence',
    category: 'L&D',
    due: 'Due Today',
    priority: 'High',
    route: '/tasks/my-work/assigned-tasks',
  },
  {
    id: 'nba-2',
    title: 'Confirm access request for analytics workspace',
    category: 'Access',
    due: 'Due Tomorrow',
    priority: 'Medium',
    route: '/workspace/my-requests',
  },
  {
    id: 'nba-3',
    title: 'Complete playbook acknowledgement',
    category: 'Practice',
    due: 'Due Fri',
    priority: 'Medium',
    route: '/knowledge',
  },
  {
    id: 'nba-4',
    title: 'Upload closure evidence for support request',
    category: 'Evidence',
    due: 'Due Fri',
    priority: 'Low',
    route: '/tasks/task-updates-evidence/evidence-upload-link',
  },
];

export const priorityAlerts: PriorityAlert[] = [
  {
    id: 'pa-s00',
    code: 'S00',
    title: 'L&D',
    description: 'Onboarding path on schedule',
    status: 'On Track',
    route: '/performance/learning-progress',
  },
  {
    id: 'pa-s01',
    code: 'S01',
    title: 'Practice',
    description: 'Playbook review due today',
    status: 'Attention',
    route: '/knowledge',
  },
  {
    id: 'pa-s02',
    code: 'S02',
    title: 'Products',
    description: '1 product readiness item needs update',
    status: 'At Risk',
    route: '/marketplace/catalogue',
  },
  {
    id: 'pa-s03',
    code: 'S03',
    title: 'Projects',
    description: '2 project milestones awaiting your input',
    status: 'Active',
    route: '/trackers',
  },
];

export const dashboardRecentActivity: DashboardActivityItem[] = [
  { id: 'ra-1', text: 'Onboarding evidence uploaded.', time: '12m ago' },
  { id: 'ra-2', text: 'Access request moved to review.', time: '38m ago' },
  { id: 'ra-3', text: 'Playbook acknowledgement reminder sent.', time: '2h ago' },
  { id: 'ra-4', text: 'Working session scheduled for Friday.', time: 'Yesterday' },
];

export const dashboardQuickLinks: DashboardQuickLink[] = [
  { label: 'My Work', route: '/tasks/my-work/assigned-tasks', icon: CheckSquare },
  { label: 'Requests', route: '/workspace/my-requests', icon: FileText },
  { label: 'Knowledge / SOPs', route: '/knowledge', icon: BookOpen },
  { label: 'Evidence', route: '/tasks/task-updates-evidence/evidence-upload-link', icon: FolderOpen },
  { label: 'Recently Used', route: '/services/service-hub/recently-used-services', icon: Clock },
  { label: 'Home', route: '/home', icon: Home },
];
