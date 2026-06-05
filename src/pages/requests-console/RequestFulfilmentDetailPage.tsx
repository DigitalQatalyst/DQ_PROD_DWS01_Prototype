import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRequestsConsole } from '../../context/RequestsConsoleContext';
import { RequestFulfilmentDetailHero } from '../../components/requests-console/RequestFulfilmentDetailHero';
import { RequesterContextCard } from '../../components/requests-console/RequesterContextCard';
import { FulfilmentSummaryCard } from '../../components/requests-console/FulfilmentSummaryCard';
import { OwnershipQueueContextPanel } from '../../components/requests-console/OwnershipQueueContextPanel';
import { SlaAgeingCard } from '../../components/requests-console/SlaAgeingCard';
import { ProgressUpdatesPanel } from '../../components/requests-console/ProgressUpdatesPanel';
import { EvidenceOutcomePanel } from '../../components/requests-console/EvidenceOutcomePanel';
import { RequestLinkedWorkPanel } from '../../components/requests-console/RequestLinkedWorkPanel';
import { EscalationContextPanel } from '../../components/requests-console/EscalationContextPanel';
import { ClosureQualityPanel } from '../../components/requests-console/ClosureQualityPanel';
import { RequestTimeline } from '../../components/requests-console/RequestTimeline';
import { RequestFulfilmentActionRail } from '../../components/requests-console/RequestFulfilmentActionRail';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export function RequestFulfilmentDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const { getRequestById, getProgressUpdates, getEvidence, getSlaRecord, getHandoffs, getEscalations, getClosureReview, getLinkedWork } = useRequestsConsole();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const request = requestId ? getRequestById(requestId) : undefined;

  if (loading) {
    return (
      <div className="bg-[#F6F6FB] min-h-full pb-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-surface rounded-card" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-surface rounded-card" />
                <div className="h-48 bg-surface rounded-card" />
              </div>
              <div className="h-64 bg-surface rounded-card" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-[#F6F6FB] min-h-full pb-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
          <PlaceholderPage
            title="Request Not Found"
            description={`No fulfilment request found for ${requestId ?? 'unknown ID'}. It may have been removed or does not exist.`}
            phase="Stage 03 — Requests Console"
          />
        </div>
      </div>
    );
  }

  const progressUpdates = getProgressUpdates(request.id);
  const evidence = getEvidence(request.id);
  const sla = getSlaRecord(request.id);
  const handoffs = getHandoffs(request.id);
  const escalations = getEscalations(request.id);
  const closureReview = getClosureReview(request.id);
  const linkedWork = getLinkedWork(request.id);

  return (
    <div className="bg-[#F6F6FB] min-h-full pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
        <RequestFulfilmentDetailHero request={request} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RequesterContextCard request={request} />
            <FulfilmentSummaryCard request={request} />
            <OwnershipQueueContextPanel request={request} handoffs={handoffs} />
            <SlaAgeingCard sla={sla} />
            <ProgressUpdatesPanel updates={progressUpdates} />
            <EvidenceOutcomePanel evidence={evidence} />
            <RequestLinkedWorkPanel records={linkedWork} />
            <EscalationContextPanel escalations={escalations} />
            <ClosureQualityPanel review={closureReview} />
            <RequestTimeline currentStatus={request.fulfilmentStatus} />
          </div>

          <div className="lg:col-span-1">
            <RequestFulfilmentActionRail request={request} />
          </div>
        </div>
      </div>
    </div>
  );
}
