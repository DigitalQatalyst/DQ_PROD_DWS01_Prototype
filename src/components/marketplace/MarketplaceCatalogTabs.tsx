import React from 'react';

export interface MarketplaceCatalogTab {
  id: string;
  label: string;
  count: number;
<<<<<<< HEAD
  disabled?: boolean;
=======
>>>>>>> origin/Feat/TrackerHub-Rose
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
<<<<<<< HEAD
        const isDisabled = tab.disabled ?? false;
=======
>>>>>>> origin/Feat/TrackerHub-Rose
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
<<<<<<< HEAD
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => onTabChange(tab.id)}
            className={`relative inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-semibold transition ${
              isDisabled
                ? 'cursor-not-allowed text-text-disabled opacity-70'
                : isActive
                  ? 'text-primary'
                  : 'text-text-muted hover:text-primary'
=======
            onClick={() => onTabChange(tab.id)}
            className={`relative inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-semibold transition ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-primary'
>>>>>>> origin/Feat/TrackerHub-Rose
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
