import React from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { BarChart3, Target } from 'lucide-react';
import { MARKETPLACE_4D_DESTINATIONS } from '../config/marketplace4dRoutes';
=======
import { BarChart3, LineChart, ShieldCheck, Sparkles, Target } from 'lucide-react';
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose
import { MarketplaceEyebrowTrail } from '../components/marketplace/MarketplaceEyebrowTrail';
import { MARKETPLACE_ROOT } from '../utils/marketplaceBreadcrumbs';

const driveCards = [
  {
    id: 'analytics-marketplace',
    label: 'Analytics Marketplace',
<<<<<<< HEAD
    description:
      'Discover governed dashboards, reports, and views. Preview metrics and charts before opening the live destination.',
=======
    description: 'Discover governed dashboards, reports, and views. Preview metrics and charts before opening the live destination.',
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose
    icon: BarChart3,
    route: '/marketplace/drive/analytics-marketplace',
    color: 'bg-orange-50 text-orange-600 border-orange-200',
  },
  {
<<<<<<< HEAD
    id: 'tracker-marketplace',
    label: 'Tracker Marketplace',
    description:
      'Discover available trackers, monitoring views, and governed tracking templates used across DWS.',
    icon: Target,
    route: MARKETPLACE_4D_DESTINATIONS.trackerMarketplace,
    color: 'bg-green-50 text-green-600 border-green-200',
  },
=======
    id: 'performance-dashboards',
    label: 'Performance Dashboards',
    description: 'Personal, team, unit, SLA, governance, and executive performance views.',
    icon: LineChart,
    route: '/marketplace/analytics-discovery?from=drive',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    id: 'governance-reviews',
    label: 'Governance Reviews',
    description: 'Audit exceptions, policy compliance, and governance risk signals.',
    icon: ShieldCheck,
    route: '/executive/enterprise-execution',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    id: 'strategic-initiatives',
    label: 'Strategic Initiatives Tracker',
    description: 'Enterprise execution health, strategic initiatives, and value delivery.',
    icon: Target,
    route: '/executive/strategic-initiatives',
    color: 'bg-green-50 text-green-600 border-green-200',
  },
  {
    id: 'ai-report-generator',
    label: 'AI Status Report Generator',
    description: 'Generate AI-powered status reports for teams, units, and enterprise views.',
    icon: Sparkles,
    route: '',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose
];

export function DriveMarketplacePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8">
<<<<<<< HEAD
      <header className="mb-8">
        <MarketplaceEyebrowTrail items={[MARKETPLACE_ROOT, { label: 'Drive' }]} />
        <h1 className="dq-page-title">Drive Marketplace</h1>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-text-secondary">
          Monitor and improve execution through governed analytics assets, dashboards, and performance tools.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {driveCards.map((card) => {
          const Icon = card.icon;
=======
      <MarketplaceEyebrowTrail
        items={[MARKETPLACE_ROOT, { label: 'Drive' }]}
        className="mb-4"
      />

      <h1 className="dq-page-title">Drive Marketplace</h1>
      <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-text-secondary">
        Monitor and improve execution through governed analytics assets, dashboards, and performance tools.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {driveCards.map((card) => {
          const Icon = card.icon;
          const isPlaceholder = !card.route;
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose
          return (
            <button
              key={card.id}
              type="button"
<<<<<<< HEAD
              onClick={() => navigate(card.route)}
              className="group relative flex flex-col rounded-xl border border-border-default bg-white p-5 text-left transition hover:border-secondary/30 hover:shadow-sm"
=======
              onClick={() => {
                if (card.route) navigate(card.route);
              }}
              disabled={isPlaceholder}
              className={`group relative flex flex-col rounded-xl border bg-white p-5 text-left transition ${
                isPlaceholder
                  ? 'cursor-default border-dashed border-border-default opacity-70'
                  : 'border-border-default hover:border-secondary/30 hover:shadow-sm'
              }`}
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                <Icon size={22} strokeWidth={1.5} />
              </div>

              <h3 className="text-[15.5px] font-bold text-primary">{card.label}</h3>
              <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-text-muted">
                {card.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-disabled">
<<<<<<< HEAD
                  Explore →
=======
                  {isPlaceholder ? 'Coming soon' : 'Explore →'}
>>>>>>> origin/Feat/AnalyticsMarketplace-Rose
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
