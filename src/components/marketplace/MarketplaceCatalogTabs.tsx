import React from 'react';

export interface MarketplaceCatalogTab {
  id: string;
  label: string;
  count: number;
}

interface MarketplaceCatalogTabsProps {
  tabs: MarketplaceCatalogTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

export function MarketplaceCatalogTabs({
  tabs,
  activeTabId,
  onTabChange,
}: MarketplaceCatalogTabsProps) {
  return (
    <div
      className="mb-6 flex flex-wrap gap-1 border-b border-border-default"
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`relative inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-semibold transition ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-primary'
            }`}
          >
            {tab.label}
            <span className="font-mono text-[10px] text-text-disabled">
              ({tab.count})
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-secondary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
