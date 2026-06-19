import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ServiceCard } from '../components/ServiceCard';
import { MarketplaceCatalogLayout } from '../components/marketplace/MarketplaceCatalogLayout';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import {
  buildCatalogTrail,
  resolveMarketplaceStage,
  SERVICES_CATALOG_LABEL,
} from '../utils/marketplaceBreadcrumbs';
import {
  buildCatalogFilterGroups,
  retainSharedFilterValues,
  serviceMatchesCatalogFilters,
  SHARED_FILTER_KEYS,
  submarketplaceSlugForTab,
} from '../utils/serviceCatalogFilters';
import type { MarketplaceCatalogTab } from '../components/marketplace/MarketplaceCatalogTabs';

const MOCK_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'approval',
    label: 'Approval',
    options: [
      { value: 'not_required', label: 'Self-serve (no approval)' },
      { value: 'conditional', label: 'Manager approval' },
      { value: 'required', label: 'Governance / Owner approval' },
    ],
  },
];

export function ServicesMarketplacePage() {
  const [searchParams] = useSearchParams();
  const { services, serviceCategories, catalogLoading, catalogFilters, catalogSource } =
    useServiceLifecycle();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'deploy');
  const categoryParam = searchParams.get('category');

  const [activeTab, setActiveTab] = useState('');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});

  const activeSubmarketplaceSlug = useMemo(
    () => submarketplaceSlugForTab(serviceCategories, activeTab),
    [activeTab, serviceCategories],
  );

  const filterGroups = useMemo(() => {
    if (catalogSource === 'supabase' && catalogFilters.length > 0) {
      return buildCatalogFilterGroups(catalogFilters, activeSubmarketplaceSlug);
    }
    return MOCK_FILTER_GROUPS;
  }, [catalogFilters, catalogSource, activeSubmarketplaceSlug]);

  useEffect(() => {
    if (serviceCategories.length === 0) return;

    if (categoryParam && serviceCategories.some((category) => category.name === categoryParam)) {
      setActiveTab(categoryParam);
      return;
    }

    if (!activeTab || !serviceCategories.some((category) => category.name === activeTab)) {
      setActiveTab(serviceCategories[0].name);
    }
  }, [categoryParam, serviceCategories, activeTab]);

  const categoryTabs = useMemo((): MarketplaceCatalogTab[] => {
    return serviceCategories.map((category) => ({
      id: category.name,
      label: category.name,
      count: services.filter((service) => service.category === category.name).length,
    }));
  }, [serviceCategories, services]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setFilterValues((prev) => retainSharedFilterValues(prev, SHARED_FILTER_KEYS));
  }, []);

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    if (serviceCategories[0]) {
      setActiveTab(serviceCategories[0].name);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesTab = !activeTab || service.category === activeTab;

      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        (service.domain ?? '').toLowerCase().includes(query) ||
        service.owner.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query);

      const matchesFilters = serviceMatchesCatalogFilters(service, filterValues);

      return matchesTab && matchesSearch && matchesFilters;
    });
  }, [services, activeTab, search, filterValues]);

  return (
    <div className="min-h-[calc(100vh-125px)] bg-[#f7f7fd]">
      <MarketplaceCatalogLayout
        breadcrumbItems={buildCatalogTrail(stage, SERVICES_CATALOG_LABEL)}
        title="Drive services"
        lede="Browse and request governed services across strategy, operations, commercial, and delivery."
        searchPlaceholder="Search by name, description, or domain…"
        search={search}
        onSearchChange={setSearch}
        itemLabel="services"
        totalCount={services.length}
        visibleCount={filteredServices.length}
        tabs={categoryTabs}
        activeTabId={activeTab}
        onTabChange={handleTabChange}
        filterHelperText="Shared and submarketplace filters from the Drive catalogue."
        filterGroups={filterGroups}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        isLoading={catalogLoading}
        loadingMessage="Loading services…"
        showEmpty={!catalogLoading && filteredServices.length === 0}
        emptyTitle="No services match"
        emptyMessage="Try a different search term or clear your filters."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </MarketplaceCatalogLayout>
    </div>
  );
}
