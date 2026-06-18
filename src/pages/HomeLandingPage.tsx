import React from "react";
import { useViewingMode } from "../context/ViewingModeContext";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingFeaturesSection } from "../components/landing/LandingFeaturesSection";
import { LandingHowItWorks } from "../components/landing/LandingHowItWorks";
import { LandingCtaSection } from "../components/landing/LandingCtaSection";
import { Stage0OrientationPage } from "./Stage0OrientationPage";

export function HomeLandingPage() {
  const { mode } = useViewingMode();
  const isNewJoiner = mode === "first-time";

  if (!isNewJoiner) {
    return <Stage0OrientationPage />;
  }

  return (
    <div className="w-full bg-white">
      <LandingHero />
      <LandingFeaturesSection />
      <LandingHowItWorks />
      <LandingCtaSection />
    </div>
  );
}
