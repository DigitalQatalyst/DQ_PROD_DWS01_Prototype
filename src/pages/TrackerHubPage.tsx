import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Folder,
  LayoutGrid,
  Plus,
  Save,
  Search,
  Settings,
  ShieldAlert,
  Target,
  UserCheck,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DqButton, DqIconButton } from '../components/DqButton';
import { DqBadge, StatusBadge } from '../components/DqBadge';
import { getTrackerByName, trackerDefinitions } from '../mocks/trackers.mock';

type TrackerHealth = 'Green' | 'Amber' | 'Red';
type TrackerStatus = 'In Progress' | 'Overdue' | 'Awaiting Review' | 'Blocked' | 'Needs Update' | 'Completed';
type TrackerPriority = 'Low' | 'Medium' | 'High' | 'Critical';

interface TrackerCardModel {
  slug: string;
  name: string;
  purpose?: string;
  owner: string;
  active: number;
  overdue: number;
  lastUpdated?: string;
  status: TrackerHealth;
  icon: LucideIcon;
}

interface TrackerItem {
  id: string;
  tracker: string;
  title: string;
  owner: string;
  status: TrackerStatus;
  priority: TrackerPriority;
  dueDate: string;
  rag: TrackerHealth;
  lastUpdated: string;
  nextAction: string;
  description: string;
  latestUpdate: string;
  comments: string[];
  evidence: string[];
  activity: string[];
}

const trackerIcons: Record<string, LucideIcon> = {
  'workload-distribution-tracker': Folder,
  'squad-backlog-tracker': ClipboardCheck,
  'project-backlog-tracker': FileText,
  'strategic-initiatives-tracker': Target,
  'project-health-tracker': Activity,
  'governance-follow-up-tracker': ShieldAlert,
  'decision-tracker': FileText,
  'action-log-tracker': UserCheck,
  'risk-issue-tracker': AlertTriangle,
};

const trackers: TrackerCardModel[] = trackerDefinitions.map((tracker) => ({
  slug: tracker.slug,
  name: tracker.name,
  purpose: tracker.purpose.replace(/\.$/, ''),
  owner: tracker.owner,
  active: tracker.activeRecords,
  overdue: tracker.overdueRecords,
  lastUpdated: tracker.lastUpdated,
  status: tracker.healthStatus,
  icon: trackerIcons[tracker.slug] || Folder,
}));

const seededItems: TrackerItem[] = [
  {
    id: 'TRK-1042',
    tracker: 'Project Health Tracker',
    title: 'Update vendor risk workstream',
    owner: 'Bilal Waqar',
    status: 'In Progress',
    priority: 'High',
    dueDate: 'Today',
    rag: 'Amber',
    lastUpdated: '09:30 AM',
    nextAction: 'Add weekly update',
    description: 'Vendor risk workstream needs the latest status, delivery confidence, and mitigation note before Friday governance review.',
    latestUpdate: 'Risk owner confirmed mitigation plan; evidence links still need to be attached.',
    comments: ['Bilal Waqar: Weekly update drafted.', 'Sara Khan: Please include evidence links.'],
    evidence: ['Vendor risk register', 'Weekly workstream update'],
    activity: ['Created 15 May 2025', 'Assigned to Bilal Waqar', 'RAG moved to Amber today'],
  },
  {
    id: 'ACT-224',
    tracker: 'Action Log Tracker',
    title: 'Close leadership follow-up on service review',
    owner: 'Sara Khan',
    status: 'Overdue',
    priority: 'High',
    dueDate: '16 May',
    rag: 'Red',
    lastUpdated: 'Yesterday',
    nextAction: 'Upload evidence',
    description: 'Leadership action requires closure evidence from the service review cycle.',
    latestUpdate: 'Owner awaiting final evidence attachment from service operations.',
    comments: ['Ali Raza: Evidence still pending.'],
    evidence: ['Service review notes'],
    activity: ['Created 12 May 2025', 'Due date missed 16 May', 'Escalated to Red'],
  },
  {
    id: 'DEC-077',
    tracker: 'Decision Tracker',
    title: 'Confirm Q3 delivery sequencing',
    owner: 'Ali Raza',
    status: 'Awaiting Review',
    priority: 'Medium',
    dueDate: '18 May',
    rag: 'Amber',
    lastUpdated: 'Today',
    nextAction: 'Review decision note',
    description: 'Decision note needs review before Q3 sequencing can be confirmed.',
    latestUpdate: 'Draft decision note submitted to delivery leadership.',
    comments: ['Hina Adam: Add dependency note.'],
    evidence: ['Decision note draft'],
    activity: ['Decision drafted', 'Sent for review today'],
  },
  {
    id: 'RSK-119',
    tracker: 'Risk / Issue Tracker',
    title: 'Dependency blocking security rollout',
    owner: 'Hina Adam',
    status: 'Blocked',
    priority: 'Critical',
    dueDate: '17 May',
    rag: 'Red',
    lastUpdated: 'Today',
    nextAction: 'Resolve blocker',
    description: 'Security rollout is blocked by an unresolved dependency across integration owners.',
    latestUpdate: 'Blocker remains open after escalation.',
    comments: ['Bilal Waqar: Escalated to integration owner.'],
    evidence: ['Dependency log', 'Escalation note'],
    activity: ['Risk opened', 'Owner changed to Hina Adam', 'Marked blocked today'],
  },
  {
    id: 'GOV-305',
    tracker: 'Governance Follow-up Tracker',
    title: 'Submit governance review evidence',
    owner: 'Bilal Waqar',
    status: 'Needs Update',
    priority: 'Medium',
    dueDate: '19 May',
    rag: 'Amber',
    lastUpdated: '08:45 AM',
    nextAction: 'Add comment',
    description: 'Governance review evidence requires a final owner comment and upload confirmation.',
    latestUpdate: 'Evidence collected; final comment not yet posted.',
    comments: ['Governance Office: Please add owner comment.'],
    evidence: ['Review checklist'],
    activity: ['Evidence requested', 'Owner reminder sent 08:45 AM'],
  },
];

const tabs = [
  { label: 'Overview', icon: LayoutGrid },
  { label: 'My Tracker Items', icon: UserCheck },
  { label: 'Active Tracker', icon: Folder },
  { label: 'Health', icon: BarChart3 },
  { label: 'About Tracker', icon: ShieldAlert },
];

export function TrackerHubPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [items, setItems] = useState<TrackerItem[]>(seededItems);
  const [selectedItem, setSelectedItem] = useState<TrackerItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    tracker: 'All Tracker Types',
    owner: 'All Owners',
    status: 'All Statuses',
    priority: 'All Priorities',
    rag: 'All RAG',
    dueDate: 'All Due Dates',
  });

  const filteredItems = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return items
      .filter((item) => !query || `${item.id} ${item.tracker} ${item.title} ${item.owner} ${item.nextAction}`.toLowerCase().includes(query))
      .filter((item) => filters.tracker === 'All Tracker Types' || item.tracker === filters.tracker)
      .filter((item) => filters.owner === 'All Owners' || item.owner === filters.owner)
      .filter((item) => filters.status === 'All Statuses' || item.status === filters.status)
      .filter((item) => filters.priority === 'All Priorities' || item.priority === filters.priority)
      .filter((item) => filters.rag === 'All RAG' || item.rag === filters.rag)
      .filter((item) => filters.dueDate === 'All Due Dates' || item.dueDate === filters.dueDate || (filters.dueDate === 'Today' && item.dueDate === 'Today'));
  }, [filters, items]);

  const updateFilter = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => {
    setFilters({ search: '', tracker: 'All Tracker Types', owner: 'All Owners', status: 'All Statuses', priority: 'All Priorities', rag: 'All RAG', dueDate: 'All Due Dates' });
    setActiveFilter(null);
  };
  const applyKpiFilter = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'assigned') updateFilter('owner', 'Bilal Waqar');
    if (filter === 'overdue') updateFilter('status', 'Overdue');
    if (filter === 'review') updateFilter('status', 'Awaiting Review');
    if (filter === 'rag') updateFilter('rag', 'Red');
    if (filter === 'active') toast.info('Active tracker filter applied');
  };
  const openTracker = (name: string) => {
    const tracker = getTrackerByName(name);
    if (!tracker) {
      toast.info(`${name} opened`);
      return;
    }
    navigate(`/tracker/active-tracker/${tracker.slug}`);
  };

  return (
    <div className="w-full px-5 py-6 pb-12 sm:px-6 lg:px-8">
      <header className="mb-6">
        <Breadcrumb items={['Tracker', 'Tracker Hub']} />
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div>
            <div className="dq-overline mb-2">TRACKER WORKSPACE</div>
            <h1 className="dq-page-title">Tracker Hub</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-primary">
              Monitor live trackers, assigned records, overdue items, health signals, and follow-up actions across DWS.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <DqButton variant="orange" onClick={() => toast.success('Create tracker item opened')}><Plus size={16} strokeWidth={1.5} /> Create Tracker Item</DqButton>
            <DqButton variant="navy" onClick={() => toast.success('Tracker view saved')}><Save size={16} strokeWidth={1.5} /> Save View</DqButton>
            <DqIconButton label="Tracker settings" onClick={() => toast.info('Tracker settings opened')}><Settings size={18} strokeWidth={1.5} /></DqIconButton>
          </div>
        </div>
      </header>

      <section className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard active={activeFilter === 'active'} label="Active Trackers" value="9" trend="↗ -2 this week" icon={Folder} accent="blue" onClick={() => applyKpiFilter('active')} />
        <KpiCard active={activeFilter === 'assigned'} label="My Assigned Items" value="26" trend="↘ -4 due today" icon={UserCheck} accent="green" onClick={() => applyKpiFilter('assigned')} />
        <KpiCard active={activeFilter === 'overdue'} label="Overdue Records" value="7" trend="↘ -1 vs yesterday" icon={AlertTriangle} accent="red" onClick={() => applyKpiFilter('overdue')} />
        <KpiCard active={activeFilter === 'review'} label="Awaiting My Review" value="5" trend="↔ +1 pending" icon={ClipboardCheck} accent="purple" onClick={() => applyKpiFilter('review')} />
        <KpiCard active={activeFilter === 'rag'} label="RAG Alerts" value="11" trend="3 red / 8 amber" icon={ShieldAlert} accent="orange" onClick={() => applyKpiFilter('rag')} />
      </section>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0">
          <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
            <div className="dq-tabs flex overflow-x-auto px-4" role="tablist" aria-label="Tracker Hub tabs">
              {tabs.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  role="tab"
                  aria-selected={activeTab === label}
                  onClick={() => setActiveTab(label)}
                  className={`dq-tab inline-flex items-center gap-2 whitespace-nowrap ${activeTab === label ? 'dq-tab-active text-secondary' : ''}`}>
                  <Icon size={16} strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === 'Overview' && (
                <>
                  <TrackerOverview trackers={trackers} onOpenTracker={openTracker} />
                  <TrackerItemsSection
                    filters={filters}
                    items={filteredItems}
                    onFilter={updateFilter}
                    onClear={clearFilters}
                    onOpenItem={setSelectedItem}
                  />
                </>
              )}
              {activeTab === 'My Tracker Items' && (
                <TrackerItemsSection
                  filters={filters}
                  items={filteredItems}
                  onFilter={updateFilter}
                  onClear={clearFilters}
                  onOpenItem={setSelectedItem}
                />
              )}
              {activeTab === 'Active Tracker' && <ActiveTrackerPreview onOpen={() => navigate('/tracker/active-tracker/project-health-tracker')} />}
              {activeTab === 'Health' && <HealthPreview />}
              {activeTab === 'About Tracker' && <AboutTrackerPanel />}
            </div>
          </section>
        </main>

        <RightRail onOpenTracker={() => navigate('/tracker/active-tracker/project-health-tracker')} />
      </div>

      <TrackerDetailDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSave={(updated) => {
          setItems((current) => current.map((item) => item.id === updated.id ? updated : item));
          setSelectedItem(updated);
          toast.success('Tracker record updated');
        }}
      />
    </div>
  );
}

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item} className="inline-flex items-center gap-2">
          {index > 0 && <span className="text-text-muted">/</span>}
          <span className={index === items.length - 1 ? 'font-bold' : ''}>{item}</span>
        </span>
      ))}
    </nav>
  );
}

function KpiCard({ label, value, trend, icon: Icon, accent, active, onClick }: { label: string; value: string; trend: string; icon: LucideIcon; accent: 'blue' | 'orange' | 'red' | 'purple' | 'green'; active?: boolean; onClick: () => void }) {
  const styles = {
    blue: 'border-t-info text-info-text bg-info-surface',
    orange: 'border-t-secondary text-secondary bg-orange-50',
    red: 'border-t-danger text-danger-text bg-danger-surface',
    purple: 'border-t-[#7c3aed] text-[#6d28d9] bg-[#f3e8ff]',
    green: 'border-t-success text-success-text bg-success-surface',
  }[accent];
  const [borderClass, textClass, bgClass] = styles.split(' ');
  return (
    <button onClick={onClick} className={`dq-card dq-card-clickable min-h-[124px] border-t-4 text-left ${borderClass} ${active ? 'ring-2 ring-secondary/40' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-primary">{label}</div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-primary">{value}</div>
          <div className="mt-3 text-xs font-semibold text-primary">{trend}</div>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-button ${bgClass} ${textClass}`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
      </div>
    </button>
  );
}

function TrackerOverview({ trackers: trackerCards, onOpenTracker }: { trackers: TrackerCardModel[]; onOpenTracker: (name: string) => void }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-6 w-6 place-items-center rounded-button border border-border-default bg-white text-xs font-bold text-primary">1</span>
        <h2 className="dq-card-title">Tracker Overview Dashboard</h2>
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        {trackerCards.slice(0, 6).map((tracker) => <TrackerCard key={tracker.name} tracker={tracker} onOpen={() => onOpenTracker(tracker.name)} />)}
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-4">
        {trackerCards.slice(6).map((tracker) => <TrackerMiniCard key={tracker.name} tracker={tracker} onOpen={() => onOpenTracker(tracker.name)} />)}
        <button onClick={() => toast.info('All trackers opened')} className="dq-card dq-card-clickable flex min-h-[92px] items-center justify-center text-center">
          <span>
            <span className="block text-lg font-bold text-primary">+ 6 more trackers</span>
            <span className="mt-1 block text-sm font-bold text-info-text">View all trackers →</span>
          </span>
        </button>
      </div>
    </section>
  );
}

function TrackerCard({ tracker, onOpen }: { tracker: TrackerCardModel; onOpen: () => void }) {
  const Icon = tracker.icon;
  return (
    <article className="dq-card dq-card-clickable flex min-h-[164px] flex-col">
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-button ${tracker.status === 'Red' ? 'bg-danger-surface text-danger-text' : tracker.status === 'Amber' ? 'bg-warning-surface text-warning-text' : 'bg-success-surface text-success-text'}`}>
          <Icon size={20} strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-primary">{tracker.name}</h3>
          <p className="mt-1 text-xs font-semibold text-text-secondary">Purpose: {tracker.purpose}</p>
          <p className="text-xs font-semibold text-primary">Owner: {tracker.owner}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-y border-border-subtle py-3 text-xs">
        <Metric label="Active" value={tracker.active} />
        <Metric label="Overdue" value={tracker.overdue} danger />
        <Metric label="Last Updated" value={tracker.lastUpdated || 'Today'} />
      </div>
      <div className="mt-auto flex items-center justify-between pt-3">
        <HealthDot status={tracker.status} />
        <button onClick={onOpen} className="text-xs font-bold text-info-text hover:text-primary">Open tracker →</button>
      </div>
    </article>
  );
}

function TrackerMiniCard({ tracker, onOpen }: { tracker: TrackerCardModel; onOpen: () => void }) {
  const Icon = tracker.icon;
  return (
    <article className="dq-card dq-card-clickable min-h-[92px]">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-button bg-navy-50 text-primary"><Icon size={18} strokeWidth={1.5} /></span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-primary">{tracker.name}</h3>
          <p className="text-xs font-semibold text-primary">Owner: {tracker.owner}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-primary">
            <span>Active {tracker.active}</span>
            <span>Overdue <span className="text-danger">{tracker.overdue}</span></span>
            <HealthDot status={tracker.status} />
          </div>
        </div>
      </div>
      <button onClick={onOpen} className="mt-2 text-xs font-bold text-info-text hover:text-primary">Open tracker →</button>
    </article>
  );
}

function Metric({ label, value, danger }: { label: string; value: number | string; danger?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-text-muted">{label}</div>
      <div className={`mt-1 font-mono text-sm font-bold ${danger ? 'text-danger' : 'text-primary'}`}>{value}</div>
    </div>
  );
}

function HealthDot({ status }: { status: TrackerHealth }) {
  const color = status === 'Red' ? 'bg-danger text-danger' : status === 'Amber' ? 'bg-warning text-warning' : 'bg-success text-success';
  return <span className="inline-flex items-center gap-1.5 text-xs font-bold"><span className={`h-2 w-2 rounded-full ${color.split(' ')[0]}`} />Status: <span className={color.split(' ')[1]}>{status}</span></span>;
}

function TrackerItemsSection({ filters, items, onFilter, onClear, onOpenItem }: { filters: Record<string, string>; items: TrackerItem[]; onFilter: (key: keyof typeof filters, value: string) => void; onClear: () => void; onOpenItem: (item: TrackerItem) => void }) {
  return (
    <section className="mt-4 rounded-card border border-border-default bg-white shadow-sm">
      <div className="border-b border-border-subtle p-4">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-6 w-6 place-items-center rounded-button border border-border-default bg-white text-xs font-bold text-primary">2</span>
          <h2 className="dq-card-title">My Tracker Items</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[260px] flex-1">
            <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={filters.search} onChange={(event) => onFilter('search', event.target.value)} placeholder="Search my items..." className="dq-input pl-9" />
          </div>
          <FilterSelect value={filters.tracker} onChange={(value) => onFilter('tracker', value)} options={['All Tracker Types', ...Array.from(new Set(seededItems.map((item) => item.tracker)))]} />
          <FilterSelect value={filters.owner} onChange={(value) => onFilter('owner', value)} options={['All Owners', ...Array.from(new Set(seededItems.map((item) => item.owner)))]} />
          <FilterSelect value={filters.status} onChange={(value) => onFilter('status', value)} options={['All Statuses', 'In Progress', 'Overdue', 'Awaiting Review', 'Blocked', 'Needs Update']} />
          <FilterSelect value={filters.priority} onChange={(value) => onFilter('priority', value)} options={['All Priorities', 'Critical', 'High', 'Medium', 'Low']} />
          <FilterSelect value={filters.rag} onChange={(value) => onFilter('rag', value)} options={['All RAG', 'Red', 'Amber', 'Green']} />
          <FilterSelect value={filters.dueDate} onChange={(value) => onFilter('dueDate', value)} options={['All Due Dates', 'Today', '16 May', '17 May', '18 May', '19 May']} />
          <button onClick={onClear} className="px-2 text-sm font-bold text-secondary hover:text-danger">Clear</button>
          <DqButton variant="outline" onClick={() => toast.info('Tracker filters opened')}><LayoutGrid size={15} strokeWidth={1.5} /> Filters</DqButton>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle bg-surface">
              {['Record ID', 'Tracker', 'Title', 'Owner', 'Status', 'Due Date', 'RAG', 'Last Updated', 'Next Action', ''].map((header) => (
                <th key={header || 'action'} className="px-4 py-3 text-xs font-bold uppercase text-[#454560]">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle bg-white">
            {items.map((item) => (
              <tr key={item.id} onClick={() => onOpenItem(item)} className="cursor-pointer hover:bg-navy-50">
                <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{item.id}</td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">{item.tracker}</td>
                <td className="max-w-[260px] px-4 py-3 text-sm font-semibold text-primary">{item.title}</td>
                <td className="px-4 py-3"><OwnerBadge owner={item.owner} /></td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className={`px-4 py-3 text-sm font-bold ${item.dueDate === 'Today' ? 'text-secondary' : 'text-primary'}`}>{item.dueDate}</td>
                <td className="px-4 py-3"><RagBadge rag={item.rag} /></td>
                <td className="px-4 py-3 text-sm text-text-secondary">{item.lastUpdated}</td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">{item.nextAction}</td>
                <td className="px-4 py-3"><ChevronRight size={17} strokeWidth={1.5} className="text-primary" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle px-4 py-3 text-sm text-text-muted">
        <span>Showing 1 to {items.length} of 26 results</span>
        <div className="flex items-center gap-2">
          <PagerButton><ChevronLeft size={15} strokeWidth={1.5} /></PagerButton>
          {['1', '2', '3'].map((page) => <PagerButton key={page} active={page === '1'}>{page}</PagerButton>)}
          <span className="px-2">...</span>
          <PagerButton>6</PagerButton>
          <PagerButton><ChevronRight size={15} strokeWidth={1.5} /></PagerButton>
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-button border border-border-default px-3 font-semibold text-primary">10 / page <ChevronDown size={14} strokeWidth={1.5} /></button>
      </div>
    </section>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative inline-flex h-10 min-w-[128px] items-center">
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-button border-[1.5px] border-border-default bg-white px-3 pr-8 text-sm font-semibold text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown size={15} strokeWidth={1.5} className="pointer-events-none absolute right-3 text-text-muted" />
    </label>
  );
}

function OwnerBadge({ owner }: { owner: string }) {
  const initials = owner.split(' ').map((part) => part[0]).join('').slice(0, 2);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">{initials}</span>
      <span className="text-sm font-semibold text-primary">{owner}</span>
    </span>
  );
}

function RagBadge({ rag }: { rag: TrackerHealth }) {
  const tone = rag === 'Red' ? 'danger' : rag === 'Amber' ? 'warning' : 'success';
  return <DqBadge label={rag} tone={tone} dot={false} />;
}

function PagerButton({ children, active }: { children: ReactNode; active?: boolean }) {
  return <button className={`grid h-8 min-w-8 place-items-center rounded-button border text-sm font-bold ${active ? 'border-primary bg-primary text-white' : 'border-border-default bg-white text-primary hover:bg-navy-50'}`}>{children}</button>;
}

function RightRail({ onOpenTracker }: { onOpenTracker: () => void }) {
  return (
    <aside className="space-y-4">
      <RailCard title="Active Tracker Workspace" icon={Activity}>
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-info-surface text-info-text"><Target size={19} strokeWidth={1.5} /></span>
          <div>
            <div className="text-base font-bold text-primary">Project Health Tracker</div>
            <p className="text-xs font-semibold text-text-muted">Monitor project health signals and risks</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-card border border-border-subtle bg-border-subtle">
          {[
            ['Total Records', '18'],
            ['Open', '12'],
            ['Closed', '6'],
            ['Overdue', '4'],
            ['Missing Owner', '1'],
            ['Not Updated Recently', '3'],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-3">
              <div className="text-[11px] font-bold text-text-muted">{label}</div>
              <div className="mt-1 font-mono text-lg font-bold text-primary">{value}</div>
            </div>
          ))}
        </div>
        <DqButton variant="outline" onClick={onOpenTracker} className="mt-4 w-full">Open tracker →</DqButton>
      </RailCard>

      <RailCard title="Tracker Health Summary" icon={BarChart3}>
        <div className="space-y-3">
          <RailBar label="Open Records" value={64} color="bg-info" max={70} />
          <RailBar label="Closed Records" value={38} color="bg-success" max={70} />
          <RailBar label="Overdue Records" value={15} color="bg-danger" max={70} />
          <RailBar label="Blocked Records" value={7} color="bg-[#7c3aed]" max={70} />
        </div>
        <div className="mt-5">
          <div className="mb-3 text-sm font-bold text-primary">RAG Split</div>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full" style={{ background: 'conic-gradient(#dc2626 0 18%, #d97706 18% 65%, #16a34a 65% 100%)' }}>
              <div className="m-auto mt-3 h-14 w-14 rounded-full bg-white" />
            </div>
            <div className="flex-1 space-y-2 text-xs font-semibold text-primary">
              <RagLegend color="bg-danger" label="Red" value="3 (18%)" />
              <RagLegend color="bg-warning" label="Amber" value="8 (47%)" />
              <RagLegend color="bg-success" label="Green" value="7 (35%)" />
            </div>
          </div>
        </div>
      </RailCard>

      <RailCard title="About this Tracker" icon={ShieldAlert}>
        <AboutTrackerPanel compact />
      </RailCard>
    </aside>
  );
}

function RailCard({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section className="rounded-card border border-border-default bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-button bg-navy-50 text-primary"><Icon size={17} strokeWidth={1.5} /></span>
        <h2 className="dq-card-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function RailBar({ label, value, color, max }: { label: string; value: number; color: string; max: number }) {
  return (
    <div className="grid grid-cols-[112px_42px_1fr] items-center gap-2 text-xs font-semibold text-primary">
      <span>{label}</span>
      <span className="font-mono font-bold">{value}</span>
      <span className="h-2 rounded-full bg-border-subtle"><span className={`block h-full rounded-full ${color}`} style={{ width: `${Math.round((value / max) * 100)}%` }} /></span>
    </div>
  );
}

function RagLegend({ color, label, value }: { color: string; label: string; value: string }) {
  return <div className="flex justify-between gap-3"><span className="inline-flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</span><span>{value}</span></div>;
}

function ActiveTrackerPreview({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="dq-card">
      <h2 className="dq-card-title">Project Health Tracker</h2>
      <p className="mt-2 text-sm text-text-secondary">Monitor project health signals and risks with governed RAG status, ownership, and update cadence.</p>
      <DqButton variant="outline" onClick={onOpen} className="mt-4">Open tracker →</DqButton>
    </section>
  );
}

function HealthPreview() {
  return (
    <section className="dq-card">
      <h2 className="dq-card-title">Tracker Health Summary</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {['Open Records 64', 'Closed Records 38', 'Overdue Records 15', 'Blocked Records 7'].map((item) => <div key={item} className="rounded-card bg-surface p-4 text-sm font-bold text-primary">{item}</div>)}
      </div>
    </section>
  );
}

function AboutTrackerPanel({ compact }: { compact?: boolean }) {
  const rows = [
    ['Type', 'Project Health Tracker'],
    ['Required Fields', 'Title, Owner, Status, Due Date, RAG, Last Update'],
    ['Optional Fields', 'Impact, Priority, Notes, Links, Attachments'],
    ['Default Statuses', 'In Progress, Blocked, On Hold, Completed'],
    ['Ownership Model', 'Functional Ownership (DQ Operations)'],
    ['Update Frequency', 'Weekly'],
    ['Governance Rules', 'Review every Friday'],
  ];
  return (
    <div className={`grid gap-3 ${compact ? '' : 'md:grid-cols-2'}`}>
      {rows.map(([label, value]) => (
        <div key={label} className={compact ? '' : 'rounded-card border border-border-subtle p-3'}>
          <div className="text-xs font-bold text-text-muted">{label}</div>
          <div className="mt-1 text-sm font-semibold text-primary">{value}</div>
        </div>
      ))}
    </div>
  );
}

function TrackerDetailDrawer({ item, onClose, onSave }: { item: TrackerItem | null; onClose: () => void; onSave: (item: TrackerItem) => void }) {
  const [draft, setDraft] = useState<TrackerItem | null>(item);
  const [comment, setComment] = useState('');

  useEffect(() => setDraft(item), [item]);
  useEffect(() => {
    if (!item) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  if (!item || !draft) return null;
  const update = (patch: Partial<TrackerItem>) => setDraft((current) => current ? { ...current, ...patch } : current);
  const addComment = () => {
    if (!comment.trim()) return;
    update({ comments: [`Bilal Waqar: ${comment.trim()}`, ...draft.comments] });
    setComment('');
    toast.success('Comment added');
  };
  const addEvidence = (label: string) => {
    update({ evidence: [label, ...draft.evidence] });
    toast.success(label.includes('Link') ? 'Evidence link added' : 'Evidence uploaded');
  };

  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed bottom-0 right-0 top-0 z-[200] w-full max-w-[560px] overflow-y-auto border-l border-border-default bg-white shadow-xl 2xl:max-w-[42vw]">
        <div className="sticky top-0 z-10 border-b border-border-subtle bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs font-bold text-text-muted">{draft.id}</div>
              <h2 className="mt-1 text-xl font-bold text-primary">{draft.title}</h2>
              <p className="mt-1 text-sm font-semibold text-text-secondary">{draft.tracker}</p>
            </div>
            <DqIconButton label="Close tracker drawer" onClick={onClose}><X size={18} strokeWidth={1.5} /></DqIconButton>
          </div>
        </div>
        <div className="space-y-4 bg-surface p-5">
          <section className="dq-card grid gap-3 sm:grid-cols-2">
            <DrawerSelect label="Owner" value={draft.owner} options={['Bilal Waqar', 'Sara Khan', 'Ali Raza', 'Hina Adam']} onChange={(value) => update({ owner: value })} />
            <DrawerSelect label="Status" value={draft.status} options={['In Progress', 'Overdue', 'Awaiting Review', 'Blocked', 'Needs Update', 'Completed']} onChange={(value) => update({ status: value as TrackerStatus })} />
            <DrawerSelect label="Priority" value={draft.priority} options={['Low', 'Medium', 'High', 'Critical']} onChange={(value) => update({ priority: value as TrackerPriority })} />
            <DrawerField label="Due date" value={draft.dueDate} onChange={(value) => update({ dueDate: value })} />
            <DrawerSelect label="RAG" value={draft.rag} options={['Green', 'Amber', 'Red']} onChange={(value) => update({ rag: value as TrackerHealth })} />
            <DrawerField label="Last updated" value={draft.lastUpdated} onChange={(value) => update({ lastUpdated: value })} />
          </section>

          <DrawerTextarea label="Description / Context" value={draft.description} onChange={(value) => update({ description: value })} />
          <DrawerTextarea label="Latest Update" value={draft.latestUpdate} onChange={(value) => update({ latestUpdate: value })} />
          <DrawerField label="Next Action" value={draft.nextAction} onChange={(value) => update({ nextAction: value })} />

          <section className="dq-card">
            <h3 className="dq-card-title">Comments</h3>
            <div className="mt-3 space-y-2">{draft.comments.map((entry) => <div key={entry} className="rounded-button bg-surface px-3 py-2 text-sm text-primary">{entry}</div>)}</div>
            <div className="mt-3 flex gap-2">
              <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add comment..." className="dq-input" />
              <DqButton variant="navy" onClick={addComment}>Post</DqButton>
            </div>
          </section>

          <section className="dq-card">
            <h3 className="dq-card-title">Evidence / Links</h3>
            <div className="mt-3 space-y-2">{draft.evidence.map((entry) => <div key={entry} className="rounded-button bg-surface px-3 py-2 text-sm font-semibold text-primary">{entry}</div>)}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <DqButton variant="outline" onClick={() => addEvidence('Linked evidence placeholder')}>Add Link</DqButton>
              <DqButton variant="outline" onClick={() => addEvidence('Uploaded evidence placeholder')}>Upload Evidence</DqButton>
            </div>
          </section>

          <section className="dq-card">
            <h3 className="dq-card-title">Activity History</h3>
            <div className="mt-3 space-y-3">{draft.activity.map((entry) => <div key={entry} className="border-l-2 border-secondary pl-3 text-sm text-primary">{entry}</div>)}</div>
          </section>

          <div className="flex flex-wrap justify-end gap-2">
            <DqButton variant="outline" onClick={() => update({ status: 'Completed', rag: 'Green' })}>Mark as complete</DqButton>
            <DqButton variant="orange" onClick={() => onSave(draft)}>Save changes</DqButton>
          </div>
        </div>
      </aside>
    </>
  );
}

function DrawerField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-text-muted">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="dq-input mt-1" />
    </label>
  );
}

function DrawerSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-text-muted">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="dq-input mt-1">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function DrawerTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="dq-card block">
      <span className="text-xs font-bold text-text-muted">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="dq-textarea mt-2" />
    </label>
  );
}
