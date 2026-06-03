import {
  KnowledgeAssetFull,
  KnowledgeDetailRecord,
  LinkedWorkRecord,
  RelatedKnowledgeRecord,
  KnowledgeFeedbackRecord,
  KnowledgeReviewQueueItem,
  KnowledgeExecutiveSignal,
  ApplicabilityRecord,
  AcknowledgementRecord
} from '../types/knowledgeDiscovery';

// ── 6.3 Knowledge Assets ────────────────────────────────────────────────────

export const knowledgeAssetsFull: KnowledgeAssetFull[] = [
  {
    id: 'KNO-001',
    title: 'Agile TMS Task Discipline Guide',
    type: 'Guideline',
    status: 'Effective',
    summary: 'How DQ tasks should be structured, updated, evidenced, reviewed, and closed.',
    purpose: 'Explains how DQ tasks should be structured, updated, evidenced, reviewed, and closed with consistent discipline across all teams.',
    owner: 'Knowledge Content Owner',
    ownerUserId: 'USR-006',
    reviewer: 'Content Governance Lead',
    lastReviewed: '2026-03-15',
    reviewDue: '2026-09-15',
    nextReview: '2026-09-15',
    readTime: '5 min',
    applicability: ['Tasks', 'Reviews', 'Closure'],
    feedbackMarker: 'Useful',
    linkedWorkCount: 14,
    acknowledgementRequired: true,
    version: '1.2',
    tags: ['GHC', 'Task Quality', 'Closure'],
    evidenceExpectation: 'Task output statement, checklist completion, evidence link, closure note.',
    whenToUse: [
      'Creating a new task in DWS.01',
      'Reviewing a task for closure quality',
      'Onboarding a new Associate to task discipline'
    ],
    whenNotToUse: [
      'Simple sub-tasks that do not require governance',
      'Personal to-dos outside the DWS.01 operating model'
    ],
    lifecycleState: 'Active',
    permissionScope: 'All Associates',
    coreGuidance: {
      principles: [
        'All tasks must have a clear "done" state defined before starting.',
        'Evidence must be attached before a task can be closed.',
        'Task purpose must be explicit, not implied.'
      ],
      steps: [
        '1. Define task purpose and expected output.',
        '2. Assign owner and contributors.',
        '3. Link strategic context if applicable.',
        '4. Complete checklist items as work progresses.',
        '5. Attach evidence before requesting closure review.'
      ],
      examples: [
        { type: 'good', text: 'Task: "Deliver API contract for payment module — Evidence: PR link + test report"' },
        { type: 'bad', text: 'Task: "Work on auth stuff" — no evidence, no output defined' }
      ],
      commonMistakes: [
        'Marking tasks complete without attaching evidence.',
        'Creating tasks with no purpose statement.'
      ],
      exceptions: [
        'Sub-tasks under a parent governed task may use a simplified format with Lead approval.'
      ]
    },
    relatedAssetIds: ['KNO-002', 'KNO-007'],
    linkedWorkIds: ['TSK-2401', 'TSK-2403']
  },
  {
    id: 'KNO-002',
    title: 'Evidence Attachment Standard',
    type: 'Operating Standard',
    status: 'Effective',
    summary: 'Defines what counts as acceptable evidence when closing work items.',
    purpose: 'Defines what counts as acceptable evidence when closing governed tasks and requests, ensuring audit-ready closure quality.',
    owner: 'Knowledge Content Owner',
    ownerUserId: 'USR-006',
    reviewer: 'Audit & Risk Lead',
    lastReviewed: '2026-02-20',
    reviewDue: '2026-08-20',
    nextReview: '2026-08-20',
    readTime: '3 min',
    applicability: ['Tasks', 'Requests', 'Closure'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 8,
    acknowledgementRequired: false,
    version: '1.0',
    tags: ['Evidence', 'Closure', 'Audit'],
    evidenceExpectation: 'Evidence link, artefact reference, owner confirmation, review note where required.',
    whenToUse: [
      'Closing governed tasks',
      'Closing fulfilment requests',
      'Auditing past work evidence'
    ],
    whenNotToUse: [
      'Personal to-dos',
      'Informal working-session actions not yet promoted to governed tasks'
    ],
    lifecycleState: 'Active',
    permissionScope: 'All Associates, Leads',
    coreGuidance: {
      principles: [
        'Evidence must be attached, not described in a note.',
        'File links, PR links, document references, and output summaries are acceptable.',
        'Evidence must be accessible to the reviewer.'
      ],
      steps: [
        '1. Identify the required evidence type from the task template.',
        '2. Produce the output or gather the artefact.',
        '3. Attach via the task evidence panel.',
        '4. Request closure review.'
      ],
      examples: [
        { type: 'good', text: 'Evidence: "Link to reviewed PR #421 + QA sign-off comment"' },
        { type: 'bad', text: 'Evidence: "Done — discussed with team"' }
      ],
      commonMistakes: ['Submitting verbal confirmation as evidence.'],
      exceptions: ['Waiver note accepted if evidence is pending external approval, with Lead sign-off.']
    },
    relatedAssetIds: ['KNO-001', 'KNO-004'],
    linkedWorkIds: ['TSK-2403']
  },
  {
    id: 'KNO-003',
    title: 'Request Fulfilment Process Reference',
    type: 'Process Reference',
    status: 'Under Review',
    summary: 'Explains how internal requests move through intake, routing, fulfilment, SLA, and closure.',
    purpose: 'Explains how internal service requests are processed from intake through routing, fulfilment, SLA management, and closure.',
    owner: 'Knowledge Content Owner',
    ownerUserId: 'USR-006',
    reviewer: 'Platform Governance Lead',
    lastReviewed: '2025-11-01',
    reviewDue: '2026-05-01',
    nextReview: '2026-06-15',
    readTime: '8 min',
    applicability: ['Requests', 'Fulfilment', 'SLA'],
    feedbackMarker: 'Needs review',
    linkedWorkCount: 6,
    acknowledgementRequired: false,
    version: '1.1',
    tags: ['Requests', 'SLA', 'Routing'],
    evidenceExpectation: 'Request status, owner note, fulfilment evidence, closure outcome.',
    whenToUse: [
      'Submitting a new service request',
      'Routing a request to a fulfilment owner',
      'Reviewing SLA compliance on open requests'
    ],
    whenNotToUse: [
      'Ad-hoc escalations — use the Blocker Resolution Playbook instead',
      'HR-specific requests — use the HRA workflow'
    ],
    lifecycleState: 'Under Review',
    permissionScope: 'All Associates, Service Owners',
    coreGuidance: {
      principles: [
        'All requests must be categorised at intake.',
        'Routing must follow the configured service ownership model.',
        'SLA clocks start on submission, not on acceptance.'
      ],
      steps: [
        '1. Submit request with category and required fields.',
        '2. System routes to assigned fulfilment owner.',
        '3. Owner acknowledges and begins fulfilment.',
        '4. SLA tracked; alerts fire at breach thresholds.',
        '5. Owner marks fulfilled with evidence; requester confirms closure.'
      ],
      examples: [
        { type: 'good', text: '"Access Request — submitted with system name, justification, and approver"' },
        { type: 'bad', text: '"Need access — please sort" — missing category, system, and approver' }
      ],
      commonMistakes: ['Skipping the category field causing routing failures.'],
      exceptions: ['Critical requests can bypass SLA queue with Exec approval.']
    },
    relatedAssetIds: ['KNO-005'],
    linkedWorkIds: ['REQ-2401']
  },
  {
    id: 'KNO-004',
    title: 'Closure Evidence Standard',
    type: 'Evidence Standard',
    status: 'Effective',
    summary: 'Defines evidence expectations before a task or request can be closed.',
    purpose: 'Defines what evidence completeness means before a task or request can be closed, ensuring consistent closure quality across the platform.',
    owner: 'Knowledge Content Owner',
    ownerUserId: 'USR-006',
    reviewer: 'Quality Governance Lead',
    lastReviewed: '2026-01-10',
    reviewDue: '2026-07-10',
    nextReview: '2026-07-10',
    readTime: '4 min',
    applicability: ['Closure', 'Reviews'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 9,
    acknowledgementRequired: true,
    version: '2.0',
    tags: ['Evidence', 'Review', 'Closure'],
    evidenceExpectation: 'Evidence completeness, output summary, reviewer decision.',
    whenToUse: [
      'Reviewing a task before closure approval',
      'Conducting a closure quality review',
      'Checking evidence completeness in an audit'
    ],
    whenNotToUse: [
      'Mid-task progress checks — this applies at closure only'
    ],
    lifecycleState: 'Active',
    permissionScope: 'Leads, Closure Reviewers',
    coreGuidance: {
      principles: [
        'Closure requires evidence that the expected output was produced.',
        'Checklist must be fully complete before closure review.',
        'Reviewer decision must be recorded with rationale.'
      ],
      steps: [
        '1. Confirm all checklist items are complete.',
        '2. Verify evidence is attached and accessible.',
        '3. Confirm the expected output is present.',
        '4. Record reviewer decision.',
        '5. Close task or return for correction.'
      ],
      examples: [
        { type: 'good', text: '"Closure: output confirmed, evidence linked, checklist 5/5 complete, reviewer approved."' },
        { type: 'bad', text: '"Done." — no evidence, no checklist confirmation, no reviewer sign-off.' }
      ],
      commonMistakes: ['Closing tasks with partial checklists and promising evidence later.'],
      exceptions: ['Evidence waiver accepted in exceptional circumstances with Lead approval and documented reason.']
    },
    relatedAssetIds: ['KNO-002'],
    linkedWorkIds: ['TSK-2405']
  },
  {
    id: 'KNO-005',
    title: 'Blocker Resolution Playbook',
    type: 'Playbook',
    status: 'Effective',
    summary: 'Provides practical steps for identifying, owning, resolving, and escalating blockers.',
    purpose: 'Provides practical execution steps for identifying, owning, resolving, and escalating blockers in DWS.01 governed tasks.',
    owner: 'Knowledge Content Owner',
    ownerUserId: 'USR-006',
    reviewer: 'Delivery Lead',
    lastReviewed: '2026-04-01',
    reviewDue: '2026-10-01',
    nextReview: '2026-10-01',
    readTime: '10 min',
    applicability: ['Tasks', 'Escalations'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 5,
    acknowledgementRequired: false,
    version: '3.1',
    tags: ['Blockers', 'Escalation', 'Delivery'],
    evidenceExpectation: 'Blocker reason, owner, next action, escalation path, resolution note.',
    whenToUse: [
      'A task is blocked and needs a structured resolution path',
      'Escalating a blocker to a Lead or Exec',
      'Conducting a blocker review in a working session'
    ],
    whenNotToUse: [
      'Minor task delays that do not constitute a full blocker',
      'HR-related blockers — escalate via HRA workflow'
    ],
    lifecycleState: 'Active',
    permissionScope: 'All Associates, Leads',
    coreGuidance: {
      principles: [
        'Every blocker must have an owner and a next action.',
        'Blockers unresolved after 2 business days escalate automatically.',
        'Resolution notes must explain what was done, not just that it is resolved.'
      ],
      steps: [
        '1. Flag the task as Blocked in DWS.01.',
        '2. Record the blocker reason and immediate next action.',
        '3. Assign blocker owner (may differ from task owner).',
        '4. Follow up within 1 business day.',
        '5. Escalate to Lead if unresolved after 2 business days.',
        '6. Record resolution note and unblock the task.'
      ],
      examples: [
        { type: 'good', text: '"Blocked: Waiting on API access from Platform team. Owner: USR-012. Next action: Chase by EOD."' },
        { type: 'bad', text: '"Blocked" — no reason, no owner, no next action.' }
      ],
      commonMistakes: ['Marking tasks blocked without assigning a resolution owner.'],
      exceptions: []
    },
    relatedAssetIds: ['KNO-003'],
    linkedWorkIds: ['TSK-2404']
  },
  {
    id: 'KNO-006',
    title: 'Weekly Delivery Review Template',
    type: 'Template',
    status: 'Effective',
    summary: 'Reusable template for weekly delivery review sessions.',
    purpose: 'Provides a reusable structure for weekly delivery review sessions, ensuring consistent coverage of delivery health, blockers, SLA status, and next steps.',
    owner: 'Knowledge Content Owner',
    ownerUserId: 'USR-006',
    reviewer: 'Team Delivery Lead',
    lastReviewed: '2026-03-01',
    reviewDue: '2026-09-01',
    nextReview: '2026-09-01',
    readTime: '3 min',
    applicability: ['Reviews', 'Delivery', 'Team'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 12,
    acknowledgementRequired: false,
    version: '1.0',
    tags: ['Review', 'Delivery', 'Team'],
    evidenceExpectation: 'Session decisions, action items, follow-up owners, next session date.',
    whenToUse: [
      'Running a weekly squad delivery review',
      'Facilitating a team health check',
      'Reporting delivery progress to Leads or Executives'
    ],
    whenNotToUse: [
      'Ad-hoc tactical standups — use a simpler format'
    ],
    lifecycleState: 'Active',
    permissionScope: 'Team Leads, Associates',
    coreGuidance: {
      principles: [
        'Cover all active tasks, blockers, SLA risks, and evidence gaps.',
        'Every action item must have an owner and due date.'
      ],
      steps: [
        '1. Open this template before the session.',
        '2. Review task statuses and flag blockers.',
        '3. Check SLA compliance and evidence gaps.',
        '4. Record decisions and action items.',
        '5. Assign owners and confirm next review date.'
      ],
      examples: [
        { type: 'good', text: '"Action: Close evidence gap on TSK-2401 — Owner: Associate — Due: Tomorrow."' },
        { type: 'bad', text: '"We discussed it and will sort it out."' }
      ],
      commonMistakes: ['Running reviews without recording action items.'],
      exceptions: []
    },
    relatedAssetIds: ['KNO-008'],
    linkedWorkIds: ['TSK-2406']
  },
  {
    id: 'KNO-007',
    title: 'GHC Execution Behaviour Reference',
    type: 'GHC Reference',
    status: 'Effective',
    summary: 'Links execution behaviour expectations to GHC capability standards.',
    purpose: 'Links day-to-day execution behaviour expectations to GHC capability standards, helping Associates understand how their work connects to capability growth.',
    owner: 'Knowledge Content Owner',
    ownerUserId: 'USR-006',
    reviewer: 'GHC Lead',
    lastReviewed: '2026-02-15',
    reviewDue: '2026-08-15',
    nextReview: '2026-08-15',
    readTime: '6 min',
    applicability: ['Tasks', 'Governance', 'Workspace'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 19,
    acknowledgementRequired: false,
    version: '2.0',
    tags: ['GHC', 'Behaviour', 'Execution'],
    evidenceExpectation: 'Behaviour demonstration note, task output aligned to GHC standard.',
    whenToUse: [
      'Preparing for a GHC capability review',
      'Linking task behaviour to GHC expectations',
      'Onboarding Associates to GHC standards'
    ],
    whenNotToUse: [
      'Operational tasks with no GHC relevance'
    ],
    lifecycleState: 'Active',
    permissionScope: 'All Associates',
    coreGuidance: {
      principles: [
        'GHC standards apply to how work is done, not just what is delivered.',
        'Execution discipline demonstrates capability, not just output.'
      ],
      steps: [
        '1. Review applicable GHC capability standard.',
        '2. Identify how your current task demonstrates the expected behaviour.',
        '3. Record behaviour evidence in the task or closure note.'
      ],
      examples: [
        { type: 'good', text: '"Closure note references GHC Execution Behaviour — explains ownership and decision quality."' },
        { type: 'bad', text: '"Task done." — no behaviour context.' }
      ],
      commonMistakes: ['Treating GHC as a performance review tool rather than a daily practice guide.'],
      exceptions: []
    },
    relatedAssetIds: ['KNO-001'],
    linkedWorkIds: ['TSK-2401']
  },
  {
    id: 'KNO-008',
    title: '6xD Deployment Reference',
    type: '6xD Reference',
    status: 'Needs Update',
    summary: 'Links deployment execution to the 6xD transformation methodology.',
    purpose: 'Links deployment execution patterns to the 6xD transformation methodology, providing context for how delivery milestones align to the 6xD phases.',
    owner: 'Knowledge Content Owner',
    ownerUserId: 'USR-006',
    reviewer: 'Transformation Lead',
    lastReviewed: '2025-10-01',
    reviewDue: '2026-04-01',
    nextReview: '2026-06-01',
    readTime: '7 min',
    applicability: ['Tasks', 'Workspace'],
    feedbackMarker: 'Has outdated flags',
    linkedWorkCount: 3,
    acknowledgementRequired: false,
    version: '1.1',
    tags: ['6xD', 'Deploy', 'Delivery'],
    evidenceExpectation: 'Deployment milestone, phase alignment note, delivery outcome.',
    whenToUse: [
      'Planning a deployment milestone',
      'Aligning a squad delivery to the 6xD phase',
      'Reviewing transformation delivery progress'
    ],
    whenNotToUse: [
      'BAU operational tasks not linked to a transformation programme'
    ],
    lifecycleState: 'Needs Update',
    permissionScope: 'All Associates, Transformation Teams',
    coreGuidance: {
      principles: [
        '6xD phases define the deployment cadence.',
        'Each delivery milestone must align to a 6xD phase gate.'
      ],
      steps: [
        '1. Identify current 6xD phase for your squad.',
        '2. Map your delivery milestone to the phase expectations.',
        '3. Record phase alignment in the task or request.'
      ],
      examples: [
        { type: 'good', text: '"Delivery milestone aligned to 6xD Phase 3 — Deploy gate. Evidence: deployment checklist attached."' },
        { type: 'bad', text: '"Deployed to prod." — no 6xD alignment, no phase context.' }
      ],
      commonMistakes: ['Treating 6xD as a project management tool rather than a transformation methodology.'],
      exceptions: []
    },
    relatedAssetIds: ['KNO-006'],
    linkedWorkIds: []
  },
  {
    id: 'KNO-009',
    title: 'Workspace Operating Guide',
    type: 'Workspace Guide',
    status: 'Effective',
    summary: 'Explains DWS.01 workspace rules, operating norms, and navigation.',
    purpose: 'Explains DWS.01 workspace rules, operating norms, and navigation conventions to help Associates use the platform effectively from day one.',
    owner: 'Workspace Admin',
    ownerUserId: 'USR-003',
    reviewer: 'Platform Admin Lead',
    lastReviewed: '2026-01-05',
    reviewDue: '2026-07-05',
    nextReview: '2026-07-05',
    readTime: '12 min',
    applicability: ['Workspace', 'Onboarding'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 45,
    acknowledgementRequired: true,
    version: '4.0',
    tags: ['DWS.01', 'Rules', 'Onboarding'],
    evidenceExpectation: 'Acknowledgement of reading, onboarding checklist completion.',
    whenToUse: [
      'Starting on DWS.01 for the first time',
      'Onboarding a new team member',
      'Clarifying workspace operating rules'
    ],
    whenNotToUse: [
      'Looking for task-specific guidance — use the Agile TMS Task Discipline Guide instead'
    ],
    lifecycleState: 'Active',
    permissionScope: 'All Users',
    coreGuidance: {
      principles: [
        'DWS.01 is an operating platform, not just a task tracker.',
        'All work should be recorded in the platform to be visible and governed.',
        'Navigation follows the Stage 01 → Stage 02 model.'
      ],
      steps: [
        '1. Review the Stage 0 orientation on first login.',
        '2. Understand the Stage 01 Marketplaces and Stage 02 Workspace structure.',
        '3. Set up your persona and workspace preferences.',
        '4. Acknowledge this guide to confirm you have read and understood it.'
      ],
      examples: [
        { type: 'good', text: '"Associate navigates from Stage 01 Knowledge Hub → attaches reference → creates governed task."' },
        { type: 'bad', text: '"Associate does work outside DWS.01 and reports it informally."' }
      ],
      commonMistakes: ['Treating DWS.01 as optional rather than the primary operating environment.'],
      exceptions: []
    },
    relatedAssetIds: [],
    linkedWorkIds: []
  },
  {
    id: 'KNO-010',
    title: 'Task Quality Learning Reference',
    type: 'Learning Reference',
    status: 'Draft',
    summary: 'Links task quality expectations to capability growth and learning pathways.',
    purpose: 'Links task quality expectations to Associate capability growth and learning pathways, helping new Associates develop task execution discipline.',
    owner: 'Knowledge Content Owner',
    ownerUserId: 'USR-006',
    reviewer: 'L&D Lead',
    lastReviewed: 'N/A',
    reviewDue: '2026-06-01',
    nextReview: '2026-06-01',
    readTime: '5 min',
    applicability: ['Tasks', 'Onboarding'],
    feedbackMarker: 'No feedback',
    linkedWorkCount: 0,
    acknowledgementRequired: false,
    version: '0.1',
    tags: ['Learning', 'Task Quality'],
    evidenceExpectation: 'Learning module completion acknowledgement.',
    whenToUse: [
      'Onboarding a new Associate',
      'Supporting capability development in task execution',
      'Linking L&D activities to platform-governed tasks'
    ],
    whenNotToUse: [
      'Experienced Associates already proficient in DWS.01 task execution'
    ],
    lifecycleState: 'Draft',
    permissionScope: 'Associates, HRA',
    coreGuidance: {
      principles: [
        'Task quality is a learnable skill, not just a compliance requirement.',
        'Learning references connect platform behaviour to capability frameworks.'
      ],
      steps: [
        '1. Review the learning objectives.',
        '2. Apply them to your next governed task.',
        '3. Reflect on output quality and evidence discipline.'
      ],
      examples: [
        { type: 'good', text: '"Associate applies learning reference guidance to produce a well-evidenced, governed task closure."' },
        { type: 'bad', text: '"Associate reads the guide but continues previous habits."' }
      ],
      commonMistakes: [],
      exceptions: []
    },
    relatedAssetIds: [],
    linkedWorkIds: []
  }
];

// ── 6.4 Knowledge Detail Records ────────────────────────────────────────────

export const knowledgeDetailRecords: KnowledgeDetailRecord[] = [
  {
    id: 'DET-KNO-001',
    assetId: 'KNO-001',
    content: 'The Agile TMS Task Discipline Guide provides the operating standard for how all DQ Associates must structure, update, evidence, review, and close tasks within DWS.01.',
    workApplication: 'Applies to all governed tasks across task creation, progress updates, review requests, and closure. Associates must follow this guide when working on any task within the DWS.01 platform.',
    reviewExpectation: 'Tasks using this guide require a review request before closure. Reviewer confirms output, evidence, and checklist completion.',
    acknowledgementExpectation: 'Required for all Associates during onboarding. Must be re-acknowledged after major version updates.',
    evidenceOutput: 'Task output statement, checklist completion (all mandatory items), evidence link (file, PR, or document reference), closure note.',
    sections: [
      { id: 'sec-1', title: 'Principles', body: 'All tasks must have a clear "done" state before starting. Ambiguous task titles and vague output descriptions are not acceptable in a governed execution environment.' },
      { id: 'sec-2', title: 'Steps', body: '1. Define task purpose and expected output.\n2. Assign owner and contributors.\n3. Link strategic context if applicable.\n4. Complete checklist items as work progresses.\n5. Attach evidence before requesting closure review.' },
      { id: 'sec-3', title: 'Examples', body: 'Good: "Deliver API contract for payment module — Evidence: PR #421 + QA sign-off"\nBad: "Work on auth stuff" — no defined output, no evidence requirement.' }
    ],
    versionHistory: [
      { version: '1.2', date: '2026-03-15', summary: 'Added evidence attachment requirement to closure criteria.', reviewer: 'Content Governance Lead', status: 'Effective' },
      { version: '1.1', date: '2025-09-01', summary: 'Added GHC behaviour alignment section.', reviewer: 'GHC Lead', status: 'Superseded' },
      { version: '1.0', date: '2025-03-01', summary: 'Initial release.', reviewer: 'Platform Governance', status: 'Superseded' }
    ]
  },
  {
    id: 'DET-KNO-002',
    assetId: 'KNO-002',
    content: 'The Evidence Attachment Standard defines what constitutes acceptable evidence for task and request closure across DWS.01.',
    workApplication: 'Applies during task closure, request closure, and quality review. Service Owners and Leads use this standard to assess evidence quality during review.',
    reviewExpectation: 'No formal review required. Evidence quality is assessed at task closure by the assigned reviewer.',
    acknowledgementExpectation: 'Not required. Associates are expected to apply this standard as part of normal operating discipline.',
    evidenceOutput: 'Evidence link (file, PR, document reference), artefact reference, owner confirmation, review note where required.',
    sections: [
      { id: 'sec-1', title: 'Acceptable Evidence Types', body: 'File uploads, PR links, document references, system screenshots with context, meeting decision records, approved output summaries.' },
      { id: 'sec-2', title: 'Unacceptable Evidence', body: '"Discussed with team", "done", "completed" — verbal or informal descriptions without an artefact or link are not acceptable as governance evidence.' },
      { id: 'sec-3', title: 'Closure Impact', body: 'Tasks without attached evidence cannot be marked closure-ready. Reviewers will return tasks with missing evidence for correction.' }
    ],
    versionHistory: [
      { version: '1.0', date: '2026-02-20', summary: 'Initial release.', reviewer: 'Audit & Risk Lead', status: 'Effective' }
    ]
  },
  {
    id: 'DET-KNO-003',
    assetId: 'KNO-003',
    content: 'The Request Fulfilment Process Reference explains how internal service requests are processed through DWS.01 from intake to closure.',
    workApplication: 'Applies to all internal service requests submitted through the DWS.01 request intake. Relevant for Associates submitting requests and Service Owners managing fulfilment queues.',
    reviewExpectation: 'No formal review required for individual requests. Fulfilment owner confirms closure with evidence.',
    acknowledgementExpectation: 'Not required. Associates are expected to follow the process as part of normal operating discipline.',
    evidenceOutput: 'Request status confirmation, owner fulfilment note, evidence of fulfilment, closure outcome.',
    sections: [
      { id: 'sec-1', title: 'Intake', body: 'All requests must be submitted with a category, description, justification, and any required approvals identified upfront.' },
      { id: 'sec-2', title: 'Routing', body: 'The system routes requests to the configured fulfilment owner based on category. SLA clocks start on submission.' },
      { id: 'sec-3', title: 'Fulfilment & Closure', body: 'The fulfilment owner confirms completion with evidence. The requester confirms acceptance. SLA compliance is recorded automatically.' }
    ],
    versionHistory: [
      { version: '1.1', date: '2025-11-01', summary: 'Added SLA escalation path.', reviewer: 'Platform Governance Lead', status: 'Under Review' },
      { version: '1.0', date: '2025-05-01', summary: 'Initial release.', reviewer: 'Platform Governance', status: 'Superseded' }
    ]
  },
  {
    id: 'DET-KNO-004',
    assetId: 'KNO-004',
    content: 'The Closure Evidence Standard defines the evidence completeness requirements before a task or request can be formally closed in DWS.01.',
    workApplication: 'Used by Leads and Closure Reviewers to assess closure readiness. Applies to all governed tasks and requests during the closure review stage.',
    reviewExpectation: 'Required for closure reviewers. Reviewer must confirm evidence completeness before approving closure.',
    acknowledgementExpectation: 'Required for all closure reviewers (Leads, designated review roles). Must be acknowledged before performing closure reviews.',
    evidenceOutput: 'Evidence completeness confirmation, output summary, reviewer decision with rationale.',
    sections: [
      { id: 'sec-1', title: 'Closure Readiness Criteria', body: '1. All mandatory checklist items complete.\n2. Expected output confirmed and documented.\n3. Evidence attached and accessible to reviewer.\n4. Reviewer decision recorded with rationale.' },
      { id: 'sec-2', title: 'Reviewer Responsibilities', body: 'Reviewers must confirm evidence quality, not just presence. A link to a blank document does not constitute acceptable evidence.' },
      { id: 'sec-3', title: 'Return Path', body: 'If closure criteria are not met, the reviewer returns the item with a correction note. The Associate must address the gap and re-request closure review.' }
    ],
    versionHistory: [
      { version: '2.0', date: '2026-01-10', summary: 'Expanded reviewer responsibilities section.', reviewer: 'Quality Governance Lead', status: 'Effective' },
      { version: '1.0', date: '2025-06-01', summary: 'Initial release.', reviewer: 'Platform Governance', status: 'Superseded' }
    ]
  },
  {
    id: 'DET-KNO-005',
    assetId: 'KNO-005',
    content: 'The Blocker Resolution Playbook provides practical execution steps for identifying, owning, resolving, and escalating blockers in DWS.01.',
    workApplication: 'Applies whenever a task is blocked. Used by Associates to structure the resolution path and by Leads to facilitate blocker review sessions.',
    reviewExpectation: 'No formal review required. Leads review blocker status during working sessions and delivery reviews.',
    acknowledgementExpectation: 'Not required. Recommended reading for all Associates working on delivery tasks.',
    evidenceOutput: 'Blocker reason, owner, next action, escalation path, resolution note.',
    sections: [
      { id: 'sec-1', title: 'Flagging a Blocker', body: 'Flag the task as Blocked in DWS.01. Record the blocker reason, immediate next action, and assign a blocker owner (may differ from task owner).' },
      { id: 'sec-2', title: 'Resolution Path', body: 'Follow up within 1 business day. Escalate to Lead if unresolved after 2 business days. Use the escalation path recorded at the time of flagging.' },
      { id: 'sec-3', title: 'Resolution Note', body: 'Record the resolution note explaining what was done and how the blocker was resolved. Update the task status and unblock.' }
    ],
    versionHistory: [
      { version: '3.1', date: '2026-04-01', summary: 'Added automatic escalation threshold.', reviewer: 'Delivery Lead', status: 'Effective' },
      { version: '3.0', date: '2025-10-01', summary: 'Restructured for DWS.01 v2 model.', reviewer: 'Platform Governance', status: 'Superseded' }
    ]
  }
];

// ── 6.5 Applicability Records ────────────────────────────────────────────────

export const applicabilityRecords: ApplicabilityRecord[] = [
  {
    id: 'APP-001',
    assetId: 'KNO-001',
    workTypes: ['Tasks', 'Reviews', 'Closure'],
    roles: ['Associate', 'Lead'],
    contexts: ['Task creation', 'Task closure', 'Associate onboarding'],
    acknowledgementRequired: true,
    exceptionPath: 'Request clarification from Knowledge Content Owner'
  },
  {
    id: 'APP-002',
    assetId: 'KNO-002',
    workTypes: ['Tasks', 'Requests', 'Closure'],
    roles: ['Associate', 'Lead', 'Service Owner'],
    contexts: ['Task closure', 'Request closure', 'Audit review'],
    acknowledgementRequired: false,
    exceptionPath: 'Record evidence exception reason with Lead approval'
  },
  {
    id: 'APP-003',
    assetId: 'KNO-003',
    workTypes: ['Requests', 'Fulfilment', 'SLA'],
    roles: ['Associate', 'Service Owner', 'Lead'],
    contexts: ['Request submission', 'Fulfilment review', 'SLA management'],
    acknowledgementRequired: false,
    exceptionPath: 'Escalate to fulfilment owner'
  },
  {
    id: 'APP-004',
    assetId: 'KNO-004',
    workTypes: ['Closure', 'Reviews'],
    roles: ['Lead', 'Associate'],
    contexts: ['Closure review', 'Evidence check', 'Quality review'],
    acknowledgementRequired: true,
    exceptionPath: 'Return item for missing evidence with correction note'
  },
  {
    id: 'APP-005',
    assetId: 'KNO-005',
    workTypes: ['Tasks', 'Escalations'],
    roles: ['Associate', 'Lead'],
    contexts: ['Blocked tasks', 'Escalation review', 'Delivery flow review'],
    acknowledgementRequired: false,
    exceptionPath: 'Escalate blocker to Lead if unresolved after 2 business days'
  }
];

// ── 6.6 Linked Work Records ──────────────────────────────────────────────────

export const linkedWorkRecords: LinkedWorkRecord[] = [
  {
    id: 'LNK-001',
    knowledgeId: 'KNO-001',
    targetId: 'TSK-2401',
    targetTitle: 'Improve task closure quality',
    targetType: 'Task',
    targetStatus: 'In Progress',
    targetOwner: 'Associate'
  },
  {
    id: 'LNK-002',
    knowledgeId: 'KNO-001',
    targetId: 'TSK-2403',
    targetTitle: 'Review delivery evidence checklist',
    targetType: 'Task',
    targetStatus: 'Review Requested',
    targetOwner: 'Associate'
  },
  {
    id: 'LNK-003',
    knowledgeId: 'KNO-003',
    targetId: 'REQ-2401',
    targetTitle: 'Access & Permission Request',
    targetType: 'Request',
    targetStatus: 'Pending Approval',
    targetOwner: 'Associate'
  },
  {
    id: 'LNK-004',
    knowledgeId: 'KNO-004',
    targetId: 'TSK-2405',
    targetTitle: 'Closure Quality Review',
    targetType: 'Task',
    targetStatus: 'Closure Review',
    targetOwner: 'Lead'
  },
  {
    id: 'LNK-005',
    knowledgeId: 'KNO-005',
    targetId: 'TSK-2404',
    targetTitle: 'Governance Follow-up',
    targetType: 'Task',
    targetStatus: 'Blocked',
    targetOwner: 'Associate'
  }
];

// ── 6.7 Related Knowledge Records ───────────────────────────────────────────

export const relatedKnowledgeRecords: RelatedKnowledgeRecord[] = [
  { id: 'REL-001', fromAssetId: 'KNO-001', toAssetId: 'KNO-002', relationship: 'Supporting evidence standard' },
  { id: 'REL-002', fromAssetId: 'KNO-001', toAssetId: 'KNO-007', relationship: 'Related GHC behaviour reference' },
  { id: 'REL-003', fromAssetId: 'KNO-002', toAssetId: 'KNO-004', relationship: 'Related closure evidence standard' },
  { id: 'REL-004', fromAssetId: 'KNO-003', toAssetId: 'KNO-005', relationship: 'Related blocker escalation playbook' },
  { id: 'REL-005', fromAssetId: 'KNO-008', toAssetId: 'KNO-006', relationship: 'Related delivery review template' }
];

// ── 6.8 Feedback Records ─────────────────────────────────────────────────────

export const knowledgeFeedbackRecords: KnowledgeFeedbackRecord[] = [
  {
    id: 'FDB-1001',
    assetId: 'KNO-001',
    feedbackType: 'Useful',
    submittedBy: 'Associate',
    status: 'Logged',
    createdAt: '2026-05-25T10:00:00Z'
  },
  {
    id: 'FDB-1002',
    assetId: 'KNO-008',
    feedbackType: 'Outdated',
    submittedBy: 'Associate',
    status: 'Pending Review',
    comment: 'The 6xD phase references are outdated — phase naming has changed since the last update.',
    createdAt: '2026-05-26T11:30:00Z'
  },
  {
    id: 'FDB-1003',
    assetId: 'KNO-003',
    feedbackType: 'Missing Detail',
    submittedBy: 'Lead',
    status: 'Pending Review',
    comment: 'Does not explain the SLA clock reset behaviour after a return.',
    createdAt: '2026-05-20T09:15:00Z'
  },
  {
    id: 'FDB-1004',
    assetId: 'KNO-005',
    feedbackType: 'Unclear',
    submittedBy: 'Associate',
    status: 'Update Requested',
    comment: 'The escalation path in section 2 is ambiguous — unclear when to involve Exec vs Lead.',
    createdAt: '2026-05-15T14:45:00Z'
  },
  {
    id: 'FDB-1005',
    assetId: 'KNO-006',
    feedbackType: 'Wrong Owner',
    submittedBy: 'Associate',
    status: 'Pending Owner Review',
    comment: 'This template appears to be managed by Delivery Operations, not Knowledge Content Owner.',
    createdAt: '2026-05-27T08:00:00Z'
  }
];

// ── 6.9 Knowledge Review Queue ───────────────────────────────────────────────

export const knowledgeReviewQueue: KnowledgeReviewQueueItem[] = [
  {
    id: 'KRQ-3001',
    assetId: 'KNO-008',
    assetTitle: '6xD Deployment Reference',
    queueReason: 'Outdated flag',
    feedbackType: 'Outdated',
    owner: 'Knowledge Content Owner',
    slaDue: 'Due in 3 days',
    status: 'Pending Review'
  },
  {
    id: 'KRQ-3002',
    assetId: 'KNO-003',
    assetTitle: 'Request Fulfilment Process Reference',
    queueReason: 'Missing detail',
    feedbackType: 'Missing Detail',
    owner: 'Knowledge Content Owner',
    slaDue: 'Due tomorrow',
    status: 'Update Required'
  },
  {
    id: 'KRQ-3003',
    assetId: 'KNO-005',
    assetTitle: 'Blocker Resolution Playbook',
    queueReason: 'Unclear guidance',
    feedbackType: 'Unclear',
    owner: 'Knowledge Content Owner',
    slaDue: 'Due in 5 days',
    status: 'Review Scheduled'
  },
  {
    id: 'KRQ-3004',
    assetId: 'KNO-006',
    assetTitle: 'Weekly Delivery Review Template',
    queueReason: 'Wrong owner',
    feedbackType: 'Wrong Owner',
    owner: 'Knowledge Content Owner',
    slaDue: 'Due in 2 days',
    status: 'Owner Review'
  }
];

// ── 6.10 Acknowledgement Records ─────────────────────────────────────────────

export const acknowledgementRecords: AcknowledgementRecord[] = [
  {
    id: 'ACK-7001',
    assetId: 'KNO-009',
    userId: 'USR-001',
    userLabel: 'Associate',
    required: true,
    state: 'Acknowledged'
  },
  {
    id: 'ACK-7002',
    assetId: 'KNO-001',
    userId: 'USR-001',
    userLabel: 'Associate',
    required: true,
    state: 'Pending'
  },
  {
    id: 'ACK-7003',
    assetId: 'KNO-004',
    userId: 'USR-002',
    userLabel: 'Lead',
    required: true,
    state: 'Acknowledged'
  }
];

// ── 6.11 Executive Signal Records ────────────────────────────────────────────

export const knowledgeExecutiveSignals: KnowledgeExecutiveSignal[] = [
  { id: 'SIG-KNO-9001', signal: 'Knowledge assets opened this week', value: 42, trend: '+7', status: 'info', linksTo: 'Knowledge Marketplace' },
  { id: 'SIG-KNO-9002', signal: 'Assets linked to work', value: 18, trend: '+3', status: 'success', linksTo: 'Linked Work' },
  { id: 'SIG-KNO-9003', signal: 'Outdated flags pending', value: 3, trend: '+1', status: 'warning', linksTo: 'Knowledge Review Queue' },
  { id: 'SIG-KNO-9004', signal: 'Acknowledgements pending', value: 6, trend: '-2', status: 'warning', linksTo: 'Acknowledgements' },
  { id: 'SIG-KNO-9005', signal: 'Effective references', value: 27, trend: '+2', status: 'success', linksTo: 'Knowledge Assets' },
  { id: 'SIG-KNO-9006', signal: 'Review overdue', value: 2, trend: '0', status: 'danger', linksTo: 'Knowledge Review Queue' }
];

// ── Suggested tasks from guide (legacy support) ──────────────────────────────

export const suggestedTasksFromGuide = [
  { id: 'TSK-2501', title: 'Implement Task Discipline Standard', templateId: 'TPL-001', category: 'Execution' },
  { id: 'TSK-2502', title: 'Review Closure Evidence Checklist', templateId: 'TPL-002', category: 'Review' },
  { id: 'TSK-2503', title: 'Complete Workspace Onboarding', templateId: 'TPL-006', category: 'Personal Work' }
];
