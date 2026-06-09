import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { PersonaProvider, usePersona } from "./context/PersonaContext";
import { ViewingModeProvider } from "./context/ViewingModeContext";
import { WorkspaceRoleProvider } from "./context/WorkspaceRoleContext";
import { useWorkspaceRole } from "./context/WorkspaceRoleContext";
import { ServiceLifecycleProvider } from "./context/ServiceLifecycleContext";
import { TaskLifecycleProvider } from "./context/TaskLifecycleContext";
import { KnowledgeLifecycleProvider } from "./context/KnowledgeLifecycleContext";
import { navigationItems, getNavigationItem } from "./config/navigation";
import { hasAnyPermission } from "./config/permissions";

import { AppLayout } from "./layouts/AppLayout";
import { Stage02Layout } from "./layouts/Stage02Layout";
import { Stage0ShellLayout } from "./layouts/Stage0ShellLayout";
import { MarketplaceLayout } from "./layouts/MarketplaceLayout";
import { PlaceholderPage } from "./components/PlaceholderPage";
import {
  FeatureAreaRoute,
  FeatureGroupRoute,
  FeatureWorkspaceRoute,
} from "./components/FeatureAreaPages";
import { featureAreas } from "./data/featureAreas";
import { Stage0OrientationPage } from "./pages/Stage0OrientationPage";
import { OperatingGuidePage } from "./pages/OperatingGuidePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { Stage0ActionPage } from "./pages/Stage0ActionPage";
import { Stage0PlatformUpdatesPage } from "./pages/Stage0PlatformUpdatesPage";

// New Knowledge Pages
import { KnowledgeDetailPage } from "./pages/KnowledgeDetailPage";
import { KnowledgeReferencePage } from "./pages/KnowledgeReferencePage";
import { KnowledgeStartTaskPage } from "./pages/KnowledgeStartTaskPage";
import { KnowledgeReviewQueuePage } from "./pages/KnowledgeReviewQueuePage";
import { ExecutiveKnowledgeSignalPage } from "./pages/ExecutiveKnowledgeSignalPage";

// New Task Pages
import { TaskTemplateDetailPage } from "./pages/TaskTemplateDetailPage";
import { TaskCreationWorkflowPage } from "./pages/TaskCreationWorkflowPage";
import { TaskDetailStatusPage } from "./pages/TaskDetailStatusPage";
import { TaskReviewQueuePage } from "./pages/TaskReviewQueuePage";
import { TaskClosureQualityPage } from "./pages/TaskClosureQualityPage";
import { ExecutiveTaskSignalPage } from "./pages/ExecutiveTaskSignalPage";
import { ServicesMarketplacePage } from "./pages/ServicesMarketplacePage";
import { TaskTemplatesMarketplacePage } from "./pages/TaskTemplatesMarketplacePage";
import { KnowledgeMarketplacePage } from "./pages/KnowledgeMarketplacePage";
import { WorkDirectoryMarketplacePage } from "./pages/WorkDirectoryMarketplacePage";
import { AnalyticsMarketplacePage } from "./pages/AnalyticsMarketplacePage";
import { MarketplaceFeedbackPage } from "./pages/MarketplaceFeedbackPage";
import { D4MarketplaceLandingPage } from "./pages/D4MarketplaceLandingPage";
import { MyTasksPage } from "./pages/MyTasksPage";
import { MyRequestsPage } from "./pages/MyRequestsPage";
import { AgileExecutionPage } from "./pages/AgileExecutionPage";
import { TeamExecutionPage } from "./pages/TeamExecutionPage";
import { UnitVisibilityPage } from "./pages/UnitVisibilityPage";
import { HraWorkflowPage } from "./pages/HraWorkflowPage";
import { SupportOperationsPage } from "./pages/SupportOperationsPage";
import { AdminConsolePage } from "./pages/AdminConsolePage";
import { WorkflowCentrePage } from "./pages/WorkflowCentrePage";
import { SlaDashboardPage } from "./pages/SlaDashboardPage";
import { ExecutiveEnterprisePage } from "./pages/ExecutiveEnterprisePage";
import { AuditLogPage } from "./pages/AuditLogPage";
import { MyUpdatesPage } from "./pages/MyUpdatesPage";
import { MyBlockersPage } from "./pages/MyBlockersPage";
import { KnowledgeContextPage } from "./pages/KnowledgeContextPage";
import { AssignedWorkPage } from "./pages/AssignedWorkPage";
import { RequestStatusPage } from "./pages/RequestStatusPage";
import { EvidenceQueuePage } from "./pages/EvidenceQueuePage";
import { ClosureRequestsPage } from "./pages/ClosureRequestsPage";
import { MissingUpdatesPage } from "./pages/MissingUpdatesPage";
import { BlockerReviewPage } from "./pages/BlockerReviewPage";
import { TaskHygieneReviewPage } from "./pages/TaskHygieneReviewPage";
import { ClosureQualityRisksPage } from "./pages/ClosureQualityRisksPage";
import { WorkingSessionsPage } from "./pages/WorkingSessionsPage";
import { ReminderPromptsPage } from "./pages/ReminderPromptsPage";
import { EscalationsPage } from "./pages/EscalationsPage";
import { DecisionLogPage } from "./pages/DecisionLogPage";
import { TeamTasksPage } from "./pages/TeamTasksPage";
import { WorkloadBoardPage } from "./pages/WorkloadBoardPage";
import { AssignTaskPage } from "./pages/AssignTaskPage";
import { BlockedOverduePage } from "./pages/BlockedOverduePage";
import { PendingApprovalsPage } from "./pages/PendingApprovalsPage";
import { ClosureQualityPage } from "./pages/ClosureQualityPage";
import { TeamPerformancePage } from "./pages/TeamPerformancePage";
import { SessionBoardPage } from "./pages/SessionBoardPage";
import { SessionActionsPage } from "./pages/SessionActionsPage";
import { SessionDecisionsPage } from "./pages/SessionDecisionsPage";
import { UnitWorkloadPage } from "./pages/UnitWorkloadPage";
import { DeliveryHealthPage } from "./pages/DeliveryHealthPage";
import { SlaTrendsPage } from "./pages/SlaTrendsPage";
import { GovernanceRisksPage } from "./pages/GovernanceRisksPage";
import { OutcomeProgressPage } from "./pages/OutcomeProgressPage";
import { UnitPerformancePage } from "./pages/UnitPerformancePage";
import { UnitApprovalsPage } from "./pages/UnitApprovalsPage";
import { GovernanceDashboardPage } from "./pages/GovernanceDashboardPage";
import { OperatingDisciplineUnitPage } from "./pages/OperatingDisciplineUnitPage";
import { HraRequestsPage } from "./pages/HraRequestsPage";
import { NewJoinerOnboardingPage } from "./pages/NewJoinerOnboardingPage";
import { RoleTransitionPage } from "./pages/RoleTransitionPage";
import { WorkforceReadinessPage } from "./pages/WorkforceReadinessPage";
import { PolicyChecksPage } from "./pages/PolicyChecksPage";
import { EmployeeReadinessRequestsPage } from "./pages/EmployeeReadinessRequestsPage";
import { HraApprovalsPage } from "./pages/HraApprovalsPage";
import { HraFulfilmentQueuePage } from "./pages/HraFulfilmentQueuePage";
import { HraGuidesPage } from "./pages/HraGuidesPage";
import { OnboardingPlaybooksPage } from "./pages/OnboardingPlaybooksPage";
import { PolicyReferencesPage } from "./pages/PolicyReferencesPage";
import { UsersRolesPage } from "./pages/UsersRolesPage";
import { OrgSetupPage } from "./pages/OrgSetupPage";
import { TaskModelConfigPage } from "./pages/TaskModelConfigPage";
import { RequestCategoriesPage } from "./pages/RequestCategoriesPage";
import { WorkflowRulesPage } from "./pages/WorkflowRulesPage";
import { SlaNotificationsPage } from "./pages/SlaNotificationsPage";
import { KnowledgeTaxonomyPage } from "./pages/KnowledgeTaxonomyPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { AiAutomationPage } from "./pages/AiAutomationPage";
import { ChangeGovernancePage } from "./pages/ChangeGovernancePage";
import { ConfigReviewPage } from "./pages/ConfigReviewPage";
import { PermissionExceptionsPage } from "./pages/PermissionExceptionsPage";
import { CentralSupportQueuePage } from "./pages/CentralSupportQueuePage";
import { TriageNeededPage } from "./pages/TriageNeededPage";
import { MissingInputRequestsPage } from "./pages/MissingInputRequestsPage";
import { RoutedRequestsPage } from "./pages/RoutedRequestsPage";
import { SlaRiskQueuePage } from "./pages/SlaRiskQueuePage";
import { ClosureQueuePage } from "./pages/ClosureQueuePage";
import { KnowledgeAssistancePage } from "./pages/KnowledgeAssistancePage";
import { FulfilmentOwnerQueuesPage } from "./pages/FulfilmentOwnerQueuesPage";
import { SupportRequestStatusPage } from "./pages/SupportRequestStatusPage";
import { SupportDashboardPage } from "./pages/SupportDashboardPage";
import { StrategicInitiativesPage } from "./pages/StrategicInitiativesPage";
import { GovernanceHealthPage } from "./pages/GovernanceHealthPage";
import { SlaExposurePage } from "./pages/SlaExposurePage";
import { EnterprisePerformancePage } from "./pages/EnterprisePerformancePage";
import { TeamUnitPerformancePage } from "./pages/TeamUnitPerformancePage";
import { OutcomeTrackingPage } from "./pages/OutcomeTrackingPage";
import { ValueDeliveryPage } from "./pages/ValueDeliveryPage";
import { CriticalEscalationsPage } from "./pages/CriticalEscalationsPage";
import { ExecutiveOperatingDisciplinePage } from "./pages/ExecutiveOperatingDisciplinePage";
import { ExecutiveDecisionLogPage } from "./pages/ExecutiveDecisionLogPage";
import { ObjectiveLinkedTasksPage } from "./pages/ObjectiveLinkedTasksPage";
import { TaskStructureReviewPage } from "./pages/TaskStructureReviewPage";
import { TaskAttributeLibraryPage } from "./pages/TaskAttributeLibraryPage";
import { TaskSectionBuilderPage } from "./pages/TaskSectionBuilderPage";
import { TaskPermissionRulesPage } from "./pages/TaskPermissionRulesPage";
import { TaskTemplateGovernancePage } from "./pages/TaskTemplateGovernancePage";
import { StrategyLinkedTasksPage } from "./pages/StrategyLinkedTasksPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { RequestWorkflowPage } from "./pages/RequestWorkflowPage";
import { ServiceOwnerQueuePage } from "./pages/ServiceOwnerQueuePage";
import { ApproverQueuePage } from "./pages/ApproverQueuePage";
import { ExecutiveSignalPage } from "./pages/ExecutiveSignalPage";
import { Stage02WorkspacePage } from "./pages/Stage02WorkspacePage";
import { Stage02SectionPage } from "./pages/Stage02SectionPage";
import { Stage02PerformancePage } from "./pages/Stage02PerformancePage";
import { DwsSectionPage } from "./pages/DwsSectionPage";
import { AiCockpitPage } from "./pages/AiCockpitPage";
import { AccessRestrictedPage } from "./pages/AccessRestrictedPage";
import {
  WorkspaceActivityPage,
  WorkspaceMyRequestsPage,
  WorkspaceMyWorkPage,
  WorkspaceWorkingSessionsPage,
} from "./pages/WorkspaceSectionPages";
import {
  TasksAllPage,
  TasksBlockedPage,
  TasksClosureQualityPage,
  TasksCreatePage,
  TasksEvidencePage,
  TasksMyTasksPage,
  TasksReviewPage,
  TasksTemplatesPage,
} from "./pages/TasksSectionPages";

// Task Feature Area Pages (purpose-built per DWS.01 BRS)
import {
  AssignedTasksPage,
  MyDueActionsPage,
  MyTaskUpdatesPage,
  MyTaskBlockersPage,
  MyWorkingSessionsPage,
} from "./pages/tasks/MyWorkPages";
import {
  KanbanViewPage,
  ListViewPage,
  CalendarViewPage,
  PriorityViewPage,
  TeamTaskViewPage,
} from "./pages/tasks/TaskBoardPages";
import {
  CreateTaskPage,
  SelectTaskTemplatePage,
  DefinePurposeOutputPage,
  AssignOwnerContributorsPage,
  SetSlaDueDatePage,
} from "./pages/tasks/TaskCreationPages";
import {
  ProgressUpdatePage,
  EvidenceUploadPage,
  CommentThreadPage,
  BlockerUpdatePage,
  TaskHistoryTimelinePage,
} from "./pages/tasks/TaskUpdatesPages";
import {
  RequestClosureReviewPage,
  ClosureChecklistPage,
  EvidenceReviewPage,
  ReturnForReworkPage,
  CloseTaskPage,
} from "./pages/tasks/ClosureReviewPages";

// Tracker Feature Area Pages (purpose-built with distinct layouts per page)
import {
  MyTrackerOverviewPage,
  TeamTrackerOverviewPage,
  OpenItemsPage,
  AtRiskItemsPage,
  RecentlyClosedItemsPage,
  SubmittedRequestsPage,
  RequestDraftsPage,
  RequestStatusPage as TrackerRequestStatusPage,
  PendingInformationPage,
  RequestClosureStatusPage,
  WorkingSessionActionsPage,
  MeetingFollowupsPage,
  AssignedFollowupsPage,
  OverdueFollowupsPage,
  CompletedFollowupsPage,
  ActiveBlockersPage,
  BlockerAgeingPage,
  SlaAtRiskPage,
  SlaBreachedPage,
  SlaResolvedPage,
  DecisionLogPage as TrackerDecisionLogPage,
  DecisionStatusPage,
  LinkedTasksRequestsPage,
  OutcomeProgressPage as TrackerOutcomeProgressPage,
  OutcomeEvidencePage,
} from "./pages/tracker";

// A wrapper to handle route guards
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { activePersona, hasRouteAccess } = usePersona();
  const location = useLocation();
  if (!hasRouteAccess(location.pathname, activePersona)) {
    return (
      <div className="p-8">
        <PlaceholderPage
          title="This view is outside the active persona scope"
          description="Switch role or return to Home to choose a permitted route."
          phase="Prototype Shell"
        />
      </div>
    );
  }
  return <>{children}</>;
}

function DwsRouteGuard({
  route,
  children,
}: {
  route: string;
  children: React.ReactNode;
}) {
  const { activeRole } = useWorkspaceRole();
  const navItem = getNavigationItem(route);
  if (
    navItem &&
    (!navItem.allowedSegments.includes(activeRole) ||
      !hasAnyPermission(activeRole, navItem.requiredPermissions))
  ) {
    return <AccessRestrictedPage />;
  }
  return <>{children}</>;
}

function renderTaskFeaturePage(route: string): React.ReactNode | null {
  const taskFeatureMap: Record<string, React.ReactNode> = {
    "/tasks/my-work/assigned-tasks": <AssignedTasksPage />,
    "/tasks/my-work/my-due-actions": <MyDueActionsPage />,
    "/tasks/my-work/my-updates": <MyTaskUpdatesPage />,
    "/tasks/my-work/my-blockers": <MyTaskBlockersPage />,
    "/tasks/my-work/my-working-sessions": <MyWorkingSessionsPage />,
    "/tasks/task-board/kanban-view": <KanbanViewPage />,
    "/tasks/task-board/list-view": <ListViewPage />,
    "/tasks/task-board/calendar-view": <CalendarViewPage />,
    "/tasks/task-board/priority-view": <PriorityViewPage />,
    "/tasks/task-board/team-task-view": <TeamTaskViewPage />,
    "/tasks/task-creation-templates/create-task": <CreateTaskPage />,
    "/tasks/task-creation-templates/select-task-template": (
      <SelectTaskTemplatePage />
    ),
    "/tasks/task-creation-templates/define-purpose-output": (
      <DefinePurposeOutputPage />
    ),
    "/tasks/task-creation-templates/assign-owner-contributors": (
      <AssignOwnerContributorsPage />
    ),
    "/tasks/task-creation-templates/set-sla-due-date": <SetSlaDueDatePage />,
    "/tasks/task-updates-evidence/progress-update": <ProgressUpdatePage />,
    "/tasks/task-updates-evidence/evidence-upload-link": <EvidenceUploadPage />,
    "/tasks/task-updates-evidence/comment-thread": <CommentThreadPage />,
    "/tasks/task-updates-evidence/blocker-update": <BlockerUpdatePage />,
    "/tasks/task-updates-evidence/task-history-timeline": (
      <TaskHistoryTimelinePage />
    ),
    "/tasks/closure-reviews/request-closure-review": (
      <RequestClosureReviewPage />
    ),
    "/tasks/closure-reviews/closure-checklist": <ClosureChecklistPage />,
    "/tasks/closure-reviews/evidence-review": <EvidenceReviewPage />,
    "/tasks/closure-reviews/return-for-rework": <ReturnForReworkPage />,
    "/tasks/closure-reviews/close-task": <CloseTaskPage />,
  };
  return taskFeatureMap[route] || null;
}

function renderTrackerFeaturePage(route: string): React.ReactNode | null {
  const trackerFeatureMap: Record<string, React.ReactNode> = {
    // Tracker Hub
    "/tracker/tracker-hub/my-tracker-overview": <MyTrackerOverviewPage />,
    "/tracker/tracker-hub/team-tracker-overview": <TeamTrackerOverviewPage />,
    "/tracker/tracker-hub/open-items": <OpenItemsPage />,
    "/tracker/tracker-hub/at-risk-items": <AtRiskItemsPage />,
    "/tracker/tracker-hub/recently-closed-items": <RecentlyClosedItemsPage />,
    // Request Status Tracker
    "/tracker/request-status-tracker/submitted-requests": (
      <SubmittedRequestsPage />
    ),
    "/tracker/request-status-tracker/request-drafts": <RequestDraftsPage />,
    "/tracker/request-status-tracker/request-status": (
      <TrackerRequestStatusPage />
    ),
    "/tracker/request-status-tracker/pending-information": (
      <PendingInformationPage />
    ),
    "/tracker/request-status-tracker/request-closure-status": (
      <RequestClosureStatusPage />
    ),
    // Action & Follow-up Tracker
    "/tracker/action-follow-up-tracker/working-session-actions": (
      <WorkingSessionActionsPage />
    ),
    "/tracker/action-follow-up-tracker/meeting-follow-ups": (
      <MeetingFollowupsPage />
    ),
    "/tracker/action-follow-up-tracker/assigned-follow-ups": (
      <AssignedFollowupsPage />
    ),
    "/tracker/action-follow-up-tracker/overdue-follow-ups": (
      <OverdueFollowupsPage />
    ),
    "/tracker/action-follow-up-tracker/completed-follow-ups": (
      <CompletedFollowupsPage />
    ),
    // Blocker & SLA Tracker
    "/tracker/blocker-sla-tracker/active-blockers": <ActiveBlockersPage />,
    "/tracker/blocker-sla-tracker/blocker-ageing": <BlockerAgeingPage />,
    "/tracker/blocker-sla-tracker/sla-at-risk": <SlaAtRiskPage />,
    "/tracker/blocker-sla-tracker/sla-breached": <SlaBreachedPage />,
    "/tracker/blocker-sla-tracker/sla-resolved": <SlaResolvedPage />,
    // Decision & Outcome Tracker
    "/tracker/decision-outcome-tracker/decision-log": (
      <TrackerDecisionLogPage />
    ),
    "/tracker/decision-outcome-tracker/decision-status": <DecisionStatusPage />,
    "/tracker/decision-outcome-tracker/linked-tasks-requests": (
      <LinkedTasksRequestsPage />
    ),
    "/tracker/decision-outcome-tracker/outcome-progress": (
      <TrackerOutcomeProgressPage />
    ),
    "/tracker/decision-outcome-tracker/outcome-evidence": (
      <OutcomeEvidencePage />
    ),
  };
  return trackerFeatureMap[route] || null;
}

function renderDwsRoute(route: string) {
  if (route === "/workspace") return <WorkspaceMyWorkPage />;
  if (route === "/workspace/my-tasks") return <TasksMyTasksPage />;
  if (route === "/workspace/my-requests") return <WorkspaceMyRequestsPage />;
  if (route === "/workspace/working-sessions")
    return <WorkspaceWorkingSessionsPage />;
  if (route === "/workspace/activity") return <WorkspaceActivityPage />;
  if (route === "/requests/status") return <WorkspaceMyRequestsPage />;
  if (route === "/support/service-desk") return <SupportOperationsPage />;
  if (route === "/tasks/my-tasks") return <TasksMyTasksPage />;
  if (route === "/tasks/all") return <TasksAllPage />;
  if (route === "/tasks/create") return <TasksCreatePage />;
  if (route === "/tasks/templates") return <TasksTemplatesPage />;
  if (route === "/tasks/review") return <TasksReviewPage />;
  if (route === "/tasks/blocked") return <TasksBlockedPage />;
  if (route === "/tasks/closure-quality") return <TasksClosureQualityPage />;
  if (route === "/tasks/evidence") return <TasksEvidencePage />;
  if (route === "/performance/overview")
    return <Stage02PerformancePage section="overview" />;
  if (route === "/performance/goals")
    return <Stage02PerformancePage section="goals" />;
  if (route === "/performance/evaluation")
    return <Stage02PerformancePage section="evaluation" />;
  if (route === "/performance/feedback")
    return <Stage02PerformancePage section="feedback" />;
  if (route === "/performance/learning-progress")
    return <Stage02PerformancePage section="learning" />;
  if (route === "/performance/contribution-history")
    return <Stage02PerformancePage section="contribution-history" />;
  if (route === "/performance/role")
    return <Stage02PerformancePage section="role-performance" />;
  if (route === "/support/operations") return <SupportOperationsPage />;
  if (route === "/reports/sla-dashboard") return <SlaDashboardPage />;
  if (route === "/reports/team-unit-performance")
    return <TeamUnitPerformancePage />;
  if (route === "/platform-admin") return <AdminConsolePage />;
  if (route === "/service-owner/requests") return <ServiceOwnerQueuePage />;
  if (route === "/workflow/approvals") return <ApproverQueuePage />;
  if (route === "/intelligence/service-signals") return <ExecutiveSignalPage />;
  return <DwsSectionPage route={route} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Full Page Routes (No Layout) */}
      <Route
        path="/knowledge/:knowledgeId/reference"
        element={
          <RouteGuard>
            <KnowledgeReferencePage />
          </RouteGuard>
        }
      />
      <Route
        path="/tasks/create/:templateId"
        element={
          <RouteGuard>
            <TaskCreationWorkflowPage />
          </RouteGuard>
        }
      />
      <Route
        path="/tasks/create/from-knowledge/:knowledgeId"
        element={
          <RouteGuard>
            <KnowledgeStartTaskPage />
          </RouteGuard>
        }
      />

      {/* Stage 0 Orientation Shell Routes */}
      <Route element={<Stage0ShellLayout />}>
        <Route
          path="/stage-0/orientation"
          element={<Navigate to="/home" replace />}
        />

        <Route
          path="/stage-0/operating-guide"
          element={
            <RouteGuard>
              <OperatingGuidePage />
            </RouteGuard>
          }
        />

        <Route
          path="/onboarding"
          element={
            <RouteGuard>
              <OnboardingPage />
            </RouteGuard>
          }
        />
        <Route
          path="/stage-0/action/:actionId"
          element={
            <RouteGuard>
              <Stage0ActionPage />
            </RouteGuard>
          }
        />
        <Route
          path="/stage-0/platform-updates"
          element={
            <RouteGuard>
              <Stage0PlatformUpdatesPage />
            </RouteGuard>
          }
        />
        <Route
          path="/stage-0/platform-updates/:updateId"
          element={
            <RouteGuard>
              <Stage0PlatformUpdatesPage />
            </RouteGuard>
          }
        />
      </Route>

      {/* Marketplace Layout Routes */}
      <Route element={<MarketplaceLayout />}>
        <Route
          path="/requests/start/:serviceId"
          element={
            <RouteGuard>
              <RequestWorkflowPage />
            </RouteGuard>
          }
        />
        <Route
          path="/marketplace"
          element={
            <RouteGuard>
              <D4MarketplaceLandingPage />
            </RouteGuard>
          }
        />
        <Route
          path="/marketplaces"
          element={<Navigate to="/marketplace" replace />}
        />
        <Route
          path="/marketplaces/discern"
          element={<Navigate to="/marketplace/discern" replace />}
        />
        <Route
          path="/marketplaces/design"
          element={<Navigate to="/marketplace/design" replace />}
        />
        <Route
          path="/marketplaces/deploy"
          element={<Navigate to="/marketplace/deploy" replace />}
        />
        <Route
          path="/marketplaces/drive"
          element={<Navigate to="/marketplace/drive" replace />}
        />
        <Route
          path="/marketplace/deliver"
          element={<Navigate to="/marketplace/deploy" replace />}
        />
        <Route
          path="/marketplaces/deliver"
          element={<Navigate to="/marketplace/deploy" replace />}
        />
        <Route
          path="/marketplaces/feedback"
          element={<Navigate to="/marketplace/feedback" replace />}
        />
        <Route
          path="/marketplaces/services"
          element={<Navigate to="/marketplace/services" replace />}
        />
        <Route
          path="/marketplaces/services/:serviceId"
          element={
            <RouteGuard>
              <ServiceDetailPage />
            </RouteGuard>
          }
        />
        <Route
          path="/marketplace/knowledge"
          element={<Navigate to="/marketplace/knowledge-discovery" replace />}
        />
        <Route
          path="/marketplaces/knowledge"
          element={<Navigate to="/marketplace/knowledge-discovery" replace />}
        />
        <Route
          path="/marketplaces/knowledge/:knowledgeId"
          element={
            <RouteGuard>
              <KnowledgeDetailPage />
            </RouteGuard>
          }
        />
        <Route
          path="/marketplace/task-templates"
          element={<Navigate to="/marketplace/task-library" replace />}
        />
        <Route
          path="/marketplaces/task-templates"
          element={<Navigate to="/marketplace/task-library" replace />}
        />
        <Route
          path="/marketplaces/task-templates/:templateId"
          element={
            <RouteGuard>
              <TaskTemplateDetailPage />
            </RouteGuard>
          }
        />
        <Route
          path="/marketplaces/work-directory"
          element={<Navigate to="/marketplace/work-directory" replace />}
        />
        <Route
          path="/marketplace/analytics"
          element={<Navigate to="/marketplace/analytics-discovery" replace />}
        />
        <Route
          path="/marketplaces/analytics"
          element={<Navigate to="/marketplace/analytics-discovery" replace />}
        />

        <Route
          path="/marketplace/discern"
          element={
            <RouteGuard>
              <D4MarketplaceLandingPage />
            </RouteGuard>
          }
        />
        <Route
          path="/marketplace/design"
          element={
            <RouteGuard>
              <D4MarketplaceLandingPage />
            </RouteGuard>
          }
        />
        <Route
          path="/marketplace/deploy"
          element={
            <RouteGuard>
              <D4MarketplaceLandingPage />
            </RouteGuard>
          }
        />
        <Route
          path="/marketplace/drive"
          element={
            <RouteGuard>
              <D4MarketplaceLandingPage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplace/services"
          element={
            <RouteGuard>
              <ServicesMarketplacePage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplace/services/:serviceId"
          element={
            <RouteGuard>
              <ServiceDetailPage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplace/task-library"
          element={
            <RouteGuard>
              <TaskTemplatesMarketplacePage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplace/task-library/:templateId"
          element={
            <RouteGuard>
              <TaskTemplateDetailPage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplaces/task-review"
          element={
            <RouteGuard>
              <TaskReviewQueuePage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplaces/task-closure-quality"
          element={
            <RouteGuard>
              <TaskClosureQualityPage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplaces/task-signals"
          element={
            <RouteGuard>
              <ExecutiveTaskSignalPage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplace/knowledge-discovery"
          element={
            <RouteGuard>
              <KnowledgeMarketplacePage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplace/knowledge-discovery/:knowledgeId"
          element={
            <RouteGuard>
              <KnowledgeDetailPage />
            </RouteGuard>
          }
        />

        <Route
          path="/knowledge/review"
          element={
            <RouteGuard>
              <KnowledgeReviewQueuePage />
            </RouteGuard>
          }
        />

        {/* Legacy redirect */}
        <Route
          path="/marketplaces/knowledge-review"
          element={<Navigate to="/knowledge/review" replace />}
        />

        <Route
          path="/intelligence/knowledge-signals"
          element={
            <RouteGuard>
              <ExecutiveKnowledgeSignalPage />
            </RouteGuard>
          }
        />

        {/* Legacy redirect */}
        <Route
          path="/marketplaces/knowledge-signals"
          element={<Navigate to="/intelligence/knowledge-signals" replace />}
        />

        <Route
          path="/marketplace/work-directory"
          element={
            <RouteGuard>
              <WorkDirectoryMarketplacePage />
            </RouteGuard>
          }
        />

        <Route
          path="/marketplace/analytics-discovery"
          element={<AnalyticsMarketplacePage />}
        />

        <Route
          path="/marketplace/feedback"
          element={
            <RouteGuard>
              <MarketplaceFeedbackPage />
            </RouteGuard>
          }
        />

        <Route
          path="/requests/:requestId/status"
          element={
            <RouteGuard>
              <RequestStatusPage />
            </RouteGuard>
          }
        />
      </Route>
      <Route
        path="/services/submit-request"
        element={<Navigate to="/marketplace/services" replace />}
      />
      <Route element={<Stage02Layout />}>
        <Route path="/home" element={<Stage0OrientationPage />} />
        <Route path="/dashboard" element={<Stage02WorkspacePage />} />
        <Route path="/ai-cockpit" element={<AiCockpitPage />} />
        <Route path="/help-support" element={<OperatingGuidePage />} />
        <Route path="/workspace" element={<WorkspaceMyWorkPage />} />
        <Route
          path="/stage02/workspace"
          element={<Navigate to="/workspace" replace />}
        />
        <Route
          path="/stage02/tasks"
          element={<Stage02SectionPage section="tasks" />}
        />
        <Route
          path="/stage02/workflows"
          element={<Stage02SectionPage section="workflows" />}
        />
        <Route
          path="/stage02/trackers"
          element={<Stage02SectionPage section="trackers" />}
        />
        {featureAreas.map((area) => (
          <React.Fragment key={area.id}>
            <Route
              path={area.route}
              element={
                <RouteGuard>
                  <FeatureAreaRoute areaId={area.id} />
                </RouteGuard>
              }
            />
            {area.featureGroups.map((group) => (
              <React.Fragment key={group.id}>
                <Route
                  path={group.route}
                  element={
                    <RouteGuard>
                      <FeatureGroupRoute areaId={area.id} groupId={group.id} />
                    </RouteGuard>
                  }
                />
                {group.features.map((feature) => {
                  const taskPage =
                    area.id === "tasks"
                      ? renderTaskFeaturePage(feature.route)
                      : null;
                  const trackerPage =
                    area.id === "tracker"
                      ? renderTrackerFeaturePage(feature.route)
                      : null;
                  return (
                    <Route
                      key={feature.id}
                      path={feature.route}
                      element={
                        <RouteGuard>
                          {taskPage || trackerPage || (
                            <FeatureWorkspaceRoute
                              areaId={area.id}
                              groupId={group.id}
                              featureId={feature.id}
                            />
                          )}
                        </RouteGuard>
                      }
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
        <Route
          path="/stage02/performance"
          element={<Navigate to="/performance/overview" replace />}
        />
        <Route
          path="/stage02/performance/overview"
          element={<Navigate to="/performance/overview" replace />}
        />
        <Route
          path="/stage02/performance/goals"
          element={<Navigate to="/performance/goals" replace />}
        />
        <Route
          path="/stage02/performance/evaluation"
          element={<Navigate to="/performance/evaluation" replace />}
        />
        <Route
          path="/stage02/performance/feedback"
          element={<Navigate to="/performance/feedback" replace />}
        />
        <Route
          path="/stage02/performance/learning"
          element={<Navigate to="/performance/learning-progress" replace />}
        />
        <Route
          path="/stage02/performance/contribution-history"
          element={<Navigate to="/performance/contribution-history" replace />}
        />
        <Route
          path="/stage02/performance/role-performance"
          element={<Navigate to="/performance/role" replace />}
        />
        <Route
          path="/stage02/governance"
          element={<Stage02SectionPage section="governance" />}
        />
        <Route
          path="/stage02/knowledge"
          element={<Stage02SectionPage section="knowledge" />}
        />
        <Route
          path="/stage02/people"
          element={<Stage02SectionPage section="people" />}
        />
        <Route
          path="/stage02/reports"
          element={<Stage02SectionPage section="reports" />}
        />
        <Route
          path="/workspace/my-work"
          element={<Navigate to="/workspace" replace />}
        />
        <Route
          path="/workspace/notifications"
          element={<Navigate to="/workspace/activity" replace />}
        />
        <Route
          path="/knowledge"
          element={<Navigate to="/marketplace/knowledge-discovery" replace />}
        />
        <Route
          path="/knowledge/ghc"
          element={<Navigate to="/marketplace/knowledge-discovery" replace />}
        />
        <Route
          path="/knowledge/6xd"
          element={<Navigate to="/marketplace/knowledge-discovery" replace />}
        />
        <Route
          path="/knowledge/references"
          element={<Navigate to="/marketplace/knowledge-discovery" replace />}
        />
        <Route
          path="/knowledge/playbooks-templates"
          element={<Navigate to="/marketplace/knowledge-discovery" replace />}
        />
        <Route
          path="/knowledge/learning-references"
          element={<Navigate to="/marketplace/knowledge-discovery" replace />}
        />
        <Route
          path="/knowledge/recommendations"
          element={<Navigate to="/marketplace/knowledge-discovery" replace />}
        />
        <Route
          path="/people/directory"
          element={<Navigate to="/marketplace/work-directory" replace />}
        />
        <Route
          path="/people/teams"
          element={<Navigate to="/marketplace/work-directory" replace />}
        />
        <Route
          path="/people/units"
          element={<Navigate to="/marketplace/work-directory" replace />}
        />
        <Route
          path="/people/owners-experts"
          element={<Navigate to="/marketplace/work-directory" replace />}
        />
        <Route
          path="/people/service-owners"
          element={<Navigate to="/marketplace/work-directory" replace />}
        />
        <Route
          path="/people/contact-points"
          element={<Navigate to="/marketplace/work-directory" replace />}
        />
        <Route
          path="/people/roles"
          element={<Navigate to="/marketplace/work-directory" replace />}
        />
        <Route
          path="/performance/team"
          element={<Navigate to="/reports/team-unit-performance" replace />}
        />
        <Route
          path="/performance/unit"
          element={<Navigate to="/reports/team-unit-performance" replace />}
        />
        <Route path="/trackers" element={<Navigate to="/tracker" replace />} />
        <Route
          path="/trackers/my-items"
          element={
            <Navigate to="/tracker/tracker-hub/my-tracker-overview" replace />
          }
        />
        <Route
          path="/trackers/governance-actions"
          element={
            <Navigate
              to="/tracker/decision-outcome-tracker/decision-log"
              replace
            />
          }
        />
        <Route
          path="/trackers/strategic-initiatives"
          element={
            <Navigate
              to="/tracker/decision-outcome-tracker/outcome-progress"
              replace
            />
          }
        />
        <Route
          path="/trackers/workload-distribution"
          element={
            <Navigate to="/tracker/tracker-hub/team-tracker-overview" replace />
          }
        />
        <Route
          path="/workflows/centre"
          element={<Navigate to="/workflows/workflow-centre" replace />}
        />
        <Route
          path="/workflows/my-workflows"
          element={
            <Navigate
              to="/workflows/workflow-centre/active-workflows"
              replace
            />
          }
        />
        <Route
          path="/workflows/pending-approvals"
          element={
            <Navigate
              to="/workflows/workflow-inbox/my-pending-actions"
              replace
            />
          }
        />
        <Route
          path="/workflows/sla-risks"
          element={
            <Navigate
              to="/workflows/workflow-routing-state-control/sla-timer-trigger"
              replace
            />
          }
        />
        <Route
          path="/workflow/approvals"
          element={
            <Navigate
              to="/workflows/workflow-inbox/my-pending-actions"
              replace
            />
          }
        />
        <Route
          path="/tasks/my-tasks"
          element={<Navigate to="/workspace/my-tasks" replace />}
        />
        <Route
          path="/tasks/all"
          element={
            <RouteGuard>
              <TasksAllPage />
            </RouteGuard>
          }
        />
        <Route
          path="/tasks/create"
          element={
            <RouteGuard>
              <TasksCreatePage />
            </RouteGuard>
          }
        />
        <Route
          path="/tasks/templates"
          element={
            <RouteGuard>
              <TasksTemplatesPage />
            </RouteGuard>
          }
        />
        <Route
          path="/tasks/review"
          element={
            <RouteGuard>
              <TasksReviewPage />
            </RouteGuard>
          }
        />
        <Route
          path="/tasks/blocked"
          element={
            <RouteGuard>
              <TasksBlockedPage />
            </RouteGuard>
          }
        />
        <Route
          path="/tasks/closure-quality"
          element={
            <RouteGuard>
              <TasksClosureQualityPage />
            </RouteGuard>
          }
        />
        <Route
          path="/tasks/evidence"
          element={
            <RouteGuard>
              <TasksEvidencePage />
            </RouteGuard>
          }
        />
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
          element={<Navigate to="/workspace" replace />}
        />

        <Route
          path="/workspace/my-tasks"
          element={
            <RouteGuard>
              <MyTasksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/workspace/my-requests"
          element={
            <RouteGuard>
              <MyRequestsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/workspace/my-updates"
          element={
            <RouteGuard>
              <MyUpdatesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/workspace/my-blockers"
          element={
            <RouteGuard>
              <MyBlockersPage />
            </RouteGuard>
          }
        />

        <Route
          path="/workspace/notifications"
          element={<Navigate to="/workspace/activity" replace />}
        />

        <Route
          path="/workspace/knowledge-context"
          element={
            <RouteGuard>
              <KnowledgeContextPage />
            </RouteGuard>
          }
        />

        <Route
          path="/workspace/assigned-work"
          element={
            <RouteGuard>
              <AssignedWorkPage />
            </RouteGuard>
          }
        />

        <Route
          path="/workspace/evidence-queue"
          element={
            <RouteGuard>
              <EvidenceQueuePage />
            </RouteGuard>
          }
        />

        <Route
          path="/workspace/closure-requests"
          element={
            <RouteGuard>
              <ClosureRequestsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/workspace/objective-linked-tasks"
          element={
            <RouteGuard>
              <ObjectiveLinkedTasksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/tasks/:taskId"
          element={
            <RouteGuard>
              <TaskDetailStatusPage />
            </RouteGuard>
          }
        />

        <Route
          path="/agile/agile-execution"
          element={
            <RouteGuard>
              <AgileExecutionPage />
            </RouteGuard>
          }
        />

        <Route
          path="/agile/missing-updates"
          element={
            <RouteGuard>
              <MissingUpdatesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/agile/blocker-review"
          element={
            <RouteGuard>
              <BlockerReviewPage />
            </RouteGuard>
          }
        />

        <Route
          path="/agile/task-hygiene"
          element={
            <RouteGuard>
              <TaskHygieneReviewPage />
            </RouteGuard>
          }
        />

        <Route
          path="/agile/closure-risks"
          element={
            <RouteGuard>
              <ClosureQualityRisksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/agile/working-sessions"
          element={
            <RouteGuard>
              <WorkingSessionsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/agile/reminders"
          element={
            <RouteGuard>
              <ReminderPromptsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/agile/objective-task-review"
          element={
            <RouteGuard>
              <ObjectiveLinkedTasksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/agile/task-structure-gaps"
          element={
            <RouteGuard>
              <TaskStructureReviewPage />
            </RouteGuard>
          }
        />

        <Route
          path="/workflow/escalations"
          element={
            <RouteGuard>
              <EscalationsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/execution/decision-log"
          element={
            <RouteGuard>
              <DecisionLogPage />
            </RouteGuard>
          }
        />

        <Route
          path="/operations/team-execution"
          element={
            <RouteGuard>
              <TeamExecutionPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/tasks"
          element={
            <RouteGuard>
              <TeamTasksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/workload"
          element={
            <RouteGuard>
              <WorkloadBoardPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/assign-task"
          element={
            <RouteGuard>
              <AssignTaskPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/blocked-overdue"
          element={
            <RouteGuard>
              <BlockedOverduePage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/approvals"
          element={
            <RouteGuard>
              <PendingApprovalsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/closure-quality"
          element={
            <RouteGuard>
              <ClosureQualityPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/performance"
          element={
            <RouteGuard>
              <TeamPerformancePage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/sessions"
          element={
            <RouteGuard>
              <SessionBoardPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/session-actions"
          element={
            <RouteGuard>
              <SessionActionsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/session-decisions"
          element={
            <RouteGuard>
              <SessionDecisionsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/objective-linked-tasks"
          element={
            <RouteGuard>
              <ObjectiveLinkedTasksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/task-structure-review"
          element={
            <RouteGuard>
              <TaskStructureReviewPage />
            </RouteGuard>
          }
        />

        <Route
          path="/team/task-templates"
          element={
            <RouteGuard>
              <TaskTemplateGovernancePage />
            </RouteGuard>
          }
        />

        <Route
          path="/operations/unit-visibility"
          element={
            <RouteGuard>
              <UnitVisibilityPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/workload"
          element={
            <RouteGuard>
              <UnitWorkloadPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/delivery-health"
          element={
            <RouteGuard>
              <DeliveryHealthPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/sla-trends"
          element={
            <RouteGuard>
              <SlaTrendsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/governance-risks"
          element={
            <RouteGuard>
              <GovernanceRisksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/outcome-progress"
          element={
            <RouteGuard>
              <OutcomeProgressPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/performance"
          element={
            <RouteGuard>
              <UnitPerformancePage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/approvals"
          element={
            <RouteGuard>
              <UnitApprovalsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/governance-dashboard"
          element={
            <RouteGuard>
              <GovernanceDashboardPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/operating-discipline"
          element={
            <RouteGuard>
              <OperatingDisciplineUnitPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/strategy-linked-tasks"
          element={
            <RouteGuard>
              <ObjectiveLinkedTasksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/unit/task-governance-health"
          element={
            <RouteGuard>
              <TaskStructureReviewPage />
            </RouteGuard>
          }
        />

        <Route
          path="/operations/hra-workflow"
          element={
            <RouteGuard>
              <HraWorkflowPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/requests"
          element={
            <RouteGuard>
              <HraRequestsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/new-joiner"
          element={
            <RouteGuard>
              <NewJoinerOnboardingPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/role-transition"
          element={
            <RouteGuard>
              <RoleTransitionPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/workforce-readiness"
          element={
            <RouteGuard>
              <WorkforceReadinessPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/policy-checks"
          element={
            <RouteGuard>
              <PolicyChecksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/readiness-requests"
          element={
            <RouteGuard>
              <EmployeeReadinessRequestsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/approvals"
          element={
            <RouteGuard>
              <HraApprovalsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/fulfilment-queue"
          element={
            <RouteGuard>
              <HraFulfilmentQueuePage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/guides"
          element={
            <RouteGuard>
              <HraGuidesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/playbooks"
          element={
            <RouteGuard>
              <OnboardingPlaybooksPage />
            </RouteGuard>
          }
        />

        <Route
          path="/hra/policy-references"
          element={
            <RouteGuard>
              <PolicyReferencesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/operations"
          element={
            <RouteGuard>
              <SupportOperationsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/console"
          element={
            <RouteGuard>
              <AdminConsolePage />
            </RouteGuard>
          }
        />

        <Route
          path="/execution/workflow"
          element={
            <RouteGuard>
              <WorkflowCentrePage />
            </RouteGuard>
          }
        />

        <Route
          path="/intelligence/sla"
          element={
            <RouteGuard>
              <SlaDashboardPage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/enterprise-execution"
          element={
            <RouteGuard>
              <ExecutiveEnterprisePage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/audit-log"
          element={
            <RouteGuard>
              <AuditLogPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/users-roles"
          element={
            <RouteGuard>
              <UsersRolesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/org-setup"
          element={
            <RouteGuard>
              <OrgSetupPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/task-model"
          element={
            <RouteGuard>
              <TaskModelConfigPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/task-attributes"
          element={
            <RouteGuard>
              <TaskAttributeLibraryPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/task-sections"
          element={
            <RouteGuard>
              <TaskSectionBuilderPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/task-permissions"
          element={
            <RouteGuard>
              <TaskPermissionRulesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/task-templates"
          element={
            <RouteGuard>
              <TaskTemplateGovernancePage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/request-categories"
          element={
            <RouteGuard>
              <RequestCategoriesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/workflow-rules"
          element={
            <RouteGuard>
              <WorkflowRulesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/sla-notifications"
          element={
            <RouteGuard>
              <SlaNotificationsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/knowledge-taxonomy"
          element={
            <RouteGuard>
              <KnowledgeTaxonomyPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/integrations"
          element={
            <RouteGuard>
              <IntegrationsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/ai-automation"
          element={
            <RouteGuard>
              <AiAutomationPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/change-governance"
          element={
            <RouteGuard>
              <ChangeGovernancePage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/config-review"
          element={
            <RouteGuard>
              <ConfigReviewPage />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/permission-exceptions"
          element={
            <RouteGuard>
              <PermissionExceptionsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/central-queue"
          element={
            <RouteGuard>
              <CentralSupportQueuePage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/triage"
          element={
            <RouteGuard>
              <TriageNeededPage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/missing-input"
          element={
            <RouteGuard>
              <MissingInputRequestsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/routed"
          element={
            <RouteGuard>
              <RoutedRequestsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/sla-risk"
          element={
            <RouteGuard>
              <SlaRiskQueuePage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/closure-queue"
          element={
            <RouteGuard>
              <ClosureQueuePage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/knowledge-assistance"
          element={
            <RouteGuard>
              <KnowledgeAssistancePage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/fulfilment-queues"
          element={
            <RouteGuard>
              <FulfilmentOwnerQueuesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/request-status"
          element={
            <RouteGuard>
              <SupportRequestStatusPage />
            </RouteGuard>
          }
        />

        <Route
          path="/support/dashboard"
          element={
            <RouteGuard>
              <SupportDashboardPage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/strategic-initiatives"
          element={
            <RouteGuard>
              <StrategicInitiativesPage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/governance-health"
          element={
            <RouteGuard>
              <GovernanceHealthPage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/sla-exposure"
          element={
            <RouteGuard>
              <SlaExposurePage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/enterprise-performance"
          element={
            <RouteGuard>
              <EnterprisePerformancePage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/team-unit-performance"
          element={
            <RouteGuard>
              <TeamUnitPerformancePage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/outcome-tracking"
          element={
            <RouteGuard>
              <OutcomeTrackingPage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/value-delivery"
          element={
            <RouteGuard>
              <ValueDeliveryPage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/critical-escalations"
          element={
            <RouteGuard>
              <CriticalEscalationsPage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/operating-discipline"
          element={
            <RouteGuard>
              <ExecutiveOperatingDisciplinePage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/decision-log"
          element={
            <RouteGuard>
              <ExecutiveDecisionLogPage />
            </RouteGuard>
          }
        />

        <Route
          path="/executive/strategy-linked-tasks"
          element={
            <RouteGuard>
              <StrategyLinkedTasksPage />
            </RouteGuard>
          }
        />

        {/* Service Lifecycle downstream routes (Prompt 5 & 6) */}
        <Route
          path="/service-owner/requests"
          element={
            <RouteGuard>
              <ServiceOwnerQueuePage />
            </RouteGuard>
          }
        />

        <Route
          path="/workflow/approvals"
          element={
            <RouteGuard>
              <ApproverQueuePage />
            </RouteGuard>
          }
        />

        <Route
          path="/intelligence/service-signals"
          element={
            <RouteGuard>
              <ExecutiveSignalPage />
            </RouteGuard>
          }
        />

        {/* Catch-all for unbuilt routes */}
        <Route
          path="*"
          element={
            <RouteGuard>
              <PlaceholderPage
                title="Route Not Found"
                description="This route is either a placeholder or does not exist."
              />
            </RouteGuard>
          }
        />
      </Route>
    </Routes>
  );
}
export function App() {
  return (
    <BrowserRouter>
      <PersonaProvider>
        <WorkspaceRoleProvider>
          <ViewingModeProvider>
            <ServiceLifecycleProvider>
              <TaskLifecycleProvider>
                <KnowledgeLifecycleProvider>
                  <AppRoutes />
                  <Toaster position="top-right" richColors />
                </KnowledgeLifecycleProvider>
              </TaskLifecycleProvider>
            </ServiceLifecycleProvider>
          </ViewingModeProvider>
        </WorkspaceRoleProvider>
      </PersonaProvider>
    </BrowserRouter>
  );
}
