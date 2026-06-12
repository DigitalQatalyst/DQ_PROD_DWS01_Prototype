import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Search,
    iconBg: "bg-info-surface",
    iconColor: "text-info-text",
    title: "Find what you need, fast",
    description: "AI-powered search across knowledge, services, people, and work items.",
  },
  {
    icon: Sparkles,
    iconBg: "bg-orange-100",
    iconColor: "text-secondary",
    title: "Get things done",
    description: "Manage tasks, requests, and workflows from one governed workspace.",
  },
  {
    icon: Bell,
    iconBg: "bg-success-surface",
    iconColor: "text-success-text",
    title: "Stay informed",
    description: "Personalised updates, briefs, and insights delivered where you work.",
  },
];

const teamAvatars = [
  "bg-gradient-to-br from-navy-100 to-navy-200",
  "bg-gradient-to-br from-orange-100 to-orange-50",
  "bg-gradient-to-br from-sky-200 to-sky-400",
];

const aiSuggestions = ["Find a document", "Request access", "Onboarding steps"];

const workItems = [
  { label: "In progress", count: 4, icon: Clock, iconClass: "text-text-muted" },
  { label: "Due today", count: 2, icon: Clock, iconClass: "text-info-text" },
  { label: "Completed", count: 12, icon: CheckCircle2, iconClass: "text-success-text" },
];

const knowledgeArticles = [
  "Getting started guide",
  "Access & permissions",
  "Platform policies",
];

function FeatureCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border-subtle/80 bg-white/95 p-3.5 shadow-[0_8px_24px_rgba(3,15,53,0.08)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  icon,
  iconBg,
  title,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        {icon}
      </div>
      <span className="text-[11px] font-bold text-primary">{title}</span>
    </div>
  );
}

export function LandingFeaturesSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="dq-overline">What is DWS.01?</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-dq-navy sm:text-[36px]">
              Your digital workspace.
              <br />
              Organised around you.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-text-secondary">
              A central hub that connects your daily work — from discovering services and
              knowledge to tracking tasks and collaborating with your team.
            </p>

            <ul className="mt-8 space-y-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li key={feature.title} className="flex gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feature.iconBg} ${feature.iconColor}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              to="/marketplace"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-info-text transition-colors hover:text-info"
            >
              Explore all capabilities
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#F4F6FA] shadow-lg">
              {/* Orbit rings */}
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="absolute left-1/2 top-[18%] h-[52%] w-[52%] -translate-x-1/2 rounded-full border border-dashed border-[#C5CDE8]/70" />
                <div className="absolute left-1/2 top-[10%] h-[68%] w-[68%] -translate-x-1/2 rounded-full border border-dashed border-[#D5DBEF]/50" />
                <div className="absolute left-1/2 top-[4%] h-[82%] w-[82%] -translate-x-1/2 rounded-full border border-dashed border-[#E2E7F4]/40" />
                <Sparkles
                  size={14}
                  className="absolute left-[22%] top-[28%] text-info/40"
                />
                <Sparkles
                  size={12}
                  className="absolute right-[24%] top-[22%] text-info/35"
                />
                <Sparkles
                  size={10}
                  className="absolute bottom-[42%] left-[18%] text-info/30"
                />
                <TrendingUp
                  size={14}
                  className="absolute bottom-[48%] right-[20%] text-info/35"
                />
              </div>

              {/* Center portrait */}
              <div className="absolute inset-0 z-10 flex items-end justify-center">
                <img
                  src="/images/features-workspace-person.jpg"
                  alt="Employee using DWS.01 on a laptop"
                  className="h-[94%] w-auto max-w-[78%] object-contain object-bottom"
                />
              </div>

              {/* Floating cards */}
              <FeatureCard className="absolute left-3 top-6 z-20 w-[178px] sm:left-4 sm:top-8">
                <CardHeader
                  icon={<Users size={14} className="text-info-text" />}
                  iconBg="bg-info-surface"
                  title="Team Directory"
                />
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {teamAvatars.map((gradient) => (
                      <div
                        key={gradient}
                        className={`h-7 w-7 rounded-full border-2 border-white ${gradient}`}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <span className="ml-1.5 rounded-pill bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                    +24
                  </span>
                </div>
              </FeatureCard>

              <FeatureCard className="absolute right-3 top-10 z-20 w-[196px] sm:right-4 sm:top-12">
                <CardHeader
                  icon={<Bell size={14} className="text-dq-orange" />}
                  iconBg="bg-orange-50"
                  title="AI Assistant"
                />
                <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-2 py-1.5">
                  <Sparkles size={11} className="shrink-0 text-info-text" />
                  <span className="truncate text-[10px] text-text-muted">
                    How can I help you today?
                  </span>
                </div>
                <div className="space-y-1">
                  {aiSuggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="flex items-center justify-between rounded-md border border-info-surface bg-white px-2 py-1"
                    >
                      <span className="text-[9px] font-medium text-info-text">
                        {suggestion}
                      </span>
                      <ArrowRight size={10} className="text-info-text" />
                    </div>
                  ))}
                </div>
              </FeatureCard>

              <FeatureCard className="absolute bottom-24 left-2 z-30 w-[168px] sm:bottom-28 sm:left-3">
                <CardHeader
                  icon={<Briefcase size={14} className="text-secondary" />}
                  iconBg="bg-orange-100"
                  title="My Work"
                />
                <div className="space-y-2">
                  {workItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-2 text-[10px]"
                      >
                        <div className="flex min-w-0 items-center gap-1.5">
                          <Icon size={11} className={`shrink-0 ${item.iconClass}`} />
                          <span className="truncate text-text-secondary">{item.label}</span>
                        </div>
                        <span className="font-bold text-primary">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              </FeatureCard>

              <FeatureCard className="absolute bottom-14 right-2 z-30 w-[186px] sm:bottom-16 sm:right-3">
                <CardHeader
                  icon={<FileText size={14} className="text-warning-text" />}
                  iconBg="bg-warning-surface"
                  title="Knowledge Base"
                />
                <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-2 py-1.5">
                  <Search size={11} className="shrink-0 text-text-muted" />
                  <span className="text-[10px] text-text-muted">Search articles...</span>
                </div>
                <div className="space-y-1">
                  {knowledgeArticles.map((article) => (
                    <div key={article} className="flex items-center gap-1.5 px-0.5 py-0.5">
                      <FileText size={10} className="shrink-0 text-dq-orange" />
                      <span className="truncate text-[9px] text-text-secondary">
                        {article}
                      </span>
                    </div>
                  ))}
                </div>
              </FeatureCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
