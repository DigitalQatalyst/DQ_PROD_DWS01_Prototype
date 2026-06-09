import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Edit3,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  MoreHorizontal,
  Save,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { DqButton, DqIconButton } from '../components/DqButton';
import { DqBadge, DueDateBadge, PriorityBadge, StatusBadge, TaskTypeBadge } from '../components/DqBadge';
import { EditableChecklist, EditableChipList, EditableField, EditableSelect, EditableTextarea } from '../components/EditableFields';
import { getAssignedTask } from '../mocks/assignedTasks.mock';
import type { AssignedTask, AssignedTaskEvidence } from '../types/assignedTask';

type ValidationErrors = Partial<Record<'title' | 'businessContext' | 'purpose' | 'method' | 'expectedOutcome' | 'dueDate' | 'owner', string>>;

const cloneTask = (task: AssignedTask) => JSON.parse(JSON.stringify(task)) as AssignedTask;

export function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const sourceTask = useMemo(() => getAssignedTask(taskId), [taskId]);
  const [task, setTask] = useState<AssignedTask | null>(() => sourceTask ? cloneTask(sourceTask) : null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [comment, setComment] = useState('');

  useEffect(() => {
    setTask(sourceTask ? cloneTask(sourceTask) : null);
    setErrors({});
    setComment('');
  }, [sourceTask]);

  if (!sourceTask || !task) {
    return <TaskNotFound onBack={() => navigate('/tasks/my-work/assigned-tasks')} />;
  }

  const updateTask = (recipe: (current: AssignedTask) => AssignedTask) => {
    setTask((current) => current ? recipe(current) : current);
  };

  const validate = () => {
    const nextErrors: ValidationErrors = {};
    if (!task.title.trim()) nextErrors.title = 'Title is required.';
    if (!task.details.businessContext.trim()) nextErrors.businessContext = 'Business Context is required.';
    if (!task.details.purpose.trim()) nextErrors.purpose = 'Purpose statement is required.';
    if (!task.details.method.trim()) nextErrors.method = 'Method / Approach is required.';
    if (!task.details.expectedOutcome.trim()) nextErrors.expectedOutcome = 'Expected Outcome is required.';
    if (!task.details.targetDueDate.trim()) nextErrors.dueDate = 'Due Date is required.';
    if (!task.details.owner.trim()) nextErrors.owner = 'Owner is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveChanges = () => {
    if (!validate()) {
      toast.error('Fix required fields before saving.');
      return;
    }
    toast.success('Task changes saved');
  };

  const addEvidence = (kind: 'upload' | 'link') => {
    const newEvidence: AssignedTaskEvidence = {
      id: `evidence-${Date.now()}`,
      type: kind === 'upload' ? 'File' : 'Link',
      title: kind === 'upload' ? 'Uploaded_validation_evidence.pdf' : 'Supporting evidence link',
      description: kind === 'upload' ? 'Mock uploaded evidence added in-memory' : 'Mock evidence link added in-memory',
      status: kind === 'upload' ? 'Uploaded' : 'Linked',
      addedBy: task.details.owner,
      date: '15 May 2025',
    };
    updateTask((current) => ({ ...current, details: { ...current.details, evidence: [newEvidence, ...current.details.evidence] } }));
    toast.success(kind === 'upload' ? 'Evidence uploaded' : 'Evidence link added');
  };

  const postUpdate = () => {
    if (!comment.trim()) return;
    updateTask((current) => ({
      ...current,
      details: {
        ...current.details,
        activity: [{ id: `activity-${Date.now()}`, actor: current.details.owner, note: comment.trim(), timestamp: '15 May 2025, 01:30 PM' }, ...current.details.activity],
      },
    }));
    setComment('');
    toast.success('Update posted');
  };

  const toggleChecklist = (id: string) => {
    updateTask((current) => ({
      ...current,
      details: {
        ...current.details,
        checklist: current.details.checklist.map((item) => item.id === id ? { ...item, completed: !item.completed } : item),
      },
    }));
  };

  return (
    <div className="w-full px-5 py-6 pb-12 sm:px-6 lg:px-8">
      <header className="mb-6">
        <Breadcrumb items={['Tasks', 'My Work', 'Assigned Tasks', task.id]} onAssigned={() => navigate('/tasks/my-work/assigned-tasks')} />
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            {/* <div className="dq-overline mb-2">TASK DETAILS WORKSPACE</div> */}
            <div className="flex items-center gap-2">
              <input
                aria-label="Task title"
                value={task.title}
                onChange={(event) => updateTask((current) => ({ ...current, title: event.target.value }))}
                className={`max-w-full rounded-input border-[1.5px] bg-transparent px-1 text-[30px] font-bold leading-tight text-primary outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 md:text-[34px] ${errors.title ? 'border-danger' : 'border-transparent'}`}
              />
              <Edit3 size={18} strokeWidth={1.5} className="shrink-0 text-primary" />
            </div>
            {errors.title && <p className="mt-1 text-xs font-semibold text-danger-text">{errors.title}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={`${task.priority} Priority`} />
              <DueDateBadge label="Due Today" />
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <DqButton variant="outline" onClick={() => navigate('/tasks/my-work/assigned-tasks')}><ArrowLeft size={16} strokeWidth={1.5} /> Back to Task Queue</DqButton>
            <DqButton variant="orange" onClick={saveChanges}><Save size={16} strokeWidth={1.5} /> Save Changes</DqButton>
            <DqButton variant="navy" onClick={() => toast.success('Closure review requested')}><ShieldCheck size={16} strokeWidth={1.5} /> Request Closure Review</DqButton>
            <DqIconButton label="More task actions"><MoreHorizontal size={18} strokeWidth={1.5} /></DqIconButton>
          </div>
        </div>
      </header>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_390px]">
        <main className="grid gap-5 xl:grid-cols-2">
          <NumberedCard number={1} title="Context">
            <div className="grid gap-4">
              <EditableTextarea label="Business Context" value={task.details.businessContext} required error={errors.businessContext} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, businessContext: value } }))} />
              <div className="grid gap-4 sm:grid-cols-2">
                <EditableField label="Linked Request" value={task.details.linkedRequest} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, linkedRequest: value } }))} />
                <EditableSelect label="Linked Outcome" value={task.details.linkedOutcome} options={[task.details.linkedOutcome, 'Validated monthly workforce report', 'Closure-ready evidence pack']} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, linkedOutcome: value } }))} />
              </div>
              <EditableChipList label="Stakeholders" values={task.details.stakeholders} onChange={(values) => updateTask((current) => ({ ...current, details: { ...current.details, stakeholders: values } }))} />
              <div className="grid gap-4 sm:grid-cols-2">
                <EditableSelect label="Unit" value={task.details.unit} options={['People Operations', 'Operations Support', 'Risk and Control']} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, unit: value } }))} />
                <EditableSelect label="Team" value={task.details.team} options={['Workforce Analytics', 'BAU Governance', 'Closure Assurance']} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, team: value } }))} />
              </div>
            </div>
          </NumberedCard>

          <NumberedCard number={2} title="Purpose">
            <div className="mb-2 text-xs font-bold text-primary">Why this task exists and what it aims to achieve</div>
            <div className="mb-2 flex h-9 items-center gap-2 rounded-input border border-border-default bg-surface px-2 text-xs font-semibold text-primary">
              <span>Normal</span><span>B</span><span>I</span><span>U</span><span>•</span><LinkIcon size={14} strokeWidth={1.5} />
            </div>
            <EditableTextarea label="Purpose statement" value={task.details.purpose} required error={errors.purpose} rows={6} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, purpose: value } }))} />
            <div className="mt-1 text-right text-[11px] text-text-muted">{task.details.purpose.length} / 1000</div>
          </NumberedCard>

          <NumberedCard number={3} title="Approach">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
              <div>
                <div className="mb-2 text-xs font-bold text-primary">Key Steps / Checklist</div>
                <EditableChecklist items={task.details.checklist} onToggle={toggleChecklist} onAdd={() => updateTask((current) => ({ ...current, details: { ...current.details, checklist: [...current.details.checklist, { id: `step-${Date.now()}`, label: 'New step', completed: false }] } }))} />
              </div>
              <div className="grid gap-3">
                <EditableField label="Method / Approach" value={task.details.method} required error={errors.method} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, method: value } }))} />
                <EditableField label="Primary Owner" value={task.details.owner} required error={errors.owner} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, owner: value } }))} />
                <EditableChipList label="Contributors" values={task.details.contributors} onChange={(values) => updateTask((current) => ({ ...current, details: { ...current.details, contributors: values } }))} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <EditableField label="Target Start Date" value={task.details.startDate} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, startDate: value } }))} />
                  <EditableField label="Target Due Date" value={task.details.targetDueDate} required error={errors.dueDate} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, targetDueDate: value } }))} />
                </div>
              </div>
            </div>
          </NumberedCard>

          <NumberedCard number={4} title="Outcome">
            <div className="grid gap-4 sm:grid-cols-2">
              <EditableTextarea label="Expected Outcome" value={task.details.expectedOutcome} required error={errors.expectedOutcome} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, expectedOutcome: value } }))} />
              <EditableTextarea label="Current Outcome" value={task.details.currentOutcome} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, currentOutcome: value } }))} />
              <EditableTextarea label="Completion Criteria" value={task.details.completionCriteria} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, completionCriteria: value } }))} />
              <EditableTextarea label="Review Note" value={task.details.reviewNote} onChange={(value) => updateTask((current) => ({ ...current, details: { ...current.details, reviewNote: value } }))} />
            </div>
          </NumberedCard>

          <section id="evidence" className="xl:col-span-2">
            <NumberedCard
              number={5}
              title="Links & Evidence"
              actions={<div className="flex gap-2"><DqButton variant="outline" onClick={() => addEvidence('upload')}><Upload size={16} strokeWidth={1.5} /> Upload File</DqButton><DqButton variant="outline" onClick={() => addEvidence('link')}><LinkIcon size={16} strokeWidth={1.5} /> Add Link</DqButton></div>}>
              <EvidenceTable evidence={task.details.evidence} />
              <button onClick={() => addEvidence('link')} className="mt-4 text-sm font-bold text-info-text hover:text-primary">+ Add Link or File</button>
            </NumberedCard>
          </section>

          <section className="xl:col-span-2">
            <NumberedCard number={6} title="Updates & Activity">
              <div className="mb-5 flex gap-3">
                <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share an update, mention someone with @..." className="dq-textarea min-h-12 flex-1" />
                <DqButton onClick={postUpdate} variant="navy">Post</DqButton>
              </div>
              <div className="space-y-4">
                {task.details.activity.map((item) => <ActivityItem key={item.id} {...item} />)}
              </div>
              <button className="mt-4 text-sm font-bold text-info-text hover:text-primary">View all activity</button>
            </NumberedCard>
          </section>
        </main>

        <aside className="space-y-4 2xl:sticky 2xl:top-20 2xl:self-start">
          <ProgressRailCard />
          <NextActionRail />
          <QuickActions onUpload={() => addEvidence('upload')} onLink={() => addEvidence('link')} />
          <EvidenceSummaryRail />
          <TimelineRail />
          <ClosureRail />
        </aside>
      </div>
    </div>
  );
}

function Breadcrumb({ items, onAssigned }: { items: string[]; onAssigned: () => void }) {
  return (
    <nav className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item} className="inline-flex items-center gap-2">
          {index > 0 && <span className="text-text-muted">/</span>}
          {item === 'Assigned Tasks' ? <button onClick={onAssigned} className="hover:text-secondary">{item}</button> : <span className={index === items.length - 1 ? 'font-bold' : ''}>{item}</span>}
        </span>
      ))}
    </nav>
  );
}

function NumberedCard({ number, title, children, actions }: { number: number; title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="dq-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-button border border-border-default bg-white text-sm font-bold text-primary">{number}</span>
          <h2 className="dq-card-title">{title}</h2>
        </div>
        {actions || <Edit3 size={18} strokeWidth={1.5} className="text-primary" />}
      </div>
      {children}
    </section>
  );
}

function EvidenceTable({ evidence }: { evidence: AssignedTaskEvidence[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border-default">
      <table className="min-w-[850px] w-full text-left">
        <thead className="bg-surface text-xs font-bold uppercase text-[#454560]">
          <tr>{['Type', 'Title', 'Description', 'Status', 'Uploaded / Added By', 'Date', 'Action'].map((header) => <th key={header} className="px-3 py-3">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {evidence.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-3"><TaskTypeBadge taskType={item.type} /></td>
              <td className="px-3 py-3 text-sm font-semibold text-primary">{item.title}</td>
              <td className="px-3 py-3 text-sm text-text-secondary">{item.description}</td>
              <td className="px-3 py-3"><DqBadge label={item.status} tone={item.status === 'Uploaded' || item.status === 'Linked' ? 'success' : 'warning'} /></td>
              <td className="px-3 py-3 text-sm text-primary">{item.addedBy}</td>
              <td className="px-3 py-3 font-mono text-xs text-primary">{item.date}</td>
              <td className="px-3 py-3"><DqIconButton label={`Open ${item.title}`} className="h-8 w-8"><ExternalLink size={15} strokeWidth={1.5} /></DqIconButton></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityItem({ actor, note, timestamp }: { actor: string; note: string; timestamp: string }) {
  const initials = actor.split(' ').map((part) => part[0]).join('').slice(0, 2);
  return (
    <div className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">{initials}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap justify-between gap-2"><span className="text-sm font-bold text-primary">{actor}</span><span className="text-[11px] text-text-muted">{timestamp}</span></div>
        <p className="mt-1 text-sm text-text-secondary">{note}</p>
      </div>
    </div>
  );
}

function RailCard({ title, children, highlight }: { title: string; children: ReactNode; highlight?: boolean }) {
  return <section className={`rounded-card border p-5 shadow-sm ${highlight ? 'border-secondary/25 bg-orange-50' : 'border-border-default bg-white'}`}><h3 className="mb-4 text-base font-semibold text-primary">{title}</h3>{children}</section>;
}

function ProgressRailCard() {
  return (
    <RailCard title="Progress">
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[conic-gradient(var(--color-info)_0deg,var(--color-info)_245deg,var(--color-border-subtle)_245deg)]">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-center text-sm font-bold text-primary">68%<span className="block text-[9px] text-text-muted">Complete</span></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-text-muted">Progress toward completion</div>
          <div className="mt-2 text-sm font-bold text-primary">17 of 25 checklist items done</div>
          <div className="mt-2 h-2 rounded-full bg-border-subtle"><div className="h-full w-[68%] rounded-full bg-info" /></div>
          <div className="mt-2 text-xs text-text-muted">Last updated: Today, 09:30 AM</div>
        </div>
      </div>
    </RailCard>
  );
}

function NextActionRail() {
  return (
    <RailCard title="Next Action" highlight>
      <div className="flex gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-button bg-secondary text-white"><Upload size={18} strokeWidth={1.5} /></span>
        <div className="flex-1"><p className="text-sm font-semibold text-primary">Upload final validation summary and supporting evidence.</p><div className="mt-1 text-xs font-bold text-secondary">Due Today</div></div>
      </div>
      <DqButton variant="outline" className="mt-4 w-full" onClick={() => document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth' })}>Go to Evidence</DqButton>
    </RailCard>
  );
}

function QuickActions({ onUpload, onLink }: { onUpload: () => void; onLink: () => void }) {
  return (
    <RailCard title="Quick Actions">
      <div className="grid grid-cols-2 gap-2">
        <DqButton variant="outline" onClick={() => toast.success('Progress updated')}><CheckCircle2 size={16} strokeWidth={1.5} /> Update Progress</DqButton>
        <DqButton variant="outline" onClick={onUpload}><Upload size={16} strokeWidth={1.5} /> Upload Evidence</DqButton>
        <DqButton variant="outline" onClick={onLink}><LinkIcon size={16} strokeWidth={1.5} /> Add Link</DqButton>
        <DqButton variant="outline" onClick={() => toast.success('Blocker marked as resolved')}><AlertCircle size={16} strokeWidth={1.5} /> Resolve Blocker</DqButton>
      </div>
    </RailCard>
  );
}

function EvidenceSummaryRail() {
  return (
    <RailCard title="Evidence Summary">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-button bg-info-surface text-info-text"><FileText size={18} strokeWidth={1.5} /></span>
        <div className="flex-1"><div className="text-sm font-bold text-primary">6 of 8 required evidence uploaded</div><div className="mt-2 h-2 rounded-full bg-border-subtle"><div className="h-full w-3/4 rounded-full bg-info" /></div><div className="mt-2 text-xs text-primary">Missing: <span className="font-bold text-danger">2 required</span></div></div>
      </div>
      <DqButton variant="outline" className="mt-4 w-full">View Evidence</DqButton>
    </RailCard>
  );
}

function TimelineRail() {
  const rows = [
    ['Created', '15 May 2025, 09:30 AM'],
    ['Assigned', '15 May 2025, 01:10 PM'],
    ['Last Updated', '15 May 2025, 01:10 PM'],
    ['Due Date', '18 May 2025, 05:00 PM  Today'],
    ['Review Date', '19 May 2025, 05:00 PM'],
  ];
  return <RailCard title="Timeline"><div className="space-y-3">{rows.map(([label, value]) => <div key={label} className="flex justify-between gap-3 text-sm"><span className="flex items-center gap-2 text-text-secondary"><CalendarDays size={14} strokeWidth={1.5} /> {label}</span><span className="text-right font-semibold text-primary">{value}</span></div>)}</div></RailCard>;
}

function ClosureRail() {
  return (
    <RailCard title="Closure Readiness">
      <div className="flex items-center gap-3">
        <span className="grid h-14 w-14 place-items-center rounded-full border-4 border-success text-sm font-bold text-success-text">92%</span>
        <div><div className="text-sm font-bold text-success-text">Ready for closure review</div><div className="text-sm text-primary">All required items are in place.</div></div>
      </div>
      <DqButton variant="outline" className="mt-4 w-full">View Readiness</DqButton>
    </RailCard>
  );
}

function TaskNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-card border border-border-default bg-white p-10 text-center shadow-sm">
      <AlertCircle size={38} strokeWidth={1.5} className="mx-auto mb-3 text-danger" />
      <h1 className="text-2xl font-bold text-primary">Task not found</h1>
      <p className="mt-2 text-sm text-text-muted">This task may not exist in the mock data.</p>
      <DqButton variant="outline" onClick={onBack} className="mt-6">Back to Assigned Tasks</DqButton>
    </div>
  );
}
