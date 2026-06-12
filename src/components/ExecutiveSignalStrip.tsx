import React from 'react';
import type { ExecutiveSignal } from '../types/serviceLifecycle';
import { noop } from '../utils/noop';

interface ExecutiveSignalStripProps {
  signals: ExecutiveSignal[];
}

export function ExecutiveSignalStrip({ signals }: ExecutiveSignalStripProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'info': return 'text-primary';
      case 'warning': return 'text-warning-text';
      case 'danger': return 'text-danger-text';
      case 'success': return 'text-success-text';
      default: return 'text-primary';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'warning': return 'border-warning-text/30';
      case 'danger': return 'border-danger-text/30';
      default: return 'border-border-default';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {signals.map((signal) => (
        <div 
          key={signal.id} 
          className={`bg-white rounded-card border ${getBorderColor(signal.status)} p-5 flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
          onClick={noop}
        >
          <span className="text-sm font-semibold text-text-secondary leading-snug">
            {signal.signal}
          </span>
          <div className="mt-4 flex items-end justify-between">
            <span className={`text-3xl font-bold ${getStatusColor(signal.status)}`}>
              {signal.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
