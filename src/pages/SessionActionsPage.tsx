import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { StatusPill } from '../components/StatusPill';
const mockActions = [{
  id: 'ACT-1',
  title: 'Update API schema',
  session: 'Sprint Planning',
  status: 'Pending',
  ownerUserId: 'USR-001'
}, {
  id: 'ACT-2',
  title: 'Review security guidelines',
  session: 'Blocker Triage',
  status: 'Complete',
  ownerUserId: 'USR-002'
}];
export function SessionActionsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Action Item',
    accessor: (row: any) => <span className="font-medium text-[#111118]">{row.title}</span>
  }, {
    header: 'Source Session',
    accessor: (row: any) => <span className="text-sm text-[#5F607F]">{row.session}</span>
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Working Sessions" title="Actions & Follow-ups" purpose="Track action items extracted from working sessions.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockActions} onRowClick={() => {}} />
      </div>
    </RolePageScaffold>;
}