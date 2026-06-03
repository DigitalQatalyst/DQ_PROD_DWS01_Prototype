import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronDown, ChevronRight, UsersRound } from 'lucide-react';
import { useDirectoryLifecycle } from '../context/DirectoryLifecycleContext';
import { DirectoryTypeBadge, WorkloadBadge } from '../components/WorkDirectoryComponents';

export function WorkDirectoryStructurePage() {
  const { entries } = useDirectoryLifecycle();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const units = entries.filter((entry) => entry.entityType === 'Unit');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-primary"><Building2 size={28} /> Organisation Structure</h1>
        <p className="mt-2 text-text-secondary">Lightweight Unit to Team to Person/Owner/Queue hierarchy for the Work Directory prototype.</p>
      </div>

      <div className="space-y-4">
        {units.map((unit) => {
          const isCollapsed = collapsed[unit.id];
          const children = entries.filter((entry) => entry.id !== unit.id && (entry.unit === unit.name || entry.relatedEntryIds.includes(unit.id)));
          return (
            <section key={unit.id} className="rounded-card border border-border-default bg-white shadow-sm">
              <button onClick={() => setCollapsed((prev) => ({ ...prev, [unit.id]: !prev[unit.id] }))} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <div className="flex items-center gap-3">
                  {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                  <div>
                    <h2 className="text-lg font-bold text-primary">{unit.name}</h2>
                    <p className="text-sm text-text-muted">{unit.roleLabel} · Lead: {unit.lead}</p>
                  </div>
                </div>
                <WorkloadBadge value={unit.workload} />
              </button>
              {!isCollapsed && (
                <div className="grid grid-cols-1 gap-3 border-t border-border-subtle p-5 md:grid-cols-2 lg:grid-cols-3">
                  {children.map((entry) => (
                    <Link key={entry.id} to={`/marketplaces/work-directory/${entry.id}`} className="rounded-lg border border-border-subtle p-4 hover:border-secondary">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <UsersRound size={18} className="text-primary" />
                        <DirectoryTypeBadge type={entry.entityType} />
                      </div>
                      <p className="font-bold text-primary">{entry.name}</p>
                      <p className="text-xs text-text-muted">{entry.roleLabel} · {entry.ownershipAreas.join(', ')}</p>
                    </Link>
                  ))}
                  {children.length === 0 && <p className="text-sm text-text-muted">No child entries mapped.</p>}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
