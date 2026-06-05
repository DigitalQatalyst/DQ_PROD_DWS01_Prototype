import React from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { EvidenceStateBadge } from './EvidenceStateBadge';
import type { EvidenceRecord } from '../../types/requestsConsole';

interface Props {
  evidence: EvidenceRecord | undefined;
}

export function EvidenceOutcomePanel({ evidence }: Props) {
  if (!evidence) {
    return (
      <div className="bg-white rounded-card border border-border-default p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-text-muted" />
          <h3 className="text-sm font-bold text-primary">Evidence & Outcome</h3>
        </div>
        <p className="text-sm text-text-muted py-4 text-center">No evidence added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-text-muted" />
          <h3 className="text-sm font-bold text-primary">Evidence & Outcome</h3>
        </div>
        <EvidenceStateBadge state={evidence.evidenceState} />
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-xs text-text-muted font-medium block mb-1">Evidence Note</span>
          <p className="text-sm text-text-secondary bg-surface/50 p-3 rounded border border-border-subtle">
            {evidence.evidenceNote}
          </p>
        </div>
        <div>
          <span className="text-xs text-text-muted font-medium block mb-1">Outcome Statement</span>
          <p className="text-sm text-text-secondary">{evidence.outcomeStatement}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <span className="text-xs text-text-muted font-medium">Quality</span>
          <span className={`inline-flex items-center gap-1 text-xs font-bold ${
            evidence.quality === 'Accepted' ? 'text-success' :
            evidence.quality === 'Weak' ? 'text-warning' :
            evidence.quality === 'Pending' ? 'text-info' :
            'text-text-muted'
          }`}>
            {evidence.quality === 'Accepted' && <CheckCircle size={12} />}
            {evidence.quality === 'Weak' && <AlertTriangle size={12} />}
            {evidence.quality}
          </span>
        </div>
      </div>
    </div>
  );
}
