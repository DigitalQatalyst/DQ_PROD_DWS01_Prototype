export const launchFlags = {
  orientation: {
    enabled: true,
    gettingStarted: true,
    home: true,
    quickLinks: true,
    myDashboard: true,
    myWork: true,
    aiCockpit: true,
  },

  marketplace: {
    enabled: true,
    catalogue: true,
    discern: true,
    design: true,
    deploy: true,
    drive: true,

    serviceMarketplace: true,
    knowledgeGuidelinesMarketplace: true,
    trackerMarketplace: true,
    analyticsMarketplace: true,
    dqDnaMarketplace: true,
  },

  services: {
    enabled: true,

    serviceHub: true,
    serviceOverview: true,
    myRequests: true,
    pendingActions: true,

    requestQueues: true,
    centralSupportQueue: true,
    fulfilmentOwnerQueue: true,
    assignedRequests: true,
    pendingInformation: true,
    slaQueueView: true,
    closureReviewQueue: true,

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
    enabled: true,

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
    enabled: true,

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
