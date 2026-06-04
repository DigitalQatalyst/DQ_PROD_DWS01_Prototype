import React from 'react';
import { ArrowLeft, CalendarDays, ChevronRight, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { stage0HomeRoutes, stage0PlatformUpdateRoute } from '../config/stage0HomeRoutes';

const updates = [
  {
    id: 'pu-1',
    title: "DWS01 Q2 Platform Release - What's New",
    date: 'May 10, 2024',
    audience: 'All DWS01 users',
    summary:
      'New marketplace routing cues, cleaner request states, and improved workspace visibility are now available in this prototype release.',
    highlights: ['Updated home routing surfaces', 'Refined request and review states', 'Sharper workspace visibility cues']
  },
  {
    id: 'pu-2',
    title: 'Upcoming Maintenance Window - May 18',
    date: 'May 08, 2024',
    audience: 'Requesters, support, and admin users',
    summary:
      'Scheduled maintenance will affect request creation, notifications, and selected admin workflows during the planned service window.',
    highlights: ['Planned start: 10:00 PM GST', 'Expected duration: 4 hours', 'Request submission resumes after validation checks']
  },
  {
    id: 'pu-3',
    title: 'New Onboarding Resources Available',
    date: 'May 06, 2024',
    audience: 'New joiners and hiring teams',
    summary:
      'Fresh onboarding guidance has been published to help new joiners complete readiness, support, and first-action steps faster.',
    highlights: ['Expanded first-week guidance', 'Readiness checklist references', 'Updated onboarding support paths']
  }
];

export function Stage0PlatformUpdatesPage() {
  const navigate = useNavigate();
  const { updateId } = useParams();
  const selectedUpdate = updateId ? updates.find((update) => update.id === updateId) : undefined;

  if (updateId && !selectedUpdate) {
    return (
      <div className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-border-subtle bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Update not found</h1>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            The requested platform update does not exist in this prototype.
          </p>
          <button
            type="button"
            onClick={() => navigate(stage0HomeRoutes.platformUpdates)}
            className="mt-6 rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            View all updates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-12">
      <section className="rounded-2xl border border-border-subtle bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">Platform Updates</p>
            <h1 className="mt-2 text-[28px] font-bold text-primary">
              {selectedUpdate ? selectedUpdate.title : 'Platform Update Centre'}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-text-muted">
              {selectedUpdate
                ? selectedUpdate.summary
                : 'Review current release notes, maintenance windows, and onboarding updates from a real Stage 0 interface.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/stage-0/orientation')}
            className="inline-flex items-center gap-2 rounded-button border border-border-default bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-surface"
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Return to Home
          </button>
        </div>

        {selectedUpdate ? (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <div className="inline-flex items-center gap-2 rounded-pill bg-surface px-3 py-1.5">
                <CalendarDays size={16} strokeWidth={1.7} />
                {selectedUpdate.date}
              </div>
              <div className="rounded-pill bg-orange-50 px-3 py-1.5 text-secondary">{selectedUpdate.audience}</div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {selectedUpdate.highlights.map((highlight) => (
                <div key={highlight} className="rounded-xl border border-border-subtle bg-surface p-4 text-sm leading-6 text-text-secondary">
                  {highlight}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(stage0HomeRoutes.platformUpdates)}
                className="rounded-button border border-border-default bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-surface"
              >
                Back to updates
              </button>
              <button
                type="button"
                onClick={() => navigate('/workspace/notifications')}
                className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Open notifications
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {updates.map((update) => (
              <button
                key={update.id}
                type="button"
                onClick={() => navigate(stage0PlatformUpdateRoute(update.id))}
                className="flex items-start justify-between gap-4 rounded-xl border border-border-subtle bg-surface p-5 text-left transition hover:border-border-default hover:bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-secondary shadow-sm">
                    <FileText size={18} strokeWidth={1.7} />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-primary">{update.title}</div>
                    <div className="mt-1 text-xs font-medium text-text-muted">{update.date}</div>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">{update.summary}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="mt-1 shrink-0 text-text-muted" strokeWidth={1.8} />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
