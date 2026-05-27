# Feature: Knowledge Discovery Marketplace to Work-Context Reference Flow -- Prototype Specific

## 10. Prototype Build Prompt

Target tool: Magic Patterns  
Stage: Specific  
Mode: Select Mode only  
Base prototype: https://dq-prod-dws-01-prototype.vercel.app/

Important: Do not paste all prompts at once. Apply the prompts in order, one selected screen/component at a time. Each prompt is intentionally narrow to avoid overwriting the existing DWS.01 shell.

This build prompt implements the Phase 3 scope for the Knowledge Discovery Marketplace:

1. Replace the table-based knowledge listing with card-based marketplace discovery.
2. Replace drawer/JSON details with a dedicated Knowledge Detail Page.
3. Move the existing action drawer actions into the Knowledge Detail Page action rail.
4. Add Open Reference / Guide Preview behaviour.
5. Add Attach to Task / Attach to Request and linked-knowledge state.
6. Add Start Task from Guide with selected knowledge pre-linked.
7. Add knowledge feedback and Knowledge Content Owner Review Queue.
8. Add Executive Knowledge Signal View.

---

## Global design system block to include in every Magic Patterns prompt

Use this design system exactly in every prompt below.

Brand & Visual System
- Primary: DQ Navy `#030F35`
- Secondary / CTA: DQ Orange `#FB5535`
- Background: `#FFFFFF`
- Surface: `#F6F6FB`
- Surface 2: `#FFFFFF`
- Text primary: `#111118`
- Text muted: `#5F607F`
- Text disabled: `#8385A1`
- Border: `#D8D9E6`
- Status success: `#16A34A`
- Status warning: `#D97706`
- Status danger: `#DC2626`
- Status info: `#2563EB`
- UI font: Plus Jakarta Sans, weights 400, 500, 600, 700
- Mono font: JetBrains Mono, weights 400, 500, used for knowledge IDs, version IDs, task IDs, request IDs, feedback IDs, acknowledgement IDs, review queue IDs, and audit references
- Card radius: 12px
- Panel / modal radius: 12px
- Button radius: 8px
- Badge / pill radius: 999px
- Base grid: 8px
- Standard card padding: 24px
- Feature/detail card padding: 32px
- Icon style: Lucide-style outline icons, 1.5px stroke
- Primary CTA: DQ Orange background `#FB5535`, white text, 8px radius, hover `#F24C2A`
- Navy CTA / secondary action: DQ Navy `#030F35`, white text, 8px radius
- Outline action: transparent, `#030F35` border, `#030F35` text
- Do not use orange as semantic status. Use success/warning/danger/info/neutral only for statuses.
- Use navy for headings and orange only for CTA, active state, and high-signal brand moments.

---

## Prompt 1 -- Knowledge Discovery Marketplace card-based listing

Screen: Knowledge Discovery Marketplace  
Component: Knowledge asset listing, filters, tabs, KPI strip, and Open behaviour

Replace the table-based knowledge listing with a card-based marketplace grid where each knowledge asset can be scanned, filtered, and opened into a dedicated detail page.

Design system:
Use the global DQ design system block above exactly. Keep the existing DWS.01 shell header, Marketplaces dropdown, Discovery Search, notifications, persona switcher, and user menu unchanged.

Layout:
- Apply Select Mode to the existing Knowledge Discovery Marketplace screen.
- Keep the current page title and subtitle direction.
- Keep the KPI strip but ensure it visually aligns with the DQ card style.
- Keep the category tabs, but make them filter the card grid.
- Keep the filter panel on the left if it already exists.
- Replace the knowledge table with a responsive card grid.
- Card grid: 3 columns on desktop, 2 columns on tablet, 1 column on mobile.
- Page background: `#F6F6FB`.
- Card background: white, 12px radius, 1px `#D8D9E6` border, 24px padding.
- Card hover: subtle border darkening and shadow lift, 160ms ease-out.

Components:
- KnowledgeMarketplaceHeader: title `Knowledge Discovery`, subtitle explaining approved guidance, standards, playbooks, templates, and workspace references.
- KnowledgeKpiStrip: 4 KPI cards using current values: Knowledge Assets, Effective References, Under Review, Linked to Work.
- KnowledgeCategoryTabs: All, Guidelines, Operating Standards, Process References, Evidence Standards, Playbooks, Templates, GHC References, 6xD References, Workspace Guides, Learning References.
- KnowledgeFilterPanel: search, recommended-for-role toggle, knowledge type, review status, usage context, read time, owner, feedback state, clear filters, result count.
- KnowledgeCard: type badge, status pill, title, summary, owner, last reviewed, review due, read time, tags, applicability chips, linked work count, feedback marker, Open CTA.
- KnowledgeTypeBadge: shows asset type.
- KnowledgeStatusPill: maps status to semantic status colour.
- ApplicabilityChip: shows Tasks, Requests, Approvals, Onboarding, Support, Governance, Closure, Workspace.
- LinkedWorkCount: shows count and small link icon.
- FeedbackMarker: shows Useful, Has outdated flags, Needs review, or No feedback.
- EmptyState: icon, title `No knowledge assets match these filters`, message, `Clear filters` CTA.

Fixture data for this component:
Knowledge assets:
1. `KNO-001` -- Agile TMS Task Discipline Guide -- Type: Guideline -- Status: Effective -- Owner: Knowledge Content Owner -- Tags: GHC, Task Quality, Closure -- Linked work: 2 -- Read time: 7 min -- Applicability: Tasks, Reviews, Closure -- Feedback: Useful
2. `KNO-002` -- Evidence Attachment Standard -- Type: Operating Standard -- Status: Effective -- Owner: Knowledge Content Owner -- Tags: Evidence, Closure, Audit -- Linked work: 3 -- Read time: 6 min -- Applicability: Tasks, Requests, Closure -- Feedback: Useful
3. `KNO-003` -- Request Fulfilment Process Reference -- Type: Process Reference -- Status: Under Review -- Owner: Knowledge Content Owner -- Tags: Requests, SLA, Routing -- Linked work: 1 -- Read time: 9 min -- Applicability: Requests, Fulfilment, SLA -- Feedback: Missing detail
4. `KNO-004` -- Closure Evidence Standard -- Type: Evidence Standard -- Status: Effective -- Owner: Knowledge Content Owner -- Tags: Evidence, Review, Closure -- Linked work: 1 -- Read time: 5 min -- Applicability: Closure, Reviews -- Feedback: Useful
5. `KNO-005` -- Blocker Resolution Playbook -- Type: Playbook -- Status: Effective -- Owner: Knowledge Content Owner -- Tags: Blockers, Escalation, Delivery -- Linked work: 1 -- Read time: 8 min -- Applicability: Blockers, Escalations -- Feedback: Unclear
6. `KNO-006` -- Weekly Delivery Review Template -- Type: Template -- Status: Effective -- Owner: Knowledge Content Owner -- Tags: Review, Delivery, Team -- Linked work: 1 -- Read time: 4 min -- Applicability: Reviews, Team Delivery -- Feedback: Wrong owner
7. `KNO-007` -- GHC Execution Behaviour Reference -- Type: GHC Reference -- Status: Effective -- Owner: Knowledge Content Owner -- Tags: GHC, Behaviour, Execution -- Linked work: 1 -- Read time: 10 min -- Applicability: Tasks, Reviews, Governance -- Feedback: Useful
8. `KNO-008` -- 6xD Deployment Reference -- Type: 6xD Reference -- Status: Needs Update -- Owner: Knowledge Content Owner -- Tags: 6xD, Deploy, Delivery -- Linked work: 0 -- Read time: 12 min -- Applicability: Delivery, Deployment -- Feedback: Outdated
9. `KNO-009` -- Workspace Operating Guide -- Type: Workspace Guide -- Status: Effective -- Owner: Workspace Admin -- Tags: DWS.01, Rules, Onboarding -- Linked work: 0 -- Read time: 6 min -- Applicability: Workspace, Onboarding -- Feedback: Useful -- Acknowledgement: Required
10. `KNO-010` -- Task Quality Learning Reference -- Type: Learning Reference -- Status: Draft -- Owner: Knowledge Content Owner -- Tags: Learning, Task Quality -- Linked work: 0 -- Read time: 11 min -- Applicability: Learning, Task Quality -- Feedback: None

Status mapping:
- Effective -> success `#16A34A`
- Under Review -> warning `#D97706`
- Draft -> info `#2563EB`
- Needs Update -> warning `#D97706`
- Deprecated -> danger `#DC2626`

States:
- Default / Filled: show all 10 knowledge cards.
- Filtered: cards update based on active tab, filter chips, and search text.
- Empty: show EmptyState with Clear Filters CTA.
- Loading: show 6 skeleton cards.
- Error: show card with danger icon and message `Knowledge assets could not be loaded in prototype state.`

Interactions:
- Card click -> navigate to `/marketplaces/knowledge/:knowledgeId`.
- Open CTA click -> navigate to `/marketplaces/knowledge/:knowledgeId`.
- Category tab click -> filters cards by knowledge type and changes active tab underline to DQ Orange.
- Search input change -> filters by title, type, owner, tag, applicability, and summary.
- Filter chip click -> toggles filter and updates visible cards.
- Recommended-for-role toggle -> filters to assets relevant to active persona.
- Clear filters click -> resets search, tab, and filters.
- Deprecated or Needs Update asset click -> still opens detail page, but detail page must show warning banner.
- Remove table layout from this screen.
- Remove raw JSON detail drawer as the primary details experience.

Do not change:
- Global header
- Marketplaces dropdown
- Discovery Search
- Notifications
- Persona switcher
- User menu
- Existing Stage 0 landing page
- Existing Stage 2/3/4 sidebars
- Services Marketplace
- Task Template Marketplace
- Any component not named in this prompt

---

## Prompt 2 -- Dedicated Knowledge Detail Page with action rail

Screen: Knowledge Detail Page  
Component: Dedicated page replacing the JSON/detail drawer and containing the action rail

Create a dedicated Knowledge Detail Page that converts shallow JSON-like details into structured user-facing guidance, trust metadata, linked work, feedback, and actions.

Design system:
Use the global DQ design system block above exactly. Keep the existing DWS.01 shell header unchanged.

Layout:
- Route pattern: `/marketplaces/knowledge/:knowledgeId`.
- No left sidebar on this Stage 1 marketplace detail page.
- Page background: `#F6F6FB`.
- Content max-width: 1440px.
- Page padding: 32px desktop minimum.
- Breadcrumb row: `Marketplaces / Knowledge / <Knowledge Asset Title>`.
- Hero card spans full width: white, 12px radius, 32px padding, border `#D8D9E6`.
- Main layout below hero: 8-column content area + 4-column sticky action rail.
- Main column cards: white, 12px radius, 24px padding, 24px vertical gap.
- Sticky action rail: white, 12px radius, 24px padding, sticky top 88px.

Components:
- KnowledgeDetailHero: breadcrumb, type badge, status pill, title, short purpose, owner, last reviewed, review due, read time, tags, linked work count.
- StatusWarningBanner: appears for Needs Update, Under Review, Deprecated.
- PurposeSummaryCard: plain-language asset purpose.
- ApplicabilityCard: applicable work types, applicable roles, contexts, acknowledgement requirement, exception path.
- WhenToUseCard: concrete scenarios where this asset applies.
- WhenNotToUseCard: wrong-use scenarios and related alternatives.
- CoreGuidancePreview: structured content blocks with key principles, required behaviour, examples, common mistakes, and exception guidance. No raw JSON.
- EvidenceExpectationCard: expected output/evidence/record and closure impact.
- ReviewAcknowledgementCard: acknowledgement requirement, reviewer expectation, approval expectation where relevant.
- WorkApplicationCard: explains how asset supports tasks, requests, approvals, onboarding, support, governance, or closure.
- LinkedWorkPanel: shows specific linked tasks/requests/workflows.
- RelatedKnowledgeGrid: compact cards for related knowledge assets.
- GovernanceTrustPanel: owner, reviewer, version, lifecycle state, permission scope, last review, next review.
- VersionHistoryList: version ID, date, change summary, reviewer, status.
- KnowledgeFeedbackPanel: useful, unclear, outdated, missing detail, wrong owner options with comment field.
- KnowledgeActionRail: Open Reference, Attach to Task, Attach to Request, Start Task from Guide, Acknowledge Guidance, Request Knowledge Update, Flag Outdated Content, governance metadata.

Fixture data for this component:
Knowledge detail records:
1. `DET-KNO-001` / `KNO-001` Agile TMS Task Discipline Guide
   - Purpose: Explains how DQ tasks should be structured, updated, evidenced, reviewed, and closed.
   - Applicability: Tasks, closure quality, task review, Associate onboarding.
   - Evidence/output expectation: Task output statement, checklist completion, evidence link, closure note.
   - Acknowledgement: Required for onboarding.
   - Exception path: Request clarification from Knowledge Content Owner.
   - Related assets: `KNO-002`, `KNO-007`.
   - Linked work: `TSK-2401`, `TSK-2403`.
2. `DET-KNO-002` / `KNO-002` Evidence Attachment Standard
   - Purpose: Defines what counts as acceptable evidence when closing work.
   - Applicability: Tasks, requests, reviews, closure quality.
   - Evidence/output expectation: Evidence link, artefact reference, owner confirmation, review note where required.
   - Acknowledgement: Not required.
   - Exception path: Record evidence exception reason.
   - Related assets: `KNO-004`.
3. `DET-KNO-003` / `KNO-003` Request Fulfilment Process Reference
   - Purpose: Explains how internal requests move through intake, routing, fulfilment, SLA, and closure.
   - Applicability: Requests, fulfilment queues, SLA review, support operations.
   - Evidence/output expectation: Request status, owner note, fulfilment evidence, closure outcome.
   - Status: Under Review.
   - Exception path: Escalate to fulfilment owner.
4. `DET-KNO-004` / `KNO-004` Closure Evidence Standard
   - Purpose: Defines evidence expectations before a task or request can be closed.
   - Applicability: Closure reviews, evidence checks, quality review.
   - Evidence/output expectation: Evidence completeness, output summary, reviewer decision.
   - Acknowledgement: Required for closure reviewers.
5. `DET-KNO-005` / `KNO-005` Blocker Resolution Playbook
   - Purpose: Provides practical steps for identifying, owning, resolving, and escalating blockers.
   - Applicability: Blocked tasks, escalations, delivery flow reviews.
   - Evidence/output expectation: Blocker reason, owner, next action, escalation path, resolution note.

Linked work rows:
- `LNK-001` -- `KNO-001` -> `TSK-2401` Improve task closure quality -- Task -- In Progress
- `LNK-002` -- `KNO-001` -> `TSK-2403` Review delivery evidence checklist -- Task -- Review Requested
- `LNK-003` -- `KNO-003` -> `REQ-2401` Access & Permission Request -- Request -- Pending Approval
- `LNK-004` -- `KNO-004` -> `TSK-2405` Closure Quality Review -- Task -- Closure Review
- `LNK-005` -- `KNO-005` -> `TSK-2404` Governance Follow-up -- Task -- Blocked

Related knowledge rows:
- `REL-001` -- `KNO-001` -> `KNO-002` Supporting evidence standard
- `REL-002` -- `KNO-001` -> `KNO-007` Related GHC behaviour reference
- `REL-003` -- `KNO-002` -> `KNO-004` Related closure evidence standard
- `REL-004` -- `KNO-003` -> `KNO-005` Related blocker escalation playbook
- `REL-005` -- `KNO-008` -> `KNO-006` Related delivery review template

States:
- Default / Filled: render selected knowledge detail with all sections.
- Needs Update: show warning banner and action `Request Knowledge Update` emphasized.
- Under Review: show warning banner `This asset is under review. Confirm applicability before use.`
- Deprecated: show danger banner and related alternatives.
- Missing asset: show EmptyState with title `Knowledge asset not found` and CTA `Back to Knowledge Marketplace`.
- No linked work: show muted empty state inside LinkedWorkPanel.
- No related knowledge: show muted empty state inside RelatedKnowledgeGrid.
- Loading: skeleton hero, skeleton action rail, and skeleton content cards.
- Error: danger card `Knowledge detail could not be loaded in prototype state.`

Interactions:
- Open Reference click -> navigate to `/knowledge/:knowledgeId/reference`.
- Attach to Task click -> open AttachKnowledgeModal in task mode or navigate to `/knowledge/:knowledgeId/attach?target=task`.
- Attach to Request click -> open AttachKnowledgeModal in request mode or navigate to `/knowledge/:knowledgeId/attach?target=request`.
- Start Task from Guide click -> navigate to `/tasks/create/from-knowledge/:knowledgeId`.
- Acknowledge Guidance click -> update acknowledgement state to Acknowledged and show toast `Guidance acknowledged`.
- Request Knowledge Update click -> open feedback/update panel with feedback type preselected as Missing detail.
- Flag Outdated Content click -> open feedback/update panel with feedback type preselected as Outdated.
- Feedback Submit click -> create feedback item in prototype state and show toast `Feedback routed to Knowledge Content Owner`.
- Related asset click -> navigate to related asset detail page.
- Linked work click -> open task/request detail link if available, otherwise show toast `Linked work opened in prototype state`.
- Breadcrumb Knowledge click -> return to Knowledge Discovery Marketplace.

Do not change:
- Knowledge Discovery cards except navigation target from Prompt 1
- Global header
- Marketplace dropdown
- Discovery Search
- Persona switcher
- Services Marketplace
- Task Template Marketplace
- Existing task/request pages beyond linked-knowledge prompt later
- Any component not named in this prompt

---

## Prompt 3 -- Open Reference / Guide Preview

Screen: Open Reference / Guide Preview  
Component: Structured reference preview page for a selected knowledge asset

Create a structured reference preview page opened from the Knowledge Detail Page. It should present readable guidance content, not JSON or a document dump.

Design system:
Use the global DQ design system block above exactly.

Layout:
- Route pattern: `/knowledge/:knowledgeId/reference`.
- Page background: `#F6F6FB`.
- Content max-width: 1200px.
- Header card: asset title, type, status, owner, version, last reviewed, read time, back link.
- Main content: white content card with structured sections.
- Right rail or top action row: Attach to Task, Attach to Request, Start Task from Guide, Back to Detail.
- Do not render raw JSON.

Components:
- ReferenceHeader: asset ID in mono, title, type badge, status pill, version, owner, review metadata.
- ReferenceSectionNav: small sticky section list: Summary, Principles, Steps, Evidence, Examples, Exceptions, Related.
- StructuredReferenceBody: renders readable content blocks.
- GuidanceBlock: title, paragraph, optional bullet list, optional example card.
- EvidenceExpectationBlock: expected evidence/output, accepted examples, exception path.
- ExampleComparisonBlock: good example vs weak example where useful.
- SourceVersionBlock: source, version, reviewed by, last reviewed, next review.
- ReferenceActionRow: Attach to Task, Attach to Request, Start Task from Guide, Back to Detail.

Fixture data for this component:
Use these preview sections for `KNO-001` Agile TMS Task Discipline Guide:
- Summary: Tasks in DWS.01 must be structured so ownership, output, evidence, review, and closure can be tracked.
- Key principles:
  1. Every task needs a clear purpose.
  2. Every task needs an accountable owner.
  3. Every task needs an expected output.
  4. Every task needs due date or SLA guidance.
  5. Every task needs checklist or CLI structure.
  6. Every closure needs evidence or a reasoned exception.
- Required task structure: Purpose -> Expected output -> Checklist -> Evidence -> Review -> Closure note.
- Good example: `Build request submission validation and attach evidence of completed validation test.`
- Weak example: `Fix request stuff.`
- Evidence expectation: output artefact, screenshot, link, review note, or closure statement.
- Exception path: if evidence is unavailable, record reason and reviewer confirmation.

Use these preview sections for `KNO-002` Evidence Attachment Standard:
- Summary: Evidence should prove that work was completed, reviewed, or accepted.
- Accepted evidence: document link, screenshot, test result, approval note, output artefact, meeting decision.
- Weak evidence: vague comments, unlinked files, unsupported claims.
- Closure impact: required evidence must be present before closure-ready state unless exception is recorded.

States:
- Preview: structured preview shown with action row.
- Full Reference: expanded sections shown when user clicks `Show full reference`.
- Needs Update: warning banner at top.
- Deprecated: danger banner and related alternatives.
- Loading: skeleton header and content blocks.
- Missing reference: EmptyState with `Back to Knowledge Detail` CTA.

Interactions:
- Back to Detail click -> navigate to `/marketplaces/knowledge/:knowledgeId`.
- Attach to Task click -> open attach flow for task.
- Attach to Request click -> open attach flow for request.
- Start Task from Guide click -> navigate to `/tasks/create/from-knowledge/:knowledgeId`.
- Section nav click -> scroll to the selected section.
- Show full reference click -> expands additional guidance blocks in prototype state.
- Copy reference link click -> show toast `Reference link copied`.

Do not change:
- Knowledge Discovery Marketplace
- Knowledge Detail Page except Open Reference link
- Existing task/request pages
- Global header and persona switcher
- Any component not named in this prompt

---

## Prompt 4 -- Attach Knowledge to Task / Request and linked-knowledge work context

Screen: Attach Knowledge Flow and Work Item Linked Knowledge View  
Component: AttachKnowledgeModal and linked knowledge panel inside task/request context

Add a thin prototype flow that allows an Associate to attach a knowledge asset to an active task or request and then see that linked knowledge inside the work item context.

Design system:
Use the global DQ design system block above exactly.

Layout:
- Attach route pattern: `/knowledge/:knowledgeId/attach` or modal launched from Knowledge Detail Page.
- Modal width: 880px, 12px radius, white background, max-height 80vh, scrollable content.
- Modal header: selected knowledge title, type badge, status pill, selected target type.
- Target selector tabs: Tasks | Requests.
- Target list: cards or table rows with ID, title, owner, status, due/SLA, current linked knowledge count.
- Footer: Cancel, Attach Knowledge.
- Work Item Linked Knowledge View should appear as a card/panel inside task/request detail.

Components:
- AttachKnowledgeModal: selected knowledge asset context, target selector, target list, attach confirmation.
- TargetTypeTabs: Tasks / Requests.
- TargetWorkItemRow: ID in mono, title, type, owner, status, due/SLA, linked knowledge count, select radio.
- AttachConfirmationState: shows asset linked to target.
- WorkItemLinkedKnowledgePanel: appears inside task/request detail with linked asset chips/cards.
- LinkedKnowledgeCard: asset title, type, status, owner, applicability, Open Detail link.
- AttachmentToast: top-right success toast.

Fixture data for this component:
Target tasks:
1. `TSK-2401` -- Improve task closure quality -- Owner: Associate -- Status: In Progress -- Due: Due in 2 days -- Linked knowledge: `KNO-001`
2. `TSK-2403` -- Review delivery evidence checklist -- Owner: Associate -- Status: Review Requested -- Due: Due tomorrow -- Linked knowledge: `KNO-002`, `KNO-004`
3. `TSK-2404` -- Governance Follow-up -- Owner: Associate -- Status: Blocked -- Due: At risk -- Linked knowledge: `KNO-005`
4. `TSK-2406` -- Weekly Delivery Review -- Owner: Associate -- Status: Draft -- Due: Not set -- Linked knowledge: none

Target requests:
1. `REQ-2401` -- Access & Permission Request -- Owner: IT & Access Service Owner -- Status: Pending Approval -- SLA: Due tomorrow -- Linked knowledge: `KNO-003`
2. `REQ-2404` -- DWS Platform Support -- Owner: Platform Support Service Owner -- Status: In Fulfilment -- SLA: 3h remaining -- Linked knowledge: none
3. `REQ-2405` -- Onboarding Support Request -- Owner: People Operations Service Owner -- Status: Returned for Information -- SLA: At risk -- Linked knowledge: `KNO-009`

Attachment examples:
- Attach `KNO-001` to `TSK-2406` -> new linked work record `LNK-006`.
- Attach `KNO-002` to `REQ-2404` -> new linked work record `LNK-007`.

States:
- Default: target selector shown with tasks tab active.
- Target selected: Attach Knowledge CTA enabled.
- No targets: EmptyState with `Start Task from Guide` CTA.
- Validation error: Attach clicked with no target selected; show inline message `Select a task or request to attach this asset.`
- Attached: confirmation state with asset title, target ID, target title, and Open Work Item CTA.
- Loading: skeleton target rows.
- Error: danger banner `Knowledge could not be attached in prototype state.`

Interactions:
- Attach to Task click from detail page -> open modal with Tasks tab active.
- Attach to Request click from detail page -> open modal with Requests tab active.
- Target row click -> select row and enable Attach Knowledge.
- Attach Knowledge click -> create link in prototype state, show confirmation and toast `Knowledge attached to work item`.
- Open Work Item click -> navigate to task/request detail if available, otherwise show toast `Work item opened in prototype state`.
- LinkedKnowledgeCard Open Detail click -> navigate back to Knowledge Detail Page.
- Cancel click -> close modal and return to Knowledge Detail Page.

Do not change:
- Full task detail page structure except adding LinkedKnowledgePanel if selected
- Full request detail page structure except adding LinkedKnowledgePanel if selected
- Task creation flow except Start Task from Guide prompt later
- Knowledge Marketplace cards
- Knowledge Detail Page except attach action launch
- Global header and persona switcher
- Any component not named in this prompt

---

## Prompt 5 -- Start Task from Guide

Screen: Start Task from Guide Flow  
Component: Task creation with selected knowledge pre-linked

Add a thin task creation flow that starts from a knowledge guide and creates a prototype task with the selected knowledge asset pre-linked.

Design system:
Use the global DQ design system block above exactly.

Layout:
- Route pattern: `/tasks/create/from-knowledge/:knowledgeId`.
- Reuse the existing DWS.01 task creation wizard visual pattern where available.
- Page background: `#F6F6FB`.
- Content max-width: 1200px.
- Top banner: selected knowledge asset context.
- Main form card: task title, purpose, owner, due date, priority, suggested checklist/evidence, review path.
- Right rail: linked knowledge summary, applicability, evidence expectation, acknowledgement state.
- Footer actions: Back, Save Draft, Create Task.

Components:
- KnowledgeContextBanner: shows asset title, ID, type, status, owner, applicability, message `This task will be created with the selected knowledge pre-linked.`
- PrefilledTaskFields: suggested task title, purpose, expected output, owner, due date, priority.
- SuggestedChecklistFromGuide: checklist suggestions derived from asset guidance.
- SuggestedEvidenceExpectation: evidence/output expectations from asset.
- LinkedKnowledgeSummaryRail: selected knowledge, related assets, acknowledgement requirement.
- TaskReviewCreateSummary: shows task details and linked knowledge before creation.
- TaskCreatedFromGuideConfirmation: task ID, linked knowledge, owner, due date, status, CTAs.

Fixture data for this component:
Selected knowledge examples:
1. `KNO-001` Agile TMS Task Discipline Guide
   - Suggested task title: `Apply Agile TMS task discipline to active delivery work`
   - Suggested purpose: `Structure and evidence the task so ownership, expected output, checklist, and closure quality are clear.`
   - Suggested checklist:
     1. Confirm task purpose and expected output
     2. Add checklist or CLI items
     3. Link evidence or evidence expectation
     4. Add closure criteria
     5. Request review if required
   - Evidence expectation: task output statement, checklist completion, evidence link, closure note
   - Review path: Review required if used for closure-quality improvement
2. `KNO-002` Evidence Attachment Standard
   - Suggested task title: `Attach and validate evidence for work closure`
   - Suggested checklist:
     1. Identify required evidence
     2. Attach evidence link or artefact
     3. Record evidence exception if unavailable
     4. Request review
   - Evidence expectation: document link, screenshot, test result, approval note, or output artefact
3. `KNO-005` Blocker Resolution Playbook
   - Suggested task title: `Resolve active delivery blocker`
   - Suggested checklist:
     1. Define blocker reason
     2. Assign blocker owner
     3. Set next action
     4. Escalate if unresolved
     5. Record resolution note

Generated task records:
- `TSK-2501` -- Created from `KNO-001` -- Status: Draft -- Owner: Associate -- Linked knowledge: `KNO-001`
- `TSK-2502` -- Created from `KNO-002` -- Status: In Progress -- Owner: Associate -- Linked knowledge: `KNO-002`
- `TSK-2503` -- Created from `KNO-005` -- Status: In Progress -- Owner: Associate -- Linked knowledge: `KNO-005`

States:
- Prefilled: task fields populated from selected knowledge guide.
- Edited: user changes allowed task fields; show `Edited from guide suggestion` marker.
- Validation error: Create Task clicked with missing title or owner; show danger border and inline message.
- Draft saved: show toast `Draft task saved with linked knowledge`.
- Created: confirmation card with task ID and linked knowledge.
- Loading: skeleton context banner and form.
- Missing knowledge: EmptyState with Back to Knowledge Marketplace CTA.

Interactions:
- Back click -> return to Knowledge Detail Page.
- Save Draft click -> generate draft task ID and show toast.
- Create Task click -> validate required fields, generate task ID, show confirmation.
- View Task click -> navigate to `/tasks/:taskId` or show task detail prototype state.
- Open Linked Knowledge click -> navigate to Knowledge Detail Page.
- Remove linked knowledge click -> disabled by default; show tooltip `Knowledge selected from guide remains linked unless removed from task detail.`
- Edit field click -> allow instance-level editing and show edited marker.

Do not change:
- Existing full task template marketplace
- Existing task creation flow except adding this knowledge-started route/state
- Knowledge Detail Page except Start Task from Guide link
- Work item linked knowledge panel except receiving newly created task link
- Global header and persona switcher
- Any component not named in this prompt

---

## Prompt 6 -- Knowledge Feedback State and Content Owner Review Queue

Screen: Knowledge Feedback State and Knowledge Content Owner Review Queue  
Component: Feedback capture and thin owner review queue

Add governed feedback capture from the Knowledge Detail Page and a thin Knowledge Content Owner Review Queue for outdated, unclear, missing-detail, useful, and wrong-owner feedback.

Design system:
Use the global DQ design system block above exactly.

Layout:
- Feedback can appear as a section on Knowledge Detail Page and as a modal/panel when launched from action rail.
- Review queue route pattern: `/knowledge/review`.
- Review queue page background: `#F6F6FB`, 32px padding, max-width 1440px.
- Review queue layout: KPI strip, tabs, feedback cards/table, selected feedback detail panel.
- Tabs: All, Outdated Flags, Missing Detail, Unclear, Wrong Owner, Review Due, Reviewed.

Components:
- KnowledgeFeedbackPanel: feedback options, comment field, severity selector, submit button.
- FeedbackTypeOption: Useful, Unclear, Outdated, Missing Detail, Wrong Owner.
- FeedbackSubmissionConfirmation: feedback ID, owner route, expected review timing.
- ReviewQueueKpiStrip: Pending Review, Update Requested, Outdated Flags, Review Overdue.
- KnowledgeReviewQueueTable: asset ID, title, feedback type, submitted by, due date, owner, status, action.
- ReviewQueueDetailPanel: selected feedback detail, asset summary, comment, related asset status, owner action.
- OwnerActionPanel: Mark Reviewed, Request Update, Change Status, Reassign Owner.
- ReviewDecisionHistory: shows actions taken in prototype state.

Fixture data for this component:
Feedback records:
1. `FDB-1001` -- `KNO-001` Agile TMS Task Discipline Guide -- Feedback Type: Useful -- Submitted By: Associate -- Status: Logged
2. `FDB-1002` -- `KNO-008` 6xD Deployment Reference -- Feedback Type: Outdated -- Submitted By: Associate -- Status: Pending Review
3. `FDB-1003` -- `KNO-003` Request Fulfilment Process Reference -- Feedback Type: Missing detail -- Submitted By: Reviewer / Lead -- Status: Pending Review
4. `FDB-1004` -- `KNO-005` Blocker Resolution Playbook -- Feedback Type: Unclear -- Submitted By: Associate -- Status: Update Requested
5. `FDB-1005` -- `KNO-006` Weekly Delivery Review Template -- Feedback Type: Wrong owner -- Submitted By: Associate -- Status: Pending Owner Review

Review queue records:
1. `KRQ-3001` -- `KNO-008` -- Queue Reason: Outdated flag -- Owner: Knowledge Content Owner -- SLA / Review Due: Due in 3 days -- Status: Pending Review
2. `KRQ-3002` -- `KNO-003` -- Queue Reason: Missing detail -- Owner: Knowledge Content Owner -- SLA / Review Due: Due tomorrow -- Status: Update Required
3. `KRQ-3003` -- `KNO-005` -- Queue Reason: Unclear guidance -- Owner: Knowledge Content Owner -- SLA / Review Due: Due in 5 days -- Status: Review Scheduled
4. `KRQ-3004` -- `KNO-006` -- Queue Reason: Wrong owner -- Owner: Knowledge Content Owner -- SLA / Review Due: Due in 2 days -- Status: Owner Review

States:
- Feedback default: no feedback selected, options visible.
- Feedback selected: comment field appears; Submit Feedback enabled.
- Feedback submitted: confirmation state and toast `Feedback routed to Knowledge Content Owner`.
- Queue filled: show all review queue rows.
- Queue empty: EmptyState `No knowledge feedback awaiting review`.
- Queue filtered: rows update by tab.
- Detail panel open: selected queue item details shown.
- Owner action success: status updates in prototype state and toast confirms action.
- Loading: skeleton KPI cards and table rows.
- Error: danger card `Knowledge feedback could not be loaded in prototype state.`

Interactions:
- Feedback option click -> selects type and reveals comment field.
- Submit Feedback click -> validates feedback type, creates feedback item, routes to queue if not Useful, shows confirmation.
- Useful feedback click -> logs feedback without creating urgent review item.
- Outdated / Missing Detail / Wrong Owner -> creates queue item with pending status.
- Review queue row click -> opens detail panel.
- Mark Reviewed click -> status changes to Reviewed, row moves to Reviewed tab.
- Request Update click -> status changes to Update Requested and toast `Update request logged`.
- Change Status click -> opens small status selector: Effective, Under Review, Needs Update, Deprecated.
- Reassign Owner click -> shows prototype toast `Owner reassignment captured in prototype state`.

Do not change:
- Full content editor
- Full version-control workflow
- Full approval workflow
- Knowledge Discovery Marketplace except feedback counts/markers if visible
- Knowledge Detail Page except feedback panel/action rail linkage
- Global header and persona switcher
- Any component not named in this prompt

---

## Prompt 7 -- Executive Knowledge Signal View

Screen: Executive Knowledge Signal View  
Component: Lightweight aggregate knowledge usage and quality signal view

Add a thin executive signal view that shows knowledge usage, linked-work adoption, outdated flags, acknowledgement gaps, and review health. This is not a full executive dashboard rebuild.

Design system:
Use the global DQ design system block above exactly.

Layout:
- Route pattern: `/intelligence/knowledge-signals`.
- Page background: `#F6F6FB`, 32px padding, max-width 1440px.
- Header: title `Knowledge Usage Signals`, subtitle explaining usage, work linkage, review health, and guidance quality.
- KPI strip: 6 cards across desktop, wrap on tablet/mobile.
- Main content: two-column layout.
  - Left: knowledge usage by type and linked-work adoption.
  - Right: outdated flags, acknowledgement gaps, review overdue.
- Bottom: content owner review health table and recurring feedback themes.

Components:
- ExecutiveKnowledgeSignalStrip: Knowledge assets opened, Assets linked to work, Outdated flags pending, Acknowledgements pending, Effective references, Review overdue.
- KnowledgeUsageByTypeGrid: type, opened count, linked-work count, trend.
- LinkedWorkAdoptionCard: tasks linked, requests linked, guides used to start tasks.
- ReviewHealthCard: effective, under review, needs update, deprecated, review overdue.
- FeedbackThemeTable: theme, affected assets, count, status.
- ContentOwnerReviewHealthTable: owner, pending review, overdue, update requested, reviewed this week.
- HighRiskKnowledgeBanner: appears if review overdue or outdated flags exceed threshold.

Fixture data for this component:
Executive signals:
1. `SIG-KNO-9001` -- Knowledge assets opened this week -- Value: 42 -- Status: Info
2. `SIG-KNO-9002` -- Assets linked to work -- Value: 18 -- Status: Success
3. `SIG-KNO-9003` -- Outdated flags pending -- Value: 3 -- Status: Warning
4. `SIG-KNO-9004` -- Acknowledgements pending -- Value: 6 -- Status: Warning
5. `SIG-KNO-9005` -- Effective references -- Value: 27 -- Status: Success
6. `SIG-KNO-9006` -- Review overdue -- Value: 2 -- Status: Danger

Usage by type:
- Guideline: 12 opened, 6 linked to work, trend +3
- Operating Standard: 8 opened, 5 linked to work, trend +2
- Process Reference: 5 opened, 2 linked to work, trend +1
- Evidence Standard: 6 opened, 3 linked to work, trend +2
- Playbook: 4 opened, 1 linked to work, trend flat
- Template: 3 opened, 1 linked to work, trend +1
- GHC Reference: 2 opened, 0 linked to work, trend flat
- 6xD Reference: 1 opened, 0 linked to work, trend -1
- Workspace Guide: 1 opened, 0 linked to work, trend flat

Feedback themes:
- Outdated deployment guidance -- Assets affected: `KNO-008` -- Count: 2 -- Status: Pending Review
- Missing fulfilment steps -- Assets affected: `KNO-003` -- Count: 1 -- Status: Update Required
- Unclear blocker escalation path -- Assets affected: `KNO-005` -- Count: 1 -- Status: Review Scheduled
- Wrong owner metadata -- Assets affected: `KNO-006` -- Count: 1 -- Status: Owner Review

Owner review health:
- Knowledge Content Owner -- Pending: 4 -- Overdue: 2 -- Update Requested: 2 -- Reviewed this week: 7
- Workspace Admin -- Pending: 1 -- Overdue: 0 -- Update Requested: 0 -- Reviewed this week: 2

States:
- Filled: show KPI strip, usage by type, review health, feedback themes, owner review health.
- No data: EmptyState `No knowledge usage signals yet`.
- High risk: show HighRiskKnowledgeBanner if Review overdue > 0 or Outdated flags pending > 2.
- Loading: skeleton KPI cards and content blocks.
- Error: danger card `Knowledge signals could not be loaded in prototype state.`

Interactions:
- KPI card click -> filters detail cards below by selected signal.
- Knowledge type row/card click -> highlight selected type and show linked asset examples.
- Outdated flags KPI click -> navigate to `/knowledge/review` filtered to Outdated Flags.
- Review overdue KPI click -> navigate to `/knowledge/review` filtered to Review Due.
- Owner review row click -> show toast `Owner review detail opened in prototype state`.
- Feedback theme row click -> navigate to Knowledge Review Queue detail if available.

Do not change:
- Existing CEO / Executive dashboard beyond adding this lightweight signal surface or link
- Full SLA dashboard
- Full knowledge management dashboard
- Knowledge Discovery Marketplace
- Knowledge Detail Page
- Content Owner Review Queue except linkage/filter target
- Global header and persona switcher
- Any component not named in this prompt

---

## Final QA checklist for Magic Patterns output

After applying the prompts, confirm the prototype demonstrates this flow:

1. Associate opens Knowledge Discovery Marketplace.
2. Knowledge assets are displayed as cards, not a table.
3. Each card has an Open CTA.
4. Open navigates to a dedicated Knowledge Detail Page.
5. The Knowledge Detail Page does not show raw JSON.
6. Detail page shows identity, purpose, applicability, when to use, when not to use, core guidance, evidence/output expectations, review/acknowledgement expectations, work application, linked work, related knowledge, governance/trust, version history, feedback, and actions.
7. The action drawer content has moved into the detail page right-side action rail.
8. Open Reference shows a structured guide preview.
9. Associate can attach knowledge to an active task or request.
10. Linked knowledge appears inside task/request context.
11. Associate can start a task from a guide with selected knowledge pre-linked.
12. Associate can submit useful/unclear/outdated/missing-detail/wrong-owner feedback.
13. Knowledge Content Owner can see feedback/update/outdated items in a review queue.
14. Executives can see aggregate knowledge usage and quality signals.
15. Review Checklist is not a standalone knowledge type.
16. Status colours use semantic colours only; orange is not used as a status colour.
17. No backend/API calls are introduced.
18. Existing shell header, marketplace dropdown, persona switcher, and unrelated pages remain unchanged.

STATUS: READY FOR APPROVAL
Saved: knowledge-discovery-marketplace-phase-4.md
