import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
export function ValueDeliveryPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const indicators = [{
    label: 'Strategic Alignment',
    value: 85,
    desc: 'Tasks linked to strategic outcomes'
  }, {
    label: 'Delivery Velocity',
    value: 92,
    desc: 'Tasks completed within SLA'
  }, {
    label: 'Quality',
    value: 88,
    desc: 'Tasks passing closure review first time'
  }];
  return <RolePageScaffold eyebrow="Enterprise Execution" title="Value Delivery" purpose="Measure the actual value and quality delivered by the organisation." loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {indicators.map((ind) => <div key={ind.label} className="bg-white rounded-card border border-border-default shadow-sm p-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
              {ind.label}
            </h3>
            <p className="text-xs text-text-secondary mb-6">{ind.desc}</p>

            <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-bold text-primary">
                {ind.value}%
              </div>
              <div className="text-xs text-text-muted mb-1">Target: 90%</div>
            </div>

            <div className="w-full bg-surface rounded-full h-2">
              <div className={`h-2 rounded-full ${ind.value >= 90 ? 'bg-success' : 'bg-warning'}`} style={{
            width: `${ind.value}%`
          }} />
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}