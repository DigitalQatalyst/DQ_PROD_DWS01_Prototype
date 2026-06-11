import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface MarketplaceBreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface MarketplaceBreadcrumbsProps {
  items: MarketplaceBreadcrumbItem[];
}

export function MarketplaceBreadcrumbs({ items }: MarketplaceBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-[12px] font-medium text-text-muted"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && <ChevronRight size={12} aria-hidden />}
            {isLast ? (
              <span className="truncate text-text-primary">{item.label}</span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="truncate transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="truncate transition-colors hover:text-primary"
              >
                {item.label}
              </button>
            ) : (
              <span className="truncate">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
