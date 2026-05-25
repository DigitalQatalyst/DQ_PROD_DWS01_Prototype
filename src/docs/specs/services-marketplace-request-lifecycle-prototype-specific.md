# Feature: Services Marketplace to Request Lifecycle Flow -- Prototype Specific

## Prototype Build Prompt

Target tool: Magic Patterns  
Stage: Specific  
Mode: Select Mode only  
Base prototype: https://dq-prod-dws-01-prototype.vercel.app/

Important: Do not paste all prompts at once. Apply the prompts in order, one selected screen/component at a time. Each prompt is intentionally narrow to avoid overwriting the existing DWS.01 shell.

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
- Mono font: JetBrains Mono, weights 400, 500, used for request IDs, service IDs, approval IDs, SLA codes, and audit references
- Card radius: 12px
- Modal / panel radius: 12px
- Button radius: 8px
- Badge / pill radius: 999px
- Base grid: 8px
- Standard card padding: 24px
- Feature/detail card padding: 32px
- Icon style: Lucide-style outline icons, 1.5px stroke
- Primary CTA: DQ Orange background `#FB5535`, white text, 8px radius, hover `#F24C2A`
- Navy CTA / secondary action: DQ Navy `#030F35`, white text, 8px radius
- Outline action: transparent, `#030F35` border, `#030F35` text
- Do not use orange as semantic status. Use only success/warning/danger/info for statuses.
- Use navy for headings and orange only for CTA, active state, and high-signal brand moments.

---

## Prompt 1 -- Service Catalogue card behaviour and CTA correction

Screen: Services Marketplace / Service Catalogue
Component: Service card grid, service filter panel, category tabs, and request CTA behaviour

Apply Select Mode to the existing Service Catalogue screen. Replace weak request-start behaviour with service cards that open a dedicated service detail page and use only the CTA label `Start Request`.

Design system:
Use the global DQ design system block above exactly. Keep the existing DWS.01 shell header, Marketplaces dropdown, Discovery Search, notifications, persona switcher, and user menu unchanged.

Layout:
- Keep the current page structure: page title, description, KPI strip, category tabs, filter panel, and service card grid.
- Use desktop-first layout at 1440px+.
- Keep the filter panel on the left and service cards in the main grid if this is the current layout.
- Cards use 3-column grid on desktop, 2-column on tablet, 1-column on mobile.
- Service cards: white background, 12px radius, 1px `#D8D9E6` border, 24px padding, top accent line 4px `#FB5535`, subtle navy-tinted shadow.

Components:
- ServiceCard: shows category badge, service title, short description, service owner, SLA badge, approval badge, risk badge, and one primary CTA: `Start Request`.
- CategoryBadge: uppercase 11px / 600, orange text, light orange surface.
- SlaBadge: semantic status mapping only:
  - On Track -> success `#16A34A`
  - At Risk -> warning `#D97706`
  - Breached -> danger `#DC2626`
  - Info / Standard -> info `#2563EB`
- ApprovalBadge:
  - Required -> warning
  - Conditional -> info
  - Not Required -> success
- ServiceOwnerLabel: muted metadata row with owner/team name.
- EmptyState: white card, dashed border `#D8D9E6`, 48px icon, title, message, `Clear filters` CTA.

Fixture data for this component:
Services:
1. `SVC-HRA-001` -- Onboarding Support Request -- Category: HRA Requests -- Owner: People Operations Service Owner -- SLA: 2 business days -- Approval: Conditional -- Risk: Standard
2. `SVC-IT-001` -- Access & Permission Request -- Category: IT & Access -- Owner: IT & Access Service Owner -- SLA: 1 business day -- Approval: Required for privileged access -- Risk: Standard
3. `SVC-PLAT-001` -- DWS Platform Support -- Category: Platform Support -- Owner: Platform Support Service Owner -- SLA: 4 business hours -- Approval: Not Required -- Risk: Standard
4. `SVC-KNOW-001` -- Knowledge / Content Update Request -- Category: Knowledge / Content -- Owner: Knowledge Governance Service Owner -- SLA: 3 business days -- Approval: Required for policy-impacting content -- Risk: Standard
5. `SVC-TASK-001` -- Task / Workflow Setup Support -- Category: Task / Workflow -- Owner: Workflow Governance Service Owner -- SLA: 1 business day -- Approval: Not Required -- Risk: Standard
6. `SVC-ADMIN-001` -- Workspace Configuration Request -- Category: Admin Requests -- Owner: Workspace Admin Service Owner -- SLA: 2 business days -- Approval: Required -- Risk: Governance-sensitive
7. `SVC-APP-001` -- Approval Request -- Category: Approvals -- Owner: Approval Governance Service Owner -- SLA: 1 business day -- Approval: Required -- Risk: Review-sensitive
8. `SVC-ESC-001` -- SLA Breach Escalation -- Category: Escalations -- Owner: Escalation Governance Owner -- SLA: 4 business hours -- Approval: Conditional -- Risk: At Risk

States:
- Default / Filled: show all 8 services.
- Filtered: category tabs and filter chips reduce visible service cards.
- Empty: no cards match filters; show EmptyState with `Clear filters` CTA.
- Loading: use skeleton cards, 3 across desktop.
- Error: show white card with danger icon and message `Services could not be loaded in prototype state.`

Interactions:
- Service card click -> navigate to the dedicated Service Detail Page for that service.
- `Start Request` button click -> navigate to `/requests/start/:serviceId` with selected service context.
- Category tab click -> filter visible cards and update active tab underline in orange.
- Filter chip click -> toggle active state and update visible cards.
- Search input change -> filter by service title, category, owner, and description.
- Clear filters click -> reset all filters and search input.
- Remove every `Provide Info` CTA and any generic `Information provided in prototype mode` toast from this flow.

Do not change:
- TopBar / global header
- Marketplaces dropdown
- Discovery Search
- Notifications
- Persona switcher
- User menu
- Existing Stage 0 landing page
- Existing sidebar behaviour on Stage 2/3/4 pages
- Any non-service marketplace pages
- Any component not named in this prompt

---

## Prompt 2 -- Dedicated Service Detail Page

Screen: Service Detail Page
Component: New dedicated service detail page replacing the drawer

Apply Select Mode to create a dedicated Service Detail Page for service categories. The drawer is no longer the primary details surface.

Design system:
Use the global DQ design system block above exactly. Keep the current DWS.01 shell header unchanged.

Layout:
- Route pattern: `/marketplaces/services/:serviceId`
- No left sidebar on this Stage 1 marketplace detail page.
- Page background: `#F6F6FB`.
- Content max-width: 1440px.
- Padding: 32px desktop minimum.
- Breadcrumb row: `Marketplaces / Services / <Service Name>` using 12px muted text.
- Main layout: 8-column content area + 4-column sticky metadata rail.
- Top hero summary card spans full width: white, 12px radius, 32px padding, border `#D8D9E6`.
- Main column cards: white cards, 12px radius, 24px padding, 24px vertical gap.
- Right metadata rail: sticky top 88px, white card, 12px radius, 24px padding, contains `Start Request` CTA at top and governance metadata below.

Components:
- ServiceDetailHero: category badge, service title, purpose summary, risk badge, SLA badge, approval badge.
- ServiceMetadataRail: `Start Request` CTA, owner, fulfilment queue, response SLA, fulfilment SLA, escalation trigger, approval path, audit note.
- WhenToUseCard: valid use cases.
- WhenNotToUseCard: invalid use cases and alternative service hints.
- RequiredInputsList: required and optional fields grouped separately.
- FulfilmentTimeline: Intake -> Triage -> Approval if needed -> Service Owner review -> Fulfilment -> Closure.
- ApprovalPathCard: approval requirement, approver role, review SLA, return/reject behaviour.
- RelatedKnowledgeCard: links to playbooks, templates, GHC/6xD references.
- RelatedServicesCard: alternative service cards with small `View service` links.
- AuditNoteCard: message that starting this request creates a DWS.01 request record with status, owner, SLA, evidence, and audit trail cues.

Fixture data for this component:
Service details:
1. `DET-IT-001` / `SVC-IT-001` -- Access & Permission Request
   - Purpose: Request system, application, workspace, or permission access.
   - When to use: new access, permission extension, role-based access update, temporary access, application permission issue.
   - When not to use: DWS defect or account lockout; use DWS Platform Support instead.
   - Required inputs: user name, system, access type, business reason, duration, urgency, manager/approver, evidence.
   - Owner: IT & Access Service Owner.
   - Queue: IT & Access Queue.
   - SLA: 1 business day.
   - Approval: Required for privileged access.
   - Escalation trigger: no owner action within 1 business day or privileged access risk.
2. `DET-PLAT-001` / `SVC-PLAT-001` -- DWS Platform Support
   - Purpose: Report DWS.01 issue, defect, access problem, or usage question.
   - Required inputs: issue type, affected page, screenshot/evidence, urgency, business impact, expected outcome.
   - Owner: Platform Support Service Owner.
   - Queue: Platform Support Queue.
   - SLA: 4 business hours.
   - Approval: Not required.
3. `DET-KNOW-001` / `SVC-KNOW-001` -- Knowledge / Content Update Request
   - Purpose: Request new or revised guidance, template, playbook, or reference.
   - Required inputs: content title, gap/problem, target users, impact, proposed change, owner, evidence.
   - Owner: Knowledge Governance Service Owner.
   - Queue: Knowledge Review Queue.
   - SLA: 3 business days.
   - Approval: Required for policy-impacting content.
4. `DET-ESC-001` / `SVC-ESC-001` -- SLA Breach Escalation
   - Purpose: Escalate overdue, blocked, or high-risk work needing intervention.
   - Required inputs: linked request/task ID, current owner, breach reason, business impact, evidence, expected resolution.
   - Owner: Escalation Governance Owner.
   - Queue: Escalation Review Queue.
   - SLA: 4 business hours.
   - Approval: Conditional.

States:
- Default / Filled: render selected service detail with all sections.
- Missing service: show EmptyState with title `Service not found` and CTA `Back to Service Catalogue`.
- Loading: render skeleton hero, skeleton right rail, and three skeleton content cards.
- Error: show danger state card `Service details could not be loaded in prototype state.`

Interactions:
- `Start Request` CTA click -> navigate to `/requests/start/:serviceId` and carry selected service context.
- Related service click -> load that service detail page.
- Related knowledge click -> show info toast `Reference opened in prototype state`.
- Breadcrumb `Services` click -> return to Service Catalogue.
- Sticky metadata rail remains visible on scroll.

Do not change:
- Service Catalogue layout except links added by Prompt 1
- Existing request form visual pattern
- Global header and persona switcher
- Other marketplace pages
- Stage 2/3/4 sidebars
- Any component not named in this prompt

---

## Prompt 3 -- Request Submission Workflow with selected service context

Screen: Request Submission Workflow
Component: Existing request form pattern with service context, dynamic fields, validation, and confirmation

Apply Select Mode to the current request form screen. Keep the existing form pattern, but do not hardcode the request workflow to a permanent fixed step count. The visible steps may vary by service category.

Design system:
Use the global DQ design system block above exactly. Keep the current form styling direction and DQ shell unchanged.

Layout:
- Route pattern: `/requests/start/:serviceId`
- Use the existing request form container and stepper style if present.
- Add a Service Context Banner at the top of the form.
- Form content card: white, 12px radius, 24px padding, border `#D8D9E6`.
- Right summary rail if space allows: selected service, owner, SLA, approval, queue, audit note.
- Footer actions: Back, Save Draft, Next, Submit Request depending on current stage.
- Do not label the request workflow as permanently `4-step`; current screens may show request details, required inputs, routing/SLA/approval, review/submit, but future services may vary.

Components:
- RequestWorkflowContextBanner: selected service title, category, owner, queue, SLA, approval requirement, status `Draft`.
- DynamicRequiredFields: renders fields based on selected service category.
- UrgencySelector: Low / Normal / High / Critical with helper text.
- EvidenceUploadStub: upload-style drop zone, prototype-only, no real upload.
- ExpectedOutcomeField: textarea with 100px min-height.
- RoutingPreviewCard: queue, service owner, response SLA, fulfilment SLA, approval route, escalation trigger.
- ReviewSubmitSummary: read-only summary before submit.
- ConfirmationCard: request ID, submitted status, owner, queue, SLA, approval state, next action.

Fixture data for this component:
Selected service examples:
1. `SVC-IT-001` Access & Permission Request
   - Prefill category: IT & Access
   - Owner: IT & Access Service Owner
   - Queue: IT & Access Queue
   - SLA: 1 business day
   - Approval: Required for privileged access
   - Required fields: user name, system, access type, business reason, duration, urgency, approver, evidence
2. `SVC-PLAT-001` DWS Platform Support
   - Prefill category: Platform Support
   - Owner: Platform Support Service Owner
   - Queue: Platform Support Queue
   - SLA: 4 business hours
   - Approval: Not required
   - Required fields: issue type, affected page, screenshot/evidence, urgency, business impact, expected outcome
3. `SVC-KNOW-001` Knowledge / Content Update Request
   - Prefill category: Knowledge / Content
   - Owner: Knowledge Governance Service Owner
   - Queue: Knowledge Review Queue
   - SLA: 3 business days
   - Approval: Required for policy-impacting content
   - Required fields: content title, content gap, target users, proposed change, impact, evidence
4. `SVC-ESC-001` SLA Breach Escalation
   - Prefill category: Escalations
   - Owner: Escalation Governance Owner
   - Queue: Escalation Review Queue
   - SLA: 4 business hours
   - Approval: Conditional
   - Required fields: linked task/request ID, current owner, breach reason, business impact, evidence, expected resolution

Generated request records:
- `REQ-2409` for new submitted Access & Permission Request -- Status: Pending Approval -- SLA: Due tomorrow -- Owner: IT & Access Service Owner
- `REQ-2410` for new submitted DWS Platform Support -- Status: In Fulfilment -- SLA: 4h remaining -- Owner: Platform Support Service Owner
- `REQ-2411` for draft SLA Breach Escalation -- Status: Draft -- SLA: not started -- Owner: Escalation Governance Owner

States:
- Default / Initial: service context is prefilled; required fields empty.
- Draft: user clicks Save Draft; show draft confirmation with draft ID and `Continue Draft` CTA.
- Validation error: Next or Submit blocked; required empty fields show danger border and inline message `Required to route this request.`
- Routing preview: after required fields are completed, show owner, queue, SLA, approval, escalation trigger.
- Review: read-only request summary with edit links.
- Submitted: show ConfirmationCard with generated request ID and CTAs.
- Loading: form skeleton and disabled actions.
- Error: danger toast `Request could not be submitted in prototype state.`

Interactions:
- Back click -> return to Service Detail Page for selected service.
- Save Draft click -> generate draft ID, show success toast `Draft saved`, keep user on confirmation/draft state.
- Next click -> validate current visible required fields; advance only if valid.
- Submit Request click -> validate all required fields; generate request record and show ConfirmationCard.
- `View Request Status` click -> navigate to `/requests/:requestId/status`.
- `Back to Service Catalogue` click -> navigate to Service Catalogue.
- Urgency change -> update RoutingPreviewCard SLA risk marker if High or Critical.
- Approval-required service -> show ApprovalPathCard in routing and review stages.
- No approval service -> show `No approval required` success badge and route directly to Service Owner Queue after submit.

Do not change:
- Global header
- Marketplace dropdown
- Persona switcher
- Existing shell navigation
- Service Catalogue except links and selected service context from earlier prompts
- Service Detail Page except Start Request linkage
- Any full backend/API behaviour
- Any component not named in this prompt

---

## Prompt 4 -- Associate Request Status View

Screen: Associate Request Status View
Component: Request status page for submitted service requests

Apply Select Mode to create or update the Associate-facing Request Status screen. This page proves that submitted requests remain trackable after submission.

Design system:
Use the global DQ design system block above exactly.

Layout:
- Route pattern: `/requests/:requestId/status`
- Page background: `#F6F6FB`.
- Content max-width: 1440px, 32px page padding.
- Header card: request title, request ID, status, service, category, owner, SLA, submitted date.
- Main layout: 8-column timeline/details + 4-column right rail.
- Right rail: current owner, SLA state, approval state, pending information, audit cue.
- Timeline card: vertical timeline showing submitted, approval, fulfilment, returned-for-info, closed.

Components:
- RequestHeaderCard: service title, request ID in JetBrains Mono, status pill, category badge, owner, SLA.
- RequestStatusTimeline: timeline events with timestamps and semantic icons.
- PendingInformationCard: appears only when status is `Returned for Information` or `Pending Information`.
- ApprovalStateCard: pending/approved/rejected/returned/not required.
- FulfilmentNotesCard: notes added by Service Owner.
- ClosureOutcomeCard: visible when request is closed.
- AuditTrailCue: small muted note `Tracked in DWS.01 request history`.

Fixture data for this component:
Requests:
1. `REQ-2401` -- Access & Permission Request -- Status: Pending Approval -- Owner: IT & Access Service Owner -- SLA: Due tomorrow -- Approval: APR-3002 pending -- Requester: Associate
2. `REQ-2402` -- SLA Breach Escalation -- Status: In Review -- Owner: Escalation Governance Owner -- SLA: 2h remaining -- Approval: Conditional -- Requester: Associate
3. `REQ-2404` -- DWS Platform Support -- Status: In Fulfilment -- Owner: Platform Support Service Owner -- SLA: 3h remaining -- Approval: Not required -- Requester: Associate
4. `REQ-2405` -- Onboarding Support Request -- Status: Returned for Information -- Owner: People Operations Service Owner -- SLA: At risk -- Pending info: onboarding start date missing -- Requester: Associate
5. `REQ-2406` -- Task / Workflow Setup Support -- Status: Closed -- Owner: Workflow Governance Owner -- SLA: Completed -- Closure outcome: workflow template created and linked -- Requester: Associate

States:
- Submitted: timeline shows request submitted and routed.
- Pending approval: ApprovalStateCard shows approver role and review SLA.
- In fulfilment: FulfilmentNotesCard shows current owner activity.
- Returned for information: PendingInformationCard appears with `Respond to Info Request` CTA.
- Closed: ClosureOutcomeCard appears with closure note and evidence marker.
- Not found: EmptyState with `Request not found` and `Back to My Requests` CTA.
- Loading: skeleton header, timeline, and right rail.

Interactions:
- `Respond to Info Request` click -> open inline response field and evidence stub.
- Submit response click -> update status from Returned for Information to In Review and show toast `Information submitted`.
- Timeline event click -> expand event notes.
- `Back to My Requests` click -> navigate to My Requests if available, otherwise show toast `My Requests opened in prototype state`.
- Request ID copy click -> show toast `Request ID copied`.

Do not change:
- Existing My Requests page except optional link into this status page
- Service Catalogue
- Service Detail Page
- Request Submission Workflow
- Service Owner Queue
- Approval Queue
- Executive dashboards
- Global header and persona switcher
- Any component not named in this prompt

---

## Prompt 5 -- Service Owner Queue and Approver / Reviewer Queue thin slice

Screen: Service Owner Queue and Approver / Reviewer Queue
Component: Two lightweight downstream queue views for routed and approval-required service requests

Apply Select Mode only to the existing queue surfaces if present. If no exact page exists, create lightweight sections using current shell styling. This prompt proves downstream request visibility after Associate submission.

Design system:
Use the global DQ design system block above exactly.

Layout:
- Service Owner Queue route: `/service-owner/requests`
- Approver / Reviewer Queue route: `/workflow/approvals`
- Each page uses page background `#F6F6FB`, 32px padding, max-width 1440px.
- Each page has a KPI strip, tabs, and table/card list.
- Table container: white card, 12px radius, 1px `#D8D9E6` border, no unnecessary decoration.

Components for Service Owner Queue:
- QueueKpiStrip: New, At Risk, Missing Info, Closed This Week.
- RoutedRequestTable: columns Request ID, Service, Requester, Category, Completeness, SLA, Status, Action.
- CompletenessIndicator: Complete / Missing Info.
- SlaStatePill: On Track / At Risk / Breached / Completed.
- OwnerActionBar: Accept, Return for Info, Update Status, Close.

Components for Approver / Reviewer Queue:
- ApprovalKpiStrip: Pending Review, Returned, Approved Today, SLA At Risk.
- ApprovalRequestTable: columns Approval ID, Request ID, Service, Requester, Reason, SLA, Decision State, Action.
- ApproverDecisionPanel: request summary, rationale textarea, actions Approve / Reject / Return / Escalate.
- DecisionHistoryList: prior decisions or empty state.

Fixture data for this component:
Service Owner Queue rows:
1. `QUE-5001` -- `REQ-2404` -- DWS Platform Support -- Requester: Associate -- Category: Platform Support -- Completeness: Complete -- SLA: On Track, 3h remaining -- Status: In Fulfilment -- Action: Update Status
2. `QUE-5002` -- `REQ-2405` -- Onboarding Support Request -- Requester: Associate -- Category: HRA Requests -- Completeness: Missing Info -- SLA: At Risk -- Status: Returned for Information -- Action: Return for Info
3. `QUE-5003` -- `REQ-2402` -- SLA Breach Escalation -- Requester: Associate -- Category: Escalations -- Completeness: Complete -- SLA: At Risk, 2h remaining -- Status: In Review -- Action: Assign resolution owner
4. `QUE-5004` -- `REQ-2410` -- DWS Platform Support -- Requester: Associate -- Category: Platform Support -- Completeness: Complete -- SLA: On Track, 4h remaining -- Status: New -- Action: Accept

Approval Queue rows:
1. `APR-3001` -- `REQ-2403` -- Knowledge / Content Update Request -- Reason: policy-impacting content -- SLA: 2 days remaining -- Decision State: Pending
2. `APR-3002` -- `REQ-2401` -- Access & Permission Request -- Reason: privileged workspace access -- SLA: Due tomorrow -- Decision State: Pending
3. `APR-3003` -- `REQ-2407` -- Workspace Configuration Request -- Reason: configuration change missing reason -- SLA: At Risk -- Decision State: Returned
4. `APR-3004` -- `REQ-2408` -- Approval Request -- Reason: formal sign-off needed -- SLA: On Track -- Decision State: Pending

States:
- Service Owner Queue Filled: show all queue rows.
- Service Owner Queue Empty: EmptyState `No routed requests`.
- Queue item at risk: SLA pill warning and row left accent warning.
- Queue item missing info: CompletenessIndicator warning.
- Approval Queue Filled: show pending approvals.
- Approval Queue Empty: EmptyState `No approval requests waiting`.
- Decision panel open: selected approval row appears in side panel or inline panel.
- Decision success: show toast with action result.
- Loading: skeleton table rows.

Interactions:
- Service Owner row click -> open request summary panel.
- Accept click -> status changes to In Fulfilment and toast `Request accepted`.
- Return for Info click -> status changes to Returned for Information and appears in Associate Request Status as Pending Information.
- Update Status click -> open small status menu: In Review, In Fulfilment, Waiting on Requester, Closed.
- Close click -> require fulfilment note, then status changes to Closed.
- Approver row click -> open ApproverDecisionPanel.
- Approve click -> decision state changes to Approved, request routes to Service Owner Queue, toast `Request approved`.
- Reject click -> decision state changes to Rejected, show required rationale validation if rationale is empty.
- Return click -> decision state changes to Returned, Associate Request Status shows Pending Information.
- Escalate click -> status changes to Escalated, SLA state warning/danger.

Do not change:
- Full Workflow Centre beyond this lightweight Approval Queue view
- Full Fulfilment Dashboard
- Full SLA Dashboard
- Workspace Admin configuration pages
- Service Catalogue layout except lifecycle links already added
- Request Submission Workflow except generated status links
- Global header, persona switcher, and shell identity
- Any component not named in this prompt

---

## Prompt 6 -- Executive Service Signal View

Screen: Executive Service Signal View
Component: Lightweight aggregated service request signal dashboard

Apply Select Mode to add a lightweight executive signal view showing that service requests roll up into oversight signals. This is not a full executive dashboard rebuild.

Design system:
Use the global DQ design system block above exactly.

Layout:
- Route pattern: `/intelligence/service-signals`
- Page background: `#F6F6FB`, 32px padding, max-width 1440px.
- Header: page title `Service Request Signals`, subtitle explaining aggregate demand, SLA exposure, escalations, and fulfilment health.
- KPI strip: 5 cards across desktop, wrap on tablet/mobile.
- Main content: two-column layout.
  - Left: service demand by category card grid/table.
  - Right: SLA exposure and active escalations cards.
- Bottom: recurring issues and service owner performance summary table.

Components:
- ExecutiveSignalStrip: Open Requests, SLA At Risk, Pending Approvals, Active Escalations, Closed This Week.
- ServiceDemandCard: category, count, trend, risk marker.
- SlaExposureCard: breached, at risk, on track, completed.
- EscalationSignalCard: active escalation count, oldest age, most affected category.
- RecurringIssuesTable: issue, category, count, suggested owner action.
- ServiceOwnerPerformanceTable: owner, open, at risk, closed, average response.

Fixture data for this component:
Signals:
1. `SIG-9001` -- Open service requests -- Value: 38 -- Status: Info
2. `SIG-9002` -- SLA at risk -- Value: 7 -- Status: Warning
3. `SIG-9003` -- Approval pending over 1 day -- Value: 4 -- Status: Warning
4. `SIG-9004` -- Closed this week -- Value: 21 -- Status: Success
5. `SIG-9005` -- Escalations active -- Value: 3 -- Status: Danger

Demand by category:
- Platform Support: 11 open, trend +3, risk: Medium
- IT & Access: 8 open, trend +2, risk: Medium
- HRA Requests: 6 open, trend +1, risk: Low
- Knowledge / Content: 5 open, trend flat, risk: Medium
- Task / Workflow: 4 open, trend -1, risk: Low
- Admin Requests: 2 open, trend flat, risk: High
- Approvals: 1 open, trend flat, risk: Medium
- Escalations: 1 open, trend +1, risk: High

Service owner performance:
- Platform Support Service Owner -- Open: 11 -- At Risk: 2 -- Closed: 8 -- Avg Response: 3h
- IT & Access Service Owner -- Open: 8 -- At Risk: 2 -- Closed: 5 -- Avg Response: 1d
- Knowledge Governance Service Owner -- Open: 5 -- At Risk: 1 -- Closed: 3 -- Avg Response: 2d
- Escalation Governance Owner -- Open: 3 -- At Risk: 2 -- Closed: 1 -- Avg Response: 2h

States:
- Filled: show KPI strip, category demand, SLA exposure, recurring issues, owner performance.
- No data: EmptyState `No service request signals yet`.
- High risk: show danger marker when Active Escalations > 0 or SLA At Risk > 5.
- Loading: skeleton KPI cards and table rows.

Interactions:
- KPI card click -> filter detail cards below by signal type.
- Category demand card click -> show selected category highlight and list linked sample requests.
- Service owner row click -> show info toast `Service owner detail opened in prototype state`.
- Escalation card click -> navigate to existing escalation queue if available, otherwise show toast `Escalation queue opened in prototype state`.

Do not change:
- Existing CEO / Executive dashboard beyond adding this lightweight signal surface or link
- Full SLA Dashboard
- Full Fulfilment Dashboard
- Service Catalogue
- Request form
- Service Owner Queue
- Approval Queue
- Global header and persona switcher
- Any component not named in this prompt

---

## Final QA checklist for Magic Patterns output

After applying the prompts, confirm the prototype demonstrates this flow:

1. Associate opens Services Marketplace.
2. Service cards show only `Start Request`, never `Provide Info`.
3. Service card opens a dedicated Service Detail Page.
4. Service Detail Page explains purpose, when to use, when not to use, required inputs, SLA, service owner, approval requirement, fulfilment path, related knowledge, related services, and audit note.
5. `Start Request` opens the request workflow with selected service context carried forward.
6. Request workflow shows category-specific required inputs and validation.
7. Submit generates a request ID and confirmation.
8. Associate can open Request Status.
9. Service Owner can see routed requests.
10. Approver / Reviewer can see approval-required requests.
11. Executives can see aggregate service request signals.
12. No backend/API calls are introduced.
13. Existing shell header, marketplace dropdown, persona switcher, and unrelated pages remain unchanged.

STATUS: READY FOR APPROVAL
Saved: services-marketplace-request-lifecycle-prototype-specific.md
