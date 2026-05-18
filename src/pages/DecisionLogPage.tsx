import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { EntityDrawer } from '../components/EntityDrawer';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { Scale } from 'lucide-react';
const mockDecisions = [{
  id: 'DEC-1',
  title: 'Task Closure Approved',
  linkedEntity: 'TSK-1003',
  ownerUserId: 'USR-003',
  time: '1 day ago',
  rationale: 'All evidence provided and verified.'
}, {
  id: 'DEC-2',
  title: 'HRA Request Returned',
  linkedEntity: 'REQ-2002',
  ownerUserId: 'USR-005',
  time: '2 days ago',
  rationale: 'Missing policy acknowledgement.'
}];
export function DecisionLogPage() {
  const [loading, setLoading] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<any>(null);
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
  return <RolePageScaffold eyebrow="Workflow" title="Decision Log" purpose="Immutable record of formal decisions, approvals, and returns.">
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[28px] before:-translate-x-px before:h-full before:w-0.5 before:bg-[#EEEFF6]">
        {mockDecisions.map((decision) => <div key={decision.id} className="relative flex items-start gap-6 cursor-pointer group" onClick={() => setSelectedDecision(decision)}>
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-[#F6F6FB] bg-white shrink-0 z-10 text-[#030F35] group-hover:bg-[#F3F5FD] transition-colors">
              <Scale size={20} />
            </div>
            <div className="flex-1 bg-white rounded-[12px] border border-[#D8D9E6] p-5 shadow-sm mt-2 group-hover:border-[#030F35]/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#111118]">
                  {decision.title}
                </h3>
                <span className="text-xs text-[#5F607F]">{decision.time}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <OwnerBadge userId={decision.ownerUserId} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5F607F]">Linked:</span>
                  <MonoId value={decision.linkedEntity} />
                </div>
              </div>
              <div className="bg-[#F6F6FB] p-3 rounded-[8px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F607F] block mb-1">
                  Rationale
                </span>
                <p className="text-sm text-[#2E2E42]">{decision.rationale}</p>
              </div>
            </div>
          </div>)}
      </div>
      {selectedDecision && <EntityDrawer type="approval" data={selectedDecision} onClose={() => setSelectedDecision(null)} />}
    </RolePageScaffold>;
}