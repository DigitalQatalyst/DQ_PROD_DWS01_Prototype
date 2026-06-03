import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { MessageSquare, Send } from 'lucide-react';
import { FilterBar } from '../components/FilterBar';
import {
  MarketplaceTopFilterBar,
} from '../components/MarketplaceTopFilterBar';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { usePersona } from '../context/PersonaContext';
import { MarketplaceActionRouter } from '../components/MarketplaceActionRouter';
import { getMarketplaceCategoryLabel } from '../utils/marketplaceBreadcrumbs';
export function MarketplaceFeedbackPage() {
  const [searchParams] = useSearchParams();
  const { activePersona } = usePersona();
  const breadcrumbCategory = searchParams.get('from')
    ? `${getMarketplaceCategoryLabel(searchParams.get('from'), 'drive')} / `
    : '';
  const [activeTab, setActiveTab] = useState('All Feedback');
  const [search, setSearch] = useState('');
  // Form state
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [urgency, setUrgency] = useState('Low');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Filter state
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const tabs = ['All Feedback', 'My Feedback', 'Resolved'];
  const filterGroups: FilterGroup[] = [
  {
    id: 'type',
    label: 'Feedback Type',
    options: [
    {
      value: 'Unclear Service',
      label: 'Unclear Service'
    },
    {
      value: 'Missing Template',
      label: 'Missing Template'
    },
    {
      value: 'Outdated Knowledge',
      label: 'Outdated Knowledge'
    },
    {
      value: 'Incorrect Owner',
      label: 'Incorrect Owner'
    },
    {
      value: 'Broken Navigation',
      label: 'Broken Navigation'
    }]

  },
  {
    id: 'status',
    label: 'Status',
    options: [
    {
      value: 'New',
      label: 'New'
    },
    {
      value: 'Routed',
      label: 'Routed'
    },
    {
      value: 'Under Review',
      label: 'Under Review'
    },
    {
      value: 'Resolved',
      label: 'Resolved'
    },
    {
      value: 'Closed',
      label: 'Closed'
    }]

  },
  {
    id: 'urgency',
    label: 'Urgency',
    options: [
    {
      value: 'Low',
      label: 'Low'
    },
    {
      value: 'Medium',
      label: 'Medium'
    },
    {
      value: 'High',
      label: 'High'
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
      value: 'HRA Fulfilment Queue',
      label: 'HRA Fulfilment Queue'
    },
    {
      value: 'Central Support Queue',
      label: 'Central Support Queue'
    },
    {
      value: 'Platform Support',
      label: 'Platform Support'
    },
    {
      value: 'Platform Governance Admin',
      label: 'Platform Governance Admin'
    }]

  },
  {
    id: 'affected',
    label: 'Affected Marketplace',
    options: [
    {
      value: 'Services',
      label: 'Services'
    },
    {
      value: 'Task Templates',
      label: 'Task Templates'
    },
    {
      value: 'Knowledge',
      label: 'Knowledge'
    },
    {
      value: 'Work Directory',
      label: 'Work Directory'
    },
    {
      value: 'Analytics',
      label: 'Analytics'
    }]

  },
  {
    id: 'submittedBy',
    label: 'Submitted By',
    options: [
    {
      value: 'My feedback',
      label: 'My feedback'
    },
    {
      value: 'My team',
      label: 'My team'
    },
    {
      value: 'All visible feedback',
      label: 'All visible feedback'
    }]

  }];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!category) newErrors.category = 'Category is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    toast.success('Marketplace feedback captured in prototype mode');
    setCategory('');
    setArea('');
    setDescription('');
    setSuggestion('');
    setUrgency('Low');
    setErrors({});
  };
  const recentFeedback = [
  {
    id: 'FB-101',
    category: 'Missing Template',
    area: 'Task Templates',
    status: 'Under Review',
    date: '2026-05-12'
  },
  {
    id: 'FB-102',
    category: 'Unclear Service',
    area: 'IT & Access',
    status: 'Closed',
    date: '2026-05-10'
  },
  {
    id: 'FB-103',
    category: 'Outdated Knowledge',
    area: 'Playbooks',
    status: 'Routed',
    date: '2026-05-09'
  },
  {
    id: 'FB-104',
    category: 'Incorrect Owner',
    area: 'Work Directory',
    status: 'Closed',
    date: '2026-05-05'
  },
  {
    id: 'FB-105',
    category: 'Broken Navigation',
    area: 'Analytics',
    status: 'Under Review',
    date: '2026-05-01'
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
  };
  const filteredFeedback = recentFeedback.filter((fb) => {
    const matchesTab =
    activeTab === 'All Feedback' ||
    activeTab === 'Resolved' && (
    fb.status === 'Resolved' || fb.status === 'Closed');
    const matchesSearch =
    fb.id.toLowerCase().includes(search.toLowerCase()) ||
    fb.category.toLowerCase().includes(search.toLowerCase()) ||
    fb.area.toLowerCase().includes(search.toLowerCase());
    const matchesType =
    !filterValues.type?.length || filterValues.type.includes(fb.category);
    const matchesStatus =
    !filterValues.status?.length || filterValues.status.includes(fb.status);
    return matchesTab && matchesSearch && matchesType && matchesStatus;
  });
  const columns = [
  {
    header: 'ID',
    accessor: (row: any) =>
    <span className="font-mono text-xs">{row.id}</span>

  },
  {
    header: 'Category',
    accessor: (row: any) =>
    <span className="font-medium">{row.category}</span>

  },
  {
    header: 'Area',
    accessor: (row: any) => row.area
  },
  {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  },
  {
    header: 'Date',
    accessor: (row: any) => row.date
  }];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Marketplace / {breadcrumbCategory}Marketplace Feedback</div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Marketplace Feedback
        </h1>
        <p className="text-text-secondary">
          Flag unclear services, missing templates, outdated knowledge,
          incorrect owners, or broken navigation.
        </p>
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4 mb-6">
        <MarketplaceTopFilterBar
          searchPlaceholder="Search feedback, affected items, owners, or statuses"
          searchValue={search}
          onSearchChange={setSearch}
          groups={filterGroups}
          values={filterValues}
          onChange={handleFilterChange}
          onClearAll={handleClearAll}
        />
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">
                Submit Feedback
              </h2>
              <p className="text-sm text-text-secondary">
                Open the feedback flow to route your suggestions to the
                correct owner.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFlowOpen(true)}
            className="w-full md:w-auto px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-button hover:bg-navy-800 transition-colors flex items-center justify-center gap-2">
            
            Start Feedback Flow
            <Send size={16} />
          </button>
        </div>

        <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle">
            <h2 className="text-lg font-semibold text-primary">
              Feedback Records
            </h2>
          </div>
          {filteredFeedback.length > 0 ?
          <div className="p-6">
              <DataTable columns={columns} rows={filteredFeedback} />
            </div> :

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
      </div>

      <MarketplaceActionRouter
        marketplaceType={isFlowOpen ? 'feedback' : null}
        item={null}
        activePersona={activePersona}
        onClose={() => setIsFlowOpen(false)} />
      
    </div>);

}
