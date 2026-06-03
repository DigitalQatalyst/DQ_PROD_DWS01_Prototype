import React, { useState } from 'react';
import { KnowledgeAssetFull } from '../types/knowledgeDiscovery';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface CoreGuidancePreviewProps {
  asset: KnowledgeAssetFull;
}

export function CoreGuidancePreview({ asset }: CoreGuidancePreviewProps) {
  const [expanded, setExpanded] = useState(true);
  const guidance = asset.coreGuidance;

  if (!guidance) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Core Guidance</h2>
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary transition-colors"
        >
          {expanded ? <><ChevronUp size={14} /> Collapse</> : <><ChevronDown size={14} /> Expand</>}
        </button>
      </div>

      {expanded && (
        <div className="space-y-6">
          {/* Key Principles */}
          {guidance.principles.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-bold text-text-primary">Key Principles</h3>
              <ul className="space-y-2">
                {guidance.principles.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Steps */}
          {guidance.steps.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-bold text-text-primary">Steps</h3>
              <div className="space-y-2">
                {guidance.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-surface px-4 py-3 text-sm text-text-secondary">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {step.replace(/^\d+\.\s/, '')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {guidance.examples.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-bold text-text-primary">Examples</h3>
              <div className="space-y-3">
                {guidance.examples.map((ex, i) => (
                  <div key={i} className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm ${
                    ex.type === 'good'
                      ? 'bg-success/5 ring-1 ring-success/20'
                      : 'bg-danger/5 ring-1 ring-danger/20'
                  }`}>
                    {ex.type === 'good'
                      ? <CheckCircle2 size={16} className="mt-0.5 text-success shrink-0" />
                      : <XCircle size={16} className="mt-0.5 text-danger shrink-0" />
                    }
                    <span className={ex.type === 'good' ? 'text-success/90' : 'text-danger/90'}>
                      {ex.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {guidance.commonMistakes && guidance.commonMistakes.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-bold text-text-primary">Common Mistakes</h3>
              <ul className="space-y-2">
                {guidance.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-warning">
                    <XCircle size={15} className="mt-0.5 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exceptions */}
          {guidance.exceptions && guidance.exceptions.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-bold text-text-primary">Exceptions</h3>
              <ul className="space-y-2">
                {guidance.exceptions.map((ex, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
