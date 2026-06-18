import type { ReactNode } from 'react';

export function MarketplaceDetailSectionCard({
  title,
  children,
  className = '',
  flush = false,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  /** Removes bottom padding when children include full-bleed list rows. */
  flush?: boolean;
}) {
  return (
    <section
      className={[
        'rounded-lg border border-gray-200 bg-white px-5 pt-5',
        flush ? 'overflow-hidden pb-0' : 'pb-5',
        className,
      ].join(' ')}
    >
      <h2 className="mb-4 text-sm font-semibold leading-snug text-dq-navy">{title}</h2>
      {children}
    </section>
  );
}
