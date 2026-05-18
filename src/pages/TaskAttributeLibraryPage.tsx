import React, { useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { dynamicFieldLibrary } from '../mocks/governedTasks.mock';
import { AddDynamicFieldModal } from '../components/AddDynamicFieldModal';
import { toast } from 'sonner';
export function TaskAttributeLibraryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const columns = [
  {
    header: 'Attribute ID',
    accessor: (row: any) => <MonoId value={row.id} />
  },
  {
    header: 'Label',
    accessor: (row: any) =>
    <span className="font-medium text-text-primary">{row.label}</span>

  },
  {
    header: 'Field Type',
    accessor: (row: any) =>
    <span className="px-2 py-0.5 bg-surface border border-border-subtle rounded text-xs text-text-secondary">
          {row.type}
        </span>

  },
  {
    header: 'Used In Task Types',
    accessor: (row: any) =>
    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold">
          {Math.floor(Math.random() * 5) + 1}
        </span>

  },
  {
    header: 'Required Option',
    accessor: (row: any) =>
    <span className="text-sm text-text-secondary">
          {row.required ? 'Required' : 'Optional'}
        </span>

  },
  {
    header: 'Editable By',
    accessor: (row: any) =>
    <span className="text-sm text-text-secondary">{row.editableBy}</span>

  },
  {
    header: 'Visibility',
    accessor: (row: any) =>
    <span className="text-sm text-text-secondary">All Roles</span>

  },
  {
    header: 'Status',
    accessor: (row: any) => <StatusPill status="Active" />
  }];

  const handleRowClick = (row: any) => {
    toast.success(`Task attribute updated locally.`);
  };
  return (
    <RolePageScaffold
      eyebrow="Administration"
      title="Task Attribute Library"
      purpose="Define reusable task fields that can be added to task types, task templates, or individual tasks."
      primaryAction={{
        label: 'Add Attribute',
        onClick: () => setIsAddModalOpen(true)
      }}>
      
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          rows={dynamicFieldLibrary}
          onRowClick={handleRowClick} />
        
      </div>

      {isAddModalOpen &&
      <AddDynamicFieldModal onClose={() => setIsAddModalOpen(false)} />
      }
    </RolePageScaffold>);

}