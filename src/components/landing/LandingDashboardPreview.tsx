import React from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Grid3X3,
  Search,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { useWorkspaceRole } from "../../context/WorkspaceRoleContext";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(displayName: string) {
  return displayName.trim().split(/\s+/)[0] || "there";
}

const quickAccess = [
  { label: "My Work", icon: Briefcase, bg: "bg-orange-100", color: "text-secondary" },
  { label: "Knowledge Base", icon: BookOpen, bg: "bg-info-surface", color: "text-info-text" },
  { label: "Service Hub", icon: Wrench, bg: "bg-success-surface", color: "text-success-text" },
  { label: "Team Directory", icon: Users, bg: "bg-warning-surface", color: "text-warning-text" },
  { label: "Applications", icon: Grid3X3, bg: "bg-orange-50", color: "text-dq-orange" },
];

const tasks = [
  { title: "Complete onboarding checklist", status: "In progress", tone: "info" as const },
  { title: "Review Q2 workspace policy", status: "Due today", tone: "warning" as const },
  { title: "Submit access request for analytics", status: "Not started", tone: "muted" as const },
];

const updates = [
  { title: "New Knowledge Discovery filters", date: "Jun 8" },
  { title: "Services Marketplace SLA updates", date: "Jun 5" },
  { title: "Platform maintenance window", date: "Jun 2" },
];

const statusStyles = {
  info: "bg-info-surface text-info-text",
  warning: "bg-warning-surface text-warning-text",
  muted: "bg-surface text-text-muted",
};

export function LandingDashboardPreview() {
  const { activeSegment } = useWorkspaceRole();
  const firstName = getFirstName(activeSegment.profileName);
  const greeting = getTimeGreeting();

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
          <p className="mt-1 text-sm text-text-muted">Here&apos;s what&apos;s happening in your workspace today.</p>
        </div>

        <div className="mb-5 flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-3">
          <Sparkles size={18} className="shrink-0 text-secondary" />
          <span className="flex-1 text-sm text-text-muted">
            Ask anything or search across your workspace...
          </span>
          <kbd className="hidden rounded-md border border-border-default bg-white px-2 py-0.5 text-[11px] font-semibold text-text-muted sm:inline-block">
            ⌘ K
          </kbd>
        </div>

        <div className="mb-5 grid grid-cols-5 gap-2">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center gap-2 text-center">
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
          <div className="rounded-xl border border-border-subtle bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-primary">My Tasks</span>
              <Search size={14} className="text-text-muted" />
            </div>
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li key={task.title} className="flex items-start justify-between gap-2">
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
            <div className="mb-3 text-sm font-bold text-primary">Platform Updates</div>
            <ul className="space-y-3">
              {updates.map((update) => (
                <li key={update.title} className="flex items-start justify-between gap-2">
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
        </div>
      </div>
    </div>
  );
}
