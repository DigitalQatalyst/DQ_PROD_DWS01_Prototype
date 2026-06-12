import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../../../types/serviceLifecycle';
import {
  MarketplaceEyebrowTrail,
  type MarketplaceBreadcrumbItem,
} from '../MarketplaceEyebrowTrail';
import { getServiceComplianceLabel } from '../../../utils/serviceDetailContent';
import { MarketplaceDetailHeaderActions } from '../shared/MarketplaceDetailHeaderActions';

interface ServiceDetailPageHeaderProps {
  breadcrumbItems: MarketplaceBreadcrumbItem[];
  service: Service;
  startRequestHref: string;
}

export function ServiceDetailPageHeader({
  breadcrumbItems,
  service,
  startRequestHref,
}: ServiceDetailPageHeaderProps) {
  const navigate = useNavigate();
  const complianceLabel = getServiceComplianceLabel(service);

  return (
    <header className="mb-6">
      <MarketplaceEyebrowTrail items={breadcrumbItems} className="mb-4" variant="compact" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-[30px] font-bold leading-tight tracking-[-0.02em] text-dq-navy md:text-[36px]">
            {service.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-500 md:text-base">
            {service.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-dq-navy">
              {service.category}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-dq-navy">
              SLA {service.sla}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-dq-navy">
              <Lock size={12} />
              {complianceLabel}
            </span>
          </div>
        </div>

        <MarketplaceDetailHeaderActions
          primaryLabel="Start Request"
          primaryIcon="arrow"
          onPrimaryClick={() => navigate(startRequestHref)}
          saveLabel="service"
        />
      </div>
    </header>
  );
}
