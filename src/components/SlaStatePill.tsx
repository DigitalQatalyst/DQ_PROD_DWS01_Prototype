import React from 'react';
import type { SlaState } from '../types/serviceLifecycle';

interface SlaStatePillProps {
  state: SlaState;
  detail?: string;
}

export function SlaStatePill({ state, detail }: SlaStatePillProps) {
  const getStyle = () => {
    switch (state) {
      case 'On Track': return 'bg-success-surface text-success-text border-success-text/20';
      case 'At Risk': return 'bg-warning-surface text-warning-text border-warning-text/20';
      case 'Breached': return 'bg-danger-surface text-danger-text border-danger-text/20';
      case 'Completed': return 'bg-surface text-text-secondary border-border-strong';
      default: return 'bg-surface text-text-secondary border-border-strong';
    }
  };

  return (
    <div className={`inline-flex flex-col items-start px-2 py-1 rounded border ${getStyle()}`}>
      <span className="text-xs font-bold uppercase tracking-wider">{state}</span>
      {detail && <span className="text-[11px] font-medium opacity-90 mt-0.5">{detail}</span>}
    </div>
  );
}
