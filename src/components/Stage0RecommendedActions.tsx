import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertOctagon, Inbox, CheckSquare, BookOpen, ArrowRight, BoxIcon } from 'lucide-react';
import { Persona } from '../types/platform';
interface Stage0RecommendedActionsProps {
  activePersona: Persona;
}
interface RecommendedAction {
  title: string;
  description: string;
  icon: BoxIcon;
  route: string;
}
export function Stage0RecommendedActions({
  activePersona
}: Stage0RecommendedActionsProps) {
  const navigate = useNavigate();
  const actions: RecommendedAction[] = [{
    title: 'Review assigned tasks',
    description: 'Open tasks awaiting your update or closure.',
    icon: ClipboardList,
    route: '/workspace/my-tasks'
  }, {
    title: 'Resolve blockers',
    description: 'Named, owned obstacles waiting for action.',
    icon: AlertOctagon,
    route: '/workspace/my-tasks'
  }, {
    title: 'Submit a request',
    description: 'Raise a governed service request.',
    icon: Inbox,
    route: '/marketplaces/services'
  }, {
    title: 'Review pending approvals',
    description: 'Decisions waiting on your rationale.',
    icon: CheckSquare,
    route: '/workspace/my-requests'
  }, {
    title: 'Open a knowledge guide',
    description: 'Find GHC references and playbooks.',
    icon: BookOpen,
    route: '/marketplaces/knowledge'
  }];
  return <section className="max-w-5xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-primary mb-1">
          Recommended Next Actions
        </h2>
        <p className="text-navy-600 text-sm">
          Tuned to {activePersona.role} — keep work owned, evidenced, and
          measurable.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {actions.map((action) => {
        const Icon = action.icon;
        return <button key={action.title} onClick={() => navigate(action.route)} className="group bg-white border border-border rounded-card p-4 text-left hover:border-primary/30 hover:bg-surface transition-all flex flex-col h-full">
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
                <Icon size={16} />
              </div>
              <h3 className="text-sm font-bold text-navy-900 mb-1 leading-snug">
                {action.title}
              </h3>
              <p className="text-xs text-navy-600 mb-3 leading-snug flex-grow">
                {action.description}
              </p>
              <span className="text-[11px] font-bold text-secondary inline-flex items-center gap-1 mt-auto">
                Open <ArrowRight size={12} />
              </span>
            </button>;
      })}
      </div>
    </section>;
}