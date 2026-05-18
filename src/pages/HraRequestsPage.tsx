import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { EntityDrawer } from '../components/EntityDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
const mockRequests = [{
  id: 'REQ-2002',
  title: 'New Joiner Onboarding',
  category: 'HRA Requests',
  status: 'In Review',
  slaState: 'On Track',
  requesterUserId: 'USR-001'
}];
export function HraRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
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
    header: 'Category',
    accessor: (row: any) => <span className="text-sm text-[#5F607F]">{row.category}</span>
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'SLA',
    accessor: (row: any) => <SlaBadge state={row.slaState} />
  }, {
    header: 'Requester',
    accessor: (row: any) => <OwnerBadge userId={row.requesterUserId} />
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="HRA Workflow" title="HRA Requests" purpose="Manage incoming requests for onboarding, transitions, and policy exceptions.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockRequests} onRowClick={setSelectedRequest} />
      </div>
      {selectedRequest && <EntityDrawer type="request" data={selectedRequest} onClose={() => setSelectedRequest(null)} />}
    </RolePageScaffold>;
}