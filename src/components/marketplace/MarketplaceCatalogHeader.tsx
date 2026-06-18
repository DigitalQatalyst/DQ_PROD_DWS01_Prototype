import React from 'react';
import {
  MarketplaceEyebrowTrail,
  type MarketplaceBreadcrumbItem,
} from './MarketplaceEyebrowTrail';

interface MarketplaceCatalogHeaderProps {
  breadcrumbItems: MarketplaceBreadcrumbItem[];
  title: string;
  lede: string;
}

export function MarketplaceCatalogHeader({
  breadcrumbItems,
  title,
  lede,
}: MarketplaceCatalogHeaderProps) {
  return (
    <header className="mb-8">
      <MarketplaceEyebrowTrail items={breadcrumbItems} />
      <h1 className="max-w-4xl text-[28px] font-bold leading-tight tracking-tight text-primary sm:text-[32px]">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-text-secondary">
        {lede}
      </p>
    </header>
  );
}
