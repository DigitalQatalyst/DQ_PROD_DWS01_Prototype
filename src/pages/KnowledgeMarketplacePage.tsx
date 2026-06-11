import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { MarketplaceCatalogLayout } from '../components/marketplace/MarketplaceCatalogLayout';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { KnowledgeAssetType } from '../types/knowledgeDiscovery';
import { buildCatalogTrail, resolveMarketplaceStage } from '../utils/marketplaceBreadcrumbs';
import { ALL_TAB_ID } from '../utils/marketplaceCatalogTabs';

const KNOWLEDGE_TABS: { id: KnowledgeAssetType | typeof ALL_TAB_ID; label: string }[] = [
  { id: ALL_TAB_ID, label: 'All' },
  { id: 'Guideline', label: 'Guidelines' },
  { id: 'Operating Standard', label: 'Operating Standards' },
  { id: 'Process Reference', label: 'Process References' },
  { id: 'Evidence Standard', label: 'Evidence Standards' },
  { id: 'Playbook', label: 'Playbooks' },
  { id: 'Template', label: 'Templates' },
  { id: 'GHC Reference', label: 'GHC References' },
  { id: '6xD Reference', label: '6xD References' },
  { id: 'Workspace Guide', label: 'Workspace Guides' },
  { id: 'Learning Reference', label: 'Learning References' },
];

const TAB_DESCRIPTIONS: Partial<Record<string, string>> = {
  Playbook: 'Step-by-step operating playbooks for repeatable work patterns.',
  Template: 'Reusable content and document templates for governed delivery.',
  'GHC Reference': 'Global Handbook of Compliance references and standards.',
  '6xD Reference': '6xD lifecycle references aligned to DWS execution stages.',
};

export function KnowledgeMarketplacePage() {
  const [searchParams] = useSearchParams();
  const { assets, isLoading } = useKnowledgeLifecycle();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'discern');
  const initialTab =
    searchParams.get('focus') === 'playbooks-templates' ? 'Playbook' : ALL_TAB_ID;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);

  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Knowledge Type',
      options: KNOWLEDGE_TABS.filter((tab) => tab.id !== ALL_TAB_ID).map(
        (tab) => ({
          value: tab.id,
          label: tab.label,
        }),
      ),
    },
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'Effective', label: 'Effective' },
        { value: 'Under Review', label: 'Under Review' },
        { value: 'Draft', label: 'Draft' },
        { value: 'Needs Update', label: 'Needs Update' },
        { value: 'Deprecated', label: 'Deprecated' },
      ],
    },
    {
      id: 'ack',
      label: 'Acknowledgement',
      options: [
        { value: 'required', label: 'Required' },
        { value: 'not-required', label: 'Not Required' },
      ],
    },
  ];

  const categoryTabs = useMemo(
    () =>
      KNOWLEDGE_TABS.map((tab) => ({
        id: tab.id,
        label: tab.label,
        count:
          tab.id === ALL_TAB_ID
            ? assets.length
            : assets.filter((asset) => asset.type === tab.id).length,
      })),
    [assets],
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

  const filteredAssets = assets.filter((asset) => {
    const matchesTab = activeTab === ALL_TAB_ID || asset.type === activeTab;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      asset.title.toLowerCase().includes(query) ||
      asset.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      asset.summary.toLowerCase().includes(query) ||
      asset.id.toLowerCase().includes(query);
    const matchesType =
      !filterValues.type?.length || filterValues.type.includes(asset.type);
    const matchesStatus =
      !filterValues.status?.length ||
      filterValues.status.includes(asset.status);
    const matchesAck =
      !filterValues.ack?.length ||
      (filterValues.ack.includes('required') && asset.acknowledgementRequired) ||
      (filterValues.ack.includes('not-required') &&
        !asset.acknowledgementRequired);
    const matchesRecommended = !recommendedActive || asset.linkedWorkCount > 5;
    return (
      matchesTab &&
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesAck &&
      matchesRecommended
    );
  });

  const activeTabMeta = KNOWLEDGE_TABS.find((tab) => tab.id === activeTab);

  return (
    <MarketplaceCatalogLayout
      breadcrumbItems={buildCatalogTrail(stage, 'Knowledge Discovery')}
      title="Governed discovery for playbooks, standards, and workspace knowledge."
      lede="Organised through the DWS knowledge taxonomy — guidelines, operating standards, playbooks, templates, and references. Discovery layer only; opening an asset shows applicability, status, and linked work context."
      searchPlaceholder="Search by title, tag, keyword, or asset ID…"
      search={search}
      onSearchChange={setSearch}
      itemLabel="assets"
      totalCount={assets.length}
      visibleCount={filteredAssets.length}
      tabs={categoryTabs}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      toneStrip={
        activeTabMeta && activeTab !== ALL_TAB_ID && TAB_DESCRIPTIONS[activeTab]
          ? { code: activeTab, description: TAB_DESCRIPTIONS[activeTab]! }
          : null
      }
      filterHelperText="Refine by knowledge type, lifecycle status, and acknowledgement requirement."
      filterGroups={filterGroups}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      onClearAll={handleClearAll}
      recommendedActive={recommendedActive}
      onRecommendedChange={setRecommendedActive}
      isLoading={isLoading}
      loadingMessage="Loading knowledge assets…"
      showEmpty={!isLoading && filteredAssets.length === 0}
      emptyTitle="No knowledge assets match your filters"
      emptyMessage="Try adjusting your search or filters, or clear all filters to see all available assets."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredAssets.map((asset) => (
          <KnowledgeCard key={asset.id} asset={asset} />
        ))}
      </div>
    </MarketplaceCatalogLayout>
  );
}
