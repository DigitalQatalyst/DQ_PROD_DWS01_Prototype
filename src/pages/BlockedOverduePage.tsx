import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { StatusPill } from '../components/StatusPill';
import { toast } from 'sonner';
const mockItems = [{
  id: 'TSK-1002',
  title: 'Finalise request intake card pattern',
  type: 'Blocked',
  ownerUserId: 'USR-001',
  age: '2 days'
}, {
  id: 'TSK-1004',
  title: 'Prepare governance dashboard copy',
  type: 'Overdue',
  ownerUserId: 'USR-003',
  age: '1 day'
}];
export function BlockedOverduePage() {
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
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'Issue Type',
    accessor: (row: any) => <StatusPill status={row.type} />
  }, {
    header: 'Age',
    accessor: (row: any) => <span className="text-sm font-medium">{row.age}</span>
  }, {
    header: 'Action',
    accessor: (row: any) => <div className="flex gap-3">
          <button onClick={(e) => {
        e.stopPropagation();
        toast.success('Reassign dialog opened.');
      }} className="text-xs font-medium text-[#030F35] hover:underline">
            Reassign
          </button>
          <button onClick={(e) => {
        e.stopPropagation();
        toast.success('Escalated.');
      }} className="text-xs font-medium text-[#DC2626] hover:underline">
            Escalate
          </button>
        </div>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Team Execution" title="Blocked & Overdue Work" purpose="Items requiring immediate intervention to restore flow.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockItems} onRowClick={setSelectedTask} />
      </div>
      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </RolePageScaffold>;
}