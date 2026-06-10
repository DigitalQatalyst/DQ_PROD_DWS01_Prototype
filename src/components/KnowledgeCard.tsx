import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KnowledgeAssetFull } from '../types/knowledgeDiscovery';
import { MarketplaceCatalogCard } from './marketplace/MarketplaceCatalogCard';

function StatusBadge({ status }: { status: KnowledgeAssetFull['status'] }) {
  const config: Record<string, { label: string; className: string }> = {
    Effective: { label: 'Effective', className: 'bg-success-surface text-success-text' },
    'Under Review': { label: 'Review', className: 'bg-warning-surface text-warning-text' },
    Draft: { label: 'Draft', className: 'bg-info-surface text-info-text' },
    'Needs Update': { label: 'Update', className: 'bg-warning-surface text-warning-text' },
    Deprecated: { label: 'Legacy', className: 'bg-danger-surface text-danger-text' },
  };

  const item = config[status];
  if (!item) return null;

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] ${item.className}`}
    >
      {item.label}
    </span>
  );
}

export function KnowledgeCard({
  asset,
  onClick,
}: {
  asset: KnowledgeAssetFull;
  onClick?: () => void;
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) onClick();
    else navigate(`/marketplace/knowledge-discovery/${asset.id}`);
  };

  const typeCode = asset.type
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 6)
    .toUpperCase();

  return (
    <MarketplaceCatalogCard
      typeLabel={`${typeCode} · Knowledge`}
      metaLabel={`${asset.readTime} · ${asset.status}`}
      title={asset.title}
      description={asset.summary}
      footerId={asset.id}
      badge={<StatusBadge status={asset.status} />}
      highlighted={
        asset.status === 'Under Review' ||
        asset.status === 'Needs Update' ||
        asset.acknowledgementRequired
      }
      onClick={handleCardClick}
    />
  );
}
