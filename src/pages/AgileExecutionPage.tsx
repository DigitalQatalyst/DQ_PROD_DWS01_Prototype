import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { getTasks } from '../services/platform.service';
import type { Task } from '../types/platform';
import { toast } from 'sonner';
import { AlertTriangle, Bell, ShieldAlert } from 'lucide-react';
export function AgileExecutionPage() {
  const [activeTab, setActiveTab] = useState('Flow Health');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tabs = ['Flow Health', 'Blockers', 'Missing Updates', 'Missing Evidence', 'Closure Quality'];
  useEffect(() => {
    getTasks().then((allTasks) => {
      // Filter for team TM-001 (eCom.DXP Squad)
      setTasks(allTasks.filter((t) => t.teamId === 'TM-001'));
    });
  }, []);
  const blockedCount = tasks.filter((t) => t.status === 'Blocked').length;
  const missingUpdateCount = tasks.filter((t) => t.status === 'Missing Update').length;
  const closureRiskCount = tasks.filter((t) => t.evidenceState === 'Missing' || t.evidenceState === 'Partial').length;
  const handleReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Reminder sent in prototype mode');
  };
  const handleEscalate = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Escalation created in prototype mode');
  };
  const columns = [{
    header: 'ID',
    accessor: (row: Task) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: Task) => <span className="font-medium">{row.title}</span>
  }, {
    header: 'Owner',
    accessor: (row: Task) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'Status',
    accessor: (row: Task) => <StatusPill status={row.status} />
  }, {
    header: 'Issue',
    accessor: (row: Task) => {
      if (row.status === 'Blocked') return <span className="text-xs text-danger font-medium">Blocked</span>;
      if (row.status === 'Missing Update') return <span className="text-xs text-warning-text font-medium">
              Stale Update
            </span>;
      if (row.evidenceState === 'Missing') return <span className="text-xs text-danger font-medium">No Evidence</span>;
      return <span className="text-xs text-text-muted">None</span>;
    }
  }, {
    header: 'Action',
    accessor: (row: Task) => <div className="flex items-center gap-3">
          <button onClick={handleReminder} className="text-text-muted hover:text-primary transition-colors" title="Send Reminder">
            <Bell size={16} />
          </button>
          <button onClick={handleEscalate} className="text-text-muted hover:text-danger transition-colors" title="Escalate">
            <ShieldAlert size={16} />
          </button>
        </div>
  }];
  const hygieneTasks = tasks.filter((t) => t.status === 'Blocked' || t.status === 'Missing Update' || t.evidenceState === 'Missing');
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Agile Execution
        </h1>
        <p className="text-text-secondary">
          Monitor flow health, resolve blockers, and enforce task hygiene.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Flow Health" value="At Risk" status="danger" />
        <KpiTile label="Blockers" value={blockedCount.toString()} status="danger" />
        <KpiTile label="Missing Updates" value={missingUpdateCount.toString()} status="warning" />
        <KpiTile label="Closure Risks" value={closureRiskCount.toString()} status="warning" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {activeTab === 'Flow Health' && <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface rounded-card border border-border-default p-4">
                <h3 className="text-sm font-semibold text-success mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" /> Healthy
                </h3>
                <div className="space-y-3">
                  {tasks.filter((t) => t.status === 'In Progress' && t.slaState === 'On Track').map((t) => <div key={t.id} onClick={() => setSelectedTask(t)} className="bg-white p-3 rounded border border-border-subtle shadow-sm cursor-pointer hover:border-border-strong">
                        <div className="flex justify-between items-start mb-2">
                          <MonoId value={t.id} />
                          <StatusPill status={t.status} />
                        </div>
                        <p className="text-sm font-medium text-primary mb-3">
                          {t.title}
                        </p>
                        <OwnerBadge userId={t.ownerUserId} />
                      </div>)}
                </div>
              </div>
              <div className="bg-surface rounded-card border border-border-default p-4">
                <h3 className="text-sm font-semibold text-warning-text mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning" /> Watch
                </h3>
                <div className="space-y-3">
                  {tasks.filter((t) => t.status === 'Missing Update' || t.slaState === 'At Risk').map((t) => <div key={t.id} onClick={() => setSelectedTask(t)} className="bg-white p-3 rounded border border-border-subtle shadow-sm cursor-pointer hover:border-border-strong">
                        <div className="flex justify-between items-start mb-2">
                          <MonoId value={t.id} />
                          <StatusPill status={t.status} />
                        </div>
                        <p className="text-sm font-medium text-primary mb-3">
                          {t.title}
                        </p>
                        <OwnerBadge userId={t.ownerUserId} />
                      </div>)}
                </div>
              </div>
              <div className="bg-surface rounded-card border border-border-default p-4">
                <h3 className="text-sm font-semibold text-danger mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-danger" />{' '}
                  Intervention Needed
                </h3>
                <div className="space-y-3">
                  {tasks.filter((t) => t.status === 'Blocked' || t.slaState === 'Breached').map((t) => <div key={t.id} onClick={() => setSelectedTask(t)} className="bg-white p-3 rounded border border-danger/30 shadow-sm cursor-pointer hover:border-danger">
                        <div className="flex justify-between items-start mb-2">
                          <MonoId value={t.id} />
                          <StatusPill status={t.status} />
                        </div>
                        <p className="text-sm font-medium text-primary mb-3">
                          {t.title}
                        </p>
                        <OwnerBadge userId={t.ownerUserId} />
                      </div>)}
                </div>
              </div>
            </div>}

          {activeTab !== 'Flow Health' && <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-subtle">
                <h2 className="text-lg font-semibold text-primary">
                  Hygiene Issues
                </h2>
              </div>
              <DataTable columns={columns} rows={hygieneTasks} onRowClick={setSelectedTask} />
            </div>}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-secondary" />
              Reminder Prompts
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              You have {missingUpdateCount} tasks missing updates and{' '}
              {closureRiskCount} tasks missing evidence.
            </p>
            <button onClick={handleReminder} className="w-full py-2.5 bg-primary text-white font-semibold text-sm rounded-button hover:bg-navy-800 transition-colors flex items-center justify-center gap-2">
              <Bell size={16} />
              Send Bulk Reminder
            </button>
          </div>
        </div>
      </div>

      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>;
}