import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Target } from 'lucide-react';
import { MarketplaceEyebrowTrail } from '../components/marketplace/MarketplaceEyebrowTrail';
import { MARKETPLACE_ROOT } from '../utils/marketplaceBreadcrumbs';

const driveCards = [
  {
    id: 'analytics-marketplace',
    label: 'Analytics Marketplace',
    description: 'Discover governed dashboards, reports, and views. Preview metrics and charts before opening the live destination.',
    icon: BarChart3,
    route: '/marketplace/drive/analytics-marketplace',
    iconClassName: 'bg-[#fff2ef] text-secondary',
  },
  {
    id: 'tracker-marketplace',
    label: 'Tracker Marketplace',
    description: 'Discover available trackers, monitoring views, and governed tracking templates used across DWS.',
    icon: Target,
    route: '/marketplace/drive/tracker-marketplace',
    iconClassName: 'bg-[#ebfbf1] text-success',
  },
];

export function DriveMarketplacePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-125px)] bg-[#f7f7fd]">
      <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-6 lg:px-8">
        <MarketplaceEyebrowTrail
          items={[MARKETPLACE_ROOT, { label: 'Drive' }]}
          className="mb-4"
        />

        <h1 className="text-[32px] font-bold leading-tight text-primary md:text-[36px]">Drive Marketplace</h1>
        <p className="mt-3 max-w-4xl text-[14px] leading-relaxed text-text-secondary">
          Monitor and improve execution through governed analytics assets, dashboards, and performance tools.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {driveCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => navigate(card.route)}
                className="group flex h-[218px] flex-col rounded-[10px] border border-border-default bg-white px-5 py-5 text-left transition hover:border-secondary/30 hover:shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 md:px-6"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-[13px] ${card.iconClassName}`}>
                  <Icon size={22} strokeWidth={1.6} />
                </div>

                <h2 className="text-[15.5px] font-bold leading-5 text-primary">{card.label}</h2>
                <p className="mt-2 flex-1 text-[12.5px] leading-[1.65] text-text-muted">
                  {card.description}
                </p>

                <div className="mt-4 border-t border-border-subtle pt-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-disabled">
                    Explore →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
