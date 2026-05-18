import React, { Fragment } from 'react';
export function Stage0D4Strip() {
  const steps = [{
    id: 'D1',
    title: 'Discern',
    description: 'Discover work, services, knowledge'
  }, {
    id: 'D2',
    title: 'Design',
    description: 'Define tasks, workflows, ownership'
  }, {
    id: 'D3',
    title: 'Deploy',
    description: 'Execute and collaborate'
  }, {
    id: 'D4',
    title: 'Drive',
    description: 'Govern, measure, improve'
  }];
  return <section className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-navy-600 tracking-wider uppercase">
          DWS.01 Operating Model
        </h2>
        <span className="text-xs text-navy-400">4-stage execution model</span>
      </div>

      <div className="bg-white border border-border rounded-card overflow-hidden flex flex-col md:flex-row">
        {steps.map((step, index) => <Fragment key={step.id}>
            <div className="flex-1 p-5 relative">
              <div className="text-xs font-bold text-primary mb-1">
                {step.id}
              </div>
              <h3 className="text-sm font-bold text-navy-900 mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-navy-600">{step.description}</p>
            </div>
            {index < steps.length - 1 && <div className="hidden md:block w-px bg-border my-4" />}
            {index < steps.length - 1 && <div className="md:hidden h-px bg-border mx-4" />}
          </Fragment>)}
      </div>
    </section>;
}