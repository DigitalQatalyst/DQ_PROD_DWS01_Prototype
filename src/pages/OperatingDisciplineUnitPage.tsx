import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { CheckSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
const mockChecks = [{
  label: 'All tasks have assigned owners',
  status: 'pass'
}, {
  label: 'Expected outputs are defined',
  status: 'pass'
}, {
  label: 'Updates provided within SLA',
  status: 'fail'
}, {
  label: 'Blockers escalated appropriately',
  status: 'pass'
}, {
  label: 'Evidence attached before closure',
  status: 'fail'
}];
export function OperatingDisciplineUnitPage() {
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
  return <RolePageScaffold eyebrow="Governance" title="Operating Discipline Review" purpose="Checklist to ensure teams are following the DWS.01 operating model." primaryAction={{
    label: 'Trigger Intervention',
    onClick: () => toast.success('Intervention triggered.')
  }}>
      <div className="max-w-3xl bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#EEEFF6] bg-[#F6F6FB]">
          <h3 className="text-lg font-bold text-[#111118]">
            Unit Discipline Checklist
          </h3>
          <p className="text-sm text-[#5F607F] mt-1">
            Automated checks against active work records.
          </p>
        </div>
        <div className="divide-y divide-[#EEEFF6]">
          {mockChecks.map((check, i) => <div key={i} className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-[#111118]">
                {check.label}
              </span>
              {check.status === 'pass' ? <div className="flex items-center gap-1.5 text-[#16A34A]">
                  <CheckSquare size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Pass
                  </span>
                </div> : <div className="flex items-center gap-1.5 text-[#DC2626]">
                  <AlertCircle size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Fail
                  </span>
                </div>}
            </div>)}
        </div>
      </div>
    </RolePageScaffold>;
}