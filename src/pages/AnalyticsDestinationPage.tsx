import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, FileBarChart } from 'lucide-react';
import { getAssetBySlug } from '../mocks/analyticsMarketplace.mock';

const typeIcons: Record<string, React.ReactNode> = {
  Dashboard: <BarChart3 className="h-5 w-5 text-blue-600" strokeWidth={1.5} />,
  Report: <FileBarChart className="h-5 w-5 text-purple-600" strokeWidth={1.5} />,
  View: <BarChart3 className="h-5 w-5 text-teal-600" strokeWidth={1.5} />,
};

const typeColors: Record<string, string> = {
  Dashboard: 'bg-blue-50 text-blue-700 border-blue-200',
  Report: 'bg-purple-50 text-purple-700 border-purple-200',
  View: 'bg-teal-50 text-teal-700 border-teal-200',
};

export function AnalyticsDestinationPage() {
  const { assetSlug } = useParams<{ assetSlug: string }>();
  const navigate = useNavigate();

  const asset = assetSlug ? getAssetBySlug(assetSlug) : undefined;

  if (!asset) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-primary">Analytics destination not found</h2>
        <p className="mt-2 text-sm text-text-muted">The analytics asset you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/marketplace/drive/analytics-marketplace')}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-[13px] font-semibold text-white hover:bg-secondary/90"
        >
          Back to Analytics Marketplace
        </button>
      </div>
    );
  }

  const typeIcon = typeIcons[asset.type] || null;
  const typeColorClass = typeColors[asset.type] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back
      </button>

      <div className="mb-4 flex items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${typeColorClass}`}>
          {typeIcon}
          {asset.type}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-text-disabled">{asset.id}</span>
      </div>

      <h1 className="dq-page-title max-w-3xl">{asset.name}</h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-text-secondary">{asset.purpose}</p>

      <div className="mt-8 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-3 rounded-lg border border-border-default bg-surface p-6 text-[13px]">
        {[
          { label: 'Owner', value: asset.owner },
          { label: 'Category', value: asset.category },
          { label: 'Data Scope', value: asset.dataScope },
          { label: 'Refresh Rhythm', value: asset.refreshRhythm },
          { label: 'Last Updated', value: asset.lastUpdated },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-text-disabled">{item.label}</span>
            <span className="font-medium text-text-secondary">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border-default bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
          {typeIcon || <BarChart3 className="h-8 w-8 text-text-muted" strokeWidth={1} />}
        </div>
        <h2 className="text-lg font-bold text-primary">Live {asset.type}</h2>
        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-text-muted">
          This is the destination for the <strong>{asset.name}</strong> {asset.type.toLowerCase()}.
          In the full prototype, this page would render the live analytics view, visualisations, and interactive filters.
        </p>
        <button
          onClick={() => navigate(`/marketplace/drive/analytics-marketplace/${asset.slug}`)}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-secondary px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-secondary/90"
        >
          View Details &amp; Preview
        </button>
      </div>
    </div>
  );
}
