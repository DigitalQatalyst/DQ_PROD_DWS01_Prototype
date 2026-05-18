import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { OwnerBadge } from '../components/OwnerBadge';
import { StatusPill } from '../components/StatusPill';
import { ArrowRight } from 'lucide-react';
const mockTransitions = [{
  id: 'TRN-1',
  user: 'USR-001',
  currentRole: 'Associate',
  targetRole: 'Scrum Master',
  status: 'Pending Readiness'
}];
export function RoleTransitionPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'Employee',
    accessor: (row: any) => <OwnerBadge userId={row.user} />
  }, {
    header: 'Transition',
    accessor: (row: any) => <div className="flex items-center gap-2 text-sm font-medium text-[#111118]">
          {row.currentRole} <ArrowRight size={14} className="text-[#5F607F]" />{' '}
          {row.targetRole}
        </div>
  }, {
    header: 'Readiness Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="HRA Workflow" title="Role Transition" purpose="Manage employees moving between roles and ensure required readiness checks.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockTransitions} onRowClick={() => {}} />
      </div>
    </RolePageScaffold>;
}