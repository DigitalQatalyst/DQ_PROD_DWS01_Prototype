import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { getTasks } from '../services/platform.service';
import type { Task } from '../types/platform';
import { usePersona } from '../context/PersonaContext';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
export function MyTasksPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const {
    activePersona
  } = usePersona();
  const tabs = ['All', 'In Progress', 'Blocked', 'Missing Update', 'Review Needed', 'Closed'];
  useEffect(() => {
    getTasks().then((allTasks) => {
      // Filter based on persona scope
      // For prototype, we'll just show tasks related to their unit/team or owned by them
      let visibleTasks = allTasks;
      if (activePersona.id === 'associate') {
        visibleTasks = allTasks.filter((t) => t.ownerUserId === 'USR-001');
      } else if (activePersona.id === 'scrum-master' || activePersona.id === 'team-lead') {
        visibleTasks = allTasks.filter((t) => t.teamId === 'TM-001');
      }
      setTasks(visibleTasks);
    });
  }, [activePersona]);
  const filteredTasks = tasks.filter((t) => {
    const matchesTab = activeTab === 'All' || t.status === activeTab;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });
  const openTasks = tasks.filter((t) => t.status !== 'Closed').length;
  const blockedTasks = tasks.filter((t) => t.status === 'Blocked').length;
  const missingEvidence = tasks.filter((t) => t.evidenceState === 'Missing').length;
  const reviewReady = tasks.filter((t) => t.status === 'Review Needed').length;
  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    setActionMenuOpen(null);
    toast.success(`${action} action triggered in prototype mode`);
  };
  const columns = [{
    header: 'ID',
    accessor: (row: Task) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: Task) => <span className="font-medium truncate max-w-[200px] block" title={row.title}>
          {row.title}
        </span>
  }, {
    header: 'Owner',
    accessor: (row: Task) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'Status',
    accessor: (row: Task) => <StatusPill status={row.status} />
  }, {
    header: 'Priority',
    accessor: (row: Task) => <span className="text-xs font-medium">{row.priority}</span>
  }, {
    header: 'SLA',
    accessor: (row: Task) => <SlaBadge state={row.slaState} />
  }, {
    header: 'Checklist',
    accessor: (row: Task) => <span className="text-xs text-text-muted">
          {row.checklistDone}/{row.checklistTotal}
        </span>
  }, {
    header: 'Evidence',
    accessor: (row: Task) => <StatusPill status={row.evidenceState} />
  }, {
    header: 'Action',
    accessor: (row: Task) => <div className="relative">
          <button onClick={(e) => {
        e.stopPropagation();
        setActionMenuOpen(actionMenuOpen === row.id ? null : row.id);
      }} className="p-1.5 rounded hover:bg-border-subtle text-text-muted hover:text-primary transition-colors">
            <MoreHorizontal size={16} />
          </button>
          {actionMenuOpen === row.id && <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-card shadow-lg border border-border-default py-1 z-10">
              <button onClick={(e) => handleAction(e, 'Add update')} className="w-full text-left px-4 py-2 text-sm hover:bg-surface text-text-secondary">
                Add update
              </button>
              <button onClick={(e) => handleAction(e, 'Flag blocker')} className="w-full text-left px-4 py-2 text-sm hover:bg-surface text-text-secondary">
                Flag blocker
              </button>
              <button onClick={(e) => handleAction(e, 'Attach evidence')} className="w-full text-left px-4 py-2 text-sm hover:bg-surface text-text-secondary">
                Attach evidence
              </button>
              <button onClick={(e) => handleAction(e, 'Request review')} className="w-full text-left px-4 py-2 text-sm hover:bg-surface text-text-secondary">
                Request review
              </button>
            </div>}
        </div>
  }];
  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setActionMenuOpen(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Tasks</h1>
        <p className="text-text-secondary">
          Manage governed units of work, updates, and closure quality.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Open Tasks" value={openTasks.toString()} status="info" />
        <KpiTile label="Blocked Tasks" value={blockedTasks.toString()} status="danger" />
        <KpiTile label="Missing Evidence" value={missingEvidence.toString()} status="warning" />
        <KpiTile label="Closure Review Ready" value={reviewReady.toString()} status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} search={search} onSearchChange={setSearch} />

      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={filteredTasks} onRowClick={setSelectedTask} emptyMessage="No tasks found matching your criteria." />
      </div>

      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>;
}