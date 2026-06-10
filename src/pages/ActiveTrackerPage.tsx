import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bookmark,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FolderOpen,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  UserX,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DqButton, DqIconButton } from '../components/DqButton';
import { DqBadge, PriorityBadge, StatusBadge } from '../components/DqBadge';
import { getRecordsForTracker, getTrackerBySlug } from '../mocks/trackers.mock';
import type { TrackerDefinition, TrackerHealth, TrackerPriority, TrackerRecord } from '../types/tracker';

const currentUser = 'Bilal Waqar';
const closedStatuses = ['closed', 'completed', 'done', 'resolved', 'implemented', 'balanced'];

const tabs = ['Records', 'My Items', 'Overdue', 'At Risk', 'Recently Updated', 'About Tracker'];

type FilterState = {
  search: string;
  owner: string;
  status: string;
  priority: string;
  rag: string;
  dueDate: string;
  team: string;
  lastUpdated: string;
};

const defaultFilters: FilterState = {
  search: '',
  owner: 'All Owners',
  status: 'All Statuses',
  priority: 'All Priorities',
  rag: 'All RAG',
  dueDate: 'All Due Dates',
  team: 'All Teams',
  lastUpdated: 'Any Update',
};

export function ActiveTrackerPage() {
  const { trackerSlug } = useParams();
  const navigate = useNavigate();
  const tracker = getTrackerBySlug(trackerSlug);
  const [records, setRecords] = useState<TrackerRecord[]>(() => tracker ? getRecordsForTracker(tracker.id) : []);
  const [activeTab, setActiveTab] = useState('Records');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedRecord, setSelectedRecord] = useState<TrackerRecord | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    if (!tracker) return;
    setRecords(getRecordsForTracker(tracker.id));
    setActiveTab('Records');
    setFilters(defaultFilters);
    setSelectedRecord(null);
  }, [tracker]);

  if (!tracker) {
    return <TrackerNotFound onBack={() => navigate('/tracker/tracker-hub')} />;
  }

  const metrics = getMetrics(records);
  const filteredRecords = filterRecords(records, filters, activeTab);
  const filterOptions = getFilterOptions(records);
  const updateFilter = (key: keyof FilterState, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const applySignalFilter = (signal: 'overdue' | 'missingOwner' | 'evidence') => {
    if (signal === 'overdue') setActiveTab('Overdue');
    if (signal === 'missingOwner') {
      setFilters((current) => ({ ...current, owner: 'Missing Owner' }));
      toast.info('Missing owner filter applied');
    }
    if (signal === 'evidence') {
      toast.info('Evidence gaps filter applied');
    }
  };
  const updateRecord = (updated: TrackerRecord) => {
    setRecords((current) => current.map((record) => record.id === updated.id ? updated : record));
    setSelectedRecord(updated);
  };
  const addRecord = (draft: AddRecordDraft) => {
    const nextRecord: TrackerRecord = {
      id: `${tracker.slug.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      trackerId: tracker.id,
      title: draft.title,
      description: draft.description || `${draft.title} requires owner update and governed tracker follow-up.`,
      owner: draft.owner,
      teamOrSquad: draft.teamOrSquad,
      priority: draft.priority,
      status: draft.status,
      dueDate: draft.dueDate,
      rag: draft.rag,
      lastUpdated: 'Today',
      nextAction: draft.nextAction,
      evidenceCount: 0,
      commentCount: 0,
      isOverdue: false,
      isBlocked: draft.status.toLowerCase().includes('blocked'),
      missingOwner: !draft.owner,
      notUpdatedRecently: false,
      comments: [],
      evidence: [],
      activity: [{ id: `activity-${Date.now()}`, actor: currentUser, action: 'Created tracker record', timestamp: 'Today' }],
    };
    setRecords((current) => [nextRecord, ...current]);
    setAddModalOpen(false);
    toast.success('Tracker record added');
  };

  return (
    <div className="w-full px-5 py-6 pb-12 sm:px-6 lg:px-8">
      <header className="mb-6">
        <Breadcrumb items={['Tracker', 'Tracker Hub', tracker.name]} onHub={() => navigate('/tracker/tracker-hub')} />
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div>
            <div className="dq-overline mb-2">ACTIVE TRACKER WORKSPACE</div>
            <h1 className="dq-page-title">{tracker.name}</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-primary">{tracker.purpose}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <DqButton variant="orange" onClick={() => setAddModalOpen(true)}><Plus size={16} strokeWidth={1.5} /> Add Record</DqButton>
            <DqButton variant="navy" onClick={() => toast.success('Tracker view saved')}><Bookmark size={16} strokeWidth={1.5} /> Save View</DqButton>
            <DqButton variant="outline" onClick={() => toast.info('Tracker export prepared')}><Download size={16} strokeWidth={1.5} /> Export Tracker</DqButton>
            <DqIconButton label="Tracker settings" onClick={() => toast.info('Tracker settings opened')}><Settings size={18} strokeWidth={1.5} /></DqIconButton>
          </div>
        </div>
      </header>

      <section className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Total Records" value={records.length} detail={`${tracker.activeRecords} active in source`} icon={FileText} accent="blue" onClick={() => toast.info('Total Records filter applied')} />
        <KpiCard label="Open Records" value={metrics.open} detail="Not closed or resolved" icon={FolderOpen} accent="green" onClick={() => toast.info('Open Records filter applied')} />
        <KpiCard label="Overdue Updates" value={metrics.overdue} detail="Past due or overdue" icon={AlertTriangle} accent="red" onClick={() => setActiveTab('Overdue')} />
        <KpiCard label="Red / Amber Items" value={metrics.atRisk} detail="RAG requires attention" icon={ShieldAlert} accent="orange" onClick={() => setActiveTab('At Risk')} />
        <KpiCard label="Missing Owner" value={metrics.missingOwner} detail="Owner not assigned" icon={UserX} accent="purple" onClick={() => applySignalFilter('missingOwner')} />
        <KpiCard label="Not Updated Recently" value={metrics.notUpdatedRecently} detail="Needs update discipline" icon={CalendarDays} accent="blue" onClick={() => toast.info('Not Updated Recently filter applied')} />
      </section>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
            <div className="dq-tabs flex overflow-x-auto px-4" role="tablist" aria-label="Active tracker tabs">
              {tabs.map((tab) => (
                <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`dq-tab whitespace-nowrap ${activeTab === tab ? 'dq-tab-active text-secondary' : ''}`}>
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === 'About Tracker' ? (
              <div className="p-5"><AboutTracker tracker={tracker} /></div>
            ) : (
              <>
                <FilterBar filters={filters} options={filterOptions} onFilter={updateFilter} onClear={() => setFilters(defaultFilters)} />
                <RecordsTable records={filteredRecords} total={records.length} onOpen={setSelectedRecord} />
              </>
            )}
          </section>

          <RecentSignals metrics={metrics} onFilter={applySignalFilter} />
        </main>

        <RightRail tracker={tracker} records={records} metrics={metrics} />
      </div>

      <TrackerRecordDrawer
        tracker={tracker}
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onSave={(record) => {
          updateRecord(record);
          toast.success('Tracker record updated');
        }}
      />
      <AddRecordModal tracker={tracker} open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={addRecord} />
    </div>
  );
}

function Breadcrumb({ items, onHub }: { items: string[]; onHub: () => void }) {
  return (
    <nav className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item} className="inline-flex items-center gap-2">
          {index > 0 && <span className="text-text-muted">/</span>}
          {item === 'Tracker Hub' ? <button onClick={onHub} className="hover:text-secondary">{item}</button> : <span className={index === items.length - 1 ? 'font-bold' : ''}>{item}</span>}
        </span>
      ))}
    </nav>
  );
}

function KpiCard({ label, value, detail, icon: Icon, accent, onClick }: { label: string; value: number; detail: string; icon: LucideIcon; accent: 'blue' | 'orange' | 'red' | 'purple' | 'green'; onClick: () => void }) {
  const styles = {
    blue: 'border-t-info text-info-text bg-info-surface',
    orange: 'border-t-secondary text-secondary bg-orange-50',
    red: 'border-t-danger text-danger-text bg-danger-surface',
    purple: 'border-t-[#7c3aed] text-[#6d28d9] bg-[#f3e8ff]',
    green: 'border-t-success text-success-text bg-success-surface',
  }[accent];
  const [borderClass, textClass, bgClass] = styles.split(' ');
  return (
    <button onClick={onClick} className={`dq-card dq-card-clickable min-h-[124px] border-t-4 text-left ${borderClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-primary">{label}</div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-primary">{value}</div>
          <div className="mt-3 text-xs font-semibold text-primary">{detail}</div>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-button ${bgClass} ${textClass}`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
      </div>
    </button>
  );
}

function FilterBar({ filters, options, onFilter, onClear }: { filters: FilterState; options: ReturnType<typeof getFilterOptions>; onFilter: (key: keyof FilterState, value: string) => void; onClear: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle p-4">
      <div className="relative min-w-[260px] flex-1">
        <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={filters.search} onChange={(event) => onFilter('search', event.target.value)} placeholder="Search tracker records..." className="dq-input pl-9" />
      </div>
      <FilterSelect value={filters.owner} options={['All Owners', 'Missing Owner', ...options.owners]} onChange={(value) => onFilter('owner', value)} />
      <FilterSelect value={filters.status} options={['All Statuses', ...options.statuses]} onChange={(value) => onFilter('status', value)} />
      <FilterSelect value={filters.priority} options={['All Priorities', 'Critical', 'High', 'Medium', 'Low']} onChange={(value) => onFilter('priority', value)} />
      <FilterSelect value={filters.rag} options={['All RAG', 'Red', 'Amber', 'Green']} onChange={(value) => onFilter('rag', value)} />
      <FilterSelect value={filters.dueDate} options={['All Due Dates', ...options.dueDates]} onChange={(value) => onFilter('dueDate', value)} />
      <FilterSelect value={filters.team} options={['All Teams', ...options.teams]} onChange={(value) => onFilter('team', value)} />
      <FilterSelect value={filters.lastUpdated} options={['Any Update', 'Today', 'Yesterday', 'Not Updated Recently']} onChange={(value) => onFilter('lastUpdated', value)} />
      <button onClick={onClear} className="px-2 text-sm font-bold text-secondary hover:text-danger">Clear Filters</button>
    </div>
  );
}

function FilterSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="relative inline-flex h-10 min-w-[128px] items-center">
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-button border-[1.5px] border-border-default bg-white px-3 pr-8 text-sm font-semibold text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown size={15} strokeWidth={1.5} className="pointer-events-none absolute right-3 text-text-muted" />
    </label>
  );
}

function RecordsTable({ records, total, onOpen }: { records: TrackerRecord[]; total: number; onOpen: (record: TrackerRecord) => void }) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle bg-surface">
              {['Record ID', 'Title / Item Name', 'Owner', 'Team / Squad', 'Priority', 'Status', 'Due Date', 'RAG', 'Last Updated', 'Next Action'].map((header) => (
                <th key={header} className="px-4 py-3 text-xs font-bold uppercase text-[#454560]">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle bg-white">
            {records.slice(0, 5).map((record) => (
              <tr key={record.id} onClick={() => onOpen(record)} className="cursor-pointer border-l-4 border-transparent hover:border-secondary hover:bg-navy-50">
                <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{record.id}</td>
                <td className="max-w-[260px] px-4 py-3 text-sm font-semibold text-primary">{record.title}</td>
                <td className="px-4 py-3"><OwnerBadge owner={record.owner} /></td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">{record.teamOrSquad}</td>
                <td className="px-4 py-3"><PriorityBadge priority={record.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                <td className={`px-4 py-3 text-sm font-bold ${record.dueDate === 'Today' ? 'text-secondary' : 'text-primary'}`}>{record.dueDate}</td>
                <td className="px-4 py-3"><RagBadge rag={record.rag} /></td>
                <td className="px-4 py-3 text-sm text-text-secondary">{record.lastUpdated}</td>
                <td className="px-4 py-3">
                  <button onClick={(event) => { event.stopPropagation(); onOpen(record); }} className="text-sm font-bold text-info-text hover:text-primary">{record.nextAction}</button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-8 text-center text-sm font-semibold text-text-muted">No tracker records match the selected filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle px-4 py-3 text-sm text-text-muted">
        <span>Showing 1 to {Math.min(records.length, 5)} of {total} results</span>
        <div className="flex items-center gap-2">
          <PagerButton><ChevronLeft size={15} strokeWidth={1.5} /></PagerButton>
          <PagerButton active>1</PagerButton>
          <PagerButton>2</PagerButton>
          <PagerButton>3</PagerButton>
          <PagerButton><ChevronRight size={15} strokeWidth={1.5} /></PagerButton>
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-button border border-border-default px-3 font-semibold text-primary">5 / page <ChevronDown size={14} strokeWidth={1.5} /></button>
      </div>
    </>
  );
}

function OwnerBadge({ owner }: { owner: string }) {
  if (!owner) return <DqBadge label="Missing Owner" tone="danger" dot={false} />;
  const initials = owner.split(' ').map((part) => part[0]).join('').slice(0, 2);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">{initials}</span>
      <span className="text-sm font-semibold text-primary">{owner}</span>
    </span>
  );
}

function RagBadge({ rag }: { rag: TrackerHealth }) {
  return <DqBadge label={rag} tone={rag === 'Red' ? 'danger' : rag === 'Amber' ? 'warning' : 'success'} dot={false} />;
}

function PagerButton({ children, active }: { children: ReactNode; active?: boolean }) {
  return <button className={`grid h-8 min-w-8 place-items-center rounded-button border text-sm font-bold ${active ? 'border-primary bg-primary text-white' : 'border-border-default bg-white text-primary hover:bg-navy-50'}`}>{children}</button>;
}

function RecentSignals({ metrics, onFilter }: { metrics: TrackerMetrics; onFilter: (signal: 'overdue' | 'missingOwner' | 'evidence') => void }) {
  const evidenceGaps = metrics.red + metrics.amber;
  return (
    <section className="rounded-card border border-border-default bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-button bg-info-surface text-info-text"><BarChart3 size={18} strokeWidth={1.5} /></span>
        <h2 className="dq-card-title">Recent Signals</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <SignalBlock title={`${metrics.overdue} Overdue Updates`} text={`${metrics.overdue} records are past due.`} link="View Overdue →" onClick={() => onFilter('overdue')} />
        <SignalBlock title={`${metrics.missingOwner} Record Missing Owner`} text={`${metrics.missingOwner} record is missing an assigned owner.`} link="View Missing Owners →" onClick={() => onFilter('missingOwner')} />
        <SignalBlock title={`${evidenceGaps} Evidence Gaps`} text={`${evidenceGaps} items require evidence to support status.`} link="View Evidence Gaps →" onClick={() => onFilter('evidence')} />
      </div>
    </section>
  );
}

function SignalBlock({ title, text, link, onClick }: { title: string; text: string; link: string; onClick: () => void }) {
  return (
    <article className="rounded-card border border-border-subtle bg-surface p-4">
      <h3 className="text-base font-bold text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{text}</p>
      <button onClick={onClick} className="mt-3 text-sm font-bold text-info-text hover:text-primary">{link}</button>
    </article>
  );
}

function RightRail({ tracker, records, metrics }: { tracker: TrackerDefinition; records: TrackerRecord[]; metrics: TrackerMetrics }) {
  return (
    <aside className="space-y-4">
      <RailCard title="Tracker Health" icon={FolderOpen}>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['Open', metrics.open],
            ['Closed', metrics.closed],
            ['Overdue', metrics.overdue],
            ['Blocked', metrics.blocked],
            ['Missing Owner', metrics.missingOwner],
          ].map(([label, value]) => (
            <div key={label} className="rounded-card bg-surface p-3">
              <div className="text-xs font-bold text-text-muted">{label}</div>
              <div className="mt-1 font-mono text-xl font-bold text-primary">{value}</div>
            </div>
          ))}
        </div>
      </RailCard>
      <RailCard title="RAG Split" icon={ShieldAlert}>
        <div className="h-3 overflow-hidden rounded-full bg-border-subtle">
          <div className="flex h-full">
            <span className="bg-danger" style={{ width: `${percent(metrics.red, records.length)}%` }} />
            <span className="bg-warning" style={{ width: `${percent(metrics.amber, records.length)}%` }} />
            <span className="bg-success" style={{ width: `${percent(metrics.green, records.length)}%` }} />
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm font-semibold text-primary">
          <RagRow label="Red" value={metrics.red} total={records.length} color="bg-danger" />
          <RagRow label="Amber" value={metrics.amber} total={records.length} color="bg-warning" />
          <RagRow label="Green" value={metrics.green} total={records.length} color="bg-success" />
        </div>
      </RailCard>
      <RailCard title="Update Discipline" icon={CalendarDays}>
        <div className="space-y-3 text-sm font-semibold text-primary">
          <RailMetric label="Updated This Week" value={metrics.updatedThisWeek} />
          <RailMetric label="Not Updated Recently" value={metrics.notUpdatedRecently} />
          <RailMetric label="Missing Update" value={metrics.notUpdatedRecently + metrics.missingOwner} />
        </div>
      </RailCard>
      <RailCard title="About this Tracker" icon={AlertCircle}>
        <AboutTracker tracker={tracker} compact />
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

function RagRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  return <div className="flex justify-between gap-3"><span className="inline-flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</span><span>{value} ({percent(value, total)}%)</span></div>;
}

function RailMetric({ label, value }: { label: string; value: number }) {
  return <div className="flex justify-between gap-3"><span>{label}</span><span className="font-mono font-bold">{value}</span></div>;
}

function AboutTracker({ tracker, compact }: { tracker: TrackerDefinition; compact?: boolean }) {
  const rows = [
    ['Purpose', tracker.purpose],
    ['Owner', tracker.owner],
    ['Tracker Type', tracker.trackerType],
    ['Required Fields', tracker.requiredFields.join(', ')],
    ['Optional Fields', tracker.optionalFields.join(', ')],
    ['Default Statuses', tracker.defaultStatuses.join(', ')],
    ['Ownership Model', tracker.ownershipModel],
    ['Update Frequency', tracker.updateFrequency],
    ['Governance Rules', tracker.governanceRules],
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

function TrackerRecordDrawer({ tracker, record, onClose, onSave }: { tracker: TrackerDefinition; record: TrackerRecord | null; onClose: () => void; onSave: (record: TrackerRecord) => void }) {
  const [draft, setDraft] = useState<TrackerRecord | null>(record);
  const [comment, setComment] = useState('');

  useEffect(() => setDraft(record), [record]);
  useEffect(() => {
    if (!record) return undefined;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [record, onClose]);

  if (!record || !draft) return null;
  const update = (patch: Partial<TrackerRecord>) => setDraft((current) => current ? { ...current, ...patch } : current);
  const addComment = () => {
    if (!comment.trim()) return;
    update({
      comments: [{ id: `comment-${Date.now()}`, author: currentUser, body: comment.trim(), timestamp: 'Now' }, ...draft.comments],
      commentCount: draft.commentCount + 1,
    });
    setComment('');
    toast.success('Comment added');
  };
  const addEvidence = () => {
    update({
      evidence: [{ id: `evidence-${Date.now()}`, title: 'Mock evidence added', type: 'Link', addedBy: currentUser, addedAt: 'Now' }, ...draft.evidence],
      evidenceCount: draft.evidenceCount + 1,
    });
    toast.success('Evidence added');
  };
  const markComplete = () => {
    update({ status: tracker.defaultStatuses.find((status) => closedStatuses.includes(status.toLowerCase())) || 'Completed', rag: 'Green', isBlocked: false, isOverdue: false });
    toast.success('Tracker record marked complete');
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
              <p className="mt-1 text-sm font-semibold text-text-secondary">{tracker.name}</p>
            </div>
            <DqIconButton label="Close tracker drawer" onClick={onClose}><X size={18} strokeWidth={1.5} /></DqIconButton>
          </div>
        </div>
        <div className="space-y-4 bg-surface p-5">
          <section className="dq-card grid gap-3 sm:grid-cols-2">
            <DrawerField label="Owner" value={draft.owner} onChange={(value) => update({ owner: value, missingOwner: !value })} />
            <DrawerField label="Team / Squad" value={draft.teamOrSquad} onChange={(value) => update({ teamOrSquad: value })} />
            <DrawerSelect label="Priority" value={draft.priority} options={['Low', 'Medium', 'High', 'Critical']} onChange={(value) => update({ priority: value as TrackerPriority })} />
            <DrawerSelect label="Status" value={draft.status} options={tracker.defaultStatuses} onChange={(value) => update({ status: value, isBlocked: value.toLowerCase().includes('blocked') })} />
            <DrawerField label="Due Date" value={draft.dueDate} onChange={(value) => update({ dueDate: value })} />
            <DrawerSelect label="RAG" value={draft.rag} options={['Green', 'Amber', 'Red']} onChange={(value) => update({ rag: value as TrackerHealth })} />
            <DrawerField label="Last Updated" value={draft.lastUpdated} onChange={(value) => update({ lastUpdated: value })} />
          </section>
          <DrawerTextarea label="Description / Context" value={draft.description} onChange={(value) => update({ description: value })} />
          <DrawerField label="Latest Update" value={draft.activity[0]?.action || 'Updated tracker record'} onChange={(value) => update({ activity: [{ id: `activity-${Date.now()}`, actor: currentUser, action: value, timestamp: 'Now' }, ...draft.activity] })} />
          <DrawerField label="Next Action" value={draft.nextAction} onChange={(value) => update({ nextAction: value })} />
          <section className="dq-card">
            <h3 className="dq-card-title">Comments</h3>
            <div className="mt-3 space-y-2">{draft.comments.map((entry) => <div key={entry.id} className="rounded-button bg-surface px-3 py-2 text-sm text-primary"><b>{entry.author}:</b> {entry.body}</div>)}</div>
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Add comment..." className="dq-textarea mt-3" />
            <DqButton variant="navy" onClick={addComment} className="mt-3">Post</DqButton>
          </section>
          <section className="dq-card">
            <h3 className="dq-card-title">Evidence / Links</h3>
            <div className="mt-3 space-y-2">{draft.evidence.map((entry) => <div key={entry.id} className="rounded-button bg-surface px-3 py-2 text-sm font-semibold text-primary">{entry.title} · {entry.type}</div>)}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <DqButton variant="outline" onClick={addEvidence}>Add Link</DqButton>
              <DqButton variant="outline" onClick={addEvidence}>Upload Evidence</DqButton>
            </div>
          </section>
          <section className="dq-card">
            <h3 className="dq-card-title">Activity History</h3>
            <div className="mt-3 space-y-3">{draft.activity.map((entry) => <div key={entry.id} className="border-l-2 border-secondary pl-3 text-sm text-primary"><b>{entry.actor}</b> {entry.action}<div className="text-xs text-text-muted">{entry.timestamp}</div></div>)}</div>
          </section>
          <div className="flex flex-wrap justify-end gap-2">
            <DqButton variant="outline" onClick={onClose}>Close</DqButton>
            <DqButton variant="outline" onClick={addEvidence}>Add Evidence</DqButton>
            <DqButton variant="outline" onClick={markComplete}>Mark Complete</DqButton>
            <DqButton variant="orange" onClick={() => onSave(draft)}>Save Changes</DqButton>
          </div>
        </div>
      </aside>
    </>
  );
}

type AddRecordDraft = {
  title: string;
  owner: string;
  teamOrSquad: string;
  priority: TrackerPriority;
  status: string;
  dueDate: string;
  rag: TrackerHealth;
  description: string;
  nextAction: string;
};

function AddRecordModal({ tracker, open, onClose, onAdd }: { tracker: TrackerDefinition; open: boolean; onClose: () => void; onAdd: (draft: AddRecordDraft) => void }) {
  const [draft, setDraft] = useState<AddRecordDraft>({
    title: '',
    owner: currentUser,
    teamOrSquad: 'DQ Ops',
    priority: 'Medium',
    status: tracker.defaultStatuses[0] || 'Open',
    dueDate: 'Today',
    rag: 'Amber',
    description: '',
    nextAction: 'Add first update',
  });

  useEffect(() => {
    if (!open) return;
    setDraft({
      title: '',
      owner: currentUser,
      teamOrSquad: 'DQ Ops',
      priority: 'Medium',
      status: tracker.defaultStatuses[0] || 'Open',
      dueDate: 'Today',
      rag: 'Amber',
      description: '',
      nextAction: 'Add first update',
    });
  }, [open, tracker]);

  if (!open) return null;
  const update = (patch: Partial<AddRecordDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const submit = () => {
    if (!draft.title.trim() || !draft.owner.trim() || !draft.status.trim() || !draft.dueDate.trim() || !draft.rag.trim()) {
      toast.error('Complete required fields before adding the record.');
      return;
    }
    onAdd(draft);
  };
  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/25" onClick={onClose} />
      <section className="fixed left-1/2 top-1/2 z-[220] w-[min(720px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-card border border-border-default bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="dq-card-title">Add Record</h2>
            <p className="mt-1 text-sm text-text-secondary">{tracker.name}</p>
          </div>
          <DqIconButton label="Close add record modal" onClick={onClose}><X size={18} strokeWidth={1.5} /></DqIconButton>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <DrawerField label="Title" value={draft.title} onChange={(value) => update({ title: value })} />
          <DrawerField label="Owner" value={draft.owner} onChange={(value) => update({ owner: value })} />
          <DrawerField label="Team / Squad" value={draft.teamOrSquad} onChange={(value) => update({ teamOrSquad: value })} />
          <DrawerSelect label="Priority" value={draft.priority} options={['Low', 'Medium', 'High', 'Critical']} onChange={(value) => update({ priority: value as TrackerPriority })} />
          <DrawerSelect label="Status" value={draft.status} options={tracker.defaultStatuses} onChange={(value) => update({ status: value })} />
          <DrawerField label="Due Date" value={draft.dueDate} onChange={(value) => update({ dueDate: value })} />
          <DrawerSelect label="RAG" value={draft.rag} options={['Green', 'Amber', 'Red']} onChange={(value) => update({ rag: value as TrackerHealth })} />
          <DrawerField label="Next Action" value={draft.nextAction} onChange={(value) => update({ nextAction: value })} />
        </div>
        <label className="mt-3 block">
          <span className="text-xs font-bold text-text-muted">Description / Context</span>
          <textarea value={draft.description} onChange={(event) => update({ description: event.target.value })} rows={4} className="dq-textarea mt-1" />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <DqButton variant="outline" onClick={onClose}>Cancel</DqButton>
          <DqButton variant="orange" onClick={submit}>Add Record</DqButton>
        </div>
      </section>
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

function TrackerNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-12">
      <section className="max-w-lg rounded-card border border-border-default bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto text-danger" size={42} strokeWidth={1.5} />
        <h1 className="mt-4 text-2xl font-bold text-primary">Tracker not found</h1>
        <p className="mt-2 text-sm text-text-secondary">This tracker may not exist or is not available to the selected role.</p>
        <DqButton variant="navy" onClick={onBack} className="mt-6">Back to Tracker Hub</DqButton>
      </section>
    </div>
  );
}

type TrackerMetrics = ReturnType<typeof getMetrics>;

function getMetrics(records: TrackerRecord[]) {
  return {
    open: records.filter((record) => !closedStatuses.includes(record.status.toLowerCase())).length,
    closed: records.filter((record) => closedStatuses.includes(record.status.toLowerCase())).length,
    overdue: records.filter((record) => record.isOverdue).length,
    blocked: records.filter((record) => record.isBlocked || record.status.toLowerCase().includes('blocked')).length,
    missingOwner: records.filter((record) => record.missingOwner || !record.owner).length,
    notUpdatedRecently: records.filter((record) => record.notUpdatedRecently).length,
    red: records.filter((record) => record.rag === 'Red').length,
    amber: records.filter((record) => record.rag === 'Amber').length,
    green: records.filter((record) => record.rag === 'Green').length,
    atRisk: records.filter((record) => record.rag === 'Red' || record.rag === 'Amber').length,
    updatedThisWeek: records.filter((record) => !record.notUpdatedRecently).length,
  };
}

function getFilterOptions(records: TrackerRecord[]) {
  return {
    owners: Array.from(new Set(records.map((record) => record.owner).filter(Boolean))),
    statuses: Array.from(new Set(records.map((record) => record.status))),
    teams: Array.from(new Set(records.map((record) => record.teamOrSquad))),
    dueDates: Array.from(new Set(records.map((record) => record.dueDate))),
  };
}

function filterRecords(records: TrackerRecord[], filters: FilterState, activeTab: string) {
  const query = filters.search.trim().toLowerCase();
  return records
    .filter((record) => {
      if (activeTab === 'My Items') return record.owner === currentUser;
      if (activeTab === 'Overdue') return record.isOverdue;
      if (activeTab === 'At Risk') return record.rag === 'Red' || record.rag === 'Amber';
      if (activeTab === 'Recently Updated') return record.lastUpdated === 'Today' || record.lastUpdated === 'Yesterday';
      return true;
    })
    .filter((record) => !query || `${record.id} ${record.title} ${record.owner} ${record.teamOrSquad} ${record.status} ${record.nextAction} ${record.description}`.toLowerCase().includes(query))
    .filter((record) => filters.owner === 'All Owners' || (filters.owner === 'Missing Owner' ? !record.owner : record.owner === filters.owner))
    .filter((record) => filters.status === 'All Statuses' || record.status === filters.status)
    .filter((record) => filters.priority === 'All Priorities' || record.priority === filters.priority)
    .filter((record) => filters.rag === 'All RAG' || record.rag === filters.rag)
    .filter((record) => filters.dueDate === 'All Due Dates' || record.dueDate === filters.dueDate)
    .filter((record) => filters.team === 'All Teams' || record.teamOrSquad === filters.team)
    .filter((record) => filters.lastUpdated === 'Any Update' || (filters.lastUpdated === 'Not Updated Recently' ? record.notUpdatedRecently : record.lastUpdated === filters.lastUpdated));
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}
