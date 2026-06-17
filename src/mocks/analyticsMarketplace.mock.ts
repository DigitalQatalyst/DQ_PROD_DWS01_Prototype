import type { AnalyticsAsset } from '../types/analyticsMarketplace';

export interface AssetDetail {
  asset: AnalyticsAsset;
  metrics: { label: string; value: string; direction?: 'up' | 'down' | 'neutral' }[];
  charts: { title: string; type: 'bar' | 'line' | 'donut' | 'metric'; data: number[]; labels?: string[] }[];
  relatedAssets: string[];
}

export const analyticsAssets: AnalyticsAsset[] = [
  {
    id: 'DP-001',
    slug: 'my-performance-snapshot',
    name: 'My Performance Snapshot',
    purpose: 'Personal execution metrics, closure quality, and SLA adherence.',
    category: 'Personal',
    owner: 'DQ Platform',
    type: 'Dashboard',
    dataScope: 'Self',
    refreshRhythm: 'Daily',
    lastUpdated: '2026-06-16',
    roleAccess: ['Associate'],
  },
  {
    id: 'DP-002',
    slug: 'team-execution-dashboard',
    name: 'Team Execution Dashboard',
    purpose: 'Team workload, flow health, blockers, and missing updates.',
    category: 'Team',
    owner: 'DQ Platform',
    type: 'Dashboard',
    dataScope: 'Team',
    refreshRhythm: 'Real-time',
    lastUpdated: '2026-06-17',
    roleAccess: ['Scrum Master', 'Team / Squad Lead'],
  },
  {
    id: 'DP-003',
    slug: 'unit-visibility-dashboard',
    name: 'Unit Visibility Dashboard',
    purpose: 'Unit health, outcome tracking, and governance risk signals.',
    category: 'Unit',
    owner: 'DQ Platform',
    type: 'Dashboard',
    dataScope: 'Unit',
    refreshRhythm: 'Daily',
    lastUpdated: '2026-06-17',
    roleAccess: ['Unit Lead'],
  },
  {
    id: 'DP-004',
    slug: 'sla-dashboard',
    name: 'SLA Dashboard',
    purpose: 'Cross-platform SLA exposure, aging distribution, and breaches.',
    category: 'Enterprise',
    owner: 'DQ Platform',
    type: 'Dashboard',
    dataScope: 'Enterprise',
    refreshRhythm: 'Real-time',
    lastUpdated: '2026-06-17',
    roleAccess: ['Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'HRA', 'Admin', 'Support', 'CEO'],
  },
  {
    id: 'DP-005',
    slug: 'governance-dashboard',
    name: 'Governance Dashboard',
    purpose: 'Audit exceptions, policy compliance, and closure quality risks.',
    category: 'Enterprise',
    owner: 'DQ Platform',
    type: 'Dashboard',
    dataScope: 'Enterprise',
    refreshRhythm: 'Daily',
    lastUpdated: '2026-06-16',
    roleAccess: ['CEO', 'Admin'],
  },
  {
    id: 'DP-006',
    slug: 'ceo-enterprise-dashboard',
    name: 'CEO Enterprise Dashboard',
    purpose: 'Enterprise execution health, strategic initiatives, and value delivery.',
    category: 'Enterprise',
    owner: 'DQ Platform',
    type: 'Dashboard',
    dataScope: 'Enterprise',
    refreshRhythm: 'Real-time',
    lastUpdated: '2026-06-17',
    roleAccess: ['CEO'],
  },
  {
    id: 'RP-001',
    slug: 'workforce-readiness-report',
    name: 'Workforce Readiness Report',
    purpose: 'HRA readiness checks, policy compliance, and new joiner status.',
    category: 'Enterprise',
    owner: 'HRA',
    type: 'Report',
    dataScope: 'Enterprise',
    refreshRhythm: 'Weekly',
    lastUpdated: '2026-06-14',
    roleAccess: ['HRA', 'Admin'],
  },
  {
    id: 'RP-002',
    slug: 'audit-compliance-report',
    name: 'Audit & Compliance Report',
    purpose: 'Audit trail, permission exceptions, and config drift monitoring.',
    category: 'Enterprise',
    owner: 'Platform Admin',
    type: 'Report',
    dataScope: 'Enterprise',
    refreshRhythm: 'Weekly',
    lastUpdated: '2026-06-15',
    roleAccess: ['Admin', 'CEO'],
  },
  {
    id: 'VW-001',
    slug: 'support-operations-view',
    name: 'Support Operations View',
    purpose: 'Central queue, triage, routed requests, and SLA risk overview.',
    category: 'Enterprise',
    owner: 'Support Operations',
    type: 'View',
    dataScope: 'Enterprise',
    refreshRhythm: 'Real-time',
    lastUpdated: '2026-06-17',
    roleAccess: ['Support', 'Admin'],
  },
  {
    id: 'VW-002',
    slug: 'operating-discipline-view',
    name: 'Operating Discipline View',
    purpose: 'Unit-level operating discipline, governance health, and policy adherence.',
    category: 'Enterprise',
    owner: 'DQ Platform',
    type: 'View',
    dataScope: 'Enterprise',
    refreshRhythm: 'Daily',
    lastUpdated: '2026-06-16',
    roleAccess: ['Unit Lead', 'Admin', 'CEO'],
  },
];

export const assetDetails: Record<string, AssetDetail> = {
  'my-performance-snapshot': {
    asset: analyticsAssets[0],
    metrics: [
      { label: 'Tasks Completed', value: '24', direction: 'up' },
      { label: 'SLA Adherence', value: '96%', direction: 'up' },
      { label: 'Closure Quality', value: '4.8/5', direction: 'up' },
      { label: 'Avg Cycle Time', value: '2.4d', direction: 'down' },
    ],
    charts: [
      { title: 'Weekly Task Completion', type: 'bar', data: [18, 22, 20, 24, 21, 19, 24], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      { title: 'SLA Trend (Last 30 Days)', type: 'line', data: [92, 94, 93, 95, 96], labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'] },
      { title: 'Task Breakdown by Type', type: 'donut', data: [40, 25, 20, 15], labels: ['Standard', 'Urgent', 'Maintenance', 'Other'] },
    ],
    relatedAssets: ['team-execution-dashboard', 'sla-dashboard'],
  },
  'team-execution-dashboard': {
    asset: analyticsAssets[1],
    metrics: [
      { label: 'Active Tasks', value: '142', direction: 'neutral' },
      { label: 'Blockers', value: '7', direction: 'down' },
      { label: 'Flow Efficiency', value: '83%', direction: 'up' },
      { label: 'Missing Updates', value: '12', direction: 'down' },
    ],
    charts: [
      { title: 'Team Workload Distribution', type: 'bar', data: [24, 18, 31, 22, 27, 20], labels: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'] },
      { title: 'Blocker Ageing (Days)', type: 'line', data: [5, 8, 6, 10, 7, 9, 7], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      { title: 'Task Status Breakdown', type: 'donut', data: [35, 28, 22, 15], labels: ['In Progress', 'Review', 'Blocked', 'Pending'] },
    ],
    relatedAssets: ['my-performance-snapshot', 'unit-visibility-dashboard'],
  },
  'unit-visibility-dashboard': {
    asset: analyticsAssets[2],
    metrics: [
      { label: 'Unit Health Score', value: '87%', direction: 'up' },
      { label: 'Outcomes on Track', value: '14', direction: 'up' },
      { label: 'Governance Risks', value: '3', direction: 'down' },
      { label: 'Teams Monitored', value: '6', direction: 'neutral' },
    ],
    charts: [
      { title: 'Health by Team', type: 'bar', data: [92, 78, 85, 90, 76, 88], labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F'] },
      { title: 'Risk Trend', type: 'line', data: [5, 4, 6, 3, 3], labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'] },
      { title: 'Outcome Distribution', type: 'donut', data: [50, 30, 20], labels: ['On Track', 'At Risk', 'Behind'] },
    ],
    relatedAssets: ['team-execution-dashboard', 'operating-discipline-view'],
  },
  'sla-dashboard': {
    asset: analyticsAssets[3],
    metrics: [
      { label: 'SLA at Risk', value: '8', direction: 'up' },
      { label: 'SLA Breached', value: '3', direction: 'down' },
      { label: 'Avg Resolution', value: '6.2h', direction: 'down' },
      { label: 'Active Alerts', value: '15', direction: 'up' },
    ],
    charts: [
      { title: 'SLA Exposure by Category', type: 'bar', data: [12, 8, 15, 6, 10], labels: ['Response', 'Resolution', 'Review', 'Approval', 'Closure'] },
      { title: 'Breach Trend', type: 'line', data: [4, 6, 3, 5, 2, 3], labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
      { title: 'Resolution SLA Compliance', type: 'donut', data: [78, 15, 7], labels: ['Compliant', 'At Risk', 'Breached'] },
    ],
    relatedAssets: ['governance-dashboard', 'support-operations-view'],
  },
  'governance-dashboard': {
    asset: analyticsAssets[4],
    metrics: [
      { label: 'Open Exceptions', value: '17', direction: 'down' },
      { label: 'Policy Compliance', value: '94%', direction: 'up' },
      { label: 'Risk Score', value: 'Low', direction: 'neutral' },
      { label: 'Pending Reviews', value: '6', direction: 'down' },
    ],
    charts: [
      { title: 'Exceptions by Category', type: 'bar', data: [5, 8, 3, 1], labels: ['Access', 'Config', 'Policy', 'Other'] },
      { title: 'Compliance Trend', type: 'line', data: [88, 90, 91, 93, 94], labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
      { title: 'Risk Distribution', type: 'donut', data: [60, 25, 15], labels: ['Low', 'Medium', 'High'] },
    ],
    relatedAssets: ['sla-dashboard', 'audit-compliance-report'],
  },
  'ceo-enterprise-dashboard': {
    asset: analyticsAssets[5],
    metrics: [
      { label: 'Enterprise Health', value: '91%', direction: 'up' },
      { label: 'Strategic Initiatives', value: '12', direction: 'up' },
      { label: 'Value Delivered', value: '$2.4M', direction: 'up' },
      { label: 'OKR Progress', value: '76%', direction: 'up' },
    ],
    charts: [
      { title: 'Initiative Progress by Pillar', type: 'bar', data: [82, 68, 91, 74, 85], labels: ['Ops', 'Finance', 'People', 'Risk', 'Growth'] },
      { title: 'Value Delivery Trend ($M)', type: 'line', data: [1.2, 1.6, 1.8, 2.1, 2.4], labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'] },
      { title: 'OKR Status Distribution', type: 'donut', data: [45, 35, 20], labels: ['On Track', 'Needs Attention', 'At Risk'] },
    ],
    relatedAssets: ['governance-dashboard', 'sla-dashboard'],
  },
  'workforce-readiness-report': {
    asset: analyticsAssets[6],
    metrics: [
      { label: 'New Joiners', value: '28', direction: 'up' },
      { label: 'Readiness Rate', value: '82%', direction: 'up' },
      { label: 'Policy Compliance', value: '95%', direction: 'up' },
      { label: 'Overdue Checks', value: '5', direction: 'down' },
    ],
    charts: [
      { title: 'Readiness by Department', type: 'bar', data: [88, 76, 92, 80, 85], labels: ['Eng', 'Ops', 'Finance', 'HR', 'Legal'] },
      { title: 'Onboarding Trend', type: 'line', data: [18, 22, 25, 28], labels: ['Jan', 'Feb', 'Mar', 'Apr'] },
      { title: 'Compliance Breakdown', type: 'donut', data: [70, 20, 10], labels: ['Passed', 'Pending', 'Failed'] },
    ],
    relatedAssets: ['audit-compliance-report', 'support-operations-view'],
  },
  'audit-compliance-report': {
    asset: analyticsAssets[7],
    metrics: [
      { label: 'Config Drift Items', value: '9', direction: 'down' },
      { label: 'Permission Exceptions', value: '14', direction: 'down' },
      { label: 'Audit Score', value: '97%', direction: 'up' },
      { label: 'Open Findings', value: '4', direction: 'down' },
    ],
    charts: [
      { title: 'Drift by System', type: 'bar', data: [3, 5, 1, 0, 2], labels: ['IAM', 'DB', 'Network', 'Storage', 'App'] },
      { title: 'Exception Trend', type: 'line', data: [22, 18, 16, 14], labels: ['Jan', 'Feb', 'Mar', 'Apr'] },
      { title: 'Audit Findings by Severity', type: 'donut', data: [50, 30, 20], labels: ['Low', 'Medium', 'High'] },
    ],
    relatedAssets: ['governance-dashboard', 'operating-discipline-view'],
  },
  'support-operations-view': {
    asset: analyticsAssets[8],
    metrics: [
      { label: 'Open Tickets', value: '34', direction: 'neutral' },
      { label: 'SLA at Risk', value: '6', direction: 'down' },
      { label: 'Avg Response', value: '1.5h', direction: 'down' },
      { label: 'Escalated', value: '3', direction: 'up' },
    ],
    charts: [
      { title: 'Tickets by Queue', type: 'bar', data: [12, 8, 6, 5, 3], labels: ['Triage', 'Active', 'Review', 'Escalated', 'Closure'] },
      { title: 'Response Time Trend (hrs)', type: 'line', data: [2.1, 1.8, 1.6, 1.5], labels: ['Jan', 'Feb', 'Mar', 'Apr'] },
      { title: 'Ticket Status Breakdown', type: 'donut', data: [45, 30, 15, 10], labels: ['Open', 'In Progress', 'Waiting', 'Resolved'] },
    ],
    relatedAssets: ['sla-dashboard', 'workforce-readiness-report'],
  },
  'operating-discipline-view': {
    asset: analyticsAssets[9],
    metrics: [
      { label: 'Discipline Score', value: '89%', direction: 'up' },
      { label: 'Policy Adherence', value: '93%', direction: 'up' },
      { label: 'Open Actions', value: '11', direction: 'down' },
      { label: 'Units Monitored', value: '4', direction: 'neutral' },
    ],
    charts: [
      { title: 'Discipline by Unit', type: 'bar', data: [92, 78, 85, 90], labels: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4'] },
      { title: 'Adherence Trend', type: 'line', data: [84, 86, 88, 89], labels: ['Jan', 'Feb', 'Mar', 'Apr'] },
      { title: 'Action Status Breakdown', type: 'donut', data: [55, 25, 20], labels: ['Completed', 'In Progress', 'Overdue'] },
    ],
    relatedAssets: ['governance-dashboard', 'audit-compliance-report'],
  },
};

export function getAssetBySlug(slug: string): AnalyticsAsset | undefined {
  return analyticsAssets.find((a) => a.slug === slug);
}

export const assetCategories = [
  { id: 'Personal', label: 'Personal' },
  { id: 'Team', label: 'Team' },
  { id: 'Unit', label: 'Unit' },
  { id: 'Enterprise', label: 'Enterprise' },
];

export const assetTypes = [
  { id: 'Dashboard', label: 'Dashboard' },
  { id: 'Report', label: 'Report' },
  { id: 'View', label: 'View' },
];
