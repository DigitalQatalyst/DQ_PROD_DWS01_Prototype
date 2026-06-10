import React from 'react';
import { Lock } from 'lucide-react';
import { MarketplaceCatalogCard } from './marketplace/MarketplaceCatalogCard';

interface AnalyticsDashboardCardProps {
  id: string;
  category: string;
  title: string;
  description: string;
  isPermitted: boolean;
  onClick: () => void;
}

export function AnalyticsDashboardCard({
  id,
  category,
  title,
  description,
  isPermitted,
  onClick,
}: AnalyticsDashboardCardProps) {
  const categoryCode = category.slice(0, 4).toUpperCase();

  return (
    <MarketplaceCatalogCard
      typeLabel={`${categoryCode} · Dashboard`}
      metaLabel={isPermitted ? 'Available · Open' : 'Restricted · Request access'}
      title={title}
      description={description}
      footerId={id}
      badge={
        !isPermitted ? (
          <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-text-muted">
            <Lock className="h-3 w-3" />
            Locked
          </span>
        ) : undefined
      }
      highlighted={!isPermitted}
      disabled={false}
      onClick={onClick}
    />
  );
}
