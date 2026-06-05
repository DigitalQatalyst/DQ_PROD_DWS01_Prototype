import React from 'react';
import { ShieldCheck, XCircle, RotateCcw } from 'lucide-react';
import type { ClosureReviewRecord } from '../../types/requestsConsole';

interface Props {
  review: ClosureReviewRecord | undefined;
}

export function ClosureQualityPanel({ review }: Props) {
  if (!review) {
    return (
      <div className="bg-white rounded-card border border-border-default p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={16} className="text-text-muted" />
          <h3 className="text-sm font-bold text-primary">Closure Quality</h3>
        </div>
        <p className="text-sm text-text-muted py-4 text-center">No closure review</p>
      </div>
    );
  }

  const isRejected = review.closureStatus === 'Rejected' || review.closureStatus === 'Reopened';
  const isClosed = review.closureStatus === 'Closed';

  return (
    <div className={`rounded-card border p-6 ${
      isClosed ? 'bg-success-surface border-success/30' :
      isRejected ? 'bg-danger-surface border-danger/30' :
      'bg-white border-border-default'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={16} className={isClosed ? 'text-success' : isRejected ? 'text-danger' : 'text-text-muted'} />
        <h3 className="text-sm font-bold text-primary">Closure Quality</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Evidence Quality</span>
          <span className={`text-xs font-bold ${
            review.evidenceQuality === 'Accepted' ? 'text-success' :
            review.evidenceQuality === 'Weak' ? 'text-warning' :
            'text-text-muted'
          }`}>{review.evidenceQuality}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Outcome Quality</span>
          <span className={`text-xs font-bold ${
            review.outcomeQuality === 'Accepted' ? 'text-success' :
            review.outcomeQuality === 'Failed' ? 'text-danger' :
            'text-text-muted'
          }`}>{review.outcomeQuality}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Closure Status</span>
          <span className={`inline-flex items-center gap-1 text-xs font-bold ${
            isClosed ? 'text-success' : isRejected ? 'text-danger' : 'text-info'
          }`}>
            {isClosed && <XCircle size={12} />}
            {isRejected && <RotateCcw size={12} />}
            {review.closureStatus}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">Reviewer</span>
          <span className="text-sm font-medium text-text-secondary">{review.reviewer}</span>
        </div>
        {review.reopenReason && (
          <div className="pt-2 border-t border-border-subtle">
            <span className="text-xs text-text-muted font-medium block mb-1">Reopen Reason</span>
            <p className="text-sm text-danger">{review.reopenReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
