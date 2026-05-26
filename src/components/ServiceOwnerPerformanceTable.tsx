import React from 'react';
import type { ServiceOwnerPerformance } from '../types/serviceLifecycle';
import { toast } from 'sonner';

interface ServiceOwnerPerformanceTableProps {
  performance: ServiceOwnerPerformance[];
}

export function ServiceOwnerPerformanceTable({ performance }: ServiceOwnerPerformanceTableProps) {
  const handleOwnerClick = () => {
    toast.info('Service owner detail opened in prototype state');
  };

  return (
    <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-border-default bg-surface/30">
        <h2 className="text-lg font-bold text-primary">Service Owner Performance</h2>
        <p className="text-sm text-text-secondary mt-1">Delivery health across major service owners.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle text-xs font-bold text-text-muted uppercase tracking-wider bg-surface/50">
              <th className="px-5 py-3">Service Owner</th>
              <th className="px-5 py-3 text-right">Open</th>
              <th className="px-5 py-3 text-right">At Risk</th>
              <th className="px-5 py-3 text-right">Closed (7d)</th>
              <th className="px-5 py-3 text-right">Avg Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {performance.map((item, idx) => (
              <tr 
                key={idx} 
                onClick={handleOwnerClick}
                className="hover:bg-surface/50 transition-colors cursor-pointer"
              >
                <td className="px-5 py-3 text-sm font-semibold text-primary">{item.owner}</td>
                <td className="px-5 py-3 text-sm font-mono text-text-secondary text-right">{item.open}</td>
                <td className="px-5 py-3 text-sm font-mono text-warning-text font-bold text-right">{item.atRisk}</td>
                <td className="px-5 py-3 text-sm font-mono text-text-secondary text-right">{item.closed}</td>
                <td className="px-5 py-3 text-sm font-mono text-text-secondary text-right">{item.avgResponse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
