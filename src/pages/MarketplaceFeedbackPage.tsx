import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Send } from 'lucide-react';
import { MarketplaceCatalogLayout } from '../components/marketplace/MarketplaceCatalogLayout';
import { MarketplaceCatalogCard } from '../components/marketplace/MarketplaceCatalogCard';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { usePersona } from '../context/PersonaContext';
import { MarketplaceActionRouter } from '../components/MarketplaceActionRouter';
import { buildCatalogTrail, resolveMarketplaceStage } from '../utils/marketplaceBreadcrumbs';

const FEEDBACK_TABS = [
  { id: 'All Feedback', label: 'All Feedback' },
  { id: 'My Feedback', label: 'My Feedback' },
  { id: 'Resolved', label: 'Resolved' },
];

const recentFeedback = [
  {
    id: 'FB-101',
    category: 'Missing Template',
    area: 'Task Templates',
    status: 'Under Review',
    date: '2026-05-12',
  },
  {
    id: 'FB-102',
    category: 'Unclear Service',
    area: 'IT & Access',
    status: 'Closed',
    date: '2026-05-10',
  },
  {
    id: 'FB-103',
    category: 'Outdated Knowledge',
    area: 'Playbooks',
    status: 'Routed',
    date: '2026-05-09',
  },
  {
    id: 'FB-104',
    category: 'Incorrect Owner',
    area: 'Work Directory',
    status: 'Closed',
    date: '2026-05-05',
  },
  {
    id: 'FB-105',
    category: 'Broken Navigation',
    area: 'Analytics',
    status: 'Under Review',
    date: '2026-05-01',
  },
];

export function MarketplaceFeedbackPage() {
  const [searchParams] = useSearchParams();
  const { activePersona } = usePersona();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'drive');

  const [activeTab, setActiveTab] = useState('All Feedback');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [isFlowOpen, setIsFlowOpen] = useState(false);

  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Feedback Type',
      options: [
        { value: 'Unclear Service', label: 'Unclear Service' },
        { value: 'Missing Template', label: 'Missing Template' },
        { value: 'Outdated Knowledge', label: 'Outdated Knowledge' },
        { value: 'Incorrect Owner', label: 'Incorrect Owner' },
        { value: 'Broken Navigation', label: 'Broken Navigation' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'New', label: 'New' },
        { value: 'Routed', label: 'Routed' },
        { value: 'Under Review', label: 'Under Review' },
        { value: 'Resolved', label: 'Resolved' },
        { value: 'Closed', label: 'Closed' },
      ],
    },
    {
      id: 'urgency',
      label: 'Urgency',
      options: [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
      ],
    },
    {
      id: 'affected',
      label: 'Affected Marketplace',
      options: [
        { value: 'Services', label: 'Services' },
        { value: 'Task Templates', label: 'Task Templates' },
        { value: 'Knowledge', label: 'Knowledge' },
        { value: 'Work Directory', label: 'Work Directory' },
        { value: 'Analytics', label: 'Analytics' },
      ],
    },
  ];

  const categoryTabs = useMemo(
    () =>
      FEEDBACK_TABS.map((tab) => ({
        ...tab,
        count:
          tab.id === 'Resolved'
            ? recentFeedback.filter(
                (item) =>
                  item.status === 'Resolved' || item.status === 'Closed',
              ).length
            : tab.id === 'My Feedback'
              ? 2
              : recentFeedback.length,
      })),
    [],
  );

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    setActiveTab('All Feedback');
  };

  const filteredFeedback = recentFeedback.filter((item) => {
    const matchesTab =
      activeTab === 'All Feedback' ||
      (activeTab === 'Resolved' &&
        (item.status === 'Resolved' || item.status === 'Closed')) ||
      (activeTab === 'My Feedback' && ['FB-101', 'FB-103'].includes(item.id));

    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      item.id.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.area.toLowerCase().includes(query);
    const matchesType =
      !filterValues.type?.length || filterValues.type.includes(item.category);
    const matchesStatus =
      !filterValues.status?.length ||
      filterValues.status.includes(item.status);

    return matchesTab && matchesSearch && matchesType && matchesStatus;
  });

  return (
    <MarketplaceCatalogLayout
      breadcrumbItems={buildCatalogTrail(stage, 'Marketplace Feedback')}
      title="Governed discovery for marketplace improvement signals."
      lede="Raise and track feedback on unclear services, missing templates, outdated knowledge, incorrect owners, or broken navigation paths. Submissions route to accountable marketplace owners."
      searchPlaceholder="Search feedback, affected items, owners, or statuses…"
      search={search}
      onSearchChange={setSearch}
      itemLabel="records"
      totalCount={recentFeedback.length}
      visibleCount={filteredFeedback.length}
      tabs={categoryTabs}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      filterHelperText="Refine by feedback type, status, urgency, and affected marketplace."
      filterGroups={filterGroups}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      onClearAll={handleClearAll}
      showEmpty={filteredFeedback.length === 0}
      emptyTitle="No feedback records match your filters"
      emptyMessage="Try adjusting your search or filters, or clear all filters to see all feedback records."
      belowContent={
        <MarketplaceActionRouter
          marketplaceType={isFlowOpen ? 'feedback' : null}
          item={null}
          activePersona={activePersona}
          onClose={() => setIsFlowOpen(false)}
        />
      }
    >
      <div className="mb-6 rounded-xl border border-border-default bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 text-primary">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">Submit Feedback</h2>
            <p className="text-sm text-text-secondary">
              Open the feedback flow to route your suggestions to the correct owner.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsFlowOpen(true)}
          className="flex items-center justify-center gap-2 rounded-button bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Start Feedback Flow
          <Send size={16} />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredFeedback.map((item) => (
          <MarketplaceCatalogCard
            key={item.id}
            typeLabel={`${item.category.split(' ')[0].toUpperCase()} · Feedback`}
            metaLabel={`${item.status} · ${item.date}`}
            title={item.category}
            description={`Affected area: ${item.area}`}
            footerId={item.id}
            highlighted={item.status === 'Under Review'}
            onClick={() => setIsFlowOpen(true)}
          />
        ))}
      </div>
    </MarketplaceCatalogLayout>
  );
}
