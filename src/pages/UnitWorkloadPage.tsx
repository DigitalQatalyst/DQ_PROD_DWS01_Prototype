import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { OwnerBadge } from '../components/OwnerBadge';
const mockWorkload = [{
  team: 'eCom.DXP Squad',
  lead: 'USR-003',
  activeTasks: 12,
  overdue: 2,
  blockers: 3
}, {
  team: 'Platform Core',
  lead: 'USR-006',
  activeTasks: 8,
  overdue: 0,
  blockers: 1
}];
export function UnitWorkloadPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'Team',
    accessor: (row: any) => <span className="font-bold text-[#111118]">{row.team}</span>
  }, {
    header: 'Team Lead',
    accessor: (row: any) => <OwnerBadge userId={row.lead} />
  }, {
    header: 'Active Tasks',
    accessor: (row: any) => <span className="text-sm font-medium">{row.activeTasks}</span>
  }, {
    header: 'Overdue',
    accessor: (row: any) => <span className={`text-sm font-medium ${row.overdue > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
          {row.overdue}
        </span>
  }, {
    header: 'Blockers',
    accessor: (row: any) => <span className={`text-sm font-medium ${row.blockers > 0 ? 'text-[#D97706]' : 'text-[#16A34A]'}`}>
          {row.blockers}
        </span>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Unit Visibility" title="Unit Workload" purpose="Aggregate workload and capacity metrics across all teams in the unit.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockWorkload} onRowClick={() => {}} />
      </div>
    </RolePageScaffold>;
}