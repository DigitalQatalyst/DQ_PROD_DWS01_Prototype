import React from 'react';
import { Link } from 'react-router-dom';

export interface MarketplaceBreadcrumbItem {
  label: string;
  href?: string;
}

interface MarketplaceEyebrowTrailProps {
  items: MarketplaceBreadcrumbItem[];
  className?: string;
  variant?: 'default' | 'compact';
}

export function MarketplaceEyebrowTrail({
  items,
  className = 'mb-3',
  variant = 'default',
}: MarketplaceEyebrowTrailProps) {
  const isCompact = variant === 'compact';

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        isCompact
          ? `text-[13px] font-medium ${className}`
          : `font-mono text-[10.5px] font-medium uppercase tracking-[0.22em] text-secondary ${className}`
      }
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const separator = isCompact ? ' › ' : ' / ';

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && <span aria-hidden className={isCompact ? 'text-gray-400' : undefined}>{separator}</span>}
            {item.href ? (
              <Link
                to={item.href}
                aria-current={isLast ? 'page' : undefined}
                className={
                  isCompact
                    ? isLast
                      ? 'text-dq-navy'
                      : 'text-gray-500 transition-colors hover:text-dq-navy'
                    : 'transition-colors hover:text-primary'
                }
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isCompact ? (isLast ? 'text-dq-navy' : 'text-gray-500') : undefined
                }
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
