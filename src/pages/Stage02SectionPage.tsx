import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  type LucideIcon
} from 'lucide-react';
import { useViewingMode } from '../context/ViewingModeContext';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import { getStage02Dataset, type Stage02Section, type WorkItem } from '../mocks/stage02.mock';
import { StatusPill } from '../components/StatusPill';

const sectionCopy: Record<Stage02Section, { title: string; description: string; icon: LucideIcon }> = {
  tasks: {
    title: 'Tasks',
    description: 'Review assigned tasks, priorities, due dates, owners, and next actions.',
    icon: Search
  },
  workflows: {
    title: 'Workflows',
    description: 'Track workflow stage, required inputs, owners, and completion health.',
    icon: SlidersHorizontal
  },
  trackers: {
    title: 'Trackers',
    description: 'Monitor tracker records assigned to or owned by the associate.',
    icon: Filter
  },
  performance: {
    title: 'Performance',
    description: 'Lightweight personal performance preview for the current evaluation cycle.',
    icon: Search
  },
  governance: {
    title: 'Governance',
    description: 'Review governance actions, control checks, compliance tasks, and escalations.',
    icon: SlidersHorizontal
  },
  knowledge: {
    title: 'Knowledge',
    description: 'Find workspace guidance, operating playbooks, and DQ knowledge assets.',
    icon: BookOpen
  },
  people: {
    title: 'People',
    description: 'Find owners, reviewers, contacts, and support channels for DWS work.',
    icon: Search
  },
  reports: {
    title: 'Reports',
    description: 'Open performance, governance, and AI-generated status reports.',
    icon: Filter
  }
};

function DetailDrawer({ item, onClose }: { item: WorkItem | null; onClose: () => void }) {
  if (!item) return null;
  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[200] h-screen w-full max-w-md overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{item.id}</div>
            <h2 className="mt-1 text-xl font-bold text-primary">{item.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary" aria-label="Close drawer">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap gap-2">
            <StatusPill status={item.status} />
            <StatusPill status={item.priority} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Owner</div>
              <div className="mt-1 font-semibold text-primary">{item.owner}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Due date</div>
              <div className="mt-1 font-semibold text-primary">{item.dueDate}</div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary">Description</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{item.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary">Related work items</h3>
            <div className="mt-2 space-y-2">
              {item.related.map((related) => (
                <div key={related} className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary">{related}</div>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-4">
            <h3 className="text-sm font-bold text-primary">Recommended next action</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{item.nextAction}</p>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Stage02SectionPage({ section }: { section: Stage02Section }) {
  const { mode } = useViewingMode();
  const { activeRole } = useWorkspaceRole();
  const dataset = useMemo(() => getStage02Dataset(mode, activeRole), [mode, activeRole]);
  const config = sectionCopy[section];
  const rows = dataset.sections[section];
  const [filter, setFilter] = useState('All');
  const [detail, setDetail] = useState<WorkItem | null>(null);
  const Icon = config.icon;
  const visibleRows = filter === 'All' ? rows : rows.filter((row) => row.status === filter || row.type === filter);
  const filters = ['All', ...Array.from(new Set(rows.flatMap((row) => [row.status, row.type]))).slice(0, 4)];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-8 py-7">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <Icon size={21} />
          </div>
          <h1 className="text-3xl font-bold text-primary">{config.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{config.description}</p>
        </div>
        <div className="rounded-card border border-border-subtle bg-white px-4 py-3 text-right shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Active scope</div>
          <div className="mt-1 text-sm font-bold text-primary">{activeRole}</div>
          <div className="text-xs text-text-muted">{mode === 'first-time' ? 'New Joiner' : 'Returning User'}</div>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-text-muted">Records</div>
          <div className="mt-2 text-3xl font-bold text-primary">{rows.length}</div>
        </div>
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-text-muted">Requires action</div>
          <div className="mt-2 text-3xl font-bold text-primary">{rows.filter((row) => ['Due Today', 'Overdue', 'Awaiting Input', 'At Risk'].includes(row.status)).length}</div>
        </div>
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-text-muted">High priority</div>
          <div className="mt-2 text-3xl font-bold text-primary">{rows.filter((row) => row.priority === 'High').length}</div>
        </div>
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-text-muted">On track</div>
          <div className="mt-2 text-3xl font-bold text-primary">{rows.filter((row) => row.status === 'On Track').length}</div>
        </div>
      </section>

      <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((name) => (
              <button
                key={name}
                onClick={() => setFilter(name)}
                className={`rounded-pill px-3 py-1.5 text-xs font-bold transition-colors ${filter === name ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>
                {name}
              </button>
            ))}
          </div>
          <div className="flex h-10 items-center gap-2 rounded-input border border-border-default bg-white px-3 text-sm text-text-muted">
            <Search size={16} />
            Search {config.title.toLowerCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {visibleRows.map((row) => (
            <button key={row.id} onClick={() => setDetail(row)} className="rounded-card border border-border-subtle bg-white p-4 text-left transition hover:border-border-default hover:bg-surface">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{row.id} · {row.type}</div>
                  <h2 className="mt-1 text-base font-bold text-primary">{row.title}</h2>
                  {row.subtitle && <p className="mt-1 text-sm text-text-muted">{row.subtitle}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill status={row.status} />
                  <StatusPill status={row.priority} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-text-secondary md:grid-cols-3">
                <span>Owner: <strong className="text-primary">{row.owner}</strong></span>
                <span>Due: <strong className="text-primary">{row.dueDate}</strong></span>
                <span>{row.meta || row.nextAction}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <DetailDrawer item={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
