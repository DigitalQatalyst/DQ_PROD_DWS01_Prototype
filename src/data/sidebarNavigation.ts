import {
  Activity,
  AlertTriangle,
  BarChart3,
  BadgeCheck,
  Bot,
  Building2,
  CheckSquare,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Handshake,
  HelpCircle,
  Home,
  Inbox,
  Kanban,
  LayoutTemplate,
  LayoutDashboard,
  LibraryBig,
  LineChart,
  ListChecks,
  ListOrdered,
  Network,
  PieChart,
  PlugZap,
  Route,
  SearchCheck,
  Send,
  Settings2,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Star,
  Store,
  Target,
  TimerReset,
  TrendingUp,
  UploadCloud,
  Users,
  UsersRound,
  Workflow,
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

export const marketplaceItem: SidebarItem = { label: '4D Marketplaces', route: '/marketplace', icon: Store };

export const standardSidebarGroups: SidebarGroup[] = [];

export const utilityItems: SidebarItem[] = [
  { label: 'Help / Support', route: '/help-support', icon: HelpCircle },
];

export const featureAreaSidebarOrder = ['tasks', 'workflows', 'tracker', 'services', 'performance', 'analytics', 'governance', 'administration'];

export const featureGroupIcons: Record<string, Record<string, LucideIcon>> = {
  tasks: {
    'my-work': ClipboardCheck,
    'task-board': Kanban,
    'task-creation-templates': LayoutTemplate,
    'task-updates-evidence': UploadCloud,
    'closure-reviews': BadgeCheck,
  },
  services: {
    'service-hub': Store,
    'service-catalogue': LibraryBig,
    'request-intake-submission': Send,
    'fulfilment-queues': ListOrdered,
    'service-closure-feedback': Star,
  },
  tracker: {
    'tracker-hub': Gauge,
    'request-status-tracker': SearchCheck,
    'action-follow-up-tracker': ListChecks,
    'blocker-sla-tracker': AlertTriangle,
    'decision-outcome-tracker': Target,
  },
  workflows: {
    'workflow-centre': Workflow,
    'workflow-inbox': Inbox,
    'handoffs-management': Handshake,
    'workflow-routing-state-control': Route,
    'workflow-templates': LayoutTemplate,
  },
  performance: {
    'my-performance-snapshot': Activity,
    'team-performance': Users,
    'unit-performance': Building2,
    'sla-closure-quality-performance': TimerReset,
    'outcome-performance': Target,
  },
  analytics: {
    'execution-analytics': BarChart3,
    'sla-analytics': LineChart,
    'workload-capacity-analytics': PieChart,
    'governance-analytics': ShieldCheck,
    'outcome-value-analytics': TrendingUp,
  },
  governance: {
    'approvals-management': CheckCircle2,
    'escalation-management': Siren,
    'audit-compliance-control': ShieldCheck,
    'governance-review': ClipboardCheck,
    'operating-discipline-review': ListChecks,
  },
  administration: {
    'user-role-management': UsersRound,
    'organisation-unit-team-setup': Network,
    'task-request-configuration': Settings2,
    'workflow-approval-sla-rules': SlidersHorizontal,
    'integration-audit-automation-settings': PlugZap,
  },
};

export const fallbackFeatureGroupIcon = LayoutDashboard;
