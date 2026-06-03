import React, { useState } from 'react';
import { FeedbackType } from '../types/knowledgeDiscovery';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { ThumbsUp, HelpCircle, AlertTriangle, FileWarning, UserX, CheckCircle2, Send } from 'lucide-react';

interface KnowledgeFeedbackPanelProps {
  assetId: string;
}

const FEEDBACK_OPTIONS: { type: FeedbackType; label: string; icon: React.ElementType; color: string }[] = [
  { type: 'Useful',          label: 'Useful',          icon: ThumbsUp,      color: 'success' },
  { type: 'Unclear',         label: 'Unclear',          icon: HelpCircle,    color: 'warning' },
  { type: 'Outdated',        label: 'Outdated',         icon: AlertTriangle, color: 'warning' },
  { type: 'Missing Detail',  label: 'Missing Detail',   icon: FileWarning,   color: 'warning' },
  { type: 'Wrong Owner',     label: 'Wrong Owner',      icon: UserX,         color: 'danger' },
];

export function KnowledgeFeedbackPanel({ assetId }: KnowledgeFeedbackPanelProps) {
  const { submitFeedback } = useKnowledgeLifecycle();
  const [selected, setSelected] = useState<FeedbackType | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    submitFeedback(assetId, selected, comment || undefined);
    setSubmitted(true);
    setSelected(null);
    setComment('');
  };

  if (submitted) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
        <h2 className="mb-4 text-lg font-bold text-text-primary">Feedback</h2>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle2 size={36} className="text-success" />
          <p className="font-bold text-text-primary">Feedback submitted</p>
          <p className="text-sm text-text-secondary">Thank you — your feedback has been logged and will be reviewed by the Knowledge Content Owner.</p>
          <button onClick={() => setSubmitted(false)} className="mt-2 text-sm font-semibold text-primary hover:underline">
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
      <h2 className="mb-2 text-lg font-bold text-text-primary">Feedback</h2>
      <p className="mb-5 text-sm text-text-secondary">Help improve this knowledge asset. Select a feedback type and optionally add a comment.</p>

      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {FEEDBACK_OPTIONS.map(opt => {
          const Icon = opt.icon;
          const isActive = selected === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => setSelected(isActive ? null : opt.type)}
              className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-semibold transition-all ${
                isActive
                  ? `border-${opt.color}/30 bg-${opt.color}/10 text-${opt.color}`
                  : 'border-border-subtle bg-surface text-text-muted hover:border-border-default hover:bg-white hover:text-text-primary'
              }`}
            >
              <Icon size={18} />
              {opt.label}
            </button>
          );
        })}
      </div>

      {selected && selected !== 'Useful' && (
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold text-text-muted uppercase tracking-wide">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="Describe what you noticed..."
            className="w-full rounded-lg border border-border-default bg-surface px-3 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selected}
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-700 disabled:opacity-40 transition-colors"
      >
        <Send size={15} />
        Submit Feedback
      </button>
    </div>
  );
}
