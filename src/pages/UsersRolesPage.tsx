import React, { useEffect, useState } from 'react';
import { noop } from '../utils/noop';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { EntityDrawer } from '../components/EntityDrawer';
import { toast } from 'sonner';
const USERS = [{
  id: 'USR-001',
  name: 'Amina Hassan',
  role: 'Associate',
  unit: 'eCom.DXP',
  permissions: 'Standard',
  status: 'Active'
}, {
  id: 'USR-002',
  name: 'David Mwangi',
  role: 'Scrum Master',
  unit: 'eCom.DXP',
  permissions: 'Elevated',
  status: 'Active'
}, {
  id: 'USR-003',
  name: 'Priya Nair',
  role: 'Team Lead',
  unit: 'eCom.DXP',
  permissions: 'Elevated',
  status: 'Active'
}, {
  id: 'USR-004',
  name: 'Omar Farouk',
  role: 'Unit Lead',
  unit: 'Digital Platforms',
  permissions: 'Elevated',
  status: 'Active'
}, {
  id: 'USR-005',
  name: 'Grace Wanjiru',
  role: 'HRA',
  unit: 'HRA',
  permissions: 'Standard',
  status: 'Active'
}, {
  id: 'USR-006',
  name: 'Elena Costa',
  role: 'Admin',
  unit: 'Platform Governance',
  permissions: 'Admin',
  status: 'Active'
}];
export function UsersRolesPage() {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'User',
    accessor: (row: any) => <OwnerBadge userId={row.id} />
  }, {
    header: 'Role',
    accessor: (row: any) => <span className="text-sm font-medium">{row.role}</span>
  }, {
    header: 'Unit',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.unit}</span>
  }, {
    header: 'Permissions',
    accessor: (row: any) => <span className="text-xs text-text-muted">{row.permissions}</span>
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success(`Update role dialog opened for ${row.name}`);
    }} className="text-sm font-medium text-primary hover:text-navy-800">
          Update role
        </button>
  }];
  return <>
      <RolePageScaffold eyebrow="Administration" title="User & Role Management" purpose="Manage platform users, roles, and permission assignments." primaryAction={{
      label: 'Invite User',
      onClick: () => toast.success('Invite user dialog opened')
    }} kpis={[{
      label: 'Active Users',
      value: '1,245',
      status: 'info'
    }, {
      label: 'Pending Invites',
      value: '12',
      status: 'warning'
    }, {
      label: 'Permission Exceptions',
      value: '3',
      status: 'danger'
    }]} tabs={['All Users', 'Admins', 'Pending', 'Inactive']} activeTab="All Users" onTabChange={noop} loading={loading}>
        <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
          <DataTable columns={columns} rows={USERS} onRowClick={(row) => setSelectedUser({
          id: row.id,
          title: `User Profile: ${row.name}`,
          status: row.status,
          ownerId: row.id,
          summary: `Role: ${row.role}\nUnit: ${row.unit}\nPermissions: ${row.permissions}`,
          timeline: [{
            time: '2026-05-01 09:00',
            action: 'User created'
          }, {
            time: '2026-05-02 10:00',
            action: 'Role assigned'
          }]
        })} emptyMessage="No users found." />
        </div>
      </RolePageScaffold>

      {selectedUser && <EntityDrawer type="config" data={selectedUser} onClose={() => setSelectedUser(null)} />}
    </>;
}