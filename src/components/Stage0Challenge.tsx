import React from 'react';
import { AlertCircle, FileQuestion, Activity } from 'lucide-react';
export function Stage0Challenge() {
  return <section className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
          THE CHALLENGE
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
          Work breaks when context is scattered.
        </h2>
        <p className="text-text-secondary max-w-3xl text-lg">
          When ownership, decisions, evidence, and updates live in different
          places, execution becomes harder to trust.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-card p-6 border border-border-default shadow-sm">
          <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-secondary mb-4">
            <AlertCircle size={18} />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            Ownership gets unclear
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Work moves through chats, meetings, and follow-ups without one
            visible owner, output, or closure rule.
          </p>
        </div>

        <div className="bg-white rounded-card p-6 border border-border-default shadow-sm">
          <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-secondary mb-4">
            <FileQuestion size={18} />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            Decisions lose their trail
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Approvals, escalations, and rationale sit outside the work they
            affect.
          </p>
        </div>

        <div className="bg-white rounded-card p-6 border border-border-default shadow-sm">
          <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-secondary mb-4">
            <Activity size={18} />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            Progress becomes hard to trust
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Teams rely on manual updates to understand what is moving, blocked,
            late, or ready to close.
          </p>
        </div>
      </div>
    </section>;
}