import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { WorkspaceRole } from '../config/segments';
import { usePersona } from '../context/PersonaContext';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';

const personaByRole: Record<WorkspaceRole, Parameters<ReturnType<typeof usePersona>['setActivePersona']>[0]> = {
  Associate: 'associate',
  'Scrum Master': 'scrum-master',
  'Team / Squad Lead': 'team-lead',
  'Unit Lead': 'unit-lead',
  HRA: 'hra',
  Admin: 'admin',
  Support: 'support',
  CEO: 'ceo',
};

export function RoleSelector() {
  const { activeRole, roles, setActiveRole } = useWorkspaceRole();
  const { setActivePersona } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const selectRole = (role: WorkspaceRole) => {
    setActiveRole(role);
    setActivePersona(personaByRole[role]);
    setIsOpen(false);
    if (location.pathname === '/platform-admin' && role !== 'Admin') navigate('/workspace');
    toast.success(`Prototype role changed to ${role}.`);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label="Select prototype validation role"
        className="flex h-10 items-center gap-2 rounded-button border border-border-default bg-white px-3 text-left hover:bg-surface">
        <span className="hidden text-[10px] font-bold uppercase tracking-wider text-text-muted xl:block">Role</span>
        <span className="max-w-36 truncate text-xs font-bold text-primary">{activeRole}</span>
        <ChevronDown size={14} className="text-text-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[130] mt-2 w-64 overflow-hidden rounded-card border border-border-default bg-white py-2 shadow-lg">
          <div className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Prototype validation role
          </div>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => selectRole(role)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                role === activeRole ? 'bg-navy-50 font-bold text-primary' : 'text-text-secondary hover:bg-surface hover:text-primary'
              }`}>
              <span>{role}</span>
              {role === activeRole && <Check size={15} className="text-success" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
