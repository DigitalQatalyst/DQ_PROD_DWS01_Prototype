import React from 'react';
import type { ServiceQueueItem } from '../types/serviceLifecycle';
import { CompletenessIndicator } from './CompletenessIndicator';
import { SlaStatePill } from './SlaStatePill';
import { OwnerActionBar } from './OwnerActionBar';
import { CategoryBadge } from './CategoryBadge';

interface RoutedRequestTableProps {
  items: ServiceQueueItem[];
  onAccept: (id: string) => void;
  onReturnForInfo: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onClose: (id: string) => void;
  onRowClick: (id: string) => void;
}

export function RoutedRequestTable({ items, onAccept, onReturnForInfo, onUpdateStatus, onClose, onRowClick }: RoutedRequestTableProps) {
  if (items.length === 0) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-lg font-bold text-primary mb-2">No routed requests</h3>
        <p className="text-sm text-text-secondary">Your queue is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 border-b border-border-default text-xs font-bold text-text-muted uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Request ID</th>
              <th className="px-6 py-4 font-semibold">Service</th>
              <th className="px-6 py-4 font-semibold">Requester</th>
              <th className="px-6 py-4 font-semibold">Completeness</th>
              <th className="px-6 py-4 font-semibold">SLA</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {items.map((item) => (
              <tr 
                key={item.id} 
                className="group hover:bg-surface/30 transition-colors relative"
              >
                <td className={`px-6 py-4 whitespace-nowrap align-top cursor-pointer relative ${item.slaState === 'At Risk' ? 'border-l-4 border-warning-text' : ''}`} onClick={() => onRowClick(item.requestId)}>
                  <span className="font-mono text-sm font-bold text-primary hover:text-secondary transition-colors">
                    {item.requestId}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top cursor-pointer" onClick={() => onRowClick(item.requestId)}>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-primary">{item.service}</span>
                    <div className="mt-1">
                      <CategoryBadge category={item.category} />
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <span className="text-sm text-text-secondary">{item.requester}</span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <CompletenessIndicator completeness={item.completeness} />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <SlaStatePill state={item.slaState} detail={item.slaDetail} />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-surface border border-border-strong text-text-secondary">
                    {item.status}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <div className="flex justify-start">
                    <OwnerActionBar 
                      currentStatus={item.status}
                      actionNeeded={item.actionNeeded}
                      onAccept={() => onAccept(item.id)}
                      onReturnForInfo={() => onReturnForInfo(item.id)}
                      onUpdateStatus={(status) => onUpdateStatus(item.id, status)}
                      onClose={() => onClose(item.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
