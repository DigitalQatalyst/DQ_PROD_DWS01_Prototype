import { Link, useNavigate } from 'react-router-dom';
import { PriorityBadge } from '../DqBadge';
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
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
        S02 / My Dashboard
      </p>
      <h1 className="dq-page-title mt-2">
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
          <li key={action.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-primary">{action.title}</p>
              <p className="mt-1 text-xs text-text-muted">
                {action.category} &bull; {action.due}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PriorityBadge priority={action.priority} />
              <button
                type="button"
                onClick={() => navigate(action.route)}
                className="dq-btn dq-btn-orange min-w-[88px] px-4 focus-visible:outline-none"
              >
                Review
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const alertStatusTone: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  'On Track': 'success',
  Attention: 'warning',
  'At Risk': 'danger',
  Active: 'info',
};

export function PriorityAlertsPanel() {
  return (
    <section className="dq-card h-full">
      <h2 className="dq-card-title">Priority alerts</h2>
      <ul className="mt-4 space-y-3">
        {priorityAlerts.map((alert) => (
          <li key={alert.id}>
            <Link
              to={alert.route}
              className="flex items-start justify-between gap-4 rounded-btn border border-border-subtle bg-gray-50 px-4 py-3 transition hover:border-border-default hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">
                  {alert.code}: {alert.title}
                </p>
                <p className="mt-1 text-xs text-text-muted">{alert.description}</p>
              </div>
              <span
                className={`dq-badge shrink-0 ${
                  alertStatusTone[alert.status] === 'success'
                    ? 'dq-badge-success'
                    : alertStatusTone[alert.status] === 'warning'
                      ? 'dq-badge-warning'
                      : alertStatusTone[alert.status] === 'danger'
                        ? 'dq-badge-danger'
                        : 'dq-badge-info'
                }`}
              >
                {alert.status}
              </span>
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
