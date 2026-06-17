export const launchFlags = {
  orientation: {
    enabled: true,
    home: true,
    myDashboard: true,
    myWork: true,
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
    requestQueues: true,
    requestCaseManagement: true,
    slaEscalations: true,
    serviceClosureFeedback: true,
  },

  trackers: {
    enabled: true,
    trackerHub: true,

    // These are workspace routes/screens, not sidebar items.
    trackerExecutionLifecycleSidebar: false,
    activeTrackerWorkspaceSidebar: false,
    trackerRecordMaintenanceSidebar: false,
  },

  platformAdmin: {
    enabled: true,
    contentManagement: true,
    advancedConfiguration: false,
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
