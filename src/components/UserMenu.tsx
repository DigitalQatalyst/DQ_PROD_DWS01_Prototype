import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, BookOpen, LogOut } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';
import { toast } from 'sonner';
export function UserMenu() {
  const {
    activePersona
  } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSignOut = () => {
    setIsOpen(false);
    toast.info('Sign out is not built in Shell prototype');
  };
  // Get initials
  const initials = activePersona.name.split(' ').map((n) => n[0]).join('').substring(0, 2);
  return <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-100 text-primary font-semibold text-sm hover:bg-navy-200 transition-colors">
        {initials}
      </button>

      {isOpen && <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-card shadow-lg border border-border-default overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border-subtle bg-surface">
            <p className="text-sm font-semibold text-primary">
              {activePersona.name}
            </p>
            <p className="text-xs text-text-muted">{activePersona.role}</p>
          </div>

          <div className="py-1">
            <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-primary flex items-center gap-2" onClick={() => {
          setIsOpen(false);
          toast.info('Profile & Preferences placeholder');
        }}>
              <Settings size={16} />
              Profile & Preferences
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-primary flex items-center gap-2" onClick={() => {
          setIsOpen(false);
          navigate('/stage-0/operating-guide');
        }}>
              <BookOpen size={16} />
              Operating Guide
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-primary flex items-center gap-2" onClick={() => {
          setIsOpen(false);
          navigate('/stage-0/orientation');
        }}>
              <User size={16} />
              Return to Stage 0
            </button>
          </div>

          <div className="border-t border-border-subtle py-1">
            <button className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger-surface flex items-center gap-2" onClick={handleSignOut}>
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>}
    </div>;
}