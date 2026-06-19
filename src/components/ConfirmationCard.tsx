import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, User, ListTree, Clock, Activity } from 'lucide-react';
import type { ServiceDetail } from '../types/serviceLifecycle';
import { myRequestsHref } from '../utils/localMyRequests';

interface ConfirmationCardProps {
  requestId: string;
  detail: ServiceDetail;
  isApprovalRequired: boolean;
}

export function ConfirmationCard({ requestId, detail, isApprovalRequired }: ConfirmationCardProps) {
  const navigate = useNavigate();

  const status = isApprovalRequired ? 'Pending Approval' : 'In Fulfilment';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-card border border-border-default overflow-hidden shadow-sm">
        
        <div className="bg-success-surface border-b border-success-text/20 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-success-text/20">
            <CheckCircle2 size={32} className="text-success-text" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Request Submitted</h2>
          <p className="text-text-secondary">
            Your request has been successfully created and routed to the appropriate team.
          </p>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 bg-surface border border-border-subtle rounded-md p-4 text-center">
              <span className="block text-xs text-text-muted uppercase tracking-wider mb-1">Request ID</span>
              <span className="text-xl font-bold text-primary font-mono">{requestId}</span>
            </div>
            <div className="flex-1 bg-surface border border-border-subtle rounded-md p-4 text-center">
              <span className="block text-xs text-text-muted uppercase tracking-wider mb-1">Current Status</span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                <Activity size={12} />
                {status}
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-primary mb-4 border-b border-border-subtle pb-2">
            What happens next?
          </h3>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-surface border border-border-strong flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <span className="text-sm font-medium text-primary block">
                  {isApprovalRequired ? 'Approval Review' : 'Triage & Allocation'}
                </span>
                <span className="text-sm text-text-secondary">
                  {isApprovalRequired 
                    ? `Your request requires approval before fulfilment begins. SLA: ${detail.approvalDetail}`
                    : `Your request is now in the ${detail.queue} and will be assigned to a team member.`}
                </span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-surface border border-border-strong flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <span className="text-sm font-medium text-primary block">Fulfilment</span>
                <span className="text-sm text-text-secondary">
                  Owned by {detail.owner}. SLA target: {detail.sla}.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(myRequestsHref(requestId))}
              className="flex-1 py-2.5 px-4 bg-secondary text-white font-semibold text-sm rounded-button hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              View Request Status
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/marketplaces/services')}
              className="flex-1 py-2.5 px-4 bg-white border border-border-strong text-primary font-semibold text-sm rounded-button hover:bg-surface hover:border-text-muted transition-colors"
            >
              Back to Service Catalogue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
