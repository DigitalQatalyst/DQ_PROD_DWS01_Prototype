import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function EscalationSignalCard() {
  const handleEscalationClick = () => {
    toast.info('Escalation queue opened in prototype state');
  };

  return (
    <div 
      onClick={handleEscalationClick}
      className="bg-danger-surface border border-danger-text/30 rounded-card shadow-sm p-5 cursor-pointer hover:bg-danger-surface/80 transition-colors group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-danger-text">
          <Flame size={20} />
          <h2 className="text-lg font-bold">Active Escalations</h2>
        </div>
        <ArrowRight size={20} className="text-danger-text opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="flex items-end gap-3 mb-4">
        <span className="text-4xl font-bold text-danger-text leading-none">3</span>
        <span className="text-sm font-semibold text-danger-text/80 pb-1">Requires intervention</span>
      </div>

      <div className="space-y-2 pt-4 border-t border-danger-text/20">
        <div className="flex justify-between text-sm">
          <span className="text-danger-text/80 font-medium">Oldest escalation age</span>
          <span className="font-bold text-danger-text">4.2 hours</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-danger-text/80 font-medium">Most affected category</span>
          <span className="font-bold text-danger-text">Escalations</span>
        </div>
      </div>
    </div>
  );
}
