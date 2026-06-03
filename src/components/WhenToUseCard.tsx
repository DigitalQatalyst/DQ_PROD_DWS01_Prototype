import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface WhenToUseCardProps {
  whenToUse: string[];
  whenNotToUse: string[];
}

export function WhenToUseCard({ whenToUse, whenNotToUse }: WhenToUseCardProps) {
  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <h2 className="text-xl font-bold text-primary mb-6">Service Usage Guidelines</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold text-success-text uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} />
            When to use this service
          </h3>
          <ul className="space-y-3">
            {whenToUse.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-success-text mt-2 shrink-0" />
                <span className="text-sm text-text-secondary leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-warning-text uppercase tracking-wider mb-4 flex items-center gap-2">
            <XCircle size={16} />
            When NOT to use this service
          </h3>
          <ul className="space-y-3">
            {whenNotToUse.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-warning-text mt-2 shrink-0" />
                <span className="text-sm text-text-secondary leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
