import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { StatusPill } from '../components/StatusPill';
const mockTasks = [{
  id: 'TSK-1003',
  title: 'Review closure quality model',
  ownerUserId: 'USR-002',
  status: 'Ready for review',
  score: '95%'
}, {
  id: 'TSK-1001',
  title: 'Build Stage 0 orientation shell',
  ownerUserId: 'USR-001',
  status: 'Not ready for closure',
  score: '60%'
}];
export function ClosureQualityPage() {
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
    header: 'Closure Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'Quality Score',
    accessor: (row: any) => <span className="text-sm font-bold">{row.score}</span>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Team Execution" title="Closure Quality" purpose="Review tasks submitted for closure and monitor overall team quality scores.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockTasks} onRowClick={setSelectedTask} />
      </div>
      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </RolePageScaffold>;
}