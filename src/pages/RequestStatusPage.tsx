import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { MarketplaceDetailHeader } from '../components/marketplace/MarketplaceDetailHeader';
import { CategoryBadge } from '../components/CategoryBadge';
import { StatusBadge } from '../components/DqBadge';
import { RequestStatusTimeline } from '../components/RequestStatusTimeline';
import { ApprovalStateCard } from '../components/ApprovalStateCard';
import { FulfilmentNotesCard } from '../components/FulfilmentNotesCard';
import { PendingInformationCard } from '../components/PendingInformationCard';
import { ClosureOutcomeCard } from '../components/ClosureOutcomeCard';
import { AuditTrailCue } from '../components/AuditTrailCue';
import { ServiceEmptyState } from '../components/ServiceEmptyState';
import { WorkItemLinkedKnowledgeCard } from '../components/WorkItemLinkedKnowledgeCard';
import {
  buildRequestStatusTrail,
  resolveMarketplaceStage,
} from '../utils/marketplaceBreadcrumbs';
import { myRequestsHref } from '../utils/localMyRequests';

export function RequestStatusPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'deploy');
  const { getRequestById, updateRequestStatus } = useServiceLifecycle();

  const [loading, setLoading] = useState(true);

  const request = requestId ? getRequestById(requestId) : undefined;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [requestId]);

  const handleBackToMyRequests = () => {
    navigate(myRequestsHref(requestId));
  };

  const handleInfoSubmit = (_response: string) => {
    if (requestId) {
      updateRequestStatus(requestId, 'In Review');
      toast.success('Information submitted');
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Request ID copied');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="mb-6 h-8 w-32 animate-pulse rounded bg-border-default" />
          <div className="mb-8 h-24 animate-pulse rounded bg-border-default/60" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="dq-card h-96 animate-pulse lg:col-span-8" />
            <div className="space-y-4 lg:col-span-4">
              <div className="dq-card h-32 animate-pulse" />
              <div className="dq-card h-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-surface py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <ServiceEmptyState
            title="Request not found"
            message={`We couldn't find a request matching the ID "${requestId}".`}
            ctaLabel="Back to My Requests"
            onCtaClick={handleBackToMyRequests}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-12">
      <div className="mx-auto max-w-[1440px] px-6 pt-8 lg:px-8">
        <button
          type="button"
          onClick={handleBackToMyRequests}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to My Requests
        </button>

        <MarketplaceDetailHeader
          breadcrumbItems={buildRequestStatusTrail(
            stage,
            request.service,
            request.serviceId,
          )}
          eyebrow={
            <button
              type="button"
              onClick={() => copyToClipboard(request.id)}
              className="group flex items-center gap-1.5 rounded border border-border-strong bg-surface px-2 py-0.5 transition-colors hover:border-text-muted"
            >
              <span className="font-mono text-xs font-bold text-text-primary">{request.id}</span>
              <Copy size={12} className="text-text-muted transition-colors group-hover:text-primary" />
            </button>
          }
          badges={
            <>
              <StatusBadge status={request.status} />
              <CategoryBadge category={request.category} />
            </>
          }
          title={request.service}
          lede={`Submitted on ${new Date(request.submittedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}`}
          meta={
            <>
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
                  <User size={14} />
                  <span>Service Owner</span>
                </div>
                <span className="text-sm font-semibold text-primary">{request.owner}</span>
              </div>

              <div className="hidden h-8 w-px bg-border-strong sm:block" />

              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
                  <Clock size={14} />
                  <span>SLA Target</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary">{request.sla}</span>
                  {request.slaState === 'At Risk' && (
                    <span className="h-2 w-2 rounded-full bg-warning-text" title="At Risk" />
                  )}
                  {request.slaState === 'Completed' && (
                    <CheckCircle2 size={14} className="text-success-text" />
                  )}
                </div>
              </div>
            </>
          }
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RequestStatusTimeline timeline={request.timeline} />
          </div>

          <div className="space-y-6 lg:col-span-4">
            <ApprovalStateCard approvalState={request.approval} />

            {request.status === 'Returned for Information' && request.pendingInfo && (
              <PendingInformationCard
                pendingInfo={request.pendingInfo}
                onSubmit={handleInfoSubmit}
              />
            )}

            {request.fulfilmentNotes && (
              <FulfilmentNotesCard notes={request.fulfilmentNotes} />
            )}

            {request.status === 'Closed' && request.closureOutcome && (
              <ClosureOutcomeCard outcome={request.closureOutcome} />
            )}

            <AuditTrailCue />

            {requestId && <WorkItemLinkedKnowledgeCard workItemId={requestId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
