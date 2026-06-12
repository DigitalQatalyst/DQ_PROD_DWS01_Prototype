import type { ReactNode } from 'react';
import { MarketplaceDetailTabs } from './MarketplaceDetailTabs';
import type { MarketplaceDetailTab } from '../../../types/marketplaceDetail';

interface MarketplaceDetailPageGridProps {
  activeTab: MarketplaceDetailTab;
  onTabChange: (tab: MarketplaceDetailTab) => void;
  children: ReactNode;
  rail: ReactNode;
}

export function MarketplaceDetailPageGrid({
  activeTab,
  onTabChange,
  children,
  rail,
}: MarketplaceDetailPageGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12 lg:items-start">
      <div className="min-w-0 lg:col-span-8">
        <MarketplaceDetailTabs activeTab={activeTab} onTabChange={onTabChange} />

        <div
          role="tabpanel"
          id={`marketplace-panel-${activeTab}`}
          aria-labelledby={`marketplace-tab-${activeTab}`}
          className="mt-6"
        >
          {children}
        </div>
      </div>

      <div className="min-w-0 lg:col-span-4">
        {/* Offset matches tab bar height + tabpanel top margin so rail aligns with first card */}
        <div className="lg:pt-[3.5rem]">{rail}</div>
      </div>
    </div>
  );
}
