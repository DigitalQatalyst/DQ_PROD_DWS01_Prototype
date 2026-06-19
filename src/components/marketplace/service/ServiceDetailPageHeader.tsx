import { useNavigate } from 'react-router-dom';
import { Clock, Layers, Shield, User } from 'lucide-react';
import type { Service, ServiceDetail } from '../../../types/serviceLifecycle';
import { getServiceComplianceLabel } from '../../../utils/serviceDetailContent';
import { formatServiceSla } from '../../../utils/formatServiceSla';
import {
  MarketplaceEyebrowTrail,
  type MarketplaceBreadcrumbItem,
} from '../MarketplaceEyebrowTrail';
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
  const approvalLabel = getServiceComplianceLabel(service);
  const slaLabel = formatServiceSla(service.sla);

  return (
    <header className="mb-8">
      <MarketplaceEyebrowTrail items={breadcrumbItems} variant="compact" />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-primary sm:text-[32px]">
            {service.title}
          </h1>
          <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-text-secondary">
            {service.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {service.domain && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-border-default">
                {service.domain}
              </span>
            )}
            {service.submarketplace && service.submarketplace !== service.domain && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-border-default">
                {service.submarketplace}
              </span>
            )}
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-border-default">
              {slaLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-border-default">
              <Shield size={12} />
              {approvalLabel}
            </span>
          </div>
        </div>

        <MarketplaceDetailHeaderActions
          primaryLabel={service.primaryActionLabel ?? 'Request Service'}
          primaryIcon="arrow"
          onPrimaryClick={() => navigate(startRequestHref)}
          saveLabel="service"
        />
      </div>
    </header>
  );
}
