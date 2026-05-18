import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { EntityDrawer } from '../components/EntityDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
const mockApprovals = [{
  id: 'APR-3003',
  title: 'SLA Rule Change Approval',
  linkedEntity: 'CFG-9001',
  status: 'Pending',
  requester: 'USR-006'
}];
export function UnitApprovalsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
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
  return <RolePageScaffold eyebrow="Unit Visibility" title="Unit Approvals" purpose="High-level approvals requiring Unit Lead authorization.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockApprovals.map((approval) => <div key={approval.id} className="bg-white rounded-[12px] border border-[#D8D9E6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#030F35]" />
                <MonoId value={approval.id} />
              </div>
              <StatusPill status={approval.status} />
            </div>
            <h3 className="text-lg font-bold text-[#111118] mb-2">
              {approval.title}
            </h3>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-[#5F607F]">Linked to:</span>
              <MonoId value={approval.linkedEntity} />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#111118] uppercase tracking-wider mb-2">
                Decision Rationale
              </label>
              <textarea className="w-full px-3 py-2 border border-[#D8D9E6] rounded-[8px] text-sm focus:outline-none focus:border-[#030F35] h-16 resize-none" placeholder="Required for all decisions..." />
            </div>

            <div className="flex gap-2">
              <button onClick={() => toast.success('Approved.')} className="flex-1 py-2 bg-[#16A34A] text-white text-sm font-medium rounded-[8px] hover:bg-[#15803D] transition-colors">
                Approve
              </button>
              <button onClick={() => toast.success('Returned.')} className="flex-1 py-2 bg-white border border-[#D8D9E6] text-[#111118] text-sm font-medium rounded-[8px] hover:bg-[#F6F6FB] transition-colors">
                Return
              </button>
            </div>
          </div>)}
      </div>
      {selectedApproval && <EntityDrawer type="approval" data={selectedApproval} onClose={() => setSelectedApproval(null)} />}
    </RolePageScaffold>;
}