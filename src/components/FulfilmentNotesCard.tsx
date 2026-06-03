import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FulfilmentNotesCardProps {
  notes: string;
}

export function FulfilmentNotesCard({ notes }: FulfilmentNotesCardProps) {
  return (
    <div className="bg-white rounded-card border border-border-default p-5">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-text-muted" />
        <h3 className="text-sm font-bold text-primary">Fulfilment Notes</h3>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed bg-surface/50 p-3 rounded border border-border-subtle italic">
        "{notes}"
      </p>
    </div>
  );
}
