import React from 'react';

interface MarketplaceCatalogHeaderProps {
  eyebrow: string;
  title: string;
  lede: string;
}

export function MarketplaceCatalogHeader({
  eyebrow,
  title,
  lede,
}: MarketplaceCatalogHeaderProps) {
  return (
    <header className="mb-8">
      <div className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.22em] text-secondary">
        {eyebrow}
      </div>
      <h1 className="max-w-4xl text-[28px] font-bold leading-tight tracking-tight text-primary sm:text-[32px]">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-text-secondary">
        {lede}
      </p>
    </header>
  );
}
