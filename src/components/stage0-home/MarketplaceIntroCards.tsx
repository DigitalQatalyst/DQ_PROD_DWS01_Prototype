import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight, Compass, LayoutTemplate, Rocket } from 'lucide-react';
import { marketplaceIntroCards } from '../../mocks/stage0Home.mock';

const icons = {
  discern: Compass,
  design: LayoutTemplate,
  deploy: Rocket,
  drive: BarChart3
};

export function MarketplaceIntroCards() {
  const navigate = useNavigate();

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-semibold text-primary">Explore DWS Marketplaces</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {marketplaceIntroCards.map((card) => {
          const Icon = icons[card.id as keyof typeof icons] ?? Compass;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => navigate(card.route)}
              className="flex items-start gap-4 rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-default hover:shadow-md"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.accentClass}`}>
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold text-primary">{card.title}</h3>
                <p className="mt-1 text-sm leading-6 text-text-muted">{card.description}</p>
              </div>
              <ChevronRight size={18} className="mt-1 shrink-0 text-text-muted" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
