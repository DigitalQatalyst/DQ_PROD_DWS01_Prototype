import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Headphones,
  Laptop,
  RefreshCw,
  Shield,
  HeartHandshake,
} from "lucide-react";

const footerFeatures = [
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "Security, compliance, and governance built in from day one.",
  },
  {
    icon: RefreshCw,
    title: "Always Improving",
    description: "Regular platform updates driven by user feedback and needs.",
  },
  {
    icon: HeartHandshake,
    title: "Support That Cares",
    description: "Help when you need it through the Services Marketplace.",
  },
  {
    icon: Laptop,
    title: "Accessible Anywhere",
    description: "A seamless experience across desktop, tablet, and mobile.",
  },
];

export function LandingCtaSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div
          className="rounded-2xl border border-gray-200 px-8 py-14 text-center shadow-dq sm:px-12 lg:py-16"
          style={{ background: "var(--mesh-cta-orange)" }}
        >
          <h2 className="text-[32px] font-semibold leading-tight tracking-tight text-white sm:text-[36px]">
            Your work, your way. All in{" "}
            <span className="text-dq-orange">one place.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-white/70">
            Continue on DWS.01 and experience a workspace designed around how
            you actually work — every day.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/onboarding")}
              className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-dq-orange px-7 text-sm font-semibold text-white transition hover:bg-[#e04020] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
              style={{ boxShadow: "var(--glow-orange-md)" }}
            >
              Get Started
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/workspace")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
            >
              Open Workspace
              <Headphones size={14} />
            </button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center lg:text-left">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-dq-navy lg:mx-0">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-semibold text-dq-navy">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
