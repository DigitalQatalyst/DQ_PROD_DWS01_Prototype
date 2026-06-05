import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRequestsConsole } from '../../context/RequestsConsoleContext';

type ConfigTab = 'Categories' | 'Owner Mapping' | 'SLA Rules' | 'Routing Rules' | 'Closure Criteria';

const TABS: ConfigTab[] = ['Categories', 'Owner Mapping', 'SLA Rules', 'Routing Rules', 'Closure Criteria'];

export function RequestConfigReferencePage() {
  const { state } = useRequestsConsole();
  const [activeTab, setActiveTab] = useState<ConfigTab>('Categories');
  const [search, setSearch] = useState('');

  const categories = state.categories;
  const ownerQueues = state.ownerQueues;
  const configRefs = state.configReferences;

  const filterBySearch = (items: { [key: string]: unknown }[], keys: string[]): typeof items => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) =>
      keys.some((k) => String(item[k] ?? '').toLowerCase().includes(q))
    );
  };

  const filteredCategories = filterBySearch(categories as unknown as { [key: string]: unknown }[], ['category', 'defaultQueue', 'defaultSla', 'ownerRole']);
  const filteredOwnerQueues = filterBySearch(ownerQueues as unknown as { [key: string]: unknown }[], ['queueName', 'owner']);
  const filteredSlaRules = filterBySearch(configRefs.filter((c) => c.ruleType === 'SLA Rule') as unknown as { [key: string]: unknown }[], ['name']);
  const filteredRoutingRules = filterBySearch(configRefs.filter((c) => c.ruleType === 'Category Mapping' || c.ruleType === 'Owner Mapping' || c.ruleType === 'Handoff Rule') as unknown as { [key: string]: unknown }[], ['name']);
  const filteredClosureRules = filterBySearch(configRefs.filter((c) => c.ruleType === 'Closure Rule' || c.ruleType === 'Escalation Rule') as unknown as { [key: string]: unknown }[], ['name']);

  return (
    <div className="bg-[#F6F6FB] min-h-full pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Stage 03</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">Request Configuration Reference</h1>
          <p className="text-sm text-text-secondary max-w-2xl">
            Read-only reference for categories, owner mappings, SLA rules, routing rules, and closure criteria.
          </p>
        </header>

        <div className="bg-white rounded-card border border-border-default mb-6">
          <div className="flex items-center border-b border-border-default">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-text-muted hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 border-b border-border-subtle">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search configuration..."
                className="w-full pl-9 pr-3 py-2 rounded-button border border-border-strong bg-white text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'Categories' && (
              <div className="space-y-3">
                {filteredCategories.map((c) => (
                  <div key={String(c.id)} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 ring-1 ring-border-subtle">
                    <div>
                      <p className="text-sm font-semibold text-primary">{String(c.category)}</p>
                      <p className="text-xs text-text-muted">{String(c.id)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-secondary">{String(c.defaultQueue)}</p>
                      <p className="text-xs text-text-muted">SLA: {String(c.defaultSla)} · {String(c.ownerRole)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Owner Mapping' && (
              <div className="space-y-3">
                {filteredOwnerQueues.map((q) => (
                  <div key={String(q.id)} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 ring-1 ring-border-subtle">
                    <div>
                      <p className="text-sm font-semibold text-primary">{String(q.queueName)}</p>
                      <p className="text-xs text-text-muted">{String(q.id)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-secondary">{String(q.owner)}</p>
                      <p className="text-xs text-text-muted">{String(q.activeItems)} active items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'SLA Rules' && (
              <div className="space-y-3">
                {filteredSlaRules.map((c) => (
                  <div key={String(c.id)} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 ring-1 ring-border-subtle">
                    <div>
                      <p className="text-sm font-semibold text-primary">{String(c.name)}</p>
                      <p className="text-xs text-text-muted">{String(c.id)}</p>
                    </div>
                    <span className="text-xs font-bold text-success bg-success-surface px-2.5 py-0.5 rounded-full">{String(c.status)}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Routing Rules' && (
              <div className="space-y-3">
                {filteredRoutingRules.map((c) => (
                  <div key={String(c.id)} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 ring-1 ring-border-subtle">
                    <div>
                      <p className="text-sm font-semibold text-primary">{String(c.name)}</p>
                      <p className="text-xs text-text-muted">{String(c.id)} · {String(c.ruleType)}</p>
                    </div>
                    <span className="text-xs font-bold text-success bg-success-surface px-2.5 py-0.5 rounded-full">{String(c.status)}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Closure Criteria' && (
              <div className="space-y-3">
                {filteredClosureRules.map((c) => (
                  <div key={String(c.id)} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 ring-1 ring-border-subtle">
                    <div>
                      <p className="text-sm font-semibold text-primary">{String(c.name)}</p>
                      <p className="text-xs text-text-muted">{String(c.id)} · {String(c.ruleType)}</p>
                    </div>
                    <span className="text-xs font-bold text-success bg-success-surface px-2.5 py-0.5 rounded-full">{String(c.status)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
