import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { toast } from 'sonner';
const mockClosureTasks = [{
  id: 'TSK-1003',
  title: 'Review closure quality model',
  status: 'Review Needed',
  closureQuality: 'Ready for review',
  score: '95%'
}, {
  id: 'TSK-1001',
  title: 'Build Stage 0 orientation shell',
  status: 'In Progress',
  closureQuality: 'Not ready for closure',
  score: '60%'
}];
export function ClosureRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: any) => <span className="font-medium text-[#111118]">{row.title}</span>
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'Closure Quality',
    accessor: (row: any) => <StatusPill status={row.closureQuality} />
  }, {
    header: 'Score',
    accessor: (row: any) => <span className="text-sm font-medium">{row.score}</span>
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success('Closure review requested.');
    }} disabled={row.closureQuality !== 'Ready for review'} className={`text-xs font-medium ${row.closureQuality === 'Ready for review' ? 'text-[#030F35] hover:underline' : 'text-[#5F607F] opacity-50 cursor-not-allowed'}`}>
          Request Review
        </button>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Workspace" title="Closure Requests" purpose="Manage tasks approaching completion and request formal closure reviews.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockClosureTasks} onRowClick={setSelectedTask} />
      </div>
      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </RolePageScaffold>;
}