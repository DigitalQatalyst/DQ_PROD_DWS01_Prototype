import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const NEW_REQUESTS = [{
  id: 'REQ-2003',
  title: 'IT & Access Request',
  category: 'Uncategorised',
  requester: 'USR-002',
  status: 'New',
  sla: 'On Track',
  submitted: '1 hour ago'
}, {
  id: 'REQ-2006',
  title: 'Software License Request',
  category: 'Uncategorised',
  requester: 'USR-004',
  status: 'New',
  sla: 'On Track',
  submitted: '2 hours ago'
}];
export function TriageNeededPage() {
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
    header: 'Requester',
    accessor: (row: any) => <OwnerBadge userId={row.requester} />
  }, {
    header: 'Submitted',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.submitted}</span>
  }, {
    header: 'SLA',
    accessor: (row: any) => <SlaBadge state={row.sla} />
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success(`Request ${row.id} routed to fulfilment owner`);
    }} className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-navy-800 transition-colors">
          Route request
        </button>
  }];
  return <RolePageScaffold eyebrow="Support Operations" title="Triage Needed" purpose="Categorise and route new requests to the correct fulfilment owners." loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={NEW_REQUESTS} onRowClick={(row) => toast.success(`View details for ${row.id}`)} emptyMessage="No requests awaiting triage." />
      </div>
    </RolePageScaffold>;
}