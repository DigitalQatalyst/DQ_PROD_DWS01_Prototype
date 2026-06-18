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
  return `/marketplace/${stage}`;
}

export function getServicesCatalogHref(
  stage: MarketplaceCategoryKey = 'deploy',
  category?: string,
): string {
  const params = new URLSearchParams({ from: stage });
  if (category) {
    params.set('category', category);
  }
  return `/marketplace/services?${params.toString()}`;
}

function serviceDetailCrumbLabel(serviceTitle: string): string {
  return serviceTitle.replace(/\s+Request$/i, '') || serviceTitle;
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

export const ANALYTICS_MARKETPLACE_LABEL = 'Analytics Marketplace';

export function getAnalyticsMarketplaceHref(stage: MarketplaceCategoryKey = 'drive'): string {
  return `/marketplace/drive/analytics-marketplace?from=${stage}`;
}

export function buildAnalyticsMarketplaceTrail(
  stage: MarketplaceCategoryKey,
  ...segments: MarketplaceBreadcrumbItem[]
): MarketplaceBreadcrumbItem[] {
  return [
    MARKETPLACE_ROOT,
    stageSegment(stage),
    { label: ANALYTICS_MARKETPLACE_LABEL, href: getAnalyticsMarketplaceHref(stage) },
    ...segments,
  ];
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
  serviceCategory?: string,
): MarketplaceBreadcrumbItem[] {
  const category = serviceCategory ?? 'Services';

  return [
    {
      label: 'Services Marketplace',
      href: getServicesCatalogHref(stage),
    },
    {
      label: category,
      href: getServicesCatalogHref(stage, serviceCategory),
    },
    {
      label: serviceDetailCrumbLabel(serviceTitle),
      href: getServiceDetailHref(serviceId, stage),
    },
  ];
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

export const KNOWLEDGE_HUB_LABEL = 'Knowledge Hub';

export function getKnowledgeHubHref(stage: MarketplaceCategoryKey = 'discern'): string {
  return `/marketplace/knowledge-discovery?from=${stage}`;
}

export function getKnowledgeDetailHref(
  knowledgeId: string,
  stage: MarketplaceCategoryKey = 'discern',
): string {
  return `/marketplace/knowledge-discovery/${knowledgeId}?from=${stage}`;
}

export function buildKnowledgeDetailTrail(
  stage: MarketplaceCategoryKey,
  assetType: string,
  assetTitle: string,
  assetId: string,
): MarketplaceBreadcrumbItem[] {
  return [
    { label: assetType },
    MARKETPLACE_ROOT,
    stageSegment(stage),
    { label: KNOWLEDGE_HUB_LABEL, href: getKnowledgeHubHref(stage) },
    { label: assetTitle, href: getKnowledgeDetailHref(assetId, stage) },
  ];
}
