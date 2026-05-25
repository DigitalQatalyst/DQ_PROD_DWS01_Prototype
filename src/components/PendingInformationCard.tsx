import React, { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import { EvidenceUploadStub } from './EvidenceUploadStub';

interface PendingInformationCardProps {
  pendingInfo: string;
  onSubmit: (response: string) => void;
}

export function PendingInformationCard({ pendingInfo, onSubmit }: PendingInformationCardProps) {
  const [response, setResponse] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleSubmit = () => {
    if (response.trim()) {
      onSubmit(response);
      setResponse('');
      setIsReplying(false);
    }
  };

  return (
    <div className="bg-warning-surface border border-warning-text/30 rounded-card p-5">
      <div className="flex items-start gap-3 mb-3">
        <AlertCircle size={20} className="text-warning-text shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-primary">Information Required</h3>
          <p className="text-sm text-text-secondary mt-1">{pendingInfo}</p>
        </div>
      </div>

      {!isReplying ? (
        <button
          onClick={() => setIsReplying(true)}
          className="w-full mt-2 py-2 px-4 bg-white border border-warning-text/30 text-primary font-semibold text-sm rounded-button hover:bg-warning-surface/50 transition-colors"
        >
          Respond to Info Request
        </button>
      ) : (
        <div className="mt-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full p-2.5 text-sm bg-white border border-border-strong rounded-md focus:outline-none focus:ring-2 focus:ring-warning-text/30 min-h-[80px]"
            placeholder="Provide the requested information..."
          />
          <EvidenceUploadStub />
          <div className="flex gap-2">
            <button
              onClick={() => setIsReplying(false)}
              className="flex-1 py-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!response.trim()}
              className="flex-1 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Submit <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
