import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  UploadCloud,
  X,
  type LucideIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusPill } from '../components/StatusPill';
import { WorkItemLinkedKnowledgeCard } from '../components/WorkItemLinkedKnowledgeCard';
import { useViewingMode } from '../context/ViewingModeContext';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import type { WorkspaceRole } from '../config/segments';

type TaskRoute = 'my-tasks' | 'all' | 'create' | 'templates' | 'review' | 'blocked' | 'closure-quality' | 'evidence';
type TaskStatus = 'Not Started' | 'In Progress' | 'Awaiting Input' | 'Awaiting Review' | 'Blocked' | 'Returned' | 'Completed' | 'Closed';
type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
type EvidenceStatus = 'Not Required' | 'Required' | 'Missing' | 'Uploaded' | 'Approved' | 'Returned';
type TaskDraftUpdater = <K extends keyof DqTask>(key: K, value: DqTask[K]) => void;

interface DqTask {
  taskId: string;
  title: string;
  context: string;
  triggerSource: string;
  relatedBusinessSituation: string;
  purpose: string;
  expectedOutput: string;
  owner: string;
  contributors: string[];
  reviewer: string;
  accountableLead: string;
  taskType: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  dueDate: string;
  sla: string;
  reminderPreference: string;
  linkedRequest: string;
  linkedTracker: string;
  linkedGovernanceItem: string;
  linkedKnowledge: string;
  linkedWorkingSession: string;
  checklist: Array<{ label: string; done: boolean }>;
  blockerState: string;
  blockerReason: string;
  blockerOwner: string;
  raisedBy: string;
  raisedDate: string;
  impact: string;
  escalationStatus: string;
  evidenceRequired: boolean;
  evidenceStatus: EvidenceStatus;
  evidenceDescription: string;
  evidenceItems: string[];
  closureCriteria: string[];
  outcomeStatement: string;
  reviewRequired: boolean;
  comments: string[];
  activityHistory: string[];
  aiRecommendedNextAction: string;
  createdBy: string;
  team: string;
  closureScore: number;
  closedDate: string;
  reviewStatus: string;
  missingItems: string[];
}

interface TaskTemplate {
  id: string;
  name: string;
  contextPattern: string;
  purpose: string;
  defaultFields: string[];
  checklist: string[];
  evidenceRules: string;
  closureCriteria: string[];
  defaultSla: string;
  ownerRole: string;
  usedBy: string;
}

interface TaskViewConfig {
  defaultTab: string;
  sortBy: string;
  groupBy: string;
  savedFilter: string;
  notifications: boolean;
  favouriteView: string;
  columns: Record<string, boolean>;
}

const routeMeta: Record<TaskRoute, { title: string; purpose: string; primary: string; tabs: string[]; columns: string[] }> = {
  'my-tasks': {
    title: 'My Tasks',
    purpose: 'Tasks assigned to me, created by me, or requiring my direct action.',
    primary: 'Create Task',
    tabs: ['All', 'Assigned to Me', 'Created by Me', 'Due Today', 'Overdue', 'Blocked', 'Awaiting Review', 'Completed'],
    columns: ['Task ID', 'Title', 'Context Summary', 'Status', 'Priority', 'Due Date', 'Owner', 'Evidence', 'Action']
  },
  all: {
    title: 'All Tasks',
    purpose: 'Role-scoped task register for authorised team, unit, support, platform, or executive visibility.',
    primary: 'Export Tasks',
    tabs: ['All', 'By Owner', 'By Team', 'By Status', 'By Priority', 'At Risk', 'Recently Updated'],
    columns: ['Task ID', 'Title', 'Context Summary', 'Status', 'Priority', 'Due Date', 'Owner', 'Evidence', 'Action']
  },
  create: {
    title: 'Create Task',
    purpose: 'Create a structured, contextual, owned, outcome-based, evidenced, and reviewable DQ task.',
    primary: 'Create Task',
    tabs: ['Structured Task'],
    columns: []
  },
  templates: {
    title: 'Task Templates',
    purpose: 'Reusable task blueprints with context patterns, checklist rules, evidence expectations, and closure criteria.',
    primary: 'Create Template',
    tabs: ['All', 'Governance', 'Access', 'Onboarding', 'Project', 'Knowledge', 'SLA', 'Control', 'Feature'],
    columns: ['Template Name', 'Context Pattern', 'Purpose', 'Default SLA', 'Owner Role', 'Used By', 'Action']
  },
  review: {
    title: 'Task Review',
    purpose: 'Tasks requiring validation, approval, evidence checks, or return for correction.',
    primary: 'Export Review Queue',
    tabs: ['Pending Review', 'Returned', 'Approved', 'Needs Evidence', 'Closure Review'],
    columns: ['Task ID', 'Title', 'Context Summary', 'Status', 'Priority', 'Due Date', 'Owner', 'Evidence', 'Action']
  },
  blocked: {
    title: 'Blocked Tasks',
    purpose: 'Task-specific blockers where the task itself cannot progress.',
    primary: 'Escalate Blocker',
    tabs: ['All Blocked', 'My Blocked Tasks', 'Team Blockers', 'SLA Risk', 'Escalated'],
    columns: ['Task ID', 'Title', 'Blocker Reason', 'Blocker Owner', 'Impact', 'Escalation Status', 'Due Date', 'Action']
  },
  'closure-quality': {
    title: 'Closure Quality',
    purpose: 'Check whether tasks are being closed properly against DQ work standards.',
    primary: 'Generate Closure Summary',
    tabs: ['All', 'Missing Evidence', 'Returned', 'Approved', 'Closed Properly'],
    columns: ['Task ID', 'Title', 'Owner', 'Closure Score', 'Missing Items', 'Review Status', 'Closed Date', 'Action']
  },
  evidence: {
    title: 'Task Evidence',
    purpose: 'Manage proof of work including files, links, decision notes, approval notes, and related tracker updates.',
    primary: 'Upload Evidence',
    tabs: ['All Evidence', 'Missing Evidence', 'Uploaded Files', 'Linked Documents', 'Approval Notes', 'Completion Notes'],
    columns: ['Evidence ID', 'Task', 'Evidence Type', 'Uploaded By', 'Date', 'Review Status', 'Linked Work', 'Action']
  }
};

const roleSeeds: Record<WorkspaceRole, string[]> = {
  Associate: ['Complete onboarding profile update', 'Submit evidence for assigned task', 'Update project tracker item', 'Review manager feedback', 'Resolve assigned blocker'],
  'Scrum Master': ['Review blocked squad tasks', 'Validate missing task updates', 'Check closure quality for sprint actions', 'Prepare squad stand-up actions', 'Review squad evidence gaps'],
  'Team / Squad Lead': ['Assign project delivery task', 'Review team blocker', 'Approve task closure', 'Follow up overdue action', 'Validate team workload action'],
  'Unit Lead': ['Review unit SLA exposure task', 'Validate governance update', 'Track strategic initiative action', 'Review unit execution risk', 'Confirm outcome progress update'],
  HRA: ['Review onboarding task evidence', 'Confirm role transition action', 'Validate HRA request follow-up', 'Update workforce readiness task', 'Check new joiner access readiness'],
  Admin: ['Review role configuration task', 'Update task model configuration', 'Validate audit evidence', 'Resolve platform configuration issue', 'Review workflow rule task'],
  Support: ['Resolve access support task', 'Triage SLA-risk task', 'Update fulfilment evidence', 'Escalate blocked service task', 'Close support evidence gap'],
  CEO: ['Review strategic execution task', 'Check governance escalation', 'Review executive summary action', 'Approve critical operating decision if assigned', 'Confirm SLA exposure action']
};

const ownerMap: Record<WorkspaceRole, string[]> = {
  Associate: ['Amina Hassan', 'Ian Kipkorir', 'John Wayua'],
  'Scrum Master': ['Bilal Waqar', 'Squad Alpha', 'Amina Hassan'],
  'Team / Squad Lead': ['Sreya Lakshmi', 'Bilal Waqar', 'Squad Alpha'],
  'Unit Lead': ['Ian Kipkorir', 'Digital Workspace Unit', 'Governance Office'],
  HRA: ['Naomi Kimani', 'HRA Queue', 'Amina Hassan'],
  Admin: ['Bilal Waqar', 'Platform Admin Queue', 'Audit Control'],
  Support: ['Omar Ali', 'Support Fulfilment Queue', 'Platform Support'],
  CEO: ['Mariam Said', 'Executive Office', 'DWS Leadership']
};

const templates: TaskTemplate[] = [
  { id: 'TPL-101', name: 'Governance Action Task', contextPattern: 'Governance review identified an action requiring owner follow-up.', purpose: 'Close a governance action with evidence and review.', defaultFields: ['Context', 'Owner', 'Governance item', 'Evidence'], checklist: ['Confirm action owner', 'Attach evidence', 'Request review'], evidenceRules: 'Evidence required before closure.', closureCriteria: ['Action completed', 'Evidence approved', 'Review note added'], defaultSla: '5 business days', ownerRole: 'Governance owner', usedBy: 'Governance Leads' },
  { id: 'TPL-102', name: 'Access Review Task', contextPattern: 'Access or permission change needs validation.', purpose: 'Review access request and confirm entitlement.', defaultFields: ['Context', 'Linked request', 'Owner', 'SLA'], checklist: ['Validate request', 'Confirm owner', 'Record decision'], evidenceRules: 'Decision note required.', closureCriteria: ['Decision logged', 'Requester updated'], defaultSla: '2 business days', ownerRole: 'Support owner', usedBy: 'Support / Admin' },
  { id: 'TPL-103', name: 'Onboarding Checklist Task', contextPattern: 'New joiner needs a structured onboarding action.', purpose: 'Guide onboarding work to completion.', defaultFields: ['Context', 'Expected output', 'Learning link'], checklist: ['Profile complete', 'Access confirmed', 'Learning started'], evidenceRules: 'Completion note required.', closureCriteria: ['Checklist complete', 'Manager notified'], defaultSla: '7 business days', ownerRole: 'Associate', usedBy: 'HRA / Associates' },
  { id: 'TPL-104', name: 'Project Update Task', contextPattern: 'Project tracker requires a status update.', purpose: 'Keep project execution data current.', defaultFields: ['Context', 'Linked tracker', 'Expected output'], checklist: ['Update status', 'Confirm risk', 'Add next action'], evidenceRules: 'Tracker update link required.', closureCriteria: ['Tracker updated', 'Risk reviewed'], defaultSla: '3 business days', ownerRole: 'Project owner', usedBy: 'Teams' },
  { id: 'TPL-105', name: 'Knowledge Article Review Task', contextPattern: 'Knowledge content needs review before publishing.', purpose: 'Validate article quality and usefulness.', defaultFields: ['Context', 'Linked knowledge', 'Reviewer'], checklist: ['Check accuracy', 'Confirm taxonomy', 'Approve content'], evidenceRules: 'Review comment required.', closureCriteria: ['Review complete', 'Content published or returned'], defaultSla: '4 business days', ownerRole: 'Knowledge reviewer', usedBy: 'Knowledge Owners' },
  { id: 'TPL-106', name: 'SLA Follow-up Task', contextPattern: 'SLA signal shows risk or breach exposure.', purpose: 'Drive timely action on SLA risk.', defaultFields: ['Context', 'SLA', 'Owner', 'Impact'], checklist: ['Confirm breach risk', 'Assign owner', 'Escalate if needed'], evidenceRules: 'Update note required.', closureCriteria: ['Risk mitigated', 'Owner update recorded'], defaultSla: '1 business day', ownerRole: 'Fulfilment owner', usedBy: 'Support' },
  { id: 'TPL-107', name: 'Control Assessment Task', contextPattern: 'Control assessment requires evidence and review.', purpose: 'Complete control assessment with audit-ready evidence.', defaultFields: ['Context', 'Control item', 'Evidence'], checklist: ['Review control', 'Attach evidence', 'Submit review'], evidenceRules: 'Evidence approval required.', closureCriteria: ['Evidence approved', 'Reviewer sign-off'], defaultSla: '10 business days', ownerRole: 'Control owner', usedBy: 'Governance' },
  { id: 'TPL-108', name: 'Feature Implementation Task', contextPattern: 'Feature request has been accepted for implementation.', purpose: 'Deliver feature work with traceable output.', defaultFields: ['Context', 'Linked tracker', 'Expected output'], checklist: ['Define output', 'Implement change', 'Attach proof'], evidenceRules: 'Change evidence required.', closureCriteria: ['Output delivered', 'Acceptance checked'], defaultSla: 'Sprint cycle', ownerRole: 'Product / Admin', usedBy: 'Platform Admin' }
];

export function buildTasks(role: WorkspaceRole, mode: string): DqTask[] {
  const titles = mode === 'first-time'
    ? ['Complete onboarding profile update', 'Submit access setup evidence', 'Review DQ Ways of Working task', 'Complete role-based learning task', 'Resolve onboarding access blocker']
    : roleSeeds[role];
  const owners = ownerMap[role];
  return titles.map((title, index) => {
    const status = ['In Progress', 'Awaiting Input', 'Awaiting Review', 'Blocked', 'Completed'][index % 5] as TaskStatus;
    const evidenceStatus = index === 0 ? 'Uploaded' : index === 1 ? 'Missing' : index === 2 ? 'Required' : index === 3 ? 'Returned' : 'Approved';
    const isBlocked = status === 'Blocked';
    return {
      taskId: `TSK-${String(1200 + index).padStart(4, '0')}`,
      title,
      context: contextFor(title, role, mode),
      triggerSource: mode === 'first-time' ? 'New Joiner onboarding journey' : index % 2 === 0 ? 'DWS operating rhythm' : 'Manager / owner follow-up',
      relatedBusinessSituation: role === 'Admin' ? 'Platform configuration and governance readiness' : role === 'Support' ? 'Support fulfilment and SLA protection' : role === 'HRA' ? 'Onboarding and workforce readiness' : 'Workspace execution and delivery discipline',
      purpose: purposeFor(title, role),
      expectedOutput: expectedOutputFor(title),
      owner: owners[index % owners.length],
      contributors: ['Amina Hassan', 'Bilal Waqar', owners[(index + 1) % owners.length]],
      reviewer: role === 'Associate' ? 'John Wayua' : owners[(index + 2) % owners.length],
      accountableLead: role === 'Associate' ? 'John Wayua' : owners[(index + 1) % owners.length],
      taskType: index === 1 ? 'Evidence' : index === 2 ? 'Review' : index === 3 ? 'Blocker Resolution' : 'Execution',
      priority: ['High', 'Medium', 'High', 'Critical', 'Low'][index % 5] as TaskPriority,
      status,
      progress: status === 'Completed' ? 100 : status === 'Blocked' ? 35 : status === 'Awaiting Review' ? 80 : status === 'Awaiting Input' ? 45 : 60,
      dueDate: index === 0 ? 'Today' : `${21 + index} May 2026`,
      sla: index === 0 ? '24 hours' : `${2 + index} business days`,
      reminderPreference: index % 2 === 0 ? 'Daily until due' : 'Two days before due date',
      linkedRequest: index % 2 === 0 ? 'REQ-2048 Access and workspace support' : 'N/A',
      linkedTracker: index % 2 === 0 ? 'Strategic Initiatives Tracker' : 'Project Health Tracker',
      linkedGovernanceItem: index === 2 ? 'CTL-205 Control evidence quality' : 'GOV-Q2 Operating discipline',
      linkedKnowledge: index === 4 ? 'DQ Ways of Working Playbook' : 'DWS Task Standards',
      linkedWorkingSession: index % 2 === 0 ? 'DWS Prototype Review' : 'Squad Stand-up',
      checklist: [
        { label: 'Context reviewed and accepted', done: index !== 3 },
        { label: 'Expected output confirmed', done: index > 0 },
        { label: 'Evidence attached or explained', done: evidenceStatus === 'Uploaded' || evidenceStatus === 'Approved' },
        { label: 'Closure criteria checked', done: status === 'Completed' }
      ],
      blockerState: isBlocked ? 'Active blocker' : 'No active blocker',
      blockerReason: isBlocked ? 'Waiting for dependent owner evidence and tracker update.' : 'No blocker currently recorded.',
      blockerOwner: isBlocked ? owners[(index + 1) % owners.length] : 'N/A',
      raisedBy: isBlocked ? activeRaisedBy(role) : 'N/A',
      raisedDate: isBlocked ? '18 May 2026' : 'N/A',
      impact: isBlocked ? 'Delays closure and may affect SLA reporting.' : 'Low',
      escalationStatus: isBlocked ? 'Escalation pending' : 'N/A',
      evidenceRequired: index !== 4,
      evidenceStatus: evidenceStatus as EvidenceStatus,
      evidenceDescription: index !== 4 ? 'Attach proof of completion, decision note, tracker update, or reviewer approval.' : 'Evidence is optional for this task.',
      evidenceItems: evidenceStatus === 'Uploaded' || evidenceStatus === 'Approved' ? [`EV-${index + 301} ${title} proof note`, `Decision note ${index + 1}`] : [],
      closureCriteria: closureCriteriaFor(title),
      outcomeStatement: status === 'Completed' ? `${title} completed with evidence and owner update recorded.` : '',
      reviewRequired: index % 2 === 0,
      comments: [`${owners[index % owners.length]} updated status on 19 May 2026.`, 'AI suggested checking evidence before closure.'],
      activityHistory: ['Task created from DWS operating rhythm.', 'Owner assigned and due date confirmed.', 'Latest update captured in activity feed.'],
      aiRecommendedNextAction: isBlocked ? 'Confirm blocker owner, set escalation deadline, and update the linked tracker.' : 'Review checklist completion and attach the latest evidence before requesting closure.',
      createdBy: index % 2 === 0 ? activeRaisedBy(role) : owners[(index + 1) % owners.length],
      team: role === 'CEO' ? 'Executive Office' : role === 'Admin' ? 'Platform Administration' : role === 'Support' ? 'Support Operations' : 'Digital Workspace',
      closureScore: evidenceStatus === 'Approved' ? 94 : evidenceStatus === 'Missing' ? 48 : isBlocked ? 52 : 76,
      closedDate: status === 'Completed' ? '19 May 2026' : 'Open',
      reviewStatus: status === 'Awaiting Review' ? 'Pending Review' : status === 'Returned' ? 'Returned' : evidenceStatus === 'Approved' ? 'Approved' : 'Review Needed',
      missingItems: [
        !index ? '' : 'Closure note',
        evidenceStatus === 'Missing' || evidenceStatus === 'Returned' ? 'Evidence approval' : '',
        isBlocked ? 'Blocker resolution' : ''
      ].filter(Boolean)
    };
  });
}

function activeRaisedBy(role: WorkspaceRole) {
  if (role === 'Admin') return 'Bilal Waqar';
  if (role === 'Support') return 'Omar Ali';
  if (role === 'HRA') return 'Naomi Kimani';
  if (role === 'CEO') return 'Mariam Said';
  return 'Amina Hassan';
}

function contextFor(title: string, role: WorkspaceRole, mode: string) {
  if (title.includes('Restore Stage 02')) {
    return 'The Stage 02 landing dashboard was replaced by the My Work page after the role-based navigation update. The dashboard must be restored while keeping My Work as a separate detailed page.';
  }
  if (mode === 'first-time') return `This task is part of the New Joiner journey for ${role}. It exists now because onboarding, access, learning, and first work actions must be completed before the associate can operate confidently in DWS.`;
  return `${title} was triggered by the current DWS operating rhythm for ${role}. It belongs to the active workstream and needs clear ownership, evidence, and closure quality before it can be closed.`;
}

function purposeFor(title: string, role: WorkspaceRole) {
  if (title.includes('configuration')) return 'Keep the DWS task model and platform configuration aligned to current operating needs.';
  if (title.includes('evidence')) return 'Ensure proof of work is available for review, closure, and future audit.';
  if (title.includes('blocker') || title.includes('Blocked')) return 'Remove the dependency preventing task progress.';
  return `Move ${role} work forward with clear output, accountability, and evidence.`;
}

function expectedOutputFor(title: string) {
  if (title.includes('profile')) return 'Profile details and preferences are complete and ready for manager/HRA review.';
  if (title.includes('tracker')) return 'Linked tracker item is updated with current status, risk, owner, and next action.';
  if (title.includes('evidence')) return 'Evidence is uploaded, linked, and ready for reviewer approval.';
  return 'Task output is delivered, documented, and ready for review or closure.';
}

function closureCriteriaFor(title: string) {
  if (title.includes('Restore Stage 02')) return ['/workspace opens dashboard', '/workspace/my-work opens My Work', 'Sidebar active states work', 'No placeholder pages', 'Build passes'];
  return ['Context is complete', 'Expected output delivered', 'Checklist completed', 'Evidence uploaded or explicitly not required', 'Blockers resolved', 'Reviewer decision recorded'];
}

function kpisFor(route: TaskRoute, tasks: DqTask[]) {
  if (route === 'closure-quality') {
    return [
      { label: 'Closure Quality Score', value: `${Math.round(tasks.reduce((sum, task) => sum + task.closureScore, 0) / tasks.length)}%`, helper: 'Average quality score', status: 'info' },
      { label: 'Tasks Missing Evidence', value: String(tasks.filter((task) => task.evidenceStatus === 'Missing').length), helper: 'Needs proof of work', status: 'danger' },
      { label: 'Tasks Returned', value: String(tasks.filter((task) => task.reviewStatus === 'Returned').length), helper: 'Returned for correction', status: 'warning' },
      { label: 'Tasks Closed Properly', value: String(tasks.filter((task) => task.closureScore >= 85).length), helper: 'Meets DQ standard', status: 'success' }
    ];
  }
  if (route === 'evidence') {
    return [
      { label: 'Evidence records', value: String(tasks.reduce((sum, task) => sum + Math.max(1, task.evidenceItems.length), 0)), helper: 'Proof records in scope', status: 'info' },
      { label: 'Missing evidence', value: String(tasks.filter((task) => task.evidenceStatus === 'Missing').length), helper: 'Needs upload', status: 'danger' },
      { label: 'Approval notes', value: String(tasks.filter((task) => task.evidenceStatus === 'Approved').length), helper: 'Reviewer approved', status: 'success' },
      { label: 'Returned evidence', value: String(tasks.filter((task) => task.evidenceStatus === 'Returned').length), helper: 'Needs correction', status: 'warning' }
    ];
  }
  if (route === 'review') {
    return [
      { label: 'Pending Review', value: String(tasks.filter((task) => task.status === 'Awaiting Review').length), helper: 'Needs reviewer action', status: 'warning' },
      { label: 'Missing Evidence', value: String(tasks.filter((task) => task.evidenceStatus === 'Missing').length), helper: 'Cannot approve yet', status: 'danger' },
      { label: 'Returned Tasks', value: String(tasks.filter((task) => task.status === 'Returned').length), helper: 'Correction required', status: 'warning' },
      { label: 'Approved This Week', value: String(tasks.filter((task) => task.evidenceStatus === 'Approved').length), helper: 'Review complete', status: 'success' }
    ];
  }
  if (route === 'blocked') {
    return [
      { label: 'Blocked Tasks', value: String(tasks.filter((task) => task.status === 'Blocked').length), helper: 'Task-specific blockers', status: 'danger' },
      { label: 'SLA Risk', value: String(tasks.filter((task) => task.priority === 'Critical').length), helper: 'Critical impact', status: 'danger' },
      { label: 'Escalated', value: String(tasks.filter((task) => task.escalationStatus !== 'N/A').length), helper: 'Escalation open', status: 'warning' },
      { label: 'Owners Assigned', value: String(tasks.filter((task) => task.blockerOwner !== 'N/A').length), helper: 'Owner named', status: 'info' }
    ];
  }
  return [
    { label: 'My Tasks', value: String(tasks.length), helper: 'Tasks in scope', status: 'info' },
    { label: 'Due Today', value: String(tasks.filter((task) => task.dueDate === 'Today').length), helper: 'Time-bound actions', status: 'warning' },
    { label: 'Overdue', value: String(tasks.filter((task) => task.priority === 'Critical').length), helper: 'Needs attention', status: 'danger' },
    { label: 'Blocked', value: String(tasks.filter((task) => task.status === 'Blocked').length), helper: 'Cannot progress', status: 'danger' },
    { label: 'Awaiting Review', value: String(tasks.filter((task) => task.status === 'Awaiting Review').length), helper: 'Review queue', status: 'warning' }
  ];
}

function KpiStrip({ items, onApply }: { items: Array<{ label: string; value: string; helper: string; status: string }>; onApply: (label: string) => void }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-5">
      {items.map((item) => (
        <button key={item.label} onClick={() => onApply(item.label)} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm hover:bg-surface">
          <div className="text-sm font-semibold text-text-muted">{item.label}</div>
          <div className="mt-2 text-3xl font-bold text-primary">{item.value}</div>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-text-secondary">
            <span className={`h-2 w-2 rounded-full ${item.status === 'success' ? 'bg-success' : item.status === 'warning' ? 'bg-warning' : item.status === 'danger' ? 'bg-danger' : 'bg-info'}`} />
            {item.helper}
          </div>
        </button>
      ))}
    </section>
  );
}

function TaskDetailDrawer({ task, route, onClose, onUpdate, onModal }: { task: DqTask | null; route: TaskRoute; onClose: () => void; onUpdate: (task: DqTask) => void; onModal: (title: string) => void }) {
  const { activeRole, activeSegment } = useWorkspaceRole();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<DqTask | null>(task);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [discardOpen, setDiscardOpen] = useState(false);
  const [linkedDetail, setLinkedDetail] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  React.useEffect(() => {
    setDraft(task);
    setIsEditing(false);
    setErrors({});
    setAiResponse(null);
  }, [task]);

  if (!task) return null;
  const current = draft || task;
  const permissions = getTaskPermissions(task, activeRole, activeSegment.profileName);
  const dirty = JSON.stringify(current) !== JSON.stringify(task);
  const closureMissing = getClosureMissingItems(current);
  const completionPercent = Math.round((current.checklist.filter((item) => item.done).length / Math.max(1, current.checklist.length)) * 100);

  const requestClose = () => {
    if (dirty) {
      setDiscardOpen(true);
      return;
    }
    onClose();
  };

  const updateDraft = <K extends keyof DqTask>(key: K, value: DqTask[K]) => {
    setDraft((existing) => existing ? { ...existing, [key]: value } : existing);
    setErrors((existing) => ({ ...existing, [String(key)]: '' }));
  };

  const saveChanges = () => {
    const nextErrors = validateTaskDraft(current);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const nextTask: DqTask = {
      ...current,
      activityHistory: [`Task details updated by ${activeSegment.profileName}`, ...current.activityHistory],
      closureScore: calculateClosureScore(current),
      missingItems: getClosureMissingItems(current)
    };
    onUpdate(nextTask);
    setDraft(nextTask);
    setIsEditing(false);
    toast.success('Task updated successfully.');
  };

  const restricted = () => toast.error('Access restricted for this task action.');
  const linkedValues = [
    current.linkedRequest,
    current.linkedTracker,
    current.linkedGovernanceItem,
    current.linkedKnowledge,
    current.linkedWorkingSession
  ].filter(Boolean);

  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={requestClose} />
      <aside className="fixed right-0 top-0 z-[200] flex h-screen w-full max-w-3xl flex-col border-l border-border-default bg-white shadow-xl">
        <div className="sticky top-0 z-10 border-b border-border-subtle bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{current.taskId} · {current.taskType}</div>
              {isEditing && permissions.main ? (
                <EditableInput value={current.title} onChange={(value) => updateDraft('title', value)} error={errors.title} required />
              ) : (
                <h2 className="mt-1 truncate text-xl font-bold text-primary">{current.title}</h2>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusPill status={current.status} />
                <StatusPill status={current.priority} />
                <StatusPill status={current.evidenceStatus} />
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-primary">{initials(current.owner)}</span>
                <span className="text-xs font-semibold text-text-muted">Due {current.dueDate} · SLA {current.sla}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {isEditing ? (
                <>
                  <button onClick={saveChanges} disabled={!dirty} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Save Changes</button>
                  <button onClick={() => { setDraft(task); setErrors({}); setIsEditing(false); }} className="rounded-button border border-border-default bg-white px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Cancel</button>
                </>
              ) : permissions.any && (
                <button onClick={() => setIsEditing(true)} className="rounded-button border border-border-default bg-white px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Edit</button>
              )}
              <button onClick={requestClose} aria-label="Close task drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={20} /></button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <DrawerCard title="Context" helper="Explain why this task exists, what triggered it, and what workstream or business situation it belongs to.">
              <EditableTextArea label="Context" value={current.context} error={errors.context} required readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('context', value)} />
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <EditableInput label="Trigger / Source" value={current.triggerSource} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('triggerSource', value)} />
                <EditableInput label="Related business situation" value={current.relatedBusinessSituation} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('relatedBusinessSituation', value)} />
              </div>
            </DrawerCard>

            <DrawerCard title="Purpose & Expected Output">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <EditableTextArea label="Purpose" value={current.purpose} error={errors.purpose} required readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('purpose', value)} />
                <EditableTextArea label="Expected Output" value={current.expectedOutput} error={errors.expectedOutput} required readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('expectedOutput', value)} />
              </div>
            </DrawerCard>

            <DrawerCard title="Ownership">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <EditableSelect label="Owner" value={current.owner} options={mockUsers} error={errors.owner} required readOnly={!isEditing || !permissions.lead} onChange={(value) => updateDraft('owner', value)} />
                <EditableInput label="Contributors" value={current.contributors.join(', ')} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('contributors', splitValues(value))} />
                <EditableSelect label="Reviewer" value={current.reviewer} options={mockUsers} error={errors.reviewer} readOnly={!isEditing || !permissions.review} onChange={(value) => updateDraft('reviewer', value)} />
                <EditableSelect label="Accountable Lead" value={current.accountableLead} options={mockUsers} readOnly={!isEditing || !permissions.lead} onChange={(value) => updateDraft('accountableLead', value)} />
              </div>
            </DrawerCard>

            <DrawerCard title="Timing & Priority">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <EditableSelect label="Priority" value={current.priority} options={['Low', 'Medium', 'High', 'Critical']} error={errors.priority} required readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('priority', value as TaskPriority)} />
                <EditableInput label="Due Date" value={current.dueDate} error={errors.dueDate} required readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('dueDate', value)} />
                <EditableInput label="SLA" value={current.sla} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('sla', value)} />
                <EditableSelect label="Reminder preference" value={current.reminderPreference} options={['Daily until due', 'Two days before due date', 'On due date only', 'No reminder']} readOnly={!isEditing || !permissions.own} onChange={(value) => updateDraft('reminderPreference', value)} />
              </div>
            </DrawerCard>

            <DrawerCard title="Status & Progress">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <EditableSelect label="Status" value={current.status} options={taskStatuses} readOnly={!isEditing || !permissions.own} onChange={(value) => updateDraft('status', value as TaskStatus)} />
                <EditableInput label="Progress %" value={String(current.progress)} readOnly={!isEditing || !permissions.own} onChange={(value) => updateDraft('progress', clampProgress(value))} />
                <EditableTextArea label="Current update" value={current.comments[0] || ''} readOnly={!isEditing || !permissions.own} onChange={(value) => updateDraft('comments', [value, ...current.comments.slice(1)])} />
                <EditableTextArea label="Next action" value={current.aiRecommendedNextAction} readOnly={!isEditing || !permissions.own} onChange={(value) => updateDraft('aiRecommendedNextAction', value)} />
              </div>
              {errors.blockerReason && <InlineError text={errors.blockerReason} />}
              {errors.blockerOwner && <InlineError text={errors.blockerOwner} />}
            </DrawerCard>

            <DrawerCard title="Linked Work">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <EditableSelect label="Linked Request" value={current.linkedRequest} options={linkedRequests} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('linkedRequest', value)} />
                <EditableSelect label="Linked Tracker" value={current.linkedTracker} options={linkedTrackers} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('linkedTracker', value)} />
                <EditableSelect label="Linked Governance Item" value={current.linkedGovernanceItem} options={linkedGovernanceItems} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('linkedGovernanceItem', value)} />
                <EditableSelect label="Linked Knowledge" value={current.linkedKnowledge} options={linkedKnowledgeItems} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('linkedKnowledge', value)} />
                <EditableSelect label="Linked Working Session" value={current.linkedWorkingSession} options={linkedWorkingSessions} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('linkedWorkingSession', value)} />
              </div>
              <ChipButtonList values={linkedValues} onOpen={setLinkedDetail} />
            </DrawerCard>

            <WorkItemLinkedKnowledgeCard workItemId={current.taskId} />

            <DrawerCard title={`Checklist (${completionPercent}% complete)`}>
              <div className="space-y-2">
                {current.checklist.map((item, index) => (
                  <div key={`${item.label}-${index}`} className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary">
                    {isEditing && permissions.own ? <input type="checkbox" checked={item.done} onChange={(event) => updateDraft('checklist', current.checklist.map((entry, entryIndex) => entryIndex === index ? { ...entry, done: event.target.checked } : entry))} /> : <span className={`h-2.5 w-2.5 rounded-full ${item.done ? 'bg-success' : 'bg-warning'}`} />}
                    {isEditing && permissions.main ? <input value={item.label} onChange={(event) => updateDraft('checklist', current.checklist.map((entry, entryIndex) => entryIndex === index ? { ...entry, label: event.target.value } : entry))} className="h-9 flex-1 rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /> : <span className="flex-1">{item.label}</span>}
                    {isEditing && permissions.main && <button onClick={() => updateDraft('checklist', current.checklist.filter((_, entryIndex) => entryIndex !== index))} className="text-xs font-bold text-danger-text">Remove</button>}
                  </div>
                ))}
              </div>
              {isEditing && permissions.main && <button onClick={() => updateDraft('checklist', [...current.checklist, { label: 'New checklist item', done: false }])} className="mt-3 rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Add Item</button>}
            </DrawerCard>

            <DrawerCard title="Evidence">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ToggleRow label="Evidence Required" checked={current.evidenceRequired} readOnly={!isEditing || !permissions.main} onChange={(checked) => updateDraft('evidenceRequired', checked)} />
                <EditableSelect label="Evidence review status" value={current.evidenceStatus} options={evidenceStatuses} readOnly={!isEditing || !permissions.review} onChange={(value) => updateDraft('evidenceStatus', value as EvidenceStatus)} />
                <EditableTextArea label="Evidence Description" value={current.evidenceDescription} error={errors.evidenceDescription} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('evidenceDescription', value)} />
              </div>
              <ChipButtonList values={current.evidenceItems.length ? current.evidenceItems : ['No evidence uploaded yet']} onOpen={setLinkedDetail} />
              <div className="mt-3 flex flex-wrap gap-2">
                {permissions.own && <button onClick={() => onModal('Upload Evidence')} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Upload Evidence</button>}
                {permissions.own && <button onClick={() => updateDraft('evidenceItems', [...current.evidenceItems, `EV-${Date.now().toString().slice(-3)} linked evidence`])} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Link Existing Evidence</button>}
                {isEditing && permissions.main && current.evidenceItems.length > 0 && <button onClick={() => updateDraft('evidenceItems', current.evidenceItems.slice(0, -1))} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Remove Evidence</button>}
              </div>
              {errors.evidenceClosed && <InlineError text={errors.evidenceClosed} />}
            </DrawerCard>

            <DrawerCard title="Blockers">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <EditableSelect label="Blocker State" value={current.blockerState} options={['No active blocker', 'Active blocker', 'Resolved blocker']} readOnly={!isEditing || !permissions.own} onChange={(value) => updateDraft('blockerState', value)} />
                <EditableInput label="Blocker Owner" value={current.blockerOwner} error={errors.blockerOwner} readOnly={!isEditing || !permissions.lead} onChange={(value) => updateDraft('blockerOwner', value)} />
                <EditableTextArea label="Blocker Reason" value={current.blockerReason} error={errors.blockerReason} readOnly={!isEditing || !permissions.own} onChange={(value) => updateDraft('blockerReason', value)} />
                <EditableTextArea label="Impact" value={current.impact} readOnly={!isEditing || !permissions.own} onChange={(value) => updateDraft('impact', value)} />
                <EditableTextArea label="Next Action" value={current.aiRecommendedNextAction} readOnly={!isEditing || !permissions.own} onChange={(value) => updateDraft('aiRecommendedNextAction', value)} />
                <EditableSelect label="Escalation Status" value={current.escalationStatus} options={['N/A', 'Escalation pending', 'Escalated', 'Resolved']} readOnly={!isEditing || !permissions.lead} onChange={(value) => updateDraft('escalationStatus', value)} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {permissions.own && <button onClick={() => updateDraft('blockerState', 'Resolved blocker')} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Resolve Blocker</button>}
                {permissions.lead && <button onClick={() => onModal('Escalate Blocker')} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Escalate Blocker</button>}
              </div>
            </DrawerCard>

            <DrawerCard title="Closure Criteria">
              <div className="rounded-card border border-border-subtle bg-surface p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-primary">{closureMissing.length ? 'Missing required items' : 'Ready to close'}</h3>
                    <p className="mt-1 text-xs text-text-muted">{closureMissing.length ? closureMissing.join(', ') : 'All closure quality checks are satisfied.'}</p>
                  </div>
                  <StatusPill status={closureMissing.length ? 'Awaiting Input' : 'Approved'} />
                </div>
              </div>
              <EditableTextArea label="Closure Criteria" value={current.closureCriteria.join('; ')} error={errors.closureCriteria} required readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('closureCriteria', splitValues(value, ';'))} />
              <EditableTextArea label="Outcome Statement" value={current.outcomeStatement} error={errors.outcomeStatement} readOnly={!isEditing || !permissions.main} onChange={(value) => updateDraft('outcomeStatement', value)} />
              <ToggleRow label="Review Required" checked={current.reviewRequired} readOnly={!isEditing || !permissions.review} onChange={(checked) => updateDraft('reviewRequired', checked)} />
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                {closureQualityChecks(current).map(([label, ok]) => <div key={label} className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-primary"><span className={`h-2.5 w-2.5 rounded-full ${ok ? 'bg-success' : 'bg-warning'}`} />{label}</div>)}
              </div>
            </DrawerCard>

            <DrawerCard title="Comments / Updates">
              <ChipList values={current.comments} />
              <div className="mt-3 flex flex-wrap gap-2">
                {permissions.own && <button onClick={() => updateDraft('comments', [`Comment added by ${activeSegment.profileName}`, ...current.comments])} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Add Comment</button>}
                {permissions.own && <button onClick={() => updateDraft('comments', [`Update added by ${activeSegment.profileName}`, ...current.comments])} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Add Update</button>}
                {permissions.own && <button onClick={() => updateDraft('comments', [`Decision note by ${activeSegment.profileName}`, ...current.comments])} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Mark comment as decision note</button>}
              </div>
            </DrawerCard>

            <DrawerCard title="Activity Timeline">
              <div className="space-y-3">
                {current.activityHistory.map((event, index) => <div key={`${event}-${index}`} className="flex gap-3"><span className="mt-1 h-3 w-3 rounded-full bg-info" /><div className="text-sm text-text-secondary"><span className="font-semibold text-primary">{event}</span><div className="text-xs text-text-muted">{index === 0 ? 'Latest activity' : `${index + 1} events ago`}</div></div></div>)}
              </div>
            </DrawerCard>

            <DrawerCard title="AI Recommended Next Action">
              <p className="text-sm leading-6 text-text-secondary">{current.aiRecommendedNextAction}</p>
              <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                {['Summarise this task', 'Generate task update', 'Check missing evidence', 'Suggest next action', 'Prepare closure summary', 'Explain blocker impact'].map((action) => (
                  <button key={action} onClick={() => setAiResponse(mockAiResponse(action, current))} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">{action}</button>
                ))}
              </div>
              {aiResponse && <div className="mt-4 rounded-card border border-border-subtle bg-white p-4 text-sm leading-6 text-text-secondary">{aiResponse}</div>}
            </DrawerCard>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {drawerActions(route).filter((action) => canUseDrawerAction(action, permissions)).map((action) => (
                <button
                  key={action}
                  onClick={() => handleDrawerAction(action, current, permissions, updateDraft, onUpdate, onModal, restricted)}
                  className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border-subtle bg-white px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-semibold text-text-muted">{dirty ? 'Unsaved changes' : 'All changes saved locally'}</div>
            <div className="flex gap-2">
              {permissions.own && <button onClick={() => handleDrawerAction('Mark Complete', current, permissions, updateDraft, onUpdate, onModal, restricted)} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Mark Complete</button>}
              {permissions.review && <button onClick={() => handleDrawerAction('Close Task', current, permissions, updateDraft, onUpdate, onModal, restricted)} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Close Task</button>}
              {isEditing && <button onClick={saveChanges} disabled={!dirty} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Save Changes</button>}
            </div>
          </div>
        </div>
      </aside>
      {discardOpen && (
        <>
          <div className="fixed inset-0 z-[230] bg-primary/20" />
          <section className="fixed left-1/2 top-1/2 z-[240] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-primary">You have unsaved changes. Discard changes?</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">Unsaved task edits will be lost.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setDiscardOpen(false)} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Keep Editing</button>
              <button onClick={() => { setDiscardOpen(false); onClose(); }} className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white">Discard Changes</button>
            </div>
          </section>
        </>
      )}
      {linkedDetail && (
        <>
          <div className="fixed inset-0 z-[230] bg-primary/20" onClick={() => setLinkedDetail(null)} />
          <section className="fixed left-1/2 top-1/2 z-[240] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Linked DWS item</div>
                <h2 className="mt-1 text-lg font-bold text-primary">{linkedDetail}</h2>
              </div>
              <button onClick={() => setLinkedDetail(null)} aria-label="Close linked item" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={18} /></button>
            </div>
            <p className="mt-4 text-sm leading-6 text-text-secondary">This lightweight detail view represents the linked request, tracker, governance item, knowledge asset, working session, or evidence record in the local prototype.</p>
          </section>
        </>
      )}
    </>
  );
}

function drawerActions(route: TaskRoute) {
  if (route === 'review') return ['Approve', 'Return for Correction', 'Request Evidence', 'Add Review Comment'];
  if (route === 'blocked') return ['Resolve Blocker', 'Escalate', 'Assign Blocker Owner', 'Add Update'];
  if (route === 'closure-quality') return ['Request Correction', 'Approve Closure', 'Add Closure Note', 'Generate Closure Summary'];
  if (route === 'evidence') return ['Upload Evidence', 'View Evidence', 'Link Evidence', 'Approve Evidence'];
  return ['Update Status', 'Add Comment', 'Upload Evidence', 'Raise Blocker', 'Mark Complete', 'Generate Task Summary'];
}

const taskStatuses: TaskStatus[] = ['Not Started', 'In Progress', 'Awaiting Input', 'Awaiting Review', 'Blocked', 'Returned', 'Completed', 'Closed'];
const evidenceStatuses: EvidenceStatus[] = ['Not Required', 'Required', 'Missing', 'Uploaded', 'Approved', 'Returned'];
const mockUsers = ['Amina Hassan', 'Bilal Waqar', 'Sreya Lakshmi', 'Naomi Kimani', 'Omar Ali', 'Ian Kipkorir', 'John Wayua', 'Mariam Said'];
const linkedRequests = ['N/A', 'REQ-2048 Access and workspace support', 'REQ-2091 Platform configuration request', 'REQ-2120 HRA onboarding clarification'];
const linkedTrackers = ['N/A', 'Strategic Initiatives Tracker', 'Project Health Tracker', 'Governance Actions Tracker', 'Features Tracker'];
const linkedGovernanceItems = ['N/A', 'GOV-Q2 Operating discipline', 'CTL-205 Control evidence quality', 'RSK-1024 Data privacy risk'];
const linkedKnowledgeItems = ['N/A', 'DWS Task Standards', 'DQ Ways of Working Playbook', 'Closure Quality Guide', 'Evidence Standards'];
const linkedWorkingSessions = ['N/A', 'DWS Prototype Review', 'Squad Stand-up', 'Governance Review Working Session', 'Support Triage Session'];

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
}

function getTaskPermissions(task: DqTask, role: WorkspaceRole, activeUser: string) {
  const leadRoles: WorkspaceRole[] = ['Scrum Master', 'Team / Squad Lead', 'Unit Lead'];
  const isOwner = task.owner === activeUser;
  const isReviewer = task.reviewer === activeUser;
  const isAdmin = role === 'Admin';
  const isLead = leadRoles.includes(role);
  const isScopedOperator = (role === 'HRA' && task.team.includes('HRA')) || (role === 'Support' && task.team.includes('Support'));
  const isExecutiveReviewer = role === 'CEO' && (isReviewer || task.reviewer === 'Mariam Said');
  const main = isAdmin || isOwner || isLead || isScopedOperator;
  const review = isAdmin || isReviewer || isLead || isScopedOperator || isExecutiveReviewer;
  const own = isAdmin || isOwner || isReviewer || isLead || isScopedOperator || role !== 'CEO';
  return {
    any: main || review || own,
    main,
    review,
    own,
    lead: isAdmin || isLead || isScopedOperator
  };
}

function validateTaskDraft(task: DqTask) {
  const errors: Record<string, string> = {};
  if (!task.title.trim()) errors.title = 'Title is required.';
  if (!task.context.trim()) errors.context = 'Context is required for a DQ task.';
  if (!task.purpose.trim()) errors.purpose = 'Purpose is required.';
  if (!task.expectedOutput.trim()) errors.expectedOutput = 'Expected Output is required.';
  if (!task.owner.trim()) errors.owner = 'Owner is required.';
  if (!task.priority.trim()) errors.priority = 'Priority is required.';
  if (!task.dueDate.trim()) errors.dueDate = 'Due date is required.';
  if (!task.closureCriteria.length || task.closureCriteria.every((item) => !item.trim())) errors.closureCriteria = 'Closure Criteria is required.';
  if (task.status === 'Blocked' || task.blockerState === 'Active blocker') {
    if (!task.blockerReason.trim() || task.blockerReason === 'No blocker currently recorded.') errors.blockerReason = 'Blocker Reason is required when status is Blocked.';
    if (!task.blockerOwner.trim() || task.blockerOwner === 'N/A') errors.blockerOwner = 'Blocker Owner is required when status is Blocked.';
  }
  if (task.evidenceRequired && !task.evidenceDescription.trim()) errors.evidenceDescription = 'Evidence Description is required when Evidence Required is enabled.';
  if (task.reviewRequired && (!task.reviewer.trim() || task.reviewer === 'N/A')) errors.reviewer = 'Reviewer is required when Review Required is enabled.';
  if ((task.status === 'Closed' || task.status === 'Completed') && !task.outcomeStatement.trim()) errors.outcomeStatement = 'Outcome Statement is required when closing task.';
  if (task.status === 'Closed' && task.evidenceRequired && !['Uploaded', 'Approved'].includes(task.evidenceStatus)) errors.evidenceClosed = 'Task cannot be closed while required evidence is missing.';
  if ((task.status === 'Closed' || task.status === 'Completed') && getClosureMissingItems(task).length) errors.closureCriteria = 'Closure quality checks must be satisfied before completion or closure.';
  return errors;
}

function getClosureMissingItems(task: DqTask) {
  return closureQualityChecks(task).filter(([, ok]) => !ok).map(([label]) => label);
}

function calculateClosureScore(task: DqTask) {
  const checks = closureQualityChecks(task);
  return Math.round((checks.filter(([, ok]) => ok).length / checks.length) * 100);
}

function closureQualityChecks(task: DqTask): Array<[string, boolean]> {
  return [
    ['Context provided', Boolean(task.context.trim())],
    ['Purpose clear', Boolean(task.purpose.trim())],
    ['Expected output defined', Boolean(task.expectedOutput.trim())],
    ['Checklist completed', task.checklist.length > 0 && task.checklist.every((item) => item.done)],
    ['Evidence uploaded if required', !task.evidenceRequired || ['Uploaded', 'Approved'].includes(task.evidenceStatus)],
    ['Outcome stated', Boolean(task.outcomeStatement.trim())],
    ['Blockers resolved', task.blockerState !== 'Active blocker' && task.status !== 'Blocked'],
    ['Linked tracker updated if applicable', task.linkedTracker === 'N/A' || Boolean(task.linkedTracker)],
    ['Review completed if required', !task.reviewRequired || ['Approved', 'Closed'].includes(task.reviewStatus) || task.status === 'Closed']
  ];
}

function canUseDrawerAction(action: string, permissions: ReturnType<typeof getTaskPermissions>) {
  if (['Approve', 'Approve Closure', 'Approve Evidence', 'Return for Correction', 'Request Evidence', 'Add Review Comment', 'Close Task'].includes(action)) return permissions.review;
  if (['Escalate', 'Assign Blocker Owner', 'Request Correction'].includes(action)) return permissions.lead;
  return permissions.own;
}

function handleDrawerAction(
  action: string,
  task: DqTask,
  permissions: ReturnType<typeof getTaskPermissions>,
  updateDraft: TaskDraftUpdater,
  onUpdate: (task: DqTask) => void,
  onModal: (title: string) => void,
  restricted: () => void
) {
  if (!canUseDrawerAction(action, permissions)) {
    restricted();
    return;
  }
  if (action === 'Mark Complete' || action === 'Close Task') {
    const nextStatus: TaskStatus = action === 'Close Task' ? 'Closed' : 'Completed';
    const next = { ...task, status: nextStatus, progress: 100, closedDate: 'Today' };
    const errors = validateTaskDraft(next);
    if (Object.keys(errors).length || getClosureMissingItems(next).length) {
      toast.error(action === 'Close Task' ? 'Close Task requires all closure quality checks.' : 'Closure criteria, evidence, and blockers must be resolved first.');
      return;
    }
    onUpdate({ ...next, activityHistory: [`${action} completed`, ...task.activityHistory], closureScore: calculateClosureScore(next), missingItems: [] });
    toast.success(`${action} saved.`);
    return;
  }
  if (action === 'Resolve Blocker') {
    const next: DqTask = {
      ...task,
      blockerState: 'Resolved blocker',
      status: 'In Progress',
      escalationStatus: 'Resolved',
      blockerReason: 'Resolved during task detail review.',
      closureScore: calculateClosureScore({ ...task, blockerState: 'Resolved blocker', status: 'In Progress', escalationStatus: 'Resolved' }),
      missingItems: getClosureMissingItems({ ...task, blockerState: 'Resolved blocker', status: 'In Progress', escalationStatus: 'Resolved' }),
      activityHistory: ['Blocker resolved from task detail drawer.', ...task.activityHistory]
    };
    updateDraft('blockerState', next.blockerState);
    updateDraft('status', next.status);
    updateDraft('escalationStatus', next.escalationStatus);
    updateDraft('blockerReason', next.blockerReason);
    onUpdate(next);
    toast.success('Blocker resolved locally.');
    return;
  }
  if (['Approve', 'Approve Closure', 'Approve Evidence'].includes(action)) {
    onUpdate({ ...task, reviewStatus: 'Approved', evidenceStatus: 'Approved', activityHistory: [`${action} by reviewer`, ...task.activityHistory] });
    toast.success(`${action} saved.`);
    return;
  }
  if (action === 'Raise Blocker') {
    updateDraft('status', 'Blocked');
    updateDraft('blockerState', 'Active blocker');
    onModal(action);
    return;
  }
  onModal(action);
}

function splitValues(value: string, delimiter = ',') {
  return value.split(delimiter).map((item) => item.trim()).filter(Boolean);
}

function clampProgress(value: string) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

function DrawerCard({ title, helper, children }: { title: string; helper?: string; children: React.ReactNode }) {
  return <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm"><h3 className="text-base font-bold text-primary">{title}</h3>{helper && <p className="mt-1 text-xs leading-5 text-text-muted">{helper}</p>}<div className="mt-4">{children}</div></section>;
}

function InlineError({ text }: { text: string }) {
  return <p className="mt-2 text-xs font-semibold text-danger-text">{text}</p>;
}

function EditableInput({ label, value, onChange, readOnly = false, error, required = false }: { label?: string; value: string; onChange: (value: string) => void; readOnly?: boolean; error?: string; required?: boolean }) {
  return <label className="block">{label && <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}{required ? ' *' : ''}</span>}{readOnly ? <div className="mt-1 text-sm font-semibold text-primary">{value || 'N/A'}</div> : <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" />}{error && <InlineError text={error} />}</label>;
}

function EditableTextArea({ label, value, onChange, readOnly = false, error, required = false }: { label: string; value: string; onChange: (value: string) => void; readOnly?: boolean; error?: string; required?: boolean }) {
  return <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}{required ? ' *' : ''}</span>{readOnly ? <p className="mt-2 text-sm leading-6 text-text-secondary">{value || 'N/A'}</p> : <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" />}{error && <InlineError text={error} />}</label>;
}

function EditableSelect({ label, value, options, onChange, readOnly = false, error, required = false }: { label: string; value: string; options: string[]; onChange: (value: string) => void; readOnly?: boolean; error?: string; required?: boolean }) {
  return <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}{required ? ' *' : ''}</span>{readOnly ? <div className="mt-1 text-sm font-semibold text-primary">{value || 'N/A'}</div> : <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong">{options.map((option) => <option key={option}>{option}</option>)}</select>}{error && <InlineError text={error} />}</label>;
}

function ToggleRow({ label, checked, onChange, readOnly = false }: { label: string; checked: boolean; onChange: (checked: boolean) => void; readOnly?: boolean }) {
  return <label className="flex items-center justify-between rounded-card border border-border-subtle bg-surface px-4 py-3"><span className="text-sm font-semibold text-primary">{label}</span>{readOnly ? <StatusPill status={checked ? 'Required' : 'Not Required'} /> : <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />}</label>;
}

function ChipButtonList({ values, onOpen }: { values: string[]; onOpen: (value: string) => void }) {
  return <div className="mt-3 flex flex-wrap gap-2">{values.map((value, index) => <button key={`${value}-${index}`} onClick={() => onOpen(value)} className="rounded-pill border border-border-subtle bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-white hover:text-primary">{value}</button>)}</div>;
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h3 className="text-sm font-bold text-primary">{title}</h3><div className="mt-2">{children}</div></section>;
}

function ChipList({ values }: { values: string[] }) {
  return <div className="mt-2 flex flex-wrap gap-2">{values.map((value, index) => <span key={`${value}-${index}`} className="rounded-pill border border-border-subtle bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary">{value}</span>)}</div>;
}

function ActionModal({ title, onClose, onSave }: { title: string; onClose: () => void; onSave: (values: Record<string, string>) => void }) {
  const fields = fieldsForAction(title);
  const [values, setValues] = useState<Record<string, string>>({});
  const canSubmit = fields.every((field) => String(values[field] || '').trim());
  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/20" onClick={onClose} />
      <section className="fixed left-1/2 top-1/2 z-[220] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div><h2 className="text-xl font-bold text-primary">{title}</h2><p className="mt-1 text-sm text-text-secondary">Required fields are validated locally. No backend call is made.</p></div>
          <button onClick={onClose} aria-label="Close modal" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className={['Comment', 'Notes', 'Evidence Description', 'Blocker Reason', 'Review Comment', 'Summary', 'Closure Criteria'].includes(field) ? 'md:col-span-2' : ''}>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{field}</span>
              <input value={values[field] || ''} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Cancel</button>
          <button disabled={!canSubmit} onClick={() => onSave(values)} className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Save</button>
        </div>
      </section>
    </>
  );
}

function fieldsForAction(title: string) {
  if (title.includes('Evidence')) return ['Evidence Type', 'Evidence Description', 'Linked Work', 'Uploaded By'];
  if (title.includes('Blocker') || title === 'Escalate') return ['Blocker Reason', 'Blocker Owner', 'Impact', 'Next Action'];
  if (title.includes('Review') || title.includes('Correction') || title.includes('Approve')) return ['Review Comment', 'Reviewer', 'Decision'];
  if (title.includes('Summary')) return ['Summary', 'Audience', 'Format'];
  if (title === 'Export Tasks' || title.includes('Export')) return ['Report Name', 'Scope', 'Format'];
  return ['Status', 'Owner', 'Due Date', 'Comment'];
}

function ConfigureTaskViewDrawer({ route, config, onClose, onSave, role }: { route: TaskRoute; config: TaskViewConfig; onClose: () => void; onSave: (config: TaskViewConfig) => void; role: WorkspaceRole }) {
  const meta = routeMeta[route];
  const [draft, setDraft] = useState(config);
  const [tab, setTab] = useState('Columns');
  const canConfigureScoped = ['Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'HRA', 'Support', 'Admin'].includes(role);
  const tabs = ['Columns', 'Saved Filters', 'Default View', 'Grouping', 'Notifications', ...(canConfigureScoped ? ['Scoped Views'] : []), ...(role === 'Admin' ? ['Global Task Model'] : [])];
  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[200] h-screen w-full max-w-lg overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5">
          <div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">User-level task preferences</div><h2 className="mt-1 text-xl font-bold text-primary">Configure My Task View</h2></div>
          <button onClick={onClose} aria-label="Close task view drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={20} /></button>
        </div>
        <div className="p-6">
          <div className="mb-5 flex flex-wrap gap-2 border-b border-border-subtle">{tabs.map((name) => <button key={name} onClick={() => setTab(name)} className={`px-3 py-3 text-sm font-bold ${tab === name ? 'border-b-2 border-info text-info-text' : 'text-text-secondary hover:text-primary'}`}>{name}</button>)}</div>
          {tab === 'Columns' && <div className="space-y-3">{meta.columns.map((column) => <label key={column} className="flex items-center justify-between rounded-card border border-border-subtle bg-surface px-4 py-3"><span className="text-sm font-semibold text-primary">{column}</span><input type="checkbox" checked={draft.columns[column] !== false} onChange={(event) => setDraft((current) => ({ ...current, columns: { ...current.columns, [column]: event.target.checked } }))} /></label>)}</div>}
          {tab === 'Saved Filters' && <ConfigInput label="Save current filter" value={draft.savedFilter} onChange={(value) => setDraft((current) => ({ ...current, savedFilter: value }))} />}
          {tab === 'Default View' && <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><ConfigSelect label="Default tab" value={draft.defaultTab} options={meta.tabs} onChange={(value) => setDraft((current) => ({ ...current, defaultTab: value }))} /><ConfigSelect label="Default sort" value={draft.sortBy} options={['Due Date', 'Priority', 'Status', 'Owner']} onChange={(value) => setDraft((current) => ({ ...current, sortBy: value }))} /></div>}
          {tab === 'Grouping' && <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><ConfigSelect label="Group by" value={draft.groupBy} options={['Status', 'Priority', 'Owner', 'Due Date', 'Task Type']} onChange={(value) => setDraft((current) => ({ ...current, groupBy: value }))} /><ConfigInput label="Favourite task view" value={draft.favouriteView} onChange={(value) => setDraft((current) => ({ ...current, favouriteView: value }))} /></div>}
          {tab === 'Notifications' && <div className="space-y-3"><label className="flex items-center justify-between rounded-card border border-border-subtle bg-surface px-4 py-3"><span className="text-sm font-semibold text-primary">Task notifications</span><input type="checkbox" checked={draft.notifications} onChange={(event) => setDraft((current) => ({ ...current, notifications: event.target.checked }))} /></label><ConfigInput label="Reminder rule" value="Due date and priority changes" onChange={() => undefined} /></div>}
          {tab === 'Scoped Views' && <ScopedConfig role={role} />}
          {tab === 'Global Task Model' && <GlobalTaskModelLink />}
          <div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Cancel</button><button onClick={() => onSave(draft)} className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white">Save preferences</button></div>
        </div>
      </aside>
    </>
  );
}

function ConfigInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>;
}

function ConfigSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label><span className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function ScopedConfig({ role }: { role: WorkspaceRole }) {
  const labels = role === 'HRA' ? ['HRA task views', 'Review checklists', 'Evidence expectations'] : role === 'Support' ? ['Support task views', 'SLA evidence expectations', 'Closure quality checklist'] : ['Team task views', 'Squad task views', 'Review checklists', 'Evidence expectations', 'Closure quality checklist'];
  return <div className="space-y-3">{labels.map((label) => <button key={label} onClick={() => toast.success(`${label} updated locally.`)} className="flex w-full items-center justify-between rounded-card border border-border-subtle bg-surface px-4 py-3 text-left text-sm font-semibold text-primary hover:bg-white"><span>{label}</span><Settings2 size={16} /></button>)}</div>;
}

function GlobalTaskModelLink() {
  const navigate = useNavigate();
  return <div className="rounded-card border border-border-subtle bg-surface p-4"><h3 className="text-sm font-bold text-primary">Global task model customisation</h3><p className="mt-2 text-sm leading-6 text-text-secondary">Admin can configure task types, required fields, statuses, priorities, evidence rules, SLA rules, closure quality, review rules, and AI recommendations.</p><button onClick={() => navigate('/admin/task-model')} className="mt-4 rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Open Task Model Configuration</button></div>;
}

function TasksTable({ route, tasks, columns, onOpen, onAction }: { route: TaskRoute; tasks: DqTask[]; columns: Record<string, boolean>; onOpen: (task: DqTask) => void; onAction: (task: DqTask) => void }) {
  const visibleColumns = routeMeta[route].columns.filter((column) => columns[column] !== false);
  return (
    <div className="overflow-x-auto rounded-card border border-border-subtle">
      <table className="min-w-[980px] w-full text-left">
        <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-text-muted"><tr>{visibleColumns.map((column) => <th key={column} className="px-4 py-3">{column}</th>)}</tr></thead>
        <tbody className="divide-y divide-border-subtle bg-white">{tasks.map((task) => <tr key={task.taskId} onClick={() => onOpen(task)} className="cursor-pointer hover:bg-surface">{visibleColumns.map((column) => <td key={column} className="px-4 py-3">{taskCell(column, task, onAction)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function taskCell(column: string, task: DqTask, onAction: (task: DqTask) => void) {
  if (column === 'Task ID') return <span className="font-mono text-xs font-bold text-primary">{task.taskId}</span>;
  if (column === 'Title') return <div><div className="max-w-[260px] truncate text-sm font-bold text-primary">{task.title}</div><div className="text-xs text-text-muted">{task.taskType}</div></div>;
  if (column === 'Context Summary') return <span className="line-clamp-2 max-w-[280px] text-sm text-text-secondary">{task.context}</span>;
  if (column === 'Status' || column === 'Priority' || column === 'Evidence' || column === 'Review Status') return <StatusPill status={column === 'Evidence' ? task.evidenceStatus : column === 'Priority' ? task.priority : column === 'Review Status' ? task.reviewStatus : task.status} />;
  if (column === 'Due Date' || column === 'Closed Date' || column === 'Date') return <span className="text-sm text-text-secondary">{column === 'Closed Date' ? task.closedDate : task.dueDate}</span>;
  if (column === 'Owner' || column === 'Uploaded By' || column === 'Blocker Owner') return <span className="text-sm font-semibold text-primary">{column === 'Blocker Owner' ? task.blockerOwner : task.owner}</span>;
  if (column === 'Blocker Reason') return <span className="line-clamp-2 text-sm text-text-secondary">{task.blockerReason}</span>;
  if (column === 'Impact') return <span className="text-sm text-text-secondary">{task.impact}</span>;
  if (column === 'Escalation Status') return <StatusPill status={task.escalationStatus === 'N/A' ? 'Not Started' : task.escalationStatus} />;
  if (column === 'Closure Score') return <span className="text-sm font-bold text-primary">{task.closureScore}%</span>;
  if (column === 'Missing Items') return <span className="text-sm text-text-secondary">{task.missingItems.length ? task.missingItems.join(', ') : 'None'}</span>;
  if (column === 'Evidence ID') return <span className="font-mono text-xs font-bold text-primary">{task.evidenceItems[0]?.split(' ')[0] || `EV-${task.taskId.slice(-3)}`}</span>;
  if (column === 'Task') return <span className="max-w-[240px] truncate text-sm font-bold text-primary">{task.title}</span>;
  if (column === 'Evidence Type') return <span className="text-sm text-text-secondary">{task.evidenceStatus === 'Missing' ? 'Missing Evidence' : 'Completion Note'}</span>;
  if (column === 'Linked Work') return <span className="text-sm text-text-secondary">{task.linkedTracker}</span>;
  if (column === 'Action') return <button onClick={(event) => { event.stopPropagation(); onAction(task); }} aria-label={`Update ${task.title}`} className="rounded-full p-1.5 text-text-muted hover:bg-surface hover:text-primary"><MoreVertical size={17} /></button>;
  return <span className="text-sm text-text-secondary">{task.title}</span>;
}

function TemplatesView({ role, onUse, onPreview }: { role: WorkspaceRole; onUse: (template: TaskTemplate) => void; onPreview: (template: TaskTemplate) => void }) {
  const canEdit = ['Scrum Master', 'Team / Squad Lead', 'Unit Lead', 'HRA', 'Support', 'Admin'].includes(role);
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {templates.map((template) => (
        <section key={template.id} className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">{template.id} · {template.ownerRole}</div><h3 className="mt-1 text-lg font-bold text-primary">{template.name}</h3></div>
            <StatusPill status={template.defaultSla} />
          </div>
          <p className="mt-3 text-sm leading-6 text-text-secondary">{template.contextPattern}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <InfoTile label="Purpose" value={template.purpose} />
            <InfoTile label="Evidence Rules" value={template.evidenceRules} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => onPreview(template)} className="inline-flex items-center gap-2 rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface"><Eye size={14} />Preview Template</button>
            <button onClick={() => onUse(template)} className="inline-flex items-center gap-2 rounded-button bg-primary px-3 py-2 text-xs font-bold text-white"><Plus size={14} />Use Template</button>
            {canEdit && <button onClick={() => toast.success('Template duplicated locally.')} className="inline-flex items-center gap-2 rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface"><Copy size={14} />Duplicate</button>}
            {canEdit && <button onClick={() => toast.info(role === 'Admin' ? 'Template configuration opened.' : 'Scoped template configuration opened.')} className="inline-flex items-center gap-2 rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface"><Settings2 size={14} />Configure</button>}
          </div>
        </section>
      ))}
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-card border border-border-subtle bg-surface p-3"><div className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</div><div className="mt-1 text-sm leading-5 text-text-secondary">{value}</div></div>;
}

function TemplateDrawer({ template, onClose, onUse }: { template: TaskTemplate | null; onClose: () => void; onUse: (template: TaskTemplate) => void }) {
  if (!template) return null;
  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[200] h-screen w-full max-w-lg overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5"><div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">{template.id}</div><h2 className="mt-1 text-xl font-bold text-primary">{template.name}</h2></div><button onClick={onClose} aria-label="Close template drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={20} /></button></div>
        <div className="space-y-5 p-6">
          <InfoTile label="Context Pattern" value={template.contextPattern} />
          <InfoTile label="Purpose" value={template.purpose} />
          <DrawerSection title="Default Fields"><ChipList values={template.defaultFields} /></DrawerSection>
          <DrawerSection title="Checklist"><ChipList values={template.checklist} /></DrawerSection>
          <DrawerSection title="Closure Criteria"><ChipList values={template.closureCriteria} /></DrawerSection>
          <InfoTile label="Evidence Rules" value={template.evidenceRules} />
          <button onClick={() => onUse(template)} className="w-full rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Use Template</button>
        </div>
      </aside>
    </>
  );
}

function CreateTaskForm({ seed, onCreate }: { seed?: Partial<DqTask>; onCreate: (task: DqTask) => void }) {
  const { activeRole, activeSegment } = useWorkspaceRole();
  const [values, setValues] = useState<Record<string, string>>({
    'Task Title': seed?.title || '',
    Context: seed?.context || '',
    Purpose: seed?.purpose || '',
    'Expected Output': seed?.expectedOutput || '',
    'Task Type': seed?.taskType || 'Execution',
    Owner: seed?.owner || activeSegment.profileName,
    Contributors: seed?.contributors?.join(', ') || '',
    Priority: seed?.priority || 'Medium',
    'Due Date / SLA': seed?.dueDate || '',
    'Linked Request': seed?.linkedRequest || '',
    'Linked Tracker': seed?.linkedTracker || '',
    'Linked Governance Item': seed?.linkedGovernanceItem || '',
    'Linked Knowledge': seed?.linkedKnowledge || '',
    'Checklist Items': seed?.checklist?.map((item) => item.label).join('; ') || '',
    'Evidence Required': seed?.evidenceRequired ? 'Yes' : 'Yes',
    'Evidence Description': seed?.evidenceDescription || '',
    'Review Required': 'Yes',
    'Closure Criteria': seed?.closureCriteria?.join('; ') || '',
    Notes: ''
  });
  const required = ['Task Title', 'Context', 'Purpose', 'Expected Output', 'Owner', 'Priority', 'Due Date / SLA', 'Closure Criteria'];
  const canSubmit = required.every((field) => values[field]?.trim());
  const fields = ['Task Title', 'Context', 'Purpose', 'Expected Output', 'Task Type', 'Owner', 'Contributors', 'Priority', 'Due Date / SLA', 'Linked Request', 'Linked Tracker', 'Linked Governance Item', 'Linked Knowledge', 'Checklist Items', 'Evidence Required', 'Evidence Description', 'Review Required', 'Closure Criteria', 'Notes'];
  return (
    <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className={['Context', 'Purpose', 'Expected Output', 'Checklist Items', 'Evidence Description', 'Closure Criteria', 'Notes'].includes(field) ? 'md:col-span-2' : ''}>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{field}{required.includes(field) ? ' *' : ''}</span>
            {field === 'Evidence Required' || field === 'Review Required' ? (
              <select value={values[field]} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong"><option>Yes</option><option>No</option></select>
            ) : (
              <input value={values[field] || ''} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" />
            )}
          </label>
        ))}
      </div>
      <button
        disabled={!canSubmit}
        onClick={() => {
          const task = taskFromValues(values, activeRole, activeSegment.profileName);
          onCreate(task);
          toast.success('Task created successfully.');
        }}
        className="mt-6 rounded-button bg-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
        Submit Task
      </button>
    </section>
  );
}

function taskFromValues(values: Record<string, string>, role: WorkspaceRole, profileName: string): DqTask {
  return {
    taskId: `TSK-${Date.now().toString().slice(-4)}`,
    title: values['Task Title'],
    context: values.Context,
    triggerSource: values['Linked Request'] || 'Structured task form',
    relatedBusinessSituation: values['Linked Tracker'] || 'DWS workspace execution',
    purpose: values.Purpose,
    expectedOutput: values['Expected Output'],
    owner: values.Owner,
    contributors: values.Contributors ? values.Contributors.split(',').map((item) => item.trim()) : [profileName],
    reviewer: profileName,
    accountableLead: profileName,
    taskType: values['Task Type'],
    priority: values.Priority as TaskPriority,
    status: 'Not Started',
    progress: 0,
    dueDate: values['Due Date / SLA'],
    sla: values['Due Date / SLA'],
    reminderPreference: 'Two days before due date',
    linkedRequest: values['Linked Request'] || 'N/A',
    linkedTracker: values['Linked Tracker'] || 'N/A',
    linkedGovernanceItem: values['Linked Governance Item'] || 'N/A',
    linkedKnowledge: values['Linked Knowledge'] || 'DWS Task Standards',
    linkedWorkingSession: 'N/A',
    checklist: values['Checklist Items'].split(';').filter(Boolean).map((label) => ({ label: label.trim(), done: false })),
    blockerState: 'No active blocker',
    blockerReason: 'No blocker currently recorded.',
    blockerOwner: 'N/A',
    raisedBy: 'N/A',
    raisedDate: 'N/A',
    impact: 'Low',
    escalationStatus: 'N/A',
    evidenceRequired: values['Evidence Required'] === 'Yes',
    evidenceStatus: values['Evidence Required'] === 'Yes' ? 'Required' : 'Not Required',
    evidenceDescription: values['Evidence Description'],
    evidenceItems: [],
    closureCriteria: values['Closure Criteria'].split(';').filter(Boolean).map((item) => item.trim()),
    outcomeStatement: '',
    reviewRequired: values['Review Required'] === 'Yes',
    comments: [values.Notes || 'Task created from structured task form.'],
    activityHistory: ['Task created locally in DWS prototype.', `Created for ${role}.`],
    aiRecommendedNextAction: 'Confirm owner, complete checklist, and attach evidence before requesting review.',
    createdBy: profileName,
    team: role,
    closureScore: 25,
    closedDate: 'Open',
    reviewStatus: 'Not Started',
    missingItems: ['Evidence', 'Checklist completion', 'Review decision']
  };
}

function TasksPageShell({ route }: { route: TaskRoute }) {
  const { mode } = useViewingMode();
  const { activeRole, activeSegment } = useWorkspaceRole();
  const [tasks, setTasks] = useState<DqTask[]>(() => buildTasks(activeRole, mode));
  const [activeTab, setActiveTab] = useState(routeMeta[route].tabs[0]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [drawerTask, setDrawerTask] = useState<DqTask | null>(null);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [configureOpen, setConfigureOpen] = useState(false);
  const [templateDrawer, setTemplateDrawer] = useState<TaskTemplate | null>(null);
  const [createSeed, setCreateSeed] = useState<Partial<DqTask> | undefined>(undefined);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const meta = routeMeta[route];
  const [config, setConfig] = useState<TaskViewConfig>(() => ({ defaultTab: meta.tabs[0], sortBy: 'Due Date', groupBy: 'Status', savedFilter: '', notifications: true, favouriteView: `${meta.title} focus`, columns: Object.fromEntries(meta.columns.map((column) => [column, true])) }));

  React.useEffect(() => {
    setTasks(buildTasks(activeRole, mode));
    setActiveTab(routeMeta[route].tabs[0]);
  }, [activeRole, mode, route]);

  const filters = useMemo(() => ['All', ...Array.from(new Set(tasks.flatMap((task) => [task.status, task.priority, task.evidenceStatus, task.taskType]))).slice(0, 8)], [tasks]);
  const visibleTasks = tasks.filter((task) => {
    const text = `${task.taskId} ${task.title} ${task.context} ${task.owner} ${task.status} ${task.priority} ${task.evidenceStatus}`.toLowerCase();
    const matchesSearch = text.includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || [task.status, task.priority, task.evidenceStatus, task.taskType].includes(filter);
    return matchesSearch && matchesFilter && matchesTab(route, activeTab, task, activeSegment.profileName);
  });

  const updateTask = (next: DqTask) => {
    setTasks((current) => current.map((task) => task.taskId === next.taskId ? next : task));
    setDrawerTask(next);
  };

  if (route === 'create') {
    return <CreateTaskPage seed={createSeed} onCreate={(task) => { setTasks((current) => [task, ...current]); setDrawerTask(task); }} />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{activeSegment.subtitle} · {mode === 'first-time' ? 'New Joiner' : 'Returning User'}</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary">{meta.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{meta.purpose}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {['my-tasks', 'all', 'blocked', 'closure-quality', 'evidence'].includes(route) && <button onClick={() => setConfigureOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-button border border-border-default bg-white px-4 text-sm font-bold text-primary shadow-sm hover:bg-surface"><Settings2 size={16} />Configure My Task View</button>}
          <button onClick={() => primaryAction(route, setModalTitle)} className="inline-flex h-10 items-center gap-2 rounded-button bg-primary px-4 text-sm font-bold text-white shadow-sm">{primaryIcon(route)}{meta.primary}</button>
        </div>
      </header>

      {route !== 'templates' && <KpiStrip items={kpisFor(route, tasks)} onApply={(label) => setFilter(label.includes('Blocked') ? 'Blocked' : label.includes('Evidence') ? 'Missing' : 'All')} />}

      <section className="mt-5 rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-64 flex-1 items-center gap-2 rounded-input border border-border-default bg-white px-3 py-2 text-sm text-text-muted"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${meta.title.toLowerCase()}`} className="w-full bg-transparent outline-none" /></div>
          <div className="flex flex-wrap gap-2">{filters.map((name) => <button key={name} onClick={() => setFilter(name)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filter === name ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{name}</button>)}</div>
        </div>
        <div className="mb-5 flex flex-wrap gap-3 border-b border-border-subtle">{meta.tabs.map((name) => <button key={name} onClick={() => setActiveTab(name)} className={`px-3 py-3 text-sm font-bold ${activeTab === name ? 'border-b-2 border-info text-info-text' : 'text-text-secondary hover:text-primary'}`}>{name}</button>)}</div>
        {route === 'templates'
          ? <TemplatesView role={activeRole} onPreview={setTemplateDrawer} onUse={(template) => { setCreateSeed(seedFromTemplate(template)); setModalTitle('Use Template'); toast.success('Template loaded into local task draft.'); }} />
          : <TasksTable route={route} tasks={visibleTasks} columns={config.columns} onOpen={setDrawerTask} onAction={(task) => { setDrawerTask(task); setModalTitle(actionTitle(route)); }} />}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">AI Task Assistant</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {aiActions().map(({ label, icon: Icon }) => <button key={label} onClick={() => setAiResponse(mockAiResponse(label, visibleTasks[0]))} className="rounded-card border border-border-subtle bg-surface p-4 text-left text-sm font-semibold text-primary hover:bg-navy-50"><Icon size={16} className="mb-2 text-info" />{label}</button>)}
          </div>
          {aiResponse && <div className="mt-4 rounded-card border border-border-subtle bg-surface p-4 text-sm leading-6 text-text-secondary">{aiResponse}</div>}
        </div>
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Task Standards</h2>
          <div className="mt-4 space-y-3">{['Context mandatory', 'Expected output defined', 'Owner accountable', 'Evidence reviewable', 'Closure criteria measurable'].map((item) => <div key={item} className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2 text-sm font-semibold text-primary"><CheckCircle2 size={16} className="text-success" />{item}</div>)}</div>
        </div>
      </section>

      <TaskDetailDrawer task={drawerTask} route={route} onClose={() => setDrawerTask(null)} onUpdate={updateTask} onModal={setModalTitle} />
      <TemplateDrawer template={templateDrawer} onClose={() => setTemplateDrawer(null)} onUse={(template) => { setCreateSeed(seedFromTemplate(template)); setTemplateDrawer(null); toast.success('Template loaded into local task draft.'); }} />
      {configureOpen && <ConfigureTaskViewDrawer route={route} config={config} role={activeRole} onClose={() => setConfigureOpen(false)} onSave={(next) => { setConfig(next); setActiveTab(next.defaultTab); setConfigureOpen(false); toast.success('Task view updated.'); }} />}
      {modalTitle && modalTitle !== 'Use Template' && <ActionModal title={modalTitle} onClose={() => setModalTitle(null)} onSave={() => { if (drawerTask) updateTask(applyAction(drawerTask, modalTitle)); toast.success(`${modalTitle} saved.`); setModalTitle(null); }} />}
      {modalTitle === 'Use Template' && <div className="mt-5"><CreateTaskForm seed={createSeed} onCreate={(task) => { setTasks((current) => [task, ...current]); setDrawerTask(task); setModalTitle(null); }} /></div>}
    </div>
  );
}

function primaryIcon(route: TaskRoute) {
  const Icon = route === 'evidence' ? UploadCloud : route === 'templates' ? Copy : route === 'review' ? ClipboardCheck : route === 'closure-quality' ? FileCheck2 : route === 'all' ? Download : Plus;
  return <Icon size={16} />;
}

function primaryAction(route: TaskRoute, setModalTitle: (title: string) => void) {
  if (route === 'all') setModalTitle('Export Tasks');
  else if (route === 'templates') setModalTitle('Create Template');
  else if (route === 'review') setModalTitle('Export Review Queue');
  else if (route === 'blocked') setModalTitle('Escalate');
  else if (route === 'closure-quality') setModalTitle('Generate Closure Summary');
  else if (route === 'evidence') setModalTitle('Upload Evidence');
  else setModalTitle('Create Task');
}

function actionTitle(route: TaskRoute) {
  if (route === 'blocked') return 'Resolve Blocker';
  if (route === 'closure-quality') return 'Add Closure Note';
  if (route === 'evidence') return 'Upload Evidence';
  if (route === 'review') return 'Add Review Comment';
  return 'Update Status';
}

function seedFromTemplate(template: TaskTemplate): Partial<DqTask> {
  return {
    title: template.name.replace(' Task', ''),
    context: template.contextPattern,
    purpose: template.purpose,
    expectedOutput: `Completed output for ${template.name}.`,
    taskType: template.ownerRole,
    dueDate: template.defaultSla,
    evidenceRequired: template.evidenceRules.toLowerCase().includes('required'),
    evidenceDescription: template.evidenceRules,
    checklist: template.checklist.map((label) => ({ label, done: false })),
    closureCriteria: template.closureCriteria,
    linkedKnowledge: 'DWS Task Standards'
  };
}

function applyAction(task: DqTask, action: string): DqTask {
  if (action.includes('Evidence')) {
    return {
      ...task,
      evidenceStatus: 'Uploaded',
      evidenceItems: [...task.evidenceItems, `EV-${Date.now().toString().slice(-3)} uploaded proof`],
      activityHistory: [`${action} completed; evidence record added.`, ...task.activityHistory]
    };
  }
  if (action.includes('Blocker')) {
    return {
      ...task,
      status: 'Blocked',
      blockerState: 'Active blocker',
      blockerReason: 'Blocker update added from task action.',
      escalationStatus: 'Escalation pending',
      activityHistory: [`${action} recorded as an active blocker.`, ...task.activityHistory]
    };
  }
  if (action.includes('Approve')) {
    return {
      ...task,
      status: 'Closed',
      reviewStatus: 'Approved',
      evidenceStatus: 'Approved',
      activityHistory: [`${action} completed and task review approved.`, ...task.activityHistory]
    };
  }
  if (action.includes('Return')) {
    return {
      ...task,
      status: 'Returned',
      reviewStatus: 'Returned',
      activityHistory: [`${action} completed; task returned for correction.`, ...task.activityHistory]
    };
  }
  return {
    ...task,
    status: task.status === 'Completed' ? 'Closed' : 'In Progress',
    comments: [...task.comments, `${action} completed locally.`],
    activityHistory: [`${action} completed from task action modal.`, ...task.activityHistory]
  };
}

function matchesTab(route: TaskRoute, tab: string, task: DqTask, profileName: string) {
  if (tab === 'All' || tab === 'Structured Task') return true;
  if (route === 'my-tasks') {
    if (tab === 'Assigned to Me') return task.owner === profileName || task.owner !== 'N/A';
    if (tab === 'Created by Me') return task.createdBy === profileName;
    if (tab === 'Due Today') return task.dueDate === 'Today';
    if (tab === 'Overdue') return task.priority === 'Critical';
    if (tab === 'Blocked') return task.status === 'Blocked';
    if (tab === 'Awaiting Review') return task.status === 'Awaiting Review';
    if (tab === 'Completed') return ['Completed', 'Closed'].includes(task.status);
  }
  if (route === 'all') {
    if (tab === 'At Risk') return task.priority === 'Critical' || task.status === 'Blocked';
    if (tab === 'Recently Updated') return true;
    return true;
  }
  if (route === 'review') {
    if (tab === 'Needs Evidence') return ['Missing', 'Returned', 'Required'].includes(task.evidenceStatus);
    if (tab === 'Closure Review') return task.reviewStatus === 'Closure Review' || task.status === 'Completed';
    if (tab === 'Pending Review') return task.status === 'Awaiting Review';
    if (tab === 'Approved') return task.reviewStatus === 'Approved' || task.evidenceStatus === 'Approved';
    if (tab === 'Returned') return task.status === 'Returned' || task.reviewStatus === 'Returned';
  }
  if (route === 'blocked') {
    if (tab === 'All Blocked') return task.status === 'Blocked';
    if (tab === 'My Blocked Tasks') return task.status === 'Blocked';
    if (tab === 'Team Blockers') return task.status === 'Blocked';
    if (tab === 'SLA Risk') return task.priority === 'Critical';
    if (tab === 'Escalated') return task.escalationStatus !== 'N/A';
  }
  if (route === 'closure-quality') {
    if (tab === 'Missing Evidence') return task.evidenceStatus === 'Missing';
    if (tab === 'Returned') return task.reviewStatus === 'Returned';
    if (tab === 'Approved') return task.reviewStatus === 'Approved';
    if (tab === 'Closed Properly') return task.closureScore >= 85;
  }
  if (route === 'evidence') {
    if (tab === 'Missing Evidence') return task.evidenceStatus === 'Missing';
    if (tab === 'Uploaded Files') return task.evidenceStatus === 'Uploaded';
    if (tab === 'Linked Documents') return task.evidenceItems.length > 0;
    if (tab === 'Approval Notes') return task.evidenceStatus === 'Approved';
    if (tab === 'Completion Notes') return task.status === 'Completed' || task.status === 'Closed';
  }
  return true;
}

function aiActions(): { label: string; icon: LucideIcon }[] {
  return [
    { label: 'Summarise this task', icon: FileText },
    { label: 'Explain why this task is blocked', icon: ShieldCheck },
    { label: 'Generate task update', icon: MessageSquare },
    { label: 'Suggest next action', icon: Bot },
    { label: 'Prepare closure summary', icon: ClipboardCheck },
    { label: 'Check missing evidence', icon: UploadCloud },
    { label: 'Recommend reviewer', icon: CheckCircle2 },
    { label: 'Identify overdue risk', icon: Filter }
  ];
}

function mockAiResponse(action: string, task?: DqTask) {
  const name = task?.title || 'the selected task';
  if (action.includes('blocked')) return `${name} is blocked because the blocker owner or linked evidence has not been confirmed. Recommended action: assign the blocker owner and set an escalation deadline.`;
  if (action.includes('evidence')) return `${name} needs reviewable proof of work before closure. Check uploaded files, linked tracker updates, approval notes, and completion notes.`;
  if (action.includes('closure')) return `${name} can be closed only when context, expected output, checklist, evidence, blockers, linked tracker update, and review decision are complete.`;
  return `${action}: ${name} should be updated with current status, accountable owner, expected output, evidence state, and next action.`;
}

function CreateTaskPage({ seed, onCreate }: { seed?: Partial<DqTask>; onCreate: (task: DqTask) => void }) {
  const { activeRole, activeSegment } = useWorkspaceRole();
  const { mode } = useViewingMode();
  const [createdTask, setCreatedTask] = useState<DqTask | null>(null);
  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <header className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{activeSegment.subtitle} · {mode === 'first-time' ? 'New Joiner' : 'Returning User'}</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary">Create Task</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{routeMeta.create.purpose}</p>
      </header>
      <CreateTaskForm seed={seed} onCreate={(task) => { setCreatedTask(task); onCreate(task); }} />
      <TaskDetailDrawer task={createdTask} route="create" onClose={() => setCreatedTask(null)} onUpdate={setCreatedTask} onModal={(title) => toast.info(`${title} opened for ${activeRole}.`)} />
    </div>
  );
}

export function TasksMyTasksPage() { return <TasksPageShell route="my-tasks" />; }
export function TasksAllPage() { return <TasksPageShell route="all" />; }
export function TasksCreatePage() { return <TasksPageShell route="create" />; }
export function TasksTemplatesPage() { return <TasksPageShell route="templates" />; }
export function TasksReviewPage() { return <TasksPageShell route="review" />; }
export function TasksBlockedPage() { return <TasksPageShell route="blocked" />; }
export function TasksClosureQualityPage() { return <TasksPageShell route="closure-quality" />; }
export function TasksEvidencePage() { return <TasksPageShell route="evidence" />; }
