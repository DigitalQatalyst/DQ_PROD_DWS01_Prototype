import React from 'react';
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
      <div className="bg-white rounded-card border border-border-default p-4 flex flex-col justify-between shadow-sm">
        <span className="text-sm font-semibold text-text-secondary">New Requests</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-bold text-primary">{newCount}</span>
        </div>
      </div>
      
      <div className="bg-white rounded-card border border-warning-text/30 p-4 flex flex-col justify-between shadow-sm">
        <span className="text-sm font-semibold text-text-secondary">SLA At Risk</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-bold text-warning-text">{atRiskCount}</span>
        </div>
      </div>
      
      <div className="bg-white rounded-card border border-border-default p-4 flex flex-col justify-between shadow-sm">
        <span className="text-sm font-semibold text-text-secondary">Missing Info</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-bold text-primary">{missingInfoCount}</span>
        </div>
      </div>
      
      <div className="bg-white rounded-card border border-border-default p-4 flex flex-col justify-between shadow-sm">
        <span className="text-sm font-semibold text-text-secondary">Closed This Week</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-bold text-success-text">{closedCount}</span>
        </div>
      </div>
    </div>
  );
}
