import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Target } from 'lucide-react';
import { MARKETPLACE_4D_DESTINATIONS } from '../config/marketplace4dRoutes';
import { MarketplaceEyebrowTrail } from '../components/marketplace/MarketplaceEyebrowTrail';
import { MARKETPLACE_ROOT } from '../utils/marketplaceBreadcrumbs';

const driveCards = [
  {
    id: 'analytics-marketplace',
    label: 'Analytics Marketplace',
    description:
      'Discover governed dashboards, reports, and views. Preview metrics and charts before opening the live destination.',
    icon: BarChart3,
    route: '/marketplace/drive/analytics-marketplace',
    color: 'bg-orange-50 text-orange-600 border-orange-200',
  },
  {
    id: 'tracker-marketplace',
    label: 'Tracker Marketplace',
    description:
      'Discover available trackers, monitoring views, and governed tracking templates used across DWS.',
    icon: Target,
    route: MARKETPLACE_4D_DESTINATIONS.trackerMarketplace,
    color: 'bg-green-50 text-green-600 border-green-200',
  },
];

export function DriveMarketplacePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8">
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
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => navigate(card.route)}
              className="group relative flex flex-col rounded-xl border border-border-default bg-white p-5 text-left transition hover:border-secondary/30 hover:shadow-sm"
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
                  Explore →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
