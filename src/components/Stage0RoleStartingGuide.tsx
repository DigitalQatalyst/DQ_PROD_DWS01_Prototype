import React from 'react';
import type { Persona } from '../types/platform';
import { roleGuides } from '../mocks/stage0.mock';
import { BookOpen, CheckCircle2, Target } from 'lucide-react';
interface Stage0RoleStartingGuideProps {
  activePersona: Persona;
}
export function Stage0RoleStartingGuide({
  activePersona
}: Stage0RoleStartingGuideProps) {
  const guide = roleGuides[activePersona.id] || roleGuides['associate'];
  return <div className="bg-white rounded-card border border-border-default p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary mb-1">
          Role starting guide: {activePersona.role}
        </h3>
        <p className="text-sm text-text-secondary">{guide.purpose}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <Target size={16} className="text-secondary" />
            Key Actions
          </h4>
          <ul className="space-y-2">
            {guide.keyActions.map((action, i) => <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                <span>{action}</span>
              </li>)}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-secondary" />
            Recommended Reading
          </h4>
          <div className="p-4 rounded bg-surface border border-border-subtle mb-6">
            <p className="text-sm font-medium text-primary">
              {guide.recommendedGuide}
            </p>
            <button className="text-xs font-semibold text-secondary mt-2 hover:underline">
              Read guide &rarr;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {guide.metrics.map((metric, i) => <div key={i} className="text-center">
                <div className="text-xl font-bold text-primary">
                  {metric.value}
                </div>
                <div className="text-xs text-text-muted">{metric.label}</div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}