/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getRoleFamily, getSegmentForRole, segments, type RoleFamily, type SegmentDefinition, type WorkspaceRole } from '../config/segments';
import { normalizeRole, getDefaultRouteForRole, type DwsRole } from '../types/roles';
import { useAuth } from './AuthContext';
import { usePersona } from './PersonaContext';
import type { PersonaId } from '../types/platform';

interface WorkspaceRoleContextType {
  activeRole: WorkspaceRole;
  setActiveRole: (role: WorkspaceRole) => void;
  roles: WorkspaceRole[];
  activeSegment: SegmentDefinition;
  segments: SegmentDefinition[];
  roleFamily: RoleFamily;
  // DWS role system
  activeDwsRole: DwsRole;
  getDefaultRoute: (role: WorkspaceRole) => string;
}

const fallbackRoles = segments.map((segment) => segment.label);
const personaByRole: Record<WorkspaceRole, PersonaId> = {
  Associate: 'associate',
  'Scrum Master': 'scrum-master',
  'Team / Squad Lead': 'team-lead',
  'Unit Lead': 'unit-lead',
  HRA: 'hra',
  Admin: 'admin',
  Support: 'support',
  CEO: 'ceo',
};

const WorkspaceRoleContext = createContext<WorkspaceRoleContextType | undefined>(undefined);

export function WorkspaceRoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { setActivePersona } = usePersona();
  const roles = user?.roles?.length ? user.roles : fallbackRoles;
  const [activeRole, setActiveRole] = useState<WorkspaceRole>(() => {
    const storedRole = localStorage.getItem('dws-active-role') as WorkspaceRole | null;
    return storedRole && roles.includes(storedRole) ? storedRole : 'Associate';
  });
  const activeSegment = getSegmentForRole(activeRole);
  const roleFamily = getRoleFamily(activeRole);
  const activeDwsRole = normalizeRole(activeRole);

  const getDefaultRoute = (role: WorkspaceRole): string => {
    const dwsRole = normalizeRole(role);
    return getDefaultRouteForRole(dwsRole);
  };

  useEffect(() => {
    if (!roles.includes(activeRole)) {
      setActiveRole(roles[0] || 'Associate');
      return;
    }

    localStorage.setItem('dws-active-role', activeRole);
    setActivePersona(personaByRole[activeRole]);
  }, [activeRole, roles, setActivePersona]);

  return (
    <WorkspaceRoleContext.Provider value={{ 
      activeRole, 
      setActiveRole, 
      roles, 
      activeSegment, 
      segments, 
      roleFamily,
      activeDwsRole,
      getDefaultRoute,
    }}>
      {children}
    </WorkspaceRoleContext.Provider>
  );
}

export function useWorkspaceRole() {
  const context = useContext(WorkspaceRoleContext);
  if (!context) {
    throw new Error('useWorkspaceRole must be used within a WorkspaceRoleProvider');
  }
  return context;
}
