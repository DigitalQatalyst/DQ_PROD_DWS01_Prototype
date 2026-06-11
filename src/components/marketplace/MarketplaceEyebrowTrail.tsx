import React from 'react';
import { Link } from 'react-router-dom';

export interface MarketplaceBreadcrumbItem {
  label: string;
  href?: string;
}

interface MarketplaceEyebrowTrailProps {
  items: MarketplaceBreadcrumbItem[];
  className?: string;
}

export function MarketplaceEyebrowTrail({
  items,
  className = 'mb-3',
}: MarketplaceEyebrowTrailProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`font-mono text-[10.5px] font-medium uppercase tracking-[0.22em] text-secondary ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && <span aria-hidden> / </span>}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? '' : undefined}>{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
