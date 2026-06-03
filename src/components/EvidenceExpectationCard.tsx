import React from 'react';
import { KnowledgeAssetFull } from '../types/knowledgeDiscovery';
import { Paperclip, AlertCircle, XCircle } from 'lucide-react';

interface EvidenceExpectationCardProps {
  asset: KnowledgeAssetFull;
}

export function EvidenceExpectationCard({ asset }: EvidenceExpectationCardProps) {
  if (!asset.evidenceExpectation && !asset.closureImpact) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
      <h2 className="mb-5 text-lg font-bold text-text-primary">Evidence & Output Expectations</h2>

      {asset.evidenceExpectation && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
            <Paperclip size={13} />
            Expected Output / Evidence
          </div>
          <div className="rounded-lg bg-surface px-4 py-3 text-sm text-text-secondary ring-1 ring-border-subtle">
            {asset.evidenceExpectation}
          </div>
        </div>
      )}

      {asset.closureImpact && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold">Closure impact: </span>
            {asset.closureImpact}
          </div>
        </div>
      )}

      {!asset.evidenceExpectation && (
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <XCircle size={15} />
          No specific evidence requirement defined for this asset type.
        </div>
      )}
    </div>
  );
}
