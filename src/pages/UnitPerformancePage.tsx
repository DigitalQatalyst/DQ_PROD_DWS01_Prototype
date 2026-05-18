import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { KpiTile } from '../components/KpiTile';
export function UnitPerformancePage() {
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
  return <RolePageScaffold eyebrow="Unit Visibility" title="Unit Performance" purpose="Aggregated performance scorecard across all teams in the unit.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Unit SLA Health" value="89%" status="warning" />
        <KpiTile label="Closure Quality" value="91%" status="success" />
        <KpiTile label="Avg Blocker Age" value="2.1d" status="danger" />
        <KpiTile label="Update Discipline" value="82%" status="success" />
      </div>

      <div className="bg-white rounded-[12px] border border-[#D8D9E6] p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#111118] mb-6">
          Team Comparison
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-[#111118]">eCom.DXP Squad</span>
              <span className="text-[#5F607F]">88% Overall</span>
            </div>
            <div className="w-full bg-[#EEEFF6] rounded-full h-2">
              <div className="bg-[#16A34A] h-2 rounded-full" style={{
              width: '88%'
            }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-[#111118]">Platform Core</span>
              <span className="text-[#5F607F]">94% Overall</span>
            </div>
            <div className="w-full bg-[#EEEFF6] rounded-full h-2">
              <div className="bg-[#16A34A] h-2 rounded-full" style={{
              width: '94%'
            }} />
            </div>
          </div>
        </div>
      </div>
    </RolePageScaffold>;
}