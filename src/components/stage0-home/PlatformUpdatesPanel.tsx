import React from 'react';
import { useNavigate } from 'react-router-dom';
import { platformUpdates } from '../../mocks/stage0Home.mock';

export function PlatformUpdatesPanel() {
  const navigate = useNavigate();

  return (
    <article className="animate-fade-in-up h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-dq-orange hover:shadow-dq-hover">
      <h2 className="text-lg font-semibold text-dq-navy">Platform Updates</h2>
      <ul className="mt-5 space-y-4">
        {platformUpdates.map((update) => (
          <li key={update.id}>
            <button
              type="button"
              onClick={() => navigate('/workspace/notifications')}
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
        onClick={() => navigate('/workspace/notifications')}
        className="mt-5 text-sm font-semibold text-info-text hover:underline"
      >
        View all updates
      </button>
    </article>
  );
}
