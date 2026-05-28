import React, { useEffect, useState } from 'react';
import { getKnowledgeSignals } from '../services/platform.service';
import { KnowledgeExecutiveSignal } from '../types/knowledgeDiscovery';
import { ExecutiveSignalStrip } from '../components/ExecutiveSignalStrip';
import { Activity } from 'lucide-react';

export function ExecutiveKnowledgeSignalPage() {
  const [signals, setSignals] = useState<KnowledgeExecutiveSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getKnowledgeSignals().then(data => {
      setSignals(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div className="p-8">Loading intelligence signals...</div>;

  const mappedSignals = signals.map(s => ({
    id: s.id,
    label: s.signal,
    value: String(s.value),
    trend: s.trend,
    status: s.status as any
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Activity size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Knowledge Intelligence</h1>
          <p className="text-sm text-text-secondary">Executive signals for platform knowledge health and adoption.</p>
        </div>
      </div>

      <ExecutiveSignalStrip signals={mappedSignals} />

      <div className="mt-8 rounded-xl border border-border-default bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-text-primary">Actionable Insights</h2>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-danger"></div>
            <div>
              <p className="font-bold text-text-primary">High Outdated Flags Volume</p>
              <p className="text-sm text-text-secondary">34 assets have been flagged as outdated in the last 30 days. Recommend allocating review capacity to the Content Governance team.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-success"></div>
            <div>
              <p className="font-bold text-text-primary">Strong Linked Work Adoption</p>
              <p className="text-sm text-text-secondary">68% of knowledge assets are actively linked to governed tasks, indicating strong integration into the daily operating rhythm.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
