import React from 'react';
import { Eye, Lock } from 'lucide-react';
import type { AnalyticsAsset } from '../types/analyticsMarketplace';

interface AnalyticsAssetCardProps {
  asset: AnalyticsAsset;
  isPermitted: boolean;
  onPreview: () => void;
}

export function AnalyticsAssetCard({ asset, isPermitted, onPreview }: AnalyticsAssetCardProps) {
  const typeColor =
    asset.type === 'Dashboard'
      ? 'bg-blue-50 text-blue-700'
      : asset.type === 'Report'
        ? 'bg-purple-50 text-purple-700'
        : 'bg-teal-50 text-teal-700';

  return (
    <div className="flex flex-col rounded-xl border border-border-default bg-white p-5 transition hover:border-secondary/30 hover:shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className={`rounded px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${typeColor}`}>
          {asset.type}
        </span>
        {!isPermitted && (
          <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-text-muted">
            <Lock className="h-3 w-3" />
            Restricted
          </span>
        )}
      </div>

      <h3 className="text-[15.5px] font-bold leading-snug text-primary">{asset.name}</h3>

      <p className="mt-1.5 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-text-muted">
        {asset.purpose}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-text-muted">
        <span className="font-semibold text-text-secondary">Category</span>
        <span>{asset.category}</span>
        <span className="font-semibold text-text-secondary">Owner</span>
        <span>{asset.owner}</span>
        <span className="font-semibold text-text-secondary">Data Scope</span>
        <span>{asset.dataScope}</span>
        <span className="font-semibold text-text-secondary">Refresh</span>
        <span>{asset.refreshRhythm}</span>
      </div>

      <div className="mt-auto border-t border-border-subtle pt-3">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-disabled">
            Last updated: {asset.lastUpdated}
          </span>
        </div>
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-[12.5px] font-semibold text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
          Preview
        </button>
      </div>
    </div>
  );
}
