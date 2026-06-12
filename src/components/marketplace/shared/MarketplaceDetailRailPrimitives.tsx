import type { ReactNode } from 'react';

export function RailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white px-5 py-5">
      <h3 className="mb-4 text-sm font-semibold leading-snug text-dq-navy">{title}</h3>
      {children}
    </section>
  );
}

export function RailActionButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-2.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2 text-left text-xs font-medium text-dq-navy transition hover:border-gray-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export function RailMetaRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-gray-400">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] leading-none text-gray-500">{label}</p>
        <p className="mt-1 text-xs font-medium leading-snug text-dq-navy">{value}</p>
      </div>
    </div>
  );
}

export function RailTopActions({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="flex items-center gap-1.5">{children}</div>;
}

export function RailOutlineButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-dq-navy transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export function RailIconButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-dq-navy transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}
