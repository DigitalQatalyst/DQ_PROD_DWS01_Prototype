import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import {
  orientationFeatureArea,
  marketplaceFeatureArea,
  utilityNav,
  featureAreas,
  filterNavByRole,
  hasRouteAccess as checkRouteAccess,
} from '../config/roleBasedNavigation';
import type { NavItem } from '../types/navigation';
import { filterNavigationByFlags } from '../utils/filterNavigationByFlags';

function routePath(route: string) {
  return route.split('?')[0];
}

function matchesNavRoute(pathname: string, route: string) {
  const base = routePath(route);
  return pathname === base || pathname.startsWith(`${base}/`);
}

function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.route && matchesNavRoute(pathname, item.route)) return true;
  return item.children?.some((child) => isNavItemActive(pathname, child)) ?? false;
}

function isGroupActive(pathname: string, group: NavItem) {
  return isNavItemActive(pathname, group);
}

function findActiveGroup(area: NavItem, pathname: string): NavItem | undefined {
  return area.children?.find((group) => isNavItemActive(pathname, group));
}

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `relative flex min-h-9 items-center gap-3 rounded-r-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-navy-50 text-primary' : 'text-text-secondary hover:bg-surface hover:text-primary'
  }`;

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  if (!Icon || !item.route) return null;
  
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
  const { activeDwsRole, getDefaultRoute, activeRole } = useWorkspaceRole();

  const filteredOrientationArea = useMemo(() => {
    const [area] = filterNavigationByFlags(
      filterNavByRole([orientationFeatureArea], activeDwsRole)
    );
    return area;
  }, [activeDwsRole]);

  const filteredMarketplaceArea = useMemo(() => {
    const [area] = filterNavigationByFlags(
      filterNavByRole([marketplaceFeatureArea], activeDwsRole)
    );
    return area;
  }, [activeDwsRole]);

  const filteredFeatureAreas = useMemo(
    () => filterNavigationByFlags(filterNavByRole(featureAreas, activeDwsRole)),
    [activeDwsRole]
  );

  const filteredUtility = useMemo(
    () => filterNavigationByFlags(filterNavByRole(utilityNav, activeDwsRole)),
    [activeDwsRole]
  );

  const sidebarAreas = useMemo(
    () => [
      ...(filteredOrientationArea ? [filteredOrientationArea] : []),
      ...(filteredMarketplaceArea ? [filteredMarketplaceArea] : []),
      ...filteredFeatureAreas,
    ],
    [filteredOrientationArea, filteredMarketplaceArea, filteredFeatureAreas]
  );

  const activeFeatureArea = sidebarAreas.find(
    (area) =>
      (area.route && matchesNavRoute(location.pathname, area.route)) ||
      Boolean(findActiveGroup(area, location.pathname))
  );

  const activeFeatureGroup = activeFeatureArea
    ? findActiveGroup(activeFeatureArea, location.pathname)
    : undefined;

  const [expandedFeatureGroups, setExpandedFeatureGroups] = useState<string[]>(() => {
    const stored = localStorage.getItem('dws-feature-groups-expanded');
    return stored ? JSON.parse(stored) : [];
  });

  const activeFeatureGroupRoute = activeFeatureGroup?.route;

  useEffect(() => {
    if (!activeFeatureGroupRoute) return;
    setExpandedFeatureGroups((current) =>
      current.includes(activeFeatureGroupRoute)
        ? current
        : [...current, activeFeatureGroupRoute]
    );
  }, [activeFeatureGroupRoute]);

  useEffect(() => {
    localStorage.setItem('dws-feature-groups-expanded', JSON.stringify(expandedFeatureGroups));
  }, [expandedFeatureGroups]);

  // Check route access on role change
  useEffect(() => {
    const allNavItems = [
      ...(filteredOrientationArea ? [filteredOrientationArea] : []),
      ...(filteredMarketplaceArea ? [filteredMarketplaceArea] : []),
      ...filteredFeatureAreas,
      ...filteredUtility,
    ];
    
    const hasAccess = checkRouteAccess(location.pathname, activeDwsRole, allNavItems);
    
    if (!hasAccess) {
      // Redirect to role default route
      const defaultRoute = getDefaultRoute(activeRole);
      navigate(defaultRoute);
    }
  }, [activeDwsRole, location.pathname, filteredOrientationArea, filteredMarketplaceArea, filteredFeatureAreas, filteredUtility, navigate, getDefaultRoute, activeRole]);

  const toggleFeatureGroup = (route: string) =>
    setExpandedFeatureGroups((current) =>
      current.includes(route) ? current.filter((item) => item !== route) : [...current, route]
    );

  const renderFeatureArea = (area: NavItem) => {
    if (!area.children || area.children.length === 0) return null;

    const sectionClass =
      area.id === 'marketplace'
        ? 'space-y-1 border-t border-border-subtle pt-4'
        : 'space-y-1';

    return (
      <section key={area.id} className={sectionClass}>
        <div className="sidebar-feature-area">{area.label}</div>
        <div className="mt-1 space-y-1">
          {area.children.map((group) => {
            if (!group.icon || !group.route) return null;

            const GroupIcon = group.icon;
            const groupRoute = group.route;
            const children = group.children ?? [];
            const hasChildren = children.length > 0;
            const groupIsActive = isGroupActive(location.pathname, group);

            if (!hasChildren) {
              return (
                <NavLink
                  key={group.id}
                  to={groupRoute}
                  className={`relative sidebar-feature-group ${groupIsActive ? 'sidebar-feature-group-active' : ''}`}>
                  {groupIsActive && (
                    <span className="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-r bg-secondary" />
                  )}
                  <GroupIcon size={17} strokeWidth={1.5} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{group.label}</span>
                </NavLink>
              );
            }

            const isGroupOpen = expandedFeatureGroups.includes(groupRoute);
            const groupClickRoute = children[0]?.route ?? groupRoute;

            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() => {
                    toggleFeatureGroup(groupRoute);
                    navigate(groupClickRoute);
                  }}
                  aria-expanded={isGroupOpen}
                  className={`relative sidebar-feature-group ${groupIsActive ? 'sidebar-feature-group-active' : ''}`}>
                  {groupIsActive && (
                    <span className="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-r bg-secondary" />
                  )}
                  <GroupIcon size={17} strokeWidth={1.5} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{group.label}</span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className={`shrink-0 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isGroupOpen && (
                  <div className="sidebar-child-line">
                    {children.map((feature) => {
                      if (!feature.route) return null;
                      return (
                        <FeatureItemLink key={feature.id} label={feature.label} route={feature.route} />
                      );
                    })}
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
          {filteredOrientationArea && renderFeatureArea(filteredOrientationArea)}

          {filteredMarketplaceArea && renderFeatureArea(filteredMarketplaceArea)}

          {filteredFeatureAreas.length > 0 && (
            <section className="space-y-1 border-t border-border-subtle pt-4">
              {filteredFeatureAreas.map((area) => renderFeatureArea(area))}
            </section>
          )}
        </nav>
      </div>

      <div className="border-t border-border-subtle px-3 py-3">
        {filteredUtility
          .filter((item) => item.id !== 'logout')
          .map((item) => (
            <SidebarLink key={item.id} item={item} />
          ))}
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
