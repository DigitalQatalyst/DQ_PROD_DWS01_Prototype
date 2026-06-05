import React from 'react';
import { MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import type { ProgressUpdate } from '../../types/requestsConsole';

interface Props {
  updates: ProgressUpdate[];
}

function updateTypeIcon(type: string) {
  if (type === 'Blocker') return <AlertCircle size={14} className="text-danger shrink-0" />;
  if (type === 'Evidence Update') return <CheckCircle size={14} className="text-success shrink-0" />;
  return <MessageSquare size={14} className="text-info shrink-0" />;
}

export function ProgressUpdatesPanel({ updates }: Props) {
  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-text-muted" />
          <h3 className="text-sm font-bold text-primary">Progress Updates</h3>
        </div>
        <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-text-muted ring-1 ring-border-subtle">
          {updates.length}
        </span>
      </div>

      {updates.length === 0 ? (
        <p className="text-sm text-text-muted py-4 text-center">No progress updates yet</p>
      ) : (
        <div className="space-y-4">
          {updates.map((u) => (
            <div key={u.id} className="flex gap-3">
              <div className="mt-0.5">{updateTypeIcon(u.updateType)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">{u.updateType}</span>
                  <span className="text-xs text-text-muted">by {u.actor}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{u.note}</p>
                <span className="inline-block mt-1 text-[11px] font-medium text-text-muted">
                  Status after: {u.statusAfter}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
