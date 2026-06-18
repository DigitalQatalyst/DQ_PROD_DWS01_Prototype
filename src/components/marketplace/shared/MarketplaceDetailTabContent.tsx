import type { ReactNode } from 'react';

/** Consistent vertical stack for Overview / Governance / Resources tab panels. */
export function MarketplaceDetailTabContent({ children }: { children: ReactNode }) {
  return <div className="space-y-5 product-detail-enter">{children}</div>;
}
