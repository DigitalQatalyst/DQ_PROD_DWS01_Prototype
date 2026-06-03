import React from 'react';
import { KnowledgeDetailRecord } from '../types/knowledgeDiscovery';
import { FileEdit, CheckCircle2 } from 'lucide-react';

interface VersionHistoryListProps {
  detail: KnowledgeDetailRecord;
}

export function VersionHistoryList({ detail }: VersionHistoryListProps) {
  if (!detail.versionHistory || detail.versionHistory.length === 0) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
      <h2 className="mb-5 text-lg font-bold text-text-primary">Version History</h2>
      <div className="space-y-3">
        {detail.versionHistory.map((v, i) => (
          <div key={v.version} className={`flex items-start gap-4 rounded-lg px-4 py-3 ${i === 0 ? 'bg-navy-50 ring-1 ring-primary/10' : 'bg-surface ring-1 ring-border-subtle'}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border-subtle">
              {i === 0
                ? <CheckCircle2 size={15} className="text-primary" />
                : <FileEdit size={15} className="text-text-muted" />
              }
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-sm font-bold ${i === 0 ? 'text-primary' : 'text-text-primary'}`}>
                  v{v.version}
                </span>
                {i === 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Current</span>
                )}
                <span className="text-xs text-text-muted">{v.date}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  v.status === 'Effective' ? 'bg-success/10 text-success' : 'bg-surface text-text-muted ring-1 ring-border-subtle'
                }`}>{v.status}</span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">{v.summary}</p>
              <p className="mt-0.5 text-xs text-text-muted">Reviewed by: {v.reviewer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
