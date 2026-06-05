import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestsConsole } from '../../context/RequestsConsoleContext';
import type { RequestPriority } from '../../types/requestsConsole';

export function EscalateRequestFlow() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { getRequestById, addEscalation } = useRequestsConsole();

  const request = requestId ? getRequestById(requestId) : undefined;

  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState<RequestPriority>('Medium');
  const [resolutionPath, setResolutionPath] = useState('');

  if (!request) {
    return (
      <div className="bg-[#F6F6FB] min-h-full pb-12">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8">
          <p className="text-sm text-text-muted">Request not found.</p>
        </div>
      </div>
    );
  }

  const handleEscalate = () => {
    if (!reason.trim()) {
      toast.error('Escalation reason is required');
      return;
    }
    addEscalation({
      requestId: request.id,
      reason: reason.trim(),
      severity,
      slaImpact: request.slaState,
      owner: 'Lead',
      resolutionPath: resolutionPath.trim() || 'To be determined',
    });
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
          <div className="flex items-center gap-2 mb-1">
            <Flame size={18} className="text-danger" />
            <h1 className="text-xl font-bold text-primary">Escalate Request</h1>
          </div>
          <p className="text-sm text-text-muted mb-6">{request.id} — {request.title}</p>

          <div className="space-y-5">
            <div className="rounded-lg bg-surface p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted font-medium">Current SLA State</span>
                <span className={`font-bold ${request.slaState === 'Breached' ? 'text-danger' : request.slaState === 'At Risk' ? 'text-warning' : 'text-success'}`}>
                  {request.slaState}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-text-muted font-medium">Current Owner</span>
                <span className="font-semibold text-primary">{request.owner}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Escalation Reason *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Why does this request need escalation?"
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Severity</label>
              <div className="flex gap-3">
                {(['Low', 'Medium', 'High'] as RequestPriority[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`flex-1 py-2 rounded-button text-sm font-semibold border transition-colors ${
                      severity === s
                        ? s === 'High' ? 'bg-danger/10 border-danger text-danger'
                          : s === 'Medium' ? 'bg-warning/10 border-warning text-warning'
                          : 'bg-surface border-border-strong text-primary'
                        : 'bg-white border-border-strong text-text-muted hover:bg-surface'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Resolution Path</label>
              <textarea
                value={resolutionPath}
                onChange={(e) => setResolutionPath(e.target.value)}
                rows={2}
                placeholder="Suggested resolution path (optional)"
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
            onClick={handleEscalate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors"
          >
            <Flame size={15} /> Escalate
          </button>
        </div>
      </div>
    </div>
  );
}
