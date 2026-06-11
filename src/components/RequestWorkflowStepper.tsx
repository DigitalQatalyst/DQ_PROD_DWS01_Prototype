import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface RequestWorkflowStep {
  id: number;
  label: string;
}

interface RequestWorkflowStepperProps {
  steps: RequestWorkflowStep[];
  currentStep: number;
}

export function RequestWorkflowStepper({
  steps,
  currentStep,
}: RequestWorkflowStepperProps) {
  return (
    <ol className="relative" aria-label="Request progress">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isPast = step.id < currentStep;
        const isLast = index === steps.length - 1;
        const connectorComplete = isPast;

        return (
          <li
            key={step.id}
            className={`relative flex gap-3 ${isLast ? '' : 'pb-6'}`}
          >
            <div className="relative flex w-6 shrink-0 flex-col items-center">
              {!isLast && (
                <div
                  className={`absolute left-1/2 top-6 bottom-0 w-0.5 -translate-x-1/2 ${
                    connectorComplete ? 'bg-success-text/35' : 'bg-border-subtle'
                  }`}
                  aria-hidden
                />
              )}

              {isPast ? (
                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-success-surface">
                  <CheckCircle2 size={16} className="text-success-text" strokeWidth={2} />
                </span>
              ) : (
                <span
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    isActive
                      ? 'border-primary bg-primary text-white'
                      : 'border-border-subtle bg-white text-text-muted'
                  }`}
                >
                  {step.id}
                </span>
              )}
            </div>

            <div className="min-w-0 pt-0.5">
              <span
                className={`block text-sm leading-5 ${
                  isActive
                    ? 'font-semibold text-primary'
                    : isPast
                      ? 'font-medium text-success-text'
                      : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
