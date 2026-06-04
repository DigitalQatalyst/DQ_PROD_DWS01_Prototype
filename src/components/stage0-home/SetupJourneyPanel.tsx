import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { setupJourneyCards, type SetupCardStatus } from '../../mocks/stage0Home.mock';

const statusStyles: Record<
  SetupCardStatus,
  { pill: string; label: string }
> = {
  completed: { pill: 'bg-success-surface text-success-text', label: 'Completed' },
  'in-progress': { pill: 'bg-info-surface text-info-text', label: 'In progress' },
  'not-started': { pill: 'bg-orange-50 text-secondary', label: 'Not started' }
};

export function SetupJourneyPanel() {
  const navigate = useNavigate();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const updateRailState = () => {
      const cardElements = Array.from(rail.querySelectorAll<HTMLElement>('[data-setup-card="true"]'));
      const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0);
      const isAtStart = rail.scrollLeft <= 8;
      const isAtEnd = rail.scrollLeft >= maxScrollLeft - 8;
      const hasOverflow = maxScrollLeft > 8;
      const nextActivePage = hasOverflow && !isAtStart ? 1 : 0;

      setActivePage(nextActivePage);
      setCanScrollPrev(!isAtStart);
      setCanScrollNext(!isAtEnd);
    };

    updateRailState();
    rail.addEventListener('scroll', updateRailState, { passive: true });
    window.addEventListener('resize', updateRailState);

    return () => {
      rail.removeEventListener('scroll', updateRailState);
      window.removeEventListener('resize', updateRailState);
    };
  }, []);

  const handleCardClick = (id: string) => {
    if (id === 'platform-onboarding') {
      navigate('/onboarding');
      return;
    }
    if (id === 'access-tools') {
      toast.info('Access request flow opens from the service catalogue in this prototype.');
      return;
    }
    if (id === 'first-checklist') {
      toast.info('First action checklist drawer opened for this prototype.');
      return;
    }
    toast.info('Workspace setup profile opened for this prototype.');
  };

  const scrollToCard = (index: number) => {
    const rail = railRef.current;
    if (!rail) return;

    const cardElements = Array.from(rail.querySelectorAll<HTMLElement>('[data-setup-card="true"]'));
    const targetCard = cardElements[index];
    if (!targetCard) return;
    const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0);
    const targetLeft = Math.min(targetCard.offsetLeft, maxScrollLeft);

    rail.scrollTo({
      left: targetLeft,
      behavior: 'smooth'
    });
  };

  const handleScrollStep = (direction: 'prev' | 'next') => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0);
    const targetLeft = direction === 'next' ? maxScrollLeft : 0;

    rail.scrollTo({
      left: targetLeft,
      behavior: 'smooth'
    });
  };

  const scrollToPage = (page: number) => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0);
    rail.scrollTo({
      left: page === 0 ? 0 : maxScrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-xl font-semibold text-primary">Setup Journey</h2>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-text-muted">Setup progress: 2 of 6 steps complete</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScrollStep('prev')}
              disabled={!canScrollPrev}
              aria-label="Previous setup step"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-white text-primary shadow-sm transition hover:border-border-default hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => handleScrollStep('next')}
              disabled={!canScrollNext}
              aria-label="Next setup step"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-white text-primary shadow-sm transition hover:border-border-default hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-pill bg-border-subtle">
        <div className="h-full w-[33%] rounded-pill bg-secondary" />
      </div>
      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 hide-scrollbar"
        aria-label="Setup journey steps"
      >
        {setupJourneyCards.map((card) => {
          const style = statusStyles[card.status];
          return (
            <button
              key={card.id}
              data-setup-card="true"
              type="button"
              onClick={() => handleCardClick(card.id)}
              className="flex min-h-[228px] w-[min(100%,330px)] shrink-0 snap-start flex-col rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-default hover:shadow-md sm:w-[320px] lg:w-[332px]"
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                {card.status === 'completed' ? (
                  <CheckCircle2 size={22} className="text-success" />
                ) : (
                  <Circle size={22} className="text-text-disabled" />
                )}
                <span className={`rounded-pill px-2.5 py-0.5 text-[11px] font-semibold ${style.pill}`}>
                  {style.label}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold text-primary">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-text-muted">{card.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-text-muted">{card.progressLabel}</span>
                {card.actionLabel ? (
                  <span className="text-xs font-semibold text-secondary">{card.actionLabel}</span>
                ) : (
                  <ChevronRight size={16} className="text-text-muted" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {[0, 1].map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => scrollToPage(page)}
            aria-label={page === 0 ? 'Go to first setup steps' : 'Go to final setup steps'}
            aria-pressed={activePage === page}
            className={`h-2.5 rounded-full transition-all ${
              activePage === page ? 'w-7 bg-secondary' : 'w-2.5 bg-border-default hover:bg-border-strong'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
