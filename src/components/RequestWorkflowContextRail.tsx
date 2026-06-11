import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  ListTree,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import type { ServiceDetail } from '../types/serviceLifecycle';
import { ApprovalBadge } from './ApprovalBadge';

interface WorkflowStep {
  id: number;
  label: string;
}

interface RequestWorkflowContextRailProps {
  detail: ServiceDetail;
  steps: WorkflowStep[];
  currentStep: number;
  stage?: string;
}

export function RequestWorkflowContextRail({
  detail,
  steps,
  currentStep,
  stage = 'deploy',
}: RequestWorkflowContextRailProps) {
  return (
    <div className="dq-card sticky top-[88px] space-y-6 p-6">
      <div>
        <h3 className="mb-3 border-b border-border-subtle pb-2 text-sm font-semibold uppercase tracking-wider text-primary">
          Request Progress
        </h3>
        <ol className="space-y-2">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isPast = step.id < currentStep;

            return (
              <li
                key={step.id}
                className={`flex items-center gap-2 text-sm ${
                  isActive
                    ? 'font-semibold text-primary'
                    : isPast
                      ? 'text-success-text'
                      : 'text-text-muted'
                }`}
              >
                {isPast ? (
                  <CheckCircle2 size={14} className="shrink-0" />
                ) : (
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                      isActive
                        ? 'border-primary bg-primary text-white'
                        : 'border-border-strong bg-surface text-text-muted'
                    }`}
                  >
                    {step.id}
                  </span>
                )}
                <span>{step.label}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div>
        <h3 className="mb-3 border-b border-border-subtle pb-2 text-sm font-semibold uppercase tracking-wider text-primary">
          Governance Metadata
        </h3>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-text-muted">
              <User size={14} />
              <span>Service Owner</span>
            </div>
            <div className="pl-5 text-sm font-medium text-primary">{detail.owner}</div>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-text-muted">
              <ListTree size={14} />
              <span>Fulfilment Queue</span>
            </div>
            <div className="pl-5 text-sm font-medium text-primary">{detail.queue}</div>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-text-muted">
              <Clock size={14} />
              <span>Fulfilment SLA</span>
            </div>
            <div className="pl-5 text-sm font-medium text-primary">{detail.sla}</div>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-text-muted">
              <ShieldAlert size={14} />
              <span>Approval</span>
            </div>
            <div className="pl-5">
              <ApprovalBadge requirement={detail.approval} label={detail.approvalDetail} />
            </div>
          </div>

        </div>
      </div>

      <Link
        to={`/marketplace/services/${detail.serviceId}?from=${stage}`}
        className="flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
      >
        View service detail
        <ExternalLink size={14} />
      </Link>
    </div>
  );
}
