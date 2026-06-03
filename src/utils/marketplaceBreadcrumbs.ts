export type MarketplaceCategoryKey = 'discern' | 'design' | 'deploy' | 'drive';

const categoryLabels: Record<MarketplaceCategoryKey, string> = {
  discern: 'Discern',
  design: 'Design',
  deploy: 'Deploy',
  drive: 'Drive',
};

export function getMarketplaceCategoryLabel(from: string | null, fallback: MarketplaceCategoryKey) {
  return categoryLabels[from as MarketplaceCategoryKey] || categoryLabels[fallback];
}
