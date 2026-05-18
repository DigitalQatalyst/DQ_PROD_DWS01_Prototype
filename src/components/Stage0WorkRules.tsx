import React from 'react';
import { workRules } from '../mocks/stage0.mock';
import { Shield } from 'lucide-react';
export function Stage0WorkRules() {
  return <section className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-navy-50 flex items-center justify-center text-primary">
          <Shield size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">
            Work Rules Snapshot
          </h2>
          <p className="text-sm text-text-secondary">
            Core principles of the Good Health Code.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {workRules.map((rule) => <div key={rule.id} className="bg-surface rounded-card p-5 border border-border-subtle">
            <div className="text-xs font-bold text-secondary mb-2">
              RULE {rule.id}
            </div>
            <h4 className="text-sm font-semibold text-primary mb-2 leading-tight">
              {rule.title}
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              {rule.description}
            </p>
          </div>)}
      </div>
    </section>;
}