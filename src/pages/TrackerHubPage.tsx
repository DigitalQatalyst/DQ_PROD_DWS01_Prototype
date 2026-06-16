import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  ChevronDown,
  Download,
  FileSearch,
  History,
  Plus,
  RotateCcw,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DqButton, DqIconButton } from '../components/DqButton';
import { DqBadge } from '../components/DqBadge';
import type { TrackerDefinition, TrackerHealth } from '../types/tracker';

type HubTab = 'All Trackers' | 'Recently Opened' | 'Owned by My Team' | 'Favorites';
type SortKey = 'name' | 'activeRecords' | 'overdueRecords' | 'lastUpdated' | 'healthStatus';
type SortDirection = 'asc' | 'desc';

type HubTracker = TrackerDefinition & {
  favorite: boolean;
  recentlyOpened: boolean;
  lastOpened?: string;
};

type FilterState = {
  search: string;
  trackerType: string;
  owner: string;
  health: string;
  updateFrequency: string;
};

type SavedView = {
  activeTab: HubTab;
  filters: FilterState;
  sort: SortState;
};

type SortState = {
  key: SortKey | null;
  direction: SortDirection;
};

type SettingsState = {
  compactDensity: boolean;
  showRightRail: boolean;
  defaultTab: HubTab;
  defaultSort: string;
  redAlerts: boolean;
  overdueAlerts: boolean;
};

type CreateTrackerDraft = {
  name: string;
  purpose: string;
  owner: string;
  trackerType: string;
  updateFrequency: string;
  healthStatus: TrackerHealth;
  requiredFields: string;
  optionalFields: string;
  defaultStatuses: string;
  governanceRules: string;
};

const currentUserTeam = 'DQ Operations';
const customTrackerStorageKey = 'dws-tracker-hub-custom-trackers';
const savedViewStorageKey = 'dws-tracker-hub-saved-view';
const recentStorageKey = 'dws-tracker-hub-recently-opened';

const defaultFilters: FilterState = {
  search: '',
  trackerType: 'All',
  owner: 'All',
  health: 'All',
  updateFrequency: 'All',
};

const defaultSort: SortState = {
  key: null,
  direction: 'asc',
};

const defaultSettings: SettingsState = {
  compactDensity: false,
  showRightRail: true,
  defaultTab: 'All Trackers',
  defaultSort: 'None',
  redAlerts: true,
  overdueAlerts: true,
};

const baseTrackers: HubTracker[] = [
  tracker('workload-distribution', 'workload-distribution-tracker', 'Workload Distribution Tracker', 'Balance workload across squads', 'PMO', 'Workload Tracker', 22, 3, 'Today', 'Green', 'Weekly', false, false),
  tracker('squad-backlog', 'squad-backlog-tracker', 'Squad Backlog Tracker', 'Track squad backlog and aging', 'Delivery Ops', 'Backlog Tracker', 31, 5, 'Today', 'Amber', 'Twice weekly', true, false),
  tracker('project-backlog', 'project-backlog-tracker', 'Project Backlog Tracker', 'Monitor project backlog health', 'DQ Operations', 'Project Backlog Tracker', 18, 4, 'Today', 'Amber', 'Weekly', false, false),
  tracker('strategic-initiatives', 'strategic-initiatives-tracker', 'Strategic Initiatives Tracker', 'Track strategic initiatives', 'Strategy Office', 'Strategic Initiative Tracker', 12, 2, 'Yesterday', 'Green', 'Fortnightly', true, false),
  tracker('project-health', 'project-health-tracker', 'Project Health Tracker', 'Monitor project health signals', 'DQ Operations', 'Project Health Tracker', 18, 4, 'Today', 'Amber', 'Weekly', true, true, 'Today, 9:42 AM'),
  tracker('governance-follow-up', 'governance-follow-up-tracker', 'Governance Follow-up Tracker', 'Track governance follow-ups', 'Governance Office', 'Governance Follow-up Tracker', 19, 6, 'Today', 'Red', 'Weekly', false, false),
  tracker('action-log', 'action-log-tracker', 'Action Log Tracker', 'Track actions from meetings and reviews', 'Delivery Ops', 'Action Log Tracker', 28, 5, 'Today', 'Amber', 'Daily', false, true, 'Yesterday, 10:11 AM'),
  tracker('decision', 'decision-tracker', 'Decision Tracker', 'Track decisions and supporting evidence', 'DQ Operations', 'Decision Tracker', 16, 3, 'Today', 'Amber', 'Weekly', false, false),
  tracker('risk-issue', 'risk-issue-tracker', 'Risk / Issue Tracker', 'Track risks, issues, and mitigations', 'Risk Office', 'Risk / Issue Tracker', 25, 6, 'Today', 'Red', 'Weekly', true, false),
];

const fallbackRecentRows = [
  { slug: 'project-health-tracker', name: 'Project Health Tracker', owner: 'DQ Operations', lastOpened: 'Today, 9:42 AM', healthStatus: 'Amber' as TrackerHealth, available: true },
  { slug: 'request-status-tracker', name: 'Request Status Tracker', owner: 'DQ Operations', lastOpened: 'Yesterday, 4:15 PM', healthStatus: 'Green' as TrackerHealth, available: false },
  { slug: 'action-log-tracker', name: 'Action Log Tracker', owner: 'Delivery Ops', lastOpened: 'Yesterday, 10:11 AM', healthStatus: 'Amber' as TrackerHealth, available: true },
];

const trackerTypeOptions = ['All', 'Workload Tracker', 'Backlog Tracker', 'Project Backlog Tracker', 'Strategic Initiative Tracker', 'Project Health Tracker', 'Governance Follow-up Tracker', 'Action Log Tracker', 'Decision Tracker', 'Risk / Issue Tracker'];
const ownerOptions = ['All', 'PMO', 'Delivery Ops', 'DQ Operations', 'Strategy Office', 'Governance Office', 'Risk Office'];
const healthOptions = ['All', 'Green', 'Amber', 'Red'];
const updateFrequencyOptions = ['All', 'Daily', 'Weekly', 'Twice weekly', 'Fortnightly'];
const tabs: HubTab[] = ['All Trackers', 'Recently Opened', 'Owned by My Team', 'Favorites'];

export function TrackerHubPage() {
  const navigate = useNavigate();
  const savedView = readJson<SavedView>(savedViewStorageKey);
  const [trackers, setTrackers] = useState<HubTracker[]>(() => [...readCustomTrackers(), ...baseTrackers]);
  const [activeTab, setActiveTab] = useState<HubTab>(savedView?.activeTab || 'All Trackers');
  const [filters, setFilters] = useState<FilterState>(savedView?.filters || defaultFilters);
  const [sort, setSort] = useState<SortState>(savedView?.sort || defaultSort);
  const [savedViewApplied] = useState(Boolean(savedView));
  const [createOpen, setCreateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  const visibleTrackers = useMemo(
    () => applyTrackerView(trackers, activeTab, filters, sort),
    [trackers, activeTab, filters, sort]
  );

  const recentRows = useMemo(() => {
    const storedRecent = readJson<Array<{ slug: string; lastOpened: string }>>(recentStorageKey) || [];
    const customRows = storedRecent
      .map((entry) => trackers.find((item) => item.slug === entry.slug))
      .filter(Boolean)
      .map((item) => ({
        slug: item!.slug,
        name: item!.name,
        owner: item!.owner,
        lastOpened: storedRecent.find((entry) => entry.slug === item!.slug)?.lastOpened || item!.lastOpened || 'Today',
        healthStatus: item!.healthStatus,
        available: true,
      }));
    const merged = [...customRows, ...fallbackRecentRows];
    return merged.filter((row, index, list) => list.findIndex((item) => item.slug === row.slug) === index);
  }, [trackers]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setActiveTab('All Trackers');
    setFilters(defaultFilters);
    setSort(defaultSort);
  };

  const saveView = () => {
    localStorage.setItem(savedViewStorageKey, JSON.stringify({ activeTab, filters, sort }));
    toast.success('Tracker view saved');
  };

  const exportTrackers = () => {
    if (visibleTrackers.length === 0) {
      toast.info('No trackers to export');
      return;
    }
    const rows = visibleTrackers.map((item) => [
      item.name,
      item.purpose,
      item.owner,
      item.trackerType,
      item.activeRecords,
      item.overdueRecords,
      item.lastUpdated,
      item.healthStatus,
      item.updateFrequency,
    ]);
    downloadCsv('tracker-hub-overview.csv', ['Tracker Name', 'Purpose', 'Owner', 'Tracker Type', 'Active Records', 'Overdue', 'Last Updated', 'Health', 'Update Frequency'], rows);
    toast.success('Tracker overview exported');
  };

  const openTracker = (item: { slug: string; available?: boolean }) => {
    if (item.available === false) {
      toast.info('Request Status Tracker is not available in this MVP view');
      return;
    }
    const lastOpened = 'Today, 9:42 AM';
    const nextTrackers = trackers.map((trackerItem) => trackerItem.slug === item.slug ? { ...trackerItem, recentlyOpened: true, lastOpened } : trackerItem);
    setTrackers(nextTrackers);
    const recent = [{ slug: item.slug, lastOpened }, ...(readJson<Array<{ slug: string; lastOpened: string }>>(recentStorageKey) || []).filter((entry) => entry.slug !== item.slug)].slice(0, 8);
    localStorage.setItem(recentStorageKey, JSON.stringify(recent));
    navigate(`/tracker/active-tracker/${item.slug}`);
  };

  const createTracker = (draft: CreateTrackerDraft) => {
    const nextTracker: HubTracker = {
      id: slugify(draft.name).replace(/-tracker$/, ''),
      slug: slugify(draft.name),
      name: draft.name.trim(),
      purpose: draft.purpose.trim(),
      owner: draft.owner,
      trackerType: draft.trackerType,
      requiredFields: splitList(draft.requiredFields),
      optionalFields: splitList(draft.optionalFields),
      defaultStatuses: splitList(draft.defaultStatuses, ['Open', 'In Progress', 'Closed']),
      ownershipModel: `${draft.owner} ownership`,
      updateFrequency: draft.updateFrequency,
      governanceRules: draft.governanceRules.trim() || 'Governance rules not configured.',
      healthStatus: draft.healthStatus,
      activeRecords: 0,
      overdueRecords: 0,
      lastUpdated: 'Today',
      favorite: false,
      recentlyOpened: false,
    };
    const nextTrackers = [nextTracker, ...trackers.filter((item) => item.slug !== nextTracker.slug)];
    setTrackers(nextTrackers);
    persistCustomTrackers(nextTrackers.filter((item) => !baseTrackers.some((base) => base.slug === item.slug)));
    setCreateOpen(false);
    toast.success('Tracker created');
  };

  const applySettings = (nextSettings: SettingsState) => {
    setSettings(nextSettings);
    setActiveTab(nextSettings.defaultTab);
    setSort(sortFromSetting(nextSettings.defaultSort));
    setSettingsOpen(false);
    toast.success('Tracker settings applied');
  };

  const summary = {
    total: trackers.length,
    healthy: trackers.filter((item) => item.healthStatus === 'Green').length,
    attention: trackers.filter((item) => item.healthStatus === 'Amber').length,
    critical: trackers.filter((item) => item.healthStatus === 'Red').length,
  };

  const hasRightRail = settings.showRightRail;

  return (
    <div className="w-full px-6 py-6 pb-12 lg:px-8">
      <header className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="dq-overline mb-2">TRACKER HUB</div>
          <h1 className="dq-page-title">My Tracker Overview</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-primary">Browse available trackers, review their health, and open a tracker to manage its records.</p>
          {savedViewApplied && <div className="mt-2 text-xs font-semibold text-text-muted">Saved view applied</div>}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-start gap-2 xl:justify-end">
          <DqButton variant="orange" onClick={() => setCreateOpen(true)} className="h-12 px-5"><Plus size={18} strokeWidth={1.5} /> Create Tracker</DqButton>
          <DqButton variant="navy" onClick={saveView} className="h-12 px-5"><Bookmark size={17} strokeWidth={1.5} /> Save View</DqButton>
          {/* <DqButton variant="navy" onClick={exportTrackers} className="h-12 px-5"><Download size={17} strokeWidth={1.5} /> Export Tracker</DqButton> */}
          <DqIconButton label="Tracker Hub settings" onClick={() => setSettingsOpen(true)} className="h-12 w-12"><Settings size={19} strokeWidth={1.5} /></DqIconButton>
        </div>
      </header>

      <div className={`grid gap-6 ${hasRightRail ? '2xl:grid-cols-[minmax(0,1fr)_360px]' : 'grid-cols-1'}`}>
        <main className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
            <div className="px-5 pt-5">
              <h2 className="text-lg font-semibold text-primary">Available Trackers</h2>
            </div>
            <Tabs activeTab={activeTab} onChange={setActiveTab} />
            <FilterBar filters={filters} onFilter={updateFilter} onClear={clearFilters} />
            <TrackerTable
              trackers={visibleTrackers}
              sort={sort}
              compact={settings.compactDensity}
              onSort={(key) => setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))}
              onOpen={openTracker}
              onClear={clearFilters}
            />
          </section>

        </main>

        {hasRightRail && (
          <RightRail
            summary={summary}
            recentRows={recentRows}
            onHealthFilter={(health) => {
              setActiveTab('All Trackers');
              setFilters((current) => ({ ...current, health }));
            }}
            onOpen={openTracker}
            onViewAll={() => setRecentOpen(true)}
          />
        )}
      </div>

      <CreateTrackerModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createTracker} />
      <SettingsModal open={settingsOpen} settings={settings} onClose={() => setSettingsOpen(false)} onApply={applySettings} />
      <RecentlyOpenedModal open={recentOpen} rows={recentRows} onClose={() => setRecentOpen(false)} onOpen={openTracker} />
    </div>
  );
}

function Tabs({ activeTab, onChange }: { activeTab: HubTab; onChange: (tab: HubTab) => void }) {
  return (
    <div className="dq-tabs mt-2 flex overflow-x-auto px-3" role="tablist" aria-label="Tracker Hub tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onChange(tab)}
          className={`dq-tab whitespace-nowrap ${activeTab === tab ? 'dq-tab-active text-secondary' : ''}`}>
          {tab}
        </button>
      ))}
    </div>
  );
}

function FilterBar({ filters, onFilter, onClear }: { filters: FilterState; onFilter: (key: keyof FilterState, value: string) => void; onClear: () => void }) {
  return (
    <div className="grid gap-3 border-b border-border-subtle bg-white p-4 xl:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(150px,1fr))_auto]">
      <div className="relative">
        <Search size={17} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
        <input value={filters.search} onChange={(event) => onFilter('search', event.target.value)} placeholder="Search trackers..." className="dq-input h-11 pl-10" />
      </div>
      <FilterSelect label="Tracker Type" value={filters.trackerType} options={trackerTypeOptions} onChange={(value) => onFilter('trackerType', value)} />
      <FilterSelect label="Owner" value={filters.owner} options={ownerOptions} onChange={(value) => onFilter('owner', value)} />
      <FilterSelect label="Health" value={filters.health} options={healthOptions} onChange={(value) => onFilter('health', value)} />
      <FilterSelect label="Update Frequency" value={filters.updateFrequency} options={updateFrequencyOptions} onChange={(value) => onFilter('updateFrequency', value)} />
      <DqButton variant="outline" onClick={onClear} className="h-11 whitespace-nowrap border-border-default px-4">
        <RotateCcw size={16} strokeWidth={1.5} /> Clear Filters
      </DqButton>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
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

function TrackerTable({ trackers, sort, compact, onSort, onOpen, onClear }: { trackers: HubTracker[]; sort: SortState; compact: boolean; onSort: (key: SortKey) => void; onOpen: (tracker: HubTracker) => void; onClear: () => void }) {
  const rowPadding = compact ? 'px-4 py-2.5' : 'px-4 py-3.5';
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1080px] table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-border-subtle bg-surface">
            <SortableTh label="Tracker Name" sortKey="name" sort={sort} onSort={onSort} className="w-[200px]" />
            <th className="w-[250px] px-4 py-3 text-xs font-semibold uppercase text-[#454560]">Purpose</th>
            <th className="w-[145px] px-4 py-3 text-xs font-semibold uppercase text-[#454560]">Owner</th>
            <SortableTh label="Active Records" sortKey="activeRecords" sort={sort} onSort={onSort} className="w-[90px]" />
            <SortableTh label="Overdue" sortKey="overdueRecords" sort={sort} onSort={onSort} className="w-[80px]" />
            <SortableTh label="Last Updated" sortKey="lastUpdated" sort={sort} onSort={onSort} className="w-[100px]" />
            <SortableTh label="Health" sortKey="healthStatus" sort={sort} onSort={onSort} className="w-[95px]" />
            <th className="w-[120px] px-4 py-3 text-xs font-semibold uppercase text-[#454560]">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {trackers.map((item) => (
            <tr key={item.slug} onClick={() => onOpen(item)} className="cursor-pointer transition hover:bg-navy-50">
              <td className={`${rowPadding} text-sm font-bold text-info-text`}>
                <button onClick={(event) => { event.stopPropagation(); onOpen(item); }} className="text-left hover:text-primary">{item.name}</button>
              </td>
              <td className={`${rowPadding} max-w-[280px] text-sm font-medium text-primary`}>{item.purpose}</td>
              <td className={`${rowPadding} text-sm font-semibold text-primary`}>{item.owner}</td>
              <td className={`${rowPadding} text-center font-mono text-sm font-semibold text-primary`}>{item.activeRecords}</td>
              <td className={`${rowPadding} text-center font-mono text-sm font-bold text-danger`}>{item.overdueRecords}</td>
              <td className={`${rowPadding} text-sm font-medium text-primary`}>{item.lastUpdated}</td>
              <td className={rowPadding}><HealthBadge health={item.healthStatus} /></td>
              <td className={`${rowPadding} text-sm`}>
                <button onClick={(event) => { event.stopPropagation(); onOpen(item); }} className="whitespace-nowrap font-bold text-info-text hover:text-primary">Open tracker →</button>
              </td>
            </tr>
          ))}
          {trackers.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-14">
                <div className="mx-auto flex max-w-md flex-col items-center text-center">
                  <FileSearch size={38} strokeWidth={1.5} className="text-text-muted" />
                  <h3 className="mt-3 text-lg font-bold text-primary">No trackers found</h3>
                  <p className="mt-1 text-sm text-text-secondary">Try adjusting your search or filters.</p>
                  <DqButton variant="outline" onClick={onClear} className="mt-4">Clear Filters</DqButton>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortableTh({ label, sortKey, sort, onSort, className = '' }: { label: string; sortKey: SortKey; sort: SortState; onSort: (key: SortKey) => void; className?: string }) {
  const marker = sort.key === sortKey ? (sort.direction === 'asc' ? '↑' : '↓') : '↕';
  return (
    <th className={`px-4 py-3 text-xs font-semibold uppercase text-[#454560] ${className}`}>
      <button onClick={() => onSort(sortKey)} className="inline-flex items-center gap-1 hover:text-primary">
        {label} <span className="text-[11px]">{marker}</span>
      </button>
    </th>
  );
}

function HealthBadge({ health }: { health: TrackerHealth }) {
  const tone = health === 'Green' ? 'success' : health === 'Amber' ? 'warning' : 'danger';
  return <DqBadge label={health} tone={tone} />;
}

function RightRail({ summary, recentRows, onHealthFilter, onOpen, onViewAll }: { summary: { total: number; healthy: number; attention: number; critical: number }; recentRows: Array<{ slug: string; name: string; owner: string; lastOpened: string; healthStatus: TrackerHealth; available: boolean }>; onHealthFilter: (health: string) => void; onOpen: (tracker: { slug: string; available?: boolean }) => void; onViewAll: () => void }) {
  return (
    <aside className="space-y-5">
      <RailCard title="Tracker Summary" action={<span className="h-6 w-6 rounded-full border-[3px] border-secondary border-l-info border-b-warning" />}>
        <div className="space-y-1">
          <SummaryRow label="Total Trackers" value={summary.total} />
          <button onClick={() => onHealthFilter('Green')} className="flex w-full items-center justify-between gap-3 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50">
            <span className="inline-flex items-center gap-2"><Dot color="bg-success" />Healthy</span><span>{summary.healthy}</span>
          </button>
          <button onClick={() => onHealthFilter('Amber')} className="flex w-full items-center justify-between gap-3 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50">
            <span className="inline-flex items-center gap-2"><Dot color="bg-warning" />Attention Needed</span><span>{summary.attention}</span>
          </button>
          <button onClick={() => onHealthFilter('Red')} className="flex w-full items-center justify-between gap-3 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50">
            <span className="inline-flex items-center gap-2"><Dot color="bg-danger" />Critical</span><span>{summary.critical}</span>
          </button>
        </div>
      </RailCard>

      <RailCard title="Recently Opened" action={<History size={20} strokeWidth={1.5} />}>
        <div className="space-y-4">
          {recentRows.slice(0, 3).map((row) => (
            <button key={row.slug} onClick={() => onOpen(row)} className="block w-full rounded-button text-left hover:bg-navy-50">
              <div className="text-sm font-bold text-info-text">{row.name}</div>
              <div className="mt-1 text-sm font-medium text-primary">{row.lastOpened}</div>
            </button>
          ))}
        </div>
        <button onClick={onViewAll} className="mt-5 border-t border-border-subtle pt-4 text-sm font-bold text-info-text hover:text-primary">View all recently opened →</button>
      </RailCard>
    </aside>
  );
}

function RailCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
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

function SummaryRow({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center justify-between gap-3 px-2 py-2 text-sm font-semibold text-primary"><span>{label}</span><span>{value}</span></div>;
}

function Dot({ color }: { color: string }) {
  return <span className={`h-2 w-2 rounded-full ${color}`} />;
}

function CreateTrackerModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (draft: CreateTrackerDraft) => void }) {
  const [draft, setDraft] = useState<CreateTrackerDraft>({
    name: '',
    purpose: '',
    owner: 'DQ Operations',
    trackerType: 'Workload Tracker',
    updateFrequency: 'Weekly',
    healthStatus: 'Green',
    requiredFields: 'Title, Owner, Status, Due Date',
    optionalFields: 'Notes, Links, Attachments',
    defaultStatuses: 'Open, In Progress, Closed',
    governanceRules: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTrackerDraft, string>>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
  }, [open]);

  if (!open) return null;
  const update = (key: keyof CreateTrackerDraft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const submit = () => {
    const nextErrors: Partial<Record<keyof CreateTrackerDraft, string>> = {};
    (['name', 'purpose', 'owner', 'trackerType', 'updateFrequency'] as const).forEach((key) => {
      if (!draft[key].trim()) nextErrors[key] = 'Required';
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onCreate(draft);
    setDraft((current) => ({ ...current, name: '', purpose: '', governanceRules: '' }));
  };

  return (
    <ModalFrame title="Create Tracker" onClose={onClose} width="max-w-3xl">
      <div className="grid gap-4 md:grid-cols-2">
        <ModalField label="Tracker Name" value={draft.name} error={errors.name} onChange={(value) => update('name', value)} />
        <ModalSelect label="Owner" value={draft.owner} options={ownerOptions.filter((item) => item !== 'All')} error={errors.owner} onChange={(value) => update('owner', value)} />
        <ModalField label="Purpose" value={draft.purpose} error={errors.purpose} onChange={(value) => update('purpose', value)} className="md:col-span-2" />
        <ModalSelect label="Tracker Type" value={draft.trackerType} options={trackerTypeOptions.filter((item) => item !== 'All')} error={errors.trackerType} onChange={(value) => update('trackerType', value)} />
        <ModalSelect label="Update Frequency" value={draft.updateFrequency} options={updateFrequencyOptions.filter((item) => item !== 'All')} error={errors.updateFrequency} onChange={(value) => update('updateFrequency', value)} />
        <ModalSelect label="Health" value={draft.healthStatus} options={['Green', 'Amber', 'Red']} onChange={(value) => update('healthStatus', value as TrackerHealth)} />
        <ModalField label="Required Fields" value={draft.requiredFields} onChange={(value) => update('requiredFields', value)} />
        <ModalField label="Optional Fields" value={draft.optionalFields} onChange={(value) => update('optionalFields', value)} />
        <ModalField label="Default Statuses" value={draft.defaultStatuses} onChange={(value) => update('defaultStatuses', value)} />
        <label className="block md:col-span-2">
          <span className="dq-field-label">Governance Rules</span>
          <textarea value={draft.governanceRules} onChange={(event) => update('governanceRules', event.target.value)} rows={3} className="dq-textarea" />
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <DqButton variant="outline" onClick={onClose}>Cancel</DqButton>
        <DqButton variant="orange" onClick={submit}>Create Tracker</DqButton>
      </div>
    </ModalFrame>
  );
}

function SettingsModal({ open, settings, onClose, onApply }: { open: boolean; settings: SettingsState; onClose: () => void; onApply: (settings: SettingsState) => void }) {
  const [draft, setDraft] = useState(settings);
  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);
  if (!open) return null;
  const toggle = (key: 'compactDensity' | 'showRightRail' | 'redAlerts' | 'overdueAlerts') => setDraft((current) => ({ ...current, [key]: !current[key] }));
  return (
    <ModalFrame title="Tracker Hub Settings" onClose={onClose} width="max-w-2xl">
      <SettingsSection title="Display">
        <Toggle label="Compact table density" checked={draft.compactDensity} onChange={() => toggle('compactDensity')} />
        <Toggle label="Show right rail" checked={draft.showRightRail} onChange={() => toggle('showRightRail')} />
      </SettingsSection>
      <SettingsSection title="Defaults">
        <ModalSelect label="Default tab" value={draft.defaultTab} options={tabs} onChange={(value) => setDraft((current) => ({ ...current, defaultTab: value as HubTab }))} />
        <ModalSelect label="Default sort" value={draft.defaultSort} options={['None', 'Tracker Name', 'Active Records', 'Overdue', 'Last Updated', 'Health']} onChange={(value) => setDraft((current) => ({ ...current, defaultSort: value }))} />
      </SettingsSection>
      <SettingsSection title="Notifications">
        <Toggle label="Alert me when a tracker becomes Red" checked={draft.redAlerts} onChange={() => toggle('redAlerts')} />
        <Toggle label="Alert me when a tracker has overdue records" checked={draft.overdueAlerts} onChange={() => toggle('overdueAlerts')} />
      </SettingsSection>
      <div className="mt-6 flex justify-end gap-2">
        <DqButton variant="outline" onClick={onClose}>Cancel</DqButton>
        <DqButton variant="orange" onClick={() => onApply(draft)}>Apply Settings</DqButton>
      </div>
    </ModalFrame>
  );
}

function RecentlyOpenedModal({ open, rows, onClose, onOpen }: { open: boolean; rows: Array<{ slug: string; name: string; owner: string; lastOpened: string; healthStatus: TrackerHealth; available: boolean }>; onClose: () => void; onOpen: (tracker: { slug: string; available?: boolean }) => void }) {
  if (!open) return null;
  return (
    <ModalFrame title="Recently Opened Trackers" onClose={onClose} width="max-w-2xl">
      <div className="divide-y divide-border-subtle rounded-card border border-border-subtle">
        {rows.map((row) => (
          <div key={row.slug} className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_120px_120px_auto] sm:items-center">
            <div>
              <div className="font-bold text-primary">{row.name}</div>
              <div className="text-sm text-text-muted">{row.owner}</div>
            </div>
            <div className="text-sm font-semibold text-primary">{row.lastOpened}</div>
            <HealthBadge health={row.healthStatus} />
            <button onClick={() => onOpen(row)} className="text-sm font-bold text-info-text hover:text-primary">Open tracker →</button>
          </div>
        ))}
      </div>
    </ModalFrame>
  );
}

function ModalFrame({ title, onClose, width, children }: { title: string; onClose: () => void; width: string; children: ReactNode }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/25" onClick={onClose} />
      <section className={`fixed left-1/2 top-1/2 z-[220] max-h-[calc(100vh-48px)] w-[min(92vw,880px)] ${width} -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card border border-border-default bg-white p-5 shadow-xl`}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-primary">{title}</h2>
          <DqIconButton label={`Close ${title}`} onClick={onClose}><X size={18} strokeWidth={1.5} /></DqIconButton>
        </div>
        {children}
      </section>
    </>
  );
}

function ModalField({ label, value, onChange, error, className = '' }: { label: string; value: string; onChange: (value: string) => void; error?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="dq-field-label">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className={`dq-input ${error ? 'dq-input-error' : ''}`} />
      {error && <span className="mt-1 block text-xs font-semibold text-danger">{error}</span>}
    </label>
  );
}

function ModalSelect({ label, value, options, onChange, error }: { label: string; value: string; options: string[]; onChange: (value: string) => void; error?: string }) {
  return (
    <label className="block">
      <span className="dq-field-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`dq-input ${error ? 'dq-input-error' : ''}`}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      {error && <span className="mt-1 block text-xs font-semibold text-danger">{error}</span>}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex w-full items-center justify-between gap-4 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50">
      <span>{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-secondary' : 'bg-border-default'}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${checked ? 'left-6' : 'left-1'}`} />
      </span>
    </button>
  );
}

function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4 rounded-card border border-border-subtle p-4">
      <h3 className="mb-2 text-sm font-bold text-primary">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function tracker(id: string, slug: string, name: string, purpose: string, owner: string, trackerType: string, activeRecords: number, overdueRecords: number, lastUpdated: string, healthStatus: TrackerHealth, updateFrequency: string, favorite: boolean, recentlyOpened: boolean, lastOpened?: string): HubTracker {
  return {
    id,
    slug,
    name,
    purpose,
    owner,
    trackerType,
    requiredFields: ['Title', 'Owner', 'Status', 'Due Date'],
    optionalFields: ['Notes', 'Links', 'Attachments'],
    defaultStatuses: ['Open', 'In Progress', 'Closed'],
    ownershipModel: `${owner} ownership`,
    updateFrequency,
    governanceRules: 'Governed tracker update cadence applies.',
    healthStatus,
    activeRecords,
    overdueRecords,
    lastUpdated,
    favorite,
    recentlyOpened,
    lastOpened,
  };
}

function applyTrackerView(trackers: HubTracker[], activeTab: HubTab, filters: FilterState, sort: SortState) {
  const teamOwners = ['DQ Operations', 'Delivery Ops', 'PMO', currentUserTeam];
  const query = filters.search.trim().toLowerCase();
  const filtered = trackers
    .filter((item) => {
      if (activeTab === 'Recently Opened') return item.recentlyOpened;
      if (activeTab === 'Owned by My Team') return teamOwners.includes(item.owner);
      if (activeTab === 'Favorites') return item.favorite;
      return true;
    })
    .filter((item) => !query || `${item.name} ${item.purpose} ${item.owner} ${item.healthStatus} ${item.trackerType}`.toLowerCase().includes(query))
    .filter((item) => filters.trackerType === 'All' || item.trackerType === filters.trackerType)
    .filter((item) => filters.owner === 'All' || item.owner === filters.owner)
    .filter((item) => filters.health === 'All' || item.healthStatus === filters.health)
    .filter((item) => filters.updateFrequency === 'All' || item.updateFrequency === filters.updateFrequency);

  const sortKey = sort.key;
  if (!sortKey) return filtered;
  return [...filtered].sort((a, b) => {
    const direction = sort.direction === 'asc' ? 1 : -1;
    if (sortKey === 'healthStatus') return (healthRank(a.healthStatus) - healthRank(b.healthStatus)) * direction;
    if (sortKey === 'lastUpdated') return (dateRank(a.lastUpdated) - dateRank(b.lastUpdated)) * direction;
    const left = a[sortKey];
    const right = b[sortKey];
    if (typeof left === 'number' && typeof right === 'number') return (left - right) * direction;
    return String(left).localeCompare(String(right)) * direction;
  });
}

function sortFromSetting(value: string): SortState {
  const map: Record<string, SortKey | null> = {
    None: null,
    'Tracker Name': 'name',
    'Active Records': 'activeRecords',
    Overdue: 'overdueRecords',
    'Last Updated': 'lastUpdated',
    Health: 'healthStatus',
  };
  return { key: map[value] || null, direction: 'asc' };
}

function healthRank(health: TrackerHealth) {
  return { Green: 1, Amber: 2, Red: 3 }[health];
}

function dateRank(label: string) {
  if (label === 'Today') return 3;
  if (label === 'Yesterday') return 2;
  return 1;
}

function slugify(value: string) {
  const slug = value.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return slug.endsWith('-tracker') ? slug : `${slug}-tracker`;
}

function splitList(value: string, fallback: string[] = []) {
  const list = value.split(',').map((item) => item.trim()).filter(Boolean);
  return list.length > 0 ? list : fallback;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function readCustomTrackers() {
  return readJson<HubTracker[]>(customTrackerStorageKey) || [];
}

function persistCustomTrackers(trackers: HubTracker[]) {
  localStorage.setItem(customTrackerStorageKey, JSON.stringify(trackers));
}

function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
