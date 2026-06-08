import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  History,
  Paperclip,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Column } from './DataTable';
import type {
  RiskReason,
  TrackerAuditEvent,
  TrackerDocument,
  TrackerEvidence,
  TrackerRow,
  TrackerSourceMeta,
} from '../data/trackerAreaData';

// ─── Primitives ───────────────────────────────────────────────────────────────

export function TrackerAreaHeader({
  title,
  subtitle,
  purpose,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  purpose?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        {subtitle && (
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{subtitle}</div>
        )}
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary">{title}</h1>
        {purpose && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{purpose}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-navy-800"
        >
          {actionLabel}
        </button>
      )}
    </header>
  );
}

export type TrackerKpiStatus = 'success' | 'warning' | 'danger' | 'info';

export interface TrackerKpiTileProps {
  label: string;
  value: string;
  status: TrackerKpiStatus;
  onClick?: () => void;
}

export function TrackerKpiTile({ label, value, status, onClick }: TrackerKpiTileProps) {
  const dot =
    status === 'success'
      ? 'bg-success'
      : status === 'warning'
        ? 'bg-warning'
        : status === 'danger'
          ? 'bg-danger'
          : 'bg-info';
  return (
    <button
      onClick={onClick}
      className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm transition-colors hover:bg-surface"
    >
      <div className="text-sm font-semibold text-text-muted">{label}</div>
      <div className="mt-2 text-3xl font-bold text-primary">{value}</div>
      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-text-secondary">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {label}
      </div>
    </button>
  );
}

export function TrackerKpiGrid({ tiles }: { tiles: TrackerKpiTileProps[] }) {
  if (!tiles.length) return null;
  return (
    <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {tiles.map((tile) => (
        <TrackerKpiTile key={tile.label} {...tile} />
      ))}
    </section>
  );
}

export function TrackerPageFrame({
  subtitle,
  title,
  purpose,
  kpis,
  actionLabel,
  onAction,
  children,
}: {
  subtitle: string;
  title: string;
  purpose: string;
  kpis?: TrackerKpiTileProps[];
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-surface px-5 py-6 lg:px-8">
      <TrackerAreaHeader
        subtitle={subtitle}
        title={title}
        purpose={purpose}
        actionLabel={actionLabel}
        onAction={onAction}
      />
      {kpis && kpis.length > 0 && <TrackerKpiGrid tiles={kpis} />}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export function TrackerMonoId({ value }: { value: string }) {
  return <span className="font-mono text-xs font-bold text-primary">{value}</span>;
}

export function TrackerStatusPill({
  status,
  variant,
}: {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info';
}) {
  const auto: Record<string, string> = {
    Open: 'bg-blue-50 text-blue-700',
    'In Progress': 'bg-blue-50 text-blue-700',
    Closed: 'bg-green-50 text-green-700',
    Completed: 'bg-green-50 text-green-700',
    Overdue: 'bg-red-50 text-red-700',
    'At Risk': 'bg-amber-50 text-amber-700',
    Breached: 'bg-red-50 text-red-700',
  };
  const manual: Record<string, string> = {
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
  };
  const cls = variant ? manual[variant] : auto[status] || 'bg-surface text-text-secondary';
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${cls}`}>{status}</span>
  );
}

export function TrackerSlaChip({ sla }: { sla: string }) {
  const variant =
    sla === 'Breached' ? 'danger' : sla === 'At Risk' ? 'warning' : 'success';
  return <TrackerStatusPill status={sla} variant={variant} />;
}

export function TrackerProgressCell({ percent }: { percent: number }) {
  return (
    <div className="flex min-w-[80px] items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
        <div
          className={`h-full rounded-full ${percent >= 80 ? 'bg-success' : percent >= 40 ? 'bg-info' : 'bg-warning'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-bold text-primary">{percent}%</span>
    </div>
  );
}

export function TrackerCountdownBadge({ timeRemaining, urgent }: { timeRemaining: string; urgent?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 font-mono text-xs font-bold ${
        urgent ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {timeRemaining}
    </span>
  );
}

type DocActionPlacement = 'library' | 'toolbar' | 'recovery' | 'export' | 'evidence' | 'metadata';

export function TrackerDocumentActions({
  placement = 'toolbar',
  compact,
}: {
  placement?: DocActionPlacement;
  compact?: boolean;
}) {
  const actions = [
    { label: 'Upload', icon: Upload },
    { label: 'Download', icon: Download },
    { label: 'Export', icon: Download },
    { label: 'Attach', icon: Paperclip },
    { label: 'Version', icon: History },
  ];
  const placementClass: Record<DocActionPlacement, string> = {
    library: 'border-b border-border-subtle bg-surface p-2',
    toolbar: 'rounded-card border border-border-subtle bg-white p-2 shadow-sm',
    recovery: 'rounded-lg border border-border-subtle bg-surface p-2',
    export: 'rounded-card border border-border-subtle bg-white p-3 shadow-sm',
    evidence: 'rounded-lg border border-border-subtle bg-white p-2',
    metadata: 'text-xs',
  };
  return (
    <div className={`flex flex-wrap gap-1 ${placementClass[placement]}`}>
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => toast.info(`${label} action recorded.`)}
          className={`inline-flex items-center gap-1 rounded-button border border-border-subtle px-2 py-1 font-semibold text-text-secondary hover:bg-white hover:text-primary ${compact ? 'text-xs' : 'text-xs'}`}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Sheet layer ──────────────────────────────────────────────────────────────

export interface TrackerSheetColumn<T> extends Column<T> {
  frozen?: boolean;
  emphasized?: boolean;
}

export interface TrackerSheetGroup<T> {
  id: string;
  label: string;
  rows: T[];
}

interface TrackerSheetProps<T> {
  columns: TrackerSheetColumn<T>[];
  rows?: T[];
  groups?: TrackerSheetGroup<T>[];
  selectedId?: string | null;
  onRowClick?: (row: T) => void;
  onSelectRows?: (ids: string[]) => void;
  selectable?: boolean;
  readOnly?: boolean;
  emptyMessage?: string;
  getRowId: (row: T) => string;
}

export function TrackerSheetGroupHeader({
  label,
  count,
  expanded,
  onToggle,
}: {
  label: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2 border-b border-border-subtle bg-surface px-4 py-2 text-left hover:bg-navy-50"
    >
      {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      <span className="text-sm font-bold text-primary">{label}</span>
      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-text-muted">{count}</span>
    </button>
  );
}

export function TrackerSheet<T>({
  columns,
  rows,
  groups,
  selectedId,
  onRowClick,
  selectable,
  readOnly,
  emptyMessage = 'No rows',
  getRowId,
}: TrackerSheetProps<T>) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries((groups || []).map((g) => [g.id, true])),
  );

  const renderRow = (row: T) => {
    const id = getRowId(row);
    const selected = selectedId === id;
    return (
      <tr
        key={id}
        onClick={() => !readOnly && onRowClick?.(row)}
        className={`transition-colors ${!readOnly && onRowClick ? 'cursor-pointer hover:bg-navy-50' : ''} ${selected ? 'bg-info-surface' : ''}`}
      >
        {selectable && (
          <td className="px-3 py-2">
            <input type="checkbox" className="rounded" onClick={(e) => e.stopPropagation()} />
          </td>
        )}
        {columns.map((col, j) => (
          <td
            key={j}
            className={`px-4 py-3 text-sm align-middle ${col.emphasized ? 'font-bold text-danger-text' : 'text-text-primary'} ${col.frozen ? 'sticky left-0 bg-white' : ''}`}
          >
            {col.accessor(row)}
          </td>
        ))}
      </tr>
    );
  };

  const allRows = groups ? groups.flatMap((g) => (expandedGroups[g.id] !== false ? g.rows : [])) : rows || [];

  return (
    <div className="w-full overflow-x-auto rounded-card border border-border-default bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-default bg-surface">
            {selectable && <th className="px-3 py-3" />}
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap ${col.emphasized ? 'text-danger-text' : ''} ${col.frozen ? 'sticky left-0 bg-surface' : ''}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {groups
            ? groups.map((group) => (
                <React.Fragment key={group.id}>
                  <tr>
                    <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-0">
                      <TrackerSheetGroupHeader
                        label={group.label}
                        count={group.rows.length}
                        expanded={expandedGroups[group.id] !== false}
                        onToggle={() =>
                          setExpandedGroups((prev) => ({
                            ...prev,
                            [group.id]: prev[group.id] === false,
                          }))
                        }
                      />
                    </td>
                  </tr>
                  {expandedGroups[group.id] !== false && group.rows.map(renderRow)}
                </React.Fragment>
              ))
            : allRows.length === 0
              ? (
                  <tr>
                    <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-sm text-text-muted">
                      {emptyMessage}
                    </td>
                  </tr>
                )
              : (rows || []).map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}

// ─── Zone panels ──────────────────────────────────────────────────────────────

export function TrackerDocumentLibrary({
  documents,
  selectedId,
  onSelect,
  showActions,
}: {
  documents: TrackerDocument[];
  selectedId?: string | null;
  onSelect: (doc: TrackerDocument) => void;
  showActions?: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-card border border-border-subtle bg-white shadow-sm">
      <div className="border-b border-border-subtle p-3">
        <h3 className="text-sm font-bold text-primary">Tracker Documents</h3>
        {showActions && <div className="mt-2"><TrackerDocumentActions placement="library" compact /></div>}
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            className={`mb-1 w-full rounded-lg p-3 text-left transition-colors ${selectedId === doc.id ? 'bg-info-surface border border-info' : 'hover:bg-surface border border-transparent'}`}
          >
            <div className="text-sm font-bold text-primary">{doc.name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
              <FileText size={10} />
              <span>{doc.sourceFile}</span>
              <span>·</span>
              <span>{doc.version}</span>
            </div>
            <div className="mt-1 text-xs text-text-muted">{doc.rowCount} rows · {doc.owner}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TrackerRowInbox({
  rows,
  selectedId,
  onSelect,
}: {
  rows: TrackerRow[];
  selectedId?: string | null;
  onSelect: (row: TrackerRow) => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-card border border-border-subtle bg-white shadow-sm">
      <div className="border-b border-border-subtle p-3">
        <h3 className="text-sm font-bold text-primary">My Row Inbox</h3>
        <p className="text-xs text-text-muted">Assigned · missing update · due soon · needs evidence</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {rows.map((row) => (
          <button
            key={row.id}
            onClick={() => onSelect(row)}
            className={`w-full rounded-lg p-2 text-left text-sm ${selectedId === row.id ? 'bg-info-surface' : 'hover:bg-surface'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <TrackerMonoId value={row.id} />
              <TrackerStatusPill status={row.status} />
            </div>
            <div className="mt-1 font-medium text-primary truncate">{row.title}</div>
            <div className="mt-0.5 text-xs text-text-muted">{row.nextAction}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TrackerSlideInPanel({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <aside className="flex h-full w-80 flex-col border-l border-border-subtle bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-border-subtle p-4">
        <h3 className="text-sm font-bold text-primary">{title}</h3>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-surface"><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </aside>
  );
}

export function TrackerBulkActionBar({
  selectedCount,
  actions,
}: {
  selectedCount: number;
  actions: Array<{ label: string; onClick: () => void; variant?: 'danger' | 'primary' }>;
}) {
  if (selectedCount === 0) return null;
  return (
    <div className="sticky bottom-0 flex items-center justify-between border-t border-border-subtle bg-white px-6 py-3 shadow-lg">
      <span className="text-sm font-semibold text-primary">{selectedCount} row(s) selected</span>
      <div className="flex gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className={`rounded-button px-4 py-2 text-xs font-bold ${
              a.variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : a.variant === 'primary'
                  ? 'bg-primary text-white hover:bg-navy-800'
                  : 'border border-border-default text-primary hover:bg-surface'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TrackerLedgerRow({
  row,
  expanded,
  onToggle,
  children,
}: {
  row: TrackerRow;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface"
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <TrackerMonoId value={row.id} />
        <span className="flex-1 text-sm font-medium text-primary">{row.title}</span>
        <TrackerStatusPill status={row.status} variant="success" />
        {row.closedAt && <span className="text-xs text-text-muted">{row.closedAt}</span>}
      </button>
      {expanded && children && (
        <div className="border-t border-border-subtle bg-surface px-4 py-3 text-sm space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function TrackerFilterBuilder({
  filters,
  values,
  onChange,
}: {
  filters: Array<{ key: string; label: string; options: string[] }>;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-card border border-border-subtle bg-white p-3 shadow-sm">
      <span className="text-xs font-bold uppercase text-text-muted">Filters</span>
      {filters.map((f) => (
        <select
          key={f.key}
          value={values[f.key] || 'all'}
          onChange={(e) => onChange(f.key, e.target.value)}
          className="rounded-button border border-border-subtle px-3 py-1.5 text-xs font-semibold text-primary"
        >
          <option value="all">All {f.label}</option>
          {f.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ))}
    </div>
  );
}

export function TrackerTabRail({
  tabs,
  activeId,
  onChange,
  actions,
}: {
  tabs: Array<{ id: string; label: string; count?: number }>;
  activeId: string;
  onChange: (id: string) => void;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition-colors ${
              activeId === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-muted hover:text-primary'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 rounded-full bg-surface px-1.5 py-0.5 text-xs">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      {actions}
    </div>
  );
}

export function TrackerLifecycleStepper({
  stages,
}: {
  stages: Array<{ id: string; label: string; status: 'complete' | 'current' | 'pending' }>;
}) {
  return (
    <div className="flex items-center justify-between rounded-card border border-border-subtle bg-white p-4 shadow-sm">
      {stages.map((stage, idx) => (
        <React.Fragment key={stage.id}>
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                stage.status === 'complete'
                  ? 'bg-green-600 text-white'
                  : stage.status === 'current'
                    ? 'bg-primary text-white'
                    : 'border-2 border-gray-300 bg-white text-text-muted'
              }`}
            >
              {stage.status === 'complete' ? '✓' : idx + 1}
            </div>
            <span className={`mt-1 text-xs font-bold ${stage.status !== 'pending' ? 'text-primary' : 'text-text-muted'}`}>
              {stage.label}
            </span>
          </div>
          {idx < stages.length - 1 && (
            <div className={`mx-1 h-0.5 flex-1 ${stage.status === 'complete' ? 'bg-green-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function TrackerChecklistPanel({
  title,
  items,
  actions,
}: {
  title: string;
  items: Array<{ label: string; done: boolean }>;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-primary">{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${item.done ? 'bg-success' : 'bg-warning'}`} />
            <span className={item.done ? 'text-text-muted line-through' : 'text-primary'}>{item.label}</span>
          </div>
        ))}
      </div>
      {actions && <div className="mt-4 flex flex-col gap-2">{actions}</div>}
    </div>
  );
}

export function TrackerInterventionPanel({
  riskReason,
  playbook,
  row,
}: {
  riskReason: RiskReason;
  playbook: string[];
  row?: TrackerRow | null;
}) {
  return (
    <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
      <h3 className="text-sm font-bold text-primary">Intervention Playbook</h3>
      <p className="mt-1 text-xs text-text-muted">Risk: {riskReason}</p>
      {row && (
        <div className="mt-3 rounded-lg bg-surface p-2 text-sm">
          <TrackerMonoId value={row.id} />
          <p className="mt-1 font-medium text-primary">{row.title}</p>
        </div>
      )}
      <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-text-secondary">
        {playbook.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <button
        onClick={() => toast.success('Intervention action recorded.')}
        className="mt-4 w-full rounded-button bg-primary py-2 text-xs font-bold text-white"
      >
        Execute Recommended Action
      </button>
    </div>
  );
}

export function TrackerSourceStrip({ source }: { source: TrackerSourceMeta }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-card border border-border-subtle bg-surface px-4 py-2 text-xs text-text-muted">
      <span><strong className="text-primary">Source:</strong> {source.sourceFile}</span>
      <span><strong className="text-primary">Version:</strong> {source.version}</span>
      <span><strong className="text-primary">Modified:</strong> {source.lastModified} by {source.modifiedBy}</span>
    </div>
  );
}

export function TrackerAuditBlock({ events }: { events: TrackerAuditEvent[] }) {
  return (
    <div className="space-y-2">
      {events.map((e) => (
        <div key={e.id} className="text-xs text-text-secondary">
          <span className="font-mono text-text-muted">{new Date(e.timestamp).toLocaleDateString()}</span>
          {' · '}
          <span className="font-semibold text-primary">{e.description}</span>
          {' · '}
          {e.actor}
        </div>
      ))}
    </div>
  );
}

export function TrackerEvidenceChips({ items }: { items: TrackerEvidence[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((ev) => (
        <span key={ev.id} className="inline-flex items-center gap-1 rounded-pill border border-border-subtle bg-white px-2 py-1 text-xs">
          <Paperclip size={10} />
          {ev.title}
          <TrackerStatusPill status={ev.status} />
        </span>
      ))}
    </div>
  );
}

// ─── Layout shells ────────────────────────────────────────────────────────────

interface ShellSlots {
  top?: React.ReactNode;
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
}

export function WorkbenchShell({ top, left, center, right, bottom }: ShellSlots) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {top}
      <div className="flex flex-1 min-h-0 gap-3">
        {left && <div className="w-64 shrink-0 overflow-hidden">{left}</div>}
        <div className="flex flex-1 min-w-0 flex-col overflow-hidden">{center}</div>
        {right && <div className="w-72 shrink-0 overflow-hidden">{right}</div>}
      </div>
      {bottom}
    </div>
  );
}

export function RegisterShell({ top, left, center, right, bottom }: ShellSlots) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {top}
      <div className="flex flex-1 min-h-0 gap-3">
        {left && <div className="w-56 shrink-0">{left}</div>}
        <div className="flex flex-1 min-w-0 overflow-auto">{center}</div>
        {right}
      </div>
      {bottom}
    </div>
  );
}

export function LedgerShell({ top, left, center, right, bottom }: ShellSlots) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {top}
      <div className="flex flex-1 min-h-0 gap-3">
        {left && <div className="w-48 shrink-0">{left}</div>}
        <div className="flex flex-1 min-w-0 overflow-auto rounded-card border border-border-subtle bg-white shadow-sm">{center}</div>
        {right && <div className="w-72 shrink-0">{right}</div>}
      </div>
      {bottom}
    </div>
  );
}

export function RecoveryShell({ top, left, center, right, bottom }: ShellSlots) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {top}
      <div className="flex flex-1 min-h-0 gap-3">
        {left && <div className="w-64 shrink-0 overflow-y-auto">{left}</div>}
        <div className="flex flex-1 min-w-0 flex-col gap-3 overflow-auto">{center}</div>
        {right && <div className="w-72 shrink-0">{right}</div>}
      </div>
      {bottom}
    </div>
  );
}

export function LifecycleShell({ top, left, center, right, bottom }: ShellSlots) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {top}
      <div className="flex flex-1 min-h-0 gap-3">
        {left && <div className="w-56 shrink-0 overflow-y-auto">{left}</div>}
        <div className="flex flex-1 min-w-0 flex-col gap-3 overflow-auto">{center}</div>
        {right && <div className="w-80 shrink-0 overflow-y-auto">{right}</div>}
      </div>
      {bottom}
    </div>
  );
}

export function TraceabilityShell({ top, left, center, right, bottom }: ShellSlots) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {top}
      <div className="flex flex-1 min-h-0 gap-3">
        {left && <div className="w-56 shrink-0 overflow-y-auto">{left}</div>}
        <div className="flex flex-1 min-w-0 flex-col gap-3 overflow-auto">{center}</div>
        {right && <div className="w-80 shrink-0 overflow-y-auto">{right}</div>}
      </div>
      {bottom}
    </div>
  );
}

// ─── Shared row column builders ───────────────────────────────────────────────

export function buildTrackerRowColumns(opts?: { emphasize?: string }): TrackerSheetColumn<TrackerRow>[] {
  return [
    { header: 'ID', width: '90px', frozen: true, accessor: (r) => <TrackerMonoId value={r.id} /> },
    { header: 'Tracker', width: '140px', frozen: true, accessor: (r) => r.trackerName },
    { header: 'Source', width: '120px', frozen: true, accessor: (r) => r.source.sourceFile },
    { header: 'Version', width: '70px', frozen: true, accessor: (r) => r.source.version },
    { header: 'Title', accessor: (r) => r.title },
    { header: 'Type', width: '90px', accessor: (r) => r.itemType },
    { header: 'Owner', width: '110px', accessor: (r) => r.owner },
    { header: 'Status', width: '100px', accessor: (r) => <TrackerStatusPill status={r.status} /> },
    ...(opts?.emphasize === 'riskReason'
      ? [{ header: 'Risk Reason', width: '120px', emphasized: true, accessor: (r: TrackerRow) => r.riskReason || '—' }]
      : []),
    ...(opts?.emphasize === 'daysOpen'
      ? [
          { header: 'Days Open', width: '90px', emphasized: true, accessor: (r: TrackerRow) => r.daysOpen ?? '—' },
          { header: 'Last Update', width: '100px', emphasized: true, accessor: (r: TrackerRow) => r.lastUpdate || '—' },
        ]
      : []),
    ...(opts?.emphasize === 'timeRemaining'
      ? [{ header: 'Time Remaining', width: '120px', emphasized: true, accessor: (r: TrackerRow) => <TrackerCountdownBadge timeRemaining={r.timeRemaining || '—'} urgent={r.slaState === 'At Risk'} /> }]
      : []),
    { header: 'Progress', width: '110px', accessor: (r) => <TrackerProgressCell percent={r.progress} /> },
    { header: 'Gap', width: '120px', accessor: (r) => r.gap || '—' },
    { header: 'Next Action', width: '140px', accessor: (r) => <span className="text-xs">{r.nextAction}</span> },
  ];
}
