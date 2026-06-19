import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, LogOut, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/getInitials';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedDropdown = dropdownRef.current?.contains(target);
      const clickedButton = buttonRef.current?.contains(target);
      if (!clickedDropdown && !clickedButton) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real identity from the authenticated BFF session (GET /api/session/me).
  const displayName = user?.name?.trim() || user?.email || 'Workspace user';
  const initials = getInitials(user?.name, user?.email);
  const segment = user?.workspaceSegment || 'Associate';
  const dwsRoles = user?.roles ?? [];

  const handleSignOut = () => {
    setIsOpen(false);
    toast.info('Signing you out…');
    // BFF logout is a full-page redirect that clears the session cookie and
    // ends the Entra session, returning the browser to /login.
    signOut();
  };

  const dropdownPanel = (
    <div
      ref={dropdownRef}
      className="fixed right-6 top-[76px] w-[340px] bg-white rounded-2xl shadow-xl border border-border-default overflow-hidden z-[120]"
    >
      <div className="px-5 py-5 border-b border-border-subtle bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-primary leading-tight">{displayName}</p>
            {user?.email && (
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs font-medium text-text-secondary">
                <Mail size={12} className="shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            )}
            <p className="mt-1 text-[11px] text-text-muted">{segment}</p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
          <div className="col-span-2">
            <dt className="font-semibold uppercase tracking-wider text-text-muted">Roles</dt>
            <dd className="mt-0.5 text-text-secondary">
              {dwsRoles.length > 0 ? dwsRoles.join(', ') : '—'}
            </dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wider text-text-muted">Unit</dt>
            <dd className="mt-0.5 text-text-secondary">{user?.unit || '—'}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wider text-text-muted">Team</dt>
            <dd className="mt-0.5 text-text-secondary">{user?.team || '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="px-3 py-3">
        <button
          className="w-full text-left px-3 py-2.5 text-sm text-text-muted hover:bg-surface hover:text-text-secondary rounded-xl flex items-center gap-3"
          onClick={handleSignOut}
        >
          <LogOut size={16} />
          Sign out / Exit workspace
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="flex items-center gap-3 rounded-full border-l border-border-subtle py-1 pl-3 pr-1 transition-colors hover:bg-surface lg:pr-2"
      >
        <div className="hidden min-w-0 text-right lg:block">
          <div className="max-w-36 truncate text-xs font-bold text-primary">{displayName}</div>
          <div className="max-w-36 truncate text-[11px] text-text-muted">{segment}</div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {initials}
        </div>
        <ChevronDown size={16} className="hidden shrink-0 text-text-muted lg:block" />
      </button>

      {isOpen && createPortal(dropdownPanel, document.body)}
    </div>
  );
}
