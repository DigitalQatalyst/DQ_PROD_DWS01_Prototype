import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DetailPanel } from '../components/DetailPanel';
import { getUsers, getUnits, getTeams, getQueues } from '../services/platform.service';
import { MarketplaceCatalogLayout } from '../components/marketplace/MarketplaceCatalogLayout';
import { MarketplaceCatalogCard } from '../components/marketplace/MarketplaceCatalogCard';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { getMarketplaceCategoryLabel } from '../utils/marketplaceBreadcrumbs';

const DIRECTORY_TABS = [
  { id: 'Teams', label: 'Teams' },
  { id: 'Units', label: 'Units' },
  { id: 'Owners', label: 'Owners' },
  { id: 'Experts', label: 'Experts' },
  { id: 'Fulfilment Contacts', label: 'Fulfilment Contacts' },
  { id: 'Support Contacts', label: 'Support Contacts' },
];

const TAB_DESCRIPTIONS: Record<string, string> = {
  Teams: 'Delivery squads with leads, members, and ownership context.',
  Units: 'Organisational units with accountable leads and routing scope.',
  Owners: 'Service and fulfilment owners accountable for marketplace work.',
  Experts: 'Subject-matter experts for guidance and escalation paths.',
  'Fulfilment Contacts': 'People contacts for request and task fulfilment.',
  'Support Contacts': 'Queues and support routes for triage and escalation.',
};

type DirectoryEntry = {
  id: string;
  title: string;
  description: string;
  meta: string;
  typeLabel: string;
  entity: Record<string, unknown>;
};

export function WorkDirectoryMarketplacePage() {
  const [searchParams] = useSearchParams();
  const breadcrumbCategory = getMarketplaceCategoryLabel(
    searchParams.get('from'),
    'discern',
  );
  const [activeTab, setActiveTab] = useState('Teams');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});

  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Directory Type',
      options: DIRECTORY_TABS.map((tab) => ({
        value: tab.id,
        label: tab.label,
      })),
    },
    {
      id: 'area',
      label: 'Ownership Area',
      options: [
        { value: 'Tasks', label: 'Tasks' },
        { value: 'Requests', label: 'Requests' },
        { value: 'Approvals', label: 'Approvals' },
        { value: 'Knowledge', label: 'Knowledge' },
        { value: 'SLA Rules', label: 'SLA Rules' },
        { value: 'Platform Configuration', label: 'Platform Configuration' },
      ],
    },
    {
      id: 'availability',
      label: 'Availability',
      options: [
        { value: 'Available', label: 'Available' },
        { value: 'Busy', label: 'Busy' },
        { value: 'Escalation only', label: 'Escalation only' },
      ],
    },
  ];

  useEffect(() => {
    Promise.all([getUsers(), getUnits(), getTeams(), getQueues()]).then(
      ([loadedUsers, loadedUnits, loadedTeams, loadedQueues]) => {
        setUsers(loadedUsers);
        setUnits(loadedUnits);
        setTeams(loadedTeams);
        setQueues(loadedQueues);
      },
    );
  }, []);

  const tabCounts = useMemo(
    () => ({
      Teams: teams.length,
      Units: units.length,
      Owners: users.length,
      Experts: users.length,
      'Fulfilment Contacts': users.length,
      'Support Contacts': queues.length,
    }),
    [teams.length, units.length, users.length, queues.length],
  );

  const categoryTabs = DIRECTORY_TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    count: tabCounts[tab.id as keyof typeof tabCounts] ?? 0,
  }));

  const activeEntries = useMemo<DirectoryEntry[]>(() => {
    const query = search.toLowerCase();

    const matches = (title: string, description: string, id: string) =>
      !query ||
      title.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      id.toLowerCase().includes(query);

    if (activeTab === 'Teams') {
      return teams
        .filter((team) => matches(team.name, `Team lead for ${team.name}`, team.id))
        .map((team) => ({
          id: team.id,
          title: team.name,
          description: `Team lead and squad ownership for ${team.name}.`,
          meta: 'Team · Available',
          typeLabel: 'TEAM · Directory',
          entity: team,
        }));
    }

    if (activeTab === 'Units') {
      return units
        .filter((unit) => matches(unit.name, `Unit lead for ${unit.name}`, unit.id))
        .map((unit) => ({
          id: unit.id,
          title: unit.name,
          description: `Unit lead and organisational routing for ${unit.name}.`,
          meta: 'Unit · Available',
          typeLabel: 'UNIT · Directory',
          entity: unit,
        }));
    }

    if (
      activeTab === 'Owners' ||
      activeTab === 'Experts' ||
      activeTab === 'Fulfilment Contacts'
    ) {
      return users
        .filter((user) => {
          const unitName =
            units.find((unit) => unit.id === user.unitId)?.name || user.unitId;
          return matches(user.name, `${user.role} — ${unitName}`, user.id);
        })
        .map((user) => {
          const unitName =
            units.find((unit) => unit.id === user.unitId)?.name || user.unitId;
          return {
            id: user.id,
            title: user.name,
            description: `${user.role} — ${unitName}`,
            meta: `${activeTab} · ${unitName}`,
            typeLabel: 'CONTACT · Directory',
            entity: user,
          };
        });
    }

    if (activeTab === 'Support Contacts') {
      return queues
        .filter((queue) =>
          matches(
            queue.name,
            `Managed by ${queue.ownerPersonaIds.join(', ')}`,
            queue.id,
          ),
        )
        .map((queue) => ({
          id: queue.id,
          title: queue.name,
          description: `Managed by ${queue.ownerPersonaIds.join(', ')}`,
          meta: `${queue.newCount + queue.atRiskCount} active requests`,
          typeLabel: 'QUEUE · Directory',
          entity: queue,
        }));
    }

    return [];
  }, [activeTab, teams, units, users, queues, search]);

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    setActiveTab('Teams');
  };

  const filteredEntries = activeEntries.filter((entry) => {
    const matchesType =
      !filterValues.type?.length || filterValues.type.includes(activeTab);
    return matchesType;
  });

  const totalForTab = tabCounts[activeTab as keyof typeof tabCounts] ?? 0;

  return (
    <>
      <MarketplaceCatalogLayout
        eyebrow={`DWS.01 / ${breadcrumbCategory} / Work Directory`}
        title="Governed discovery for teams, owners, experts, and fulfilment contacts."
        lede="Organised through the DWS work directory taxonomy — teams, units, owners, experts, and support queues. Discovery layer only; use contacts to route work to the right accountable party."
        searchPlaceholder="Search owners, teams, queues, units, or expertise…"
        search={search}
        onSearchChange={setSearch}
        itemLabel="entries"
        totalCount={totalForTab}
        visibleCount={filteredEntries.length}
        tabs={categoryTabs}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        toneStrip={
          TAB_DESCRIPTIONS[activeTab]
            ? { code: activeTab, description: TAB_DESCRIPTIONS[activeTab] }
            : null
        }
        filterHelperText="Refine by directory type, ownership area, and availability."
        filterGroups={filterGroups}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        showEmpty={filteredEntries.length === 0}
        emptyTitle="No directory entries match your filters"
        emptyMessage="Try adjusting your search or filters, or clear all filters to see more contacts."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredEntries.map((entry) => (
            <MarketplaceCatalogCard
              key={entry.id}
              typeLabel={entry.typeLabel}
              metaLabel={entry.meta}
              title={entry.title}
              description={entry.description}
              footerId={entry.id}
              onClick={() => setSelectedEntity(entry.entity)}
            />
          ))}
        </div>
      </MarketplaceCatalogLayout>

      {selectedEntity && (
        <DetailPanel
          entity={selectedEntity}
          type="kpi"
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </>
  );
}
