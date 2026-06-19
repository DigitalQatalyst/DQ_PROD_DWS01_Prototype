import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface MarketplaceCatalogCardProps {
  typeLabel: string;
  metaLabel: string;
  title: string;
  description: string;
  footerId?: string;
  badge?: React.ReactNode;
  highlighted?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function MarketplaceCatalogCard({
  typeLabel,
  metaLabel,
  title,
  description,
  footerId,
  badge,
  highlighted = false,
  disabled = false,
  onClick,
}: MarketplaceCatalogCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex h-full w-full flex-col rounded-xl border bg-white p-5 text-left transition ${
        disabled
          ? 'cursor-not-allowed border-border-default opacity-70'
          : highlighted
            ? 'border-orange-100 hover:border-secondary/40 hover:bg-orange-50/30'
            : 'border-border-default hover:border-secondary/30 hover:bg-surface'
      }`}
    >
      {highlighted && (
        <span className="pointer-events-none absolute -top-px left-5 right-5 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      )}

      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded bg-gray-100 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-text-secondary">
          {typeLabel}
        </span>
        <div className="flex items-center gap-1.5">
          {badge}
          {!disabled && (
            <ArrowUpRight className="h-3.5 w-3.5 text-primary/30 transition group-hover:text-secondary" />
          )}
        </div>
      </div>

      <div className="font-mono text-[10.5px] uppercase tracking-wider text-text-disabled">
        {metaLabel}
      </div>

      <h3 className="mt-1.5 text-[15.5px] font-bold leading-snug text-primary">
        {title}
      </h3>

      <p className="mt-2.5 line-clamp-3 flex-1 text-[12.5px] leading-relaxed text-text-muted">
        {description}
      </p>

      {footerId && (
        <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-text-disabled">
          <span className="truncate pr-3">{footerId}</span>
          {!disabled && (
            <span className="shrink-0 text-secondary opacity-0 transition-opacity group-hover:opacity-100">
              View
            </span>
          )}
        </div>
      )}
    </button>
  );
}
