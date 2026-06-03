import React from 'react';
import { AlertCircle } from 'lucide-react';

export function SlaExposureCard() {
  // Using static prototype data mapped from the prompt
  return (
    <div className="bg-white rounded-card border border-border-default shadow-sm p-5 mb-6">
      <h2 className="text-lg font-bold text-primary mb-1">SLA Exposure</h2>
      <p className="text-sm text-text-secondary mb-6">Current health of active service delivery.</p>
      
      <div className="space-y-4">
        
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-danger-text flex items-center gap-1.5">
              <AlertCircle size={14} /> Breached
            </span>
            <span className="font-mono font-medium">1</span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div className="bg-danger-text h-2 rounded-full" style={{ width: '5%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-warning-text">At Risk (&lt;4h remaining)</span>
            <span className="font-mono font-medium">7</span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div className="bg-warning-text h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-success-text">On Track</span>
            <span className="font-mono font-medium">30</span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div className="bg-success-text h-2 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>

      </div>
    </div>
  );
}
