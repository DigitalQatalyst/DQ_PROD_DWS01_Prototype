import React, { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, ShieldCheck, UserCheck, Users } from "lucide-react";
import { LandingDashboardPreview } from "./LandingDashboardPreview";

const defaultTrustItems = [
  { icon: ShieldCheck, label: "Secure & Compliant" },
  { icon: UserCheck, label: "Role-based Access" },
  { icon: Users, label: "Built for Everyone" },
];

export interface LandingHeroCta {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

export interface LandingHeroProps {
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  primaryCta?: LandingHeroCta;
  secondaryCta?: LandingHeroCta;
  slot?: ReactNode;
  showTrustItems?: boolean;
  trustItems?: typeof defaultTrustItems;
}

export function LandingHero({
  eyebrow = "Digital Workspace for Every Employee",
  title = (
    <>
      Everything you need. <span className="text-dq-orange">One workspace.</span>
    </>
  ),
  subtitle = "DWS.01 brings your tools, tasks, knowledge, and services together in one intelligent hub so every employee can discover, act, and collaborate without switching between systems.",
  primaryCta,
  secondaryCta,
  slot,
  showTrustItems = true,
  trustItems = defaultTrustItems,
}: LandingHeroProps) {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  const resolvedPrimaryCta = primaryCta ?? {
    label: "Get Started",
    onClick: () => navigate("/onboarding"),
  };

  const resolvedSecondaryCta = secondaryCta ?? {
    label: "Take a Tour",
    onClick: scrollToHowItWorks,
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--mesh-hero-light)" }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 hero-grid opacity-40" />

      <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="animate-fade-in-up font-mono text-[11px] uppercase tracking-[0.2em] text-dq-orange">
              {eyebrow}
            </p>

            <h1 className="animate-fade-in-up animation-delay-100 mt-4 text-balance text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] text-dq-navy sm:text-[48px] lg:text-[52px]">
              {title}
            </h1>

            <p className="animate-fade-in-up animation-delay-200 mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-[17px]">
              {subtitle}
            </p>

            {slot ? (
              <div className="animate-fade-in-up animation-delay-300 mt-8">{slot}</div>
            ) : (
              <div className="animate-fade-in-up animation-delay-300 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={resolvedPrimaryCta.onClick}
                  className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-dq-navy px-6 text-sm font-semibold text-white transition sm:w-auto"
                  style={{ boxShadow: "var(--glow-navy-md)" }}
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-dq-orange to-[#e04020] transition-transform duration-500 group-hover:translate-x-0" />
                  <span className="relative">{resolvedPrimaryCta.label}</span>
                  <ArrowRight
                    size={16}
                    className="relative transition group-hover:translate-x-0.5"
                  />
                </button>
                <button
                  type="button"
                  onClick={resolvedSecondaryCta.onClick}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#c5cde8] bg-white/60 px-6 text-sm font-semibold text-dq-navy backdrop-blur-sm transition hover:border-[#a0aacc] hover:bg-white sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
                >
                  {resolvedSecondaryCta.label}
                  {resolvedSecondaryCta.icon ?? (
                    <Play size={14} className="ml-0.5" fill="currentColor" />
                  )}
                </button>
              </div>
            )}

            {showTrustItems && (
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
                {trustItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy-50 text-dq-navy">
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <LandingDashboardPreview />
        </div>
      </div>
    </section>
  );
}
