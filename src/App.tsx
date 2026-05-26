import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation } from
'react-router-dom';
import { Toaster } from 'sonner';
import { PersonaProvider, usePersona } from './context/PersonaContext';
import { ViewingModeProvider } from './context/ViewingModeContext';
import { WorkspaceRoleProvider } from './context/WorkspaceRoleContext';
import { useWorkspaceRole } from './context/WorkspaceRoleContext';
import { navigationItems, getNavigationItem } from './config/navigation';
import { hasAnyPermission } from './config/permissions';
import { PortalLayout } from './layouts/PortalLayout';
import { AppLayout } from './layouts/AppLayout';
import { Stage02Layout } from './layouts/Stage02Layout';
import { PlaceholderPage } from './components/PlaceholderPage';
import { Stage0OrientationPage } from './pages/Stage0OrientationPage';
import { OperatingGuidePage } from './pages/OperatingGuidePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ServicesMarketplacePage } from './pages/ServicesMarketplacePage';
import { TaskTemplatesMarketplacePage } from './pages/TaskTemplatesMarketplacePage';
import { KnowledgeMarketplacePage } from './pages/KnowledgeMarketplacePage';
import { WorkDirectoryMarketplacePage } from './pages/WorkDirectoryMarketplacePage';
import { AnalyticsMarketplacePage } from './pages/AnalyticsMarketplacePage';
import { MarketplaceFeedbackPage } from './pages/MarketplaceFeedbackPage';
import { MyWorkPage } from './pages/MyWorkPage';
import { MyTasksPage } from './pages/MyTasksPage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { AgileExecutionPage } from './pages/AgileExecutionPage';
import { TeamExecutionPage } from './pages/TeamExecutionPage';
import { UnitVisibilityPage } from './pages/UnitVisibilityPage';
import { HraWorkflowPage } from './pages/HraWorkflowPage';
import { SupportOperationsPage } from './pages/SupportOperationsPage';
import { AdminConsolePage } from './pages/AdminConsolePage';
import { WorkflowCentrePage } from './pages/WorkflowCentrePage';
import { SlaDashboardPage } from './pages/SlaDashboardPage';
import { ExecutiveEnterprisePage } from './pages/ExecutiveEnterprisePage';
import { AuditLogPage } from './pages/AuditLogPage';
import { MyUpdatesPage } from './pages/MyUpdatesPage';
import { MyBlockersPage } from './pages/MyBlockersPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { KnowledgeContextPage } from './pages/KnowledgeContextPage';
import { AssignedWorkPage } from './pages/AssignedWorkPage';
import { RequestStatusPage } from './pages/RequestStatusPage';
import { EvidenceQueuePage } from './pages/EvidenceQueuePage';
import { ClosureRequestsPage } from './pages/ClosureRequestsPage';
import { MissingUpdatesPage } from './pages/MissingUpdatesPage';
import { BlockerReviewPage } from './pages/BlockerReviewPage';
import { TaskHygieneReviewPage } from './pages/TaskHygieneReviewPage';
import { ClosureQualityRisksPage } from './pages/ClosureQualityRisksPage';
import { WorkingSessionsPage } from './pages/WorkingSessionsPage';
import { ReminderPromptsPage } from './pages/ReminderPromptsPage';
import { EscalationsPage } from './pages/EscalationsPage';
import { DecisionLogPage } from './pages/DecisionLogPage';
import { TeamTasksPage } from './pages/TeamTasksPage';
import { WorkloadBoardPage } from './pages/WorkloadBoardPage';
import { AssignTaskPage } from './pages/AssignTaskPage';
import { BlockedOverduePage } from './pages/BlockedOverduePage';
import { PendingApprovalsPage } from './pages/PendingApprovalsPage';
import { ClosureQualityPage } from './pages/ClosureQualityPage';
import { TeamPerformancePage } from './pages/TeamPerformancePage';
import { SessionBoardPage } from './pages/SessionBoardPage';
import { SessionActionsPage } from './pages/SessionActionsPage';
import { SessionDecisionsPage } from './pages/SessionDecisionsPage';
import { UnitWorkloadPage } from './pages/UnitWorkloadPage';
import { DeliveryHealthPage } from './pages/DeliveryHealthPage';
import { SlaTrendsPage } from './pages/SlaTrendsPage';
import { GovernanceRisksPage } from './pages/GovernanceRisksPage';
import { OutcomeProgressPage } from './pages/OutcomeProgressPage';
import { UnitPerformancePage } from './pages/UnitPerformancePage';
import { UnitApprovalsPage } from './pages/UnitApprovalsPage';
import { GovernanceDashboardPage } from './pages/GovernanceDashboardPage';
import { OperatingDisciplineUnitPage } from './pages/OperatingDisciplineUnitPage';
import { HraRequestsPage } from './pages/HraRequestsPage';
import { NewJoinerOnboardingPage } from './pages/NewJoinerOnboardingPage';
import { RoleTransitionPage } from './pages/RoleTransitionPage';
import { WorkforceReadinessPage } from './pages/WorkforceReadinessPage';
import { PolicyChecksPage } from './pages/PolicyChecksPage';
import { EmployeeReadinessRequestsPage } from './pages/EmployeeReadinessRequestsPage';
import { HraApprovalsPage } from './pages/HraApprovalsPage';
import { HraFulfilmentQueuePage } from './pages/HraFulfilmentQueuePage';
import { HraGuidesPage } from './pages/HraGuidesPage';
import { OnboardingPlaybooksPage } from './pages/OnboardingPlaybooksPage';
import { PolicyReferencesPage } from './pages/PolicyReferencesPage';
import { UsersRolesPage } from './pages/UsersRolesPage';
import { OrgSetupPage } from './pages/OrgSetupPage';
import { TaskModelConfigPage } from './pages/TaskModelConfigPage';
import { RequestCategoriesPage } from './pages/RequestCategoriesPage';
import { WorkflowRulesPage } from './pages/WorkflowRulesPage';
import { SlaNotificationsPage } from './pages/SlaNotificationsPage';
import { KnowledgeTaxonomyPage } from './pages/KnowledgeTaxonomyPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { AiAutomationPage } from './pages/AiAutomationPage';
import { ChangeGovernancePage } from './pages/ChangeGovernancePage';
import { ConfigReviewPage } from './pages/ConfigReviewPage';
import { PermissionExceptionsPage } from './pages/PermissionExceptionsPage';
import { CentralSupportQueuePage } from './pages/CentralSupportQueuePage';
import { TriageNeededPage } from './pages/TriageNeededPage';
import { MissingInputRequestsPage } from './pages/MissingInputRequestsPage';
import { RoutedRequestsPage } from './pages/RoutedRequestsPage';
import { SlaRiskQueuePage } from './pages/SlaRiskQueuePage';
import { ClosureQueuePage } from './pages/ClosureQueuePage';
import { KnowledgeAssistancePage } from './pages/KnowledgeAssistancePage';
import { FulfilmentOwnerQueuesPage } from './pages/FulfilmentOwnerQueuesPage';
import { SupportRequestStatusPage } from './pages/SupportRequestStatusPage';
import { SupportDashboardPage } from './pages/SupportDashboardPage';
import { StrategicInitiativesPage } from './pages/StrategicInitiativesPage';
import { GovernanceHealthPage } from './pages/GovernanceHealthPage';
import { SlaExposurePage } from './pages/SlaExposurePage';
import { EnterprisePerformancePage } from './pages/EnterprisePerformancePage';
import { TeamUnitPerformancePage } from './pages/TeamUnitPerformancePage';
import { OutcomeTrackingPage } from './pages/OutcomeTrackingPage';
import { ValueDeliveryPage } from './pages/ValueDeliveryPage';
import { CriticalEscalationsPage } from './pages/CriticalEscalationsPage';
import { ExecutiveOperatingDisciplinePage } from './pages/ExecutiveOperatingDisciplinePage';
import { ExecutiveDecisionLogPage } from './pages/ExecutiveDecisionLogPage';
import { ObjectiveLinkedTasksPage } from './pages/ObjectiveLinkedTasksPage';
import { TaskStructureReviewPage } from './pages/TaskStructureReviewPage';
import { TaskAttributeLibraryPage } from './pages/TaskAttributeLibraryPage';
import { TaskSectionBuilderPage } from './pages/TaskSectionBuilderPage';
import { TaskPermissionRulesPage } from './pages/TaskPermissionRulesPage';
import { TaskTemplateGovernancePage } from './pages/TaskTemplateGovernancePage';
import { StrategyLinkedTasksPage } from './pages/StrategyLinkedTasksPage';
import { Stage02WorkspacePage } from './pages/Stage02WorkspacePage';
import { Stage02SectionPage } from './pages/Stage02SectionPage';
import { Stage02PerformancePage } from './pages/Stage02PerformancePage';
import { DwsSectionPage } from './pages/DwsSectionPage';
import { AccessRestrictedPage } from './pages/AccessRestrictedPage';
import { WorkspaceMyRequestsPage, WorkspaceMyWorkPage, WorkspaceNotificationsPage, WorkspaceWorkingSessionsPage } from './pages/WorkspaceSectionPages';
import { TasksAllPage, TasksBlockedPage, TasksClosureQualityPage, TasksCreatePage, TasksEvidencePage, TasksMyTasksPage, TasksReviewPage, TasksTemplatesPage } from './pages/TasksSectionPages';
// A wrapper to handle route guards
function RouteGuard({ children }: {children: React.ReactNode;}) {
  const { activePersona, hasRouteAccess } = usePersona();
  const location = useLocation();
  if (!hasRouteAccess(location.pathname, activePersona)) {
    return (
      <div className="p-8">
        <PlaceholderPage
          title="This view is outside the active persona scope"
          description="Switch persona or return to Stage 0 to choose a permitted route."
          phase="Prototype Shell" />
        
      </div>);

  }
  return <>{children}</>;
}

function DwsRouteGuard({ route, children }: { route: string; children: React.ReactNode }) {
  const { activeRole } = useWorkspaceRole();
  const navItem = getNavigationItem(route);
  if (navItem && (!navItem.allowedSegments.includes(activeRole) || !hasAnyPermission(activeRole, navItem.requiredPermissions))) {
    return <AccessRestrictedPage />;
  }
  return <>{children}</>;
}

function renderDwsRoute(route: string) {
  if (route === '/workspace/my-work') return <WorkspaceMyWorkPage />;
  if (route === '/workspace/my-requests') return <WorkspaceMyRequestsPage />;
  if (route === '/workspace/working-sessions') return <WorkspaceWorkingSessionsPage />;
  if (route === '/workspace/notifications') return <WorkspaceNotificationsPage />;
  if (route === '/tasks/my-tasks') return <TasksMyTasksPage />;
  if (route === '/tasks/all') return <TasksAllPage />;
  if (route === '/tasks/create') return <TasksCreatePage />;
  if (route === '/tasks/templates') return <TasksTemplatesPage />;
  if (route === '/tasks/review') return <TasksReviewPage />;
  if (route === '/tasks/blocked') return <TasksBlockedPage />;
  if (route === '/tasks/closure-quality') return <TasksClosureQualityPage />;
  if (route === '/tasks/evidence') return <TasksEvidencePage />;
  if (route === '/performance/overview') return <Stage02PerformancePage section="overview" />;
  if (route === '/performance/goals') return <Stage02PerformancePage section="goals" />;
  if (route === '/performance/evaluation') return <Stage02PerformancePage section="evaluation" />;
  if (route === '/performance/feedback') return <Stage02PerformancePage section="feedback" />;
  if (route === '/performance/learning-progress') return <Stage02PerformancePage section="learning" />;
  if (route === '/performance/contribution-history') return <Stage02PerformancePage section="contribution-history" />;
  if (route === '/performance/role') return <Stage02PerformancePage section="role-performance" />;
  return <DwsSectionPage route={route} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/stage-0/orientation" replace />} />
      

      {/* Portal Layout Routes */}
      <Route element={<PortalLayout />}>
        <Route
          path="/stage-0/orientation"
          element={
          <RouteGuard>
              <Stage0OrientationPage />
            </RouteGuard>
          } />
        
        <Route
          path="/stage-0/operating-guide"
          element={
          <RouteGuard>
              <OperatingGuidePage />
            </RouteGuard>
          } />
        
        <Route
          path="/onboarding"
          element={
          <RouteGuard>
              <OnboardingPage />
            </RouteGuard>
          } />
        
        <Route
          path="/marketplaces/services"
          element={
          <RouteGuard>
              <ServicesMarketplacePage />
            </RouteGuard>
          } />
        
        <Route
          path="/marketplaces/task-templates"
          element={
          <RouteGuard>
              <TaskTemplatesMarketplacePage />
            </RouteGuard>
          } />
        
        <Route
          path="/marketplaces/knowledge"
          element={
          <RouteGuard>
              <KnowledgeMarketplacePage />
            </RouteGuard>
          } />
        
        <Route
          path="/marketplaces/work-directory"
          element={
          <RouteGuard>
              <WorkDirectoryMarketplacePage />
            </RouteGuard>
          } />
        
        <Route
          path="/marketplaces/analytics"
          element={<AnalyticsMarketplacePage />} />
        
        <Route
          path="/marketplaces/feedback"
          element={
          <RouteGuard>
              <MarketplaceFeedbackPage />
            </RouteGuard>
          } />
        
      </Route>

      {/* Stage 02 Workspace Routes */}
      <Route element={<Stage02Layout />}>
        <Route path="/workspace" element={<Stage02WorkspacePage />} />
        <Route path="/stage02/workspace" element={<Navigate to="/workspace" replace />} />
        <Route path="/stage02/tasks" element={<Stage02SectionPage section="tasks" />} />
        <Route path="/stage02/workflows" element={<Stage02SectionPage section="workflows" />} />
        <Route path="/stage02/trackers" element={<Stage02SectionPage section="trackers" />} />
        <Route path="/stage02/performance" element={<Navigate to="/performance/overview" replace />} />
        <Route path="/stage02/performance/overview" element={<Navigate to="/performance/overview" replace />} />
        <Route path="/stage02/performance/goals" element={<Navigate to="/performance/goals" replace />} />
        <Route path="/stage02/performance/evaluation" element={<Navigate to="/performance/evaluation" replace />} />
        <Route path="/stage02/performance/feedback" element={<Navigate to="/performance/feedback" replace />} />
        <Route path="/stage02/performance/learning" element={<Navigate to="/performance/learning-progress" replace />} />
        <Route path="/stage02/performance/contribution-history" element={<Navigate to="/performance/contribution-history" replace />} />
        <Route path="/stage02/performance/role-performance" element={<Navigate to="/performance/role" replace />} />
        <Route path="/stage02/governance" element={<Stage02SectionPage section="governance" />} />
        <Route path="/stage02/knowledge" element={<Stage02SectionPage section="knowledge" />} />
        <Route path="/stage02/people" element={<Stage02SectionPage section="people" />} />
        <Route path="/stage02/reports" element={<Stage02SectionPage section="reports" />} />
        {navigationItems.map((item) => (
          <Route
            key={item.id}
            path={item.route}
            element={
              <DwsRouteGuard route={item.route}>
                {renderDwsRoute(item.route)}
              </DwsRouteGuard>
            }
          />
        ))}
      </Route>

      {/* App Layout Routes */}
      <Route element={<AppLayout />}>
        <Route
          path="/workspace/my-work"
          element={
          <RouteGuard>
              <MyWorkPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/my-tasks"
          element={
          <RouteGuard>
              <MyTasksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/my-requests"
          element={
          <RouteGuard>
              <MyRequestsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/my-updates"
          element={
          <RouteGuard>
              <MyUpdatesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/my-blockers"
          element={
          <RouteGuard>
              <MyBlockersPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/notifications"
          element={
          <RouteGuard>
              <NotificationsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/knowledge-context"
          element={
          <RouteGuard>
              <KnowledgeContextPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/assigned-work"
          element={
          <RouteGuard>
              <AssignedWorkPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/request-status"
          element={
          <RouteGuard>
              <RequestStatusPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/evidence-queue"
          element={
          <RouteGuard>
              <EvidenceQueuePage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/closure-requests"
          element={
          <RouteGuard>
              <ClosureRequestsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workspace/objective-linked-tasks"
          element={
          <RouteGuard>
              <ObjectiveLinkedTasksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/agile/agile-execution"
          element={
          <RouteGuard>
              <AgileExecutionPage />
            </RouteGuard>
          } />
        
        <Route
          path="/agile/missing-updates"
          element={
          <RouteGuard>
              <MissingUpdatesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/agile/blocker-review"
          element={
          <RouteGuard>
              <BlockerReviewPage />
            </RouteGuard>
          } />
        
        <Route
          path="/agile/task-hygiene"
          element={
          <RouteGuard>
              <TaskHygieneReviewPage />
            </RouteGuard>
          } />
        
        <Route
          path="/agile/closure-risks"
          element={
          <RouteGuard>
              <ClosureQualityRisksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/agile/working-sessions"
          element={
          <RouteGuard>
              <WorkingSessionsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/agile/reminders"
          element={
          <RouteGuard>
              <ReminderPromptsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/agile/objective-task-review"
          element={
          <RouteGuard>
              <ObjectiveLinkedTasksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/agile/task-structure-gaps"
          element={
          <RouteGuard>
              <TaskStructureReviewPage />
            </RouteGuard>
          } />
        
        <Route
          path="/workflow/escalations"
          element={
          <RouteGuard>
              <EscalationsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/execution/decision-log"
          element={
          <RouteGuard>
              <DecisionLogPage />
            </RouteGuard>
          } />
        
        <Route
          path="/operations/team-execution"
          element={
          <RouteGuard>
              <TeamExecutionPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/tasks"
          element={
          <RouteGuard>
              <TeamTasksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/workload"
          element={
          <RouteGuard>
              <WorkloadBoardPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/assign-task"
          element={
          <RouteGuard>
              <AssignTaskPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/blocked-overdue"
          element={
          <RouteGuard>
              <BlockedOverduePage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/approvals"
          element={
          <RouteGuard>
              <PendingApprovalsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/closure-quality"
          element={
          <RouteGuard>
              <ClosureQualityPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/performance"
          element={
          <RouteGuard>
              <TeamPerformancePage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/sessions"
          element={
          <RouteGuard>
              <SessionBoardPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/session-actions"
          element={
          <RouteGuard>
              <SessionActionsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/session-decisions"
          element={
          <RouteGuard>
              <SessionDecisionsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/objective-linked-tasks"
          element={
          <RouteGuard>
              <ObjectiveLinkedTasksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/task-structure-review"
          element={
          <RouteGuard>
              <TaskStructureReviewPage />
            </RouteGuard>
          } />
        
        <Route
          path="/team/task-templates"
          element={
          <RouteGuard>
              <TaskTemplateGovernancePage />
            </RouteGuard>
          } />
        
        <Route
          path="/operations/unit-visibility"
          element={
          <RouteGuard>
              <UnitVisibilityPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/workload"
          element={
          <RouteGuard>
              <UnitWorkloadPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/delivery-health"
          element={
          <RouteGuard>
              <DeliveryHealthPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/sla-trends"
          element={
          <RouteGuard>
              <SlaTrendsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/governance-risks"
          element={
          <RouteGuard>
              <GovernanceRisksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/outcome-progress"
          element={
          <RouteGuard>
              <OutcomeProgressPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/performance"
          element={
          <RouteGuard>
              <UnitPerformancePage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/approvals"
          element={
          <RouteGuard>
              <UnitApprovalsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/governance-dashboard"
          element={
          <RouteGuard>
              <GovernanceDashboardPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/operating-discipline"
          element={
          <RouteGuard>
              <OperatingDisciplineUnitPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/strategy-linked-tasks"
          element={
          <RouteGuard>
              <ObjectiveLinkedTasksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/unit/task-governance-health"
          element={
          <RouteGuard>
              <TaskStructureReviewPage />
            </RouteGuard>
          } />
        
        <Route
          path="/operations/hra-workflow"
          element={
          <RouteGuard>
              <HraWorkflowPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/requests"
          element={
          <RouteGuard>
              <HraRequestsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/new-joiner"
          element={
          <RouteGuard>
              <NewJoinerOnboardingPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/role-transition"
          element={
          <RouteGuard>
              <RoleTransitionPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/workforce-readiness"
          element={
          <RouteGuard>
              <WorkforceReadinessPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/policy-checks"
          element={
          <RouteGuard>
              <PolicyChecksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/readiness-requests"
          element={
          <RouteGuard>
              <EmployeeReadinessRequestsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/approvals"
          element={
          <RouteGuard>
              <HraApprovalsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/fulfilment-queue"
          element={
          <RouteGuard>
              <HraFulfilmentQueuePage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/guides"
          element={
          <RouteGuard>
              <HraGuidesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/playbooks"
          element={
          <RouteGuard>
              <OnboardingPlaybooksPage />
            </RouteGuard>
          } />
        
        <Route
          path="/hra/policy-references"
          element={
          <RouteGuard>
              <PolicyReferencesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/operations"
          element={
          <RouteGuard>
              <SupportOperationsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/console"
          element={
          <RouteGuard>
              <AdminConsolePage />
            </RouteGuard>
          } />
        
        <Route
          path="/execution/workflow"
          element={
          <RouteGuard>
              <WorkflowCentrePage />
            </RouteGuard>
          } />
        
        <Route
          path="/intelligence/sla"
          element={
          <RouteGuard>
              <SlaDashboardPage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/enterprise-execution"
          element={
          <RouteGuard>
              <ExecutiveEnterprisePage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/audit-log"
          element={
          <RouteGuard>
              <AuditLogPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/users-roles"
          element={
          <RouteGuard>
              <UsersRolesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/org-setup"
          element={
          <RouteGuard>
              <OrgSetupPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/task-model"
          element={
          <RouteGuard>
              <TaskModelConfigPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/task-attributes"
          element={
          <RouteGuard>
              <TaskAttributeLibraryPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/task-sections"
          element={
          <RouteGuard>
              <TaskSectionBuilderPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/task-permissions"
          element={
          <RouteGuard>
              <TaskPermissionRulesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/task-templates"
          element={
          <RouteGuard>
              <TaskTemplateGovernancePage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/request-categories"
          element={
          <RouteGuard>
              <RequestCategoriesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/workflow-rules"
          element={
          <RouteGuard>
              <WorkflowRulesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/sla-notifications"
          element={
          <RouteGuard>
              <SlaNotificationsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/knowledge-taxonomy"
          element={
          <RouteGuard>
              <KnowledgeTaxonomyPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/integrations"
          element={
          <RouteGuard>
              <IntegrationsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/ai-automation"
          element={
          <RouteGuard>
              <AiAutomationPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/change-governance"
          element={
          <RouteGuard>
              <ChangeGovernancePage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/config-review"
          element={
          <RouteGuard>
              <ConfigReviewPage />
            </RouteGuard>
          } />
        
        <Route
          path="/admin/permission-exceptions"
          element={
          <RouteGuard>
              <PermissionExceptionsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/central-queue"
          element={
          <RouteGuard>
              <CentralSupportQueuePage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/triage"
          element={
          <RouteGuard>
              <TriageNeededPage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/missing-input"
          element={
          <RouteGuard>
              <MissingInputRequestsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/routed"
          element={
          <RouteGuard>
              <RoutedRequestsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/sla-risk"
          element={
          <RouteGuard>
              <SlaRiskQueuePage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/closure-queue"
          element={
          <RouteGuard>
              <ClosureQueuePage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/knowledge-assistance"
          element={
          <RouteGuard>
              <KnowledgeAssistancePage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/fulfilment-queues"
          element={
          <RouteGuard>
              <FulfilmentOwnerQueuesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/request-status"
          element={
          <RouteGuard>
              <SupportRequestStatusPage />
            </RouteGuard>
          } />
        
        <Route
          path="/support/dashboard"
          element={
          <RouteGuard>
              <SupportDashboardPage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/strategic-initiatives"
          element={
          <RouteGuard>
              <StrategicInitiativesPage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/governance-health"
          element={
          <RouteGuard>
              <GovernanceHealthPage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/sla-exposure"
          element={
          <RouteGuard>
              <SlaExposurePage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/enterprise-performance"
          element={
          <RouteGuard>
              <EnterprisePerformancePage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/team-unit-performance"
          element={
          <RouteGuard>
              <TeamUnitPerformancePage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/outcome-tracking"
          element={
          <RouteGuard>
              <OutcomeTrackingPage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/value-delivery"
          element={
          <RouteGuard>
              <ValueDeliveryPage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/critical-escalations"
          element={
          <RouteGuard>
              <CriticalEscalationsPage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/operating-discipline"
          element={
          <RouteGuard>
              <ExecutiveOperatingDisciplinePage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/decision-log"
          element={
          <RouteGuard>
              <ExecutiveDecisionLogPage />
            </RouteGuard>
          } />
        
        <Route
          path="/executive/strategy-linked-tasks"
          element={
          <RouteGuard>
              <StrategyLinkedTasksPage />
            </RouteGuard>
          } />
        

        {/* Catch-all for unbuilt routes */}
        <Route
          path="*"
          element={
          <RouteGuard>
              <PlaceholderPage
              title="Route Not Found"
              description="This route is either a placeholder or does not exist." />
            
            </RouteGuard>
          } />
        
      </Route>
    </Routes>);

}
export function App() {
  return (
    <BrowserRouter>
      <PersonaProvider>
        <WorkspaceRoleProvider>
          <ViewingModeProvider>
            <AppRoutes />
            <Toaster position="top-right" richColors />
          </ViewingModeProvider>
        </WorkspaceRoleProvider>
      </PersonaProvider>
    </BrowserRouter>);

}
