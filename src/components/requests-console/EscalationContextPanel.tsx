import React from 'react';
import { Flame } from 'lucide-react';
import type { EscalationRecord } from '../../types/requestsConsole';
import { MonoId } from '../MonoId';

interface Props {
  escalations: EscalationRecord[];
}

export function EscalationContextPanel({ escalations }: Props) {
  if (escalations.length === 0) {
    return (
      <div className="bg-white rounded-card border border-border-default p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={16} className="text-text-muted" />
          <h3 className="text-sm font-bold text-primary">Escalation Context</h3>
        </div>
        <p className="text-sm text-text-muted py-4 text-center">No escalations</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={16} className="text-danger" />
        <h3 className="text-sm font-bold text-primary">Escalation Context</h3>
      </div>

      <div className="space-y-4">
        {escalations.map((e) => (
          <div key={e.id} className="rounded-lg bg-danger-surface/50 p-4 ring-1 ring-danger/20">
            <div className="flex items-center gap-2 mb-2">
              <MonoId value={e.id} />
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                e.severity === 'High' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
              }`}>
                {e.severity}
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-2">{e.reason}</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted font-medium">SLA Impact</span>
                <span className={`font-bold ${e.slaImpact === 'Breached' ? 'text-danger' : 'text-warning'}`}>{e.slaImpact}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted font-medium">Owner</span>
                <span className="font-medium text-text-secondary">{e.owner}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted font-medium">Resolution Path</span>
                <span className="font-medium text-text-secondary text-right max-w-[200px]">{e.resolutionPath}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
