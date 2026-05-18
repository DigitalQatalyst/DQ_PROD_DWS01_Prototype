import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { OwnerBadge } from '../components/OwnerBadge';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { MonoId } from '../components/MonoId';
import { toast } from 'sonner';
const mockWorkload = [{
  owner: 'USR-001',
  tasks: [{
    id: 'TSK-1001',
    title: 'Build Stage 0 orientation shell',
    status: 'In Progress',
    slaState: 'On Track'
  }, {
    id: 'TSK-1002',
    title: 'Finalise request intake card pattern',
    status: 'Blocked',
    slaState: 'At Risk'
  }]
}, {
  owner: 'USR-002',
  tasks: [{
    id: 'TSK-1003',
    title: 'Review closure quality model',
    status: 'Review Needed',
    slaState: 'On Track'
  }]
}];
export function WorkloadBoardPage() {
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
  return <RolePageScaffold eyebrow="Team Execution" title="Workload Board" purpose="Visualize task distribution across team members.">
      <div className="space-y-6">
        {mockWorkload.map((lane, i) => <div key={i} className="bg-white rounded-[12px] border border-[#D8D9E6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#EEEFF6]">
              <OwnerBadge userId={lane.owner} />
              <span className="text-sm font-medium text-[#5F607F]">
                {lane.tasks.length} Active Tasks
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lane.tasks.map((task) => <div key={task.id} className="p-4 rounded-[8px] border border-[#EEEFF6] bg-[#F6F6FB] hover:border-[#D8D9E6] transition-colors cursor-pointer" onClick={() => toast.success('Task details opened')}>
                  <div className="flex items-center justify-between mb-2">
                    <MonoId value={task.id} />
                    <StatusPill status={task.status} />
                  </div>
                  <h4 className="text-sm font-bold text-[#111118] mb-3">
                    {task.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <SlaBadge state={task.slaState as any} />
                    <button onClick={(e) => {
                e.stopPropagation();
                toast.success('Reassign dialog opened');
              }} className="text-xs font-medium text-[#030F35] hover:underline">
                      Reassign
                    </button>
                  </div>
                </div>)}
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}