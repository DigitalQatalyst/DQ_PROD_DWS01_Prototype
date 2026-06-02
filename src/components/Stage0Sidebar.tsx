import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  CheckSquare,
  ChevronsLeft,
  ChevronsRight,
  Compass,
  FileText,
  Gauge,
  GitBranch,
  Headphones,
  Home,
  Inbox,
  LayoutTemplate,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  type LucideIcon
} from 'lucide-react';

interface Stage0SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

interface NavItem {
  label: string;
  route?: string;
  message?: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    label: 'S00 · ORIENTATION',
    items: [
      { label: 'DWS.01 Landing & Orientation', route: '/stage-0/orientation', icon: Home },
      { label: 'Operating Guide', route: '/stage-0/operating-guide', icon: FileText }
    ]
  },
  {
    label: 'S01 · MARKETPLACES',
    items: [
      { label: 'Marketplace Overview', route: '/marketplaces/services', icon: Briefcase },
      { label: 'Discern Marketplace', route: '/marketplaces/knowledge', icon: Compass },
      { label: 'Design Marketplace', route: '/marketplaces/task-templates', icon: LayoutTemplate },
      { label: 'Deploy Marketplace', route: '/marketplaces/services', icon: Rocket },
      { label: 'Drive Marketplace', route: '/marketplaces/analytics', icon: BarChart3 }
    ]
  },
  {
    label: 'WORKSPACE',
    items: [
      { label: 'My Work', route: '/workspace/my-work', icon: Briefcase },
      { label: 'My Requests', route: '/workspace/my-requests', icon: Inbox },
      { label: 'Notifications', route: '/workspace/notifications', icon: Bell, badge: '4' },
      { label: 'Global Search', route: '/knowledge', icon: Search }
    ]
  },
  {
    label: 'EXECUTION',
    items: [
      { label: 'Tasks', route: '/tasks/my-tasks', icon: CheckSquare },
      { label: 'Workflow Centre', route: '/workflows/centre', icon: GitBranch },
      { label: 'Trackers', route: '/trackers', icon: Gauge }
    ]
  },
  {
    label: 'PERFORMANCE & GOVERNANCE',
    items: [
      { label: 'Execution Dashboard', route: '/reports/execution-dashboard', icon: BarChart3 },
      { label: 'Governance Overview', route: '/governance/dashboard', icon: ShieldCheck }
    ]
  },
  {
    label: 'SERVICES & SUPPORT',
    items: [
      { label: 'Request Console', route: '/workspace/my-requests', icon: Inbox },
      { label: 'Support Queue', message: 'Support queue options opened for this prototype.', icon: Headphones }
    ]
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'Administration', route: '/admin', icon: Settings }
    ]
  }
];

function isRouteActive(pathname: string, route: string) {
  return pathname === route || (route !== '/' && pathname.startsWith(`${route}/`));
}

export function Stage0Sidebar({ collapsed, onCollapsedChange }: Stage0SidebarProps) {
  const location = useLocation();
  const [expandedGroup, setExpandedGroup] = useState(() => {
    const activeGroup = groups.find((group) =>
      group.items.some((item) => item.route && isRouteActive(location.pathname, item.route))
    );
    return activeGroup?.label || groups[0].label;
  });

  useEffect(() => {
    const activeGroup = groups.find((group) =>
      group.items.some((item) => item.route && isRouteActive(location.pathname, item.route))
    );
    if (activeGroup) setExpandedGroup(activeGroup.label);
  }, [location.pathname]);

  return (
    <aside
      className={`fixed left-0 top-16 z-40 hidden h-[calc(100vh-64px)] overflow-y-auto border-r border-border-subtle bg-white pb-4 transition-all duration-200 lg:block ${
        collapsed ? 'w-[88px]' : 'w-[280px]'
      }`}
      aria-label="Stage 0 orientation navigation"
    >
      <div className="flex min-h-full flex-col px-4 py-4">
        <nav className="flex-1 space-y-2">
          {groups.map((group) => {
            const isOpen = !collapsed && expandedGroup === group.label;
            const groupActive = group.items.some((item) => item.route && isRouteActive(location.pathname, item.route));
            const GroupIcon = group.items[0]?.icon || Home;

            return (
              <div key={group.label} className="border-b border-border-subtle pb-2 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setExpandedGroup((current) => (current === group.label ? '' : group.label))}
                  title={collapsed ? group.label : undefined}
                  className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                    groupActive ? 'bg-navy-50 text-primary' : 'text-text-muted hover:bg-surface hover:text-primary'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <GroupIcon size={17} strokeWidth={1.8} />
                  {!collapsed && <span className="min-w-0 flex-1 truncate">{group.label}</span>}
                  {!collapsed && <span className="text-text-muted">{isOpen ? '-' : '+'}</span>}
                </button>

                {isOpen && (
                  <ul className="mt-1 space-y-1 pl-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const itemContent = (isActive = false) => (
                        <>
                          {isActive && (
                            <span
                              aria-hidden
                              className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-secondary"
                            />
                          )}
                          <Icon
                            size={17}
                            strokeWidth={1.8}
                            className={isActive ? 'text-secondary' : 'text-text-muted'}
                          />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-pill bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                        </>
                      );

                      return (
                        <li key={`${group.label}-${item.label}`}>
                          {item.route ? (
                            <NavLink
                              to={item.route}
                              title={item.label}
                              className={({ isActive }) =>
                                `relative flex min-h-10 items-center gap-3 rounded-r-[8px] px-3 py-2 text-sm font-semibold transition-colors ${
                                  isActive
                                    ? 'bg-navy-50 text-primary'
                                    : 'text-text-secondary hover:bg-surface hover:text-primary'
                                }`
                              }
                            >
                              {({ isActive }) => itemContent(isActive)}
                            </NavLink>
                          ) : (
                            <button
                              type="button"
                              title={item.label}
                              onClick={() => toast.info(item.message || `${item.label} options opened.`)}
                              className="relative flex min-h-10 w-full items-center gap-3 rounded-r-[8px] px-3 py-2 text-left text-sm font-semibold text-text-secondary transition-colors hover:bg-surface hover:text-primary"
                            >
                              {itemContent(false)}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          className={`mt-5 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold text-text-secondary hover:bg-surface hover:text-primary ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!collapsed && <span>Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
