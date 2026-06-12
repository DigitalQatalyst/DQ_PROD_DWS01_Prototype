import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import type { KnowledgeDetailRecord } from '../types/knowledgeDiscovery';
import { KnowledgeDetailPageHeader } from '../components/marketplace/knowledge/KnowledgeDetailPageHeader';
import { MarketplaceDetailPageGrid } from '../components/marketplace/shared/MarketplaceDetailPageGrid';
import { KnowledgeOverviewTab } from '../components/marketplace/knowledge/KnowledgeOverviewTab';
import { KnowledgeGovernanceTab } from '../components/marketplace/knowledge/KnowledgeGovernanceTab';
import { KnowledgeResourcesTab } from '../components/marketplace/knowledge/KnowledgeResourcesTab';
import { KnowledgeDetailRail } from '../components/marketplace/knowledge/KnowledgeDetailRail';
import {
  APPROVAL_FLOW_STEPS,
  buildAppliesToItems,
  buildKeyReminders,
  buildOverviewRows,
  buildPolicyAlignment,
  buildSupportingMaterials,
  getDetailVersionHistory,
} from '../utils/knowledgeDetailContent';
import {
  buildKnowledgeDetailTrail,
  getKnowledgeDetailHref,
  resolveMarketplaceStage,
} from '../utils/marketplaceBreadcrumbs';
import {
  parseMarketplaceDetailTab,
  type MarketplaceDetailTab,
} from '../types/marketplaceDetail';

export function KnowledgeDetailPage() {
  const { knowledgeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'discern');
  const activeTab = parseMarketplaceDetailTab(searchParams.get('tab'));
  const {
    assets,
    isLoading,
    getAssetDetail,
    getApplicabilityForAsset,
    getRelatedKnowledgeForAsset,
  } = useKnowledgeLifecycle();

  const [detail, setDetail] = useState<KnowledgeDetailRecord | undefined>(undefined);
  const [detailLoading, setDetailLoading] = useState(true);

  const asset = assets.find((item) => item.id === knowledgeId);

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
    if (knowledgeId) {
      setDetailLoading(true);
      getAssetDetail(knowledgeId).then((data) => {
        setDetail(data);
        setDetailLoading(false);
      });
    }
  }, [knowledgeId, getAssetDetail]);

  const assetsById = useMemo(
    () => new Map(assets.map((item) => [item.id, item])),
    [assets],
  );

  if (isLoading || detailLoading) {
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

  if (!asset) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-warning" />
        <h2 className="mb-2 text-2xl font-semibold text-dq-navy">Asset not found</h2>
        <p className="mb-6 text-gray-500">
          The knowledge asset you are looking for could not be found.
        </p>
        <a
          href={`/marketplace/knowledge-discovery?from=${stage}`}
          className="inline-flex items-center rounded-btn bg-dq-orange px-5 py-2.5 text-sm font-medium text-white hover:bg-[#F24C2A]"
        >
          Return to Knowledge Hub
        </a>
      </div>
    );
  }

  const applicability = getApplicabilityForAsset(asset.id);
  const relatedKnowledge = getRelatedKnowledgeForAsset(asset.id);
  const referenceHref = `/knowledge/${asset.id}/reference`;
  const detailHref = (id: string) => getKnowledgeDetailHref(id, stage);

  const relatedResources = relatedKnowledge
    .map((record) => assetsById.get(record.toAssetId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({ id: item.id, title: item.title }));

  const policyLinks = buildPolicyAlignment(relatedKnowledge, assetsById);
  const versionHistory = getDetailVersionHistory(detail);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-[1440px] px-6 pt-8 lg:px-8">
        <KnowledgeDetailPageHeader
          breadcrumbItems={buildKnowledgeDetailTrail(
            stage,
            asset.type,
            asset.title,
            asset.id,
          )}
          asset={asset}
          referenceHref={referenceHref}
        />

        <MarketplaceDetailPageGrid
          activeTab={activeTab}
          onTabChange={handleTabChange}
          rail={<KnowledgeDetailRail asset={asset} />}
        >
          {activeTab === 'overview' && (
            <KnowledgeOverviewTab
              overviewRows={buildOverviewRows(asset)}
              appliesTo={buildAppliesToItems(asset, applicability)}
              keyReminders={buildKeyReminders(asset)}
            />
          )}

          {activeTab === 'governance' && (
            <KnowledgeGovernanceTab
              approvalSteps={APPROVAL_FLOW_STEPS}
              versionHistory={versionHistory}
              policyLinks={policyLinks}
              detailHref={detailHref}
            />
          )}

          {activeTab === 'resources' && (
            <KnowledgeResourcesTab
              relatedResources={relatedResources}
              supportingMaterials={buildSupportingMaterials(asset)}
              detailHref={detailHref}
            />
          )}
        </MarketplaceDetailPageGrid>
      </div>
    </div>
  );
}
