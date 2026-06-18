import React from "react";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Lock,
  Search,
  Users,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Find services, knowledge, and tools across your organisation.",
    icon: Search,
    iconBg: "bg-info-surface",
    iconColor: "text-info-text",
  },
  {
    number: "02",
    title: "Access",
    description: "Request access with built-in governance and approval flows.",
    icon: Lock,
    iconBg: "bg-orange-100",
    iconColor: "text-secondary",
  },
  {
    number: "03",
    title: "Act",
    description: "Manage tasks, requests, and approvals in one place.",
    icon: ClipboardList,
    iconBg: "bg-info-surface",
    iconColor: "text-info-text",
  },
  {
    number: "04",
    title: "Collaborate",
    description: "Connect with the right people, teams, and experts.",
    icon: Users,
    iconBg: "bg-info-surface",
    iconColor: "text-info-text",
  },
  {
    number: "05",
    title: "Improve",
    description: "Gain insights and share feedback to continuously improve.",
    icon: BarChart3,
    iconBg: "bg-success-surface",
    iconColor: "text-success-text",
  },
];

function StepCard({ step }: { step: (typeof steps)[number] }) {
  const Icon = step.icon;

  return (
    <article className="flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-dq-orange hover:shadow-dq-hover">
      <div
        className={`mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${step.iconBg} ${step.iconColor}`}
      >
        <Icon size={22} />
      </div>
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-text-muted">
        {step.number}
      </span>
      <h3 className="mt-1 shrink-0 text-base font-bold text-primary">
        {step.title}
      </h3>
      <p className="mt-2 h-24 text-sm leading-6 text-text-muted">
        {step.description}
      </p>
    </article>
  );
}

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className=" max-w-2xl ">
          <p className="dq-overline">How it works</p>
          <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-dq-navy sm:text-[36px]">
            Simple. Intuitive. Designed for your day.
          </h2>
        </div>

        <div className="mt-14 flex flex-col gap-4 lg:hidden">
          {steps.map((step) => (
            <StepCard key={step.title} step={step} />
          ))}
        </div>

        <div className="mt-8 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch lg:gap-x-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <StepCard step={step} />
              {index < steps.length - 1 && (
                <div className="flex items-center justify-center self-center px-0.5 text-border-strong">
                  <ArrowRight size={18} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
