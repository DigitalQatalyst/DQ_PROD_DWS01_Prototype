import React, { useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { FileText, CheckSquare, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { DetailPanel } from '../components/DetailPanel';
import {
  MarketplaceTopFilterBar,
} from '../components/MarketplaceTopFilterBar';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { usePersona } from '../context/PersonaContext';
import { MarketplaceActionRouter } from '../components/MarketplaceActionRouter';
export function TaskTemplatesMarketplacePage() {
  const { activePersona } = usePersona();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  // Filter state
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);
  const tabs = [
  'All',
  'Personal Work',
  'Team Delivery',
  'Review',
  'Governance',
  'Closure Quality'];

  const filterGroups: FilterGroup[] = [
  {
    id: 'type',
    label: 'Template Type',
    options: [
    {
      value: 'Execution',
      label: 'Execution'
    },
    {
      value: 'Review',
      label: 'Review'
    },
    {
      value: 'Governance',
      label: 'Governance'
    },
    {
      value: 'Support',
      label: 'Support'
    },
    {
      value: 'HRA',
      label: 'HRA'
    },
    {
      value: 'Knowledge',
      label: 'Knowledge'
    },
    {
      value: 'Closure',
      label: 'Closure'
    }]

  },
  {
    id: 'evidence',
    label: 'Evidence Requirement',
    options: [
    {
      value: 'required',
      label: 'Evidence required'
    },
    {
      value: 'optional',
      label: 'Evidence optional'
    }]

  },
  {
    id: 'checklist',
    label: 'Checklist Depth',
    options: [
    {
      value: 'Light',
      label: 'Light checklist'
    },
    {
      value: 'Standard',
      label: 'Standard checklist'
    },
    {
      value: 'Detailed',
      label: 'Detailed checklist'
    }]

  },
  {
    id: 'sla',
    label: 'Default SLA',
    options: [
    {
      value: 'Same day',
      label: 'Same day'
    },
    {
      value: '1–2 business days',
      label: '1–2 business days'
    },
    {
      value: '3–5 business days',
      label: '3–5 business days'
    },
    {
      value: '5+ business days',
      label: '5+ business days'
    }]

  },
  {
    id: 'approval',
    label: 'Approval Path',
    options: [
    {
      value: 'Approval required',
      label: 'Approval required'
    },
    {
      value: 'Review only',
      label: 'Review only'
    },
    {
      value: 'No approval',
      label: 'No approval'
    }]

  },
  {
    id: 'bestFor',
    label: 'Best For',
    options: [
    {
      value: 'Personal execution',
      label: 'Personal execution'
    },
    {
      value: 'Team execution',
      label: 'Team execution'
    },
    {
      value: 'Governance review',
      label: 'Governance review'
    },
    {
      value: 'Support resolution',
      label: 'Support resolution'
    },
    {
      value: 'Onboarding',
      label: 'Onboarding'
    }]

  }];

  const templates = [
  {
    id: 'TPL-1',
    category: 'Team Delivery',
    title: 'Structured Delivery Task',
    desc: 'Standard task for feature delivery or technical implementation.',
    required: ['Purpose', 'Expected Output', 'Due Date'],
    checklist: 5,
    evidence: true,
    closure: 'Peer Review',
    type: 'Execution',
    checklistDepth: 'Standard',
    sla: '3–5 business days',
    approval: 'Review only',
    bestFor: 'Team execution',
    personas: ['Associate', 'Scrum Master', 'Team / Squad Lead']
  },
  {
    id: 'TPL-2',
    category: 'Review',
    title: 'Review & Approval Task',
    desc: "Task dedicated to reviewing another team member's work.",
    required: ['Linked Task', 'Review Criteria'],
    checklist: 3,
    evidence: true,
    closure: 'Approval Decision',
    type: 'Review',
    checklistDepth: 'Light',
    sla: '1–2 business days',
    approval: 'Approval required',
    bestFor: 'Team execution',
    personas: ['Scrum Master', 'Team / Squad Lead', 'Unit Lead']
  },
  {
    id: 'TPL-3',
    category: 'Governance',
    title: 'Governance Follow-up',
    desc: 'Address an identified governance exception or audit finding.',
    required: ['Audit ID', 'Remediation Plan'],
    checklist: 4,
    evidence: true,
    closure: 'Admin Sign-off',
    type: 'Governance',
    checklistDepth: 'Standard',
    sla: '5+ business days',
    approval: 'Approval required',
    bestFor: 'Governance review',
    personas: ['Unit Lead', 'Admins', 'CEO']
  },
  {
    id: 'TPL-4',
    category: 'Closure Quality',
    title: 'Closure Quality Review',
    desc: 'Formal review of task outputs against closure criteria.',
    required: ['Task ID', 'Quality Matrix'],
    checklist: 6,
    evidence: false,
    closure: 'Quality Score',
    type: 'Closure',
    checklistDepth: 'Detailed',
    sla: '1–2 business days',
    approval: 'Review only',
    bestFor: 'Governance review',
    personas: ['Scrum Master', 'Team / Squad Lead', 'Unit Lead']
  },
  {
    id: 'TPL-5',
    category: 'Team Delivery',
    title: 'Working Session Action',
    desc: 'Action item captured during a working session.',
    required: ['Session ID', 'Action Description'],
    checklist: 2,
    evidence: false,
    closure: 'Self-certify',
    type: 'Execution',
    checklistDepth: 'Light',
    sla: 'Same day',
    approval: 'No approval',
    bestFor: 'Team execution',
    personas: ['Associate', 'Scrum Master']
  },
  {
    id: 'TPL-6',
    category: 'Personal Work',
    title: 'Onboarding Task',
    desc: 'Complete a required onboarding step or training module.',
    required: ['Module Name', 'Completion Date'],
    checklist: 1,
    evidence: true,
    closure: 'Certificate Attached',
    type: 'HRA',
    checklistDepth: 'Light',
    sla: '1–2 business days',
    approval: 'No approval',
    bestFor: 'Onboarding',
    personas: ['Associate', 'HRA']
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
  const filteredTemplates = templates.filter((t) => {
    const matchesTab = activeTab === 'All' || t.category === activeTab;
    const matchesSearch =
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase());
    const matchesType =
    !filterValues.type?.length || filterValues.type.includes(t.type);
    const matchesEvidence =
    !filterValues.evidence?.length ||
    filterValues.evidence.includes(t.evidence ? 'required' : 'optional');
    const matchesChecklist =
    !filterValues.checklist?.length ||
    filterValues.checklist.includes(t.checklistDepth);
    const matchesSla =
    !filterValues.sla?.length || filterValues.sla.includes(t.sla);
    const matchesApproval =
    !filterValues.approval?.length ||
    filterValues.approval.includes(t.approval);
    const matchesBestFor =
    !filterValues.bestFor?.length || filterValues.bestFor.includes(t.bestFor);
    const matchesRecommended =
    !recommendedActive || t.personas.includes(activePersona.role);
    return (
      matchesTab &&
      matchesSearch &&
      matchesType &&
      matchesEvidence &&
      matchesChecklist &&
      matchesSla &&
      matchesApproval &&
      matchesBestFor &&
      matchesRecommended);

  });
  if (recommendedActive) {
    filteredTemplates.sort((a, b) => {
      const aRec = a.personas.includes(activePersona.role);
      const bRec = b.personas.includes(activePersona.role);
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      return 0;
    });
  }
  const [actionItem, setActionItem] = useState<any | null>(null);
  const handleUseTemplate = (e: React.MouseEvent, template: any) => {
    e.stopPropagation();
    setActionItem(template);
  };
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Task Template Catalogue
        </h1>
        <p className="text-text-secondary">
          Select governed task templates with predefined criteria and workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Total Templates" value="12" status="info" />
        <KpiTile label="P0 Task Templates" value="5" status="warning" />
        <KpiTile label="With Evidence Rules" value="9" status="success" />
        <KpiTile
          label="Closure Criteria Coverage"
          value="82%"
          status="success" />
        
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) =>
        <div
          key={template.id}
          onClick={() => setSelectedTemplate(template)}
          className="flex flex-col bg-white rounded-card border border-border-default p-6 hover:shadow-md hover:border-border-strong transition-all cursor-pointer group">
          
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <FileText size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-surface px-2 py-1 rounded">
                {template.category}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-primary mb-2">
              {template.title}
            </h3>
            <p className="text-sm text-text-secondary mb-6 flex-1">
              {template.desc}
            </p>

            <div className="space-y-2 mb-6 p-3 bg-surface rounded border border-border-subtle">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted flex items-center gap-1">
                  <CheckSquare size={12} /> Checklist Items
                </span>
                <span className="font-medium text-primary">
                  {template.checklist}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted flex items-center gap-1">
                  <Shield size={12} /> Evidence Required
                </span>
                <span className="font-medium text-primary">
                  {template.evidence ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <button
            onClick={(e) => handleUseTemplate(e, template)}
            className="w-full py-2.5 bg-surface text-primary font-semibold text-sm rounded-button group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center gap-2">
            
              Use Template
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {filteredTemplates.length === 0 &&
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

      {selectedTemplate &&
      <DetailPanel
        entity={
        {
          id: selectedTemplate.id,
          title: selectedTemplate.title,
          purpose: selectedTemplate.desc,
          status: 'Draft',
          priority: 'Medium',
          slaState: 'On Track',
          ownerUserId: 'USR-001',
          teamId: 'TM-001',
          dueDate: 'Not set',
          expectedOutput: `Output conforming to ${selectedTemplate.closure}`,
          checklistDone: 0,
          checklistTotal: selectedTemplate.checklist,
          evidenceState: selectedTemplate.evidence ? 'Missing' : 'Accepted',
          knowledgeIds: []
        } as any
        }
        type="task"
        onClose={() => setSelectedTemplate(null)} />

      }

      <MarketplaceActionRouter
        marketplaceType={actionItem ? 'task-template' : null}
        item={actionItem}
        activePersona={activePersona}
        onClose={() => setActionItem(null)} />
      
    </div>);

}