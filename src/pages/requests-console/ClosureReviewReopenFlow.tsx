import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestsConsole } from '../../context/RequestsConsoleContext';

export function ClosureReviewReopenFlow() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { getRequestById, getClosureReview, acceptClosure, rejectClosure, reopenRequest } = useRequestsConsole();

  const request = requestId ? getRequestById(requestId) : undefined;
  const review = requestId ? getClosureReview(requestId) : undefined;

  const [reopenReason, setReopenReason] = useState('');
  const [correctionRequired, setCorrectionRequired] = useState('');

  if (!request || !review) {
    return (
      <div className="bg-[#F6F6FB] min-h-full pb-12">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8">
          <p className="text-sm text-text-muted">No closure review found for this request.</p>
        </div>
      </div>
    );
  }

  const handleAccept = () => {
    acceptClosure(request.id);
    navigate(`/stage-03/requests-console/${request.id}`);
  };

  const handleReject = () => {
    if (!reopenReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    rejectClosure(request.id, reopenReason.trim());
    navigate(`/stage-03/requests-console/${request.id}`);
  };

  const handleReopen = () => {
    if (!reopenReason.trim()) {
      toast.error('Reopen reason is required');
      return;
    }
    reopenRequest(request.id, reopenReason.trim());
    navigate(`/stage-03/requests-console/${request.id}`);
  };

  return (
    <div className="bg-[#F6F6FB] min-h-full pb-12">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/stage-03/requests-console/${request.id}`)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary mb-6"
        >
          <ArrowLeft size={16} /> Back to {request.id}
        </button>

        <div className="bg-white rounded-card border border-border-default p-6 lg:p-8 mb-6">
          <h1 className="text-xl font-bold text-primary mb-1">Closure Review</h1>
          <p className="text-sm text-text-muted mb-6">{request.id} — {request.title}</p>

          <div className="space-y-5">
            <div className="rounded-lg bg-surface p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted font-medium">Evidence Quality</span>
                <span className={`font-bold ${
                  review.evidenceQuality === 'Accepted' ? 'text-success' :
                  review.evidenceQuality === 'Weak' ? 'text-warning' : 'text-text-muted'
                }`}>{review.evidenceQuality}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-text-muted font-medium">Outcome Quality</span>
                <span className={`font-bold ${
                  review.outcomeQuality === 'Accepted' ? 'text-success' :
                  review.outcomeQuality === 'Failed' ? 'text-danger' : 'text-text-muted'
                }`}>{review.outcomeQuality}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-text-muted font-medium">Closure Status</span>
                <span className="font-semibold text-primary">{review.closureStatus}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-text-muted font-medium">Reviewer</span>
                <span className="font-medium text-text-secondary">{review.reviewer}</span>
              </div>
            </div>

            {(review.closureStatus === 'Reopened' || request.fulfilmentStatus === 'Reopened') && (
              <div className="rounded-lg bg-danger-surface/50 p-4 ring-1 ring-danger/20">
                <p className="text-sm font-semibold text-danger mb-1">Reopened</p>
                <p className="text-sm text-text-secondary">{review.reopenReason}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Reopen / Rejection Reason</label>
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                rows={3}
                placeholder="Why should this closure be rejected or the request reopened?"
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Correction Required</label>
              <textarea
                value={correctionRequired}
                onChange={(e) => setCorrectionRequired(e.target.value)}
                rows={2}
                placeholder="What correction is needed before closure? (optional)"
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => navigate(`/stage-03/requests-console/${request.id}`)}
            className="px-4 py-2 rounded-button border border-border-strong bg-white text-sm font-semibold text-primary hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReopen}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-warning text-white text-sm font-semibold hover:bg-warning/90 transition-colors"
          >
            <RotateCcw size={15} /> Reopen
          </button>
          <button
            onClick={handleReject}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors"
          >
            <XCircle size={15} /> Reject Closure
          </button>
          <button
            onClick={handleAccept}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-success text-white text-sm font-semibold hover:bg-success/90 transition-colors"
          >
            <CheckCircle size={15} /> Accept Closure
          </button>
        </div>
      </div>
    </div>
  );
}
