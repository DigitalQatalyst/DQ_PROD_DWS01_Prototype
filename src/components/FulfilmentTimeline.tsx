import React from 'react';
import { GitCommit } from 'lucide-react';

interface FulfilmentTimelineProps {
  path: string;
}

export function FulfilmentTimeline({ path }: FulfilmentTimelineProps) {
  // Parse the string into steps, typically delimited by "→" or "->"
  const steps = path.split(/→|->/).map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <h2 className="text-xl font-bold text-primary mb-6">Fulfilment Path</h2>
      
      <div className="relative">
        <div className="absolute left-6 top-6 bottom-6 w-px bg-border-strong" />
        
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-surface border-2 border-white flex items-center justify-center text-primary shadow-sm shrink-0">
                <GitCommit size={20} />
              </div>
              <div>
                <span className="text-sm font-semibold text-primary">{step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
