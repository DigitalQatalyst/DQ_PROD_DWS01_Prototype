import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import type { FilterGroup } from './MarketplaceFilterPanel';

export interface MarketplaceTopFilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (val: string) => void;
  groups: FilterGroup[];
  values: Record<string, string[]>;
  onChange: (groupId: string, values: string[]) => void;
  recommendedActive?: boolean;
  onRecommendedChange?: (active: boolean) => void;
  onClearAll: () => void;
}

interface FilterDropdownProps {
  group: FilterGroup;
  selected: string[];
  onChange: (values: string[]) => void;
}

function FilterDropdown({ group, selected, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const count = selected.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 items-center gap-1.5 rounded-[8px] border px-3 text-[13px] font-semibold transition-colors whitespace-nowrap
          ${
            count > 0
              ? 'border-[#030F35] bg-[#030F35] text-white'
              : 'border-[#D8D9E6] bg-white text-[#030F35] hover:border-[#030F35]'
          }`}
      >
        <span>{group.label}</span>
        {count > 0 && (
          <span
            className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
              count > 0 ? 'bg-white text-[#030F35]' : 'bg-[#030F35] text-white'
            }`}
          >
            {count}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? 'rotate-180' : ''} ${count > 0 ? 'text-white' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[220px] rounded-[10px] border border-[#D8D9E6] bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-h-64 overflow-y-auto p-2">
            {group.options.map((opt) => {
              const isActive = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className="flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-[13px] text-[#2E2E42] hover:bg-[#F6F6FB] transition-colors text-left"
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                      isActive ? 'border-[#030F35] bg-[#030F35]' : 'border-[#D8D9E6] bg-white'
                    }`}
                  >
                    {isActive && <Check size={11} className="text-white" strokeWidth={2.5} />}
                  </div>
                  <span className="flex-1">{opt.label}</span>
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div className="border-t border-[#EEEFF6] p-2">
              <button
                onClick={() => onChange([])}
                className="w-full rounded-[6px] px-3 py-1.5 text-[12px] font-semibold text-[#FB5535] hover:bg-[#FFF1EE] transition-colors text-center"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MarketplaceTopFilterBar({
  searchPlaceholder = 'Search…',
  searchValue,
  onSearchChange,
  groups,
  values,
  onChange,
  recommendedActive,
  onRecommendedChange,
  onClearAll,
}: MarketplaceTopFilterBarProps) {
  const totalActive =
    Object.values(values).reduce((acc, arr) => acc + arr.length, 0) +
    (recommendedActive ? 1 : 0);

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {/* Inline search */}
      <div className="relative flex-1 min-w-[180px] max-w-[260px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F607F]"
          strokeWidth={1.5}
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-9 w-full rounded-[8px] border border-[#D8D9E6] pl-9 pr-3 text-[13px] text-[#111118] placeholder:text-[#5F607F] focus:border-[#030F35] focus:outline-none focus:ring-1 focus:ring-[#030F35]"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F607F] hover:text-[#030F35] transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter dropdowns */}
      {groups.map((group) => (
        <FilterDropdown
          key={group.id}
          group={group}
          selected={values[group.id] || []}
          onChange={(vals) => onChange(group.id, vals)}
        />
      ))}

      {/* Recommended chip */}
      {onRecommendedChange && (
        <button
          onClick={() => onRecommendedChange(!recommendedActive)}
          className={`flex h-9 items-center gap-1.5 rounded-[8px] border px-3 text-[13px] font-semibold transition-colors whitespace-nowrap ${
            recommendedActive
              ? 'border-[#030F35] bg-[#030F35] text-white'
              : 'border-[#D8D9E6] bg-white text-[#030F35] hover:border-[#030F35]'
          }`}
        >
          {recommendedActive && <Check size={12} strokeWidth={2.5} />}
          Recommended for me
        </button>
      )}

      {/* Clear all */}
      {totalActive > 0 && (
        <button
          onClick={onClearAll}
          className="ml-auto flex items-center gap-1 text-[13px] font-semibold text-[#FB5535] hover:underline whitespace-nowrap"
        >
          <X size={13} />
          Clear filters
        </button>
      )}
    </div>
  );
}
