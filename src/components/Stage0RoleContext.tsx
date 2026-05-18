import React from 'react';
import type { Persona } from '../types/platform';
import { User, Briefcase, Layers } from 'lucide-react';
interface Stage0RoleContextProps {
  activePersona: Persona;
}
export function Stage0RoleContext({
  activePersona
}: Stage0RoleContextProps) {
  return <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
      <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
        Active Context
      </h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface flex items-center justify-center text-primary">
            <User size={16} />
          </div>
          <div>
            <div className="text-xs text-text-muted">User</div>
            <div className="text-sm font-semibold text-primary">
              {activePersona.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface flex items-center justify-center text-primary">
            <Briefcase size={16} />
          </div>
          <div>
            <div className="text-xs text-text-muted">Role</div>
            <div className="text-sm font-semibold text-primary">
              {activePersona.role}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface flex items-center justify-center text-primary">
            <Layers size={16} />
          </div>
          <div>
            <div className="text-xs text-text-muted">Unit & Tier</div>
            <div className="text-sm font-semibold text-primary">
              {activePersona.unit} • {activePersona.tier}
            </div>
          </div>
        </div>
      </div>
    </div>;
}