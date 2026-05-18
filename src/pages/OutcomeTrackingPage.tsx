import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { Target, Link as LinkIcon } from 'lucide-react';
import { MonoId } from '../components/MonoId';
import { toast } from 'sonner';
export function OutcomeTrackingPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Enterprise Execution" title="Outcome Tracking" purpose="Trace high-level outcomes down to the execution tasks driving them." loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm p-6">
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Target size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-primary">
                  Enterprise Execution Health
                </h2>
                <MonoId value="OUT-6001" />
                <span className="px-2 py-0.5 bg-success-surface text-success-text text-[10px] font-bold uppercase tracking-wider rounded-pill">
                  On Track
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                Ensure all units adopt DWS.01 governance standards.
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">65%</div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-bold">
              Progress
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">
          Linked Execution Work
        </h3>
        <div className="space-y-3">
          {[{
          id: 'TSK-1001',
          title: 'Build Stage 0 orientation shell',
          status: 'In Progress',
          owner: 'Amina Hassan'
        }, {
          id: 'TSK-1008',
          title: 'Review enterprise execution health',
          status: 'Review Needed',
          owner: 'CEO View'
        }, {
          id: 'REQ-2001',
          title: 'Task / Workflow Support',
          status: 'Pending Info',
          owner: 'Brian Otieno'
        }].map((item) => <div key={item.id} onClick={() => toast.success(`Open ${item.id}`)} className="flex items-center justify-between p-4 rounded-lg border border-border-subtle hover:border-primary/30 bg-surface cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <LinkIcon size={16} className="text-text-muted" />
                <MonoId value={item.id} />
                <span className="font-medium text-primary">{item.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-secondary">
                  {item.owner}
                </span>
                <span className="text-xs font-medium px-2 py-1 bg-white rounded border border-border-subtle">
                  {item.status}
                </span>
              </div>
            </div>)}
        </div>
      </div>
    </RolePageScaffold>;
}