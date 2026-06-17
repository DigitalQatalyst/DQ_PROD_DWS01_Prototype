import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';

function initialsFor(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function UserIdentity() {
  const { user } = useAuth();
  const { activeRole } = useWorkspaceRole();
  const displayName = user?.name || 'Authenticated user';
  const initials = initialsFor(displayName) || 'DU';

  return (
    <div className="flex items-center gap-3 border-l border-border-subtle pl-3" aria-label={`${displayName}, ${activeRole}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
        {initials}
      </div>
      <div className="hidden min-w-0 lg:block">
        <div className="max-w-36 truncate text-xs font-bold text-primary">{displayName}</div>
        <div className="max-w-36 truncate text-[11px] text-text-muted">{activeRole}</div>
      </div>
    </div>
  );
}
