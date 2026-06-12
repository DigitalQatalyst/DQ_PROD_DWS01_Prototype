import React, { useEffect, useState } from 'react';
import { noop } from '../utils/noop';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { EntityDrawer } from '../components/EntityDrawer';
import { toast } from 'sonner';
const REQUESTS = [{
  id: 'REQ-2001',
  title: 'Task / Workflow Support',
  category: 'Platform Support',
  requester: 'USR-001',
  owner: 'USR-007',
  status: 'Pending Info',
  sla: 'At Risk'
}, {
  id: 'REQ-2003',
  title: 'IT & Access Request',
  category: 'Access',
  requester: 'USR-002',
  owner: 'USR-007',
  status: 'New',
  sla: 'On Track'
}, {
  id: 'REQ-2004',
  title: 'Platform Support',
  category: 'Platform Support',
  requester: 'USR-003',
  owner: 'USR-007',
  status: 'Routed',
  sla: 'At Risk'
}];
export function CentralSupportQueuePage() {
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
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
    header: 'Requester',
    accessor: (row: any) => <OwnerBadge userId={row.requester} />
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
      toast.success(`Open request ${row.id}`);
    }} className="text-sm font-medium text-primary hover:text-navy-800">
          Open
        </button>
  }];
  return <>
      <RolePageScaffold eyebrow="Support Operations" title="Central Support Queue" purpose="Manage incoming requests, triage, and routing." primaryAction={{
      label: 'Create Request',
      onClick: () => toast.success('Create request dialog opened')
    }} kpis={[{
      label: 'New Requests',
      value: '12',
      status: 'warning'
    }, {
      label: 'SLA At Risk',
      value: '5',
      status: 'danger'
    }, {
      label: 'Pending Info',
      value: '8',
      status: 'info'
    }]} tabs={['All Active', 'New', 'In Progress', 'Pending Info']} activeTab="All Active" onTabChange={noop} loading={loading}>
        <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
          <DataTable columns={columns} rows={REQUESTS} onRowClick={(row) => setSelectedRequest({
          id: row.id,
          title: row.title,
          status: row.status,
          ownerId: row.owner,
          summary: `Category: ${row.category}\nRequester: ${row.requester}\nSLA: ${row.sla}`,
          timeline: [{
            time: '2026-05-13 09:00',
            action: 'Request created'
          }, {
            time: '2026-05-13 09:15',
            action: 'Assigned to Support'
          }]
        })} emptyMessage="No requests found." />
        </div>
      </RolePageScaffold>

      {selectedRequest && <EntityDrawer type="request" data={selectedRequest} onClose={() => setSelectedRequest(null)} />}
    </>;
}