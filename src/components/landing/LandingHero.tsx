import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, ShieldCheck, UserCheck, Users } from "lucide-react";
import { LandingDashboardPreview } from "./LandingDashboardPreview";

const trustItems = [
  { icon: ShieldCheck, label: "Secure & Compliant" },
  { icon: UserCheck, label: "Role-based Access" },
  { icon: Users, label: "Built for Everyone" },
];

export function LandingHero() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--mesh-hero-light)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hero-grid opacity-40"
      />

      <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="animate-fade-in-up font-mono text-[11px] uppercase tracking-[0.2em] text-dq-orange">
              Digital Workspace for Every Employee
            </p>

            <h1 className="animate-fade-in-up animation-delay-100 mt-4 text-balance text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] text-dq-navy sm:text-[48px] lg:text-[52px]">
              Everything you need.{" "}
              <span className="text-dq-orange">One workspace.</span>
            </h1>

            <p className="animate-fade-in-up animation-delay-200 mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-[17px]">
              DWS.01 brings your tools, tasks, knowledge, and services together
              in one intelligent hub so every employee can discover, act, and
              collaborate without switching between systems.
            </p>

            <div className="animate-fade-in-up animation-delay-300 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate("/onboarding")}
                className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-dq-navy px-6 text-sm font-semibold text-white transition sm:w-auto"
                style={{ boxShadow: "var(--glow-navy-md)" }}
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-dq-orange to-[#e04020] transition-transform duration-500 group-hover:translate-x-0" />
                <span className="relative">Get Started</span>
                <ArrowRight
                  size={16}
                  className="relative transition group-hover:translate-x-0.5"
                />
              </button>
              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#c5cde8] bg-white/60 px-6 text-sm font-semibold text-dq-navy backdrop-blur-sm transition hover:border-[#a0aacc] hover:bg-white sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
              >
                Take a Tour
                <Play size={14} className="ml-0.5" fill="currentColor" />
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy-50 text-dq-navy">
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <LandingDashboardPreview />
        </div>
      </div>
    </section>
  );
}
