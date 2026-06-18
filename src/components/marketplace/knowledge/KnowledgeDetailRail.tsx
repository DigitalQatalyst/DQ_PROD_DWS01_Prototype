import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  CheckSquare,
  FileEdit,
  Flag,
  Link as LinkIcon,
  Lock,
  RefreshCcw,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import type { KnowledgeAssetFull } from '../../../types/knowledgeDiscovery';
import { useKnowledgeLifecycle } from '../../../context/KnowledgeLifecycleContext';
import { AttachKnowledgeModal } from '../../AttachKnowledgeModal';
import {
  formatReviewDate,
  getComplianceLabel,
} from '../../../utils/knowledgeDetailContent';
import {
  RailActionButton,
  RailMetaRow,
  RailSection,
} from '../shared/MarketplaceDetailRailPrimitives';

interface KnowledgeDetailRailProps {
  asset: KnowledgeAssetFull;
}

export function KnowledgeDetailRail({ asset }: KnowledgeDetailRailProps) {
  const navigate = useNavigate();
  const { getAcknowledgementForAsset, acknowledgeGuidance, flagOutdated, requestUpdate } =
    useKnowledgeLifecycle();
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

  const isAcknowledged = ackRecord?.state === 'Acknowledged';

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

  return (
    <>
      <aside className="sticky top-24 w-full space-y-5">
        <RailSection title="Use in Work">
          <div className="space-y-2">
            <RailActionButton
              onClick={() => {
                setAttachTarget('Task');
                setShowAttach(true);
              }}
            >
              <CheckSquare size={14} className="shrink-0 text-gray-500" />
              Attach to Task
            </RailActionButton>
            <RailActionButton
              onClick={() => {
                setAttachTarget('Request');
                setShowAttach(true);
              }}
            >
              <LinkIcon size={14} className="shrink-0 text-gray-500" />
              Attach to Request
            </RailActionButton>
            <RailActionButton onClick={() => navigate(`/tasks/create/from-knowledge/${asset.id}`)}>
              <CheckCircle2 size={14} className="shrink-0 text-gray-500" />
              Start Task from Guide
            </RailActionButton>
          </div>
        </RailSection>

        {asset.acknowledgementRequired && (
          <RailSection title="Acknowledgement">
            {isAcknowledged ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
                <CheckCircle2 size={14} />
                Acknowledged
              </div>
            ) : (
              <>
                <p className="mb-2.5 text-[11px] leading-relaxed text-gray-500">
                  This guidance requires your acknowledgement before applying it to work.
                </p>
                <button
                  type="button"
                  onClick={handleAcknowledge}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-dq-navy px-3 py-2 text-xs font-medium text-white transition hover:bg-[#050E4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
                >
                  <ShieldCheck size={14} />
                  Acknowledge Guidance
                </button>
              </>
            )}
          </RailSection>
        )}

        <RailSection title="Governance Actions">
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setShowFeedback('update');
                setFeedbackText('');
              }}
              className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
            >
              <RefreshCcw size={13} className="shrink-0 text-gray-400" />
              Request Knowledge Update
            </button>
            <button
              type="button"
              onClick={() => {
                setShowFeedback('flag');
                setFeedbackText('');
              }}
              className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-xs font-medium text-error transition hover:bg-error/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
            >
              <Flag size={13} className="shrink-0" />
              Flag Outdated Content
            </button>
          </div>

          {showFeedback && (
            <div className="mt-2 space-y-2 rounded-md border border-gray-200 bg-gray-50 p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-dq-navy">
                  {showFeedback === 'flag'
                    ? 'Describe what is outdated'
                    : 'Describe what needs updating'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowFeedback(null)}
                  className="text-gray-400 hover:text-dq-navy"
                  aria-label="Close feedback form"
                >
                  <X size={13} />
                </button>
              </div>
              <textarea
                value={feedbackText}
                onChange={(event) => setFeedbackText(event.target.value)}
                rows={3}
                placeholder={
                  showFeedback === 'flag'
                    ? 'e.g. The SLA references are no longer accurate...'
                    : 'e.g. Missing the new approval step...'
                }
                className="w-full resize-none rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] text-dq-navy outline-none focus:ring-2 focus:ring-dq-orange/30"
              />
              <button
                type="button"
                onClick={showFeedback === 'flag' ? handleFlagOutdated : handleRequestUpdate}
                disabled={!feedbackText.trim()}
                className="w-full rounded-md bg-dq-navy px-2.5 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#050E4A] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {showFeedback === 'flag' ? 'Submit Flag' : 'Submit Request'}
              </button>
            </div>
          )}
        </RailSection>

        <RailSection title="Governance & Details">
          <div className="space-y-3">
            <RailMetaRow icon={<User size={13} />} label="Owner" value={asset.owner} />
            {asset.reviewer && (
              <RailMetaRow
                icon={<ShieldCheck size={13} />}
                label="Approver"
                value={asset.reviewer}
              />
            )}
            <RailMetaRow icon={<FileEdit size={13} />} label="Version" value={asset.version} />
            <RailMetaRow
              icon={<Calendar size={13} />}
              label="Last updated"
              value={formatReviewDate(asset.lastReviewed)}
            />
            <RailMetaRow icon={<Calendar size={13} />} label="Review cycle" value="Quarterly" />
            <RailMetaRow
              icon={<Lock size={13} />}
              label="Compliance"
              value={getComplianceLabel(asset)}
            />
          </div>
        </RailSection>
      </aside>

      {showAttach && (
        <AttachKnowledgeModal
          asset={asset}
          defaultTarget={attachTarget}
          onClose={() => setShowAttach(false)}
          onAttached={(message) => {
            setShowAttach(false);
            showToast(message);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[500] max-w-sm rounded-lg border border-gray-200 bg-white p-3 text-xs font-medium text-dq-navy shadow-dq-hover">
          {toast}
        </div>
      )}
    </>
  );
}
