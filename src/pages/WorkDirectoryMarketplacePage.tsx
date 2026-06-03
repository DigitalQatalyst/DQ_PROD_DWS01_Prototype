import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Building2, FilterX, Inbox, UsersRound } from 'lucide-react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { MarketplaceTopFilterBar } from '../components/MarketplaceTopFilterBar';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { DirectoryCard } from '../components/WorkDirectoryComponents';
import { useDirectoryLifecycle } from '../context/DirectoryLifecycleContext';

const tabs = ['Teams', 'Units', 'Owners', 'Experts', 'Fulfilment Contacts', 'Support Contacts'];

const tabMatches: Record<string, string[]> = {
  Teams: ['Team'],
  Units: ['Unit'],
  Owners: ['Person', 'Service Owner', 'Governance Owner'],
  Experts: ['Expert'],
  'Fulfilment Contacts': ['Fulfilment Contact', 'Service Owner'],
  'Support Contacts': ['Support Contact', 'Queue']
};

const filterGroups: FilterGroup[] = [
  {
    id: 'type',
    label: 'Directory Type',
    options: ['Person', 'Team', 'Unit', 'Service Owner', 'Fulfilment Contact', 'Support Contact', 'Expert', 'Governance Owner', 'Queue'].map((value) => ({ value, label: value }))
  },
  {
    id: 'area',
    label: 'Ownership Area',
    options: ['Tasks', 'Requests', 'Approvals', 'Knowledge', 'SLA Rules', 'Platform Configuration', 'HRA Workflow', 'Support Triage', 'Governance', 'Workflow', 'Reviews'].map((value) => ({ value, label: value }))
  },
  {
    id: 'availability',
    label: 'Availability',
    options: ['Available', 'Busy', 'Escalation only'].map((value) => ({ value, label: value }))
  },
  {
    id: 'workload',
    label: 'Workload',
    options: ['Low', 'Medium', 'High'].map((value) => ({ value, label: value }))
  },
  {
    id: 'unit',
    label: 'Unit',
    options: ['Digital Platforms', 'HRA', 'Support Operations', 'Platform Governance', 'eCom.DXP', 'Enterprise'].map((value) => ({ value, label: value }))
  },
  {
    id: 'contact',
    label: 'Contact Route',
    options: ['Contact owner', 'Route request', 'Request review', 'Handoff work', 'Escalate', 'View queue', 'View structure', 'Assign task'].map((value) => ({ value, label: value }))
  }
];

export function WorkDirectoryMarketplacePage() {
  const { entries, isLoading } = useDirectoryLifecycle();
  const [activeTab, setActiveTab] = useState('Teams');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    setActiveTab('Teams');
  };

  const filteredEntries = entries.filter((entry) => {
    const tabTypes = tabMatches[activeTab] || [];
    const matchesTab = tabTypes.includes(entry.entityType);
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch === '' ||
      entry.name.toLowerCase().includes(normalizedSearch) ||
      entry.roleLabel.toLowerCase().includes(normalizedSearch) ||
      entry.unit.toLowerCase().includes(normalizedSearch) ||
      entry.summary.toLowerCase().includes(normalizedSearch) ||
      entry.ownershipAreas.some((area) => area.toLowerCase().includes(normalizedSearch));
    const matchesType = !filterValues.type?.length || filterValues.type.includes(entry.entityType);
    const matchesArea = !filterValues.area?.length || filterValues.area.some((area) => entry.ownershipAreas.includes(area));
    const matchesAvailability = !filterValues.availability?.length || filterValues.availability.includes(entry.availability);
    const matchesWorkload = !filterValues.workload?.length || filterValues.workload.includes(entry.workload);
    const matchesUnit = !filterValues.unit?.length || filterValues.unit.includes(entry.unit) || (entry.team ? filterValues.unit.includes(entry.team) : false);
    const matchesContact = !filterValues.contact?.length || filterValues.contact.some((route) => entry.contactRoutes.includes(route));
    return matchesTab && matchesSearch && matchesType && matchesArea && matchesAvailability && matchesWorkload && matchesUnit && matchesContact;
  });

  const units = entries.filter((entry) => entry.entityType === 'Unit').length;
  const teams = entries.filter((entry) => entry.entityType === 'Team').length;
  const owners = entries.filter((entry) => ['Person', 'Service Owner', 'Governance Owner', 'Expert'].includes(entry.entityType)).length;
  const queues = entries.filter((entry) => entry.entityType === 'Queue' || entry.entityType === 'Support Contact').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-primary">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-primary">
              <UsersRound size={24} />
            </div>
            Work Directory
          </h1>
          <p className="mt-2 max-w-3xl text-base text-text-secondary">
            Discover teams, units, owners, experts, fulfilment contacts, support routes, and accountable ownership paths.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Units" value={String(units)} status="info" />
        <KpiTile label="Teams" value={String(teams)} status="info" />
        <KpiTile label="Owners" value={String(owners)} status="success" />
        <KpiTile label="Support Queues" value={String(queues)} status="warning" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <MarketplaceTopFilterBar
          searchPlaceholder="Search owners, teams, queues, units, or expertise"
          searchValue={search}
          onSearchChange={setSearch}
          groups={filterGroups}
          values={filterValues}
          onChange={handleFilterChange}
          onClearAll={handleClearAll}
        />
      </div>

      {!isLoading && (
        <p className="mt-4 text-sm text-text-muted">
          Showing <strong className="text-text-primary">{filteredEntries.length}</strong> of <strong className="text-text-primary">{entries.length}</strong> directory entries
        </p>
      )}

      {isLoading ? (
        <div className="mt-8 flex h-64 items-center justify-center rounded-card bg-white text-text-muted">
          Loading Work Directory...
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEntries.map((entry) => <DirectoryCard key={entry.id} entry={entry} />)}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-dashed border-border-default bg-white py-16 text-center">
          <FilterX size={44} className="mb-4 text-text-muted opacity-50" />
          <h3 className="mb-2 text-lg font-bold text-text-primary">No directory entries found</h3>
          <p className="mb-6 max-w-md text-sm text-text-secondary">No people, teams, units, owners, or queues match the current search and filters.</p>
          <button
            onClick={handleClearAll}
            className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-navy-700"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { title: 'Organisation Structure', icon: Building2, route: '/marketplaces/work-directory/structure' },
          { title: 'Ownership Review', icon: BookOpen, route: '/admin/work-directory/review' },
          { title: 'Organisation Signals', icon: Inbox, route: '/intelligence/organisation-signals' }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} to={item.route} className="flex items-center gap-3 rounded-card border border-border-default bg-white p-4 text-sm font-bold text-primary shadow-sm hover:border-secondary">
              <Icon size={18} />
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
