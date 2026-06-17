import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Paperclip, Save, Send, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

type ServiceRequestStatus =
  | 'New'
  | 'Triaged'
  | 'Unassigned'
  | 'In Progress'
  | 'Pending Information'
  | 'At Risk'
  | 'Breached'
  | 'Overdue'
  | 'Escalated'
  | 'Ready for Closure'
  | 'Closure Review'
  | 'Closed'
  | 'Reopened';

type ServiceRequest = {
  id: string;
  title: string;
  requester: string;
  owner: string;
  queue: string;
  status: ServiceRequestStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  sla: 'On Track' | 'At Risk' | 'Breached' | 'Paused';
  updated: string;
  nextAction: string;
};

export type ServiceHubView = 'overview' | 'my-requests' | 'pending-actions';
export type ServiceQueueView =
  | 'central-support-queue'
  | 'fulfilment-owner-queue'
  | 'assigned-requests'
  | 'pending-information'
  | 'sla-queue-view'
  | 'closure-review-queue';

const serviceRequests: ServiceRequest[] = [
  {
    id: 'REQ-2401',
    title: 'Provision analytics workspace access',
    requester: 'Amina Hassan',
    owner: 'Central Support',
    queue: 'Central Support Queue',
    status: 'New',
    priority: 'High',
    sla: 'At Risk',
    updated: 'Today',
    nextAction: 'First review required',
  },
  {
    id: 'REQ-2402',
    title: 'Update fulfilment owner for service catalogue',
    requester: 'Rohan Patel',
    owner: 'Maya Khan',
    queue: 'Fulfilment Owner Queue',
    status: 'In Progress',
    priority: 'Medium',
    sla: 'On Track',
    updated: 'Today',
    nextAction: 'Update progress',
  },
  {
    id: 'REQ-2403',
    title: 'Missing evidence for employee readiness request',
    requester: 'Grace Wanjiru',
    owner: 'Support Operations',
    queue: 'Pending Information',
    status: 'Pending Information',
    priority: 'Medium',
    sla: 'Paused',
    updated: 'Yesterday',
    nextAction: 'Send reminder',
  },
  {
    id: 'REQ-2404',
    title: 'Escalated SLA breach for platform support ticket',
    requester: 'David Mwangi',
    owner: 'Omar Ali',
    queue: 'SLA Queue View',
    status: 'Escalated',
    priority: 'Critical',
    sla: 'Breached',
    updated: 'Today',
    nextAction: 'Resolve escalation',
  },
  {
    id: 'REQ-2405',
    title: 'Request ready for closure review',
    requester: 'Priya Nair',
    owner: 'Sara Khan',
    queue: 'Closure Review Queue',
    status: 'Ready for Closure',
    priority: 'Low',
    sla: 'On Track',
    updated: '2 days ago',
    nextAction: 'Review closure',
  },
  {
    id: 'REQ-2406',
    title: 'Reopened request needing fulfilment review',
    requester: 'Amina Hassan',
    owner: 'Maya Khan',
    queue: 'Assigned Requests',
    status: 'Reopened',
    priority: 'High',
    sla: 'At Risk',
    updated: 'Today',
    nextAction: 'Update status',
  },
];

const hubMeta: Record<ServiceHubView, { title: string; description: string }> = {
  overview: {
    title: 'Service Overview',
    description: 'Summary dashboard for service request operations, personal request activity, SLA risk, closure review, and recent updates.',
  },
  'my-requests': {
    title: 'My Requests',
    description: 'Requests submitted by the logged-in user, with requester actions available from each request detail page.',
  },
  'pending-actions': {
    title: 'Pending Actions',
    description: 'Actions requiring attention, including missing information, evidence upload, closure review, ratings, and escalations.',
  },
};

const queueMeta: Record<ServiceQueueView, { title: string; description: string; focus: string[]; actions: string[] }> = {
  'central-support-queue': {
    title: 'Central Support Queue',
    description: 'New, triaged, unassigned, and first-review requests entering service operations.',
    focus: ['New requests', 'Triaged requests', 'Unassigned requests', 'Requests needing first review'],
    actions: ['Open Request', 'Assign Owner', 'Set Priority'],
  },
  'fulfilment-owner-queue': {
    title: 'Fulfilment Owner Queue',
    description: 'Fulfilment workload grouped by owner and team, with progress and evidence actions.',
    focus: ['Requests grouped by fulfilment owner', 'Requests assigned to fulfilment teams', 'In-progress fulfilment workload'],
    actions: ['Open Request', 'Update Progress', 'Add Evidence', 'Request Info'],
  },
  'assigned-requests': {
    title: 'Assigned Requests',
    description: 'Assigned, reopened, in-progress, and at-risk requests across the queue or team.',
    focus: ['Assigned requests across the queue/team', 'In-progress requests', 'Reopened assigned requests', 'At-risk assigned requests'],
    actions: ['Open Request', 'Update Status', 'Mark Ready for Closure'],
  },
  'pending-information': {
    title: 'Pending Information',
    description: 'Requests waiting for requester input or missing information, including paused SLA cases.',
    focus: ['Requests waiting for requester input', 'Requests with missing required information', 'Requests with paused SLA due to missing info'],
    actions: ['Open Request', 'Send Reminder', 'Resume Fulfilment'],
  },
  'sla-queue-view': {
    title: 'SLA Queue View',
    description: 'SLA risk and escalation workspace for at-risk, breached, overdue, and escalated requests.',
    focus: ['All SLA Items', 'At Risk', 'Breached', 'Overdue', 'Escalated'],
    actions: ['Open Request', 'Escalate', 'Reassign Owner', 'Change Priority', 'Pause SLA', 'Resume SLA', 'Resolve Escalation'],
  },
  'closure-review-queue': {
    title: 'Closure Review Queue',
    description: 'Closure-ready, in-review, rating-needed, and reopened requests that need closure handling.',
    focus: ['Requests marked Ready for Closure', 'Requests in Closure Review', 'Closed requests needing rating', 'Reopened requests needing review'],
    actions: ['Open Request', 'Review Closure', 'Approve Closure', 'Return for More Information', 'Submit Rating', 'Reopen Request'],
  },
};

const requestDetailTabs = [
  'Overview',
  'Triage & Assignment',
  'Updates',
  'Comments & Internal Notes',
  'Attachments & Evidence',
  'Activity Timeline',
  'Closure',
];

const detailActions = [
  'Save Changes',
  'Assign / Reassign',
  'Request Info',
  'Add Update',
  'Add Comment',
  'Add Internal Note',
  'Add Evidence',
  'Escalate',
  'Change Priority',
  'Pause SLA',
  'Resume SLA',
  'Mark Ready for Closure',
  'Close Request',
  'Submit Rating',
  'Reopen Request',
];

export function ServicesHubPage({ view }: { view: ServiceHubView }) {
  const navigate = useNavigate();
  const meta = hubMeta[view];
  const submittedRequests = serviceRequests.filter((request) => request.requester === 'Amina Hassan');
  const pendingActions = serviceRequests.filter((request) =>
    ['Pending Information', 'Escalated', 'Ready for Closure', 'Reopened'].includes(request.status),
  );

  return (
    <ServicesPageFrame
      breadcrumbs={[{ label: 'Services', route: '/services' }, { label: 'Service Hub', route: '/services/service-hub' }, { label: meta.title }]}
      title={meta.title}
      description={meta.description}
    >
      {view === 'overview' && (
        <>
          <MetricGrid
            items={[
              ['Open requests', '31'],
              ['My submitted requests', String(submittedRequests.length)],
              ['Pending actions', String(pendingActions.length)],
              ['Assigned request summary', '18 active'],
              ['SLA risk summary', '6 at risk'],
              ['Closure review summary', '4 ready'],
            ]}
          />
          <section className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <RequestList title="Recently updated requests" requests={serviceRequests.slice(0, 4)} onOpen={(id) => navigate(`/services/requests/${id}`)} />
            <QuickLinks />
          </section>
        </>
      )}

      {view === 'my-requests' && (
        <RequestList
          title="Submitted by me"
          requests={submittedRequests}
          actions={['Open Request', 'Provide Missing Information', 'Add Comment', 'View Closure Status', 'Submit Rating', 'Reopen Request']}
          onOpen={(id) => navigate(`/services/requests/${id}`)}
        />
      )}

      {view === 'pending-actions' && (
        <RequestList
          title="Actions requiring attention"
          requests={pendingActions}
          actions={['Open Request', 'Provide missing information', 'Upload requested evidence', 'Review closure', 'Resolve escalation']}
          onOpen={(id) => navigate(`/services/requests/${id}`)}
        />
      )}
    </ServicesPageFrame>
  );
}

export function ServicesQueuePage({ view }: { view: ServiceQueueView }) {
  const navigate = useNavigate();
  const [slaFilter, setSlaFilter] = useState('All SLA Items');
  const meta = queueMeta[view];
  const requests = useMemo(() => {
    if (view === 'central-support-queue') return serviceRequests.filter((request) => ['New', 'Triaged', 'Unassigned'].includes(request.status));
    if (view === 'fulfilment-owner-queue') return serviceRequests.filter((request) => ['Fulfilment Owner Queue', 'Assigned Requests'].includes(request.queue));
    if (view === 'assigned-requests') return serviceRequests.filter((request) => ['In Progress', 'Reopened', 'At Risk'].includes(request.status) || request.queue === 'Assigned Requests');
    if (view === 'pending-information') return serviceRequests.filter((request) => request.status === 'Pending Information' || request.sla === 'Paused');
    if (view === 'sla-queue-view') {
      if (slaFilter === 'All SLA Items') return serviceRequests.filter((request) => ['At Risk', 'Breached', 'Escalated', 'Overdue'].includes(request.status) || ['At Risk', 'Breached'].includes(request.sla));
      return serviceRequests.filter((request) => request.status === slaFilter || request.sla === slaFilter);
    }
    return serviceRequests.filter((request) => ['Ready for Closure', 'Closure Review', 'Closed', 'Reopened'].includes(request.status));
  }, [slaFilter, view]);

  return (
    <ServicesPageFrame
      breadcrumbs={[{ label: 'Services', route: '/services' }, { label: 'Request Queues', route: '/services/request-queues' }, { label: meta.title }]}
      title={meta.title}
      description={meta.description}
    >
      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <InfoPanel title="Shows" items={meta.focus} />
        <InfoPanel title="Primary actions" items={meta.actions} />
      </section>

      {view === 'sla-queue-view' && (
        <div className="mb-5 flex flex-wrap gap-2">
          {['All SLA Items', 'At Risk', 'Breached', 'Overdue', 'Escalated'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSlaFilter(tab)}
              className={`rounded-button px-3 py-2 text-xs font-bold transition-colors ${slaFilter === tab ? 'bg-primary text-white' : 'border border-border-default bg-white text-primary hover:bg-surface'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <RequestList title={meta.title} requests={requests} actions={meta.actions} onOpen={(id) => navigate(`/services/requests/${id}`)} />
    </ServicesPageFrame>
  );
}

export function ServiceRequestDetailPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const request = serviceRequests.find((item) => item.id === requestId) ?? serviceRequests[0];

  return (
    <ServicesPageFrame
      breadcrumbs={[{ label: 'Services', route: '/services' }, { label: 'Request Queues', route: '/services/request-queues' }, { label: request.id }]}
      title={`${request.id}: ${request.title}`}
      description="Request handling workspace with detail, triage, updates, collaboration, evidence, timeline, closure, SLA, and reopen actions."
      action={
        <button
          onClick={() => navigate(-1)}
          className="inline-flex min-h-10 items-center gap-2 rounded-button border border-border-default bg-white px-4 text-sm font-bold text-primary hover:bg-surface"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </button>
      }
    >
      <MetricGrid
        items={[
          ['Status', request.status],
          ['Priority', request.priority],
          ['SLA', request.sla],
          ['Owner', request.owner],
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border-subtle">
        {requestDetailTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-3 py-3 text-sm font-bold transition-colors ${activeTab === tab ? 'border-danger text-primary' : 'border-transparent text-text-muted hover:text-primary'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">{activeTab}</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {activeTab === 'Overview' && `${request.title} is owned by ${request.owner}. Next action: ${request.nextAction}.`}
            {activeTab === 'Triage & Assignment' && 'Confirm request category, assign or reassign fulfilment ownership, and set priority.'}
            {activeTab === 'Updates' && 'Add status updates, requester-visible notes, and fulfilment progress.'}
            {activeTab === 'Comments & Internal Notes' && 'Capture requester comments and internal handling notes without exposing them as sidebar destinations.'}
            {activeTab === 'Attachments & Evidence' && 'Attach supporting evidence, links, screenshots, and fulfilment proof.'}
            {activeTab === 'Activity Timeline' && 'Review audit events, routing changes, comments, SLA pauses, escalations, and closure decisions.'}
            {activeTab === 'Closure' && 'Review closure readiness, close the request, capture rating, or reopen where allowed.'}
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ['Requester', request.requester],
              ['Queue', request.queue],
              ['Last updated', request.updated],
              ['SLA state', request.sla],
            ].map(([label, value]) => (
              <div key={label} className="rounded-card border border-border-subtle bg-surface p-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</span>
                <p className="mt-1 text-sm font-bold text-primary">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">Request actions</h2>
          <div className="mt-4 grid gap-2">
            {detailActions.map((action) => (
              <button
                key={action}
                onClick={() => toast.success(`${action} action captured for ${request.id}.`)}
                className="inline-flex min-h-10 items-center gap-2 rounded-button border border-border-default bg-white px-3 text-left text-sm font-bold text-primary hover:bg-surface"
              >
                {iconForAction(action)}
                {action}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </ServicesPageFrame>
  );
}

function ServicesPageFrame({
  breadcrumbs,
  title,
  description,
  action,
  children,
}: {
  breadcrumbs: Array<{ label: string; route?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.route ? (
              <Link className="font-semibold text-primary hover:text-secondary" to={item.route}>
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-text-secondary">{item.label}</span>
            )}
            {index < breadcrumbs.length - 1 && <span aria-hidden="true">/</span>}
          </span>
        ))}
      </nav>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-text-secondary">{description}</p>
        </div>
        {action}
      </header>
      {children}
    </main>
  );
}

function MetricGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</p>
          <p className="mt-2 text-xl font-bold text-primary">{value}</p>
        </div>
      ))}
    </section>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-pill bg-surface px-3 py-1.5 text-xs font-bold text-text-secondary">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function RequestList({
  title,
  requests,
  actions = ['Open Request'],
  onOpen,
}: {
  title: string;
  requests: ServiceRequest[];
  actions?: string[];
  onOpen: (requestId: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-card border border-border-subtle bg-white shadow-sm">
      <div className="border-b border-border-subtle p-5">
        <h2 className="text-lg font-bold text-primary">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-subtle">
          <thead className="bg-surface">
            <tr>
              {['Request', 'Owner', 'Status', 'SLA', 'Next action', 'Actions'].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-text-muted">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {requests.map((request) => (
              <tr key={request.id} onClick={() => onOpen(request.id)} className="cursor-pointer transition-colors hover:bg-surface">
                <td className="px-4 py-4">
                  <div className="text-sm font-bold text-primary">{request.id}</div>
                  <div className="mt-1 max-w-sm text-sm text-text-secondary">{request.title}</div>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-primary">{request.owner}</td>
                <td className="px-4 py-4"><StatusBadge label={request.status} /></td>
                <td className="px-4 py-4"><StatusBadge label={request.sla} /></td>
                <td className="px-4 py-4 text-sm text-text-secondary">{request.nextAction}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <button
                        key={`${request.id}-${action}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (action === 'Open Request') onOpen(request.id);
                          else toast.success(`${action} action captured for ${request.id}.`);
                        }}
                        className="rounded-button border border-border-default bg-white px-3 py-1.5 text-xs font-bold text-primary hover:bg-surface"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function QuickLinks() {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-primary">Quick links to queues</h2>
      <div className="mt-4 grid gap-2">
        {[
          ['/services/request-queues/central-support-queue', 'Central Support Queue'],
          ['/services/request-queues/pending-information', 'Pending Information'],
          ['/services/request-queues/sla-queue-view', 'SLA Queue View'],
          ['/services/request-queues/closure-review-queue', 'Closure Review Queue'],
        ].map(([route, label]) => (
          <Link key={route} to={route} className="rounded-button border border-border-default bg-white px-3 py-2 text-sm font-bold text-primary hover:bg-surface">
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({ label }: { label: string }) {
  const tone = ['Breached', 'Critical', 'Escalated', 'Overdue'].includes(label)
    ? 'bg-danger-surface text-danger-text'
    : ['At Risk', 'Pending Information', 'Ready for Closure', 'Closure Review', 'Paused'].includes(label)
      ? 'bg-warning-surface text-warning-text'
      : 'bg-success-surface text-success-text';

  return <span className={`rounded-pill px-2.5 py-1 text-xs font-bold ${tone}`}>{label}</span>;
}

function iconForAction(action: string) {
  if (action.includes('Save')) return <Save size={15} strokeWidth={1.5} />;
  if (action.includes('Comment') || action.includes('Note') || action.includes('Update')) return <MessageSquare size={15} strokeWidth={1.5} />;
  if (action.includes('Evidence')) return <Paperclip size={15} strokeWidth={1.5} />;
  if (action.includes('Escalate') || action.includes('Priority') || action.includes('SLA')) return <ShieldAlert size={15} strokeWidth={1.5} />;
  return <Send size={15} strokeWidth={1.5} />;
}
