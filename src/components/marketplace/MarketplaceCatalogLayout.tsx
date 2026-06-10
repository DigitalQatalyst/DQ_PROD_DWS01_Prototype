import React from 'react';
import { Search } from 'lucide-react';
import { MarketplaceFilterPanel } from '../MarketplaceFilterPanel';
import type { FilterGroup } from '../MarketplaceFilterPanel';
import { MarketplaceCatalogHeader } from './MarketplaceCatalogHeader';
import {
  MarketplaceCatalogTabs,
  type MarketplaceCatalogTab,
} from './MarketplaceCatalogTabs';
import { ServiceEmptyState } from '../ServiceEmptyState';

export interface MarketplaceCatalogLayoutProps {
  eyebrow: string;
  title: string;
  lede: string;
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
  itemLabel: string;
  totalCount: number;
  visibleCount: number;
  tabs: MarketplaceCatalogTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  toneStrip?: { code: string; description: string } | null;
  filterHelperText: string;
  filterGroups: FilterGroup[];
  filterValues: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  onClearAll: () => void;
  recommendedActive?: boolean;
  onRecommendedChange?: (active: boolean) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  showEmpty?: boolean;
  children: React.ReactNode;
  belowContent?: React.ReactNode;
}

export function MarketplaceCatalogLayout({
  eyebrow,
  title,
  lede,
  searchPlaceholder,
  search,
  onSearchChange,
  itemLabel,
  totalCount,
  visibleCount,
  tabs,
  activeTabId,
  onTabChange,
  toneStrip,
  filterHelperText,
  filterGroups,
  filterValues,
  onFilterChange,
  onClearAll,
  recommendedActive,
  onRecommendedChange,
  isLoading = false,
  loadingMessage = 'Loading…',
  emptyTitle = 'No items match your filters',
  emptyMessage = 'Try adjusting your search or filters, or clear all filters to see more results.',
  showEmpty = false,
  children,
  belowContent,
}: MarketplaceCatalogLayoutProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8">
      <MarketplaceCatalogHeader eyebrow={eyebrow} title={title} lede={lede} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex h-11 min-w-[260px] max-w-xl flex-1 items-center gap-2 rounded-md border border-border-default bg-surface px-3.5">
          <Search className="h-4 w-4 text-text-disabled" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-[13.5px] text-primary outline-none placeholder:text-text-disabled"
          />
        </div>
        <div className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.18em] text-text-muted">
          {visibleCount} of {totalCount} {itemLabel}
        </div>
      </div>

      <MarketplaceCatalogTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={onTabChange}
      />

      {toneStrip && (
        <div className="mb-5 rounded-md border border-border-default bg-surface px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
          <span className="text-secondary">{toneStrip.code}</span>
          <span className="mx-2 text-border-strong">·</span>
          {toneStrip.description}
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <MarketplaceFilterPanel
          title="Filters"
          helperText={filterHelperText}
          searchPlaceholder={searchPlaceholder}
          searchValue={search}
          onSearchChange={onSearchChange}
          groups={filterGroups}
          values={filterValues}
          onChange={onFilterChange}
          recommendedActive={recommendedActive}
          onRecommendedChange={onRecommendedChange}
          totalCount={totalCount}
          visibleCount={visibleCount}
          onClearAll={onClearAll}
          hideSearch
        />

        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-text-muted">
              {loadingMessage}
            </div>
          ) : showEmpty ? (
            <ServiceEmptyState
              title={emptyTitle}
              message={emptyMessage}
              ctaLabel="Clear filters"
              onCtaClick={onClearAll}
            />
          ) : (
            children
          )}
        </div>
      </div>

      {belowContent}
    </div>
  );
}
