import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, BookOpen, LayoutTemplate, Users, GraduationCap } from 'lucide-react';
export function Stage0MarketplaceGrid() {
  const navigate = useNavigate();
  const marketplaces = [{
    id: 'services',
    title: 'Services Marketplace',
    description: 'Submit and track operational requests',
    icon: Inbox,
    route: '/marketplaces/services',
    count: '12 services',
    d4: 'Discern'
  }, {
    id: 'knowledge',
    title: 'Knowledge Hub',
    description: 'GHC, playbooks, references',
    icon: BookOpen,
    route: '/marketplaces/knowledge',
    count: '48 templates',
    d4: 'Discern'
  }, {
    id: 'task-templates',
    title: 'Task Templates',
    description: 'Standardized task patterns',
    icon: LayoutTemplate,
    route: '/marketplaces/task-templates',
    count: '24 patterns',
    d4: 'Design'
  }, {
    id: 'work-directory',
    title: 'Work Directory',
    description: 'Owners, experts, support contacts',
    icon: Users,
    route: '/marketplaces/work-directory',
    count: '6 owners online',
    d4: 'Discern'
  }, {
    id: 'learning',
    title: 'Learning Marketplace',
    description: 'Role-aligned learning paths',
    icon: GraduationCap,
    route: '/marketplaces/learning',
    count: '8 paths',
    d4: 'Discern'
  }];
  return <section className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-1">Marketplaces</h2>
        <p className="text-navy-600 text-sm">
          Find the service, guidance, template, or owner needed to execute work.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {marketplaces.map((item) => <button key={item.id} onClick={() => navigate(item.route)} className="group relative bg-white border border-border rounded-card p-4 text-left hover:border-primary/30 hover:bg-surface transition-all flex flex-col h-full">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-pill bg-surface border border-border text-[10px] font-medium text-navy-500 uppercase tracking-wider">
              {item.d4}
            </div>

            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
              <item.icon size={16} />
            </div>

            <h3 className="text-sm font-bold text-navy-900 mb-1 pr-12">
              {item.title}
            </h3>
            <p className="text-xs text-navy-600 mb-4 flex-grow">
              {item.description}
            </p>

            <div className="text-[10px] font-medium text-navy-400 mt-auto">
              {item.count}
            </div>
          </button>)}
      </div>
    </section>;
}