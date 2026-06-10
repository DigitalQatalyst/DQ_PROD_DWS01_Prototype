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
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dq-tabs mb-6">
      <div className="flex overflow-x-auto hide-scrollbar" role="tablist">
        {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return <button key={tab} role="tab" aria-selected={isActive} onClick={() => onTabChange(tab)} className={`dq-tab whitespace-nowrap ${isActive ? 'dq-tab-active' : ''}`}>
              {tab}
            </button>;
      })}
      </div>

      {onSearchChange !== undefined && <div className="relative mb-2 sm:mb-0">
          <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Filter..." className="dq-input w-full pl-9 sm:w-64" />
        </div>}
    </div>;
}
