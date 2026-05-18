import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DetailPanel } from '../components/DetailPanel';
import { getRequests } from '../services/platform.service';
import { Briefcase, Clock, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  MarketplaceFilterPanel,
  FilterGroup } from
'../components/MarketplaceFilterPanel';
import { usePersona } from '../context/PersonaContext';
import { MarketplaceActionRouter } from '../components/MarketplaceActionRouter';
export function ServicesMarketplacePage() {
  const { activePersona } = usePersona();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  // Filter state
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);
  const tabs = [
  'All',
  'HRA',
  'IT & Access',
  'Platform Support',
  'Knowledge / Content',
  'Task / Workflow',
  'Admin',
  'Approvals',
  'Escalations'];

  const filterGroups: FilterGroup[] = [
  {
    id: 'category',
    label: 'Service Category',
    options: [
    {
      value: 'HRA Requests',
      label: 'HRA Requests'
    },
    {
      value: 'IT & Access Requests',
      label: 'IT Access'
    },
    {
      value: 'Platform Support',
      label: 'Platform Support'
    },
    {
      value: 'Knowledge / Content Requests',
      label: 'Knowledge / Content'
    },
    {
      value: 'Task / Workflow Support',
      label: 'Task / Workflow Support'
    },
    {
      value: 'Admin Requests',
      label: 'Admin'
    },
    {
      value: 'Approvals',
      label: 'Approvals'
    },
    {
      value: 'Escalations',
      label: 'Escalations'
    }]

  },
  {
    id: 'sla',
    label: 'SLA',
    options: [
    {
      value: '4 hours',
      label: 'Less than 4 hours'
    },
    {
      value: '1 business day',
      label: '1 business day'
    },
    {
      value: '2 business days',
      label: '2 business days'
    },
    {
      value: '3+ business days',
      label: '3+ business days'
    }]

  },
  {
    id: 'approval',
    label: 'Approval Required',
    options: [
    {
      value: 'required',
      label: 'Approval required'
    },
    {
      value: 'none',
      label: 'No approval required'
    }]

  },
  {
    id: 'owner',
    label: 'Fulfilment Owner',
    options: [
    {
      value: 'HRA Team',
      label: 'HRA Team'
    },
    {
      value: 'IT Support',
      label: 'IT Support'
    },
    {
      value: 'Platform Engineering',
      label: 'Platform Engineering'
    },
    {
      value: 'Content Governance',
      label: 'Content Governance'
    },
    {
      value: 'Scrum Master / Lead',
      label: 'Scrum Master / Lead'
    },
    {
      value: 'Platform Admin',
      label: 'Platform Admin'
    },
    {
      value: 'Unit Lead',
      label: 'Unit Lead'
    }]

  },
  {
    id: 'risk',
    label: 'Request Risk',
    options: [
    {
      value: 'Normal',
      label: 'Normal'
    },
    {
      value: 'At risk',
      label: 'At risk'
    },
    {
      value: 'Urgent',
      label: 'Urgent'
    }]

  },
  {
    id: 'persona',
    label: 'Recommended for Persona',
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

  }];

  useEffect(() => {
    getRequests().then(setRequests);
  }, []);
  const services = [
  {
    id: 'SRV-1',
    category: 'HRA Requests',
    title: 'New Joiner Onboarding',
    desc: 'Initiate the onboarding workflow for a new team member.',
    sla: '2 business days',
    ownerType: 'HRA Team',
    inputs: ['Joiner Name', 'Role', 'Start Date', 'Unit'],
    approval: 'required',
    risk: 'Normal',
    personas: ['HRA', 'Team / Squad Lead', 'Unit Lead']
  },
  {
    id: 'SRV-2',
    category: 'IT & Access Requests',
    title: 'System Access Request',
    desc: 'Request access to internal tools, databases, or environments.',
    sla: '4 hours',
    ownerType: 'IT Support',
    inputs: ['System Name', 'Access Level', 'Business Justification'],
    approval: 'required',
    risk: 'Normal',
    personas: ['Associate', 'Scrum Master', 'Team / Squad Lead']
  },
  {
    id: 'SRV-3',
    category: 'Platform Support',
    title: 'Report a Bug',
    desc: 'Report an issue or unexpected behaviour in DWS.01.',
    sla: '1 business day',
    ownerType: 'Platform Engineering',
    inputs: ['Description', 'Steps to Reproduce', 'Expected Behaviour'],
    approval: 'none',
    risk: 'Normal',
    personas: [
    'Associate',
    'Scrum Master',
    'Team / Squad Lead',
    'Unit Lead',
    'HRA',
    'Admins',
    'Support',
    'CEO']

  },
  {
    id: 'SRV-4',
    category: 'Knowledge / Content Requests',
    title: 'Update Playbook',
    desc: 'Request an update to an existing playbook or reference guide.',
    sla: '3+ business days',
    ownerType: 'Content Governance',
    inputs: ['Asset ID', 'Requested Changes', 'Rationale'],
    approval: 'required',
    risk: 'Normal',
    personas: ['Scrum Master', 'Team / Squad Lead', 'Unit Lead']
  },
  {
    id: 'SRV-5',
    category: 'Task / Workflow Support',
    title: 'Unblock Task',
    desc: 'Request intervention for a blocked task.',
    sla: '4 hours',
    ownerType: 'Scrum Master / Lead',
    inputs: ['Task ID', 'Blocker Description'],
    approval: 'none',
    risk: 'Urgent',
    personas: ['Associate']
  },
  {
    id: 'SRV-6',
    category: 'Admin Requests',
    title: 'Role Change Request',
    desc: "Request a change to a user's persona or unit assignment.",
    sla: '2 business days',
    ownerType: 'Platform Admin',
    inputs: ['User ID', 'New Role', 'Approval Evidence'],
    approval: 'required',
    risk: 'Normal',
    personas: ['Unit Lead', 'HRA', 'Admins']
  },
  {
    id: 'SRV-7',
    category: 'Approvals',
    title: 'Policy Exception',
    desc: 'Request an exception to a standard operating policy.',
    sla: '3+ business days',
    ownerType: 'Governance Board',
    inputs: ['Policy Name', 'Exception Details', 'Risk Assessment'],
    approval: 'required',
    risk: 'At risk',
    personas: ['Unit Lead', 'CEO']
  },
  {
    id: 'SRV-8',
    category: 'Escalations',
    title: 'SLA Breach Escalation',
    desc: 'Escalate a breached SLA for immediate attention.',
    sla: '4 hours',
    ownerType: 'Unit Lead',
    inputs: ['Record ID', 'Impact Assessment'],
    approval: 'none',
    risk: 'Urgent',
    personas: ['Scrum Master', 'Team / Squad Lead', 'Support']
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
  const filteredServices = services.filter((s) => {
    // Tab filter
    const matchesTab = activeTab === 'All' || s.category.includes(activeTab);
    // Search filter
    const matchesSearch =
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase()) ||
    s.ownerType.toLowerCase().includes(search.toLowerCase());
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
    !filterValues.owner?.length || filterValues.owner.includes(s.ownerType);
    const matchesRisk =
    !filterValues.risk?.length || filterValues.risk.includes(s.risk);
    const matchesPersona =
    !filterValues.persona?.length ||
    s.personas.some((p) => filterValues.persona.includes(p));
    // Recommended toggle
    const matchesRecommended =
    !recommendedActive || s.personas.includes(activePersona.role);
    return (
      matchesTab &&
      matchesSearch &&
      matchesCategory &&
      matchesSla &&
      matchesApproval &&
      matchesOwner &&
      matchesRisk &&
      matchesPersona &&
      matchesRecommended);

  });
  // Sort recommended to top if active
  if (recommendedActive) {
    filteredServices.sort((a, b) => {
      const aRec = a.personas.includes(activePersona.role);
      const bRec = b.personas.includes(activePersona.role);
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      return 0;
    });
  }
  const atRiskCount = requests.filter((r) => r.slaState === 'At Risk').length;
  const [actionItem, setActionItem] = useState<any | null>(null);
  const handleStartRequest = (e: React.MouseEvent, service: any) => {
    e.stopPropagation();
    setActionItem(service);
  };
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Service Catalogue
        </h1>
        <p className="text-text-secondary">
          Discover and submit requests for support, access, and governance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Available Categories" value="8" status="info" />
        <KpiTile label="Avg Routing Time" value="< 1d" status="success" />
        <KpiTile
          label="At-Risk Requests"
          value={atRiskCount.toString()}
          status="warning" />
        
        <KpiTile label="Closed This Week" value="18" status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col lg:flex-row gap-6">
        <MarketplaceFilterPanel
          title="Refine services"
          helperText="Filter this marketplace by role, status, owner, SLA, and relevance."
          searchPlaceholder="Search services, owners, SLAs, or request types"
          searchValue={search}
          onSearchChange={setSearch}
          groups={filterGroups}
          values={filterValues}
          onChange={handleFilterChange}
          recommendedActive={recommendedActive}
          onRecommendedChange={setRecommendedActive}
          totalCount={services.length}
          visibleCount={filteredServices.length}
          onClearAll={handleClearAll}
          persona={activePersona.role} />
        

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredServices.map((service) =>
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="flex flex-col bg-white rounded-card border border-border-default p-6 hover:shadow-md hover:border-border-strong transition-all cursor-pointer group">
              
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Briefcase size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-surface px-2 py-1 rounded">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-primary mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-text-secondary mb-6 flex-1">
                  {service.desc}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Clock size={14} />
                    <span>SLA: {service.sla}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Users size={14} />
                    <span>Routed to: {service.ownerType}</span>
                  </div>
                </div>

                <button
                onClick={(e) => handleStartRequest(e, service)}
                className="w-full py-2.5 bg-surface text-primary font-semibold text-sm rounded-button group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center gap-2">
                
                  Start Request
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {filteredServices.length === 0 &&
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
        </div>
      </div>

      {selectedService &&
      <DetailPanel
        entity={
        {
          id: selectedService.id,
          title: selectedService.title,
          category: selectedService.category,
          status: 'Draft',
          slaState: 'On Track',
          requesterUserId: 'USR-001',
          queueId: 'QUE-001',
          urgency: 'Medium',
          expectedOutcome: selectedService.desc,
          inputs: selectedService.inputs,
          sla: selectedService.sla,
          ownerType: selectedService.ownerType
        } as any
        }
        type="request"
        onClose={() => setSelectedService(null)} />

      }

      <MarketplaceActionRouter
        marketplaceType={actionItem ? 'service' : null}
        item={actionItem}
        activePersona={activePersona}
        onClose={() => setActionItem(null)} />
      
    </div>);

}