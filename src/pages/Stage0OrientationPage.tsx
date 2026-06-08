import React from "react";
import { useViewingMode } from "../context/ViewingModeContext";
import { HomeHero } from "../components/stage0-home/HomeHero";
import { SetupJourneyPanel } from "../components/stage0-home/SetupJourneyPanel";
import { DWSOperatingRhythm } from "../components/stage0-home/DWSOperatingRhythm";
import { MarketplaceIntroCards } from "../components/stage0-home/MarketplaceIntroCards";
import { TodaysBriefPanel } from "../components/stage0-home/TodaysBriefPanel";
import { TodaysPrioritiesPanel } from "../components/stage0-home/TodaysPrioritiesPanel";
import { WorkOverviewBento } from "../components/stage0-home/WorkOverviewBento";
import { PlatformUpdatesPanel } from "../components/stage0-home/PlatformUpdatesPanel";
import { SupportRequestsPanel } from "../components/stage0-home/SupportRequestsPanel";

export function Stage0OrientationPage() {
  const { mode } = useViewingMode();
  const isNewJoiner = mode === "first-time";

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
        <HomeHero isNewJoiner={isNewJoiner} />

        {isNewJoiner ? (
          <>
            <SetupJourneyPanel />
            <DWSOperatingRhythm />
            <MarketplaceIntroCards />
          </>
        ) : (
          <>
            <TodaysBriefPanel />
            <TodaysPrioritiesPanel />
            <WorkOverviewBento />
          </>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PlatformUpdatesPanel />
          <SupportRequestsPanel isNewJoiner={isNewJoiner} />
        </div>
      </div>
    </div>
  );
}
