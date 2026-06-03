import React from 'react';
import { CategoryBadge } from './CategoryBadge';
import { ApprovalBadge } from './ApprovalBadge';
import { SlaBadge } from './SlaBadge';
import type { Service, ServiceDetail } from '../types/serviceLifecycle';
import { AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';

interface ServiceDetailHeroProps {
  service: Service;
  detail: ServiceDetail;
}

export function ServiceDetailHero({ service, detail }: ServiceDetailHeroProps) {
  // Map risk to a simple badge style
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Standard':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-button text-xs font-medium bg-success-surface text-success-text">
            <CheckCircle2 size={12} strokeWidth={1.5} />
            Standard Risk
          </span>
        );
      case 'At Risk':
      case 'Governance-sensitive':
      case 'Review-sensitive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-button text-xs font-medium bg-warning-surface text-warning-text">
            <AlertTriangle size={12} strokeWidth={1.5} />
            {risk}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-card border border-border-default p-8 mb-6">
      <div className="flex items-start justify-between mb-4">
        <CategoryBadge category={service.category} />
      </div>
      
      <h1 className="text-3xl font-bold text-primary mb-3">
        {service.title}
      </h1>
      
      <p className="text-lg text-text-secondary leading-relaxed mb-6 max-w-4xl">
        {detail.purpose}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        {getRiskBadge(service.risk)}
        
        <div className="flex items-center gap-2 border-l border-border-default pl-4">
          <span className="text-xs text-text-muted">SLA</span>
          <span className="text-sm font-medium text-primary">{service.sla}</span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-border-default pl-4">
          <ApprovalBadge requirement={service.approval} label={service.approvalDetail} />
        </div>
      </div>
    </div>
  );
}
