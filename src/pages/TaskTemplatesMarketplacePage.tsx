import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { MarketplaceTopFilterBar } from '../components/MarketplaceTopFilterBar';
import { useTaskLifecycle } from '../context/TaskLifecycleContext';
import { TemplateCard } from '../components/TemplateCard';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { usePersona } from '../context/PersonaContext';
import { Briefcase } from 'lucide-react';
import { getMarketplaceCategoryLabel } from '../utils/marketplaceBreadcrumbs';

export function TaskTemplatesMarketplacePage() {
  const [searchParams] = useSearchParams();
  const { activePersona } = usePersona();
  const { templates, isLoading } = useTaskLifecycle();
  const breadcrumbCategory = getMarketplaceCategoryLabel(searchParams.get('from'), 'design');
  
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);

  const tabs = [
    'All',
    'Personal Work',
    'Team Delivery',
    'Review',
    'Governance',
    'Closure Quality'
  ];

  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Template Type',
      options: [
        { value: 'Execution', label: 'Execution' },
        { value: 'Review', label: 'Review' },
        { value: 'Governance', label: 'Governance' },
        { value: 'Support', label: 'Support' },
        { value: 'HRA', label: 'HRA' },
        { value: 'Knowledge', label: 'Knowledge' },
        { value: 'Closure', label: 'Closure' }
      ]
    },
    {
      id: 'evidence',
      label: 'Evidence Requirement',
      options: [
        { value: 'required', label: 'Evidence required' },
        { value: 'optional', label: 'Evidence optional' }
      ]
    },
    {
      id: 'checklist',
      label: 'Checklist Depth',
      options: [
        { value: 'Light', label: 'Light checklist' },
        { value: 'Standard', label: 'Standard checklist' },
        { value: 'Detailed', label: 'Detailed checklist' }
      ]
    },
    {
      id: 'approval',
      label: 'Approval Path',
      options: [
        { value: 'Approval required', label: 'Approval required' },
        { value: 'Review only', label: 'Review only' },
        { value: 'No review', label: 'No review' }
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

  const filteredTemplates = templates.filter(t => {
    const matchesTab = activeTab === 'All' || t.category === activeTab;
    
    const matchesSearch = search === '' || 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = !filterValues.type?.length || filterValues.type.includes(t.type);
    
    const matchesEvidence = !filterValues.evidence?.length || 
      filterValues.evidence.includes(t.evidenceRequired ? 'required' : 'optional');
      
    const matchesChecklist = !filterValues.checklist?.length || 
      filterValues.checklist.includes(t.checklistDepth || 'Standard');

    const matchesApproval = !filterValues.approval?.length || 
      filterValues.approval.includes(t.reviewPath);

    const matchesRecommended = !recommendedActive || t.personas.includes(activePersona.role.toLowerCase().replace(/ /g, '-'));

    return matchesTab && matchesSearch && matchesType && matchesEvidence && matchesChecklist && matchesApproval && matchesRecommended;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Marketplace / {breadcrumbCategory} / Task Library</div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-primary">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase size={24} />
            </div>
            Task Template Catalogue
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Select governed task templates with predefined criteria, evidence rules, and workflows.
          </p>
        </div>
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <MarketplaceTopFilterBar
          searchPlaceholder="Search templates, checklist rules, evidence, or closure criteria"
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
          Loading templates...
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface py-16 text-center">
          <Briefcase size={48} className="mb-4 text-text-muted opacity-50" />
          <h3 className="mb-2 text-lg font-bold text-text-primary">No templates found</h3>
          <p className="mb-6 max-w-md text-sm text-text-secondary">
            We couldn't find any task templates matching your current filters.
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
