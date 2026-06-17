export type TrackerCategory =
  | 'Workload & Capacity'
  | 'Backlog & Delivery'
  | 'Project Health'
  | 'Strategic Initiatives'
  | 'Governance Follow-up'
  | 'Actions & Decisions'
  | 'Risk & Issues';

export type TrackerHealth = 'green' | 'amber' | 'red';

export interface TrackerTemplate {
  id: string;
  slug: string;
  name: string;
  shortPurpose: string;
  fullPurpose: string;
  category: TrackerCategory;
  owner: string;
  trackerType: string;
  activeCount: number;
  lastUpdated: string;
  health: TrackerHealth;
  whoShouldUse: string;
  whatItMonitors: string;
  updateFrequency: string;
  governanceOwner: string;
  defaultFields: string[];
  defaultStatuses: string[];
  exampleRecords: Array<{ id: string; title: string }>;
  relatedViews: string[];
  guidance: string;
}

export const TRACKER_CATEGORIES: Array<{ id: TrackerCategory; label: TrackerCategory }> = [
  { id: 'Workload & Capacity', label: 'Workload & Capacity' },
  { id: 'Backlog & Delivery', label: 'Backlog & Delivery' },
  { id: 'Project Health', label: 'Project Health' },
  { id: 'Strategic Initiatives', label: 'Strategic Initiatives' },
  { id: 'Governance Follow-up', label: 'Governance Follow-up' },
  { id: 'Actions & Decisions', label: 'Actions & Decisions' },
  { id: 'Risk & Issues', label: 'Risk & Issues' },
];

export const TRACKER_TEMPLATES: TrackerTemplate[] = [
  {
    id: 'TRK-TPL-001',
    slug: 'workload-distribution-tracker',
    name: 'Workload Distribution Tracker',
    shortPurpose: 'Track workload allocation and capacity pressure across teams',
    fullPurpose:
      'Track workload allocation, ownership, capacity pressure, overload signals, and rebalancing actions across teams.',
    category: 'Workload & Capacity',
    owner: 'DQ Operations',
    trackerType: 'Template',
    activeCount: 12,
    lastUpdated: '2 hours ago',
    health: 'amber',
    whoShouldUse: 'Leads, associates, delivery owners, operations coordinators',
    whatItMonitors: 'Workload allocation, ownership, capacity signals, and rebalancing actions',
    updateFrequency: 'Weekly or when ownership changes',
    governanceOwner: 'DQ Operations',
    defaultFields: [
      'Record ID',
      'Title',
      'Owner',
      'Team / Squad',
      'Priority',
      'Status',
      'Due Date',
      'RAG',
      'Latest Update',
      'Next Action',
      'Evidence',
      'Last Updated',
    ],
    defaultStatuses: ['Open', 'In Progress', 'Balanced', 'Overloaded', 'Blocked', 'Completed'],
    exampleRecords: [
      { id: 'WLD-1001', title: 'Squad Alpha capacity rebalance' },
      { id: 'WLD-1002', title: 'Team overload mitigation plan' },
      { id: 'WLD-1003', title: 'Q2 workload distribution review' },
    ],
    relatedViews: ['My Tracker Overview', 'Team Tracker Overview', 'Tracker Insights'],
    guidance:
      'Use this tracker to maintain active records, update ownership, track RAG, capture next actions, attach evidence, and support follow-up governance.',
  },
  {
    id: 'TRK-TPL-002',
    slug: 'squad-backlog-tracker',
    name: 'Squad Backlog Tracker',
    shortPurpose: 'Monitor squad backlog items, priorities, and delivery flow',
    fullPurpose:
      'Monitor squad backlog items, priorities, delivery flow, blockers, and sprint commitment health.',
    category: 'Backlog & Delivery',
    owner: 'Delivery Operations',
    trackerType: 'Template',
    activeCount: 8,
    lastUpdated: '1 day ago',
    health: 'green',
    whoShouldUse: 'Scrum masters, team leads, delivery coordinators',
    whatItMonitors: 'Backlog items, priorities, flow health, blockers, sprint commitment',
    updateFrequency: 'Daily or per sprint cycle',
    governanceOwner: 'Delivery Operations',
    defaultFields: [
      'Record ID',
      'Title',
      'Squad',
      'Sprint',
      'Priority',
      'Story Points',
      'Status',
      'Blocker',
      'Owner',
      'Due Date',
      'Last Updated',
    ],
    defaultStatuses: [
      'Backlog',
      'Ready',
      'In Progress',
      'Blocked',
      'In Review',
      'Done',
    ],
    exampleRecords: [
      { id: 'SBL-201', title: 'Implement authentication flow' },
      { id: 'SBL-202', title: 'Design dashboard wireframes' },
      { id: 'SBL-203', title: 'API integration for user profiles' },
    ],
    relatedViews: ['Squad Dashboard', 'Sprint Overview', 'Blocker Log'],
    guidance:
      'Update this tracker daily to reflect current sprint work. Mark blockers immediately and ensure ownership is clear.',
  },
  {
    id: 'TRK-TPL-003',
    slug: 'project-backlog-tracker',
    name: 'Project Backlog Tracker',
    shortPurpose: 'Track project-level backlog, milestones, and delivery progress',
    fullPurpose:
      'Track project-level backlog items, milestones, delivery progress, dependencies, and cross-team coordination.',
    category: 'Backlog & Delivery',
    owner: 'PMO / Delivery Leads',
    trackerType: 'Template',
    activeCount: 15,
    lastUpdated: '3 hours ago',
    health: 'amber',
    whoShouldUse: 'Project managers, PMO, delivery leads, program coordinators',
    whatItMonitors: 'Project backlog, milestones, dependencies, cross-team coordination',
    updateFrequency: 'Weekly or at milestone gates',
    governanceOwner: 'PMO / Delivery Leads',
    defaultFields: [
      'Record ID',
      'Title',
      'Project',
      'Milestone',
      'Priority',
      'Status',
      'Dependencies',
      'Owner',
      'Due Date',
      'RAG',
      'Last Updated',
    ],
    defaultStatuses: [
      'Planned',
      'In Progress',
      'At Risk',
      'Blocked',
      'Completed',
      'Deferred',
    ],
    exampleRecords: [
      { id: 'PBL-301', title: 'Phase 2 infrastructure setup' },
      { id: 'PBL-302', title: 'User acceptance testing preparation' },
      { id: 'PBL-303', title: 'Third-party integration milestone' },
    ],
    relatedViews: ['Project Dashboard', 'Milestone Tracker', 'Dependency Map'],
    guidance:
      'Maintain this tracker to ensure visibility across project phases. Update RAG status weekly and flag dependencies early.',
  },
  {
    id: 'TRK-TPL-004',
    slug: 'strategic-initiatives-tracker',
    name: 'Strategic Initiatives Tracker',
    shortPurpose: 'Monitor strategic initiatives, outcomes, and value delivery',
    fullPurpose:
      'Monitor strategic initiatives, expected outcomes, value delivery, stakeholder engagement, and executive reporting.',
    category: 'Strategic Initiatives',
    owner: 'Strategy Office',
    trackerType: 'Template',
    activeCount: 6,
    lastUpdated: '1 week ago',
    health: 'green',
    whoShouldUse: 'Executives, strategy office, program directors',
    whatItMonitors:
      'Strategic initiatives, outcomes, value delivery, stakeholder engagement',
    updateFrequency: 'Monthly or at executive review cycles',
    governanceOwner: 'Strategy Office',
    defaultFields: [
      'Record ID',
      'Initiative',
      'Strategic Pillar',
      'Owner',
      'Expected Outcome',
      'Value Delivered',
      'Status',
      'RAG',
      'Last Review',
      'Next Milestone',
    ],
    defaultStatuses: [
      'Planning',
      'In Progress',
      'On Track',
      'At Risk',
      'Completed',
      'On Hold',
    ],
    exampleRecords: [
      { id: 'STR-401', title: 'Digital transformation roadmap' },
      { id: 'STR-402', title: 'Customer experience enhancement' },
      { id: 'STR-403', title: 'Operational excellence initiative' },
    ],
    relatedViews: ['Executive Dashboard', 'Strategy Map', 'Value Tracker'],
    guidance:
      'Review this tracker during executive sessions. Ensure all strategic initiatives have clear owners and outcomes.',
  },
  {
    id: 'TRK-TPL-005',
    slug: 'project-health-tracker',
    name: 'Project Health Tracker',
    shortPurpose: 'Monitor project health signals, RAG status, and evidence',
    fullPurpose:
      'Monitor project health signals, RAG status, overdue updates, blockers, and evidence.',
    category: 'Project Health',
    owner: 'DQ Operations',
    trackerType: 'Template',
    activeCount: 18,
    lastUpdated: 'Today',
    health: 'amber',
    whoShouldUse: 'Project managers, PMO, operations leads',
    whatItMonitors: 'Project health signals, RAG status, blockers, overdue updates',
    updateFrequency: 'Weekly or when health changes',
    governanceOwner: 'DQ Operations',
    defaultFields: [
      'Record ID',
      'Project',
      'Owner',
      'RAG',
      'Health Signal',
      'Blockers',
      'Last Update',
      'Next Review',
      'Evidence',
      'Status',
    ],
    defaultStatuses: ['Healthy', 'At Risk', 'Critical', 'Recovering', 'Closed'],
    exampleRecords: [
      { id: 'PHR-204', title: 'Q2 project health review pending update' },
      { id: 'PHR-205', title: 'Critical blocker escalation required' },
      { id: 'PHR-206', title: 'Recovery plan in progress' },
    ],
    relatedViews: ['Project Health Dashboard', 'RAG Overview', 'Blocker Summary'],
    guidance:
      'Update RAG status weekly. Flag critical issues immediately and attach supporting evidence.',
  },
  {
    id: 'TRK-TPL-006',
    slug: 'governance-follow-up-tracker',
    name: 'Governance Follow-up Tracker',
    shortPurpose: 'Track governance follow-up actions, compliance, and closure',
    fullPurpose:
      'Track governance follow-up actions, compliance requirements, audit trails, and closure evidence.',
    category: 'Governance Follow-up',
    owner: 'Governance Lead',
    trackerType: 'Template',
    activeCount: 9,
    lastUpdated: '2 days ago',
    health: 'red',
    whoShouldUse: 'Governance leads, compliance officers, audit coordinators',
    whatItMonitors: 'Governance actions, compliance requirements, audit trails, closure evidence',
    updateFrequency: 'Weekly or at governance review points',
    governanceOwner: 'Governance Lead',
    defaultFields: [
      'Record ID',
      'Title',
      'Owner',
      'Compliance Area',
      'Priority',
      'Status',
      'Due Date',
      'Evidence',
      'Closure Date',
      'Last Updated',
    ],
    defaultStatuses: ['Open', 'In Progress', 'Awaiting Evidence', 'Closed', 'Escalated'],
    exampleRecords: [
      { id: 'GOV-077', title: 'Governance follow-up awaiting owner response' },
      { id: 'GOV-078', title: 'Compliance audit evidence required' },
      { id: 'GOV-079', title: 'Policy exception approval pending' },
    ],
    relatedViews: ['Governance Dashboard', 'Compliance Tracker', 'Audit Log'],
    guidance:
      'Ensure all governance actions have assigned owners. Attach evidence before closing items.',
  },
  {
    id: 'TRK-TPL-007',
    slug: 'action-log-tracker',
    name: 'Action Log Tracker',
    shortPurpose: 'Log and track actions from sessions, meetings, and reviews',
    fullPurpose:
      'Log and track actions arising from sessions, meetings, reviews, and working groups.',
    category: 'Actions & Decisions',
    owner: 'Workstream Leads',
    trackerType: 'Template',
    activeCount: 22,
    lastUpdated: 'Today',
    health: 'green',
    whoShouldUse: 'Team leads, session facilitators, coordinators',
    whatItMonitors: 'Action items, ownership, due dates, completion status',
    updateFrequency: 'After each session or weekly',
    governanceOwner: 'Workstream Leads',
    defaultFields: [
      'Record ID',
      'Action',
      'Owner',
      'Source Session',
      'Priority',
      'Due Date',
      'Status',
      'Last Updated',
    ],
    defaultStatuses: ['Open', 'In Progress', 'Blocked', 'Completed', 'Cancelled'],
    exampleRecords: [
      { id: 'ACT-144', title: 'Working session action overdue' },
      { id: 'ACT-145', title: 'Follow-up from Q2 review' },
      { id: 'ACT-146', title: 'Cross-team coordination action' },
    ],
    relatedViews: ['My Actions', 'Team Actions', 'Overdue Actions'],
    guidance:
      'Add actions immediately after sessions. Review weekly to ensure nothing falls through the cracks.',
  },
  {
    id: 'TRK-TPL-008',
    slug: 'decision-tracker',
    name: 'Decision Tracker',
    shortPurpose: 'Track decisions, approvals, and decision outcomes',
    fullPurpose:
      'Track decisions, approvals, decision outcomes, stakeholder alignment, and implementation status.',
    category: 'Actions & Decisions',
    owner: 'Governance Lead',
    trackerType: 'Template',
    activeCount: 11,
    lastUpdated: '1 day ago',
    health: 'green',
    whoShouldUse: 'Governance leads, decision makers, program managers',
    whatItMonitors: 'Decisions, approvals, outcomes, stakeholder alignment, implementation',
    updateFrequency: 'As decisions are made or reviewed',
    governanceOwner: 'Governance Lead',
    defaultFields: [
      'Record ID',
      'Decision',
      'Owner',
      'Stakeholders',
      'Decision Date',
      'Outcome',
      'Implementation Status',
      'Evidence',
      'Last Updated',
    ],
    defaultStatuses: [
      'Pending',
      'Approved',
      'Rejected',
      'Deferred',
      'Implemented',
      'Under Review',
    ],
    exampleRecords: [
      { id: 'DEC-031', title: 'Decision awaiting confirmation' },
      { id: 'DEC-032', title: 'Technology selection approved' },
      { id: 'DEC-033', title: 'Budget allocation decision pending' },
    ],
    relatedViews: ['Decision Log', 'Pending Decisions', 'Implementation Tracker'],
    guidance:
      'Capture all key decisions with clear outcomes. Ensure stakeholder alignment is documented.',
  },
  {
    id: 'TRK-TPL-009',
    slug: 'risk-issue-tracker',
    name: 'Risk / Issue Tracker',
    shortPurpose: 'Track risks, issues, mitigation plans, and resolution',
    fullPurpose:
      'Track risks, issues, severity, mitigation plans, resolution actions, and closure evidence.',
    category: 'Risk & Issues',
    owner: 'Risk Owner',
    trackerType: 'Template',
    activeCount: 14,
    lastUpdated: '4 hours ago',
    health: 'amber',
    whoShouldUse: 'Risk owners, project managers, operations leads',
    whatItMonitors: 'Risks, issues, severity, mitigation plans, resolution actions',
    updateFrequency: 'Weekly or when risk status changes',
    governanceOwner: 'Risk Owner',
    defaultFields: [
      'Record ID',
      'Risk / Issue',
      'Type',
      'Severity',
      'Owner',
      'Mitigation Plan',
      'Status',
      'Due Date',
      'Evidence',
      'Last Updated',
    ],
    defaultStatuses: [
      'Identified',
      'Assessing',
      'Mitigating',
      'Monitoring',
      'Resolved',
      'Escalated',
    ],
    exampleRecords: [
      { id: 'RSK-501', title: 'Budget overrun risk identified' },
      { id: 'ISS-502', title: 'Critical integration issue' },
      { id: 'RSK-503', title: 'Resource availability risk' },
    ],
    relatedViews: ['Risk Register', 'Issue Log', 'Mitigation Tracker'],
    guidance:
      'Log risks and issues as they arise. Review mitigation plans weekly and escalate high-severity items.',
  },
];
