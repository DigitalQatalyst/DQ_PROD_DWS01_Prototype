import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, FileText, ArrowRightLeft, Handshake, Flame, CheckCircle, Send, RotateCcw } from 'lucide-react';
import type { FulfilmentRequestRow } from '../../types/requestsConsole';

interface Props {
  request: FulfilmentRequestRow;
}

export function RequestFulfilmentActionRail({ request }: Props) {
  const navigate = useNavigate();
  const base = `/stage-03/requests-console/${request.id}`;

  const actions = [
    { label: 'Update Progress', icon: Pencil, path: `${base}/progress`, color: 'text-primary bg-primary/10 hover:bg-primary/20' },
    { label: 'Add Evidence', icon: FileText, path: `${base}/progress`, color: 'text-info bg-info/10 hover:bg-info/20' },
    { label: 'Reassign', icon: ArrowRightLeft, path: `${base}/handoff`, color: 'text-text-muted bg-surface hover:bg-surface-hover' },
    { label: 'Handoff', icon: Handshake, path: `${base}/handoff`, color: 'text-warning bg-warning/10 hover:bg-warning/20' },
    { label: 'Escalate', icon: Flame, path: `${base}/escalate`, color: 'text-danger bg-danger/10 hover:bg-danger/20' },
    { label: 'Mark Fulfilled', icon: CheckCircle, path: '#', color: 'text-success bg-success/10 hover:bg-success/20' },
    { label: 'Send to Closure Review', icon: Send, path: `${base}/closure`, color: 'text-info bg-info/10 hover:bg-info/20' },
    { label: 'Reopen', icon: RotateCcw, path: `${base}/closure`, color: 'text-warning bg-warning/10 hover:bg-warning/20' },
  ];

  return (
    <div className="bg-white rounded-card border border-border-default p-4 sticky top-24">
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Actions</h3>
      <div className="space-y-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => a.path !== '#' && navigate(a.path)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-button text-sm font-semibold transition-colors ${a.color}`}
          >
            <a.icon size={15} />
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
