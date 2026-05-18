import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, BookOpen, GraduationCap, Inbox, Wrench, BookA, Users, Compass, FileText, Layers, Palette, Workflow, Network, Rocket, CheckSquare, Server, GitBranch, FileUp, Plug, ListChecks, LifeBuoy, Activity, TrendingUp, ShieldCheck, BarChart3, RefreshCw, BoxIcon } from 'lucide-react';
type StageKey = 'discern' | 'design' | 'deploy' | 'drive';
interface MarketplaceEntry {
  label: string;
  route?: string;
}
interface StageGroup {
  key: StageKey;
  code: string;
  title: string;
  purpose: string;
  summary: string;
  icon: BoxIcon;
  entries: MarketplaceEntry[];
}
const groups: StageGroup[] = [{
  key: 'discern',
  code: 'D1',
  title: 'Discern',
  purpose: 'Understand',
  summary: 'Understand what exists, what is approved, and where to start.',
  icon: Compass,
  entries: [{
    label: 'DWS News & Announcements Center'
  }, {
    label: 'Knowledge Center',
    route: '/marketplaces/knowledge'
  }, {
    label: 'Learning Center'
  }, {
    label: 'Service Catalog',
    route: '/marketplaces/services'
  }, {
    label: 'Tools Directory'
  }, {
    label: 'Glossary'
  }, {
    label: 'Community & Office Hours'
  }]
}, {
  key: 'design',
  code: 'D2',
  title: 'Design',
  purpose: 'Plan + Govern',
  summary: 'Shape services, journeys, forms, standards, workflows, and data structures.',
  icon: Layers,
  entries: [{
    label: 'Journey & Service Design Studio'
  }, {
    label: 'Forms & Templates Library',
    route: '/marketplaces/task-templates'
  }, {
    label: 'Content Design System'
  }, {
    label: 'UI / Design System Marketplace'
  }, {
    label: 'Workflow Specification Studio'
  }, {
    label: 'Integration & Data Mapping Templates'
  }]
}, {
  key: 'deploy',
  code: 'D3',
  title: 'Deploy',
  purpose: 'Build + Release',
  summary: 'Test, release, publish, configure, and deploy governed assets.',
  icon: Rocket,
  entries: [{
    label: 'Release Center'
  }, {
    label: 'QA / UAT Marketplace'
  }, {
    label: 'Environments Hub'
  }, {
    label: 'CI/CD & Build Pipeline Hub'
  }, {
    label: 'Content Publishing Console'
  }, {
    label: 'Integration Deployment Hub'
  }]
}, {
  key: 'drive',
  code: 'D4',
  title: 'Drive',
  purpose: 'Operate + Improve',
  summary: 'Track requests, monitor performance, govern operations, and improve adoption.',
  icon: Activity,
  entries: [{
    label: 'My Requests & Workflow Tracker',
    route: '/workspace/my-requests'
  }, {
    label: 'Support & Help Center'
  }, {
    label: 'Operations Command Center'
  }, {
    label: 'Adoption & Engagement Dashboard'
  }, {
    label: 'Governance & Policy Console'
  }, {
    label: 'Performance & Insights',
    route: '/marketplaces/analytics'
  }, {
    label: 'Change Management Hub'
  }]
}];
interface Stage0Marketplaces4DProps {
  compact?: boolean;
}
export function Stage0Marketplaces4D({
  compact = false
}: Stage0Marketplaces4DProps) {
  const navigate = useNavigate();
  return <section className="max-w-5xl mx-auto">
      <div className="mb-5 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-primary mb-1">
            Explore the DWS Marketplaces
          </h2>
          <p className="text-navy-600 text-sm max-w-3xl">
            Find the knowledge, services, templates, workflows, tools, and
            support needed to move work from understanding to execution and
            improvement.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-navy-500 uppercase tracking-wider">
          <span className="px-2 py-1 rounded-pill bg-surface border border-border">
            Discern
          </span>
          <span className="text-navy-300">→</span>
          <span className="px-2 py-1 rounded-pill bg-surface border border-border">
            Design
          </span>
          <span className="text-navy-300">→</span>
          <span className="px-2 py-1 rounded-pill bg-surface border border-border">
            Deploy
          </span>
          <span className="text-navy-300">→</span>
          <span className="px-2 py-1 rounded-pill bg-surface border border-border">
            Drive
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {groups.map((group) => {
        const Icon = group.icon;
        return <div key={group.key} className="bg-white border border-border rounded-card flex flex-col overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-primary">
                    <Icon size={14} />
                  </div>
                  <div className="text-[10px] font-bold text-primary tracking-wider">
                    {group.code}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-navy-900 leading-tight">
                  {group.title}
                  <span className="text-navy-500 font-medium">
                    {' '}
                    — {group.purpose}
                  </span>
                </h3>
                <p className="text-xs text-navy-600 mt-1.5 leading-snug">
                  {group.summary}
                </p>
              </div>

              <ul className="flex-1 px-2 py-2">
                {(compact ? group.entries.slice(0, 5) : group.entries).map((entry) => {
              const isLinked = Boolean(entry.route);
              return <li key={entry.label}>
                        <button onClick={() => entry.route && navigate(entry.route)} disabled={!isLinked} className={`w-full text-left px-2 py-1.5 rounded text-xs leading-snug transition-colors ${isLinked ? 'text-navy-800 hover:bg-surface hover:text-primary cursor-pointer' : 'text-navy-500 cursor-default'}`} title={isLinked ? `Open ${entry.label}` : `${entry.label} (coming soon)`}>
                          <span className="inline-flex items-center gap-2">
                            <span className={`w-1 h-1 rounded-full ${isLinked ? 'bg-secondary' : 'bg-navy-300'}`} />
                            {entry.label}
                          </span>
                        </button>
                      </li>;
            })}
                {compact && group.entries.length > 5 && <li className="px-2 pt-1 text-[10px] text-navy-400 italic">
                    + {group.entries.length - 5} more
                  </li>}
              </ul>
            </div>;
      })}
      </div>
    </section>;
}