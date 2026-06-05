import React from 'react';
import { User } from 'lucide-react';
import type { FulfilmentRequestRow } from '../../types/requestsConsole';

interface Props {
  request: FulfilmentRequestRow;
}

export function RequesterContextCard({ request }: Props) {
  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="flex items-center gap-2 mb-4">
        <User size={16} className="text-text-muted" />
        <h3 className="text-sm font-bold text-primary">Requester Context</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Requester</span>
          <span className="text-sm font-semibold text-primary">{request.requester}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Category</span>
          <span className="text-sm font-medium text-text-secondary">{request.category}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Source</span>
          <span className="text-sm font-medium text-text-secondary">Stage 02 Submission</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Request Age</span>
          <span className="text-sm font-medium text-text-secondary">{request.age}</span>
        </div>
      </div>
    </div>
  );
}
