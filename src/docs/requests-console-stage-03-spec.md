
# Feature: Requests Console to Fulfilment Tracking and Owner Queue Control Flow — Prototype Specific

## 1. Platform Context

* **Platform:** DWS.01 Work.Space4.0
* **Type:** Specialised
* **Prototype Stage:** Specific
* **Stage Coverage:** Stage 03 fulfilment, operations, and governance feature. It consumes submitted/routed requests from Stage 02 and Central Support Queue, then supports fulfilment tracking, owner queue control, SLA follow-up, escalation follow-up, evidence tracking, closure review, and reopen handling.
* **Industry:** Internal enterprise workspace / digital operating platform.
* **Business basis:** The BRS defines **Fulfilment Owner Queues** as a Stage 03 P0 feature where authorised fulfilment owners manage assigned requests, fulfilment ownership, SLA, backlog, recurrence, and closure quality. It also defines **Fulfilment Dashboard** and **SLA Dashboard** for request volumes, SLA performance, ageing, backlog, owner performance, recurring issues, and SLA status. 

### Solution Outcomes

1. **Fulfilment requests become centrally visible.** Service Owners, Support Operators, and Leads can view routed and assigned requests across queues, owners, categories, statuses, SLA states, and closure states.

2. **Owner-specific fulfilment becomes easier to manage.** Fulfilment Owner Queues appear as filtered views inside Requests Console so owners can focus on assigned work without losing the wider operational context.

3. **Progress updates become structured.** Owners can update fulfilment status, add notes, flag blockers, set next action, and maintain a clear history of request movement.

4. **Evidence and outcome tracking become visible.** Requests show evidence state, outcome notes, fulfilment proof, and closure-readiness before closure.

5. **Reassignment and handoff are controlled.** Requests can be moved between owners or queues with reason, handoff note, previous owner, and updated ownership state.

6. **SLA and escalation follow-up become operationally visible.** Leads and owners can see at-risk, breached, ageing, blocked, recurring, and escalated fulfilment requests before they damage service discipline.

7. **Closure and reopen become governed.** Requests can be sent for closure review, accepted, rejected, reopened, or returned for correction based on evidence and outcome quality.

8. **Fulfilment health becomes measurable.** Leads and Executives can monitor aggregate backlog, SLA exposure, owner load, recurrence, ageing, escalation concentration, and closure-quality trends.

---

## 2. Build Approach & References

* **Mode:** Existing Build Enhancement
* **Reference Builds Internal:**

  * Existing DWS.01 prototype: `https://dq-prod-dws-01-prototype.vercel.app/`
  * Existing DWS.01 shell and sidebar pattern
  * Previous Services Marketplace request lifecycle flow
  * Previous Support Queue Stage 03 specification
  * Previous Notifications / Work Directory / Analytics marketplace patterns
* **Reference Builds External:** N/A — feature is driven by DWS.01 BRS, current shell behaviour, and DQ design system.
* **Base Shell:** Existing DWS.01 prototype.
* **Input Documents:**

  * `26.05_DWS01_BRS_v2 (1).md`
  * `DESIGN (3).md`
  * `plan-feature-spec-prompt.md`
  * `feature-iteration-anatomy.md`
* **Screenshots:** N/A — feature is not built yet. This spec defines the first Specific-stage implementation against the approved shell.

---

## 3. DevOps

* **Prototype Tool:** Magic Patterns
* **Prototype Repo:** N/A — this phase produces prototype specification only.
* **Prototype Link:** Existing base prototype link available. Updated prototype link will exist after implementation.
* **Build note:** This is a Magic Patterns **Specific** feature. Phase 4 must use ordered **Select Mode** prompts because Specific-stage prompts should be atomic and include screen/component scope, fixture data, states, interactions, and explicit do-not-change lists. 

---

## 4. Specification

### 4.1 Brand & Visual System

* **Design System Reference:** `DESIGN (3).md` — DQ Design System v1.2.0.
* **Design principle:** Use the DQ token-led enterprise design system. The design system defines DQ Navy, DQ Orange, DQ White, 12px radius, Plus Jakarta Sans, semantic status colours, open/comfortable spacing, and the rule that DQ Orange is a CTA/accent colour, not a semantic status colour. 

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
* **Mono font:** JetBrains Mono, weights 400, 500 — used for request IDs, queue IDs, SLA IDs, owner IDs, handoff IDs, escalation IDs, closure review IDs, progress update IDs, and audit/event references.

#### Radii

* **Card:** 12px
* **Panel / modal:** 12px
* **Button:** 8px
* **Badge / pill:** 999px

#### Spacing

* **Base grid:** 8px
* **Standard card padding:** 24px
* **Feature/detail card padding:** 32px
* **Form field gap:** 16px
* **Page padding:** 32–80px
* **Table density:** Comfortable by default; compact only for dense queue tables.

#### Logo

* Use the current DWS.01 / Work.Space4.0 shell identity from the existing prototype.
* Do not redesign the logo, global header, Discovery Search, persona switcher, notification area, marketplace dropdown, or user menu.

---

### 4.2 Layout Shell

* **Viewport target:** Desktop-first at 1440px+.

* **Top bar:** Keep current DWS.01 header unchanged.

  * Left: DWS.01 / Work.Space4.0 identity and Marketplaces dropdown.
  * Centre/right: Discovery Search, notification bell, messages, help, persona switcher, user avatar.

* **Left sidebar placement:** Add Requests Console as a **Stage 03** fulfilment feature.

  * Recommended sidebar group:

    ```text
    Stage 03 — Fulfilment, Operations & Governance
      Central Support Queue
      Requests Console
      SLA Dashboard
      Escalation Queue
    ```
  * **Requests Console** is active when the console, owner queue views, request fulfilment detail, progress update flow, reassignment/handoff flow, escalation flow, closure/reopen flow, or fulfilment health view is open.

* **Main content:** White / gray-50 canvas, existing shell padding, existing content max-width.

* **Requests Console layout:**

  * Page title and subtitle
  * Header actions: Export placeholder, Console settings placeholder
  * KPI strip
  * Status tabs
  * Queue view selector
  * Filter panel
  * Request table

* **Owner Queue Views layout:**

  * Render inside Requests Console as filtered queue views, not separate full features.
  * Queue selector includes:

    ```text
    Platform Support Queue
    HRA Queue
    Knowledge Queue
    Task / Workflow Queue
    Approval Support Queue
    Admin Queue
    ```

* **Request Fulfilment Detail layout:** Dedicated page, not just a drawer.

  * Breadcrumb: Stage 03 / Requests Console / `<Request ID>`
  * Hero summary card
  * Main column:

    * Requester context
    * Fulfilment summary
    * Ownership & queue context
    * SLA & ageing
    * Progress updates
    * Evidence & outcome
    * Linked work
    * Escalation context
    * Closure quality
    * Timeline
  * Right sticky action rail:

    * Update Progress
    * Add Evidence
    * Reassign
    * Handoff
    * Escalate
    * Mark Fulfilled
    * Send to Closure Review
    * Reopen

* **Downstream layout:** Add thin downstream surfaces:

  * Progress Update Flow
  * Reassign / Handoff Flow
  * Escalate Request Flow
  * Closure Review / Reopen Flow
  * Requests Health Signals
  * Request Configuration Reference

---

### 4.3 Personas

Personas are operating roles, not departments.

|  # | Name             | Role                                                                                                                                     | Landing Page                            | Nav Scope                                                                                                   |
| -: | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
|  1 | Associate        | Submitted request owner; receives fulfilment updates, clarification requests, closure outcome, and reopen state where applicable.        | My Requests / Request Detail            | My Requests, Request Updates, Closure Outcome                                                               |
|  2 | Service Owner    | Primary fulfilment owner; manages assigned requests, progress, evidence, blocker handling, closure submission, and owner queue workload. | Requests Console / My Assigned Requests | Requests Console, My Assigned, Owner Queue Views, Request Detail, Progress Update, Evidence, Closure Review |
|  3 | Support Operator | Views routed requests and operational status after triage; may support reassignment, handoff, escalation follow-up, and queue tracking.  | Requests Console                        | Requests Console, Request Detail, Reassignment, Handoff, Escalation Follow-up                               |
|  4 | Lead             | Monitors SLA exposure, queue pressure, blocked requests, escalations, recurrence, ageing, owner load, and closure quality.               | Requests Health Signals                 | Requests Console, Health Signals, SLA / Escalation View, Closure Review View                                |
|  5 | Workspace Admin  | Maintains request category, owner, SLA, routing, and closure references. Full configuration builder is out of scope.                     | Request Configuration Reference         | Configuration Reference, Owner Mapping, SLA Rule Reference, Closure Criteria Reference                      |
|  6 | Executives       | View aggregate request fulfilment health only; no ticket-level inbox behaviour or operational editing.                                   | Executive Fulfilment Health View        | Aggregate Fulfilment Signals, Backlog Health, SLA Trends, Closure Quality Trends                            |

---

### 4.4 Navigation Structure

```text
Stage 02 Workspace
  My Work
  My Requests
  Notifications
  Work Directory

Stage 03 — Fulfilment, Operations & Governance
  Central Support Queue
    /stage-03/support-queue

  Requests Console
    /stage-03/requests-console
      All Requests
      My Assigned
      Routed
      In Fulfilment
      Blocked
      Escalated
      Closure Review
      Closed / Reopened

  Owner Queue Views
    /stage-03/requests-console?queue=platform-support
      Platform Support Queue
    /stage-03/requests-console?queue=hra
      HRA Queue
    /stage-03/requests-console?queue=knowledge
      Knowledge Queue
    /stage-03/requests-console?queue=task-workflow
      Task / Workflow Queue
    /stage-03/requests-console?queue=approval-support
      Approval Support Queue
    /stage-03/requests-console?queue=admin
      Admin Queue

  Request Fulfilment Detail
    /stage-03/requests-console/:requestId
      Header / Identity
      Requester Context
      Fulfilment Summary
      Ownership & Queue Context
      SLA & Ageing
      Progress Updates
      Evidence & Outcome
      Linked Work
      Escalation Context
      Closure Quality
      Timeline
      Action Rail

  Progress Update
    /stage-03/requests-console/:requestId/progress
      Status
      Progress Note
      Blocker State
      Evidence State
      Next Action
      Confirmation

  Reassign / Handoff
    /stage-03/requests-console/:requestId/handoff
      Current Owner
      Target Owner
      Target Queue
      Handoff Reason
      Handoff Note
      Confirmation

  Escalate Request
    /stage-03/requests-console/:requestId/escalate
      Escalation Reason
      Severity
      SLA Impact
      Escalation Owner
      Resolution Path
      Confirmation

  Closure Review / Reopen
    /stage-03/requests-console/:requestId/closure
      Evidence Quality
      Outcome Quality
      Closure Decision
      Reopen Reason
      Correction Required
      Confirmation

  Requests Health Signals
    /stage-03/requests-health
      Backlog
      SLA Exposure
      Owner Load
      Ageing
      Recurrence
      Escalation Concentration
      Closure Quality

  Request Configuration Reference
    /stage-03/requests-console/config-reference
      Categories
      Owner Mapping
      SLA Rules
      Routing Rules
      Closure Criteria
```

### Persona route behaviour

| Persona          | Route behaviour                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Associate        | Can view own submitted requests, fulfilment updates, clarification requests, closure outcome, and reopen state where permitted.          |
| Service Owner    | Can view assigned requests, update progress, add evidence, flag blocker, handoff, escalate, mark fulfilled, and send for closure review. |
| Support Operator | Can view routed fulfilment request status and assist with reassignment, escalation follow-up, and operational tracking.                  |
| Lead             | Can view all fulfilment requests, SLA exposure, owner load, blocked items, escalations, recurrence, ageing, and closure-quality risks.   |
| Workspace Admin  | Can view read-only configuration references; full configuration editing is out of scope.                                                 |
| Executives       | Can view aggregate fulfilment health only; no ticket-level inbox, fulfilment action, or configuration editing.                           |

---

### 4.5 Feature Specification

#### Screens in scope this iteration

1. Requests Console
2. Owner Queue Views inside Requests Console
3. Request Fulfilment Detail Page
4. Progress Update Flow
5. Reassign / Handoff Flow
6. Escalate Request Flow
7. Closure Review / Reopen Flow
8. Requests Health Signals
9. Request Configuration Reference

#### Demo Storyline

A Service Owner opens **Requests Console** under Stage 03, filters to **My Assigned**, selects the **Platform Support Queue** view, opens request **REQ-FUL-2001**, reviews requester context, fulfilment summary, queue ownership, SLA state, progress updates, evidence state, linked work, escalation context, closure quality, and timeline. The owner updates fulfilment progress, adds an evidence note, flags the next action, and marks the request as fulfilled. The request moves to **Closure Review**. A Lead checks Requests Health Signals for SLA exposure, backlog pressure, blocked items, owner load, recurrence, and closure-quality risk. Executives see aggregate fulfilment health only.

#### Components per screen

| Screen                          | Components                                                                                                                                                                                 | Primary Action                                  | States Required                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| Requests Console                | Page header, KPI strip, status tabs, queue selector, filter panel, request table, row action menu                                                                                          | Open Request / Update Progress                  | Filled, filtered, empty, loading                                                |
| Owner Queue Views               | Queue selector, queue KPI strip, filtered table, owner load card, SLA exposure card                                                                                                        | Open Assigned Request                           | Platform Support, HRA, Knowledge, Task/Workflow, Approval Support, Admin, empty |
| Request Fulfilment Detail Page  | Breadcrumb, hero summary, requester context, fulfilment summary, ownership/queue context, SLA, progress, evidence, linked work, escalation context, closure quality, timeline, action rail | Update Progress / Add Evidence / Mark Fulfilled | Filled, missing request, restricted, loading                                    |
| Progress Update Flow            | Request context banner, status selector, progress note, blocker state, evidence state, next action, confirmation                                                                           | Save Progress                                   | Draft, validation error, saved                                                  |
| Reassign / Handoff Flow         | Current owner, target owner, target queue, handoff reason, handoff note, previous owner, confirmation                                                                                      | Reassign / Handoff                              | Empty, validation error, reassigned                                             |
| Escalate Request Flow           | Reason, severity, SLA impact, escalation owner, linked work, resolution path                                                                                                               | Escalate                                        | Empty, validation error, escalated                                              |
| Closure Review / Reopen Flow    | Evidence quality, outcome quality, closure decision, reopen reason, correction required, confirmation                                                                                      | Accept Closure / Reopen                         | Pending, accepted, rejected, reopened                                           |
| Requests Health Signals         | KPI strip, backlog cards, SLA exposure, owner load, ageing, recurrence, escalation concentration, closure quality                                                                          | Inspect Signal                                  | Filled, no data, high-risk                                                      |
| Request Configuration Reference | Category table, owner mapping, SLA rules, routing rules, closure criteria                                                                                                                  | View Rule                                       | Filled, missing mapping, read-only                                              |

#### CTA rules

| Location                | CTA                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Console header          | Export Placeholder / Console Settings Placeholder                                                                 |
| Console row             | Open                                                                                                              |
| Console row action      | Update Progress / Add Evidence / Handoff / Escalate                                                               |
| Detail action rail      | Update Progress / Add Evidence / Reassign / Handoff / Escalate / Mark Fulfilled / Send to Closure Review / Reopen |
| Progress update flow    | Save Progress / Save Draft                                                                                        |
| Reassign / handoff flow | Confirm Handoff                                                                                                   |
| Escalation flow         | Escalate                                                                                                          |
| Closure review          | Accept Closure / Reject Closure / Reopen                                                                          |
| Requests health signals | Inspect Signal                                                                                                    |
| Configuration reference | View Rule / View Mapping                                                                                          |

#### Fulfilment lifecycle state machine

```text
Routed
→ Assigned
→ In Fulfilment
→ Clarification Needed
→ Blocked
→ Escalated
→ Evidence Added
→ Fulfilled
→ Closure Review
→ Closed
→ Reopened
```

| State                | Meaning                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| Routed               | Request has been routed from Support Queue or another source into a fulfilment queue.               |
| Assigned             | A fulfilment owner is responsible for the request.                                                  |
| In Fulfilment        | Owner is actively working on the request.                                                           |
| Clarification Needed | Fulfilment owner needs clarification from requester or upstream operator.                           |
| Blocked              | Work cannot continue due to dependency, access issue, unclear ownership, or unresolved blocker.     |
| Escalated            | Request requires intervention because of SLA, severity, blocker, or recurrence.                     |
| Evidence Added       | Owner has added fulfilment evidence or outcome notes.                                               |
| Fulfilled            | Fulfilment owner marks the work complete.                                                           |
| Closure Review       | Request is awaiting acceptance/review before closure.                                               |
| Closed               | Request outcome has been accepted.                                                                  |
| Reopened             | Closed/fulfilled request was reopened due to weak fulfilment, missing evidence, or recurring issue. |

#### Requests Console information model

| Field             | Required content                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Request ID        | Mono ID, e.g. `REQ-FUL-2001`                                                                     |
| Title             | Short request title                                                                              |
| Category          | Platform Support, HRA, Knowledge, Task / Workflow, Approval Support, Admin                       |
| Queue             | Current fulfilment queue                                                                         |
| Owner             | Current fulfilment owner                                                                         |
| Requester         | Original requester                                                                               |
| Priority          | High, Medium, Low                                                                                |
| SLA state         | On Track, Due Soon, At Risk, Breached, Paused, Completed                                         |
| Fulfilment status | Routed, Assigned, In Fulfilment, Blocked, Escalated, Fulfilled, Closure Review, Closed, Reopened |
| Evidence state    | Not Started, Pending, Added, Weak, Accepted                                                      |
| Age               | Request age from routing/submission                                                              |
| Recurrence        | New, Recurring, Reopened                                                                         |
| Closure quality   | Pending, Accepted, Rejected, Reopened                                                            |
| Next action       | Update, Add Evidence, Handoff, Escalate, Closure Review                                          |

#### Request Fulfilment Detail Page information model

| Section                   | Required content                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Header / Identity         | Request ID, title, queue, owner, status, priority, SLA state, source                                       |
| Requester Context         | Requester, unit/team, submitted date, originating request/service/category                                 |
| Fulfilment Summary        | What must be fulfilled, expected outcome, current progress                                                 |
| Ownership & Queue Context | Current owner, queue, backup owner, previous owner, reassignment history                                   |
| SLA & Ageing              | SLA start, due time, time remaining, breach state, ageing, pause reason                                    |
| Progress Updates          | Owner updates, notes, blocker state, clarification requests, next action                                   |
| Evidence & Outcome        | Evidence notes/placeholders, fulfilment proof, outcome statement                                           |
| Linked Work               | Linked task, approval, escalation, knowledge asset, previous related request                               |
| Escalation Context        | Escalation reason, severity, owner, SLA impact, resolution path                                            |
| Closure Quality           | Evidence quality, outcome quality, closure status, reviewer, reopen reason                                 |
| Timeline                  | Routed, assigned, updated, blocked, escalated, fulfilled, closure reviewed, reopened                       |
| Action Rail               | Update Progress, Add Evidence, Reassign, Handoff, Escalate, Mark Fulfilled, Send to Closure Review, Reopen |

#### Queue view taxonomy

| Queue view             | Purpose                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| Platform Support Queue | DWS issues, access issues, configuration support, platform support |
| HRA Queue              | Onboarding, employment support, policy clarification               |
| Knowledge Queue        | Missing guide, outdated content, knowledge update request          |
| Task / Workflow Queue  | Task setup, workflow routing, assignment support                   |
| Approval Support Queue | Approval stuck, wrong approver, returned approval                  |
| Admin Queue            | Role changes, owner mapping, category setup, configuration request |

---

## 5. User Journeys

### 5.1 Primary Flow

```text
Service Owner opens DWS.01 signed-in workspace
→ selects Requests Console under Stage 03
→ switches to My Assigned
→ selects Platform Support Queue
→ opens REQ-FUL-2001
→ reviews requester context, fulfilment summary, queue ownership, SLA state, progress history, evidence state, linked work, and closure quality
→ clicks Update Progress
→ sets status to In Fulfilment
→ adds progress note and next action
→ saves progress
→ clicks Add Evidence
→ adds evidence note and outcome statement
→ marks request Fulfilled
→ sends request to Closure Review
→ Lead reviews closure quality
→ closure is accepted or request is reopened
→ Requests Health Signals update backlog, SLA, owner load, and closure-quality metrics
```

### 5.2 Alternate Flows

| Flow                              | Behaviour                                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| View all requests                 | Requests Console shows all fulfilment requests across owners, queues, statuses, SLA states, and closure states.   |
| View my assigned requests         | Console filters to requests owned by active Service Owner persona.                                                |
| Open queue view                   | Console filters by selected queue: Platform Support, HRA, Knowledge, Task / Workflow, Approval Support, or Admin. |
| Request is blocked                | Service Owner marks Blocked, adds blocker reason, and sets next action.                                           |
| Clarification needed              | Owner marks Clarification Needed and captures question/requester response expectation.                            |
| Evidence added                    | Evidence state changes from Pending to Added and appears in detail timeline.                                      |
| Request fulfilled                 | Status changes to Fulfilled and closure review becomes available.                                                 |
| Closure accepted                  | Closure quality changes to Accepted and request moves to Closed.                                                  |
| Closure rejected                  | Request moves to Reopened with correction reason.                                                                 |
| Handoff to another owner          | Request owner/queue changes with handoff reason and previous owner preserved.                                     |
| Reassign to queue                 | Request moves to selected queue view and appears in target owner list.                                            |
| SLA at risk                       | Request row/detail shows warning state and escalation suggestion.                                                 |
| SLA breached                      | Danger state appears and Escalate CTA becomes prominent.                                                          |
| Recurring issue                   | Request shows recurrence badge and is counted in health signals.                                                  |
| Executive opens fulfilment health | Executive sees aggregate fulfilment health only, not ticket-level inbox behaviour.                                |

### 5.3 Edge Cases

N/A — this is Specific stage, not Finesse. However, the following states are required so the demo does not break:

* No fulfilment requests
* No matching filter results
* Missing request detail
* Request with no owner
* Request with missing queue
* Request with no evidence
* Request with weak evidence
* Request blocked
* Request escalated
* Request reopened
* SLA paused
* SLA at risk
* SLA breached
* Owner queue empty
* Owner overloaded
* Handoff reason missing
* Escalation reason missing
* Closure review rejected
* Configuration mapping missing
* No executive signal data

---

## 6. Fixture Data

### 6.1 Personas

| Entity  | ID      | Name             | Role                                                                                      | Landing                          | Links to                 |
| ------- | ------- | ---------------- | ----------------------------------------------------------------------------------------- | -------------------------------- | ------------------------ |
| Persona | PER-001 | Associate        | Submitted request owner and fulfilment-update recipient                                   | My Requests                      | REQ-FUL-2001             |
| Persona | PER-002 | Service Owner    | Manages assigned fulfilment requests, progress, evidence, and closure submission          | Requests Console / My Assigned   | REQ-FUL-2001, FQVIEW-001 |
| Persona | PER-003 | Support Operator | Tracks routed request status and assists reassignment/escalation follow-up                | Requests Console                 | REQ-FUL-2002, HND-5001   |
| Persona | PER-004 | Lead             | Monitors SLA exposure, backlog, owner load, blockers, recurrence, and closure quality     | Requests Health Signals          | SIG-FUL-9001             |
| Persona | PER-005 | Workspace Admin  | Views configuration references for categories, owners, SLA, routing, and closure criteria | Request Configuration Reference  | CFG-FUL-7001             |
| Persona | PER-006 | Executives       | Views aggregate fulfilment health only                                                    | Executive Fulfilment Health View | SIG-FUL-9001             |

### 6.2 Fulfilment Requests

| Entity             | ID           | Title                                     | Category                    | Queue                  | Owner           | Requester     | Priority | SLA State | Fulfilment Status | Links to     |
| ------------------ | ------------ | ----------------------------------------- | --------------------------- | ---------------------- | --------------- | ------------- | -------- | --------- | ----------------- | ------------ |
| Fulfilment Request | REQ-FUL-2001 | Admin access fulfilment for DWS workspace | IT & Access Request         | Platform Support Queue | Brian Otieno    | Amina Hassan  | High     | At Risk   | Assigned          | SLA-FUL-4001 |
| Fulfilment Request | REQ-FUL-2002 | Evidence standard update fulfilment       | Knowledge / Content Request | Knowledge Queue        | Grace Wanjiru   | Priya Nair    | Medium   | Due Soon  | In Fulfilment     | EVD-6002     |
| Fulfilment Request | REQ-FUL-2003 | Workflow routing correction               | Task / Workflow Support     | Task / Workflow Queue  | Priya Nair      | David Mwangi  | Medium   | On Track  | Blocked           | BLK-3001     |
| Fulfilment Request | REQ-FUL-2004 | Approval owner correction                 | Approval Support            | Approval Support Queue | Omar Farouk     | Brian Otieno  | High     | Breached  | Escalated         | ESC-FUL-5001 |
| Fulfilment Request | REQ-FUL-2005 | Onboarding policy clarification           | HRA Request                 | HRA Queue              | HRA Owner       | Amina Hassan  | Low      | Completed | Closed            | CLR-FUL-8001 |
| Fulfilment Request | REQ-FUL-2006 | Admin role update for support operator    | Admin Request               | Admin Queue            | Workspace Admin | Elena Costa   | Medium   | On Track  | Closure Review    | CLR-FUL-8002 |
| Fulfilment Request | REQ-FUL-2007 | Recurring access issue after fulfilment   | IT & Access Request         | Platform Support Queue | Brian Otieno    | David Mwangi  | High     | At Risk   | Reopened          | ESC-FUL-5002 |
| Fulfilment Request | REQ-FUL-2008 | DWS page navigation bug fix               | Platform Support            | Platform Support Queue | Brian Otieno    | Grace Wanjiru | Medium   | On Track  | Evidence Added    | EVD-6001     |

### 6.3 Owner Queue Views

| Entity      | ID         | Queue Name             | Queue Type | Owner           | Active Items | SLA Exposure | Closure Quality | Links to     |
| ----------- | ---------- | ---------------------- | ---------- | --------------- | -----------: | ------------ | --------------- | ------------ |
| Owner Queue | FQVIEW-001 | Platform Support Queue | Fulfilment | Brian Otieno    |            9 | 3 at risk    | 71% accepted    | REQ-FUL-2001 |
| Owner Queue | FQVIEW-002 | Knowledge Queue        | Fulfilment | Grace Wanjiru   |            4 | 1 due soon   | 82% accepted    | REQ-FUL-2002 |
| Owner Queue | FQVIEW-003 | Task / Workflow Queue  | Fulfilment | Priya Nair      |            6 | 2 at risk    | 76% accepted    | REQ-FUL-2003 |
| Owner Queue | FQVIEW-004 | Approval Support Queue | Fulfilment | Omar Farouk     |            5 | 2 breached   | 70% accepted    | REQ-FUL-2004 |
| Owner Queue | FQVIEW-005 | HRA Queue              | Fulfilment | HRA Owner       |            3 | 0 at risk    | 90% accepted    | REQ-FUL-2005 |
| Owner Queue | FQVIEW-006 | Admin Queue            | Fulfilment | Workspace Admin |            5 | 1 at risk    | 78% accepted    | REQ-FUL-2006 |

### 6.4 Request Categories

| Entity           | ID          | Category                    | Default Queue          | Default SLA     | Owner Role      | Links to   |
| ---------------- | ----------- | --------------------------- | ---------------------- | --------------- | --------------- | ---------- |
| Request Category | CAT-FUL-001 | HRA Request                 | HRA Queue              | 2 business days | Service Owner   | FQVIEW-005 |
| Request Category | CAT-FUL-002 | IT & Access Request         | Platform Support Queue | 4 hours         | Service Owner   | FQVIEW-001 |
| Request Category | CAT-FUL-003 | Platform Support            | Platform Support Queue | 8 hours         | Service Owner   | FQVIEW-001 |
| Request Category | CAT-FUL-004 | Knowledge / Content Request | Knowledge Queue        | 3 business days | Service Owner   | FQVIEW-002 |
| Request Category | CAT-FUL-005 | Task / Workflow Support     | Task / Workflow Queue  | 1 business day  | Service Owner   | FQVIEW-003 |
| Request Category | CAT-FUL-006 | Approval Support            | Approval Support Queue | 1 business day  | Lead            | FQVIEW-004 |
| Request Category | CAT-FUL-007 | Admin Request               | Admin Queue            | 2 business days | Workspace Admin | FQVIEW-006 |

### 6.5 SLA Records

| Entity     | ID           | Request      | SLA State | Started         | Due              | Time Remaining | Breach State |
| ---------- | ------------ | ------------ | --------- | --------------- | ---------------- | -------------- | ------------ |
| SLA Record | SLA-FUL-4001 | REQ-FUL-2001 | At Risk   | Today 09:00     | Today 13:00      | 45 mins        | Not breached |
| SLA Record | SLA-FUL-4002 | REQ-FUL-2002 | Due Soon  | Yesterday 15:00 | Tomorrow 15:00   | 1 day          | Not breached |
| SLA Record | SLA-FUL-4003 | REQ-FUL-2003 | On Track  | Today 10:00     | Tomorrow 10:00   | 1 day          | Not breached |
| SLA Record | SLA-FUL-4004 | REQ-FUL-2004 | Breached  | Yesterday 09:00 | Yesterday 17:00  | 0              | Breached     |
| SLA Record | SLA-FUL-4005 | REQ-FUL-2005 | Completed | Earlier         | Completed        | N/A            | Completed    |
| SLA Record | SLA-FUL-4006 | REQ-FUL-2006 | On Track  | Today 11:00     | +2 business days | 2 days         | Not breached |
| SLA Record | SLA-FUL-4007 | REQ-FUL-2007 | At Risk   | Today 07:30     | Today 15:30      | 2h             | Not breached |
| SLA Record | SLA-FUL-4008 | REQ-FUL-2008 | On Track  | Today 08:00     | Today 16:00      | 5h             | Not breached |

### 6.6 Progress Updates

| Entity          | ID       | Request      | Update Type        | Note                                                        | Actor           | Status After   |
| --------------- | -------- | ------------ | ------------------ | ----------------------------------------------------------- | --------------- | -------------- |
| Progress Update | PRG-3001 | REQ-FUL-2001 | Status Update      | Access role confirmed; waiting for final permission update. | Brian Otieno    | In Fulfilment  |
| Progress Update | PRG-3002 | REQ-FUL-2002 | Evidence Update    | Draft evidence attached for knowledge update.               | Grace Wanjiru   | Evidence Added |
| Progress Update | PRG-3003 | REQ-FUL-2003 | Blocker            | Workflow owner unclear; waiting for ownership confirmation. | Priya Nair      | Blocked        |
| Progress Update | PRG-3004 | REQ-FUL-2004 | Escalation         | Approval owner mismatch is blocking closure.                | Omar Farouk     | Escalated      |
| Progress Update | PRG-3005 | REQ-FUL-2006 | Closure Submission | Admin role update completed and ready for closure review.   | Workspace Admin | Closure Review |
| Progress Update | PRG-3006 | REQ-FUL-2008 | Evidence Update    | Navigation bug fix verified on staging.                     | Brian Otieno    | Evidence Added |

### 6.7 Evidence Records

| Entity   | ID       | Request      | Evidence State | Evidence Note                                    | Outcome Statement             | Quality   |
| -------- | -------- | ------------ | -------------- | ------------------------------------------------ | ----------------------------- | --------- |
| Evidence | EVD-6001 | REQ-FUL-2008 | Added          | Screenshot and verification note captured.       | Navigation issue resolved.    | Accepted  |
| Evidence | EVD-6002 | REQ-FUL-2002 | Pending        | Draft evidence requires review.                  | Knowledge update in progress. | Pending   |
| Evidence | EVD-6003 | REQ-FUL-2001 | Pending        | Permission update note pending.                  | Access fulfilment pending.    | Not Ready |
| Evidence | EVD-6004 | REQ-FUL-2007 | Weak           | Evidence does not explain recurrence root cause. | Access issue recurred.        | Weak      |
| Evidence | EVD-6005 | REQ-FUL-2005 | Accepted       | Policy clarification sent and acknowledged.      | Request completed.            | Accepted  |

### 6.8 Handoff / Reassignment Events

| Entity  | ID       | Request      | From Owner       | To Owner        | From Queue            | To Queue               | Reason                   | Status   |
| ------- | -------- | ------------ | ---------------- | --------------- | --------------------- | ---------------------- | ------------------------ | -------- |
| Handoff | HND-5001 | REQ-FUL-2003 | Priya Nair       | Omar Farouk     | Task / Workflow Queue | Approval Support Queue | Ownership unclear        | Pending  |
| Handoff | HND-5002 | REQ-FUL-2001 | Support Operator | Brian Otieno    | Central Support Queue | Platform Support Queue | Routed after triage      | Complete |
| Handoff | HND-5003 | REQ-FUL-2006 | Support Operator | Workspace Admin | Central Support Queue | Admin Queue            | Admin category mapping   | Complete |
| Handoff | HND-5004 | REQ-FUL-2002 | Support Operator | Grace Wanjiru   | Central Support Queue | Knowledge Queue        | Knowledge owner required | Complete |

### 6.9 Escalation Records

| Entity     | ID           | Request      | Reason                                    | Severity | SLA Impact | Owner        | Resolution Path                          |
| ---------- | ------------ | ------------ | ----------------------------------------- | -------- | ---------- | ------------ | ---------------------------------------- |
| Escalation | ESC-FUL-5001 | REQ-FUL-2004 | Approval owner correction breached SLA    | High     | Breached   | Lead         | Reassign approver and close blocker      |
| Escalation | ESC-FUL-5002 | REQ-FUL-2007 | Recurring access failure after fulfilment | High     | At Risk    | Lead         | Review fulfilment quality and root cause |
| Escalation | ESC-FUL-5003 | REQ-FUL-2001 | Access fulfilment may breach SLA          | Medium   | At Risk    | Brian Otieno | Complete permission update before breach |
| Escalation | ESC-FUL-5004 | REQ-FUL-2003 | Workflow owner unclear                    | Medium   | On Track   | Priya Nair   | Confirm ownership and handoff            |

### 6.10 Closure Review Records

| Entity         | ID           | Request      | Evidence Quality | Outcome Quality | Closure Status | Reviewer         | Reopen Reason                          |
| -------------- | ------------ | ------------ | ---------------- | --------------- | -------------- | ---------------- | -------------------------------------- |
| Closure Review | CLR-FUL-8001 | REQ-FUL-2005 | Accepted         | Accepted        | Closed         | Support Operator | N/A                                    |
| Closure Review | CLR-FUL-8002 | REQ-FUL-2006 | Accepted         | Pending Review  | Closure Review | Lead             | N/A                                    |
| Closure Review | CLR-FUL-8003 | REQ-FUL-2007 | Weak             | Failed          | Reopened       | Lead             | Access issue recurred after fulfilment |
| Closure Review | CLR-FUL-8004 | REQ-FUL-2002 | Pending          | Pending         | Pending Review | Support Operator | N/A                                    |
| Closure Review | CLR-FUL-8005 | REQ-FUL-2004 | Missing          | Failed          | Not Ready      | Lead             | Approval still blocked                 |

### 6.11 Linked Work Records

| Entity      | ID           | Request      | Linked Item                            | Type       | Status          | Relationship        |
| ----------- | ------------ | ------------ | -------------------------------------- | ---------- | --------------- | ------------------- |
| Linked Work | LWK-FUL-1001 | REQ-FUL-2001 | TSK-2401 — Access role confirmation    | Task       | In Progress     | Fulfilment task     |
| Linked Work | LWK-FUL-1002 | REQ-FUL-2002 | KNO-002 — Evidence Attachment Standard | Knowledge  | Effective       | Reference source    |
| Linked Work | LWK-FUL-1003 | REQ-FUL-2004 | APR-3001 — Access review               | Approval   | Awaiting Review | Blocked approval    |
| Linked Work | LWK-FUL-1004 | REQ-FUL-2003 | WFL-2402 — Workflow routing correction | Workflow   | In Progress     | Related workflow    |
| Linked Work | LWK-FUL-1005 | REQ-FUL-2007 | ESC-FUL-5002 — Recurring access issue  | Escalation | Active          | Reopened escalation |

### 6.12 Fulfilment Health Signals

| Entity | ID           | Signal                          |    Value | Status  | Links to              |
| ------ | ------------ | ------------------------------- | -------: | ------- | --------------------- |
| Signal | SIG-FUL-9001 | Active fulfilment requests      |       27 | Info    | Requests Console      |
| Signal | SIG-FUL-9002 | SLA at-risk fulfilment requests |        6 | Warning | SLA / Escalation View |
| Signal | SIG-FUL-9003 | Breached fulfilment requests    |        2 | Danger  | Escalation Queue      |
| Signal | SIG-FUL-9004 | Blocked requests                |        4 | Warning | Requests Console      |
| Signal | SIG-FUL-9005 | Requests in closure review      |        5 | Info    | Closure Review View   |
| Signal | SIG-FUL-9006 | Reopened requests               |        3 | Warning | Reopen View           |
| Signal | SIG-FUL-9007 | Closure quality accepted        |      76% | Warning | Closure Review        |
| Signal | SIG-FUL-9008 | Owner load above threshold      | 2 owners | Warning | Owner Queue Views     |

### 6.13 Request Configuration Reference Records

| Entity           | ID           | Rule Type        | Name                                         | Owner           | Status | Links to     |
| ---------------- | ------------ | ---------------- | -------------------------------------------- | --------------- | ------ | ------------ |
| Config Reference | CFG-FUL-7001 | Category Mapping | IT & Access → Platform Support Queue         | Workspace Admin | Active | CAT-FUL-002  |
| Config Reference | CFG-FUL-7002 | SLA Rule         | High Priority Access = 4 hours               | Workspace Admin | Active | SLA-FUL-4001 |
| Config Reference | CFG-FUL-7003 | Owner Mapping    | Platform Support Queue → Brian Otieno        | Workspace Admin | Active | FQVIEW-001   |
| Config Reference | CFG-FUL-7004 | Handoff Rule     | Ownership unclear → Handoff with reason      | Workspace Admin | Active | HND-5001     |
| Config Reference | CFG-FUL-7005 | Escalation Rule  | Breached SLA → Lead Escalation               | Workspace Admin | Active | ESC-FUL-5001 |
| Config Reference | CFG-FUL-7006 | Closure Rule     | Evidence and outcome required before closure | Workspace Admin | Active | CLR-FUL-8001 |

---

## 7. Shared Components

| Component                   | Spec                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| RequestsConsoleKpiStrip     | KPI cards for Active fulfilment requests, SLA at risk, Breached, Blocked, Closure Review, Reopened. Uses semantic status logic.                                    |
| RequestsConsoleTabs         | Tabs: All Requests, My Assigned, Routed, In Fulfilment, Blocked, Escalated, Closure Review, Closed / Reopened.                                                     |
| QueueViewSelector           | Segmented control or dropdown for Platform Support, HRA, Knowledge, Task / Workflow, Approval Support, Admin. Updates the table and KPI context.                   |
| RequestsFilterPanel         | Search, queue, category, owner, priority, SLA state, fulfilment status, ageing, recurrence, evidence state, closure quality. Shows result count and clear filters. |
| RequestsTable               | Table with request ID, title, category, queue, owner, requester, priority, SLA state, fulfilment status, evidence state, age, next action.                         |
| RequestsRow                 | Clickable row. Uses MonoId, CategoryBadge, QueueBadge, OwnerBadge, PriorityPill, SlaStatusPill, EvidenceStateBadge, RequestStatusPill, NextActionButton.           |
| RequestFulfilmentDetailHero | Breadcrumb, request ID, title, queue, owner, status, priority, SLA state, source, last update.                                                                     |
| RequesterContextCard        | Shows requester, unit/team, submitted date, originating service/category, request source.                                                                          |
| FulfilmentSummaryCard       | Shows fulfilment objective, expected outcome, current progress, and next action.                                                                                   |
| OwnershipQueueContextPanel  | Shows current owner, queue, backup owner, previous owner, reassignment history.                                                                                    |
| SlaAgeingCard               | Shows SLA start, due time, time remaining, breach state, ageing, pause reason.                                                                                     |
| ProgressUpdatesPanel        | Shows owner updates, notes, blocker state, clarification requests, next action.                                                                                    |
| EvidenceOutcomePanel        | Shows evidence notes/placeholders, fulfilment proof, outcome statement, evidence quality.                                                                          |
| LinkedWorkPanel             | Shows linked tasks, approvals, escalations, knowledge assets, previous related requests.                                                                           |
| EscalationContextPanel      | Shows escalation reason, severity, owner, SLA impact, resolution path.                                                                                             |
| ClosureQualityPanel         | Shows evidence quality, outcome quality, closure status, reviewer, reopen reason.                                                                                  |
| RequestTimeline             | Shows routed, assigned, updated, blocked, escalated, fulfilled, closure reviewed, reopened.                                                                        |
| RequestFulfilmentActionRail | Sticky right rail with Update Progress, Add Evidence, Reassign, Handoff, Escalate, Mark Fulfilled, Send to Closure Review, Reopen.                                 |
| ProgressUpdateFlow          | Modal/page for status, progress note, blocker state, evidence state, next action.                                                                                  |
| ReassignHandoffFlow         | Modal/page for current owner, target owner, target queue, handoff reason, handoff note, previous owner, confirmation.                                              |
| EscalateRequestFlow         | Modal/page for escalation reason, severity, SLA impact, escalation owner, linked work, resolution path.                                                            |
| ClosureReviewReopenFlow     | Modal/page for evidence quality, outcome quality, closure decision, reopen reason, correction required.                                                            |
| RequestsHealthSignalStrip   | KPI cards for backlog, SLA exposure, owner load, ageing, recurrence, escalation concentration, closure quality.                                                    |
| RequestConfigReferenceTable | Read-only table for categories, owner mappings, SLA rules, routing rules, closure criteria.                                                                        |
| CategoryBadge               | Shows HRA, IT & Access, Platform Support, Knowledge, Task/Workflow, Approval, Admin.                                                                               |
| QueueBadge                  | Shows queue name with neutral styling.                                                                                                                             |
| PriorityPill                | High, Medium, Low using semantic status colours.                                                                                                                   |
| SlaStatusPill               | On Track, Due Soon, At Risk, Breached, Paused, Completed.                                                                                                          |
| EvidenceStateBadge          | Not Started, Pending, Added, Weak, Accepted.                                                                                                                       |
| RequestStatusPill           | Routed, Assigned, In Fulfilment, Clarification Needed, Blocked, Escalated, Evidence Added, Fulfilled, Closure Review, Closed, Reopened.                            |
| MonoId                      | JetBrains Mono for request IDs, queue IDs, SLA IDs, handoff IDs, escalation IDs, closure IDs.                                                                      |
| EmptyState                  | Icon, title, message, CTA; DQ card style.                                                                                                                          |
| Toast                       | Top-right; success/info auto-dismiss after 3s; error remains until dismissed.                                                                                      |
| PlaceholderPage             | Branded placeholder for downstream surfaces not fully built. White card, dashed border, icon, title, description, coming-soon pill.                                |

---

## 8. Scope

### In Scope

1. Add Requests Console as a **Stage 03 fulfilment feature**.
2. Add Requests Console to the Stage 03 sidebar group.
3. Treat Fulfilment Owner Queues as filtered views inside Requests Console.
4. Build Requests Console page with KPI strip, tabs, queue selector, filters, request table, and row actions.
5. Add Owner Queue Views for Platform Support, HRA, Knowledge, Task / Workflow, Approval Support, and Admin.
6. Add shared Request Fulfilment Detail Page.
7. Add fulfilment lifecycle states from Routed through Closed/Reopened.
8. Add Progress Update Flow.
9. Add Reassign / Handoff Flow.
10. Add Escalate Request Flow.
11. Add Closure Review / Reopen Flow.
12. Add Requests Health Signals view.
13. Add read-only Request Configuration Reference.
14. Add evidence and outcome tracking.
15. Add closure-quality state with accepted, rejected, reopened, and correction-required behaviour.
16. Add linked work references for tasks, approvals, escalations, knowledge, and previous requests.
17. Add in-memory prototype state transitions for progress updates, evidence, handoff, escalation, closure, and reopen.
18. Preserve DQ design system alignment across all new and changed surfaces.

### Out of Scope

1. Intake of new support requests.
2. First-level triage and completeness assessment.
3. Initial support routing from Central Support Queue.
4. Real backend request/queue engine.
5. Real API integration.
6. Real SLA timer engine.
7. Real notification delivery.
8. Real Teams/email/chat integration.
9. Real file upload or evidence storage.
10. Full workflow engine implementation.
11. Full SLA dashboard implementation.
12. Full escalation management module.
13. Full request category / owner / routing configuration builder.
14. Real RBAC / permission engine.
15. Rebuilding global header, sidebar shell, persona switcher, marketplace pages, Work Directory, Notifications, Analytics, Services Marketplace, or Central Support Queue.
16. Showing Executives ticket-level inbox behaviour or operational editing actions.

---

## 9. Assumptions

1. The existing DWS.01 prototype shell remains the approved base.
2. Magic Patterns is the selected prototype tool.
3. This is a **Specific** stage feature, not a full shell rebuild.
4. Requests Console is a Stage 03 fulfilment, operations, and governance feature.
5. The feature is not built yet, so Phase 3 defines the first implementation against the existing shell.
6. Requests Console focuses on fulfilment tracking and owner control, not intake triage.
7. Central Support Queue remains separate and owns intake, triage, completeness assessment, initial routing, and return-for-missing-information.
8. Fulfilment Owner Queues are included as filtered views inside Requests Console.
9. A single shared Request Fulfilment Detail Page serves both all-request and owner-queue views.
10. Stage 02 submitted requests and Support Queue routed requests are the primary inputs into Requests Console.
11. Service Owner owns assigned fulfilment requests and progress updates.
12. Support Operator can monitor routed request status and assist with reassignment/escalation follow-up, but does not own fulfilment by default.
13. Lead owns oversight of queue pressure, SLA exposure, blockers, escalations, recurrence, owner load, and closure-quality risk.
14. Workspace Admin configuration is referenced but not fully built.
15. Executives see aggregate fulfilment health only; they do not see ticket-level inbox behaviour or edit operational request items.
16. SLA behaviour is fixture-driven only with states: On Track, Due Soon, At Risk, Breached, Paused, Completed.
17. Evidence handling is represented as prototype fields/notes only; no real file upload.
18. Handoff/reassignment is prototype state only.
19. Escalation is prototype state only and links to escalation queue placeholder.
20. Closure review and reopen behaviour are prototype state only.
21. Request configuration reference is read-only and does not build a full rules/configuration editor.
22. All request fulfilment changes are in-memory prototype state only.
23. The BRS supports this scope through Stage 03 Fulfilment Owner Queues, Fulfilment Dashboard, SLA Dashboard, and related request/fulfilment governance requirements. 
24. Phase 4 must use ordered Magic Patterns Specific-stage Select Mode prompts with fixture rows, states, interactions, and explicit do-not-change lists. 

