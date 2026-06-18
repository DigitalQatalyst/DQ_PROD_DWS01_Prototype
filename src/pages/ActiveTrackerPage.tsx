import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  Database,
  Download,
  Filter,
  FileSearch,
  Link as LinkIcon,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Upload,
  User,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { DqButton, DqIconButton } from '../components/DqButton';
import {
  getAllTrackers,
  getRecordsForTracker,
  getTrackerBySlug,
} from '../mocks/trackers.mock';
import type { TrackerDefinition, TrackerHealth, TrackerHistoryEvent, TrackerPriority, TrackerRecord } from '../types/tracker';

const currentUser = 'Bilal Waqar';
const viewStorageKey = 'dws-active-tracker-saved-view';
const settingsStorageKey = 'dws-active-tracker-settings';
const closedStatuses = ['closed', 'completed', 'done', 'resolved', 'implemented', 'balanced'];
const recordTypeOptions = ['Capacity / Workload', 'Backlog', 'Project Health', 'Governance', 'Risk / Issue', 'Decision', 'Action Log'];
const recordHealthOptions = ['Green', 'Amber', 'Red', 'Healthy', 'Closed'];
const recordPriorityOptions: TrackerPriority[] = ['Low', 'Medium', 'High', 'Critical'];
const recordStatusOptions = ['Created', 'Open', 'In Progress', 'Overloaded', 'Balanced', 'Reviewed', 'Closed', 'Escalated', 'Blocked'];
const assigneeOptions = ['Maya Khan', 'Rohan Patel', 'Hina Adam', 'Sara Khan', 'Unassigned'];
const teamSquadOptions = ['Squad Alpha', 'Platform Team', 'Governance', 'Delivery Ops', 'PMO'];
const tabs = ['Records', 'My Items', 'Overdue', 'At Risk', 'Recently Updated', 'About Tracker'] as const;

type ActiveTab = typeof tabs[number];
type DetailTab = 'Overview' | 'Activity' | 'Comments' | 'Evidence' | 'History';
type MetricFilter = 'all' | 'open' | 'overdue' | 'atRisk' | 'missingOwner' | 'notUpdated' | null;
type ExtraFilter = { type: 'rag'; value: TrackerHealth | 'No RAG' } | { type: 'discipline'; value: 'lt3' | '3to7' | 'gt7' | 'none' } | null;
type SortKey = 'id' | 'title' | 'owner' | 'dueDate' | 'lastUpdated' | 'status' | 'rag';
type SortDirection = 'asc' | 'desc';

type FilterState = {
  idSearch: string;
  titleSearch: string;
  ownerSearch: string;
  owners: string[];
  teams: string[];
  priorities: TrackerPriority[];
  statuses: string[];
  dueDate: string[];
  rag: Array<TrackerHealth | 'No RAG'>;
  lastUpdated: string[];
  nextActionSearch: string;
};

type SortState = {
  key: SortKey | null;
  direction: SortDirection;
};

type ColumnKey = 'id' | 'title' | 'owner' | 'team' | 'priority' | 'status' | 'dueDate' | 'rag' | 'lastUpdated' | 'nextAction';

type SettingsState = {
  visibleColumns: Record<ColumnKey, boolean>;
  defaultSort: SortKey | 'none';
  defaultDirection: SortDirection;
  pageSize: number;
  showRightRail: boolean;
  highlightOverdueRows: boolean;
  compactDensity: boolean;
};

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

type DrawerFocus = 'summary' | 'nextAction' | null;

const defaultFilters: FilterState = {
  idSearch: '',
  titleSearch: '',
  ownerSearch: '',
  owners: [],
  teams: [],
  priorities: [],
  statuses: [],
  dueDate: [],
  rag: [],
  lastUpdated: [],
  nextActionSearch: '',
};

const columnLabels: Record<ColumnKey, string> = {
  id: 'Record ID',
  title: 'Title / Item Name',
  owner: 'Owner',
  team: 'Team / Squad',
  priority: 'Priority',
  status: 'Status',
  dueDate: 'Due Date',
  rag: 'RAG',
  lastUpdated: 'Last Updated',
  nextAction: 'Next Action',
};

const defaultSettings: SettingsState = {
  visibleColumns: {
    id: true,
    title: true,
    owner: true,
    team: true,
    priority: true,
    status: true,
    dueDate: true,
    rag: true,
    lastUpdated: true,
    nextAction: true,
  },
  defaultSort: 'none',
  defaultDirection: 'asc',
  pageSize: 5,
  showRightRail: true,
  highlightOverdueRows: true,
  compactDensity: false,
};

export function ActiveTrackerPage() {
  const { trackerSlug, recordId } = useParams();
  const navigate = useNavigate();
  const tracker = getTrackerBySlug(trackerSlug);
  const allTrackers = useMemo(() => getAllTrackers(), []);
  const savedView = readJson<{
    trackerSlug: string;
    activeTab: ActiveTab;
    filters: FilterState;
    metricFilter: MetricFilter;
    extraFilter: ExtraFilter;
    sort: SortState;
    pageSize: number;
  }>(viewStorageKey);
  const savedSettings = readJson<SettingsState>(settingsStorageKey);
  const savedFilters = normalizeRecordFilters(savedView?.filters);
  const [trackerSearch, setTrackerSearch] = useState('');
  const [recordSearch, setRecordSearch] = useState('');
  const [records, setRecords] = useState<TrackerRecord[]>(() => tracker ? getRecordsForTracker(tracker.id) : []);
  const [activeTab, setActiveTab] = useState<ActiveTab>(savedView?.activeTab || 'Records');
  const [filters, setFilters] = useState<FilterState>(savedFilters);
  const [metricFilter, setMetricFilter] = useState<MetricFilter>(savedView?.metricFilter || null);
  const [extraFilter, setExtraFilter] = useState<ExtraFilter>(savedView?.extraFilter || null);
  const [sort, setSort] = useState<SortState>(savedView?.sort || { key: null, direction: 'asc' });
  const [settings, setSettings] = useState<SettingsState>(savedSettings || defaultSettings);
  const [pageSize, setPageSize] = useState(savedView?.pageSize || savedSettings?.pageSize || 5);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);


  useEffect(() => {
    if (!tracker) return;
    setRecords(getRecordsForTracker(tracker.id));
    setPage(1);
    if (savedView && savedView.trackerSlug !== tracker.slug) {
      setActiveTab(savedView.activeTab || 'Records');
      setFilters(normalizeRecordFilters(savedView.filters));
      setMetricFilter(savedView.metricFilter || null);
      setExtraFilter(savedView.extraFilter || null);
      setSort(savedView.sort || { key: null, direction: 'asc' });
      setPageSize(savedView.pageSize || settings.pageSize);
    }
  }, [tracker?.slug]);

  useEffect(() => setPage(1), [activeTab, filters, metricFilter, extraFilter, sort, pageSize, trackerSlug]);

  const filteredRecords = useMemo(
    () => applyRecordView(records, activeTab, filters, metricFilter, extraFilter, sort),
    [records, activeTab, filters, metricFilter, extraFilter, sort]
  );
  const selectedRecord = useMemo(
    () => recordId ? records.find((record) => record.id === recordId) || null : null,
    [recordId, records]
  );

  if (!tracker) return <TrackerNotFound onBack={() => navigate('/tracker/tracker-hub')} />;

  const metrics = getMetrics(records, tracker);
  const filterOptions = getFilterOptions(records, tracker);
  const filteredTrackers = allTrackers.filter((item) => {
    const query = trackerSearch.trim().toLowerCase();
    return !query || `${item.name} ${item.owner} ${item.purpose}`.toLowerCase().includes(query);
  });
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const clearFilters = () => {
    setActiveTab('Records');
    setFilters(defaultFilters);
    setMetricFilter(null);
    setExtraFilter(null);
    setSort({ key: null, direction: 'asc' });
  };
  const applyMetric = (filter: MetricFilter) => {
    setActiveTab('Records');
    setExtraFilter(null);
    setMetricFilter(filter === 'all' ? null : filter);
  };
  const saveView = () => {
    localStorage.setItem(viewStorageKey, JSON.stringify({ trackerSlug: tracker.slug, activeTab, filters, metricFilter, extraFilter, sort, pageSize }));
    toast.success('Tracker view saved');
  };
  const exportTracker = () => {
    const rows = filteredRecords.map((record) => [
      record.id,
      record.title,
      record.owner,
      record.teamOrSquad,
      record.priority,
      record.status,
      record.dueDate,
      record.rag,
      record.lastUpdated,
      record.nextAction,
      record.description,
    ]);
    downloadCsv(`${tracker.slug}-records.csv`, ['Record ID', 'Title', 'Owner', 'Team / Squad', 'Priority', 'Status', 'Due Date', 'RAG', 'Last Updated', 'Next Action', 'Description'], rows);
    toast.success('Tracker export downloaded');
  };
  const createRecordLocal = (draft: AddRecordDraft) => {
    const slugify = (value: string) =>
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const ragToHealth = (status: string, rag: TrackerHealth): TrackerRecord['health'] => {
      const s = status.toLowerCase();
      if (s === 'closed' || s.includes('closed')) return 'Closed';
      if (s === 'reviewed') return 'Healthy';
      if (rag === 'Green') return 'Green';
      if (rag === 'Amber') return 'Amber';
      return 'Red';
    };
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const opened = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()} at ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const unit = tracker.id === 'workload-distribution' ? 'Workload Distribution' : tracker.name;
    const type = tracker.id === 'workload-distribution' ? 'Capacity / Workload' : tracker.trackerType;
    const health = ragToHealth(draft.status, draft.rag);
    const tags = [tracker.id === 'workload-distribution' ? 'Workload' : unit, health];
    const workflowSlug = tracker.id === 'workload-distribution' ? 'workload-review' : 'tracker-workflow';

    const nextRecord: TrackerRecord = {
      id: nextRecordId(tracker, records),
      trackerId: tracker.id,
      title: draft.title,
      description: draft.description || `${draft.title} requires governed tracker follow-up.`,
      owner: draft.owner,
      teamOrSquad: draft.teamOrSquad,
      unit,
      type,
      priority: draft.priority,
      status: draft.status,
      dueDate: draft.dueDate,
      rag: draft.rag,
      health,
      lastUpdated: 'Today',
      opened,
      nextAction: draft.nextAction,
      tags,
      savedCount: 0,
      workspace: 'DWS.01',
      ownerSlug: slugify(draft.owner || 'Unassigned'),
      teamSlug: slugify(draft.teamOrSquad || 'Unassigned'),
      workflowSlug,
      history: [
        { id: `history-${Date.now()}-created`, eventType: 'Created', actor: currentUser, timestamp: 'Today' },
        { id: `history-${Date.now()}-status`, eventType: 'Status', actor: currentUser, timestamp: 'Today', newValue: draft.status },
        { id: `history-${Date.now()}-health`, eventType: 'Health', actor: currentUser, timestamp: 'Today', newValue: health },
      ],
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
    return nextRecord;
  };

  const insertRecordLocal = (record: TrackerRecord) => {
    setRecords((current) => [record, ...current]);
  };

  const deleteRecordLocal = (recordId: string) => {
    setRecords((current) => current.filter((item) => item.id !== recordId));
  };

  const updateRecord = (record: TrackerRecord, opts?: { toast?: string | false }) => {
    setRecords((current) => current.map((item) => item.id === record.id ? record : item));
    if (opts?.toast === false) return;
    toast.success(opts?.toast ?? 'Tracker record updated');
  };

  const addRecord = (draft: AddRecordDraft) => {
    createRecordLocal(draft);
    setAddOpen(false);
    toast.success('Tracker record created');
  };
  const updateRecordField = (record: TrackerRecord, patch: Partial<TrackerRecord>) => {
    const updated = {
      ...record,
      ...patch,
      missingOwner: patch.owner !== undefined ? !patch.owner : record.missingOwner,
      isBlocked: patch.status !== undefined ? patch.status.toLowerCase().includes('blocked') : record.isBlocked,
    };
    updateRecord(updated);
  };
  const openRecord = (record: TrackerRecord) => {
    navigate(`/tracker/active-tracker/${tracker.slug}/records/${record.id}`);
  };
  const applySettings = (nextSettings: SettingsState) => {
    setSettings(nextSettings);
    setPageSize(nextSettings.pageSize);
    setSort({
      key: nextSettings.defaultSort === 'none' ? null : nextSettings.defaultSort,
      direction: nextSettings.defaultDirection,
    });
    localStorage.setItem(settingsStorageKey, JSON.stringify(nextSettings));
    setSettingsOpen(false);
    toast.success('Tracker settings applied');
  };
  const resetSettings = () => {
    setSettings(defaultSettings);
    setPageSize(defaultSettings.pageSize);
    localStorage.setItem(settingsStorageKey, JSON.stringify(defaultSettings));
    toast.success('Tracker settings reset');
  };

  const showTable = activeTab !== 'About Tracker';

  if (recordId) {
    return (
      <RecordDetailRoute
        tracker={tracker}
        records={records}
        record={selectedRecord}
        recordId={recordId}
        search={recordSearch}
        onSearch={setRecordSearch}
        onSave={(next) => updateRecord(next, { toast: false })}
        onCreateRecord={(draftData) => createRecordLocal(draftData)}
        onInsertRecord={insertRecordLocal}
        onDeleteRecord={deleteRecordLocal}
        onBack={() => navigate(`/tracker/active-tracker/${tracker.slug}`)}
        onHub={() => navigate('/tracker/tracker-hub')}
        onSelect={(id) => navigate(`/tracker/active-tracker/${tracker.slug}/records/${id}`)}
      />
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden px-6 lg:px-8">
      <header className="shrink-0 pt-6">
        <Breadcrumb trackerName={tracker.name} onHub={() => navigate('/tracker/tracker-hub')} />
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-[32px] font-bold leading-tight text-primary">{tracker.name}</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-primary">{tracker.purpose}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-start gap-2 xl:justify-end">
            <DqButton variant="orange" onClick={() => setAddOpen(true)} className="h-12 px-5"><Plus size={17} strokeWidth={1.5} /> Add Record</DqButton>
            <DqButton variant="navy" onClick={saveView} className="h-12 px-5"><Bookmark size={17} strokeWidth={1.5} /> Save View</DqButton>
            <DqButton variant="navy" onClick={exportTracker} className="h-12 px-5"><Download size={17} strokeWidth={1.5} /> Export Tracker</DqButton>
            <DqIconButton label="Tracker settings" onClick={() => setSettingsOpen(true)} className="h-12 w-12"><Settings size={19} strokeWidth={1.5} /></DqIconButton>
          </div>
        </div>
      </header>

      <div
        className="min-h-0 flex-1 grid gap-5 overflow-hidden"
        style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <main className="flex min-w-0 flex-col overflow-hidden h-full">
          <section className="flex min-h-0 flex-col overflow-hidden rounded-card border border-border-default bg-white shadow-sm h-full">
            <div className="sticky top-0 z-10 bg-white">
              <Tabs activeTab={activeTab} onTab={(tab) => { setActiveTab(tab); setMetricFilter(null); setExtraFilter(null); }} />
            </div>
            {showTable ? (
              <div className="flex-1 min-h-0 overflow-y-auto pb-4">
                <RecordsTable
                  tracker={tracker}
                  records={pagedRecords}
                  selectedRecordId={recordId}
                  totalRecords={filteredRecords.length}
                  page={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  columns={settings.visibleColumns}
                  sort={sort}
                  filters={filters}
                  options={filterOptions}
                  compact={settings.compactDensity}
                  highlightOverdue={settings.highlightOverdueRows}
                  onSort={(key, direction) => setSort((current) => ({ key, direction: direction || (current.key === key && current.direction === 'asc' ? 'desc' : 'asc') }))}
                  onFilterChange={setFilters}
                  onClearFilters={clearFilters}
                  onPage={setPage}
                  onPageSize={(size) => setPageSize(size)}
                  onOpen={openRecord}
                  onUpdate={updateRecordField}
                />
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto pb-4">
                <AboutTrackerPanel tracker={tracker} onBack={() => setActiveTab('Records')} />
              </div>
            )}
          </section>
        </main>


      </div>

      <AddRecordModal tracker={tracker} open={addOpen} onClose={() => setAddOpen(false)} onAdd={addRecord} />
      <SettingsModal open={settingsOpen} settings={settings} onClose={() => setSettingsOpen(false)} onApply={applySettings} onReset={resetSettings} />
    </div>
  );
}

function RecordDetailRoute({
  tracker,
  records,
  record,
  recordId,
  search,
  onSearch,
  onSave,
  onCreateRecord,
  onInsertRecord,
  onDeleteRecord,
  onBack,
  onHub,
  onSelect,
}: {
  tracker: TrackerDefinition;
  records: TrackerRecord[];
  record: TrackerRecord | null;
  recordId: string;
  search: string;
  onSearch: (value: string) => void;
  onSave: (record: TrackerRecord) => void;
  onCreateRecord: (draft: AddRecordDraft) => TrackerRecord;
  onInsertRecord: (record: TrackerRecord) => void;
  onDeleteRecord: (recordId: string) => void;
  onBack: () => void;
  onHub: () => void;
  onSelect: (recordId: string) => void;
}) {
  const [draft, setDraft] = useState<TrackerRecord | null>(record);
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const [comment, setComment] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkFields, setShowLinkFields] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [escalationNote, setEscalationNote] = useState('');
  const [escalationOwner, setEscalationOwner] = useState('');
  const [leftPage, setLeftPage] = useState(1);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(record);
    setDirty(false);
    setLeftPage(1);
    setComment('');
    setLinkTitle('');
    setLinkUrl('');
    setShowLinkFields(false);
    setMoreOpen(false);
    setActiveTab('Overview');
    setAddOpen(false);
    setEscalateOpen(false);
    setEscalationReason('');
    setEscalationNote('');
    setEscalationOwner('');
  }, [record?.id]);

  useEffect(() => {
    setLeftPage(1);
  }, [search]);

  if (!record || !draft) {
    return <RecordNotFound tracker={tracker} recordId={recordId} onBack={onBack} onHub={onHub} />;
  }

  const guardedNavigate = (navigate: () => void) => {
    if (dirty) {
      toast.warning('Save changes before navigating away from this record');
      return;
    }
    navigate();
  };
  const updateDraft = (patch: Partial<TrackerRecord>) => {
    const slugify = (value: string) =>
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    setDraft((current) => current ? {
      ...current,
      ...patch,
      missingOwner: patch.owner !== undefined ? !patch.owner : current.missingOwner,
      isBlocked: patch.status !== undefined ? patch.status.toLowerCase().includes('blocked') : current.isBlocked,
      ownerSlug: patch.owner !== undefined ? slugify(patch.owner || 'Unassigned') : current.ownerSlug,
      teamSlug: patch.teamOrSquad !== undefined ? slugify(patch.teamOrSquad || 'Unassigned') : current.teamSlug,
    } : current);
    setDirty(true);
  };
  const saveDraft = () => {
    const updated: TrackerRecord = {
      ...draft,
      lastUpdated: 'Today',
      commentCount: draft.comments.length,
      evidenceCount: draft.evidence.length,
      savedCount: draft.savedCount + 1,
      activity: [{ id: `activity-${Date.now()}-saved`, actor: currentUser, action: 'Saved changes', timestamp: 'Now' }, ...draft.activity],
      history: [{ id: `history-${Date.now()}-saved`, eventType: 'Saved', actor: currentUser, timestamp: 'Now', newValue: 'Changes saved' }, ...draft.history],
    };
    onSave(updated);
    setDraft(updated);
    setDirty(false);
    toast.success('Record saved');
  };
  const markComplete = () => {
    const updated: TrackerRecord = {
      ...draft,
      status: 'In Progress',
      rag: 'Amber',
      health: 'Amber',
      isBlocked: false,
      lastUpdated: 'Today',
      activity: [{ id: `activity-${Date.now()}-started`, actor: currentUser, action: 'Started working on record', timestamp: 'Now' }, ...draft.activity],
      history: [{ id: `history-${Date.now()}-started`, eventType: 'Activity', actor: currentUser, timestamp: 'Now', newValue: 'Started working on record' }, ...draft.history],
    };
    onSave(updated);
    setDraft(updated);
    setDirty(false);
    toast.success('Record moved to In Progress');
  };

  const healthToRag = (health: TrackerRecord['health']): TrackerHealth => {
    if (health === 'Green' || health === 'Healthy' || health === 'Closed') return 'Green';
    if (health === 'Amber') return 'Amber';
    return 'Red';
  };

  const stageIndexFromStatus = (status: string) => {
    if (status === 'Created' || status === 'Open') return 0;
    if (status === 'In Progress') return 1;
    if (status === 'Overloaded' || status === 'Escalated' || status === 'Blocked') return 2;
    if (status === 'Reviewed' || status === 'Balanced') return 3;
    if (status === 'Closed') return 4;
    return 2;
  };

  const updateStageStatus = (nextStatus: TrackerRecord['status']) => {
    const currentStageIndex = stageIndexFromStatus(draft.status);
    const nextStageIndex = stageIndexFromStatus(nextStatus);

    if (draft.status === 'Closed' && nextStageIndex < currentStageIndex) {
      toast.warning('Closed records cannot move backwards');
      return;
    }

    const rag: TrackerHealth =
      nextStatus === 'Reviewed' || nextStatus === 'Closed'
        ? 'Green'
        : 'Amber';
    const health: TrackerRecord['health'] =
      nextStatus === 'Reviewed' ? 'Healthy' : nextStatus === 'Closed' ? 'Closed' : 'Amber';

    const updated: TrackerRecord = {
      ...draft,
      status: nextStatus,
      rag,
      health,
      isBlocked: false,
      isOverdue: nextStatus === 'Closed' ? false : draft.isOverdue,
      lastUpdated: 'Today',
      activity: [{ id: `activity-${Date.now()}-stage`, actor: currentUser, action: `Stage updated to ${nextStatus}`, timestamp: 'Now' }, ...draft.activity],
      history: [{ id: `history-${Date.now()}-stage`, eventType: 'Status', actor: currentUser, timestamp: 'Now', oldValue: draft.status, newValue: nextStatus }, ...draft.history],
    };

    onSave(updated);
    setDraft(updated);
    setDirty(false);
    toast.success('Record status updated');
  };

  const submitEscalation = () => {
    const reason = escalationReason.trim();
    if (!reason) {
      toast.warning('Escalation reason is required');
      return;
    }

    const assignedOwner = escalationOwner.trim() || currentUser;
    const nextTags = Array.from(new Set([...(draft.tags || []), 'Escalated']));

    const updated: TrackerRecord = {
      ...draft,
      status: 'Escalated',
      rag: 'Red',
      health: 'Red',
      tags: nextTags,
      isBlocked: false,
      lastUpdated: 'Today',
      activity: [{ id: `activity-${Date.now()}-escalate`, actor: assignedOwner, action: `Escalated record: ${reason}`, timestamp: 'Now' }, ...draft.activity],
      history: [
        {
          id: `history-${Date.now()}-escalate`,
          eventType: 'Escalation',
          actor: assignedOwner,
          timestamp: 'Now',
          oldValue: draft.status,
          newValue: 'Escalated',
        },
        ...draft.history,
      ],
    };

    onSave(updated);
    setDraft(updated);
    setDirty(false);
    setEscalateOpen(false);
    toast.success('Record escalated');
  };

  const markBlocked = () => {
    const updated: TrackerRecord = {
      ...draft,
      status: 'Blocked',
      rag: 'Red',
      health: 'Red',
      isBlocked: true,
      lastUpdated: 'Today',
      tags: Array.from(new Set([...(draft.tags || []), 'Blocked'])),
      activity: [{ id: `activity-${Date.now()}-blocked`, actor: currentUser, action: 'Record marked blocked', timestamp: 'Now' }, ...draft.activity],
      history: [{ id: `history-${Date.now()}-blocked`, eventType: 'Status', actor: currentUser, timestamp: 'Now', oldValue: draft.status, newValue: 'Blocked' }, ...draft.history],
    };
    onSave(updated);
    setDraft(updated);
    setDirty(false);
    toast.success('Record marked blocked');
    setMoreOpen(false);
  };

  const copyRecordLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      toast.success('Record link copied');
    } catch {
      toast.error('Could not copy link');
    }
    setMoreOpen(false);
  };

  const duplicateRecord = () => {
    if (dirty) {
      toast.warning('Save changes before duplicating this record');
      return;
    }
    const nextId = nextRecordId(tracker, records);
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const opened = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()} at ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const duplicated: TrackerRecord = {
      ...draft,
      id: nextId,
      opened,
      lastUpdated: 'Today',
      savedCount: 0,
      history: [{ id: `history-${Date.now()}-duplicate`, eventType: 'Duplicated', actor: currentUser, timestamp: 'Now', oldValue: draft.id, newValue: nextId }, ...draft.history],
      activity: [{ id: `activity-${Date.now()}-duplicate`, actor: currentUser, action: 'Duplicated record', timestamp: 'Now' }, ...draft.activity],
    };

    onInsertRecord(duplicated);
    setMoreOpen(false);
    onSelect(nextId);
  };

  const deleteLocalRecord = () => {
    if (dirty) {
      toast.warning('Save changes before deleting this record');
      return;
    }
    if (!window.confirm('Delete local record?')) return;

    const idx = records.findIndex((r) => r.id === draft.id);
    const next = records[idx + 1] || records[idx - 1] || null;

    onDeleteRecord(draft.id);
    setMoreOpen(false);
    toast.success('Tracker record deleted');

    if (next) onSelect(next.id);
    else onBack();
  };
  const openNote = () => {
    setActiveTab('Comments');
    setTimeout(() => commentInputRef.current?.focus(), 0);
  };
  const openEvidence = () => {
    setActiveTab('Evidence');
    setShowLinkFields(true);
    toast.message('Evidence input opened');
  };
  const postComment = () => {
    if (!comment.trim()) return;
    updateDraft({
      comments: [{ id: `comment-${Date.now()}`, author: currentUser, body: comment.trim(), timestamp: 'Now' }, ...draft.comments],
      activity: [{ id: `activity-${Date.now()}-note`, actor: currentUser, action: 'Added a note', timestamp: 'Now' }, ...draft.activity],
    });
    setComment('');
    toast.success('Note added');
  };
  const addLink = () => {
    if (!linkTitle.trim()) return;
    updateDraft({
      evidence: [{ id: `evidence-${Date.now()}`, title: linkTitle.trim(), type: 'Link', url: linkUrl.trim(), addedBy: currentUser, addedAt: 'Now' }, ...draft.evidence],
      activity: [{ id: `activity-${Date.now()}-link`, actor: currentUser, action: 'Added evidence link', timestamp: 'Now' }, ...draft.activity],
    });
    setLinkTitle('');
    setLinkUrl('');
    setShowLinkFields(false);
    toast.success('Evidence link added');
  };
  const uploadEvidence = () => {
    updateDraft({
      evidence: [{ id: `evidence-${Date.now()}`, title: 'Mock uploaded evidence', type: 'File', addedBy: currentUser, addedAt: 'Now' }, ...draft.evidence],
      activity: [{ id: `activity-${Date.now()}-upload`, actor: currentUser, action: 'Uploaded evidence', timestamp: 'Now' }, ...draft.activity],
    });
    toast.success('Evidence uploaded');
  };
  const latestUpdate = draft.activity[0]?.action || '';
  const updateLatest = (value: string) => {
    const current = draft.activity[0] || { id: `activity-${Date.now()}`, actor: currentUser, action: '', timestamp: 'Now' };
    updateDraft({ activity: [{ ...current, action: value, timestamp: 'Now' }, ...draft.activity.slice(1)] });
  };

  const recordIndex = records.findIndex((r) => r.id === draft.id);
  const prevRecordId = recordIndex > 0 ? records[recordIndex - 1].id : null;
  const followingRecordId = recordIndex >= 0 && recordIndex < records.length - 1 ? records[recordIndex + 1].id : null;

  const stageIndex = stageIndexFromStatus(draft.status);
  const stages: Array<{ number: number; status: TrackerRecord['status']; label: string }> = [
    { number: 1, status: 'Created', label: 'Created' },
    { number: 2, status: 'In Progress', label: 'In Progress' },
    { number: 3, status: 'Overloaded', label: 'Overloaded' },
    { number: 4, status: 'Reviewed', label: 'Reviewed' },
    { number: 5, status: 'Closed', label: 'Closed' },
  ];

  const healthBadgeClass = (health: TrackerRecord['health']) => {
    if (health === 'Amber') return 'dq-badge-warning';
    if (health === 'Red') return 'dq-badge-danger';
    if (health === 'Green' || health === 'Healthy') return 'dq-badge-success';
    return 'dq-badge-gray dq-badge-orange';
  };

  const addTag = (tag: string) => {
    const value = tag.trim();
    if (!value) return;
    const nextTags = Array.from(new Set([...(draft.tags || []), value]));
    const updated: TrackerRecord = {
      ...draft,
      tags: nextTags,
      activity: [{ id: `activity-${Date.now()}-tag-add`, actor: currentUser, action: `Added tag ${value}`, timestamp: 'Now' }, ...draft.activity],
      history: [{ id: `history-${Date.now()}-tag-add`, eventType: 'Tag added', actor: currentUser, timestamp: 'Now', newValue: value }, ...draft.history],
    };
    onSave(updated);
    setDraft(updated);
    setDirty(false);
  };

  const removeTag = (tag: string) => {
    const value = tag.trim();
    const nextTags = (draft.tags || []).filter((t) => t !== value);
    const updated: TrackerRecord = {
      ...draft,
      tags: nextTags,
      activity: [{ id: `activity-${Date.now()}-tag-remove`, actor: currentUser, action: `Removed tag ${value}`, timestamp: 'Now' }, ...draft.activity],
      history: [{ id: `history-${Date.now()}-tag-remove`, eventType: 'Tag removed', actor: currentUser, timestamp: 'Now', oldValue: value }, ...draft.history],
    };
    onSave(updated);
    setDraft(updated);
    setDirty(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] gap-4 overflow-hidden px-6 lg:px-8">
      <aside className="w-[360px] shrink-0">
        <RecordListPanel
          tracker={tracker}
          records={records}
          selectedRecordId={draft.id}
          search={search}
          onSearch={onSearch}
          onSelect={(id) => guardedNavigate(() => onSelect(id))}
          onNewTracker={() => setAddOpen(true)}
          page={leftPage}
          pageSize={10}
          onPageChange={setLeftPage}
        />
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
        <div className="shrink-0 border-b border-border-subtle bg-white px-5 pb-3 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => guardedNavigate(onBack)}
                className="grid h-11 w-11 place-items-center rounded-button border border-border-default bg-white text-primary hover:bg-navy-50"
                aria-label="Back"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
              </button>

              <button
                type="button"
                onClick={() => prevRecordId && guardedNavigate(() => onSelect(prevRecordId))}
                disabled={!prevRecordId}
                className="grid h-10 w-10 place-items-center rounded-button border border-border-default bg-white text-secondary font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ‹
              </button>

              <span className="px-2 text-sm font-bold text-secondary">
                {(recordIndex >= 0 ? recordIndex + 1 : 0)} / {records.length}
              </span>

              <button
                type="button"
                onClick={() => followingRecordId && guardedNavigate(() => onSelect(followingRecordId))}
                disabled={!followingRecordId}
                className="grid h-10 w-10 place-items-center rounded-button border border-border-default bg-white text-secondary font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ›
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => guardedNavigate(onBack)}
                className="rounded-button px-2 py-2 text-sm font-bold text-primary hover:bg-navy-50"
              >
                List
              </button>
              <button
                type="button"
                onClick={() => guardedNavigate(onHub)}
                className="grid h-10 w-10 place-items-center rounded-button border border-border-default bg-white text-primary font-bold hover:bg-navy-50"
              >
                X
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-[28px] font-bold leading-tight text-primary">{draft.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className={`dq-badge ${healthBadgeClass(draft.health)}`}>{draft.health}</span>
              <span className="rounded-full border border-border-subtle bg-surface px-3 py-1 text-xs font-bold text-primary">
                {draft.status}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-4 w-1 rounded-full bg-secondary" />
              <div className="text-sm font-semibold text-text-secondary">
                {draft.unit} · Created {draft.opened}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <DqButton
                variant="orange"
                onClick={markComplete}
                disabled={draft.status === 'Closed'}
                className="h-11 px-5"
              >
                Start Working
              </DqButton>
              <DqButton variant="outline" onClick={() => setEscalateOpen(true)} className="h-11 px-5">
                Escalate
              </DqButton>
              <DqButton variant="outline" onClick={openNote} className="h-11 px-5">
                <MessageSquare size={16} strokeWidth={1.5} /> Add note
              </DqButton>
            </div>

            <div className="relative flex items-center gap-2">
              <DqButton variant="outline" onClick={saveDraft} disabled={!dirty} className="h-11 px-5">
                <Check size={16} strokeWidth={1.5} /> Save
              </DqButton>
              <DqIconButton
                label="More record actions"
                onClick={() => setMoreOpen((open) => !open)}
                className="h-11 w-11"
              >
                <MoreHorizontal size={18} strokeWidth={1.5} />
              </DqIconButton>

              {moreOpen && (
                <div className="absolute right-0 top-12 z-20 w-56 rounded-card border border-border-default bg-white p-2 text-sm font-semibold text-primary shadow-lg">
                  <button onClick={duplicateRecord} className="w-full rounded-button px-3 py-2 text-left hover:bg-navy-50">
                    Duplicate Record
                  </button>
                  <button onClick={copyRecordLink} className="w-full rounded-button px-3 py-2 text-left hover:bg-navy-50">
                    Copy Record Link
                  </button>
                  <button onClick={markBlocked} className="w-full rounded-button px-3 py-2 text-left hover:bg-navy-50">
                    Mark Blocked
                  </button>
                  <button onClick={deleteLocalRecord} className="w-full rounded-button px-3 py-2 text-left hover:bg-navy-50">
                    Delete Local Record
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-card border border-border-subtle bg-white p-4 shadow-sm">
            <div className="flex items-center">
              {stages.map((stage, i) => {
                const isActive = stageIndex === i;
                const isBackDisabled = draft.status === 'Closed' && i < stageIndex;
                return (
                  <Fragment key={stage.status}>
                    <button
                      type="button"
                      onClick={() => updateStageStatus(stage.status)}
                      disabled={isBackDisabled}
                      className={`flex min-w-[84px] flex-col items-center gap-1 ${isBackDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${
                          isActive
                            ? 'bg-secondary text-white'
                            : i < stageIndex
                              ? 'bg-surface text-text-muted border border-border-default'
                              : 'bg-white text-text-muted border border-border-default'
                        }`}
                      >
                        {stage.number}
                      </span>
                      <span className={`text-[11px] font-bold ${isActive ? 'text-secondary' : 'text-text-muted'}`}>
                        {stage.label}
                      </span>
                    </button>
                    {i < stages.length - 1 && (
                      <div
                        className={`mx-3 h-0.5 flex-1 ${i < stageIndex ? 'bg-secondary' : 'bg-border-subtle'}`}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <RecordDetailTabs activeTab={activeTab} onTab={setActiveTab} />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 bg-surface p-5">
          {activeTab === 'Overview' && (
            <RecordDetailsForm
              draft={draft}
              latestUpdate={latestUpdate}
              onUpdate={updateDraft}
              onLatestUpdate={updateLatest}
            />
          )}
          {activeTab === 'Activity' && <ActivityTimeline activity={draft.activity} />}
          {activeTab === 'Comments' && (
            <CommentsPanel
              comments={draft.comments}
              comment={comment}
              onComment={setComment}
              onPost={postComment}
              inputRef={commentInputRef}
            />
          )}
          {activeTab === 'Evidence' && (
            <EvidencePanel
              evidence={draft.evidence}
              showLinkFields={showLinkFields}
              linkTitle={linkTitle}
              linkUrl={linkUrl}
              onShowLinkFields={() => setShowLinkFields(true)}
              onLinkTitle={setLinkTitle}
              onLinkUrl={setLinkUrl}
              onAddLink={addLink}
              onUpload={uploadEvidence}
            />
          )}
          {activeTab === 'History' && <HistoryTimeline events={draft.history} />}
        </div>
      </section>

      <aside className="w-[300px] shrink-0 overflow-y-auto rounded-card border border-border-default bg-white shadow-sm">
        <RecordDetailRightRail
          record={draft}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          onLinkedEntityOpened={() => toast.success('Linked entity opened')}
        />
      </aside>

      <AddRecordModal
        tracker={tracker}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(draftData) => {
          const created = onCreateRecord(draftData);
          setAddOpen(false);
          toast.success('Tracker record created');
          onSelect(created.id);
        }}
      />

      {escalateOpen && (
        <ModalFrame title="Escalate record" width="max-w-xl" onClose={() => setEscalateOpen(false)}>
          <section className="space-y-4">
            <ModalField label="Escalation reason" value={escalationReason} onChange={setEscalationReason} />
            <label className="block">
              <span className="dq-field-label">Escalation note</span>
              <textarea
                value={escalationNote}
                onChange={(e) => setEscalationNote(e.target.value)}
                rows={4}
                className="dq-textarea mt-2"
              />
            </label>
            <ModalField
              label="Escalation owner"
              value={escalationOwner}
              onChange={setEscalationOwner}
            />
          </section>
          <div className="mt-6 flex justify-end gap-2">
            <DqButton variant="outline" onClick={() => setEscalateOpen(false)}>
              Cancel
            </DqButton>
            <DqButton variant="orange" onClick={submitEscalation}>
              Escalate
            </DqButton>
          </div>
        </ModalFrame>
      )}
    </div>
  );
}

function RecordListPanel({
  tracker,
  records,
  selectedRecordId,
  search,
  onSearch,
  onSelect,
  onNewTracker,
  page,
  pageSize,
  onPageChange,
}: {
  tracker: TrackerDefinition;
  records: TrackerRecord[];
  selectedRecordId: string;
  search: string;
  onSearch: (value: string) => void;
  onSelect: (recordId: string) => void;
  onNewTracker: () => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const query = search.trim().toLowerCase();
  const filtered = records.filter((record) => {
    if (!query) return true;
    const haystack = [
      record.title,
      record.unit,
      record.type,
      record.status,
      record.health,
      record.owner,
      record.teamOrSquad,
      tracker.name,
    ].join(' ').toLowerCase();
    return haystack.includes(query);
  });
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const timeLabel = now.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

  const dueLabel = (record: TrackerRecord) => {
    if (record.isOverdue) return 'Due Today';
    if (record.dueDate === 'Today') return 'Today';
    return record.dueDate;
  };

  return (
    <aside className="flex h-full flex-col rounded-card border border-border-default bg-white p-4 shadow-sm">
      <div className="shrink-0">
        <h2 className="text-lg font-bold text-primary">Tracker Hub</h2>
        <p className="mt-1 text-xs font-semibold text-text-muted">{dateLabel} · {timeLabel}</p>
        <DqButton variant="orange" onClick={onNewTracker} className="mt-3 h-10 w-full px-4">
          <Plus size={16} strokeWidth={1.5} /> New Tracker
        </DqButton>
        <p className="mt-3 text-xs font-bold text-text-secondary">{records.length} Trackers</p>
        <div className="relative mt-2">
          <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search list..."
            className="dq-input pl-9"
          />
        </div>
      </div>

      <div className="mt-4 flex-1 min-h-0 space-y-1 overflow-y-auto pr-1">
        {records.length === 0 && (
          <div className="rounded-card border border-border-subtle p-4 text-sm font-semibold text-text-secondary">
            No tracker records found.
            <div className="mt-1 text-xs">Create a new tracker record or clear your search.</div>
          </div>
        )}
        {records.length > 0 && filtered.length === 0 && (
          <div className="rounded-card border border-border-subtle p-4 text-sm font-semibold text-text-secondary">
            No matching tracker records.
            <div className="mt-1 text-xs">Try adjusting your search.</div>
          </div>
        )}
        {paged.map((record) => {
          const active = record.id === selectedRecordId;
          return (
            <button
              key={record.id}
              onClick={() => onSelect(record.id)}
              className={`w-full rounded-r-lg border-l-[3px] px-3 py-3 text-left transition ${active ? 'border-secondary bg-orange-50 text-primary' : 'border-transparent hover:bg-navy-50'}`}
            >
              <div className="truncate text-sm font-bold text-primary">{record.title}</div>
              <div className="mt-1 truncate text-xs font-semibold text-text-secondary">
                {record.unit} · {record.status} · {record.health}
              </div>
              <div className={`mt-1 text-xs font-semibold ${record.isOverdue ? 'text-danger' : 'text-text-muted'}`}>
                {dueLabel(record)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 shrink-0 border-t border-border-subtle pt-3">
        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-text-muted">
          <span>{start}–{end} of {total}</span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="rounded-button border border-border-default px-2 py-1 font-bold text-primary disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="rounded-button border border-border-default px-2 py-1 font-bold text-primary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function RecordDetailTabs({ activeTab, onTab }: { activeTab: DetailTab; onTab: (tab: DetailTab) => void }) {
  const detailTabs: DetailTab[] = ['Overview', 'Activity', 'Comments', 'Evidence', 'History'];
  return (
    <div className="dq-tabs flex overflow-x-auto px-3" role="tablist" aria-label="Tracker record detail tabs">
      {detailTabs.map((tab) => (
        <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => onTab(tab)} className={`dq-tab whitespace-nowrap ${activeTab === tab ? 'dq-tab-active text-secondary' : ''}`}>
          {tab}
        </button>
      ))}
    </div>
  );
}

function RecordDetailsForm({ draft, latestUpdate, onUpdate, onLatestUpdate }: { draft: TrackerRecord; latestUpdate: string; onUpdate: (patch: Partial<TrackerRecord>) => void; onLatestUpdate: (value: string) => void }) {
  const syncHealth = (health: TrackerRecord['health']) => {
    const rag: TrackerHealth = health === 'Green' || health === 'Healthy' || health === 'Closed' ? 'Green' : health === 'Amber' ? 'Amber' : 'Red';
    onUpdate({ health, rag });
  };

  return (
    <>
      <section className="dq-card">
        <h2 className="dq-card-title">DETAILS</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <DetailField label="Tracker name *" value={draft.title} onChange={(title) => onUpdate({ title })} />
          <DetailField label="Record ID" value={draft.id} readOnly monospace onChange={() => undefined} />
          <DetailField label="Unit *" value={draft.unit} onChange={(unit) => onUpdate({ unit })} />
          <DetailSelect label="Team / Squad" value={draft.teamOrSquad} options={teamSquadOptions} onChange={(teamOrSquad) => onUpdate({ teamOrSquad })} />
          <DetailSelect label="Type *" value={draft.type} options={recordTypeOptions} onChange={(type) => onUpdate({ type })} />
          <DetailSelect label="Priority" value={draft.priority} options={recordPriorityOptions} onChange={(priority) => onUpdate({ priority: priority as TrackerPriority })} />
          <DetailSelect label="Health *" value={draft.health} options={recordHealthOptions} onChange={(health) => syncHealth(health as TrackerRecord['health'])} />
          <DetailSelect label="Status" value={draft.status} options={recordStatusOptions} onChange={(status) => onUpdate({ status })} />
          <DetailSelect label="Assigned to" value={draft.owner || 'Unassigned'} options={assigneeOptions} onChange={(owner) => onUpdate({ owner: owner === 'Unassigned' ? '' : owner })} />
          <DetailField label="Last Updated" value={draft.lastUpdated} readOnly onChange={() => undefined} />
          <DetailField label="Opened *" value={draft.opened} readOnly onChange={() => undefined} />
          <DetailField label="Review due" value={draft.dueDate} onChange={(dueDate) => onUpdate({ dueDate, isOverdue: dueDate === 'Today' })} />
        </div>
      </section>
      <DetailTextarea title="DESCRIPTION" value={draft.description} onChange={(description) => onUpdate({ description })} />
      {latestUpdate && (
        <section className="dq-card">
          <h2 className="dq-card-title">LATEST UPDATE</h2>
          <textarea value={latestUpdate} onChange={(event) => onLatestUpdate(event.target.value)} rows={3} className="dq-textarea mt-4" />
        </section>
      )}
    </>
  );
}

function DetailField({ label, value, readOnly, monospace, onChange }: { label: string; value: string; readOnly?: boolean; monospace?: boolean; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="dq-field-label">{label}</span>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className={`dq-input ${readOnly ? 'bg-surface text-text-muted' : ''} ${monospace ? 'font-mono text-xs font-bold' : ''}`}
      />
    </label>
  );
}

function DetailSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="dq-field-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="dq-input">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function DetailTextarea({ title, value, onChange }: { title: string; value: string; onChange: (value: string) => void }) {
  return (
    <section className="dq-card">
      <h2 className="dq-card-title">{title}</h2>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="dq-textarea mt-4" />
    </section>
  );
}

function CommentsPanel({ comments, comment, onComment, onPost, inputRef }: { comments: TrackerRecord['comments']; comment: string; onComment: (value: string) => void; onPost: () => void; inputRef?: RefObject<HTMLTextAreaElement> }) {
  return (
    <section className="dq-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="dq-card-title">Comments</h2>
        <span className="text-xs font-semibold text-text-muted">{comments.length} comments</span>
      </div>
      <div className="mt-4 space-y-3">
        {comments.map((entry) => (
          <div key={entry.id} className="rounded-button border border-border-subtle bg-surface px-3 py-2 text-sm text-primary">
            <div className="font-bold">{entry.author}</div>
            <p className="mt-1 leading-6">{entry.body}</p>
            <div className="mt-1 text-xs font-semibold text-text-muted">{entry.timestamp}</div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm font-semibold text-text-secondary">
            No comments yet.
            <span className="mt-1 block text-xs font-normal">Add a note or comment to start the conversation.</span>
          </p>
        )}
      </div>
      <textarea ref={inputRef} value={comment} onChange={(event) => onComment(event.target.value)} rows={3} placeholder="Add comment..." className="dq-textarea mt-4" />
      <DqButton variant="navy" onClick={onPost} className="mt-3"><MessageSquare size={15} strokeWidth={1.5} /> Post</DqButton>
    </section>
  );
}

function EvidencePanel({ evidence, showLinkFields, linkTitle, linkUrl, onShowLinkFields, onLinkTitle, onLinkUrl, onAddLink, onUpload }: { evidence: TrackerRecord['evidence']; showLinkFields: boolean; linkTitle: string; linkUrl: string; onShowLinkFields: () => void; onLinkTitle: (value: string) => void; onLinkUrl: (value: string) => void; onAddLink: () => void; onUpload: () => void }) {
  return (
    <section className="dq-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="dq-card-title">Evidence / Links</h2>
        <div className="flex gap-2">
          <DqButton variant="outline" onClick={onShowLinkFields}><LinkIcon size={15} strokeWidth={1.5} /> Add Link</DqButton>
          <DqButton variant="outline" onClick={onUpload}><Upload size={15} strokeWidth={1.5} /> Upload Evidence</DqButton>
        </div>
      </div>
      {showLinkFields && (
        <div className="mt-4 grid gap-2 rounded-card border border-border-subtle bg-surface p-3 md:grid-cols-[1fr_1fr_auto]">
          <input value={linkTitle} onChange={(event) => onLinkTitle(event.target.value)} placeholder="Evidence title" className="dq-input" />
          <input value={linkUrl} onChange={(event) => onLinkUrl(event.target.value)} placeholder="Evidence link" className="dq-input" />
          <DqButton variant="navy" onClick={onAddLink}>Save Link</DqButton>
        </div>
      )}
      <div className="mt-4 space-y-2">
        {evidence.map((entry) => (
          <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-button border border-border-subtle bg-surface px-3 py-2 text-sm font-semibold text-primary">
            <span>{entry.title} · {entry.type}</span>
            <span className="text-xs text-text-muted">{entry.addedBy} · {entry.addedAt}</span>
          </div>
        ))}
        {evidence.length === 0 && (
          <p className="text-sm font-semibold text-text-secondary">
            No evidence added yet.
            <span className="mt-1 block text-xs font-normal">Upload evidence or add a link to support this record.</span>
          </p>
        )}
      </div>
    </section>
  );
}

function ActivityTimeline({ activity, title = 'Activity History' }: { activity: TrackerRecord['activity']; title?: string }) {
  return (
    <section className="dq-card">
      <h2 className="dq-card-title">{title}</h2>
      <div className="mt-4 space-y-4">
        {activity.map((entry) => (
          <div key={entry.id} className="border-l-2 border-secondary pl-4 text-sm text-primary">
            <div className="font-bold">{entry.actor}</div>
            <p className="mt-1 leading-6">{entry.action}</p>
            <div className="mt-1 text-xs font-semibold text-text-muted">{entry.timestamp}</div>
          </div>
        ))}
        {activity.length === 0 && <p className="text-sm font-semibold text-text-secondary">No activity recorded yet.</p>}
      </div>
    </section>
  );
}

function HistoryTimeline({ events }: { events: TrackerHistoryEvent[] }) {
  return (
    <section className="dq-card">
      <h2 className="dq-card-title">History</h2>
      <div className="mt-4 space-y-4">
        {events.map((entry) => (
          <div key={entry.id} className="border-l-2 border-border-default pl-4 text-sm text-primary">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{entry.eventType}</span>
              <span className="text-xs font-semibold text-text-muted">{entry.timestamp}</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-text-secondary">{entry.actor}</div>
            {(entry.oldValue || entry.newValue) && (
              <p className="mt-1 text-sm leading-6">
                {entry.oldValue && <span className="text-text-muted">{entry.oldValue}</span>}
                {entry.oldValue && entry.newValue && <span className="text-text-muted"> → </span>}
                {entry.newValue && <span className="font-semibold">{entry.newValue}</span>}
              </p>
            )}
          </div>
        ))}
        {events.length === 0 && <p className="text-sm font-semibold text-text-secondary">No history events yet.</p>}
      </div>
    </section>
  );
}

function RecordDetailRightRail({
  record,
  onAddTag,
  onRemoveTag,
  onLinkedEntityOpened,
}: {
  record: TrackerRecord;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onLinkedEntityOpened: () => void;
}) {
  const [tagInput, setTagInput] = useState('');
  const overdueCount = record.isOverdue || record.dueDate === 'Today' ? 1 : 0;
  const blockedCount = record.isBlocked || record.status === 'Blocked' ? 1 : 0;

  const addTag = () => {
    if (!tagInput.trim()) return;
    onAddTag(tagInput.trim());
    setTagInput('');
  };

  return (
    <div className="space-y-4 p-4">
      <section className="rounded-card border border-border-subtle p-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">TAGS</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {(record.tags || []).map((tag) => (
            <span key={tag} className="group inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface px-2 py-1 text-xs font-bold text-primary">
              {tag}
              <button type="button" onClick={() => onRemoveTag(tag)} className="text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger" aria-label={`Remove ${tag}`}>
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => {
              const value = window.prompt('Add tag');
              if (value) onAddTag(value);
            }}
            className="rounded-full border border-dashed border-border-default px-2 py-1 text-xs font-bold text-secondary"
          >
            +
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className="dq-input h-8 text-xs" onKeyDown={(e) => e.key === 'Enter' && addTag()} />
          <DqButton variant="outline" onClick={addTag} className="h-8 px-2 text-xs">Add</DqButton>
        </div>
      </section>

      <section className="rounded-card border border-border-subtle p-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">CUSTOM FIELDS</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-text-muted">Tracker ID</dt><dd className="font-mono font-bold text-primary">TR-00005</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-text-muted">Workspace</dt><dd className="font-semibold text-primary">{record.workspace}</dd></div>
        </dl>
      </section>

      <section className="rounded-card border border-border-subtle p-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">LINKED ENTITIES</h3>
        <dl className="mt-3 space-y-2 text-sm">
          {[
            ['Owner', record.ownerSlug],
            ['Team', record.teamSlug],
            ['Workflow', record.workflowSlug],
          ].map(([label, value]) => (
            <button key={label} type="button" onClick={onLinkedEntityOpened} className="flex w-full justify-between gap-3 rounded-button px-1 py-1 text-left hover:bg-navy-50">
              <dt className="text-text-muted">{label}</dt>
              <dd className="font-semibold text-info-text">{value}</dd>
            </button>
          ))}
        </dl>
      </section>

      <section className="rounded-card border border-border-subtle p-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">MAINTENANCE STATE</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-text-muted"><span className="h-2 w-2 rounded-full bg-success" />Saved</dt>
            <dd className="font-mono font-bold text-primary">{record.savedCount}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-text-muted"><span className="h-2 w-2 rounded-full bg-warning" />Overdue</dt>
            <dd className="font-mono font-bold text-primary">{overdueCount}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-text-muted"><span className="h-2 w-2 rounded-full bg-danger" />Blocked</dt>
            <dd className="font-mono font-bold text-primary">{blockedCount}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function RecordNotFound({ tracker, recordId, onBack, onHub }: { tracker: TrackerDefinition; recordId: string; onBack: () => void; onHub: () => void }) {
  return (
    <div className="w-full px-6 py-6 lg:px-8">
      <nav className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-secondary" aria-label="Breadcrumb">
        <span>Tracker</span>
        <span>/</span>
        <button onClick={onHub} className="hover:text-gray-900">Tracker Hub</button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-gray-900">{tracker.name}</button>
        <span>/</span>
        <span className="font-mono text-xs font-bold">{recordId}</span>
      </nav>
      <section className="mt-16 max-w-lg rounded-card border border-border-default bg-white p-8 text-center shadow-sm">
        <FileSearch className="mx-auto text-text-muted" size={42} strokeWidth={1.5} />
        <h1 className="mt-4 text-2xl font-bold text-primary">Tracker record not found.</h1>
        <p className="mt-2 text-sm text-text-secondary">This tracker record could not be found in the prototype data.</p>
        <DqButton variant="navy" onClick={onBack} className="mt-6">Back to Tracker</DqButton>
      </section>
    </div>
  );
}

function Breadcrumb({ trackerName, onHub }: { trackerName: string; onHub: () => void }) {
  return (
    <nav className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary" aria-label="Breadcrumb">
      <span>Tracker</span>
      <span>/</span>
      <button onClick={onHub} className="hover:text-gray-900">Tracker Hub</button>
      <span>/</span>
      <span className="font-bold">{trackerName}</span>
    </nav>
  );
}

function TrackerListPanel({ trackers, selectedSlug, search, onSearch, onSelect }: { trackers: TrackerDefinition[]; selectedSlug: string; search: string; onSearch: (value: string) => void; onSelect: (slug: string) => void }) {
  return (
    <aside className="rounded-card border border-border-default bg-white p-4 shadow-sm">
      <h2 className="dq-card-title">Trackers</h2>
      <div className="relative mt-3">
        <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search trackers..." className="dq-input pl-9" />
      </div>
      <div className="mt-4 space-y-1">
        {trackers.map((tracker) => {
          const selected = tracker.slug === selectedSlug;
          return (
            <button
              key={tracker.slug}
              onClick={() => onSelect(tracker.slug)}
              className={`flex w-full items-center gap-3 rounded-r-lg border-l-2 px-3 py-2.5 text-left text-sm font-semibold transition ${selected ? 'border-secondary bg-orange-50 text-primary' : 'border-transparent text-info-text hover:bg-navy-50 hover:text-primary'
                }`}>
              <Database size={16} strokeWidth={1.5} className="shrink-0" />
              <span className="min-w-0 flex-1">{tracker.name}</span>
              <span className={`h-2 w-2 shrink-0 rounded-full ${healthColor(tracker.healthStatus)}`} />
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function KpiStrip({ metrics, activeFilter, onFilter }: { metrics: TrackerMetrics; activeFilter: MetricFilter; onFilter: (filter: MetricFilter) => void }) {
  const cards = [
    { key: 'all' as MetricFilter, label: 'Total Records', value: metrics.total, icon: Database },
    { key: 'open' as MetricFilter, label: 'Open', value: metrics.open, icon: CheckCircle2 },
    { key: 'overdue' as MetricFilter, label: 'Overdue', value: metrics.overdue, icon: Clock3 },
    { key: 'atRisk' as MetricFilter, label: 'Red / Amber', value: metrics.atRisk, icon: AlertTriangle },
    { key: 'missingOwner' as MetricFilter, label: 'Missing Owner', value: metrics.missingOwner, icon: User },
    { key: 'notUpdated' as MetricFilter, label: 'Not Updated Recently', value: metrics.notUpdatedRecently, icon: CalendarDays },
  ];
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map(({ key, label, value, icon: Icon }) => (
        <button
          key={label}
          onClick={() => onFilter(key)}
          className={`rounded-card border bg-white p-4 text-left shadow-sm transition hover:bg-navy-50 ${activeFilter === key || (key === 'all' && !activeFilter) ? 'border-secondary ring-1 ring-secondary/20' : 'border-border-default'}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-text-muted">{label}</div>
              <div className="mt-2 font-mono text-2xl font-bold text-primary">{value}</div>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-button bg-navy-50 text-primary"><Icon size={18} strokeWidth={1.5} /></span>
          </div>
        </button>
      ))}
    </section>
  );
}

function Tabs({ activeTab, onTab }: { activeTab: ActiveTab; onTab: (tab: ActiveTab) => void }) {
  return (
    <div className="dq-tabs flex overflow-x-auto px-3" role="tablist" aria-label="Tracker record tabs">
      {tabs.map((tab) => (
        <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => onTab(tab)} className={`dq-tab whitespace-nowrap ${activeTab === tab ? 'dq-tab-active text-secondary' : ''}`}>
          {tab}
        </button>
      ))}
    </div>
  );
}

function RecordsTable({
  tracker,
  records,
  selectedRecordId,
  totalRecords,
  page,
  totalPages,
  pageSize,
  columns,
  sort,
  filters,
  options,
  compact,
  highlightOverdue,
  onSort,
  onFilterChange,
  onClearFilters,
  onPage,
  onPageSize,
  onOpen,
  onUpdate,
}: {
  tracker: TrackerDefinition;
  records: TrackerRecord[];
  selectedRecordId?: string;
  totalRecords: number;
  page: number;
  totalPages: number;
  pageSize: number;
  columns: Record<ColumnKey, boolean>;
  sort: SortState;
  filters: FilterState;
  options: FilterOptions;
  compact: boolean;
  highlightOverdue: boolean;
  onSort: (key: SortKey, direction?: SortDirection) => void;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
  onOpen: (record: TrackerRecord) => void;
  onUpdate: (record: TrackerRecord, patch: Partial<TrackerRecord>) => void;
}) {
  const activeColumns = (Object.keys(columnLabels) as ColumnKey[]).filter((key) => columns[key]);
  const rowPadding = compact ? 'px-4 py-2.5' : 'px-4 py-3.5';
  const [openFilter, setOpenFilter] = useState<ColumnKey | null>(null);
  const anyFilterActive = filters.idSearch || filters.titleSearch || filters.ownerSearch || filters.nextActionSearch || filters.owners.length > 0 || filters.teams.length > 0 || filters.priorities.length > 0 || filters.statuses.length > 0 || filters.dueDate.length > 0 || filters.rag.length > 0 || filters.lastUpdated.length > 0;
  return (
    <>
      {openFilter && <button aria-label="Close column filter" className="fixed inset-0 z-[140] cursor-default bg-transparent" onClick={() => setOpenFilter(null)} />}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            {activeColumns.map((column) => <col key={column} style={{ width: columnWidth(column) }} />)}
          </colgroup>
          <thead>
            {anyFilterActive && (
              <tr className="border-b border-border-subtle bg-navy-50/30">
                <th colSpan={activeColumns.length} className="px-4 py-1.5 text-right">
                  <button onClick={onClearFilters} className="text-xs font-bold text-info-text hover:text-primary">Clear all filters</button>
                </th>
              </tr>
            )}
            <tr className="border-b border-border-subtle bg-surface">
              {activeColumns.map((column) => (
                <th key={column} className="px-4 py-3 text-xs font-semibold uppercase text-[#454560]">
                  <ColumnHeader
                    column={column}
                    sort={sort}
                    filters={filters}
                    options={options}
                    open={openFilter === column}
                    onOpen={() => setOpenFilter(column)}
                    onClose={() => setOpenFilter(null)}
                    onSort={onSort}
                    onFilterChange={onFilterChange}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle bg-white">
            {records.map((record) => (
              <tr key={record.id} onClick={() => onOpen(record)} className={`cursor-pointer border-l-4 transition hover:bg-navy-50 ${selectedRecordId === record.id ? 'border-l-secondary bg-orange-50/40' : highlightOverdue && record.isOverdue ? 'border-l-danger/50' : 'border-l-transparent'}`}>
                {activeColumns.map((column) => <RecordCell key={column} tracker={tracker} column={column} record={record} rowPadding={rowPadding} onUpdate={onUpdate} />)}
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={activeColumns.length} className="px-4 py-14 text-center">
                  <FileSearch className="mx-auto text-text-muted" size={36} strokeWidth={1.5} />
                  <h3 className="mt-3 text-lg font-bold text-primary">No tracker records found</h3>
                  <p className="mt-1 text-sm text-text-secondary">Try adjusting your search, filters, or KPI selection.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination total={totalRecords} page={page} totalPages={totalPages} pageSize={pageSize} onPage={onPage} onPageSize={onPageSize} />
    </>
  );
}

function ColumnHeader({
  column,
  sort,
  filters,
  options,
  open,
  onOpen,
  onClose,
  onSort,
  onFilterChange,
}: {
  column: ColumnKey;
  sort: SortState;
  filters: FilterState;
  options: FilterOptions;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSort: (key: SortKey, direction?: SortDirection) => void;
  onFilterChange: (filters: FilterState) => void;
}) {
  const sortKey = columnToSort(column);
  const filtered = isColumnFiltered(column, filters);
  return (
    <div className="relative flex min-w-0 items-center gap-1">
      <button
        type="button"
        onClick={() => sortKey && onSort(sortKey)}
        className={`inline-flex min-w-0 items-center gap-1 truncate text-left hover:text-primary ${sortKey ? '' : 'cursor-default'}`}>
        <span className="truncate">{columnLabels[column]}</span>
        {sortKey && <span className="text-[11px] leading-none text-text-muted">{sortMark(sort, sortKey)}</span>}
      </button>
      <button
        type="button"
        aria-label={`Filter ${columnLabels[column]}`}
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-button hover:bg-white ${filtered ? 'text-secondary' : 'text-text-muted'}`}>
        <Filter size={13} strokeWidth={1.5} />
      </button>
      {open && (
        <ColumnFilterPopover
          column={column}
          filters={filters}
          options={options}
          onSort={onSort}
          onApply={(nextFilters) => onFilterChange(nextFilters)}
          onClose={onClose}
        />
      )}
    </div>
  );
}

function ColumnFilterPopover({
  column,
  filters,
  options,
  onSort,
  onApply,
  onClose,
}: {
  column: ColumnKey;
  filters: FilterState;
  options: FilterOptions;
  onSort: (key: SortKey, direction?: SortDirection) => void;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(filters);
  const sortKey = columnToSort(column);
  const ownerOptions = options.owners.filter((owner) => owner.toLowerCase().includes(draft.ownerSearch.trim().toLowerCase()));
  const textInput = (key: 'idSearch' | 'titleSearch' | 'ownerSearch' | 'nextActionSearch', placeholder: string) => (
    <div className="relative">
      <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        value={draft[key]}
        onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
        placeholder={placeholder}
        className="h-9 w-full rounded-button border border-border-default bg-white pl-9 pr-3 text-sm font-semibold normal-case text-primary outline-none focus:border-primary"
      />
    </div>
  );
  const checkboxList = <T extends string,>(values: T[], selected: T[], onChange: (values: T[]) => void) => (
    <div className="max-h-44 space-y-1 overflow-y-auto">
      {values.map((value) => (
        <label key={value} className="flex cursor-pointer items-center gap-2 rounded-button px-2 py-1.5 text-sm font-semibold normal-case text-primary hover:bg-navy-50">
          <input
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => onChange(toggleValue(selected, value))}
            className="h-4 w-4 rounded border-border-default text-secondary"
          />
          <span>{value}</span>
        </label>
      ))}
    </div>
  );
  const sortControls = sortKey && (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" onClick={() => onSort(sortKey, 'asc')} className="h-8 rounded-button border border-border-default px-2 text-xs font-bold text-primary hover:bg-navy-50">Sort ↑</button>
      <button type="button" onClick={() => onSort(sortKey, 'desc')} className="h-8 rounded-button border border-border-default px-2 text-xs font-bold text-primary hover:bg-navy-50">Sort ↓</button>
    </div>
  );

  return (
    <div className="absolute left-0 top-full z-[160] mt-2 w-72 rounded-card border border-border-default bg-white p-3 text-left shadow-lg" onClick={(event) => event.stopPropagation()}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-xs font-bold uppercase text-primary">{columnLabels[column]}</div>
        <button type="button" onClick={onClose} className="text-text-muted hover:text-primary"><X size={14} strokeWidth={1.5} /></button>
      </div>
      <div className="space-y-3">
        {column === 'id' && <>{textInput('idSearch', 'Search by ID')}{sortControls}</>}
        {column === 'title' && <>{textInput('titleSearch', 'Search text')}{sortControls}</>}
        {column === 'owner' && <>{textInput('ownerSearch', 'Search owner name')}{checkboxList(ownerOptions, draft.owners, (owners) => setDraft((current) => ({ ...current, owners })))}</>}
        {column === 'team' && checkboxList(options.teams, draft.teams, (teams) => setDraft((current) => ({ ...current, teams })))}
        {column === 'priority' && checkboxList(['Low', 'Medium', 'High', 'Critical'] as TrackerPriority[], draft.priorities, (priorities) => setDraft((current) => ({ ...current, priorities })))}
        {column === 'status' && checkboxList(options.statuses, draft.statuses, (statuses) => setDraft((current) => ({ ...current, statuses })))}
        {column === 'dueDate' && <>{checkboxList(['Today', 'This Week', 'Overdue', 'Future'], draft.dueDate, (dueDate) => setDraft((current) => ({ ...current, dueDate })))}{sortControls}</>}
        {column === 'rag' && checkboxList(['Green', 'Amber', 'Red', 'No RAG'] as Array<TrackerHealth | 'No RAG'>, draft.rag, (rag) => setDraft((current) => ({ ...current, rag })))}
        {column === 'lastUpdated' && <>{checkboxList(['Today', 'Yesterday', 'This Week', 'Not Updated Recently'], draft.lastUpdated, (lastUpdated) => setDraft((current) => ({ ...current, lastUpdated })))}{sortControls}</>}
        {column === 'nextAction' && textInput('nextActionSearch', 'Search text')}
      </div>
      <div className="mt-4 flex justify-end gap-2 border-t border-border-subtle pt-3">
        <button type="button" onClick={() => { onApply(clearColumnFilter(filters, column)); onClose(); }} className="h-8 rounded-button border border-border-default px-3 text-xs font-bold text-primary hover:bg-navy-50">Clear</button>
        <button type="button" onClick={() => { onApply(draft); onClose(); }} className="h-8 rounded-button bg-primary px-3 text-xs font-bold text-white hover:bg-[#07184f]">Apply</button>
      </div>
    </div>
  );
}

function RecordCell({ tracker, column, record, rowPadding, onUpdate }: { tracker: TrackerDefinition; column: ColumnKey; record: TrackerRecord; rowPadding: string; onUpdate: (record: TrackerRecord, patch: Partial<TrackerRecord>) => void }) {
  if (column === 'id') return <td className={`${rowPadding} font-mono text-xs font-bold text-primary`}>{record.id}</td>;
  if (column === 'title') return <td className={`${rowPadding} max-w-[260px] text-sm font-semibold text-primary`}>{record.title}</td>;
  if (column === 'owner') return <td className={rowPadding}><InlineText value={record.owner} onSave={(value) => onUpdate(record, { owner: value })} /></td>;
  if (column === 'team') return <td className={`${rowPadding} text-sm font-semibold text-primary`}>{record.teamOrSquad}</td>;
  if (column === 'priority') return <td className={rowPadding}><InlineSelect value={record.priority} options={['Low', 'Medium', 'High', 'Critical']} onSave={(value) => onUpdate(record, { priority: value as TrackerPriority })} /></td>;
  if (column === 'status') return <td className={rowPadding}><InlineSelect value={record.status} options={tracker.defaultStatuses} onSave={(value) => onUpdate(record, { status: value })} /></td>;
  if (column === 'dueDate') return <td className={rowPadding}><InlineText value={record.dueDate} className={record.isOverdue ? 'text-danger' : ''} onSave={(value) => onUpdate(record, { dueDate: value })} /></td>;
  if (column === 'rag') return <td className={rowPadding}><InlineSelect value={record.rag} options={['Green', 'Amber', 'Red']} onSave={(value) => onUpdate(record, { rag: value as TrackerHealth })} /></td>;
  if (column === 'lastUpdated') return <td className={`${rowPadding} text-sm font-semibold text-primary`}>{record.lastUpdated}</td>;
  return <td className={rowPadding}><InlineText value={record.nextAction} className="text-info-text" onSave={(value) => onUpdate(record, { nextAction: value })} /></td>;
}

function InlineText({ value, onSave, className = '' }: { value: string; onSave: (value: string) => void; className?: string }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const commit = () => {
    if (draft.trim() !== value) onSave(draft.trim());
  };
  return (
    <input
      value={draft}
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
      }}
      className={`h-8 w-full rounded-button border border-transparent bg-transparent px-2 text-sm font-semibold text-primary outline-none hover:border-border-default focus:border-primary focus:bg-white ${className}`}
    />
  );
}

function InlineSelect({ value, options, onSave }: { value: string; options: string[]; onSave: (value: string) => void }) {
  return (
    <select
      value={value}
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => onSave(event.target.value)}
      className="h-8 w-full rounded-button border border-border-default bg-white px-2 text-sm font-semibold text-primary outline-none focus:border-primary">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

function Pagination({ total, page, totalPages, pageSize, onPage, onPageSize }: { total: number; page: number; totalPages: number; pageSize: number; onPage: (page: number) => void; onPageSize: (size: number) => void }) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle px-4 py-3 text-sm text-text-muted">
      <span>Showing {start} to {end} of {total} records</span>
      <div className="flex items-center gap-2">
        <PagerButton disabled={page === 1} onClick={() => onPage(1)}><ChevronsLeft size={15} strokeWidth={1.5} /></PagerButton>
        <PagerButton disabled={page === 1} onClick={() => onPage(page - 1)}>Prev</PagerButton>
        {Array.from({ length: totalPages }).slice(0, 5).map((_, index) => {
          const number = index + 1;
          return <PagerButton key={number} active={number === page} onClick={() => onPage(number)}>{number}</PagerButton>;
        })}
        <PagerButton disabled={page === totalPages} onClick={() => onPage(page + 1)}>Next</PagerButton>
        <PagerButton disabled={page === totalPages} onClick={() => onPage(totalPages)}><ChevronsRight size={15} strokeWidth={1.5} /></PagerButton>
      </div>
      <label className="relative inline-flex h-9 min-w-[112px] items-center">
        <select value={pageSize} onChange={(event) => onPageSize(Number(event.target.value))} className="h-9 w-full appearance-none rounded-button border border-border-default bg-white px-3 pr-8 text-sm font-semibold text-primary">
          {[5, 10, 25].map((size) => <option key={size} value={size}>{size} per page</option>)}
        </select>
        <ChevronDown size={14} strokeWidth={1.5} className="pointer-events-none absolute right-3 text-text-muted" />
      </label>
    </div>
  );
}

function PagerButton({ children, disabled, active, onClick }: { children: ReactNode; disabled?: boolean; active?: boolean; onClick: () => void }) {
  return <button disabled={disabled} onClick={onClick} className={`grid h-8 min-w-8 place-items-center rounded-button border px-2 text-xs font-bold ${active ? 'border-primary bg-primary text-white' : 'border-border-default bg-white text-primary hover:bg-navy-50'} disabled:cursor-not-allowed disabled:opacity-40`}>{children}</button>;
}

function RightRail(_props: { tracker: TrackerDefinition; records: TrackerRecord[]; metrics: TrackerMetrics; activeExtraFilter: ExtraFilter; onRagFilter: (value: TrackerHealth | 'No RAG') => void; onDisciplineFilter: (value: 'lt3' | '3to7' | 'gt7' | 'none') => void }) {
  return null;
}

function AboutTrackerPanel({ tracker, onBack }: { tracker: TrackerDefinition; onBack: () => void }) {
  return (
    <div className="p-5">
      <TrackerMetadata tracker={tracker} />
      <DqButton variant="outline" onClick={onBack} className="mt-5">Back to Records</DqButton>
    </div>
  );
}

function TrackerMetadata({ tracker }: { tracker: TrackerDefinition }) {
  const rows = [
    ['Tracker name', tracker.name],
    ['Purpose', tracker.purpose],
    ['Owner', tracker.owner],
    ['Tracker type', tracker.trackerType],
    ['Required fields', tracker.requiredFields.join(', ')],
    ['Optional fields', tracker.optionalFields.join(', ')],
    ['Default statuses', tracker.defaultStatuses.join(', ')],
    ['Ownership model', tracker.ownershipModel],
    ['Update frequency', tracker.updateFrequency],
    ['Governance rules', tracker.governanceRules],
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-card border border-border-subtle p-3">
          <div className="text-xs font-bold uppercase text-text-muted">{label}</div>
          <div className="mt-1 text-sm font-semibold text-primary">{value}</div>
        </div>
      ))}
    </div>
  );
}

function RecordDrawer({ tracker, record, focus, onClose, onSave }: { tracker: TrackerDefinition; record: TrackerRecord | null; focus: DrawerFocus; onClose: () => void; onSave: (record: TrackerRecord) => void }) {
  const [draft, setDraft] = useState<TrackerRecord | null>(record);
  const [comment, setComment] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkFields, setShowLinkFields] = useState(false);

  useEffect(() => setDraft(record), [record]);
  useEffect(() => {
    if (!record) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [record, onClose]);

  if (!record || !draft) return null;
  const update = (patch: Partial<TrackerRecord>) => setDraft((current) => current ? { ...current, ...patch } : current);
  const postComment = () => {
    if (!comment.trim()) return;
    update({ comments: [{ id: `comment-${Date.now()}`, author: currentUser, body: comment.trim(), timestamp: 'Now' }, ...draft.comments], commentCount: draft.commentCount + 1 });
    setComment('');
    toast.success('Comment added');
  };
  const addLink = () => {
    if (!linkTitle.trim()) return;
    update({ evidence: [{ id: `evidence-${Date.now()}`, title: linkTitle.trim(), type: 'Link', url: linkUrl.trim(), addedBy: currentUser, addedAt: 'Now' }, ...draft.evidence], evidenceCount: draft.evidenceCount + 1 });
    setLinkTitle('');
    setLinkUrl('');
    setShowLinkFields(false);
    toast.success('Evidence link added');
  };
  const uploadEvidence = () => {
    update({ evidence: [{ id: `evidence-${Date.now()}`, title: 'Mock uploaded evidence', type: 'File', addedBy: currentUser, addedAt: 'Now' }, ...draft.evidence], evidenceCount: draft.evidenceCount + 1 });
    toast.success('Evidence uploaded');
  };
  const markComplete = () => {
    const completedStatus = tracker.defaultStatuses.find((status) => closedStatuses.includes(status.toLowerCase())) || 'Completed';
    const updated = { ...draft, status: completedStatus, rag: 'Green' as TrackerHealth, isOverdue: false, isBlocked: false, lastUpdated: 'Today' };
    setDraft(updated);
    onSave(updated);
    toast.success('Tracker record marked complete');
  };

  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed bottom-0 right-0 top-0 z-[200] w-full min-w-[520px] max-w-[560px] overflow-y-auto border-l border-border-default bg-white shadow-xl 2xl:max-w-[42vw]">
        <div className="sticky top-0 z-10 border-b border-border-subtle bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs font-bold text-text-muted">{draft.id}</div>
              <h2 className="mt-1 text-xl font-bold text-primary">{draft.title}</h2>
              <p className="mt-1 text-sm font-semibold text-text-secondary">{tracker.name}</p>
            </div>
            <DqIconButton label="Close record drawer" onClick={onClose}><X size={18} strokeWidth={1.5} /></DqIconButton>
          </div>
        </div>
        <div className="space-y-4 bg-surface p-5">
          <section className={`dq-card grid gap-3 sm:grid-cols-2 ${focus === 'summary' ? 'ring-1 ring-secondary/30' : ''}`}>
            <DrawerField label="Owner" value={draft.owner} onChange={(value) => update({ owner: value, missingOwner: !value })} />
            <DrawerField label="Team / Squad" value={draft.teamOrSquad} onChange={(value) => update({ teamOrSquad: value })} />
            <DrawerSelect label="Priority" value={draft.priority} options={['Low', 'Medium', 'High', 'Critical']} onChange={(value) => update({ priority: value as TrackerPriority })} />
            <DrawerSelect label="Status" value={draft.status} options={tracker.defaultStatuses} onChange={(value) => update({ status: value, isBlocked: value.toLowerCase().includes('blocked') })} />
            <DrawerField label="Due Date" value={draft.dueDate} onChange={(value) => update({ dueDate: value })} />
            <DrawerSelect label="RAG" value={draft.rag} options={['Green', 'Amber', 'Red']} onChange={(value) => update({ rag: value as TrackerHealth })} />
            <DrawerField label="Last Updated" value={draft.lastUpdated} onChange={(value) => update({ lastUpdated: value })} />
          </section>
          <DrawerTextarea label="Description / Context" value={draft.description} onChange={(value) => update({ description: value })} />
          <DrawerTextarea label="Latest Update" value={draft.activity[0]?.action || 'Updated tracker record'} onChange={(value) => update({ activity: [{ id: `activity-${Date.now()}`, actor: currentUser, action: value, timestamp: 'Now' }, ...draft.activity] })} />
          <section className={`dq-card ${focus === 'nextAction' ? 'ring-1 ring-secondary/30' : ''}`}>
            <DrawerField label="Next Action" value={draft.nextAction} onChange={(value) => update({ nextAction: value })} />
          </section>
          <section className="dq-card">
            <h3 className="dq-card-title">Comments</h3>
            <div className="mt-3 space-y-2">{draft.comments.map((entry) => <div key={entry.id} className="rounded-button bg-surface px-3 py-2 text-sm text-primary"><b>{entry.author}:</b> {entry.body}<div className="text-xs text-text-muted">{entry.timestamp}</div></div>)}</div>
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Add comment..." className="dq-textarea mt-3" />
            <DqButton variant="navy" onClick={postComment} className="mt-3">Post Comment</DqButton>
          </section>
          <section className="dq-card">
            <h3 className="dq-card-title">Evidence / Links</h3>
            <div className="mt-3 space-y-2">{draft.evidence.map((entry) => <div key={entry.id} className="rounded-button bg-surface px-3 py-2 text-sm font-semibold text-primary">{entry.title} · {entry.type}</div>)}</div>
            {showLinkFields && (
              <div className="mt-3 grid gap-2">
                <input value={linkTitle} onChange={(event) => setLinkTitle(event.target.value)} placeholder="Evidence title" className="dq-input" />
                <input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="Evidence link" className="dq-input" />
                <DqButton variant="navy" onClick={addLink}>Save Link</DqButton>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <DqButton variant="outline" onClick={() => setShowLinkFields(true)}><LinkIcon size={15} strokeWidth={1.5} /> Add Link</DqButton>
              <DqButton variant="outline" onClick={uploadEvidence}>Upload Evidence</DqButton>
            </div>
          </section>
          <section className="dq-card">
            <h3 className="dq-card-title">Activity History</h3>
            <div className="mt-3 space-y-3">{draft.activity.map((entry) => <div key={entry.id} className="border-l-2 border-secondary pl-3 text-sm text-primary"><b>{entry.actor}</b> {entry.action}<div className="text-xs text-text-muted">{entry.timestamp}</div></div>)}</div>
          </section>
          <div className="flex flex-wrap justify-end gap-2">
            <DqButton variant="outline" onClick={onClose}>Close</DqButton>
            <DqButton variant="outline" onClick={uploadEvidence}>Add Evidence</DqButton>
            <DqButton variant="outline" onClick={markComplete}>Mark Complete</DqButton>
            <DqButton variant="orange" onClick={() => onSave(draft)}>Save Changes</DqButton>
          </div>
        </div>
      </aside>
    </>
  );
}

function AddRecordModal({ tracker, open, onClose, onAdd }: { tracker: TrackerDefinition; open: boolean; onClose: () => void; onAdd: (draft: AddRecordDraft) => void }) {
  const emptyDraft: AddRecordDraft = { title: '', owner: currentUser, teamOrSquad: 'DQ Ops', priority: 'Medium', status: tracker.defaultStatuses[0] || 'In Progress', dueDate: 'Today', rag: 'Amber', description: '', nextAction: 'Add first update' };
  const [draft, setDraft] = useState<AddRecordDraft>(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof AddRecordDraft, string>>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(emptyDraft);
      setErrors({});
      setDirty(false);
    }
  }, [open, tracker.slug]);

  if (!open) return null;
  const update = (patch: Partial<AddRecordDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setDirty(true);
  };
  const submit = () => {
    const nextErrors: Partial<Record<keyof AddRecordDraft, string>> = {};
    (['title', 'owner', 'status', 'dueDate', 'rag'] as const).forEach((key) => {
      if (!String(draft[key]).trim()) nextErrors[key] = 'Required';
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onAdd(draft);
  };
  const guardedClose = () => {
    if (dirty) return;
    onClose();
  };
  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/25" onClick={guardedClose} />
      <aside className="fixed bottom-0 right-0 top-0 z-[220] w-full max-w-[560px] overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="sticky top-0 z-10 border-b border-border-subtle bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary">Add tracker record</h2>
              <p className="mt-1 text-sm text-text-secondary">{tracker.name}</p>
            </div>
            <DqIconButton label="Close add record drawer" onClick={onClose}><X size={18} strokeWidth={1.5} /></DqIconButton>
          </div>
        </div>
        <div className="space-y-4 bg-surface p-5">
          <div>
            <section className="dq-card grid gap-3">
              <ModalField label="Title" value={draft.title} error={errors.title} onChange={(value) => update({ title: value })} />
              <ModalField label="Owner" value={draft.owner} error={errors.owner} onChange={(value) => update({ owner: value })} />
              <ModalField label="Team / Squad" value={draft.teamOrSquad} onChange={(value) => update({ teamOrSquad: value })} />
              <ModalSelect label="Priority" value={draft.priority} options={['Low', 'Medium', 'High', 'Critical']} onChange={(value) => update({ priority: value as TrackerPriority })} />
              <ModalSelect label="Status" value={draft.status} options={tracker.defaultStatuses} error={errors.status} onChange={(value) => update({ status: value })} />
              <ModalField label="Due Date" value={draft.dueDate} error={errors.dueDate} onChange={(value) => update({ dueDate: value })} />
              <ModalSelect label="RAG" value={draft.rag} options={['Green', 'Amber', 'Red']} error={errors.rag} onChange={(value) => update({ rag: value as TrackerHealth })} />
              <ModalField label="Next Action" value={draft.nextAction} onChange={(value) => update({ nextAction: value })} />
              <label className="block">
                <span className="dq-field-label">Description / Context</span>
                <textarea value={draft.description} onChange={(event) => update({ description: event.target.value })} rows={4} className="dq-textarea" />
              </label>
            </section>
          </div>
          <div className="flex justify-end gap-2">
            <DqButton variant="outline" onClick={onClose}>Cancel</DqButton>
            <DqButton variant="orange" onClick={submit}>Add Record</DqButton>
          </div>
        </div>
      </aside>
    </>
  );
}

function SettingsModal({ open, settings, onClose, onApply, onReset }: { open: boolean; settings: SettingsState; onClose: () => void; onApply: (settings: SettingsState) => void; onReset: () => void }) {
  const [draft, setDraft] = useState(settings);
  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);
  if (!open) return null;
  const toggleColumn = (column: ColumnKey) => setDraft((current) => ({ ...current, visibleColumns: { ...current.visibleColumns, [column]: !current.visibleColumns[column] } }));
  const toggle = (key: 'showRightRail' | 'highlightOverdueRows' | 'compactDensity') => setDraft((current) => ({ ...current, [key]: !current[key] }));
  return (
    <ModalFrame title="Tracker Settings" onClose={onClose} width="max-w-3xl">
      <section className="mb-4 rounded-card border border-border-subtle p-4">
        <h3 className="mb-3 text-sm font-bold text-primary">Visible Columns</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {(Object.keys(columnLabels) as ColumnKey[]).map((column) => (
            <label key={column} className="flex items-center gap-2 text-sm font-semibold text-primary">
              <input type="checkbox" checked={draft.visibleColumns[column]} onChange={() => toggleColumn(column)} />
              {columnLabels[column]}
            </label>
          ))}
        </div>
      </section>
      <section className="mb-4 grid gap-3 rounded-card border border-border-subtle p-4 md:grid-cols-3">
        <ModalSelect label="Default Sort" value={draft.defaultSort} options={['none', 'id', 'title', 'owner', 'dueDate', 'lastUpdated', 'status', 'rag']} onChange={(value) => setDraft((current) => ({ ...current, defaultSort: value as SettingsState['defaultSort'] }))} />
        <ModalSelect label="Direction" value={draft.defaultDirection} options={['asc', 'desc']} onChange={(value) => setDraft((current) => ({ ...current, defaultDirection: value as SortDirection }))} />
        <ModalSelect label="Page Size" value={String(draft.pageSize)} options={['5', '10', '25']} onChange={(value) => setDraft((current) => ({ ...current, pageSize: Number(value) }))} />
      </section>
      <section className="mb-4 rounded-card border border-border-subtle p-4">
        <h3 className="mb-2 text-sm font-bold text-primary">Tracker Preferences</h3>
        <Toggle label="Show right summary rail" checked={draft.showRightRail} onChange={() => toggle('showRightRail')} />
        <Toggle label="Highlight overdue rows" checked={draft.highlightOverdueRows} onChange={() => toggle('highlightOverdueRows')} />
        <Toggle label="Show compact table density" checked={draft.compactDensity} onChange={() => toggle('compactDensity')} />
      </section>
      <div className="mt-6 flex justify-end gap-2">
        <DqButton variant="outline" onClick={onClose}>Cancel</DqButton>
        <DqButton variant="outline" onClick={onReset}>Reset Defaults</DqButton>
        <DqButton variant="orange" onClick={() => onApply(draft)}>Apply Settings</DqButton>
      </div>
    </ModalFrame>
  );
}

function ModalFrame({ title, width, onClose, children }: { title: string; width: string; onClose: () => void; children: ReactNode }) {
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
      <section className={`fixed left-1/2 top-1/2 z-[220] max-h-[calc(100vh-48px)] w-[min(92vw,860px)] ${width} -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card border border-border-default bg-white p-5 shadow-xl`}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-primary">{title}</h2>
          <DqIconButton label={`Close ${title}`} onClick={onClose}><X size={18} strokeWidth={1.5} /></DqIconButton>
        </div>
        {children}
      </section>
    </>
  );
}

function MetricTile({ label, value }: { label: string; value: number }) {
  return <div className="rounded-card border border-border-subtle p-3"><div className="text-xs font-bold text-text-muted">{label}</div><div className="mt-1 font-mono text-xl font-bold text-primary">{value}</div></div>;
}

function ModalField({ label, value, onChange, error }: { label: string; value: string; onChange: (value: string) => void; error?: string }) {
  return (
    <label className="block">
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

function DrawerField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="dq-field-label">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="dq-input" />
    </label>
  );
}

function DrawerSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="dq-field-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="dq-input">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function DrawerTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="dq-card block">
      <span className="dq-field-label">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="dq-textarea mt-2" />
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

function OwnerBadge({ owner }: { owner: string }) {
  if (!owner) return <span className="text-sm font-bold text-danger">Missing Owner</span>;
  const initials = owner.split(' ').map((part) => part[0]).join('').slice(0, 2);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">{initials}</span>
      <span className="text-sm font-semibold text-primary">{owner}</span>
    </span>
  );
}

function RagBadge({ rag }: { rag: TrackerHealth }) {
  return <span className={`text-sm font-bold ${rag === 'Red' ? 'text-danger' : rag === 'Amber' ? 'text-warning' : 'text-success'}`}>{rag || 'No RAG'}</span>;
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
type FilterOptions = ReturnType<typeof getFilterOptions>;

function getMetrics(records: TrackerRecord[], tracker: TrackerDefinition) {
  const calculated = {
    total: records.length,
    open: records.filter((record) => !closedStatuses.includes(record.status.toLowerCase())).length,
    closed: records.filter((record) => closedStatuses.includes(record.status.toLowerCase())).length,
    overdue: records.filter((record) => record.isOverdue).length,
    blocked: records.filter((record) => record.isBlocked || record.status.toLowerCase().includes('blocked')).length,
    atRisk: records.filter((record) => record.rag === 'Red' || record.rag === 'Amber').length,
    missingOwner: records.filter((record) => record.missingOwner || !record.owner).length,
    notUpdatedRecently: records.filter((record) => record.notUpdatedRecently).length,
  };
  if (tracker.slug !== 'project-health-tracker') return calculated;
  return { ...calculated, total: 18, open: 12, overdue: 4, atRisk: 7, missingOwner: 1, notUpdatedRecently: 3 };
}

function getFilterOptions(records: TrackerRecord[], tracker: TrackerDefinition) {
  return {
    owners: unique(records.map((record) => record.owner).filter(Boolean)),
    statuses: unique([...tracker.defaultStatuses, ...records.map((record) => record.status)]),
    teams: unique(records.map((record) => record.teamOrSquad).filter(Boolean)),
  };
}

function applyRecordView(records: TrackerRecord[], activeTab: ActiveTab, filters: FilterState, metricFilter: MetricFilter, extraFilter: ExtraFilter, sort: SortState) {
  const idQuery = filters.idSearch.trim().toLowerCase();
  const titleQuery = filters.titleSearch.trim().toLowerCase();
  const ownerQuery = filters.ownerSearch.trim().toLowerCase();
  const nextActionQuery = filters.nextActionSearch.trim().toLowerCase();
  const filtered = records
    .filter((record) => {
      if (activeTab === 'My Items') return record.owner === currentUser;
      if (activeTab === 'Overdue') return record.isOverdue;
      if (activeTab === 'At Risk') return record.rag === 'Red' || record.rag === 'Amber';
      if (activeTab === 'Recently Updated') return record.lastUpdated === 'Today' || record.lastUpdated === 'Yesterday';
      return true;
    })
    .filter((record) => {
      if (metricFilter === 'open') return !closedStatuses.includes(record.status.toLowerCase());
      if (metricFilter === 'overdue') return record.isOverdue;
      if (metricFilter === 'atRisk') return record.rag === 'Red' || record.rag === 'Amber';
      if (metricFilter === 'missingOwner') return record.missingOwner || !record.owner;
      if (metricFilter === 'notUpdated') return record.notUpdatedRecently;
      return true;
    })
    .filter((record) => {
      if (!extraFilter) return true;
      if (extraFilter.type === 'rag') return extraFilter.value === 'No RAG' ? !record.rag : record.rag === extraFilter.value;
      const band = disciplineBand(record);
      return band === extraFilter.value;
    })
    .filter((record) => !idQuery || record.id.toLowerCase().includes(idQuery))
    .filter((record) => !titleQuery || record.title.toLowerCase().includes(titleQuery))
    .filter((record) => !ownerQuery || record.owner.toLowerCase().includes(ownerQuery))
    .filter((record) => filters.owners.length === 0 || filters.owners.includes(record.owner))
    .filter((record) => filters.teams.length === 0 || filters.teams.includes(record.teamOrSquad))
    .filter((record) => filters.priorities.length === 0 || filters.priorities.includes(record.priority))
    .filter((record) => filters.statuses.length === 0 || filters.statuses.includes(record.status))
    .filter((record) => filters.rag.length === 0 || filters.rag.includes(record.rag || 'No RAG'))
    .filter((record) => filters.dueDate.length === 0 || filters.dueDate.some((value) => dueDateMatches(record, value)))
    .filter((record) => filters.lastUpdated.length === 0 || filters.lastUpdated.some((value) => lastUpdatedMatches(record, value)))
    .filter((record) => !nextActionQuery || record.nextAction.toLowerCase().includes(nextActionQuery));

  if (!sort.key) return filtered;
  return [...filtered].sort((a, b) => compareRecords(a, b, sort.key!, sort.direction));
}

function compareRecords(a: TrackerRecord, b: TrackerRecord, key: SortKey, direction: SortDirection) {
  const multiplier = direction === 'asc' ? 1 : -1;
  const left = key === 'id' ? a.id : a[key];
  const right = key === 'id' ? b.id : b[key];
  if (key === 'rag') return (healthRank(a.rag) - healthRank(b.rag)) * multiplier;
  return String(left).localeCompare(String(right), undefined, { numeric: true }) * multiplier;
}

function sortableColumn(column: ColumnKey) {
  return Boolean(columnToSort(column));
}

function columnWidth(column: ColumnKey) {
  const widths: Record<ColumnKey, string> = {
    id: '8%',
    title: '18%',
    owner: '13%',
    team: '11%',
    priority: '9%',
    status: '12%',
    dueDate: '9%',
    rag: '8%',
    lastUpdated: '10%',
    nextAction: '14%',
  };
  return widths[column];
}

function columnToSort(column: ColumnKey): SortKey | null {
  const map: Partial<Record<ColumnKey, SortKey>> = {
    id: 'id',
    title: 'title',
    owner: 'owner',
    status: 'status',
    dueDate: 'dueDate',
    rag: 'rag',
    lastUpdated: 'lastUpdated',
  };
  return map[column] || null;
}

function sortMark(sort: SortState, key: SortKey) {
  if (sort.key !== key) return '↕';
  return sort.direction === 'asc' ? '↑' : '↓';
}

function isColumnFiltered(column: ColumnKey, filters: FilterState) {
  if (column === 'id') return Boolean(filters.idSearch.trim());
  if (column === 'title') return Boolean(filters.titleSearch.trim());
  if (column === 'owner') return Boolean(filters.ownerSearch.trim()) || filters.owners.length > 0;
  if (column === 'team') return filters.teams.length > 0;
  if (column === 'priority') return filters.priorities.length > 0;
  if (column === 'status') return filters.statuses.length > 0;
  if (column === 'dueDate') return filters.dueDate.length > 0;
  if (column === 'rag') return filters.rag.length > 0;
  if (column === 'lastUpdated') return filters.lastUpdated.length > 0;
  return Boolean(filters.nextActionSearch.trim());
}

function clearColumnFilter(filters: FilterState, column: ColumnKey): FilterState {
  if (column === 'id') return { ...filters, idSearch: '' };
  if (column === 'title') return { ...filters, titleSearch: '' };
  if (column === 'owner') return { ...filters, ownerSearch: '', owners: [] };
  if (column === 'team') return { ...filters, teams: [] };
  if (column === 'priority') return { ...filters, priorities: [] };
  if (column === 'status') return { ...filters, statuses: [] };
  if (column === 'dueDate') return { ...filters, dueDate: [] };
  if (column === 'rag') return { ...filters, rag: [] };
  if (column === 'lastUpdated') return { ...filters, lastUpdated: [] };
  return { ...filters, nextActionSearch: '' };
}

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function dueDateMatches(record: TrackerRecord, value: string) {
  if (value === 'Today') return record.dueDate === 'Today';
  if (value === 'Overdue') return record.isOverdue;
  if (value === 'Future') return !record.isOverdue && record.dueDate !== 'Today';
  if (value === 'This Week') return true;
  return true;
}

function lastUpdatedMatches(record: TrackerRecord, value: string) {
  if (value === 'Today') return record.lastUpdated === 'Today' || record.lastUpdated.includes('AM') || record.lastUpdated.includes('PM');
  if (value === 'Yesterday') return record.lastUpdated === 'Yesterday';
  if (value === 'Not Updated Recently') return record.notUpdatedRecently;
  if (value === 'This Week') return true;
  return true;
}

function getRagSplit(records: TrackerRecord[]) {
  return {
    Green: records.filter((record) => record.rag === 'Green').length,
    Amber: records.filter((record) => record.rag === 'Amber').length,
    Red: records.filter((record) => record.rag === 'Red').length,
    none: records.filter((record) => !record.rag).length,
    total: records.length || 1,
  };
}

function getDiscipline(records: TrackerRecord[]) {
  return {
    lt3: records.filter((record) => disciplineBand(record) === 'lt3').length,
    threeToSeven: records.filter((record) => disciplineBand(record) === '3to7').length,
    gt7: records.filter((record) => disciplineBand(record) === 'gt7').length,
    none: records.filter((record) => disciplineBand(record) === 'none').length,
  };
}

function disciplineBand(record: TrackerRecord): 'lt3' | '3to7' | 'gt7' | 'none' {
  if (!record.lastUpdated) return 'none';
  if (record.lastUpdated === 'Today' || record.lastUpdated === 'Yesterday' || record.lastUpdated.includes('AM') || record.lastUpdated.includes('PM')) return 'lt3';
  if (record.notUpdatedRecently) return '3to7';
  if (record.lastUpdated.includes('days')) return '3to7';
  return 'lt3';
}

function nextRecordId(tracker: TrackerDefinition, records: TrackerRecord[]) {
  const prefix = tracker.slug.split('-').map((part) => part[0]).join('').slice(0, 3).toUpperCase();
  const numbers = records.map((record) => Number(record.id.split('-')[1])).filter(Number.isFinite);
  return `${prefix}-${Math.max(1221, ...numbers) + 1}`;
}

function healthColor(health: TrackerHealth) {
  if (health === 'Red') return 'bg-danger';
  if (health === 'Amber') return 'bg-warning';
  return 'bg-success';
}

function ragTone(health: TrackerHealth | 'No RAG'): 'success' | 'warning' | 'danger' | 'gray' {
  if (health === 'Red') return 'danger';
  if (health === 'Amber') return 'warning';
  if (health === 'Green') return 'success';
  return 'gray';
}

function healthRank(health: TrackerHealth) {
  return { Green: 1, Amber: 2, Red: 3 }[health] || 4;
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function normalizeRecordFilters(value: unknown): FilterState {
  if (!value || typeof value !== 'object') return defaultFilters;
  const raw = value as Record<string, unknown>;
  return {
    idSearch: stringValue(raw.idSearch, stringValue(raw.search)),
    titleSearch: stringValue(raw.titleSearch),
    ownerSearch: stringValue(raw.ownerSearch),
    owners: stringArray(raw.owners, raw.owner),
    teams: stringArray(raw.teams, raw.team),
    priorities: stringArray(raw.priorities, raw.priority) as TrackerPriority[],
    statuses: stringArray(raw.statuses, raw.status),
    dueDate: stringArray(raw.dueDate),
    rag: stringArray(raw.rag) as Array<TrackerHealth | 'No RAG'>,
    lastUpdated: stringArray(raw.lastUpdated),
    nextActionSearch: stringValue(raw.nextActionSearch),
  };
}

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function stringArray(value: unknown, legacyValue?: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof legacyValue === 'string' && legacyValue !== 'All') return [legacyValue];
  if (typeof value === 'string' && value !== 'All') return [value];
  return [];
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
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
