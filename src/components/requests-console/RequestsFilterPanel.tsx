import React, { useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import type {
  ClosureQualityFilter,
  EvidenceState,
  FulfilmentSlaState,
  FulfilmentStatus,
  RecurrenceType,
  RequestPriority,
} from "../../types/requestsConsole";

export interface RequestsFilterState {
  search: string;
  queue: string;
  category: string;
  owner: string;
  priority: string;
  slaState: string;
  fulfilmentStatus: string;
  ageing: string;
  recurrence: string;
  evidenceState: string;
  closureQuality: string;
}

export const emptyRequestsFilters: RequestsFilterState = {
  search: "",
  queue: "",
  category: "",
  owner: "",
  priority: "",
  slaState: "",
  fulfilmentStatus: "",
  ageing: "",
  recurrence: "",
  evidenceState: "",
  closureQuality: "",
};

export function countActivePanelFilters(filters: RequestsFilterState): number {
  return Object.values(filters).filter((v) => v !== "").length;
}

interface RequestsFilterPanelProps {
  filters: RequestsFilterState;
  onChange: (filters: RequestsFilterState) => void;
  resultCount: number;
  onClear: () => void;
  categories: string[];
  owners: string[];
  queues: string[];
}

function CompactSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const active = value !== "";
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      title={label}
      className={`h-9 min-w-0 max-w-[140px] rounded-button border px-2.5 text-sm font-medium truncate focus:outline-none focus:ring-2 focus:ring-focus-ring-navy ${
        active
          ? "border-secondary bg-orange-50 text-primary"
          : "border-border-strong bg-white text-text-secondary"
      }`}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function RequestsFilterPanel({
  filters,
  onChange,
  resultCount,
  onClear,
  categories,
  owners,
  queues,
}: RequestsFilterPanelProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const set = (patch: Partial<RequestsFilterState>) =>
    onChange({ ...filters, ...patch });

  const activeCount = countActivePanelFilters(filters);
  const moreActiveCount = [
    filters.category,
    filters.slaState,
    filters.ageing,
    filters.recurrence,
    filters.evidenceState,
    filters.closureQuality,
  ].filter(Boolean).length;

  const priorities: RequestPriority[] = ["High", "Medium", "Low"];
  const slaStates: FulfilmentSlaState[] = [
    "On Track",
    "Due Soon",
    "At Risk",
    "Breached",
    "Paused",
    "Completed",
  ];
  const statuses: FulfilmentStatus[] = [
    "Routed",
    "Assigned",
    "In Fulfilment",
    "Clarification Needed",
    "Blocked",
    "Escalated",
    "Evidence Added",
    "Fulfilled",
    "Closure Review",
    "Closed",
    "Reopened",
  ];
  const evidenceStates: EvidenceState[] = [
    "Not Started",
    "Pending",
    "Added",
    "Weak",
    "Accepted",
  ];
  const recurrences: RecurrenceType[] = ["New", "Recurring", "Reopened"];
  const closureQualities: ClosureQualityFilter[] = [
    "Pending",
    "Accepted",
    "Rejected",
    "Reopened",
    "Not Ready",
  ];

  return (
    <div className="bg-white rounded-card border border-border-default shadow-sm mb-4">
      <div className="flex flex-wrap items-center gap-2 p-3">
        <div className="relative flex-1 min-w-[180px] max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search ID, title, owner…"
            className="w-full h-9 pl-9 pr-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy"
          />
        </div>

        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          <CompactSelect
            label="Queue"
            value={filters.queue}
            options={queues}
            onChange={(v) => set({ queue: v })}
          />
          <CompactSelect
            label="Owner"
            value={filters.owner}
            options={owners}
            onChange={(v) => set({ owner: v })}
          />
          <CompactSelect
            label="Priority"
            value={filters.priority}
            options={priorities}
            onChange={(v) => set({ priority: v })}
          />
          <CompactSelect
            label="Status"
            value={filters.fulfilmentStatus}
            options={statuses}
            onChange={(v) => set({ fulfilmentStatus: v })}
          />
        </div>

        <button
          type="button"
          onClick={() => setMoreOpen(!moreOpen)}
          aria-expanded={moreOpen}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-button border text-sm font-semibold transition-colors ${
            moreOpen || moreActiveCount > 0
              ? "border-secondary bg-orange-50 text-primary"
              : "border-border-strong bg-white text-text-secondary hover:text-primary"
          }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">More</span>
          {moreActiveCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-pill bg-secondary text-white text-[10px] font-bold px-1">
              {moreActiveCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <span className="text-sm text-text-secondary whitespace-nowrap">
            <span className="font-bold text-primary">{resultCount}</span>{" "}
            results
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 h-9 px-2.5 rounded-button text-xs font-semibold text-secondary hover:bg-orange-50 hover:text-primary transition-colors"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {moreOpen && (
        <div className="px-3 pb-3 pt-3 border-t border-border-subtle bg-surface/40">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                Category
              </span>
              <select
                value={filters.category}
                onChange={(e) => set({ category: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                SLA state
              </span>
              <select
                value={filters.slaState}
                onChange={(e) => set({ slaState: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {slaStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                Ageing
              </span>
              <select
                value={filters.ageing}
                onChange={(e) => set({ ageing: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {["Under 8h", "8h–1d", "1d+", "Closed"].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                Recurrence
              </span>
              <select
                value={filters.recurrence}
                onChange={(e) => set({ recurrence: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {recurrences.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                Evidence
              </span>
              <select
                value={filters.evidenceState}
                onChange={(e) => set({ evidenceState: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {evidenceStates.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                Closure quality
              </span>
              <select
                value={filters.closureQuality}
                onChange={(e) => set({ closureQuality: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {closureQualities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="sm:hidden grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border-subtle">
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                Queue
              </span>
              <select
                value={filters.queue}
                onChange={(e) => set({ queue: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {queues.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                Owner
              </span>
              <select
                value={filters.owner}
                onChange={(e) => set({ owner: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {owners.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                Priority
              </span>
              <select
                value={filters.priority}
                onChange={(e) => set({ priority: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-text-muted uppercase">
                Status
              </span>
              <select
                value={filters.fulfilmentStatus}
                onChange={(e) => set({ fulfilmentStatus: e.target.value })}
                className="mt-1 w-full h-9 rounded-button border border-border-strong bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 pb-3 border-t border-border-subtle">
          {filters.search && (
            <FilterChip
              label={`Search: ${filters.search}`}
              onRemove={() => set({ search: "" })}
            />
          )}
          {filters.queue && (
            <FilterChip
              label={filters.queue}
              onRemove={() => set({ queue: "" })}
            />
          )}
          {filters.category && (
            <FilterChip
              label={filters.category}
              onRemove={() => set({ category: "" })}
            />
          )}
          {filters.owner && (
            <FilterChip
              label={filters.owner}
              onRemove={() => set({ owner: "" })}
            />
          )}
          {filters.priority && (
            <FilterChip
              label={filters.priority}
              onRemove={() => set({ priority: "" })}
            />
          )}
          {filters.slaState && (
            <FilterChip
              label={filters.slaState}
              onRemove={() => set({ slaState: "" })}
            />
          )}
          {filters.fulfilmentStatus && (
            <FilterChip
              label={filters.fulfilmentStatus}
              onRemove={() => set({ fulfilmentStatus: "" })}
            />
          )}
          {filters.ageing && (
            <FilterChip
              label={filters.ageing}
              onRemove={() => set({ ageing: "" })}
            />
          )}
          {filters.recurrence && (
            <FilterChip
              label={filters.recurrence}
              onRemove={() => set({ recurrence: "" })}
            />
          )}
          {filters.evidenceState && (
            <FilterChip
              label={filters.evidenceState}
              onRemove={() => set({ evidenceState: "" })}
            />
          )}
          {filters.closureQuality && (
            <FilterChip
              label={filters.closureQuality}
              onRemove={() => set({ closureQuality: "" })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 max-w-[200px] pl-2.5 pr-1 py-1 rounded-pill bg-navy-50 text-primary text-xs font-medium">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-white/80 text-text-muted hover:text-primary"
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} />
      </button>
    </span>
  );
}
