import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { MarketplaceTopFilterBar } from '../components/MarketplaceTopFilterBar';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { KnowledgeCard } from '../components/KnowledgeCard';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { BookOpen, Link as LinkIcon, Flag, ShieldCheck, Activity, ClipboardList } from 'lucide-react';
import { KnowledgeAssetType } from '../types/knowledgeDiscovery';
import { getMarketplaceCategoryLabel } from '../utils/marketplaceBreadcrumbs';

const ALL_TABS: { label: string; value: KnowledgeAssetType | 'All' }[] = [
  { label: 'All',                value: 'All' },
  { label: 'Guidelines',         value: 'Guideline' },
  { label: 'Operating Standards',value: 'Operating Standard' },
  { label: 'Process References', value: 'Process Reference' },
  { label: 'Evidence Standards', value: 'Evidence Standard' },
  { label: 'Playbooks',          value: 'Playbook' },
  { label: 'Templates',          value: 'Template' },
  { label: 'GHC References',     value: 'GHC Reference' },
  { label: '6xD References',     value: '6xD Reference' },
  { label: 'Workspace Guides',   value: 'Workspace Guide' },
  { label: 'Learning References',value: 'Learning Reference' },
];

const TAB_LABELS = ALL_TABS.map(t => t.label);

export function KnowledgeMarketplacePage() {
  const [searchParams] = useSearchParams();
  const { assets, isLoading } = useKnowledgeLifecycle();
  const breadcrumbCategory = getMarketplaceCategoryLabel(searchParams.get('from'), 'discern');
  const initialTabLabel = searchParams.get('focus') === 'playbooks-templates' ? 'Playbooks' : 'All';

  const [activeTabLabel, setActiveTabLabel] = useState(initialTabLabel);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);

  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Knowledge Type',
      options: [
        { value: 'Guideline',          label: 'Guideline' },
        { value: 'Operating Standard',  label: 'Operating Standard' },
        { value: 'Process Reference',   label: 'Process Reference' },
        { value: 'Evidence Standard',   label: 'Evidence Standard' },
        { value: 'Playbook',            label: 'Playbook' },
        { value: 'Template',            label: 'Template' },
        { value: 'GHC Reference',       label: 'GHC Reference' },
        { value: '6xD Reference',       label: '6xD Reference' },
        { value: 'Workspace Guide',     label: 'Workspace Guide' },
        { value: 'Learning Reference',  label: 'Learning Reference' },
      ]
    },
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'Effective',     label: 'Effective' },
        { value: 'Under Review',  label: 'Under Review' },
        { value: 'Draft',         label: 'Draft' },
        { value: 'Needs Update',  label: 'Needs Update' },
        { value: 'Deprecated',    label: 'Deprecated' },
      ]
    },
    {
      id: 'ack',
      label: 'Acknowledgement',
      options: [
        { value: 'required',     label: 'Required' },
        { value: 'not-required', label: 'Not Required' },
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
    setActiveTabLabel('All');
  };

  const activeTab = ALL_TABS.find(t => t.label === activeTabLabel);

  const filteredAssets = assets.filter(a => {
    const matchesTab = !activeTab || activeTab.value === 'All' || a.type === activeTab.value;
    const matchesSearch = search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      a.summary.toLowerCase().includes(search.toLowerCase());
    const matchesType = !filterValues.type?.length || filterValues.type.includes(a.type);
    const matchesStatus = !filterValues.status?.length || filterValues.status.includes(a.status);
    const matchesAck = !filterValues.ack?.length || (
      (filterValues.ack.includes('required') && a.acknowledgementRequired) ||
      (filterValues.ack.includes('not-required') && !a.acknowledgementRequired)
    );
    const matchesRecommended = !recommendedActive || a.linkedWorkCount > 5;
    return matchesTab && matchesSearch && matchesType && matchesStatus && matchesAck && matchesRecommended;
  });

  // KPI calculations
  const totalAssets = assets.length;
  const linkedToWork = assets.filter(a => a.linkedWorkCount > 0).length;
  const outdatedFlags = assets.filter(a => a.feedbackMarker === 'Has outdated flags' || a.status === 'Needs Update').length;
  const effectiveRefs = assets.filter(a => a.status === 'Effective').length;
  const ackRequired = assets.filter(a => a.acknowledgementRequired).length;
  const underReview = assets.filter(a => a.status === 'Under Review').length;

  const kpis = [
    { label: 'Total Assets',      value: totalAssets,   icon: BookOpen,       color: 'text-primary',  bg: 'bg-navy-50' },
    { label: 'Linked to Work',    value: linkedToWork,  icon: LinkIcon,       color: 'text-success',  bg: 'bg-success/5' },
    { label: 'Outdated / Flagged',value: outdatedFlags, icon: Flag,           color: 'text-warning',  bg: 'bg-warning/5' },
    { label: 'Effective Refs',    value: effectiveRefs, icon: ShieldCheck,    color: 'text-success',  bg: 'bg-success/5' },
    { label: 'Ack Required',      value: ackRequired,   icon: ClipboardList,  color: 'text-primary',  bg: 'bg-navy-50' },
    { label: 'Under Review',      value: underReview,   icon: Activity,       color: 'text-warning',  bg: 'bg-warning/5' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Marketplace / {breadcrumbCategory} / Knowledge Discovery</div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-primary">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <BookOpen size={24} />
            </div>
            Knowledge Hub
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Browse GHC references, 6xD playbooks, guidelines, templates, and operating standards to support your work.
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`rounded-xl ${kpi.bg} px-4 py-3 ring-1 ring-inset ring-border-subtle`}>
              <div className={`mb-1 flex items-center gap-1.5 text-xs font-semibold ${kpi.color}`}>
                <Icon size={13} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{kpi.value}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-text-muted">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Category Tabs */}
      <FilterBar tabs={TAB_LABELS} activeTab={activeTabLabel} onTabChange={setActiveTabLabel} />

      {/* Filters */}
      <div className="mt-4">
        <MarketplaceTopFilterBar
          searchPlaceholder="Search by title, tag, or keyword..."
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

      {/* Results count */}
      {!isLoading && (
        <p className="mt-4 text-sm text-text-muted">
          Showing <strong className="text-text-primary">{filteredAssets.length}</strong> of <strong className="text-text-primary">{totalAssets}</strong> knowledge assets
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="mt-8 flex h-64 items-center justify-center text-text-muted">
          Loading knowledge assets...
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map(asset => (
            <KnowledgeCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface py-16 text-center">
          <BookOpen size={48} className="mb-4 text-text-muted opacity-40" />
          <h3 className="mb-2 text-lg font-bold text-text-primary">No assets found</h3>
          <p className="mb-6 max-w-sm text-sm text-text-secondary">
            No knowledge assets match your current search or filters. Try adjusting your criteria.
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
