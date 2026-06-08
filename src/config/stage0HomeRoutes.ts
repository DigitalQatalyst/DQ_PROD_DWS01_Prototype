export const stage0HomeRoutes = {
  workspaceSetup: '/stage-0/action/workspace-setup',
  accessTools: '/stage-0/action/access-tools',
  firstChecklist: '/stage-0/action/first-action-checklist',
  startServiceRequest: '/stage-0/action/start-service-request',
  platformSupport: '/stage-0/action/platform-support',
  hraOnboarding: '/stage-0/action/hra-onboarding',
  resumeRequest: '/stage-0/action/resume-request',
  pendingReviews: '/stage-0/action/pending-reviews',
  todaysBrief: '/stage-0/action/todays-brief',
  riskWatch: '/stage-0/action/risk-watch',
  platformUpdates: '/stage-0/platform-updates'
} as const;

export function stage0PlatformUpdateRoute(updateId: string) {
  return `${stage0HomeRoutes.platformUpdates}/${updateId}`;
}

export function stage0WorkspaceRouteForPersona(personaId: string) {
  if (personaId === 'scrum-master') return '/agile/agile-execution';
  if (personaId === 'team-lead') return '/operations/team-execution';
  if (personaId === 'unit-lead') return '/operations/unit-visibility';
  if (personaId === 'hra') return '/operations/hra-workflow';
  if (personaId === 'admin') return '/admin/console';
  if (personaId === 'support') return '/support/operations';
  if (personaId === 'ceo') return '/executive/enterprise-execution';
  return '/workspace/my-work';
}
