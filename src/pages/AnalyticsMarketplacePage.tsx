import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { usePersona } from '../context/PersonaContext';
import { BarChart2, Lock, ArrowRight } from 'lucide-react';
import {
  MarketplaceTopFilterBar,
} from '../components/MarketplaceTopFilterBar';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { MarketplaceActionRouter } from '../components/MarketplaceActionRouter';
import { RequestIntakeWizard } from '../components/RequestIntakeWizard';
export function AnalyticsMarketplacePage() {
  const { activePersona, hasRouteAccess } = usePersona();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  // Filter state
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);
  const tabs = [
  'All',
  'Personal',
  'Team',
  'Unit',
  'SLA',
  'Governance',
  'Executive'];

  const filterGroups: FilterGroup[] = [
  {
    id: 'type',
    label: 'Dashboard Type',
    options: [
    {
      value: 'Personal',
      label: 'Personal'
    },
    {
      value: 'Team',
      label: 'Team'
    },
    {
      value: 'Unit',
      label: 'Unit'
    },
    {
      value: 'SLA',
      label: 'SLA'
    },
    {
      value: 'Governance',
      label: 'Governance'
    },
    {
      value: 'Outcome',
      label: 'Outcome'
    },
    {
      value: 'Executive',
      label: 'Executive'
    }]

  },
  {
    id: 'permission',
    label: 'Permission',
    options: [
    {
      value: 'Available to my role',
      label: 'Available to my role'
    },
    {
      value: 'Restricted',
      label: 'Restricted'
    },
    {
      value: 'Requires approval',
      label: 'Requires approval'
    }]

  },
  {
    id: 'metrics',
    label: 'Metrics Included',
    options: [
    {
      value: 'SLA',
      label: 'SLA'
    },
    {
      value: 'Blockers',
      label: 'Blockers'
    },
    {
      value: 'Closure Quality',
      label: 'Closure Quality'
    },
    {
      value: 'Workload',
      label: 'Workload'
    },
    {
      value: 'Governance Health',
      label: 'Governance Health'
    },
    {
      value: 'Outcome Progress',
      label: 'Outcome Progress'
    },
    {
      value: 'Associate Performance',
      label: 'Associate Performance'
    }]

  },
  {
    id: 'frequency',
    label: 'Update Frequency',
    options: [
    {
      value: 'Live mock',
      label: 'Live mock'
    },
    {
      value: 'Daily',
      label: 'Daily'
    },
    {
      value: 'Weekly',
      label: 'Weekly'
    },
    {
      value: 'Monthly',
      label: 'Monthly'
    }]

  },
  {
    id: 'audience',
    label: 'Audience',
    options: [
    {
      value: 'Associate',
      label: 'Associate'
    },
    {
      value: 'Scrum Master',
      label: 'Scrum Master'
    },
    {
      value: 'Team / Squad Lead',
      label: 'Team / Squad Lead'
    },
    {
      value: 'Unit Lead',
      label: 'Unit Lead'
    },
    {
      value: 'HRA',
      label: 'HRA'
    },
    {
      value: 'Admins',
      label: 'Admins'
    },
    {
      value: 'Support',
      label: 'Support'
    },
    {
      value: 'CEO',
      label: 'CEO'
    }]

  },
  {
    id: 'scope',
    label: 'Data Scope',
    options: [
    {
      value: 'Personal',
      label: 'Personal'
    },
    {
      value: 'Team',
      label: 'Team'
    },
    {
      value: 'Unit',
      label: 'Unit'
    },
    {
      value: 'Enterprise',
      label: 'Enterprise'
    }]

  }];

  const dashboards = [
  {
    id: 'DB-1',
    category: 'Personal',
    title: 'My Performance Snapshot',
    desc: 'Personal execution metrics, closure quality, and SLA adherence.',
    route: '/workspace/my-work',
    personas: ['Associate']
  },
  {
    id: 'DB-2',
    category: 'Team',
    title: 'Team Execution Dashboard',
    desc: 'Team workload, flow health, blockers, and missing updates.',
    route: '/operations/team-execution',
    personas: ['Team / Squad Lead', 'Scrum Master']
  },
  {
    id: 'DB-3',
    category: 'Unit',
    title: 'Unit Visibility Dashboard',
    desc: 'Unit health, outcome tracking, and governance risks.',
    route: '/operations/unit-visibility',
    personas: ['Unit Lead']
  },
  {
    id: 'DB-4',
    category: 'SLA',
    title: 'SLA Dashboard',
    desc: 'Cross-platform SLA exposure, aging distribution, and breaches.',
    route: '/intelligence/sla',
    personas: [
    'Scrum Master',
    'Team / Squad Lead',
    'Unit Lead',
    'HRA',
    'Admins',
    'Support',
    'CEO']

  },
  {
    id: 'DB-5',
    category: 'Governance',
    title: 'Governance Dashboard',
    desc: 'Audit exceptions, policy compliance, and closure quality risks.',
    route: '/executive/enterprise-execution',
    personas: ['CEO', 'Admins']
  },
  {
    id: 'DB-6',
    category: 'Executive',
    title: 'CEO Enterprise Dashboard',
    desc: 'Enterprise execution health, strategic initiatives, and value delivery.',
    route: '/executive/enterprise-execution',
    personas: ['CEO']
  }];

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({
      ...prev,
      [groupId]: values
    }));
  };
  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    setRecommendedActive(false);
  };
  const filteredDashboards = dashboards.filter((d) => {
    const matchesTab = activeTab === 'All' || d.category === activeTab;
    const matchesSearch =
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.desc.toLowerCase().includes(search.toLowerCase());
    const matchesType =
    !filterValues.type?.length || filterValues.type.includes(d.category);
    // Permission filter logic
    let matchesPermission = true;
    if (filterValues.permission?.length) {
      const isPermitted = hasRouteAccess(d.route, activePersona);
      if (
      filterValues.permission.includes('Available to my role') &&
      !isPermitted)

      matchesPermission = false;
      if (filterValues.permission.includes('Restricted') && isPermitted)
      matchesPermission = false;
    }
    const matchesRecommended =
    !recommendedActive || d.personas.includes(activePersona.role);
    return (
      matchesTab &&
      matchesSearch &&
      matchesType &&
      matchesPermission &&
      matchesRecommended);

  });
  if (recommendedActive) {
    filteredDashboards.sort((a, b) => {
      const aRec = a.personas.includes(activePersona.role);
      const bRec = b.personas.includes(activePersona.role);
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      return 0;
    });
  }
  const [actionItem, setActionItem] = useState<{
    dashboard: any;
    isPermitted: boolean;
  } | null>(null);
  const [nestedAction, setNestedAction] = useState<{
    type: 'request';
    dashboard: any;
  } | null>(null);
  const handleOpenAction = (dashboard: any, isPermitted: boolean) => {
    setActionItem({
      dashboard,
      isPermitted
    });
  };
  const visibleCount = dashboards.filter((d) =>
  hasRouteAccess(d.route, activePersona)
  ).length;
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Analytics Discovery
        </h1>
        <p className="text-text-secondary">
          Discover permitted dashboards, SLA views, governance reports, and
          performance surfaces.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile
          label="Dashboards Visible"
          value={visibleCount.toString()}
          status="info" />
        
        <KpiTile label="SLA Views" value="2" status="warning" />
        <KpiTile label="Governance Reports" value="3" status="danger" />
        <KpiTile label="Outcome Views" value="1" status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <MarketplaceTopFilterBar
          searchPlaceholder="Search dashboards, metrics, reports, or visibility areas"
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDashboards.map((dashboard) => {
          const isPermitted = hasRouteAccess(dashboard.route, activePersona);
          return (
            <div
              key={dashboard.id}
              onClick={() => handleOpenAction(dashboard, isPermitted)}
              className={`flex flex-col bg-white rounded-card border border-border-default p-6 transition-all relative overflow-hidden
              ${isPermitted ? 'hover:shadow-md hover:border-border-strong cursor-pointer group' : 'opacity-75 cursor-pointer hover:border-border-strong'}`}>
              
              {!isPermitted &&
              <div
                className="absolute top-4 right-4 text-text-disabled"
                title="Restricted for your persona">
                
                  <Lock size={16} />
                </div>
              }

              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${isPermitted ? 'bg-navy-50 text-primary group-hover:bg-primary group-hover:text-white' : 'bg-surface text-text-disabled'}`}>
                  
                  <BarChart2 size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-surface px-2 py-1 rounded">
                  {dashboard.category}
                </span>
              </div>

              <h3
                className={`text-lg font-semibold mb-2 ${isPermitted ? 'text-primary' : 'text-text-muted'}`}>
                
                {dashboard.title}
              </h3>
              <p
                className={`text-sm mb-6 flex-1 ${isPermitted ? 'text-text-secondary' : 'text-text-disabled'}`}>
                
                {dashboard.desc}
              </p>

              <button
                className={`w-full py-2.5 font-semibold text-sm rounded-button transition-colors flex items-center justify-center gap-2 ${isPermitted ? 'bg-surface text-primary group-hover:bg-primary group-hover:text-white' : 'bg-surface text-text-muted hover:text-primary'}`}>
                
                {isPermitted ? 'Open Dashboard' : 'Request Access'}
                {isPermitted ?
                <ArrowRight size={16} /> :

                <Lock size={16} />
                }
              </button>
            </div>);

        })}
      </div>

      {filteredDashboards.length === 0 &&
      <div className="text-center py-16 bg-white rounded-card border border-border-default">
          <p className="text-text-muted mb-4">
            No marketplace items match your filters.
          </p>
          <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-surface text-primary font-semibold text-sm rounded-button hover:bg-navy-50 transition-colors">
          
            Clear filters
          </button>
        </div>
      }

      <MarketplaceActionRouter
        marketplaceType={actionItem ? 'analytics' : null}
        item={actionItem?.dashboard}
        activePersona={activePersona}
        isPermitted={actionItem?.isPermitted}
        onClose={() => setActionItem(null)}
        onRequestAccess={(dashboard) => {
          setActionItem(null);
          setNestedAction({
            type: 'request',
            dashboard
          });
        }} />
      

      {nestedAction?.type === 'request' &&
      <RequestIntakeWizard
        service={{
          title: 'Dashboard Access Request',
          category: 'IT & Access Requests',
          ownerType: 'Platform Admin'
        }}
        activePersona={activePersona}
        onClose={() => setNestedAction(null)}
        preFilledContext={{
          justification: `Requesting access to ${nestedAction.dashboard.title}`
        }} />

      }
    </div>);

}