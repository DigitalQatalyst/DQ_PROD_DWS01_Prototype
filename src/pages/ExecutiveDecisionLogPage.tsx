import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { Scale } from 'lucide-react';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
const DECISIONS = [{
  id: 'DEC-5001',
  date: '2026-05-12',
  decision: 'Approved budget override for platform tooling.',
  owner: 'USR-008',
  linked: 'ESC-101'
}, {
  id: 'DEC-5002',
  date: '2026-05-10',
  decision: 'Rejected SLA exception for legacy migration.',
  owner: 'USR-008',
  linked: 'ESC-102'
}, {
  id: 'DEC-5003',
  date: '2026-05-05',
  decision: 'Confirmed Q3 strategic outcomes.',
  owner: 'USR-008',
  linked: 'OUT-6001'
}];
export function ExecutiveDecisionLogPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Enterprise Execution" title="Executive Decision Log" purpose="Immutable record of all executive decisions and their rationale." loading={loading}>
      <div className="bg-white rounded-card border border-border-default shadow-sm p-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border-subtle">
          {DECISIONS.map((dec, i) => <div key={dec.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-surface text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Scale size={18} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-lg border border-border-subtle bg-surface">
                <div className="flex items-center justify-between mb-3">
                  <MonoId value={dec.id} />
                  <span className="text-xs font-mono text-text-muted">
                    {dec.date}
                  </span>
                </div>
                <p className="text-sm font-medium text-primary mb-4">
                  {dec.decision}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border-default">
                  <OwnerBadge userId={dec.owner} />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Linked:</span>
                    <MonoId value={dec.linked} />
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </RolePageScaffold>;
}