import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestsConsole } from '../../context/RequestsConsoleContext';

const QUEUE_OPTIONS = [
  'Platform Support Queue',
  'HRA Queue',
  'Knowledge Queue',
  'Task / Workflow Queue',
  'Approval Support Queue',
  'Admin Queue',
];

const OWNER_OPTIONS = [
  'Brian Otieno',
  'Grace Wanjiru',
  'Priya Nair',
  'Omar Farouk',
  'HRA Owner',
  'Workspace Admin',
];

export function ReassignHandoffFlow() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { getRequestById, startHandoff } = useRequestsConsole();

  const request = requestId ? getRequestById(requestId) : undefined;

  const [targetOwner, setTargetOwner] = useState('');
  const [targetQueue, setTargetQueue] = useState(request?.queue ?? '');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');

  if (!request) {
    return (
      <div className="bg-[#F6F6FB] min-h-full pb-12">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8">
          <p className="text-sm text-text-muted">Request not found.</p>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    if (!targetOwner) {
      toast.error('Target owner is required');
      return;
    }
    if (!reason.trim()) {
      toast.error('Handoff reason is required');
      return;
    }
    startHandoff({
      requestId: request.id,
      fromOwner: request.owner,
      toOwner: targetOwner,
      fromQueue: request.queue,
      toQueue: targetQueue || request.queue,
      reason: reason.trim(),
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
          <h1 className="text-xl font-bold text-primary mb-1">Reassign / Handoff</h1>
          <p className="text-sm text-text-muted mb-6">{request.id} — {request.title}</p>

          <div className="space-y-5">
            <div className="rounded-lg bg-surface p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted font-medium">Current Owner</span>
                <span className="font-semibold text-primary">{request.owner}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-text-muted font-medium">Current Queue</span>
                <span className="font-medium text-text-secondary">{request.queue}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Target Owner *</label>
              <select
                value={targetOwner}
                onChange={(e) => setTargetOwner(e.target.value)}
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select owner...</option>
                {OWNER_OPTIONS.filter((o) => o !== request.owner).map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Target Queue</label>
              <select
                value={targetQueue}
                onChange={(e) => setTargetQueue(e.target.value)}
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {QUEUE_OPTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Handoff Reason *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-button border border-border-strong bg-white px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select reason...</option>
                <option value="Ownership unclear">Ownership unclear</option>
                <option value="Routed after triage">Routed after triage</option>
                <option value="Category mapping">Category mapping</option>
                <option value="Owner required">Owner required</option>
                <option value="Workload rebalance">Workload rebalance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">Handoff Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Add context for the new owner..."
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
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors"
          >
            <Send size={15} /> Confirm Handoff
          </button>
        </div>
      </div>
    </div>
  );
}
