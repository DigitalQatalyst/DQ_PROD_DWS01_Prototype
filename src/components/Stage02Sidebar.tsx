import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  CheckSquare,
  FileText,
  Gauge,
  GitBranch,
  Home,
  LineChart,
  Settings,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useViewingMode } from '../context/ViewingModeContext';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';

const primaryItems: Array<{ label: string; route: string; icon: LucideIcon; badge?: string }> = [
  { label: 'Workspace', route: '/stage02/workspace', icon: Home },
  { label: 'Tasks', route: '/stage02/tasks', icon: CheckSquare, badge: '8' },
  { label: 'Workflows', route: '/stage02/workflows', icon: GitBranch, badge: '5' },
  { label: 'Trackers', route: '/stage02/trackers', icon: LineChart },
  { label: 'Performance', route: '/stage02/performance', icon: Gauge },
  { label: 'Governance', route: '/stage02/governance', icon: ShieldCheck },
  { label: 'Knowledge', route: '/stage02/knowledge', icon: BookOpen },
  { label: 'People', route: '/stage02/people', icon: Users },
  { label: 'Reports', route: '/stage02/reports', icon: FileText }
];

const favouriteMap: Record<string, string[]> = {
  Associate: ['My Tasks', 'Learning Progress', 'Contribution History', 'Knowledge Center'],
  'Manager / Lead': ['Team Blockers', 'Pending Approvals', 'Review Completion', 'My Tasks'],
  'Governance Lead': ['Governance Reviews', 'Control Library', 'Risk Register', 'Escalations'],
  'Product / Admin': ['Prototype Backlog', 'Feature Tracker', 'Template Configuration', 'Open Feedback']
};

const favouriteRoutes: Record<string, string> = {
  'My Tasks': '/stage02/tasks',
  'Learning Progress': '/stage02/performance/learning',
  'Contribution History': '/stage02/performance/contribution-history',
  'Knowledge Center': '/stage02/knowledge',
  'Team Blockers': '/stage02/tasks',
  'Pending Approvals': '/stage02/governance',
  'Review Completion': '/stage02/performance/evaluation',
  'Governance Reviews': '/stage02/governance',
  'Control Library': '/stage02/governance',
  'Risk Register': '/stage02/trackers',
  Escalations: '/stage02/governance',
  'Prototype Backlog': '/stage02/trackers',
  'Feature Tracker': '/stage02/trackers',
  'Template Configuration': '/stage02/workflows',
  'Open Feedback': '/stage02/reports'
};

export function Stage02Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useViewingMode();
  const { activeRole } = useWorkspaceRole();
  const favourites = favouriteMap[activeRole];

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-64px)] w-[280px] overflow-y-auto border-r border-border-subtle bg-white pb-6 lg:block">
      <div className="px-5 py-5">
        <div className="mb-5 rounded-2xl border border-border-subtle bg-surface px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Stage 02 Workspace</div>
          <div className="mt-1 text-sm font-bold text-primary">{activeRole}</div>
          <div className="mt-1 text-xs text-text-muted">{mode === 'first-time' ? 'New Joiner view' : 'Returning User view'}</div>
        </div>

        <nav aria-label="Stage 02 navigation" className="space-y-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isPerformanceRoute = item.route === '/stage02/performance' && location.pathname.startsWith('/stage02/performance');
            return (
              <NavLink
                key={item.route}
                to={item.route}
                className={({ isActive }) =>
                  `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${
                    isActive || isPerformanceRoute ? 'bg-navy-50 text-primary' : 'text-text-secondary hover:bg-surface hover:text-primary'
                  }`
                }>
                <Icon size={17} strokeWidth={1.7} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && <span className="rounded-pill bg-primary px-2 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-7 border-t border-border-subtle pt-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Favourites</h3>
            <button onClick={() => toast.info('Favourite editing is available in workspace preferences.')} className="text-xs font-semibold text-text-muted hover:text-primary">Edit</button>
          </div>
          <div className="space-y-1">
            {favourites.map((label) => (
              <button
                key={label}
                onClick={() => navigate(favouriteRoutes[label] || '/stage02/workspace')}
                className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-primary">
                <Star size={16} strokeWidth={1.6} />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-border-subtle pt-5">
          <button onClick={() => navigate('/stage02/workspace')} className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary hover:bg-surface hover:text-primary">
            <Settings size={17} />
            Settings
          </button>
          <button onClick={() => navigate('/stage02/reports')} className="mt-1 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary hover:bg-surface hover:text-primary">
            <BarChart3 size={17} />
            Workspace Health
          </button>
        </div>
      </div>
    </aside>
  );
}
