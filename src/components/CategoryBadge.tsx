import React from 'react';

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-pill bg-orange-50 text-secondary text-[11px] font-semibold uppercase tracking-wider leading-none">
      {category}
    </span>
  );
}
