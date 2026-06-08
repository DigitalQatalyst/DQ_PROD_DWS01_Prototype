import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { governedTasks, type TaskRecord, type TaskStatus } from '../../data/taskAreaData';
import { TasksAreaHeader, TaskKpiTile, TaskStatusPill, PriorityChip, SlaChip, MonoId, OwnerBadge, TaskDetailDrawer, ClosureQualityBadge } from '../../components/TaskSharedComponents';

const columns: { status: TaskStatus; color: string }[] = [
  { status: 'Not Started', color: 'border-text-muted' },
  { status: 'In Progress', color: 'border-info' },
  { status: 'Blocked', color: 'border-danger' },
  { status: 'Waiting Review', color: 'border-warning' },
  { status: 'Returned', color: 'border-warning' },
  { status: 'Completed', color: 'border-success' },
];

export function KanbanViewPage() {
  const [drawerTask, setDrawerTask] = useState<TaskRecord | null>(null);
  const [filterOwner, setFilterOwner] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const owners = useMemo(() => ['All', ...Array.from(new Set(governedTasks.map((t) => t.owner)))], []);
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filtered = useMemo(() => {
    return governedTasks.filter((t) => {
      if (filterOwner !== 'All' && t.owner !== filterOwner) return false;
      if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
      return true;
    });
  }, [filterOwner, filterPriority]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Kanban View" subtitle="Task Board" purpose="Visual task flow by execution status, showing ownership, priority, and SLA exposure." />
      <div className="mb-4 flex flex-wrap gap-3">
        <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="h-9 rounded-input border border-border-default bg-white px-3 text-xs font-bold outline-none">{owners.map((o) => <option key={o}>{o}</option>)}</select>
        <div className="flex gap-1">{priorities.map((p) => <button key={p} onClick={() => setFilterPriority(p)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filterPriority === p ? 'bg-primary text-white' : 'bg-white text-text-secondary hover:bg-surface'}`}>{p}</button>)}</div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const tasks = filtered.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className="min-w-[280px] flex-1">
              <div className={`mb-3 flex items-center justify-between rounded-t-lg border-t-2 ${col.color} bg-white px-4 py-3`}>
                <span className="text-sm font-bold text-primary">{col.status}</span>
                <span className="rounded-pill bg-surface px-2 py-0.5 text-xs font-bold text-text-muted">{tasks.length}</span>
              </div>
              <div className="space-y-3">{tasks.map((t) => (
                <button key={t.id} onClick={() => setDrawerTask(t)} className="w-full rounded-card border border-border-subtle bg-white p-4 text-left shadow-sm transition-colors hover:bg-surface">
                  <div className="flex items-center justify-between"><MonoId value={t.id} /><PriorityChip priority={t.priority} /></div>
                  <h3 className="mt-2 text-sm font-bold text-primary line-clamp-2">{t.title}</h3>
                  <div className="mt-2 flex items-center gap-2"><OwnerBadge name={t.owner} /><SlaChip sla={t.slaState} /></div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-text-muted"><span>Due {t.dueDate}</span>{t.blockers.length > 0 && t.blockers.some((b) => b.status !== 'Resolved') && <span className="text-danger-text font-bold">Blocker</span>}</div>
                </button>
              ))}</div>
            </div>
          );
        })}
      </div>
      <TaskDetailDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
    </div>
  );
}

export function ListViewPage() {
  const [drawerTask, setDrawerTask] = useState<TaskRecord | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [activeSavedView, setActiveSavedView] = useState('');

  const savedViews = ['My team', 'At risk', 'Missing evidence', 'Closure review', 'Blocked'];

  const filtered = useMemo(() => {
    let list = governedTasks;
    if (activeSavedView === 'My team') list = list.filter((t) => t.owner === 'Amina Hassan' || t.owner === 'Bilal Waqar');
    else if (activeSavedView === 'At risk') list = list.filter((t) => t.slaState === 'At Risk' || t.slaState === 'Breached' || t.priority === 'Critical');
    else if (activeSavedView === 'Missing evidence') list = list.filter((t) => t.evidenceRequired && t.evidenceItems.length === 0);
    else if (activeSavedView === 'Closure review') list = list.filter((t) => t.closureQuality === 'Review Pending');
    else if (activeSavedView === 'Blocked') list = list.filter((t) => t.status === 'Blocked');
    if (filter !== 'All') list = list.filter((t) => [t.status, t.priority, t.slaState, t.closureQuality].includes(filter as any));
    if (query) list = list.filter((t) => `${t.id} ${t.title} ${t.owner} ${t.purpose}`.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [query, filter, activeSavedView]);

  const filters = ['All', ...Array.from(new Set(governedTasks.flatMap((t) => [t.status, t.priority])))];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="List View" subtitle="Task Board" purpose="Dense operational scanning across all tasks with advanced filtering." />
      <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex min-w-64 flex-1 items-center gap-2 rounded-input border border-border-default bg-white px-3 py-2 text-sm text-text-muted"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" className="w-full bg-transparent outline-none" /></div>
          {savedViews.map((sv) => <button key={sv} onClick={() => setActiveSavedView(activeSavedView === sv ? '' : sv)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${activeSavedView === sv ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{sv}</button>)}
        </div>
        <div className="mb-4 flex flex-wrap gap-2">{filters.slice(0, 10).map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filter === f ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{f}</button>)}</div>
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left">
            <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-text-muted"><tr><th className="px-4 py-3">Task ID</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">SLA</th><th className="px-4 py-3">Due</th><th className="px-4 py-3">Blocker</th><th className="px-4 py-3">Closure Quality</th><th className="px-4 py-3">Last Update</th></tr></thead>
            <tbody className="divide-y divide-border-subtle bg-white">{filtered.map((t) => <tr key={t.id} onClick={() => setDrawerTask(t)} className="cursor-pointer hover:bg-surface"><td className="px-4 py-3"><MonoId value={t.id} /></td><td className="px-4 py-3"><span className="max-w-[240px] truncate text-sm font-bold text-primary">{t.title}</span></td><td className="px-4 py-3"><OwnerBadge name={t.owner} /></td><td className="px-4 py-3 text-xs text-text-secondary">{t.ownerUnit}</td><td className="px-4 py-3"><PriorityChip priority={t.priority} /></td><td className="px-4 py-3"><TaskStatusPill status={t.status} /></td><td className="px-4 py-3"><SlaChip sla={t.slaState} /></td><td className="px-4 py-3 text-sm text-text-secondary">{t.dueDate}</td><td className="px-4 py-3">{t.blockers.some((b) => b.status !== 'Resolved') ? <span className="text-xs font-bold text-danger-text">Active</span> : <span className="text-xs text-text-muted">None</span>}</td><td className="px-4 py-3"><ClosureQualityBadge quality={t.closureQuality} /></td><td className="px-4 py-3 text-xs text-text-muted">{t.lastUpdateAt}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <TaskDetailDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
    </div>
  );
}

export function CalendarViewPage() {
  const [drawerTask, setDrawerTask] = useState<TaskRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-06-08');

  const weekDates = ['2026-06-08', '2026-06-09', '2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14'];

  const tasksByDate = useMemo(() => {
    const map: Record<string, TaskRecord[]> = {};
    weekDates.forEach((d) => { map[d] = governedTasks.filter((t) => t.dueDate === d); });
    return map;
  }, []);

  const selectedTasks = tasksByDate[selectedDate] || [];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Calendar View" subtitle="Task Board" purpose="Workload visibility by due date and SLA exposure across the week." />
      <div className="flex gap-2 mb-4 text-xs font-bold text-text-muted">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />On Track</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />At Risk</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" />Breached</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((d) => {
          const tasks = tasksByDate[d];
          const hasAtRisk = tasks.some((t) => t.slaState === 'At Risk' || t.slaState === 'Breached');
          return (
            <button key={d} onClick={() => setSelectedDate(d)} className={`rounded-card border p-3 text-left transition-colors ${selectedDate === d ? 'border-info bg-info-surface' : 'border-border-subtle bg-white hover:bg-surface'}`}>
              <div className="text-xs font-bold text-text-muted">{new Date(d).toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="mt-1 text-lg font-bold text-primary">{new Date(d).getDate()}</div>
              <div className="mt-2 space-y-1">{tasks.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-1"><span className={`h-1.5 w-1.5 rounded-full ${t.slaState === 'Breached' ? 'bg-danger' : t.slaState === 'At Risk' ? 'bg-warning' : 'bg-success'}`} /><span className="truncate text-xs text-text-secondary">{t.id}</span></div>
              ))}{tasks.length > 3 && <span className="text-xs text-text-muted">+{tasks.length - 3} more</span>}</div>
            </button>
          );
        })}
      </div>
      <section className="mt-5 rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-primary">Tasks Due {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
        {selectedTasks.length === 0 ? <p className="mt-3 text-sm text-text-muted">No tasks due on this date.</p> : (
          <div className="mt-4 space-y-3">{selectedTasks.map((t) => (
            <button key={t.id} onClick={() => setDrawerTask(t)} className="w-full rounded-card border border-border-subtle bg-surface p-4 text-left transition-colors hover:bg-white">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><MonoId value={t.id} /><TaskStatusPill status={t.status} /><PriorityChip priority={t.priority} /></div><SlaChip sla={t.slaState} /></div>
              <h3 className="mt-2 text-sm font-bold text-primary">{t.title}</h3>
              <div className="mt-2 flex items-center gap-3 text-xs text-text-muted"><OwnerBadge name={t.owner} /><span>{t.nextAction}</span></div>
            </button>
          ))}</div>
        )}
      </section>
      <TaskDetailDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
    </div>
  );
}

export function PriorityViewPage() {
  const [drawerTask, setDrawerTask] = useState<TaskRecord | null>(null);
  const lanes: { priority: TaskRecord['priority']; color: string }[] = [
    { priority: 'Critical', color: 'border-danger' },
    { priority: 'High', color: 'border-danger-surface' },
    { priority: 'Medium', color: 'border-warning-surface' },
    { priority: 'Low', color: 'border-success-surface' },
  ];

  const pressure = useMemo(() => ({
    criticalBlocked: governedTasks.filter((t) => t.priority === 'Critical' && t.status === 'Blocked').length,
    criticalOverdue: governedTasks.filter((t) => t.priority === 'Critical' && t.slaState === 'Breached').length,
  }), []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Priority View" subtitle="Task Board" purpose="Prioritize high-impact work and surface delivery risk by priority lane." />
      <div className="mb-5 rounded-card border border-border-subtle bg-white p-4 shadow-sm">
        <h3 className="text-sm font-bold text-primary">Priority Pressure</h3>
        <div className="mt-2 flex gap-4 text-xs text-text-secondary"><span><strong className="text-danger-text">{pressure.criticalBlocked}</strong> critical tasks blocked</span><span><strong className="text-danger-text">{pressure.criticalOverdue}</strong> critical tasks overdue</span></div>
      </div>
      <div className="space-y-6">
        {lanes.map((lane) => {
          const tasks = governedTasks.filter((t) => t.priority === lane.priority);
          return (
            <section key={lane.priority}>
              <div className={`mb-3 flex items-center justify-between border-l-4 ${lane.color} bg-white pl-4 pr-4 py-2 rounded-r-card`}>
                <h2 className="text-sm font-bold text-primary">{lane.priority} Priority</h2>
                <span className="rounded-pill bg-surface px-2 py-0.5 text-xs font-bold text-text-muted">{tasks.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{tasks.map((t) => (
                <button key={t.id} onClick={() => setDrawerTask(t)} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition-colors hover:bg-surface">
                  <div className="flex items-center justify-between"><MonoId value={t.id} /><SlaChip sla={t.slaState} /></div>
                  <h3 className="mt-2 text-sm font-bold text-primary">{t.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{t.expectedOutput}</p>
                  <div className="mt-3 flex items-center justify-between"><OwnerBadge name={t.owner} /><span className="text-xs text-text-muted">Due {t.dueDate}</span></div>
                </button>
              ))}</div>
            </section>
          );
        })}
      </div>
      <TaskDetailDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
    </div>
  );
}

export function TeamTaskViewPage() {
  const [drawerTask, setDrawerTask] = useState<TaskRecord | null>(null);
  const teamMembers = useMemo(() => {
    const members: Record<string, TaskRecord[]> = {};
    governedTasks.forEach((t) => { if (!members[t.owner]) members[t.owner] = []; members[t.owner].push(t); });
    return members;
  }, []);

  const kpis = useMemo(() => [
    { label: 'Team Active Tasks', value: String(governedTasks.filter((t) => !['Completed', 'Returned'].includes(t.status)).length), status: 'info' as const },
    { label: 'Overdue', value: String(governedTasks.filter((t) => t.slaState === 'Breached').length), status: 'danger' as const },
    { label: 'Blocked', value: String(governedTasks.filter((t) => t.status === 'Blocked').length), status: 'danger' as const },
    { label: 'Weak Task Hygiene', value: String(governedTasks.filter((t) => t.closureQuality === 'Not Ready' && t.progressPercent < 30).length), status: 'warning' as const },
  ], []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Team Task View" subtitle="Task Board" purpose="Team execution health: workload, ownership, overdue work, blockers, and closure quality." />
      <div className="mb-4 rounded-card border border-border-subtle bg-info-surface p-4 text-xs text-text-secondary">Scrum Master view: flow and discipline. Team Lead view: ownership and delivery. Unit Lead view: SLA exposure and governance risk.</div>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">{kpis.map((k) => <TaskKpiTile key={k.label} {...k} />)}</section>
      <section className="mt-5 rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-primary">Team Workload Matrix</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-text-muted"><tr><th className="px-4 py-3">Member</th><th className="px-4 py-3">Active</th><th className="px-4 py-3">Due Soon</th><th className="px-4 py-3">Blocked</th><th className="px-4 py-3">Review Pending</th><th className="px-4 py-3">Closure Accepted</th></tr></thead>
            <tbody className="divide-y divide-border-subtle bg-white">{Object.entries(teamMembers).map(([member, tasks]) => (
              <tr key={member} className="hover:bg-surface"><td className="px-4 py-3"><OwnerBadge name={member} /></td><td className="px-4 py-3 text-sm font-bold text-primary">{tasks.filter((t) => !['Completed', 'Returned'].includes(t.status)).length}</td><td className="px-4 py-3 text-sm text-text-secondary">{tasks.filter((t) => t.slaState === 'At Risk' || t.slaState === 'Breached').length}</td><td className="px-4 py-3 text-sm text-danger-text font-bold">{tasks.filter((t) => t.status === 'Blocked').length}</td><td className="px-4 py-3 text-sm text-warning-text font-bold">{tasks.filter((t) => t.status === 'Waiting Review').length}</td><td className="px-4 py-3 text-sm text-success-text font-bold">{tasks.filter((t) => t.closureQuality === 'Accepted').length}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <section className="mt-5 rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-primary">Team Tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-left">
            <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-text-muted"><tr><th className="px-4 py-3">Task ID</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">SLA</th><th className="px-4 py-3">Blocker</th><th className="px-4 py-3">Last Update</th><th className="px-4 py-3">Closure Quality</th></tr></thead>
            <tbody className="divide-y divide-border-subtle bg-white">{governedTasks.map((t) => <tr key={t.id} onClick={() => setDrawerTask(t)} className="cursor-pointer hover:bg-surface"><td className="px-4 py-3"><MonoId value={t.id} /></td><td className="px-4 py-3"><span className="max-w-[240px] truncate text-sm font-bold text-primary">{t.title}</span></td><td className="px-4 py-3"><OwnerBadge name={t.owner} /></td><td className="px-4 py-3"><TaskStatusPill status={t.status} /></td><td className="px-4 py-3"><SlaChip sla={t.slaState} /></td><td className="px-4 py-3">{t.blockers.some((b) => b.status !== 'Resolved') ? <span className="text-xs font-bold text-danger-text">Active</span> : <span className="text-xs text-text-muted">None</span>}</td><td className="px-4 py-3 text-xs text-text-muted">{t.lastUpdateAt}</td><td className="px-4 py-3"><ClosureQualityBadge quality={t.closureQuality} /></td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <TaskDetailDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
    </div>
  );
}
