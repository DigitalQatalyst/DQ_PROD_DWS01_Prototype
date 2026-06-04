import React from 'react';
import type { RequestPriority } from '../../types/requestsConsole';

interface PriorityPillProps {
  priority: RequestPriority;
}

export function PriorityPill({ priority }: PriorityPillProps) {
  const styles: Record<RequestPriority, string> = {
    High: 'bg-danger-surface text-danger-text',
    Medium: 'bg-warning-surface text-warning-text',
    Low: 'bg-info-surface text-info-text',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-semibold ${styles[priority]}`}>
      {priority}
    </span>
  );
}
