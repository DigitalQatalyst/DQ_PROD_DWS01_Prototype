import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';
import { personas } from '../mocks/platform.mock';
import { toast } from 'sonner';
export function PersonaSwitcher() {
  const {
    activePersona,
    setActivePersona,
    getDefaultRoute,
    hasRouteAccess
  } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSwitch = (personaId: any) => {
    const newPersona = personas.find((p) => p.id === personaId);
    if (!newPersona || newPersona.id === activePersona.id) {
      setIsOpen(false);
      return;
    }
    setActivePersona(personaId);
    setIsOpen(false);
    const currentPath = location.pathname;
    const stillPermitted = hasRouteAccess(currentPath, newPersona);
    if (!stillPermitted) {
      toast.warning('This area is not available for the active persona.');
      navigate(getDefaultRoute(newPersona));
    } else {
      toast.success(`Persona switched to ${newPersona.role}`);
    }
  };
  // Group personas by tier
  const groupedPersonas = personas.reduce((acc, persona) => {
    if (!acc[persona.tier]) {
      acc[persona.tier] = [];
    }
    acc[persona.tier].push(persona);
    return acc;
  }, {} as Record<string, typeof personas>);
  return <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 h-10 px-4 rounded-pill bg-surface hover:bg-navy-50 transition-colors border border-border-subtle">
        <span className="text-sm font-medium text-text-secondary">
          Viewing as:{' '}
          <span className="text-primary font-semibold">
            {activePersona.name} -- {activePersona.role}
          </span>
        </span>
        <ChevronDown size={16} className="text-text-muted" />
      </button>

      {isOpen && <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-card shadow-lg border border-border-default overflow-hidden z-50">
          <div className="max-h-[400px] overflow-y-auto py-2">
            {Object.entries(groupedPersonas).map(([tier, tierPersonas]) => <div key={tier} className="mb-2 last:mb-0">
                <div className="px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {tier}
                </div>
                {tierPersonas.map((persona) => <button key={persona.id} onClick={() => handleSwitch(persona.id)} className="w-full text-left px-4 py-2 hover:bg-navy-50 flex items-center justify-between group">
                    <div>
                      <div className={`text-sm font-medium ${activePersona.id === persona.id ? 'text-primary' : 'text-text-primary group-hover:text-primary'}`}>
                        {persona.name}
                      </div>
                      <div className="text-xs text-text-muted">
                        {persona.role} • {persona.unit}
                      </div>
                    </div>
                    {activePersona.id === persona.id && <Check size={16} className="text-success" />}
                  </button>)}
              </div>)}
          </div>
        </div>}
    </div>;
}