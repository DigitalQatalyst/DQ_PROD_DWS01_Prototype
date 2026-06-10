import type { MarketplaceCatalogTab } from '../components/marketplace/MarketplaceCatalogTabs';

export const ALL_TAB_ID = 'All';

export function buildCatalogTabs<T>(
  items: T[],
  categories: { id: string; label: string }[],
  getCategory: (item: T) => string,
): MarketplaceCatalogTab[] {
  return [
    { id: ALL_TAB_ID, label: 'All', count: items.length },
    ...categories.map((category) => ({
      id: category.id,
      label: category.label,
      count: items.filter((item) => getCategory(item) === category.id).length,
    })),
  ];
}
