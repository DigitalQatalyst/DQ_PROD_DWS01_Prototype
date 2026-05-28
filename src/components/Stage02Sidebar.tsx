import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  BookOpen,
  CheckSquare,
  ChevronsLeft,
  ChevronsRight,
  Cloud,
  Database,
  Gauge,
  GitBranch,
  Home,
  PieChart,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon
} from 'lucide-react';
import { navSections, navigationItems, type NavIcon } from '../config/navigation';
import { hasAnyPermission } from '../config/permissions';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import { badgeCounts } from '../mocks/dwsEntities.mock';

const iconMap: Record<NavIcon, LucideIcon> = {
  home: Home,
  briefcase: Briefcase,
  checkSquare: CheckSquare,
  gitBranch: GitBranch,
  database: Database,
  gauge: Gauge,
  shield: ShieldCheck,
  book: BookOpen,
  cloud: Cloud,
  users: Users,
  pie: PieChart,
  settings: Settings,
  fileText: BookOpen,
  bookOpen: BookOpen,
  barChart2: PieChart,
  messageSquare: BookOpen,
};

interface Stage02SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Stage02Sidebar({ collapsed, onCollapsedChange }: Stage02SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, activeSegment } = useWorkspaceRole();
  const visibleItems = useMemo(
    () => navigationItems.filter((item) => item.allowedSegments.includes(activeRole) && hasAnyPermission(activeRole, item.requiredPermissions)),
    [activeRole]
  );
  const activeItem = visibleItems.find((item) => location.pathname === item.route || (item.route !== '/' && location.pathname.startsWith(`${item.route}/`)));
  const activeSectionId = activeItem?.section || (location.pathname === '/workspace' || location.pathname.startsWith('/workspace/') ? 'workspace' : undefined);
  const [expandedSection, setExpandedSection] = useState(() => localStorage.getItem('dws-expanded-section') || activeItem?.section || 'workspace');

  useEffect(() => {
    if (activeSectionId) setExpandedSection(activeSectionId);
  }, [activeSectionId]);

  useEffect(() => {
    localStorage.setItem('dws-expanded-section', expandedSection);
  }, [expandedSection]);

  return (
    <aside className={`fixed left-0 top-16 z-40 hidden h-[calc(100vh-64px)] overflow-y-auto border-r border-border-subtle bg-white pb-4 transition-all duration-200 lg:block ${collapsed ? 'w-[88px]' : 'w-[280px]'}`}>
      <div className="flex min-h-full flex-col px-4 py-5">
        <div className={`mb-5 rounded-2xl border border-border-subtle bg-surface p-4 ${collapsed ? 'text-center' : ''}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{collapsed ? 'DWS' : 'Active role'}</div>
          <div className="mt-1 truncate text-sm font-bold text-primary" title={activeRole}>{collapsed ? activeSegment.initials : activeRole}</div>
          {!collapsed && <div className="mt-1 truncate text-xs text-text-muted">{activeSegment.subtitle}</div>}
        </div>

        <nav aria-label="DWS workspace navigation" className="flex-1 space-y-1">
          {/* ── Marketplace section (above Workspace) ── */}
          {(() => {
            const marketplaceSection = navSections.find((s) => s.id === 'marketplace')!;
            if (!marketplaceSection) return null;
            const MarketIcon = iconMap[marketplaceSection.icon];
            const isActiveSection = location.pathname.startsWith('/marketplaces');
            const isOpen = !collapsed && expandedSection === 'marketplace';
            const marketplaceItems = navigationItems.filter((item) => item.section === 'marketplace');
            return (
              <div className="border-b border-border-subtle py-1">
                <button
                  onClick={() => {
                    setExpandedSection((cur) => cur === 'marketplace' ? '' : 'marketplace');
                    navigate('/marketplaces/services');
                  }}
                  title={collapsed ? marketplaceSection.label : undefined}
                  className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold transition-colors ${
                    isActiveSection ? 'bg-navy-50 text-primary' : 'text-text-secondary hover:bg-surface hover:text-primary'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <MarketIcon size={18} strokeWidth={1.8} />
                  {!collapsed && <span className="flex-1 truncate text-left">{marketplaceSection.label}</span>}
                  {!collapsed && <span className="text-text-muted">{isOpen ? '−' : '+'}</span>}
                </button>
                {isOpen && (
                  <div className="mt-1 space-y-1 pl-4">
                    {marketplaceItems.map((item) => (
                      <NavLink
                        key={item.id}
                        to={item.route}
                        title={item.description}
                        className={({ isActive }) =>
                          `flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                            isActive ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-surface hover:text-primary'
                          }`
                        }
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Workspace sections ── */}
          {navSections.filter((s) => s.id !== 'marketplace').map((section) => {
            const sectionItems = visibleItems.filter((item) => item.section === section.id);
            if (sectionItems.length === 0) return null;
            const Icon = iconMap[section.icon];
            const isActiveSection = activeSectionId === section.id;
            const isOpen = !collapsed && expandedSection === section.id;
            const sectionBadge = sectionItems.reduce((sum, item) => sum + (item.badgeCountKey ? badgeCounts[item.badgeCountKey] || 0 : 0), 0);
            return (
              <div key={section.id} className="border-b border-border-subtle py-1 last:border-b-0">
                <button
                  onClick={() => {
                    if (section.id === 'workspace') {
                      setExpandedSection('workspace');
                      navigate('/workspace');
                    } else {
                      setExpandedSection((current) => current === section.id ? '' : section.id);
                    }
                  }}
                  title={collapsed ? section.label : undefined}
                  className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold transition-colors ${isActiveSection ? 'bg-navy-50 text-primary' : 'text-text-secondary hover:bg-surface hover:text-primary'} ${collapsed ? 'justify-center' : ''}`}>
                  <Icon size={18} strokeWidth={1.8} />
                  {!collapsed && <span className="flex-1 truncate text-left">{section.label}</span>}
                  {!collapsed && sectionBadge > 0 && <span className="rounded-pill bg-primary px-2 py-0.5 text-[10px] font-bold text-white">{sectionBadge > 99 ? '99+' : sectionBadge}</span>}
                  {!collapsed && <span className="text-text-muted">{isOpen ? '−' : '+'}</span>}
                </button>
                {isOpen && (
                  <div className="mt-1 space-y-1 pl-4">
                    {sectionItems.map((item) => (
                      <NavLink
                        key={item.id}
                        to={item.route}
                        title={item.description}
                        className={({ isActive }) =>
                          `flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                            isActive ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-surface hover:text-primary'
                          }`
                        }>
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.badgeCountKey && badgeCounts[item.badgeCountKey] ? <span className="rounded-pill bg-navy-100 px-2 py-0.5 text-[10px] font-bold text-primary">{badgeCounts[item.badgeCountKey]}</span> : null}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className={`mt-5 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold text-text-secondary hover:bg-surface hover:text-primary ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse Sidebar'}>
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
