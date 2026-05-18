import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const INITIATIVES = [{
  id: 'OUT-6001',
  title: 'Enterprise Execution Health',
  owner: 'USR-008',
  status: 'On Track',
  progress: 65,
  linkedTasks: 12
}, {
  id: 'OUT-6002',
  title: 'Platform Governance Rollout',
  owner: 'USR-006',
  status: 'At Risk',
  progress: 40,
  linkedTasks: 8
}, {
  id: 'OUT-6003',
  title: 'Support SLA Optimisation',
  owner: 'USR-007',
  status: 'On Track',
  progress: 85,
  linkedTasks: 5
}];
export function StrategicInitiativesPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <span className="font-mono text-xs">{row.id}</span>
  }, {
    header: 'Initiative',
    accessor: (row: any) => <span className="font-medium">{row.title}</span>
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.owner} />
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'Progress',
    accessor: (row: any) => <div className="flex items-center gap-2 w-32">
          <div className="flex-1 bg-surface rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{
          width: `${row.progress}%`
        }} />
          </div>
          <span className="text-xs font-medium">{row.progress}%</span>
        </div>
  }, {
    header: 'Linked Work',
    accessor: (row: any) => <span className="text-sm text-text-secondary">
          {row.linkedTasks} tasks
        </span>
  }];
  return <RolePageScaffold eyebrow="Enterprise Execution" title="Strategic Initiative Progress" purpose="Track high-level outcomes and their linked execution work." kpis={[{
    label: 'Active Initiatives',
    value: '14',
    status: 'info'
  }, {
    label: 'On Track',
    value: '11',
    status: 'success'
  }, {
    label: 'At Risk',
    value: '3',
    status: 'warning'
  }]} loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={INITIATIVES} onRowClick={(row) => toast.success(`View details for ${row.id}`)} emptyMessage="No strategic initiatives found." />
      </div>
    </RolePageScaffold>;
}