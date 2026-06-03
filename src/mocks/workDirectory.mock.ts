import type {
  AdminOwnershipReview,
  ContactRoute,
  DirectoryActivity,
  DirectoryDetailRecord,
  DirectoryEntry,
  DirectoryLinkedWork,
  OrganisationSignal,
  OwnershipArea
} from '../types/workDirectory';

export const directoryEntries: DirectoryEntry[] = [
  {
    id: 'DIR-PER-001',
    name: 'Amina Hassan',
    entityType: 'Person',
    roleLabel: 'Associate',
    unit: 'Digital Platforms',
    team: 'eCom.DXP Squad',
    availability: 'Available',
    workload: 'Medium',
    ownershipAreas: ['Tasks'],
    contactRoutes: ['Contact owner', 'Request review'],
    preferredContactRoute: 'Contact owner',
    backupOwner: 'Priya Nair',
    relatedEntryIds: ['DIR-TEAM-001', 'DIR-PER-003'],
    routeTargetType: 'Person',
    summary: 'Associate working across delivery tasks, updates, and request-linked execution.'
  },
  {
    id: 'DIR-PER-002',
    name: 'David Mwangi',
    entityType: 'Expert',
    roleLabel: 'Scrum Master',
    unit: 'Digital Platforms',
    team: 'DWS Core Squad',
    availability: 'Busy',
    workload: 'High',
    ownershipAreas: ['Reviews', 'Approvals', 'Workflow'],
    contactRoutes: ['Request review', 'Handoff work'],
    preferredContactRoute: 'Request review',
    backupOwner: 'Priya Nair',
    relatedEntryIds: ['DIR-TEAM-002', 'DIR-PER-003'],
    routeTargetType: 'Person',
    summary: 'Review and agile execution expert for delivery hygiene and workflow coordination.'
  },
  {
    id: 'DIR-PER-003',
    name: 'Priya Nair',
    entityType: 'Service Owner',
    roleLabel: 'Team / Squad Lead',
    unit: 'Digital Platforms',
    team: 'eCom.DXP Squad',
    availability: 'Available',
    workload: 'Medium',
    ownershipAreas: ['Tasks', 'Requests', 'Knowledge'],
    contactRoutes: ['Contact owner', 'Route request', 'Request review', 'Handoff work'],
    preferredContactRoute: 'Contact owner',
    backupOwner: 'Omar Farouk',
    relatedEntryIds: ['DIR-TEAM-001', 'DIR-UNIT-001', 'DIR-PER-004', 'DIR-PER-002'],
    routeTargetType: 'Person',
    summary: 'Owns squad delivery coordination, task review, escalation handling, and request routing for eCom.DXP-related work.'
  },
  {
    id: 'DIR-PER-004',
    name: 'Omar Farouk',
    entityType: 'Governance Owner',
    roleLabel: 'Unit Lead',
    unit: 'Digital Platforms',
    availability: 'Escalation only',
    workload: 'High',
    ownershipAreas: ['Approvals', 'SLA Rules', 'Governance'],
    contactRoutes: ['Escalate', 'Request review'],
    preferredContactRoute: 'Escalate',
    backupOwner: 'Elena Costa',
    relatedEntryIds: ['DIR-UNIT-001', 'DIR-PER-003'],
    routeTargetType: 'Person',
    summary: 'Unit-level escalation and approval owner for cross-team delivery and governance risks.'
  },
  {
    id: 'DIR-PER-005',
    name: 'Grace Wanjiru',
    entityType: 'Expert',
    roleLabel: 'HRA',
    unit: 'HRA',
    team: 'HRA Workflow Team',
    availability: 'Available',
    workload: 'Medium',
    ownershipAreas: ['HRA Workflow', 'Approvals', 'Knowledge'],
    contactRoutes: ['Contact owner', 'Request review'],
    preferredContactRoute: 'Request review',
    relatedEntryIds: ['DIR-UNIT-002'],
    routeTargetType: 'Person',
    summary: 'HRA workflow and policy knowledge owner for onboarding and readiness requests.'
  },
  {
    id: 'DIR-PER-006',
    name: 'Elena Costa',
    entityType: 'Governance Owner',
    roleLabel: 'Admins',
    unit: 'Platform Governance',
    team: 'Admin Governance Team',
    availability: 'Busy',
    workload: 'Medium',
    ownershipAreas: ['Platform Configuration', 'Governance', 'Approvals'],
    contactRoutes: ['Escalate', 'Contact owner'],
    preferredContactRoute: 'Escalate',
    backupOwner: 'Omar Farouk',
    relatedEntryIds: ['DIR-UNIT-004'],
    routeTargetType: 'Person',
    summary: 'Governance and platform configuration owner for admin routes and controlled changes.'
  },
  {
    id: 'DIR-PER-007',
    name: 'Brian Otieno',
    entityType: 'Fulfilment Contact',
    roleLabel: 'Support',
    unit: 'Support Operations',
    team: 'Platform Support Team',
    availability: 'Available',
    workload: 'Low',
    ownershipAreas: ['Requests', 'Support Triage', 'SLA Rules'],
    contactRoutes: ['Route request', 'View queue', 'Contact owner'],
    preferredContactRoute: 'Route request',
    backupOwner: 'Platform Support Queue',
    relatedEntryIds: ['DIR-QUEUE-001'],
    queueId: 'QUE-3001',
    routeTargetType: 'Person',
    summary: 'Handles platform support triage, access requests, bug routing, and first-line request fulfilment.'
  },
  {
    id: 'DIR-PER-008',
    name: 'CEO View',
    entityType: 'Person',
    roleLabel: 'CEO',
    unit: 'Enterprise',
    availability: 'Escalation only',
    workload: 'High',
    ownershipAreas: ['Governance'],
    contactRoutes: ['Escalate'],
    preferredContactRoute: 'Escalate',
    relatedEntryIds: ['DIR-UNIT-001'],
    routeTargetType: 'Person',
    summary: 'Executive aggregate visibility persona; not a personal contact inbox for this feature.'
  },
  {
    id: 'DIR-TEAM-001',
    name: 'eCom.DXP Squad',
    entityType: 'Team',
    roleLabel: 'Delivery Squad',
    unit: 'Digital Platforms',
    lead: 'Priya Nair',
    members: 6,
    availability: 'Available',
    workload: 'Medium',
    ownershipAreas: ['Tasks', 'Requests', 'Knowledge'],
    contactRoutes: ['Route request', 'Assign task'],
    preferredContactRoute: 'Route request',
    backupOwner: 'Omar Farouk',
    relatedEntryIds: ['DIR-PER-003', 'DIR-UNIT-001'],
    routeTargetType: 'Team',
    summary: 'Delivers eCom.DXP tasks, supports delivery reviews, and handles related workflow coordination.'
  },
  {
    id: 'DIR-TEAM-002',
    name: 'DWS Core Squad',
    entityType: 'Team',
    roleLabel: 'Platform Squad',
    unit: 'Digital Platforms',
    lead: 'Omar Farouk',
    members: 5,
    availability: 'Busy',
    workload: 'High',
    ownershipAreas: ['Platform Configuration', 'Approvals'],
    contactRoutes: ['Route request', 'Escalate'],
    preferredContactRoute: 'Route request',
    backupOwner: 'Priya Nair',
    relatedEntryIds: ['DIR-PER-004', 'DIR-UNIT-001'],
    routeTargetType: 'Team',
    summary: 'Owns DWS core platform delivery and configuration-sensitive squad work.'
  },
  {
    id: 'DIR-UNIT-001',
    name: 'Digital Platforms',
    entityType: 'Unit',
    roleLabel: 'Platform Delivery Unit',
    unit: 'Enterprise',
    lead: 'Omar Farouk',
    availability: 'Available',
    workload: 'High',
    ownershipAreas: ['Tasks', 'Requests', 'Platform Configuration', 'SLA Rules'],
    contactRoutes: ['View structure', 'Escalate'],
    preferredContactRoute: 'View structure',
    backupOwner: 'Elena Costa',
    relatedEntryIds: ['DIR-TEAM-001', 'DIR-TEAM-002', 'DIR-PER-004'],
    routeTargetType: 'Unit',
    summary: 'Owns platform delivery, platform configuration, and digital product execution across squads.'
  },
  {
    id: 'DIR-UNIT-002',
    name: 'HRA',
    entityType: 'Unit',
    roleLabel: 'People Workflow Unit',
    unit: 'Enterprise',
    lead: 'Grace Wanjiru',
    availability: 'Available',
    workload: 'Medium',
    ownershipAreas: ['HRA Workflow', 'Approvals', 'Knowledge'],
    contactRoutes: ['View structure', 'Request review'],
    preferredContactRoute: 'View structure',
    relatedEntryIds: ['DIR-PER-005'],
    routeTargetType: 'Unit',
    summary: 'Maps HRA workflow ownership, policy checks, and people readiness support.'
  },
  {
    id: 'DIR-UNIT-004',
    name: 'Platform Governance',
    entityType: 'Unit',
    roleLabel: 'Governance Unit',
    unit: 'Enterprise',
    lead: 'Elena Costa',
    availability: 'Busy',
    workload: 'Medium',
    ownershipAreas: ['Governance', 'Platform Configuration', 'Approvals'],
    contactRoutes: ['View structure', 'Escalate'],
    preferredContactRoute: 'Escalate',
    backupOwner: 'Omar Farouk',
    relatedEntryIds: ['DIR-PER-006'],
    routeTargetType: 'Unit',
    summary: 'Owns governance, configuration, approval discipline, and admin review signals.'
  },
  {
    id: 'DIR-QUEUE-001',
    name: 'Platform Support Queue',
    entityType: 'Queue',
    roleLabel: 'Support Queue',
    unit: 'Support Operations',
    lead: 'Brian Otieno',
    availability: 'Available',
    workload: 'Medium',
    ownershipAreas: ['Requests', 'Support Triage', 'SLA Rules'],
    contactRoutes: ['Route request', 'View queue', 'Escalate'],
    preferredContactRoute: 'View queue',
    backupOwner: 'Brian Otieno',
    relatedEntryIds: ['DIR-PER-007'],
    queueId: 'QUE-3001',
    queueState: 'Available',
    routeTargetType: 'Queue',
    summary: 'Handles access requests, bug reports, configuration support, and platform support triage.'
  }
];

export const ownershipAreas: OwnershipArea[] = [
  { id: 'OWN-001', area: 'Tasks', owner: 'Priya Nair', entityType: 'Person', coverageState: 'Covered', linksTo: 'TSK-2401' },
  { id: 'OWN-002', area: 'Requests', owner: 'Brian Otieno', entityType: 'Person', coverageState: 'Covered', linksTo: 'REQ-2001' },
  { id: 'OWN-003', area: 'Approvals', owner: 'Omar Farouk', entityType: 'Person', coverageState: 'Covered', linksTo: 'APR-3001' },
  { id: 'OWN-004', area: 'Knowledge', owner: 'Grace Wanjiru', entityType: 'Person', coverageState: 'Needs Backup', linksTo: 'KNO-002' },
  { id: 'OWN-005', area: 'SLA Rules', owner: 'Platform Support Queue', entityType: 'Queue', coverageState: 'Covered', linksTo: 'SLA-4001' },
  { id: 'OWN-006', area: 'Platform Configuration', owner: 'Elena Costa', entityType: 'Person', coverageState: 'Covered', linksTo: 'CFG-1001' },
  { id: 'OWN-007', area: 'HRA Workflow', owner: 'Grace Wanjiru', entityType: 'Person', coverageState: 'Covered', linksTo: 'WFL-2401' },
  { id: 'OWN-008', area: 'Support Triage', owner: 'Brian Otieno', entityType: 'Person', coverageState: 'Covered', linksTo: 'QUE-3001' }
];

export const contactRoutes: ContactRoute[] = [
  { id: 'RTE-001', routeType: 'Contact owner', usedFor: 'Clarification or collaboration', primaryOwner: 'Priya Nair', backupOwner: 'Omar Farouk', condition: 'N/A' },
  { id: 'RTE-002', routeType: 'Route request', usedFor: 'Send request to fulfilment owner/queue', primaryOwner: 'Brian Otieno', backupOwner: 'Platform Support Queue', condition: '4 hours' },
  { id: 'RTE-003', routeType: 'Request review', usedFor: 'Ask expert/lead to review work', primaryOwner: 'David Mwangi', backupOwner: 'Priya Nair', condition: '1 business day' },
  { id: 'RTE-004', routeType: 'Handoff work', usedFor: 'Transfer work ownership', primaryOwner: 'Priya Nair', backupOwner: 'Omar Farouk', condition: 'Same day' },
  { id: 'RTE-005', routeType: 'Escalate', usedFor: 'SLA breach, blocker, unavailable owner', primaryOwner: 'Omar Farouk', backupOwner: 'Elena Costa', condition: 'Immediate' },
  { id: 'RTE-006', routeType: 'View queue', usedFor: 'Open fulfilment/support queue', primaryOwner: 'Platform Support Queue', backupOwner: 'Brian Otieno', condition: 'N/A' }
];

export const directoryLinkedWork: DirectoryLinkedWork[] = [
  { id: 'LNK-001', relatedDirectoryEntryId: 'DIR-PER-003', workItemId: 'TSK-2401', title: 'Update onboarding checklist', type: 'Task', status: 'In Progress', owner: 'Priya Nair', targetRoute: '/marketplaces/work-directory/related-work/TSK-2401' },
  { id: 'LNK-002', relatedDirectoryEntryId: 'DIR-PER-007', workItemId: 'REQ-2001', title: 'Platform access request', type: 'Request', status: 'Pending Info', owner: 'Brian Otieno', targetRoute: '/marketplaces/work-directory/related-work/REQ-2001' },
  { id: 'LNK-003', relatedDirectoryEntryId: 'DIR-PER-004', workItemId: 'APR-3001', title: 'Access review', type: 'Approval', status: 'Awaiting Review', owner: 'Omar Farouk', targetRoute: '/marketplaces/work-directory/related-work/APR-3001' },
  { id: 'LNK-004', relatedDirectoryEntryId: 'DIR-PER-004', workItemId: 'WFL-2402', title: 'Blocker escalation', type: 'Workflow', status: 'Escalated', owner: 'Omar Farouk', targetRoute: '/marketplaces/work-directory/related-work/WFL-2402' },
  { id: 'LNK-005', relatedDirectoryEntryId: 'DIR-QUEUE-001', workItemId: 'QUE-3001', title: 'Platform Support Queue', type: 'Queue', status: 'Active', owner: 'Brian Otieno', targetRoute: '/marketplaces/work-directory/DIR-QUEUE-001' },
  { id: 'LNK-006', relatedDirectoryEntryId: 'DIR-PER-005', workItemId: 'KNO-002', title: 'Evidence Attachment Standard', type: 'Knowledge', status: 'Effective', owner: 'Grace Wanjiru' },
  { id: 'LNK-007', relatedDirectoryEntryId: 'DIR-QUEUE-001', workItemId: 'APR-9002', title: 'Restricted access approval packet', type: 'Approval', status: 'Restricted', owner: 'Elena Costa', restricted: true, restrictionReason: 'Governance approval details are limited to Admin and Unit Lead personas.' }
];

export const directoryDetailRecords: DirectoryDetailRecord[] = [
  {
    id: 'DET-001',
    entryId: 'DIR-PER-003',
    responsibilitySummary: 'Owns squad delivery coordination, task review, escalation handling, and request routing for eCom.DXP-related work.',
    recommendedRoute: 'Contact owner or request review for delivery coordination.',
    escalationTrigger: 'SLA breach, blocker, or unresolved review.',
    coverageNotes: 'Covered by Omar Farouk when Priya is unavailable.',
    serviceContext: ['Delivery task coordination', 'Request routing', 'Review readiness'],
    knowledgeContext: ['Onboarding checklist', 'Evidence standards', 'Delivery playbooks'],
    governanceContext: ['Escalate unresolved reviews', 'Confirm ownership before handoff']
  },
  {
    id: 'DET-002',
    entryId: 'DIR-PER-007',
    responsibilitySummary: 'Handles platform support triage, access requests, bug routing, and first-line request fulfilment.',
    recommendedRoute: 'Route request for platform support issues.',
    escalationTrigger: 'Queue overload or SLA risk.',
    coverageNotes: 'Platform Support Queue is the backup route for routed requests.',
    serviceContext: ['Platform access', 'Bug triage', 'Configuration support'],
    knowledgeContext: ['Support playbooks', 'SLA handling notes'],
    governanceContext: ['Escalate queue overload to Omar Farouk']
  },
  {
    id: 'DET-003',
    entryId: 'DIR-TEAM-001',
    responsibilitySummary: 'Delivers eCom.DXP tasks, supports delivery reviews, and handles related workflow coordination.',
    recommendedRoute: 'Route request or assign task to team.',
    escalationTrigger: 'High workload or unresolved blocker.',
    coverageNotes: 'Priya Nair owns team routing; Omar Farouk backs escalation.',
    serviceContext: ['Delivery tasks', 'Workflow coordination', 'Request follow-up'],
    knowledgeContext: ['Delivery playbooks', 'Task templates'],
    governanceContext: ['Escalate cross-team blocker through Digital Platforms']
  },
  {
    id: 'DET-004',
    entryId: 'DIR-UNIT-001',
    responsibilitySummary: 'Owns platform delivery, platform configuration, and digital product execution across squads.',
    recommendedRoute: 'View structure or escalate through unit lead.',
    escalationTrigger: 'Cross-team blocker or governance risk.',
    coverageNotes: 'Unit coverage spans eCom.DXP Squad and DWS Core Squad.',
    serviceContext: ['Platform delivery', 'Configuration routing', 'SLA ownership'],
    knowledgeContext: ['Operating standards', 'Platform guidance'],
    governanceContext: ['Unit lead approval', 'Governance risk escalation']
  },
  {
    id: 'DET-005',
    entryId: 'DIR-QUEUE-001',
    responsibilitySummary: 'Handles access requests, bug reports, configuration support, and platform support triage.',
    recommendedRoute: 'Open queue or route request.',
    escalationTrigger: 'SLA breach or queue unavailable.',
    coverageNotes: 'Brian Otieno is the primary fulfilment contact.',
    serviceContext: ['Access requests', 'Bug reports', 'Support triage'],
    knowledgeContext: ['Support guidance', 'Request intake standards'],
    governanceContext: ['SLA risk escalation', 'Queue workload review']
  }
];

export const directoryActivities: DirectoryActivity[] = [
  { id: 'DACT-001', activity: 'REQ-2001 routed to Platform Support', actor: 'System', relatedEntry: 'DIR-PER-007', time: 'Today, 09:45' },
  { id: 'DACT-002', activity: 'TSK-2401 assigned to Priya Nair', actor: 'Lead', relatedEntry: 'DIR-PER-003', time: 'Today, 10:20' },
  { id: 'DACT-003', activity: 'KNO-002 ownership updated', actor: 'Workspace Admin', relatedEntry: 'DIR-PER-005', time: 'Yesterday, 06:30' },
  { id: 'DACT-004', activity: 'WFL-2402 escalated to Unit Lead', actor: 'System', relatedEntry: 'DIR-PER-004', time: 'Today, 08:10' },
  { id: 'DACT-005', activity: 'Backup owner missing for Knowledge ownership', actor: 'System', relatedEntry: 'OWN-004', time: '2 days ago' }
];

export const adminOwnershipReviews: AdminOwnershipReview[] = [
  {
    id: 'ADM-REV-5001',
    issue: 'Missing backup owner',
    directoryEntry: 'Grace Wanjiru',
    directoryEntryId: 'DIR-PER-005',
    severity: 'Medium',
    status: 'Pending',
    action: 'Assign backup',
    configurationReference: 'Ownership Records',
    recommendedFix: 'Assign a backup owner for Knowledge ownership before routing review requests.'
  },
  {
    id: 'ADM-REV-5002',
    issue: 'Owner unavailable',
    directoryEntry: 'Omar Farouk',
    directoryEntryId: 'DIR-PER-004',
    severity: 'High',
    status: 'Needs Review',
    action: 'Confirm escalation path',
    configurationReference: 'Escalation Routes',
    recommendedFix: 'Confirm Elena Costa remains the backup route while Omar is escalation-only.'
  },
  {
    id: 'ADM-REV-5003',
    issue: 'Queue workload high',
    directoryEntry: 'Platform Support Queue',
    directoryEntryId: 'DIR-QUEUE-001',
    severity: 'High',
    status: 'At Risk',
    action: 'Add fulfilment contact',
    configurationReference: 'Queue Ownership',
    recommendedFix: 'Add a fulfilment contact or backup queue owner for high workload periods.'
  },
  {
    id: 'ADM-REV-5004',
    issue: 'Stale ownership record',
    directoryEntry: 'HRA Workflow',
    directoryEntryId: 'DIR-PER-005',
    severity: 'Medium',
    status: 'Pending',
    action: 'Review ownership',
    configurationReference: 'Workflow Ownership',
    recommendedFix: 'Confirm whether Grace Wanjiru still owns HRA Workflow review coverage.'
  },
  {
    id: 'ADM-REV-5005',
    issue: 'Missing contact route',
    directoryEntry: 'DWS Core Squad',
    directoryEntryId: 'DIR-TEAM-002',
    severity: 'Low',
    status: 'Pending',
    action: 'Add route',
    configurationReference: 'Contact Routes',
    recommendedFix: 'Add a request review or escalation route for DWS Core Squad.'
  }
];

export const organisationSignals: OrganisationSignal[] = [
  { id: 'SIG-ORG-9001', signal: 'Ownership areas covered', value: '7 of 8', status: 'Warning', linksTo: 'Ownership Areas' },
  { id: 'SIG-ORG-9002', signal: 'Missing backup owners', value: '1', status: 'Warning', linksTo: 'Admin Review Queue' },
  { id: 'SIG-ORG-9003', signal: 'Overloaded queues', value: '1', status: 'Danger', linksTo: 'Platform Support Queue' },
  { id: 'SIG-ORG-9004', signal: 'Escalation concentration', value: '3 active', status: 'Warning', linksTo: 'Escalation Routes' },
  { id: 'SIG-ORG-9005', signal: 'Available fulfilment contacts', value: '2', status: 'Success', linksTo: 'Fulfilment Contacts' },
  { id: 'SIG-ORG-9006', signal: 'Units with mapped teams', value: '5', status: 'Success', linksTo: 'Organisation Structure' }
];
