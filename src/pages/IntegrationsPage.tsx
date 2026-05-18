import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { Plug, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
const INTEGRATIONS = [{
  id: 'INT-001',
  name: 'Microsoft Teams',
  desc: 'Send notifications and approvals to Teams channels.',
  status: 'Connected',
  lastSync: '10 mins ago'
}, {
  id: 'INT-002',
  name: 'Microsoft Outlook',
  desc: 'Sync tasks with Outlook calendar and email.',
  status: 'Connected',
  lastSync: '1 hour ago'
}, {
  id: 'INT-003',
  name: 'Microsoft SharePoint',
  desc: 'Store and link evidence documents.',
  status: 'Connected',
  lastSync: '5 mins ago'
}, {
  id: 'INT-004',
  name: 'Microsoft Planner',
  desc: 'Two-way sync for execution tasks.',
  status: 'Not Connected',
  lastSync: '-'
}];
export function IntegrationsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Administration" title="Integration Settings" purpose="Manage connections to external systems and Microsoft 365." loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INTEGRATIONS.map((int) => <div key={int.id} className="bg-white rounded-card border border-border-default shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center text-primary">
                  <Plug size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-primary">{int.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    {int.status === 'Connected' ? <CheckCircle2 size={14} className="text-success" /> : <div className="w-2 h-2 rounded-full bg-border-strong" />}
                    <span className={`text-xs font-medium ${int.status === 'Connected' ? 'text-success' : 'text-text-muted'}`}>
                      {int.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-6">{int.desc}</p>
            <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
              <span className="text-xs text-text-muted">
                Last sync: {int.lastSync}
              </span>
              <button onClick={() => toast.success(int.status === 'Connected' ? `Configure ${int.name}` : `Connect ${int.name}`)} className={`px-4 py-2 text-sm font-medium rounded-button transition-colors ${int.status === 'Connected' ? 'bg-white border border-border-strong text-text-primary hover:bg-surface' : 'bg-primary text-white hover:bg-navy-800'}`}>
                {int.status === 'Connected' ? 'Configure' : 'Connect'}
              </button>
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}