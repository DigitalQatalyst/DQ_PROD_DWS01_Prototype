import React, { useState } from 'react';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { MonoId } from '../components/MonoId';
import { Calendar, AlertCircle, CheckCircle2, RefreshCcw, Activity, Clock, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KnowledgeReviewQueueItem, ReviewQueueStatus } from '../types/knowledgeDiscovery';

type StatusFilter = 'All' | ReviewQueueStatus;

const STATUS_FILTERS: StatusFilter[] = ['All', 'Pending Review', 'Update Required', 'Review Scheduled', 'Owner Review'];

function ReasonBadge({ reason }: { reason: string }) {
  const color = reason === 'Outdated flag'
    ? 'bg-danger/10 text-danger'
    : reason === 'Missing detail'
    ? 'bg-warning/10 text-warning'
    : reason === 'Unclear guidance'
    ? 'bg-info/10 text-info'
    : reason === 'Wrong owner'
    ? 'bg-slate-100 text-slate-600'
    : 'bg-surface text-text-muted';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${color}`}>
      <AlertCircle size={11} />
      {reason}
    </span>
  );
}

function StatusBadge({ status }: { status: ReviewQueueStatus }) {
  const config: Record<string, string> = {
    'Pending Review':     'bg-warning/10 text-warning',
    'Update Required':    'bg-danger/10 text-danger',
    'Review Scheduled':   'bg-info/10 text-info',
    'Owner Review':       'bg-purple-100 text-purple-700',
    'Pending':            'bg-warning/10 text-warning',
    'In Progress':        'bg-primary/10 text-primary',
    'Completed':          'bg-success/10 text-success',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${config[status] ?? 'bg-surface text-text-muted'}`}>
      {status}
    </span>
  );
}

export function KnowledgeReviewQueuePage() {
  const { reviewQueue, markReviewComplete } = useKnowledgeLifecycle();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [actionItem, setActionItem] = useState<KnowledgeReviewQueueItem | null>(null);

  const pendingItems = reviewQueue.filter(i => i.status !== 'Completed');
  const overdue = pendingItems.filter(i => i.slaDue.toLowerCase().includes('tomorrow') || i.slaDue.toLowerCase().includes('overdue')).length;
  const updatedThisWeek = reviewQueue.filter(i => i.status === 'Completed').length;
  const ownerReview = pendingItems.filter(i => i.status === 'Owner Review').length;

  const kpis = [
    { label: 'Pending Review',   value: pendingItems.length,  icon: Clock,        color: 'text-warning' },
    { label: 'Overdue / Urgent', value: overdue,              icon: TrendingDown,  color: 'text-danger' },
    { label: 'Owner Review',     value: ownerReview,          icon: RefreshCcw,   color: 'text-purple-600' },
    { label: 'Resolved This Week', value: updatedThisWeek,   icon: CheckCircle2, color: 'text-success' },
  ];

  const filtered = pendingItems.filter(i => statusFilter === 'All' || i.status === statusFilter);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Knowledge Review Queue</h1>
        <p className="mt-1 text-text-secondary">
          Governance review queue for knowledge assets flagged by feedback, SLA overdue, or content owner action required.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border-subtle">
              <Icon size={18} className={`mb-2 ${kpi.color}`} />
              <p className="text-2xl font-bold text-text-primary">{kpi.value}</p>
              <p className="mt-0.5 text-xs font-semibold text-text-muted">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Status filter tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              statusFilter === f
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-text-muted ring-1 ring-border-subtle hover:text-primary'
            }`}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5">
                ({pendingItems.filter(i => i.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-success opacity-60" />
            <p className="font-bold text-text-primary">Queue is clear</p>
            <p className="mt-1 text-sm text-text-muted">No pending reviews matching the current filter.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-surface">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">ID</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">Asset</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">Reason</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">Due</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">Owner</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-4">
                    <MonoId value={item.id} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/marketplaces/knowledge/${item.assetId}`)}
                      className="text-sm font-semibold text-text-primary hover:text-primary text-left"
                    >
                      {item.assetTitle}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <ReasonBadge reason={item.queueReason} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <Calendar size={14} />
                      {item.slaDue}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{item.owner}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/marketplaces/knowledge/${item.assetId}`)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Review Asset
                      </button>
                      <button
                        onClick={() => markReviewComplete(item.id, 'Update Required')}
                        className="text-xs font-bold text-warning hover:underline"
                      >
                        Request Update
                      </button>
                      <button
                        onClick={() => markReviewComplete(item.id)}
                        className="rounded-lg bg-success/10 px-2.5 py-1 text-xs font-bold text-success hover:bg-success/20 transition-colors"
                      >
                        Mark Reviewed
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
