import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePersona } from '../context/PersonaContext';
import { AnalyticsAssetCard } from '../components/AnalyticsAssetCard';
import { MarketplaceCatalogLayout } from '../components/marketplace/MarketplaceCatalogLayout';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { buildCatalogTrail, resolveMarketplaceStage } from '../utils/marketplaceBreadcrumbs';
import { ALL_TAB_ID, buildCatalogTabs } from '../utils/marketplaceCatalogTabs';
import { analyticsAssets, assetCategories } from '../mocks/analyticsMarketplace.mock';

export function AnalyticsMarketplaceLandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activePersona } = usePersona();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'drive');

  const [activeTab, setActiveTab] = useState(ALL_TAB_ID);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);

  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Asset Type',
      options: [
        { value: 'Dashboard', label: 'Dashboard' },
        { value: 'Report', label: 'Report' },
        { value: 'View', label: 'View' },
      ],
    },
    {
      id: 'category',
      label: 'Category',
      options: assetCategories.map((c) => ({ value: c.id, label: c.label })),
    },
    {
      id: 'permission',
      label: 'Permission',
      options: [
        { value: 'Available to my role', label: 'Available to my role' },
        { value: 'Restricted', label: 'Restricted' },
      ],
    },
  ];

  const categoryTabs = useMemo(
    () =>
      buildCatalogTabs(
        analyticsAssets,
        assetCategories,
        (asset) => asset.category,
      ),
    [],
  );

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    setRecommendedActive(false);
    setActiveTab(ALL_TAB_ID);
  };

  const filteredAssets = analyticsAssets
    .filter((asset) => {
      const matchesTab = activeTab === ALL_TAB_ID || asset.category === activeTab;
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        asset.name.toLowerCase().includes(query) ||
        asset.purpose.toLowerCase().includes(query) ||
        asset.id.toLowerCase().includes(query) ||
        asset.owner.toLowerCase().includes(query);
      const matchesType = !filterValues.type?.length || filterValues.type.includes(asset.type);
      const matchesCategory = !filterValues.category?.length || filterValues.category.includes(asset.category);

      const isPermitted = asset.roleAccess.includes(activePersona.role);
      let matchesPermission = true;
      if (filterValues.permission?.length) {
        if (filterValues.permission.includes('Available to my role') && !isPermitted) {
          matchesPermission = false;
        }
        if (filterValues.permission.includes('Restricted') && isPermitted) {
          matchesPermission = false;
        }
      }

      const matchesRecommended = !recommendedActive || isPermitted;

      return matchesTab && matchesSearch && matchesType && matchesCategory && matchesPermission && matchesRecommended;
    })
    .sort((a, b) => {
      if (!recommendedActive) return 0;
      const aRec = a.roleAccess.includes(activePersona.role);
      const bRec = b.roleAccess.includes(activePersona.role);
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      return 0;
    });

  return (
    <MarketplaceCatalogLayout
      breadcrumbItems={buildCatalogTrail(stage, 'Analytics Marketplace')}
      title="Analytics Marketplace"
      lede="Discover governed analytics assets — dashboards, reports, and views — organised by category and role access. Preview any asset to explore its metrics, charts, and data scope before opening the live destination."
      searchPlaceholder="Search analytics assets by name, purpose, owner…"
      search={search}
      onSearchChange={setSearch}
      itemLabel="assets"
      totalCount={analyticsAssets.length}
      visibleCount={filteredAssets.length}
      tabs={categoryTabs}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      filterHelperText="Refine by asset type, category, and permission scope."
      filterGroups={filterGroups}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      onClearAll={handleClearAll}
      recommendedActive={recommendedActive}
      onRecommendedChange={setRecommendedActive}
      showEmpty={filteredAssets.length === 0}
      emptyTitle="No analytics assets match your filters"
      emptyMessage="Try adjusting your search or filters, or clear all filters to see all available assets."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredAssets.map((asset) => {
          const isPermitted = asset.roleAccess.includes(activePersona.role);
          return (
            <AnalyticsAssetCard
              key={asset.id}
              asset={asset}
              isPermitted={isPermitted}
              onPreview={() => navigate(`/marketplace/drive/analytics-marketplace/${asset.slug}`)}
            />
          );
        })}
      </div>
    </MarketplaceCatalogLayout>
  );
}
