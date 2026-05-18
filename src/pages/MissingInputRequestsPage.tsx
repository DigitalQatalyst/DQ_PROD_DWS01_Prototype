import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const PENDING_REQUESTS = [{
  id: 'REQ-2001',
  title: 'Task / Workflow Support',
  requester: 'USR-001',
  missing: 'Workflow ID',
  status: 'Pending Info',
  waitingSince: '1 day ago'
}, {
  id: 'REQ-2007',
  title: 'Hardware Request',
  requester: 'USR-003',
  missing: 'Manager Approval',
  status: 'Pending Info',
  waitingSince: '3 days ago'
}];
export function MissingInputRequestsPage() {
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
    header: 'Missing Input',
    accessor: (row: any) => <span className="text-sm font-medium text-warning-text">
          {row.missing}
        </span>
  }, {
    header: 'Waiting Since',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.waitingSince}</span>
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success(`Information request sent for ${row.id}`);
    }} className="px-3 py-1.5 bg-white border border-border-strong text-text-primary text-xs font-medium rounded hover:bg-surface transition-colors">
          Request information
        </button>
  }];
  return <RolePageScaffold eyebrow="Support Operations" title="Missing Input Requests" purpose="Follow up on requests blocked by missing information or approvals." loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={PENDING_REQUESTS} onRowClick={(row) => toast.success(`View details for ${row.id}`)} emptyMessage="No requests pending information." />
      </div>
    </RolePageScaffold>;
}