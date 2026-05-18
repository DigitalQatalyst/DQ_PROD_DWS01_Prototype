import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { GitBranch } from 'lucide-react';
import { toast } from 'sonner';
const CHANGES = [{
  id: 'CFG-9001',
  title: 'Update SLA threshold for HRA',
  status: 'Proposed',
  author: 'Grace Wanjiru'
}, {
  id: 'CFG-9002',
  title: 'Add new task template',
  status: 'Under Review',
  author: 'David Mwangi'
}, {
  id: 'CFG-9003',
  title: 'Modify approval path',
  status: 'Approved',
  author: 'Elena Costa'
}];
export function ChangeGovernancePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = ['Proposed', 'Under Review', 'Approved', 'Applied'];
  return <RolePageScaffold eyebrow="Administration" title="Change Governance" purpose="Track and approve configuration changes across the platform." primaryAction={{
    label: 'Propose Change',
    onClick: () => toast.success('Propose change dialog opened')
  }} loading={loading}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => <div key={col} className="flex-1 min-w-[300px] bg-surface rounded-card border border-border-default p-4">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center justify-between">
              {col}
              <span className="bg-border-subtle text-text-muted px-2 py-0.5 rounded-pill text-xs">
                {CHANGES.filter((c) => c.status === col).length}
              </span>
            </h3>
            <div className="space-y-3">
              {CHANGES.filter((c) => c.status === col).map((change) => <div key={change.id} onClick={() => toast.success(`Open change ${change.id}`)} className="bg-white p-4 rounded-lg border border-border-subtle shadow-sm cursor-pointer hover:border-border-strong transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-text-muted">
                      {change.id}
                    </span>
                    <GitBranch size={14} className="text-text-muted" />
                  </div>
                  <p className="text-sm font-medium text-primary mb-3">
                    {change.title}
                  </p>
                  <div className="text-xs text-text-secondary">
                    Proposed by: {change.author}
                  </div>
                </div>)}
              {CHANGES.filter((c) => c.status === col).length === 0 && <div className="p-4 text-center border border-dashed border-border-strong rounded-lg">
                  <span className="text-xs text-text-muted">No changes</span>
                </div>}
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}