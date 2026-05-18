import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { toast } from 'sonner';
const PERFORMANCE = [{
  unit: 'eCom.DXP',
  lead: 'Priya Nair',
  health: 'On Track',
  sla: '96%',
  closure: '89%',
  blocker: '1.1d'
}, {
  unit: 'Digital Platforms',
  lead: 'Omar Farouk',
  health: 'Watch',
  sla: '92%',
  closure: '85%',
  blocker: '1.8d'
}, {
  unit: 'Support Ops',
  lead: 'Brian Otieno',
  health: 'On Track',
  sla: '95%',
  closure: '92%',
  blocker: '0.8d'
}, {
  unit: 'HRA',
  lead: 'Grace Wanjiru',
  health: 'On Track',
  sla: '98%',
  closure: '95%',
  blocker: '0.5d'
}];
export function TeamUnitPerformancePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'Unit / Team',
    accessor: (row: any) => <span className="font-bold text-primary">{row.unit}</span>
  }, {
    header: 'Lead',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.lead}</span>
  }, {
    header: 'Overall Health',
    accessor: (row: any) => <span className={`px-2 py-1 text-xs font-medium rounded-pill ${row.health === 'On Track' ? 'bg-success-surface text-success' : 'bg-warning-surface text-warning-text'}`}>
          {row.health}
        </span>
  }, {
    header: 'SLA Met',
    accessor: (row: any) => <span className="text-sm font-medium">{row.sla}</span>
  }, {
    header: 'Closure Quality',
    accessor: (row: any) => <span className="text-sm font-medium">{row.closure}</span>
  }, {
    header: 'Avg Blocker Res',
    accessor: (row: any) => <span className="text-sm font-medium">{row.blocker}</span>
  }];
  return <RolePageScaffold eyebrow="Enterprise Execution" title="Team & Unit Performance" purpose="Compare execution metrics across all organisational units." loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={PERFORMANCE} onRowClick={(row) => toast.success(`View details for ${row.unit}`)} emptyMessage="No performance data found." />
      </div>
    </RolePageScaffold>;
}