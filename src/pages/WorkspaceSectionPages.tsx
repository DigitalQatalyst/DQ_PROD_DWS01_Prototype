import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Columns3,
  FilePlus2,
  Filter,
  LayoutGrid,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Trash2,
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

type WorkspaceRoute = 'my-work' | 'my-requests' | 'working-sessions' | 'activity';
type ViewMode = 'Table' | 'Card' | 'List' | 'Calendar';

interface WorkspaceRecord {
  id: string;
  title: string;
  type: string;
  status: string;
  dueDate: string;
  priority: string;
  owner: string;
  source: string;
  category: string;
  description: string;
  nextAction: string;
  related: string[];
  lastUpdate: string;
  sla?: string;
  read?: boolean;
  participants?: string[];
  decisions?: string[];
  followUps?: string[];
}

interface ViewConfig {
  defaultTab: string;
  sortBy: string;
  groupBy: string;
  view: ViewMode;
  savedFilter: string;
  notifications: boolean;
  digest: string;
  columns: Record<string, boolean>;
}

interface Kpi {
  label: string;
  value: string;
  helper: string;
  status: 'success' | 'warning' | 'danger' | 'info';
}

const routeMeta: Record<WorkspaceRoute, { title: string; purpose: string; primary: string; configure: string; tabs: string[]; columns: string[] }> = {
  'my-work': {
    title: 'My Work',
    purpose: 'Act on your assigned tasks, requests, approvals, blockers, and due items.',
    primary: 'New Work Item',
    configure: 'Configure View',
    tabs: ['All', 'Tasks', 'Requests', 'Approvals', 'Blockers', 'Updates'],
    columns: ['Title', 'Type', 'Status', 'Due Date', 'Priority', 'Owner', 'Source', 'Action']
  },
  'my-requests': {
    title: 'My Requests',
    purpose: 'Track requests you submitted or requests that need your input.',
    primary: 'Submit Request',
    configure: 'Configure View',
    tabs: ['All', 'Drafts', 'Submitted', 'Awaiting Input', 'In Fulfilment', 'Completed', 'Rejected'],
    columns: ['Request ID', 'Request title', 'Category', 'Status', 'SLA', 'Owner/Fulfilment team', 'Last update', 'Action']
  },
  'working-sessions': {
    title: 'Working Sessions',
    purpose: 'Structured collaboration sessions with actions, owners, notes, decisions, and linked work.',
    primary: 'New Session',
    configure: 'Configure View',
    tabs: ['Upcoming', 'Today', 'My Follow-ups', 'Decisions', 'Completed'],
    columns: ['Session title', 'Session type', 'Date/time', 'Owner', 'Linked work', 'Follow-ups', 'Status', 'Action']
  },
  activity: {
    title: 'Activity',
    purpose: 'Platform activity, notifications, announcements, mentions, approvals, recent work updates, and relevant user events.',
    primary: 'Mark All Read',
    configure: 'Notification Preferences',
    tabs: ['All Activity', 'Notifications', 'Announcements', 'Mentions', 'Action Required'],
    columns: ['Title', 'Source', 'Priority', 'Status', 'Last update', 'Related item', 'Action']
  }
};

const roleCopy: Record<WorkspaceRole, Record<WorkspaceRoute, string[]>> = {
  Associate: {
    'my-work': ['Complete assigned task', 'Submit access update', 'Review manager feedback', 'Resolve blocker', 'Update tracker item'],
    'my-requests': ['IT access request', 'Platform support request', 'HRA request', 'Knowledge/content request', 'Task support request'],
    'working-sessions': ['Project stand-up', 'Onboarding sync', 'Task clarification session', 'DQ Ways of Working check-in', 'Learning progress review'],
    activity: ['New task assigned', 'Request update', 'Learning reminder', 'Mention in comment', 'Profile completion reminder']
  },
  'Scrum Master': {
    'my-work': ['Review blocked task', 'Check missing update', 'Validate closure quality', 'Prepare squad stand-up actions', 'Review flow health update'],
    'my-requests': ['Squad support request', 'Task workflow support request', 'Closure evidence request', 'Platform support request', 'Knowledge update request'],
    'working-sessions': ['Daily stand-up', 'Blocker review', 'Closure quality session', 'Squad flow review', 'SLA risk huddle'],
    activity: ['Blocker raised', 'Missing task update', 'Closure review due', 'Squad update missing', 'Flow-health alert']
  },
  'Team / Squad Lead': {
    'my-work': ['Review team blocker', 'Approve task closure', 'Check team workload', 'Follow up overdue action', 'Review team performance action'],
    'my-requests': ['Team access support request', 'Escalation support request', 'Workflow support request', 'Capacity support request', 'Knowledge owner request'],
    'working-sessions': ['Team planning session', 'Delivery review', 'Escalation review', 'Workload balancing session', 'Governance follow-up'],
    activity: ['Approval required', 'Team workload risk', 'Escalation update', 'Closure review due', 'Team blocker update']
  },
  'Unit Lead': {
    'my-work': ['Review unit execution risk', 'Check SLA exposure', 'Review governance update', 'Track strategic initiative action', 'Review outcome progress'],
    'my-requests': ['Unit report request', 'Strategic tracker support request', 'Governance support request', 'SLA review request', 'Executive update request'],
    'working-sessions': ['Unit performance review', 'Governance checkpoint', 'Strategic initiative review', 'SLA exposure review', 'Outcome tracking session'],
    activity: ['SLA exposure alert', 'Governance review update', 'Unit performance summary', 'Strategic initiative risk', 'Outcome review due']
  },
  HRA: {
    'my-work': ['Review onboarding request', 'Confirm role transition update', 'Validate HRA request evidence', 'Check workforce readiness item', 'Follow up access readiness'],
    'my-requests': ['HRA request requiring review', 'Role transition request', 'Onboarding request', 'Policy clarification request', 'Workforce readiness request'],
    'working-sessions': ['Onboarding sync', 'Role transition review', 'Workforce request triage', 'Policy clarification session', 'Access readiness review'],
    activity: ['Onboarding request submitted', 'Role transition approval due', 'HRA request update', 'New joiner access reminder', 'Policy clarification mention']
  },
  Admin: {
    'my-work': ['Review role configuration item', 'Update feature configuration', 'Check audit event', 'Resolve platform configuration task', 'Review workflow rule change'],
    'my-requests': ['Role permission change request', 'Feature configuration request', 'Workflow rule change request', 'Marketplace configuration request', 'AI guardrail update request'],
    'working-sessions': ['Configuration review', 'Platform governance session', 'Audit review', 'Workflow rule review', 'Marketplace configuration sync'],
    activity: ['Configuration change submitted', 'Audit log anomaly', 'Role permission request', 'Workflow rule update due', 'Platform configuration alert']
  },
  Support: {
    'my-work': ['Triage support request', 'Resolve fulfilment item', 'Escalate SLA risk', 'Update request status', 'Review support queue blocker'],
    'my-requests': ['Platform support request', 'Access issue', 'Request fulfilment update', 'SLA exception request', 'Support routing request'],
    'working-sessions': ['Support triage', 'Fulfilment review', 'SLA breach review', 'Platform issue review', 'Queue handoff session'],
    activity: ['New support ticket assigned', 'SLA breach risk', 'Escalation queue update', 'Fulfilment owner mention', 'Platform support update']
  },
  CEO: {
    'my-work': ['Review strategic update', 'Check governance alert', 'Review SLA exposure', 'View executive summary action', 'Review outcome tracking action'],
    'my-requests': ['Executive support request', 'Strategic report request', 'Governance summary request', 'Outcome tracking request', 'Leadership update request'],
    'working-sessions': ['Leadership execution review', 'Governance review', 'Outcome tracking session', 'Strategic portfolio review', 'SLA exposure briefing'],
    activity: ['Strategic initiative update', 'Governance health alert', 'Executive report ready', 'SLA exposure briefing', 'Outcome tracking alert']
  }
};

const roleOwners: Record<WorkspaceRole, string[]> = {
  Associate: ['Amina Hassan', 'Ian Kipkorir', 'John Wayua'],
  'Scrum Master': ['Bilal Waqar', 'Squad Alpha', 'Amina Hassan'],
  'Team / Squad Lead': ['Sreya Lakshmi', 'Squad Alpha', 'Bilal Waqar'],
  'Unit Lead': ['Ian Kipkorir', 'Digital Workspace Unit', 'Governance Office'],
  HRA: ['Naomi Kimani', 'HRA Queue', 'Amina Hassan'],
  Admin: ['Bilal Waqar', 'Platform Admin Queue', 'Audit Control'],
  Support: ['Omar Ali', 'Support Fulfilment Queue', 'Platform Support'],
  CEO: ['Mariam Said', 'Executive Office', 'DWS Leadership']
};

export function buildWorkspaceRecords(route: WorkspaceRoute, role: WorkspaceRole, mode: string): WorkspaceRecord[] {
  const titles = mode === 'first-time' && route === 'my-work'
    ? ['Complete onboarding profile', 'Submit laptop and DQ access update', 'Join DQ Ways of Working session', 'Review first manager feedback', 'Update onboarding tracker item', 'Confirm learning path progress']
    : mode === 'first-time' && route === 'my-requests'
      ? ['Laptop and DQ collaboration tools', 'Workspace profile help', 'Role-based learning access', 'HRA onboarding clarification', 'Knowledge Center access']
      : mode === 'first-time' && route === 'working-sessions'
        ? ['Onboarding kick-off', 'DQ Ways of Working session', 'Access readiness review', 'First team introduction', 'Learning path check-in']
        : mode === 'first-time' && route === 'activity'
          ? ['Welcome to DWS.01', 'Manager assigned your first task', 'Learning path available', 'Access request submitted', 'Profile preferences incomplete']
          : roleCopy[role][route];

  const owners = roleOwners[role];
  return titles.map((title, index) => {
    const requestStatus = ['Submitted', 'Awaiting Input', 'In Fulfilment', 'Completed', 'Draft', 'Rejected'][index % 6];
    const sessionStatus = ['Upcoming', 'Today', 'Action Required', 'Decision Captured', 'Completed'][index % 5];
    const notificationStatus = index % 3 === 0 ? 'Action Required' : index % 2 === 0 ? 'Unread' : 'Read';
    const workType = index === 1 ? 'Request' : index === 2 ? 'Approval' : index === 3 ? 'Blocker' : index === 4 ? 'Update' : 'Task';
    const type = route === 'my-requests' ? 'Request' : route === 'working-sessions' ? 'Working Session' : route === 'activity' ? ['Notification', 'Announcement', 'Mention', 'Approval', 'Work Update'][index % 5] : workType;
    const status = route === 'my-requests' ? requestStatus : route === 'working-sessions' ? sessionStatus : route === 'activity' ? notificationStatus : ['In Progress', 'Awaiting Input', 'Due Soon', 'Blocked', 'Needs Update', 'On Track'][index % 6];
    const priority = route === 'activity' ? ['High', 'Medium', 'High', 'Low', 'Medium'][index % 5] : ['High', 'Medium', 'High', 'High', 'Medium', 'Low'][index % 6];
    const category = route === 'activity' ? ['Action Required', 'Mentions', 'Notifications', 'Announcements', 'Work Updates'][index % 5] : route === 'my-requests' ? ['IT & Access', 'HRA', 'Platform Support', 'Knowledge / Content', 'Admin'][index % 5] : type;
    return {
      id: `${route.slice(0, 3).toUpperCase()}-${String(260 + index).padStart(3, '0')}`,
      title,
      type,
      status,
      priority,
      dueDate: route === 'activity' ? `${index + 1} hour${index === 0 ? '' : 's'} ago` : `${20 + index} May 2026`,
      owner: owners[index % owners.length],
      source: route === 'working-sessions' ? ['DWS Calendar', 'Governance Review', 'Support Queue', 'Squad Board', 'Leadership Office'][index % 5] : category,
      category,
      sla: route === 'my-requests' ? ['On Track', 'At Risk', 'Due Soon', 'Met', 'N/A'][index % 5] : undefined,
      lastUpdate: index === 0 ? 'Today, 09:40' : `${index + 1} days ago`,
      read: route === 'activity' ? notificationStatus === 'Read' : undefined,
      participants: ['Amina Hassan', 'Bilal Waqar', owners[index % owners.length]],
      decisions: [`Decision note captured for ${title}`],
      followUps: [`Confirm next action owner for ${title}`, 'Attach evidence or update linked tracker'],
      description: `${role} workspace record for ${title}. This item is scoped to the user's execution cockpit and links to the relevant DWS task, request, tracker, or working-session follow-up.`,
      nextAction: route === 'activity' ? 'Open the related item, take the required action, or snooze the activity item.' : route === 'working-sessions' ? 'Review notes, capture decisions, and close follow-up actions.' : route === 'my-requests' ? 'Review the status timeline and provide any required input.' : 'Update the work item with current status, owner, evidence, and next action.',
      related: ['DWS.01 Workspace', category, role]
    };
  });
}

function kpisFor(route: WorkspaceRoute, records: WorkspaceRecord[], mode: string): Kpi[] {
  if (route === 'my-requests') {
    return [
      { label: 'Total requests', value: String(records.length), helper: 'Submitted or requiring input', status: 'info' },
      { label: 'Awaiting input', value: String(records.filter((r) => r.status === 'Awaiting Input').length), helper: 'Needs user response', status: 'warning' },
      { label: 'In fulfilment', value: String(records.filter((r) => r.status === 'In Fulfilment').length), helper: 'With fulfilment owner', status: 'info' },
      { label: 'SLA risk', value: String(records.filter((r) => r.sla === 'At Risk').length), helper: 'Close to breach', status: 'danger' }
    ];
  }
  if (route === 'working-sessions') {
    return [
      { label: 'Upcoming sessions', value: String(records.filter((r) => ['Upcoming', 'Today'].includes(r.status)).length), helper: 'Scheduled collaboration', status: 'info' },
      { label: 'Follow-ups due', value: String(records.filter((r) => r.status === 'Action Required').length + 2), helper: 'Owner actions open', status: 'warning' },
      { label: 'Decisions captured', value: String(records.filter((r) => r.status === 'Decision Captured').length + 3), helper: 'Linked to work', status: 'success' },
      { label: 'Overdue actions', value: String(records.filter((r) => r.priority === 'High').length - 1), helper: 'Needs escalation', status: 'danger' }
    ];
  }
  if (route === 'activity') {
    return [
      { label: 'Total activity', value: String(records.length), helper: 'Across DWS sources', status: 'info' },
      { label: 'Unread', value: String(records.filter((r) => r.status === 'Unread').length), helper: 'Not reviewed', status: 'warning' },
      { label: 'Action required', value: String(records.filter((r) => r.status === 'Action Required').length), helper: 'Needs response', status: 'danger' },
      { label: 'Mentions', value: String(records.filter((r) => r.category === 'Mentions').length), helper: 'Needs awareness', status: 'info' }
    ];
  }
  if (mode === 'first-time') {
    return [
      { label: 'Onboarding items', value: String(records.length), helper: 'Profile, access, learning', status: 'info' },
      { label: 'Access actions', value: String(records.filter((r) => r.type === 'Request').length + 1), helper: 'Tools and systems', status: 'warning' },
      { label: 'Learning actions', value: '3', helper: 'Role path open', status: 'info' },
      { label: 'Profile actions', value: '2', helper: 'Preferences incomplete', status: 'warning' }
    ];
  }
  return [
    { label: 'Total work items', value: String(records.length), helper: 'In your cockpit', status: 'info' },
    { label: 'Requires action', value: String(records.filter((r) => ['Awaiting Input', 'Due Soon', 'Blocked', 'Needs Update'].includes(r.status)).length), helper: 'Needs update', status: 'warning' },
    { label: 'High priority', value: String(records.filter((r) => r.priority === 'High').length), helper: 'Priority focus', status: 'danger' },
    { label: 'On track', value: String(records.filter((r) => r.status === 'On Track').length), helper: 'Healthy items', status: 'success' }
  ];
}

function KpiStrip({ kpis, onApply }: { kpis: Kpi[]; onApply: (label: string) => void }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <button key={kpi.label} onClick={() => onApply(kpi.label)} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition hover:bg-surface">
          <div className="text-sm font-semibold text-text-muted">{kpi.label}</div>
          <div className="mt-2 text-3xl font-bold text-primary">{kpi.value}</div>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-text-secondary">
            <span className={`h-2 w-2 rounded-full ${kpi.status === 'success' ? 'bg-success' : kpi.status === 'warning' ? 'bg-warning' : kpi.status === 'danger' ? 'bg-danger' : 'bg-info'}`} />
            {kpi.helper}
          </div>
        </button>
      ))}
    </section>
  );
}

function DetailDrawer({ record, route, onClose, onUpdate }: { record: WorkspaceRecord | null; route: WorkspaceRoute; onClose: () => void; onUpdate: (record: WorkspaceRecord) => void }) {
  if (!record) return null;
  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[200] h-screen w-full max-w-lg overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{record.id} · {record.type}</div>
            <h2 className="mt-1 text-xl font-bold text-primary">{record.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close detail drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={20} /></button>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap gap-2">
            <StatusPill status={record.status} />
            <StatusPill status={record.priority} />
            {record.sla && <StatusPill status={record.sla} />}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Meta label={route === 'activity' ? 'Source' : 'Owner'} value={record.owner} />
            <Meta label={route === 'activity' ? 'Timestamp' : 'Due date'} value={record.dueDate} />
            <Meta label="Source" value={record.source} />
            <Meta label="Last update" value={record.lastUpdate} />
          </div>
          {route === 'my-requests' && (
            <div>
              <h3 className="text-sm font-bold text-primary">Status timeline</h3>
              <div className="mt-3 space-y-3">
                {['Drafted', 'Submitted', record.status, 'Next owner update'].map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <span className={`mt-1 h-3 w-3 rounded-full ${index < 2 ? 'bg-success' : 'bg-info'}`} />
                    <div><div className="text-sm font-bold text-primary">{step}</div><div className="text-xs text-text-muted">{index === 0 ? 'Created by requester' : index === 1 ? 'Routed to fulfilment' : record.lastUpdate}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {route === 'working-sessions' && (
            <div className="grid grid-cols-1 gap-4">
              <InfoList title="Participants" values={record.participants || []} />
              <InfoList title="Decisions" values={record.decisions || []} />
              <InfoList title="Follow-ups" values={record.followUps || []} />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-primary">Description</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{record.description}</p>
          </div>
          <InfoList title="Related work items" values={record.related} />
          
          <WorkItemLinkedKnowledgeCard workItemId={record.id} />
          
          <div className="rounded-card border border-border-subtle bg-surface p-4">
            <h3 className="text-sm font-bold text-primary">Recommended next action</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{record.nextAction}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {drawerActions(route, record).map((label) => (
              <button
                key={label}
                onClick={() => {
                  const next = label.includes('read') || label.includes('Reviewed') ? { ...record, status: 'Read', read: true } : label.includes('Complete') ? { ...record, status: 'Completed' } : record;
                  onUpdate(next);
                  toast.success(`${label} saved.`);
                }}
                className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

function drawerActions(route: WorkspaceRoute, record: WorkspaceRecord) {
  if (route === 'activity') return record.read ? ['Take Action', 'Snooze', 'Dismiss', 'Open Related Item'] : ['Mark as read', 'Take Action', 'Snooze', 'Dismiss'];
  if (route === 'working-sessions') return ['Add Follow-up', 'Capture Decision', 'Link Work Item', 'Mark Complete'];
  if (route === 'my-requests') return ['Update Request', 'Add Comment', 'Upload Evidence', 'Cancel Request'];
  return ['Update Item', 'Add Note', 'Link Evidence', 'Mark Reviewed'];
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</div><div className="mt-1 font-semibold text-primary">{value}</div></div>;
}

function InfoList({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-primary">{title}</h3>
      <div className="mt-2 space-y-2">
        {values.map((value) => <div key={value} className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary">{value}</div>)}
      </div>
    </div>
  );
}

function ActionModal({ title, route, onClose, onSave }: { title: string; route: WorkspaceRoute; onClose: () => void; onSave: (values: Record<string, string>) => void }) {
  const fields = modalFields(title, route);
  const [values, setValues] = useState<Record<string, string>>({});
  const canSubmit = fields.every((field) => String(values[field] || '').trim());
  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/20" onClick={onClose} />
      <section className="fixed left-1/2 top-1/2 z-[220] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">{title}</h2>
            <p className="mt-1 text-sm text-text-secondary">Required fields are validated locally. No backend call is made.</p>
          </div>
          <button onClick={onClose} aria-label="Close modal" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className={['Description', 'Purpose', 'Agenda', 'Message', 'Notes', 'Required action'].includes(field) ? 'md:col-span-2' : ''}>
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

function modalFields(title: string, route: WorkspaceRoute) {
  if (title === 'Create Task') return ['Title', 'Purpose', 'Owner', 'Priority', 'Due date', 'Linked work item'];
  if (title === 'Submit Request') return ['Request category', 'Request type', 'Description', 'Expected outcome', 'Urgency', 'Preferred due date'];
  if (title === 'New Tracker Item') return ['Tracker', 'Item title', 'Owner', 'Status', 'Due date'];
  if (title === 'Upload Document') return ['Document type', 'Name', 'Linked work item', 'Notes'];
  if (title === 'Add Knowledge') return ['Title', 'Category', 'Summary', 'Linked work item'];
  if (title === 'Schedule Working Session' || route === 'working-sessions') return ['Title', 'Session type', 'Date/time', 'Participants', 'Purpose', 'Agenda', 'Linked work item', 'Expected output', 'Follow-up owner', 'Notes'];
  if (title.includes('Snooze')) return ['Reminder date', 'Reason'];
  return ['Title', 'Owner', 'Priority', 'Due date', 'Description'];
}

function ConfigureViewDrawer({ route, config, onClose, onSave }: { route: WorkspaceRoute; config: ViewConfig; onClose: () => void; onSave: (config: ViewConfig) => void }) {
  const meta = routeMeta[route];
  const [draft, setDraft] = useState(config);
  const [tab, setTab] = useState(route === 'activity' ? 'Activity Preferences' : 'Columns');
  const configTabs = route === 'activity'
    ? ['Categories', 'Channels', 'Reminder Rules', 'Quiet Hours']
    : ['Columns', 'Saved Filters', 'Default View', 'Notification Preferences'];
  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[200] h-screen w-full max-w-lg overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">User-level display settings</div>
            <h2 className="mt-1 text-xl font-bold text-primary">{meta.configure}</h2>
          </div>
          <button onClick={onClose} aria-label="Close configure drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={20} /></button>
        </div>
        <div className="p-6">
          <div className="mb-5 flex flex-wrap gap-2 border-b border-border-subtle">
            {configTabs.map((name) => <button key={name} onClick={() => setTab(name)} className={`px-3 py-3 text-sm font-bold ${tab === name ? 'border-b-2 border-info text-info-text' : 'text-text-secondary hover:text-primary'}`}>{name}</button>)}
          </div>
          <div className="space-y-5">
            {(tab === 'Columns' || tab === 'Categories') && (
              <div className="space-y-3">
                {(tab === 'Columns' ? meta.columns : meta.tabs.slice(1)).map((column) => (
                  <label key={column} className="flex items-center justify-between rounded-card border border-border-subtle bg-surface px-4 py-3">
                    <span className="text-sm font-semibold text-primary">{column}</span>
                    <input type="checkbox" checked={draft.columns[column] !== false} onChange={(event) => setDraft((current) => ({ ...current, columns: { ...current.columns, [column]: event.target.checked } }))} />
                  </label>
                ))}
              </div>
            )}
            {(tab === 'Saved Filters' || tab === 'Channels') && (
              <div className="grid grid-cols-1 gap-4">
                <Input label="Save current filter" value={draft.savedFilter} onChange={(value) => setDraft((current) => ({ ...current, savedFilter: value }))} />
                <label className="flex items-center justify-between rounded-card border border-border-subtle bg-surface px-4 py-3">
                  <span className="text-sm font-semibold text-primary">In-app notifications</span>
                  <input type="checkbox" checked={draft.notifications} onChange={(event) => setDraft((current) => ({ ...current, notifications: event.target.checked }))} />
                </label>
              </div>
            )}
            {(tab === 'Default View' || tab === 'Reminder Rules') && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectLike label="Default tab" value={draft.defaultTab} options={meta.tabs} onChange={(value) => setDraft((current) => ({ ...current, defaultTab: value }))} />
                <SelectLike label="Sort by" value={draft.sortBy} options={['Due date', 'Priority', 'Status', 'Last update']} onChange={(value) => setDraft((current) => ({ ...current, sortBy: value }))} />
                <SelectLike label="Group by" value={draft.groupBy} options={['None', 'Type', 'Status', 'Priority']} onChange={(value) => setDraft((current) => ({ ...current, groupBy: value }))} />
                <SelectLike label="Preferred view" value={draft.view} options={route === 'working-sessions' ? ['List', 'Calendar'] : ['Table', 'Card']} onChange={(value) => setDraft((current) => ({ ...current, view: value as ViewMode }))} />
              </div>
            )}
            {(tab === 'Notification Preferences' || tab === 'Quiet Hours') && (
              <div className="grid grid-cols-1 gap-4">
                <SelectLike label="Digest frequency" value={draft.digest} options={['Immediate', 'Daily', 'Weekly']} onChange={(value) => setDraft((current) => ({ ...current, digest: value }))} />
                <Input label="SLA alert threshold" value="24 hours before breach" onChange={() => undefined} />
                <Input label="Quiet hours" value="18:00 - 07:00" onChange={() => undefined} />
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Cancel</button>
            <button onClick={() => onSave(draft)} className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white">Save preferences</button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>;
}

function SelectLike({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label><span className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function RecordsTable({ route, records, columns, onOpen, onAction }: { route: WorkspaceRoute; records: WorkspaceRecord[]; columns: Record<string, boolean>; onOpen: (record: WorkspaceRecord) => void; onAction: (record: WorkspaceRecord) => void }) {
  const meta = routeMeta[route];
  const visibleColumns = meta.columns.filter((column) => columns[column] !== false);
  return (
    <div className="overflow-x-auto rounded-card border border-border-subtle">
      <table className="min-w-[860px] w-full text-left">
        <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-text-muted">
          <tr>{visibleColumns.map((column) => <th key={column} className="px-4 py-3">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {records.map((record) => (
            <tr key={record.id} onClick={() => onOpen(record)} className="cursor-pointer hover:bg-surface">
              {visibleColumns.map((column) => <td key={column} className="px-4 py-3">{cellFor(column, record, onAction)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function cellFor(column: string, record: WorkspaceRecord, onAction: (record: WorkspaceRecord) => void) {
  if (['Title', 'Request title', 'Session title'].includes(column)) return <div><div className="max-w-[260px] truncate text-sm font-bold text-primary">{record.title}</div><div className="text-xs text-text-muted">{record.id}</div></div>;
  if (column === 'Request ID') return <span className="font-mono text-xs font-bold text-primary">{record.id}</span>;
  if (column === 'Type' || column === 'Session type' || column === 'Category' || column === 'Source' || column === 'Related item' || column === 'Linked work') return <span className="text-sm text-text-secondary">{column === 'Linked work' || column === 'Related item' ? record.related[1] : column === 'Session type' || column === 'Type' ? record.type : column === 'Source' ? record.source : record.category}</span>;
  if (column === 'Status' || column === 'Priority' || column === 'SLA') return <StatusPill status={column === 'SLA' ? record.sla || 'N/A' : column === 'Priority' ? record.priority : record.status} />;
  if (column === 'Due Date' || column === 'Date/time') return <span className="text-sm text-text-secondary">{record.dueDate}</span>;
  if (column === 'Owner' || column === 'Owner/Fulfilment team') return <span className="text-sm font-semibold text-primary">{record.owner}</span>;
  if (column === 'Last update') return <span className="text-sm text-text-secondary">{record.lastUpdate}</span>;
  if (column === 'Follow-ups') return <span className="text-sm text-text-secondary">{record.followUps?.length || 0} open</span>;
  if (column === 'Action') return <button onClick={(event) => { event.stopPropagation(); onAction(record); }} aria-label={`Update ${record.title}`} className="rounded-full p-1.5 text-text-muted hover:bg-surface hover:text-primary"><MoreVertical size={17} /></button>;
  return <span className="text-sm text-text-secondary">{record.title}</span>;
}

function CardView({ records, onOpen }: { records: WorkspaceRecord[]; onOpen: (record: WorkspaceRecord) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {records.map((record) => (
        <button key={record.id} onClick={() => onOpen(record)} className="rounded-card border border-border-subtle bg-white p-4 text-left shadow-sm hover:bg-surface">
          <div className="flex items-start justify-between gap-3">
            <div><div className="text-sm font-bold text-primary">{record.title}</div><div className="mt-1 text-xs text-text-muted">{record.id} · {record.source}</div></div>
            <StatusPill status={record.status} />
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">{record.description}</p>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-text-muted"><span>{record.owner}</span><span>{record.dueDate}</span></div>
        </button>
      ))}
    </div>
  );
}

function CalendarView({ records, onOpen }: { records: WorkspaceRecord[]; onOpen: (record: WorkspaceRecord) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {records.map((record) => (
        <button key={record.id} onClick={() => onOpen(record)} className="grid grid-cols-[72px_1fr] gap-4 rounded-card border border-border-subtle bg-white p-4 text-left hover:bg-surface">
          <div className="rounded-card border border-border-subtle bg-surface p-3 text-center">
            <div className="text-xs font-bold uppercase text-text-muted">May</div>
            <div className="text-2xl font-bold text-primary">{record.dueDate.match(/\d+/)?.[0] || '20'}</div>
          </div>
          <div>
            <div className="font-bold text-primary">{record.title}</div>
            <div className="mt-1 text-sm text-text-secondary">{record.source}</div>
            <div className="mt-3"><StatusPill status={record.status} /></div>
          </div>
        </button>
      ))}
    </div>
  );
}

function WorkspacePageShell({ route }: { route: WorkspaceRoute }) {
  const { mode } = useViewingMode();
  const { activeRole, activeSegment } = useWorkspaceRole();
  const navigate = useNavigate();
  const meta = routeMeta[route];
  
  const loadRecords = () => {
    const defaultRecords = buildWorkspaceRecords(route, activeRole, mode);
    if (route === 'my-requests') {
      try {
        const localRequests = JSON.parse(localStorage.getItem('local_my_requests') || '[]');
        console.log("WorkspaceSectionPages loaded local requests:", localRequests.length);
        if (localRequests.length > 0) {
          toast.success(`Loaded ${localRequests.length} local requests.`);
        }
        const mappedLocalRequests = localRequests.map((r: any) => {
          const rawDate = r.lastUpdate || r.lastUpdated || r.submittedAt || '';
          let formattedDate = rawDate;
          if (rawDate && rawDate.includes('T')) {
            try {
              const d = new Date(rawDate);
              formattedDate = `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            } catch (e) {
              formattedDate = 'Just now';
            }
          } else if (!rawDate) {
            formattedDate = 'Just now';
          }
          
          return {
            ...r,
            title: r.title || r.service || 'Unknown Request',
            type: r.type || 'Request',
            dueDate: r.dueDate || 'Pending',
            source: r.source || r.category || 'Unknown',
            lastUpdate: formattedDate,
            owner: r.owner || 'Unassigned',
            status: r.status || 'Submitted',
            priority: r.priority || r.urgency || 'Normal',
          };
        });
        return [...mappedLocalRequests, ...defaultRecords];
      } catch (e) {
        console.error("Error parsing local requests in WorkspaceSectionPages", e);
        return defaultRecords;
      }
    }
    return defaultRecords;
  };

  const [records, setRecords] = useState<WorkspaceRecord[]>(loadRecords);
  const [activeTab, setActiveTab] = useState(meta.tabs[0]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [drawerRecord, setDrawerRecord] = useState<WorkspaceRecord | null>(null);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [confirmRecord, setConfirmRecord] = useState<WorkspaceRecord | null>(null);
  const [config, setConfig] = useState<ViewConfig>(() => ({
    defaultTab: meta.tabs[0],
    sortBy: 'Due date',
    groupBy: 'None',
    view: route === 'working-sessions' ? 'List' : 'Table',
    savedFilter: '',
    notifications: true,
    digest: 'Daily',
    columns: Object.fromEntries(meta.columns.map((column) => [column, true]))
  }));

  React.useEffect(() => {
    setRecords(loadRecords());
    setActiveTab(meta.tabs[0]);
    
    const handleStorageChange = () => {
      setRecords(loadRecords());
    };
    
    window.addEventListener('local_requests_updated', handleStorageChange);
    return () => window.removeEventListener('local_requests_updated', handleStorageChange);
  }, [activeRole, mode, route, meta.tabs]);

  const filters = useMemo(() => ['All', ...Array.from(new Set(records.flatMap((record) => [record.status, record.priority, record.category]))).slice(0, 7)], [records]);
  const visibleRecords = records.filter((record) => {
    const text = `${record.title} ${record.type} ${record.status} ${record.owner} ${record.source} ${record.category}`.toLowerCase();
    const matchesSearch = text.includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || record.status === filter || record.priority === filter || record.category === filter;
    const matchesTab = activeTab === 'All' || tabMatch(route, activeTab, record);
    return matchesSearch && matchesFilter && matchesTab;
  });

  const updateRecord = (next: WorkspaceRecord) => {
    setRecords((current) => current.map((record) => record.id === next.id ? next : record));
    setDrawerRecord(next);
  };

  const primaryAction = () => {
    if (route === 'activity') {
      setRecords((current) => current.map((record) => ({ ...record, status: record.status === 'Unread' ? 'Read' : record.status, read: true })));
      toast.success('All activity marked as read.');
      return;
    }
    if (route === 'my-requests') {
      navigate('/marketplaces/services');
      return;
    }
    setModalTitle(meta.primary);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
            {route === 'my-work' ? 'Orientation · Act / execution' : `${activeSegment.subtitle} · ${mode === 'first-time' ? 'New Joiner' : 'Returning User'}`}
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary">{meta.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{meta.purpose}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setConfigOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-button border border-border-default bg-white px-4 text-sm font-bold text-primary shadow-sm hover:bg-surface"><Settings2 size={16} />{meta.configure}</button>
          <button onClick={primaryAction} className="inline-flex h-10 items-center gap-2 rounded-button bg-primary px-4 text-sm font-bold text-white shadow-sm"><Plus size={16} />{meta.primary}</button>
        </div>
      </header>

      <KpiStrip kpis={kpisFor(route, records, mode)} onApply={(label) => { setFilter(label.includes('High') || label.includes('SLA') ? 'High' : 'All'); toast.info(`${label} view applied.`); }} />

      <section className="mt-5 rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-64 flex-1 items-center gap-2 rounded-input border border-border-default bg-white px-3 py-2 text-sm text-text-muted">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${meta.title.toLowerCase()}`} className="w-full bg-transparent outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((name) => <button key={name} onClick={() => setFilter(name)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filter === name ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{name}</button>)}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle">
          <div className="flex flex-wrap gap-3">
            {meta.tabs.map((name) => <button key={name} onClick={() => setActiveTab(name)} className={`px-3 py-3 text-sm font-bold ${activeTab === name ? 'border-b-2 border-info text-info-text' : 'text-text-secondary hover:text-primary'}`}>{name}</button>)}
          </div>
          <div className="mb-2 flex gap-2">
            {route !== 'activity' && <button onClick={() => setModalTitle(route === 'working-sessions' ? 'View Calendar' : 'Save Filter')} className="inline-flex items-center gap-2 rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface"><Filter size={14} />{route === 'working-sessions' ? 'View Calendar' : 'Save Filter'}</button>}
            {route === 'working-sessions' && <button onClick={() => setConfig((current) => ({ ...current, view: current.view === 'Calendar' ? 'List' : 'Calendar' }))} className="inline-flex items-center gap-2 rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface"><CalendarDays size={14} />{config.view === 'Calendar' ? 'List View' : 'Calendar View'}</button>}
            {route === 'my-requests' && <button onClick={() => setConfig((current) => ({ ...current, view: current.view === 'Card' ? 'Table' : 'Card' }))} className="inline-flex items-center gap-2 rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface"><LayoutGrid size={14} />{config.view === 'Card' ? 'Table View' : 'Card View'}</button>}
          </div>
        </div>

        {config.view === 'Card' ? <CardView records={visibleRecords} onOpen={setDrawerRecord} /> : config.view === 'Calendar' ? <CalendarView records={visibleRecords} onOpen={setDrawerRecord} /> : <RecordsTable route={route} records={visibleRecords} columns={config.columns} onOpen={setDrawerRecord} onAction={(record) => route === 'activity' ? setConfirmRecord(record) : setModalTitle(actionTitleFor(route, record))} />}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">AI Workspace Insights</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {insightsFor(route, activeRole, mode).map((insight) => (
              <button key={insight} onClick={() => setDrawerRecord({ ...records[0], id: 'AI-INSIGHT', title: insight, type: 'AI Insight', status: 'Ready', priority: 'Medium', description: `${insight} Generated from local workspace data for ${activeRole}.`, nextAction: 'Review the recommended action and open the linked work item if needed.' })} className="rounded-card border border-border-subtle bg-surface p-4 text-left text-sm font-semibold text-primary hover:bg-navy-50">
                <Sparkles size={16} className="mb-2 text-info" />
                {insight}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Quick Actions</h2>
            <button onClick={() => setConfigOpen(true)} className="text-xs font-bold text-info-text hover:underline">Configure</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions(route, activeRole).map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => label === 'Take Action' ? navigate('/workspace') : label === 'Submit Request' ? navigate('/marketplaces/services') : setModalTitle(label)} className="rounded-card border border-border-subtle bg-white p-3 text-left text-xs font-bold text-primary hover:bg-surface">
                <Icon size={18} className="mb-3 text-primary" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <DetailDrawer record={drawerRecord} route={route} onClose={() => setDrawerRecord(null)} onUpdate={updateRecord} />
      {configOpen && <ConfigureViewDrawer route={route} config={config} onClose={() => setConfigOpen(false)} onSave={(next) => { setConfig(next); setActiveTab(next.defaultTab); setConfigOpen(false); toast.success(route === 'activity' ? 'Activity preferences updated.' : 'My Work view updated.'); }} />}
      {modalTitle && <ActionModal title={modalTitle} route={route} onClose={() => setModalTitle(null)} onSave={(values) => {
        const title = values.Title || values['Request type'] || values['Item title'] || values.Name || values['Session type'] || modalTitle;
        setRecords((current) => [{
          id: `${route.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          title,
          type: route === 'working-sessions' ? 'Working Session' : modalTitle,
          status: route === 'working-sessions' ? 'Upcoming' : modalTitle.includes('Request') ? 'Submitted' : 'Draft',
          priority: values.Priority || values.Urgency || 'Medium',
          dueDate: values['Due date'] || values['Preferred due date'] || values['Date/time'] || '30 May 2026',
          owner: values.Owner || values['Follow-up owner'] || activeSegment.profileName,
          source: meta.title,
          category: values.Category || values['Request category'] || modalTitle,
          description: values.Description || values.Purpose || values.Notes || 'Created in the local DWS prototype.',
          nextAction: 'Review the saved item and update the owner if needed.',
          related: [meta.title, values['Linked work item'] || values['Linked task/request/tracker'] || 'DWS.01 Workspace'],
          lastUpdate: 'Just now',
          sla: route === 'my-requests' ? 'On Track' : undefined,
          read: route === 'activity' ? false : undefined
        }, ...current]);
        toast.success(`${modalTitle} saved successfully.`);
        setModalTitle(null);
      }} />}
      {confirmRecord && (
        <>
          <div className="fixed inset-0 z-[210] bg-primary/20" onClick={() => setConfirmRecord(null)} />
          <section className="fixed left-1/2 top-1/2 z-[220] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-primary">Dismiss notification?</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">This only updates your local notification view.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setConfirmRecord(null)} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Cancel</button>
              <button onClick={() => { setRecords((current) => current.filter((record) => record.id !== confirmRecord.id)); setConfirmRecord(null); toast.success('Notification dismissed.'); }} className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white">Dismiss</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function tabMatch(route: WorkspaceRoute, tab: string, record: WorkspaceRecord) {
  if (route === 'my-work') {
    if (tab === 'Tasks') return record.type === 'Task';
    if (tab === 'Requests') return record.type === 'Request';
    if (tab === 'Approvals') return record.type === 'Approval';
    if (tab === 'Blockers') return record.type === 'Blocker' || record.status === 'Blocked';
    if (tab === 'Updates') return record.type === 'Update' || record.status === 'Needs Update';
  }
  if (route === 'my-requests') return tab === record.status || (tab === 'In Fulfilment' && record.status === 'In Fulfilment');
  if (route === 'working-sessions') {
    if (tab === 'My Follow-ups') return record.status === 'Action Required';
    if (tab === 'Decisions') return record.status === 'Decision Captured';
    return record.status === tab;
  }
  if (route === 'activity') {
    if (tab === 'All Activity') return true;
    if (tab === 'Notifications') return record.type === 'Notification' || record.category === 'Notifications';
    if (tab === 'Announcements') return record.type === 'Announcement' || record.category === 'Announcements';
    if (tab === 'Mentions') return record.type === 'Mention' || record.category === 'Mentions';
    if (tab === 'Action Required') return record.status === 'Action Required' || record.category === 'Action Required';
  }
  return true;
}

function actionTitleFor(route: WorkspaceRoute, record: WorkspaceRecord) {
  if (route === 'my-requests') return record.status === 'Submitted' ? 'Add Comment' : 'Update Request';
  if (route === 'working-sessions') return 'Add Follow-up';
  return 'Update Work Item';
}

function quickActions(route: WorkspaceRoute, role: WorkspaceRole): { label: string; icon: LucideIcon }[] {
  if (route === 'activity') return [
    { label: 'Take Action', icon: CheckCircle2 },
    { label: 'Snooze Notification', icon: Clock },
    { label: 'Activity Preferences', icon: SlidersHorizontal },
    { label: 'Dismiss Selected', icon: Trash2 }
  ];
  if (route === 'working-sessions') return [
    { label: 'Schedule Working Session', icon: CalendarDays },
    { label: 'Add Follow-up', icon: CheckCircle2 },
    { label: 'Capture Decision', icon: MessageSquare },
    { label: 'Upload Document', icon: UploadCloud }
  ];
  if (route === 'my-requests') return [
    { label: 'Submit Request', icon: FilePlus2 },
    { label: 'Add Comment', icon: MessageSquare },
    { label: 'Upload Evidence', icon: UploadCloud },
    { label: role === 'Admin' ? 'Review Routing' : 'Cancel Request', icon: X }
  ];
  return [
    { label: 'Create Task', icon: CheckCircle2 },
    { label: 'Submit Request', icon: FilePlus2 },
    { label: 'New Tracker Item', icon: Columns3 },
    { label: 'Schedule Working Session', icon: CalendarDays }
  ];
}

function insightsFor(route: WorkspaceRoute, role: WorkspaceRole, mode: string) {
  if (mode === 'first-time') return ['Your onboarding profile is 70% complete.', '2 access items need confirmation.', 'Your first working session is scheduled this week.', 'Weekly workspace summary is ready.'];
  if (route === 'my-requests') return ['2 requests are close to SLA breach.', `${role} request queue has pending input.`, 'One fulfilment owner update is overdue.', 'Weekly request summary is ready.'];
  if (route === 'working-sessions') return ['3 follow-ups need owner confirmation.', 'A decision from the last session is not linked to work.', 'One working session has overdue actions.', 'Weekly collaboration summary is ready.'];
  if (route === 'activity') return ['3 activity items need your update.', 'You have 1 unresolved blocker alert.', '2 action-required alerts should be reviewed today.', 'Weekly activity digest is ready.'];
  return ['3 items need your update.', 'You have 1 unresolved blocker.', '2 requests are close to SLA breach.', 'Weekly workspace summary is ready.'];
}

export function WorkspaceMyWorkPage() {
  return <WorkspacePageShell route="my-work" />;
}

export function WorkspaceMyRequestsPage() {
  return <WorkspacePageShell route="my-requests" />;
}

export function WorkspaceWorkingSessionsPage() {
  return <WorkspacePageShell route="working-sessions" />;
}

export function WorkspaceActivityPage() {
  return <WorkspacePageShell route="activity" />;
}

export function WorkspaceNotificationsPage() {
  return <WorkspaceActivityPage />;
}
