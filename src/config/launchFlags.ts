export const launchFlags = {
  orientation: {
    enabled: true,
    gettingStarted: true,
    home: true,
    quickLinks: false,
    myDashboard: true,
    myWork: true,
    aiCockpit: true,
  },

  marketplace: {
    enabled: true,
    catalogue: true,
    discern: true,
    design: false,
    deploy: true,
    drive: false,

    serviceMarketplace: true,
    knowledgeGuidelinesMarketplace: true,
    trackerMarketplace: true,
    analyticsMarketplace: true,
    dqDnaMarketplace: true,
  },

  services: {
    enabled: true,

    serviceHub: true,
    serviceOverview: false,
    myRequests: true,
    pendingActions: true,

    requestQueues: true,
    centralSupportQueue: false,
    fulfilmentOwnerQueue: false,
    assignedRequests: true,
    pendingInformation: true,
    slaQueueView: false,
    closureReviewQueue: false,

    // Deprecated as sidebar groups. Keep false.
    requestCaseManagementSidebar: false,
    slaEscalationsSidebar: false,
    serviceClosureFeedbackSidebar: false,

    // These are page-level tabs/actions, not sidebar items.
    requestDetailsSidebar: false,
    triageAssignmentSidebar: false,
    requestUpdatesSidebar: false,
    commentsInternalNotesSidebar: false,
    attachmentsEvidenceSidebar: false,
    activityTimelineSidebar: false,
    slaAtRiskSidebar: false,
    slaBreachedSidebar: false,
    overdueRequestsSidebar: false,
    escalatedRequestsSidebar: false,
    reassignmentPriorityChangeSidebar: false,
    closureNotesSidebar: false,
    requestClosureReviewSidebar: false,
    serviceRatingSidebar: false,
    reopenRequestSidebar: false,
  },

  trackers: {
    enabled: false,

    trackerHub: true,
    myTrackerOverview: true,
    teamTrackerOverview: true,
    trackerInsights: true,

    // These are workspace routes/screens, not sidebar items.
    trackerExecutionLifecycleSidebar: false,
    activeTrackerWorkspaceSidebar: false,
    trackerRecordMaintenanceSidebar: false,
  },

  platformAdmin: {
    enabled: false,

    contentManagement: true,
    marketplaceContent: true,
    serviceContent: true,
    trackerContent: true,
    analyticsContent: true,

    advancedConfiguration: false,
    roleManagement: false,
    workflowConfiguration: false,
    databaseAdmin: false,
    authenticationAdmin: false,
    systemSettings: false,
  },

  authentication: {
    enabled: true,
    showInSidebar: false,
  },

  database: {
    enabled: true,
    showInSidebar: false,
  },

  tasks: {
    enabled: false,
  },

  workflows: {
    enabled: false,
  },

  performance: {
    enabled: false,
  },

  governance: {
    enabled: false,
  },

  advancedAnalyticsWorkspace: {
    enabled: false,
  },
} as const;
