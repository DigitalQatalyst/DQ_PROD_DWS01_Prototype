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
  task: 'TSK-1002'
}, {
  id: 'BLK-102',
  severity: 'Medium',
  owner: 'USR-001',
  age: '1 day',
  desc: 'Evidence not attached',
  task: 'TSK-1004'
}, {
  id: 'BLK-103',
  severity: 'High',
  owner: 'USR-004',
  age: '3 days',
  desc: 'Approval owner unavailable',
  task: 'TSK-1003'
}];
export function MyBlockersPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const handleAction = (action: string) => toast.success(`${action} simulated.`);
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
    header: 'Linked Task',
    accessor: (row: any) => <MonoId value={row.task} />
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.owner} />
  }, {
    header: 'Age',
    accessor: (row: any) => <span className="text-sm text-[#5F607F]">{row.age}</span>
  }, {
    header: 'Actions',
    accessor: (row: any) => <div className="flex gap-2">
          <button onClick={(e) => {
        e.stopPropagation();
        handleAction('Review blocker');
      }} className="text-xs font-medium text-[#030F35] hover:underline">
            Review
          </button>
          <button onClick={(e) => {
        e.stopPropagation();
        handleAction('Escalate blocker');
      }} className="text-xs font-medium text-[#DC2626] hover:underline">
            Escalate
          </button>
        </div>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="My Daily Work" title="My Blockers" purpose="Active impediments requiring your attention or escalation." primaryAction={{
    label: 'Raise Blocker',
    onClick: () => handleAction('Raise blocker dialog opened')
  }}>
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockBlockers} onRowClick={() => handleAction('Blocker details opened')} />
      </div>
    </RolePageScaffold>;
}