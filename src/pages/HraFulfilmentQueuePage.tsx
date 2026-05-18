import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { SlaBadge } from '../components/SlaBadge';
import { StatusPill } from '../components/StatusPill';
import { toast } from 'sonner';
const mockQueue = [{
  id: 'TSK-1005',
  title: 'Align HRA onboarding request flow',
  ownerUserId: 'USR-005',
  slaState: 'On Track',
  status: 'In Progress'
}];
export function HraFulfilmentQueuePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'Task ID',
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
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success('Fulfilment evidence attached.');
    }} className="text-xs font-medium text-[#030F35] hover:underline">
          Attach Evidence
        </button>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="HRA Workflow" title="HRA Fulfilment Queue" purpose="Tasks assigned to HRA for execution and fulfilment.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockQueue} onRowClick={() => {}} />
      </div>
    </RolePageScaffold>;
}