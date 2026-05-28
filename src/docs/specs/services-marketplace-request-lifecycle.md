# Feature: Services Marketplace to Request Lifecycle Flow — Prototype Specific

## 1. Platform Context

* **Platform:** DWS.01 Work.Space4.0
* **Type:** Specialised
* **Prototype Stage:** Specific
* **Stage Coverage:** Thin end-to-end vertical slice from Stage 1 service discovery into Stage 2 request submission and Stage 3 request handling/visibility.
* **Industry:** Internal enterprise workspace / digital operating platform
* **Business basis:** DWS.01 is an internal workspace execution platform responsible for request routing, workflow governance, knowledge access, performance visibility, and operating discipline. 

### Solution Outcomes

1. **Service discovery becomes actionable.** Associates can move from a service card to a dedicated service detail page and start a governed request.
2. **Service details become decision-ready before request submission.** Each service explains purpose, use cases, required inputs, SLA, service owner, approval needs, fulfilment path, and audit implications.
3. **Selected service context carries into the request workflow.** Service name, category, owner, SLA, routing path, required inputs, approval requirement, urgency, attachments/evidence needs, and expected outcome are available in the request submission flow.
4. **Submitted requests become traceable request records.** The prototype generates a request ID, request status, owner, SLA, fulfilment queue, approval state, and tracking path.
5. **Request lifecycle visibility is role-based.** Associates track their own requests, Service Owners track routed requests, Approvers/Reviewers see approval-required requests, and Executives see aggregate service/SLA signals.
6. **Governance remains visible across the journey.** SLA exposure, approval path, fulfilment ownership, pending information, fulfilment notes, closure outcome, and audit trail cues are visible where relevant.

---

## 2. Build Approach & References

* **Mode:** Existing Build Enhancement
* **Reference Builds Internal:**

  * Existing prototype: `https://dq-prod-dws-01-prototype.vercel.app/`
  * Current Services Marketplace screenshots
  * Current request form screenshot
* **Reference Builds External:** N/A — driven by DWS.01 BRS and current prototype.
* **Base Shell:** Existing DWS.01 prototype.
* **Input Documents:**

  * `26.05_DWS01_BRS_v2 (1).md`
  * `DESIGN (3).md`
  * `plan-feature-spec-prompt.md`
  * `feature-iteration-anatomy.md`
  * Services Marketplace screenshots
  * Request form screenshot

---

## 3. DevOps

* **Prototype Tool:** Magic Patterns
* **Prototype Repo:** N/A — this spec prepares the prototype iteration prompt.
* **Prototype Link:** Existing base prototype link provided. Updated prototype link will exist after implementation.
* **Build note:** Because this is Magic Patterns Specific stage and the feature spans multiple surfaces, Phase 4 should be written as an ordered set of narrow Select Mode prompts rather than one broad rebuild prompt.

---

## 4. Specification

### 4.1 Brand & Visual System

* **Design System Reference:** `DESIGN (3).md` — DQ Design System v1.2.0.
* **Design principle:** Use the DQ token-led design system. The design file defines DQ Navy `#030F35`, DQ Orange `#FB5535`, DQ White `#FFFFFF`, and `12px` radius as key tokens. 
* **CTA rule:** DQ Orange is a brand accent and CTA colour; it must not be used as a semantic status colour. 

#### Colours

| Role             | Token / Name   |       Hex |
| ---------------- | -------------- | --------: |
| Primary          | DQ Navy        | `#030F35` |
| Secondary / CTA  | DQ Orange      | `#FB5535` |
| Background       | White          | `#FFFFFF` |
| Surface          | Gray 50        | `#F6F6FB` |
| Surface 2        | White elevated | `#FFFFFF` |
| Text primary     | Gray 900       | `#111118` |
| Text muted       | Gray 500       | `#5F607F` |
| Text disabled    | Gray 400       | `#8385A1` |
| Border           | Gray 200       | `#D8D9E6` |
| Status — Success | Success        | `#16A34A` |
| Status — Warning | Warning        | `#D97706` |
| Status — Danger  | Error          | `#DC2626` |
| Status — Info    | Info           | `#2563EB` |

#### Typography

* **UI font:** Plus Jakarta Sans, weights 400, 500, 600, 700.
* **Mono font:** JetBrains Mono, weights 400, 500 — used for request IDs, service IDs, approval IDs, SLA codes, and audit references.
* The design system identifies Plus Jakarta Sans as the platform font and gives type scale roles for display, headings, card titles, body, and caption text. 

#### Radii

* **Card:** 12px
* **Modal:** 12px
* **Button:** 8px
* **Badge / pill:** 999px

#### Spacing

* **Base grid:** 8px
* **Standard card padding:** 24px
* **Feature/detail card padding:** 32px
* **Form field gap:** 16px
* **Page padding:** 32–80px

The design system defines an open/comfortable density, 1440px max container, 32–80px page padding, 8px base unit, and 24px standard card padding. 

#### Logo

* Use the current DWS.01 / Work.Space4.0 identity from the existing shell.
* Do not redesign the logo, global header, marketplace dropdown, persona switcher, or notification area.

---

### 4.2 Layout Shell

* **Viewport target:** Desktop-first at 1440px+.
* **Top bar:** Keep current DWS.01 header.

  * Left: DWS.01 / Work.Space4.0 identity and Marketplaces dropdown.
  * Right: Discovery Search, notifications, persona switcher, user menu.
* **Left sidebar:** N/A for Stage 1 marketplace surfaces. The Services Marketplace remains header-driven, not sidebar-driven.
* **Main content:** White / gray-50 canvas, existing shell padding, existing content max-width.
* **Marketplace layout:** Page title, KPI strip, category tabs, filter panel, service card grid.
* **Service Detail layout:** Dedicated page, not drawer.

  * Breadcrumb: Marketplaces / Services / `<Service Name>`
  * Hero summary card
  * Main column: purpose, use cases, required inputs, fulfilment path, approval rules, related knowledge
  * Right rail: Start Request CTA, SLA, owner, routing, approval, escalation, audit note
* **Request workflow layout:** Use the existing request form pattern, but do not hardcode a fixed step count. The number of steps may vary by request category and complexity.
* **Lifecycle visibility layout:** Add lightweight downstream surfaces:

  * Associate Request Status View
  * Service Owner Queue
  * Approver / Reviewer Queue
  * Executive Service Signal View

---

### 4.3 Personas

Personas are operating roles in this feature. Departments remain service categories, ownership groups, or routing metadata.

|  # | Name                | Role                                                                                                                  | Landing Page                    | Nav Scope                                                           |
| -: | ------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------- |
|  1 | Associate           | Internal DQ user who discovers services, starts requests, submits required information, and tracks request status.    | Service Catalogue / My Requests | Service Catalogue, Service Detail, Request Workflow, Request Status |
|  2 | Service Owner       | Owns service definition, required inputs, SLA, routing, fulfilment path, request quality, and closure responsibility. | Service Owner Queue             | Service Detail, Routed Requests, Request Status, Fulfilment Actions |
|  3 | Approver / Reviewer | Reviews approval-required requests and approves, rejects, returns, comments, or escalates.                            | Approval Queue                  | Approval Queue, Request Detail, Decision History                    |
|  4 | Workspace Admin     | Configures service categories, SLA rules, routing rules, request templates, approval rules, and marketplace metadata. | Admin Console                   | Configuration references only in this feature                       |
|  5 | Executives          | Monitors request demand, SLA exposure, escalation volume, service performance, and governance signals.                | Executive Service Signal View   | Aggregated dashboards only                                          |

BRS segment notes support keeping **Associate** as the standard internal user concept, while Admins own configuration and CEO/executive roles receive enterprise visibility. 

---

### 4.4 Navigation Structure

```text
Services Marketplace
  Service Catalogue
    All Services
    HRA Requests
    IT & Access
    Platform Support
    Knowledge / Content
    Task / Workflow
    Admin Requests
    Approvals
    Escalations

Service Detail Page
  /marketplaces/services/:serviceId
    Overview
    When to use
    When not to use
    Required information
    Fulfilment path
    SLA & escalation
    Approval requirements
    Related knowledge
    Related services
    Audit note

Request Workflow
  /requests/start/:serviceId
    Request details
    Required inputs
    Routing, SLA & approval
    Review & submit
  Note: steps may vary by service category.

Request Lifecycle
  /requests/:requestId/status
    Associate Request Status View

Service Owner
  /service-owner/requests
    Routed Requests Queue

Approver / Reviewer
  /workflow/approvals
    Approval Queue

Executives
  /intelligence/service-signals
    Service demand, SLA exposure, escalations, and fulfilment performance
```

### Persona route behaviour

| Persona             | Route behaviour                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Associate           | Can browse services, open details, start request, save draft, submit request, and track own request status.                  |
| Service Owner       | Can see routed requests, inspect completeness, update fulfilment state, return for information, and close in prototype mode. |
| Approver / Reviewer | Can see approval-required requests and approve, reject, return, comment, or escalate in prototype mode.                      |
| Workspace Admin     | Can see configuration references, but full configuration screens are out of scope.                                           |
| Executives          | Can see aggregate service signals only; no request submission or fulfilment actions.                                         |

---

### 4.5 Feature Specification

#### Screens in scope this iteration

1. Service Catalogue
2. Dedicated Service Detail Page
3. Request Submission Workflow
4. Request Confirmation
5. Associate Request Status View
6. Service Owner Queue
7. Approver / Reviewer Queue
8. Executive Service Signal View

#### Demo Storyline

An Associate enters the Services Marketplace, finds a service, opens its detail page, reviews required information, SLA, owner, approval needs, and fulfilment path, clicks **Start Request**, completes the request workflow with selected service context carried forward, submits the request, receives a request ID, tracks it in Request Status, while the Service Owner sees it in the routed queue, the Approver/Reviewer sees it if approval is required, and Executives see aggregate SLA/demand signals.

#### Components per screen

| Screen                        | Components                                                                                                                                          | Primary Action                                   | States Required                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| Service Catalogue             | Page header, KPI strip, category tabs, filters, service cards, empty state                                                                          | Start Request / Open Service Detail              | Filled, filtered, empty, loading                                 |
| Service Detail Page           | Breadcrumb, hero summary, service metadata rail, required inputs, fulfilment path, SLA panel, approval panel, related knowledge, audit note         | Start Request                                    | Filled, missing service, loading                                 |
| Request Submission Workflow   | Service context banner, dynamic required fields, urgency, attachments/evidence area, expected outcome, routing/SLA/approval preview, review section | Submit Request / Save Draft                      | Draft, validation error, review, submitted                       |
| Request Confirmation          | Success card, request ID, status, SLA, owner, queue, next action, CTAs                                                                              | View Request Status                              | Submitted, draft saved                                           |
| Associate Request Status View | Timeline, status panel, SLA panel, owner card, pending info, approval state, fulfilment notes, closure outcome                                      | Respond to Info Request / View Updates           | Submitted, pending info, pending approval, in fulfilment, closed |
| Service Owner Queue           | Queue KPI strip, routed request table/cards, completeness indicator, SLA indicator, owner actions                                                   | Accept / Return for Info / Update Status / Close | Empty, queued, at-risk, closed                                   |
| Approver / Reviewer Queue     | Approval list, request summary, decision panel, rationale field, decision history                                                                   | Approve / Reject / Return / Escalate             | Empty, pending, returned, approved, rejected                     |
| Executive Service Signal View | KPI strip, category demand chart/cards, SLA exposure, escalations, recurring issues, service owner performance                                      | Inspect Signal                                   | Filled, no data, high-risk                                       |

#### CTA rules

| Location            | CTA                                              |
| ------------------- | ------------------------------------------------ |
| Service card        | Start Request                                    |
| Service detail page | Start Request                                    |
| Request workflow    | Back / Next / Save Draft / Submit Request        |
| Confirmation        | View Request Status / Back to Service Catalogue  |
| Request Status      | Respond to Info Request / View Fulfilment Notes  |
| Service Owner Queue | Accept / Return for Info / Update Status / Close |
| Approval Queue      | Approve / Reject / Return / Escalate             |

Remove **Provide Info** entirely.

---

## 5. User Journeys

### 5.1 Primary Flow

```text
Associate opens Services Marketplace
→ filters or scans service cards
→ opens Service Detail Page
→ reviews purpose, use cases, required inputs, SLA, owner, approval, fulfilment path
→ clicks Start Request
→ request workflow opens with selected service context
→ Associate completes required inputs, urgency, evidence/attachments, and expected outcome
→ routing/SLA/approval preview confirms queue, service owner, SLA, and approval requirement
→ Associate submits request
→ confirmation shows request ID, owner, SLA, status, queue, and next action
→ Associate opens Request Status
→ Service Owner sees the routed request in Service Owner Queue
→ Approver / Reviewer sees the request if approval is required
→ Executives see aggregate service/SLA signal
```

### 5.2 Alternate Flows

| Flow                    | Behaviour                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| Save draft              | Associate starts request and saves before submission. Draft request ID is generated.               |
| Missing required fields | Submit/Next is blocked; missing fields show inline validation using danger state.                  |
| Approval required       | Approval panel appears in routing preview; submitted request appears in Approver / Reviewer Queue. |
| No approval required    | Request bypasses approval and moves directly to Service Owner Queue.                               |
| Return for information  | Service Owner or Approver returns request; Associate sees “Pending information” in Request Status. |
| SLA at risk             | SLA badge changes to warning; Service Owner Queue and Executive Signal View reflect exposure.      |
| Escalated request       | Request status shows escalation marker, reason, owner, age, and SLA impact.                        |
| Closed request          | Associate sees closure outcome, fulfilment note, evidence marker, and closure timestamp.           |
| No filter results       | Service Catalogue shows empty state with Clear Filters CTA.                                        |
| Service not found       | Service Detail Page shows branded missing-service state and Back to Catalogue CTA.                 |

### 5.3 Edge Cases

N/A — this is Specific stage, not Finesse. However, the following basic states are required so the demo does not break:

* Empty catalogue filter result
* Missing service detail
* Request validation error
* Draft saved
* Approval-required request
* Returned-for-information request
* SLA-at-risk request
* Closed request
* No requests in Service Owner Queue
* No approvals in Approver / Reviewer Queue
* No executive signal data

---

## 6. Fixture Data

### 6.1 Personas

| Entity  | ID      | Name                | Role                                    | Landing                       | Links to             |
| ------- | ------- | ------------------- | --------------------------------------- | ----------------------------- | -------------------- |
| Persona | PER-001 | Associate           | Request starter and tracker             | Service Catalogue             | REQ-2401, REQ-2402   |
| Persona | PER-002 | Service Owner       | Service fulfilment and closure owner    | Service Owner Queue           | SVC-IT-001, REQ-2401 |
| Persona | PER-003 | Approver / Reviewer | Approval decision owner                 | Approval Queue                | APR-3001, REQ-2403   |
| Persona | PER-004 | Workspace Admin     | Marketplace/routing configuration owner | Admin Console                 | CFG-REQ-001          |
| Persona | PER-005 | Executives          | Service performance oversight           | Executive Service Signal View | SIG-9001             |

### 6.2 Service Categories

| Entity           | ID           | Category                | Description                                                       | Owner Type          | Links to      |
| ---------------- | ------------ | ----------------------- | ----------------------------------------------------------------- | ------------------- | ------------- |
| Service Category | CAT-HRA      | HRA Requests            | People workflow, onboarding, role transition, workforce readiness | Service Owner       | SVC-HRA-001   |
| Service Category | CAT-IT       | IT & Access             | Access, permissions, account, device, software support            | Service Owner       | SVC-IT-001    |
| Service Category | CAT-PLAT     | Platform Support        | DWS.01 support, defects, access issues, usage help                | Service Owner       | SVC-PLAT-001  |
| Service Category | CAT-KNOW     | Knowledge / Content     | New or updated playbooks, templates, references                   | Service Owner       | SVC-KNOW-001  |
| Service Category | CAT-TASK     | Task / Workflow Support | Task setup, workflow routing, blockers, closure support           | Service Owner       | SVC-TASK-001  |
| Service Category | CAT-ADMIN    | Admin Requests          | Configuration, taxonomy, role, template, permission requests      | Workspace Admin     | SVC-ADMIN-001 |
| Service Category | CAT-APPROVAL | Approvals               | Formal review or sign-off requests                                | Approver / Reviewer | SVC-APP-001   |
| Service Category | CAT-ESC      | Escalations             | Blocked, overdue, risky, disputed work intervention               | Approver / Reviewer | SVC-ESC-001   |

### 6.3 Services

| Entity  | ID            | Service Name                       | Category            | SLA              | Approval                              | Links to |
| ------- | ------------- | ---------------------------------- | ------------------- | ---------------- | ------------------------------------- | -------- |
| Service | SVC-HRA-001   | Onboarding Support Request         | HRA Requests        | 2 business days  | Conditional                           | REQ-2405 |
| Service | SVC-IT-001    | Access & Permission Request        | IT & Access         | 1 business day   | Required for privileged access        | REQ-2401 |
| Service | SVC-PLAT-001  | DWS Platform Support               | Platform Support    | 4 business hours | Not required                          | REQ-2404 |
| Service | SVC-KNOW-001  | Knowledge / Content Update Request | Knowledge / Content | 3 business days  | Required for policy-impacting content | REQ-2403 |
| Service | SVC-TASK-001  | Task / Workflow Setup Support      | Task / Workflow     | 1 business day   | Not required                          | REQ-2406 |
| Service | SVC-ADMIN-001 | Workspace Configuration Request    | Admin Requests      | 2 business days  | Required                              | REQ-2407 |
| Service | SVC-APP-001   | Approval Request                   | Approvals           | 1 business day   | Required                              | REQ-2408 |
| Service | SVC-ESC-001   | SLA Breach Escalation              | Escalations         | 4 business hours | Conditional                           | REQ-2402 |

### 6.4 Service Detail Records

| Entity         | ID           | Service                            | Purpose                                                            | Required Inputs                                                                               | Fulfilment Path                                                                              |
| -------------- | ------------ | ---------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Service Detail | DET-IT-001   | Access & Permission Request        | Request system, application, workspace, or permission access.      | User, system, access type, business reason, duration, urgency, approval need, evidence.       | Submit → Approval check → IT/service owner review → fulfilment → evidence capture → closure. |
| Service Detail | DET-PLAT-001 | DWS Platform Support               | Report DWS.01 issue, defect, access problem, or usage question.    | Issue type, affected page, screenshot/evidence, urgency, impact, expected outcome.            | Submit → triage → route → resolve → closure note.                                            |
| Service Detail | DET-KNOW-001 | Knowledge / Content Update Request | Request new or revised guidance, template, playbook, or reference. | Content title, gap/problem, target users, impact, proposed change, owner, evidence.           | Submit → knowledge owner review → approval if needed → content update → closure.             |
| Service Detail | DET-ESC-001  | SLA Breach Escalation              | Escalate overdue, blocked, or high-risk work needing intervention. | Linked request/task ID, owner, breach reason, business impact, evidence, expected resolution. | Submit → reviewer assessment → owner intervention → resolution path → closure review.        |

### 6.5 Request Records

| Entity  | ID       | Service                            | Requester | Status                   | Owner                           | SLA              | Approval         | Links to     |
| ------- | -------- | ---------------------------------- | --------- | ------------------------ | ------------------------------- | ---------------- | ---------------- | ------------ |
| Request | REQ-2401 | Access & Permission Request        | Associate | Pending Approval         | IT & Access Service Owner       | Due tomorrow     | APR-3002 pending | SVC-IT-001   |
| Request | REQ-2402 | SLA Breach Escalation              | Associate | In Review                | Escalation Governance Owner     | 2h remaining     | Conditional      | SVC-ESC-001  |
| Request | REQ-2403 | Knowledge / Content Update Request | Associate | Pending Approval         | Knowledge Governance Owner      | 2 days remaining | APR-3001 pending | SVC-KNOW-001 |
| Request | REQ-2404 | DWS Platform Support               | Associate | In Fulfilment            | Platform Support Service Owner  | 3h remaining     | Not required     | SVC-PLAT-001 |
| Request | REQ-2405 | Onboarding Support Request         | Associate | Returned for Information | People Operations Service Owner | At risk          | Conditional      | SVC-HRA-001  |
| Request | REQ-2406 | Task / Workflow Setup Support      | Associate | Closed                   | Workflow Governance Owner       | Completed        | Not required     | SVC-TASK-001 |

### 6.6 Approval Records

| Entity   | ID       | Request  | Approver Role       | Decision State | Rationale                                          |
| -------- | -------- | -------- | ------------------- | -------------- | -------------------------------------------------- |
| Approval | APR-3001 | REQ-2403 | Approver / Reviewer | Pending        | Policy-impacting knowledge update requires review. |
| Approval | APR-3002 | REQ-2401 | Approver / Reviewer | Pending        | Privileged workspace access requires approval.     |
| Approval | APR-3003 | REQ-2407 | Approver / Reviewer | Returned       | Configuration request missing change reason.       |

### 6.7 Service Owner Queue Records

| Entity     | ID       | Request  | Queue                   | Completeness | SLA State | Action Needed                         |
| ---------- | -------- | -------- | ----------------------- | ------------ | --------- | ------------------------------------- |
| Queue Item | QUE-5001 | REQ-2404 | Platform Support Queue  | Complete     | On Track  | Resolve issue and add fulfilment note |
| Queue Item | QUE-5002 | REQ-2405 | People Operations Queue | Missing Info | At Risk   | Return for missing onboarding date    |
| Queue Item | QUE-5003 | REQ-2402 | Escalation Review Queue | Complete     | At Risk   | Assign resolution owner               |

### 6.8 Executive Signal Records

| Entity | ID       | Signal                      | Value | Status  | Links to             |
| ------ | -------- | --------------------------- | ----- | ------- | -------------------- |
| Signal | SIG-9001 | Open service requests       | 38    | Info    | Service Catalogue    |
| Signal | SIG-9002 | SLA at risk                 | 7     | Warning | SLA Dashboard        |
| Signal | SIG-9003 | Approval pending over 1 day | 4     | Warning | Approval Queue       |
| Signal | SIG-9004 | Closed this week            | 21    | Success | Fulfilment Dashboard |
| Signal | SIG-9005 | Escalations active          | 3     | Danger  | Escalation Queue     |

---

## 7. Shared Components

| Component                    | Spec                                                                                                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ServiceCard                  | White card, 12px radius, 1px `#D8D9E6` border, 24px padding, top accent `#FB5535`, category badge, title, description, SLA badge, service owner, approval badge, Start Request CTA. Card click opens Service Detail; CTA starts request. |
| ServiceFilterPanel           | Search, category chips, SLA filter, approval-required filter, owner filter, recommended toggle, clear filters. Includes empty state.                                                                                                     |
| ServiceDetailHero            | Breadcrumb, category badge, service title, short purpose, SLA badge, approval badge, risk badge, Start Request CTA.                                                                                                                      |
| ServiceMetadataRail          | Sticky right rail with owner, queue, response SLA, fulfilment SLA, escalation trigger, approval path, audit note.                                                                                                                        |
| RequiredInputsList           | Checklist of required fields/documents with required/optional grouping.                                                                                                                                                                  |
| FulfilmentTimeline           | Steps: Intake → Triage → Approval if needed → Service Owner review → Fulfilment → Closure.                                                                                                                                               |
| ApprovalPathCard             | Shows approval required/not required/conditional, approver role, review SLA, return/reject behaviour.                                                                                                                                    |
| RequestWorkflowContextBanner | Banner inside request workflow showing selected service, category, owner, SLA, approval requirement, queue.                                                                                                                              |
| RequestStatusTimeline        | Timeline showing submitted, approval, fulfilment, returned-for-info, closed states.                                                                                                                                                      |
| ServiceOwnerQueueTable       | Queue table/cards showing request ID, requester, category, completeness, SLA, owner action.                                                                                                                                              |
| ApproverDecisionPanel        | Request summary, approve/reject/return/escalate actions, rationale field, decision history.                                                                                                                                              |
| ExecutiveSignalStrip         | KPI cards for demand, SLA exposure, approvals pending, active escalations, closed this week.                                                                                                                                             |
| StatusPill                   | Use semantic colours only: success, warning, danger, info, draft/neutral. Orange is not semantic status.                                                                                                                                 |
| MonoId                       | JetBrains Mono for request IDs, service IDs, approval IDs.                                                                                                                                                                               |
| EmptyState                   | Icon, title, message, CTA; DQ card style.                                                                                                                                                                                                |
| Toast                        | Top-right; success/info auto-dismiss after 3s; error remains until dismissed.                                                                                                                                                            |

---

## 8. Scope

### In Scope

1. Service Catalogue improvements for service discovery and Start Request behaviour.
2. Dedicated Service Detail Page replacing the drawer as the primary detail surface.
3. Removal of **Provide Info** CTA.
4. Request workflow launch with selected service context.
5. Dynamic request fields by selected service category.
6. Request confirmation with generated request ID, owner, SLA, queue, and status.
7. Associate Request Status View.
8. Service Owner Queue thin slice.
9. Approver / Reviewer Queue thin slice.
10. Executive Service Signal View thin slice.
11. Prototype state updates for request lifecycle demonstration.
12. DQ design system alignment across new and changed surfaces.

### Out of Scope

1. Real backend persistence or API integration.
2. Authentication, login, session management, or IAM changes.
3. Full workflow engine implementation.
4. Full SLA dashboard build.
5. Full fulfilment operations module.
6. Full approval administration and delegation configuration.
7. Full Workspace Admin configuration console.
8. Full executive dashboard build.
9. Rebuilding the global header, marketplace dropdown, persona switcher, or shell identity.
10. Department-specific personas such as Finance, Marcom, Design, Legal, IT, or HRA as separate personas.
11. Replacing the entire request form system.
12. Microsoft Teams / SharePoint integration.

---

## 9. Assumptions

1. The existing DWS.01 prototype shell remains the approved base.
2. The request workflow may currently show four steps, but this is not treated as a permanent standard. The step count may vary by request category.
3. The BRS supports this end-to-end slice because it requires a canonical request object with category, requester, owner, SLA, queue, status, evidence, audit trail, and closure outcome. 
4. The BRS also requires Service Catalogue, Request Category Details, My Requests, Request Submission Form, and Request Status Tracking as P0/P1 capabilities across Stage 1 and Stage 2. 
5. The BRS requires downstream request handling through Workflow Centre, Approval Queue, Central Support Queue, Fulfilment Owner Queues, Fulfilment Dashboard, and SLA Dashboard, so the prototype should show at least a thin lifecycle handoff after submission. 
6. Workspace Admin configuration is referenced but not built in this feature; BRS has separate configuration features for request categories, workflow/approval rules, SLA rules, and audit. 
7. All request lifecycle changes are in-memory prototype state only.
8. Service Owner absorbs fulfilment ownership for this feature to avoid unnecessary persona sprawl.
9. Executives are oversight users only; they do not start, fulfil, or approve service requests in this feature.
10. Magic Patterns Phase 4 should use narrow Specific-stage Select Mode prompts to avoid overwriting unrelated shell areas.
