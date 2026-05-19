/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getRoleFamily, getSegmentForRole, segments, type RoleFamily, type SegmentDefinition, type WorkspaceRole } from '../config/segments';

interface WorkspaceRoleContextType {
  activeRole: WorkspaceRole;
  setActiveRole: (role: WorkspaceRole) => void;
  roles: WorkspaceRole[];
  activeSegment: SegmentDefinition;
  segments: SegmentDefinition[];
  roleFamily: RoleFamily;
}

const roles = segments.map((segment) => segment.label);

const WorkspaceRoleContext = createContext<WorkspaceRoleContextType | undefined>(undefined);

export function WorkspaceRoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<WorkspaceRole>(() => {
    const storedRole = localStorage.getItem('dws-active-role') as WorkspaceRole | null;
    return storedRole && roles.includes(storedRole) ? storedRole : 'Associate';
  });
  const activeSegment = getSegmentForRole(activeRole);
  const roleFamily = getRoleFamily(activeRole);

  useEffect(() => {
    localStorage.setItem('dws-active-role', activeRole);
  }, [activeRole]);

  return (
    <WorkspaceRoleContext.Provider value={{ activeRole, setActiveRole, roles, activeSegment, segments, roleFamily }}>
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
