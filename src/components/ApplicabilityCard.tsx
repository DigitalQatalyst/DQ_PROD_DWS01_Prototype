import React from 'react';
import { ApplicabilityRecord } from '../types/knowledgeDiscovery';
import { CheckSquare, Users, Tag, AlertCircle, ShieldCheck } from 'lucide-react';

interface ApplicabilityCardProps {
  record: ApplicabilityRecord;
}

export function ApplicabilityCard({ record }: ApplicabilityCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
      <h2 className="mb-5 text-lg font-bold text-text-primary">Applicability</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
            <CheckSquare size={13} />
            Applies to Work Types
          </div>
          <div className="flex flex-wrap gap-2">
            {record.workTypes.map(type => (
              <span key={type} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/10">
                {type}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
            <Users size={13} />
            Applicable Roles
          </div>
          <div className="flex flex-wrap gap-2">
            {record.roles.map(role => (
              <span key={role} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-text-secondary ring-1 ring-border-subtle">
                {role}
              </span>
            ))}
          </div>
        </div>

        {record.contexts && record.contexts.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
              <Tag size={13} />
              Usage Context
            </div>
            <ul className="space-y-1 text-sm text-text-secondary">
              {record.contexts.map(ctx => (
                <li key={ctx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  {ctx}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
            <ShieldCheck size={13} />
            Acknowledgement Required
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            record.acknowledgementRequired
              ? 'bg-primary/10 text-primary'
              : 'bg-surface text-text-muted ring-1 ring-border-subtle'
          }`}>
            {record.acknowledgementRequired ? 'Yes — required before applying' : 'Not required'}
          </span>
        </div>
      </div>

      {record.exceptionPath && (
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm text-text-secondary">
          <AlertCircle size={15} className="mt-0.5 text-text-muted shrink-0" />
          <div>
            <span className="font-semibold text-text-primary">Exception path: </span>
            {record.exceptionPath}
          </div>
        </div>
      )}
    </div>
  );
}
