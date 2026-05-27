import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { getKnowledgeAssets } from '../services/platform.service';
import type { KnowledgeAsset } from '../types/platform';
import {
  MarketplaceTopFilterBar,
} from '../components/MarketplaceTopFilterBar';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { usePersona } from '../context/PersonaContext';
import { MarketplaceActionRouter } from '../components/MarketplaceActionRouter';
import { RequestIntakeWizard } from '../components/RequestIntakeWizard';
import { TaskFromTemplateWizard } from '../components/TaskFromTemplateWizard';
export function KnowledgeMarketplacePage() {
  const { activePersona } = usePersona();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<KnowledgeAsset | null>(
    null
  );
  // Filter state
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);
  const tabs = [
  'All',
  'GHC',
  '6xD',
  'Playbooks',
  'Templates',
  'Learning',
  'Workspace Guides'];

  const filterGroups: FilterGroup[] = [
  {
    id: 'type',
    label: 'Knowledge Type',
    options: [
    {
      value: 'GHC Reference',
      label: 'GHC'
    },
    {
      value: '6xD Reference',
      label: '6xD'
    },
    {
      value: 'Policy',
      label: 'Policies'
    },
    {
      value: 'Playbook',
      label: 'Playbooks'
    },
    {
      value: 'Template',
      label: 'Templates'
    },
    {
      value: 'Learning',
      label: 'Learning'
    },
    {
      value: 'Workspace Guide',
      label: 'Workspace Guides'
    },
    {
      value: 'Execution Standard',
      label: 'Execution Standards'
    }]

  },
  {
    id: 'status',
    label: 'Review Status',
    options: [
    {
      value: 'Effective',
      label: 'Effective'
    },
    {
      value: 'Under Review',
      label: 'Under Review'
    },
    {
      value: 'Needs Update',
      label: 'Needs Update'
    }]

  },
  {
    id: 'context',
    label: 'Usage Context',
    options: [
    {
      value: 'Tasks',
      label: 'Tasks'
    },
    {
      value: 'Requests',
      label: 'Requests'
    },
    {
      value: 'Approvals',
      label: 'Approvals'
    },
    {
      value: 'Onboarding',
      label: 'Onboarding'
    },
    {
      value: 'Support',
      label: 'Support'
    },
    {
      value: 'Governance',
      label: 'Governance'
    }]

  },
  {
    id: 'readTime',
    label: 'Read Time',
    options: [
    {
      value: 'Under 5 min',
      label: 'Under 5 min'
    },
    {
      value: '5–10 min',
      label: '5–10 min'
    },
    {
      value: '10+ min',
      label: '10+ min'
    }]

  },
  {
    id: 'owner',
    label: 'Owner',
    options: [
    {
      value: 'Knowledge Content Owner',
      label: 'Knowledge Content Owner'
    },
    {
      value: 'HRA',
      label: 'HRA'
    },
    {
      value: 'Platform Governance',
      label: 'Platform Governance'
    },
    {
      value: 'Support Operations',
      label: 'Support Operations'
    },
    {
      value: 'Task Model Owner',
      label: 'Task Model Owner'
    }]

  },
  {
    id: 'feedback',
    label: 'Feedback',
    options: [
    {
      value: 'Recently flagged',
      label: 'Recently flagged'
    },
    {
      value: 'Frequently used',
      label: 'Frequently used'
    },
    {
      value: 'Recommended for role',
      label: 'Recommended for role'
    }]

  }];

  useEffect(() => {
    getKnowledgeAssets().then(setAssets);
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
    setRecommendedActive(false);
  };
  const filteredAssets = assets.filter((a) => {
    const matchesTab =
    activeTab === 'All' ||
    a.type.includes(activeTab) ||
    activeTab === 'GHC' && a.type === 'GHC Reference' ||
    activeTab === '6xD' && a.type === '6xD Reference';
    const matchesSearch =
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesType =
    !filterValues.type?.length || filterValues.type.includes(a.type);
    const matchesStatus =
    !filterValues.status?.length || filterValues.status.includes(a.status);
    // Mocking context/readTime/owner/feedback matching since they aren't fully in the mock data
    const matchesContext = !filterValues.context?.length || true;
    const matchesReadTime = !filterValues.readTime?.length || true;
    const matchesOwner = !filterValues.owner?.length || true;
    const matchesFeedback = !filterValues.feedback?.length || true;
    // Mock recommended logic
    const matchesRecommended = !recommendedActive || true;
    return (
      matchesTab &&
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesContext &&
      matchesReadTime &&
      matchesOwner &&
      matchesFeedback &&
      matchesRecommended);

  });
  const effectiveCount = assets.filter((a) => a.status === 'Effective').length;
  const reviewCount = assets.filter((a) => a.status === 'Under Review').length;
  const linkedCount = assets.filter((a) => a.linkedTaskIds.length > 0).length;
  const [actionItem, setActionItem] = useState<KnowledgeAsset | null>(null);
  const [nestedAction, setNestedAction] = useState<{
    type: 'task' | 'request';
    guide: any;
  } | null>(null);
  const handleOpenAction = (e: React.MouseEvent, row: KnowledgeAsset) => {
    e.stopPropagation();
    setActionItem(row);
  };
  const columns = [
  {
    header: 'ID',
    accessor: (row: KnowledgeAsset) => <MonoId value={row.id} />
  },
  {
    header: 'Title',
    accessor: (row: KnowledgeAsset) =>
    <span className="font-medium">{row.title}</span>

  },
  {
    header: 'Type',
    accessor: (row: KnowledgeAsset) =>
    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-surface px-2 py-1 rounded">
          {row.type}
        </span>

  },
  {
    header: 'Status',
    accessor: (row: KnowledgeAsset) => <StatusPill status={row.status} />
  },
  {
    header: 'Tags',
    accessor: (row: KnowledgeAsset) =>
    <div className="flex flex-wrap gap-1">
          {row.tags.map((tag) =>
      <span
        key={tag}
        className="text-[10px] bg-navy-50 text-primary px-1.5 py-0.5 rounded border border-border-subtle">
        
              {tag}
            </span>
      )}
        </div>

  },
  {
    header: 'Linked Tasks',
    accessor: (row: KnowledgeAsset) =>
    <span className="text-sm text-text-muted">
          {row.linkedTaskIds.length}
        </span>

  },
  {
    header: 'Action',
    accessor: (row: KnowledgeAsset) =>
    <button
      onClick={(e) => handleOpenAction(e, row)}
      className="text-secondary hover:underline text-sm font-medium">
      
          Open
        </button>

  }];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Knowledge Discovery
        </h1>
        <p className="text-text-secondary">
          Find references, playbooks, and guides to support your work.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile
          label="Knowledge Assets"
          value={assets.length.toString()}
          status="info" />
        
        <KpiTile
          label="Effective References"
          value={effectiveCount.toString()}
          status="success" />
        
        <KpiTile
          label="Under Review"
          value={reviewCount.toString()}
          status="warning" />
        
        <KpiTile
          label="Linked to Work"
          value={linkedCount.toString()}
          status="success" />
        
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <MarketplaceTopFilterBar
          searchPlaceholder="Search GHC, 6xD, playbooks, templates, or guides"
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

      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        {filteredAssets.length > 0 ?
        <DataTable
          columns={columns}
          rows={filteredAssets}
          onRowClick={setSelectedAsset} /> :


        <div className="text-center py-16">
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

      {selectedAsset &&
      <DetailPanel
        entity={selectedAsset}
        type="knowledge"
        onClose={() => setSelectedAsset(null)} />

      }

      <MarketplaceActionRouter
        marketplaceType={actionItem ? 'knowledge' : null}
        item={actionItem}
        activePersona={activePersona}
        onClose={() => setActionItem(null)}
        onStartTaskFromGuide={(guide) => {
          setActionItem(null);
          setNestedAction({
            type: 'task',
            guide
          });
        }}
        onRequestUpdate={(guide) => {
          setActionItem(null);
          setNestedAction({
            type: 'request',
            guide
          });
        }} />
      

      {nestedAction?.type === 'task' &&
      <TaskFromTemplateWizard
        template={{
          title: 'Knowledge Implementation Task',
          category: 'Execution',
          checklist: 3,
          evidence: true
        }}
        activePersona={activePersona}
        onClose={() => setNestedAction(null)}
        preLinkedKnowledge={nestedAction.guide} />

      }

      {nestedAction?.type === 'request' &&
      <RequestIntakeWizard
        service={{
          title: 'Update Playbook',
          category: 'Knowledge / Content Requests',
          ownerType: 'Content Governance'
        }}
        activePersona={activePersona}
        onClose={() => setNestedAction(null)}
        preFilledContext={{
          affectedGuide: nestedAction.guide.title
        }} />

      }
    </div>);

}