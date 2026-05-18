import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const QUEUES = [{
  owner: 'USR-007',
  name: 'Brian Otieno',
  role: 'Support',
  active: 12,
  atRisk: 3,
  breached: 0
}, {
  owner: 'USR-005',
  name: 'Grace Wanjiru',
  role: 'HRA',
  active: 8,
  atRisk: 1,
  breached: 0
}, {
  owner: 'USR-006',
  name: 'Elena Costa',
  role: 'Admin',
  active: 5,
  atRisk: 2,
  breached: 1
}];
export function FulfilmentOwnerQueuesPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Support Operations" title="Fulfilment Owner Queues" purpose="Monitor workload and SLA performance across all request fulfilment owners." loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUEUES.map((queue) => <div key={queue.owner} className="bg-white rounded-card border border-border-default shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
              <OwnerBadge userId={queue.owner} />
              <button onClick={() => toast.success(`View queue for ${queue.name}`)} className="text-sm font-medium text-primary hover:text-navy-800">
                View Queue
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-surface rounded-lg">
                <span className="block text-2xl font-bold text-primary">
                  {queue.active}
                </span>
                <span className="text-xs text-text-secondary">Active</span>
              </div>
              <div className="p-3 bg-warning-surface rounded-lg">
                <span className="block text-2xl font-bold text-warning-text">
                  {queue.atRisk}
                </span>
                <span className="text-xs text-warning-text">At Risk</span>
              </div>
              <div className="p-3 bg-danger-surface rounded-lg">
                <span className="block text-2xl font-bold text-danger">
                  {queue.breached}
                </span>
                <span className="text-xs text-danger">Breached</span>
              </div>
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}