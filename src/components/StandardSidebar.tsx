import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import { featureAreas } from '../data/featureAreas';
import {
  featureAreaIcons,
  featureAreaSidebarOrder,
  marketplaceItem,
  orientationItems,
  standardSidebarGroups,
  utilityItems,
  type SidebarItem,
} from '../data/sidebarNavigation';

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `relative flex min-h-9 items-center gap-3 rounded-r-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-navy-50 text-primary' : 'text-text-secondary hover:bg-surface hover:text-primary'
  }`;

function SidebarLink({ item }: { item: SidebarItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.route}
      end={item.route === '/workspace' || item.route === '/home'}
      className={itemClass}
      title={item.helper}
      aria-label={item.helper ? `${item.label}: ${item.helper}` : item.label}>
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-r bg-secondary" />}
          <Icon size={17} strokeWidth={1.7} className="shrink-0" />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge && <span className="rounded-pill bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>}
        </>
      )}
    </NavLink>
  );
}

export function StandardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole } = useWorkspaceRole();
  const canSeeAdvanced = activeRole !== 'Associate';
  const visibleGroups = useMemo(
    () => standardSidebarGroups.filter((group) => !group.privileged || canSeeAdvanced),
    [canSeeAdvanced]
  );
  const orderedFeatureAreas = useMemo(
    () => featureAreaSidebarOrder.map((areaId) => featureAreas.find((area) => area.id === areaId)).filter(Boolean) as typeof featureAreas,
    []
  );
  const taskFeatureArea = orderedFeatureAreas.find((area) => area.id === 'tasks');
  const remainingFeatureAreas = orderedFeatureAreas.filter((area) => area.id !== 'tasks');
  const activeGroup = visibleGroups.find((group) => group.items.some((item) => location.pathname === item.route || location.pathname.startsWith(`${item.route}/`)))?.label;
  const activeFeatureArea = featureAreas.find((area) => location.pathname === area.route || location.pathname.startsWith(`${area.route}/`));
  const activeFeatureGroup = activeFeatureArea?.featureGroups.find((group) => location.pathname === group.route || location.pathname.startsWith(`${group.route}/`));
  const [expanded, setExpanded] = useState<string[]>(() => {
    const stored = localStorage.getItem('dws-standard-expanded');
    const legacyTaskGroupLabel = ['Work', 'Management'].join(' ');
    return stored ? JSON.parse(stored).filter((item: string) => item !== legacyTaskGroupLabel) : ['Tasks', 'Services'];
  });
  const [expandedFeatureGroups, setExpandedFeatureGroups] = useState<string[]>(() => {
    const stored = localStorage.getItem('dws-feature-groups-expanded');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (activeGroup) setExpanded((current) => current.includes(activeGroup) ? current : [...current, activeGroup]);
  }, [activeGroup]);

  useEffect(() => {
    if (activeFeatureArea) {
      const featureAreaLabels = featureAreas.map((area) => area.label);
      setExpanded((current) => {
        const nonFeatureAreas = current.filter((item) => !featureAreaLabels.includes(item));
        return [...nonFeatureAreas, activeFeatureArea.label];
      });
    }
    if (activeFeatureGroup) setExpandedFeatureGroups((current) => current.includes(activeFeatureGroup.route) ? current : [...current, activeFeatureGroup.route]);
  }, [activeFeatureArea, activeFeatureGroup]);

  useEffect(() => {
    localStorage.setItem('dws-standard-expanded', JSON.stringify(expanded));
  }, [expanded]);

  useEffect(() => {
    localStorage.setItem('dws-feature-groups-expanded', JSON.stringify(expandedFeatureGroups));
  }, [expandedFeatureGroups]);

  const toggle = (label: string) => setExpanded((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
  const toggleFeatureGroup = (route: string) => setExpandedFeatureGroups((current) => current.includes(route) ? current.filter((item) => item !== route) : [...current, route]);

  const renderFeatureArea = (area: typeof featureAreas[number]) => {
    const Icon = featureAreaIcons[area.id];
    const isOpen = expanded.includes(area.label);
    const isActive = activeFeatureArea?.id === area.id;
    return (
      <div key={area.id}>
        <button
          onClick={() => {
            toggle(area.label);
            navigate(area.route);
          }}
          aria-expanded={isOpen}
          className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold transition-colors ${
            isActive ? 'bg-navy-50 text-primary' : 'text-text-secondary hover:bg-surface hover:text-primary'
          }`}>
          <Icon size={17} strokeWidth={1.7} />
          <span className="min-w-0 flex-1 truncate">{area.label}</span>
          <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="ml-4 mt-0.5 space-y-1 border-l border-border-subtle pl-2">
            {area.featureGroups.map((group) => {
              const isGroupOpen = expandedFeatureGroups.includes(group.route);
              const isGroupActive = activeFeatureGroup?.route === group.route;
              return (
                <div key={group.id}>
                  <button
                    onClick={() => {
                      toggleFeatureGroup(group.route);
                      navigate(group.route);
                    }}
                    aria-expanded={isGroupOpen}
                    className={`flex min-h-9 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      isGroupActive ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-surface hover:text-primary'
                    }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    <span className="min-w-0 flex-1 truncate">{group.label}</span>
                    <ChevronDown size={14} className={`shrink-0 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isGroupOpen && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border-subtle pl-2">
                      {group.features.map((feature) => (
                        <SidebarLink key={feature.id} item={{ label: feature.label, route: feature.route, icon: Icon }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-[280px] border-r border-border-subtle bg-white lg:flex lg:flex-col" aria-label="Platform navigation">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-5">
          <section>
            <h2 className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-info-text">ORIENTATION</h2>
            <div className="space-y-0.5">{orientationItems.map((item) => <SidebarLink key={item.route} item={item} />)}</div>
          </section>

          <section className="border-t border-border-subtle pt-4">
            <h2 className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-info-text">MARKETPLACE</h2>
            <SidebarLink item={marketplaceItem} />
          </section>

          <section className="space-y-1 border-t border-border-subtle pt-4">
            {taskFeatureArea && renderFeatureArea(taskFeatureArea)}
            {visibleGroups.map((group) => {
              const Icon = group.icon;
              const isOpen = expanded.includes(group.label);
              const isActive = activeGroup === group.label;
              return (
                <div key={group.label}>
                  <button
                    onClick={() => toggle(group.label)}
                    aria-expanded={isOpen}
                    className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold transition-colors ${
                      isActive ? 'bg-navy-50 text-primary' : 'text-text-secondary hover:bg-surface hover:text-primary'
                    }`}>
                    <Icon size={17} strokeWidth={1.7} />
                    <span className="min-w-0 flex-1 truncate">{group.label}</span>
                    <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border-subtle pl-2">{group.items.map((item) => <SidebarLink key={item.route} item={item} />)}</div>}
                </div>
              );
            })}
            {remainingFeatureAreas.map((area) => renderFeatureArea(area))}
          </section>
        </nav>
      </div>

      <div className="border-t border-border-subtle px-3 py-3">
        {utilityItems.map((item) => <SidebarLink key={item.route} item={item} />)}
        <button
          onClick={() => {
            toast.info('Logout recorded for this prototype session.');
            navigate('/home');
          }}
          className="mt-0.5 flex min-h-9 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-text-muted hover:bg-surface hover:text-primary">
          <LogOut size={17} strokeWidth={1.7} />
          Logout
        </button>
      </div>
    </aside>
  );
}
