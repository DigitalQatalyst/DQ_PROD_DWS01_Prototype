import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
const GUARDRAILS = [{
  id: 'AI-001',
  name: 'Permission Filtering',
  desc: 'AI only accesses data the active user has permission to view.',
  status: 'Active Enforced'
}, {
  id: 'AI-002',
  name: 'Human Confirmation Required',
  desc: 'AI actions (like creating tasks or approvals) require explicit user confirmation.',
  status: 'Active Enforced'
}, {
  id: 'AI-003',
  name: 'Audit Trail',
  desc: 'All AI-generated content and actions are logged in the immutable audit trail.',
  status: 'Active Enforced'
}, {
  id: 'AI-004',
  name: 'Source Traceability',
  desc: 'AI answers must cite specific knowledge assets or records.',
  status: 'Active Enforced'
}];
export function AiAutomationPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Administration" title="AI & Automation Settings" purpose="Configure AI capabilities and enforce enterprise guardrails." loading={loading}>
      <div className="mb-8 bg-surface rounded-card border border-border-default p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-primary mb-2">
            Enterprise AI Guardrails
          </h2>
          <p className="text-sm text-text-secondary">
            DWS.01 enforces strict governance over AI features. These guardrails
            cannot be disabled, ensuring compliance and data security across the
            platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUARDRAILS.map((rail) => <div key={rail.id} className="bg-white rounded-card border border-border-default shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-success" />
                <h3 className="font-bold text-primary">{rail.name}</h3>
              </div>
              <span className="px-2 py-0.5 bg-success-surface text-success-text text-[10px] font-bold uppercase tracking-wider rounded-pill">
                {rail.status}
              </span>
            </div>
            <p className="text-sm text-text-secondary">{rail.desc}</p>
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <button onClick={() => toast.success(`View audit logs for ${rail.name}`)} className="text-sm font-medium text-primary hover:text-navy-800">
                View enforcement logs
              </button>
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}