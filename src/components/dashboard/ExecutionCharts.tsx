import type { ReactNode } from 'react';
import type {
  ActionItem,
  ClosureQualityMetric,
  OwnerWorkload,
  PriorityBar,
  StatusSegment,
  TrendPoint,
} from '../../mocks/executionDashboard.mock';
import { DqBadge } from '../DqBadge';

const priorityTone = {
  HIGH: 'danger',
  MED: 'warning',
  LOW: 'success',
  OPEN: 'info',
} as const;

function buildConicGradient(segments: StatusSegment[]): string {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  let cumulative = 0;
  const stops = segments.map((segment) => {
    const start = (cumulative / total) * 100;
    cumulative += segment.count;
    const end = (cumulative / total) * 100;
    return `${segment.color} ${start}% ${end}%`;
  });
  return `conic-gradient(from -90deg, ${stops.join(', ')})`;
}

export function StatusDonutChart({ segments }: { segments: StatusSegment[] }) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative h-36 w-36 shrink-0">
        <div className="h-full w-full rounded-full" style={{ background: buildConicGradient(segments) }} />
        <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full border border-border-subtle bg-white">
          <span className="text-2xl font-bold tabular-nums text-primary">{total}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Tasks</span>
        </div>
      </div>
      <ul className="w-full flex-1 space-y-2 sm:max-w-[200px]">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="truncate text-text-secondary">{segment.label}</span>
            </span>
            <span className="shrink-0 font-bold tabular-nums text-primary">{segment.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PriorityBarChart({ data, maxValue = 16 }: { data: PriorityBar[]; maxValue?: number }) {
  return (
    <div className="flex h-44 items-end justify-between gap-3 pt-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-36 w-full items-end justify-center">
            <div
              className={`w-full max-w-[48px] rounded-t ${item.color}`}
              style={{ height: `${(item.count / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-center text-[11px] font-medium text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function CompletionTrendChart({ data, chartId = 'exec-trend' }: { data: TrendPoint[]; chartId?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 280;
  const height = 120;
  const padding = 8;
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return { x, y, ...d };
  });
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">Last 8 weeks</p>
      <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full" aria-hidden>
        <defs>
          <linearGradient id={`${chartId}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${chartId}-fill)`} />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <circle key={p.week} cx={p.x} cy={p.y} r="3" fill="var(--color-secondary)" />
        ))}
        {points.map((p) => (
          <text key={`label-${p.week}`} x={p.x} y={height + 14} textAnchor="middle" className="fill-text-muted text-[9px]">
            {p.week}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function WorkloadByOwnerChart({ data, maxValue = 8 }: { data: OwnerWorkload[]; maxValue?: number }) {
  return (
    <div className="space-y-3">
      {data.map((owner) => {
        const total = owner.open + owner.inProgress;
        const openWidth = (owner.open / maxValue) * 100;
        const progressWidth = (owner.inProgress / maxValue) * 100;

        return (
          <div key={owner.name} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-sm font-medium text-text-secondary">{owner.name}</span>
            <div className="flex h-5 flex-1 gap-0.5">
              <div
                className="h-full rounded-l bg-warning/70"
                style={{ width: `${openWidth}%`, minWidth: owner.open > 0 ? '4px' : 0 }}
                title={`${owner.open} open`}
              />
              <div
                className="h-full rounded-r bg-primary"
                style={{ width: `${progressWidth}%`, minWidth: owner.inProgress > 0 ? '4px' : 0 }}
                title={`${owner.inProgress} in progress`}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-bold tabular-nums text-text-muted">{total}</span>
          </div>
        );
      })}
      <div className="mt-4 flex items-center gap-4 text-[11px] text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded bg-warning/70" />
          Open
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded bg-primary" />
          In Progress
        </span>
      </div>
    </div>
  );
}

export function ClosureQualityBars({ metrics }: { metrics: ClosureQualityMetric[] }) {
  return (
    <div className="space-y-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">This cycle</p>
      {metrics.map((metric) => (
        <div key={metric.label}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-text-secondary">{metric.label}</span>
            <span className="font-bold tabular-nums text-primary">{metric.percent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-border-subtle">
            <div className={`h-2 rounded-full ${metric.color}`} style={{ width: `${metric.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecentDecisionsList({
  items,
}: {
  items: { id: string; description: string; dotColor: string; meta: string }[];
}) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.dotColor}`} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">{item.description}</p>
            <p className="mt-0.5 text-xs text-text-muted">{item.meta}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DashboardActionTable({
  rows,
  onRowClick,
}: {
  rows: ActionItem[];
  onRowClick?: (row: ActionItem) => void;
}) {
  const columns: { header: string; accessor: (row: ActionItem) => ReactNode }[] = [
    {
      header: 'Action',
      accessor: (row) => <span className="font-medium text-primary">{row.action}</span>,
    },
    {
      header: 'Owner',
      accessor: (row) => <span className="text-text-secondary">{row.owner}</span>,
    },
    {
      header: 'Due',
      accessor: (row) => <span className="text-text-secondary">{row.due}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => (
        <DqBadge label={row.priority} tone={priorityTone[row.priority]} dot={false} />
      ),
    },
  ];

  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-subtle">
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-3 py-2.5 text-xs font-semibold uppercase text-text-muted"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer transition-colors hover:bg-navy-50' : undefined}
            >
              {columns.map((col) => (
                <td key={col.header} className="px-3 py-3 text-sm align-middle">
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
