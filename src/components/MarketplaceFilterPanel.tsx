import React, { useEffect, useState } from 'react';
import { Search, X, Filter, Check } from 'lucide-react';
export interface FilterGroup {
  id: string;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
}
export interface MarketplaceFilterPanelProps {
  title: string;
  helperText: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (val: string) => void;
  groups: FilterGroup[];
  values: Record<string, string[]>;
  onChange: (groupId: string, values: string[]) => void;
  recommendedActive?: boolean;
  onRecommendedChange?: (active: boolean) => void;
  totalCount: number;
  visibleCount: number;
  onClearAll: () => void;
  persona?: string;
}
export function MarketplaceFilterPanel(props: MarketplaceFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  const activeCount = Object.values(props.values).reduce((acc, arr) => acc + arr.length, 0) + (props.recommendedActive ? 1 : 0);
  const toggleFilter = (groupId: string, value: string) => {
    const current = props.values[groupId] || [];
    if (current.includes(value)) {
      props.onChange(groupId, current.filter((v) => v !== value));
    } else {
      props.onChange(groupId, [...current, value]);
    }
  };
  const PanelContent = () => <div className="flex flex-col h-full bg-white lg:rounded-[12px] lg:border lg:border-[#D8D9E6] lg:shadow-[0_2px_8px_rgba(3,15,53,0.04)] overflow-hidden">
      <div className="p-5 border-b border-[#EEEFF6] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-[#030F35]">{props.title}</h2>
          {activeCount > 0 && <button onClick={props.onClearAll} className="text-[12px] font-medium text-[#FB5535] hover:underline">
              Clear all
            </button>}
        </div>
        <p className="text-[12px] text-[#5F607F] leading-snug mb-4">
          {props.helperText}
        </p>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F607F]" strokeWidth={1.5} />
          <input type="text" value={props.searchValue} onChange={(e) => props.onSearchChange(e.target.value)} placeholder={props.searchPlaceholder} className="w-full h-9 pl-9 pr-3 rounded-[8px] border border-[#D8D9E6] text-[13px] text-[#111118] placeholder:text-[#5F607F] focus:outline-none focus:border-[#030F35] focus:ring-1 focus:ring-[#030F35]" />
        </div>

        {props.onRecommendedChange && <label className="flex items-center gap-2 mt-4 cursor-pointer group">
            <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${props.recommendedActive ? 'bg-[#030F35] border-[#030F35]' : 'border-[#D8D9E6] bg-white group-hover:border-[#030F35]'}`}>
              {props.recommendedActive && <Check size={12} className="text-white" strokeWidth={2} />}
            </div>
            <span className="text-[13px] font-medium text-[#111118]">
              Recommended for my role
            </span>
          </label>}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {props.groups.map((group) => <div key={group.id}>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#5F607F] mb-3">
              {group.label}
            </h3>
            <div className="space-y-2.5">
              {group.options.map((opt) => {
            const isActive = (props.values[group.id] || []).includes(opt.value);
            return <label key={opt.value} className="flex items-start gap-2 cursor-pointer group">
                    <div className={`mt-0.5 w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-[#030F35] border-[#030F35]' : 'border-[#D8D9E6] bg-white group-hover:border-[#030F35]'}`}>
                      <input type="checkbox" className="sr-only" checked={isActive} onChange={() => toggleFilter(group.id, opt.value)} />
                      {isActive && <Check size={12} className="text-white" strokeWidth={2} />}
                    </div>
                    <span className="text-[13px] text-[#2E2E42] leading-snug">
                      {opt.label}
                    </span>
                  </label>;
          })}
            </div>
          </div>)}
      </div>

      <div className="p-4 border-t border-[#EEEFF6] bg-[#F6F6FB] shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-[#5F607F]">
            Showing {props.visibleCount} of {props.totalCount}
          </span>
          {activeCount > 0 && <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#030F35] text-white text-[10px] font-bold">
              {activeCount} active
            </span>}
        </div>
      </div>
    </div>;
  return <>
      {/* Desktop Panel */}
      <div className="hidden lg:block w-[280px] shrink-0 sticky top-[88px] h-[calc(100vh-112px)]">
        <PanelContent />
      </div>

      {/* Mobile/Tablet Button */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D8D9E6] rounded-[8px] text-[13px] font-semibold text-[#030F35] hover:bg-[#F6F6FB] transition-colors">
          <Filter size={16} strokeWidth={1.5} />
          Filters
          {activeCount > 0 && <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#030F35] text-white text-[10px]">
              {activeCount}
            </span>}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && <div className="fixed inset-0 z-[200] lg:hidden flex justify-end">
          <div className="absolute inset-0 bg-[#030F35]/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-[90vw] sm:max-w-[360px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[#EEEFF6] shrink-0">
              <h2 className="text-base font-bold text-[#030F35]">Filters</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-[#5F607F] hover:bg-[#F6F6FB] rounded-full transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PanelContent />
            </div>
            <div className="p-4 border-t border-[#EEEFF6] bg-white flex gap-3 shrink-0">
              <button onClick={props.onClearAll} className="flex-1 py-2.5 border border-[#D8D9E6] rounded-[8px] text-[13px] font-semibold text-[#2E2E42] hover:bg-[#F6F6FB] transition-colors">
                Clear all
              </button>
              <button onClick={() => setIsOpen(false)} className="flex-1 py-2.5 bg-[#FB5535] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#E04020] transition-colors">
                Apply filters
              </button>
            </div>
          </div>
        </div>}
    </>;
}