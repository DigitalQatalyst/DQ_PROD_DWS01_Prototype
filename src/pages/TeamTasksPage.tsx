import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
const mockTasks = [{
  id: 'TSK-1001',
  title: 'Build Stage 0 orientation shell',
  status: 'In Progress',
  slaState: 'On Track',
  closureQuality: 'Not ready for closure',
  ownerUserId: 'USR-001'
}, {
  id: 'TSK-1002',
  title: 'Finalise request intake card pattern',
  status: 'Blocked',
  slaState: 'At Risk',
  closureQuality: 'Not ready for closure',
  ownerUserId: 'USR-001'
}, {
  id: 'TSK-1003',
  title: 'Review closure quality model',
  status: 'Review Needed',
  slaState: 'On Track',
  closureQuality: 'Ready for review',
  ownerUserId: 'USR-002'
}];
export function TeamTasksPage() {
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
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'SLA',
    accessor: (row: any) => <SlaBadge state={row.slaState} />
  }, {
    header: 'Closure Quality',
    accessor: (row: any) => <StatusPill status={row.closureQuality} />
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Team Execution" title="Team Tasks" purpose="All active and recently closed tasks across your team.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockTasks} onRowClick={setSelectedTask} />
      </div>
      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </RolePageScaffold>;
}