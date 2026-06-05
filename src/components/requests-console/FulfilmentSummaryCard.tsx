import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import type { FulfilmentRequestRow } from '../../types/requestsConsole';

interface Props {
  request: FulfilmentRequestRow;
}

export function FulfilmentSummaryCard({ request }: Props) {
  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-text-muted" />
        <h3 className="text-sm font-bold text-primary">Fulfilment Summary</h3>
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-xs text-text-muted font-medium block mb-1">Objective</span>
          <p className="text-sm text-text-secondary">{request.title}</p>
        </div>
        <div>
          <span className="text-xs text-text-muted font-medium block mb-1">Expected Outcome</span>
          <p className="text-sm text-text-secondary">Request fulfilled and confirmed by requester</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <span className="text-xs text-text-muted font-medium">Next Action</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
            {request.nextAction} <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}
