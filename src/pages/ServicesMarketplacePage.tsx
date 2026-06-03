import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceEmptyState } from '../components/ServiceEmptyState';
import { Search } from 'lucide-react';
import {
  MarketplaceTopFilterBar,
} from '../components/MarketplaceTopFilterBar';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { usePersona } from '../context/PersonaContext';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { getMarketplaceCategoryLabel } from '../utils/marketplaceBreadcrumbs';

export function ServicesMarketplacePage() {
  const [searchParams] = useSearchParams();
  const { activePersona } = usePersona();
  const { services, requests } = useServiceLifecycle();
  const breadcrumbCategory = getMarketplaceCategoryLabel(searchParams.get('from'), 'deploy');

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);

  // ── Tabs (spec §4.4) ────────────────────────────────────────────
  const tabs = [
    'All',
    'HRA Requests',
    'IT & Access',
    'Platform Support',
    'Knowledge / Content',
    'Task / Workflow',
    'Admin Requests',
    'Approvals',
    'Escalations',
  ];

  // ── Filter groups (spec §7 ServiceFilterPanel) ───────────────────
  const filterGroups: FilterGroup[] = [
    {
      id: 'category',
      label: 'Service Category',
      options: [
        { value: 'HRA Requests', label: 'HRA Requests' },
        { value: 'IT & Access', label: 'IT & Access' },
        { value: 'Platform Support', label: 'Platform Support' },
        { value: 'Knowledge / Content', label: 'Knowledge / Content' },
        { value: 'Task / Workflow', label: 'Task / Workflow' },
        { value: 'Admin Requests', label: 'Admin Requests' },
        { value: 'Approvals', label: 'Approvals' },
        { value: 'Escalations', label: 'Escalations' },
      ],
    },
    {
      id: 'sla',
      label: 'SLA',
      options: [
        { value: '4 business hours', label: 'Less than 4 hours' },
        { value: '1 business day', label: '1 business day' },
        { value: '2 business days', label: '2 business days' },
        { value: '3 business days', label: '3+ business days' },
      ],
    },
    {
      id: 'approval',
      label: 'Approval Required',
      options: [
        { value: 'Required', label: 'Approval required' },
        { value: 'Conditional', label: 'Conditional approval' },
        { value: 'Not Required', label: 'No approval required' },
      ],
    },
    {
      id: 'owner',
      label: 'Service Owner',
      options: [
        { value: 'People Operations Service Owner', label: 'People Operations' },
        { value: 'IT & Access Service Owner', label: 'IT & Access' },
        { value: 'Platform Support Service Owner', label: 'Platform Support' },
        { value: 'Knowledge Governance Service Owner', label: 'Knowledge Governance' },
        { value: 'Workflow Governance Service Owner', label: 'Workflow Governance' },
        { value: 'Workspace Admin Service Owner', label: 'Workspace Admin' },
        { value: 'Approval Governance Service Owner', label: 'Approval Governance' },
        { value: 'Escalation Governance Owner', label: 'Escalation Governance' },
      ],
    },
  ];

  // ── Filtering logic ─────────────────────────────────────────────

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({
      ...prev,
      [groupId]: values,
    }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    setRecommendedActive(false);
    setActiveTab('All');
  };

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      // Tab filter
      const matchesTab =
        activeTab === 'All' || s.category.includes(activeTab);

      // Search filter — title, description, owner, category
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.owner.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);

      // Panel filters
      const matchesCategory =
        !filterValues.category?.length ||
        filterValues.category.includes(s.category);
      const matchesSla =
        !filterValues.sla?.length || filterValues.sla.includes(s.sla);
      const matchesApproval =
        !filterValues.approval?.length ||
        filterValues.approval.includes(s.approval);
      const matchesOwner =
        !filterValues.owner?.length || filterValues.owner.includes(s.owner);

      return (
        matchesTab &&
        matchesSearch &&
        matchesCategory &&
        matchesSla &&
        matchesApproval &&
        matchesOwner
      );
    });
  }, [services, activeTab, search, filterValues]);

  // ── KPI data ────────────────────────────────────────────────────
  const atRiskCount = requests.filter(
    (r) => r.slaState === 'At Risk'
  ).length;

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Marketplace / {breadcrumbCategory} / Services Marketplace</div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Service Catalogue
        </h1>
        <p className="text-text-secondary">
          Discover and submit requests for support, access, and governance.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Available Services" value={services.length.toString()} status="info" />
        <KpiTile label="Avg Routing Time" value="< 1d" status="success" />
        <KpiTile
          label="At-Risk Requests"
          value={atRiskCount.toString()}
          status="warning"
        />
        <KpiTile label="Closed This Week" value="21" status="success" />
      </div>

      {/* Category tabs */}
      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Top filter bar */}
      <div className="mt-4">
        <MarketplaceTopFilterBar
          searchPlaceholder="Search services, owners, SLAs, or request types"
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

      {/* Service card grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <ServiceEmptyState
          title="No services match your filters"
          message="Try adjusting your search or filters, or clear all filters to see all available services."
          ctaLabel="Clear filters"
          onCtaClick={handleClearAll}
        />
      )}
    </div>
  );
}
