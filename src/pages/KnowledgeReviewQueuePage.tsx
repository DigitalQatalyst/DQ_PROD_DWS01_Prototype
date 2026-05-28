import React, { useState } from 'react';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { MonoId } from '../components/MonoId';
import { DataTable } from '../components/DataTable';
import { Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function KnowledgeReviewQueuePage() {
  const { reviewQueue, markReviewComplete } = useKnowledgeLifecycle();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const pendingItems = reviewQueue.filter(i => i.status !== 'Completed');

  const columns = [
    {
      header: 'ID',
      accessor: (row: any) => <MonoId value={row.id} />
    },
    {
      header: 'Asset',
      accessor: (row: any) => <span className="font-medium text-text-primary">{row.assetTitle}</span>
    },
    {
      header: 'Reason',
      accessor: (row: any) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-bold text-warning">
          <AlertCircle size={12} />
          {row.queueReason}
        </span>
      )
    },
    {
      header: 'Due',
      accessor: (row: any) => (
        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
          <Calendar size={14} />
          {row.slaDue}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (row: any) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/marketplaces/knowledge/${row.assetId}`);
          }}
          className="text-sm font-bold text-primary hover:underline"
        >
          Review Asset
        </button>
      )
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Content Review Queue</h1>
        <p className="mt-1 text-text-secondary">Assets requiring governance review or updates based on feedback flags.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm">
        <DataTable 
          columns={columns} 
          rows={pendingItems} 
          onRowClick={(row) => setSelectedRow(row)} 
        />
        {pendingItems.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            No pending reviews in your queue.
          </div>
        )}
      </div>
    </div>
  );
}
