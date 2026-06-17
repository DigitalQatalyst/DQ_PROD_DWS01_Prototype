import { Link } from 'react-router-dom';

export function FeatureUnavailablePage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-16">
      <section className="mx-auto max-w-3xl rounded-card border border-border-subtle bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
          MVP launch scope
        </p>
        <h1 className="mt-3 text-2xl font-bold text-primary">
          Feature not available for MVP launch
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          This area is currently hidden for the MVP launch and will be enabled
          in a future release.
        </p>
        <Link
          to="/home"
          className="mt-6 inline-flex min-h-10 items-center rounded-button bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-navy-800"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
