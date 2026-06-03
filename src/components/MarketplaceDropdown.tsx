import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Briefcase, FileText, BookOpen, Users, BarChart2, MessageSquare } from 'lucide-react';
export function MarketplaceDropdown() {
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
  const marketplaces = [{
    title: 'Service Catalogue',
    route: '/marketplaces/services',
    icon: Briefcase,
    description: 'Discover HRA, IT/access, platform support, knowledge/content, admin, approval, and escalation requests.'
  }, {
    title: 'Task Template Catalogue',
    route: '/marketplaces/task-templates',
    icon: FileText,
    description: 'Select governed task templates with checklist, evidence, SLA, and closure criteria.'
  }, {
    title: 'Knowledge Hub',
    route: '/marketplaces/knowledge',
    icon: BookOpen,
    description: 'Find GHC, 6xD, playbooks, templates, learning references, and workspace guides.'
  }, {
    title: 'Work Directory',
    route: '/marketplaces/work-directory',
    icon: Users,
    description: 'Find teams, owners, experts, fulfilment contacts, and responsibility points.'
  }, {
    title: 'Analytics Discovery',
    route: '/marketplaces/analytics',
    icon: BarChart2,
    description: 'Discover permitted dashboards, SLA views, governance reports, and performance surfaces.'
  }, {
    title: 'Marketplace Feedback',
    route: '/marketplaces/feedback',
    icon: MessageSquare,
    description: 'Flag unclear services, missing templates, outdated knowledge, incorrect owners, or broken navigation.'
  }];
  const handleNavigate = (route: string) => {
    setIsOpen(false);
    navigate(route);
  };
  return <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 h-10 px-4 rounded-button transition-colors font-medium text-sm
          ${isOpen ? 'bg-navy-50 text-primary' : 'text-text-secondary hover:bg-surface hover:text-primary'}`}>
        Marketplaces
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && <div className="absolute left-0 top-full mt-2 w-[720px] bg-white rounded-card shadow-xl border border-border-default p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-4">
            {marketplaces.map((item, index) => {
          const Icon = item.icon;
          return <button key={index} onClick={() => handleNavigate(item.route)} className="flex items-start gap-4 p-4 rounded-card hover:bg-navy-50 transition-colors text-left group">
                  <div className="mt-0.5 text-primary group-hover:text-secondary transition-colors">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>;
        })}
          </div>
        </div>}
    </div>;
}