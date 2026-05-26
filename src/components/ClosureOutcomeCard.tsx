import React from 'react';
import { FileCheck } from 'lucide-react';

interface ClosureOutcomeCardProps {
  outcome: string;
}

export function ClosureOutcomeCard({ outcome }: ClosureOutcomeCardProps) {
  return (
    <div className="bg-success-surface rounded-card border border-success-text/30 p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-white border border-success-text/20 flex items-center justify-center text-success-text shrink-0">
          <FileCheck size={16} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary mb-1">Closure Outcome</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{outcome}</p>
        </div>
      </div>
    </div>
  );
}
