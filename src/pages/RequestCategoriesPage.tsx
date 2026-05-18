import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { toast } from 'sonner';
const CATEGORIES = [{
  id: 'CAT-001',
  name: 'IT & Access Requests',
  owner: 'Support Operations',
  sla: '24 hours',
  approval: 'Required',
  status: 'Active'
}, {
  id: 'CAT-002',
  name: 'HRA Requests',
  owner: 'HRA',
  sla: '48 hours',
  approval: 'Required',
  status: 'Active'
}, {
  id: 'CAT-003',
  name: 'Platform Support',
  owner: 'Support Operations',
  sla: '8 hours',
  approval: 'None',
  status: 'Active'
}, {
  id: 'CAT-004',
  name: 'Knowledge / Content Requests',
  owner: 'Platform Governance',
  sla: '5 days',
  approval: 'Optional',
  status: 'Active'
}];
export function RequestCategoriesPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <span className="font-mono text-xs">{row.id}</span>
  }, {
    header: 'Category Name',
    accessor: (row: any) => <span className="font-medium">{row.name}</span>
  }, {
    header: 'Owner Unit',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.owner}</span>
  }, {
    header: 'Default SLA',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.sla}</span>
  }, {
    header: 'Approval',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.approval}</span>
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success(`Edit category ${row.id}`);
    }} className="text-sm font-medium text-primary hover:text-navy-800">
          Edit
        </button>
  }];
  return <RolePageScaffold eyebrow="Administration" title="Request Category Configuration" purpose="Manage request categories, routing rules, and SLAs." primaryAction={{
    label: 'Add Category',
    onClick: () => toast.success('Add category dialog opened')
  }} loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={CATEGORIES} onRowClick={(row) => toast.success(`View details for ${row.name}`)} emptyMessage="No categories found." />
      </div>
    </RolePageScaffold>;
}