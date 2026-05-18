import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { OwnerBadge } from '../components/OwnerBadge';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
const mockMatrix = [{
  user: 'USR-001',
  role: 'Associate',
  setup: true,
  knowledge: true,
  policy: false,
  access: true
}, {
  user: 'USR-002',
  role: 'Scrum Master',
  setup: true,
  knowledge: true,
  policy: true,
  access: true
}];
export function WorkforceReadinessPage() {
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
  const renderStatus = (status: boolean) => status ? <CheckCircle2 size={18} className="text-[#16A34A] mx-auto" /> : <AlertTriangle size={18} className="text-[#D97706] mx-auto" />;
  return <RolePageScaffold eyebrow="HRA Workflow" title="Workforce Readiness" purpose="Matrix view of employee readiness across required dimensions.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EEEFF6] bg-[#F6F6FB]">
              <th className="p-4 text-xs font-bold text-[#5F607F] uppercase tracking-wider">
                Employee
              </th>
              <th className="p-4 text-xs font-bold text-[#5F607F] uppercase tracking-wider">
                Role
              </th>
              <th className="p-4 text-xs font-bold text-[#5F607F] uppercase tracking-wider text-center">
                Setup
              </th>
              <th className="p-4 text-xs font-bold text-[#5F607F] uppercase tracking-wider text-center">
                Knowledge
              </th>
              <th className="p-4 text-xs font-bold text-[#5F607F] uppercase tracking-wider text-center">
                Policy
              </th>
              <th className="p-4 text-xs font-bold text-[#5F607F] uppercase tracking-wider text-center">
                Access
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEEFF6]">
            {mockMatrix.map((row, i) => <tr key={i} className="hover:bg-[#F6F6FB] transition-colors">
                <td className="p-4">
                  <OwnerBadge userId={row.user} />
                </td>
                <td className="p-4 text-sm font-medium text-[#111118]">
                  {row.role}
                </td>
                <td className="p-4">{renderStatus(row.setup)}</td>
                <td className="p-4">{renderStatus(row.knowledge)}</td>
                <td className="p-4">{renderStatus(row.policy)}</td>
                <td className="p-4">{renderStatus(row.access)}</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </RolePageScaffold>;
}