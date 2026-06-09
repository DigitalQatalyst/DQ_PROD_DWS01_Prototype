import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { DqButton } from './DqButton';
export interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
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
  isRowSelected?: (row: T) => boolean;
}
export function DataTable<T>({
  columns,
  rows,
  onRowClick,
  emptyMessage = 'No data available',
  isLoading = false,
  isError = false,
  onRetry,
  isRowSelected
}: DataTableProps<T>) {
  if (isError) {
    return <div className="rounded-card border border-danger/30 bg-danger-surface p-8 text-center">
        <AlertCircle size={32} strokeWidth={1.5} className="text-danger mx-auto mb-3" />
        <h3 className="text-danger-text font-semibold mb-1">
          Failed to load data
        </h3>
        <p className="text-danger-text/80 text-sm mb-4">
          There was an error retrieving this information.
        </p>
        {onRetry && <DqButton onClick={onRetry} variant="outline">
            Retry
          </DqButton>}
      </div>;
  }
  return <div className="w-full overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-subtle bg-surface">
            {columns.map((col, i) => <th key={i} className="px-4 py-3 text-xs font-semibold uppercase text-[#454560] whitespace-nowrap" style={{
            width: col.width
          }}>
                {col.header}
              </th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {isLoading ?
        // Skeleton rows
        Array.from({
          length: 5
        }).map((_, i) => <tr key={i}>
                {columns.map((_, j) => <td key={j} className="px-4 py-3">
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
        rows.map((row, i) => {
          const selected = isRowSelected?.(row);
          return <tr key={i} onClick={() => onRowClick?.(row)} className={`group border-l-4 transition-colors ${selected ? 'border-secondary bg-orange-50/60' : 'border-transparent'} ${onRowClick ? 'cursor-pointer hover:bg-navy-50' : ''}`}>
                {columns.map((col, j) => <td key={j} className="px-4 py-3 text-sm text-text-primary align-middle">
                    {col.accessor(row)}
                  </td>)}
              </tr>;
        })}
        </tbody>
      </table>
      </div>
    </div>;
}
