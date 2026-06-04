import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Bot,
  CheckSquare,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  FilePlus2,
  Gauge,
  GitBranch,
  HelpCircle,
  Home,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  LogOut,
  MessageSquareText,
  Network,
  Settings,
  ShieldCheck,
  Store,
  TimerReset,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';

interface SidebarItem {
  label: string;
  route: string;
  icon: LucideIcon;
  badge?: string;
  helper?: string;
}

interface WorkspaceGroup {
  label: string;
  icon: LucideIcon;
  items: SidebarItem[];
  privileged?: boolean;
}

const orientationItems: SidebarItem[] = [
  { label: 'Home', route: '/home', icon: Home, helper: 'Start here' },
  { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard, helper: 'Track performance' },
  { label: 'My Work', route: '/workspace', icon: CheckSquare, badge: '18', helper: 'Act on assigned work' },
  { label: 'AI Cockpit', route: '/ai-cockpit', icon: Bot, helper: 'Ask, automate, and analyze' },
];

const workspaceGroups: WorkspaceGroup[] = [
  {
    label: 'Work Management',
    icon: CheckSquare,
    items: [
      { label: 'Tasks', route: '/workspace/my-tasks', icon: CheckSquare, badge: '18' },
      { label: 'Working Sessions', route: '/workspace/working-sessions', icon: TimerReset },
      { label: 'Activity', route: '/workspace/activity', icon: Activity, badge: '4' },
    ],
  },
  {
    label: 'Requests & Support',
    icon: LifeBuoy,
    items: [
      { label: 'My Requests', route: '/workspace/my-requests', icon: Inbox, badge: '7' },
      { label: 'Submit Request', route: '/services/submit-request', icon: FilePlus2 },
      { label: 'Request Status', route: '/requests/status', icon: ListChecks },
      { label: 'Service Desk', route: '/support/service-desk', icon: LifeBuoy },
    ],
  },
  {
    label: 'Workflow Control',
    icon: GitBranch,
    privileged: true,
    items: [
      { label: 'My Workflows', route: '/workflows/my-workflows', icon: GitBranch },
      { label: 'Pending Approvals', route: '/workflows/pending-approvals', icon: ClipboardCheck, badge: '3' },
      { label: 'SLA Risks', route: '/workflows/sla-risks', icon: TimerReset, badge: '4' },
    ],
  },
  {
    label: 'Tracker Operations',
    icon: Network,
    privileged: true,
    items: [
      { label: 'Tracker Hub', route: '/trackers', icon: Network },
      { label: 'My Tracker Items', route: '/trackers/my-items', icon: ListChecks, badge: '12' },
      { label: 'Governance Actions', route: '/trackers/governance-actions', icon: ShieldCheck, badge: '5' },
    ],
  },
  {
    label: 'Performance & Growth',
    icon: Gauge,
    items: [{ label: 'My Performance', route: '/performance/overview', icon: Gauge }],
  },
  {
    label: 'Governance',
    icon: ShieldCheck,
    privileged: true,
    items: [
      { label: 'Governance Actions', route: '/governance/actions', icon: ShieldCheck, badge: '5' },
      { label: 'Exceptions', route: '/governance/exceptions', icon: MessageSquareText },
      { label: 'Evidence', route: '/governance/evidence', icon: FileCheck2 },
      { label: 'Control Reviews', route: '/governance/control-reviews', icon: ClipboardCheck },
    ],
  },
];

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
    () => workspaceGroups.filter((group) => !group.privileged || canSeeAdvanced),
    [canSeeAdvanced]
  );
  const activeGroup = visibleGroups.find((group) => group.items.some((item) => location.pathname === item.route || location.pathname.startsWith(`${item.route}/`)))?.label;
  const [expanded, setExpanded] = useState<string[]>(() => {
    const stored = localStorage.getItem('dws-standard-expanded');
    return stored ? JSON.parse(stored) : ['Work Management', 'Requests & Support', 'Performance & Growth'];
  });

  useEffect(() => {
    if (activeGroup) setExpanded((current) => current.includes(activeGroup) ? current : [...current, activeGroup]);
  }, [activeGroup]);

  useEffect(() => {
    localStorage.setItem('dws-standard-expanded', JSON.stringify(expanded));
  }, [expanded]);

  const toggle = (label: string) => setExpanded((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);

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
            <SidebarLink item={{ label: 'DWS Marketplace', route: '/marketplace', icon: Store }} />
          </section>

          <section className="space-y-1 border-t border-border-subtle pt-4">
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
          </section>

          <section className="space-y-0.5 border-t border-border-subtle pt-4">
            <SidebarLink item={{ label: 'Analytics', route: '/analytics', icon: BarChart3 }} />
            {activeRole === 'Admin' && <SidebarLink item={{ label: 'Platform Admin', route: '/platform-admin', icon: Settings }} />}
          </section>
        </nav>
      </div>

      <div className="border-t border-border-subtle px-3 py-3">
        <SidebarLink item={{ label: 'Help / Support', route: '/help-support', icon: HelpCircle }} />
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
