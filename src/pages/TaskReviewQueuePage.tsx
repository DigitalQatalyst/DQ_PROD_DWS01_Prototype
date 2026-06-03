import React, { useState } from 'react';
import { useTaskLifecycle } from '../context/TaskLifecycleContext';
import { MonoId } from '../components/MonoId';
import { DataTable } from '../components/DataTable';
import { ShieldCheck, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TaskReviewQueuePage() {
  const { tasks, approveReview } = useTaskLifecycle();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<any>(null);

  // Filter for tasks that are currently needing review
  const pendingItems = tasks.filter(t => t.status === 'Review Needed');

  const columns = [
    {
      header: 'Task ID',
      accessor: (row: any) => <MonoId value={row.id} />
    },
    {
      header: 'Title',
      accessor: (row: any) => <span className="font-medium text-text-primary">{row.title}</span>
    },
    {
      header: 'Template',
      accessor: (row: any) => (
        <span className="text-xs font-semibold text-text-secondary">{row.templateTitle || 'Custom'}</span>
      )
    },
    {
      header: 'Due',
      accessor: (row: any) => (
        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
          <Calendar size={14} />
          {row.dueDate}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (row: any) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tasks/${row.id}`);
          }}
          className="text-sm font-bold text-primary hover:underline"
        >
          Open Review
        </button>
      )
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-text-primary">
          <ShieldCheck className="text-primary" size={28} />
          Task Review Queue
        </h1>
        <p className="mt-1 text-text-secondary">Tasks awaiting peer, lead, or governance review before closure.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm">
        <DataTable 
          columns={columns} 
          rows={pendingItems} 
          onRowClick={(row) => setSelectedRow(row)} 
        />
        {pendingItems.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            No tasks currently pending review in your scope.
          </div>
        )}
      </div>
    </div>
  );
}
