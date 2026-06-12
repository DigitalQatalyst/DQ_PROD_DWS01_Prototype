import React, { useEffect, useState } from 'react';
import { noop } from '../utils/noop';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { SlaBadge } from '../components/SlaBadge';
const mockSlaItems = [{
  id: 'TSK-1004',
  title: 'Prepare governance dashboard copy',
  type: 'Task',
  slaState: 'Breached',
  ownerUserId: 'USR-003'
}, {
  id: 'REQ-2001',
  title: 'Task / Workflow Support',
  type: 'Request',
  slaState: 'At Risk',
  ownerUserId: 'USR-007'
}];
export function SlaTrendsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: any) => <span className="font-medium text-[#111118]">{row.title}</span>
  }, {
    header: 'Type',
    accessor: (row: any) => <span className="text-sm text-[#5F607F]">{row.type}</span>
  }, {
    header: 'SLA Status',
    accessor: (row: any) => <SlaBadge state={row.slaState} />
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.ownerUserId} />
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Unit Visibility" title="SLA Trends" purpose="Monitor SLA adherence and identify systemic bottlenecks.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] p-6 shadow-sm mb-6">
        <h3 className="text-sm font-bold text-[#111118] mb-4">
          30-Day SLA Attainment Trend
        </h3>
        <div className="h-48 flex items-end gap-2">
          {[88, 90, 85, 82, 78, 85, 92].map((val, i) => <div key={i} className="flex-1 bg-[#F3F5FD] rounded-t relative group">
              <div className={`absolute bottom-0 w-full rounded-t transition-all ${val < 85 ? 'bg-[#D97706]' : 'bg-[#16A34A]'}`} style={{
            height: `${val}%`
          }} />
            </div>)}
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#111118] mb-4">
        At Risk & Breached Items
      </h3>
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockSlaItems} onRowClick={noop} />
      </div>
    </RolePageScaffold>;
}