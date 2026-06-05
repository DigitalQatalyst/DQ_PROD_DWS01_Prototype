import React from 'react';
import { Activity, AlertTriangle, Flame, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRequestsConsole } from '../../context/RequestsConsoleContext';

function signalIcon(status: string) {
  if (status === 'Danger') return <Flame size={18} className="text-danger" />;
  if (status === 'Warning') return <AlertTriangle size={18} className="text-warning" />;
  return <Activity size={18} className="text-info" />;
}

function signalBg(status: string) {
  if (status === 'Danger') return 'bg-danger-surface border-danger/30';
  if (status === 'Warning') return 'bg-warning-surface border-warning/30';
  return 'bg-info-surface border-info/30';
}

export function RequestsHealthSignalsPage() {
  const navigate = useNavigate();
  const { state } = useRequestsConsole();

  const signals = state.healthSignals;

  const slaAtRisk = state.requests.filter((r) => r.slaState === 'At Risk');
  const breached = state.requests.filter((r) => r.slaState === 'Breached');
  const blocked = state.requests.filter((r) => r.fulfilmentStatus === 'Blocked');
  const reopened = state.requests.filter((r) => r.fulfilmentStatus === 'Reopened');
  const closureReview = state.requests.filter((r) => r.fulfilmentStatus === 'Closure Review');

  return (
    <div className="bg-[#F6F6FB] min-h-full pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Stage 03</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">Requests Health Signals</h1>
          <p className="text-sm text-text-secondary max-w-2xl">
            Monitor backlog, SLA exposure, owner load, ageing, recurrence, escalation concentration, and closure quality.
          </p>
        </header>

        {/* Signal Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {signals.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(s.linkedRoute)}
              className={`rounded-card border p-4 text-left transition-colors hover:opacity-90 ${signalBg(s.status)}`}
            >
              <div className="flex items-center gap-2 mb-3">
                {signalIcon(s.status)}
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{s.signal}</span>
              </div>
              <div className="text-2xl font-bold text-primary">{s.value}</div>
            </button>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backlog */}
          <div className="bg-white rounded-card border border-border-default p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-text-muted" />
              <h3 className="text-sm font-bold text-primary">Backlog by Queue</h3>
            </div>
            <div className="space-y-2">
              {state.ownerQueues.map((q) => (
                <div key={q.id} className="flex items-center justify-between rounded-lg bg-surface px-4 py-2.5">
                  <span className="text-sm font-medium text-text-secondary">{q.queueName}</span>
                  <span className="text-sm font-bold text-primary">{q.activeItems} active</span>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Exposure */}
          <div className="bg-white rounded-card border border-border-default p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-warning" />
              <h3 className="text-sm font-bold text-primary">SLA Exposure</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">At Risk</span>
                <span className="text-sm font-bold text-warning">{slaAtRisk.length} requests</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Breached</span>
                <span className="text-sm font-bold text-danger">{breached.length} requests</span>
              </div>
              <div className="pt-3 border-t border-border-subtle">
                {slaAtRisk.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs py-1">
                    <span className="text-text-muted font-mono">{r.id}</span>
                    <span className="text-warning font-medium">{r.age}</span>
                  </div>
                ))}
                {breached.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs py-1">
                    <span className="text-text-muted font-mono">{r.id}</span>
                    <span className="text-danger font-medium">{r.age}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Owner Load */}
          <div className="bg-white rounded-card border border-border-default p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-text-muted" />
              <h3 className="text-sm font-bold text-primary">Owner Load</h3>
            </div>
            <div className="space-y-2">
              {state.ownerQueues.map((q) => (
                <div key={q.id} className="flex items-center justify-between rounded-lg bg-surface px-4 py-2.5">
                  <div>
                    <span className="text-sm font-medium text-text-secondary">{q.owner}</span>
                    <span className="text-xs text-text-muted ml-2">({q.queueName})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{q.activeItems}</span>
                    <span className="text-xs text-text-muted">items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closure Quality */}
          <div className="bg-white rounded-card border border-border-default p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-success" />
              <h3 className="text-sm font-bold text-primary">Closure Quality</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">In Closure Review</span>
                <span className="text-sm font-bold text-info">{closureReview.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Reopened</span>
                <span className="text-sm font-bold text-warning">{reopened.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Blocked</span>
                <span className="text-sm font-bold text-danger">{blocked.length}</span>
              </div>
              <div className="pt-3 border-t border-border-subtle">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Overall acceptance rate</span>
                  <span className="font-bold text-success">76%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
