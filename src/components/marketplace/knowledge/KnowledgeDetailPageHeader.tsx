import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { KnowledgeAssetFull } from '../../../types/knowledgeDiscovery';
import {
  MarketplaceEyebrowTrail,
  type MarketplaceBreadcrumbItem,
} from '../MarketplaceEyebrowTrail';
import { getComplianceLabel } from '../../../utils/knowledgeDetailContent';
import { MarketplaceDetailHeaderActions } from '../shared/MarketplaceDetailHeaderActions';

interface KnowledgeDetailPageHeaderProps {
  breadcrumbItems: MarketplaceBreadcrumbItem[];
  asset: KnowledgeAssetFull;
  referenceHref: string;
}

export function KnowledgeDetailPageHeader({
  breadcrumbItems,
  asset,
  referenceHref,
}: KnowledgeDetailPageHeaderProps) {
  const navigate = useNavigate();
  const complianceLabel = getComplianceLabel(asset);

  return (
    <header className="mb-6">
      <MarketplaceEyebrowTrail items={breadcrumbItems} className="mb-4" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-[30px] font-bold leading-tight tracking-[-0.02em] text-dq-navy md:text-[36px]">
            {asset.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-500 md:text-base">
            {asset.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-dq-navy">
              {asset.type}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-dq-navy">
              v{asset.version}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-dq-navy">
              <Lock size={12} />
              {complianceLabel}
            </span>
          </div>
        </div>

        <MarketplaceDetailHeaderActions
          primaryLabel="Open Reference"
          primaryIcon="external"
          onPrimaryClick={() => navigate(referenceHref)}
          saveLabel="knowledge"
        />
      </div>
    </header>
  );
}
