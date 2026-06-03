import React from 'react';
import type { ServiceDetail } from '../types/serviceLifecycle';
import { FileText } from 'lucide-react';

interface ReviewSubmitSummaryProps {
  title: string;
  urgency: string;
  expectedOutcome: string;
  dynamicFields: Record<string, string>;
  requiredInputs: string[];
}

export function ReviewSubmitSummary({ title, urgency, expectedOutcome, dynamicFields, requiredInputs }: ReviewSubmitSummaryProps) {
  return (
    <div className="bg-white rounded-card border border-border-default overflow-hidden">
      <div className="border-b border-border-default p-6 bg-surface/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Request Summary</h2>
            <p className="text-sm text-text-secondary">Please review your input before final submission.</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Core Details</h3>
          <div className="bg-surface rounded-md border border-border-subtle p-4 space-y-4">
            <div>
              <span className="block text-xs text-text-secondary mb-1">Request Title</span>
              <span className="text-sm font-medium text-primary">{title || 'Untitled Request'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-text-secondary mb-1">Urgency</span>
                <span className="text-sm font-medium text-primary">{urgency}</span>
              </div>
            </div>
            <div>
              <span className="block text-xs text-text-secondary mb-1">Expected Outcome</span>
              <span className="text-sm font-medium text-primary block whitespace-pre-wrap">
                {expectedOutcome || 'None provided'}
              </span>
            </div>
          </div>
        </div>

        {requiredInputs.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Specific Information</h3>
            <div className="bg-surface rounded-md border border-border-subtle p-4 space-y-4">
              {requiredInputs.map(input => (
                <div key={input}>
                  <span className="block text-xs text-text-secondary mb-1 capitalize">{input}</span>
                  <span className="text-sm font-medium text-primary">
                    {dynamicFields[input] || <span className="text-text-muted italic">Not provided</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
