import React, { useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { MarketplaceTopFilterBar } from '../components/MarketplaceTopFilterBar';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { KnowledgeCard } from '../components/KnowledgeCard';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { BookOpen } from 'lucide-react';

export function KnowledgeMarketplacePage() {
  const { assets, isLoading } = useKnowledgeLifecycle();
  
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);

  const tabs = [
    'All',
    'GHC Reference',
    '6xD Reference',
    'Playbooks',
    'Templates',
    'Learning',
    'Workspace Guides'
  ];

  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Knowledge Type',
      options: [
        { value: 'GHC Reference', label: 'GHC' },
        { value: '6xD Reference', label: '6xD' },
        { value: 'Guideline', label: 'Guidelines' },
        { value: 'Playbook', label: 'Playbooks' },
        { value: 'Template', label: 'Templates' },
        { value: 'Operating Standard', label: 'Operating Standards' }
      ]
    },
    {
      id: 'status',
      label: 'Review Status',
      options: [
        { value: 'Effective', label: 'Effective' },
        { value: 'Under Review', label: 'Under Review' },
        { value: 'Needs Update', label: 'Needs Update' }
      ]
    }
  ];

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues(prev => ({ ...prev, [groupId]: values }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    setRecommendedActive(false);
  };

  const filteredAssets = assets.filter(a => {
    const matchesTab = activeTab === 'All' || 
      a.type === activeTab || 
      (activeTab === 'Playbooks' && a.type === 'Playbook') ||
      (activeTab === 'Templates' && a.type === 'Template');

    const matchesSearch = search === '' || 
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesType = !filterValues.type?.length || filterValues.type.includes(a.type);
    const matchesStatus = !filterValues.status?.length || filterValues.status.includes(a.status);
    
    // Mock recommendation logic: just an example filter
    const matchesRecommended = !recommendedActive || a.linkedWorkCount > 10;

    return matchesTab && matchesSearch && matchesType && matchesStatus && matchesRecommended;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-primary">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <BookOpen size={24} />
            </div>
            Knowledge Discovery
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Find GHC references, 6xD playbooks, templates, and learning guides to support your work.
          </p>
        </div>
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <MarketplaceTopFilterBar
          searchPlaceholder="Search GHC, 6xD, playbooks, templates..."
          searchValue={search}
          onSearchChange={setSearch}
          groups={filterGroups}
          values={filterValues}
          onChange={handleFilterChange}
          recommendedActive={recommendedActive}
          onRecommendedChange={setRecommendedActive}
          onClearAll={handleClearAll}
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-text-muted">
          Loading knowledge assets...
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAssets.map(asset => (
            <KnowledgeCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface py-16 text-center">
          <BookOpen size={48} className="mb-4 text-text-muted opacity-50" />
          <h3 className="mb-2 text-lg font-bold text-text-primary">No references found</h3>
          <p className="mb-6 max-w-md text-sm text-text-secondary">
            We couldn't find any knowledge assets matching your current filters.
          </p>
          <button
            onClick={handleClearAll}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-border-subtle hover:bg-surface"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}