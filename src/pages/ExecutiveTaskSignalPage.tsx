import React, { useEffect, useState } from 'react';
import { getTaskSignals } from '../services/platform.service';
import { TaskExecutiveSignal } from '../types/taskLibrary';
import { ExecutiveSignalStrip } from '../components/ExecutiveSignalStrip';
import { Activity, Briefcase } from 'lucide-react';

export function ExecutiveTaskSignalPage() {
  const [signals, setSignals] = useState<TaskExecutiveSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTaskSignals().then(data => {
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
          <Briefcase size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Task Model Intelligence</h1>
          <p className="text-sm text-text-secondary">Executive signals for template adoption, execution quality, and governance exceptions.</p>
        </div>
      </div>

      <ExecutiveSignalStrip signals={mappedSignals} />

      <div className="mt-8 rounded-xl border border-border-default bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-text-primary">Actionable Insights</h2>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-warning"></div>
            <div>
              <p className="font-bold text-text-primary">Review Queue Bottlenecks</p>
              <p className="text-sm text-text-secondary">45 tasks are currently pending review, up 12 from last week. Recommend investigating if lead reviewers are overallocated.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-success"></div>
            <div>
              <p className="font-bold text-text-primary">Template Adoption Rate</p>
              <p className="text-sm text-text-secondary">78% of all tasks created this month used governed templates, reducing manual effort and improving compliance.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
