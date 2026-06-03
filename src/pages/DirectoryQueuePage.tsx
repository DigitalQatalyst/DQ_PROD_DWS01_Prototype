import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, GitBranch, Inbox, ShieldCheck, UsersRound } from 'lucide-react';
import { useDirectoryLifecycle } from '../context/DirectoryLifecycleContext';
import { ContactRouteList, DirectoryLinkedWorkPanel, DirectoryTypeBadge, OwnershipSummary } from '../components/WorkDirectoryComponents';
import { KpiTile } from '../components/KpiTile';
import { StatusPill } from '../components/StatusPill';

export function DirectoryQueuePage() {
  const { queueId } = useParams();
  const { entries, linkedWork, getDetail, getOwnershipForEntry, getRoutesForEntry } = useDirectoryLifecycle();
  const queue = entries.find((entry) => entry.queueId === queueId || entry.id === queueId);
  const queueWork = linkedWork.filter((record) => record.workItemId === queueId || record.relatedDirectoryEntryId === queue?.id || record.type === 'Request');
  const queueDetail = getDetail(queue?.id);
  const ownership = getOwnershipForEntry(queue);
  const contactRoutes = getRoutesForEntry(queue);
  const queueUnavailable = !queue || queue.queueState === 'Unavailable' || queue.availability === 'Escalation only';
  const restrictedCount = queueWork.filter((item) => item.restricted).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-card border border-border-default bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-primary"><Inbox size={24} /></div>
            <div>
              <h1 className="text-3xl font-bold text-primary">{queue?.name || queueId || 'Related Queue'}</h1>
              <p className="mt-1 text-text-secondary">Related queue/work placeholder with directory ownership context.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {queue && <DirectoryTypeBadge type={queue.entityType} />}
            <StatusPill status={queueUnavailable ? 'Unavailable' : 'Available'} />
          </div>
        </div>
      </div>

      {queueUnavailable && (
        <div className="mb-6 rounded-card border border-danger/20 bg-danger-surface px-5 py-4 text-sm font-semibold text-danger-text">
          <AlertTriangle size={16} className="mr-2 inline" />
          This queue is unavailable or not mapped. Use the backup owner or escalation route before routing new work here.
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <KpiTile label="Related Work" value={String(queueWork.length)} status="info" />
        <KpiTile label="At Risk" value={String(queueWork.filter((item) => ['Escalated', 'Pending Info', 'At Risk'].includes(item.status)).length)} status="warning" />
        <KpiTile label="Queue Owner" value={queue?.lead || 'Mapped'} status="success" />
        <KpiTile label="Restricted Items" value={String(restrictedCount)} status={restrictedCount > 0 ? 'warning' : 'success'} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-card border border-border-default bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <UsersRound size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-primary">Ownership Context</h2>
          </div>
          <div className="space-y-3 text-sm">
            <ContextRow label="Primary owner" value={queue?.lead || 'Not mapped'} />
            <ContextRow label="Backup owner" value={queue?.backupOwner || 'Missing backup owner'} />
            <ContextRow label="SLA / escalation" value={queueDetail?.escalationTrigger || 'Not mapped'} />
            <ContextRow label="Coverage notes" value={queueDetail?.coverageNotes || 'Not mapped'} />
          </div>
        </section>

        <section className="rounded-card border border-border-default bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-primary">Owned Areas</h2>
          </div>
          <OwnershipSummary records={ownership} />
        </section>
      </div>

      <section className="mb-6 rounded-card border border-border-default bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <GitBranch size={18} className="text-primary" />
          <h2 className="text-lg font-bold text-primary">Queue Routes</h2>
        </div>
        <ContactRouteList routes={contactRoutes} />
      </section>

      <section className="rounded-card border border-border-default bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Related Tasks, Requests, Approvals, Escalations</h2>
          <div className="flex flex-wrap items-center gap-3">
            {queue && <Link to={`/marketplaces/work-directory/${queue.id}`} className="text-sm font-bold text-primary hover:underline">Open directory entry</Link>}
            <Link to="/admin/work-directory/review" className="rounded-button bg-secondary px-3 py-2 text-xs font-bold text-white hover:bg-orange-600">
              Admin review
            </Link>
          </div>
        </div>
        {queueWork.length > 0 ? (
          <DirectoryLinkedWorkPanel records={queueWork} />
        ) : (
          <div className="rounded-lg bg-surface px-5 py-8 text-center">
            <p className="font-bold text-primary">No related work items</p>
            <p className="mt-1 text-sm text-text-muted">This queue has no mapped tasks, requests, approvals, escalations, or knowledge records.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 font-semibold text-text-primary">{value}</p>
    </div>
  );
}
