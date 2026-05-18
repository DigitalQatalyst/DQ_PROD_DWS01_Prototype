import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { toast } from 'sonner';
const mockTasks = [{
  id: 'TSK-1001',
  title: 'Build Stage 0 orientation shell',
  status: 'In Progress',
  priority: 'High',
  slaState: 'On Track',
  dueDate: '2026-05-13',
  ownerUserId: 'USR-001'
}, {
  id: 'TSK-1002',
  title: 'Finalise request intake card pattern',
  status: 'Blocked',
  priority: 'High',
  slaState: 'At Risk',
  dueDate: '2026-05-14',
  ownerUserId: 'USR-001'
}];
export function AssignedWorkPage() {
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
    header: 'Priority',
    accessor: (row: any) => <span className="text-xs font-medium">{row.priority}</span>
  }, {
    header: 'SLA',
    accessor: (row: any) => <SlaBadge state={row.slaState} />
  }, {
    header: 'Due Date',
    accessor: (row: any) => <span className="text-sm font-mono">{row.dueDate}</span>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Workspace" title="Assigned Work" purpose="Tasks explicitly assigned to you for execution.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockTasks} onRowClick={setSelectedTask} />
      </div>
      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </RolePageScaffold>;
}