export type MarketplaceDetailTab = 'overview' | 'governance' | 'resources';

export function parseMarketplaceDetailTab(
  value: string | null,
): MarketplaceDetailTab {
  if (value === 'governance' || value === 'resources') return value;
  return 'overview';
}
