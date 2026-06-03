import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { QueueCompleteness } from '../types/serviceLifecycle';

interface CompletenessIndicatorProps {
  completeness: QueueCompleteness;
}

export function CompletenessIndicator({ completeness }: CompletenessIndicatorProps) {
  const isComplete = completeness === 'Complete';

  return (
    <div className="flex items-center gap-1.5">
      {isComplete ? (
        <CheckCircle2 size={14} className="text-success-text" />
      ) : (
        <AlertCircle size={14} className="text-warning-text" />
      )}
      <span className={`text-xs font-semibold ${isComplete ? 'text-success-text' : 'text-warning-text'}`}>
        {completeness}
      </span>
    </div>
  );
}
