import React from 'react';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';

export function UserIdentity() {
  const { activeRole, activeSegment } = useWorkspaceRole();

  return (
    <div className="flex items-center gap-3 border-l border-border-subtle pl-3" aria-label={`${activeSegment.profileName}, ${activeRole}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
        {activeSegment.initials}
      </div>
      <div className="hidden min-w-0 lg:block">
        <div className="max-w-36 truncate text-xs font-bold text-primary">{activeSegment.profileName}</div>
        <div className="max-w-36 truncate text-[11px] text-text-muted">{activeRole}</div>
      </div>
    </div>
  );
}
