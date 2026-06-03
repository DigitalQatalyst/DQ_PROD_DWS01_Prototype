import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KnowledgeAssetFull } from '../types/knowledgeDiscovery';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import {
  FileText, Link as LinkIcon, CheckSquare, CheckCircle2,
  RefreshCcw, Flag, AlertCircle, User, FileEdit, ShieldCheck, Calendar, X
} from 'lucide-react';
import { AttachKnowledgeModal } from './AttachKnowledgeModal';

interface KnowledgeActionRailProps {
  asset: KnowledgeAssetFull;
}

export function KnowledgeActionRail({ asset }: KnowledgeActionRailProps) {
  const navigate = useNavigate();
  const { getAcknowledgementForAsset, acknowledgeGuidance, flagOutdated, requestUpdate } = useKnowledgeLifecycle();
  const ackRecord = getAcknowledgementForAsset(asset.id);

  const [showAttach, setShowAttach] = useState(false);
  const [attachTarget, setAttachTarget] = useState<'Task' | 'Request'>('Task');
  const [showFeedback, setShowFeedback] = useState<'flag' | 'update' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAcknowledge = () => {
    acknowledgeGuidance(asset.id);
    showToast('Guidance acknowledged successfully.');
  };

  const handleFlagOutdated = () => {
    if (!feedbackText.trim()) return;
    flagOutdated(asset.id, feedbackText);
    setShowFeedback(null);
    setFeedbackText('');
    showToast('Outdated flag created. Knowledge Content Owner has been notified.');
  };

  const handleRequestUpdate = () => {
    if (!feedbackText.trim()) return;
    requestUpdate(asset.id, feedbackText);
    setShowFeedback(null);
    setFeedbackText('');
    showToast('Update request submitted. Knowledge Content Owner has been notified.');
  };

  const isAcknowledged = ackRecord?.state === 'Acknowledged';
  const acknowledgementPending = asset.acknowledgementRequired && ackRecord?.state === 'Pending';

  return (
    <>
      <div className="sticky top-24 space-y-3">
        {/* Primary CTA */}
        <button
          onClick={() => navigate(`/knowledge/${asset.id}/reference`)}
          id={`btn-open-ref-${asset.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FB5535] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-600 transition-colors"
        >
          <FileText size={18} />
          Open Reference
        </button>

        {/* Secondary actions */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border-subtle space-y-2">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Attach to Work</p>

          <button
            onClick={() => { setAttachTarget('Task'); setShowAttach(true); }}
            id={`btn-attach-task-${asset.id}`}
            className="flex w-full items-center gap-3 rounded-lg border border-border-default bg-surface px-3 py-2.5 text-sm font-semibold text-text-primary hover:border-primary/30 hover:bg-navy-50 transition-colors text-left"
          >
            <CheckSquare size={16} className="text-primary shrink-0" />
            Attach to Task
          </button>

          <button
            onClick={() => { setAttachTarget('Request'); setShowAttach(true); }}
            id={`btn-attach-request-${asset.id}`}
            className="flex w-full items-center gap-3 rounded-lg border border-border-default bg-surface px-3 py-2.5 text-sm font-semibold text-text-primary hover:border-primary/30 hover:bg-navy-50 transition-colors text-left"
          >
            <LinkIcon size={16} className="text-primary shrink-0" />
            Attach to Request
          </button>

          <button
            onClick={() => navigate(`/tasks/create/from-knowledge/${asset.id}`)}
            id={`btn-start-task-${asset.id}`}
            className="flex w-full items-center gap-3 rounded-lg border border-border-default bg-surface px-3 py-2.5 text-sm font-semibold text-text-primary hover:border-primary/30 hover:bg-navy-50 transition-colors text-left"
          >
            <CheckCircle2 size={16} className="text-primary shrink-0" />
            Start Task from Guide
          </button>
        </div>

        {/* Acknowledgement */}
        {asset.acknowledgementRequired && (
          <div className={`rounded-xl p-4 ring-1 ${isAcknowledged ? 'bg-success/5 ring-success/20' : 'bg-white ring-border-subtle shadow-sm'}`}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">Acknowledgement</p>
            {isAcknowledged ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-success">
                <CheckCircle2 size={16} />
                Acknowledged
              </div>
            ) : (
              <>
                <p className="mb-3 text-xs text-text-secondary">This guidance requires your acknowledgement before applying it to work.</p>
                <button
                  onClick={handleAcknowledge}
                  id={`btn-acknowledge-${asset.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-navy-700 transition-colors"
                >
                  <ShieldCheck size={14} />
                  Acknowledge Guidance
                </button>
              </>
            )}
          </div>
        )}

        {/* Governance actions */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border-subtle space-y-2">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Governance</p>

          <button
            onClick={() => { setShowFeedback('update'); setFeedbackText(''); }}
            id={`btn-request-update-${asset.id}`}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface transition-colors text-left"
          >
            <RefreshCcw size={15} className="text-text-muted shrink-0" />
            Request Knowledge Update
          </button>

          <button
            onClick={() => { setShowFeedback('flag'); setFeedbackText(''); }}
            id={`btn-flag-outdated-${asset.id}`}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-danger hover:bg-danger/5 transition-colors text-left"
          >
            <Flag size={15} className="shrink-0" />
            Flag Outdated Content
          </button>

          {showFeedback && (
            <div className="mt-2 rounded-lg bg-surface p-3 ring-1 ring-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-text-primary">
                  {showFeedback === 'flag' ? 'Describe what is outdated' : 'Describe what needs updating'}
                </p>
                <button onClick={() => setShowFeedback(null)} className="text-text-muted hover:text-primary">
                  <X size={14} />
                </button>
              </div>
              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                rows={3}
                placeholder={showFeedback === 'flag' ? 'e.g. The SLA references are no longer accurate...' : 'e.g. Missing the new approval step...'}
                className="w-full rounded border border-border-default bg-white px-2 py-1.5 text-xs text-text-primary outline-none focus:ring-1 focus:ring-primary/30 resize-none"
              />
              <button
                onClick={showFeedback === 'flag' ? handleFlagOutdated : handleRequestUpdate}
                disabled={!feedbackText.trim()}
                className="w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-700 disabled:opacity-40 transition-colors"
              >
                {showFeedback === 'flag' ? 'Submit Flag' : 'Submit Request'}
              </button>
            </div>
          )}
        </div>

        {/* Governance metadata */}
        <div className="rounded-xl bg-surface p-4 ring-1 ring-border-subtle space-y-2 text-xs">
          <p className="font-bold uppercase tracking-wider text-text-muted">Governance</p>
          <div className="flex items-center gap-2 text-text-secondary">
            <User size={13} className="text-text-muted shrink-0" />
            <span className="text-text-muted">Owner:</span>
            <span className="font-semibold text-text-primary truncate">{asset.owner}</span>
          </div>
          {asset.reviewer && (
            <div className="flex items-center gap-2 text-text-secondary">
              <AlertCircle size={13} className="text-text-muted shrink-0" />
              <span className="text-text-muted">Reviewer:</span>
              <span className="font-semibold text-text-primary truncate">{asset.reviewer}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-text-secondary">
            <FileEdit size={13} className="text-text-muted shrink-0" />
            <span className="text-text-muted">Version:</span>
            <span className="font-semibold text-text-primary">{asset.version}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar size={13} className="text-text-muted shrink-0" />
            <span className="text-text-muted">Next review:</span>
            <span className="font-semibold text-text-primary">{asset.nextReview || asset.reviewDue}</span>
          </div>
          {asset.permissionScope && (
            <div className="flex items-center gap-2 text-text-secondary">
              <ShieldCheck size={13} className="text-text-muted shrink-0" />
              <span className="text-text-muted">Scope:</span>
              <span className="font-semibold text-text-primary">{asset.permissionScope}</span>
            </div>
          )}
        </div>
      </div>

      {/* Attach Modal */}
      {showAttach && (
        <AttachKnowledgeModal
          asset={asset}
          defaultTarget={attachTarget}
          onClose={() => setShowAttach(false)}
          onAttached={(msg) => { setShowAttach(false); showToast(msg); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white shadow-lg max-w-sm">
          {toast}
        </div>
      )}
    </>
  );
}
