import React from 'react';
import { Link2, CheckSquare, Inbox, FileText, Zap, AlertTriangle } from 'lucide-react';
import type { LinkedWorkRecord } from '../../types/requestsConsole';

interface Props {
  records: LinkedWorkRecord[];
}

function typeIcon(type: string) {
  switch (type) {
    case 'Task': return <CheckSquare size={14} className="text-primary shrink-0" />;
    case 'Approval': return <FileText size={14} className="text-warning shrink-0" />;
    case 'Escalation': return <AlertTriangle size={14} className="text-danger shrink-0" />;
    case 'Knowledge': return <Inbox size={14} className="text-info shrink-0" />;
    case 'Workflow': return <Zap size={14} className="text-secondary shrink-0" />;
    default: return <Inbox size={14} className="text-text-muted shrink-0" />;
  }
}

function statusColor(status: string) {
  if (status === 'In Progress') return 'text-primary bg-primary/10';
  if (status === 'Active') return 'text-danger bg-danger/10';
  if (status === 'Awaiting Review') return 'text-warning bg-warning/10';
  if (status === 'Effective') return 'text-success bg-success/10';
  return 'text-text-muted bg-surface';
}

export function RequestLinkedWorkPanel({ records }: Props) {
  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link2 size={16} className="text-text-muted" />
          <h3 className="text-sm font-bold text-primary">Linked Work</h3>
        </div>
        <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-text-muted ring-1 ring-border-subtle">
          {records.length}
        </span>
      </div>

      {records.length === 0 ? (
        <p className="text-sm text-text-muted py-4 text-center">No linked work items</p>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 ring-1 ring-border-subtle">
              <div className="flex items-center gap-3 min-w-0">
                {typeIcon(r.type)}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">{r.linkedItem}</p>
                  <p className="text-xs text-text-muted">{r.relationship}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold shrink-0 ml-3 ${statusColor(r.status)}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
