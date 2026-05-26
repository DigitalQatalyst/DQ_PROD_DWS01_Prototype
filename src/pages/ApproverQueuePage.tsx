import React, { useState } from 'react';
import { toast } from 'sonner';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { ApprovalKpiStrip } from '../components/ApprovalKpiStrip';
import { ApprovalRequestTable } from '../components/ApprovalRequestTable';
import { ApproverDecisionPanel } from '../components/ApproverDecisionPanel';
import type { ServiceApproval } from '../types/serviceLifecycle';

export function ApproverQueuePage() {
  const { approvals, submitApprovalDecision } = useServiceLifecycle();
  const [selectedApproval, setSelectedApproval] = useState<ServiceApproval | null>(null);

  // We only show pending or returned requests in the main queue list
  const activeApprovals = approvals.filter(a => a.decisionState === 'Pending' || a.decisionState === 'Returned');

  const handleSubmitDecision = (id: string, decision: 'Approved' | 'Rejected' | 'Returned' | 'Escalated', rationale: string) => {
    submitApprovalDecision(id, decision, rationale);
    if (decision === 'Approved') toast.success('Request approved');
    else if (decision === 'Rejected') toast.success('Request rejected');
    else if (decision === 'Returned') toast.success('Request returned for information');
    else if (decision === 'Escalated') toast.warning('Request escalated due to SLA risk');
  };

  return (
    <div className="bg-[#F6F6FB] min-h-screen pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Approver / Reviewer Queue</h1>
          <p className="text-sm text-text-secondary">Review and action requests that require your governance sign-off.</p>
        </div>

        <ApprovalKpiStrip approvals={approvals} />

        <div className="bg-white rounded-[12px] border border-border-default shadow-sm overflow-hidden">
          <div className="border-b border-border-default pt-2 px-6 flex items-center gap-6 bg-surface/30">
            <button className="py-3 text-sm font-bold border-b-2 border-primary text-primary transition-colors">
              Pending Approvals
            </button>
            <button className="py-3 text-sm font-semibold border-b-2 border-transparent text-text-muted hover:text-text-secondary transition-colors">
              Decision History
            </button>
          </div>

          <div className="relative">
            <ApprovalRequestTable 
              approvals={activeApprovals} 
              onRowClick={setSelectedApproval} 
            />
          </div>
        </div>
      </div>

      {selectedApproval && (
        <ApproverDecisionPanel 
          approval={selectedApproval} 
          onClose={() => setSelectedApproval(null)}
          onSubmitDecision={handleSubmitDecision}
        />
      )}
    </div>
  );
}
