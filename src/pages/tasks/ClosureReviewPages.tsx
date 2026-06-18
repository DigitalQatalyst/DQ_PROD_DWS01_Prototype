import { useState, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { governedTasks } from '../../data/taskAreaData';
import { TasksAreaHeader, TaskStatusPill, PriorityChip, SlaChip, MonoId, ClosureQualityBadge, ConfirmActionModal } from '../../components/TaskSharedComponents';

export function RequestClosureReviewPage() {
  const [selectedTask, setSelectedTask] = useState('');
  const [closureNote, setClosureNote] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const selected = useMemo(() => governedTasks.find((t) => t.id === selectedTask), [selectedTask]);

  const readiness = useMemo(() => {
    if (!selected) return { score: 0, items: [] as Array<{ label: string; ready: boolean }> };
    const items = [
      { label: 'Output statement provided', ready: Boolean(selected.expectedOutput.trim()) },
      { label: 'Checklist complete or explained', ready: selected.checklist.length > 0 && selected.checklist.every((c) => c.done) },
      { label: 'Evidence attached', ready: selected.evidenceRequired ? selected.evidenceItems.length > 0 : true },
      { label: 'Blockers resolved or accepted', ready: selected.blockers.every((b) => b.status === 'Resolved') },
      { label: 'Closure note added', ready: Boolean(closureNote.trim()) },
    ];
    const readyCount = items.filter((i) => i.ready).length;
    return { score: Math.round((readyCount / items.length) * 100), items };
  }, [selected, closureNote]);

  const canSubmit = selected && readiness.score >= 80 && reviewer.trim();

  const handleSubmit = () => {
    if (!canSubmit) { toast.error('Complete all readiness items before requesting review.'); return; }
    setShowConfirm(true);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Request Closure Review" subtitle="Closure Reviews" purpose="Request review only when output, checklist, evidence, blockers, and closure note are ready." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task</span>
            <select value={selectedTask} onChange={(e) => { setSelectedTask(e.target.value); setClosureNote(''); setReviewer(''); setEvidenceSummary(''); }} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
          </label>
          {selected && (
            <div className="mt-5 space-y-4">
              <div className="rounded-card border border-border-subtle bg-surface p-4">
                <h3 className="text-sm font-bold text-primary">{selected.title}</h3>
                <p className="mt-1 text-xs text-text-secondary">{selected.purpose}</p>
                <div className="mt-2 flex flex-wrap gap-2"><TaskStatusPill status={selected.status} /><PriorityChip priority={selected.priority} /><SlaChip sla={selected.slaState} /></div>
                <div className="mt-3"><span className="text-xs text-text-muted">Expected Output:</span><p className="text-xs text-text-secondary">{selected.expectedOutput}</p></div>
                <div className="mt-2"><span className="text-xs text-text-muted">Evidence: {selected.evidenceItems.length} item(s) attached</span></div>
                <div className="mt-2"><span className="text-xs text-text-muted">Blockers: {selected.blockers.filter((b) => b.status !== 'Resolved').length} active</span></div>
              </div>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Closure Note *</span>
                <textarea value={closureNote} onChange={(e) => setClosureNote(e.target.value)} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" placeholder="Describe the completed work and closure rationale..." />
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Reviewer *</span>
                  <input value={reviewer} onChange={(e) => setReviewer(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" />
                </label>
                <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Evidence Summary</span>
                  <input value={evidenceSummary} onChange={(e) => setEvidenceSummary(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" />
                </label>
              </div>
              <button disabled={!canSubmit} onClick={handleSubmit} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Request Closure Review</button>
            </div>
          )}
        </section>
        {selected && (
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-primary">Closure Readiness</h2>
            <div className="mt-4 flex items-center gap-3"><span className="text-3xl font-bold text-primary">{readiness.score}%</span><span className="text-xs text-text-muted">readiness score</span></div>
            <div className="mt-4 space-y-2">
              {readiness.items.map((item) => (
                <div key={item.label} className={`flex items-center gap-3 rounded-card border p-3 ${item.ready ? 'border-success bg-success-surface' : 'border-border-subtle bg-surface'}`}>
                  {item.ready ? <CheckCircle2 size={14} className="text-success" /> : <AlertTriangle size={14} className="text-warning" />}
                  <span className="text-xs font-semibold text-primary">{item.label}</span>
                </div>
              ))}
            </div>
            {readiness.score < 80 && <div className="mt-4 rounded-card border border-danger bg-danger-surface p-3"><p className="text-xs font-bold text-danger-text">Complete all readiness items before requesting review.</p></div>}
          </section>
        )}
      </div>
      {showConfirm && <ConfirmActionModal title="Request Closure Review?" description={`Submit ${selectedTask} for closure review. The reviewer will assess output, evidence, and checklist completion.`} onConfirm={() => { toast.success(`Closure review requested for ${selectedTask}.`); setShowConfirm(false); setSelectedTask(''); }} onCancel={() => setShowConfirm(false)} />}
    </div>
  );
}

export function ClosureChecklistPage() {
  const [selectedTask, setSelectedTask] = useState('');
  const selected = useMemo(() => governedTasks.find((t) => t.id === selectedTask), [selectedTask]);

  const closureChecks = useMemo(() => {
    if (!selected) return [];
    return [
      { group: 'Output', items: [
        { label: 'Purpose statement provided', ready: Boolean(selected.purpose.trim()), required: true },
        { label: 'Expected output defined', ready: Boolean(selected.expectedOutput.trim()), required: true },
        { label: 'Output matches expected output', ready: selected.progressPercent >= 80, required: true },
      ]},
      { group: 'Evidence', items: [
        { label: 'Evidence attached', ready: selected.evidenceItems.length > 0, required: selected.evidenceRequired },
        { label: 'Evidence reviewed', ready: selected.evidenceItems.some((e) => e.reviewStatus === 'Accepted'), required: selected.evidenceRequired },
      ]},
      { group: 'Updates', items: [
        { label: 'Recent progress update', ready: Boolean(selected.lastUpdateAt), required: true },
        { label: 'Next action documented', ready: Boolean(selected.nextAction.trim()), required: false },
      ]},
      { group: 'Blockers', items: [
        { label: 'All blockers resolved', ready: selected.blockers.every((b) => b.status === 'Resolved'), required: true },
      ]},
      { group: 'Review', items: [
        { label: 'Closure note added', ready: selected.closureQuality !== 'Not Ready', required: true },
        { label: 'Reviewer assigned', ready: selected.auditEvents.some((e) => e.eventType === 'Returned' || e.eventType === 'Decision'), required: false },
      ]},
    ];
  }, [selected]);

  const totalItems = closureChecks.flatMap((g) => g.items);
  const readyCount = totalItems.filter((i) => i.ready).length;
  const requiredReady = totalItems.filter((i) => i.required && i.ready).length;
  const requiredTotal = totalItems.filter((i) => i.required).length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Closure Checklist" subtitle="Closure Reviews" purpose="Validate closure requirements before review with grouped checklist and readiness score." />
      <label className="block max-w-md"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task</span>
        <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
      </label>
      {selected && (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {closureChecks.map((group) => (
              <section key={group.group} className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold text-primary">{group.group}</h2>
                <div className="mt-3 space-y-2">{group.items.map((item) => (
                  <div key={item.label} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${item.ready ? 'border-success bg-success-surface' : 'border-border-subtle bg-surface'}`}>
                    <div className="flex items-center gap-2">{item.ready ? <CheckCircle2 size={14} className="text-success" /> : <XCircle size={14} className="text-text-muted" />}<span className={item.ready ? 'text-success-text' : 'text-primary'}>{item.label}</span>{item.required && <span className="rounded-pill bg-danger-surface px-1.5 py-0.5 text-[10px] font-bold text-danger-text">Required</span>}</div>
                  </div>
                ))}</div>
              </section>
            ))}
          </div>
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-primary">Closure Readiness</h2>
            <div className="mt-4 flex items-center gap-3"><span className="text-3xl font-bold text-primary">{Math.round((readyCount / totalItems.length) * 100)}%</span><span className="text-xs text-text-muted">overall</span></div>
            <div className="mt-2 flex items-center gap-3"><span className="text-lg font-bold text-primary">{requiredReady}/{requiredTotal}</span><span className="text-xs text-text-muted">required items</span></div>
            <div className="mt-4 space-y-2">
              {closureChecks.map((group) => {
                const groupReady = group.items.filter((i) => i.ready).length;
                return <div key={group.group} className="flex items-center justify-between rounded-card border border-border-subtle bg-surface px-3 py-2"><span className="text-xs font-semibold text-primary">{group.group}</span><span className="text-xs text-text-muted">{groupReady}/{group.items.length}</span></div>;
              })}
            </div>
            {requiredReady < requiredTotal && (
              <div className="mt-4 rounded-card border border-danger bg-danger-surface p-3">
                <p className="text-xs font-bold text-danger-text">Fix missing items before requesting closure review.</p>
                <div className="mt-2 space-y-1">{totalItems.filter((i) => i.required && !i.ready).map((i) => <p key={i.label} className="text-xs text-text-secondary">• {i.label}</p>)}</div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export function EvidenceReviewPage() {
  const [selectedTask, setSelectedTask] = useState('');
  const selected = useMemo(() => governedTasks.find((t) => t.id === selectedTask), [selectedTask]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Evidence Review" subtitle="Closure Reviews" purpose="Reviewer checks whether evidence proves expected output." />
      <label className="block max-w-md"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task</span>
        <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
      </label>
      {selected && (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary">Expected Output</h2>
            <p className="mt-2 text-sm text-text-secondary">{selected.expectedOutput}</p>
            <h2 className="mt-4 text-sm font-bold text-primary">Checklist</h2>
            <div className="mt-2 space-y-1">{selected.checklist.map((c, i) => <div key={i} className="flex items-center gap-2 text-xs"><span className={`h-2 w-2 rounded-full ${c.done ? 'bg-success' : 'bg-warning'}`} /><span className={c.done ? 'text-text-muted' : 'text-primary'}>{c.label}</span></div>)}</div>
          </section>
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary">Submitted Evidence</h2>
            <div className="mt-3 space-y-3">{selected.evidenceItems.length === 0 ? <p className="text-xs text-text-muted">No evidence submitted.</p> : selected.evidenceItems.map((ev) => (
              <div key={ev.id} className="rounded-card border border-border-subtle bg-surface p-4">
                <div className="flex items-center justify-between"><MonoId value={ev.id} /><TaskStatusPill status={ev.reviewStatus} /></div>
                <h3 className="mt-2 text-sm font-bold text-primary">{ev.title}</h3>
                <p className="mt-1 text-xs text-text-muted">{ev.type} · Submitted by {ev.submittedBy}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => toast.success(`Evidence ${ev.id} accepted.`)} className="rounded-button bg-success px-3 py-1.5 text-xs font-bold text-white">Accept</button>
                  <button onClick={() => toast.info(`Evidence ${ev.id} returned for more detail.`)} className="rounded-button border border-border-default px-3 py-1.5 text-xs font-bold text-primary hover:bg-surface">Request More</button>
                  <button onClick={() => toast.warning(`Evidence ${ev.id} returned.`)} className="rounded-button border border-danger px-3 py-1.5 text-xs font-bold text-danger-text hover:bg-danger-surface">Return</button>
                </div>
              </div>
            ))}</div>
          </section>
        </div>
      )}
    </div>
  );
}

export function ReturnForReworkPage() {
  const [selectedTask, setSelectedTask] = useState('');
  const [reason, setReason] = useState('');
  const [corrections, setCorrections] = useState('');
  const [reworkDueDate, setReworkDueDate] = useState('');
  const [notifyOwner, setNotifyOwner] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const selected = useMemo(() => governedTasks.find((t) => t.id === selectedTask), [selectedTask]);
  const commonReasons = ['Missing evidence', 'Unclear output', 'Incomplete checklist', 'Unresolved blocker', 'Weak closure note'];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Return for Rework" subtitle="Closure Reviews" purpose="Send incomplete work back with clear correction instructions." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task</span>
            <select value={selectedTask} onChange={(e) => { setSelectedTask(e.target.value); setReason(''); setCorrections(''); setReworkDueDate(''); }} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
          </label>
          {selected && (
            <div className="mt-5 space-y-4">
              <div className="rounded-card border border-border-subtle bg-surface p-4">
                <div className="flex items-center gap-2"><MonoId value={selected.id} /><TaskStatusPill status={selected.status} /><ClosureQualityBadge quality={selected.closureQuality} /></div>
                <h3 className="mt-2 text-sm font-bold text-primary">{selected.title}</h3>
                <p className="mt-1 text-xs text-text-muted">Owner: {selected.owner}</p>
                <div className="mt-2"><span className="text-xs text-text-muted">Evidence State: {selected.evidenceItems.length} item(s)</span></div>
              </div>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Common Reasons</span>
                <div className="mt-2 flex flex-wrap gap-2">{commonReasons.map((r) => <button key={r} onClick={() => setReason(r)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${reason === r ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{r}</button>)}</div>
              </label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Reason for Return</span>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" />
              </label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Required Corrections</span>
                <textarea value={corrections} onChange={(e) => setCorrections(e.target.value)} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" placeholder="List specific corrections needed..." />
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Rework Due Date</span>
                  <input value={reworkDueDate} onChange={(e) => setReworkDueDate(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" />
                </label>
                <label className="flex items-center gap-3 rounded-card border border-border-subtle bg-surface px-4 py-3 mt-6"><input type="checkbox" checked={notifyOwner} onChange={(e) => setNotifyOwner(e.target.checked)} /><span className="text-sm font-semibold text-primary">Notify owner</span></label>
              </div>
              <button disabled={!reason.trim() || !selectedTask} onClick={() => setShowConfirm(true)} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Return for Rework</button>
            </div>
          )}
        </section>
        <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Return Summary</h2>
          {selected && (
            <div className="mt-4 space-y-3">
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Task</span><p className="mt-1 text-xs text-primary">{selected.id} — {selected.title}</p></div>
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Owner</span><p className="mt-1 text-xs text-primary">{selected.owner}</p></div>
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Closure Issue</span><p className="mt-1 text-xs text-secondary">{reason || 'Not specified'}</p></div>
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Evidence State</span><p className="mt-1 text-xs text-secondary">{selected.evidenceItems.length} item(s) attached</p></div>
            </div>
          )}
        </section>
      </div>
      {showConfirm && <ConfirmActionModal title="Return for Rework?" description={`Return ${selectedTask} to ${selected?.owner} for correction. They will be notified.`} onConfirm={() => { toast.success(`${selectedTask} returned for rework.`); setShowConfirm(false); setSelectedTask(''); }} onCancel={() => setShowConfirm(false)} />}
    </div>
  );
}

export function CloseTaskPage() {
  const [selectedTask, setSelectedTask] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const selected = useMemo(() => governedTasks.find((t) => t.id === selectedTask), [selectedTask]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Close Task" subtitle="Closure Reviews" purpose="Finalize task closure with auditable output and reviewer decision." />
      <label className="block max-w-md"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Task</span>
        <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option value="">Choose a task</option>{governedTasks.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}</select>
      </label>
      {selected && (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary">Closure Decision Panel</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Expected Output</span><p className="mt-1 text-xs text-text-secondary">{selected.expectedOutput}</p></div>
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Submitted Output</span><p className="mt-1 text-xs text-text-secondary">{selected.progressPercent >= 80 ? 'Output meets expected criteria.' : 'Output may not fully meet expected criteria.'}</p></div>
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Checklist Completion</span><p className="mt-1 text-xs text-text-secondary">{selected.checklist.filter((c) => c.done).length}/{selected.checklist.length} items complete</p></div>
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Evidence Review</span><p className="mt-1 text-xs text-text-secondary">{selected.evidenceItems.filter((e) => e.reviewStatus === 'Accepted').length}/{selected.evidenceItems.length} accepted</p></div>
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Blocker Status</span><p className="mt-1 text-xs text-text-secondary">{selected.blockers.filter((b) => b.status === 'Resolved').length}/{selected.blockers.length} resolved</p></div>
              <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Closure Quality</span><div className="mt-1"><ClosureQualityBadge quality={selected.closureQuality} /></div></div>
            </div>
          </section>
          <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-primary">Actions</h2>
            <div className="mt-4 space-y-3">
              <button onClick={() => setShowConfirm(true)} className="w-full rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Close Task</button>
              <button onClick={() => toast.info(`Return for rework modal opened for ${selectedTask}.`)} className="w-full rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Return for Rework</button>
              <button onClick={() => toast.info(`Request more evidence for ${selectedTask}.`)} className="w-full rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Request More Evidence</button>
            </div>
            <div className="mt-5 rounded-card border border-info bg-info-surface p-4"><p className="text-xs leading-5 text-text-secondary">Closing a task creates an audit event in the task history timeline. The closure quality state changes to Accepted.</p></div>
          </section>
        </div>
      )}
      {showConfirm && <ConfirmActionModal title="Close this task?" description={`Closing ${selectedTask} will mark it as Completed, change closure quality to Accepted, and create an audit event.`} onConfirm={() => { toast.success(`${selectedTask} closed successfully.`); setShowConfirm(false); setSelectedTask(''); }} onCancel={() => setShowConfirm(false)} />}
    </div>
  );
}
