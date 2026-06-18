import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { useViewingMode } from "../context/ViewingModeContext";
import { useWorkspaceRole } from "../context/WorkspaceRoleContext";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingCtaSection } from "../components/landing/LandingCtaSection";
import { HomeHero } from "../components/stage0-home/HomeHero";
import { HomeSection } from "../components/stage0-home/HomeSection";
import { SetupJourneyPanel } from "../components/stage0-home/SetupJourneyPanel";
import { DWSOperatingRhythm } from "../components/stage0-home/DWSOperatingRhythm";
import { MarketplaceIntroCards } from "../components/stage0-home/MarketplaceIntroCards";
import { TodaysBriefPanel } from "../components/stage0-home/TodaysBriefPanel";
import { TodaysPrioritiesPanel } from "../components/stage0-home/TodaysPrioritiesPanel";
import { WorkOverviewBento } from "../components/stage0-home/WorkOverviewBento";
import { PlatformUpdatesPanel } from "../components/stage0-home/PlatformUpdatesPanel";
import { SupportRequestsPanel } from "../components/stage0-home/SupportRequestsPanel";

function getFirstName(displayName: string) {
  return displayName.trim().split(/\s+/)[0] || "there";
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function ReturningHomeView() {
  const navigate = useNavigate();
  const { activeSegment } = useWorkspaceRole();
  const firstName = getFirstName(activeSegment.profileName);
  const greeting = getTimeGreeting();

  return (
    <div className="w-full bg-white">
      <LandingHero
        eyebrow="Your workspace today"
        title={
          <>
            {greeting}, {firstName}.{" "}
            <span className="text-dq-orange">Keep priorities moving.</span>
          </>
        }
        subtitle="Review priority actions, resolve risks early, and continue the work that moves DQ forward."
        showTrustItems={false}
        primaryCta={{
          label: "Open Workspace",
          onClick: () => navigate("/workspace"),
        }}
        secondaryCta={{
          label: "My Dashboard",
          onClick: () => navigate("/dashboard"),
          icon: <LayoutDashboard size={14} />,
        }}
      />

      <HomeSection eyebrow="Daily brief" title="Start with what matters most.">
        <TodaysBriefPanel />
      </HomeSection>

      <HomeSection variant="surface" eyebrow="Action queue" title="Today's priorities.">
        <TodaysPrioritiesPanel />
      </HomeSection>

      <HomeSection eyebrow="Work overview" title="Your active work at a glance.">
        <WorkOverviewBento />
      </HomeSection>

      <HomeSection variant="surface" eyebrow="Stay connected" title="Updates and support.">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PlatformUpdatesPanel />
          <SupportRequestsPanel isNewJoiner={false} />
        </div>
      </HomeSection>

      <LandingCtaSection
        title={
          <>
            Ready to dive in? Your workspace is{" "}
            <span className="text-dq-orange">waiting.</span>
          </>
        }
        subtitle="Pick up where you left off, resolve today's priorities, and keep execution moving across your governed workspace."
        primaryCta={{
          label: "Open Workspace",
          onClick: () => navigate("/workspace"),
        }}
        secondaryCta={{
          label: "My Dashboard",
          onClick: () => navigate("/dashboard"),
          icon: <LayoutDashboard size={14} />,
        }}
        showFooterFeatures={false}
      />
    </div>
  );
}

function NewJoinerSetupView() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
        <HomeHero isNewJoiner />

        <SetupJourneyPanel />
        <DWSOperatingRhythm />
        <MarketplaceIntroCards />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PlatformUpdatesPanel />
          <SupportRequestsPanel isNewJoiner />
        </div>
      </div>
    </div>
  );
}

export function Stage0OrientationPage() {
  const { mode } = useViewingMode();
  const isNewJoiner = mode === "first-time";

  if (!isNewJoiner) {
    return <ReturningHomeView />;
  }

  return <NewJoinerSetupView />;
}
