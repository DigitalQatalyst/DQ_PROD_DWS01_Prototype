import React from 'react';
import { CheckSquare, Inbox, Shield, BarChart2 } from 'lucide-react';
export function Stage0PlatformValue() {
  return <section className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
          THE PLATFORM
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
          The execution layer for DQ work.
        </h2>
        <p className="text-text-secondary max-w-3xl text-lg">
          DWS.01 connects daily work to the structure needed to move it:
          ownership, requests, approvals, evidence, knowledge, SLAs, and
          role-based visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary rounded-card p-8 shadow-md">
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-secondary mb-5">
            <CheckSquare size={20} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">
            Structured work
          </h3>
          <p className="text-navy-200 leading-relaxed">
            Every task carries owner, output, checklist, SLA, blocker state,
            evidence, and closure criteria.
          </p>
        </div>

        <div className="bg-white rounded-card p-8 border border-border-default shadow-sm">
          <div className="w-10 h-10 rounded bg-surface flex items-center justify-center text-primary mb-5">
            <Inbox size={20} />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-3">
            Guided requests
          </h3>
          <p className="text-text-secondary leading-relaxed">
            Internal needs move through service categories, required inputs,
            fulfilment owners, and SLA-backed routing.
          </p>
        </div>

        <div className="bg-white rounded-card p-8 border border-border-default shadow-sm">
          <div className="w-10 h-10 rounded bg-surface flex items-center justify-center text-primary mb-5">
            <Shield size={20} />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-3">
            Traceable decisions
          </h3>
          <p className="text-text-secondary leading-relaxed">
            Approvals, escalations, handoffs, rationale, timestamps, and audit
            history stay attached to the work.
          </p>
        </div>

        <div className="bg-white rounded-card p-8 border border-border-default shadow-sm">
          <div className="w-10 h-10 rounded bg-surface flex items-center justify-center text-primary mb-5">
            <BarChart2 size={20} />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-3">
            Execution visibility
          </h3>
          <p className="text-text-secondary leading-relaxed">
            Associates, leads, HRA, support, admins, and leadership see the
            signals that matter to their role.
          </p>
        </div>
      </div>
    </section>;
}