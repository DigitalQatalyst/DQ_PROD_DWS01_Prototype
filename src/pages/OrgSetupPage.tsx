import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { Building2, Users } from 'lucide-react';
import { toast } from 'sonner';
const ORG_DATA = [{
  id: 'UNT-001',
  name: 'Digital Platforms',
  lead: 'Omar Farouk',
  teams: [{
    id: 'TM-001',
    name: 'eCom.DXP Squad',
    lead: 'Priya Nair',
    members: 12
  }, {
    id: 'TM-002',
    name: 'Mobile App Squad',
    lead: 'Sarah Chen',
    members: 8
  }]
}, {
  id: 'UNT-002',
  name: 'Platform Governance',
  lead: 'Elena Costa',
  teams: [{
    id: 'TM-003',
    name: 'Security & Compliance',
    lead: 'James Wilson',
    members: 5
  }]
}];
export function OrgSetupPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Administration" title="Organisation / Unit / Team Setup" purpose="Configure the organisational hierarchy and team structures." primaryAction={{
    label: 'Add Unit',
    onClick: () => toast.success('Add unit dialog opened')
  }} loading={loading}>
      <div className="space-y-6">
        {ORG_DATA.map((unit) => <div key={unit.id} className="bg-white rounded-card border border-border-default shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-surface flex items-center justify-center text-primary">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    {unit.name}
                  </h3>
                  <span className="text-sm text-text-secondary">
                    Lead: {unit.lead} • ID: {unit.id}
                  </span>
                </div>
              </div>
              <button onClick={() => toast.success('Edit unit dialog opened')} className="text-sm font-medium text-primary hover:text-navy-800">
                Edit Unit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unit.teams.map((team) => <div key={team.id} className="p-4 rounded-lg border border-border-subtle bg-surface">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-text-muted" />
                      <span className="font-semibold text-text-primary">
                        {team.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-text-muted">
                      {team.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <span>Lead: {team.lead}</span>
                    <span>{team.members} members</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border-default flex justify-end">
                    <button onClick={() => toast.success('Edit team dialog opened')} className="text-xs font-medium text-primary hover:text-navy-800">
                      Edit Team
                    </button>
                  </div>
                </div>)}

              <button onClick={() => toast.success('Add team dialog opened')} className="p-4 rounded-lg border border-dashed border-border-strong text-text-muted hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2">
                <span className="text-sm font-medium">+ Add Team</span>
              </button>
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}