import React from 'react';
import { Clock } from 'lucide-react';
interface SlaBadgeProps {
  state: 'On Track' | 'At Risk' | 'Breached' | 'Met';
}
export function SlaBadge({
  state
}: SlaBadgeProps) {
  let colorClass = '';
  switch (state) {
    case 'On Track':
    case 'Met':
      colorClass = 'text-success bg-success-surface';
      break;
    case 'At Risk':
      colorClass = 'text-warning-text bg-warning-surface';
      break;
    case 'Breached':
      colorClass = 'text-danger bg-danger-surface';
      break;
  }
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-button text-xs font-medium ${colorClass}`}>
      <Clock size={12} />
      {state}
    </span>;
}