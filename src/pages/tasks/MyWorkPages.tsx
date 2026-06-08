import { useState, useMemo } from 'react';
import { Search, Clock, AlertTriangle, Calendar, Bell, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { governedTasks, workingSessions, getTasksByAssignee, type TaskRecord } from '../../data/taskAreaData';
import { TasksAreaHeader, TaskKpiTile, TaskStatusPill, PriorityChip, SlaChip, MonoId, TaskProgressBar, TaskDetailDrawer, EmptyState } from '../../components/TaskSharedComponents';

const currentUser = 'Amina Hassan';

export function AssignedTasksPage() {
  const [drawerTask, setDrawerTask] = useState<TaskRecord | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [query, setQuery] = useState('');

  const myTasks = useMemo(() => getTasksByAssignee(currentUser), []);
  const kpis = useMemo(() => [
    { label: 'Active Assigned', value: String(myTasks.filter((t) => !['Completed', 'Returned'].includes(t.status)).length), status: 'info' as const },
    { label: 'Due Soon', value: String(myTasks.filter((t) => t.slaState === 'At Risk' || t.slaState === 'Breached').length), status: 'warning' as const },
    { label: 'Blocked', value: String(myTasks.filter((t) => t.status === 'Blocked').length), status: 'danger' as const },
    { label: 'Waiting Review', value: String(myTasks.filter((t) => t.status === 'Waiting Review').length), status: 'warning' as const },
  ], [myTasks]);

  const tabs = ['All', 'Due Soon', 'Blocked', 'Needs Update', 'Waiting Review'];
  const filtered = useMemo(() => {
    let list = myTasks;
    if (activeTab === 'Due Soon') list = list.filter((t) => t.slaState === 'At Risk' || t.slaState === 'Breached');
    else if (activeTab === 'Blocked') list = list.filter((t) => t.status === 'Blocked');
    else if (activeTab === 'Needs Update') list = list.filter((t) => t.progressPercent < 50 && t.status !== 'Completed');
    else if (activeTab === 'Waiting Review') list = list.filter((t) => t.status === 'Waiting Review');
    if (query) list = list.filter((t) => `${t.id} ${t.title} ${t.purpose}`.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [myTasks, activeTab, query]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Assigned Tasks" subtitle="My Work" purpose="All tasks assigned to you, showing ownership, status, SLA, and next actions." />
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">{kpis.map((k) => <TaskKpiTile key={k.label} {...k} />)}</section>
      <section className="mt-5 rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-64 flex-1 items-center gap-2 rounded-input border border-border-default bg-white px-3 py-2 text-sm text-text-muted"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assigned tasks" className="w-full bg-transparent outline-none" /></div>
        </div>
        <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border-subtle">{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap px-4 py-3 text-sm font-bold ${activeTab === tab ? 'border-b-2 border-info text-info-text' : 'text-text-secondary hover:text-primary'}`}>{tab}</button>)}</div>
        {filtered.length === 0 ? <EmptyState title="No assigned tasks" description="No tasks match the current filter." /> : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left">
              <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-text-muted"><tr><th className="px-4 py-3">Task ID</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">SLA</th><th className="px-4 py-3">Due</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Next Action</th></tr></thead>
              <tbody className="divide-y divide-border-subtle bg-white">{filtered.map((t) => <tr key={t.id} onClick={() => setDrawerTask(t)} className="cursor-pointer hover:bg-surface"><td className="px-4 py-3"><MonoId value={t.id} /></td><td className="px-4 py-3"><div className="max-w-[280px] truncate text-sm font-bold text-primary">{t.title}</div></td><td className="px-4 py-3"><PriorityChip priority={t.priority} /></td><td className="px-4 py-3"><TaskStatusPill status={t.status} /></td><td className="px-4 py-3"><SlaChip sla={t.slaState} /></td><td className="px-4 py-3 text-sm text-text-secondary">{t.dueDate}</td><td className="px-4 py-3 w-32"><TaskProgressBar percent={t.progressPercent} /></td><td className="px-4 py-3"><span className="line-clamp-1 max-w-[200px] text-xs text-text-secondary">{t.nextAction}</span></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>
      <TaskDetailDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
    </div>
  );
}

export function MyDueActionsPage() {
  const [drawerTask, setDrawerTask] = useState<TaskRecord | null>(null);
  const myTasks = useMemo(() => getTasksByAssignee(currentUser), []);

  const groups = useMemo(() => {
    const today = myTasks.filter((t) => t.dueDate === '2026-06-08');
    const tomorrow = myTasks.filter((t) => t.dueDate === '2026-06-09');
    const thisWeek = myTasks.filter((t) => t.dueDate === '2026-06-10' || t.dueDate === '2026-06-11' || t.dueDate === '2026-06-12');
    const slaAtRisk = myTasks.filter((t) => t.slaState === 'At Risk' || t.slaState === 'Breached');
    return [
      { label: 'Due Today', items: today, icon: AlertTriangle, color: 'text-danger' },
      { label: 'Due Tomorrow', items: tomorrow, icon: Clock, color: 'text-warning' },
      { label: 'Due This Week', items: thisWeek, icon: Calendar, color: 'text-info' },
      { label: 'SLA At Risk', items: slaAtRisk, icon: AlertTriangle, color: 'text-danger' },
    ].filter((g) => g.items.length > 0);
  }, [myTasks]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="My Due Actions" subtitle="My Work" purpose="Time-sensitive task actions requiring immediate attention, grouped by urgency." />
      <div className="mb-5 rounded-card border border-border-subtle bg-info-surface p-4">
        <div className="flex items-start gap-3"><Bell size={18} className="mt-0.5 text-info" /><div><h3 className="text-sm font-bold text-primary">Why this matters</h3><p className="mt-1 text-xs leading-5 text-text-secondary">SLA discipline and execution rhythm depend on timely actions. Due actions surface tasks that need your immediate attention to maintain flow and prevent breaches.</p></div></div>
      </div>
      {groups.length === 0 ? <EmptyState title="No due actions" description="All your tasks are on track." /> : (
        <div className="space-y-6">{groups.map((group) => (
          <section key={group.label}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-primary"><group.icon size={18} className={group.color} />{group.label}<span className="ml-2 rounded-pill bg-surface px-2 py-0.5 text-xs font-bold text-text-muted">{group.items.length}</span></h2>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{group.items.map((t) => (
              <button key={t.id} onClick={() => setDrawerTask(t)} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition-colors hover:bg-surface">
                <div className="flex items-start justify-between gap-3"><div><MonoId value={t.id} /><h3 className="mt-1 text-sm font-bold text-primary">{t.title}</h3></div><SlaChip sla={t.slaState} /></div>
                <div className="mt-3 flex flex-wrap items-center gap-2"><PriorityChip priority={t.priority} /><TaskStatusPill status={t.status} /><span className="text-xs text-text-muted">Due {t.dueDate}</span></div>
                <p className="mt-3 line-clamp-2 text-xs text-text-secondary">{t.nextAction}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Add Update', 'Upload Evidence', 'Resolve Blocker'].map((a) => <span key={a} className="rounded-pill bg-surface px-2 py-1 text-xs font-semibold text-text-secondary">{a}</span>)}
                </div>
              </button>
            ))}</div>
          </section>
        ))}</div>
      )}
      <TaskDetailDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
    </div>
  );
}

export function MyTaskUpdatesPage() {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [summary, setSummary] = useState('');
  const [progress, setProgress] = useState(50);
  const [nextAction, setNextAction] = useState('');
  const myTasks = useMemo(() => getTasksByAssignee(currentUser), []);

  const kpis = useMemo(() => [
    { label: 'Updates This Week', value: '3', status: 'success' as const },
    { label: 'Updates Overdue', value: '1', status: 'danger' as const },
    { label: 'Returned Updates', value: '0', status: 'info' as const },
    { label: 'Evidence-linked Updates', value: '2', status: 'info' as const },
  ], []);

  const handleSubmit = () => {
    if (!selectedTask || !summary.trim()) { toast.error('Select a task and provide a progress summary.'); return; }
    toast.success(`Progress update submitted for ${selectedTask}.`);
    setSummary(''); setProgress(50); setNextAction(''); setSelectedTask('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="My Updates" subtitle="My Work" purpose="Submit meaningful progress updates against your assigned tasks." />
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">{kpis.map((k) => <TaskKpiTile key={k.label} {...k} />)}</section>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Progress Update Composer</h2>
          <div className="mt-4 space-y-4">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task *</span>
              <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong"><option value="">Choose a task</option>{myTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Progress Summary *</span>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" placeholder="Describe what was completed, what is in progress, and what is next..." />
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Progress %</span>
              <div className="mt-2 flex items-center gap-3"><input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="flex-1" /><span className="text-sm font-bold text-primary">{progress}%</span></div>
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Next Action</span>
              <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" placeholder="What happens next?" />
            </label>
            <button onClick={handleSubmit} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Submit Update</button>
          </div>
        </section>
        <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Recent Updates</h2>
          <div className="mt-4 space-y-3">
            {myTasks.slice(0, 3).map((t) => (
              <div key={t.id} className="rounded-card border border-border-subtle bg-surface p-3">
                <div className="flex items-center justify-between"><MonoId value={t.id} /><span className="text-xs text-text-muted">{t.lastUpdateAt}</span></div>
                <p className="mt-1 text-xs text-text-secondary">{t.nextAction}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function MyTaskBlockersPage() {
  const [drawerTask, setDrawerTask] = useState<TaskRecord | null>(null);
  const myTasks = useMemo(() => getTasksByAssignee(currentUser), []);
  const allBlockers = useMemo(() => myTasks.flatMap((t) => t.blockers.map((b) => ({ ...b, task: t }))), [myTasks]);

  const kpis = useMemo(() => [
    { label: 'Open Blockers', value: String(allBlockers.filter((b) => b.status === 'Open').length), status: 'danger' as const },
    { label: 'Critical Blockers', value: String(allBlockers.filter((b) => b.severity === 'Critical').length), status: 'danger' as const },
    { label: 'Awaiting Support', value: String(allBlockers.filter((b) => b.status === 'Escalated').length), status: 'warning' as const },
    { label: 'Escalation Needed', value: String(allBlockers.filter((b) => b.age.includes('day')).length), status: 'warning' as const },
  ], [allBlockers]);

  const groups = useMemo(() => [
    { label: 'Raised by Me', items: allBlockers.filter((b) => b.raisedBy === currentUser) },
    { label: 'Assigned to Me', items: allBlockers.filter((b) => b.owner === currentUser) },
    { label: 'Affecting My Tasks', items: allBlockers.filter((b) => b.owner !== currentUser && b.raisedBy !== currentUser) },
  ].filter((g) => g.items.length > 0), [allBlockers]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="My Blockers" subtitle="My Work" purpose="Blockers owned by or affecting your tasks, with resolution paths and escalation status." />
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">{kpis.map((k) => <TaskKpiTile key={k.label} {...k} />)}</section>
      {allBlockers.length === 0 ? <EmptyState title="No blockers" description="No active blockers affecting your tasks." /> : (
        <div className="mt-5 space-y-6">{groups.map((group) => (
          <section key={group.label}>
            <h2 className="mb-3 text-lg font-bold text-primary">{group.label}</h2>
            <div className="space-y-3">{group.items.map((b) => (
              <button key={b.id} onClick={() => setDrawerTask(b.task)} className="w-full rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition-colors hover:bg-surface">
                <div className="flex items-start justify-between gap-3"><div><MonoId value={b.task.id} /><span className="ml-2 text-xs font-bold text-danger-text">{b.severity} Blocker</span></div><TaskStatusPill status={b.status} /></div>
                <p className="mt-2 text-sm font-bold text-primary">{b.reason}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-muted"><span>Owner: {b.owner}</span><span>Age: {b.age}</span><span>SLA Impact: {b.slaImpact}</span></div>
                <p className="mt-2 text-xs text-text-secondary">Resolution: {b.resolutionPath}</p>
              </button>
            ))}</div>
          </section>
        ))}</div>
      )}
      <TaskDetailDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
    </div>
  );
}

export function MyWorkingSessionsPage() {
  const [drawerTask, setDrawerTask] = useState<TaskRecord | null>(null);
  const sessions = useMemo(() => workingSessions.filter((s) => s.participants.includes(currentUser)), []);

  const kpis = useMemo(() => [
    { label: 'Active Sessions', value: String(sessions.length), status: 'info' as const },
    { label: 'Open Actions', value: String(sessions.reduce((sum, s) => sum + s.actions.length, 0)), status: 'warning' as const },
    { label: 'Actions Linked to Tasks', value: String(sessions.flatMap((s) => s.actions).filter((a) => a.state === 'Linked to Task').length), status: 'success' as const },
    { label: 'Actions Needing Conversion', value: String(sessions.flatMap((s) => s.actions).filter((a) => a.state === 'Needs Task').length), status: 'warning' as const },
  ], [sessions]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="My Working Sessions" subtitle="My Work" purpose="Connect meeting and session actions back into governed task records." />
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">{kpis.map((k) => <TaskKpiTile key={k.label} {...k} />)}</section>
      <div className="mt-5 space-y-5">
        {sessions.map((s) => (
          <section key={s.id} className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div><MonoId value={s.id} /><h3 className="mt-1 text-lg font-bold text-primary">{s.title}</h3><p className="text-xs text-text-muted">{s.date} · {s.participants.join(', ')}</p></div>
              {s.linkedTaskId && <button onClick={() => { const t = governedTasks.find((tk) => tk.id === s.linkedTaskId); if (t) setDrawerTask(t); }} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface"><Link2 size={12} className="mr-1 inline" />{s.linkedTaskId}</button>}
            </div>
            {s.decisions.length > 0 && <div className="mt-3 rounded-card border border-info bg-info-surface p-3"><span className="text-xs font-bold text-info-text">Decisions</span><p className="mt-1 text-sm text-text-secondary">{s.decisions.join('; ')}</p></div>}
            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Actions</span>
              {s.actions.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm">
                  <span className="text-primary">{a.text}</span>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-pill px-2 py-0.5 text-xs font-bold ${a.state === 'Linked to Task' ? 'bg-success-surface text-success-text' : a.state === 'Needs Task' ? 'bg-warning-surface text-warning-text' : 'bg-surface text-text-secondary'}`}>{a.state}</span>
                    {a.state === 'Needs Task' && <button onClick={() => toast.success('Convert to task modal opened.')} className="rounded-pill bg-primary px-2 py-0.5 text-xs font-bold text-white">Convert</button>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <TaskDetailDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
    </div>
  );
}
