import React, { useEffect, useState } from 'react';
import { noop } from '../utils/noop';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
const mockDecisions = [{
  id: 'DEC-3',
  title: 'Adopt new intake card pattern',
  session: 'Sprint Planning',
  ownerUserId: 'USR-003',
  date: 'Today'
}, {
  id: 'DEC-4',
  title: 'Delay SLA rule change',
  session: 'Blocker Triage',
  ownerUserId: 'USR-003',
  date: 'Yesterday'
}];
export function SessionDecisionsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Decision',
    accessor: (row: any) => <span className="font-medium text-[#111118]">{row.title}</span>
  }, {
    header: 'Source Session',
    accessor: (row: any) => <span className="text-sm text-[#5F607F]">{row.session}</span>
  }, {
    header: 'Recorded By',
    accessor: (row: any) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'Date',
    accessor: (row: any) => <span className="text-sm text-[#5F607F]">{row.date}</span>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Working Sessions" title="Decisions" purpose="Log of formal decisions agreed upon during working sessions.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockDecisions} onRowClick={noop} />
      </div>
    </RolePageScaffold>;
}