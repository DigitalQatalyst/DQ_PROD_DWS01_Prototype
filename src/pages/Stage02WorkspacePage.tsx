import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  CloudUpload,
  FilePlus2,
  FileText,
  HelpCircle,
  LayoutList,
  MoreVertical,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
  type LucideIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useViewingMode } from '../context/ViewingModeContext';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import {
  getStage02Dataset,
  type ActivityItem,
  type KpiItem,
  type WorkItem
} from '../mocks/stage02.mock';
import { StatusPill } from '../components/StatusPill';
import type { WorkspaceRole } from '../config/segments';

type DetailRecord = WorkItem | ActivityItem | null;
type ModalType = 'Create Task' | 'Submit Request' | 'New Tracker Item' | 'Upload Document' | 'Add Knowledge' | 'Schedule Working Session' | null;
type QuickActionType = Exclude<ModalType, null>;

const previewTabs = ['All', 'Tasks', 'Requests', 'Approvals', 'Blockers', 'Updates'] as const;
type PreviewTab = typeof previewTabs[number];

const quickActionIcons: Record<string, LucideIcon> = {
  'Create Task': CheckSquare,
  'Submit Request': FilePlus2,
  'New Tracker Item': LayoutList,
  'Upload Document': CloudUpload,
  'Add Knowledge': BookOpen,
  'Schedule Working Session': CalendarDays
};

const toneDot = {
  success: 'bg-success',
  info: 'bg-info',
  warning: 'bg-warning',
  danger: 'bg-danger',
  neutral: 'bg-primary'
};

const kpiRoutes: Record<string, string> = {
  'My Tasks': '/workspace/my-tasks',
  'Assigned work': '/workspace',
  'Pending Actions': '/workspace',
  'Blocked Items': '/tasks/blocked',
  'My Requests': '/workspace/my-requests',
  Activity: '/workspace/activity',
  'Configuration work': '/workspace',
  'Support requests': '/workspace/my-requests',
  'Workflow rule reviews': '/admin/workflow-approval-rules',
  'Audit items': '/admin/audit-logs',
  'Platform activity': '/workspace/activity',
  'SLA At Risk': '/reports/sla-dashboard',
  'Onboarding Tasks': '/workspace/my-tasks',
  'Access Requests': '/workspace/my-requests',
  'Learning Progress': '/performance/learning-progress',
  'First Sessions': '/workspace/working-sessions',
  'Profile Readiness': '/performance/overview'
};

const roleFocus: Record<WorkspaceRole, string> = {
  Associate: 'Personal work, learning, requests, and assigned follow-ups',
  'Scrum Master': 'Blockers, task hygiene, flow health, and closure quality',
  'Team / Squad Lead': 'Team workload, approvals, blockers, and team performance',
  'Unit Lead': 'Unit health, SLA, risks, governance, and outcome progress',
  HRA: 'Onboarding, role-transition, HRA requests, and workforce readiness',
  Support: 'Support queue, fulfilment items, SLA risks, and escalations',
  Admin: 'Platform health, role/config tasks, audit items, workflow rules, and trackers',
  CEO: 'Executive execution, governance health, strategic initiatives, and SLA exposure'
};

function workspaceKpis(mode: string, role: WorkspaceRole): KpiItem[] {
  if (mode === 'first-time') {
    return [
      { label: 'Onboarding Tasks', value: role === 'HRA' ? '14' : '6', subtitle: '2 due this week', tone: 'warning', route: '/workspace/my-tasks' },
      { label: 'Access Requests', value: '3', subtitle: '1 awaiting approval', tone: 'info', route: '/workspace/my-requests' },
      { label: 'Learning Progress', value: '42%', subtitle: '3 modules remaining', tone: 'warning', route: '/performance/learning-progress' },
      { label: 'First Sessions', value: '2', subtitle: '1 scheduled this week', tone: 'info', route: '/workspace/working-sessions' },
      { label: 'Profile Readiness', value: '68%', subtitle: 'preferences incomplete', tone: 'success', route: '/performance/overview' }
    ];
  }
  if (role === 'Admin') {
    return [
      { label: 'Configuration work', value: '18', subtitle: '5 overdue', tone: 'danger', route: '/workspace' },
      { label: 'Support requests', value: '7', subtitle: '2 awaiting update', tone: 'info', route: '/workspace/my-requests' },
      { label: 'Workflow rule reviews', value: '6', subtitle: '3 pending approval', tone: 'warning', route: '/admin/workflow-approval-rules' },
      { label: 'Audit items', value: '5', subtitle: '2 need review', tone: 'danger', route: '/admin/audit-logs' },
      { label: 'Platform activity', value: '9', subtitle: '4 unread', tone: 'info', route: '/workspace/activity' }
    ];
  }
  const roleShift = role === 'CEO' || role === 'Unit Lead' ? ['24', '11', '7', '9', '6'] : role === 'Support' ? ['15', '8', '6', '18', '9'] : ['12', '6', '4', '5', '3'];
  if (role === 'HRA') {
    return [
      { label: 'HRA requests', value: '11', subtitle: '4 awaiting confirmation', tone: 'warning', route: '/workspace/my-requests' },
      { label: 'Onboarding items', value: '9', subtitle: '3 due this week', tone: 'info', route: '/workspace' },
      { label: 'Role transitions', value: '5', subtitle: '2 need evidence', tone: 'warning', route: '/workspace' },
      { label: 'Pending Actions', value: '6', subtitle: 'Confirm owner updates', tone: 'danger', route: '/workspace' },
      { label: 'Activity', value: '8', subtitle: '3 unread', tone: 'info', route: '/workspace/activity' }
    ];
  }
  if (role === 'Support') {
    return [
      { label: 'Support requests', value: roleShift[3], subtitle: 'Queue-linked items', tone: 'warning', route: '/workspace/my-requests' },
      { label: 'SLA At Risk', value: roleShift[4], subtitle: 'Escalation exposure', tone: 'danger', route: '/reports/sla-dashboard' },
      { label: 'Escalations', value: roleShift[2], subtitle: 'Needs triage', tone: 'danger', route: '/workflows/escalations' },
      { label: 'Pending Actions', value: roleShift[1], subtitle: 'Fulfilment updates', tone: 'warning', route: '/workspace' },
      { label: 'Activity', value: '10', subtitle: '5 unread', tone: 'info', route: '/workspace/activity' }
    ];
  }
  if (role === 'CEO') {
    return [
      { label: 'Executive actions', value: '7', subtitle: roleFocus[role], tone: 'warning', route: '/workspace' },
      { label: 'Strategic updates', value: '12', subtitle: 'Portfolio signals', tone: 'info', route: '/trackers/strategic-initiatives' },
      { label: 'Governance alerts', value: '4', subtitle: 'Requires review', tone: 'danger', route: '/governance/dashboard' },
      { label: 'SLA At Risk', value: '6', subtitle: 'Enterprise exposure', tone: 'danger', route: '/reports/sla-dashboard' },
      { label: 'Activity', value: '9', subtitle: 'Key alerts', tone: 'info', route: '/workspace/activity' }
    ];
  }
  return [
    { label: 'Assigned work', value: roleShift[0], subtitle: roleFocus[role], tone: 'danger', route: '/workspace' },
    { label: 'My Requests', value: roleShift[3], subtitle: 'Open service requests', tone: 'info', route: '/workspace/my-requests' },
    { label: 'Pending Actions', value: roleShift[1], subtitle: 'Needs review or input', tone: 'warning', route: '/workspace' },
    { label: 'Blocked Items', value: roleShift[2], subtitle: 'Blockers requiring action', tone: 'danger', route: '/tasks/blocked' },
    { label: 'Activity', value: roleShift[4], subtitle: 'Unread workspace alerts', tone: 'info', route: '/workspace/activity' }
  ];
}

function sparklineTone(tone: KpiItem['tone']) {
  if (tone === 'danger') return 'bg-danger';
  if (tone === 'warning') return 'bg-warning';
  if (tone === 'success') return 'bg-success';
  if (tone === 'info') return 'bg-info';
  return 'bg-primary';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
}

function KpiCard({ kpi, onClick }: { kpi: KpiItem; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition hover:border-border-default hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="text-sm font-bold text-primary">{kpi.label}</div>
        <div className="rounded-lg bg-surface p-2 text-primary">
          {kpi.label.includes('Session') ? <CalendarDays size={18} /> : kpi.label.includes('Performance') ? <BarChart3 size={18} /> : kpi.label.includes('Governance') || kpi.label.includes('Audit') ? <ShieldCheck size={18} /> : <CheckSquare size={18} />}
        </div>
      </div>
      <div className="text-3xl font-bold text-primary">{kpi.value}</div>
      <div className="mt-3 flex items-start gap-2 text-xs font-medium text-text-muted">
        <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${toneDot[kpi.tone]}`} />
        <span className="leading-5">{kpi.subtitle}</span>
      </div>
      <div className="mt-5 flex h-5 items-end gap-1" aria-hidden="true">
        {[35, 52, 42, 70, 48, 58, 46].map((height, index) => (
          <span key={index} className={`w-full rounded-t ${sparklineTone(kpi.tone)} opacity-80`} style={{ height: `${height}%` }} />
        ))}
      </div>
    </button>
  );
}

function WorkRows({
  rows,
  onOpen,
  onAction
}: {
  rows: WorkItem[];
  onOpen: (item: WorkItem) => void;
  onAction: (item: WorkItem) => void;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-border-subtle">
      <table className="w-full table-fixed text-left">
        <thead className="bg-surface text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <tr>
            <th className="w-[10%] px-3 py-3">Type</th>
            <th className="w-[25%] px-3 py-3">Title</th>
            <th className="w-[14%] px-3 py-3">Status</th>
            <th className="w-[13%] px-3 py-3">Due Date</th>
            <th className="w-[12%] px-3 py-3">Priority</th>
            <th className="w-[8%] px-3 py-3">Owner</th>
            <th className="w-[11%] px-3 py-3">Source</th>
            <th className="w-[7%] px-3 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {rows.map((row) => (
            <tr key={row.id} onClick={() => onOpen(row)} className="cursor-pointer transition hover:bg-surface">
              <td className="px-3 py-3 text-sm text-text-secondary">{row.type}</td>
              <td className="px-3 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-primary">{row.title}</div>
                  {row.subtitle && <div className="mt-0.5 truncate text-xs text-text-muted">{row.subtitle}</div>}
                </div>
              </td>
              <td className="px-3 py-3"><StatusPill status={row.status} /></td>
              <td className="px-3 py-3 text-sm text-text-secondary">{row.dueDate}</td>
              <td className="px-3 py-3"><StatusPill status={row.priority} /></td>
              <td className="px-3 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-100 text-[11px] font-bold text-primary">{getInitials(row.owner)}</span>
              </td>
              <td className="truncate px-3 py-3 text-sm text-text-secondary">{row.subtitle || row.type}</td>
              <td className="px-3 py-3">
                <button aria-label={`Update ${row.title}`} onClick={(event) => { event.stopPropagation(); onAction(row); }} className="rounded-full p-1 text-text-muted hover:bg-white hover:text-primary">
                  <MoreVertical size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UtilityList({
  title,
  items,
  onOpen,
  actionLabel,
  onAction
}: {
  title: string;
  items: ActivityItem[];
  onOpen: (item: ActivityItem) => void;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        {actionLabel && <button onClick={onAction} className="text-xs font-bold text-info-text hover:underline">{actionLabel}</button>}
      </div>
      <div className="divide-y divide-border-subtle">
        {items.map((item) => (
          <button key={item.id} onClick={() => onOpen(item)} className="flex w-full items-center gap-4 py-3 text-left">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50 text-primary">
              {title.includes('Announcement') ? <FileText size={18} /> : title.includes('Getting') ? <Plus size={18} /> : <Sparkles size={18} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-primary">{item.title}</div>
              <div className="mt-1 truncate text-xs text-text-muted">{item.subtitle}</div>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </button>
        ))}
      </div>
    </section>
  );
}

function QuickActions({ actions, onOpen }: { actions: QuickActionType[]; onOpen: (action: QuickActionType) => void }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Quick Actions</h2>
        <button onClick={() => toast.info('Quick action layout preferences opened.')} className="text-xs font-semibold text-text-muted hover:text-primary">Edit</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = quickActionIcons[action] || Plus;
          return (
            <button key={action} onClick={() => onOpen(action)} className="rounded-card border border-border-subtle bg-white px-3 py-4 text-center transition hover:border-border-default hover:bg-surface">
              <Icon size={22} className="mx-auto text-primary" />
              <div className="mt-3 text-xs font-bold text-primary">{action}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CalendarCard({ items, onOpen }: { items: ActivityItem[]; onOpen: (item: ActivityItem) => void }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Upcoming</h2>
        <button onClick={() => toast.info('Workspace calendar filtered to upcoming DWS events.')} className="text-xs font-bold text-info-text hover:underline">View calendar</button>
      </div>
      <div className="divide-y divide-border-subtle overflow-hidden rounded-card border border-border-subtle">
        {items.map((item) => (
          <button key={item.id} onClick={() => onOpen(item)} className="grid w-full grid-cols-[52px_1fr_24px] items-center gap-3 px-4 py-3 text-left hover:bg-surface">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{item.dueDate.split(' ')[0] || '19'}</div>
              <div className="text-[10px] font-bold uppercase text-text-muted">{item.dueDate.split(' ')[1] || 'May'}</div>
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-primary">{item.title}</div>
              <div className="mt-0.5 truncate text-xs text-text-muted">{item.subtitle}</div>
            </div>
            <CalendarDays size={16} className="text-text-muted" />
          </button>
        ))}
      </div>
    </section>
  );
}

function activity(id: string, title: string, subtitle: string): ActivityItem {
  return {
    id,
    title,
    subtitle,
    status: 'In Progress',
    owner: 'DWS.01',
    dueDate: 'This week',
    description: `${title}. ${subtitle}`
  };
}

function DashboardCard({ title, children, action, onAction }: { title: string; children: React.ReactNode; action?: string; onAction?: () => void }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        {action && <button onClick={onAction} className="text-xs font-bold text-info-text hover:underline">{action}</button>}
      </div>
      {children}
    </section>
  );
}

function trackerOverview(role: WorkspaceRole) {
  return [
    ['Strategic Initiatives', role === 'CEO' || role === 'Unit Lead' ? '18' : '12', 'On Track'],
    ['Projects / Programs', role === 'Support' ? '16' : '28', 'At Risk'],
    ['Operational Tasks', role === 'Admin' ? '156' : '84', 'In Progress'],
    ['Governance Actions', role === 'Associate' ? '6' : '34', 'Pending']
  ];
}

function workloadRows(role: WorkspaceRole) {
  const adminRows = [
    ['Amina Hassan', '85%'],
    ['Omar Ali', '72%'],
    ['Sara Khan', '58%'],
    ['Rizwan Ahmed', '45%'],
    ['Neha Verma', '30%']
  ];
  if (role === 'Associate') return [['Amina Hassan', '64%'], ['Bilal Waqar', '40%'], ['Learning Path', '42%'], ['Access Setup', '75%']];
  return adminRows;
}

function dashboardActivity(role: WorkspaceRole): ActivityItem[] {
  const label = role === 'Admin' ? 'workflow rule' : role === 'Support' ? 'support request' : role === 'CEO' ? 'strategic initiative' : 'work item';
  return [
    activity('DA-1', `Updated ${label} record`, 'Today, 10:20 AM'),
    activity('DA-2', 'New task assigned to you', 'Today, 09:45 AM'),
    activity('DA-3', 'SLA breach resolved: Access Request', 'Yesterday, 07:30 PM'),
    activity('DA-4', 'New knowledge article published', 'Yesterday, 06:15 PM')
  ];
}

function dashboardAnnouncements(role: WorkspaceRole): ActivityItem[] {
  return [
    activity('DAN-1', role === 'CEO' ? 'Executive governance pack refreshed' : 'DWS Platform Update', 'Workflow, tracker, and AI summary improvements.'),
    activity('DAN-2', 'Governance Review Cycle — Q2', 'Review owners should complete evidence checks.'),
    activity('DAN-3', 'Learning Path: Risk Management', 'New modules available in the Learning Center.')
  ];
}

function dashboardCalendar(): ActivityItem[] {
  return [
    { ...activity('DCAL-1', 'Q2 Governance Review', '15 May 2026, 11:00 AM'), dueDate: '15 May' },
    { ...activity('DCAL-2', 'Platform Sync Meeting', '16 May 2026, 10:00 AM'), dueDate: '16 May' },
    { ...activity('DCAL-3', 'SLA Review — Weekly', '16 May 2026, 02:00 PM'), dueDate: '16 May' },
    { ...activity('DCAL-4', 'Leadership Update', '20 May 2026, 09:00 AM'), dueDate: '20 May' }
  ];
}

function DetailDrawer({ record, onClose }: { record: DetailRecord; onClose: () => void }) {
  if (!record) return null;
  const work = record as Partial<WorkItem> & ActivityItem;
  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[200] h-screen w-full max-w-md overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border-subtle bg-white px-6 py-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{work.id}</div>
            <h2 className="mt-1 text-xl font-bold text-primary">{work.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close detail drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap gap-2">
            <StatusPill status={work.status || 'In Progress'} />
            <StatusPill status={work.priority || 'Medium'} />
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">Owner</dt>
              <dd className="mt-1 font-semibold text-primary">{work.owner || 'DWS.01'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">Due date</dt>
              <dd className="mt-1 font-semibold text-primary">{work.dueDate || 'This week'}</dd>
            </div>
          </dl>
          <div>
            <h3 className="text-sm font-bold text-primary">Description</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{work.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary">Related work items</h3>
            <div className="mt-2 space-y-2">
              {(work.related || ['DWS.01 Workspace', 'Workspace Overview']).map((item) => (
                <div key={item} className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm font-medium text-text-secondary">{item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-4">
            <h3 className="text-sm font-bold text-primary">Recommended next action</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{work.nextAction || 'Open the related record and confirm the next action owner.'}</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function ActionModal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  if (!type) return null;
  const fields =
    type === 'Create Task' ? ['Title', 'Description', 'Priority', 'Due date', 'Owner', 'Linked tracker/workflow'] :
    type === 'Schedule Working Session' ? ['Title', 'Session type', 'Date/time', 'Participants', 'Purpose', 'Linked work item'] :
    type === 'Submit Request' ? ['Request type', 'Details', 'Attachments', 'Priority'] :
    type === 'New Tracker Item' ? ['Tracker', 'Item title', 'Owner', 'Status', 'Due date'] :
    type === 'Upload Document' ? ['Document type', 'Name', 'Linked work item'] :
    ['Title', 'Category', 'Summary', 'Linked task/workflow/tracker'];
  const canSubmit = fields.every((field) => values[field]?.trim());

  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/20" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[220] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">{type}</h2>
          <button onClick={onClose} aria-label="Close modal" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className={field.includes('Description') || field.includes('Details') || field.includes('Summary') || field.includes('Required') ? 'md:col-span-2' : ''}>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{field}</span>
              <input
                value={values[field] || ''}
                onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))}
                className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm text-primary outline-none focus:border-border-strong"
                placeholder={`Enter ${field.toLowerCase()}`}
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Cancel</button>
          <button
            disabled={!canSubmit}
            onClick={() => {
              toast.success(`${type} saved in prototype mode`);
              onClose();
            }}
            className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export function Stage02WorkspacePage() {
  const { mode } = useViewingMode();
  const { activeRole } = useWorkspaceRole();
  const navigate = useNavigate();
  const dataset = useMemo(() => getStage02Dataset(mode, activeRole), [mode, activeRole]);
  const [activeTab, setActiveTab] = useState<PreviewTab>('All');
  const [detail, setDetail] = useState<DetailRecord>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const dashboardKpis = useMemo(() => workspaceKpis(mode, activeRole), [mode, activeRole]);
  const allPreviewRows = useMemo(() => [
    ...dataset.tabs.Tasks,
    ...dataset.tabs.Trackers,
    ...dataset.tabs.Reviews
  ], [dataset.tabs]);
  const activeRows = allPreviewRows.filter((row) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Blockers') return ['Blocked', 'At Risk', 'Overdue'].includes(row.status);
    if (activeTab === 'Updates') return row.title.toLowerCase().includes('update') || row.status === 'Needs Update';
    if (activeTab === 'Requests') return row.type.toLowerCase().includes('approval') || row.title.toLowerCase().includes('request');
    if (activeTab === 'Approvals') return row.type.toLowerCase().includes('approval') || row.title.toLowerCase().includes('approve');
    return row.type.toLowerCase().includes(activeTab.slice(0, -1).toLowerCase());
  }).slice(0, 5);
  const aiInsights = mode === 'first-time' ? dataset.aiInsights : [
    activity('AI-DASH-1', '3 items need your update', 'Open Workspace'),
    activity('AI-DASH-2', '2 requests are close to SLA breach', 'Review requests'),
    activity('AI-DASH-3', 'You have 1 unresolved blocker', 'Review blockers'),
    activity('AI-DASH-4', 'Weekly workspace summary is ready', 'View report')
  ];
  const dashboardQuickActions: QuickActionType[] = ['Create Task', 'Submit Request', 'New Tracker Item', 'Upload Document', 'Add Knowledge', 'Schedule Working Session'];

  const handleKpi = (kpi: KpiItem) => {
    navigate(kpiRoutes[kpi.label] || kpi.route || '/workspace');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-8 py-7">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-info-text">Orientation · Measure / visibility</div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-text-secondary">
                Track performance, workload, SLA health, and operating trends across your scope.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/workspace')} className="inline-flex h-10 items-center gap-2 rounded-button border border-border-default bg-white px-4 text-sm font-semibold text-primary shadow-sm hover:bg-surface">
                <LayoutList size={16} />
                Open My Work
                <ChevronRight size={14} />
              </button>
              <button onClick={() => toast.info('Workspace dashboard customisation opened.')} className="inline-flex h-10 items-center gap-2 rounded-button border border-border-default bg-white px-4 text-sm font-semibold text-primary shadow-sm hover:bg-surface">
                <SlidersHorizontal size={16} />
                Customise
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-5">
            {dashboardKpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} onClick={() => handleKpi(kpi)} />)}
          </section>

          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-primary">Operational Overview</h2>
              <Link to="/workspace" className="inline-flex items-center gap-2 text-sm font-bold text-info-text hover:underline">
                Open My Work <ChevronRight size={16} />
              </Link>
            </div>
            <div className="mb-4 flex flex-wrap gap-6 border-b border-border-subtle">
              {previewTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-sm font-bold transition-colors ${activeTab === tab ? 'text-info-text' : 'text-text-secondary hover:text-primary'}`}>
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-info" />}
                </button>
              ))}
            </div>
            <WorkRows rows={activeRows} onOpen={setDetail} onAction={setDetail} />
          </section>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
            <DashboardCard title="Tracker Overview" action="View All" onAction={() => navigate('/trackers')}>
              <div className="space-y-3">
                {trackerOverview(activeRole).map(([label, value, status]) => (
                  <button key={label} onClick={() => navigate('/trackers')} className="grid w-full grid-cols-[1fr_42px_88px] items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-surface">
                    <span className="truncate text-sm font-semibold text-primary">{label}</span>
                    <span className="text-sm font-bold text-primary">{value}</span>
                    <StatusPill status={status} />
                  </button>
                ))}
              </div>
            </DashboardCard>
            <DashboardCard title="Team Workload" action="View All" onAction={() => navigate('/trackers/workload-distribution')}>
              <div className="space-y-3">
                {workloadRows(activeRole).map(([name, capacity]) => (
                  <button key={name} onClick={() => navigate('/trackers/workload-distribution')} className="grid w-full grid-cols-[1fr_110px_42px] items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-surface">
                    <span className="truncate text-sm font-semibold text-primary">{name}</span>
                    <span className="h-2 rounded-pill bg-navy-100"><span className="block h-full rounded-pill bg-info" style={{ width: capacity }} /></span>
                    <span className="text-xs font-bold text-primary">{capacity}</span>
                  </button>
                ))}
              </div>
            </DashboardCard>
            <UtilityList title="Recent Activity" items={dashboardActivity(activeRole)} onOpen={setDetail} actionLabel="View All" onAction={() => navigate('/reports/execution-dashboard')} />
            <UtilityList title="Announcements" items={dashboardAnnouncements(activeRole)} onOpen={setDetail} actionLabel="View All" onAction={() => navigate('/knowledge')} />
          </div>

          <footer className="flex justify-center gap-5 py-4 text-xs text-text-muted">
            <span>© 2026 DWS. All rights reserved.</span>
            <span>|</span>
            <button onClick={() => toast.info('Privacy preferences opened.')} className="hover:text-primary">Privacy</button>
            <span>|</span>
            <button onClick={() => toast.info('Workspace terms opened.')} className="hover:text-primary">Terms</button>
            <span>|</span>
            <button onClick={() => navigate('/services/platform-support')} className="hover:text-primary">Support</button>
          </footer>
        </div>

        <aside className="space-y-4">
          <QuickActions actions={dashboardQuickActions} onOpen={setModal} />
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">AI Insights <span className="ml-2 rounded-pill bg-info-surface px-2 py-0.5 text-[10px] text-info-text">BETA</span></h2>
              <Sparkles size={18} className="text-primary" />
            </div>
            <p className="mb-3 text-sm text-text-secondary">Here are the highest-signal workspace insights for {activeRole}.</p>
            <div className="divide-y divide-border-subtle rounded-card border border-border-subtle">
              {aiInsights.map((insight) => (
                <button key={insight.id} onClick={() => setDetail(insight)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-surface">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-secondary"><Sparkles size={16} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-primary">{insight.title}</div>
                    <div className="mt-0.5 truncate text-xs text-text-muted">{insight.subtitle}</div>
                  </div>
                  <ChevronRight size={15} className="text-text-muted" />
                </button>
              ))}
            </div>
            <button onClick={() => setDetail({ id: 'AI-ASK', title: 'Ask AI Assistant', subtitle: 'Workspace assistant', status: 'Ready', owner: 'DWS AI', dueDate: 'Now', description: 'Ask for a work brief, risk summary, tracker update, or governance check.', nextAction: 'Type a question in the assistant panel.' })} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-button border border-info bg-white text-sm font-bold text-info-text hover:bg-info-surface">
              <Sparkles size={16} />
              Ask AI Assistant
            </button>
          </section>
          <CalendarCard items={mode === 'first-time' ? dataset.calendar : dashboardCalendar()} onOpen={setDetail} />
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-primary"><HelpCircle size={18} /></div>
              <div>
                <h2 className="text-sm font-bold text-primary">Need support?</h2>
                <p className="mt-1 text-xs text-text-muted">Open platform help or contact workspace support.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <DetailDrawer record={detail} onClose={() => setDetail(null)} />
      <ActionModal type={modal} onClose={() => setModal(null)} />
    </div>
  );
}
