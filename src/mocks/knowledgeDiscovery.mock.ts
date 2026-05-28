import { KnowledgeAssetFull, KnowledgeDetailRecord, LinkedWorkRecord, RelatedKnowledgeRecord, KnowledgeFeedbackRecord, KnowledgeReviewQueueItem, KnowledgeExecutiveSignal } from '../types/knowledgeDiscovery';

export const knowledgeAssetsFull: KnowledgeAssetFull[] = [
  {
    id: 'KNO-001',
    title: 'Agile TMS Task Discipline Guide',
    type: 'GHC Reference',
    status: 'Effective',
    summary: 'Standard for maintaining task hygiene in DWS.',
    purpose: 'Ensure tasks have clear outcomes, evidence, and closure criteria.',
    owner: 'Content Governance',
    ownerUserId: 'USR-006',
    lastReviewed: '2026-03-15',
    reviewDue: '2026-09-15',
    readTime: '5 min',
    applicability: ['Tasks', 'Approvals', 'Agile Execution'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 14,
    acknowledgementRequired: true,
    version: '1.2',
    tags: ['GHC', 'Task Quality', 'Closure'],
    evidenceExpectation: 'Task closure requires attached evidence or a waiver note.',
    whenToUse: ['Creating a new task', 'Reviewing a task for closure'],
    whenNotToUse: ['Simple sub-tasks that do not require governance'],
    relatedAssetIds: ['KNO-003', 'KNO-007'],
    linkedWorkIds: ['TSK-1001', 'TSK-1003']
  },
  {
    id: 'KNO-002',
    title: '6xD Execution Reference',
    type: '6xD Reference',
    status: 'Effective',
    summary: 'Core principles for 6xD methodology execution.',
    purpose: 'Provide a shared understanding of 6xD principles for all squads.',
    owner: 'Transformation Office',
    ownerUserId: 'USR-008',
    lastReviewed: '2026-01-10',
    reviewDue: '2026-07-10',
    readTime: '10 min',
    applicability: ['Tasks', 'Projects', 'Strategy'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 22,
    acknowledgementRequired: false,
    version: '2.0',
    tags: ['6xD', 'Orientation', 'DQ Ways of Working'],
    whenToUse: ['Planning a new squad', 'Strategic alignment'],
    whenNotToUse: ['Day-to-day bug fixes'],
    relatedAssetIds: ['KNO-001'],
    linkedWorkIds: ['TSK-1001', 'TSK-1005']
  },
  {
    id: 'KNO-003',
    title: 'Evidence Attachment Standard',
    type: 'Playbook',
    status: 'Under Review',
    summary: 'Rules for what constitutes acceptable evidence for task closure.',
    purpose: 'Standardize evidence collection to pass audit requirements.',
    owner: 'Audit & Risk',
    ownerUserId: 'USR-006',
    lastReviewed: '2025-11-01',
    reviewDue: '2026-05-01',
    readTime: '3 min',
    applicability: ['Tasks', 'Approvals'],
    feedbackMarker: 'Needs review',
    linkedWorkCount: 8,
    acknowledgementRequired: true,
    version: '1.0',
    tags: ['Evidence', 'Audit', 'Closure Quality'],
    whenToUse: ['Closing governed tasks', 'Auditing past work'],
    whenNotToUse: ['Personal to-dos'],
    relatedAssetIds: ['KNO-001'],
    linkedWorkIds: ['TSK-1002']
  },
  {
    id: 'KNO-004',
    title: 'Role Transition Checklist',
    type: 'Template',
    status: 'Draft',
    summary: 'Checklist for smooth transition between roles.',
    purpose: 'Ensure no access or knowledge is lost during a role change.',
    owner: 'HRA',
    ownerUserId: 'USR-005',
    lastReviewed: 'N/A',
    reviewDue: '2026-06-01',
    readTime: '2 min',
    applicability: ['Requests', 'Onboarding'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 0,
    acknowledgementRequired: false,
    version: '0.1',
    tags: ['HRA', 'Onboarding', 'Readiness'],
    whenToUse: ['When an employee changes units or roles'],
    whenNotToUse: ['For temporary coverage'],
    relatedAssetIds: [],
    linkedWorkIds: []
  },
  {
    id: 'KNO-005',
    title: 'DWS.01 Component Guidelines',
    type: 'Operating Standard',
    status: 'Needs Update',
    summary: 'UI and component usage guidelines for the prototype.',
    purpose: 'Maintain visual consistency across the prototype.',
    owner: 'Design System Team',
    ownerUserId: 'USR-003',
    lastReviewed: '2025-08-15',
    reviewDue: '2026-02-15',
    readTime: '8 min',
    applicability: ['Tasks', 'Development'],
    feedbackMarker: 'Has outdated flags',
    linkedWorkCount: 34,
    acknowledgementRequired: false,
    version: '1.4',
    tags: ['UI', 'Development', 'Design System'],
    whenToUse: ['Building new DWS components'],
    whenNotToUse: ['Backend architecture'],
    relatedAssetIds: [],
    linkedWorkIds: []
  },
  {
    id: 'KNO-006',
    title: 'Incident Response Playbook',
    type: 'Playbook',
    status: 'Effective',
    summary: 'Steps to take during a P1 incident.',
    purpose: 'Minimize downtime and ensure rapid communication.',
    owner: 'Support Operations',
    ownerUserId: 'USR-007',
    lastReviewed: '2026-04-01',
    reviewDue: '2026-10-01',
    readTime: '15 min',
    applicability: ['Requests', 'Escalations'],
    feedbackMarker: 'Useful',
    linkedWorkCount: 5,
    acknowledgementRequired: true,
    version: '3.1',
    tags: ['Incident', 'Support', 'P1'],
    whenToUse: ['During an active P1 or P2 incident'],
    whenNotToUse: ['For feature bugs'],
    relatedAssetIds: [],
    linkedWorkIds: []
  },
  {
    id: 'KNO-007',
    title: 'Peer Review Standards',
    type: 'Guideline',
    status: 'Effective',
    summary: 'Expectations for reviewing code and tasks.',
    purpose: 'Ensure high quality output before closure.',
    owner: 'Engineering Leadership',
    ownerUserId: 'USR-004',
    lastReviewed: '2026-02-20',
    reviewDue: '2026-08-20',
    readTime: '4 min',
    applicability: ['Approvals', 'Tasks'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 19,
    acknowledgementRequired: false,
    version: '2.0',
    tags: ['Review', 'Quality'],
    whenToUse: ['When assigned as a reviewer on a task'],
    whenNotToUse: [],
    relatedAssetIds: ['KNO-001'],
    linkedWorkIds: []
  },
  {
    id: 'KNO-008',
    title: 'Workspace Provisioning Standard',
    type: 'Process Reference',
    status: 'Needs Update',
    summary: 'How to request and provision a new workspace.',
    purpose: 'Standardize workspace creation for new teams.',
    owner: 'Platform Governance',
    ownerUserId: 'USR-006',
    lastReviewed: '2025-05-10',
    reviewDue: '2025-11-10',
    readTime: '6 min',
    applicability: ['Requests'],
    feedbackMarker: 'Has outdated flags',
    linkedWorkCount: 12,
    acknowledgementRequired: false,
    version: '1.1',
    tags: ['Workspace', 'Provisioning'],
    whenToUse: ['When a new squad is formed'],
    whenNotToUse: [],
    relatedAssetIds: [],
    linkedWorkIds: []
  },
  {
    id: 'KNO-009',
    title: 'New Joiner IT Checklist',
    type: 'Template',
    status: 'Effective',
    summary: 'Standard hardware and access for new joiners.',
    purpose: 'Ensure new employees are productive on day one.',
    owner: 'IT Support',
    ownerUserId: 'USR-007',
    lastReviewed: '2026-01-05',
    reviewDue: '2026-07-05',
    readTime: '2 min',
    applicability: ['Requests', 'Onboarding'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 45,
    acknowledgementRequired: false,
    version: '4.0',
    tags: ['IT', 'Onboarding'],
    whenToUse: ['During new joiner onboarding'],
    whenNotToUse: [],
    relatedAssetIds: ['KNO-004'],
    linkedWorkIds: []
  },
  {
    id: 'KNO-010',
    title: 'SLA Exceptions Policy',
    type: 'Operating Standard',
    status: 'Deprecated',
    summary: 'Old policy for requesting SLA extensions.',
    purpose: 'Replaced by the new Automated SLA Risk framework.',
    owner: 'Platform Governance',
    ownerUserId: 'USR-006',
    lastReviewed: '2024-12-01',
    reviewDue: '2025-06-01',
    readTime: '4 min',
    applicability: ['Tasks', 'Requests'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 2,
    acknowledgementRequired: false,
    version: '1.0',
    tags: ['SLA', 'Policy'],
    whenToUse: [],
    whenNotToUse: ['Always. Use the new Automated SLA framework.'],
    relatedAssetIds: [],
    linkedWorkIds: []
  }
];

export const knowledgeDetailRecords: KnowledgeDetailRecord[] = [
  {
    id: 'DET-KNO-001',
    assetId: 'KNO-001',
    content: 'Full reference text for Agile TMS Task Discipline Guide...',
    sections: [
      { id: 'sec-1', title: 'Principles', body: 'All tasks must have a clear "done" state. No ambiguous titles.' },
      { id: 'sec-2', title: 'Steps', body: '1. Define outcome. 2. Attach evidence. 3. Request review.' },
      { id: 'sec-3', title: 'Examples', body: 'Good: "Build login page". Bad: "Work on auth".' }
    ]
  },
  {
    id: 'DET-KNO-002',
    assetId: 'KNO-002',
    content: 'Full reference text for 6xD Execution Reference...',
    sections: [
      { id: 'sec-1', title: 'Discovery', body: 'Understand the problem before writing code.' },
      { id: 'sec-2', title: 'Design', body: 'Validate with users.' },
      { id: 'sec-3', title: 'Delivery', body: 'Ship small, ship often.' }
    ]
  }
];

export const linkedWorkRecords: LinkedWorkRecord[] = [
  { id: 'LNK-001', knowledgeId: 'KNO-001', targetId: 'TSK-1001', targetTitle: 'Build Stage 0 orientation shell', targetType: 'Task', targetStatus: 'In Progress' },
  { id: 'LNK-002', knowledgeId: 'KNO-001', targetId: 'TSK-1003', targetTitle: 'Review closure quality model', targetType: 'Task', targetStatus: 'Review Needed' },
  { id: 'LNK-003', knowledgeId: 'KNO-003', targetId: 'TSK-1002', targetTitle: 'Finalise request intake card patterns', targetType: 'Task', targetStatus: 'Blocked' },
  { id: 'LNK-004', knowledgeId: 'KNO-002', targetId: 'TSK-1001', targetTitle: 'Build Stage 0 orientation shell', targetType: 'Task', targetStatus: 'In Progress' },
  { id: 'LNK-005', knowledgeId: 'KNO-002', targetId: 'TSK-1005', targetTitle: 'Align HRA onboarding request flow', targetType: 'Task', targetStatus: 'In Progress' }
];

export const relatedKnowledgeRecords: RelatedKnowledgeRecord[] = [
  { id: 'REL-001', fromAssetId: 'KNO-001', toAssetId: 'KNO-003', relationship: 'Related' },
  { id: 'REL-002', fromAssetId: 'KNO-001', toAssetId: 'KNO-007', relationship: 'Related' },
  { id: 'REL-003', fromAssetId: 'KNO-002', toAssetId: 'KNO-001', relationship: 'Related' },
  { id: 'REL-004', fromAssetId: 'KNO-009', toAssetId: 'KNO-004', relationship: 'Prerequisite' },
  { id: 'REL-005', fromAssetId: 'KNO-003', toAssetId: 'KNO-001', relationship: 'Related' }
];

export const knowledgeFeedbackRecords: KnowledgeFeedbackRecord[] = [
  { id: 'FDB-1001', assetId: 'KNO-008', feedbackType: 'Outdated', submittedBy: 'USR-001', status: 'New', comment: 'The links to the workspace portal are broken.', createdAt: '2026-05-25T10:00:00Z' },
  { id: 'FDB-1002', assetId: 'KNO-008', feedbackType: 'Missing Detail', submittedBy: 'USR-002', status: 'New', comment: 'Does not mention the new approval step.', createdAt: '2026-05-26T11:30:00Z' },
  { id: 'FDB-1003', assetId: 'KNO-005', feedbackType: 'Outdated', submittedBy: 'USR-003', status: 'Reviewed', comment: 'Colors do not match the new tokens.', createdAt: '2026-05-20T09:15:00Z' },
  { id: 'FDB-1004', assetId: 'KNO-003', feedbackType: 'Unclear', submittedBy: 'USR-004', status: 'Action Taken', comment: 'Confusing wording in section 2.', createdAt: '2026-05-15T14:45:00Z' },
  { id: 'FDB-1005', assetId: 'KNO-006', feedbackType: 'Useful', submittedBy: 'USR-001', status: 'Reviewed', createdAt: '2026-05-27T08:00:00Z' }
];

export const knowledgeReviewQueue: KnowledgeReviewQueueItem[] = [
  { id: 'KRQ-3001', assetId: 'KNO-008', assetTitle: 'Workspace Provisioning Standard', queueReason: 'Outdated Flags', owner: 'USR-006', slaDue: '2026-05-30', status: 'Pending' },
  { id: 'KRQ-3002', assetId: 'KNO-005', assetTitle: 'DWS.01 Component Guidelines', queueReason: 'Outdated Flags', owner: 'USR-003', slaDue: '2026-05-28', status: 'In Progress' },
  { id: 'KRQ-3003', assetId: 'KNO-003', assetTitle: 'Evidence Attachment Standard', queueReason: 'Update Requested', owner: 'USR-006', slaDue: '2026-06-05', status: 'Pending' },
  { id: 'KRQ-3004', assetId: 'KNO-010', assetTitle: 'SLA Exceptions Policy', queueReason: 'Review Overdue', owner: 'USR-006', slaDue: '2025-06-01', status: 'Completed' }
];

export const knowledgeExecutiveSignals: KnowledgeExecutiveSignal[] = [
  { id: 'SIG-KNO-9001', signal: 'Total Effective Assets', value: '425', trend: '+12', status: 'info' },
  { id: 'SIG-KNO-9002', signal: 'Review Overdue', value: '18', trend: '-2', status: 'warning' },
  { id: 'SIG-KNO-9003', signal: 'Outdated Flags (30d)', value: '34', trend: '+8', status: 'danger' },
  { id: 'SIG-KNO-9004', signal: 'Linked Work Adoption', value: '68%', trend: '+5%', status: 'success' },
  { id: 'SIG-KNO-9005', signal: 'Acknowledgement Gaps', value: '142', trend: '-15', status: 'warning' },
  { id: 'SIG-KNO-9006', signal: 'Feedback Resolution SLA', value: '92%', trend: '+1%', status: 'success' }
];

export const suggestedTasksFromGuide = [
  { id: 'TSK-2501', title: 'Implement Workspace Provisioning', templateId: 'TPL-005', category: 'Execution' },
  { id: 'TSK-2502', title: 'Review Code against Peer Standards', templateId: 'TPL-002', category: 'Review' },
  { id: 'TSK-2503', title: 'Complete Transition Checklist', templateId: 'TPL-006', category: 'HRA' }
];
