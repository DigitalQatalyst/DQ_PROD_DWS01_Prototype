import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const ALL_REQUESTS = [{
  id: 'REQ-2001',
  title: 'Task / Workflow Support',
  status: 'Pending Info',
  sla: 'At Risk',
  owner: 'USR-007'
}, {
  id: 'REQ-2003',
  title: 'IT & Access Request',
  status: 'New',
  sla: 'On Track',
  owner: 'USR-007'
}, {
  id: 'REQ-2004',
  title: 'Platform Support',
  status: 'Routed',
  sla: 'At Risk',
  owner: 'USR-006'
}, {
  id: 'REQ-2005',
  title: 'Knowledge / Content Request',
  status: 'Closed',
  sla: 'Met',
  owner: 'USR-006'
}];
export function SupportRequestStatusPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <span className="font-mono text-xs">{row.id}</span>
  }, {
    header: 'Title',
    accessor: (row: any) => <span className="font-medium">{row.title}</span>
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'SLA',
    accessor: (row: any) => <SlaBadge state={row.sla} />
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.owner} />
  }];
  return <RolePageScaffold eyebrow="Support Operations" title="Request Status Overview" purpose="Complete visibility of all support requests across the platform." tabs={['All', 'New', 'Routed', 'Pending Info', 'Closed']} activeTab="All" onTabChange={() => {}} loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={ALL_REQUESTS} onRowClick={(row) => toast.success(`View details for ${row.id}`)} emptyMessage="No requests found." />
      </div>
    </RolePageScaffold>;
}