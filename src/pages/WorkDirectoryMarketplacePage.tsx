import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { DetailPanel } from '../components/DetailPanel';
import { OwnerBadge } from '../components/OwnerBadge';
import { getUsers, getUnits, getTeams, getQueues } from '../services/platform.service';
import { Users, Building, Inbox, User } from 'lucide-react';
import { MarketplaceTopFilterBar } from '../components/MarketplaceTopFilterBar';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { getMarketplaceCategoryLabel } from '../utils/marketplaceBreadcrumbs';
export function WorkDirectoryMarketplacePage() {
  const [searchParams] = useSearchParams();
  const breadcrumbCategory = getMarketplaceCategoryLabel(searchParams.get('from'), 'discern');
  const [activeTab, setActiveTab] = useState('Teams');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  // Filter state
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const tabs = ['Teams', 'Units', 'Owners', 'Experts', 'Fulfilment Contacts', 'Support Contacts'];
  const filterGroups: FilterGroup[] = [{
    id: 'type',
    label: 'Directory Type',
    options: [{
      value: 'Teams',
      label: 'Teams'
    }, {
      value: 'Units',
      label: 'Units'
    }, {
      value: 'Service Owners',
      label: 'Service Owners'
    }, {
      value: 'Fulfilment Queues',
      label: 'Fulfilment Queues'
    }, {
      value: 'Experts',
      label: 'Experts'
    }, {
      value: 'Governance Owners',
      label: 'Governance Owners'
    }]
  }, {
    id: 'area',
    label: 'Ownership Area',
    options: [{
      value: 'Tasks',
      label: 'Tasks'
    }, {
      value: 'Requests',
      label: 'Requests'
    }, {
      value: 'Approvals',
      label: 'Approvals'
    }, {
      value: 'Knowledge',
      label: 'Knowledge'
    }, {
      value: 'SLA Rules',
      label: 'SLA Rules'
    }, {
      value: 'Platform Configuration',
      label: 'Platform Configuration'
    }, {
      value: 'HRA Workflow',
      label: 'HRA Workflow'
    }, {
      value: 'Support Triage',
      label: 'Support Triage'
    }]
  }, {
    id: 'availability',
    label: 'Availability',
    options: [{
      value: 'Available',
      label: 'Available'
    }, {
      value: 'Busy',
      label: 'Busy'
    }, {
      value: 'Escalation only',
      label: 'Escalation only'
    }]
  }, {
    id: 'workload',
    label: 'Workload',
    options: [{
      value: 'Low',
      label: 'Low'
    }, {
      value: 'Medium',
      label: 'Medium'
    }, {
      value: 'High',
      label: 'High'
    }]
  }, {
    id: 'unit',
    label: 'Unit',
    options: [{
      value: 'Digital Platforms',
      label: 'Digital Platforms'
    }, {
      value: 'HRA',
      label: 'HRA'
    }, {
      value: 'Support Operations',
      label: 'Support Operations'
    }, {
      value: 'Platform Governance',
      label: 'Platform Governance'
    }, {
      value: 'eCom.DXP',
      label: 'eCom.DXP'
    }]
  }, {
    id: 'contact',
    label: 'Contact Route',
    options: [{
      value: 'Contact owner',
      label: 'Contact owner'
    }, {
      value: 'Route request',
      label: 'Route request'
    }, {
      value: 'Escalate',
      label: 'Escalate'
    }, {
      value: 'View queue',
      label: 'View queue'
    }]
  }];
  useEffect(() => {
    Promise.all([getUsers(), getUnits(), getTeams(), getQueues()]).then(([u, un, t, q]) => {
      setUsers(u);
      setUnits(un);
      setTeams(t);
      setQueues(q);
    });
  }, []);
  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({
      ...prev,
      [groupId]: values
    }));
  };
  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
  };
  const renderContent = () => {
    let items: any[] = [];
    if (activeTab === 'Teams') {
      items = teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
      if (items.length === 0) return null;
      return items.map((team) => <div key={team.id} onClick={() => setSelectedEntity(team)} className="p-6 rounded-card bg-white border border-border-default hover:shadow-md cursor-pointer transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-navy-50 text-primary rounded-lg">
              <Users size={20} />
            </div>
            <h3 className="font-semibold text-primary">{team.name}</h3>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-text-muted">Lead</div>
            <OwnerBadge userId={team.leadUserId} />
          </div>
        </div>);
    }
    if (activeTab === 'Units') {
      items = units.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
      if (items.length === 0) return null;
      return items.map((unit) => <div key={unit.id} onClick={() => setSelectedEntity(unit)} className="p-6 rounded-card bg-white border border-border-default hover:shadow-md cursor-pointer transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-navy-50 text-primary rounded-lg">
              <Building size={20} />
            </div>
            <h3 className="font-semibold text-primary">{unit.name}</h3>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-text-muted">Lead</div>
            <OwnerBadge userId={unit.leadUserId} />
          </div>
        </div>);
    }
    if (activeTab === 'Owners' || activeTab === 'Experts' || activeTab === 'Fulfilment Contacts') {
      items = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
      if (items.length === 0) return null;
      return items.map((user) => <div key={user.id} onClick={() => setSelectedEntity(user)} className="p-6 rounded-card bg-white border border-border-default hover:shadow-md cursor-pointer transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-navy-50 text-primary rounded-lg">
              <User size={20} />
            </div>
            <h3 className="font-semibold text-primary">{user.name}</h3>
          </div>
          <div className="text-sm text-text-secondary mb-1">{user.role}</div>
          <div className="text-xs text-text-muted">
            Unit: {units.find((u) => u.id === user.unitId)?.name || user.unitId}
          </div>
        </div>);
    }
    if (activeTab === 'Support Contacts') {
      items = queues.filter((q) => q.name.toLowerCase().includes(search.toLowerCase()));
      if (items.length === 0) return null;
      return items.map((queue) => <div key={queue.id} onClick={() => setSelectedEntity(queue)} className="p-6 rounded-card bg-white border border-border-default hover:shadow-md cursor-pointer transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-navy-50 text-primary rounded-lg">
              <Inbox size={20} />
            </div>
            <h3 className="font-semibold text-primary">{queue.name}</h3>
          </div>
          <div className="text-sm text-text-secondary mb-2">
            Managed by: {queue.ownerPersonaIds.join(', ')}
          </div>
          <div className="text-xs text-text-muted">
            Active requests: {queue.newCount + queue.atRiskCount}
          </div>
        </div>);
    }
    return null;
  };
  const content = renderContent();
  return <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Marketplace / {breadcrumbCategory} / Work Directory</div>
        <h1 className="text-3xl font-bold text-primary mb-2">Work Directory</h1>
        <p className="text-text-secondary">
          Find teams, owners, experts, and support contacts.
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {content}
      </div>

      {!content && <div className="text-center py-16 bg-white rounded-card border border-border-default">
          <p className="text-text-muted mb-4">
            No marketplace items match your filters.
          </p>
          <button onClick={handleClearAll} className="px-4 py-2 bg-surface text-primary font-semibold text-sm rounded-button hover:bg-navy-50 transition-colors">
            Clear filters
          </button>
        </div>}

      {selectedEntity && <DetailPanel entity={selectedEntity} type="kpi" onClose={() => setSelectedEntity(null)} />}
    </div>;
}
