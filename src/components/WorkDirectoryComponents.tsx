import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  GitBranch,
  Inbox,
  Lock,
  MessageSquare,
  SquareArrowOutUpRight,
  ShieldCheck,
  UserRound,
  UsersRound
} from 'lucide-react';
import { MonoId } from './MonoId';
import { StatusPill } from './StatusPill';
import type { ContactRoute, DirectoryEntry, DirectoryLinkedWork, OwnershipArea } from '../types/workDirectory';

export function DirectoryTypeBadge({ type }: { type: string }) {
  return <span className="rounded-pill bg-navy-100 px-2.5 py-1 text-xs font-bold text-primary">{type}</span>;
}

export function AvailabilityBadge({ value }: { value: string }) {
  return <StatusPill status={value} />;
}

export function WorkloadBadge({ value }: { value: string }) {
  return <StatusPill status={value} />;
}

export function OwnershipChip({ value }: { value: string }) {
  return <span className="rounded-pill border border-border-subtle bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">{value}</span>;
}

export function DirectoryIcon({ entry }: { entry: DirectoryEntry }) {
  const Icon =
    entry.entityType === 'Team'
      ? UsersRound
      : entry.entityType === 'Unit'
      ? Building2
      : entry.entityType === 'Queue' || entry.entityType === 'Support Contact'
      ? Inbox
      : entry.entityType === 'Governance Owner'
      ? ShieldCheck
      : UserRound;
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-primary">
      <Icon size={21} />
    </div>
  );
}

function primaryAction(entry: DirectoryEntry) {
  if (entry.entityType === 'Unit') return { label: 'View Structure', route: '/marketplaces/work-directory/structure' };
  if (entry.entityType === 'Queue' || entry.entityType === 'Support Contact') return { label: 'Open Queue', route: `/queues/${entry.queueId || entry.id}` };
  if (entry.entityType === 'Expert') return { label: 'Request Review', route: `/marketplaces/work-directory/${entry.id}/contact?action=review` };
  if (entry.entityType === 'Team' || entry.entityType === 'Service Owner' || entry.entityType === 'Fulfilment Contact') return { label: 'Route Request', route: `/marketplaces/work-directory/${entry.id}/route` };
  return { label: 'Contact', route: `/marketplaces/work-directory/${entry.id}/contact` };
}

export function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  const navigate = useNavigate();
  const action = primaryAction(entry);
  return (
    <article
      onClick={() => navigate(`/marketplaces/work-directory/${entry.id}`)}
      className="flex min-h-[250px] cursor-pointer flex-col rounded-card border border-border-default bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <DirectoryIcon entry={entry} />
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-primary">{entry.name}</h3>
            <p className="mt-1 text-sm font-medium text-text-secondary">{entry.roleLabel}</p>
          </div>
        </div>
        <DirectoryTypeBadge type={entry.entityType} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="mb-1 font-semibold text-text-muted">Unit</p>
          <p className="truncate font-bold text-text-primary">{entry.unit}</p>
        </div>
        <div>
          <p className="mb-1 font-semibold text-text-muted">Route</p>
          <p className="truncate font-bold text-text-primary">{entry.preferredContactRoute}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <AvailabilityBadge value={entry.availability} />
        <WorkloadBadge value={entry.workload} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {entry.ownershipAreas.slice(0, 3).map((area) => <OwnershipChip key={area} value={area} />)}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
        <MonoId value={entry.id} />
        <Link
          to={action.route}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-1.5 rounded-button bg-secondary px-3 py-2 text-xs font-bold text-white hover:bg-orange-600"
        >
          {action.label}
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

export function DirectoryDetailHero({ entry }: { entry: DirectoryEntry }) {
  return (
    <div className="mb-8 rounded-card border border-border-default bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        <Link to="/marketplaces/work-directory" className="font-semibold text-primary hover:underline">Stage 01 Marketplaces</Link>
        <span>/</span>
        <Link to="/marketplaces/work-directory" className="font-semibold text-primary hover:underline">Work Directory</Link>
        <span>/</span>
        <span>{entry.name}</span>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <DirectoryIcon entry={entry} />
          <div>
            <MonoId value={entry.id} />
            <h1 className="mt-2 text-3xl font-bold text-primary">{entry.name}</h1>
            <p className="mt-1 text-text-secondary">{entry.roleLabel} · {entry.unit}{entry.team ? ` · ${entry.team}` : ''}</p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-text-secondary">{entry.summary}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <DirectoryTypeBadge type={entry.entityType} />
          <AvailabilityBadge value={entry.availability} />
          <WorkloadBadge value={entry.workload} />
        </div>
      </div>
    </div>
  );
}

export function DirectoryInfoCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-border-default bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-bold text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function DirectoryActionRail({ entry, executiveOnly = false }: { entry: DirectoryEntry; executiveOnly?: boolean }) {
  const actions = executiveOnly
    ? [{ label: 'View Structure', route: '/marketplaces/work-directory/structure', icon: GitBranch }]
    : [
        { label: 'Contact', route: `/marketplaces/work-directory/${entry.id}/contact`, icon: MessageSquare },
        { label: 'Route Request', route: `/marketplaces/work-directory/${entry.id}/route`, icon: ArrowRight },
        { label: 'Assign Task', route: `/marketplaces/work-directory/${entry.id}/route?action=assign`, icon: Briefcase },
        { label: 'Request Review', route: `/marketplaces/work-directory/${entry.id}/contact?action=review`, icon: ShieldCheck },
        { label: 'Handoff Work', route: `/marketplaces/work-directory/${entry.id}/route?action=handoff`, icon: GitBranch },
        { label: 'Escalate', route: `/marketplaces/work-directory/${entry.id}/escalate`, icon: AlertTriangle },
        { label: 'Open Queue', route: `/queues/${entry.queueId || 'QUE-3001'}`, icon: Inbox },
        { label: 'View Related Work', route: `/queues/${entry.queueId || 'QUE-3001'}`, icon: Briefcase }
      ];
  return (
    <aside className="sticky top-24 rounded-card border border-border-default bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-muted">Directory actions</h2>
      <div className="space-y-2">
        {actions.map(({ label, route, icon: Icon }) => (
          <Link
            key={label}
            to={route}
            className="flex items-center gap-3 rounded-button border border-border-subtle px-3 py-2.5 text-sm font-bold text-primary transition-colors hover:border-secondary hover:bg-orange-50"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function OwnershipSummary({ records }: { records: OwnershipArea[] }) {
  if (records.length === 0) return <p className="text-sm text-text-muted">No ownership records mapped.</p>;
  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div key={record.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface px-4 py-3">
          <div>
            <p className="font-bold text-text-primary">{record.area}</p>
            <p className="text-xs text-text-muted">{record.owner} · {record.linksTo}</p>
          </div>
          <StatusPill status={record.coverageState} />
        </div>
      ))}
    </div>
  );
}

export function ContactRouteList({ routes }: { routes: ContactRoute[] }) {
  if (routes.length === 0) return <p className="text-sm text-text-muted">No contact routes mapped.</p>;
  return (
    <div className="space-y-3">
      {routes.map((route) => (
        <div key={route.id} className="rounded-lg border border-border-subtle p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-primary">{route.routeType}</p>
            <MonoId value={route.id} />
          </div>
          <p className="text-sm text-text-secondary">{route.usedFor}</p>
          <p className="mt-2 text-xs text-text-muted">Primary: {route.primaryOwner} · Backup: {route.backupOwner || 'Not mapped'} · SLA: {route.condition}</p>
        </div>
      ))}
    </div>
  );
}

export function DirectoryLinkedWorkPanel({ records }: { records: DirectoryLinkedWork[] }) {
  if (records.length === 0) {
    return <p className="rounded-lg bg-surface px-4 py-5 text-sm text-text-muted">No linked work is mapped for this entry.</p>;
  }
  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div key={record.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 ${record.restricted ? 'border-warning/30 bg-warning-surface' : 'border-border-subtle'}`}>
          <div>
            <MonoId value={record.workItemId} />
            <p className="mt-1 font-bold text-text-primary">{record.title}</p>
            <p className="text-xs text-text-muted">{record.type} · Owner: {record.owner}</p>
            {record.restricted && <p className="mt-1 text-xs font-semibold text-warning-text">{record.restrictionReason || 'Restricted related work item.'}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={record.status} />
            {record.restricted ? (
              <span className="inline-flex items-center gap-1 rounded-button border border-warning/30 px-3 py-2 text-xs font-bold text-warning-text">
                <Lock size={13} />
                Restricted
              </span>
            ) : (
              <Link to={getLinkedWorkRoute(record)} className="inline-flex items-center gap-1 rounded-button bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-navy-700">
                Open item
                <SquareArrowOutUpRight size={13} />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function getLinkedWorkRoute(record: DirectoryLinkedWork) {
  if (record.targetRoute) return record.targetRoute;
  if (record.type === 'Task') return `/tasks/${record.workItemId}`;
  if (record.type === 'Request') return `/requests/${record.workItemId}/status`;
  if (record.type === 'Approval') return '/workflow/approvals';
  if (record.type === 'Workflow' || record.type === 'Escalation') return '/execution/workflow';
  if (record.type === 'Knowledge') return `/marketplaces/knowledge/${record.workItemId}`;
  if (record.type === 'Queue') return `/queues/${record.workItemId}`;
  return '/workspace/my-work';
}
