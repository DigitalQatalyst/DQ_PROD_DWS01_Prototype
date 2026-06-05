import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { SlaStatusPill } from './SlaStatusPill';
import type { SlaRecord } from '../../types/requestsConsole';

interface Props {
  sla: SlaRecord | undefined;
}

export function SlaAgeingCard({ sla }: Props) {
  if (!sla) {
    return (
      <div className="bg-white rounded-card border border-border-default p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-text-muted" />
          <h3 className="text-sm font-bold text-primary">SLA & Ageing</h3>
        </div>
        <p className="text-sm text-text-muted">No SLA record found</p>
      </div>
    );
  }

  const isBreached = sla.slaState === 'Breached';
  const isAtRisk = sla.slaState === 'At Risk';

  return (
    <div className={`rounded-card border p-6 ${isBreached ? 'bg-danger-surface border-danger/30' : isAtRisk ? 'bg-warning-surface border-warning/30' : 'bg-white border-border-default'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className={isBreached ? 'text-danger' : isAtRisk ? 'text-warning' : 'text-text-muted'} />
        <h3 className="text-sm font-bold text-primary">SLA & Ageing</h3>
        {(isBreached || isAtRisk) && <AlertTriangle size={14} className={isBreached ? 'text-danger' : 'text-warning'} />}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">SLA State</span>
          <SlaStatusPill state={sla.slaState} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Started</span>
          <span className="text-sm font-medium text-text-secondary">{sla.started}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Due</span>
          <span className="text-sm font-semibold text-primary">{sla.due}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Time Remaining</span>
          <span className={`text-sm font-bold ${isBreached ? 'text-danger' : isAtRisk ? 'text-warning' : 'text-primary'}`}>
            {sla.timeRemaining}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Breach State</span>
          <span className={`text-xs font-bold ${isBreached ? 'text-danger' : 'text-success'}`}>
            {sla.breachState}
          </span>
        </div>
      </div>
    </div>
  );
}
