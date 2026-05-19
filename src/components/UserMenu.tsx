import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Check, HelpCircle, LogOut, Settings, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import { getDefaultRouteForRole } from '../config/navigation';

export function UserMenu() {
  const { activeRole, setActiveRole, roles, activeSegment } = useWorkspaceRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
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
  const handleSignOut = () => {
    setIsOpen(false);
    toast.info('Workspace exit recorded for this prototype session.');
  };
  const handleRoleChange = (role: typeof activeRole) => {
    setActiveRole(role);
    setIsOpen(false);
    navigate(getDefaultRouteForRole(role));
    toast.success(`Viewing as ${role}.`);
  };
  const dropdownPanel = <div ref={dropdownRef} className="fixed right-6 top-[76px] w-[320px] bg-white rounded-2xl shadow-xl border border-border-default overflow-hidden z-[120]">
      <div className="px-5 py-5 border-b border-border-subtle bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
            {activeSegment.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-primary leading-tight">
              {activeSegment.profileName}
            </p>
            <p className="text-xs font-medium text-text-secondary mt-1">
              {activeRole}
            </p>
            <p className="text-[11px] text-text-muted mt-1">
              {activeSegment.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 border-b border-border-subtle">
        <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Viewing role
        </div>
        <div className="space-y-1">
          {roles.map((role) => {
          const isActive = activeRole === role;
          return <button key={role} onClick={() => handleRoleChange(role)} className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${isActive ? 'bg-navy-50 text-primary font-semibold' : 'text-text-secondary hover:bg-surface hover:text-primary'}`}>
                <span>{role}</span>
                {isActive && <Check size={16} className="text-success" />}
              </button>;
        })}
        </div>
      </div>

      <div className="px-3 py-3 border-b border-border-subtle">
        <button className="w-full text-left px-3 py-2.5 text-sm text-text-secondary hover:bg-surface hover:text-primary rounded-xl flex items-center gap-3" onClick={() => {
        setIsOpen(false);
        toast.info('Profile settings opened for Amina Hassan.');
      }}>
          <Settings size={16} />
          Profile Settings
        </button>
        <button className="w-full text-left px-3 py-2.5 text-sm text-text-secondary hover:bg-surface hover:text-primary rounded-xl flex items-center gap-3" onClick={() => {
        setIsOpen(false);
        toast.info('Workspace preferences opened.');
      }}>
          <SlidersHorizontal size={16} />
          Workspace Preferences
        </button>
        <button className="w-full text-left px-3 py-2.5 text-sm text-text-secondary hover:bg-surface hover:text-primary rounded-xl flex items-center gap-3" onClick={() => {
        setIsOpen(false);
        navigate('/stage-0/operating-guide');
      }}>
          <HelpCircle size={16} />
          Help & Support
        </button>
      </div>

      <div className="px-3 py-3">
        <button className="w-full text-left px-3 py-2.5 text-sm text-text-muted hover:bg-surface hover:text-text-secondary rounded-xl flex items-center gap-3" onClick={handleSignOut}>
          <LogOut size={16} />
          Sign out / Exit workspace
        </button>
      </div>
    </div>;
  return <div className="relative">
      <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label="Open profile menu" className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-100 text-primary font-semibold text-sm hover:bg-navy-200 transition-colors">
        {activeSegment.initials}
      </button>

      {isOpen && createPortal(dropdownPanel, document.body)}
    </div>;
}
