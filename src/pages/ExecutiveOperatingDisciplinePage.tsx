import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { CheckCircle2 } from 'lucide-react';
const DISCIPLINE = [{
  label: 'Ownership Clarity',
  score: '98%',
  status: 'success'
}, {
  label: 'Output Definition',
  score: '95%',
  status: 'success'
}, {
  label: 'Update Discipline',
  score: '92%',
  status: 'success'
}, {
  label: 'Blocker Resolution',
  score: '88%',
  status: 'warning'
}, {
  label: 'SLA Performance',
  score: '94%',
  status: 'success'
}, {
  label: 'Evidence Quality',
  score: '85%',
  status: 'warning'
}, {
  label: 'Closure Quality',
  score: '87%',
  status: 'warning'
}];
export function ExecutiveOperatingDisciplinePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Enterprise Execution" title="Operating Discipline Review" purpose="Enterprise-level view of adherence to DWS.01 governance standards." loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm p-6">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6">
          Enterprise Checklist
        </h3>
        <div className="space-y-4">
          {DISCIPLINE.map((item) => <div key={item.label} className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-surface">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className={item.status === 'success' ? 'text-success' : 'text-warning'} />
                <span className="font-medium text-primary">{item.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-lg font-bold ${item.status === 'success' ? 'text-success' : 'text-warning-text'}`}>
                  {item.score}
                </span>
              </div>
            </div>)}
        </div>
      </div>
    </RolePageScaffold>;
}