import React from "react";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingFeaturesSection } from "../components/landing/LandingFeaturesSection";
import { LandingHowItWorks } from "../components/landing/LandingHowItWorks";
import { LandingCtaSection } from "../components/landing/LandingCtaSection";

export function HomeLandingPage() {
  return (
    <div className="w-full bg-white">
      <LandingHero />
      <LandingFeaturesSection />
      <LandingHowItWorks />
      <LandingCtaSection />
    </div>
  );
}
