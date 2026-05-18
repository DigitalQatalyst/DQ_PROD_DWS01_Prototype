import React from 'react';
import type { Task } from '../types/platform';
import { FileCheck, FileWarning, FileX, Paperclip } from 'lucide-react';
interface EvidenceListProps {
  task: Task;
}
export function EvidenceList({
  task
}: EvidenceListProps) {
  const state = task.evidenceState;
  const config = {
    Missing: {
      icon: FileX,
      color: 'text-danger',
      bg: 'bg-danger-surface',
      text: 'Evidence Missing'
    },
    Partial: {
      icon: FileWarning,
      color: 'text-warning-text',
      bg: 'bg-warning-surface',
      text: 'Partial Evidence'
    },
    Attached: {
      icon: Paperclip,
      color: 'text-info-text',
      bg: 'bg-info-surface',
      text: 'Evidence Attached'
    },
    Accepted: {
      icon: FileCheck,
      color: 'text-success',
      bg: 'bg-success-surface',
      text: 'Evidence Accepted'
    }
  }[state];
  const Icon = config.icon;
  return <div className="space-y-3">
      <div className={`flex items-center gap-2 p-3 rounded-button ${config.bg} ${config.color}`}>
        <Icon size={18} />
        <span className="text-sm font-medium">{config.text}</span>
      </div>

      {state !== 'Missing' && <div className="border border-border-default rounded-card divide-y divide-border-subtle">
          <div className="p-3 flex items-center justify-between hover:bg-surface transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Paperclip size={16} className="text-text-muted" />
              <span className="text-sm text-primary font-medium">
                closure_report_v1.pdf
              </span>
            </div>
            <span className="text-xs text-text-muted">1.2 MB</span>
          </div>
          {state === 'Accepted' && <div className="p-3 flex items-center justify-between hover:bg-surface transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Paperclip size={16} className="text-text-muted" />
                <span className="text-sm text-primary font-medium">
                  approval_signoff.msg
                </span>
              </div>
              <span className="text-xs text-text-muted">45 KB</span>
            </div>}
        </div>}
    </div>;
}