import React from 'react';
import { RequestsRow } from './RequestsRow';
import { ServiceEmptyState } from '../ServiceEmptyState';
import type { FulfilmentRequestRow } from '../../types/requestsConsole';

interface RequestsTableProps {
  rows: FulfilmentRequestRow[];
  loading?: boolean;
  onRowClick: (row: FulfilmentRequestRow) => void;
  onUpdateProgress: (row: FulfilmentRequestRow, e: React.MouseEvent) => void;
  onAddEvidence: (row: FulfilmentRequestRow, e: React.MouseEvent) => void;
  onHandoff: (row: FulfilmentRequestRow, e: React.MouseEvent) => void;
  onEscalate: (row: FulfilmentRequestRow, e: React.MouseEvent) => void;
  onNextAction: (row: FulfilmentRequestRow, e: React.MouseEvent) => void;
  onClearFilters?: () => void;
}

const COLUMNS = [
  'Request ID',
  'Title',
  'Category',
  'Queue',
  'Owner',
  'Requester',
  'Priority',
  'SLA state',
  'Fulfilment status',
  'Evidence state',
  'Age',
  'Next action',
];

export function RequestsTable({
  rows,
  loading,
  onRowClick,
  onUpdateProgress,
  onAddEvidence,
  onHandoff,
  onEscalate,
  onNextAction,
  onClearFilters,
}: RequestsTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <div className="p-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-surface animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <ServiceEmptyState
        title="No fulfilment requests match your filters"
        message="Try adjusting status tabs, queue view, or filter criteria to see more requests."
        ctaLabel="Clear filters"
        onCtaClick={onClearFilters}
      />
    );
  }

  return (
    <div className="bg-white rounded-card border border-border-default shadow-sm overflow-x-auto">
      <table className="w-full min-w-[1200px] text-left">
        <thead>
          <tr className="bg-surface/50 border-b border-border-default">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <RequestsRow
              key={row.id}
              row={row}
              onRowClick={() => onRowClick(row)}
              onUpdateProgress={(e) => onUpdateProgress(row, e)}
              onAddEvidence={(e) => onAddEvidence(row, e)}
              onHandoff={(e) => onHandoff(row, e)}
              onEscalate={(e) => onEscalate(row, e)}
              onNextAction={(e) => onNextAction(row, e)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
