import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const SLA_RISKS = [{
  id: 'TSK-1004',
  title: 'Prepare governance dashboard copy',
  type: 'Task',
  owner: 'USR-003',
  unit: 'eCom.DXP',
  sla: 'Breached'
}, {
  id: 'REQ-2001',
  title: 'Task / Workflow Support',
  type: 'Request',
  owner: 'USR-007',
  unit: 'Support',
  sla: 'At Risk'
}, {
  id: 'TSK-1002',
  title: 'Finalise request intake card pattern',
  type: 'Task',
  owner: 'USR-001',
  unit: 'eCom.DXP',
  sla: 'At Risk'
}];
export function SlaExposurePage() {
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
    header: 'Type',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.type}</span>
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.owner} />
  }, {
    header: 'Unit',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.unit}</span>
  }, {
    header: 'SLA State',
    accessor: (row: any) => <SlaBadge state={row.sla} />
  }];
  return <RolePageScaffold eyebrow="Enterprise Execution" title="SLA Exposure" purpose="Identify enterprise-wide SLA risks and breached commitments." kpis={[{
    label: 'Total Active',
    value: '55',
    status: 'info'
  }, {
    label: 'On Track',
    value: '45',
    status: 'success'
  }, {
    label: 'At Risk',
    value: '8',
    status: 'warning'
  }, {
    label: 'Breached',
    value: '2',
    status: 'danger'
  }]} loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={SLA_RISKS} onRowClick={(row) => toast.success(`View details for ${row.id}`)} emptyMessage="No SLA risks found." />
      </div>
    </RolePageScaffold>;
}