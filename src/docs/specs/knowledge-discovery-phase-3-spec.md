

# Feature: Knowledge Discovery Marketplace to Work-Context Reference Flow — Prototype Specific

## 1. Platform Context

* **Platform:** DWS.01 Work.Space4.0
* **Type:** Specialised
* **Prototype Stage:** Specific
* **Stage Coverage:** Thin end-to-end vertical slice from Stage 01 knowledge discovery into Stage 02 work-context application, task/request attachment, feedback capture, content-owner review, and knowledge usage visibility.
* **Industry:** Internal enterprise workspace / digital operating platform.
* **Business basis:** DWS.01 requires reusable knowledge, guidance, references, standards, playbooks, templates, and operating context to be discoverable and usable inside daily work execution. The Knowledge Discovery Marketplace supports users in finding approved guidance, applying it to tasks and requests, giving feedback, and creating visibility over knowledge usage and quality.

### Solution Outcomes

1. **Knowledge discovery becomes marketplace-led.** Associates can browse approved knowledge assets as cards instead of using a flat table.

2. **Knowledge details become decision-ready.** Each asset explains purpose, applicability, when to use, when not to use, evidence/output expectations, ownership, review status, related references, and work linkage.

3. **The raw JSON detail drawer is replaced by a structured Knowledge Detail Page.** Technical metadata is transformed into user-facing sections that help users understand and apply the asset.

4. **Knowledge actions move into the detail page.** Open Reference, Attach to Task, Attach to Request, Start Task from Guide, Acknowledge Guidance, Request Update, and Flag Outdated Content sit in a right-side action rail on the detail page.

5. **Knowledge becomes linked to execution.** Users can attach knowledge to active tasks or requests, or create a task with the selected knowledge pre-linked.

6. **Feedback becomes governed.** Users can flag useful, unclear, outdated, missing-detail, or wrong-owner content, and this creates a prototype review item for the Knowledge Content Owner.

7. **Guidance discipline is embedded without turning the marketplace into a process module.** Applicability, evidence expectations, acknowledgement, exception path, version, owner, and review status are shown as natural knowledge metadata.

8. **Knowledge usage becomes visible.** Executives can see aggregate knowledge usage, linked-work adoption, outdated flags, acknowledgement gaps, and review-health signals.

---

## 2. Build Approach & References

* **Mode:** Existing Build Enhancement
* **Reference Builds Internal:**

  * Existing DWS.01 prototype: `https://dq-prod-dws-01-prototype.vercel.app/`
  * Current Knowledge Discovery screenshots
  * Current filter panel screenshots
  * Current table-based asset listing screenshot
  * Current action drawer screenshot
  * Current JSON-like detail drawer screenshot
  * Existing Stage 02 sidebar marketplace section pattern
* **Reference Builds External:** N/A — feature is driven by DWS.01 BRS, current prototype behaviour, and DQ design system.
* **Base Shell:** Existing DWS.01 prototype.
* **Input Documents:**

  * `26.05_DWS01_BRS_v2 (1).md`
  * `DESIGN (3).md`
  * `plan-feature-spec-prompt.md`
  * `feature-iteration-anatomy.md`
  * Knowledge Discovery screenshots

---

## 3. DevOps

* **Prototype Tool:** Magic Patterns
* **Prototype Repo:** N/A — this phase produces prototype specification only.
* **Prototype Link:** Existing base prototype link available. Updated prototype link will exist after implementation.
* **Build note:** This is a Magic Patterns **Specific** feature. Phase 4 must use ordered **Select Mode** prompts because Specific/Finesse prompts are atomic and must include screen/component scope, fixture data, states, interactions, and explicit do-not-change lists.

---

## 4. Specification

### 4.1 Brand & Visual System

* **Design System Reference:** `DESIGN (3).md` — DQ Design System v1.2.0.
* **Design principle:** Use the DQ token-led design system. DQ uses Navy `#030F35`, Orange `#FB5535`, White `#FFFFFF`, 8px base grid, Plus Jakarta Sans, and 12px standard radius.
* **CTA rule:** DQ Orange is for CTAs, highlights, active states, and brand accent. It must not be used as a semantic status colour.

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
* **Mono font:** JetBrains Mono, weights 400, 500 — used for knowledge IDs, version IDs, task IDs, request IDs, feedback IDs, review queue IDs, acknowledgement IDs, and audit references.

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
* **Card grid:** 3-column desktop, 2-column tablet, 1-column mobile by default.

#### Logo

* Use the current DWS.01 / Work.Space4.0 shell identity from the existing prototype.
* Do not redesign the logo, global header, marketplace dropdown, Discovery Search, persona switcher, notification area, or user menu.

---

### 4.2 Layout Shell

* **Viewport target:** Desktop-first at 1440px+.

* **Top bar:** Keep current DWS.01 header unchanged.

  * Left: DWS.01 / Work.Space4.0 identity and Marketplaces dropdown.
  * Right: Discovery Search, notifications, help, persona switcher, user avatar.

* **Left sidebar placement:** Knowledge Discovery is a **Stage 01 Marketplace feature** accessed from the **Stage 02 signed-in workspace sidebar** under the Stage 01 Marketplaces group.

Recommended sidebar group:

```text
Stage 01 Marketplaces
  Services Marketplace
  Task Template Marketplace
  Knowledge Hub
  Analytics Discovery
  Work Directory
```

* **Knowledge Hub** is active when the marketplace, detail page, reference preview, attach flow, feedback flow, linked knowledge state, or review queue is open.

* **Main content:** White / gray-50 canvas, existing shell padding, existing content max-width.

* **Marketplace layout:** Page title, subtitle, KPI strip, category tabs, filter panel, knowledge card grid.

* **Listing correction:** Replace table listing with card-based marketplace layout.

* **Knowledge Detail layout:** Dedicated page, not drawer.

  * Breadcrumb: Stage 01 Marketplaces / Knowledge Hub / `<Knowledge Asset Title>`
  * Hero summary card
  * Main column:

    * Purpose
    * Applicability
    * When to use
    * When not to use
    * Core guidance
    * Evidence/output expectations
    * Work application
    * Linked work
    * Related knowledge
    * Governance/trust metadata
    * Version history
    * Feedback
  * Right sticky rail:

    * Open Reference
    * Attach to Task
    * Attach to Request
    * Start Task from Guide
    * Acknowledge Guidance
    * Request Knowledge Update
    * Flag Outdated Content
    * Governance/trust metadata

* **Open Reference / Guide Preview layout:** Structured content preview or full reference state. No raw JSON.

* **Downstream layout:** Add thin downstream surfaces:

  * Attach to Task / Request Flow
  * Start Task from Guide Flow
  * Work Item Linked Knowledge View
  * Knowledge Feedback State
  * Knowledge Content Owner Review Queue
  * Executive Knowledge Signal View

---

### 4.3 Personas

Personas are operating roles, not departments.

|  # | Name                    | Role                                                                                                                                                          | Landing Page                              | Nav Scope                                                                            |
| -: | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
|  1 | Associate               | Discovers knowledge, opens detail pages, applies knowledge to work, attaches references, starts tasks from guides, acknowledges guidance, and gives feedback. | Knowledge Discovery Marketplace / My Work | Knowledge Hub, Knowledge Detail, Attach to Task/Request, Task Detail, Request Detail |
|  2 | Knowledge Content Owner | Owns content quality, lifecycle status, review cadence, version metadata, feedback triage, outdated flags, and update requests.                               | Knowledge Review Queue                    | Knowledge Detail, Feedback Queue, Content Review Queue                               |
|  3 | Lead                    | Uses linked guidance while reviewing tasks, requests, outputs, evidence, and closure quality.                                                                 | Review Queue / Task Detail                | Task Detail, Request Detail, Linked Knowledge, Review Context                        |
|  4 | Workspace Admin         | Maintains taxonomy, permissions, owner metadata, review cycle rules, and knowledge categories.                                                                | Admin Console                             | Configuration references only in this feature                                        |
|  5 | Executives              | Monitors aggregate knowledge usage, review health, outdated flags, linked-work adoption, acknowledgement gaps, and quality signals.                           | Executive Knowledge Signal View           | Aggregated dashboards only                                                           |

---

### 4.4 Navigation Structure

```text
Stage 02 Workspace Shell
  Stage 01 Marketplaces
    Services Marketplace
    Task Template Marketplace
    Knowledge Hub
    Analytics Discovery
    Work Directory

Knowledge Discovery Marketplace
  /marketplaces/knowledge
    All
    Guidelines
    Operating Standards
    Process References
    Evidence Standards
    Playbooks
    Templates
    GHC References
    6xD References
    Workspace Guides
    Learning References

Knowledge Detail Page
  /marketplaces/knowledge/:knowledgeId
    Overview
    Purpose
    Applicability
    When to use
    When not to use
    Core guidance
    Evidence / output expectations
    Review / acknowledgement expectations
    How this applies to work
    Linked work
    Related knowledge
    Governance & trust
    Version history
    Feedback
    Action rail

Open Reference / Guide Preview
  /knowledge/:knowledgeId/reference
    Structured reference preview
    Full guide preview
    Source / version metadata

Attach Knowledge
  /knowledge/:knowledgeId/attach
    Attach to Task
    Attach to Request

Start Task from Guide
  /tasks/create/from-knowledge/:knowledgeId
    Task basics
    Linked knowledge context
    Checklist / evidence expectation
    Review & create

Work Item Linked Knowledge
  /tasks/:taskId
    Linked knowledge panel

  /requests/:requestId
    Linked knowledge panel

Knowledge Content Owner
  /knowledge/review
    Feedback Queue
    Update Requests
    Outdated Flags
    Review Due

Executives
  /intelligence/knowledge-signals
    Usage
    Linked work adoption
    Outdated flags
    Acknowledgement gaps
    Review health
```

### Persona route behaviour

| Persona                 | Route behaviour                                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Associate               | Can browse cards, open detail pages, open reference preview, attach knowledge to task/request, start task from guide, acknowledge guidance, and submit feedback. |
| Knowledge Content Owner | Can see flagged/outdated/update-requested knowledge items and update review state in prototype mode.                                                             |
| Lead                    | Can view linked knowledge inside task/request review context and use it to assess output, evidence, or closure readiness.                                        |
| Workspace Admin         | Can see taxonomy/configuration references only; full configuration is out of scope.                                                                              |
| Executives              | Can see aggregate signals only; no editing, review, or attachment actions.                                                                                       |

---

### 4.5 Feature Specification

#### Screens in scope this iteration

1. Knowledge Discovery Marketplace
2. Dedicated Knowledge Detail Page
3. Open Reference / Guide Preview
4. Attach to Task / Request Flow
5. Start Task from Guide Flow
6. Work Item Linked Knowledge View
7. Knowledge Feedback State
8. Knowledge Content Owner Review Queue
9. Executive Knowledge Signal View

#### Demo Storyline

An Associate enters the Knowledge Discovery Marketplace from the Stage 01 Marketplaces section inside the Stage 02 workspace sidebar, browses approved knowledge assets as cards, filters by type, status, usage context, owner, read time, feedback, or role recommendation, opens a dedicated Knowledge Detail Page, reviews purpose, applicability, guidance, evidence/output expectations, acknowledgement expectations, owner, review status, version, linked work, and related knowledge, opens the reference preview, attaches the asset to an active task or request, optionally starts a task from the guide, submits feedback if unclear/outdated/missing/wrong-owner, while the Knowledge Content Owner sees the feedback in a review queue and Executives see aggregate knowledge usage and quality signals.

#### Components per screen

| Screen                               | Components                                                                                                                                                                                                 | Primary Action                 | States Required                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------- |
| Knowledge Discovery Marketplace      | Page header, KPI strip, category tabs, filter panel, knowledge card grid, empty state                                                                                                                      | Open                           | Filled, filtered, empty, loading                        |
| Knowledge Detail Page                | Breadcrumb, hero summary, metadata rail, purpose, applicability, guidance preview, evidence/output expectations, work application, linked work, related knowledge, governance/trust, feedback, action rail | Open Reference                 | Filled, missing asset, loading                          |
| Open Reference / Guide Preview       | Reference header, structured content preview, source/version metadata, related sections, back action                                                                                                       | Attach / Back to Detail        | Preview, full reference, loading                        |
| Attach to Task / Request Flow        | Asset context banner, target selector, task/request list, attach confirmation                                                                                                                              | Attach Knowledge               | Target selected, no targets, attached, validation error |
| Start Task from Guide Flow           | Knowledge context banner, task title, purpose, linked reference, suggested checklist/evidence, review/create                                                                                               | Create Task                    | Prefilled, edited, validation error, created            |
| Work Item Linked Knowledge View      | Linked knowledge panel inside task/request detail, asset chips, usage context, open detail link                                                                                                            | Open Linked Knowledge          | Empty, linked, outdated warning                         |
| Knowledge Feedback State             | Feedback options, comments, severity, owner routing, submission confirmation                                                                                                                               | Submit Feedback                | Useful, unclear, outdated, missing detail, wrong owner  |
| Knowledge Content Owner Review Queue | Queue KPI strip, feedback table/cards, asset summary, review status, owner action panel                                                                                                                    | Mark Reviewed / Request Update | Empty, pending, update requested, reviewed              |
| Executive Knowledge Signal View      | KPI strip, usage signals, linked-work adoption, outdated flags, acknowledgement gaps, review health                                                                                                        | Inspect Signal                 | Filled, no data, high-risk                              |

#### CTA rules

| Location                    | CTA                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Knowledge card              | Open                                                                                                                                 |
| Knowledge detail page       | Open Reference                                                                                                                       |
| Knowledge detail right rail | Attach to Task / Attach to Request / Start Task from Guide / Acknowledge Guidance / Request Knowledge Update / Flag Outdated Content |
| Reference preview           | Attach / Back to Detail                                                                                                              |
| Attach flow                 | Attach Knowledge                                                                                                                     |
| Start task flow             | Create Task                                                                                                                          |
| Feedback state              | Submit Feedback                                                                                                                      |
| Content owner queue         | Mark Reviewed / Request Update / Change Status                                                                                       |
| Executive signal view       | Inspect Signal                                                                                                                       |

#### Knowledge card behaviour

| Element            | Behaviour                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card click         | Opens Knowledge Detail Page.                                                                                                                                                      |
| Open CTA           | Opens Knowledge Detail Page.                                                                                                                                                      |
| Type badge         | Shows asset taxonomy: Guideline, Operating Standard, Process Reference, Evidence Standard, Playbook, Template, GHC Reference, 6xD Reference, Workspace Guide, Learning Reference. |
| Status badge       | Shows Effective, Under Review, Draft, Needs Update, Deprecated.                                                                                                                   |
| Applicability chip | Shows Tasks, Requests, Approvals, Onboarding, Support, Governance, Closure, Workspace.                                                                                            |
| Linked work count  | Shows number of tasks/requests/workflows already linked.                                                                                                                          |
| Feedback marker    | Shows Useful / Has outdated flags / Needs review where relevant.                                                                                                                  |

#### Knowledge Detail Page information model

| Section                               | Required content                                                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Header / Identity                     | Title, knowledge ID, type, status, owner, last reviewed, review due, read time, tags, linked work count.                               |
| Purpose / Summary                     | Plain-language explanation of what the asset is for.                                                                                   |
| Applicability                         | Applicable work types, roles, contexts, and situations.                                                                                |
| When to use                           | Specific scenarios where the asset applies.                                                                                            |
| When not to use                       | Scenarios where another asset/service/template should be used instead.                                                                 |
| Core guidance / Preview               | Structured guidance blocks, not raw JSON.                                                                                              |
| Evidence / output expectations        | Expected proof, output, document, closure note, or record when using the guidance.                                                     |
| Review / acknowledgement expectations | Whether acknowledgement, reviewer confirmation, or approval expectation applies.                                                       |
| How this applies to work              | How the asset supports tasks, requests, approvals, onboarding, support, governance, or closure.                                        |
| Linked work                           | Specific linked tasks, requests, or workflows.                                                                                         |
| Related knowledge                     | Related guidelines, playbooks, standards, templates, GHC/6xD references.                                                               |
| Governance & trust                    | Owner, reviewer, version, lifecycle state, permission scope, last review, next review.                                                 |
| Version history                       | Recent changes and review notes.                                                                                                       |
| Feedback                              | Useful, unclear, outdated, missing detail, wrong owner.                                                                                |
| Action rail                           | Open Reference, Attach to Task, Attach to Request, Start Task from Guide, Acknowledge Guidance, Request Update, Flag Outdated Content. |

#### Knowledge asset taxonomy

| Knowledge type     | Purpose                                                 |
| ------------------ | ------------------------------------------------------- |
| Guideline          | Explains how something should be done.                  |
| Operating Standard | Defines the minimum accepted way of working.            |
| Process Reference  | Explains flow, ownership, applicability, and steps.     |
| Evidence Standard  | Defines what proof/output is required.                  |
| Playbook           | Provides practical execution steps.                     |
| Template           | Provides reusable task/request/document/work structure. |
| GHC Reference      | Links to capability/behaviour guidance.                 |
| 6xD Reference      | Links to transformation method/context.                 |
| Workspace Guide    | Explains DWS.01 usage rules and workspace behaviours.   |
| Learning Reference | Links knowledge to onboarding or capability growth.     |

Do **not** include **Review Checklist** as a standalone asset type. Review/checking logic should appear as metadata or section-level expectations.

---

## 5. User Journeys

### 5.1 Primary Flow

```text
Associate opens Knowledge Discovery Marketplace
→ filters or searches knowledge assets
→ sees assets displayed as cards
→ opens Knowledge Detail Page
→ reviews purpose, applicability, guidance, evidence/output expectation, acknowledgement expectation, owner, status, version, and linked work
→ clicks Open Reference to view the structured guide preview
→ returns to Knowledge Detail Page
→ attaches the asset to an active task or request
→ linked knowledge appears on the work item
→ Associate optionally starts a task from the guide
→ Associate submits feedback if the asset is unclear, outdated, missing detail, or useful
→ Knowledge Content Owner sees feedback/update request in review queue
→ Executives see aggregate knowledge usage and quality signals
```

### 5.2 Alternate Flows

| Flow                         | Behaviour                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| No filter results            | Knowledge Marketplace shows empty state with Clear Filters CTA.                                 |
| Knowledge asset missing      | Detail Page shows branded missing-asset state and Back to Marketplace CTA.                      |
| Open reference               | User opens structured guide/reference preview from the detail page.                             |
| Attach to task               | User selects an active task and links the knowledge asset in prototype state.                   |
| Attach to request            | User selects an active request and links the knowledge asset in prototype state.                |
| No active task/request       | Attach flow shows empty state with Start Task from Guide CTA.                                   |
| Start task from guide        | Task creation opens with knowledge asset pre-linked and suggested purpose/checklist/evidence.   |
| Acknowledgement required     | Detail page shows Acknowledge Guidance action; user confirms and acknowledgement state updates. |
| Acknowledgement not required | Action rail hides or disables acknowledgement CTA.                                              |
| Flag outdated                | Feedback state captures reason and routes item to Knowledge Content Owner Review Queue.         |
| Request update               | User submits update suggestion; review queue shows “Update Requested.”                          |
| Useful feedback              | User marks useful; usage signal and feedback count update.                                      |
| Deprecated asset             | Detail page shows warning banner and related alternatives.                                      |
| Under review asset           | Detail page shows status warning and last/next review metadata.                                 |
| Permission-limited asset     | Detail page shows restricted message and no attach/start-task actions.                          |
| Executive view               | Executive sees aggregate signals only, not asset editing actions.                               |

### 5.3 Edge Cases

N/A — this is Specific stage, not Finesse. However, the following basic states are required so the demo does not break:

* Empty knowledge filter result
* Missing knowledge asset
* Loading knowledge cards
* Loading detail page
* Deprecated asset
* Under review asset
* No linked work
* No related knowledge
* No active task/request to attach
* Attachment validation error
* Knowledge successfully attached
* Acknowledgement required
* Acknowledgement submitted
* Feedback submitted
* Outdated flag created
* Update request created
* No feedback items in review queue
* No executive signal data

---

## 6. Fixture Data

### 6.1 Personas

| Entity  | ID      | Name                    | Role                                                                  | Landing                         | Links to                    |
| ------- | ------- | ----------------------- | --------------------------------------------------------------------- | ------------------------------- | --------------------------- |
| Persona | PER-001 | Associate               | Knowledge user and work-context applier                               | Knowledge Discovery Marketplace | KNO-001, TSK-2401, REQ-2401 |
| Persona | PER-002 | Knowledge Content Owner | Owns content status, review cycle, feedback, version, and lifecycle   | Knowledge Review Queue          | KNO-001, FDB-1001           |
| Persona | PER-003 | Lead                    | Uses linked knowledge during task/request/output review               | Review Queue / Task Detail      | TSK-2403, KNO-004           |
| Persona | PER-004 | Workspace Admin         | Owns taxonomy, owner metadata, permissions, and review-cycle settings | Admin Console                   | CFG-KNO-001                 |
| Persona | PER-005 | Executives              | Aggregate usage and knowledge quality oversight                       | Executive Knowledge Signal View | SIG-KNO-9001                |

### 6.2 Knowledge Types

| Entity         | ID     | Knowledge Type     | Description                                        | Example Asset                        | Links to |
| -------------- | ------ | ------------------ | -------------------------------------------------- | ------------------------------------ | -------- |
| Knowledge Type | KT-001 | Guideline          | Explains how something should be done              | Agile TMS Task Discipline Guide      | KNO-001  |
| Knowledge Type | KT-002 | Operating Standard | Defines minimum accepted way of working            | Evidence Attachment Standard         | KNO-002  |
| Knowledge Type | KT-003 | Process Reference  | Explains flow, ownership, applicability, and steps | Request Fulfilment Process Reference | KNO-003  |
| Knowledge Type | KT-004 | Evidence Standard  | Defines required proof/output                      | Closure Evidence Standard            | KNO-004  |
| Knowledge Type | KT-005 | Playbook           | Provides practical execution steps                 | Blocker Resolution Playbook          | KNO-005  |
| Knowledge Type | KT-006 | Template           | Reusable task/request/document/work structure      | Weekly Delivery Review Template      | KNO-006  |
| Knowledge Type | KT-007 | GHC Reference      | Capability/behaviour reference                     | GHC Execution Behaviour Reference    | KNO-007  |
| Knowledge Type | KT-008 | 6xD Reference      | Transformation method/context                      | 6xD Deployment Reference             | KNO-008  |
| Knowledge Type | KT-009 | Workspace Guide    | DWS.01 usage or workspace rule                     | Workspace Operating Guide            | KNO-009  |
| Knowledge Type | KT-010 | Learning Reference | Capability/onboarding learning reference           | Task Quality Learning Reference      | KNO-010  |

### 6.3 Knowledge Assets

| Entity | ID | Title | Type | Status | Owner | Tags | Links to |
|---|---|---|---|---|---|---|
| Knowledge Asset | KNO-001 | Agile TMS Task Discipline Guide | Guideline | Effective | Knowledge Content Owner | GHC, Task Quality, Closure | TSK-2401 |
| Knowledge Asset | KNO-002 | Evidence Attachment Standard | Operating Standard | Effective | Knowledge Content Owner | Evidence, Closure, Audit | TSK-2403 |
| Knowledge Asset | KNO-003 | Request Fulfilment Process Reference | Process Reference | Under Review | Knowledge Content Owner | Requests, SLA, Routing | REQ-2401 |
| Knowledge Asset | KNO-004 | Closure Evidence Standard | Evidence Standard | Effective | Knowledge Content Owner | Evidence, Review, Closure | TSK-2405 |
| Knowledge Asset | KNO-005 | Blocker Resolution Playbook | Playbook | Effective | Knowledge Content Owner | Blockers, Escalation, Delivery | TSK-2404 |
| Knowledge Asset | KNO-006 | Weekly Delivery Review Template | Template | Effective | Knowledge Content Owner | Review, Delivery, Team | TSK-2406 |
| Knowledge Asset | KNO-007 | GHC Execution Behaviour Reference | GHC Reference | Effective | Knowledge Content Owner | GHC, Behaviour, Execution | TSK-2401 |
| Knowledge Asset | KNO-008 | 6xD Deployment Reference | 6xD Reference | Needs Update | Knowledge Content Owner | 6xD, Deploy, Delivery | FDB-1002 |
| Knowledge Asset | KNO-009 | Workspace Operating Guide | Workspace Guide | Effective | Workspace Admin | DWS.01, Rules, Onboarding | ACK-7001 |
| Knowledge Asset | KNO-010 | Task Quality Learning Reference | Learning Reference | Draft | Knowledge Content Owner | Learning, Task Quality | LRN-5001 |

### 6.4 Knowledge Detail Records

| Entity           | ID          | Knowledge Asset                      | Purpose                                                                                    | Applicability                                                | Evidence / Output Expectation                                                      |
| ---------------- | ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Knowledge Detail | DET-KNO-001 | Agile TMS Task Discipline Guide      | Explains how DQ tasks should be structured, updated, evidenced, reviewed, and closed.      | Tasks, closure quality, task review, Associate onboarding.   | Task output statement, checklist completion, evidence link, closure note.          |
| Knowledge Detail | DET-KNO-002 | Evidence Attachment Standard         | Defines what counts as acceptable evidence when closing work.                              | Tasks, requests, reviews, closure quality.                   | Evidence link, artefact reference, owner confirmation, review note where required. |
| Knowledge Detail | DET-KNO-003 | Request Fulfilment Process Reference | Explains how internal requests move through intake, routing, fulfilment, SLA, and closure. | Requests, fulfilment queues, SLA review, support operations. | Request status, owner note, fulfilment evidence, closure outcome.                  |
| Knowledge Detail | DET-KNO-004 | Closure Evidence Standard            | Defines evidence expectations before a task or request can be closed.                      | Closure reviews, evidence checks, quality review.            | Evidence completeness, output summary, reviewer decision.                          |
| Knowledge Detail | DET-KNO-005 | Blocker Resolution Playbook          | Provides practical steps for identifying, owning, resolving, and escalating blockers.      | Blocked tasks, escalations, delivery flow reviews.           | Blocker reason, owner, next action, escalation path, resolution note.              |

### 6.5 Applicability Records

| Entity        | ID      | Knowledge Asset | Work Types                | Roles                          | Acknowledgement                | Exception Path                                     |
| ------------- | ------- | --------------- | ------------------------- | ------------------------------ | ------------------------------ | -------------------------------------------------- |
| Applicability | APP-001 | KNO-001         | Tasks, Reviews, Closure   | Associate, Lead                | Required for onboarding        | Request clarification from Knowledge Content Owner |
| Applicability | APP-002 | KNO-002         | Tasks, Requests, Closure  | Associate, Lead, Service Owner | Not required                   | Record evidence exception reason                   |
| Applicability | APP-003 | KNO-003         | Requests, Fulfilment, SLA | Associate, Service Owner, Lead | Not required                   | Escalate to fulfilment owner                       |
| Applicability | APP-004 | KNO-004         | Closure, Reviews          | Lead, Associate                | Required for closure reviewers | Return item for missing evidence                   |
| Applicability | APP-005 | KNO-005         | Blockers, Escalations     | Associate, Lead                | Not required                   | Escalate blocker if unresolved                     |

### 6.6 Linked Work Records

| Entity      | ID      | Knowledge Asset | Linked Item                                   | Type    | Status           | Links to |
| ----------- | ------- | --------------- | --------------------------------------------- | ------- | ---------------- | -------- |
| Linked Work | LNK-001 | KNO-001         | TSK-2401 — Improve task closure quality       | Task    | In Progress      | TSK-2401 |
| Linked Work | LNK-002 | KNO-001         | TSK-2403 — Review delivery evidence checklist | Task    | Review Requested | TSK-2403 |
| Linked Work | LNK-003 | KNO-003         | REQ-2401 — Access & Permission Request        | Request | Pending Approval | REQ-2401 |
| Linked Work | LNK-004 | KNO-004         | TSK-2405 — Closure Quality Review             | Task    | Closure Review   | TSK-2405 |
| Linked Work | LNK-005 | KNO-005         | TSK-2404 — Governance Follow-up               | Task    | Blocked          | TSK-2404 |

### 6.7 Related Knowledge Records

| Entity            | ID      | Knowledge Asset | Related Asset | Relationship                        | Links to |
| ----------------- | ------- | --------------- | ------------- | ----------------------------------- | -------- |
| Related Knowledge | REL-001 | KNO-001         | KNO-002       | Supporting evidence standard        | KNO-002  |
| Related Knowledge | REL-002 | KNO-001         | KNO-007       | Related GHC behaviour reference     | KNO-007  |
| Related Knowledge | REL-003 | KNO-002         | KNO-004       | Related closure evidence standard   | KNO-004  |
| Related Knowledge | REL-004 | KNO-003         | KNO-005       | Related blocker escalation playbook | KNO-005  |
| Related Knowledge | REL-005 | KNO-008         | KNO-006       | Related delivery review template    | KNO-006  |

### 6.8 Feedback Records

| Entity   | ID       | Knowledge Asset | Feedback Type  | Submitted By | Status               | Links to |
| -------- | -------- | --------------- | -------------- | ------------ | -------------------- | -------- |
| Feedback | FDB-1001 | KNO-001         | Useful         | Associate    | Logged               | KNO-001  |
| Feedback | FDB-1002 | KNO-008         | Outdated       | Associate    | Pending Review       | KNO-008  |
| Feedback | FDB-1003 | KNO-003         | Missing detail | Lead         | Pending Review       | KNO-003  |
| Feedback | FDB-1004 | KNO-005         | Unclear        | Associate    | Update Requested     | KNO-005  |
| Feedback | FDB-1005 | KNO-006         | Wrong owner    | Associate    | Pending Owner Review | KNO-006  |

### 6.9 Knowledge Review Queue Records

| Entity            | ID       | Knowledge Asset | Queue Reason     | Owner                   | SLA / Review Due | Status           |
| ----------------- | -------- | --------------- | ---------------- | ----------------------- | ---------------- | ---------------- |
| Review Queue Item | KRQ-3001 | KNO-008         | Outdated flag    | Knowledge Content Owner | Due in 3 days    | Pending Review   |
| Review Queue Item | KRQ-3002 | KNO-003         | Missing detail   | Knowledge Content Owner | Due tomorrow     | Update Required  |
| Review Queue Item | KRQ-3003 | KNO-005         | Unclear guidance | Knowledge Content Owner | Due in 5 days    | Review Scheduled |
| Review Queue Item | KRQ-3004 | KNO-006         | Wrong owner      | Knowledge Content Owner | Due in 2 days    | Owner Review     |

### 6.10 Acknowledgement Records

| Entity          | ID       | Knowledge Asset | User      | Required | State        | Links to |
| --------------- | -------- | --------------- | --------- | -------- | ------------ | -------- |
| Acknowledgement | ACK-7001 | KNO-009         | Associate | Yes      | Acknowledged | KNO-009  |
| Acknowledgement | ACK-7002 | KNO-001         | Associate | Yes      | Pending      | KNO-001  |
| Acknowledgement | ACK-7003 | KNO-004         | Lead      | Yes      | Acknowledged | KNO-004  |

### 6.11 Executive Signal Records

| Entity | ID           | Signal                            | Value | Status  | Links to               |
| ------ | ------------ | --------------------------------- | ----: | ------- | ---------------------- |
| Signal | SIG-KNO-9001 | Knowledge assets opened this week |    42 | Info    | Knowledge Marketplace  |
| Signal | SIG-KNO-9002 | Assets linked to work             |    18 | Success | Linked Work            |
| Signal | SIG-KNO-9003 | Outdated flags pending            |     3 | Warning | Knowledge Review Queue |
| Signal | SIG-KNO-9004 | Acknowledgements pending          |     6 | Warning | Acknowledgements       |
| Signal | SIG-KNO-9005 | Effective references              |    27 | Success | Knowledge Assets       |
| Signal | SIG-KNO-9006 | Review overdue                    |     2 | Danger  | Knowledge Review Queue |

---

## 7. Shared Components

| Component                     | Spec                                                                                                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| KnowledgeCard                 | White card, 12px radius, 1px `#D8D9E6` border, 24px padding, icon container, type badge, status badge, title, summary, tags, owner, review date, linked work count, Open CTA. Card click and Open CTA navigate to detail page. |
| KnowledgeFilterPanel          | Search, recommended-for-role toggle, knowledge type filters, review status filters, usage context filters, read time, owner, feedback state, clear filters, result count.                                                      |
| KnowledgeTypeBadge            | Shows Guideline, Operating Standard, Process Reference, Evidence Standard, Playbook, Template, GHC Reference, 6xD Reference, Workspace Guide, Learning Reference.                                                              |
| KnowledgeStatusPill           | Semantic pill: Effective success, Under Review warning, Draft info, Needs Update warning, Deprecated danger. Do not use orange as status.                                                                                      |
| KnowledgeDetailHero           | Breadcrumb, type badge, title, short purpose, status, owner, last reviewed, review due, read time, tags, linked work count.                                                                                                    |
| KnowledgeActionRail           | Sticky right rail with Open Reference, Attach to Task, Attach to Request, Start Task from Guide, Acknowledge Guidance, Request Knowledge Update, Flag Outdated Content, governance metadata.                                   |
| ApplicabilityCard             | Shows applicable work types, roles, contexts, acknowledgement requirement, exception path.                                                                                                                                     |
| CoreGuidancePreview           | Structured guidance blocks: key principles, required behaviour, examples, common mistakes, exceptions. No raw JSON.                                                                                                            |
| EvidenceExpectationCard       | Shows expected evidence/output, closure impact, exception handling.                                                                                                                                                            |
| WorkApplicationCard           | Explains how asset applies to tasks, requests, approvals, onboarding, support, governance, or closure.                                                                                                                         |
| LinkedWorkPanel               | Shows linked tasks/requests/workflows with ID, type, status, owner, and Open link.                                                                                                                                             |
| RelatedKnowledgeGrid          | Shows related assets as compact cards with relationship labels.                                                                                                                                                                |
| GovernanceTrustPanel          | Shows owner, reviewer, version, lifecycle state, permissions, last review, next review.                                                                                                                                        |
| VersionHistoryList            | Shows version ID, date, change summary, reviewer, status.                                                                                                                                                                      |
| KnowledgeFeedbackPanel        | Useful, unclear, outdated, missing detail, wrong owner options with comment field and submit action.                                                                                                                           |
| AttachKnowledgeModal          | Allows user to select task/request target and attach the asset in prototype state.                                                                                                                                             |
| StartTaskFromGuidePanel       | Creates a task with selected knowledge pre-linked and suggested purpose/checklist/evidence.                                                                                                                                    |
| WorkItemLinkedKnowledgeCard   | Appears inside task/request detail showing linked asset, status, owner, and Open Detail link.                                                                                                                                  |
| KnowledgeReviewQueueTable     | Queue/cards for content owner with asset ID, title, reason, feedback type, due date, status, and owner actions.                                                                                                                |
| KnowledgeExecutiveSignalStrip | KPI cards for usage, linked-work adoption, outdated flags, acknowledgements, effective references, review overdue.                                                                                                             |
| AcknowledgementBadge          | Shows Pending, Acknowledged, Not Required using semantic status.                                                                                                                                                               |
| FeedbackStateBadge            | Shows Useful, Unclear, Outdated, Missing Detail, Wrong Owner, Pending Review, Update Requested.                                                                                                                                |
| StatusPill                    | Reusable semantic status pill. Effective = success; Under Review / Needs Update = warning; Deprecated = danger; Draft = info.                                                                                                  |
| MonoId                        | JetBrains Mono for knowledge IDs, task IDs, request IDs, feedback IDs, review queue IDs, acknowledgement IDs.                                                                                                                  |
| EmptyState                    | Icon, title, message, CTA; DQ card style.                                                                                                                                                                                      |
| Toast                         | Top-right; success/info auto-dismiss after 3s; error remains until dismissed.                                                                                                                                                  |
| PlaceholderPage               | Branded placeholder for thin downstream surfaces. White card, dashed border, icon, title, description, coming-soon pill.                                                                                                       |

---

## 8. Scope

### In Scope

1. Replace current table-based Knowledge Discovery listing with card-based marketplace layout.
2. Preserve the current search/filter capability and improve filter structure.
3. Add category tabs for knowledge taxonomy.
4. Add dedicated Knowledge Detail Page.
5. Keep the existing drawer only as optional quick preview, not the main detail experience.
6. Move current action drawer content into the Knowledge Detail Page action rail.
7. Add Open Reference / Guide Preview.
8. Add Attach to Task / Request Flow.
9. Add Start Task from Guide Flow.
10. Add linked knowledge panel inside task/request detail surfaces.
11. Include knowledge feedback capture: useful, unclear, outdated, missing detail, wrong owner.
12. Include Knowledge Content Owner Review Queue thin slice.
13. Include acknowledgement state where required.
14. Include Executive Knowledge Signal View thin slice.
15. Include asset taxonomy: Guideline, Operating Standard, Process Reference, Evidence Standard, Playbook, Template, GHC Reference, 6xD Reference, Workspace Guide, Learning Reference.
16. Include applicability, evidence/output expectations, review/acknowledgement expectations, exception path, version, owner, lifecycle status, and related references.
17. Preserve DQ design system alignment across new and changed surfaces.

### Out of Scope

1. Real backend persistence or API integration.
2. Authentication, login, session management, or IAM changes.
3. Full content editor.
4. Full document management system.
5. Full content approval workflow.
6. Full version-control workflow.
7. Full taxonomy administration console.
8. Full permission-management module.
9. Full search/indexing engine implementation.
10. Full executive dashboard build.
11. Full learning-management module.
12. Microsoft Teams / SharePoint integration.
13. Rebuilding the global header, marketplace dropdown, persona switcher, or shell identity.
14. Treating review/checking logic as a standalone “Review Checklist” asset type.
15. Exposing raw JSON details to users.

---

## 9. Assumptions

1. The existing DWS.01 prototype shell remains the approved base.
2. Magic Patterns is the selected prototype tool.
3. This is a **Specific** stage feature, not a full shell rebuild.
4. Knowledge Discovery is a Stage 01 Marketplace feature accessed from the Stage 02 signed-in workspace sidebar under Stage 01 Marketplaces.
5. The current Knowledge Discovery screen already has KPI strip, tabs, filters, table listing, Open action, action drawer, and raw JSON-like detail drawer.
6. The table listing will be replaced with card-based discovery.
7. The existing drawer may remain only as a quick preview if needed, but the dedicated Knowledge Detail Page becomes the primary governed detail surface.
8. Raw JSON is not acceptable for user-facing detail experience.
9. The current action drawer content should move into the Knowledge Detail Page right-side action rail.
10. The Knowledge Detail Page should show identity, purpose, applicability, core guidance, evidence/output expectations, linked work, related knowledge, governance/trust metadata, version history, feedback, and actions.
11. Knowledge assets may include guidelines, operating standards, process references, evidence standards, playbooks, templates, GHC references, 6xD references, workspace guides, and learning references.
12. “Review Checklist” is not included as a standalone asset type. Review/checking logic appears through review expectation, evidence expectation, approval requirement, closure criteria, acknowledgement, and exception path.
13. Knowledge assets can be attached to tasks or requests in prototype state.
14. Starting a task from a guide creates a prototype task with the selected knowledge pre-linked.
15. Knowledge feedback creates prototype review queue items for the Knowledge Content Owner.
16. Acknowledgement is prototype-only and applies only where the asset requires it.
17. Executives are oversight users only; they do not edit, review, attach, or acknowledge knowledge assets in this feature.
18. Workspace Admin configuration is referenced but not built in this feature.
19. All attachment, feedback, acknowledgement, review, and usage signals are in-memory prototype state only.
20. The BRS supports this scope through Knowledge Hub, Recommended References, Service / Knowledge Feedback, Global Search, and Stage 2 linked knowledge/task capabilities.
21. Phase 4 must use Magic Patterns Specific-stage Select Mode prompts with fixture rows, state machines, interactions, and explicit do-not-change lists.

