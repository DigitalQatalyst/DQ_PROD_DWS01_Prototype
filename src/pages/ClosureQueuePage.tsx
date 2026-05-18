import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const CLOSURE_REQUESTS = [{
  id: 'REQ-2010',
  title: 'Software Installation',
  requester: 'USR-001',
  owner: 'USR-007',
  status: 'Review Needed',
  quality: 'Complete'
}, {
  id: 'REQ-2011',
  title: 'Data Export',
  requester: 'USR-003',
  owner: 'USR-006',
  status: 'Review Needed',
  quality: 'Partial'
}];
export function ClosureQueuePage() {
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
    header: 'Fulfilment Owner',
    accessor: (row: any) => <OwnerBadge userId={row.owner} />
  }, {
    header: 'Evidence Quality',
    accessor: (row: any) => <span className={`text-sm font-medium ${row.quality === 'Complete' ? 'text-success' : 'text-warning-text'}`}>
          {row.quality}
        </span>
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success(`Request ${row.id} closed`);
    }} className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded hover:bg-success/90 transition-colors">
          Close request
        </button>
  }];
  return <RolePageScaffold eyebrow="Support Operations" title="Closure Queue" purpose="Review fulfilled requests and ensure closure quality before finalising." loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={CLOSURE_REQUESTS} onRowClick={(row) => toast.success(`View details for ${row.id}`)} emptyMessage="No requests awaiting closure review." />
      </div>
    </RolePageScaffold>;
}