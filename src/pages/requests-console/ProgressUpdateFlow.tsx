import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestsConsole } from '../../context/RequestsConsoleContext';
import type { FulfilmentStatus, EvidenceState } from '../../types/requestsConsole';

const STATUS_OPTIONS: FulfilmentStatus[] = [
  'Routed', 'Assigned', 'In Fulfilment', 'Clarification Needed',
  'Blocked', 'Escalated', 'Evidence Added', 'Fulfilled',
];

const EVIDENCE_STATES: EvidenceState[] = [
  'Not Started', 'Pending', 'Added', 'Weak', 'Accepted',
];

export function ProgressUpdateFlow() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { getRequestById, updateStatus, addProgressUpdate } = useRequestsConsole();

  const request = requestId ? getRequestById(requestId) : undefined;

  const [status, setStatus] = useState<FulfilmentStatus>(request?.fulfilmentStatus ?? 'In Fulfilment');
  const [note, setNote] = useState('');
  const [blockerState, setBlockerState] = useState('');
  const [evidenceState, setEvidenceState] = useState<EvidenceState>('Not Started');
  const [nextAction, setNextAction] = useState('');

  if (!request) {
    return (
      <div className="bg-[#F6F6FB] min-h-full pb-12">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8">
          <p className="text-sm text-text-muted">Request not found.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!note.trim()) {
      toast.error('Progress note is required');
      return;
    }
    if (status !== request.fulfilmentStatus) {
      updateStatus(request.id, status);
    }
    addProgressUpdate({
      requestId: request.id,
      updateType: blockerState ? 'Blocker' : 'Status Update',
      note: note.trim(),
      actor: request.owner,
      statusAfter: status,
    });
    navigate(`/stage-03/requests-console/${request.id}`);
  };

  const handleSaveDraft = () => {
    toast.info('Draft saved (prototype)', { duration: 2000 });
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
          <h1 className="text-xl font-bold text-primary mb-1">Update Progress</h1>
          <p className="text-sm text-text-muted mb-6">{request.id} — {request.title}</p>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FulfilmentStatus)}
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Progress Note *</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Describe the progress made on this request..."
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Blocker State</label>
              <input
                value={blockerState}
                onChange={(e) => setBlockerState(e.target.value)}
                placeholder="Describe any blocker (optional)"
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Evidence State</label>
              <select
                value={evidenceState}
                onChange={(e) => setEvidenceState(e.target.value as EvidenceState)}
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {EVIDENCE_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Next Action</label>
              <input
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="What happens next?"
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-button border border-border-strong bg-white text-sm font-semibold text-primary hover:bg-surface transition-colors"
          >
            <Save size={15} /> Save Draft
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors"
          >
            <Send size={15} /> Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}
