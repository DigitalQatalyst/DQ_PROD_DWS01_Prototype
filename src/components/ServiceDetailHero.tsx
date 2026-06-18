import React from 'react';
import { ApprovalBadge } from './ApprovalBadge';
import type { Service } from '../types/serviceLifecycle';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ServiceDetailHeroProps {
  service: Service;
}

export function ServiceDetailHero({ service }: ServiceDetailHeroProps) {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Standard':
        return (
          <span className="inline-flex items-center gap-1 rounded-button bg-success-surface px-2 py-1 text-xs font-medium text-success-text">
            <CheckCircle2 size={12} strokeWidth={1.5} />
            Standard Risk
          </span>
        );
      case 'At Risk':
      case 'Governance-sensitive':
      case 'Review-sensitive':
        return (
          <span className="inline-flex items-center gap-1 rounded-button bg-warning-surface px-2 py-1 text-xs font-medium text-warning-text">
            <AlertTriangle size={12} strokeWidth={1.5} />
            {risk}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {getRiskBadge(service.risk)}

      <div className="flex items-center gap-2 border-l border-border-default pl-4">
        <span className="text-xs text-text-muted">SLA</span>
        <span className="text-sm font-medium text-primary">{service.sla}</span>
      </div>

      <div className="flex items-center gap-2 border-l border-border-default pl-4">
        <ApprovalBadge requirement={service.approval} label={service.approvalDetail} />
      </div>
    </>
  );
}
