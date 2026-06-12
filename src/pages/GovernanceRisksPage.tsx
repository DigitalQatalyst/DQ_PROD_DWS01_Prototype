import React, { useEffect, useState } from 'react';
import { noop } from '../utils/noop';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const mockRisks = [{
  id: 'TSK-1001',
  type: 'Missing Evidence',
  severity: 'High',
  ownerUserId: 'USR-001'
}, {
  id: 'APR-3001',
  type: 'Overdue Approval',
  severity: 'Medium',
  ownerUserId: 'USR-003'
}];
export function GovernanceRisksPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'Linked Entity',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Risk Type',
    accessor: (row: any) => <span className="font-medium text-[#111118]">{row.type}</span>
  }, {
    header: 'Severity',
    accessor: (row: any) => <span className={`text-xs font-bold uppercase tracking-wider ${row.severity === 'High' ? 'text-[#DC2626]' : 'text-[#D97706]'}`}>
          {row.severity}
        </span>
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success('Governance risk opened.');
    }} className="text-xs font-medium text-[#030F35] hover:underline">
          Open Risk
        </button>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Unit Visibility" title="Governance Risks" purpose="Identify compliance gaps, missing evidence, and audit exceptions.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockRisks} onRowClick={noop} />
      </div>
    </RolePageScaffold>;
}