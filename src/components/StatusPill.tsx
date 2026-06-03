import React from 'react';
interface StatusPillProps {
  status: string;
}
export function StatusPill({
  status
}: StatusPillProps) {
  const lowerStatus = status.toLowerCase();
  let type = 'neutral';
  if (['closed', 'approved', 'effective', 'met', 'on track', 'completed', 'success', 'ready', 'available', 'low', 'positive', 'reviewed', 'covered'].includes(lowerStatus)) {
    type = 'success';
  } else if (['in progress', 'in review', 'under review', 'awaiting review', 'awaiting input', 'info'].includes(lowerStatus)) {
    type = 'info';
  } else if (['pending', 'pending info', 'review needed', 'due today', 'due soon', 'watch', 'needs update', 'warning', 'busy', 'medium', 'needs backup', 'needs review', 'restricted', 'issue flagged'].includes(lowerStatus)) {
    type = 'warning';
  } else if (['blocked', 'breached', 'missing update', 'returned', 'critical', 'danger', 'overdue', 'at risk', 'action required', 'needs improvement', 'high', 'escalation only', 'unavailable'].includes(lowerStatus)) {
    type = 'danger';
  } else if (['draft', 'new', 'routed'].includes(lowerStatus)) {
    type = 'info';
  }
  const config = {
    success: {
      bg: 'bg-success-surface',
      text: 'text-success-text',
      dot: 'bg-success'
    },
    warning: {
      bg: 'bg-warning-surface',
      text: 'text-warning-text',
      dot: 'bg-warning'
    },
    danger: {
      bg: 'bg-danger-surface',
      text: 'text-danger-text',
      dot: 'bg-danger'
    },
    info: {
      bg: 'bg-info-surface',
      text: 'text-info-text',
      dot: 'bg-info'
    },
    neutral: {
      bg: 'bg-navy-100',
      text: 'text-primary',
      dot: 'bg-primary'
    }
  }[type];
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1.5 rounded-pill ${config.bg}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span className={`text-xs font-semibold ${config.text}`}>{status}</span>
    </span>;
}
