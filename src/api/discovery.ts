import type {
  CatalogFilterDefinition,
  Service,
  ServiceCategory,
  ServiceDetail,
} from '../types/serviceLifecycle';

const CATALOG_ENDPOINT = '/api/discovery/catalog';

export interface DiscoveryCatalogResponse {
  categories: ServiceCategory[];
  services: Service[];
  serviceDetails: ServiceDetail[];
  filters: CatalogFilterDefinition[];
  source: 'supabase';
}

export async function fetchDiscoveryCatalog(): Promise<DiscoveryCatalogResponse | null> {
  try {
    const res = await fetch(CATALOG_ENDPOINT, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as DiscoveryCatalogResponse;
  } catch {
    return null;
  }
}
