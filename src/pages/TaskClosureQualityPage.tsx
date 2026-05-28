import React, { useState } from 'react';
import { useTaskLifecycle } from '../context/TaskLifecycleContext';
import { MonoId } from '../components/MonoId';
import { DataTable } from '../components/DataTable';
import { BadgeCheck, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TaskClosureQualityPage() {
  const { tasks } = useTaskLifecycle();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<any>(null);

  // Filter for tasks that are in a 'Review Needed' or 'Missing evidence' state
  const qualityItems = tasks.filter(t => t.closureQualityState && t.closureQualityState.closureOutcome !== 'Ready' && t.closureQualityState.closureOutcome !== 'Closed');

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
      header: 'Quality Issue',
      accessor: (row: any) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-bold text-warning">
          <AlertTriangle size={12} />
          {row.closureQualityState?.closureOutcome}
        </span>
      )
    },
    {
      header: 'Checklist %',
      accessor: (row: any) => (
        <span className="font-medium text-text-secondary">{row.closureQualityState?.checklistCompletion}%</span>
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
          Fix Quality
        </button>
      )
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-text-primary">
          <BadgeCheck className="text-primary" size={28} />
          Closure Quality Action Queue
        </h1>
        <p className="mt-1 text-text-secondary">Tasks that failed automated quality checks for closure (missing evidence, incomplete checklist, missing output).</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm">
        <DataTable 
          columns={columns} 
          rows={qualityItems} 
          onRowClick={(row) => setSelectedRow(row)} 
        />
        {qualityItems.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            No closure quality issues detected.
          </div>
        )}
      </div>
    </div>
  );
}
