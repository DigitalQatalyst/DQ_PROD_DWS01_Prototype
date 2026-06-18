import type { LucideIcon } from 'lucide-react';
import { FileText, LayoutTemplate } from 'lucide-react';

export interface MyWorkKpi {
  label: string;
  value: string;
  subtitle: string;
}

export interface FocusTodayItem {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  route: string;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
}

export interface QuickAccessLink {
  label: string;
  route: string;
  icon: LucideIcon;
}

export const myWorkKpis: MyWorkKpi[] = [
  { label: 'Assigned to Me', value: '24', subtitle: '7 new' },
  { label: 'Due This Week', value: '6', subtitle: '2 today' },
  { label: 'Overdue', value: '3', subtitle: '1 high priority' },
  { label: 'Blocked', value: '4', subtitle: 'Needs attention' },
];

export const focusTodayItems: FocusTodayItem[] = [
  {
    id: 'TSK-1042',
    title: 'Monthly workforce report validation',
    priority: 'High',
    route: '/tasks/my-work/assigned-tasks/TSK-1042',
  },
  {
    id: 'TSK-1087',
    title: 'Update operating rhythm pack',
    priority: 'Medium',
    route: '/tasks/my-work/assigned-tasks/TSK-1087',
  },
];

export const recentActivityItems: RecentActivityItem[] = [
  {
    id: 'act-1',
    action: 'Comment added by you',
    detail: 'TSK-1042 — Monthly workforce report validation',
    timestamp: '12m ago',
  },
  {
    id: 'act-2',
    action: 'Status updated',
    detail: 'TSK-1087 moved to In Progress',
    timestamp: '1h ago',
  },
  {
    id: 'act-3',
    action: 'Evidence uploaded',
    detail: 'TSK-1131 — Data validation summary attached',
    timestamp: '3h ago',
  },
  {
    id: 'act-4',
    action: 'Blocker raised',
    detail: 'BLK-119 — Dependency blocking task completion',
    timestamp: 'Yesterday',
  },
];

export const quickAccessLinks: QuickAccessLink[] = [
  { label: 'My Task Notes', route: '/tasks/my-work/my-updates', icon: FileText },
  { label: 'Task Templates', route: '/tasks/task-creation-templates/select-task-template', icon: LayoutTemplate },
];
