import React from 'react';
import { Users, ArrowRightLeft } from 'lucide-react';
import type { FulfilmentRequestRow, HandoffEvent } from '../../types/requestsConsole';

interface Props {
  request: FulfilmentRequestRow;
  handoffs: HandoffEvent[];
}

export function OwnershipQueueContextPanel({ request, handoffs }: Props) {
  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users size={16} className="text-text-muted" />
        <h3 className="text-sm font-bold text-primary">Ownership & Queue Context</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Current Owner</span>
          <span className="text-sm font-semibold text-primary">{request.owner}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Queue</span>
          <span className="text-sm font-medium text-text-secondary">{request.queue}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Backup Owner</span>
          <span className="text-sm font-medium text-text-secondary">—</span>
        </div>
        {handoffs.length > 0 && (
          <div className="pt-3 border-t border-border-subtle">
            <span className="text-xs text-text-muted font-medium block mb-2">Previous Owners</span>
            {handoffs.filter(h => h.status === 'Complete').map((h) => (
              <div key={h.id} className="flex items-center gap-2 text-xs text-text-secondary mb-1">
                <ArrowRightLeft size={12} className="text-text-muted" />
                <span>{h.fromOwner} → {h.toOwner}</span>
                <span className="text-text-muted">·</span>
                <span className="text-text-muted">{h.reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
