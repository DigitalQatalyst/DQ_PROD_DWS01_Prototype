import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { toast } from 'sonner';
const TAXONOMY = [{
  id: 'TAG-001',
  name: 'Playbook',
  type: 'Document Type',
  owner: 'Platform Governance',
  usage: 45,
  status: 'Active'
}, {
  id: 'TAG-002',
  name: 'Standard',
  type: 'Document Type',
  owner: 'Platform Governance',
  usage: 12,
  status: 'Active'
}, {
  id: 'TAG-003',
  name: 'Agile Execution',
  type: 'Domain',
  owner: 'Agile CoE',
  usage: 89,
  status: 'Active'
}, {
  id: 'TAG-004',
  name: 'HRA',
  type: 'Domain',
  owner: 'HRA',
  usage: 34,
  status: 'Active'
}];
export function KnowledgeTaxonomyPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'Tag Name',
    accessor: (row: any) => <span className="font-medium">{row.name}</span>
  }, {
    header: 'Type',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.type}</span>
  }, {
    header: 'Owner',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.owner}</span>
  }, {
    header: 'Usage Count',
    accessor: (row: any) => <span className="text-sm text-text-secondary">{row.usage} assets</span>
  }, {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success(`Edit tag ${row.name}`);
    }} className="text-sm font-medium text-primary hover:text-navy-800">
          Edit
        </button>
  }];
  return <RolePageScaffold eyebrow="Administration" title="Knowledge Taxonomy" purpose="Manage metadata tags, document types, and knowledge domains." primaryAction={{
    label: 'Add Tag',
    onClick: () => toast.success('Add tag dialog opened')
  }} loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={TAXONOMY} onRowClick={(row) => toast.success(`View details for ${row.name}`)} emptyMessage="No tags found." />
      </div>
    </RolePageScaffold>;
}