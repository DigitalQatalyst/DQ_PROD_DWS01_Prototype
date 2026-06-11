import {
  MARKETPLACE_4D_DESTINATIONS,
  type Marketplace4dStage,
} from '../config/marketplace4dRoutes';
import type { MarketplaceBreadcrumbItem } from '../components/marketplace/MarketplaceEyebrowTrail';

export type MarketplaceCategoryKey = Marketplace4dStage;

const categoryLabels: Record<MarketplaceCategoryKey, string> = {
  discern: 'Discern',
  design: 'Design',
  deploy: 'Deploy',
  drive: 'Drive',
};

export const MARKETPLACE_ROOT: MarketplaceBreadcrumbItem = {
  label: 'DWS.01',
  href: '/marketplace/catalogue',
};

export const SERVICES_CATALOG_LABEL = 'Services Marketplace';

export function getMarketplaceCategoryLabel(
  from: string | null,
  fallback: MarketplaceCategoryKey = 'deploy',
) {
  return categoryLabels[from as MarketplaceCategoryKey] || categoryLabels[fallback];
}

export function resolveMarketplaceStage(
  from: string | null,
  fallback: MarketplaceCategoryKey = 'deploy',
): MarketplaceCategoryKey {
  if (from && from in categoryLabels) {
    return from as MarketplaceCategoryKey;
  }
  return fallback;
}

export function getStageHref(stage: MarketplaceCategoryKey): string {
  return MARKETPLACE_4D_DESTINATIONS[stage];
}

export function getServicesCatalogHref(stage: MarketplaceCategoryKey = 'deploy'): string {
  return `/marketplace/services?from=${stage}`;
}

export function getServiceDetailHref(
  serviceId: string,
  stage: MarketplaceCategoryKey = 'deploy',
): string {
  return `/marketplace/services/${serviceId}?from=${stage}`;
}

function stageSegment(stage: MarketplaceCategoryKey): MarketplaceBreadcrumbItem {
  return {
    label: getMarketplaceCategoryLabel(stage, stage),
    href: getStageHref(stage),
  };
}

function servicesCatalogSegment(stage: MarketplaceCategoryKey): MarketplaceBreadcrumbItem {
  return {
    label: SERVICES_CATALOG_LABEL,
    href: getServicesCatalogHref(stage),
  };
}

export function buildCatalogTrail(
  stage: MarketplaceCategoryKey,
  pageLabel: string,
): MarketplaceBreadcrumbItem[] {
  return [MARKETPLACE_ROOT, stageSegment(stage), { label: pageLabel }];
}

export function buildServicesTrail(
  stage: MarketplaceCategoryKey,
  ...segments: MarketplaceBreadcrumbItem[]
): MarketplaceBreadcrumbItem[] {
  return [MARKETPLACE_ROOT, stageSegment(stage), servicesCatalogSegment(stage), ...segments];
}

export function buildServiceDetailTrail(
  stage: MarketplaceCategoryKey,
  serviceTitle: string,
  serviceId: string,
): MarketplaceBreadcrumbItem[] {
  return buildServicesTrail(stage, {
    label: serviceTitle,
    href: getServiceDetailHref(serviceId, stage),
  });
}

export function buildStartRequestTrail(
  stage: MarketplaceCategoryKey,
  serviceTitle: string,
  serviceId: string,
): MarketplaceBreadcrumbItem[] {
  return buildServicesTrail(
    stage,
    { label: serviceTitle, href: getServiceDetailHref(serviceId, stage) },
    { label: 'Start Request' },
  );
}

export function buildRequestStatusTrail(
  stage: MarketplaceCategoryKey,
  serviceTitle: string,
  serviceId?: string,
): MarketplaceBreadcrumbItem[] {
  const serviceSegment: MarketplaceBreadcrumbItem = serviceId
    ? { label: serviceTitle, href: getServiceDetailHref(serviceId, stage) }
    : { label: serviceTitle };

  return buildServicesTrail(stage, serviceSegment, { label: 'Request Status' });
}

export function buildMarketplaceHubTrail(groupTitle: string): MarketplaceBreadcrumbItem[] {
  return [
    MARKETPLACE_ROOT,
    { label: 'Marketplace', href: '/marketplace/catalogue' },
    { label: groupTitle },
  ];
}
