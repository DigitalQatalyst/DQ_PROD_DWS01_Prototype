import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { KpiTile } from '../components/KpiTile';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
export function GovernanceDashboardPage() {
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
  return <RolePageScaffold eyebrow="Governance" title="Governance Dashboard" purpose="Central view of compliance, audit exceptions, and operating discipline.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Audit Exceptions" value="2" status="warning" />
        <KpiTile label="Policy Adherence" value="98%" status="success" />
        <KpiTile label="Overdue Approvals" value="1" status="warning" />
        <KpiTile label="Missing Evidence" value="4" status="danger" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[12px] border border-[#D8D9E6] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-[#16A34A]" size={20} />
            <h3 className="text-lg font-bold text-[#111118]">Strong Areas</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center justify-between text-sm">
              <span className="text-[#2E2E42]">Task Ownership Assignment</span>
              <span className="font-bold text-[#16A34A]">100%</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-[#2E2E42]">Approval Routing Accuracy</span>
              <span className="font-bold text-[#16A34A]">99%</span>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-[12px] border border-[#D8D9E6] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-[#D97706]" size={20} />
            <h3 className="text-lg font-bold text-[#111118]">
              Areas for Improvement
            </h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center justify-between text-sm">
              <span className="text-[#2E2E42]">Evidence Attachment Rate</span>
              <span className="font-bold text-[#D97706]">82%</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-[#2E2E42]">Timely Progress Updates</span>
              <span className="font-bold text-[#D97706]">76%</span>
            </li>
          </ul>
        </div>
      </div>
    </RolePageScaffold>;
}