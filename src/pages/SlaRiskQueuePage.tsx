import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const RISK_REQUESTS = [{
  id: 'REQ-2001',
  title: 'Task / Workflow Support',
  owner: 'USR-007',
  status: 'Pending Info',
  sla: 'At Risk',
  timeRemaining: '2 hours'
}, {
  id: 'REQ-2004',
  title: 'Platform Support',
  owner: 'USR-006',
  status: 'Routed',
  sla: 'At Risk',
  timeRemaining: '4 hours'
}, {
  id: 'REQ-2009',
  title: 'Urgent Access Request',
  owner: 'USR-007',
  status: 'In Progress',
  sla: 'Breached',
  timeRemaining: '-1 hour'
}];
export function SlaRiskQueuePage() {
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
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.owner} />
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'SLA State',
    accessor: (row: any) => <SlaBadge state={row.sla} />
  }, {
    header: 'Time Remaining',
    accessor: (row: any) => <span className={`text-sm font-medium ${row.sla === 'Breached' ? 'text-danger' : 'text-warning-text'}`}>
          {row.timeRemaining}
        </span>
  }, {
    header: 'Action',
    accessor: (row: any) => <div className="flex gap-2">
          <button onClick={(e) => {
        e.stopPropagation();
        toast.success(`Escalated ${row.id}`);
      }} className="px-2 py-1 bg-danger-surface text-danger text-xs font-medium rounded hover:bg-danger/20 transition-colors">
            Escalate
          </button>
          <button onClick={(e) => {
        e.stopPropagation();
        toast.success(`Follow up sent for ${row.id}`);
      }} className="px-2 py-1 bg-surface text-text-primary text-xs font-medium rounded border border-border-strong hover:bg-border-subtle transition-colors">
            Follow up
          </button>
        </div>
  }];
  return <RolePageScaffold eyebrow="Support Operations" title="SLA Risk Queue" purpose="Prioritise requests that are at risk of breaching or have breached SLA." loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={RISK_REQUESTS} onRowClick={(row) => toast.success(`View details for ${row.id}`)} emptyMessage="No requests at SLA risk." />
      </div>
    </RolePageScaffold>;
}