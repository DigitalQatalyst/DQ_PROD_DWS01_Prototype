import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { ServiceDetail } from '../types/serviceLifecycle';
import {
  RequestWorkflowStepper,
  type RequestWorkflowStep,
} from './RequestWorkflowStepper';

interface RequestWorkflowContextRailProps {
  detail: ServiceDetail;
  steps: RequestWorkflowStep[];
  currentStep: number;
  stage?: string;
}

const sectionTitleClass =
  'mb-4 border-b border-border-subtle pb-2 text-sm font-semibold uppercase tracking-wider text-primary';

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
        <RequestWorkflowStepper steps={steps} currentStep={currentStep} />
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
