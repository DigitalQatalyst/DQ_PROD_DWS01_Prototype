import React from 'react';
import { ListChecks } from 'lucide-react';

interface RequiredInputsListProps {
  inputs: string[];
}

export function RequiredInputsList({ inputs }: RequiredInputsListProps) {
  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary">
          <ListChecks size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Required Information</h2>
          <p className="text-sm text-text-secondary">Please gather these details before starting your request.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inputs.map((input, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-surface rounded-md border border-border-subtle">
            <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="text-xs font-bold">{i + 1}</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{input}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
