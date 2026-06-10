import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTaskLifecycle } from '../context/TaskLifecycleContext';
import { TemplateCard } from '../components/TemplateCard';
import { MarketplaceCatalogLayout } from '../components/marketplace/MarketplaceCatalogLayout';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { usePersona } from '../context/PersonaContext';
import { getMarketplaceCategoryLabel } from '../utils/marketplaceBreadcrumbs';
import {
  ALL_TAB_ID,
  buildCatalogTabs,
} from '../utils/marketplaceCatalogTabs';

const TEMPLATE_CATEGORIES = [
  { id: 'Personal Work', label: 'Personal Work' },
  { id: 'Team Delivery', label: 'Team Delivery' },
  { id: 'Review', label: 'Review' },
  { id: 'Governance', label: 'Governance' },
  { id: 'Closure Quality', label: 'Closure Quality' },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Personal Work': 'Individual execution templates with checklist and evidence rules.',
  'Team Delivery': 'Squad-level delivery patterns with shared ownership and SLA.',
  Review: 'Structured review templates with approval or sign-off paths.',
  Governance: 'Governance-sensitive templates with elevated controls.',
  'Closure Quality': 'Closure and quality assurance templates with evidence gates.',
};

export function TaskTemplatesMarketplacePage() {
  const [searchParams] = useSearchParams();
  const { activePersona } = usePersona();
  const { templates, isLoading } = useTaskLifecycle();
  const breadcrumbCategory = getMarketplaceCategoryLabel(
    searchParams.get('from'),
    'design',
  );

  const [activeTab, setActiveTab] = useState(ALL_TAB_ID);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);

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
        { value: 'Closure', label: 'Closure' },
      ],
    },
    {
      id: 'evidence',
      label: 'Evidence Requirement',
      options: [
        { value: 'required', label: 'Evidence required' },
        { value: 'optional', label: 'Evidence optional' },
      ],
    },
    {
      id: 'checklist',
      label: 'Checklist Depth',
      options: [
        { value: 'Light', label: 'Light checklist' },
        { value: 'Standard', label: 'Standard checklist' },
        { value: 'Detailed', label: 'Detailed checklist' },
      ],
    },
    {
      id: 'approval',
      label: 'Approval Path',
      options: [
        { value: 'Approval required', label: 'Approval required' },
        { value: 'Review only', label: 'Review only' },
        { value: 'No review', label: 'No review' },
      ],
    },
  ];

  const categoryTabs = useMemo(
    () =>
      buildCatalogTabs(templates, TEMPLATE_CATEGORIES, (template) => template.category),
    [templates],
  );

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch('');
    setRecommendedActive(false);
    setActiveTab(ALL_TAB_ID);
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesTab =
      activeTab === ALL_TAB_ID || template.category === activeTab;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      template.title.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.id.toLowerCase().includes(query);
    const matchesType =
      !filterValues.type?.length || filterValues.type.includes(template.type);
    const matchesEvidence =
      !filterValues.evidence?.length ||
      filterValues.evidence.includes(
        template.evidenceRequired ? 'required' : 'optional',
      );
    const matchesChecklist =
      !filterValues.checklist?.length ||
      filterValues.checklist.includes(template.checklistDepth || 'Standard');
    const matchesApproval =
      !filterValues.approval?.length ||
      filterValues.approval.includes(template.reviewPath);
    const matchesRecommended =
      !recommendedActive ||
      template.personas.includes(
        activePersona.role.toLowerCase().replace(/ /g, '-'),
      );
    return (
      matchesTab &&
      matchesSearch &&
      matchesType &&
      matchesEvidence &&
      matchesChecklist &&
      matchesApproval &&
      matchesRecommended
    );
  });

  return (
    <MarketplaceCatalogLayout
      eyebrow={`DWS.01 / ${breadcrumbCategory} / Task Library`}
      title="Governed discovery for task templates and reusable work patterns."
      lede="Organised through the DWS task taxonomy — execution, review, governance, and closure templates with checklist depth, evidence rules, and approval paths."
      searchPlaceholder="Search templates, checklist rules, evidence, or closure criteria…"
      search={search}
      onSearchChange={setSearch}
      itemLabel="templates"
      totalCount={templates.length}
      visibleCount={filteredTemplates.length}
      tabs={categoryTabs}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      toneStrip={
        activeTab !== ALL_TAB_ID && CATEGORY_DESCRIPTIONS[activeTab]
          ? { code: activeTab, description: CATEGORY_DESCRIPTIONS[activeTab] }
          : null
      }
      filterHelperText="Refine by template type, evidence requirement, checklist depth, and approval path."
      filterGroups={filterGroups}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      onClearAll={handleClearAll}
      recommendedActive={recommendedActive}
      onRecommendedChange={setRecommendedActive}
      isLoading={isLoading}
      loadingMessage="Loading templates…"
      showEmpty={!isLoading && filteredTemplates.length === 0}
      emptyTitle="No templates match your filters"
      emptyMessage="Try adjusting your search or filters, or clear all filters to see all available templates."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </MarketplaceCatalogLayout>
  );
}
