import type { WorkspaceRole } from '../config/segments';
import type { NavItemConfig } from '../config/navigation';

export interface DwsRecord {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  owner: string;
  dueDate: string;
  source: string;
  description: string;
  nextAction: string;
  related: string[];
  risk: string;
  lastUpdated: string;
}

export interface KpiRecord {
  label: string;
  value: string;
  helper: string;
  status: string;
}

const owners = ['Amina Hassan', 'Bilal Waqar', 'Sreya Lakshmi', 'Naomi Kimani', 'Omar Ali', 'Ian Kipkorir'];

const sectionSeeds: Record<string, Array<Pick<DwsRecord, 'title' | 'type' | 'status' | 'priority' | 'source' | 'risk'>>> = {
  workspace: [
    { title: 'Review Access Request - John Smith', type: 'Request', status: 'In Progress', priority: 'High', source: 'Service Request', risk: 'Medium' },
    { title: 'Approve Vendor Onboarding Workflow', type: 'Workflow', status: 'Pending', priority: 'High', source: 'Workflow', risk: 'High' },
    { title: 'Update Tracker - Strategic Initiative', type: 'Tracker', status: 'Awaiting Input', priority: 'Medium', source: 'Tracker', risk: 'Watch' },
    { title: 'Blocked: Data Migration Dependencies', type: 'Task', status: 'Blocked', priority: 'High', source: 'Task', risk: 'High' },
    { title: 'Publish weekly workspace update', type: 'Update', status: 'Draft', priority: 'Low', source: 'Workspace', risk: 'Low' }
  ],
  tasks: [
    { title: 'Complete control evidence pack', type: 'Task', status: 'In Progress', priority: 'High', source: 'Task Model', risk: 'Medium' },
    { title: 'Review closure quality for DWS Roadmap', type: 'Review', status: 'Due Soon', priority: 'High', source: 'Closure Quality', risk: 'Watch' },
    { title: 'Attach evidence to governance action', type: 'Evidence', status: 'Awaiting Input', priority: 'Medium', source: 'Evidence Queue', risk: 'Medium' },
    { title: 'Resolve blocked onboarding access task', type: 'Task', status: 'Blocked', priority: 'High', source: 'My Tasks', risk: 'High' },
    { title: 'Create reusable risk review task template', type: 'Template', status: 'On Track', priority: 'Medium', source: 'Template Library', risk: 'Low' }
  ],
  workflows: [
    { title: 'Access Request Fulfilment', type: 'Approval', status: 'Pending', priority: 'High', source: 'Workflow Centre', risk: 'Watch' },
    { title: 'Quarterly Governance Review', type: 'Workflow', status: 'In Progress', priority: 'High', source: 'Governance', risk: 'Medium' },
    { title: 'Role Transition Handoff', type: 'Handoff', status: 'Due Soon', priority: 'Medium', source: 'HRA', risk: 'Medium' },
    { title: 'Escalate SLA breach for platform request', type: 'Escalation', status: 'At Risk', priority: 'High', source: 'SLA Risk', risk: 'High' },
    { title: 'Approve decision log update for Project Phoenix', type: 'Decision', status: 'Awaiting Review', priority: 'Medium', source: 'Decision Log', risk: 'Low' }
  ],
  trackers: [
    { title: 'Feature Request - AI Status Brief', type: 'Feature Request', status: 'In Progress', priority: 'High', source: 'Features Tracker', risk: 'Medium' },
    { title: 'Strategic Initiative - Work.Space4.0 rollout', type: 'Strategic Initiative', status: 'On Track', priority: 'High', source: 'Strategic Initiatives Tracker', risk: 'Low' },
    { title: 'Project Health - Data Migration', type: 'Project Health', status: 'At Risk', priority: 'High', source: 'Project Health Tracker', risk: 'High' },
    { title: 'Workload Allocation - Squad Alpha', type: 'Workload', status: 'Watch', priority: 'Medium', source: 'Workload Distribution Tracker', risk: 'Watch' },
    { title: 'Governance Action - Control evidence gap', type: 'Governance Action', status: 'Pending', priority: 'High', source: 'Governance Actions Tracker', risk: 'High' }
  ],
  performance: [
    { title: 'Q2 goal progress review', type: 'Goal', status: 'On Track', priority: 'Medium', source: 'Performance', risk: 'Low' },
    { title: 'Self-review evidence preparation', type: 'Evaluation', status: 'Due Soon', priority: 'High', source: 'Evaluation', risk: 'Watch' },
    { title: 'Feedback action from governance reviewer', type: 'Feedback', status: 'Action Required', priority: 'Medium', source: 'Feedback', risk: 'Medium' },
    { title: 'Learning module: Governance Review Process', type: 'Learning', status: 'In Progress', priority: 'Medium', source: 'Learning Center', risk: 'Low' },
    { title: 'Contribution evidence for tracker update', type: 'Contribution', status: 'Completed', priority: 'Low', source: 'Contribution History', risk: 'Low' }
  ],
  governance: [
    { title: 'Governance review cycle - Q2', type: 'Review', status: 'In Progress', priority: 'High', source: 'Governance Review', risk: 'Medium' },
    { title: 'Risk RSK-1024 - Data Privacy', type: 'Risk', status: 'At Risk', priority: 'High', source: 'Risk Register', risk: 'High' },
    { title: 'Control CTL-205 evidence quality', type: 'Control', status: 'Watch', priority: 'High', source: 'Control Library', risk: 'Watch' },
    { title: 'Operating discipline exception', type: 'Exception', status: 'Pending', priority: 'Medium', source: 'Governance Exceptions', risk: 'Medium' },
    { title: 'Change approval for workflow template', type: 'Change', status: 'Awaiting Review', priority: 'Medium', source: 'Change Governance', risk: 'Low' }
  ],
  knowledge: [
    { title: 'DQ Ways of Working playbook', type: 'Playbook', status: 'Approved', priority: 'Medium', source: 'Knowledge Hub', risk: 'Low' },
    { title: 'GHC operating discipline reference', type: 'Reference', status: 'Approved', priority: 'Medium', source: 'GHC References', risk: 'Low' },
    { title: '6xD delivery checklist', type: 'Reference', status: 'In Review', priority: 'Medium', source: '6xD References', risk: 'Low' },
    { title: 'Onboarding FAQ update', type: 'Knowledge Article', status: 'Pending', priority: 'Low', source: 'Content Review Queue', risk: 'Low' },
    { title: 'Recommended: Risk Management Basics', type: 'Learning Reference', status: 'Available', priority: 'Low', source: 'Learning References', risk: 'Low' }
  ],
  services: [
    { title: 'Laptop and DQ collaboration tools', type: 'IT & Access', status: 'In Progress', priority: 'High', source: 'IT & Access Requests', risk: 'Medium' },
    { title: 'HRA onboarding policy clarification', type: 'HRA Request', status: 'Pending', priority: 'Medium', source: 'HRA Requests', risk: 'Low' },
    { title: 'Platform issue: tracker view filter', type: 'Platform Support', status: 'Assigned', priority: 'High', source: 'Central Support Queue', risk: 'Watch' },
    { title: 'Knowledge article publishing support', type: 'Content Request', status: 'Awaiting Input', priority: 'Medium', source: 'Knowledge / Content Requests', risk: 'Low' },
    { title: 'Workflow routing change request', type: 'Admin Request', status: 'Due Soon', priority: 'High', source: 'Admin Requests', risk: 'Medium' }
  ],
  people: [
    { title: 'Amina Hassan - DQ Associate', type: 'Person', status: 'Available', priority: 'Low', source: 'People Directory', risk: 'Low' },
    { title: 'Squad Alpha - Delivery team', type: 'Team', status: 'On Track', priority: 'Medium', source: 'Teams', risk: 'Low' },
    { title: 'Digital Workspace Unit', type: 'Unit', status: 'Active', priority: 'Medium', source: 'Units', risk: 'Low' },
    { title: 'Control Library owner mapping', type: 'Owner', status: 'Approved', priority: 'Medium', source: 'Owners & Experts', risk: 'Low' },
    { title: 'Platform support contact point', type: 'Contact', status: 'Available', priority: 'Low', source: 'Contact Points', risk: 'Low' }
  ],
  reports: [
    { title: 'Execution dashboard - Q2', type: 'Dashboard', status: 'Available', priority: 'High', source: 'Execution Dashboard', risk: 'Low' },
    { title: 'SLA exposure report', type: 'Report', status: 'Watch', priority: 'High', source: 'SLA Dashboard', risk: 'Watch' },
    { title: 'Governance cycle status', type: 'Report', status: 'In Progress', priority: 'High', source: 'Governance Dashboard', risk: 'Medium' },
    { title: 'AI status report - Project Phoenix', type: 'AI Report', status: 'Ready', priority: 'Medium', source: 'AI Status Reports', risk: 'Low' },
    { title: 'Audit report - permission changes', type: 'Audit Report', status: 'Approved', priority: 'High', source: 'Audit Reports', risk: 'Low' }
  ],
  administration: [
    { title: 'Permission model update', type: 'Configuration', status: 'In Progress', priority: 'High', source: 'User & Role Management', risk: 'Medium' },
    { title: 'Tracker template field review', type: 'Tracker Config', status: 'Pending', priority: 'Medium', source: 'Tracker Configuration', risk: 'Low' },
    { title: 'Workflow approval rule builder', type: 'Workflow Rule', status: 'In Review', priority: 'High', source: 'Workflow & Approval Rules', risk: 'Watch' },
    { title: 'AI guardrail toggle review', type: 'AI Automation', status: 'On Track', priority: 'Medium', source: 'AI / Automation Settings', risk: 'Low' },
    { title: 'Audit event - role permission changed', type: 'Audit Log', status: 'Completed', priority: 'High', source: 'Audit Logs', risk: 'Low' }
  ]
};

export const badgeCounts: Record<string, number> = {
  myWork: 24,
  requests: 7,
  notifications: 8,
  tasks: 18,
  reviews: 6,
  blocked: 5,
  quality: 4,
  evidence: 9,
  workflows: 6,
  approvals: 3,
  escalations: 2,
  slaRisks: 4,
  trackers: 12,
  governanceActions: 5
};

export function buildRecords(navItem: NavItemConfig, role: WorkspaceRole): DwsRecord[] {
  const seeds = sectionSeeds[navItem.section] || sectionSeeds.workspace;
  const rolePrefix = role === 'Admin' ? 'Platform' : role === 'CEO' ? 'Executive' : role;
  return seeds.map((seed, index) => ({
    id: `${navItem.section.slice(0, 3).toUpperCase()}-${String(index + 101).padStart(3, '0')}`,
    title: navItem.route.includes('templates') ? `${seed.title} template` : seed.title,
    type: seed.type,
    status: seed.status,
    priority: seed.priority,
    owner: owners[index % owners.length],
    dueDate: `${15 + index} Jun 2026`,
    source: seed.source,
    risk: seed.risk,
    lastUpdated: index === 0 ? 'Today, 09:40' : `${index + 1} days ago`,
    description: `${rolePrefix} view for ${navItem.label}: ${seed.title}. This record is linked to DWS operating rhythm, accountable ownership, and evidence-based follow-up.`,
    nextAction: index % 2 === 0 ? 'Review the record, confirm owner accountability, and update the next action.' : 'Open the detail view and attach the latest evidence or decision note.',
    related: ['DWS.01 workspace', navItem.label, seed.source]
  }));
}

export function buildKpis(navItem: NavItemConfig, records: DwsRecord[]): KpiRecord[] {
  return [
    { label: 'Total records', value: String(records.length), helper: `${navItem.label} in scope`, status: 'Available' },
    { label: 'Requires action', value: String(records.filter((record) => ['Pending', 'Due Soon', 'Awaiting Input', 'Blocked', 'At Risk', 'Action Required'].includes(record.status)).length), helper: 'Needs review or update', status: 'Watch' },
    { label: 'High priority', value: String(records.filter((record) => record.priority === 'High').length), helper: 'Priority work items', status: 'At Risk' },
    { label: 'On track', value: String(records.filter((record) => ['On Track', 'Approved', 'Completed', 'Available', 'Ready'].includes(record.status)).length), helper: 'Healthy records', status: 'On Track' }
  ];
}
