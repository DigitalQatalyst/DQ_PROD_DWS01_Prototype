import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ClipboardList,
  FileSearch,
  History,
  MessageSquare,
  Paperclip,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  Settings,
  ShieldAlert,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DqButton, DqIconButton } from '../components/DqButton';

type ServiceRequestStatus =
  | 'New'
  | 'Triaged'
  | 'Unassigned'
  | 'In Progress'
  | 'Pending Information'
  | 'Awaiting Info'
  | 'On Hold'
  | 'At Risk'
  | 'Breached'
  | 'Overdue'
  | 'Escalated'
  | 'Ready for Closure'
  | 'Closure Review'
  | 'Completed'
  | 'Closed'
  | 'Reopened';

type ServiceSlaStatus = 'On Track' | 'At Risk' | 'Breached' | 'Paused' | 'Resolved';

type ServiceRequest = {
  id: string;
  title: string;
  requester: string;
  owner: string;
  queue: string;
  status: ServiceRequestStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  sla: ServiceSlaStatus;
  updated: string;
  nextAction: string;
  service?: string;
  category?: string;
  submittedOn?: string;
  pendingAction?: string;
  dueDate?: string;
  latestUpdate?: string;
  updatedBy?: string;
  requiredInfo?: string;
  requestedBy?: string;
  closedOn?: string;
  closureStatus?: string;
  rating?: number;
};

export type ServiceHubView = 'overview' | 'my-requests' | 'pending-actions';
export type ServiceQueueView =
  | 'central-support-queue'
  | 'fulfilment-owner-queue'
  | 'assigned-requests'
  | 'pending-information'
  | 'sla-queue-view'
  | 'closure-review-queue';

const currentUser = 'Amina Hassan';
const savedViewStorageKey = 'dws-service-hub-saved-view';

// Requester-facing requests submitted by the logged-in user. These power the Service Hub tabs.
const myServiceRequests: ServiceRequest[] = [
  {
    id: 'REQ-2024-0587',
    title: 'Access to Finance Dashboard',
    requester: currentUser,
    owner: 'Maya Khan',
    queue: 'Fulfilment Owner Queue',
    service: 'Business Intelligence',
    category: 'Business Intelligence',
    status: 'In Progress',
    sla: 'On Track',
    priority: 'High',
    submittedOn: '12 May 2024',
    updated: '14 May 2024',
    nextAction: 'Provide cost centre details',
    pendingAction: 'Provide cost centre details',
    dueDate: '17 May 2024',
    latestUpdate: 'Fulfilment owner requested cost centre details',
    updatedBy: 'Maya Khan',
  },
  {
    id: 'REQ-2024-0521',
    title: 'User Account Access',
    requester: currentUser,
    owner: 'Sara Khan',
    queue: 'Closure Review Queue',
    service: 'IAM Services',
    category: 'IAM Services',
    status: 'Completed',
    sla: 'Resolved',
    priority: 'Medium',
    submittedOn: '05 May 2024',
    updated: '07 May 2024',
    nextAction: 'View closure',
    latestUpdate: 'Request completed and closed',
    updatedBy: 'Sara Khan',
    closedOn: '07 May 2024',
    closureStatus: 'Resolved',
    rating: 5,
  },
  {
    id: 'REQ-2024-0499',
    title: 'Data Extract Request',
    requester: currentUser,
    owner: 'Grace Wanjiru',
    queue: 'Pending Information',
    service: 'Data Services',
    category: 'Data Services',
    status: 'Awaiting Info',
    sla: 'Paused',
    priority: 'Medium',
    submittedOn: '02 May 2024',
    updated: '14 May 2024',
    nextAction: 'Provide missing information',
    pendingAction: 'Provide missing information',
    dueDate: '16 May 2024',
    latestUpdate: 'Service team requested missing information',
    updatedBy: 'Grace Wanjiru',
    requiredInfo: 'Target dataset and date range',
    requestedBy: 'Data Services Team',
  },
  {
    id: 'REQ-2024-0433',
    title: 'Report Issue',
    requester: currentUser,
    owner: 'Omar Ali',
    queue: 'Assigned Requests',
    service: 'Reporting Services',
    category: 'Reporting Services',
    status: 'On Hold',
    sla: 'Paused',
    priority: 'Low',
    submittedOn: '28 Apr 2024',
    updated: '10 May 2024',
    nextAction: 'Awaiting service team update',
    latestUpdate: 'Placed on hold pending service team update',
    updatedBy: 'Omar Ali',
  },
  {
    id: 'REQ-2024-0387',
    title: 'Software Installation',
    requester: currentUser,
    owner: 'Workplace Services',
    queue: 'Closure Review Queue',
    service: 'Workplace Services',
    category: 'Workplace Services',
    status: 'Completed',
    sla: 'Resolved',
    priority: 'Low',
    submittedOn: '22 Apr 2024',
    updated: '24 Apr 2024',
    nextAction: 'Rate service',
    pendingAction: 'Submit service rating',
    dueDate: '01 May 2024',
    latestUpdate: 'Software installed and request completed',
    updatedBy: 'Workplace Services',
    closedOn: '24 Apr 2024',
    closureStatus: 'Resolved',
  },
];

// Operational queue requests used by the Request Queues pages.
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

const allRequests: ServiceRequest[] = [...myServiceRequests, ...serviceRequests];

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

/* -------------------------------------------------------------------------- */
/*                               Service Hub                                   */
/* -------------------------------------------------------------------------- */

type HubTab = 'My Requests' | 'Pending Actions' | 'Recently Updated' | 'Awaiting Information' | 'Closed / Completed';

const hubTabs: HubTab[] = ['My Requests', 'Pending Actions', 'Recently Updated', 'Awaiting Information', 'Closed / Completed'];

type HubFilters = {
  search: string;
  category: string;
  status: string;
  sla: string;
  priority: string;
  owner: string;
  dateRange: string;
};

type HubSort = { key: string | null; direction: 'asc' | 'desc' };

type HubColumn = {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center';
  sortable?: boolean;
  primary?: boolean;
  render: (request: ServiceRequest) => ReactNode;
  sortValue?: (request: ServiceRequest) => string | number;
};

const defaultFilters: HubFilters = {
  search: '',
  category: 'All',
  status: 'All',
  sla: 'All',
  priority: 'All',
  owner: 'All',
  dateRange: 'All dates',
};

const defaultSort: HubSort = { key: null, direction: 'asc' };
const pageSize = 8;

const monthIndex: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseRequestDate(value?: string): number {
  if (!value) return 0;
  const parts = value.trim().split(' ');
  if (parts.length === 3) {
    const day = Number(parts[0]);
    const month = monthIndex[parts[1] as keyof typeof monthIndex];
    const year = Number(parts[2]);
    if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) {
      return new Date(year, month, day).getTime();
    }
  }
  return 0;
}

function monthLabel(value?: string): string | null {
  if (!value) return null;
  const parts = value.trim().split(' ');
  if (parts.length === 3) return `${parts[1]} ${parts[2]}`;
  return null;
}

export function ServicesHubPage({ view }: { view?: ServiceHubView }) {
  const navigate = useNavigate();
  const initialTab: HubTab = view === 'pending-actions' ? 'Pending Actions' : 'My Requests';

  const [activeTab, setActiveTab] = useState<HubTab>(initialTab);
  const [filters, setFilters] = useState<HubFilters>(defaultFilters);
  const [sort, setSort] = useState<HubSort>(defaultSort);
  const [page, setPage] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showRightRail, setShowRightRail] = useState(true);

  useEffect(() => {
    setActiveTab(view === 'pending-actions' ? 'Pending Actions' : 'My Requests');
  }, [view]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, filters]);

  const categoryOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.category)), []);
  const ownerOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.owner)), []);
  const statusOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.status)), []);
  const slaOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.sla)), []);
  const priorityOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.priority)), []);
  const dateRangeOptions = useMemo(() => {
    const labels = myServiceRequests
      .map((item) => monthLabel(item.submittedOn))
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => parseRequestDate(`01 ${b}`) - parseRequestDate(`01 ${a}`));
    return ['All dates', ...Array.from(new Set(labels))];
  }, []);

  const tabRequests = useMemo(() => requestsForTab(activeTab), [activeTab]);
  const columns = useMemo(() => columnsForTab(activeTab), [activeTab]);

  const filteredRequests = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const result = tabRequests.filter((request) => {
      const haystack = [
        request.id,
        request.title,
        request.service,
        request.category,
        request.status,
        request.sla,
        request.owner,
        request.requester,
        request.nextAction,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (filters.category !== 'All' && request.category !== filters.category) return false;
      if (filters.status !== 'All' && request.status !== filters.status) return false;
      if (filters.sla !== 'All' && request.sla !== filters.sla) return false;
      if (filters.priority !== 'All' && request.priority !== filters.priority) return false;
      if (filters.owner !== 'All' && request.owner !== filters.owner) return false;
      if (filters.dateRange !== 'All dates' && monthLabel(request.submittedOn) !== filters.dateRange) return false;
      return true;
    });

    if (!sort.key) return result;
    const column = columns.find((item) => item.key === sort.key);
    if (!column?.sortValue) return result;
    const direction = sort.direction === 'asc' ? 1 : -1;
    return [...result].sort((a, b) => {
      const left = column.sortValue!(a);
      const right = column.sortValue!(b);
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * direction;
      return String(left).localeCompare(String(right)) * direction;
    });
  }, [tabRequests, filters, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedRequests = filteredRequests.slice((safePage - 1) * pageSize, safePage * pageSize);

  const filtersActive =
    filters.search.trim() !== '' ||
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    filters.sla !== 'All' ||
    filters.priority !== 'All' ||
    filters.owner !== 'All' ||
    filters.dateRange !== 'All dates';

  const summary = {
    total: myServiceRequests.length,
    open: myServiceRequests.filter((item) => !['Completed', 'Closed'].includes(item.status)).length,
    awaiting: myServiceRequests.filter((item) => item.status === 'Awaiting Info').length,
    completed: myServiceRequests.filter((item) => ['Completed', 'Closed'].includes(item.status)).length,
  };

  const recentlyUpdated = useMemo(
    () => [...myServiceRequests].sort((a, b) => parseRequestDate(b.updated) - parseRequestDate(a.updated)).slice(0, 3),
    [],
  );

  const updateFilter = (key: keyof HubFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => {
    setFilters(defaultFilters);
    setSort(defaultSort);
  };
  const openRequest = (request: ServiceRequest) => navigate(`/services/requests/${request.id}`);
  const onSort = (key: string) =>
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));

  const newRequest = () => navigate('/marketplace/services');
  const saveView = () => {
    localStorage.setItem(savedViewStorageKey, JSON.stringify({ activeTab, filters }));
    toast.success('Service view saved');
  };

  return (
    <div className="w-full px-6 py-6 pb-12 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        <Link className="font-semibold text-primary hover:text-secondary" to="/services">Services</Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-text-secondary">Service Hub</span>
      </nav>

      <header className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="dq-overline mb-2">SERVICE HUB</div>
          <h1 className="dq-page-title">Service Hub</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-primary">
            Track your submitted requests, review pending actions, and follow service request progress across DWS.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-start gap-2 xl:justify-end">
          <DqButton variant="orange" onClick={newRequest} className="h-12 px-5"><Plus size={18} strokeWidth={1.5} /> New Request</DqButton>
          <DqButton variant="navy" onClick={saveView} className="h-12 px-5"><Bookmark size={17} strokeWidth={1.5} /> Save View</DqButton>
          <DqIconButton label="Service Hub settings" onClick={() => setSettingsOpen(true)} className="h-12 w-12"><Settings size={19} strokeWidth={1.5} /></DqIconButton>
        </div>
      </header>

      <div className={`grid gap-6 ${showRightRail ? '2xl:grid-cols-[minmax(0,1fr)_360px]' : 'grid-cols-1'}`}>
        <main className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
            <div className="px-5 pt-5">
              <h2 className="text-lg font-semibold text-primary">My Service Requests</h2>
            </div>
            <HubTabs activeTab={activeTab} onChange={setActiveTab} />
            <HubFilterBar
              filters={filters}
              categoryOptions={categoryOptions}
              statusOptions={statusOptions}
              slaOptions={slaOptions}
              priorityOptions={priorityOptions}
              ownerOptions={ownerOptions}
              dateRangeOptions={dateRangeOptions}
              onFilter={updateFilter}
              onClear={clearFilters}
            />
            <HubTable
              columns={columns}
              requests={pagedRequests}
              sort={sort}
              onSort={onSort}
              onOpen={openRequest}
              emptyState={<HubEmptyState tab={activeTab} filtersActive={filtersActive} onClear={clearFilters} onNew={newRequest} />}
            />
            {filteredRequests.length > pageSize && (
              <Pagination
                page={safePage}
                totalPages={totalPages}
                total={filteredRequests.length}
                onPrev={() => setPage((current) => Math.max(1, current - 1))}
                onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
              />
            )}
          </section>
        </main>

        {showRightRail && (
          <HubRightRail summary={summary} recent={recentlyUpdated} onOpen={openRequest} onSummaryFilter={(status) => { setActiveTab('My Requests'); updateFilter('status', status); }} />
        )}
      </div>

      <HubSettingsModal
        open={settingsOpen}
        showRightRail={showRightRail}
        onToggleRightRail={() => setShowRightRail((current) => !current)}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

function HubTabs({ activeTab, onChange }: { activeTab: HubTab; onChange: (tab: HubTab) => void }) {
  return (
    <div className="dq-tabs mt-2 flex overflow-x-auto px-3" role="tablist" aria-label="Service Hub tabs">
      {hubTabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onChange(tab)}
          className={`dq-tab whitespace-nowrap ${activeTab === tab ? 'dq-tab-active text-secondary' : ''}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function HubFilterBar({
  filters,
  categoryOptions,
  statusOptions,
  slaOptions,
  priorityOptions,
  ownerOptions,
  dateRangeOptions,
  onFilter,
  onClear,
}: {
  filters: HubFilters;
  categoryOptions: string[];
  statusOptions: string[];
  slaOptions: string[];
  priorityOptions: string[];
  ownerOptions: string[];
  dateRangeOptions: string[];
  onFilter: (key: keyof HubFilters, value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="grid gap-3 border-b border-border-subtle bg-white p-4 xl:grid-cols-[minmax(200px,1.4fr)_repeat(3,minmax(140px,1fr))_auto] 2xl:grid-cols-[minmax(220px,1.5fr)_repeat(6,minmax(130px,1fr))_auto]">
      <div className="relative">
        <Search size={17} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
        <input value={filters.search} onChange={(event) => onFilter('search', event.target.value)} placeholder="Search requests..." className="dq-input h-11 pl-10" />
      </div>
      <HubFilterSelect label="Service Category" value={filters.category} options={categoryOptions} onChange={(value) => onFilter('category', value)} />
      <HubFilterSelect label="Status" value={filters.status} options={statusOptions} onChange={(value) => onFilter('status', value)} />
      <HubFilterSelect label="SLA Status" value={filters.sla} options={slaOptions} onChange={(value) => onFilter('sla', value)} />
      <HubFilterSelect label="Priority" value={filters.priority} options={priorityOptions} onChange={(value) => onFilter('priority', value)} />
      <HubFilterSelect label="Owner" value={filters.owner} options={ownerOptions} onChange={(value) => onFilter('owner', value)} />
      <HubFilterSelect label="Date Range" value={filters.dateRange} options={dateRangeOptions} onChange={(value) => onFilter('dateRange', value)} />
      <DqButton variant="outline" onClick={onClear} className="h-11 whitespace-nowrap border-border-default px-4">
        <RotateCcw size={16} strokeWidth={1.5} /> Clear Filters
      </DqButton>
    </div>
  );
}

function HubFilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="relative block">
      <span className="absolute left-3 top-1.5 z-10 text-[11px] font-semibold text-text-muted">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full appearance-none rounded-button border-[1.5px] border-border-default bg-white px-3 pb-1.5 pt-5 text-sm font-semibold text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown size={15} strokeWidth={1.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary" />
    </label>
  );
}

function HubTable({
  columns,
  requests,
  sort,
  onSort,
  onOpen,
  emptyState,
}: {
  columns: HubColumn[];
  requests: ServiceRequest[];
  sort: HubSort;
  onSort: (key: string) => void;
  onOpen: (request: ServiceRequest) => void;
  emptyState: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1080px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-subtle bg-surface">
            {columns.map((column) => (
              <th key={column.key} className={`px-4 py-3 text-xs font-semibold uppercase text-[#454560] ${column.align === 'center' ? 'text-center' : ''}`} style={column.width ? { width: column.width } : undefined}>
                {column.sortable ? (
                  <button onClick={() => onSort(column.key)} className="inline-flex items-center gap-1 hover:text-primary">
                    {column.label} <span className="text-[11px]">{sort.key === column.key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {requests.map((request) => (
            <tr key={`${request.id}-${columns[0].key}`} onClick={() => onOpen(request)} className="cursor-pointer transition hover:bg-navy-50">
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3.5 text-sm ${column.align === 'center' ? 'text-center' : ''}`}>
                  {column.render(request)}
                </td>
              ))}
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-14">{emptyState}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function HubEmptyState({ tab, filtersActive, onClear, onNew }: { tab: HubTab; filtersActive: boolean; onClear: () => void; onNew: () => void }) {
  if (filtersActive) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <FileSearch size={38} strokeWidth={1.5} className="text-text-muted" />
        <h3 className="mt-3 text-lg font-bold text-primary">No requests found</h3>
        <p className="mt-1 text-sm text-text-secondary">Try adjusting your search or clearing filters.</p>
        <DqButton variant="outline" onClick={onClear} className="mt-4">Clear Filters</DqButton>
      </div>
    );
  }
  if (tab === 'Pending Actions') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <ClipboardList size={38} strokeWidth={1.5} className="text-text-muted" />
        <h3 className="mt-3 text-lg font-bold text-primary">No pending actions</h3>
        <p className="mt-1 text-sm text-text-secondary">You do not have any service request actions waiting for your response.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <FileSearch size={38} strokeWidth={1.5} className="text-text-muted" />
      <h3 className="mt-3 text-lg font-bold text-primary">No service requests yet</h3>
      <p className="mt-1 text-sm text-text-secondary">Requests you submit through the Service Marketplace will appear here.</p>
      <DqButton variant="orange" onClick={onNew} className="mt-4">Start New Request</DqButton>
    </div>
  );
}

function Pagination({ page, totalPages, total, onPrev, onNext }: { page: number; totalPages: number; total: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border-subtle bg-white px-5 py-3">
      <span className="text-sm font-medium text-text-secondary">Page {page} of {totalPages} · {total} requests</span>
      <div className="flex gap-2">
        <DqButton variant="outline" onClick={onPrev} className="h-9 px-4" disabled={page <= 1}>Previous</DqButton>
        <DqButton variant="outline" onClick={onNext} className="h-9 px-4" disabled={page >= totalPages}>Next</DqButton>
      </div>
    </div>
  );
}

function HubRightRail({
  summary,
  recent,
  onOpen,
  onSummaryFilter,
}: {
  summary: { total: number; open: number; awaiting: number; completed: number };
  recent: ServiceRequest[];
  onOpen: (request: ServiceRequest) => void;
  onSummaryFilter: (status: string) => void;
}) {
  return (
    <aside className="space-y-5">
      <HubRailCard title="Service Summary" action={<ClipboardList size={20} strokeWidth={1.5} />}>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3 px-2 py-2 text-sm font-semibold text-primary"><span>Total Requests</span><span>{summary.total}</span></div>
          <button onClick={() => onSummaryFilter('All')} className="flex w-full items-center justify-between gap-3 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50"><span>Open Requests</span><span>{summary.open}</span></button>
          <button onClick={() => onSummaryFilter('Awaiting Info')} className="flex w-full items-center justify-between gap-3 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50"><span>Awaiting Information</span><span>{summary.awaiting}</span></button>
          <button onClick={() => onSummaryFilter('Completed')} className="flex w-full items-center justify-between gap-3 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50"><span>Completed Requests</span><span>{summary.completed}</span></button>
        </div>
      </HubRailCard>

      <HubRailCard title="Recently Updated" action={<History size={20} strokeWidth={1.5} />}>
        <div className="space-y-4">
          {recent.map((request) => (
            <button key={request.id} onClick={() => onOpen(request)} className="block w-full rounded-button text-left hover:bg-navy-50">
              <div className="text-sm font-bold text-info-text">{request.title}</div>
              <div className="mt-1 text-sm font-medium text-primary">{request.id} · {request.updated}</div>
            </button>
          ))}
        </div>
      </HubRailCard>

      <HubRailCard title="How it works">
        <p className="text-sm leading-6 text-text-secondary">
          Use <span className="font-semibold text-primary">My Requests</span> to track requests you submitted. Use <span className="font-semibold text-primary">Pending Actions</span> to respond to missing information, comments, closure review, or service rating requests.
        </p>
      </HubRailCard>
    </aside>
  );
}

function HubRailCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-card border border-border-default bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
        <h2 className="dq-card-title">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function HubSettingsModal({ open, showRightRail, onToggleRightRail, onClose }: { open: boolean; showRightRail: boolean; onToggleRightRail: () => void; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/25" onClick={onClose} />
      <section className="fixed left-1/2 top-1/2 z-[220] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card border border-border-default bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-primary">Service Hub Settings</h2>
          <DqIconButton label="Close Service Hub settings" onClick={onClose}><X size={18} strokeWidth={1.5} /></DqIconButton>
        </div>
        <section className="mb-4 rounded-card border border-border-subtle p-4">
          <h3 className="mb-2 text-sm font-bold text-primary">Display</h3>
          <button onClick={onToggleRightRail} className="flex w-full items-center justify-between gap-4 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50">
            <span>Show summary column</span>
            <span className={`relative h-6 w-11 rounded-full transition ${showRightRail ? 'bg-secondary' : 'bg-border-default'}`}>
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${showRightRail ? 'left-6' : 'left-1'}`} />
            </span>
          </button>
        </section>
        <p className="text-sm text-text-secondary">Additional Service Hub settings will be available in a future update.</p>
        <div className="mt-5 flex justify-end">
          <DqButton variant="orange" onClick={onClose}>Done</DqButton>
        </div>
      </section>
    </>
  );
}

function requestsForTab(tab: HubTab): ServiceRequest[] {
  switch (tab) {
    case 'Pending Actions':
      return myServiceRequests.filter((request) => Boolean(request.pendingAction));
    case 'Recently Updated':
      return [...myServiceRequests].sort((a, b) => parseRequestDate(b.updated) - parseRequestDate(a.updated));
    case 'Awaiting Information':
      return myServiceRequests.filter((request) => request.status === 'Awaiting Info');
    case 'Closed / Completed':
      return myServiceRequests.filter((request) => ['Completed', 'Closed'].includes(request.status));
    case 'My Requests':
    default:
      return myServiceRequests;
  }
}

const requestTitleCell = (request: ServiceRequest) => <span className="font-medium text-primary">{request.title}</span>;
const requestIdCell = (request: ServiceRequest) => <span className="font-bold text-info-text">{request.id}</span>;
const openActionCell = () => (
  <span className="whitespace-nowrap font-bold text-info-text">Open request →</span>
);

function columnsForTab(tab: HubTab): HubColumn[] {
  if (tab === 'Pending Actions') {
    return [
      { key: 'action', label: 'Action', width: '200px', render: (r) => <span className="font-semibold text-primary">{r.pendingAction}</span> },
      { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
      { key: 'title', label: 'Request Title', width: '220px', render: requestTitleCell },
      { key: 'service', label: 'Service', width: '160px', render: (r) => <span className="font-medium text-primary">{r.service}</span> },
      { key: 'dueDate', label: 'Due Date', width: '120px', sortable: true, render: (r) => <span className="text-primary">{r.dueDate ?? '—'}</span>, sortValue: (r) => parseRequestDate(r.dueDate) },
      { key: 'priority', label: 'Priority', width: '110px', render: (r) => <PriorityBadge priority={r.priority} /> },
      { key: 'status', label: 'Status', width: '130px', render: (r) => <StatusBadge label={r.status} /> },
      { key: 'cta', label: 'Action', width: '140px', render: openActionCell },
    ];
  }
  if (tab === 'Recently Updated') {
    return [
      { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
      { key: 'title', label: 'Request Title', width: '210px', render: requestTitleCell },
      { key: 'latestUpdate', label: 'Latest Update', width: '260px', render: (r) => <span className="text-text-secondary">{r.latestUpdate}</span> },
      { key: 'updatedBy', label: 'Updated By', width: '150px', render: (r) => <span className="font-semibold text-primary">{r.updatedBy}</span> },
      { key: 'updated', label: 'Last Updated', width: '130px', sortable: true, render: (r) => <span className="text-primary">{r.updated}</span>, sortValue: (r) => parseRequestDate(r.updated) },
      { key: 'status', label: 'Status', width: '130px', render: (r) => <StatusBadge label={r.status} /> },
      { key: 'cta', label: 'Action', width: '140px', render: openActionCell },
    ];
  }
  if (tab === 'Awaiting Information') {
    return [
      { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
      { key: 'title', label: 'Request Title', width: '210px', render: requestTitleCell },
      { key: 'requiredInfo', label: 'Required Information', width: '240px', render: (r) => <span className="text-text-secondary">{r.requiredInfo}</span> },
      { key: 'requestedBy', label: 'Requested By', width: '160px', render: (r) => <span className="font-semibold text-primary">{r.requestedBy}</span> },
      { key: 'dueDate', label: 'Due Date', width: '120px', sortable: true, render: (r) => <span className="text-primary">{r.dueDate ?? '—'}</span>, sortValue: (r) => parseRequestDate(r.dueDate) },
      { key: 'sla', label: 'SLA Status', width: '120px', render: (r) => <StatusBadge label={r.sla} /> },
      { key: 'cta', label: 'Action', width: '160px', render: () => <span className="whitespace-nowrap font-bold text-info-text">Provide Information →</span> },
    ];
  }
  if (tab === 'Closed / Completed') {
    return [
      { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
      { key: 'title', label: 'Request Title', width: '220px', render: requestTitleCell },
      { key: 'service', label: 'Service', width: '170px', render: (r) => <span className="font-medium text-primary">{r.service}</span> },
      { key: 'closedOn', label: 'Closed On', width: '130px', sortable: true, render: (r) => <span className="text-primary">{r.closedOn ?? '—'}</span>, sortValue: (r) => parseRequestDate(r.closedOn) },
      { key: 'closureStatus', label: 'Closure Status', width: '140px', render: (r) => <StatusBadge label={r.closureStatus ?? r.sla} /> },
      { key: 'rating', label: 'Rating', width: '120px', render: (r) => <Rating value={r.rating} /> },
      { key: 'cta', label: 'Action', width: '150px', render: (r) => <span className="whitespace-nowrap font-bold text-info-text">{r.rating ? 'View closure →' : 'Submit rating →'}</span> },
    ];
  }
  return [
    { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
    { key: 'title', label: 'Request Title', width: '200px', sortable: true, render: requestTitleCell, sortValue: (r) => r.title },
    { key: 'service', label: 'Service', width: '160px', render: (r) => <span className="font-medium text-primary">{r.service}</span> },
    { key: 'status', label: 'Status', width: '120px', sortable: true, render: (r) => <StatusBadge label={r.status} />, sortValue: (r) => r.status },
    { key: 'sla', label: 'SLA', width: '110px', render: (r) => <StatusBadge label={r.sla} /> },
    { key: 'priority', label: 'Priority', width: '110px', sortable: true, render: (r) => <PriorityBadge priority={r.priority} />, sortValue: (r) => priorityRank(r.priority) },
    { key: 'submittedOn', label: 'Submitted On', width: '130px', sortable: true, render: (r) => <span className="text-primary">{r.submittedOn}</span>, sortValue: (r) => parseRequestDate(r.submittedOn) },
    { key: 'updated', label: 'Last Updated', width: '130px', sortable: true, render: (r) => <span className="text-primary">{r.updated}</span>, sortValue: (r) => parseRequestDate(r.updated) },
    { key: 'nextAction', label: 'Next Action', width: '200px', render: (r) => <span className="text-text-secondary">{r.nextAction}</span> },
    { key: 'cta', label: 'Action', width: '140px', render: openActionCell },
  ];
}

function buildOptions(values: Array<string | undefined>): string[] {
  return ['All', ...Array.from(new Set(values.filter((value): value is string => Boolean(value))))];
}

function priorityRank(priority: ServiceRequest['priority']) {
  return { Low: 1, Medium: 2, High: 3, Critical: 4 }[priority];
}

function PriorityBadge({ priority }: { priority: ServiceRequest['priority'] }) {
  const tone = priority === 'Critical' || priority === 'High' ? 'text-danger' : priority === 'Medium' ? 'text-warning' : 'text-success';
  return <span className={`text-sm font-bold ${tone}`}>{priority}</span>;
}

function Rating({ value }: { value?: number }) {
  if (!value) return <span className="text-sm font-medium text-text-muted">Not rated</span>;
  return <span className="text-sm font-bold text-primary">{'★'.repeat(value)}<span className="text-text-muted">{'★'.repeat(5 - value)}</span></span>;
}

/* -------------------------------------------------------------------------- */
/*                            Request Queues                                  */
/* -------------------------------------------------------------------------- */

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
  const request = allRequests.find((item) => item.id === requestId) ?? allRequests[0];

  return (
    <ServicesPageFrame
      breadcrumbs={[{ label: 'Services', route: '/services' }, { label: 'Service Hub', route: '/services/service-hub' }, { label: request.id }]}
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

function StatusBadge({ label }: { label: string }) {
  const tone = ['Breached', 'Critical', 'Escalated', 'Overdue'].includes(label)
    ? 'bg-danger-surface text-danger-text'
    : ['At Risk', 'Pending Information', 'Awaiting Info', 'On Hold', 'Ready for Closure', 'Closure Review', 'Paused'].includes(label)
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
