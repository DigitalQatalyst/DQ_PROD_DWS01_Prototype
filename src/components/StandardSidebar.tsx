import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { featureAreas } from '../data/featureAreas';
import {
  featureAreaSidebarOrder,
  fallbackFeatureGroupIcon,
  featureGroupIcons,
  marketplaceItem,
  orientationItems,
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
          <Icon size={17} strokeWidth={1.5} className="shrink-0" />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge && <span className="rounded-pill bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>}
        </>
      )}
    </NavLink>
  );
}

function FeatureItemLink({ label, route }: { label: string; route: string }) {
  return (
    <NavLink
      to={route}
      className={({ isActive }) =>
        `sidebar-feature-item ${isActive ? 'sidebar-feature-item-active' : ''}`
      }>
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute bottom-1.5 left-[-13px] top-1.5 w-0.5 rounded-r bg-secondary" />}
          <span className="min-w-0 flex-1 truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function StandardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderedFeatureAreas = useMemo(
    () => featureAreaSidebarOrder.map((areaId) => featureAreas.find((area) => area.id === areaId)).filter(Boolean) as typeof featureAreas,
    []
  );
  const activeFeatureArea = featureAreas.find((area) => location.pathname === area.route || location.pathname.startsWith(`${area.route}/`));
  const activeFeatureGroup = activeFeatureArea?.featureGroups.find((group) => location.pathname === group.route || location.pathname.startsWith(`${group.route}/`));
  const [expandedFeatureGroups, setExpandedFeatureGroups] = useState<string[]>(() => {
    const stored = localStorage.getItem('dws-feature-groups-expanded');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (activeFeatureGroup) setExpandedFeatureGroups((current) => current.includes(activeFeatureGroup.route) ? current : [...current, activeFeatureGroup.route]);
  }, [activeFeatureGroup]);

  useEffect(() => {
    localStorage.setItem('dws-feature-groups-expanded', JSON.stringify(expandedFeatureGroups));
  }, [expandedFeatureGroups]);

  const toggleFeatureGroup = (route: string) => setExpandedFeatureGroups((current) => current.includes(route) ? current.filter((item) => item !== route) : [...current, route]);

  const renderFeatureArea = (area: typeof featureAreas[number]) => {
    return (
      <section key={area.id} className="space-y-1">
        <div className="sidebar-feature-area">{area.label}</div>
        <div className="mt-1 space-y-1">
          {area.featureGroups.map((group) => {
            const GroupIcon = featureGroupIcons[area.id]?.[group.id] || fallbackFeatureGroupIcon;
            const isGroupOpen = expandedFeatureGroups.includes(group.route);
            const isGroupActive = activeFeatureGroup?.route === group.route;
            const groupClickRoute = area.id === 'tasks' ? group.features[0]?.route || group.route : group.route;
            return (
              <div key={group.id}>
                <button
                  onClick={() => {
                    toggleFeatureGroup(group.route);
                    navigate(groupClickRoute);
                  }}
                  aria-expanded={isGroupOpen}
                  className={`sidebar-feature-group ${isGroupActive ? 'sidebar-feature-group-active' : ''}`}>
                  <GroupIcon size={17} strokeWidth={1.5} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{group.label}</span>
                  <ChevronDown size={14} strokeWidth={1.5} className={`shrink-0 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGroupOpen && (
                  <div className="sidebar-child-line">
                    {group.features.map((feature) => (
                      <FeatureItemLink key={feature.id} label={feature.label} route={feature.route} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-[280px] border-r border-border-subtle bg-white lg:flex lg:flex-col" aria-label="Platform navigation">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-5">
          <section>
            <h2 className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">ORIENTATION</h2>
            <div className="space-y-0.5">{orientationItems.map((item) => <SidebarLink key={item.route} item={item} />)}</div>
          </section>

          <section className="border-t border-border-subtle pt-4">
            <h2 className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">MARKETPLACE</h2>
            <SidebarLink item={marketplaceItem} />
          </section>

          <section className="space-y-1 border-t border-border-subtle pt-4">
            {orderedFeatureAreas.map((area) => renderFeatureArea(area))}
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
          <LogOut size={17} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </aside>
  );
}
