import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { ServiceEmptyState } from '../components/ServiceEmptyState';
import { ServiceDetailPageHeader } from '../components/marketplace/service/ServiceDetailPageHeader';
import { ServiceDetailRail } from '../components/marketplace/service/ServiceDetailRail';
import { ServiceOverviewTab } from '../components/marketplace/service/ServiceOverviewTab';
import { MarketplaceDetailPageGrid } from '../components/marketplace/shared/MarketplaceDetailPageGrid';
import { KnowledgeGovernanceTab } from '../components/marketplace/knowledge/KnowledgeGovernanceTab';
import { KnowledgeOverviewTab } from '../components/marketplace/knowledge/KnowledgeOverviewTab';
import { KnowledgeResourcesTab } from '../components/marketplace/knowledge/KnowledgeResourcesTab';
import {
  buildFulfilmentFlowSteps,
  buildServiceAppliesTo,
  buildServiceKeyReminders,
  buildServiceOverviewRows,
  buildServicePolicyLinks,
  buildServiceRelatedResources,
  buildServiceSupportingMaterials,
  getServiceChangeHistory,
} from '../utils/serviceDetailContent';
import {
  buildServiceDetailTrail,
  resolveMarketplaceStage,
} from '../utils/marketplaceBreadcrumbs';
import {
  parseMarketplaceDetailTab,
  type MarketplaceDetailTab,
} from '../types/marketplaceDetail';

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'deploy');
  const activeTab = parseMarketplaceDetailTab(searchParams.get('tab'));
  const { getServiceById, getServiceDetailByServiceId, catalogLoading, catalogSource } =
    useServiceLifecycle();

  const isDiscoveryCatalog = catalogSource === 'supabase';

  const service = serviceId ? getServiceById(serviceId) : undefined;
  const detail = serviceId ? getServiceDetailByServiceId(serviceId) : undefined;

  const handleTabChange = useCallback(
    (tab: MarketplaceDetailTab) => {
      const next = new URLSearchParams(searchParams);
      if (tab === 'overview') {
        next.delete('tab');
      } else {
        next.set('tab', tab);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (!isDiscoveryCatalog || activeTab === 'overview') return;
    const next = new URLSearchParams(searchParams);
    next.delete('tab');
    setSearchParams(next, { replace: true });
  }, [isDiscoveryCatalog, activeTab, searchParams, setSearchParams]);

  const keyReminders = useMemo(
    () =>
      detail
        ? buildServiceKeyReminders(detail, service).map((r) => ({
            title: r.title,
            description: r.description,
          }))
        : [],
    [detail, service],
  );

  if (catalogLoading) {
    return (
      <div className="min-h-[calc(100vh-125px)] bg-[#f7f7fd] py-8">
        <div className="mx-auto max-w-[1440px] animate-pulse space-y-6 px-6 lg:px-8">
          <div className="h-4 w-72 rounded bg-border-default" />
          <div className="h-28 rounded-card bg-white" />
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="h-80 rounded-card bg-white lg:col-span-8" />
            <div className="h-64 rounded-card bg-white lg:col-span-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!service || !detail) {
    return (
      <div className="min-h-[calc(100vh-125px)] bg-[#f7f7fd] py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <ServiceEmptyState
            title="Service not found"
            message="We couldn't find that service. It may have been removed or the link may be outdated."
            ctaLabel="Back to Service Catalogue"
            onCtaClick={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  const startRequestHref = `/requests/start/${service.id}?from=${stage}`;

  const overviewContent = isDiscoveryCatalog ? (
    <ServiceOverviewTab
      whenToUse={detail.whenToUse}
      whenNotToUse={detail.whenNotToUse}
      requiredInputs={detail.requiredInputs}
      keyReminders={keyReminders}
    />
  ) : (
    <KnowledgeOverviewTab
      overviewRows={buildServiceOverviewRows(service, detail)}
      appliesTo={buildServiceAppliesTo(detail, service)}
      keyReminders={buildServiceKeyReminders(detail, service)}
    />
  );

  return (
    <div className="min-h-[calc(100vh-125px)] bg-[#f7f7fd] pb-12">
      <div className="mx-auto max-w-[1440px] px-6 pt-8 lg:px-8">
        <ServiceDetailPageHeader
          breadcrumbItems={buildServiceDetailTrail(
            stage,
            service.title,
            service.id,
            service.domain ?? service.category,
          )}
          service={service}
          startRequestHref={startRequestHref}
        />

        {isDiscoveryCatalog ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            <div className="min-w-0 lg:col-span-8">{overviewContent}</div>
            <div className="min-w-0 lg:col-span-4">
              <ServiceDetailRail service={service} detail={detail} discoveryCatalog />
            </div>
          </div>
        ) : (
          <MarketplaceDetailPageGrid
            activeTab={activeTab}
            onTabChange={handleTabChange}
            rail={<ServiceDetailRail service={service} detail={detail} />}
          >
            {activeTab === 'overview' && overviewContent}

            {activeTab === 'governance' && (
              <KnowledgeGovernanceTab
                approvalSteps={buildFulfilmentFlowSteps(detail)}
                versionHistory={getServiceChangeHistory(service.id, detail)}
                policyLinks={buildServicePolicyLinks(detail)}
                flowTitle="Fulfilment Flow"
              />
            )}

            {activeTab === 'resources' && (
              <KnowledgeResourcesTab
                relatedResources={buildServiceRelatedResources(detail)}
                supportingMaterials={buildServiceSupportingMaterials(service)}
              />
            )}
          </MarketplaceDetailPageGrid>
        )}
      </div>
    </div>
  );
}
