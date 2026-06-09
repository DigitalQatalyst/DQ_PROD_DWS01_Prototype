import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  FileUp,
  Filter,
  Grid2X2,
  Lock,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DqButton } from '../components/DqButton';
import { PriorityBadge, RiskBadge, StatusBadge } from '../components/DqBadge';
import { assignedTasks } from '../mocks/assignedTasks.mock';
import type { AssignedTask } from '../types/assignedTask';

const tabs = [
  { label: 'Overview', icon: Grid2X2 },
  { label: 'Task Queue', icon: ClipboardList },
  { label: 'Due Actions', icon: CalendarDays },
  { label: 'Blockers', icon: AlertTriangle },
  { label: 'Evidence', icon: FileText },
  { label: 'Closure Review', icon: ClipboardCheck },
];

export function AssignedWorkPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Task Queue');
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>(['TSK-1042']);

  const visibleTasks = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return assignedTasks;
    return assignedTasks.filter((task) => `${task.id} ${task.title} ${task.context} ${task.nextAction}`.toLowerCase().includes(query));
  }, [search]);

  const openTask = (taskId: string) => navigate(`/tasks/my-work/assigned-tasks/${taskId}`);
  const toggleSelected = (taskId: string) => {
    setSelectedRows((current) => current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId]);
  };

  return (
    <div className="w-full px-5 py-6 pb-12 sm:px-6 lg:px-8">
      <header className="mb-6">
        <Breadcrumb items={['Tasks', 'My Work', 'Assigned Tasks']} />
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            {/* <div className="dq-overline mb-2">TASK WORKSPACE</div> */}
            <h1 className="dq-page-title">Assigned Tasks</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-primary">
              View and manage all tasks assigned to you. Take action, upload evidence, resolve blockers, and drive tasks to closure.
            </p>
          </div>
          <DqButton variant="navy" onClick={() => toast.info('Draft task note opened for this prototype session.')} className="shrink-0">
            <FileText size={17} strokeWidth={1.5} /> Draft Task Note <ChevronDown size={15} strokeWidth={1.5} />
          </DqButton>
        </div>
      </header>

      <section className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Assigned Tasks" value="24" trend="↗ 4 vs last 7 days" icon={ClipboardCheck} accent="blue" />
        <KpiCard label="Due This Week" value="6" trend="↗ 2 vs last 7 days" icon={CalendarDays} accent="orange" />
        <KpiCard label="Overdue / At Risk" value="3" trend="↗ 1 vs last 7 days" icon={AlertTriangle} accent="red" />
        <KpiCard label="Blocked Tasks" value="4" trend="↔ 0 vs last 7 days" icon={Lock} accent="purple" />
        <KpiCard label="Evidence Required" value="7" trend="↘ 2 vs last 7 days" icon={FileText} accent="green" />
      </section>

      <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
        <div className="dq-tabs flex overflow-x-auto px-4" role="tablist" aria-label="Assigned task workspace tabs">
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

        <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle p-4">
          <div className="relative min-w-[240px] flex-1">
            <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="dq-input pl-9" />
          </div>
          {['Status', 'Priority', 'Due Date', 'SLA / Risk', 'Evidence'].map((label) => <FilterSelect key={label} label={label} />)}
          <DqButton variant="outline"><Filter size={16} strokeWidth={1.5} /> More Filters</DqButton>
          <button type="button" onClick={() => setSearch('')} className="px-2 text-sm font-semibold text-secondary hover:text-danger">Clear</button>
          <DqButton variant="navy" onClick={() => toast.success('View saved')}>Save View</DqButton>
        </div>

        {activeTab === 'Task Queue' ? (
          <TaskTable tasks={visibleTasks} selectedRows={selectedRows} onToggleSelected={toggleSelected} onOpenTask={openTask} />
        ) : (
          <TabPreview tab={activeTab} onOpenTask={openTask} />
        )}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr_0.78fr]">
        <RecommendedActions onOpenTask={openTask} />
        <UpcomingDeadlines onOpenTask={openTask} />
        <EvidenceSummary />
      </section>
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

function KpiCard({ label, value, trend, icon: Icon, accent }: { label: string; value: string; trend: string; icon: LucideIcon; accent: 'blue' | 'orange' | 'red' | 'purple' | 'green' }) {
  const styles = {
    blue: 'border-t-info text-info-text bg-info-surface',
    orange: 'border-t-secondary text-secondary bg-orange-50',
    red: 'border-t-danger text-danger-text bg-danger-surface',
    purple: 'border-t-[#7c3aed] text-[#6d28d9] bg-[#f3e8ff]',
    green: 'border-t-success text-success-text bg-success-surface',
  }[accent];
  const [borderClass, textClass, bgClass] = styles.split(' ');
  return (
    <div className={`dq-card dq-card-clickable min-h-[124px] border-t-4 ${borderClass}`}>
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
    </div>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button type="button" className="inline-flex h-10 items-center gap-2 rounded-button border-[1.5px] border-border-default bg-white px-3 text-sm font-semibold text-primary hover:bg-navy-50 focus:outline-none focus:ring-4 focus:ring-primary/10">
      {label}
      <ChevronDown size={15} strokeWidth={1.5} className="text-text-muted" />
    </button>
  );
}

function TaskTable({ tasks, selectedRows, onToggleSelected, onOpenTask }: { tasks: AssignedTask[]; selectedRows: string[]; onToggleSelected: (taskId: string) => void; onOpenTask: (taskId: string) => void }) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-[1220px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle bg-surface">
              {['', 'Task ID', 'Task Title', 'Context / Request / Outcome', 'Priority', 'Status', 'Due Date', 'SLA / Risk', 'Evidence', 'Next Action', ''].map((header) => (
                <th key={header || 'select'} className="px-4 py-3 text-xs font-bold uppercase text-[#454560]">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle bg-white">
            {tasks.map((task) => {
              const selected = selectedRows.includes(task.id);
              return (
                <tr key={task.id} onClick={() => onOpenTask(task.id)} className={`cursor-pointer border-l-4 transition hover:bg-navy-50 ${selected ? 'border-secondary bg-orange-50/60' : 'border-transparent'}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${task.id}`}
                      checked={selected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => onToggleSelected(task.id)}
                      className="h-4 w-4 rounded border-border-default text-secondary focus:ring-secondary/30"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-sm font-bold text-primary">{task.id}</td>
                  <td className="max-w-[190px] px-4 py-3 text-sm font-semibold leading-5 text-primary">{task.title}</td>
                  <td className="max-w-[240px] px-4 py-3 text-sm text-primary">{task.context}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-sm font-semibold text-primary">{task.dueDate}</div>
                    <div className={`text-xs font-bold ${task.dueLabel === 'Overdue' ? 'text-danger' : task.dueLabel === 'Today' ? 'text-secondary' : 'text-text-muted'}`}>{task.dueLabel}</div>
                  </td>
                  <td className="px-4 py-3"><RiskBadge risk={task.risk} /></td>
                  <td className="px-4 py-3"><EvidenceProgress uploaded={task.evidenceUploaded} required={task.evidenceRequired} /></td>
                  <td className="max-w-[170px] px-4 py-3 text-sm font-semibold leading-5 text-primary">{task.nextAction}</td>
                  <td className="px-4 py-3"><ChevronRight size={18} strokeWidth={1.5} className="text-primary" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle px-4 py-3 text-sm text-text-muted">
        <span>Showing 1 to 5 of 24 results</span>
        <div className="flex items-center gap-2">
          <PagerButton label="Previous"><ChevronLeft size={16} strokeWidth={1.5} /></PagerButton>
          {['1', '2', '3'].map((page) => <PagerButton key={page} active={page === '1'} label={`Page ${page}`}>{page}</PagerButton>)}
          <span className="px-2">...</span>
          <PagerButton label="Page 5">5</PagerButton>
          <PagerButton label="Next"><ChevronRight size={16} strokeWidth={1.5} /></PagerButton>
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-button border border-border-default px-3 font-semibold text-primary">
          10 / page <ChevronDown size={14} strokeWidth={1.5} />
        </button>
      </div>
    </>
  );
}

function EvidenceProgress({ uploaded, required }: { uploaded: number; required: number }) {
  const percent = Math.round((uploaded / required) * 100);
  return (
    <div className="min-w-[86px]">
      <div className="mb-1 font-mono text-xs font-bold text-primary">{uploaded}/{required}</div>
      <div className="h-1.5 rounded-full bg-border-subtle">
        <div className={`h-full rounded-full ${uploaded === required ? 'bg-success' : uploaded === 0 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function PagerButton({ children, label, active }: { children: ReactNode; label: string; active?: boolean }) {
  return (
    <button aria-label={label} className={`grid h-9 min-w-9 place-items-center rounded-button border text-sm font-bold ${active ? 'border-primary bg-primary text-white' : 'border-border-default bg-white text-primary hover:bg-navy-50'}`}>
      {children}
    </button>
  );
}

function TabPreview({ tab, onOpenTask }: { tab: string; onOpenTask: (taskId: string) => void }) {
  return (
    <div className="p-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {assignedTasks.slice(0, 3).map((task) => (
          <button key={`${tab}-${task.id}`} onClick={() => onOpenTask(task.id)} className="dq-card dq-card-clickable text-left">
            <div className="font-mono text-xs font-bold text-primary">{task.id}</div>
            <div className="mt-2 text-sm font-semibold text-primary">{task.title}</div>
            <div className="mt-2 text-sm text-text-secondary">{task.nextAction}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RecommendedActions({ onOpenTask }: { onOpenTask: (taskId: string) => void }) {
  const actions = [
    ['Upload evidence for TSK-1131', 'Evidence missing for closure review', 'TSK-1131', 'Overdue'],
    ['Resolve blocker on BLK-119', 'Dependency blocking task completion', 'BLK-119', 'Blocked'],
    ['Update progress on TSK-1042', 'Monthly workforce report validation', 'TSK-1042', 'Due Today'],
  ];
  return (
    <section className="dq-card">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-button bg-[#f3e8ff] text-[#6d28d9]"><ClipboardCheck size={18} strokeWidth={1.5} /></span>
        <h2 className="dq-card-title">Recommended Next Actions</h2>
      </div>
      <div className="space-y-3">
        {actions.map(([title, subtitle, taskId, badge], index) => (
          <button key={taskId} onClick={() => onOpenTask(taskId)} className="flex w-full items-center gap-3 rounded-button p-2 text-left hover:bg-navy-50">
            <span className="w-5 text-sm font-bold text-primary">{index + 1}.</span>
            <span className="min-w-0 flex-1 text-sm text-primary"><span className="font-semibold">{title}</span> — {subtitle}</span>
            <StatusBadge status={badge} />
          </button>
        ))}
      </div>
    </section>
  );
}

function UpcomingDeadlines({ onOpenTask }: { onOpenTask: (taskId: string) => void }) {
  const rows = [
    ['15 May', 'Today', 'TSK-1042', 'Monthly workforce report validation', 'High'],
    ['18 May', '3 days', 'TSK-1087', 'Update operating rhythm pack', 'Medium'],
    ['19 May', '4 days', 'ACT-224', 'Client deck review', 'Medium'],
    ['20 May', '5 days', 'TSK-1168', 'Budget variance analysis', 'Low'],
  ];
  return (
    <section className="dq-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-button bg-warning-surface text-secondary"><CalendarDays size={18} strokeWidth={1.5} /></span>
          <h2 className="dq-card-title">Upcoming Deadlines</h2>
        </div>
        <button className="text-sm font-bold text-info-text hover:text-primary">View all</button>
      </div>
      <div className="space-y-3">
        {rows.map(([date, relative, id, title, priority]) => (
          <button key={id} onClick={() => onOpenTask(id)} className="grid w-full grid-cols-[58px_58px_78px_1fr_auto] items-center gap-3 rounded-button p-2 text-left hover:bg-navy-50">
            <span className="font-mono text-xs font-bold text-primary">{date}</span>
            <span className="text-xs font-bold text-secondary">{relative}</span>
            <span className="font-mono text-xs font-bold text-primary">{id}</span>
            <span className="truncate text-sm text-primary">{title}</span>
            <PriorityBadge priority={priority} />
          </button>
        ))}
      </div>
    </section>
  );
}

function EvidenceSummary() {
  return (
    <section className="dq-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-button bg-success-surface text-success-text"><FileUp size={18} strokeWidth={1.5} /></span>
          <h2 className="dq-card-title">Evidence Summary</h2>
        </div>
        <button className="text-sm font-bold text-info-text hover:text-primary">View all</button>
      </div>
      <div className="space-y-3 text-sm text-primary">
        {[
          ['Total Evidence Required', '7'],
          ['Evidence Submitted', '4'],
          ['Pending Evidence', '3'],
          ['Overdue Evidence', '2'],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <span>{label}</span>
            <span className={`font-bold ${label.includes('Overdue') ? 'text-danger' : 'text-primary'}`}>{value}</span>
          </div>
        ))}
      </div>
      <DqButton variant="outline" onClick={() => toast.info('Evidence upload opened for this prototype session.')} className="mt-5 w-full">
        <FileUp size={16} strokeWidth={1.5} /> Upload Evidence
      </DqButton>
    </section>
  );
}
