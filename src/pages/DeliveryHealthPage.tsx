import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
const mockHealth = [{
  team: 'eCom.DXP Squad',
  status: 'At Risk',
  score: 72,
  issues: ['High blocker age', 'SLA breaches']
}, {
  team: 'Platform Core',
  status: 'On Track',
  score: 94,
  issues: []
}];
export function DeliveryHealthPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Unit Visibility" title="Delivery Health" purpose="High-level health indicators for team delivery pipelines.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockHealth.map((health, i) => <div key={i} className={`bg-white rounded-[12px] border p-5 shadow-sm ${health.status === 'At Risk' ? 'border-[#FCA5A5]' : 'border-[#D8D9E6]'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111118]">
                {health.team}
              </h3>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${health.status === 'At Risk' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#F0FDF4] text-[#16A34A]'}`}>
                {health.status === 'At Risk' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                {health.status}
              </div>
            </div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-bold text-[#111118]">
                {health.score}
              </span>
              <span className="text-sm text-[#5F607F] mb-1">Health Score</span>
            </div>
            {health.issues.length > 0 && <div className="bg-[#FEF2F2] rounded-[8px] p-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626] block mb-1">
                  Active Issues
                </span>
                <ul className="list-disc list-inside text-sm text-[#DC2626]">
                  {health.issues.map((issue, j) => <li key={j}>{issue}</li>)}
                </ul>
              </div>}
          </div>)}
      </div>
    </RolePageScaffold>;
}