import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CheckSquare,
  PenLine,
  AlertOctagon,
  Inbox,
  Bell,
  BookOpen,
  Briefcase,
  ClipboardList,
  Paperclip,
  FileCheck,
  Activity,
  Eye,
  AlertTriangle,
  Layers,
  ShieldAlert,
  Users,
  CalendarClock,
  MessageSquare,
  ArrowUpRight,
  Scale,
  ClipboardCheck,
  BarChart3,
  Gauge,
  Target,
  ShieldCheck,
  ListChecks,
  UserCog,
  Building2,
  Settings,
  GitBranch,
  Bell as BellRules,
  Tags,
  Plug,
  Sparkles,
  FileSearch,
  ScrollText,
  Headphones,
  CircleSlash,
  Send,
  LifeBuoy,
  TrendingUp,
  Trophy,
  Box,
  type LucideIcon,
} from 'lucide-react';
import { usePersona } from '../context/PersonaContext';
import { PersonaId } from '../types/platform';
interface NavItem {
  label: string;
  route: string;
  icon: LucideIcon;
  badge?: {
    value: string;
    tone?: 'accent' | 'warning' | 'danger';
  };
}
interface NavGroup {
  heading: string;
  items: NavItem[];
}
/* ============================================================
   Shared "My Daily Work" group
   ============================================================ */
const dailyWorkAll: NavItem[] = [
{
  label: 'My Tasks',
  route: '/workspace/my-tasks',
  icon: CheckSquare,
  badge: {
    value: '18',
    tone: 'accent'
  }
},
{
  label: 'My Updates',
  route: '/workspace/my-updates',
  icon: PenLine
},
{
  label: 'My Blockers',
  route: '/workspace/my-blockers',
  icon: AlertOctagon
},
{
  label: 'My Requests',
  route: '/workspace/my-requests',
  icon: Inbox
},
{
  label: 'Activity',
  route: '/workspace/activity',
  icon: Activity,
  badge: {
    value: '4',
    tone: 'accent'
  }
},
{
  label: 'Knowledge in Work Context',
  route: '/workspace/knowledge-context',
  icon: BookOpen
}];

// CEO version omits "Knowledge in Work Context"
const dailyWorkCeo: NavItem[] = dailyWorkAll.filter(
  (i) => i.route !== '/workspace/knowledge-context'
);
const myDailyWork = (id: PersonaId): NavGroup => ({
  heading: 'My Daily Work',
  items: id === 'ceo' ? dailyWorkCeo : dailyWorkAll
});
/* ============================================================
   Role-specific groups
   ============================================================ */
const sidebarConfig: Record<PersonaId, NavGroup[]> = {
  associate: [
  {
    heading: 'Workspace',
    items: [
    {
      label: 'Personal Execution Workspace',
      route: '/workspace',
      icon: Briefcase
    },
    {
      label: 'Assigned Work',
      route: '/workspace/assigned-work',
      icon: ClipboardList
    },
    {
      label: 'Request Status',
      route: '/workspace/request-status',
      icon: Activity
    },
    {
      label: 'Evidence Queue',
      route: '/workspace/evidence-queue',
      icon: Paperclip
    },
    {
      label: 'Closure Requests',
      route: '/workspace/closure-requests',
      icon: FileCheck
    },
    {
      label: 'Objective-linked Tasks',
      route: '/workspace/objective-linked-tasks',
      icon: Target
    }]

  },
  {
    heading: 'Discovery Shortcuts',
    items: [
    {
      label: 'Service Catalogue',
      route: '/marketplaces/services',
      icon: Inbox
    },
    {
      label: 'Task Templates',
      route: '/marketplaces/task-templates',
      icon: Layers
    },
    {
      label: 'Knowledge Hub',
      route: '/marketplaces/knowledge',
      icon: BookOpen
    }]

  }],

  'scrum-master': [
  {
    heading: 'Agile Execution',
    items: [
    {
      label: 'Agile Execution View',
      route: '/workspace/agile-execution',
      icon: Activity
    },
    {
      label: 'Objective-linked Task Review',
      route: '/agile/objective-task-review',
      icon: Target
    },
    {
      label: 'Task Structure Gaps',
      route: '/agile/task-structure-gaps',
      icon: ListChecks
    },
    {
      label: 'Missing Updates',
      route: '/agile/missing-updates',
      icon: PenLine,
      badge: {
        value: '5',
        tone: 'warning'
      }
    },
    {
      label: 'Blocker Review',
      route: '/agile/blocker-review',
      icon: AlertOctagon
    },
    {
      label: 'Task Hygiene Review',
      route: '/agile/task-hygiene',
      icon: ListChecks
    },
    {
      label: 'Closure Quality Risks',
      route: '/agile/closure-risks',
      icon: ShieldAlert
    },
    {
      label: 'SLA Risks',
      route: '/intelligence/sla',
      icon: AlertTriangle,
      badge: {
        value: '3',
        tone: 'danger'
      }
    },
    {
      label: 'Working Sessions',
      route: '/agile/working-sessions',
      icon: CalendarClock
    },
    {
      label: 'Reminder Prompts',
      route: '/agile/reminders',
      icon: Bell
    }]

  },
  {
    heading: 'Workflow',
    items: [
    {
      label: 'Escalations',
      route: '/workflow/escalations',
      icon: ArrowUpRight
    },
    {
      label: 'Decision Log',
      route: '/execution/decision-log',
      icon: Scale
    }]

  }],

  'team-lead': [
  {
    heading: 'Team Execution',
    items: [
    {
      label: 'Team Execution View',
      route: '/operations/team-execution',
      icon: Users
    },
    {
      label: 'Team Tasks',
      route: '/team/tasks',
      icon: CheckSquare
    },
    {
      label: 'Objective-linked Tasks',
      route: '/team/objective-linked-tasks',
      icon: Target
    },
    {
      label: 'Task Structure Review',
      route: '/team/task-structure-review',
      icon: ListChecks
    },
    {
      label: 'Team Task Templates',
      route: '/team/task-templates',
      icon: Layers
    },
    {
      label: 'Workload Board',
      route: '/team/workload',
      icon: Layers
    },
    {
      label: 'Assign Task',
      route: '/team/assign-task',
      icon: UserCog
    },
    {
      label: 'Blocked / Overdue Work',
      route: '/team/blocked-overdue',
      icon: AlertOctagon,
      badge: {
        value: '4',
        tone: 'danger'
      }
    },
    {
      label: 'Pending Approvals',
      route: '/team/approvals',
      icon: ClipboardCheck
    },
    {
      label: 'Escalations',
      route: '/workflow/escalations',
      icon: ArrowUpRight
    },
    {
      label: 'Closure Quality',
      route: '/team/closure-quality',
      icon: ShieldCheck
    },
    {
      label: 'Team Performance',
      route: '/team/performance',
      icon: TrendingUp
    }]

  },
  {
    heading: 'Working Sessions',
    items: [
    {
      label: 'Session Board',
      route: '/team/sessions',
      icon: CalendarClock
    },
    {
      label: 'Actions & Follow-ups',
      route: '/team/session-actions',
      icon: ListChecks
    },
    {
      label: 'Decisions',
      route: '/team/session-decisions',
      icon: Scale
    }]

  }],

  'unit-lead': [
  {
    heading: 'Unit Visibility',
    items: [
    {
      label: 'Unit Visibility View',
      route: '/operations/unit-visibility',
      icon: Eye
    },
    {
      label: 'Strategy-linked Tasks',
      route: '/unit/strategy-linked-tasks',
      icon: Target
    },
    {
      label: 'Task Governance Health',
      route: '/unit/task-governance-health',
      icon: ShieldCheck
    },
    {
      label: 'Unit Workload',
      route: '/unit/workload',
      icon: Layers
    },
    {
      label: 'Delivery Health',
      route: '/unit/delivery-health',
      icon: Gauge
    },
    {
      label: 'SLA Trends',
      route: '/unit/sla-trends',
      icon: AlertTriangle
    },
    {
      label: 'Governance Risks',
      route: '/unit/governance-risks',
      icon: ShieldAlert
    },
    {
      label: 'Outcome Progress',
      route: '/unit/outcome-progress',
      icon: Target
    },
    {
      label: 'Unit Performance',
      route: '/unit/performance',
      icon: TrendingUp
    },
    {
      label: 'Escalations',
      route: '/workflow/escalations',
      icon: ArrowUpRight
    },
    {
      label: 'Approvals',
      route: '/unit/approvals',
      icon: ClipboardCheck
    }]

  },
  {
    heading: 'Governance',
    items: [
    {
      label: 'Governance Dashboard',
      route: '/unit/governance-dashboard',
      icon: ShieldCheck
    },
    {
      label: 'Operating Discipline Review',
      route: '/unit/operating-discipline',
      icon: ScrollText
    }]

  }],

  hra: [
  {
    heading: 'HRA Workflow',
    items: [
    {
      label: 'HRA Workflow View',
      route: '/operations/hra-workflow',
      icon: Briefcase
    },
    {
      label: 'HRA Requests',
      route: '/hra/requests',
      icon: Inbox
    },
    {
      label: 'New Joiner Onboarding',
      route: '/hra/new-joiner',
      icon: Users
    },
    {
      label: 'Role Transition',
      route: '/hra/role-transition',
      icon: UserCog
    },
    {
      label: 'Workforce Readiness',
      route: '/hra/workforce-readiness',
      icon: Gauge
    },
    {
      label: 'Policy Checks',
      route: '/hra/policy-checks',
      icon: ShieldCheck
    },
    {
      label: 'Employee Readiness Requests',
      route: '/hra/readiness-requests',
      icon: ClipboardList
    },
    {
      label: 'HRA Approvals',
      route: '/hra/approvals',
      icon: ClipboardCheck
    },
    {
      label: 'HRA Fulfilment Queue',
      route: '/hra/fulfilment-queue',
      icon: Send,
      badge: {
        value: '7',
        tone: 'accent'
      }
    }]

  },
  {
    heading: 'Knowledge',
    items: [
    {
      label: 'HRA Guides',
      route: '/hra/guides',
      icon: BookOpen
    },
    {
      label: 'Onboarding Playbooks',
      route: '/hra/playbooks',
      icon: FileSearch
    },
    {
      label: 'Policy References',
      route: '/hra/policy-references',
      icon: ScrollText
    }]

  }],

  admin: [
  {
    heading: 'Administration',
    items: [
    {
      label: 'Administration Console',
      route: '/admin/console',
      icon: Settings
    },
    {
      label: 'User & Role Management',
      route: '/admin/users-roles',
      icon: Users
    },
    {
      label: 'Organisation / Unit / Team Setup',
      route: '/admin/org-setup',
      icon: Building2
    },
    {
      label: 'Task Model Configuration',
      route: '/admin/task-model',
      icon: CheckSquare
    },
    {
      label: 'Task Attribute Library',
      route: '/admin/task-attributes',
      icon: Tags
    },
    {
      label: 'Task Section Builder',
      route: '/admin/task-sections',
      icon: Layers
    },
    {
      label: 'Task Permission Rules',
      route: '/admin/task-permissions',
      icon: ShieldCheck
    },
    {
      label: 'Task Template Governance',
      route: '/admin/task-templates',
      icon: ScrollText
    },
    {
      label: 'Request Category Configuration',
      route: '/admin/request-categories',
      icon: Inbox
    },
    {
      label: 'Workflow & Approval Rules',
      route: '/admin/workflow-rules',
      icon: GitBranch
    },
    {
      label: 'SLA & Notification Rules',
      route: '/admin/sla-notifications',
      icon: BellRules
    },
    {
      label: 'Knowledge Taxonomy',
      route: '/admin/knowledge-taxonomy',
      icon: Tags
    },
    {
      label: 'Integration Settings',
      route: '/admin/integrations',
      icon: Plug
    },
    {
      label: 'AI / Automation Settings',
      route: '/admin/ai-automation',
      icon: Sparkles
    }]

  },
  {
    heading: 'Governance Control',
    items: [
    {
      label: 'Audit Log',
      route: '/admin/audit-log',
      icon: FileSearch
    },
    {
      label: 'Change Governance',
      route: '/admin/change-governance',
      icon: GitBranch
    },
    {
      label: 'Configuration Review',
      route: '/admin/config-review',
      icon: ClipboardCheck
    },
    {
      label: 'Permission Exceptions',
      route: '/admin/permission-exceptions',
      icon: ShieldAlert
    }]

  }],

  support: [
  {
    heading: 'Support Operations',
    items: [
    {
      label: 'Support Operations View',
      route: '/support/operations',
      icon: Headphones
    },
    {
      label: 'Central Support Queue',
      route: '/support/central-queue',
      icon: Inbox,
      badge: {
        value: '12',
        tone: 'danger'
      }
    },
    {
      label: 'Triage Needed',
      route: '/support/triage',
      icon: AlertTriangle
    },
    {
      label: 'Missing Input Requests',
      route: '/support/missing-input',
      icon: CircleSlash
    },
    {
      label: 'Routed Requests',
      route: '/support/routed',
      icon: Send
    },
    {
      label: 'SLA Risk Queue',
      route: '/support/sla-risk',
      icon: AlertOctagon,
      badge: {
        value: '5',
        tone: 'warning'
      }
    },
    {
      label: 'Escalations',
      route: '/workflow/escalations',
      icon: ArrowUpRight
    },
    {
      label: 'Closure Queue',
      route: '/support/closure-queue',
      icon: FileCheck
    },
    {
      label: 'Knowledge Assistance',
      route: '/support/knowledge-assistance',
      icon: LifeBuoy
    }]

  },
  {
    heading: 'Fulfilment',
    items: [
    {
      label: 'Fulfilment Owner Queues',
      route: '/support/fulfilment-queues',
      icon: Users
    },
    {
      label: 'Request Status',
      route: '/support/request-status',
      icon: Activity
    },
    {
      label: 'Support Dashboard',
      route: '/support/dashboard',
      icon: BarChart3
    }]

  }],

  ceo: [
  {
    heading: 'Enterprise Execution',
    items: [
    {
      label: 'CEO Enterprise Execution View',
      route: '/executive/enterprise-execution',
      icon: Trophy
    },
    {
      label: 'Strategy-linked Task View',
      route: '/executive/strategy-linked-tasks',
      icon: Target
    },
    {
      label: 'Strategic Initiative Progress',
      route: '/executive/strategic-initiatives',
      icon: Target
    },
    {
      label: 'Governance Health',
      route: '/executive/governance-health',
      icon: ShieldCheck
    },
    {
      label: 'SLA Exposure',
      route: '/executive/sla-exposure',
      icon: AlertTriangle
    },
    {
      label: 'Enterprise Performance',
      route: '/executive/enterprise-performance',
      icon: TrendingUp
    },
    {
      label: 'Team & Unit Performance',
      route: '/executive/team-unit-performance',
      icon: Gauge
    },
    {
      label: 'Outcome Tracking',
      route: '/executive/outcome-tracking',
      icon: Activity
    },
    {
      label: 'Value Delivery',
      route: '/executive/value-delivery',
      icon: BarChart3
    },
    {
      label: 'Critical Escalations',
      route: '/executive/critical-escalations',
      icon: ArrowUpRight,
      badge: {
        value: '2',
        tone: 'danger'
      }
    }]

  },
  {
    heading: 'Governance Review',
    items: [
    {
      label: 'Operating Discipline Review',
      route: '/executive/operating-discipline',
      icon: ScrollText
    },
    {
      label: 'Audit & Compliance View',
      route: '/admin/audit-log',
      icon: FileSearch
    },
    {
      label: 'Executive Decision Log',
      route: '/executive/decision-log',
      icon: Scale
    }]

  }]

};
/* ============================================================
   Badge rendering
   ============================================================ */
function renderBadge(badge?: NavItem['badge']) {
  if (!badge) return null;
  const tone = badge.tone ?? 'accent';
  const toneClasses =
  tone === 'danger' ?
  'bg-danger text-white' :
  tone === 'warning' ?
  'bg-warning text-white' :
  'bg-[#FB5535] text-white';
  return (
    <span
      className={`ml-auto inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 rounded-pill text-[10px] font-bold ${toneClasses}`}>
      
      {badge.value}
    </span>);

}
/* ============================================================
   Sidebar component
   ============================================================ */
export function RoleScopedSidebar() {
  const { activePersona } = usePersona();
  const groups: NavGroup[] = [
  myDailyWork(activePersona.id),
  ...(sidebarConfig[activePersona.id] ?? [])];

  // Drop empty groups defensively
  const visibleGroups = groups.filter((g) => g.items.length > 0);
  return (
    <aside
      className="fixed top-16 left-0 w-[280px] h-[calc(100vh-64px)] bg-white border-r border-[#EEEFF6] overflow-y-auto z-40 pb-8"
      aria-label="Workspace navigation">
      
      <div className="px-3 py-4">
        <div className="text-[11px] font-semibold text-[#5F607F] uppercase tracking-wider mb-1 px-3">
          DWS.01 Workspace
        </div>
        <div className="text-xs text-[#5F607F] mb-5 px-3">
          {activePersona.role} · {activePersona.unit}
        </div>

        <div className="space-y-5">
          {visibleGroups.map((group) =>
          <div key={group.heading}>
              <h3 className="text-[11px] font-semibold text-[#5F607F] uppercase tracking-wider mb-1.5 px-3">
                {group.heading}
              </h3>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.route + item.label}>
                      <NavLink
                      to={item.route}
                      end
                      className={({ isActive }) =>
                      `relative flex items-center gap-3 h-10 pl-3 pr-3 rounded-r-[8px] text-sm font-medium transition-colors group ${isActive ? 'bg-[#F3F5FD] text-[#030F35]' : 'text-[#5F607F] hover:bg-[#F3F5FD] hover:text-[#030F35]'}`
                      }>
                      
                        {({ isActive }) =>
                      <>
                            {isActive &&
                        <span
                          aria-hidden
                          className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-[#FB5535]" />

                        }
                            <Icon
                          size={18}
                          strokeWidth={1.5}
                          className={
                          isActive ?
                          'text-[#030F35]' :
                          'text-[#5F607F] group-hover:text-[#030F35]'
                          } />
                        
                            <span className="truncate">{item.label}</span>
                            {renderBadge(item.badge)}
                          </>
                      }
                      </NavLink>
                    </li>);

              })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </aside>);

}
