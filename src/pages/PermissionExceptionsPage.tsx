import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const EXCEPTIONS = [{
  id: 'EXC-001',
  user: 'USR-001',
  role: 'Support (Temporary)',
  reason: 'Covering leave',
  expiry: '2026-05-20',
  status: 'Active'
}, {
  id: 'EXC-002',
  user: 'USR-003',
  role: 'Admin (Elevated)',
  reason: 'System migration',
  expiry: '2026-05-15',
  status: 'Active'
}, {
  id: 'EXC-003',
  user: 'USR-007',
  role: 'HRA (Temporary)',
  reason: 'Onboarding surge',
  expiry: '2026-05-10',
  status: 'Expired'
}];
export function PermissionExceptionsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <span className="font-mono text-xs">{row.id}</span>
  }, {
    header: 'User',
    accessor: (row: any) => <OwnerBadge userId={row.user} />
  }, {
    header: 'Exception Role',
    accessor: (row: any) => <span className="text-sm font-medium">{row.role}</span>
  }, {
    header: 'Reason',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.reason}</span>
  }, {
    header: 'Expiry',
    accessor: (row: any) => <span className="text-sm font-mono text-text-secondary">
          {row.expiry}
        </span>
  }, {
    header: 'Status',
    accessor: (row: any) => <span className={`px-2 py-1 text-xs font-medium rounded-pill ${row.status === 'Active' ? 'bg-warning-surface text-warning-text' : 'bg-surface text-text-muted'}`}>
          {row.status}
        </span>
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success(`Revoke exception ${row.id}`);
    }} className="text-sm font-medium text-danger hover:text-danger/80" disabled={row.status === 'Expired'}>
          {row.status === 'Active' ? 'Revoke' : ''}
        </button>
  }];
  return <RolePageScaffold eyebrow="Administration" title="Permission Exceptions" purpose="Monitor and manage temporary or elevated access grants." primaryAction={{
    label: 'Grant Exception',
    onClick: () => toast.success('Grant exception dialog opened')
  }} loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={EXCEPTIONS} onRowClick={(row) => toast.success(`View details for ${row.id}`)} emptyMessage="No permission exceptions found." />
      </div>
    </RolePageScaffold>;
}