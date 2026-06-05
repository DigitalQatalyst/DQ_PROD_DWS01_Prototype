import React from 'react';
import { GitCommit } from 'lucide-react';
import type { FulfilmentStatus } from '../../types/requestsConsole';
import { FULFILMENT_STATUS_ORDER } from '../../types/requestsConsole';

interface Props {
  currentStatus: FulfilmentStatus;
}

export function RequestTimeline({ currentStatus }: Props) {
  const currentIdx = FULFILMENT_STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="flex items-center gap-2 mb-4">
        <GitCommit size={16} className="text-text-muted" />
        <h3 className="text-sm font-bold text-primary">Timeline</h3>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-5 bottom-5 w-px bg-border-strong" />

        <div className="space-y-4">
          {FULFILMENT_STATUS_ORDER.map((status, i) => {
            const isPast = i < currentIdx;
            const isCurrent = i === currentIdx;

            return (
              <div key={status} className="flex items-center gap-3 relative z-10">
                <div className={`w-3 h-3 rounded-full shrink-0 border-2 ${
                  isCurrent ? 'bg-primary border-primary' :
                  isPast ? 'bg-success border-success' :
                  'bg-white border-border-strong'
                }`} />
                <span className={`text-sm ${
                  isCurrent ? 'font-bold text-primary' :
                  isPast ? 'font-medium text-success' :
                  'text-text-muted'
                }`}>
                  {status}
                </span>
                {isCurrent && (
                  <span className="ml-2 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
