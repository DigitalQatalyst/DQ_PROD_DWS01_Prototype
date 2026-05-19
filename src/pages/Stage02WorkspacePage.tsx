import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  CloudUpload,
  FilePlus2,
  FileText,
  GitBranch,
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
  type PerformanceMetric,
  type Stage02Tab,
  type WorkItem
} from '../mocks/stage02.mock';
import { StatusPill } from '../components/StatusPill';

type DetailRecord = WorkItem | ActivityItem | null;
type ModalType = 'Create Task' | 'Start Workflow' | 'Submit Request' | 'New Tracker Item' | 'Upload Document' | 'Add Knowledge' | null;

const tabs: Stage02Tab[] = ['Tasks', 'Workflows', 'Trackers', 'Reviews', 'Performance'];

const quickActionIcons: Record<string, LucideIcon> = {
  'Create Task': CheckSquare,
  'Start Workflow': GitBranch,
  'Submit Request': FilePlus2,
  'New Tracker Item': LayoutList,
  'Upload Document': CloudUpload,
  'Add Knowledge': BookOpen
};

const toneDot = {
  success: 'bg-success',
  info: 'bg-info',
  warning: 'bg-warning',
  danger: 'bg-danger',
  neutral: 'bg-primary'
};

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
          {kpi.label.includes('Workflow') ? <GitBranch size={18} /> : kpi.label.includes('Performance') ? <BarChart3 size={18} /> : kpi.label.includes('Governance') ? <ShieldCheck size={18} /> : <CheckSquare size={18} />}
        </div>
      </div>
      <div className="text-3xl font-bold text-primary">{kpi.value}</div>
      <div className="mt-3 flex items-start gap-2 text-xs font-medium text-text-muted">
        <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${toneDot[kpi.tone]}`} />
        <span className="leading-5">{kpi.subtitle}</span>
      </div>
    </button>
  );
}

function WorkRows({
  rows,
  onOpen
}: {
  rows: WorkItem[];
  onOpen: (item: WorkItem) => void;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-border-subtle">
      <table className="w-full table-fixed text-left">
        <thead className="bg-surface text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <tr>
            <th className="w-[34%] px-5 py-3">Title</th>
            <th className="w-[13%] px-4 py-3">Type</th>
            <th className="w-[14%] px-4 py-3">Due Date</th>
            <th className="w-[15%] px-4 py-3">Status</th>
            <th className="w-[13%] px-4 py-3">Priority</th>
            <th className="w-[11%] px-4 py-3">Owner</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {rows.map((row) => (
            <tr key={row.id} onClick={() => onOpen(row)} className="cursor-pointer transition hover:bg-surface">
              <td className="px-5 py-3">
                <div className="flex items-start gap-3">
                  <input aria-label={`Select ${row.title}`} type="checkbox" onClick={(event) => event.stopPropagation()} className="mt-1 h-4 w-4 rounded border-border-strong" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-primary">{row.title}</div>
                    {row.subtitle && <div className="mt-0.5 truncate text-xs text-text-muted">{row.subtitle}</div>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-text-secondary">{row.type}</td>
              <td className="px-4 py-3 text-sm text-text-secondary">{row.dueDate}</td>
              <td className="px-4 py-3"><StatusPill status={row.status} /></td>
              <td className="px-4 py-3"><StatusPill status={row.priority} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-primary">{getInitials(row.owner)}</span>
                  <button aria-label={`Open actions for ${row.title}`} onClick={(event) => { event.stopPropagation(); onOpen(row); }} className="rounded-full p-1 text-text-muted hover:bg-white hover:text-primary">
                    <MoreVertical size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PerformancePreview({ metrics, onOpen }: { metrics: PerformanceMetric[]; onOpen: (metric: PerformanceMetric) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <button
          key={metric.label}
          onClick={() => onOpen(metric)}
          className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition hover:border-border-default hover:bg-surface">
          <div className="text-sm font-semibold text-text-muted">{metric.label}</div>
          <div className="mt-3 text-3xl font-bold text-primary">{metric.value}</div>
          <div className="mt-3"><StatusPill status={metric.status} /></div>
        </button>
      ))}
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

function QuickActions({ actions, onOpen }: { actions: string[]; onOpen: (action: ModalType) => void }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Quick Actions</h2>
        <button onClick={() => toast.info('Quick action editing placeholder')} className="text-xs font-semibold text-text-muted hover:text-primary">Edit</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = quickActionIcons[action] || Plus;
          return (
            <button key={action} onClick={() => onOpen(action as ModalType)} className="rounded-card border border-border-subtle bg-white px-3 py-4 text-center transition hover:border-border-default hover:bg-surface">
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
        <h2 className="text-lg font-bold text-primary">My Calendar</h2>
        <button onClick={() => toast.info('Calendar view placeholder')} className="text-xs font-bold text-info-text hover:underline">View calendar</button>
      </div>
      <div className="grid grid-cols-[72px_1fr] overflow-hidden rounded-card border border-border-subtle">
        <div className="border-r border-border-subtle bg-surface p-4 text-center">
          <div className="text-xs font-semibold text-text-muted">Today</div>
          <div className="mt-2 text-3xl font-bold text-primary">19</div>
          <div className="text-xs text-text-muted">May 2026</div>
        </div>
        <div className="divide-y divide-border-subtle">
          {items.map((item) => (
            <button key={item.id} onClick={() => onOpen(item)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-surface">
              <span className="h-2 w-2 rounded-full bg-info" />
              <span className="w-20 text-xs text-text-muted">{item.subtitle.replace(' EAT', '')}</span>
              <span className="truncate font-semibold text-primary">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
        <span>All times in EAT</span>
        <CalendarDays size={16} />
      </div>
    </section>
  );
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
              {(work.related || ['DWS.01 Workspace', 'My Work']).map((item) => (
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
    type === 'Start Workflow' ? ['Workflow template', 'Request title', 'Owner', 'Required inputs', 'Due date'] :
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
  const [activeTab, setActiveTab] = useState<Stage02Tab>('Tasks');
  const [detail, setDetail] = useState<DetailRecord>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const activeRows = dataset.tabs[activeTab];

  const handleKpi = (kpi: KpiItem) => {
    if (kpi.tab) setActiveTab(kpi.tab);
    navigate(kpi.route);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-8 py-7">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">{dataset.header.title}</h1>
              <p className="mt-2 text-sm font-medium text-text-secondary">{dataset.header.subtitle}</p>
            </div>
            <button onClick={() => toast.info('Workspace customisation placeholder')} className="inline-flex h-10 items-center gap-2 rounded-button border border-border-default bg-white px-4 text-sm font-semibold text-primary shadow-sm hover:bg-surface">
              <SlidersHorizontal size={16} />
              Customise
            </button>
          </header>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-5">
            {dataset.kpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} onClick={() => handleKpi(kpi)} />)}
          </section>

          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-primary">My Work</h2>
              <button onClick={() => navigate('/stage02/tasks')} className="inline-flex items-center gap-2 text-sm font-bold text-info-text hover:underline">
                View all <ChevronRight size={16} />
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-6 border-b border-border-subtle">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-sm font-bold transition-colors ${activeTab === tab ? 'text-info-text' : 'text-text-secondary hover:text-primary'}`}>
                  {tab}
                  {tab !== 'Performance' && <span className="ml-1 text-xs text-text-muted">({dataset.tabs[tab].length})</span>}
                  {tab === 'Performance' && <span className="ml-2 rounded-pill bg-info-surface px-2 py-0.5 text-[10px] text-info-text">NEW</span>}
                  {activeTab === tab && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-info" />}
                </button>
              ))}
            </div>
            {activeTab === 'Performance' ? (
              <PerformancePreview
                metrics={dataset.performance}
                onOpen={(metric) => setDetail({
                  id: `PERF-${metric.label}`,
                  title: metric.label,
                  subtitle: metric.value,
                  status: metric.status,
                  owner: 'Amina Hassan',
                  dueDate: 'Q2 cycle',
                  description: `${metric.label} is currently ${metric.value}. This preview supports the lightweight Stage 02 performance summary.`,
                })}
              />
            ) : (
              <WorkRows rows={activeRows} onOpen={setDetail} />
            )}
          </section>

          <div className={`grid grid-cols-1 gap-4 ${dataset.lowerPrimary ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {dataset.lowerPrimary && <UtilityList title="Getting Started" items={dataset.lowerPrimary} onOpen={setDetail} actionLabel="View all" onAction={() => navigate('/stage02/knowledge')} />}
            <UtilityList title="Recent Activity" items={dataset.recentActivity} onOpen={setDetail} actionLabel="View all" onAction={() => navigate('/stage02/reports')} />
            <UtilityList title="Announcements" items={dataset.announcements} onOpen={setDetail} actionLabel="View all" onAction={() => navigate('/stage02/knowledge')} />
          </div>

          <footer className="flex justify-center gap-5 py-4 text-xs text-text-muted">
            <span>© 2026 DWS. All rights reserved.</span>
            <span>|</span>
            <button onClick={() => toast.info('Privacy page placeholder')} className="hover:text-primary">Privacy</button>
            <span>|</span>
            <button onClick={() => toast.info('Terms page placeholder')} className="hover:text-primary">Terms</button>
            <span>|</span>
            <button onClick={() => toast.info('Support page placeholder')} className="hover:text-primary">Support</button>
          </footer>
        </div>

        <aside className="space-y-4">
          <QuickActions actions={dataset.quickActions} onOpen={setModal} />
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">AI Assistant <span className="ml-2 rounded-pill bg-info-surface px-2 py-0.5 text-[10px] text-info-text">BETA</span></h2>
              <Sparkles size={18} className="text-primary" />
            </div>
            <p className="mb-3 text-sm text-text-secondary">Hi {mode === 'first-time' ? 'Amina' : 'Ian'}, here are some insights for your {activeRole.toLowerCase()} view.</p>
            <div className="divide-y divide-border-subtle rounded-card border border-border-subtle">
              {dataset.aiInsights.map((insight) => (
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
          <CalendarCard items={dataset.calendar} onOpen={setDetail} />
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
