import React from 'react';
import { ChevronRight, Clock, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { todaysBrief } from '../../mocks/stage0Home.mock';

export function TodaysBriefPanel() {
  return (
    <section className="mt-4 rounded-card border border-navy-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.45fr)_1px_minmax(280px,0.9fr)_minmax(220px,0.65fr)] lg:items-center">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-secondary">
            <Sparkles size={21} strokeWidth={1.7} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold text-primary">Today&apos;s Brief</h2>
            <p className="mt-2 max-w-[560px] text-sm leading-6 text-text-secondary">{todaysBrief.summary}</p>
            <div className="mt-4 flex flex-wrap gap-5">
              <button
                type="button"
                onClick={() =>
                  toast.info(`Opening recommended item ${todaysBrief.recommendedItemId} for this prototype.`)
                }
                className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:underline"
              >
                Open recommended item
                <ChevronRight size={15} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={() => toast.info("Today's full brief drawer opened for this prototype.")}
                className="inline-flex items-center gap-2 text-sm font-bold text-info-text hover:underline"
              >
                View full brief
                <ChevronRight size={15} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
        <div className="hidden h-full w-px bg-border-subtle lg:block" />
        <div className="rounded-xl bg-white px-0 py-1 lg:px-2">
          <p className="text-xs font-bold uppercase tracking-wider text-info-text">Recommended next step</p>
          <p className="mt-2 text-sm font-medium leading-6 text-primary">{todaysBrief.recommendedNextStep}</p>
        </div>
        <div className="space-y-4 text-xs font-medium leading-5 text-text-muted lg:pl-2">
          <p className="flex items-start gap-3">
            <RefreshCw size={16} className="mt-0.5 shrink-0 text-text-muted" strokeWidth={1.6} />
            <span>{todaysBrief.sourceContext}</span>
          </p>
          <p className="flex items-center gap-3">
            <Clock size={16} className="shrink-0 text-text-muted" strokeWidth={1.6} />
            <span>{todaysBrief.updatedAt}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
