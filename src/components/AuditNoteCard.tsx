import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface AuditNoteCardProps {
  note: string;
}

export function AuditNoteCard({ note }: AuditNoteCardProps) {
  return (
    <div className="bg-surface rounded-card border border-border-default p-6 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-white border border-border-subtle flex items-center justify-center text-text-secondary shrink-0 shadow-sm">
        <ShieldAlert size={20} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Governance & Audit</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{note}</p>
      </div>
    </div>
  );
}
