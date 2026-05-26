import React from 'react';
import type { ServiceApproval } from '../types/serviceLifecycle';

interface ApprovalKpiStripProps {
  approvals: ServiceApproval[];
}

export function ApprovalKpiStrip({ approvals }: ApprovalKpiStripProps) {
  const pendingCount = approvals.filter(a => a.decisionState === 'Pending').length;
  const returnedCount = approvals.filter(a => a.decisionState === 'Returned').length;
  const atRiskCount = approvals.filter(a => a.slaState === 'At Risk' || a.slaState === 'Breached').length;
  // Hardcode approved today for prototype since fixture doesn't track approval timestamps
  const approvedToday = 3;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-card border border-border-default p-4 flex flex-col justify-between shadow-sm">
        <span className="text-sm font-semibold text-text-secondary">Pending Review</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-bold text-primary">{pendingCount}</span>
        </div>
      </div>
      
      <div className="bg-white rounded-card border border-border-default p-4 flex flex-col justify-between shadow-sm">
        <span className="text-sm font-semibold text-text-secondary">Returned</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-bold text-primary">{returnedCount}</span>
        </div>
      </div>
      
      <div className="bg-white rounded-card border border-border-default p-4 flex flex-col justify-between shadow-sm">
        <span className="text-sm font-semibold text-text-secondary">Approved Today</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-bold text-success-text">{approvedToday}</span>
        </div>
      </div>
      
      <div className="bg-white rounded-card border border-warning-text/30 p-4 flex flex-col justify-between shadow-sm">
        <span className="text-sm font-semibold text-text-secondary">SLA At Risk</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-bold text-warning-text">{atRiskCount}</span>
        </div>
      </div>
    </div>
  );
}
