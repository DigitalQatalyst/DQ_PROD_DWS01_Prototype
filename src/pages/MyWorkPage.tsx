import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { getTasks, getRequests, getKnowledgeAssets } from '../services/platform.service';
import type { Task, KnowledgeAsset } from '../types/platform';
import { toast } from 'sonner';
import { BookOpen, AlertTriangle, FileText } from 'lucide-react';
export function MyWorkPage() {
  const [activeTab, setActiveTab] = useState('Today');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeAsset[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const tabs = ['Today', 'This Week', 'Blocked', 'Awaiting Review', 'Requests'];
  useEffect(() => {
    Promise.all([getTasks(), getRequests(), getKnowledgeAssets()]).then(([t, r, k]) => {
      // Filter for USR-001 (Amina Hassan - Associate)
      setTasks(t.filter((task) => task.ownerUserId === 'USR-001'));
      setRequests(r.filter((req) => req.requesterUserId === 'USR-001' && req.status !== 'Closed'));
      setKnowledge(k);
    });
  }, []);
  const assignedTasks = tasks.length;
  const dueToday = tasks.filter((t) => t.dueDate === '2026-05-13').length;
  const blockedTasks = tasks.filter((t) => t.status === 'Blocked').length;
  const pendingRequests = requests.length;
  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'Today') return t.dueDate === '2026-05-13';
    if (activeTab === 'Blocked') return t.status === 'Blocked';
    if (activeTab === 'Awaiting Review') return t.status === 'Review Needed';
    return true;
  });
  // Find knowledge linked to visible tasks
  const visibleTaskIds = filteredTasks.map((t) => t.id);
  const linkedKnowledge = knowledge.filter((k) => k.linkedTaskIds.some((id) => visibleTaskIds.includes(id)));
  const handleUpdateClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setSelectedTask(task);
    setShowUpdateModal(true);
  };
  const handleSaveUpdate = () => {
    toast.success('Progress update saved in prototype mode');
    setShowUpdateModal(false);
    setUpdateText('');
    setSelectedTask(null);
  };
  const columns = [{
    header: 'Task ID',
    accessor: (row: Task) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: Task) => <span className="font-medium">{row.title}</span>
  }, {
    header: 'Status',
    accessor: (row: Task) => <StatusPill status={row.status} />
  }, {
    header: 'SLA',
    accessor: (row: Task) => <SlaBadge state={row.slaState} />
  }, {
    header: 'Evidence',
    accessor: (row: Task) => <StatusPill status={row.evidenceState} />
  }, {
    header: 'Due Date',
    accessor: (row: Task) => <span className="text-xs">{row.dueDate}</span>
  }, {
    header: 'Action',
    accessor: (row: Task) => <button onClick={(e) => handleUpdateClick(e, row)} className="text-secondary hover:underline text-sm font-medium">
          Update
        </button>
  }];
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">My Work</h1>
        <p className="text-text-secondary">
          Your assigned tasks, pending requests, and required actions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Assigned Tasks" value={assignedTasks.toString()} status="info" />
        <KpiTile label="Due Today" value={dueToday.toString()} status="warning" />
        <KpiTile label="Blocked" value={blockedTasks.toString()} status="danger" />
        <KpiTile label="Pending Requests" value={pendingRequests.toString()} status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                Priority Task List
              </h2>
            </div>
            <div className="p-6">
              <DataTable columns={columns} rows={filteredTasks} onRowClick={setSelectedTask} emptyMessage="No tasks found for this view." />
            </div>
          </div>

          {linkedKnowledge.length > 0 && <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen size={16} />
                Knowledge in Work Context
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkedKnowledge.map((k) => <div key={k.id} className="p-4 bg-white rounded-card border border-border-default hover:shadow-sm cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-surface px-2 py-1 rounded">
                        {k.type}
                      </span>
                      <StatusPill status={k.status} />
                    </div>
                    <h4 className="font-semibold text-primary text-sm mb-1">
                      {k.title}
                    </h4>
                    <p className="text-xs text-text-muted">
                      Linked to {k.linkedTaskIds.length} visible tasks
                    </p>
                  </div>)}
              </div>
            </div>}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-warning-text" />
              Recent Alerts
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-warning-surface rounded border border-warning/20">
                <p className="text-sm font-medium text-warning-text mb-1">
                  Task Blocked
                </p>
                <p className="text-xs text-warning-text/80">
                  TSK-1002 is blocked waiting on REQ-2001.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={16} className="text-info-text" />
              Evidence Required
            </h3>
            <div className="space-y-4">
              {tasks.filter((t) => t.evidenceState === 'Missing' || t.evidenceState === 'Partial').map((t) => <div key={t.id} className="flex items-start justify-between p-3 bg-surface rounded border border-border-subtle">
                    <div>
                      <p className="text-sm font-medium text-primary truncate max-w-[180px]">
                        {t.title}
                      </p>
                      <p className="text-xs text-danger mt-1">
                        {t.evidenceState} Evidence
                      </p>
                    </div>
                    <button onClick={() => toast.success('Evidence attached in prototype mode')} className="text-xs font-medium text-secondary hover:underline">
                      Attach
                    </button>
                  </div>)}
            </div>
          </div>
        </div>
      </div>

      {selectedTask && !showUpdateModal && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}

      {showUpdateModal && selectedTask && <>
          <div className="fixed inset-0 bg-navy-950/20 backdrop-blur-sm z-[250]" onClick={() => setShowUpdateModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-modal shadow-xl border border-border-default p-6 w-full max-w-md z-[300]">
            <h3 className="text-lg font-bold text-primary mb-2">
              Update Progress
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Add a progress note for{' '}
              <span className="font-mono">{selectedTask.id}</span>
            </p>

            <textarea value={updateText} onChange={(e) => setUpdateText(e.target.value)} placeholder="What progress was made?" rows={4} className="w-full p-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy resize-none mb-4" />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface rounded-button transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveUpdate} disabled={!updateText.trim()} className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-navy-800 rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Save Update
              </button>
            </div>
          </div>
        </>}
    </div>;
}