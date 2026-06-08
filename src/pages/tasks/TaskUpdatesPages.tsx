import { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { governedTasks } from '../../data/taskAreaData';
import { TasksAreaHeader, TaskStatusPill, MonoId, TaskProgressBar, TaskDetailDrawer, AuditTimeline, EmptyState } from '../../components/TaskSharedComponents';

export function ProgressUpdatePage() {
  const [selectedTask, setSelectedTask] = useState('');
  const [summary, setSummary] = useState('');
  const [progress, setProgress] = useState(50);
  const [nextAction, setNextAction] = useState('');
  const [blockerPresent, setBlockerPresent] = useState(false);
  const [timeline, setTimeline] = useState<Array<{ taskId: string; summary: string; progress: number; time: string }>>([]);

  const selected = useMemo(() => governedTasks.find((t) => t.id === selectedTask), [selectedTask]);

  const handleSubmit = () => {
    if (!selectedTask || !summary.trim()) { toast.error('Select a task and provide a progress summary.'); return; }
    setTimeline([{ taskId: selectedTask, summary, progress, time: new Date().toLocaleTimeString() }, ...timeline]);
    toast.success(`Progress update submitted for ${selectedTask}.`);
    setSummary(''); setProgress(50); setNextAction(''); setSelectedTask('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Progress Update" subtitle="Task Updates & Evidence" purpose="Capture meaningful progress against a task with checklist, blocker, and evidence indicators." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Update Composer</h2>
          <div className="mt-4 space-y-4">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task *</span>
              <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Progress Summary *</span>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" placeholder="What was completed? What is in progress?" />
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Progress %</span>
              <div className="mt-2 flex items-center gap-3"><input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="flex-1" /><span className="text-sm font-bold text-primary">{progress}%</span></div>
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Next Action</span>
              <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" />
            </label>
            <label className="flex items-center gap-3 rounded-card border border-border-subtle bg-surface px-4 py-3"><input type="checkbox" checked={blockerPresent} onChange={(e) => setBlockerPresent(e.target.checked)} /><span className="text-sm font-semibold text-primary">Blocker present</span></label>
            <button onClick={handleSubmit} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Submit Update</button>
          </div>
        </section>
        <div className="space-y-5">
          {selected && (
            <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-primary">Task Context</h2>
              <div className="mt-3 space-y-2"><MonoId value={selected.id} /><h3 className="text-sm font-bold text-primary">{selected.title}</h3><p className="text-xs text-text-secondary">{selected.purpose}</p><p className="text-xs text-text-muted">Expected: {selected.expectedOutput}</p><p className="text-xs text-text-muted">Due: {selected.dueDate} · SLA: {selected.slaState}</p></div>
            </section>
          )}
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary">Recent Updates</h2>
            <div className="mt-3 space-y-2">{timeline.length === 0 ? <p className="text-xs text-text-muted">No updates submitted yet.</p> : timeline.map((u, i) => (
              <div key={i} className="rounded-card border border-border-subtle bg-surface p-3"><div className="flex items-center justify-between"><MonoId value={u.taskId} /><span className="text-xs text-text-muted">{u.time}</span></div><p className="mt-1 text-xs text-text-secondary">{u.summary}</p><div className="mt-1 flex items-center gap-2"><TaskProgressBar percent={u.progress} /></div></div>
            ))}</div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function EvidenceUploadPage() {
  const [selectedTask, setSelectedTask] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Completion Note');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [evidenceList, setEvidenceList] = useState<Array<{ id: string; taskId: string; title: string; type: string; submittedBy: string; reviewStatus: string }>>([]);

  const evidenceTypes = ['Completion Note', 'Proof of Work', 'Decision Record', 'Approval Note', 'Tracker Update'];

  const handleSubmit = () => {
    if (!selectedTask || !title.trim()) { toast.error('Select a task and provide evidence title.'); return; }
    setEvidenceList([{ id: `EV-${Date.now().toString().slice(-4)}`, taskId: selectedTask, title, type, submittedBy: 'Amina Hassan', reviewStatus: 'Pending' }, ...evidenceList]);
    toast.success(`Evidence submitted for ${selectedTask}.`);
    setTitle(''); setLink(''); setNote('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Evidence Upload / Link" subtitle="Task Updates & Evidence" purpose="Attach proof of work while keeping DWS.01 as the work context, not document storage." />
      <div className="mb-4 rounded-card border border-border-subtle bg-info-surface p-4 text-xs text-text-secondary">SharePoint/OneDrive may store files. DWS.01 stores evidence links, context, and review status to maintain governed work records.</div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Submit Evidence</h2>
          <div className="mt-4 space-y-4">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task *</span>
              <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Evidence Title *</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" />
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Evidence Type</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none">{evidenceTypes.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Evidence Link</span>
              <input value={link} onChange={(e) => setLink(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" placeholder="SharePoint or OneDrive link" />
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Note</span>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" />
            </label>
            <button onClick={handleSubmit} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Submit Evidence</button>
          </div>
        </section>
        <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-primary">Evidence List</h2>
          <div className="mt-3 space-y-2">{evidenceList.length === 0 ? <p className="text-xs text-text-muted">No evidence submitted yet.</p> : evidenceList.map((ev) => (
            <div key={ev.id} className="rounded-card border border-border-subtle bg-surface p-3"><div className="flex items-center justify-between"><MonoId value={ev.id} /><TaskStatusPill status={ev.reviewStatus} /></div><p className="mt-1 text-xs font-bold text-primary">{ev.title}</p><p className="text-xs text-text-muted">{ev.type} · {ev.submittedBy}</p></div>
          ))}</div>
        </section>
      </div>
    </div>
  );
}

export function CommentThreadPage() {
  const [selectedTask, setSelectedTask] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isDecision, setIsDecision] = useState(false);
  const [threads, setThreads] = useState<Record<string, Array<{ author: string; text: string; isDecision: boolean; timestamp: string }>>>({});

  const selected = useMemo(() => governedTasks.find((t) => t.id === selectedTask), [selectedTask]);
  const thread = threads[selectedTask] || [];

  const handleSubmit = () => {
    if (!selectedTask || !commentText.trim()) { toast.error('Select a task and enter a comment.'); return; }
    const newComment = { author: 'Amina Hassan', text: commentText, isDecision, timestamp: new Date().toLocaleString() };
    setThreads({ ...threads, [selectedTask]: [newComment, ...(threads[selectedTask] || [])] });
    toast.success(isDecision ? 'Decision recorded.' : 'Comment added.');
    setCommentText(''); setIsDecision(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Comment Thread" subtitle="Task Updates & Evidence" purpose="Keep task-specific collaboration and decisions attached to the work record." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task</span>
            <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
          </label>
          <div className="mt-5 space-y-3">
            {thread.length === 0 && !selectedTask ? <EmptyState title="Select a task" description="Choose a task to view and add comments." /> : thread.length === 0 ? <p className="text-sm text-text-muted">No comments yet. Be the first to add one.</p> : thread.map((c, i) => (
              <div key={i} className={`rounded-card border p-4 ${c.isDecision ? 'border-info bg-info-surface' : 'border-border-subtle bg-surface'}`}>
                <div className="flex items-center justify-between"><span className="text-sm font-bold text-primary">{c.author}</span><span className="text-xs text-text-muted">{c.timestamp}</span></div>
                <p className="mt-1 text-sm text-text-secondary">{c.text}</p>
                {c.isDecision && <span className="mt-2 inline-flex items-center gap-1 rounded-pill bg-info px-2 py-0.5 text-xs font-bold text-white"><CheckCircle2 size={10} />Decision</span>}
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-border-subtle pt-5">
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={3} className="w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" placeholder="Add a comment or decision..." />
            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isDecision} onChange={(e) => setIsDecision(e.target.checked)} /><span className="text-primary">Mark as decision</span></label>
              <button onClick={handleSubmit} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Submit</button>
            </div>
          </div>
        </section>
        <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-primary">Thread Info</h2>
          {selected && <div className="mt-3 space-y-2"><MonoId value={selected.id} /><h3 className="text-sm font-bold text-primary">{selected.title}</h3><p className="text-xs text-text-muted">{selected.purpose}</p></div>}
          <div className="mt-4 rounded-card border border-border-subtle bg-surface p-3"><p className="text-xs leading-5 text-text-secondary">Comments, mentions, decisions, and follow-ups remain attached to the task record, not scattered across chat.</p></div>
        </section>
      </div>
    </div>
  );
}

export function BlockerUpdatePage() {
  const [selectedTask, setSelectedTask] = useState('');
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [owner, setOwner] = useState('');
  const [impact, setImpact] = useState('');
  const [resolution, setResolution] = useState('');
  const [blockerList, setBlockerList] = useState<Array<{ id: string; taskId: string; reason: string; severity: string; owner: string; status: string }>>([]);

  const handleSubmit = () => {
    if (!selectedTask || !reason.trim()) { toast.error('Select a task and provide blocker reason.'); return; }
    setBlockerList([{ id: `BLK-${Date.now().toString().slice(-4)}`, taskId: selectedTask, reason, severity, owner, status: 'Open' }, ...blockerList]);
    toast.success(`Blocker raised for ${selectedTask}.`);
    setReason(''); setOwner(''); setImpact(''); setResolution('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Blocker Update" subtitle="Task Updates & Evidence" purpose="Raise or update blockers with owner, impact, and resolution path." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Raise Blocker</h2>
          <div className="mt-4 space-y-4">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task *</span>
              <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
            </label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Blocker Reason *</span>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" />
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Severity</span><select value={severity} onChange={(e) => setSeverity(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Blocker Owner</span><input value={owner} onChange={(e) => setOwner(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
            </div>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Impact</span><input value={impact} onChange={(e) => setImpact(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Proposed Resolution Path</span><textarea value={resolution} onChange={(e) => setResolution(e.target.value)} rows={2} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" /></label>
            <button onClick={handleSubmit} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Submit Blocker</button>
          </div>
        </section>
        <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-primary">Existing Blockers</h2>
          <div className="mt-3 space-y-2">{blockerList.length === 0 ? <p className="text-xs text-text-muted">No blockers raised yet.</p> : blockerList.map((b) => (
            <div key={b.id} className="rounded-card border border-border-subtle bg-surface p-3"><div className="flex items-center justify-between"><MonoId value={b.taskId} /><span className={`rounded-pill px-2 py-0.5 text-xs font-bold ${b.status === 'Open' ? 'bg-danger-surface text-danger-text' : 'bg-success-surface text-success-text'}`}>{b.status}</span></div><p className="mt-1 text-xs text-text-secondary">{b.reason}</p><p className="text-xs text-text-muted">Owner: {b.owner} · {b.severity}</p></div>
          ))}</div>
        </section>
      </div>
    </div>
  );
}

export function TaskHistoryTimelinePage() {
  const [selectedTask, setSelectedTask] = useState('');
  const selected = useMemo(() => governedTasks.find((t) => t.id === selectedTask), [selectedTask]);

  const eventTypes = ['All', 'Created', 'Updated', 'Blocked', 'Comment', 'Decision', 'Returned'];
  const [filterType, setFilterType] = useState('All');

  const filteredEvents = useMemo(() => {
    if (!selected) return [];
    if (filterType === 'All') return selected.auditEvents;
    return selected.auditEvents.filter((e) => e.eventType === filterType);
  }, [selected, filterType]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Task History Timeline" subtitle="Task Updates & Evidence" purpose="Complete task audit and execution history with event type filtering." />
      <label className="block max-w-md"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task</span>
        <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
      </label>
      {selected && (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2">{eventTypes.map((et) => <button key={et} onClick={() => setFilterType(et)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filterType === et ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{et}</button>)}</div>
            <AuditTimeline events={filteredEvents} />
          </section>
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary">Task Summary</h2>
            <div className="mt-3 space-y-2"><MonoId value={selected.id} /><h3 className="text-sm font-bold text-primary">{selected.title}</h3><p className="text-xs text-text-muted">Status: {selected.status}</p><p className="text-xs text-text-muted">Owner: {selected.owner}</p><p className="text-xs text-text-muted">Last Update: {selected.lastUpdateAt}</p></div>
          </section>
        </div>
      )}
    </div>
  );
}
