import React from 'react';
import { ChevronRight, Clock, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '../../context/PersonaContext';
import { todaysBrief } from '../../mocks/stage0Home.mock';

export function TodaysBriefPanel() {
  const navigate = useNavigate();
  const { activePersona } = usePersona();
  const canOpenRequestStatus = ['associate', 'hra', 'admin', 'support'].includes(activePersona.id);

  return (
    <article className="animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-dq-orange hover:shadow-dq-hover lg:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.45fr)_1px_minmax(280px,0.9fr)_minmax(220px,0.65fr)] lg:items-center">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-secondary">
            <Sparkles size={21} strokeWidth={1.7} />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-dq-navy">Today&apos;s Brief</h3>
            <p className="mt-2 max-w-[560px] text-sm leading-6 text-text-secondary">{todaysBrief.summary}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(canOpenRequestStatus ? '/requests/REQ-2401/status' : '/workspace/my-requests')}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-dq-navy px-5 text-sm font-semibold text-white transition hover:bg-dq-navy/90"
                style={{ boxShadow: 'var(--glow-navy-md)' }}
              >
                Open recommended item
                <ChevronRight size={15} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={() => navigate('/workspace')}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#c5cde8] bg-white px-5 text-sm font-semibold text-dq-navy transition hover:border-[#a0aacc] hover:bg-surface"
              >
                View full brief
                <ChevronRight size={15} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
        <div className="hidden h-full w-px bg-border-subtle lg:block" />
        <div className="rounded-xl bg-surface px-4 py-3 lg:px-5">
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
    </article>
  );
}
