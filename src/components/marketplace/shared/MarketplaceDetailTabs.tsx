import type { MarketplaceDetailTab } from '../../../types/marketplaceDetail';

const TABS: { id: MarketplaceDetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'governance', label: 'Governance' },
  { id: 'resources', label: 'Resources' },
];

interface MarketplaceDetailTabsProps {
  activeTab: MarketplaceDetailTab;
  onTabChange: (tab: MarketplaceDetailTab) => void;
}

export function MarketplaceDetailTabs({
  activeTab,
  onTabChange,
}: MarketplaceDetailTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Marketplace detail sections"
      className="flex gap-8 border-b border-gray-200"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`marketplace-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`marketplace-panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={[
              'relative pb-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2',
              isActive ? 'text-dq-navy' : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab.label}
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-dq-orange"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
