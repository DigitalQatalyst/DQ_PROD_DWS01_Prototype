import React from 'react';
import { Check } from 'lucide-react';
interface Stage0OnboardingStepperProps {
  steps: {
    id: number;
    title: string;
    description: string;
  }[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  onComplete: () => void;
}
export function Stage0OnboardingStepper({
  steps,
  activeStep,
  setActiveStep,
  onComplete
}: Stage0OnboardingStepperProps) {
  const currentStep = steps[activeStep - 1];
  return <div className="bg-white rounded-card border border-border-default p-8 shadow-sm">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary mb-1">
          Guided onboarding path
        </h3>
        <p className="text-sm text-text-secondary">
          Six steps to become productive in DWS.01.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
        {steps.map((step, i) => {
        const isCompleted = step.id < activeStep;
        const isActive = step.id === activeStep;
        const isClickable = isCompleted || isActive;
        return <button key={step.id} onClick={() => isClickable && setActiveStep(step.id)} disabled={!isClickable} className={`flex items-center gap-2 px-3 py-1.5 rounded-pill text-xs font-semibold whitespace-nowrap transition-colors
                ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-success-surface text-success-text hover:bg-success/20' : 'bg-surface text-text-disabled cursor-not-allowed'}`}>
              {isCompleted ? <Check size={12} /> : <span>{step.id}</span>}
              {step.title}
            </button>;
      })}
      </div>

      <div className="bg-surface rounded-card p-6 border border-border-subtle mb-8 min-h-[140px]">
        <h4 className="text-lg font-bold text-primary mb-3">
          Step {currentStep.id}: {currentStep.title}
        </h4>
        <p className="text-text-secondary leading-relaxed">
          {currentStep.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
        <button onClick={() => setActiveStep(Math.max(1, activeStep - 1))} disabled={activeStep === 1} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface rounded-button transition-colors disabled:opacity-50">
          Previous
        </button>

        {activeStep === steps.length ? <button onClick={onComplete} className="px-6 py-2 text-sm font-semibold bg-primary text-white hover:bg-navy-800 rounded-button transition-colors">
            Acknowledge and continue
          </button> : <button onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))} className="px-6 py-2 text-sm font-semibold bg-primary text-white hover:bg-navy-800 rounded-button transition-colors">
            Next
          </button>}
      </div>
    </div>;
}