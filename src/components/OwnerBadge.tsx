import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/platform.service';
import type { User } from '../types/platform';
interface OwnerBadgeProps {
  userId?: string;
}
export function OwnerBadge({
  userId
}: OwnerBadgeProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (userId) {
      getUsers().then((users) => {
        const found = users.find((u) => u.id === userId);
        if (found) setUser(found);
      });
    }
  }, [userId]);
  if (!userId || !user) {
    return <div className="flex items-center gap-2 text-text-disabled">
        <div className="w-6 h-6 rounded-full bg-surface border border-border-default flex items-center justify-center">
          <span className="text-[10px] font-medium">?</span>
        </div>
        <span className="text-xs font-medium">Unassigned</span>
      </div>;
  }
  const initials = user.name.split(' ').map((n) => n[0]).join('').substring(0, 2);
  return <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-navy-100 text-primary flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold">{initials}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-text-primary leading-tight">
          {user.name}
        </span>
        <span className="text-[10px] text-text-muted leading-tight">
          {user.role}
        </span>
      </div>
    </div>;
}