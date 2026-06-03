import React from 'react';
import type { Service } from '../types/serviceLifecycle';
import { CategoryBadge } from './CategoryBadge';
import { User, ListTree, Clock, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

interface RequestWorkflowContextBannerProps {
  service: Service;
}

export function RequestWorkflowContextBanner({ service }: RequestWorkflowContextBannerProps) {
  const getApprovalIcon = () => {
    switch (service.approval) {
      case 'Required': return <ShieldAlert size={14} className="text-warning-text" />;
      case 'Conditional': return <ShieldQuestion size={14} className="text-info-text" />;
      case 'Not Required': return <ShieldCheck size={14} className="text-success-text" />;
    }
  };

  return (
    <div className="bg-surface rounded-card border border-border-default p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-lg font-bold text-primary">{service.title}</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-border-default text-text-muted">
            Draft
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CategoryBadge category={service.category} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-secondary bg-white p-2.5 rounded-md border border-border-subtle">
        <div className="flex items-center gap-1.5 border-r border-border-default pr-4">
          <User size={14} className="text-text-muted" />
          <span>{service.owner}</span>
        </div>
        <div className="flex items-center gap-1.5 border-r border-border-default pr-4">
          <ListTree size={14} className="text-text-muted" />
          <span>Queue</span>
        </div>
        <div className="flex items-center gap-1.5 border-r border-border-default pr-4">
          <Clock size={14} className="text-text-muted" />
          <span>SLA: {service.sla}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {getApprovalIcon()}
          <span>{service.approval} Approval</span>
        </div>
      </div>
    </div>
  );
}
