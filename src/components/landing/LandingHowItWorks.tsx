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
    description: "Find services, knowledge, and tools across your organisation.",
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

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="dq-overline">How it works</p>
          <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-dq-navy sm:text-[36px]">
            Simple. Intuitive. Designed for your day.
          </h2>
        </div>

        <div className="mt-14 flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.title}>
                <article className="flex flex-1 flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-dq-orange hover:shadow-dq-hover lg:max-w-[220px]">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${step.iconBg} ${step.iconColor}`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    {step.number}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{step.description}</p>
                </article>
                {index < steps.length - 1 && (
                  <div className="hidden items-center justify-center text-border-strong lg:flex lg:pt-14">
                    <ArrowRight size={18} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
