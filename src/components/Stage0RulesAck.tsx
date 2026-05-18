import React, { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
interface Stage0RulesAckProps {
  onAcknowledge: () => void;
}
export function Stage0RulesAck({
  onAcknowledge
}: Stage0RulesAckProps) {
  const [agreed, setAgreed] = useState(false);
  return <div className="bg-white rounded-card border border-border-default p-8 shadow-sm text-center max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-primary mb-3">
        Acknowledge Operating Rules
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        By entering your workspace, you agree to follow the Good Health Code and
        maintain execution quality across all tasks, requests, and approvals.
      </p>

      <button onClick={() => setAgreed(!agreed)} className="flex items-center justify-center gap-3 w-full p-4 rounded bg-surface hover:bg-navy-50 transition-colors mb-6 text-left">
        {agreed ? <CheckSquare size={24} className="text-secondary shrink-0" /> : <Square size={24} className="text-text-muted shrink-0" />}
        <span className="text-sm font-medium text-primary">
          I understand and agree to the DWS.01 operating rules.
        </span>
      </button>

      <button onClick={onAcknowledge} disabled={!agreed} className={`px-8 py-3 rounded-button font-semibold transition-colors ${agreed ? 'bg-primary text-white hover:bg-navy-800 shadow-md' : 'bg-surface text-text-disabled cursor-not-allowed'}`}>
        Enter Workspace
      </button>
    </div>;
}