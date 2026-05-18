import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { KpiTile } from '../components/KpiTile';
export function TeamPerformancePage() {
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
  return <RolePageScaffold eyebrow="Team Execution" title="Team Performance" purpose="Scorecard tracking SLA health, closure quality, and operating discipline.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="SLA Health" value="92%" status="success" />
        <KpiTile label="Closure Quality" value="88%" status="success" />
        <KpiTile label="Avg Blocker Age" value="1.5d" status="warning" />
        <KpiTile label="Update Discipline" value="76%" status="warning" />
      </div>

      <div className="bg-white rounded-[12px] border border-[#D8D9E6] p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#111118] mb-6">
          Performance Trends
        </h3>
        <div className="space-y-6">
          {[{
          label: 'SLA Attainment',
          value: 92,
          color: 'bg-[#16A34A]'
        }, {
          label: 'First-time Closure Approval',
          value: 88,
          color: 'bg-[#16A34A]'
        }, {
          label: 'Timely Updates',
          value: 76,
          color: 'bg-[#D97706]'
        }, {
          label: 'Evidence Completeness',
          value: 65,
          color: 'bg-[#D97706]'
        }].map((metric, i) => <div key={i}>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-[#111118]">{metric.label}</span>
                <span className="text-[#5F607F]">{metric.value}%</span>
              </div>
              <div className="w-full bg-[#EEEFF6] rounded-full h-2">
                <div className={`${metric.color} h-2 rounded-full`} style={{
              width: `${metric.value}%`
            }} />
              </div>
            </div>)}
        </div>
      </div>
    </RolePageScaffold>;
}