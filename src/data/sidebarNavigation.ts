import {
  BarChart3,
  Bot,
  CheckSquare,
  ClipboardCheck,
  Gauge,
  GitBranch,
  HelpCircle,
  Home,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  Network,
  Settings,
  ShieldCheck,
  Store,
  TimerReset,
  type LucideIcon,
} from 'lucide-react';

export interface SidebarItem {
  label: string;
  route: string;
  icon: LucideIcon;
  badge?: string;
  helper?: string;
}

export interface SidebarGroup {
  label: string;
  icon: LucideIcon;
  items: SidebarItem[];
  privileged?: boolean;
}

export const orientationItems: SidebarItem[] = [
  { label: 'Home', route: '/home', icon: Home, helper: 'Start here' },
  { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard, helper: 'Track performance' },
  { label: 'My Work', route: '/workspace', icon: CheckSquare, badge: '18', helper: 'Act on assigned work' },
  { label: 'AI Cockpit', route: '/ai-cockpit', icon: Bot, helper: 'Ask, automate, and analyze' },
];

export const marketplaceItem: SidebarItem = { label: 'DWS Marketplace', route: '/marketplace', icon: Store };

export const standardSidebarGroups: SidebarGroup[] = [
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
];

export const utilityItems: SidebarItem[] = [
  { label: 'Help / Support', route: '/help-support', icon: HelpCircle },
];

export const featureAreaSidebarOrder = ['tasks', 'services', 'performance', 'analytics', 'governance', 'administration'];

export const featureAreaIcons: Record<string, LucideIcon> = {
  tasks: CheckSquare,
  services: LifeBuoy,
  performance: Gauge,
  analytics: BarChart3,
  governance: ShieldCheck,
  administration: Settings,
};
