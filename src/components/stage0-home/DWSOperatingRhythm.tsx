import React from 'react';
import { ArrowRight, BarChart3, LineChart, Play, Search, ShieldCheck } from 'lucide-react';
import { operatingRhythmSteps } from '../../mocks/stage0Home.mock';

const stepIcons = [Search, Play, LineChart, ShieldCheck, BarChart3];

export function DWSOperatingRhythm() {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-semibold text-primary">DWS Operating Rhythm</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {operatingRhythmSteps.map((step, index) => {
          const Icon = stepIcons[index] ?? Search;
          return (
            <React.Fragment key={step.label}>
              <article className="flex flex-1 flex-col rounded-card border border-border-subtle bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-primary">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-primary">{step.label}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{step.description}</p>
              </article>
              {index < operatingRhythmSteps.length - 1 && (
                <div className="hidden items-center justify-center text-text-disabled lg:flex">
                  <ArrowRight size={18} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
