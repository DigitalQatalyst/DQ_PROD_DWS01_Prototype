import React, { createContext, useContext, useState } from 'react';

export type WorkspaceRole = 'Associate' | 'Manager / Lead' | 'Governance Lead' | 'Product / Admin';

interface WorkspaceRoleContextType {
  activeRole: WorkspaceRole;
  setActiveRole: (role: WorkspaceRole) => void;
  roles: WorkspaceRole[];
}

const roles: WorkspaceRole[] = [
  'Associate',
  'Manager / Lead',
  'Governance Lead',
  'Product / Admin'
];

const WorkspaceRoleContext = createContext<WorkspaceRoleContextType | undefined>(undefined);

export function WorkspaceRoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<WorkspaceRole>('Associate');

  return (
    <WorkspaceRoleContext.Provider value={{ activeRole, setActiveRole, roles }}>
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
