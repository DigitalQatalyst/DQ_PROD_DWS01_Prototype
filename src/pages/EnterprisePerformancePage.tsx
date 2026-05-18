import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
export function EnterprisePerformancePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const metrics = [{
    label: 'SLA Health',
    value: '94%',
    target: '95%',
    status: 'warning'
  }, {
    label: 'Closure Quality',
    value: '87%',
    target: '90%',
    status: 'warning'
  }, {
    label: 'Blocker Resolution',
    value: '1.2 days',
    target: '< 2 days',
    status: 'success'
  }, {
    label: 'Update Discipline',
    value: '98%',
    target: '95%',
    status: 'success'
  }];
  return <RolePageScaffold eyebrow="Enterprise Execution" title="Enterprise Performance" purpose="High-level scorecard of platform execution metrics." loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((m) => <div key={m.label} className="bg-white rounded-card border border-border-default shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                {m.label}
              </h3>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-pill ${m.status === 'success' ? 'bg-success-surface text-success' : 'bg-warning-surface text-warning-text'}`}>
                {m.status === 'success' ? 'On Target' : 'Below Target'}
              </span>
            </div>
            <div className="flex items-end gap-4">
              <div className="text-4xl font-bold text-primary">{m.value}</div>
              <div className="text-sm text-text-muted mb-1">
                Target: {m.target}
              </div>
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}