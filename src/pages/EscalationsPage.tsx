import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { EntityDrawer } from '../components/EntityDrawer';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
const mockEscalations = [{
  id: 'ESC-9001',
  linkedEntity: 'BLK-101',
  severity: 'High',
  age: '1 day',
  ownerUserId: 'USR-003'
}, {
  id: 'ESC-9002',
  linkedEntity: 'REQ-2001',
  severity: 'Medium',
  age: '2 days',
  ownerUserId: 'USR-004'
}];
export function EscalationsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedEscalation, setSelectedEscalation] = useState<any>(null);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Linked Entity',
    accessor: (row: any) => <MonoId value={row.linkedEntity} />
  }, {
    header: 'Severity',
    accessor: (row: any) => <span className={`text-xs font-bold uppercase tracking-wider ${row.severity === 'High' ? 'text-[#DC2626]' : 'text-[#D97706]'}`}>
          {row.severity}
        </span>
  }, {
    header: 'Age',
    accessor: (row: any) => <span className="text-sm text-[#5F607F]">{row.age}</span>
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
  return <RolePageScaffold eyebrow="Workflow" title="Escalations" purpose="Track and resolve items escalated beyond normal SLA thresholds.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockEscalations} onRowClick={setSelectedEscalation} />
      </div>
      {selectedEscalation && <EntityDrawer type="escalation" data={selectedEscalation} onClose={() => setSelectedEscalation(null)} />}
    </RolePageScaffold>;
}