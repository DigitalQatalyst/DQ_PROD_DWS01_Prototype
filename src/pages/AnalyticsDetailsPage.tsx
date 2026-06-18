import React from 'react';
<<<<<<< HEAD
import { useNavigate, useParams } from 'react-router-dom';
=======
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose
import { toast } from 'sonner';
import { ArrowUpRight, BarChart3, Download, FileBarChart, Lock, Plus } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';
import { MarketplaceDetailHeader } from '../components/marketplace/MarketplaceDetailHeader';
<<<<<<< HEAD
import { buildCatalogTrail } from '../utils/marketplaceBreadcrumbs';
=======
import { buildAnalyticsMarketplaceTrail, resolveMarketplaceStage } from '../utils/marketplaceBreadcrumbs';
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose
import { assetDetails } from '../mocks/analyticsMarketplace.mock';
import type { AssetDetail } from '../mocks/analyticsMarketplace.mock';

const typeIcons: Record<string, React.ReactNode> = {
  Dashboard: <BarChart3 className="h-4 w-4 text-blue-600" strokeWidth={1.5} />,
  Report: <FileBarChart className="h-4 w-4 text-purple-600" strokeWidth={1.5} />,
  View: <BarChart3 className="h-4 w-4 text-teal-600" strokeWidth={1.5} />,
};

const typeColors: Record<string, string> = {
  Dashboard: 'bg-blue-50 text-blue-700 border-blue-200',
  Report: 'bg-purple-50 text-purple-700 border-purple-200',
  View: 'bg-teal-50 text-teal-700 border-teal-200',
};

const CHART_COLORS = ['#FB5535', '#030F35', '#5F607F', '#D8D9E6'];

function MiniBar({ data, labels, height = 100 }: { data: number[]; labels?: string[]; height?: number }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-secondary transition-all"
            style={{ height: `${(v / max) * 100}%` }}
            title={`${labels?.[i] || i}: ${v}`}
          />
        ))}
      </div>
      {labels && (
        <div className="mt-1.5 flex gap-1">
          {labels.map((label, i) => (
            <span key={i} className="flex-1 truncate text-center font-mono text-[8px] uppercase tracking-[0.08em] text-text-disabled">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniLine({ data, labels, height = 100 }: { data: number[]; labels?: string[]; height?: number }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${((1 - (v - min) / range) * 100)}`).join(' ');
  const yTicks = [min, Math.round((min + max) / 2), max];
  return (
    <div className="flex gap-2">
      <div className="flex flex-col justify-between py-0.5">
        {yTicks.map((tick) => (
          <span key={tick} className="font-mono text-[8px] leading-none text-text-disabled">
            {tick}
          </span>
        ))}
      </div>
      <div className="flex-1">
        <svg viewBox="0 0 100 80" className="w-full" style={{ height }}>
          <polyline
            points={points}
            fill="none"
            stroke="#FB5535"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((v, i) => {
            const cx = (i / (data.length - 1)) * 100;
            const cy = (1 - (v - min) / range) * 100;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="2"
                fill="#FB5535"
                className="transition-all hover:r-3"
              />
            );
          })}
        </svg>
        {labels && (
          <div className="-mt-1 flex gap-1">
            {labels.map((label, i) => (
              <span key={i} className="flex-1 truncate text-center font-mono text-[8px] uppercase tracking-[0.08em] text-text-disabled">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniDonut({ data, labels }: { data: number[]; labels?: string[] }) {
  const total = data.reduce((a, b) => a + b, 1);
  const segmentAngles = data.map((v) => (v / total) * 360);
  let cumulative = 0;
  const segments = segmentAngles.map((angle) => {
    const start = cumulative;
    cumulative += angle;
    return { start, end: cumulative, angle };
  });

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const x1 = cx + r * Math.cos((startAngle - 90) * (Math.PI / 180));
    const y1 = cy + r * Math.sin((startAngle - 90) * (Math.PI / 180));
    const x2 = cx + r * Math.cos((endAngle - 90) * (Math.PI / 180));
    const y2 = cy + r * Math.sin((endAngle - 90) * (Math.PI / 180));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 42 42" className="h-24 w-24">
        {segments.map((seg, i) => (
          <path
            key={i}
            d={describeArc(21, 21, 15, seg.start, seg.end)}
            fill="none"
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth="5"
            strokeLinecap="butt"
          />
        ))}
        <circle cx="21" cy="21" r="9" fill="white" />
      </svg>
      {labels && (
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-[11px] font-medium text-text-secondary">{label}</span>
              <span className="font-mono text-[10px] text-text-disabled">{data[i]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RelatedAssetCard({ slug, detail }: { slug: string; detail: AssetDetail }) {
  const navigate = useNavigate();
  const { asset } = detail;
  const typeColorClass = typeColors[asset.type] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <button
      type="button"
      onClick={() => navigate(`/marketplace/drive/analytics-marketplace/${slug}`)}
      className="group flex flex-col rounded-xl border border-border-default bg-white p-4 text-left transition hover:border-secondary/30 hover:shadow-sm"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider ${typeColorClass}`}>
          {asset.type}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-text-disabled">
          {asset.category}
        </span>
      </div>
      <h4 className="text-[13px] font-bold leading-snug text-primary group-hover:text-secondary">
        {asset.name}
      </h4>
      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-text-muted">
        {asset.purpose}
      </p>
    </button>
  );
}

function renderChart(chart: { title: string; type: string; data: number[]; labels?: string[] }) {
  const { title, type, data, labels } = chart;
  let chartEl: React.ReactNode;
  if (type === 'bar') {
    chartEl = <MiniBar data={data} labels={labels} />;
  } else if (type === 'line') {
    chartEl = <MiniLine data={data} labels={labels} />;
  } else if (type === 'donut') {
    chartEl = <MiniDonut data={data} labels={labels} />;
  } else {
    chartEl = <div className="flex items-center justify-center h-20 text-text-muted text-[11px]">{data.join(', ')}</div>;
  }

  return (
    <div key={title} className="rounded-lg border border-border-default bg-white p-4">
      <h4 className="mb-3 text-[12px] font-semibold text-text-secondary">{title}</h4>
      {chartEl}
    </div>
  );
}

export function AnalyticsDetailsPage() {
  const { assetSlug } = useParams<{ assetSlug: string }>();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { activePersona } = usePersona();
=======
  const [searchParams] = useSearchParams();
  const { activePersona } = usePersona();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'drive');
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose

  const detail = assetSlug ? assetDetails[assetSlug] : undefined;

  if (!detail) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-primary">Asset not found</h2>
        <p className="mt-2 text-sm text-text-muted">The analytics asset you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/marketplace/drive/analytics-marketplace')}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-[13px] font-semibold text-white hover:bg-secondary/90"
        >
          Back to Analytics Marketplace
        </button>
      </div>
    );
  }

  const { asset, metrics, charts } = detail;
  const isPermitted = asset.roleAccess.includes(activePersona.role);
  const typeIcon = typeIcons[asset.type] || null;
  const typeColorClass = typeColors[asset.type] || 'bg-gray-50 text-gray-700 border-gray-200';

  const metaItems = [
    { label: 'Category', value: asset.category },
    { label: 'Owner', value: asset.owner },
    { label: 'Data Scope', value: asset.dataScope },
    { label: 'Refresh', value: asset.refreshRhythm },
    { label: 'Last Updated', value: asset.lastUpdated },
  ];

  const handleOpenDestination = () => {
    navigate(`/analytics/${asset.slug}`);
  };

  const handleDownload = () => {
    toast.success(`Downloading ${asset.name} report (MVP simulated download)`);
  };

  const handleRequestNewReport = () => {
    toast.success(`Request submitted for a new report based on ${asset.name}`);
  };

  const openLabel =
    asset.type === 'Dashboard' ? 'Open Dashboard'
    : asset.type === 'Report' ? 'Open Report'
    : 'Open View';

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-8" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <MarketplaceDetailHeader
<<<<<<< HEAD
        breadcrumbItems={[
          ...buildCatalogTrail('drive', 'Analytics Marketplace'),
          { label: asset.name },
        ]}
=======
        breadcrumbItems={buildAnalyticsMarketplaceTrail(stage, { label: asset.name })}
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose
        title={asset.name}
        eyebrow={
          <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${typeColorClass}`}>
            {typeIcon}
            {asset.type}
          </span>
        }
        lede={asset.purpose}
        meta={
          <>
            {metaItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-text-disabled">{item.label}</span>
                <span className="text-[13px] font-medium text-text-secondary">{item.value}</span>
              </div>
            ))}
          </>
        }
      />

      {!isPermitted && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <Lock className="h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.5} />
          <p className="text-[13px] font-medium text-amber-800">
            This {asset.type.toLowerCase()} is restricted for your current role ({activePersona.role}). Preview data is limited.
          </p>
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border border-border-default bg-white p-4">
            <div className="text-[11px] font-medium uppercase tracking-wider text-text-disabled">{m.label}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[24px] font-bold text-primary">{m.value}</span>
              {m.direction === 'up' && <span className="text-[13px] text-green-600">↑</span>}
              {m.direction === 'down' && <span className="text-[13px] text-red-600">↓</span>}
            </div>
          </div>
        ))}
      </div>

      {charts.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-[15px] font-bold text-primary">Sample Charts Preview</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {charts.map((chart) => renderChart(chart))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-6">
        <button
          type="button"
          onClick={handleOpenDestination}
          disabled={!isPermitted}
          className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          {openLabel}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!isPermitted}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-white px-5 py-2.5 text-[13px] font-semibold text-text-secondary transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} />
          Download Report
        </button>
        <button
          type="button"
          onClick={handleRequestNewReport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-white px-5 py-2.5 text-[13px] font-semibold text-text-secondary transition hover:bg-surface"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Request New Report
        </button>
      </div>

      {detail.relatedAssets.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-[15px] font-bold text-primary">Related Assets</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {detail.relatedAssets.map((slug) => {
              const relatedDetail = assetDetails[slug];
              if (!relatedDetail) return null;
              return <RelatedAssetCard key={slug} slug={slug} detail={relatedDetail} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
