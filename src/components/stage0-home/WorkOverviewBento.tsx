import React from 'react';
import { toast } from 'sonner';
import { workOverviewCards } from '../../mocks/stage0Home.mock';

function toneClass(tone?: 'default' | 'high' | 'medium') {
  if (tone === 'high') return 'bg-danger-surface text-danger-text';
  if (tone === 'medium') return 'bg-warning-surface text-warning-text';
  return 'bg-surface text-text-muted';
}

export function WorkOverviewBento() {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-xl font-semibold text-primary">Work Overview</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {workOverviewCards.map((card) => (
          <article
            key={card.id}
            className="flex flex-col rounded-card border border-border-subtle bg-white p-6 shadow-sm"
          >
            <div className="mb-4">
              <h3 className="text-[15px] font-semibold text-primary">{card.title}</h3>
              <p className="mt-1 text-sm font-medium text-text-secondary">{card.headline}</p>
            </div>
            <ul className="flex-1 space-y-3">
              {card.items.map((item) => (
                <li
                  key={`${card.id}-${item.label}`}
                  className="flex items-start justify-between gap-3 border-b border-border-subtle pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-text-secondary">{item.label}</span>
                  {item.meta && (
                    <span
                      className={`shrink-0 rounded-pill px-2 py-0.5 text-[11px] font-semibold ${toneClass(item.tone)}`}
                    >
                      {item.meta}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => toast.info(`${card.footerAction} opened for this prototype.`)}
              className="mt-5 text-left text-sm font-semibold text-info-text hover:underline"
            >
              {card.footerAction}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
