import React from 'react';
import type { ServiceApproval } from '../types/serviceLifecycle';
import { SlaStatePill } from './SlaStatePill';
import { ChevronRight } from 'lucide-react';

interface ApprovalRequestTableProps {
  approvals: ServiceApproval[];
  onRowClick: (approval: ServiceApproval) => void;
}

export function ApprovalRequestTable({ approvals, onRowClick }: ApprovalRequestTableProps) {
  if (approvals.length === 0) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-lg font-bold text-primary mb-2">No approval requests waiting</h3>
        <p className="text-sm text-text-secondary">Your queue is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 border-b border-border-default text-xs font-bold text-text-muted uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Approval ID</th>
              <th className="px-6 py-4 font-semibold">Request ID</th>
              <th className="px-6 py-4 font-semibold">Service</th>
              <th className="px-6 py-4 font-semibold">Reason</th>
              <th className="px-6 py-4 font-semibold">SLA</th>
              <th className="px-6 py-4 font-semibold">Decision State</th>
              <th className="px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {approvals.map((approval) => (
              <tr 
                key={approval.id} 
                onClick={() => onRowClick(approval)}
                className="group hover:bg-surface/30 transition-colors cursor-pointer relative"
              >
                <td className={`px-6 py-4 whitespace-nowrap align-top relative ${approval.slaState === 'At Risk' ? 'border-l-4 border-warning-text' : ''}`}>
                  <span className="font-mono text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                    {approval.id}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <span className="font-mono text-sm text-text-secondary">
                    {approval.requestId}
                  </span>
                </td>
                
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-primary">{approval.service}</span>
                    <span className="text-xs text-text-secondary mt-0.5">{approval.requester}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 align-top">
                  <span className="text-sm text-text-secondary line-clamp-2">{approval.reason}</span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <SlaStatePill state={approval.slaState} detail={approval.sla} />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${
                    approval.decisionState === 'Pending' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    approval.decisionState === 'Returned' ? 'bg-warning-surface text-warning-text border-warning-text/20' :
                    'bg-surface text-text-secondary border-border-strong'
                  }`}>
                    {approval.decisionState}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <button className="text-sm font-semibold text-secondary hover:text-orange-600 transition-colors flex items-center justify-start gap-1 w-full">
                    Review <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
