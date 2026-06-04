import React from 'react';
import { QUEUE_VIEW_OPTIONS, type QueueViewId } from '../../types/requestsConsole';

interface QueueViewSelectorProps {
  activeQueue: QueueViewId;
  onQueueChange: (queue: QueueViewId) => void;
}

export function QueueViewSelector({ activeQueue, onQueueChange }: QueueViewSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {QUEUE_VIEW_OPTIONS.map((option) => {
        const isActive = activeQueue === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onQueueChange(option.id)}
            className={`px-3 py-1.5 rounded-button text-sm font-semibold transition-colors border ${
              isActive
                ? 'bg-secondary text-white border-secondary'
                : 'bg-white text-text-secondary border-border-strong hover:border-primary hover:text-primary'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
