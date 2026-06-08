import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Clock, ChevronRight, FileText, MessageSquare, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { TaskRecord, TaskPriority, TaskStatus, SlaState, ClosureQuality, Blocker, EvidenceItem, AuditEvent, ChecklistItem, TaskComment } from '../data/taskAreaData';

export function TasksAreaHeader({ title, subtitle, purpose, actionLabel, onAction }: { title: string; subtitle: string; purpose: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{subtitle}</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{purpose}</p>
      </div>
      {actionLabel && onAction && (
        <button onClick={onAction} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-navy-800">{actionLabel}</button>
      )}
    </header>
  );
}

export function TaskKpiTile({ label, value, status, onClick }: { label: string; value: string; status: 'success' | 'warning' | 'danger' | 'info'; onClick?: () => void }) {
  const dot = status === 'success' ? 'bg-success' : status === 'warning' ? 'bg-warning' : status === 'danger' ? 'bg-danger' : 'bg-info';
  return (
    <button onClick={onClick} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition-colors hover:bg-surface">
      <div className="text-sm font-semibold text-text-muted">{label}</div>
      <div className="mt-2 text-3xl font-bold text-primary">{value}</div>
      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-text-secondary">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {label}
      </div>
    </button>
  );
}

export function TaskStatusPill({ status }: { status: string }) {
  const config: Record<string, string> = {
    'Not Started': 'bg-surface text-text-secondary',
    'In Progress': 'bg-info-surface text-info-text',
    'Blocked': 'bg-danger-surface text-danger-text',
    'Waiting Review': 'bg-warning-surface text-warning-text',
    'Returned': 'bg-warning-surface text-warning-text',
    'Completed': 'bg-success-surface text-success-text',
    'Overdue': 'bg-danger text-white',
  };
  return <span className={`inline-flex rounded-pill px-3 py-1 text-xs font-bold ${config[status] || 'bg-surface text-text-secondary'}`}>{status}</span>;
}

export function PriorityChip({ priority }: { priority: TaskPriority }) {
  const config: Record<string, string> = {
    Critical: 'bg-danger text-white',
    High: 'bg-danger-surface text-danger-text',
    Medium: 'bg-warning-surface text-warning-text',
    Low: 'bg-success-surface text-success-text',
  };
  return <span className={`inline-flex rounded-pill px-3 py-1 text-xs font-bold ${config[priority]}`}>{priority}</span>;
}

export function SlaChip({ sla }: { sla: SlaState }) {
  const config: Record<string, string> = {
    'On Track': 'bg-success-surface text-success-text',
    'At Risk': 'bg-warning-surface text-warning-text',
    'Breached': 'bg-danger text-white',
    'Completed': 'bg-success-surface text-success-text',
  };
  return <span className={`inline-flex rounded-pill px-3 py-1 text-xs font-bold ${config[sla]}`}>{sla}</span>;
}

export function ClosureQualityBadge({ quality }: { quality: ClosureQuality }) {
  const config: Record<string, string> = {
    'Not Ready': 'bg-surface text-text-secondary',
    'Needs Evidence': 'bg-danger-surface text-danger-text',
    'Review Pending': 'bg-warning-surface text-warning-text',
    'Accepted': 'bg-success-surface text-success-text',
    'Returned': 'bg-warning-surface text-warning-text',
  };
  return <span className={`inline-flex rounded-pill px-3 py-1 text-xs font-bold ${config[quality]}`}>{quality}</span>;
}

export function MonoId({ value }: { value: string }) {
  return <span className="font-mono text-xs font-bold text-primary">{value}</span>;
}

export function OwnerBadge({ name, role }: { name: string; role?: string }) {
  const initials = name.split(' ').map((p) => p[0]).join('').slice(0, 2);
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-primary">{initials}</span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-primary">{name}</span>
        {role && <span className="block truncate text-xs text-text-muted">{role}</span>}
      </span>
    </div>
  );
}

export function TaskProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
        <div className={`h-full rounded-full ${percent >= 80 ? 'bg-success' : percent >= 40 ? 'bg-info' : 'bg-warning'}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs font-bold text-primary">{percent}%</span>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-card border border-border-subtle bg-white p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted"><FileText size={20} /></div>
      <h3 className="text-lg font-bold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </div>
  );
}

export function ConfirmActionModal({ title, description, onConfirm, onCancel }: { title: string; description: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[230] bg-primary/20" onClick={onCancel} />
      <section className="fixed left-1/2 top-1/2 z-[240] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Cancel</button>
          <button onClick={onConfirm} className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white">Confirm</button>
        </div>
      </section>
    </>
  );
}

export function InlineValidationMessage({ text }: { text: string }) {
  return <p className="mt-1 text-xs font-semibold text-danger-text">{text}</p>;
}

export function AuditTimeline({ events }: { events: AuditEvent[] }) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="flex gap-3">
          <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-info" />
          <div className="text-sm text-text-secondary">
            <span className="font-semibold text-primary">{event.description}</span>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
              <span>{event.actor}</span>
              <span>·</span>
              <span className="font-mono">{event.eventType}</span>
              <span>·</span>
              <span>{new Date(event.timestamp).toLocaleDateString()}</span>
              {event.relatedObjectId && <><span>·</span><MonoId value={event.relatedObjectId} /></>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function KnowledgeReferenceList({ references }: { references: string[] }) {
  if (!references.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {references.map((ref) => (
        <button key={ref} onClick={() => toast.info(`${ref} opened in knowledge context.`)} className="inline-flex items-center gap-1.5 rounded-pill border border-border-subtle bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-white hover:text-primary">
          <ShieldCheck size={12} />{ref}
        </button>
      ))}
    </div>
  );
}

export function TaskDetailDrawer({ task, onClose }: { task: TaskRecord | null; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState('overview');
  if (!task) return null;

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'blockers', label: 'Blockers' },
    { id: 'comments', label: 'Comments' },
    { id: 'audit', label: 'Audit' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[200] flex h-screen w-full max-w-2xl flex-col border-l border-border-default bg-white shadow-xl">
        <div className="sticky top-0 z-10 border-b border-border-subtle bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><MonoId value={task.id} /><TaskStatusPill status={task.status} /><PriorityChip priority={task.priority} /><SlaChip sla={task.slaState} /></div>
              <h2 className="mt-2 text-xl font-bold text-primary">{task.title}</h2>
              <div className="mt-2 flex items-center gap-3"><OwnerBadge name={task.owner} role={task.ownerRole} /><span className="text-xs text-text-muted">Due {task.dueDate}</span></div>
            </div>
            <button onClick={onClose} aria-label="Close drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={20} /></button>
          </div>
          <div className="mt-4 flex gap-1 overflow-x-auto border-b border-border-subtle">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} className={`whitespace-nowrap px-4 py-3 text-sm font-bold ${activeSection === s.id ? 'border-b-2 border-info text-info-text' : 'text-text-secondary hover:text-primary'}`}>{s.label}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === 'overview' && (
            <div className="space-y-5">
              <DrawerCard title="Purpose"><p className="text-sm leading-6 text-text-secondary">{task.purpose}</p></DrawerCard>
              <DrawerCard title="Expected Output"><p className="text-sm leading-6 text-text-secondary">{task.expectedOutput}</p></DrawerCard>
              <DrawerCard title="Progress"><TaskProgressBar percent={task.progressPercent} /><p className="mt-2 text-xs text-text-muted">Last updated {task.lastUpdateAt}</p></DrawerCard>
              <DrawerCard title="Next Action"><p className="text-sm leading-6 text-text-secondary">{task.nextAction}</p></DrawerCard>
              {task.linkedKnowledge.length > 0 && <DrawerCard title="Linked Knowledge"><KnowledgeReferenceList references={task.linkedKnowledge} /></DrawerCard>}
              {task.linkedRequestId && <DrawerCard title="Linked Request"><span className="font-mono text-xs text-primary">{task.linkedRequestId}</span></DrawerCard>}
              {task.linkedWorkingSessionId && <DrawerCard title="Linked Working Session"><span className="font-mono text-xs text-primary">{task.linkedWorkingSessionId}</span></DrawerCard>}
              <DrawerCard title="Closure Quality"><ClosureQualityBadge quality={task.closureQuality} /></DrawerCard>
            </div>
          )}
          {activeSection === 'checklist' && (
            <div className="space-y-2">
              {task.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.done ? 'bg-success' : 'bg-warning'}`} />
                  <span className={item.done ? 'text-text-muted line-through' : 'text-primary'}>{item.label}</span>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'evidence' && (
            <div className="space-y-3">
              {task.evidenceItems.length === 0 ? <p className="text-sm text-text-muted">No evidence attached yet.</p> : task.evidenceItems.map((ev) => (
                <div key={ev.id} className="rounded-card border border-border-subtle bg-surface p-4">
                  <div className="flex items-center justify-between"><MonoId value={ev.id} /><TaskStatusPill status={ev.reviewStatus} /></div>
                  <div className="mt-2 text-sm font-bold text-primary">{ev.title}</div>
                  <div className="mt-1 text-xs text-text-muted">{ev.type} · Submitted by {ev.submittedBy} · {ev.submittedAt}</div>
                  {ev.reviewerNote && <div className="mt-2 text-xs text-text-secondary">{ev.reviewerNote}</div>}
                </div>
              ))}
            </div>
          )}
          {activeSection === 'blockers' && (
            <div className="space-y-3">
              {task.blockers.length === 0 ? <p className="text-sm text-text-muted">No blockers recorded.</p> : task.blockers.map((blk) => (
                <div key={blk.id} className="rounded-card border border-border-subtle bg-surface p-4">
                  <div className="flex items-center justify-between"><span className="text-xs font-bold text-danger-text">{blk.severity} Blocker</span><TaskStatusPill status={blk.status} /></div>
                  <p className="mt-2 text-sm text-primary">{blk.reason}</p>
                  <div className="mt-2 text-xs text-text-muted">Owner: {blk.owner} · Age: {blk.age} · SLA Impact: {blk.slaImpact}</div>
                  <p className="mt-2 text-xs text-text-secondary">Resolution: {blk.resolutionPath}</p>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'comments' && (
            <div className="space-y-3">
              {task.comments.map((c) => (
                <div key={c.id} className={`rounded-card border p-4 ${c.isDecision ? 'border-info bg-info-surface' : 'border-border-subtle bg-surface'}`}>
                  <div className="flex items-center justify-between"><span className="text-sm font-bold text-primary">{c.author}</span><span className="text-xs text-text-muted">{new Date(c.timestamp).toLocaleDateString()}</span></div>
                  <p className="mt-1 text-sm text-text-secondary">{c.text}</p>
                  {c.isDecision && <span className="mt-2 inline-flex items-center gap-1 rounded-pill bg-info px-2 py-0.5 text-xs font-bold text-white"><CheckCircle2 size={10} />Decision</span>}
                </div>
              ))}
              {task.decisions.map((d) => (
                <div key={d.id} className="rounded-card border border-info bg-info-surface p-4">
                  <div className="flex items-center justify-between"><span className="text-sm font-bold text-primary">{d.author}</span><span className="text-xs text-text-muted">{new Date(d.timestamp).toLocaleDateString()}</span></div>
                  <p className="mt-1 text-sm text-text-secondary">{d.text}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-pill bg-info px-2 py-0.5 text-xs font-bold text-white"><CheckCircle2 size={10} />Decision</span>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'audit' && <AuditTimeline events={task.auditEvents} />}
        </div>
        <div className="flex-shrink-0 border-t border-border-subtle bg-white px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {['Add Update', 'Add Evidence', 'Raise Blocker', 'Request Closure Review'].map((action) => (
              <button key={action} onClick={() => toast.success(`${action} action recorded for ${task.id}.`)} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">{action}</button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

function DrawerCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm"><h3 className="text-base font-bold text-primary">{title}</h3><div className="mt-3">{children}</div></section>;
}
