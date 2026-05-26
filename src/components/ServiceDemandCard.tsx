import React from 'react';
import type { CategoryDemand } from '../types/serviceLifecycle';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceDemandCardProps {
  demand: CategoryDemand[];
}

export function ServiceDemandCard({ demand }: ServiceDemandCardProps) {
  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) return <ArrowUpRight size={14} className="text-warning-text" />;
    if (trend.startsWith('-')) return <ArrowDownRight size={14} className="text-success-text" />;
    return <Minus size={14} className="text-text-muted" />;
  };

  const handleCategoryClick = (category: string) => {
    toast.info(`Demand details for ${category} opened in prototype state`);
  };

  return (
    <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-border-default bg-surface/30">
        <h2 className="text-lg font-bold text-primary">Service Demand by Category</h2>
        <p className="text-sm text-text-secondary mt-1">Open requests and short-term trend.</p>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle text-xs font-bold text-text-muted uppercase tracking-wider bg-surface/50">
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Open</th>
              <th className="px-5 py-3 text-center">Trend</th>
              <th className="px-5 py-3 text-center">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {demand.map((item) => (
              <tr 
                key={item.category} 
                onClick={() => handleCategoryClick(item.category)}
                className="hover:bg-surface/50 transition-colors cursor-pointer"
              >
                <td className="px-5 py-3">
                  <span className="text-sm font-semibold text-primary">{item.category}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-sm font-mono font-medium text-text-secondary">{item.open}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {getTrendIcon(item.trend)}
                    <span className="text-xs font-medium text-text-secondary">{item.trend}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-center">
                  {item.risk === 'High' && <AlertTriangle size={14} className="text-danger-text inline-block" />}
                  {item.risk === 'Medium' && <div className="w-2 h-2 rounded-full bg-warning-text inline-block" />}
                  {item.risk === 'Low' && <div className="w-2 h-2 rounded-full bg-success-text inline-block" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
