import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { Bell, Clock } from 'lucide-react';
import { toast } from 'sonner';
const SLA_RULES = [{
  id: 'SLA-001',
  name: 'Standard Task Warning',
  threshold: '24 hours before due',
  action: 'Send reminder to Owner',
  status: 'Active'
}, {
  id: 'SLA-002',
  name: 'Task Breach Escalation',
  threshold: 'At due date',
  action: 'Notify Scrum Master',
  status: 'Active'
}, {
  id: 'SLA-003',
  name: 'Support Request Breach',
  threshold: 'SLA limit reached',
  action: 'Escalate to Support Lead',
  status: 'Active'
}];
export function SlaNotificationsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Administration" title="SLA & Notification Rules" purpose="Manage service level agreements and automated notifications." primaryAction={{
    label: 'Add SLA Rule',
    onClick: () => toast.success('Add SLA rule dialog opened')
  }} loading={loading}>
      <div className="space-y-4">
        {SLA_RULES.map((rule) => <div key={rule.id} className="bg-white rounded-card border border-border-default shadow-sm p-5 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={16} className="text-warning" />
                <span className="font-bold text-primary">{rule.name}</span>
                <span className="text-xs font-mono text-text-muted">
                  {rule.id}
                </span>
                <span className="px-2 py-0.5 bg-success-surface text-success-text text-[10px] font-bold uppercase tracking-wider rounded-pill">
                  {rule.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary ml-7">
                <span className="bg-warning-surface text-warning-text px-2 py-1 rounded border border-warning/20">
                  WHEN: {rule.threshold}
                </span>
                <Bell size={14} className="text-text-muted" />
                <span className="bg-surface px-2 py-1 rounded border border-border-subtle">
                  DO: {rule.action}
                </span>
              </div>
            </div>
            <button onClick={() => toast.success(`Edit SLA rule ${rule.id}`)} className="px-4 py-2 bg-white border border-border-strong text-text-primary text-sm font-medium rounded hover:bg-surface transition-colors">
              Edit Rule
            </button>
          </div>)}
      </div>
    </RolePageScaffold>;
}