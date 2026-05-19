import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownToLine,
  CalendarDays,
  ChevronRight,
  Plus,
  Sparkles,
  Target,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useViewingMode } from '../context/ViewingModeContext';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import {
  getPerformanceDataset,
  type AiInsight,
  type ContributionRecord,
  type EvaluationCriterion,
  type FeedbackRecord,
  type GoalRecord,
  type LearningRecord,
  type PerformanceDataset,
  type PerformanceEvent,
  type PerformanceKpi,
  type PerformanceSection,
  type RoleMetric
} from '../mocks/performance.mock';
import { StatusPill } from '../components/StatusPill';

type DetailRecord = {
  id: string;
  title: string;
  status: string;
  owner: string;
  date: string;
  description: string;
  related: string[];
  nextAction: string;
  actions?: string[];
};

type ModalType =
  | 'Export Report'
  | 'Update Goal'
  | 'Create Goal'
  | 'Start Self Review'
  | 'Request Feedback'
  | 'Add Reflection'
  | 'Add Evidence'
  | 'Generate Role Report'
  | 'Create Improvement Action'
  | 'Update Progress'
  | 'Add Note'
  | 'Link Work Item'
  | 'Request Clarification'
  | null;

const navItems: Array<{ label: string; section: PerformanceSection; route: string }> = [
  { label: 'Overview', section: 'overview', route: '/stage02/performance/overview' },
  { label: 'My Goals', section: 'goals', route: '/stage02/performance/goals' },
  { label: 'My Evaluation', section: 'evaluation', route: '/stage02/performance/evaluation' },
  { label: 'My Feedback', section: 'feedback', route: '/stage02/performance/feedback' },
  { label: 'My Learning Progress', section: 'learning', route: '/stage02/performance/learning' },
  { label: 'My Contribution History', section: 'contribution-history', route: '/stage02/performance/contribution-history' },
  { label: 'Role Performance', section: 'role-performance', route: '/stage02/performance/role-performance' }
];

function progressTone(status: string) {
  if (['At Risk', 'Overdue', 'Action Required', 'Needs Improvement'].includes(status)) return 'bg-danger';
  if (['Watch', 'Due Soon', 'Pending'].includes(status)) return 'bg-warning';
  if (['In Progress', 'Awaiting Review'].includes(status)) return 'bg-info';
  return 'bg-success';
}

function goalToDetail(goal: GoalRecord): DetailRecord {
  return {
    id: goal.id,
    title: goal.title,
    status: goal.status,
    owner: goal.owner,
    date: goal.dueDate,
    description: `${goal.category}. Target: ${goal.target}. Current progress: ${goal.progress}%.`,
    related: [...goal.linkedTasks, ...goal.linkedWorkflows, ...goal.linkedTrackers],
    nextAction: goal.nextAction,
    actions: ['Update Progress', 'Add Note', 'Link Work Item']
  };
}

function feedbackToDetail(feedback: FeedbackRecord): DetailRecord {
  return {
    id: feedback.id,
    title: `${feedback.source} feedback`,
    status: feedback.status,
    owner: `${feedback.source} · ${feedback.sourceRole}`,
    date: feedback.date,
    description: feedback.text,
    related: [feedback.relatedWork, `Suggested improvement: ${feedback.suggestedImprovement}`, `Action item: ${feedback.actionStatus}`],
    nextAction: feedback.reviewed ? 'Add a reflection or link this feedback to an evaluation item.' : 'Mark this feedback as reviewed and create an action item if needed.',
    actions: ['Mark Reviewed', 'Create Action Item', 'Add Reflection']
  };
}

function learningToDetail(module: LearningRecord): DetailRecord {
  return {
    id: module.id,
    title: module.title,
    status: module.status,
    owner: module.category,
    date: module.dueDate,
    description: module.description,
    related: [`Linked goal: ${module.linkedGoal}`, `Progress: ${module.progress}%`],
    nextAction: module.progress >= 100 ? 'Review completion evidence and link learning to your evaluation.' : 'Continue the module and update learning progress.',
    actions: ['Continue Learning', 'Mark Complete', 'Add to Goal']
  };
}

function contributionToDetail(contribution: ContributionRecord): DetailRecord {
  return {
    id: contribution.id,
    title: contribution.title,
    status: contribution.status,
    owner: contribution.type,
    date: contribution.date,
    description: contribution.description,
    related: [contribution.linkedWork, contribution.impact, contribution.evidence],
    nextAction: 'Link this contribution to the active evaluation cycle if it supports your review.',
    actions: ['Add Evidence', 'Link to Evaluation']
  };
}

function roleMetricToDetail(metric: RoleMetric): DetailRecord {
  return {
    id: metric.id,
    title: metric.label,
    status: metric.status,
    owner: metric.impact,
    date: 'Current cycle',
    description: metric.description,
    related: [`Value: ${metric.value}`, metric.impact],
    nextAction: metric.nextAction,
    actions: ['Generate Role Report', 'Create Improvement Action']
  };
}

function criterionToDetail(criterion: EvaluationCriterion): DetailRecord {
  return {
    id: criterion.id,
    title: criterion.title,
    status: criterion.status,
    owner: criterion.owner,
    date: criterion.dueDate,
    description: `${criterion.description} Current score: ${criterion.score}.`,
    related: ['Q2 2025 Performance Review', 'Evaluation criteria'],
    nextAction: criterion.nextAction,
    actions: ['Request Clarification', 'Add Evidence']
  };
}

function eventToDetail(event: PerformanceEvent): DetailRecord {
  return {
    id: event.id,
    title: event.title,
    status: event.status,
    owner: 'Performance calendar',
    date: `${event.date} · ${event.time}`,
    description: event.description,
    related: ['Performance cycle', 'Calendar'],
    nextAction: 'Review the event details and prepare any required material.',
    actions: ['Add Note']
  };
}

function insightToDetail(insight: AiInsight): DetailRecord {
  return {
    id: insight.id,
    title: insight.title,
    status: insight.status,
    owner: 'AI Performance Assistant',
    date: 'Now',
    description: insight.description,
    related: [insight.prompt, 'Performance assistant recommendation'],
    nextAction: 'Open the AI assistant and generate a focused performance response.',
    actions: ['Ask AI Assistant']
  };
}

function PerformanceDrawer({
  record,
  onClose,
  onAction
}: {
  record: DetailRecord | null;
  onClose: () => void;
  onAction: (action: string) => void;
}) {
  if (!record) return null;
  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[200] h-screen w-full max-w-md overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="sticky top-0 flex items-start justify-between border-b border-border-subtle bg-white px-6 py-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{record.id}</div>
            <h2 className="mt-1 text-xl font-bold text-primary">{record.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <StatusPill status={record.status} />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">Owner / source</dt>
              <dd className="mt-1 font-semibold text-primary">{record.owner}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">Date / due date</dt>
              <dd className="mt-1 font-semibold text-primary">{record.date}</dd>
            </div>
          </dl>
          <div>
            <h3 className="text-sm font-bold text-primary">Description</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{record.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary">Related work items</h3>
            <div className="mt-2 space-y-2">
              {record.related.map((item) => (
                <div key={item} className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary">{item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-4">
            <h3 className="text-sm font-bold text-primary">Recommended next action</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{record.nextAction}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(record.actions || ['Add Note']).map((action) => (
              <button key={action} onClick={() => onAction(action)} className="rounded-button bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary/90">
                {action}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

function PerformanceModal({
  type,
  goals,
  onClose,
  onSave
}: {
  type: ModalType;
  goals: GoalRecord[];
  onClose: () => void;
  onSave: (type: Exclude<ModalType, null>, values: Record<string, string | boolean>) => void;
}) {
  const [values, setValues] = useState<Record<string, string | boolean>>({
    Goal: goals[0]?.title || '',
    Cycle: 'Q2 2025',
    Format: 'PDF',
    'Include AI summary': true
  });
  if (!type) return null;
  const fields =
    type === 'Export Report' ? ['Cycle', 'Sections to include', 'Format'] :
    type === 'Update Goal' || type === 'Update Progress' ? ['Goal', 'Progress %', 'Status', 'Due date', 'Notes'] :
    type === 'Create Goal' ? ['Goal title', 'Category', 'Target', 'Due date', 'Owner'] :
    type === 'Start Self Review' ? ['Key achievements', 'Challenges/blockers', 'Goals progress comments', 'Learning completed', 'Support needed', 'Self rating'] :
    type === 'Request Feedback' ? ['Feedback recipient', 'Context', 'Related work item', 'Requested by date'] :
    type === 'Add Reflection' ? ['Reflection', 'Related feedback', 'Next action'] :
    type === 'Add Evidence' ? ['Evidence title', 'Evidence link', 'Related item', 'Notes'] :
    type === 'Generate Role Report' ? ['Cycle', 'Role metric focus', 'Sections to include', 'Format'] :
    type === 'Create Improvement Action' ? ['Action title', 'Owner', 'Due date', 'Linked performance area'] :
    type === 'Request Clarification' ? ['Question', 'Criterion', 'Requested reviewer'] :
    type === 'Link Work Item' ? ['Work item ID', 'Relationship', 'Notes'] :
    ['Note', 'Related item'];
  const canSubmit = fields.every((field) => String(values[field] || '').trim());

  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/20" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[220] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">{type}</h2>
          <button onClick={onClose} aria-label="Close modal" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className={field.includes('achievements') || field.includes('Challenges') || field.includes('comments') || field.includes('Notes') || field.includes('Reflection') ? 'md:col-span-2' : ''}>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{field}</span>
              <input
                value={String(values[field] || '')}
                onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))}
                className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm text-primary outline-none focus:border-border-strong"
                placeholder={`Enter ${field.toLowerCase()}`}
              />
            </label>
          ))}
          {type === 'Export Report' && (
            <label className="flex items-center gap-3 rounded-card border border-border-subtle bg-surface px-4 py-3 text-sm font-semibold text-primary md:col-span-2">
              <input
                type="checkbox"
                checked={Boolean(values['Include AI summary'])}
                onChange={(event) => setValues((current) => ({ ...current, 'Include AI summary': event.target.checked }))}
              />
              Include AI summary
            </label>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Cancel</button>
          <button
            disabled={!canSubmit}
            onClick={() => onSave(type, values)}
            className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
            {type === 'Export Report' ? 'Export' : 'Save'}
          </button>
        </div>
      </div>
    </>
  );
}

function Header({
  activeSection,
  onOpenModal
}: {
  activeSection: PerformanceSection;
  onOpenModal: (type: ModalType) => void;
}) {
  const navigate = useNavigate();
  return (
    <header className="mb-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Performance</h1>
          <p className="mt-2 text-sm font-medium text-text-secondary">Track your progress, grow your skills, and achieve your goals.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onOpenModal('Export Report')} className="inline-flex h-10 items-center gap-2 rounded-button border border-border-default bg-white px-4 text-sm font-bold text-primary shadow-sm hover:bg-surface">
            <ArrowDownToLine size={16} />
            Export Report
          </button>
          <button onClick={() => onOpenModal('Update Goal')} className="inline-flex h-10 items-center gap-2 rounded-button bg-info px-4 text-sm font-bold text-white shadow-sm hover:bg-info-text">
            <Plus size={16} />
            Update Goal
          </button>
        </div>
      </div>
      <nav className="flex gap-6 overflow-x-auto border-b border-border-subtle" aria-label="Performance sections">
        {navItems.map((item) => (
          <button
            key={item.section}
            onClick={() => navigate(item.route)}
            className={`relative whitespace-nowrap pb-3 text-sm font-bold transition-colors ${activeSection === item.section ? 'text-info-text' : 'text-text-secondary hover:text-primary'}`}>
            {item.label}
            {activeSection === item.section && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-info" />}
          </button>
        ))}
      </nav>
    </header>
  );
}

function KpiStrip({ kpis, onOpen }: { kpis: PerformanceKpi[]; onOpen: (record: DetailRecord) => void }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Performance Snapshot <span className="text-sm font-semibold text-text-muted">(Q2 2025)</span></h2>
        <button onClick={() => onOpen(eventToDetail({ id: 'CYCLE-Q2', title: 'Q2 2025 Performance Cycle', date: 'Apr - Jun', time: 'Current', status: 'In Progress', description: 'Active performance cycle for goals, evaluation, feedback, learning, and contributions.' }))} className="rounded-button border border-border-default bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-surface">
          Q2 2025 (Apr - Jun)
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <button key={kpi.label} onClick={() => onOpen({ id: `KPI-${kpi.label}`, title: kpi.label, status: kpi.status, owner: 'Performance snapshot', date: 'Q2 2025', description: `${kpi.label}: ${kpi.value}. ${kpi.helper}`, related: ['My Performance Overview'], nextAction: 'Review the linked performance area and update evidence where needed.' })} className="rounded-card border border-border-subtle bg-white p-4 text-left transition hover:border-border-default hover:bg-surface">
            <div className="text-xs font-bold text-primary">{kpi.label}</div>
            <div className="mt-4 text-2xl font-bold text-primary">{kpi.value}</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
              <span className={`h-2 w-2 rounded-full ${progressTone(kpi.status)}`} />
              <span>{kpi.helper}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function GoalsCard({ goals, onOpen, onModal }: { goals: GoalRecord[]; onOpen: (goal: GoalRecord) => void; onModal: (type: ModalType) => void }) {
  const navigate = useNavigate();
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Goals Progress</h2>
        <button onClick={() => navigate('/stage02/performance/goals')} className="inline-flex items-center gap-1 text-xs font-bold text-info-text hover:underline">View all goals <ChevronRight size={14} /></button>
      </div>
      <div className="space-y-3">
        {goals.slice(0, 4).map((goal) => (
          <div
            key={goal.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(goal)}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(goal); } }}
            className="grid w-full cursor-pointer grid-cols-[minmax(118px,1fr)_78px_88px_68px_18px] items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-surface">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-primary">{goal.title}</div>
              <div className="text-xs text-text-muted">{goal.category}</div>
            </div>
            <div>
              <div className="mb-1 text-xs font-bold text-primary">{goal.progress}%</div>
              <div className="h-1.5 rounded-pill bg-navy-100"><div className={`h-full rounded-pill ${progressTone(goal.status)}`} style={{ width: `${goal.progress}%` }} /></div>
            </div>
            <StatusPill status={goal.status} />
            <span className="text-xs font-semibold text-text-secondary">{goal.dueDate}</span>
            <button onClick={(event) => { event.stopPropagation(); onModal('Update Progress'); }} className="rounded-full p-1 text-text-muted hover:bg-white hover:text-primary">⋮</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function EvaluationCard({ dataset, onOpen, onCriterion }: { dataset: PerformanceDataset; onOpen: (record: DetailRecord) => void; onCriterion: (criterion: EvaluationCriterion) => void }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Evaluation Status</h2>
        <button onClick={() => onOpen({ id: dataset.evaluation.id, title: dataset.evaluation.title, status: dataset.evaluation.stage, owner: 'Performance Review', date: dataset.evaluation.nextReviewDate, description: `Current stage: ${dataset.evaluation.stage}. Rating so far: ${dataset.evaluation.rating}.`, related: dataset.evaluation.steps.map((step) => `${step.label}: ${step.status}`), nextAction: 'Review criteria and prepare your self-review evidence.', actions: ['Start Self Review', 'Request Clarification'] })} className="inline-flex items-center gap-1 text-xs font-bold text-info-text hover:underline">View details <ChevronRight size={14} /></button>
      </div>
      <div className="rounded-card border border-border-subtle p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Current Cycle</div>
        <div className="mt-2 text-base font-bold text-primary">{dataset.evaluation.title}</div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {dataset.evaluation.steps.map((step, index) => (
          <button key={step.label} onClick={() => onOpen({ id: `STEP-${index + 1}`, title: step.label, status: step.status, owner: 'Evaluation cycle', date: step.date, description: `${step.label} is ${step.status}.`, related: [dataset.evaluation.title], nextAction: step.status === 'Completed' ? 'Review completed notes.' : 'Prepare required content for this step.' })} className="text-center">
            <div className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${progressTone(step.status)}`}>{index + 1}</div>
            <div className="mt-2 text-[11px] font-bold text-primary">{step.label}</div>
            <div className="text-[10px] text-text-muted">{step.status}</div>
            <div className="text-[10px] text-text-muted">{step.date}</div>
          </button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <button onClick={() => onCriterion(dataset.criteria[0])} className="rounded-card border border-border-subtle bg-surface p-4 text-left">
          <div className="text-xs font-bold text-text-muted">Overall Rating (So Far)</div>
          <div className="mt-2 text-3xl font-bold text-primary">{dataset.evaluation.rating}</div>
        </button>
        <button onClick={() => onOpen(eventToDetail({ id: 'NEXT-REVIEW', title: 'Next Review Date', date: dataset.evaluation.nextReviewDate, time: 'Performance review', status: 'Pending', description: 'Next scheduled review in the current evaluation cycle.' }))} className="rounded-card border border-border-subtle bg-surface p-4 text-left">
          <div className="text-xs font-bold text-text-muted">Next Review Date</div>
          <div className="mt-2 text-2xl font-bold text-primary">{dataset.evaluation.nextReviewDate}</div>
        </button>
      </div>
    </section>
  );
}

function FeedbackSummary({ feedback, onOpen }: { feedback: FeedbackRecord[]; onOpen: (feedback: FeedbackRecord) => void }) {
  const avg = feedback.length ? (feedback.reduce((sum, item) => sum + Number(item.rating), 0) / feedback.length).toFixed(1) : '0.0';
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Feedback Summary</h2>
        <button onClick={() => toast.info('Feedback summary filtered view opened')} className="text-xs font-bold text-info-text hover:underline">View all feedback</button>
      </div>
      <div className="grid grid-cols-4 divide-x divide-border-subtle rounded-card border border-border-subtle">
        {[
          ['Average Rating', avg],
          ['Received', String(feedback.length)],
          ['Pending Review', String(feedback.filter((item) => !item.reviewed).length)],
          ['Action Items', String(feedback.filter((item) => item.status === 'Action Required').length)]
        ].map(([label, value]) => (
          <button key={label} onClick={() => toast.info(`${label} filter applied`)} className="p-4 text-left hover:bg-surface">
            <div className="text-2xl font-bold text-primary">{value}</div>
            <div className="mt-1 text-xs font-semibold text-text-muted">{label}</div>
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-2">
        {feedback.slice(0, 2).map((item) => (
          <button key={item.id} onClick={() => onOpen(item)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-surface">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-xs font-bold text-primary">{item.source.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-primary">{item.text}</div>
              <div className="text-xs text-text-muted">{item.source} · {item.sourceRole}</div>
            </div>
            <StatusPill status={item.status} />
          </button>
        ))}
      </div>
    </section>
  );
}

function PerformanceDrivers({ drivers, onOpen }: { drivers: RoleMetric[]; onOpen: (driver: RoleMetric) => void }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-primary">Performance Drivers</h2>
          <p className="text-xs text-text-muted">How your work contributes to your performance</p>
        </div>
        <button onClick={() => toast.info('Performance driver details opened')} className="text-xs font-bold text-info-text hover:underline">View details</button>
      </div>
      <div className="space-y-3">
        {drivers.map((driver) => (
          <button key={driver.id} onClick={() => onOpen(driver)} className="grid w-full grid-cols-[minmax(0,1fr)_120px_96px] items-center gap-4 rounded-lg px-2 py-2 text-left hover:bg-surface">
            <div className="min-w-0">
              <div className="text-sm font-bold text-primary">{driver.label}</div>
              <div className="text-xs text-text-muted">{driver.value}</div>
            </div>
            <div className="h-1.5 rounded-pill bg-navy-100"><div className={`h-full w-3/4 rounded-pill ${progressTone(driver.status)}`} /></div>
            <div className="text-xs font-semibold text-text-secondary">{driver.impact}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function AiAssistant({
  insights,
  onOpen
}: {
  insights: AiInsight[];
  onOpen: (insight: AiInsight) => void;
}) {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState('Select a suggested prompt to generate a performance brief.');
  const prompts = [
    'Summarise my performance',
    'Prepare my self-review',
    'Explain what affects my rating',
    'Recommend next actions',
    'Generate weekly performance update'
  ];
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">AI Performance Assistant <span className="ml-2 rounded-pill bg-info-surface px-2 py-0.5 text-[10px] text-info-text">BETA</span></h2>
        <Sparkles size={18} className="text-primary" />
      </div>
      <p className="mb-3 text-sm font-medium text-text-secondary">Here&apos;s what I found for you.</p>
      <div className="divide-y divide-border-subtle rounded-card border border-border-subtle">
        {insights.map((insight) => (
          <button key={insight.id} onClick={() => onOpen(insight)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-surface">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-primary"><Sparkles size={16} /></div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-primary">{insight.title}</div>
              <div className="mt-1 truncate text-xs text-text-muted">{insight.description}</div>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </button>
        ))}
      </div>
      <button onClick={() => setOpen((current) => !current)} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-button border border-info bg-white text-sm font-bold text-info-text hover:bg-info-surface">
        <Sparkles size={16} />
        Ask AI Assistant
      </button>
      {open && (
        <div className="mt-4 rounded-card border border-border-subtle bg-surface p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button key={prompt} onClick={() => setResponse(`${prompt}: Your current performance signal is strongest where goals, evidence, and feedback are linked. Prioritise overdue tasks, complete one learning module, and prepare self-review evidence this week.`)} className="rounded-pill bg-white px-3 py-1.5 text-xs font-bold text-primary hover:bg-navy-50">
                {prompt}
              </button>
            ))}
          </div>
          <p className="text-sm leading-6 text-text-secondary">{response}</p>
        </div>
      )}
    </section>
  );
}

function UpcomingPanel({ events, onOpen }: { events: PerformanceEvent[]; onOpen: (event: PerformanceEvent) => void }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Upcoming</h2>
        <button onClick={() => toast.info('Performance calendar filtered view opened')} className="text-xs font-bold text-info-text hover:underline">View calendar</button>
      </div>
      <div className="divide-y divide-border-subtle">
        {events.slice(0, 4).map((event) => (
          <button key={event.id} onClick={() => onOpen(event)} className="grid w-full grid-cols-[52px_1fr_28px] items-center gap-3 py-3 text-left hover:bg-surface">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{event.date.split(' ')[0]}</div>
              <div className="text-[10px] font-bold uppercase text-text-muted">{event.date.split(' ')[1] || 'MAY'}</div>
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-primary">{event.title}</div>
              <div className="mt-1 truncate text-xs text-text-muted">{event.time}</div>
            </div>
            <CalendarDays size={17} className="text-text-muted" />
          </button>
        ))}
      </div>
    </section>
  );
}

function RightColumn({
  dataset,
  onInsight,
  onEvent,
  onProfileReminder
}: {
  dataset: PerformanceDataset;
  onInsight: (insight: AiInsight) => void;
  onEvent: (event: PerformanceEvent) => void;
  onProfileReminder: () => void;
}) {
  return (
    <aside className="space-y-4">
      <AiAssistant insights={dataset.aiInsights} onOpen={onInsight} />
      <UpcomingPanel events={dataset.events} onOpen={onEvent} />
      <button onClick={onProfileReminder} className="flex w-full items-center gap-3 rounded-card border border-border-subtle bg-white p-4 text-left shadow-sm hover:bg-surface">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-primary"><Target size={18} /></div>
        <div>
          <div className="text-sm font-bold text-primary">Keep your profile and goals updated</div>
          <div className="mt-1 text-xs text-text-muted">This helps your manager provide better feedback.</div>
        </div>
        <ChevronRight size={16} className="ml-auto text-text-muted" />
      </button>
    </aside>
  );
}

function GoalsPage({
  goals,
  setGoals,
  onOpen,
  onModal
}: {
  goals: GoalRecord[];
  setGoals: React.Dispatch<React.SetStateAction<GoalRecord[]>>;
  onOpen: (goal: GoalRecord) => void;
  onModal: (type: ModalType) => void;
}) {
  const [filter, setFilter] = useState('All');
  const visibleGoals = filter === 'All' ? goals : goals.filter((goal) => goal.status === filter || goal.category === filter);
  const filters = ['All', 'On Track', 'At Risk', 'In Progress', 'Learning & Development', 'Governance'];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          ['Total Goals', goals.length],
          ['On Track', goals.filter((goal) => goal.status === 'On Track').length],
          ['At Risk', goals.filter((goal) => goal.status === 'At Risk').length],
          ['Completed', goals.filter((goal) => goal.status === 'Completed').length]
        ].map(([label, value]) => (
          <button key={label} onClick={() => setFilter(label === 'Total Goals' ? 'All' : String(label))} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm hover:bg-surface">
            <div className="text-sm font-semibold text-text-muted">{label}</div>
            <div className="mt-2 text-3xl font-bold text-primary">{value}</div>
          </button>
        ))}
      </div>
      <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">{filters.map((name) => <button key={name} onClick={() => setFilter(name)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filter === name ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{name}</button>)}</div>
          <button onClick={() => onModal('Create Goal')} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Add Goal</button>
        </div>
        <div className="space-y-3">
          {visibleGoals.map((goal) => (
            <div
              key={goal.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpen(goal)}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(goal); } }}
              className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_120px_110px_110px_90px] items-center gap-4 rounded-card border border-border-subtle bg-white p-4 text-left hover:bg-surface">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-primary">{goal.title}</div>
                <div className="text-xs text-text-muted">{goal.category} · {goal.linkedTasks.length + goal.linkedWorkflows.length + goal.linkedTrackers.length} linked work items</div>
              </div>
              <div>
                <div className="mb-1 text-xs font-bold text-primary">{goal.progress}%</div>
                <div className="h-1.5 rounded-pill bg-navy-100"><div className={`h-full rounded-pill ${progressTone(goal.status)}`} style={{ width: `${goal.progress}%` }} /></div>
              </div>
              <StatusPill status={goal.status} />
              <span className="text-sm font-semibold text-text-secondary">{goal.dueDate}</span>
              <button onClick={(event) => { event.stopPropagation(); setGoals((current) => current.map((item) => item.id === goal.id ? { ...item, status: item.status === 'On Track' ? 'At Risk' : 'On Track' } : item)); toast.success('Goal status updated.'); }} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-white">Status</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EvaluationPage({ dataset, onOpen, onCriterion, onModal }: { dataset: PerformanceDataset; onOpen: (record: DetailRecord) => void; onCriterion: (criterion: EvaluationCriterion) => void; onModal: (type: ModalType) => void }) {
  return (
    <div className="space-y-5">
      <EvaluationCard dataset={dataset} onOpen={onOpen} onCriterion={onCriterion} />
      <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-primary">Evaluation Criteria</h2>
          <div className="flex gap-2">
            <button onClick={() => onModal('Start Self Review')} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Start Self Review</button>
            <button onClick={() => onModal('Request Clarification')} className="rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary">Request Clarification</button>
          </div>
        </div>
        <div className="overflow-hidden rounded-card border border-border-subtle">
          <table className="w-full text-left">
            <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-text-muted">
              <tr><th className="px-4 py-3">Criterion</th><th className="px-4 py-3">Score</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {dataset.criteria.map((criterion) => (
                <tr key={criterion.id} onClick={() => onCriterion(criterion)} className="cursor-pointer hover:bg-surface">
                  <td className="px-4 py-3 text-sm font-bold text-primary">{criterion.title}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{criterion.score}</td>
                  <td className="px-4 py-3"><StatusPill status={criterion.status} /></td>
                  <td className="px-4 py-3"><button onClick={(event) => { event.stopPropagation(); onCriterion(criterion); }} className="text-sm font-bold text-info-text">View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function FeedbackPage({ feedback, setFeedback, onOpen, onModal }: { feedback: FeedbackRecord[]; setFeedback: React.Dispatch<React.SetStateAction<FeedbackRecord[]>>; onOpen: (item: FeedbackRecord) => void; onModal: (type: ModalType) => void }) {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? feedback : feedback.filter((item) => item.status === filter || item.type === filter || item.sourceRole === filter);
  const avg = feedback.length ? (feedback.reduce((sum, item) => sum + Number(item.rating), 0) / feedback.length).toFixed(1) : '0.0';
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          ['Average rating', avg],
          ['Feedback received', feedback.length],
          ['Pending review', feedback.filter((item) => !item.reviewed).length],
          ['Action items', feedback.filter((item) => item.status === 'Action Required').length]
        ].map(([label, value]) => <div key={label} className="rounded-card border border-border-subtle bg-white p-5 shadow-sm"><div className="text-sm text-text-muted">{label}</div><div className="mt-2 text-3xl font-bold text-primary">{value}</div></div>)}
      </div>
      <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">{['All', 'Positive', 'Action Required', 'Manager', 'Governance Lead', 'Peer'].map((name) => <button key={name} onClick={() => setFilter(name)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filter === name ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{name}</button>)}</div>
          <button onClick={() => onModal('Request Feedback')} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Request Feedback</button>
        </div>
        <div className="space-y-3">
          {visible.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpen(item)}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(item); } }}
              className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_120px_110px_120px] items-center gap-4 rounded-card border border-border-subtle bg-white p-4 text-left hover:bg-surface">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-primary">{item.source} · {item.sourceRole}</div>
                <div className="truncate text-xs text-text-muted">{item.text}</div>
              </div>
              <span className="text-sm text-text-secondary">{item.date}</span>
              <StatusPill status={item.status} />
              <button onClick={(event) => { event.stopPropagation(); setFeedback((current) => current.map((feedbackItem) => feedbackItem.id === item.id ? { ...feedbackItem, reviewed: true, actionStatus: 'Reviewed' } : feedbackItem)); toast.success('Feedback marked as reviewed.'); }} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-white">Mark Reviewed</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LearningPage({ learning, setLearning, onOpen }: { learning: LearningRecord[]; setLearning: React.Dispatch<React.SetStateAction<LearningRecord[]>>; onOpen: (item: LearningRecord) => void }) {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? learning : learning.filter((item) => item.requirement === filter || item.status === filter);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          ['Required Modules', learning.filter((item) => item.requirement === 'Required').length],
          ['Completed', learning.filter((item) => item.progress === 100).length],
          ['In Progress', learning.filter((item) => item.status === 'In Progress').length],
          ['Overdue', learning.filter((item) => item.status === 'Overdue').length]
        ].map(([label, value]) => <div key={label} className="rounded-card border border-border-subtle bg-white p-5 shadow-sm"><div className="text-sm text-text-muted">{label}</div><div className="mt-2 text-3xl font-bold text-primary">{value}</div></div>)}
      </div>
      <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap gap-2">{['All', 'Required', 'Recommended', 'In Progress', 'Due Soon', 'Not Started'].map((name) => <button key={name} onClick={() => setFilter(name)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filter === name ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{name}</button>)}</div>
        <div className="grid grid-cols-1 gap-3">
          {visible.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpen(item)}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(item); } }}
              className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_120px_110px_120px] items-center gap-4 rounded-card border border-border-subtle bg-white p-4 text-left hover:bg-surface">
              <div className="min-w-0">
                <div className="text-sm font-bold text-primary">{item.title}</div>
                <div className="text-xs text-text-muted">{item.category} · Linked goal: {item.linkedGoal}</div>
              </div>
              <div><div className="mb-1 text-xs font-bold text-primary">{item.progress}%</div><div className="h-1.5 rounded-pill bg-navy-100"><div className={`h-full rounded-pill ${progressTone(item.status)}`} style={{ width: `${item.progress}%` }} /></div></div>
              <StatusPill status={item.status} />
              <button onClick={(event) => { event.stopPropagation(); setLearning((current) => current.map((module) => module.id === item.id ? { ...module, progress: 100, status: 'Completed' } : module)); toast.success('Learning module marked complete.'); }} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary">Mark Complete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ContributionPage({ contributions, onOpen, onModal }: { contributions: ContributionRecord[]; onOpen: (item: ContributionRecord) => void; onModal: (type: ModalType) => void }) {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? contributions : contributions.filter((item) => item.type === filter || item.impact === filter);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {[
          ['Completed tasks', contributions.filter((item) => item.type === 'Completed Task').length],
          ['Workflows contributed', contributions.filter((item) => item.type === 'Workflow Contribution').length],
          ['Trackers updated', contributions.filter((item) => item.type === 'Tracker Update').length],
          ['Knowledge articles added', contributions.filter((item) => item.type === 'Knowledge Article').length],
          ['Governance actions completed', contributions.filter((item) => item.type === 'Governance Action').length]
        ].map(([label, value]) => <div key={label} className="rounded-card border border-border-subtle bg-white p-5 shadow-sm"><div className="text-xs text-text-muted">{label}</div><div className="mt-2 text-3xl font-bold text-primary">{value}</div></div>)}
      </div>
      <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">{['All', 'Completed Task', 'Tracker Update', 'Workflow Contribution', 'Knowledge Article', 'High Impact'].map((name) => <button key={name} onClick={() => setFilter(name)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filter === name ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{name}</button>)}</div>
          <button onClick={() => onModal('Add Evidence')} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Add Evidence</button>
        </div>
        <div className="space-y-3">
          {visible.map((item) => (
            <button key={item.id} onClick={() => onOpen(item)} className="grid w-full grid-cols-[110px_minmax(0,1fr)_130px_110px] items-center gap-4 rounded-card border border-border-subtle bg-white p-4 text-left hover:bg-surface">
              <span className="text-sm font-semibold text-text-muted">{item.date}</span>
              <div className="min-w-0"><div className="truncate text-sm font-bold text-primary">{item.title}</div><div className="text-xs text-text-muted">{item.type} · {item.linkedWork}</div></div>
              <span className="text-sm font-semibold text-primary">{item.impact}</span>
              <StatusPill status={item.status} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function RolePerformancePage({ metrics, onOpen, onModal }: { metrics: RoleMetric[]; onOpen: (item: RoleMetric) => void; onModal: (type: ModalType) => void }) {
  return (
    <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-primary">Role Performance</h2>
          <p className="text-sm text-text-muted">Specialised indicators for the active role.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onModal('Generate Role Report')} className="rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary">Generate Role Report</button>
          <button onClick={() => onModal('Create Improvement Action')} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Create Improvement Action</button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {metrics.map((metric) => (
          <button key={metric.id} onClick={() => onOpen(metric)} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm hover:bg-surface">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-primary">{metric.label}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{metric.description}</p>
              </div>
              <StatusPill status={metric.status} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-3xl font-bold text-primary">{metric.value}</div>
              <span className="text-sm font-semibold text-text-secondary">{metric.impact}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function Overview({
  dataset,
  goals,
  onOpen,
  onGoal,
  onFeedback,
  onCriterion,
  onDriver,
  onModal
}: {
  dataset: PerformanceDataset;
  goals: GoalRecord[];
  onOpen: (record: DetailRecord) => void;
  onGoal: (goal: GoalRecord) => void;
  onFeedback: (feedback: FeedbackRecord) => void;
  onCriterion: (criterion: EvaluationCriterion) => void;
  onDriver: (driver: RoleMetric) => void;
  onModal: (type: ModalType) => void;
}) {
  return (
    <div className="space-y-5">
      <KpiStrip kpis={dataset.kpis} onOpen={onOpen} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.85fr)]">
        <GoalsCard goals={goals} onOpen={onGoal} onModal={onModal} />
        <EvaluationCard dataset={dataset} onOpen={onOpen} onCriterion={onCriterion} />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr]">
        <FeedbackSummary feedback={dataset.feedback} onOpen={onFeedback} />
        <PerformanceDrivers drivers={dataset.drivers} onOpen={onDriver} />
      </div>
    </div>
  );
}

export function Stage02PerformancePage({ section = 'overview' }: { section?: PerformanceSection }) {
  const { mode } = useViewingMode();
  const { activeRole } = useWorkspaceRole();
  const dataset = useMemo(() => getPerformanceDataset(mode, activeRole), [mode, activeRole]);
  const [goals, setGoals] = useState<GoalRecord[]>(dataset.goals);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>(dataset.feedback);
  const [learningState, setLearningState] = useState<LearningRecord[]>(dataset.learning);
  const [contributions] = useState<ContributionRecord[]>(dataset.contributions);
  const [detail, setDetail] = useState<DetailRecord | null>(null);
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    setGoals(dataset.goals);
    setFeedback(dataset.feedback);
    setLearningState(dataset.learning);
  }, [dataset]);

  const openModalFromAction = (action: string) => {
    if (action === 'Mark Reviewed') {
      setFeedback((current) => current.map((item) => item.id === detail?.id ? { ...item, reviewed: true, actionStatus: 'Reviewed' } : item));
      toast.success('Feedback marked as reviewed.');
      return;
    }
    if (action === 'Create Action Item') {
      toast.success('Linked action item created.');
      return;
    }
    if (action === 'Continue Learning') {
      toast.info('Learning module view opened.');
      return;
    }
    if (action === 'Mark Complete') {
      setLearningState((current) => current.map((item) => item.id === detail?.id ? { ...item, progress: 100, status: 'Completed' } : item));
      toast.success('Learning module marked complete.');
      return;
    }
    if (action === 'Add to Goal') {
      toast.success('Learning module linked to goal.');
      return;
    }
    if (action === 'Link to Evaluation') {
      toast.success('Contribution linked to evaluation cycle.');
      return;
    }
    if (action === 'Ask AI Assistant') {
      toast.info('AI assistant panel opened.');
      return;
    }
    setModal(action as ModalType);
  };

  const handleModalSave = (type: Exclude<ModalType, null>, values: Record<string, string | boolean>) => {
    if (type === 'Export Report' || type === 'Generate Role Report') {
      toast.success(type === 'Export Report' ? 'Performance report prepared for export.' : 'Role performance report prepared.');
    } else if (type === 'Update Goal' || type === 'Update Progress') {
      const goalTitle = String(values.Goal || goals[0]?.title || '');
      const progress = Number(values['Progress %'] || goals[0]?.progress || 0);
      setGoals((current) => current.map((goal, index) => goal.title === goalTitle || index === 0 ? { ...goal, progress: Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : goal.progress, status: String(values.Status || goal.status), dueDate: String(values['Due date'] || goal.dueDate), notes: [...goal.notes, String(values.Notes || 'Progress updated.')] } : goal));
      toast.success('Goal updated successfully.');
    } else if (type === 'Create Goal') {
      setGoals((current) => [
        ...current,
        {
          id: `GOAL-${600 + current.length}`,
          title: String(values['Goal title']),
          category: String(values.Category),
          progress: 0,
          target: String(values.Target),
          status: 'Not Started',
          dueDate: String(values['Due date']),
          owner: String(values.Owner),
          linkedTasks: [],
          linkedWorkflows: [],
          linkedTrackers: [],
          latestFeedback: 'No feedback yet.',
          nextAction: 'Define linked work items and update progress.',
          notes: []
        }
      ]);
      toast.success('Goal created successfully.');
    } else if (type === 'Start Self Review') {
      toast.success('Self review submitted successfully.');
    } else if (type === 'Request Feedback') {
      toast.success('Feedback request sent.');
    } else if (type === 'Add Evidence') {
      toast.success('Evidence added successfully.');
    } else if (type === 'Create Improvement Action') {
      toast.success('Improvement action created.');
    } else {
      toast.success(`${type} saved successfully.`);
    }
    setModal(null);
  };

  const content =
    section === 'overview' ? (
      <Overview dataset={dataset} goals={goals} onOpen={setDetail} onGoal={(goal) => setDetail(goalToDetail(goal))} onFeedback={(item) => setDetail(feedbackToDetail(item))} onCriterion={(criterion) => setDetail(criterionToDetail(criterion))} onDriver={(driver) => setDetail(roleMetricToDetail(driver))} onModal={setModal} />
    ) : section === 'goals' ? (
      <GoalsPage goals={goals} setGoals={setGoals} onOpen={(goal) => setDetail(goalToDetail(goal))} onModal={setModal} />
    ) : section === 'evaluation' ? (
      <EvaluationPage dataset={dataset} onOpen={setDetail} onCriterion={(criterion) => setDetail(criterionToDetail(criterion))} onModal={setModal} />
    ) : section === 'feedback' ? (
      <FeedbackPage feedback={feedback} setFeedback={setFeedback} onOpen={(item) => setDetail(feedbackToDetail(item))} onModal={setModal} />
    ) : section === 'learning' ? (
      <LearningPage learning={learningState} setLearning={setLearningState} onOpen={(item) => setDetail(learningToDetail(item))} />
    ) : section === 'contribution-history' ? (
      <ContributionPage contributions={contributions} onOpen={(item) => setDetail(contributionToDetail(item))} onModal={setModal} />
    ) : (
      <RolePerformancePage metrics={dataset.roleMetrics} onOpen={(item) => setDetail(roleMetricToDetail(item))} onModal={setModal} />
    );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <Header activeSection={section} onOpenModal={setModal} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0">{content}</main>
        <RightColumn
          dataset={dataset}
          onInsight={(insight) => setDetail(insightToDetail(insight))}
          onEvent={(event) => setDetail(eventToDetail(event))}
          onProfileReminder={() => setDetail({ id: 'REM-PROFILE', title: 'Profile and goals reminder', status: 'Pending', owner: 'Performance workspace', date: 'This week', description: 'Keep your profile and goals updated so your manager has accurate context for review.', related: ['My Goals', 'My Evaluation'], nextAction: 'Review active goals and update any stale profile details.', actions: ['Update Goal'] })}
        />
      </div>
      <footer className="flex justify-center gap-5 py-6 text-xs text-text-muted">
        <span>© 2026 DWS. All rights reserved.</span>
        <span>|</span>
        <button onClick={() => toast.info('Privacy preferences opened for the DWS workspace.')} className="hover:text-primary">Privacy</button>
        <span>|</span>
        <button onClick={() => toast.info('Workspace terms opened.')} className="hover:text-primary">Terms</button>
        <span>|</span>
        <button onClick={() => toast.info('Support options opened.')} className="hover:text-primary">Support</button>
      </footer>
      <PerformanceDrawer record={detail} onClose={() => setDetail(null)} onAction={openModalFromAction} />
      <PerformanceModal type={modal} goals={goals} onClose={() => setModal(null)} onSave={handleModalSave} />
    </div>
  );
}
