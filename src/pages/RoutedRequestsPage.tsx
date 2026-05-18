import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const ROUTED_REQUESTS = [{
  id: 'REQ-2004',
  title: 'Platform Support',
  category: 'Platform Support',
  owner: 'USR-006',
  status: 'Routed',
  sla: 'At Risk'
}, {
  id: 'REQ-2008',
  title: 'Access Provisioning',
  category: 'IT & Access',
  owner: 'USR-007',
  status: 'In Progress',
  sla: 'On Track'
}];
export function RoutedRequestsPage() {
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
    header: 'Category',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.category}</span>
  }, {
    header: 'Fulfilment Owner',
    accessor: (row: any) => <OwnerBadge userId={row.owner} />
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'SLA',
    accessor: (row: any) => <SlaBadge state={row.sla} />
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success(`Ping owner for ${row.id}`);
    }} className="text-sm font-medium text-primary hover:text-navy-800">
          Ping Owner
        </button>
  }];
  return <RolePageScaffold eyebrow="Support Operations" title="Routed Requests" purpose="Monitor requests assigned to fulfilment owners across units." loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={ROUTED_REQUESTS} onRowClick={(row) => toast.success(`View details for ${row.id}`)} emptyMessage="No routed requests found." />
      </div>
    </RolePageScaffold>;
}