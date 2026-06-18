import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { DqButton } from '../components/DqButton';
import { assignedTasks } from '../mocks/assignedTasks.mock';
import {
  focusTodayItems,
  myWorkKpis,
  quickAccessLinks,
  recentActivityItems,
} from '../mocks/myWork.mock';
import type {
  AssignedTask,
  AssignedTaskPriority,
  AssignedTaskStatus,
} from '../types/assignedTask';

const TABS = ['All Tasks', 'Due Today', 'Due This Week', 'Overdue', 'Blocked'] as const;
type TabId = (typeof TABS)[number];

const PAGE_SIZE = 10;
const TOTAL_TASKS = 24;

const PRIORITY_OPTIONS: AssignedTaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUS_OPTIONS: AssignedTaskStatus[] = [
  'In Progress',
  'Needs Evidence',
  'Blocked',
  'Overdue',
  'Pending Review',
  'Ready for Closure',
];

const STATUS_TEXT_CLASS: Record<AssignedTaskStatus, string> = {
  'In Progress': 'text-info-text',
  'Needs Evidence': 'text-warning-text',
  Blocked: 'text-text-muted',
  Overdue: 'text-danger-text',
  'Pending Review': 'text-warning-text',
  'Ready for Closure': 'text-success-text',
};

type EditableTaskField = 'priority' | 'status' | 'nextAction';

export function MyWorkPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('All Tasks');
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [taskRows, setTaskRows] = useState<AssignedTask[]>(() =>
    assignedTasks.map((task) => ({ ...task })),
  );

  const filteredTasks = useMemo(() => {
    let tasks = taskRows;

    if (activeTab === 'Due Today') {
      tasks = tasks.filter((task) => task.dueLabel === 'Today');
    } else if (activeTab === 'Due This Week') {
      tasks = tasks.filter((task) => task.dueLabel !== 'Overdue');
    } else if (activeTab === 'Overdue') {
      tasks = tasks.filter(
        (task) => task.dueLabel === 'Overdue' || task.status === 'Overdue',
      );
    } else if (activeTab === 'Blocked') {
      tasks = tasks.filter((task) => task.status === 'Blocked');
    }

    const query = search.toLowerCase().trim();
    if (!query) return tasks;
    return tasks.filter((task) =>
      `${task.id} ${task.title} ${task.context} ${task.nextAction}`
        .toLowerCase()
        .includes(query),
    );
  }, [activeTab, search, taskRows]);

  const openTask = (taskId: string) =>
    navigate(`/tasks/my-work/assigned-tasks/${taskId}`);

  const updateTask = (
    taskId: string,
    field: EditableTaskField,
    value: string,
    notify = true,
  ) => {
    setTaskRows((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, [field]: value } : task,
      ),
    );
    if (notify) toast.success('Task updated');
  };

  const toggleSelected = (taskId: string) => {
    setSelectedRows((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTab('All Tasks');
    setCurrentPage(1);
  };

  return (
    <div className="w-full px-5 py-6 pb-12 sm:px-6 lg:px-8">
      <header className="mb-6">
        <Breadcrumb items={['Tasks', 'My Work']} />
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="dq-page-title">My Work</h1>
            <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-text-secondary">
              Your tasks, prioritised. Focus on what matters most and keep your
              work moving.
            </p>
          </div>
          <DqButton
            variant="navy"
            onClick={() =>
              toast.info('Draft task note opened for this prototype session.')
            }
            className="shrink-0"
          >
            <FileText size={17} strokeWidth={1.5} />
            Draft Task Note
            <ChevronDown size={15} strokeWidth={1.5} />
          </DqButton>
        </div>
      </header>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1">
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {myWorkKpis.map((kpi) => (
              <SummaryCard key={kpi.label} {...kpi} />
            ))}
          </section>

          <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
            <div
              className="dq-tabs flex overflow-x-auto px-4"
              role="tablist"
              aria-label="Task filters"
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`dq-tab whitespace-nowrap ${activeTab === tab ? 'dq-tab-active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle p-4">
              <div className="relative min-w-[220px] flex-1">
                <Search
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks..."
                  className="dq-input pl-9"
                />
              </div>
              {['Status', 'Priority', 'Due Date'].map((label) => (
                <FilterSelect key={label} label={label} />
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="px-2 text-sm font-medium text-secondary hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
              >
                Clear
              </button>
            </div>

            <TaskTable
              tasks={filteredTasks}
              selectedRows={selectedRows}
              onToggleSelected={toggleSelected}
              onOpenTask={openTask}
              onUpdateTask={updateTask}
            />

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle px-4 py-3 text-sm font-normal text-text-muted">
              <span>
                Showing 1 to {Math.min(filteredTasks.length, PAGE_SIZE)} of{' '}
                {TOTAL_TASKS} tasks
              </span>
              <div className="flex items-center gap-2">
                <PagerButton
                  label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                </PagerButton>
                {[1, 2, 3].map((page) => (
                  <PagerButton
                    key={page}
                    label={`Page ${page}`}
                    active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PagerButton>
                ))}
                <span className="px-2">...</span>
                <PagerButton
                  label="Page 5"
                  onClick={() => setCurrentPage(5)}
                >
                  5
                </PagerButton>
                <PagerButton
                  label="Next page"
                  disabled={currentPage >= 5}
                  onClick={() => setCurrentPage((page) => Math.min(5, page + 1))}
                >
                  <ChevronRight size={16} strokeWidth={1.5} />
                </PagerButton>
              </div>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-button border border-border-default px-3 text-sm font-medium text-primary"
              >
                {PAGE_SIZE} / page <ChevronDown size={14} strokeWidth={1.5} />
              </button>
            </div>
          </section>
        </div>

        <aside className="w-full shrink-0 space-y-6 xl:w-[300px]">
          <SidebarPanel title="Focus Today" actionLabel="View all" onAction={() => navigate('/tasks/my-work/my-due-actions')}>
            <ul className="space-y-3">
              {focusTodayItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => navigate(item.route)}
                    className="flex w-full items-start gap-3 rounded-button p-2 text-left transition hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-primary">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-text-muted">
                        {item.id}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-medium text-text-secondary">
                      {item.priority}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </SidebarPanel>

          <SidebarPanel title="Recent Activity">
            <ul className="space-y-4">
              {recentActivityItems.map((item) => (
                <li key={item.id} className="border-b border-border-subtle pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-primary">{item.action}</p>
                  <p className="mt-1 text-sm font-normal text-text-secondary">{item.detail}</p>
                  <p className="mt-1 text-xs font-normal text-text-muted">{item.timestamp}</p>
                </li>
              ))}
            </ul>
          </SidebarPanel>

          <SidebarPanel title="Quick Access">
            <ul className="space-y-1">
              {quickAccessLinks.map(({ label, route, icon: Icon }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => navigate(route)}
                    className="flex w-full items-center justify-between rounded-button px-2 py-2.5 text-sm font-medium text-primary transition hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon size={16} strokeWidth={1.5} className="text-text-muted" />
                      {label}
                    </span>
                    <ChevronRight size={16} strokeWidth={1.5} className="text-text-muted" />
                  </button>
                </li>
              ))}
            </ul>
          </SidebarPanel>
        </aside>
      </div>
    </div>
  );
}

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav
      className="mb-3 flex items-center gap-2 text-sm font-normal text-text-muted"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <span key={item} className="inline-flex items-center gap-2">
          {index > 0 && <span>/</span>}
          <span
            className={
              index === items.length - 1 ? 'font-medium text-primary' : undefined
            }
          >
            {item}
          </span>
        </span>
      ))}
    </nav>
  );
}

function SummaryCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-card border border-border-default bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-primary">{value}</p>
      <p className="mt-1 text-xs font-normal text-text-muted">{subtitle}</p>
    </div>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded-button border-[1.5px] border-border-default bg-white px-3 text-sm font-medium text-primary hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
    >
      {label}
      <ChevronDown size={15} strokeWidth={1.5} className="text-text-muted" />
    </button>
  );
}

function stopRowNav(event: React.MouseEvent | React.FocusEvent) {
  event.stopPropagation();
}

function TaskTable({
  tasks,
  selectedRows,
  onToggleSelected,
  onOpenTask,
  onUpdateTask,
}: {
  tasks: AssignedTask[];
  selectedRows: string[];
  onToggleSelected: (taskId: string) => void;
  onOpenTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, field: EditableTaskField, value: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[720px] w-full border-collapse text-left text-sm font-normal">
        <thead>
          <tr className="border-b border-border-subtle bg-surface">
            {[
              '',
              'Task ID',
              'Task',
              'Priority',
              'Status',
              'Due Date',
              'Next Action',
              '',
            ].map((header) => (
              <th
                key={header || 'select'}
                className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {tasks.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-12 text-center text-sm font-normal text-text-muted"
              >
                No tasks match this view.
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              const selected = selectedRows.includes(task.id);
              return (
                <tr
                  key={task.id}
                  className={`border-l-4 transition hover:bg-navy-50 ${
                    selected
                      ? 'border-secondary bg-orange-50/60'
                      : 'border-transparent'
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${task.id}`}
                      checked={selected}
                      onChange={() => onToggleSelected(task.id)}
                      className="h-4 w-4 rounded border-border-default text-secondary focus:ring-secondary/30"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-medium text-text-secondary">
                    {task.id}
                  </td>
                  <td className="max-w-[min(280px,32vw)] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onOpenTask(task.id)}
                      className="block w-full truncate text-left text-sm font-medium text-primary hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
                      title={task.title}
                    >
                      {task.title}
                    </button>
                  </td>
                  <td
                    className="whitespace-nowrap px-4 py-3"
                    onClick={stopRowNav}
                    onFocus={stopRowNav}
                  >
                    <InlineSelect
                      ariaLabel={`Priority for ${task.id}`}
                      value={task.priority}
                      options={PRIORITY_OPTIONS}
                      onChange={(value) => {
                        if (value !== task.priority) {
                          onUpdateTask(task.id, 'priority', value);
                        }
                      }}
                    />
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={stopRowNav}
                    onFocus={stopRowNav}
                  >
                    <InlineSelect
                      ariaLabel={`Status for ${task.id}`}
                      value={task.status}
                      options={STATUS_OPTIONS}
                      textClassName={STATUS_TEXT_CLASS[task.status]}
                      onChange={(value) => {
                        if (value !== task.status) {
                          onUpdateTask(task.id, 'status', value);
                        }
                      }}
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="font-mono text-sm text-primary">
                      {task.dueDate}
                    </div>
                    <div
                      className={`text-xs ${
                        task.dueLabel === 'Overdue'
                          ? 'font-medium text-danger'
                          : task.dueLabel === 'Today'
                            ? 'font-medium text-secondary'
                            : 'text-text-muted'
                      }`}
                    >
                      {task.dueLabel}
                    </div>
                  </td>
                  <td
                    className="max-w-[min(200px,24vw)] px-4 py-3"
                    onClick={stopRowNav}
                    onFocus={stopRowNav}
                  >
                    <InlineTextInput
                      ariaLabel={`Next action for ${task.id}`}
                      value={task.nextAction}
                      onCommit={(value) =>
                        onUpdateTask(task.id, 'nextAction', value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-label={`Open ${task.id}`}
                      onClick={() => onOpenTask(task.id)}
                      className="rounded-button p-1 text-text-muted transition hover:bg-navy-50 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
                    >
                      <ChevronRight size={18} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

const inlineFieldClass =
  'w-full min-w-0 cursor-pointer rounded-input border border-transparent bg-transparent px-1.5 py-1 text-sm font-normal transition hover:border-border-default hover:bg-white focus:border-border-default focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-1';

function InlineSelect({
  ariaLabel,
  value,
  options,
  textClassName = 'text-text-secondary',
  onChange,
}: {
  ariaLabel: string;
  value: string;
  options: readonly string[];
  textClassName?: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
        onChange(event.target.value)
      }
      className={`${inlineFieldClass} ${textClassName}`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function InlineTextInput({
  ariaLabel,
  value,
  onCommit,
}: {
  ariaLabel: string;
  value: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onCommit(trimmed);
    else setDraft(value);
  };

  return (
    <input
      type="text"
      aria-label={ariaLabel}
      value={draft}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        setDraft(event.target.value)
      }
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.currentTarget.blur();
        }
        if (event.key === 'Escape') {
          setDraft(value);
          event.currentTarget.blur();
        }
      }}
      className={`${inlineFieldClass} truncate text-text-secondary`}
    />
  );
}

function PagerButton({
  children,
  label,
  active,
  disabled,
  onClick,
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-9 min-w-9 place-items-center rounded-button border text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-primary bg-primary text-white'
          : 'border-border-default bg-white text-primary hover:bg-navy-50'
      }`}
    >
      {children}
    </button>
  );
}

function SidebarPanel({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-border-default bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="dq-card-title">{title}</h2>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-medium text-secondary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
