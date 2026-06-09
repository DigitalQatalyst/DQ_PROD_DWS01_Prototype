import { useMemo, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  Folder,
  KanbanSquare,
  List,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Save,
  Search,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DqButton, DqIconButton } from '../components/DqButton';
import { DqBadge, PriorityBadge, StatusBadge } from '../components/DqBadge';

type BoardStage = 'Backlog' | 'Ready' | 'In Progress' | 'Review' | 'Done';
type BoardPriority = 'Low' | 'Medium' | 'High' | 'Critical';
type BoardRisk = 'Low' | 'Medium' | 'High' | 'Critical';

interface BoardTask {
  id: string;
  title: string;
  description: string;
  owner: string;
  ownerName: string;
  priority: BoardPriority;
  status: string;
  stage: BoardStage;
  dueDate: string;
  dueSort: number;
  evidenceUploaded: number;
  evidenceRequired: number;
  comments: number;
  attachments: number;
  checklistDone: number;
  checklistTotal: number;
  risk: BoardRisk;
  team: string;
  blocker?: boolean;
  nextAction?: string;
}

const columns: Array<{ stage: BoardStage; count: number; accent: 'blue' | 'green' | 'orange' | 'purple' }> = [
  { stage: 'Backlog', count: 23, accent: 'blue' },
  { stage: 'Ready', count: 18, accent: 'green' },
  { stage: 'In Progress', count: 27, accent: 'orange' },
  { stage: 'Review', count: 14, accent: 'purple' },
  { stage: 'Done', count: 46, accent: 'green' },
];

const boardTasks: BoardTask[] = [
  { id: 'TSK-1042', title: 'Define SOP for Evidence Collection', description: 'Establish standard process for gathering...', owner: 'AV', ownerName: 'Aisha Vora', priority: 'High', status: 'Backlog', stage: 'Backlog', dueDate: 'May 30', dueSort: 20250530, evidenceUploaded: 0, evidenceRequired: 3, comments: 2, attachments: 1, checklistDone: 1, checklistTotal: 5, risk: 'High', team: 'Governance' },
  { id: 'TSK-1045', title: 'Update Vendor Risk Assessment', description: 'Review and update third-party risk ratings', owner: 'SC', ownerName: 'Sara Chen', priority: 'Medium', status: 'Backlog', stage: 'Backlog', dueDate: 'Jun 5', dueSort: 20250605, evidenceUploaded: 0, evidenceRequired: 4, comments: 3, attachments: 2, checklistDone: 0, checklistTotal: 4, risk: 'Medium', team: 'Risk' },
  { id: 'ACT-224', title: 'Training: Evidence Management 101', description: 'Complete mandatory training module', owner: 'LM', ownerName: 'Lina Malik', priority: 'Low', status: 'Backlog', stage: 'Backlog', dueDate: 'Jun 12', dueSort: 20250612, evidenceUploaded: 0, evidenceRequired: 2, comments: 0, attachments: 0, checklistDone: 0, checklistTotal: 3, risk: 'Low', team: 'People Operations' },
  { id: 'TSK-1087', title: 'Collect Q1 Access Review Evidence', description: 'Gather system access review logs', owner: 'JT', ownerName: 'James Tan', priority: 'High', status: 'Ready', stage: 'Ready', dueDate: 'May 27', dueSort: 20250527, evidenceUploaded: 2, evidenceRequired: 4, comments: 1, attachments: 2, checklistDone: 2, checklistTotal: 5, risk: 'High', team: 'Security' },
  { id: 'TSK-1091', title: 'Review Data Retention Policy', description: 'Validate policy against new regulation', owner: 'MK', ownerName: 'Maya Khan', priority: 'Medium', status: 'Ready', stage: 'Ready', dueDate: 'Jun 2', dueSort: 20250602, evidenceUploaded: 1, evidenceRequired: 3, comments: 0, attachments: 1, checklistDone: 1, checklistTotal: 4, risk: 'Medium', team: 'Governance' },
  { id: 'TSK-1098', title: 'Update Asset Inventory List', description: 'Add new hardware and software assets', owner: 'RP', ownerName: 'Rohan Patel', priority: 'Low', status: 'Ready', stage: 'Ready', dueDate: 'Jun 6', dueSort: 20250606, evidenceUploaded: 1, evidenceRequired: 4, comments: 2, attachments: 1, checklistDone: 2, checklistTotal: 6, risk: 'Low', team: 'IT Operations' },
  { id: 'TSK-1131', title: 'Implement MFA for Finance Team', description: 'Deploy MFA and validate enrollments', owner: 'AH', ownerName: 'Amir Hassan', priority: 'High', status: 'In Progress', stage: 'In Progress', dueDate: 'May 25', dueSort: 20250525, evidenceUploaded: 3, evidenceRequired: 6, comments: 2, attachments: 3, checklistDone: 3, checklistTotal: 7, risk: 'High', team: 'Security', nextAction: 'Upload evidence' },
  { id: 'TSK-1135', title: 'Quarterly Access Certification', description: 'Review and certify user access', owner: 'SS', ownerName: 'Sofia Silva', priority: 'High', status: 'In Progress', stage: 'In Progress', dueDate: 'May 28', dueSort: 20250528, evidenceUploaded: 2, evidenceRequired: 5, comments: 4, attachments: 2, checklistDone: 4, checklistTotal: 8, risk: 'High', team: 'Governance', nextAction: 'Review access list' },
  { id: 'TSK-1140', title: 'Pen Test Remediation', description: 'Address critical vulnerabilities', owner: 'DP', ownerName: 'Dev Patel', priority: 'Critical', status: 'In Progress', stage: 'In Progress', dueDate: 'May 31', dueSort: 20250531, evidenceUploaded: 1, evidenceRequired: 7, comments: 3, attachments: 4, checklistDone: 2, checklistTotal: 9, risk: 'Critical', team: 'Security', blocker: true, nextAction: 'Resolve blocker' },
  { id: 'TSK-1165', title: 'Review Vendor Contracts', description: 'Legal and security clause validation', owner: 'NR', ownerName: 'Nadia Rahman', priority: 'Medium', status: 'In Review', stage: 'Review', dueDate: 'May 26', dueSort: 20250526, evidenceUploaded: 4, evidenceRequired: 4, comments: 1, attachments: 2, checklistDone: 5, checklistTotal: 5, risk: 'Medium', team: 'Risk', nextAction: 'Approve / Return' },
  { id: 'TSK-1168', title: 'Evidence Quality Review', description: 'Validate completeness and accuracy', owner: 'BC', ownerName: 'Ben Carter', priority: 'High', status: 'In Review', stage: 'Review', dueDate: 'May 29', dueSort: 20250529, evidenceUploaded: 2, evidenceRequired: 3, comments: 2, attachments: 1, checklistDone: 4, checklistTotal: 6, risk: 'High', team: 'Governance', nextAction: 'Approve evidence' },
  { id: 'TSK-1170', title: 'SLA Breach Root Cause', description: 'Analyze breach and document RCA', owner: 'JM', ownerName: 'Jamal Moore', priority: 'Medium', status: 'In Review', stage: 'Review', dueDate: 'Jun 1', dueSort: 20250601, evidenceUploaded: 1, evidenceRequired: 4, comments: 1, attachments: 2, checklistDone: 3, checklistTotal: 6, risk: 'Medium', team: 'Operations' },
  { id: 'TSK-1188', title: 'Employee Security Awareness', description: 'Q1 training completion verification', owner: 'KT', ownerName: 'Kira Thomas', priority: 'Low', status: 'Done', stage: 'Done', dueDate: 'May 20', dueSort: 20250520, evidenceUploaded: 3, evidenceRequired: 3, comments: 0, attachments: 1, checklistDone: 5, checklistTotal: 5, risk: 'Low', team: 'People Operations' },
  { id: 'TSK-1190', title: 'Update Incident Response Plan', description: 'Annual review and approval', owner: 'RS', ownerName: 'Ravi Singh', priority: 'Medium', status: 'Done', stage: 'Done', dueDate: 'May 21', dueSort: 20250521, evidenceUploaded: 4, evidenceRequired: 4, comments: 0, attachments: 2, checklistDone: 6, checklistTotal: 6, risk: 'Medium', team: 'Security' },
  { id: 'TSK-1195', title: 'Backup Verification - April', description: 'Verify backup jobs and restore tests', owner: 'VL', ownerName: 'Vera Liu', priority: 'Low', status: 'Done', stage: 'Done', dueDate: 'May 22', dueSort: 20250522, evidenceUploaded: 2, evidenceRequired: 2, comments: 0, attachments: 1, checklistDone: 4, checklistTotal: 4, risk: 'Low', team: 'IT Operations' },
];

const priorityRank: Record<BoardPriority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export function KanbanBoardPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [owner, setOwner] = useState('All Owners');
  const [priority, setPriority] = useState('All Priorities');
  const [dueDate, setDueDate] = useState('All Due Dates');
  const [risk, setRisk] = useState('All Risk');
  const [evidence, setEvidence] = useState('All Evidence');
  const [team, setTeam] = useState('All Teams');
  const [sort, setSort] = useState('Priority');

  const owners = useMemo(() => ['All Owners', ...Array.from(new Set(boardTasks.map((task) => task.owner)))], []);
  const teams = useMemo(() => ['All Teams', ...Array.from(new Set(boardTasks.map((task) => task.team)))], []);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return boardTasks
      .filter((task) => !query || `${task.id} ${task.title} ${task.description}`.toLowerCase().includes(query))
      .filter((task) => owner === 'All Owners' || task.owner === owner || task.ownerName === owner)
      .filter((task) => priority === 'All Priorities' || task.priority === priority)
      .filter((task) => risk === 'All Risk' || task.risk === risk)
      .filter((task) => team === 'All Teams' || task.team === team)
      .filter((task) => {
        if (evidence === 'All Evidence') return true;
        if (evidence === 'Complete') return task.evidenceUploaded === task.evidenceRequired;
        if (evidence === 'Incomplete') return task.evidenceUploaded < task.evidenceRequired;
        return task.evidenceUploaded === 0;
      })
      .filter((task) => {
        if (dueDate === 'All Due Dates') return true;
        if (dueDate === 'Due This Week') return task.dueSort <= 20250531;
        if (dueDate === 'June') return task.dueSort >= 20250601;
        return task.dueSort <= 20250526;
      })
      .sort((a, b) => sort === 'Due Date' ? a.dueSort - b.dueSort : priorityRank[a.priority] - priorityRank[b.priority] || a.dueSort - b.dueSort);
  }, [dueDate, evidence, owner, priority, risk, search, sort, team]);

  const openTask = (taskId: string) => navigate(`/tasks/my-work/assigned-tasks/${taskId}`);
  const createTask = () => {
    toast.success('Create task flow opened');
    navigate('/tasks/create');
  };

  return (
    <div className="w-full px-5 py-6 pb-12 sm:px-6 lg:px-8">
      <header className="mb-6">
        <Breadcrumb items={['Tasks', 'Task Board', 'Kanban View']} />
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div>
            <div className="dq-overline mb-2">TASK BOARD WORKSPACE</div>
            <h1 className="dq-page-title">Kanban View</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-primary">
              Visualize and manage tasks across workflow stages. Track priority, blockers, due dates, and evidence readiness at a glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <DqButton variant="orange" onClick={createTask}><Plus size={16} strokeWidth={1.5} /> Create Task</DqButton>
            <DqButton variant="navy" onClick={() => toast.success('Board view saved')}><Save size={16} strokeWidth={1.5} /> Save Board View</DqButton>
            <DqIconButton label="Board settings" onClick={() => toast.info('Board settings opened')}><Settings size={18} strokeWidth={1.5} /></DqIconButton>
          </div>
        </div>
      </header>

      <section className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Total Tasks" value="128" trend="↗ 12% vs last week" icon={ClipboardList} accent="blue" />
        <KpiCard label="Due This Week" value="24" trend="↗ 8% vs last week" icon={CalendarDays} accent="orange" />
        <KpiCard label="Blocked" value="6" trend="↘ 2 vs last week" icon={AlertTriangle} accent="red" />
        <KpiCard label="Needs Evidence" value="17" trend="↗ 5 vs last week" icon={Folder} accent="purple" />
        <KpiCard label="Completed This Week" value="32" trend="↗ 15% vs last week" icon={CheckCircle2} accent="green" />
      </section>

      <section className="mb-4 rounded-card border border-border-default bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-[260px] flex-1 2xl:max-w-[360px]">
              <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="dq-input pl-9" />
            </div>
            <FilterSelect value={owner} onChange={setOwner} options={owners} />
            <FilterSelect value={priority} onChange={setPriority} options={['All Priorities', 'Critical', 'High', 'Medium', 'Low']} />
            <FilterSelect value={dueDate} onChange={setDueDate} options={['All Due Dates', 'Due This Week', 'Overdue', 'June']} />
            <FilterSelect value={risk} onChange={setRisk} options={['All Risk', 'Critical', 'High', 'Medium', 'Low']} />
            <FilterSelect value={evidence} onChange={setEvidence} options={['All Evidence', 'Complete', 'Incomplete', 'Missing']} />
            <FilterSelect value={team} onChange={setTeam} options={teams} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect value="Board: Workflow" onChange={() => toast.info('Only one board is available in this prototype.')} options={['Board: Workflow']} />
            <FilterSelect value={`Sort: ${sort}`} onChange={(value) => setSort(value.replace('Sort: ', ''))} options={['Sort: Priority', 'Sort: Due Date']} />
            <div className="inline-flex h-10 overflow-hidden rounded-button border border-border-default bg-white">
              <button className="grid w-10 place-items-center bg-primary text-white" aria-label="Kanban view active"><KanbanSquare size={17} strokeWidth={1.5} /></button>
              <button className="grid w-10 place-items-center text-primary hover:bg-navy-50" aria-label="Open list view" onClick={() => navigate('/tasks/task-board/list-view')}><List size={17} strokeWidth={1.5} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto pb-2">
        <div className="grid min-w-[1480px] grid-cols-5 gap-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.stage}
              column={column}
              tasks={filteredTasks.filter((task) => task.stage === column.stage)}
              onOpenTask={openTask}
            />
          ))}
        </div>
      </section>

      <BoardInsights onFilter={(nextFilter) => {
        if (nextFilter === 'blocked') setRisk('Critical');
        if (nextFilter === 'evidence') setEvidence('Incomplete');
        if (nextFilter === 'overdue') setDueDate('Overdue');
        if (nextFilter === 'risk') setRisk('High');
        toast.info('Board filter applied');
      }} />
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
    <div className={`dq-card min-h-[124px] border-t-4 ${borderClass}`}>
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

function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative inline-flex h-10 min-w-[128px] items-center">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-button border-[1.5px] border-border-default bg-white px-3 pr-8 text-sm font-semibold text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown size={15} strokeWidth={1.5} className="pointer-events-none absolute right-3 text-text-muted" />
    </label>
  );
}

function KanbanColumn({ column, tasks, onOpenTask }: { column: typeof columns[number]; tasks: BoardTask[]; onOpenTask: (taskId: string) => void }) {
  const accent = {
    blue: 'border-t-info text-info-text bg-info-surface',
    green: 'border-t-success text-success-text bg-success-surface',
    orange: 'border-t-secondary text-secondary bg-orange-50',
    purple: 'border-t-[#7c3aed] text-[#6d28d9] bg-[#f3e8ff]',
  }[column.accent];
  const [borderClass, countTextClass, countBgClass] = accent.split(' ');
  return (
    <section className={`flex min-h-[620px] flex-col rounded-card border border-border-default border-t-4 bg-white shadow-sm ${borderClass}`}>
      <header className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-primary">{column.stage}</h2>
          <span className={`rounded-pill px-2.5 py-1 text-xs font-bold tabular-nums ${countBgClass} ${countTextClass}`}>{column.count}</span>
        </div>
        <button aria-label={`${column.stage} menu`} onClick={() => toast.info(`${column.stage} column menu opened`)} className="rounded-button p-1.5 text-text-muted hover:bg-surface hover:text-primary">
          <MoreHorizontal size={17} strokeWidth={1.5} />
        </button>
      </header>
      <div className="flex-1 space-y-3 bg-surface/40 p-3">
        {tasks.map((task) => <TaskCard key={task.id} task={task} onOpen={() => onOpenTask(task.id)} />)}
        {tasks.length === 0 && <div className="rounded-card border border-dashed border-border-default bg-white p-4 text-center text-sm text-text-muted">No tasks match filters</div>}
      </div>
      <button onClick={() => toast.success(`Add task to ${column.stage}`)} className="m-3 rounded-button border border-dashed border-border-default bg-white px-3 py-2 text-sm font-bold text-primary hover:bg-navy-50">
        + Add task
      </button>
    </section>
  );
}

function TaskCard({ task, onOpen }: { task: BoardTask; onOpen: () => void }) {
  const evidencePercent = Math.round((task.evidenceUploaded / task.evidenceRequired) * 100);
  const openFromKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };
  const metaClick = (event: MouseEvent<HTMLButtonElement>, label: string) => {
    event.stopPropagation();
    toast.info(`${label} opened for ${task.id}`);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={openFromKeyboard}
      className={`cursor-pointer rounded-card border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-50 hover:shadow-md ${task.blocker ? 'border-danger bg-danger-surface/40' : 'border-border-default'}`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-xs font-bold text-text-muted">{task.id}</div>
          <h3 className="mt-1 text-sm font-bold leading-5 text-primary">{task.title}</h3>
        </div>
        {task.blocker && <DqBadge label="Blocked" tone="danger" />}
      </div>
      <p className="line-clamp-2 text-xs leading-5 text-text-secondary">{task.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span title={task.ownerName} className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-white">{task.owner}</span>
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 rounded-pill bg-white px-2 py-1 text-xs font-bold text-primary ring-1 ring-border-default">
          <CalendarDays size={13} strokeWidth={1.5} /> {task.dueDate}
        </span>
        <span className="text-xs font-bold text-text-muted">{task.team}</span>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs font-bold text-primary">
          <span>Evidence</span>
          <span className="font-mono">{task.evidenceUploaded}/{task.evidenceRequired}</span>
        </div>
        <div className="h-1.5 rounded-full bg-border-subtle">
          <div className={`h-full rounded-full ${task.evidenceUploaded === task.evidenceRequired ? 'bg-success' : task.evidenceUploaded === 0 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${evidencePercent}%` }} />
        </div>
      </div>
      {task.nextAction && (
        <div className="mt-3 rounded-button bg-navy-50 px-3 py-2 text-xs font-semibold text-primary">
          Next Action: <span className={task.blocker ? 'text-danger' : 'text-secondary'}>{task.nextAction}</span>
        </div>
      )}
      <footer className="mt-3 flex items-center justify-between gap-2 border-t border-border-subtle pt-3 text-xs font-bold text-text-muted">
        <button onClick={(event) => metaClick(event, 'Checklist')} className="inline-flex items-center gap-1 hover:text-primary"><CheckSquare size={14} strokeWidth={1.5} /> {task.checklistDone}/{task.checklistTotal}</button>
        <button onClick={(event) => metaClick(event, 'Comments')} className="inline-flex items-center gap-1 hover:text-primary"><MessageSquare size={14} strokeWidth={1.5} /> {task.comments}</button>
        <button onClick={(event) => metaClick(event, 'Evidence')} className="inline-flex items-center gap-1 hover:text-primary"><Paperclip size={14} strokeWidth={1.5} /> {task.attachments}</button>
        {task.blocker && <button onClick={(event) => metaClick(event, 'Blocker')} className="inline-flex items-center gap-1 text-danger hover:text-danger"><AlertTriangle size={14} strokeWidth={1.5} /> Risk</button>}
      </footer>
    </div>
  );
}

function BoardInsights({ onFilter }: { onFilter: (filter: 'overdue' | 'blocked' | 'evidence' | 'risk') => void }) {
  const insights = [
    { label: 'Overdue Tasks', value: '9', text: 'Tasks past due date', link: 'View overdue', filter: 'overdue' as const },
    { label: 'Blocked Tasks', value: '6', text: 'Waiting on resolution', link: 'View blocked', filter: 'blocked' as const },
    { label: 'Evidence Gaps', value: '17', text: 'Missing or incomplete', link: 'View evidence', filter: 'evidence' as const },
    { label: 'SLA At Risk', value: '8', text: 'At risk of breach', link: 'View at risk', filter: 'risk' as const },
  ];
  return (
    <section className="mt-5 rounded-card border border-border-default bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="flex min-w-[250px] items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-button bg-info-surface text-info-text"><BarChart3 size={20} strokeWidth={1.5} /></span>
          <div>
            <h2 className="dq-card-title">Board Insights</h2>
            <p className="text-sm text-text-muted">Real-time summary of your board</p>
          </div>
        </div>
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {insights.map((insight) => (
            <div key={insight.label} className="rounded-card border border-border-subtle bg-surface px-4 py-3">
              <div className="text-2xl font-bold tabular-nums text-primary">{insight.value}</div>
              <div className="mt-1 text-sm font-bold text-primary">{insight.label}</div>
              <div className="text-xs text-text-muted">{insight.text}</div>
              <button onClick={() => onFilter(insight.filter)} className="mt-2 text-xs font-bold text-info-text hover:text-primary">{insight.link}</button>
            </div>
          ))}
        </div>
        <DqButton variant="outline" onClick={() => toast.info('Board report opened')} className="shrink-0">
          View Full Report <ExternalLink size={15} strokeWidth={1.5} />
        </DqButton>
      </div>
    </section>
  );
}
