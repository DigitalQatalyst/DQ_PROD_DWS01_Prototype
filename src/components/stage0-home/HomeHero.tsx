import React from 'react';
import { AIDiscoverySearch } from './AIDiscoverySearch';
import { useWorkspaceRole } from '../../context/WorkspaceRoleContext';

function getFirstName(displayName: string) {
  return displayName.trim().split(/\s+/)[0] || 'there';
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

interface HomeHeroProps {
  isNewJoiner: boolean;
}

export function HomeHero({ isNewJoiner }: HomeHeroProps) {
  const { activeSegment } = useWorkspaceRole();
  const firstName = getFirstName(activeSegment.profileName);
  const greeting = getTimeGreeting();

  const headline = isNewJoiner
    ? `${greeting}, ${firstName}. Start your DWS.01 journey with clarity.`
    : `${greeting}, ${firstName}. Keep today's priorities moving.`;

  const subtext = isNewJoiner
    ? 'Set up your workspace, understand how work runs, and complete the first actions needed to begin execution.'
    : 'Review priority actions, resolve risks early, and continue the work that moves DQ forward.';

  return (
    <section className="relative rounded-2xl border border-border-subtle bg-gradient-to-br from-white via-white to-navy-50 px-6 py-10 shadow-sm sm:px-10 lg:px-14 lg:py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="pointer-events-none absolute -right-20 -top-16 h-[320px] w-[520px] rounded-[50%] opacity-70 [background:repeating-radial-gradient(ellipse_at_center,rgba(181,197,247,0.28)_0,rgba(181,197,247,0.28)_1px,transparent_1px,transparent_18px)]" />
      </div>
      <div className="relative max-w-[860px]">
        <h1 className="max-w-[760px] text-[28px] font-bold leading-[1.12] text-primary sm:text-[36px] lg:text-[40px]">
          {headline}
        </h1>
        <p className="mt-4 max-w-[620px] text-sm leading-7 text-text-muted sm:text-base">{subtext}</p>
      </div>
      <div className="relative z-20 mt-7 max-w-[820px]">
        <AIDiscoverySearch isNewJoiner={isNewJoiner} />
      </div>
    </section>
  );
}
