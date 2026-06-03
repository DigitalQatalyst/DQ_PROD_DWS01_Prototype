import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

interface ApprovalStateCardProps {
  approvalState: string;
}

export function ApprovalStateCard({ approvalState }: ApprovalStateCardProps) {
  const isPending = approvalState.toLowerCase().includes('pending');
  const isNotRequired = approvalState.toLowerCase() === 'not required';
  const isApproved = approvalState.toLowerCase() === 'approved';

  const getStyle = () => {
    if (isPending) return 'bg-blue-50 border-blue-200 text-blue-700';
    if (isNotRequired || isApproved) return 'bg-success-surface border-success-text/30 text-success-text';
    return 'bg-surface border-border-strong text-text-secondary';
  };

  const Icon = () => {
    if (isPending) return <ShieldQuestion size={18} />;
    if (isNotRequired || isApproved) return <ShieldCheck size={18} />;
    return <ShieldAlert size={18} />;
  };

  return (
    <div className={`rounded-card border p-5 ${getStyle()}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Icon />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-0.5">Approval State</h3>
          <p className="text-sm font-bold">{approvalState}</p>
        </div>
      </div>
    </div>
  );
}
