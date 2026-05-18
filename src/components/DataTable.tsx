import React from 'react';
import { AlertCircle } from 'lucide-react';
export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  width?: string;
}
interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}
export function DataTable<T>({
  columns,
  rows,
  onRowClick,
  emptyMessage = 'No data available',
  isLoading = false,
  isError = false,
  onRetry
}: DataTableProps<T>) {
  if (isError) {
    return <div className="bg-danger-surface border border-danger/20 rounded-card p-8 text-center">
        <AlertCircle size={32} className="text-danger mx-auto mb-3" />
        <h3 className="text-danger-text font-semibold mb-1">
          Failed to load data
        </h3>
        <p className="text-danger-text/80 text-sm mb-4">
          There was an error retrieving this information.
        </p>
        {onRetry && <button onClick={onRetry} className="px-4 py-2 bg-white text-danger font-medium text-sm rounded-button shadow-sm hover:bg-surface transition-colors">
            Retry
          </button>}
      </div>;
  }
  return <div className="w-full overflow-x-auto rounded-card border border-border-default bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-default bg-surface">
            {columns.map((col, i) => <th key={i} className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap" style={{
            width: col.width
          }}>
                {col.header}
              </th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {isLoading ?
        // Skeleton rows
        Array.from({
          length: 5
        }).map((_, i) => <tr key={i}>
                {columns.map((_, j) => <td key={j} className="px-4 py-4">
                    <div className="h-4 bg-border-subtle rounded animate-pulse w-3/4" />
                  </td>)}
              </tr>) : rows.length === 0 ?
        // Empty state
        <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-text-muted text-sm">
                {emptyMessage}
              </td>
            </tr> :
        // Data rows
        rows.map((row, i) => <tr key={i} onClick={() => onRowClick?.(row)} className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-navy-50' : ''}`}>
                {columns.map((col, j) => <td key={j} className="px-4 py-3 text-sm text-text-primary align-middle">
                    {col.accessor(row)}
                  </td>)}
              </tr>)}
        </tbody>
      </table>
    </div>;
}