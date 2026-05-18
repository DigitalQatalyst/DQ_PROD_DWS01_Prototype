import React from 'react';
import { Search } from 'lucide-react';
interface FilterBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}
export function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange
}: FilterBarProps) {
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default mb-6">
      <div className="flex overflow-x-auto hide-scrollbar" role="tablist">
        {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return <button key={tab} role="tab" aria-selected={isActive} onClick={() => onTabChange(tab)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${isActive ? 'border-secondary text-primary' : 'border-transparent text-text-muted hover:text-primary hover:border-border-strong'}`}>
              {tab}
            </button>;
      })}
      </div>

      {onSearchChange !== undefined && <div className="relative mb-2 sm:mb-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Filter..." className="h-9 pl-9 pr-4 rounded-button border border-border-strong text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-focus-ring-navy" />
        </div>}
    </div>;
}