import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { MarketplaceDetailHeader } from '../components/marketplace/MarketplaceDetailHeader';
import { CategoryBadge } from '../components/CategoryBadge';
import { ServiceDetailHero } from '../components/ServiceDetailHero';
import { ServiceMetadataRail } from '../components/ServiceMetadataRail';
import { WhenToUseCard } from '../components/WhenToUseCard';
import { RequiredInputsList } from '../components/RequiredInputsList';
import { FulfilmentTimeline } from '../components/FulfilmentTimeline';
import { ApprovalPathCard } from '../components/ApprovalPathCard';
import { RelatedItemsCard } from '../components/RelatedItemsCard';
import { AuditNoteCard } from '../components/AuditNoteCard';
import { ServiceEmptyState } from '../components/ServiceEmptyState';
import {
  buildServiceDetailTrail,
  resolveMarketplaceStage,
} from '../utils/marketplaceBreadcrumbs';

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'deploy');
  const { getServiceById, getServiceDetailByServiceId } = useServiceLifecycle();

  const [loading, setLoading] = useState(true);

  const service = serviceId ? getServiceById(serviceId) : undefined;
  const detail = serviceId ? getServiceDetailByServiceId(serviceId) : undefined;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="mb-6 h-4 w-64 animate-pulse rounded bg-border-default" />
          <div className="mb-8 h-24 animate-pulse rounded bg-border-default/60" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="dq-card h-64 animate-pulse" />
              <div className="dq-card h-48 animate-pulse" />
            </div>
            <div className="lg:col-span-4">
              <div className="dq-card sticky top-[88px] h-96 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service || !detail) {
    return (
      <div className="min-h-screen bg-surface py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <ServiceEmptyState
            title="Service not found"
            message={`We couldn't find a service matching the ID "${serviceId}". It may have been removed or you might have an incorrect link.`}
            ctaLabel="Back to Service Catalogue"
            onCtaClick={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-12">
      <div className="mx-auto max-w-[1440px] px-6 pt-8 lg:px-8">
        <MarketplaceDetailHeader
          breadcrumbItems={buildServiceDetailTrail(stage, service.title, service.id)}
          badges={<CategoryBadge category={service.category} />}
          title={service.title}
          lede={detail.purpose}
          meta={<ServiceDetailHero service={service} />}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <WhenToUseCard
              whenToUse={detail.whenToUse}
              whenNotToUse={detail.whenNotToUse}
            />

            <RequiredInputsList inputs={detail.requiredInputs} />

            <FulfilmentTimeline path={detail.fulfilmentPath} />

            <ApprovalPathCard
              requirement={detail.approval}
              detail={detail.approvalDetail}
            />

            <RelatedItemsCard
              knowledgeLinks={detail.relatedKnowledge}
              serviceLinks={detail.relatedServices}
            />

            <AuditNoteCard note={detail.auditNote} />
          </div>

          <div className="relative lg:col-span-4">
            <ServiceMetadataRail detail={detail} />
          </div>
        </div>
      </div>
    </div>
  );
}
