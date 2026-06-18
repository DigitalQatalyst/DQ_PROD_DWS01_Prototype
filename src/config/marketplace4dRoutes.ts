/** Primary marketplace destination for each 4D catalogue submenu item. */
export const MARKETPLACE_4D_DESTINATIONS = {
  discern: '/marketplace/knowledge-discovery?from=discern',
  design: '/marketplace/task-library?from=design',
  deploy: '/marketplace/services?from=deploy',
  drive: '/marketplace/drive',
  trackerMarketplace: '/marketplace/drive/tracker-marketplace',
} as const;

export type Marketplace4dStage = keyof typeof MARKETPLACE_4D_DESTINATIONS;

export const DEFAULT_MARKETPLACE_ROUTE = MARKETPLACE_4D_DESTINATIONS.discern;
