import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { TRACKER_TEMPLATES } from "../mocks/trackerMarketplace.mock";
import { MarketplaceEyebrowTrail } from "../components/marketplace/MarketplaceEyebrowTrail";
import { DqButton } from "../components/DqButton";
import { DqBadge, StatusBadge } from "../components/DqBadge";
import { toast } from "sonner";

export function TrackerDetailsPage() {
  const { trackerSlug } = useParams();
  const navigate = useNavigate();

  const tracker = TRACKER_TEMPLATES.find((t) => t.slug === trackerSlug);

  if (!tracker) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <p className="text-sm text-text-secondary">Tracker not found.</p>
        <button
          onClick={() => navigate("/marketplace/drive/tracker-marketplace")}
          className="mt-4 inline-block text-sm font-semibold text-info-text"
        >
          Back to Tracker Marketplace
        </button>
      </div>
    );
  }

  const handleOpenTracker = () => {
    const recent = JSON.parse(localStorage.getItem("recentTrackers") || "[]");
    const updated = [
      tracker.slug,
      ...recent.filter((s: string) => s !== tracker.slug),
    ].slice(0, 8);
    localStorage.setItem("recentTrackers", JSON.stringify(updated));

    navigate(`/tracker/active-tracker/${tracker.slug}`);
  };

  const handleStartTracker = () => {
    toast.success("Tracker instance created");
    const recent = JSON.parse(localStorage.getItem("recentTrackers") || "[]");
    const updated = [
      tracker.slug,
      ...recent.filter((s: string) => s !== tracker.slug),
    ].slice(0, 8);
    localStorage.setItem("recentTrackers", JSON.stringify(updated));

    setTimeout(() => {
      navigate(`/tracker/active-tracker/${tracker.slug}`);
    }, 500);
  };

  const healthColors = {
    green: "bg-success text-white",
    amber: "bg-warning text-white",
    red: "bg-danger text-white",
  };

  const healthLabels = {
    green: "Healthy",
    amber: "Needs Attention",
    red: "Critical",
  };

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      <button
        onClick={() => navigate("/marketplace/drive/tracker-marketplace")}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-text-muted transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tracker Marketplace
      </button>

      <MarketplaceEyebrowTrail
        items={[
          { label: "Marketplace", href: "/marketplace/catalogue" },
          { label: "Drive", href: "/marketplace/drive" },
          {
            label: "Tracker Marketplace",
            href: "/marketplace/drive/tracker-marketplace",
          },
          { label: tracker.name },
        ]}
      />

      <header className="mt-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${healthColors[tracker.health]}`}
              >
                {healthLabels[tracker.health]}
              </span>
              <DqBadge label={tracker.category} tone="navy" dot={false} />
            </div>
            <h1 className="dq-page-title">{tracker.name}</h1>
            <p className="mt-2 max-w-3xl text-base leading-7 text-text-secondary">
              {tracker.fullPurpose}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-muted">
              <span>
                <strong>Owner:</strong> {tracker.owner}
              </span>
              <span>
                <strong>Active Trackers:</strong> {tracker.activeCount}
              </span>
              <span>
                <strong>Last Updated:</strong> {tracker.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <DqButton onClick={handleOpenTracker}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Tracker
          </DqButton>
          <DqButton onClick={handleStartTracker} variant="outline">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Start Tracker
          </DqButton>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-card border border-border-subtle bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-primary">Overview</h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Who Should Use It
                </dt>
                <dd className="mt-1 text-sm text-text-secondary">
                  {tracker.whoShouldUse}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                  What It Monitors
                </dt>
                <dd className="mt-1 text-sm text-text-secondary">
                  {tracker.whatItMonitors}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Update Frequency
                </dt>
                <dd className="mt-1 text-sm text-text-secondary">
                  {tracker.updateFrequency}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Governance Owner
                </dt>
                <dd className="mt-1 text-sm text-text-secondary">
                  {tracker.governanceOwner}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-card border border-border-subtle bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-primary">
              Tracker Structure
            </h2>
            <div className="mb-4">
              <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                Default Fields
              </h3>
              <div className="flex flex-wrap gap-2">
                {tracker.defaultFields.map((field) => (
                  <DqBadge key={field} label={field} tone="gray" dot={false} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                Default Statuses
              </h3>
              <div className="flex flex-wrap gap-2">
                {tracker.defaultStatuses.map((status) => (
                  <StatusBadge key={status} status={status} />
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-card border border-border-subtle bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-primary">
              Example Records
            </h2>
            <ul className="space-y-3">
              {tracker.exampleRecords.map((record) => (
                <li
                  key={record.id}
                  className="flex items-start gap-3 rounded-md border border-border-subtle bg-surface px-4 py-3"
                >
                  <span className="font-mono text-xs font-semibold text-secondary">
                    {record.id}
                  </span>
                  <span className="flex-1 text-sm text-text-secondary">
                    {record.title}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card border border-border-subtle bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-primary">Guidance</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              {tracker.guidance}
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-card border border-border-subtle bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-primary">
              Related Views
            </h2>
            <ul className="space-y-2">
              {tracker.relatedViews.map((view) => (
                <li key={view}>
                  <button className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-left text-sm text-text-secondary transition hover:border-secondary/30 hover:bg-orange-50/30">
                    {view}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card border border-border-subtle bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-primary">
              Tracker Info
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-text-muted">
                  Tracker ID
                </dt>
                <dd className="mt-1 font-mono text-secondary">{tracker.id}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-text-muted">
                  Tracker Type
                </dt>
                <dd className="mt-1 text-text-secondary">
                  {tracker.trackerType}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-text-muted">
                  Category
                </dt>
                <dd className="mt-1 text-text-secondary">{tracker.category}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
