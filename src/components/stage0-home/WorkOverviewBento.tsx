import React from 'react';
import { useNavigate } from 'react-router-dom';
import { stage0WorkspaceRouteForPersona } from '../../config/stage0HomeRoutes';
import { usePersona } from '../../context/PersonaContext';
import { workOverviewCards } from '../../mocks/stage0Home.mock';

function toneClass(tone?: 'default' | 'high' | 'medium') {
  if (tone === 'high') return 'bg-danger-surface text-danger-text';
  if (tone === 'medium') return 'bg-warning-surface text-warning-text';
  return 'bg-surface text-text-muted';
}

const delayClasses = ['animation-delay-100', 'animation-delay-200', 'animation-delay-300', 'animation-delay-500'] as const;

export function WorkOverviewBento() {
  const navigate = useNavigate();
  const { activePersona } = usePersona();
  const workspaceRoute = stage0WorkspaceRouteForPersona(activePersona.id);

  const routeForCard = (id: string) => {
    if (id === 'assigned') return workspaceRoute;
    if (id === 'requests') return '/workspace/my-requests';
    if (id === 'activity') return '/workspace/notifications';
    return '/workspace';
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {workOverviewCards.map((card, index) => (
        <article
          key={card.id}
          className={`animate-fade-in-up ${delayClasses[index] ?? ''} flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-dq-orange hover:shadow-dq-hover`}
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-dq-navy">{card.title}</h3>
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
            onClick={() => navigate(routeForCard(card.id))}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-info-text hover:underline"
          >
            {card.footerAction}
          </button>
        </article>
      ))}
    </div>
  );
}
