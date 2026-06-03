import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ExternalLink, Flag, Settings, ShieldAlert, UserCog } from 'lucide-react';
import { useDirectoryLifecycle } from '../context/DirectoryLifecycleContext';
import { KpiTile } from '../components/KpiTile';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import type { AdminOwnershipReview } from '../types/workDirectory';

const statusFilters = ['All', 'Pending', 'Needs Review', 'At Risk', 'Issue Flagged', 'Reviewed'];
const configReferences = [
  { title: 'Ownership Records', route: '/admin/org-setup', description: 'Unit, team, owner, and backup-owner mappings.' },
  { title: 'Contact Routes', route: '/admin/workflow-rules', description: 'Routing, review, handoff, escalation, and queue paths.' },
  { title: 'Queue Ownership', route: '/support/fulfilment-queues', description: 'Fulfilment owner and support queue coverage.' },
  { title: 'Configuration References', route: '/admin/console', description: 'Admin console placeholders for full configuration features.' }
];

export function DirectoryAdminReviewPage() {
  const { adminReviews, markAdminReview, flagOwnershipGap, updateOwnerPlaceholder } = useDirectoryLifecycle();
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(adminReviews[0]?.id || '');

  const filtered = adminReviews.filter((item) => statusFilter === 'All' || item.status === statusFilter);
  const pending = adminReviews.filter((item) => item.status !== 'Reviewed');
  const high = pending.filter((item) => item.severity === 'High');
  const selected = adminReviews.find((item) => item.id === selectedId) || filtered[0] || adminReviews[0];
  const allReviewed = adminReviews.length > 0 && adminReviews.every((item) => item.status === 'Reviewed');

  const groupedIssues = useMemo(() => [
    { title: 'Missing Backup Owners', items: adminReviews.filter((item) => item.issue.toLowerCase().includes('backup')) },
    { title: 'Unavailable Owners', items: adminReviews.filter((item) => item.issue.toLowerCase().includes('unavailable')) },
    { title: 'Overloaded Queues', items: adminReviews.filter((item) => item.issue.toLowerCase().includes('queue')) },
    { title: 'Stale Ownership', items: adminReviews.filter((item) => item.issue.toLowerCase().includes('stale')) },
    { title: 'Missing Contact Routes', items: adminReviews.filter((item) => item.issue.toLowerCase().includes('contact route')) }
  ], [adminReviews]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-primary"><ShieldAlert size={28} /> Directory Admin Review</h1>
        <p className="mt-2 max-w-4xl text-text-secondary">Thin ownership review queue for stale ownership, missing backups, unavailable owners, overloaded queues, and missing contact routes. Full directory configuration remains out of scope for this feature.</p>
      </div>

      {allReviewed && (
        <div className="mb-6 rounded-card border border-success/20 bg-success-surface px-5 py-4 text-sm font-semibold text-success-text">
          <CheckCircle2 size={16} className="mr-2 inline" />
          All ownership review items are marked reviewed in prototype state.
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-5">
        <KpiTile label="Pending Issues" value={String(pending.length)} status="warning" />
        <KpiTile label="High Severity" value={String(high.length)} status="danger" />
        <KpiTile label="Issue Flagged" value={String(adminReviews.filter((item) => item.status === 'Issue Flagged').length)} status="warning" />
        <KpiTile label="Reviewed" value={String(adminReviews.filter((item) => item.status === 'Reviewed').length)} status="success" />
        <KpiTile label="Missing Backups" value={String(adminReviews.filter((item) => item.issue.includes('backup')).length)} status="info" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {groupedIssues.map((group) => (
          <button
            key={group.title}
            onClick={() => group.items[0] && setSelectedId(group.items[0].id)}
            className="rounded-card border border-border-default bg-white p-4 text-left shadow-sm hover:border-secondary"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{group.title}</p>
            <p className="mt-2 text-2xl font-bold text-primary">{group.items.length}</p>
            <p className="mt-1 text-xs text-text-muted">{group.items[0]?.directoryEntry || 'No active items'}</p>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <button key={status} onClick={() => setStatusFilter(status)} className={`rounded-pill px-4 py-2 text-xs font-bold ${statusFilter === status ? 'bg-primary text-white' : 'bg-white text-text-secondary ring-1 ring-border-subtle'}`}>
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm xl:col-span-2">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 size={42} className="mx-auto mb-3 text-success" />
              <p className="font-bold text-primary">No ownership review items</p>
              <p className="text-sm text-text-muted">The selected queue state is clear.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  {['ID', 'Issue', 'Entry', 'Severity', 'Status', 'Action', ''].map((heading) => <th key={heading} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">{heading}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((item) => (
                  <tr key={item.id} className={`cursor-pointer hover:bg-surface/50 ${selected?.id === item.id ? 'bg-orange-50/60' : ''}`} onClick={() => setSelectedId(item.id)}>
                    <td className="px-5 py-4"><MonoId value={item.id} /></td>
                    <td className="px-5 py-4 font-bold text-primary">{item.issue}</td>
                    <td className="px-5 py-4 text-sm text-text-secondary">
                      {item.directoryEntryId ? (
                        <Link onClick={(event) => event.stopPropagation()} to={`/marketplaces/work-directory/${item.directoryEntryId}`} className="font-bold text-primary hover:underline">
                          {item.directoryEntry}
                        </Link>
                      ) : item.directoryEntry}
                    </td>
                    <td className="px-5 py-4"><StatusPill status={item.severity} /></td>
                    <td className="px-5 py-4"><StatusPill status={item.status} /></td>
                    <td className="px-5 py-4 text-sm text-text-secondary">{item.action}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(event) => { event.stopPropagation(); setSelectedId(item.id); }} className="text-xs font-bold text-primary hover:underline">Inspect</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <ReviewDetail
          review={selected}
          onFlag={flagOwnershipGap}
          onUpdateOwner={updateOwnerPlaceholder}
          onReviewed={markAdminReview}
        />
      </div>

      <section className="mt-6 rounded-card border border-border-default bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Settings size={18} className="text-primary" />
          <h2 className="text-lg font-bold text-primary">Configuration References</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {configReferences.map((reference) => (
            <Link key={reference.title} to={reference.route} className="rounded-lg border border-border-subtle p-4 hover:border-secondary">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-bold text-primary">{reference.title}</p>
                <ExternalLink size={14} className="text-text-muted" />
              </div>
              <p className="text-xs leading-5 text-text-secondary">{reference.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {high.length > 0 && (
        <div className="mt-5 rounded-card border border-warning/20 bg-warning-surface px-5 py-4 text-sm font-semibold text-warning-text">
          <AlertTriangle size={16} className="mr-2 inline" />
          High severity ownership issues require confirming backup or escalation path before routing more work.
        </div>
      )}
    </div>
  );
}

function ReviewDetail({
  review,
  onFlag,
  onUpdateOwner,
  onReviewed
}: {
  review?: AdminOwnershipReview;
  onFlag: (reviewId: string) => void;
  onUpdateOwner: (reviewId: string) => void;
  onReviewed: (reviewId: string) => void;
}) {
  if (!review) {
    return (
      <aside className="rounded-card border border-border-default bg-white p-6 shadow-sm">
        <p className="text-sm text-text-muted">Select an ownership review item to inspect it.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-card border border-border-default bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <MonoId value={review.id} />
          <h2 className="mt-2 text-xl font-bold text-primary">{review.issue}</h2>
          <p className="mt-1 text-sm text-text-muted">{review.configurationReference || 'Directory configuration reference'}</p>
        </div>
        <StatusPill status={review.status} />
      </div>

      <div className="space-y-3">
        <DetailFact label="Affected entry" value={review.directoryEntry} />
        <DetailFact label="Recommended fix" value={review.recommendedFix || review.action} />
        <DetailFact label="Admin action" value={review.action} />
      </div>

      {review.directoryEntryId && (
        <Link to={`/marketplaces/work-directory/${review.directoryEntryId}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ExternalLink size={14} />
          Open affected directory entry
        </Link>
      )}

      <div className="mt-6 space-y-2">
        <button onClick={() => onUpdateOwner(review.id)} className="flex w-full items-center justify-center gap-2 rounded-button border border-border-default px-4 py-2.5 text-sm font-bold text-primary hover:bg-surface">
          <UserCog size={15} />
          Update owner placeholder
        </button>
        <button onClick={() => onFlag(review.id)} className="flex w-full items-center justify-center gap-2 rounded-button bg-warning-surface px-4 py-2.5 text-sm font-bold text-warning-text hover:bg-warning/20">
          <Flag size={15} />
          Flag ownership gap
        </button>
        <button onClick={() => onReviewed(review.id)} className="flex w-full items-center justify-center gap-2 rounded-button bg-success/10 px-4 py-2.5 text-sm font-bold text-success hover:bg-success/20">
          <CheckCircle2 size={15} />
          Mark reviewed
        </button>
      </div>
    </aside>
  );
}

function DetailFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}
