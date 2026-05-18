import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const mockBlockers = [{
  id: 'BLK-101',
  severity: 'High',
  owner: 'USR-002',
  age: '2 days',
  desc: 'Missing fulfilment rule',
  task: 'TSK-1002',
  slaImpact: 'High'
}, {
  id: 'BLK-102',
  severity: 'Medium',
  owner: 'USR-001',
  age: '1 day',
  desc: 'Evidence not attached',
  task: 'TSK-1004',
  slaImpact: 'Low'
}, {
  id: 'BLK-103',
  severity: 'High',
  owner: 'USR-004',
  age: '3 days',
  desc: 'Approval owner unavailable',
  task: 'TSK-1003',
  slaImpact: 'Critical'
}];
export function BlockerReviewPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'Blocker ID',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Severity',
    accessor: (row: any) => <span className={`text-xs font-bold uppercase tracking-wider ${row.severity === 'High' ? 'text-[#DC2626]' : 'text-[#D97706]'}`}>
          {row.severity}
        </span>
  }, {
    header: 'Description',
    accessor: (row: any) => <span className="text-sm font-medium text-[#111118]">{row.desc}</span>
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.owner} />
  }, {
    header: 'Age',
    accessor: (row: any) => <span className="text-sm text-[#5F607F]">{row.age}</span>
  }, {
    header: 'SLA Impact',
    accessor: (row: any) => <span className="text-sm font-medium">{row.slaImpact}</span>
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success('Blocker escalated.');
    }} className="text-xs font-medium text-[#DC2626] hover:underline">
          Escalate
        </button>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Agile Execution" title="Blocker Review" purpose="Review and escalate active impediments across the team.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockBlockers} onRowClick={() => toast.success('Blocker details opened')} />
      </div>
    </RolePageScaffold>;
}