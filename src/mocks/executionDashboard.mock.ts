import type { KpiStatus } from '../data/featureAreas';

export interface ExecutionKpi {
  label: string;
  value: string;
  subtitle: string;
  status: KpiStatus;
  trend?: string;
}

export interface StatusSegment {
  label: string;
  count: number;
  color: string;
}

export interface PriorityBar {
  label: string;
  count: number;
  color: string;
}

export interface TrendPoint {
  week: string;
  value: number;
}

export interface OwnerWorkload {
  name: string;
  open: number;
  inProgress: number;
}

export interface RecentDecision {
  id: string;
  description: string;
  dotColor: string;
  meta: string;
}

export interface ClosureQualityMetric {
  label: string;
  percent: number;
  color: string;
}

export interface ActionItem {
  id: string;
  action: string;
  owner: string;
  due: string;
  status: string;
  priority: 'HIGH' | 'MED' | 'LOW' | 'OPEN';
}

export const executionKpis: ExecutionKpi[] = [
  { label: 'Open Tasks', value: '34', subtitle: 'across 3 trackers', status: 'info' },
  { label: 'Due Today', value: '7', subtitle: 'next 12:00 AM', status: 'warning' },
  { label: 'Overdue Tasks', value: '4', subtitle: 'needs attention', status: 'danger' },
  { label: 'Completed', value: '21', subtitle: 'this week', status: 'success' },
  { label: 'Completion Rate', value: '84%', subtitle: 'vs last week', status: 'success', trend: '+5%' },
];

export const tasksByStatus: StatusSegment[] = [
  { label: 'Open', count: 14, color: 'var(--color-info)' },
  { label: 'In Progress', count: 11, color: 'var(--color-primary)' },
  { label: 'Blocked', count: 4, color: 'var(--color-danger)' },
  { label: 'Done', count: 21, color: 'var(--color-success)' },
  { label: 'Review', count: 3, color: 'var(--color-warning)' },
];

export const tasksByPriority: PriorityBar[] = [
  { label: 'Critical', count: 12, color: 'bg-danger' },
  { label: 'High', count: 14, color: 'bg-warning' },
  { label: 'Medium', count: 10, color: 'bg-primary' },
  { label: 'Low', count: 8, color: 'bg-success' },
];

export const completionTrend: TrendPoint[] = [
  { week: 'W1', value: 14 },
  { week: 'W2', value: 17 },
  { week: 'W3', value: 16 },
  { week: 'W4', value: 19 },
  { week: 'W5', value: 22 },
  { week: 'W6', value: 20 },
  { week: 'W7', value: 24 },
  { week: 'W8', value: 21 },
];

export const workloadByOwner: OwnerWorkload[] = [
  { name: 'Vishnu', open: 3, inProgress: 4 },
  { name: 'Kenzia', open: 2, inProgress: 5 },
  { name: 'John', open: 4, inProgress: 2 },
  { name: 'Colin', open: 1, inProgress: 3 },
  { name: 'Prisha', open: 3, inProgress: 3 },
  { name: 'Dennis', open: 2, inProgress: 2 },
  { name: 'Ross', open: 1, inProgress: 4 },
  { name: 'Ian', open: 2, inProgress: 1 },
];

export const recentDecisions: RecentDecision[] = [
  { id: 'd1', description: 'Approved new onboarding workflow', dotColor: 'bg-warning', meta: 'Today · Vishnu' },
  { id: 'd2', description: 'Returned access request for evidence', dotColor: 'bg-danger', meta: 'Yesterday · Kenzia' },
  { id: 'd3', description: 'Escalated SLA breach to unit lead', dotColor: 'bg-danger', meta: 'Yesterday · John' },
  { id: 'd4', description: 'Closed quarterly review tracker item', dotColor: 'bg-success', meta: '2 days ago · Colin' },
  { id: 'd5', description: 'Delegated governance review to Prisha', dotColor: 'bg-info', meta: '3 days ago · Dennis' },
];

export const closureQuality: ClosureQualityMetric[] = [
  { label: 'Properly evidenced closures', percent: 70, color: 'bg-success' },
  { label: 'Closures with follow-up', percent: 22, color: 'bg-warning' },
  { label: 'Rework rate', percent: 8, color: 'bg-danger' },
];

export const openActionItems: ActionItem[] = [
  { id: 'a1', action: 'Review role/access request', owner: 'Kenzia', due: 'Today', status: 'Open', priority: 'HIGH' },
  { id: 'a2', action: 'Attach evidence for closure review', owner: 'Vishnu', due: 'Today', status: 'In Progress', priority: 'MED' },
  { id: 'a3', action: 'Update blocker status on tracker', owner: 'John', due: 'Tomorrow', status: 'Open', priority: 'LOW' },
  { id: 'a4', action: 'Confirm SLA extension approval', owner: 'Colin', due: 'Fri', status: 'Open', priority: 'OPEN' },
  { id: 'a5', action: 'Complete governance checklist', owner: 'Prisha', due: 'Mon', status: 'In Progress', priority: 'MED' },
];
