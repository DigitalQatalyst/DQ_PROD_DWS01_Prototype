import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { AlertTriangle } from 'lucide-react';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const ESCALATIONS = [{
  id: 'ESC-101',
  severity: 'Critical',
  age: '4 days',
  owner: 'Omar Farouk',
  decision: 'Approve budget override for platform tooling.',
  linked: 'BLK-101'
}, {
  id: 'ESC-102',
  severity: 'High',
  age: '2 days',
  owner: 'Elena Costa',
  decision: 'Confirm SLA exception for legacy migration.',
  linked: 'REQ-2004'
}];
export function CriticalEscalationsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Enterprise Execution" title="Critical Escalations" purpose="Review and resolve escalations requiring executive decision." loading={loading}>
      <div className="space-y-4">
        {ESCALATIONS.map((esc) => <div key={esc.id} className="bg-white rounded-card border border-danger/20 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-danger" />
                <MonoId value={esc.id} />
                <span className="px-2 py-0.5 bg-danger-surface text-danger text-[10px] font-bold uppercase tracking-wider rounded-pill">
                  {esc.severity}
                </span>
              </div>
              <span className="text-sm font-medium text-danger">
                Age: {esc.age}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <span className="text-xs text-text-muted block mb-1">
                  Escalated By
                </span>
                <OwnerBadge userId={esc.owner} />
              </div>
              <div>
                <span className="text-xs text-text-muted block mb-1">
                  Linked Item
                </span>
                <MonoId value={esc.linked} />
              </div>
            </div>

            <div className="mb-6 p-4 bg-surface rounded-lg border border-border-subtle">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
                Required Decision
              </span>
              <p className="text-sm text-primary">{esc.decision}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => toast.success(`Decision recorded for ${esc.id}`)} className="px-4 py-2 bg-danger text-white text-sm font-medium rounded-button hover:bg-danger/90 transition-colors">
                Record Decision
              </button>
              <button onClick={() => toast.success(`Returned ${esc.id} for more info`)} className="px-4 py-2 bg-white border border-border-strong text-text-primary text-sm font-medium rounded-button hover:bg-surface transition-colors">
                Request Info
              </button>
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}