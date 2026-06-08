import {
  BarChart3,
  Bot,
  CheckSquare,
  Gauge,
  GitBranch,
  HelpCircle,
  Home,
  LifeBuoy,
  Network,
  Settings,
  ShieldCheck,
  Store,
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
  { label: 'AI Cockpit', route: '/ai-cockpit', icon: Bot, helper: 'Ask, automate, and analyze' },
];

export const marketplaceItem: SidebarItem = { label: 'DWS Marketplace', route: '/marketplace', icon: Store };

export const standardSidebarGroups: SidebarGroup[] = [];

export const utilityItems: SidebarItem[] = [
  { label: 'Help / Support', route: '/help-support', icon: HelpCircle },
];

export const featureAreaSidebarOrder = ['tasks', 'workflows', 'tracker', 'services', 'performance', 'analytics', 'governance', 'administration'];

export const featureAreaIcons: Record<string, LucideIcon> = {
  tasks: CheckSquare,
  workflows: GitBranch,
  tracker: Network,
  services: LifeBuoy,
  performance: Gauge,
  analytics: BarChart3,
  governance: ShieldCheck,
  administration: Settings,
};
