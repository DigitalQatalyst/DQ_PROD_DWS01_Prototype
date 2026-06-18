import React from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Grid3X3,
  KeyRound,
  Rocket,
  Search,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { useViewingMode } from "../../context/ViewingModeContext";
import { useWorkspaceRole } from "../../context/WorkspaceRoleContext";
import { setupJourneyCards } from "../../mocks/stage0Home.mock";
import type { SetupCardStatus } from "../../mocks/stage0Home.mock";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(displayName: string) {
  return displayName.trim().split(/\s+/)[0] || "there";
}

const returningQuickAccess = [
  {
    label: "My Work",
    icon: Briefcase,
    bg: "bg-orange-100",
    color: "text-secondary",
  },
  {
    label: "Knowledge Base",
    icon: BookOpen,
    bg: "bg-info-surface",
    color: "text-info-text",
  },
  {
    label: "Service Hub",
    icon: Wrench,
    bg: "bg-success-surface",
    color: "text-success-text",
  },
  {
    label: "Team Directory",
    icon: Users,
    bg: "bg-warning-surface",
    color: "text-warning-text",
  },
  {
    label: "Applications",
    icon: Grid3X3,
    bg: "bg-orange-50",
    color: "text-dq-orange",
  },
];

const newJoinerQuickAccess = [
  {
    label: "Onboarding",
    icon: Rocket,
    bg: "bg-orange-100",
    color: "text-secondary",
  },
  {
    label: "Guides",
    icon: BookOpen,
    bg: "bg-info-surface",
    color: "text-info-text",
  },
  {
    label: "Access",
    icon: KeyRound,
    bg: "bg-success-surface",
    color: "text-success-text",
  },
  {
    label: "Services",
    icon: Wrench,
    bg: "bg-warning-surface",
    color: "text-warning-text",
  },
  { label: "Team", icon: Users, bg: "bg-orange-50", color: "text-dq-orange" },
];

const returningTasks = [
  {
    title: "Complete onboarding checklist",
    status: "In progress",
    tone: "info" as const,
  },
  {
    title: "Review Q2 workspace policy",
    status: "Due today",
    tone: "warning" as const,
  },
  {
    title: "Submit access request for analytics",
    status: "Not started",
    tone: "muted" as const,
  },
];

const returningUpdates = [
  { title: "New Knowledge Discovery filters", date: "Jun 8" },
  { title: "Services Marketplace SLA updates", date: "Jun 5" },
  { title: "Platform maintenance window", date: "Jun 2" },
];

const newJoinerGuides = [
  { title: "DWS.01 orientation overview", date: "Start here" },
  { title: "DQ Ways of Working", date: "15 min" },
  { title: "Request access & tools guide", date: "5 min" },
];

const statusStyles = {
  info: "bg-info-surface text-info-text",
  warning: "bg-warning-surface text-warning-text",
  muted: "bg-surface text-text-muted",
  success: "bg-success-surface text-success-text",
};

const setupStatusLabels: Record<SetupCardStatus, string> = {
  completed: "Done",
  "in-progress": "In progress",
  "not-started": "Not started",
};

const setupStatusTones: Record<SetupCardStatus, keyof typeof statusStyles> = {
  completed: "success",
  "in-progress": "info",
  "not-started": "muted",
};

export function LandingDashboardPreview() {
  const { mode } = useViewingMode();
  const { activeSegment } = useWorkspaceRole();
  const isNewJoiner = mode === "first-time";
  const firstName = getFirstName(activeSegment.profileName);
  const greeting = getTimeGreeting();

  const quickAccess = isNewJoiner ? newJoinerQuickAccess : returningQuickAccess;
  const subtext = isNewJoiner
    ? "Start your DWS.01 journey — complete setup and your first actions."
    : "Here's what's happening in your workspace today.";
  const searchPlaceholder = isNewJoiner
    ? "Search onboarding guidance, access, services, or support..."
    : "Ask anything or search across your workspace...";

  return (
    <div className="relative">
      <div className="absolute -left-3 top-16 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-white shadow-lg">
        <Bell size={18} className="text-primary" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
      </div>

      <div className="rounded-[20px] border border-border-subtle bg-white p-5 shadow-xl lg:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-primary">
            {greeting}, {firstName} 👋
          </h3>
          <p className="mt-1 text-sm text-text-muted">{subtext}</p>
        </div>

        <div className="mb-5 flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-3">
          <Sparkles size={18} className="shrink-0 text-secondary" />
          <span className="flex-1 text-sm text-text-muted">
            {searchPlaceholder}
          </span>
          <kbd className="hidden rounded-md border border-border-default bg-white px-2 py-0.5 text-[11px] font-semibold text-text-muted sm:inline-block">
            ⌘ K
          </kbd>
        </div>

        <div className="mb-5 grid grid-cols-5 gap-2">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-[10px] font-semibold leading-tight text-text-secondary">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {isNewJoiner ? (
            <>
              <div className="rounded-xl border border-border-subtle bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    Setup Journey
                  </span>
                  <Rocket size={14} className="text-secondary" />
                </div>
                <ul className="space-y-3">
                  {setupJourneyCards.map((step) => (
                    <li
                      key={step.id}
                      className="flex items-start justify-between gap-2"
                    >
                      <span className="text-xs font-medium leading-5 text-text-secondary">
                        {step.title}
                      </span>
                      <span
                        className={`shrink-0 rounded-pill px-2 py-0.5 text-[10px] font-bold ${statusStyles[setupStatusTones[step.status]]}`}
                      >
                        {setupStatusLabels[step.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface p-4">
                <div className="mb-3 text-sm font-bold text-primary">
                  Getting Started
                </div>
                <ul className="space-y-3">
                  {newJoinerGuides.map((guide) => (
                    <li
                      key={guide.title}
                      className="flex items-start justify-between gap-2"
                    >
                      <span className="text-xs font-medium leading-5 text-text-secondary">
                        {guide.title}
                      </span>
                      <span className="shrink-0 text-[10px] font-semibold text-text-muted">
                        {guide.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-border-subtle bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    My Tasks
                  </span>
                  <Search size={14} className="text-text-muted" />
                </div>
                <ul className="space-y-3">
                  {returningTasks.map((task) => (
                    <li
                      key={task.title}
                      className="flex items-start justify-between gap-2"
                    >
                      <span className="text-xs font-medium leading-5 text-text-secondary">
                        {task.title}
                      </span>
                      <span
                        className={`shrink-0 rounded-pill px-2 py-0.5 text-[10px] font-bold ${statusStyles[task.tone]}`}
                      >
                        {task.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface p-4">
                <div className="mb-3 text-sm font-bold text-primary">
                  Platform Updates
                </div>
                <ul className="space-y-3">
                  {returningUpdates.map((update) => (
                    <li
                      key={update.title}
                      className="flex items-start justify-between gap-2"
                    >
                      <span className="text-xs font-medium leading-5 text-text-secondary">
                        {update.title}
                      </span>
                      <span className="shrink-0 text-[10px] font-semibold text-text-muted">
                        {update.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
