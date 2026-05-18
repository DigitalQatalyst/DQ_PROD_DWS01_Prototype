import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { GitBranch, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
const RULES = [{
  id: 'RUL-001',
  name: 'Task Closure Approval',
  trigger: 'Task status changes to Review Needed',
  action: 'Create approval for Reviewer',
  status: 'Active'
}, {
  id: 'RUL-002',
  name: 'HRA Request Routing',
  trigger: 'New HRA Request submitted',
  action: 'Route to HRA Fulfilment Queue',
  status: 'Active'
}, {
  id: 'RUL-003',
  name: 'Blocker Escalation',
  trigger: 'Blocker age > 3 days',
  action: 'Notify Unit Lead',
  status: 'Active'
}];
export function WorkflowRulesPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Administration" title="Workflow & Approval Rules" purpose="Configure automated routing, approval paths, and escalation triggers." primaryAction={{
    label: 'Create Rule',
    onClick: () => toast.success('Create rule dialog opened')
  }} loading={loading}>
      <div className="space-y-4">
        {RULES.map((rule) => <div key={rule.id} className="bg-white rounded-card border border-border-default shadow-sm p-5 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <GitBranch size={16} className="text-primary" />
                <span className="font-bold text-primary">{rule.name}</span>
                <span className="text-xs font-mono text-text-muted">
                  {rule.id}
                </span>
                <span className="px-2 py-0.5 bg-success-surface text-success-text text-[10px] font-bold uppercase tracking-wider rounded-pill">
                  {rule.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary ml-7">
                <span className="bg-surface px-2 py-1 rounded border border-border-subtle">
                  IF: {rule.trigger}
                </span>
                <ArrowRight size={14} className="text-text-muted" />
                <span className="bg-surface px-2 py-1 rounded border border-border-subtle">
                  THEN: {rule.action}
                </span>
              </div>
            </div>
            <button onClick={() => toast.success(`Edit rule ${rule.id}`)} className="px-4 py-2 bg-white border border-border-strong text-text-primary text-sm font-medium rounded hover:bg-surface transition-colors">
              Edit Rule
            </button>
          </div>)}
      </div>
    </RolePageScaffold>;
}