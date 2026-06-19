import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import type { CatalogFilterDefinition, Service } from '../types/serviceLifecycle';

export function filtersForSubmarketplace(
  definitions: CatalogFilterDefinition[],
  submarketplaceSlug: string | null,
): CatalogFilterDefinition[] {
  const shared = definitions.filter((d) => d.isShared);
  if (!submarketplaceSlug) return shared;
  const specific = definitions.filter((d) => d.submarketplaceSlug === submarketplaceSlug);
  return [...shared, ...specific].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function buildCatalogFilterGroups(
  definitions: CatalogFilterDefinition[],
  submarketplaceSlug: string | null,
): FilterGroup[] {
  return filtersForSubmarketplace(definitions, submarketplaceSlug).map((def) => ({
    id: def.key,
    label: def.label,
    options: def.options.map((opt) => ({ value: opt.value, label: opt.label })),
  }));
}

function matchesLocation(serviceValue: string | undefined, selected: string[]): boolean {
  if (!selected.length) return true;
  if (!serviceValue) return false;
  return selected.some((loc) => serviceValue === loc || serviceValue === 'both');
}

function matchesFacet(
  serviceValue: string | undefined,
  selected: string[],
): boolean {
  if (!selected.length) return true;
  if (!serviceValue) return false;
  return selected.includes(serviceValue);
}

export function serviceMatchesCatalogFilters(
  service: Service,
  filterValues: Record<string, string[]>,
): boolean {
  const facets = service.facets ?? {};

  for (const [key, selected] of Object.entries(filterValues)) {
    if (!selected.length) continue;

    let value = facets[key];
    if (value === undefined && key === 'approval') {
      value =
        service.approval === 'Required'
          ? 'required'
          : service.approval === 'Conditional'
            ? 'conditional'
            : 'not_required';
    }

    if (key === 'location') {
      if (!matchesLocation(value, selected)) return false;
    } else if (!matchesFacet(value, selected)) {
      return false;
    }
  }

  return true;
}

export function submarketplaceSlugForTab(
  categories: { name: string; slug?: string }[],
  activeTabName: string,
): string | null {
  return categories.find((c) => c.name === activeTabName)?.slug ?? null;
}

/** Strip submarketplace-specific filter keys when the tab changes. */
export function retainSharedFilterValues(
  values: Record<string, string[]>,
  sharedKeys: Set<string>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => sharedKeys.has(key)),
  );
}

export const SHARED_FILTER_KEYS = new Set(['location', 'approval']);
