import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  route?: string;
};

type MvpSidebarDetailPageProps = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  backTo: string;
  backLabel: string;
};

export function MvpSidebarDetailPage({
  breadcrumbs,
  title,
  description,
  backTo,
  backLabel,
}: MvpSidebarDetailPageProps) {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-2 text-sm text-text-muted"
      >
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.route ? (
              <Link className="font-semibold text-primary hover:text-secondary" to={item.route}>
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-text-secondary">{item.label}</span>
            )}
            {index < breadcrumbs.length - 1 && <span aria-hidden="true">/</span>}
          </span>
        ))}
      </nav>

      <section className="max-w-4xl rounded-card border border-border-subtle bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
          MVP launch workspace
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
          {description}
        </p>
        <Link
          to={backTo}
          className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-button border border-border-strong bg-white px-4 text-sm font-bold text-primary transition-colors hover:bg-surface"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {backLabel}
        </Link>
      </section>
    </main>
  );
}
