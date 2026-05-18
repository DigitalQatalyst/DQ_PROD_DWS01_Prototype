import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { ShieldCheck, FileCheck, AlertTriangle, Clock } from 'lucide-react';
export function GovernanceHealthPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Enterprise Execution" title="Governance Health" purpose="Enterprise-wide view of operating discipline and compliance." loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-card border border-border-default shadow-sm p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-success-surface flex items-center justify-center text-success shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">
              Closure Quality
            </h3>
            <div className="text-3xl font-bold text-primary mb-2">87%</div>
            <p className="text-sm text-text-muted">
              Tasks closed with complete evidence and checklist.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-card border border-border-default shadow-sm p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-success-surface flex items-center justify-center text-success shrink-0">
            <FileCheck size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">
              Evidence Completeness
            </h3>
            <div className="text-3xl font-bold text-primary mb-2">92%</div>
            <p className="text-sm text-text-muted">
              Required evidence attached before closure.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-card border border-border-default shadow-sm p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-warning-surface flex items-center justify-center text-warning shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">
              Audit Exceptions
            </h3>
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <p className="text-sm text-text-muted">
              Permission or configuration exceptions requiring review.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-card border border-border-default shadow-sm p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-info-surface flex items-center justify-center text-info shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">
              Approval Ageing
            </h3>
            <div className="text-3xl font-bold text-primary mb-2">2.4 days</div>
            <p className="text-sm text-text-muted">
              Average time pending approvals wait for decision.
            </p>
          </div>
        </div>
      </div>
    </RolePageScaffold>;
}