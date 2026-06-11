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

const sectionTitleClass =
  'mb-4 border-b border-border-subtle pb-2 text-sm font-semibold uppercase tracking-wider text-primary';

const metadataLabelClass =
  'mb-1 flex items-center gap-2 text-xs text-text-muted';

const metadataValueClass = 'pl-5 text-sm font-medium text-primary';

export function RequestWorkflowContextRail({
  detail,
  steps,
  currentStep,
  stage = 'deploy',
}: RequestWorkflowContextRailProps) {
  return (
    <div className="dq-card sticky top-[88px] p-6">
      <section className="mb-8">
        <h3 className={sectionTitleClass}>Request Progress</h3>
        <ol>
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isPast = step.id < currentStep;
            const isLast = index === steps.length - 1;

            return (
              <li key={step.id} className="flex gap-3">
                <div className="flex flex-col items-center self-stretch">
                  {isPast ? (
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-success-text"
                      strokeWidth={2}
                    />
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
                  {!isLast && (
                    <div
                      className={`my-1.5 w-px flex-1 ${
                        isPast ? 'bg-success-text/30' : 'bg-border-subtle'
                      }`}
                      aria-hidden
                    />
                  )}
                </div>
                <span
                  className={`pb-4 text-sm leading-5 ${
                    isActive
                      ? 'font-semibold text-primary'
                      : isPast
                        ? 'text-success-text'
                        : 'text-text-muted'
                  } ${isLast ? 'pb-0' : ''}`}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mb-4">
        <h3 className={sectionTitleClass}>Governance Metadata</h3>
        <div className="space-y-4">
          <div>
            <div className={metadataLabelClass}>
              <User size={14} />
              <span>Service Owner</span>
            </div>
            <div className={metadataValueClass}>{detail.owner}</div>
          </div>

          <div>
            <div className={metadataLabelClass}>
              <ListTree size={14} />
              <span>Fulfilment Queue</span>
            </div>
            <div className={metadataValueClass}>{detail.queue}</div>
          </div>

          <div>
            <div className={metadataLabelClass}>
              <Clock size={14} />
              <span>Fulfilment SLA</span>
            </div>
            <div className={metadataValueClass}>{detail.sla}</div>
          </div>

          <div>
            <div className={metadataLabelClass}>
              <ShieldAlert size={14} />
              <span>Approval</span>
            </div>
            <div className="pl-5">
              <ApprovalBadge requirement={detail.approval} label={detail.approvalDetail} />
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border-subtle pt-4">
        <Link
          to={`/marketplace/services/${detail.serviceId}?from=${stage}`}
          className="flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
        >
          View service detail
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
