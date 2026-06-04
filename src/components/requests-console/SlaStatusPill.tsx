import React from 'react';
import type { FulfilmentSlaState } from '../../types/requestsConsole';

interface SlaStatusPillProps {
  state: FulfilmentSlaState;
}

export function SlaStatusPill({ state }: SlaStatusPillProps) {
  const styles: Record<FulfilmentSlaState, string> = {
    'On Track': 'bg-success-surface text-success-text',
    'Due Soon': 'bg-warning-surface text-warning-text',
    'At Risk': 'bg-warning-surface text-warning-text',
    Breached: 'bg-danger-surface text-danger-text',
    Paused: 'bg-navy-100 text-primary',
    Completed: 'bg-surface text-text-secondary border border-border-strong',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-pill text-xs font-semibold ${styles[state]}`}>
      {state}
    </span>
  );
}
