import React from 'react';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supportActionsNewJoiner, supportActionsReturning } from '../../mocks/stage0Home.mock';

interface SupportRequestsPanelProps {
  isNewJoiner: boolean;
}

export function SupportRequestsPanel({ isNewJoiner }: SupportRequestsPanelProps) {
  const actions = isNewJoiner ? supportActionsNewJoiner : supportActionsReturning;

  return (
    <article className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-primary">Support &amp; Requests</h2>
      <ul className="mt-5 space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <li key={action.id}>
              <button
                type="button"
                onClick={() => toast.info(`${action.label} opened for this prototype.`)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-surface"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.iconClass}`}>
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <span className="flex-1 text-sm font-semibold text-primary">{action.label}</span>
                <ChevronRight size={16} className="text-text-muted" />
              </button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
