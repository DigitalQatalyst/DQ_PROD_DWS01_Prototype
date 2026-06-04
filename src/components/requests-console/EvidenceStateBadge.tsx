import React from 'react';
import type { EvidenceState } from '../../types/requestsConsole';

interface EvidenceStateBadgeProps {
  state: EvidenceState;
}

export function EvidenceStateBadge({ state }: EvidenceStateBadgeProps) {
  const styles: Record<EvidenceState, string> = {
    'Not Started': 'bg-navy-100 text-text-muted',
    Pending: 'bg-warning-surface text-warning-text',
    Added: 'bg-info-surface text-info-text',
    Weak: 'bg-danger-surface text-danger-text',
    Accepted: 'bg-success-surface text-success-text',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-semibold ${styles[state]}`}>
      {state}
    </span>
  );
}
