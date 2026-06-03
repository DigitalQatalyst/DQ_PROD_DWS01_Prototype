import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkedWorkRecord } from '../types/knowledgeDiscovery';
import { ExternalLink, CheckSquare, Inbox } from 'lucide-react';

interface LinkedWorkPanelProps {
  records: LinkedWorkRecord[];
}

function statusColor(status: string) {
  if (status === 'In Progress') return 'text-primary bg-primary/10';
  if (status === 'Blocked') return 'text-danger bg-danger/10';
  if (status === 'Review Requested' || status === 'Closure Review') return 'text-warning bg-warning/10';
  if (status === 'Pending Approval' || status === 'Submitted') return 'text-info bg-info/10';
  return 'text-text-muted bg-surface';
}

export function LinkedWorkPanel({ records }: LinkedWorkPanelProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Linked Work</h2>
        <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-text-muted ring-1 ring-border-subtle">
          {records.length}
        </span>
      </div>

      {records.length === 0 ? (
        <div className="py-8 text-center text-sm text-text-muted">
          No tasks or requests are currently linked to this knowledge asset.
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(rec => (
            <div key={rec.id} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 ring-1 ring-border-subtle">
              <div className="flex items-center gap-3 min-w-0">
                {rec.targetType === 'Task'
                  ? <CheckSquare size={15} className="text-primary shrink-0" />
                  : <Inbox size={15} className="text-primary shrink-0" />
                }
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">{rec.targetTitle}</p>
                  <p className="text-xs text-text-muted">{rec.targetId} · {rec.targetType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusColor(rec.targetStatus)}`}>
                  {rec.targetStatus}
                </span>
                <button
                  onClick={() => navigate(rec.targetType === 'Task' ? `/tasks/${rec.targetId}` : `/requests/${rec.targetId}/status`)}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Open <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
