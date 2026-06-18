import { Link, useNavigate } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../DqBadge';
import { MarketplaceEyebrowTrail } from '../marketplace/MarketplaceEyebrowTrail';
import {
  actionSnapshotKpis,
  dashboardRecentActivity,
  nextBestActions,
  priorityAlerts,
} from '../../mocks/associateDashboard.mock';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardHeader({ firstName }: { firstName: string }) {
  const greeting = getTimeGreeting();

  return (
    <header>
      <MarketplaceEyebrowTrail
        items={[
          { label: 'S02', href: '/home' },
          { label: 'My Dashboard' },
        ]}
        className="mb-2"
      />
      <h1 className="dq-page-title">
        {greeting}, {firstName}.
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
        Start with your action snapshot, then move into the highest-priority work.
      </p>
    </header>
  );
}

export function ActionSnapshotRow() {
  const navigate = useNavigate();

  return (
    <section aria-label="Action snapshot">
      <p className="dq-overline mb-4">Action snapshot</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {actionSnapshotKpis.map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => navigate(kpi.route)}
            className="dq-card dq-card-clickable text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              {kpi.label}
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-primary">{kpi.value}</p>
            <p className="mt-1 text-xs text-text-muted">{kpi.subtitle}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function NextBestActionsPanel() {
  const navigate = useNavigate();

  return (
    <section className="dq-card h-full">
      <h2 className="dq-card-title">Next best actions</h2>
      <ul className="mt-4 divide-y divide-border-subtle">
        {nextBestActions.map((action) => (
          <li
            key={action.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-sm font-semibold leading-snug text-primary">{action.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-xs text-text-muted">
                  {action.category} &bull; {action.due}
                </p>
                <PriorityBadge priority={action.priority} size="sm" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(action.route)}
              className="dq-btn dq-btn-orange dq-btn-sm shrink-0 focus-visible:outline-none"
            >
              Review
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PriorityAlertsPanel() {
  return (
    <section className="dq-card h-full">
      <h2 className="dq-card-title">Priority alerts</h2>
      <ul className="mt-4 space-y-2.5">
        {priorityAlerts.map((alert) => (
          <li key={alert.id}>
            <Link
              to={alert.route}
              className="flex items-center justify-between gap-3 rounded-btn border border-border-subtle bg-gray-50 px-3.5 py-2.5 transition hover:border-border-default hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
            >
              <div className="min-w-0 pr-2">
                <p className="text-sm font-semibold leading-snug text-primary">
                  {alert.code}: {alert.title}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">{alert.description}</p>
              </div>
              <StatusBadge status={alert.status} size="sm" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RecentActivityPanel() {
  return (
    <section className="dq-card h-full">
      <h2 className="dq-card-title">Recent activity</h2>
      <ul className="mt-4 divide-y divide-border-subtle">
        {dashboardRecentActivity.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <p className="text-sm text-text-secondary">{item.text}</p>
            <span className="shrink-0 text-xs font-medium text-text-muted">{item.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
