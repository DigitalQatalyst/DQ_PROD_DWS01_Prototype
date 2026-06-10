import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ServiceCard } from '../components/ServiceCard';
import { MarketplaceCatalogLayout } from '../components/marketplace/MarketplaceCatalogLayout';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { getMarketplaceCategoryLabel } from '../utils/marketplaceBreadcrumbs';
import {
  ALL_TAB_ID,
  buildCatalogTabs,
} from '../utils/marketplaceCatalogTabs';

export function ServicesMarketplacePage() {
  const [searchParams] = useSearchParams();
  const { services, serviceCategories } = useServiceLifecycle();
  const breadcrumbCategory = getMarketplaceCategoryLabel(
    searchParams.get('from'),
    'deploy',
  );

  const [activeTab, setActiveTab] = useState(ALL_TAB_ID);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);

  const categoryTabs = useMemo(
    () =>
      buildCatalogTabs(
        services,
        serviceCategories.map((category) => ({
          id: category.name,
          label: category.name,
        })),
        (service) => service.category,
      ),
    [serviceCategories, services],
  );

  const filterGroups: FilterGroup[] = [
    {
      id: 'domain',
      label: 'Request Domain',
      options: serviceCategories.map((category) => ({
        value: category.name,
        label: category.name,
      })),
    },
    {
      id: 'approval',
      label: 'Approval',
      options: [
        { value: 'Required', label: 'Approval required' },
        { value: 'Conditional', label: 'Conditional approval' },
        { value: 'Not Required', label: 'No approval required' },
      ],
    },
    {
      id: 'risk',
      label: 'Risk Profile',
      options: [
        { value: 'Standard', label: 'Standard' },
        { value: 'Governance-sensitive', label: 'Governance-sensitive' },
        { value: 'Review-sensitive', label: 'Review-sensitive' },
        { value: 'At Risk', label: 'At risk / priority' },
      ],
    },
  ];

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    setRecommendedActive(false);
    setActiveTab(ALL_TAB_ID);
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesTab =
        activeTab === ALL_TAB_ID || service.category === activeTab;

      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.owner.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.id.toLowerCase().includes(query);

      const matchesDomain =
        !filterValues.domain?.length ||
        filterValues.domain.includes(service.category);
      const matchesApproval =
        !filterValues.approval?.length ||
        filterValues.approval.includes(service.approval);
      const matchesRisk =
        !filterValues.risk?.length || filterValues.risk.includes(service.risk);
      const matchesRecommended =
        !recommendedActive ||
        service.approval === 'Required' ||
        service.risk !== 'Standard';

      return (
        matchesTab &&
        matchesSearch &&
        matchesDomain &&
        matchesApproval &&
        matchesRisk &&
        matchesRecommended
      );
    });
  }, [services, activeTab, search, filterValues, recommendedActive]);

  const activeCategory = serviceCategories.find(
    (category) => category.name === activeTab,
  );

  return (
    <MarketplaceCatalogLayout
      eyebrow={`DWS.01 / ${breadcrumbCategory} / Services Marketplace`}
      title="Governed discovery for support, access, and governance services."
      lede="Organised through the DWS service taxonomy — request domains, approval rules, and fulfilment paths. Discovery layer only; starting a request creates a tracked record with owner, SLA, and audit trail."
      searchPlaceholder="Search services, owners, SLAs, or request types…"
      search={search}
      onSearchChange={setSearch}
      itemLabel="services"
      totalCount={services.length}
      visibleCount={filteredServices.length}
      tabs={categoryTabs}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      toneStrip={
        activeCategory
          ? { code: activeCategory.id, description: activeCategory.description }
          : null
      }
      filterHelperText="Refine by request domain, approval requirement, and risk profile."
      filterGroups={filterGroups}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      onClearAll={handleClearAll}
      recommendedActive={recommendedActive}
      onRecommendedChange={setRecommendedActive}
      showEmpty={filteredServices.length === 0}
      emptyTitle="No services match your filters"
      emptyMessage="Try adjusting your search or filters, or clear all filters to see all available services."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </MarketplaceCatalogLayout>
  );
}
