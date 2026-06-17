import { getFlagValue } from './filterNavigationByFlags';

const routeFeatureMap = [
  { prefix: '/tasks/all', flag: 'tasks.enabled' },
  { prefix: '/tasks/create', flag: 'tasks.enabled' },
  { prefix: '/tasks/templates', flag: 'tasks.enabled' },
  { prefix: '/tasks/review', flag: 'tasks.enabled' },
  { prefix: '/tasks/blocked', flag: 'tasks.enabled' },
  { prefix: '/tasks/closure-quality', flag: 'tasks.enabled' },
  { prefix: '/tasks/evidence', flag: 'tasks.enabled' },
  { prefix: '/tasks/my-tasks', flag: 'tasks.enabled' },
  { prefix: '/tasks/task-board', flag: 'tasks.enabled' },
  { prefix: '/tasks/task-creation-templates', flag: 'tasks.enabled' },
  { prefix: '/tasks/task-updates-evidence', flag: 'tasks.enabled' },
  { prefix: '/tasks/closure-reviews', flag: 'tasks.enabled' },
  { prefix: '/stage02/tasks', flag: 'tasks.enabled' },
  { prefix: '/workflows', flag: 'workflows.enabled' },
  { prefix: '/workflow', flag: 'workflows.enabled' },
  { prefix: '/stage02/workflows', flag: 'workflows.enabled' },
  { prefix: '/performance', flag: 'performance.enabled' },
  { prefix: '/stage02/performance', flag: 'performance.enabled' },
  { prefix: '/governance', flag: 'governance.enabled' },
  { prefix: '/stage02/governance', flag: 'governance.enabled' },
  { prefix: '/analytics', flag: 'advancedAnalyticsWorkspace.enabled' },
  { prefix: '/stage02/reports', flag: 'advancedAnalyticsWorkspace.enabled' },
  { prefix: '/tracker/execution', flag: 'trackers.trackerExecutionLifecycleSidebar' },
  { prefix: '/tracker/request-status-tracker', flag: 'trackers.trackerExecutionLifecycleSidebar' },
  { prefix: '/tracker/action-follow-up-tracker', flag: 'trackers.trackerExecutionLifecycleSidebar' },
  { prefix: '/tracker/blocker-sla-tracker', flag: 'trackers.trackerExecutionLifecycleSidebar' },
  { prefix: '/tracker/decision-outcome-tracker', flag: 'trackers.trackerExecutionLifecycleSidebar' },
  { prefix: '/trackers/my-items', flag: 'trackers.trackerExecutionLifecycleSidebar' },
  { prefix: '/trackers/governance-actions', flag: 'trackers.trackerExecutionLifecycleSidebar' },
  { prefix: '/trackers/strategic-initiatives', flag: 'trackers.trackerExecutionLifecycleSidebar' },
  { prefix: '/trackers/workload-distribution', flag: 'trackers.trackerExecutionLifecycleSidebar' },
  { prefix: '/administration', flag: 'platformAdmin.advancedConfiguration' },
  { prefix: '/authentication', flag: 'authentication.showInSidebar' },
  { prefix: '/database', flag: 'database.showInSidebar' },
] as const;

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isFeatureRouteEnabled(pathname: string): boolean {
  const routeFeature = routeFeatureMap.find(({ prefix }) =>
    matchesPrefix(pathname, prefix)
  );

  return routeFeature ? getFlagValue(routeFeature.flag) : true;
}
