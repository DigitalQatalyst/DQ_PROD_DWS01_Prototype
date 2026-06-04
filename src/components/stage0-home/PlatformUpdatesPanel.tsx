import React from 'react';
import { toast } from 'sonner';
import { platformUpdates } from '../../mocks/stage0Home.mock';

export function PlatformUpdatesPanel() {
  return (
    <article className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-primary">Platform Updates</h2>
      <ul className="mt-5 space-y-4">
        {platformUpdates.map((update) => (
          <li key={update.id}>
            <button
              type="button"
              onClick={() => toast.info(`Opening update: ${update.title}`)}
              className="w-full text-left"
            >
              <div className="text-sm font-semibold text-primary hover:text-info-text">{update.title}</div>
              <div className="mt-1 text-xs text-text-muted">{update.date}</div>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => toast.info('View all platform updates for this prototype.')}
        className="mt-5 text-sm font-semibold text-info-text hover:underline"
      >
        View all updates
      </button>
    </article>
  );
}
