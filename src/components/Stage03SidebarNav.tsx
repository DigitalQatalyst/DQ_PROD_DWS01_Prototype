import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AlertOctagon, BarChart3, Inbox, LayoutList } from 'lucide-react';

interface Stage03SidebarNavProps {
  collapsed: boolean;
}

const STAGE03_ITEMS = [
  {
    label: 'Central Support Queue',
    route: '/support/central-queue',
    icon: Inbox,
    match: (path: string) => path === '/support/central-queue' || path === '/services/central-support-queue',
  },
  {
    label: 'Requests Console',
    route: '/stage-03/requests-console',
    icon: LayoutList,
    match: (path: string) => path.startsWith('/stage-03/requests-console'),
  },
  {
    label: 'SLA Dashboard',
    route: '/reports/sla-dashboard',
    icon: BarChart3,
    match: (path: string) => path === '/reports/sla-dashboard',
  },
  {
    label: 'Escalation Queue',
    route: '/workflow/escalations',
    icon: AlertOctagon,
    match: (path: string) => path === '/workflow/escalations',
  },
];

export function Stage03SidebarNav({ collapsed }: Stage03SidebarNavProps) {
  const location = useLocation();
  const isStage03Active = STAGE03_ITEMS.some((item) => item.match(location.pathname));

  return (
    <div className="border-b border-border-subtle py-1">
      {!collapsed && (
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-text-muted leading-snug">
          Stage 03 — Fulfilment, Operations &amp; Governance
        </div>
      )}
      {STAGE03_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.match(location.pathname);
        return (
          <NavLink
            key={item.route}
            to={item.route}
            title={collapsed ? item.label : undefined}
            className={`flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors mx-0 ${
              collapsed ? 'justify-center' : ''
            } ${
              active
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:bg-surface hover:text-primary'
            }`}
          >
            <Icon size={16} strokeWidth={1.8} className="shrink-0" />
            {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
          </NavLink>
        );
      })}
      {!collapsed && isStage03Active && (
        <div className="px-3 pb-1">
          <span className="text-[10px] text-text-muted">Fulfilment &amp; governance</span>
        </div>
      )}
    </div>
  );
}
