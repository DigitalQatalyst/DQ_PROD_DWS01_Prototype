import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { ShieldCheck } from 'lucide-react';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const mockChecks = [{
  id: 'POL-1',
  title: 'Data Privacy Acknowledgement',
  user: 'USR-001',
  status: 'Pending'
}, {
  id: 'POL-2',
  title: 'Code of Conduct',
  user: 'USR-002',
  status: 'Verified'
}];
export function PolicyChecksPage() {
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
  return <RolePageScaffold eyebrow="HRA Workflow" title="Policy Checks" purpose="Verify employee acknowledgement of mandatory policies.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockChecks.map((check) => <div key={check.id} className="bg-white rounded-[12px] border border-[#D8D9E6] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${check.status === 'Verified' ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FFFBEB] text-[#D97706]'}`}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111118]">
                  {check.title}
                </h3>
                <span className={`text-xs font-bold uppercase tracking-wider ${check.status === 'Verified' ? 'text-[#16A34A]' : 'text-[#D97706]'}`}>
                  {check.status}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <OwnerBadge userId={check.user} />
            </div>
            {check.status === 'Pending' && <button onClick={() => toast.success('Policy verified.')} className="w-full py-2 bg-[#FB5535] text-white text-sm font-medium rounded-[8px] hover:bg-[#E04A2E] transition-colors">
                Verify Policy
              </button>}
          </div>)}
      </div>
    </RolePageScaffold>;
}