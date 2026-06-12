import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { ServiceEmptyState } from '../components/ServiceEmptyState';
import { ServiceDetailPageHeader } from '../components/marketplace/service/ServiceDetailPageHeader';
import { ServiceDetailRail } from '../components/marketplace/service/ServiceDetailRail';
import { MarketplaceDetailPageGrid } from '../components/marketplace/shared/MarketplaceDetailPageGrid';
import { KnowledgeOverviewTab } from '../components/marketplace/knowledge/KnowledgeOverviewTab';
import { KnowledgeGovernanceTab } from '../components/marketplace/knowledge/KnowledgeGovernanceTab';
import { KnowledgeResourcesTab } from '../components/marketplace/knowledge/KnowledgeResourcesTab';
import {
  buildFulfilmentFlowSteps,
  buildServiceAppliesTo,
  getServiceChangeHistory,
  buildServiceKeyReminders,
  buildServiceOverviewRows,
  buildServicePolicyLinks,
  buildServiceRelatedResources,
  buildServiceSupportingMaterials,
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
  const { getServiceById, getServiceDetailByServiceId } = useServiceLifecycle();

  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="mb-6 h-4 w-72 animate-pulse rounded bg-gray-200" />
          <div className="mb-8 h-28 animate-pulse rounded-card bg-gray-200/70" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="h-12 animate-pulse rounded bg-gray-200" />
              <div className="h-80 animate-pulse rounded-card bg-gray-200/70" />
            </div>
            <div className="lg:col-span-4">
              <div className="sticky top-24 h-[520px] animate-pulse rounded-card bg-gray-200/70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service || !detail) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-6">
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

  const startRequestHref = `/requests/start/${service.id}?from=${stage}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-[1440px] px-6 pt-8 lg:px-8">
        <ServiceDetailPageHeader
          breadcrumbItems={buildServiceDetailTrail(
            stage,
            service.title,
            service.id,
            service.category,
          )}
          service={service}
          startRequestHref={startRequestHref}
        />

        <MarketplaceDetailPageGrid
          activeTab={activeTab}
          onTabChange={handleTabChange}
          rail={<ServiceDetailRail service={service} detail={detail} />}
        >
          {activeTab === 'overview' && (
            <KnowledgeOverviewTab
              overviewRows={buildServiceOverviewRows(service, detail)}
              appliesTo={buildServiceAppliesTo(detail, service)}
              keyReminders={buildServiceKeyReminders(detail)}
            />
          )}

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
      </div>
    </div>
  );
}
