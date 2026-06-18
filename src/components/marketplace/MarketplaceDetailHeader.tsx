import React from 'react';
import {
  MarketplaceEyebrowTrail,
  type MarketplaceBreadcrumbItem,
} from './MarketplaceEyebrowTrail';

interface MarketplaceDetailHeaderProps {
  breadcrumbItems: MarketplaceBreadcrumbItem[];
  title: string;
  badges?: React.ReactNode;
  lede?: string;
  meta?: React.ReactNode;
  eyebrow?: React.ReactNode;
}

export function MarketplaceDetailHeader({
  breadcrumbItems,
  title,
  badges,
  lede,
  meta,
  eyebrow,
}: MarketplaceDetailHeaderProps) {
  return (
    <header className="mb-8">
      <MarketplaceEyebrowTrail items={breadcrumbItems} className="mb-3" />

      {eyebrow && <div className="mb-3">{eyebrow}</div>}

      {badges && (
        <div className="mb-3 flex flex-wrap items-center gap-2">{badges}</div>
      )}

      <h1 className="dq-page-title max-w-4xl">{title}</h1>

      {lede && (
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-text-secondary">
          {lede}
        </p>
      )}

      {meta && (
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border-subtle pt-4">
          {meta}
        </div>
      )}
    </header>
  );
}
