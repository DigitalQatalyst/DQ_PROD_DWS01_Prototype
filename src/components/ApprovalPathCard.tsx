import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import type { ApprovalRequirement } from '../types/serviceLifecycle';

interface ApprovalPathCardProps {
  requirement: ApprovalRequirement;
  detail: string;
}

export function ApprovalPathCard({ requirement, detail }: ApprovalPathCardProps) {
  const getRequirementIcon = () => {
    switch (requirement) {
      case 'Required': return <ShieldAlert size={24} className="text-warning-text" />;
      case 'Conditional': return <ShieldQuestion size={24} className="text-info-text" />;
      case 'Not Required': return <ShieldCheck size={24} className="text-success-text" />;
    }
  };

  const getRequirementColor = () => {
    switch (requirement) {
      case 'Required': return 'bg-warning-surface border-warning-text/20';
      case 'Conditional': return 'bg-info-surface border-info-text/20';
      case 'Not Required': return 'bg-success-surface border-success-text/20';
    }
  };

  return (
    <div className={`rounded-card border p-6 ${getRequirementColor()}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          {getRequirementIcon()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Approval Requirement</h2>
          <p className="text-sm font-medium text-text-secondary">{requirement}</p>
        </div>
      </div>
      
      <div className="bg-white/60 p-4 rounded-md text-sm text-text-primary leading-relaxed border border-white/40">
        {detail}
      </div>
    </div>
  );
}
