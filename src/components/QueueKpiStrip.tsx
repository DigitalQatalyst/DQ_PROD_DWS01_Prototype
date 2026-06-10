import { AlertTriangle, CheckCircle2, FileQuestion, Inbox } from 'lucide-react';
import type { ServiceQueueItem } from '../types/serviceLifecycle';

interface QueueKpiStripProps {
  items: ServiceQueueItem[];
}

export function QueueKpiStrip({ items }: QueueKpiStripProps) {
  const newCount = items.filter(i => i.status === 'New').length;
  const atRiskCount = items.filter(i => i.slaState === 'At Risk' || i.slaState === 'Breached').length;
  const missingInfoCount = items.filter(i => i.completeness === 'Missing Info').length;
  // Hardcode closed for prototype since fixture queue items don't include closed items
  const closedCount = 21;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="dq-card dq-card-clickable border-t-4 border-t-info">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] font-semibold text-primary">New Requests</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-button bg-info-surface text-info-text"><Inbox size={20} strokeWidth={1.5} /></span>
        </div>
        <span className="mt-2 block text-3xl font-bold tabular-nums text-primary">{newCount}</span>
      </div>
      
      <div className="dq-card dq-card-clickable border-t-4 border-t-warning">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] font-semibold text-primary">SLA At Risk</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-button bg-warning-surface text-warning-text"><AlertTriangle size={20} strokeWidth={1.5} /></span>
        </div>
        <span className="mt-2 block text-3xl font-bold tabular-nums text-primary">{atRiskCount}</span>
      </div>
      
      <div className="dq-card dq-card-clickable border-t-4 border-t-warning">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] font-semibold text-primary">Missing Info</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-button bg-warning-surface text-warning-text"><FileQuestion size={20} strokeWidth={1.5} /></span>
        </div>
        <span className="mt-2 block text-3xl font-bold tabular-nums text-primary">{missingInfoCount}</span>
      </div>
      
      <div className="dq-card dq-card-clickable border-t-4 border-t-success">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] font-semibold text-primary">Closed This Week</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-button bg-success-surface text-success-text"><CheckCircle2 size={20} strokeWidth={1.5} /></span>
        </div>
        <span className="mt-2 block text-3xl font-bold tabular-nums text-primary">{closedCount}</span>
      </div>
    </div>
  );
}
