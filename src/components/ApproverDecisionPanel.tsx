import React, { useState } from 'react';
import { X, Check, XCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import type { ServiceApproval } from '../types/serviceLifecycle';
import { toast } from 'sonner';

interface ApproverDecisionPanelProps {
  approval: ServiceApproval;
  onClose: () => void;
  onSubmitDecision: (id: string, decision: 'Approved' | 'Rejected' | 'Returned' | 'Escalated', rationale: string) => void;
}

export function ApproverDecisionPanel({ approval, onClose, onSubmitDecision }: ApproverDecisionPanelProps) {
  const [rationale, setRationale] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (decision: 'Approved' | 'Rejected' | 'Returned' | 'Escalated') => {
    if (decision === 'Rejected' && !rationale.trim()) {
      setError(true);
      toast.error('Rationale is required for rejection');
      return;
    }
    onSubmitDecision(approval.id, decision, rationale);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[200] flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="p-6 border-b border-border-default flex items-center justify-between bg-surface/50">
          <div>
            <h2 className="text-lg font-bold text-primary">Approval Review</h2>
            <p className="text-xs font-mono text-text-secondary mt-1">{approval.id} • {approval.requestId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-text-muted hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Request Context</h3>
            <div className="bg-surface rounded border border-border-subtle p-4 space-y-3">
              <div>
                <span className="block text-xs text-text-secondary mb-1">Service</span>
                <span className="text-sm font-semibold text-primary">{approval.service}</span>
              </div>
              <div>
                <span className="block text-xs text-text-secondary mb-1">Requester</span>
                <span className="text-sm text-primary">{approval.requester}</span>
              </div>
              <div>
                <span className="block text-xs text-text-secondary mb-1">Reason for Approval</span>
                <span className="text-sm text-primary leading-relaxed">{approval.reason}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">
              Decision Rationale <span className="text-danger">*</span>
            </label>
            <textarea
              value={rationale}
              onChange={(e) => { setRationale(e.target.value); setError(false); }}
              className={`w-full p-3 bg-white border rounded-button focus:outline-none focus:ring-2 focus:ring-secondary/20 min-h-[120px] resize-y ${
                error ? 'border-danger' : 'border-border-strong hover:border-text-muted'
              }`}
              placeholder="Provide context for your decision..."
            />
          </div>

          <div className="pt-4 border-t border-border-default space-y-3">
            <button 
              onClick={() => handleSubmit('Approved')}
              className="w-full py-2.5 bg-success-text text-white font-semibold text-sm rounded-button hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={16} /> Approve
            </button>
            <button 
              onClick={() => handleSubmit('Rejected')}
              className="w-full py-2.5 bg-danger-text text-white font-semibold text-sm rounded-button hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle size={16} /> Reject
            </button>
            <button 
              onClick={() => handleSubmit('Returned')}
              className="w-full py-2.5 bg-white border border-border-strong text-primary font-semibold text-sm rounded-button hover:bg-surface transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} /> Return for Information
            </button>
            <button 
              onClick={() => handleSubmit('Escalated')}
              className="w-full py-2.5 bg-white border border-warning-text/50 text-warning-text font-semibold text-sm rounded-button hover:bg-warning-surface transition-colors flex items-center justify-center gap-2"
            >
              <AlertTriangle size={16} /> Escalate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
