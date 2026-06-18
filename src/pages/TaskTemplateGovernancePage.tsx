import React from 'react';
import { noop } from '../utils/noop';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
export function TaskTemplateGovernancePage() {
  const templates = [
  {
    id: 'TPL-001',
    name: 'Standard Delivery Task',
    owner: 'Platform Governance',
    status: 'Active',
    usage: 1240
  },
  {
    id: 'TPL-002',
    name: 'Review Task',
    owner: 'Platform Governance',
    status: 'Active',
    usage: 850
  },
  {
    id: 'TPL-003',
    name: 'Governance Action Task',
    owner: 'Platform Governance',
    status: 'Active',
    usage: 320
  },
  {
    id: 'TPL-004',
    name: 'HRA Readiness Task',
    owner: 'HRA',
    status: 'Active',
    usage: 410
  },
  {
    id: 'TPL-005',
    name: 'Support Fulfilment Task',
    owner: 'Support Operations',
    status: 'Active',
    usage: 2100
  },
  {
    id: 'TPL-006',
    name: 'Strategic Contribution Task',
    owner: 'Enterprise',
    status: 'Active',
    usage: 150
  }];

  const columns = [
  {
    header: 'Template ID',
    accessor: (row: any) =>
    <span className="font-mono text-sm text-text-secondary">{row.id}</span>

  },
  {
    header: 'Template Name',
    accessor: (row: any) =>
    <span className="font-bold text-text-primary">{row.name}</span>

  },
  {
    header: 'Owner',
    accessor: (row: any) =>
    <span className="text-sm text-text-secondary">{row.owner}</span>

  },
  {
    header: 'Usage Count',
    accessor: (row: any) =>
    <span className="text-sm font-medium">{row.usage}</span>

  },
  {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }];

  return (
    <RolePageScaffold
      eyebrow="Administration"
      title="Task Template Governance"
      purpose="Review and manage global task templates.">
      
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={templates} onRowClick={noop} />
      </div>
    </RolePageScaffold>);

}