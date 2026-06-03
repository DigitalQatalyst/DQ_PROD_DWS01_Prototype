import React, { useEffect, useState } from 'react';
import { getKnowledgeSignals } from '../services/platform.service';
import { KnowledgeExecutiveSignal } from '../types/knowledgeDiscovery';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Link as LinkIcon, Flag, ClipboardList, ShieldCheck, AlertTriangle,
  TrendingUp, TrendingDown, Minus, ExternalLink, Activity
} from 'lucide-react';

function trendIcon(trend?: string) {
  if (!trend || trend === '0') return <Minus size={14} className="text-text-muted" />;
  const positive = trend.startsWith('+');
  return positive
    ? <TrendingUp size={14} className="text-success" />
    : <TrendingDown size={14} className="text-danger" />;
}

function statusColor(status: string) {
  if (status === 'success') return 'border-l-success bg-success/5';
  if (status === 'warning') return 'border-l-warning bg-warning/5';
  if (status === 'danger') return 'border-l-danger bg-danger/5';
  return 'border-l-primary bg-navy-50';
}

function valueColor(status: string) {
  if (status === 'success') return 'text-success';
  if (status === 'warning') return 'text-warning';
  if (status === 'danger') return 'text-danger';
  return 'text-primary';
}

const SIGNAL_ICONS: Record<string, React.ElementType> = {
  'Knowledge assets opened this week': BookOpen,
  'Assets linked to work': LinkIcon,
  'Outdated flags pending': Flag,
  'Acknowledgements pending': ClipboardList,
  'Effective references': ShieldCheck,
  'Review overdue': AlertTriangle,
};

const INSIGHTS = [
  {
    severity: 'danger',
    title: 'Review Overdue — Immediate Action Needed',
    body: '2 knowledge assets are overdue for governance review. The Knowledge Content Owner should prioritise these before the next governance cycle.'
  },
  {
    severity: 'warning',
    title: 'Outdated Flags Pending Review',
    body: '3 assets have been flagged as outdated by Associates. The Review Queue requires Owner action within the SLA window.'
  },
  {
    severity: 'warning',
    title: 'Acknowledgements Pending',
    body: '6 required acknowledgements are outstanding across the platform. This may indicate Associates are not completing their onboarding knowledge requirements.'
  },
  {
    severity: 'success',
    title: 'Strong Linked Work Adoption',
    body: '18 knowledge assets are actively linked to governed tasks and requests, indicating good integration into the daily operating rhythm.'
  },
  {
    severity: 'success',
    title: 'Effective Reference Base',
    body: '27 of 30 knowledge assets are in Effective status, demonstrating a well-maintained knowledge base.'
  }
];

export function ExecutiveKnowledgeSignalPage() {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<KnowledgeExecutiveSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getKnowledgeSignals().then(data => {
      setSignals(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div className="p-8 text-text-muted text-sm">Loading knowledge intelligence signals...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Activity size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Knowledge Intelligence Signals</h1>
          <p className="text-sm text-text-secondary">Executive view of platform knowledge health, adoption, and governance compliance.</p>
        </div>
      </div>

      {/* Signal Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {signals.map(signal => {
          const Icon = SIGNAL_ICONS[signal.signal] ?? BookOpen;
          return (
            <div
              key={signal.id}
              className={`rounded-xl border-l-4 p-5 shadow-sm ring-1 ring-border-subtle ${statusColor(signal.status)}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ${valueColor(signal.status)}`}>
                  <Icon size={18} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${valueColor(signal.status)}`}>
                  {trendIcon(signal.trend)}
                  {signal.trend && signal.trend !== '0' ? signal.trend + ' this week' : 'No change'}
                </div>
              </div>
              <p className={`text-3xl font-bold ${valueColor(signal.status)}`}>{signal.value}</p>
              <p className="mt-1 text-sm font-semibold text-text-secondary">{signal.signal}</p>
              {signal.linksTo && (
                <button
                  onClick={() => navigate('/marketplaces/knowledge')}
                  className="mt-3 flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Inspect <ExternalLink size={11} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Actionable Insights */}
      <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-text-primary">Actionable Insights</h2>
        <ul className="space-y-4">
          {INSIGHTS.map((insight, i) => (
            <li key={i} className="flex gap-4">
              <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                insight.severity === 'danger' ? 'bg-danger' :
                insight.severity === 'warning' ? 'bg-warning' : 'bg-success'
              }`} />
              <div>
                <p className="font-bold text-text-primary">{insight.title}</p>
                <p className="mt-0.5 text-sm text-text-secondary">{insight.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Drill-down CTAs */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={() => navigate('/knowledge/review')}
          className="flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-border-subtle hover:ring-primary/30 hover:shadow-md transition-all"
        >
          <div className="text-left">
            <p className="font-bold text-text-primary">Open Review Queue</p>
            <p className="text-xs text-text-muted">Action flagged and overdue assets</p>
          </div>
          <ExternalLink size={16} className="text-text-muted" />
        </button>
        <button
          onClick={() => navigate('/marketplaces/knowledge')}
          className="flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-border-subtle hover:ring-primary/30 hover:shadow-md transition-all"
        >
          <div className="text-left">
            <p className="font-bold text-text-primary">Browse Knowledge Hub</p>
            <p className="text-xs text-text-muted">View all 30 knowledge assets</p>
          </div>
          <ExternalLink size={16} className="text-text-muted" />
        </button>
      </div>
    </div>
  );
}
