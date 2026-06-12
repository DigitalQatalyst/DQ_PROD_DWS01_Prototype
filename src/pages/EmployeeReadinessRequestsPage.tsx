import React, { useEffect, useState } from 'react';
import { noop } from '../utils/noop';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { StatusPill } from '../components/StatusPill';
import { toast } from 'sonner';
const mockRequests = [{
  id: 'REQ-2002',
  title: 'New Joiner Onboarding',
  user: 'USR-001',
  status: 'In Review'
}];
export function EmployeeReadinessRequestsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'Request ID',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: any) => <span className="font-medium text-[#111118]">{row.title}</span>
  }, {
    header: 'Employee',
    accessor: (row: any) => <OwnerBadge userId={row.user} />
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success('Readiness updated.');
    }} className="text-xs font-medium text-[#030F35] hover:underline">
          Update Readiness
        </button>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="HRA Workflow" title="Employee Readiness Requests" purpose="Requests awaiting HRA confirmation of employee readiness.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockRequests} onRowClick={noop} />
      </div>
    </RolePageScaffold>;
}