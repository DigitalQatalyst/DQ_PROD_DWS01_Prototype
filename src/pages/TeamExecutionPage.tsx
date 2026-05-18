import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { getTasks, getApprovals, getUsers } from '../services/platform.service';
import type { Task, Approval, User } from '../types/platform';
import { toast } from 'sonner';
import { Plus, Users, ShieldAlert } from 'lucide-react';
export function TeamExecutionPage() {
  const [activeTab, setActiveTab] = useState('Workload');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const tabs = ['Workload', 'Overdue', 'Blockers', 'Approvals', 'Closure Quality'];
  useEffect(() => {
    Promise.all([getTasks(), getApprovals(), getUsers()]).then(([t, a, u]) => {
      // Filter for team TM-001
      setTasks(t.filter((task) => task.teamId === 'TM-001'));
      setApprovals(a);
      setUsers(u.filter((user) => user.teamId === 'TM-001'));
    });
  }, []);
  const teamWorkload = tasks.filter((t) => t.status !== 'Closed').length;
  const overdueWork = tasks.filter((t) => t.slaState === 'Breached').length;
  const blockers = tasks.filter((t) => t.status === 'Blocked').length;
  const readyForReview = tasks.filter((t) => t.status === 'Review Needed').length;
  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Task assigned in prototype mode');
    setShowAssignModal(false);
  };
  const handleReassign = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Owner reassigned in prototype mode');
  };
  const handleEscalate = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Escalation created in prototype mode');
  };
  const workloadColumns = [{
    header: 'ID',
    accessor: (row: Task) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: Task) => <span className="font-medium truncate max-w-[200px] block">
          {row.title}
        </span>
  }, {
    header: 'Owner',
    accessor: (row: Task) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'Status',
    accessor: (row: Task) => <StatusPill status={row.status} />
  }, {
    header: 'Due Date',
    accessor: (row: Task) => <span className="text-xs">{row.dueDate}</span>
  }, {
    header: 'Action',
    accessor: (row: Task) => <div className="flex items-center gap-3">
          <button onClick={handleReassign} className="text-xs font-medium text-secondary hover:underline">
            Reassign
          </button>
          <button onClick={handleEscalate} className="text-text-muted hover:text-danger transition-colors" title="Escalate">
            <ShieldAlert size={14} />
          </button>
        </div>
  }];
  // Calculate workload per user
  const userWorkload = users.map((u) => ({
    user: u,
    taskCount: tasks.filter((t) => t.ownerUserId === u.id && t.status !== 'Closed').length,
    blockedCount: tasks.filter((t) => t.ownerUserId === u.id && t.status === 'Blocked').length
  }));
  return <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Team Execution
          </h1>
          <p className="text-text-secondary">
            Manage team workload, approvals, and execution quality.
          </p>
        </div>
        <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-button font-medium hover:bg-navy-800 transition-colors">
          <Plus size={16} />
          Assign Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Team Workload" value={teamWorkload.toString()} status="info" />
        <KpiTile label="Overdue Work" value={overdueWork.toString()} status="danger" />
        <KpiTile label="Blockers" value={blockers.toString()} status="danger" />
        <KpiTile label="Ready for Review" value={readyForReview.toString()} status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-lg font-semibold text-primary">
                Team Workload
              </h2>
            </div>
            <DataTable columns={workloadColumns} rows={tasks.filter((t) => t.status !== 'Closed')} onRowClick={setSelectedTask} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users size={16} className="text-secondary" />
              Owner Capacity
            </h3>
            <div className="space-y-4">
              {userWorkload.map(({
              user,
              taskCount,
              blockedCount
            }) => <div key={user.id} className="flex items-center justify-between p-3 bg-surface rounded border border-border-subtle">
                  <OwnerBadge userId={user.id} />
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">
                      {taskCount} tasks
                    </div>
                    {blockedCount > 0 && <div className="text-xs text-danger">
                        {blockedCount} blocked
                      </div>}
                  </div>
                </div>)}
            </div>
          </div>

          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Pending Approvals
            </h3>
            <div className="space-y-3">
              {approvals.filter((a) => a.status === 'Pending').map((a) => <div key={a.id} className="p-3 border border-border-subtle rounded hover:border-border-strong transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-text-muted">
                        {a.type}
                      </span>
                      <MonoId value={a.id} />
                    </div>
                    <p className="text-sm font-medium text-primary mb-2">
                      Linked to {a.linkedTaskId}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={(e) => {
                  e.stopPropagation();
                  toast.success('Approved');
                }} className="flex-1 py-1 bg-success-surface text-success-text text-xs font-semibold rounded">
                        Approve
                      </button>
                      <button onClick={(e) => {
                  e.stopPropagation();
                  toast.success('Returned');
                }} className="flex-1 py-1 bg-danger-surface text-danger-text text-xs font-semibold rounded">
                        Return
                      </button>
                    </div>
                  </div>)}
            </div>
          </div>
        </div>
      </div>

      {selectedTask && <DetailPanel entity={selectedTask} type="task" onClose={() => setSelectedTask(null)} />}

      {showAssignModal && <>
          <div className="fixed inset-0 bg-navy-950/20 backdrop-blur-sm z-[250]" onClick={() => setShowAssignModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-modal shadow-xl border border-border-default p-6 w-full max-w-lg z-[300]">
            <h3 className="text-lg font-bold text-primary mb-6">Assign Task</h3>

            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Task Title
                </label>
                <input type="text" className="w-full h-10 px-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Owner
                  </label>
                  <select className="w-full h-10 px-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy" required>
                    <option value="">Select owner...</option>
                    {users.map((u) => <option key={u.id} value={u.id}>
                        {u.name}
                      </option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Due Date
                  </label>
                  <input type="date" className="w-full h-10 px-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Expected Output
                </label>
                <textarea rows={2} className="w-full p-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy resize-none" required />
              </div>

              <div className="bg-surface p-3 rounded border border-border-subtle">
                <p className="text-xs font-medium text-text-muted mb-2">
                  Checklist Preview (from template)
                </p>
                <ul className="text-xs text-text-secondary space-y-1 pl-4 list-disc">
                  <li>Define scope</li>
                  <li>Draft content</li>
                  <li>Attach evidence</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface rounded-button transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-navy-800 rounded-button transition-colors">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </>}
    </div>;
}