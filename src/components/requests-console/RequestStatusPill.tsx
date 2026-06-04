import React from 'react';
import type { FulfilmentStatus } from '../../types/requestsConsole';

interface RequestStatusPillProps {
  status: FulfilmentStatus;
}

export function RequestStatusPill({ status }: RequestStatusPillProps) {
  const lower = status.toLowerCase();
  let tone = 'bg-navy-100 text-primary';
  if (['closed', 'fulfilled', 'evidence added'].includes(lower)) {
    tone = 'bg-success-surface text-success-text';
  } else if (['in fulfilment', 'assigned', 'routed', 'closure review'].includes(lower)) {
    tone = 'bg-info-surface text-info-text';
  } else if (['blocked', 'escalated', 'reopened', 'clarification needed'].includes(lower)) {
    tone = 'bg-danger-surface text-danger-text';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-semibold whitespace-nowrap ${tone}`}>
      {status}
    </span>
  );
}
