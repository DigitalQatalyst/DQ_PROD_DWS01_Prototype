# Feature: Task Library Marketplace to Task Creation Flow — Prototype Specific

## 1. Platform Context

* **Platform:** DWS.01 Work.Space4.0
* **Type:** Specialised
* **Prototype Stage:** Specific
* **Stage Coverage:** Thin end-to-end vertical slice from Stage 1 task template discovery into Stage 2 task creation, task tracking, progress update, review request, and closure-quality visibility.
* **Industry:** Internal enterprise workspace / digital operating platform
* **Business basis:** The BRS defines **Task Template Catalogue** as a Stage 1 feature where users discover and select task templates with required fields, checklist items, evidence rules, and closure criteria. It also defines downstream Stage 2 task capabilities including Create Task, Task Detail View, Task Updates & Evidence, Blocker Management, and Request/Task status visibility. 

### Solution Outcomes

1. **Task template discovery becomes actionable.** Associates can discover governed task templates and use them to create structured tasks.
2. **Task template details become decision-ready.** Each template explains purpose, expected output, checklist depth, evidence rules, review path, SLA/due-date guidance, related knowledge, and closure criteria.
3. **Selected template context pre-populates the task creation workflow.** Template name, type, purpose, expected output, checklist items, required-for-closure flags, evidence rules, review path, SLA/due-date guidance, related knowledge, and closure criteria are prefilled from the selected template.
4. **Created task fields remain editable at task-instance level.** Associates can edit the created task’s title, purpose, expected output, owner/contributors, priority, due date/SLA target, strategic context, checklist additions, evidence notes, and execution notes without changing the master template.
5. **Created tasks become governed execution records.** The prototype generates a task ID, owner, due date/SLA, checklist, evidence state, review state, template deviation state, and closure-quality status.
6. **Task lifecycle visibility is role-based.** Associates track their own created tasks, Reviewer/Lead users review submitted work, Workspace Admins see configuration references, and Executives see aggregate execution signals.
7. **Governance fields are protected from accidental weakening.** Mandatory checklist items, evidence rules, review path, and closure criteria are locked, partially editable, or require an override reason when changed. Deviations from the template baseline appear in the review and closure-quality views.
8. **Closure quality is visible before completion.** Checklist completion, evidence requirement, expected output, review status, template deviations, and closure criteria are visible before a task is marked complete.

---

## 2. Build Approach & References

* **Mode:** Existing Build Enhancement
* **Reference Builds Internal:**

  * Existing DWS.01 prototype: `https://dq-prod-dws-01-prototype.vercel.app/`
  * Current Task Template Catalogue screenshots
  * Current filter panel screenshots
  * Current task detail drawer screenshots
  * Current task creation wizard screenshots
  * Current progress update / review toast screenshots
* **Reference Builds External:** N/A — feature is driven by DWS.01 BRS, current prototype behaviour, and DQ design system.
* **Base Shell:** Existing DWS.01 prototype.
* **Input Documents:**

  * `26.05_DWS01_BRS_v2 (1).md`
  * `DESIGN (3).md`
  * `plan-feature-spec-prompt.md`
  * `feature-iteration-anatomy.md`
  * Task Template Catalogue screenshots

---

## 3. DevOps

* **Prototype Tool:** Magic Patterns
* **Prototype Repo:** N/A — this phase produces prototype specification only.
* **Prototype Link:** Existing base prototype link available. Updated prototype link will exist after implementation.
* **Build note:** Because this is Magic Patterns **Specific** stage and the feature spans multiple surfaces, Phase 4 should be written as ordered **Select Mode** prompts, not one broad rebuild prompt. The feature-iteration anatomy requires named screens/components, explicit fixture data, states, interactions, and do-not-change scope. 

---

## 4. Specification

### 4.1 Brand & Visual System

* **Design System Reference:** `DESIGN (3).md` — DQ Design System v1.2.0.
* **Design principle:** Use the DQ token-led visual system. DQ Navy `#030F35`, DQ Orange `#FB5535`, DQ White `#FFFFFF`, and 12px radius are defined as core tokens. 
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
* **Mono font:** JetBrains Mono, weights 400, 500 — used for task IDs, template IDs, review IDs, evidence IDs, SLA codes, and audit references.

#### Radii

* **Card:** 12px
* **Modal / wizard:** 12px
* **Button:** 8px
* **Badge / pill:** 999px

#### Spacing

* **Base grid:** 8px
* **Standard card padding:** 24px
* **Feature/detail card padding:** 32px
* **Form field gap:** 16px
* **Page padding:** 32–80px

#### Logo

* Use the current DWS.01 / Work.Space4.0 shell identity from the existing prototype.
* Do not redesign the logo, global header, marketplace dropdown, Discovery Search, persona switcher, notification area, or user menu.

---

### 4.2 Layout Shell

* **Viewport target:** Desktop-first at 1440px+.
* **Top bar:** Keep current DWS.01 header unchanged.

  * Left: DWS.01 / Work.Space4.0 identity and Marketplaces dropdown.
  * Right: Discovery Search, notifications, help, persona switcher, user avatar.
* **Left sidebar:** N/A for Stage 1 marketplace surfaces. The Task Library Marketplace remains a header-accessed marketplace surface.
* **Main content:** White / gray-50 canvas, existing shell padding, existing content max-width.
* **Marketplace layout:** Page title, subtitle, KPI strip, category tabs, filter panel, template card grid.
* **Template Detail layout:** Dedicated page, not only drawer.

  * Breadcrumb: Marketplaces / Task Templates / `<Template Name>`
  * Hero summary card
  * Main column: purpose, when to use, expected output, checklist, evidence rules, workflow/review path, closure criteria, related knowledge
  * Right rail: Use Template CTA, owner, template type, checklist depth, evidence rule, review path, SLA/due-date guidance, audit note
* **Task creation workflow layout:** Reuse the existing wizard pattern. When an Associate clicks **Use Template**, the task creation workflow opens with the selected template context already prefilled.

  * Current visible prototype steps:

    1. Task basics
    2. Strategic context
    3. Checklist & evidence
    4. Workflow & review
    5. Review & create
  * This is current prototype behaviour, not a permanent platform standard.
  * The number of steps may vary by task type/template complexity.
  * The workflow must not behave like a blank form. It should behave like a **prefilled editable task instance** generated from the selected template.
  * The Associate confirms or edits task-specific fields before creating the task.
* **Downstream layout:** Add thin downstream surfaces:

  * Task Created Confirmation
  * Task Detail / Status View
  * Progress Update / Evidence State
  * Reviewer / Lead Review Queue
  * Closure Quality State
  * Executive Task Signal View

---

### 4.3 Personas

Personas are operating roles for this feature. **Associate and Task Owner are aggregated into one persona.**

|  # | Name            | Role                                                                                                                                                           | Landing Page                       | Nav Scope                                                                      |
| -: | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
|  1 | Associate       | Discovers templates, uses a template, creates and owns the task, updates progress, adds evidence, requests review, and tracks closure.                         | Task Template Catalogue / My Tasks | Task Template Catalogue, Template Detail, Task Creation, Task Detail, My Tasks |
|  2 | Reviewer / Lead | Reviews task output, checklist completion, evidence quality, blockers, template deviations, and closure readiness. Can return, approve, or request correction. | Review Queue                       | Review Queue, Task Detail, Closure Quality View                                |
|  3 | Workspace Admin | Configures task templates, checklist rules, evidence requirements, review paths, SLA/due-date defaults, and template metadata.                                 | Admin Console                      | Configuration references only in this feature                                  |
|  4 | Executives      | Monitors aggregate template usage, task quality, overdue/at-risk tasks, review bottlenecks, evidence completeness, and closure discipline.                     | Executive Task Signal View         | Aggregated dashboards only                                                     |

---

### 4.4 Navigation Structure

```text
Task Library Marketplace
  Task Template Catalogue
    All
    Personal Work
    Team Delivery
    Review
    Governance
    Closure Quality

Task Template Detail Page
  /marketplaces/task-templates/:templateId
    Overview
    When to use
    Expected output
    Checklist structure
    Evidence requirements
    Workflow & review path
    SLA / due-date guidance
    Closure criteria
    Related knowledge
    Related templates
    Audit note

Task Creation Workflow
  /tasks/create/:templateId
    Task basics
    Strategic context
    Checklist & evidence
    Workflow & review
    Review & create
  Note: steps may vary by template category and task complexity.

Task Lifecycle
  /tasks/:taskId
    Task Detail / Status View
    Progress update
    Evidence state
    Review state
    Template deviation state
    Closure quality

Reviewer / Lead
  /tasks/review
    Review Queue
    Closure Quality Review

Executives
  /intelligence/task-signals
    Template usage
    At-risk tasks
    Review bottlenecks
    Evidence completeness
    Closure quality
```

### Persona route behaviour

| Persona         | Route behaviour                                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Associate       | Can browse templates, open template details, use template, create a prefilled editable task instance, save draft, update progress, attach evidence stub, request review, and track own task status. |
| Reviewer / Lead | Can see review-required tasks, inspect output/evidence/checklist/template deviations, return for correction, approve, or mark closure-ready in prototype mode.                                      |
| Workspace Admin | Can see configuration references and template governance metadata; full configuration build is out of scope.                                                                                        |
| Executives      | Can see aggregate task-template, evidence, review, and closure-quality signals only; no task creation or review actions.                                                                            |

---

### 4.5 Feature Specification

#### Screens in scope this iteration

1. Task Template Catalogue
2. Dedicated Task Template Detail Page
3. Task Creation Workflow
4. Task Created Confirmation
5. Task Detail / Status View
6. Progress Update / Evidence State
7. Review Request State
8. Reviewer / Lead Review Queue
9. Closure Quality State
10. Executive Task Signal View

#### Demo Storyline

An Associate enters the Task Template Catalogue, filters by template type, evidence requirement, checklist depth, SLA, approval/review path, or best-for category, opens a dedicated task template detail page, reviews purpose, expected output, checklist, evidence rules, review path, and closure criteria, clicks **Use Template**, lands in a task creation workflow where reusable template fields are prefilled, edits task-specific fields where needed, provides override reasons for protected governance deviations, creates the task, updates progress and evidence, requests review, while a Reviewer/Lead sees the task in review queue and Executives see aggregate task-template usage and closure-quality signals.

#### Components per screen

| Screen                           | Components                                                                                                                                                                                                 | Primary Action                        | States Required                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| Task Template Catalogue          | Page header, KPI strip, category tabs, filter panel, template cards, empty state                                                                                                                           | Use Template / Open Template Detail   | Filled, filtered, empty, loading                                        |
| Task Template Detail Page        | Breadcrumb, hero summary, metadata rail, purpose, expected output, checklist, evidence rules, review path, closure criteria, related knowledge                                                             | Use Template                          | Filled, missing template, loading                                       |
| Task Creation Workflow           | Template context banner, prefilled editable task fields, protected governance fields, task basics, strategic context, checklist/evidence setup, workflow/review, template deviation summary, review/create | Create Task / Save Draft              | Prefilled, edited, override required, validation error, review, created |
| Task Created Confirmation        | Success card, task ID, owner, status, due date/SLA, review path, deviation marker, next action                                                                                                             | View Task                             | Created, draft saved                                                    |
| Task Detail / Status View        | Task header, checklist progress, evidence state, blocker state, progress notes, comments, review status, template deviation markers, closure criteria                                                      | Update Progress / Request Review      | Not started, in progress, blocked, review requested, returned, closed   |
| Progress Update / Evidence State | Progress update panel, checklist toggles, evidence stub, evidence missing/attached state                                                                                                                   | Save Progress                         | Missing evidence, partial progress, evidence attached                   |
| Reviewer / Lead Review Queue     | Queue KPI strip, task review cards/table, output summary, checklist/evidence completeness, template deviation summary, decision panel                                                                      | Approve / Return / Request Correction | Empty, pending review, returned, approved                               |
| Closure Quality State            | Closure criteria card, evidence completeness, checklist completion, review decision, deviation summary, closure outcome                                                                                    | Mark Closure Ready / Close Task       | Ready, missing evidence, weak closure, closed                           |
| Executive Task Signal View       | KPI strip, template usage, evidence completeness, review bottlenecks, overdue/at-risk tasks, closure quality indicators                                                                                    | Inspect Signal                        | Filled, no data, high-risk                                              |

#### CTA rules

| Location               | CTA                                    |
| ---------------------- | -------------------------------------- |
| Template card          | Use Template                           |
| Template detail page   | Use Template                           |
| Task creation workflow | Back / Next / Save Draft / Create Task |
| Confirmation           | View Task / Back to Task Templates     |
| Task detail            | Update Progress / Request Review       |
| Review queue           | Approve / Return / Request Correction  |
| Closure quality        | Mark Closure Ready / Close Task        |

#### Prefill and edit behaviour

| Field group                     | Behaviour                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Template name / template ID     | Prefilled and locked.                                                                                           |
| Template type / category        | Prefilled and locked unless Workspace Admin changes the master template.                                        |
| Purpose                         | Prefilled and editable at task-instance level.                                                                  |
| Expected output                 | Prefilled and editable at task-instance level.                                                                  |
| Checklist items                 | Prefilled. Mandatory checklist items are protected; optional items can be added, edited, removed, or reordered. |
| Required-for-closure flags      | Prefilled and protected. Override requires reason.                                                              |
| Evidence requirement            | Prefilled and protected. Evidence can be attached later; requirement cannot be removed without override reason. |
| Review path                     | Prefilled and protected/limited. Change requires reason or elevated permission.                                 |
| Closure criteria                | Prefilled and mostly protected. Exception requires reason.                                                      |
| Related knowledge               | Prefilled; Associate can add more references.                                                                   |
| Task title                      | Suggested from template and editable.                                                                           |
| Owner / contributors            | Defaults to Associate; editable if reassignment is allowed.                                                     |
| Due date / SLA target           | Suggested from template guidance; editable with reason if outside guidance.                                     |
| Priority                        | Defaults from template; editable.                                                                               |
| Strategic context               | Associate selects, links, or marks not applicable.                                                              |
| Evidence files/links            | Added during execution, not fully available at creation.                                                        |
| Execution notes / blocker state | Added during execution.                                                                                         |
| Closure note                    | Added during closure, not during creation.                                                                      |

---

## 5. User Journeys

### 5.1 Primary Flow

```text
Associate opens Task Template Catalogue
→ filters or searches task templates
→ opens Task Template Detail Page
→ reviews purpose, expected output, checklist, evidence rules, review path, SLA/due-date guidance, and closure criteria
→ clicks Use Template
→ task creation workflow opens with selected template context prefilled
→ Associate edits or confirms task title, purpose, expected output, owner/contributors, due date/SLA target, priority, and strategic context
→ Associate reviews prefilled checklist items, evidence rules, review path, related knowledge, and closure criteria
→ mandatory governance fields remain protected or require override reason
→ Associate reviews template deviation summary if any protected or suggested fields were changed
→ Associate creates task
→ confirmation shows task ID, status, owner, due date/SLA, evidence rule, review path, deviation status, and next action
→ Associate opens Task Detail / Status View
→ Associate updates progress and evidence
→ Associate requests review
→ Reviewer / Lead sees the task in Review Queue
→ Reviewer / Lead approves, returns, or requests correction
→ task reaches closure quality state
→ Executives see aggregate template usage and task-quality signals
```

### 5.2 Alternate Flows

| Flow                          | Behaviour                                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Save draft                    | Associate starts task creation and saves before creation. Draft task ID is generated.                                         |
| Missing required fields       | Next/Create is blocked; missing fields show inline validation using danger state.                                             |
| Prefilled task accepted as-is | Associate reviews prefilled fields and creates the task without edits.                                                        |
| Prefilled task edited         | Associate edits allowed task-instance fields; edited values appear in the review step.                                        |
| Mandatory checklist override  | Associate attempts to remove or change a mandatory checklist item; system requires override reason or blocks the change.      |
| Evidence rule override        | Associate attempts to remove evidence requirement; system requires override reason and flags the deviation in review/closure. |
| Review path override          | Associate attempts to change review path; system requires reason or blocks based on permission.                               |
| Template deviation summary    | If any template-derived field is edited, the Review & Create step shows “Changed from template baseline.”                     |
| Master template unchanged     | Edits apply only to the created task instance and never update the master template.                                           |
| No strategic context          | Associate selects “No strategic context yet”; task can continue but carries a visible context gap marker.                     |
| Evidence required             | Task cannot be marked closure-ready until evidence is attached or evidence exception is recorded.                             |
| Evidence optional             | Task can proceed without evidence, but closure review still shows evidence optional state.                                    |
| Review required               | Created task appears in Reviewer / Lead Review Queue after Request Review.                                                    |
| Review only                   | Reviewer checks output and evidence but no formal approval path is shown.                                                     |
| No approval/review            | Task can move directly from progress to closure-quality check.                                                                |
| Returned for correction       | Reviewer returns task; Associate sees correction note in Task Detail / Status View.                                           |
| Blocked task                  | Associate flags blocker; task status changes to Blocked and appears as at-risk in executive signals.                          |
| Closure weak                  | Closure Quality State shows missing output/evidence/checklist and blocks closure.                                             |
| No filter results             | Task Template Catalogue shows empty state with Clear Filters CTA.                                                             |
| Template not found            | Template Detail Page shows branded missing-template state and Back to Catalogue CTA.                                          |

### 5.3 Edge Cases

N/A — this is Specific stage, not Finesse. However, the following basic states are required so the demo does not break:

* Empty template filter result
* Missing template detail
* Task creation validation error
* Draft task saved
* Prefilled fields unchanged
* Prefilled fields edited
* Protected governance override required
* Evidence missing
* Evidence attached
* Checklist partially complete
* Task blocked
* Review requested
* Returned for correction
* Template deviation visible
* Closure criteria not met
* Closed task
* No tasks in Reviewer / Lead queue
* No executive signal data

---

## 6. Fixture Data

### 6.1 Personas

| Entity  | ID      | Name            | Role                                                                 | Landing                    | Links to           |
| ------- | ------- | --------------- | -------------------------------------------------------------------- | -------------------------- | ------------------ |
| Persona | PER-001 | Associate       | Template user, task creator, task owner, progress updater            | Task Template Catalogue    | TSK-2401, TSK-2402 |
| Persona | PER-002 | Reviewer / Lead | Reviews output, evidence, checklist, deviations, and closure quality | Review Queue               | REV-3001, TSK-2403 |
| Persona | PER-003 | Workspace Admin | Template configuration and governance owner                          | Admin Console              | CFG-TPL-001        |
| Persona | PER-004 | Executives      | Aggregate execution and closure-quality oversight                    | Executive Task Signal View | SIG-TASK-9001      |

### 6.2 Template Categories

| Entity            | ID           | Category        | Description                                                           | Owner Type      | Links to |
| ----------------- | ------------ | --------------- | --------------------------------------------------------------------- | --------------- | -------- |
| Template Category | CAT-PERSONAL | Personal Work   | Individual execution tasks, personal follow-ups, onboarding steps     | Workspace Admin | TPL-006  |
| Template Category | CAT-TEAM     | Team Delivery   | Feature delivery, implementation, sprint output, squad delivery tasks | Workspace Admin | TPL-001  |
| Template Category | CAT-REVIEW   | Review          | Peer review, approval review, output validation tasks                 | Reviewer / Lead | TPL-002  |
| Template Category | CAT-GOV      | Governance      | Governance follow-up, audit finding, exception management             | Reviewer / Lead | TPL-003  |
| Template Category | CAT-CLOSURE  | Closure Quality | Closure readiness, output verification, evidence completeness         | Reviewer / Lead | TPL-004  |
| Template Category | CAT-SESSION  | Working Session | Action items from working sessions and follow-ups                     | Workspace Admin | TPL-005  |

### 6.3 Task Templates

| Entity        | ID      | Template Name            | Category        | Checklist Items | Evidence Required | Review Path       | Links to |
| ------------- | ------- | ------------------------ | --------------- | --------------: | ----------------- | ----------------- | -------- |
| Task Template | TPL-001 | Structured Delivery Task | Team Delivery   |               5 | Yes               | Review required   | TSK-2401 |
| Task Template | TPL-002 | Review & Approval Task   | Review          |               3 | Yes               | Approval required | TSK-2403 |
| Task Template | TPL-003 | Governance Follow-up     | Governance      |               4 | Yes               | Review required   | TSK-2404 |
| Task Template | TPL-004 | Closure Quality Review   | Closure Quality |               6 | No                | Review only       | TSK-2405 |
| Task Template | TPL-005 | Working Session Action   | Team Delivery   |               2 | No                | No approval       | TSK-2406 |
| Task Template | TPL-006 | Onboarding Task          | Personal Work   |               1 | Yes               | Review only       | TSK-2407 |

### 6.4 Template Detail Records

| Entity          | ID          | Template                 | Purpose                                                         | Expected Output                                                     | Closure Criteria                                                                         |
| --------------- | ----------- | ------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Template Detail | DET-TPL-001 | Structured Delivery Task | Standard task for feature delivery or technical implementation. | Output conforming to peer review and agreed delivery criteria.      | Checklist complete, evidence attached, output note added, review requested or completed. |
| Template Detail | DET-TPL-002 | Review & Approval Task   | Review another team member’s work and record decision.          | Review decision with comments, rationale, and any correction items. | Review decision recorded, corrections captured, evidence linked where applicable.        |
| Template Detail | DET-TPL-003 | Governance Follow-up     | Address a governance exception, risk, or audit finding.         | Governance issue resolved or action path documented.                | Evidence attached, reviewer confirms closure readiness, governance note added.           |
| Template Detail | DET-TPL-004 | Closure Quality Review   | Review task outputs against closure criteria.                   | Closure quality decision with evidence completeness status.         | Closure criteria satisfied or returned for correction.                                   |
| Template Detail | DET-TPL-005 | Working Session Action   | Capture and complete an action from a working session.          | Action completed and linked to session decision or follow-up.       | Completion note added; evidence optional.                                                |
| Template Detail | DET-TPL-006 | Onboarding Task          | Complete a required onboarding step or learning module.         | Onboarding step complete with acknowledgement/evidence.             | Required item complete, evidence attached if needed, owner confirms.                     |

### 6.4A Template Prefill Rules

| Entity       | ID      | Template                 | Prefilled Fields                                                                                                        | Editable Fields                                                                                                       | Protected Fields                                                      | Override Required |
| ------------ | ------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------- |
| Prefill Rule | PFR-001 | Structured Delivery Task | Purpose, expected output, checklist, evidence rule, review path, closure criteria, due-date guidance, related knowledge | Title, purpose, expected output, owner, contributors, priority, due date, strategic context, optional checklist items | Mandatory checklist, required evidence, review path, closure criteria | Yes               |
| Prefill Rule | PFR-002 | Review & Approval Task   | Purpose, review checklist, evidence rule, reviewer role, decision criteria, closure criteria                            | Title, owner, due date, priority, review note, related references                                                     | Reviewer role, decision requirement, evidence rule                    | Yes               |
| Prefill Rule | PFR-003 | Governance Follow-up     | Purpose, governance checklist, evidence rule, review path, closure criteria                                             | Title, expected output, owner, contributors, due date, strategic context                                              | Evidence rule, governance checklist, closure criteria                 | Yes               |
| Prefill Rule | PFR-004 | Working Session Action   | Purpose, checklist, related session reference, closure note guidance                                                    | Title, due date, owner, priority, optional evidence, strategic context                                                | None unless marked required by session owner                          | No                |

### 6.5 Created Task Records

| Entity | ID       | Template                 | Associate | Status           | Due / SLA     | Evidence | Review                 | Links to          |
| ------ | -------- | ------------------------ | --------- | ---------------- | ------------- | -------- | ---------------------- | ----------------- |
| Task   | TSK-2401 | Structured Delivery Task | Associate | In Progress      | Due in 2 days | Missing  | Not requested          | TPL-001           |
| Task   | TSK-2402 | Structured Delivery Task | Associate | Draft            | Not set       | Missing  | Not requested          | TPL-001           |
| Task   | TSK-2403 | Review & Approval Task   | Associate | Review Requested | Due tomorrow  | Attached | Pending review         | TPL-002, REV-3001 |
| Task   | TSK-2404 | Governance Follow-up     | Associate | Blocked          | At risk       | Missing  | Not requested          | TPL-003           |
| Task   | TSK-2405 | Closure Quality Review   | Associate | Closure Review   | On track      | Optional | Pending closure review | TPL-004, REV-3002 |
| Task   | TSK-2406 | Working Session Action   | Associate | Closed           | Completed     | Optional | Not required           | TPL-005           |

### 6.5A Created Task Instance Edit Records

| Entity             | ID       | Task     | Field Edited    | Original Template Value                                       | Instance Value                                              | Override Reason                        | Links to |
| ------------------ | -------- | -------- | --------------- | ------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------- | -------- |
| Task Instance Edit | EDT-1001 | TSK-2401 | Expected output | Output conforming to peer review and agreed delivery criteria | Updated API contract and tested UI flow attached for review | N/A — editable field                   | TPL-001  |
| Task Instance Edit | EDT-1002 | TSK-2401 | Due date        | 2 business days guidance                                      | Due in 3 business days                                      | Delivery dependency with backend squad | TPL-001  |
| Task Instance Edit | EDT-1003 | TSK-2403 | Review path     | Approval required                                             | Approval required                                           | No change                              | TPL-002  |
| Task Instance Edit | EDT-1004 | TSK-2404 | Evidence rule   | Evidence required                                             | Evidence required with exception note pending               | Governance evidence not yet available  | TPL-003  |

### 6.6 Checklist Records

| Entity         | ID       | Task     | Item                                             | Required for Closure | State       | Links to |
| -------------- | -------- | -------- | ------------------------------------------------ | -------------------- | ----------- | -------- |
| Checklist Item | CLI-1001 | TSK-2401 | Confirm task purpose and expected output         | Yes                  | Complete    | TPL-001  |
| Checklist Item | CLI-1002 | TSK-2401 | Link strategic context or mark as not applicable | No                   | Complete    | TPL-001  |
| Checklist Item | CLI-1003 | TSK-2401 | Complete delivery output                         | Yes                  | In Progress | TPL-001  |
| Checklist Item | CLI-1004 | TSK-2401 | Attach evidence                                  | Yes                  | Not Started | TPL-001  |
| Checklist Item | CLI-1005 | TSK-2401 | Request review                                   | Yes                  | Not Started | TPL-001  |
| Checklist Item | CLI-2001 | TSK-2403 | Review submitted output                          | Yes                  | Complete    | TPL-002  |
| Checklist Item | CLI-2002 | TSK-2403 | Add review decision                              | Yes                  | In Progress | TPL-002  |
| Checklist Item | CLI-2003 | TSK-2403 | Confirm correction path                          | No                   | Not Started | TPL-002  |

### 6.7 Evidence Records

| Entity   | ID       | Task     | Evidence State | Evidence Type        | Required | Links to |
| -------- | -------- | -------- | -------------- | -------------------- | -------- | -------- |
| Evidence | EVD-7001 | TSK-2401 | Missing        | Delivery artefact    | Yes      | CLI-1004 |
| Evidence | EVD-7002 | TSK-2403 | Attached       | Review notes         | Yes      | REV-3001 |
| Evidence | EVD-7003 | TSK-2405 | Optional       | Closure note         | No       | REV-3002 |
| Evidence | EVD-7004 | TSK-2406 | Optional       | Working session note | No       | CLI-5001 |

### 6.8 Review Records

| Entity | ID       | Task     | Reviewer Role   | Decision State         | Rationale                                 |
| ------ | -------- | -------- | --------------- | ---------------------- | ----------------------------------------- |
| Review | REV-3001 | TSK-2403 | Reviewer / Lead | Pending                | Output requires review before closure.    |
| Review | REV-3002 | TSK-2405 | Reviewer / Lead | Pending Closure Review | Closure quality must be confirmed.        |
| Review | REV-3003 | TSK-2404 | Reviewer / Lead | Returned               | Governance follow-up is missing evidence. |

### 6.9 Executive Signal Records

| Entity | ID            | Signal                       | Value | Status  | Links to                   |
| ------ | ------------- | ---------------------------- | ----: | ------- | -------------------------- |
| Signal | SIG-TASK-9001 | Templates used this week     |    24 | Info    | Task Template Catalogue    |
| Signal | SIG-TASK-9002 | Tasks created from templates |    18 | Success | My Tasks                   |
| Signal | SIG-TASK-9003 | Evidence missing             |     6 | Warning | Task Detail                |
| Signal | SIG-TASK-9004 | Review bottlenecks           |     4 | Warning | Review Queue               |
| Signal | SIG-TASK-9005 | Closure quality coverage     |   82% | Success | Closure Quality            |
| Signal | SIG-TASK-9006 | At-risk template tasks       |     3 | Danger  | Executive Task Signal View |

---

## 7. Shared Components

| Component                | Spec                                                                                                                                                                                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TemplateCard             | White card, 12px radius, 1px `#D8D9E6` border, 24px padding, icon container, category badge, title, description, checklist count, evidence required value, review path value, Use Template CTA. Card click opens Template Detail; CTA starts task creation. |
| TemplateFilterPanel      | Search, recommended-for-role toggle, template type filters, evidence requirement filters, checklist depth, default SLA, approval path, best-for filters, clear filters, result count.                                                                       |
| TemplateDetailHero       | Breadcrumb, category badge, template title, short purpose, checklist count, evidence badge, review path badge, Use Template CTA.                                                                                                                            |
| TemplateMetadataRail     | Sticky right rail with owner, template type, checklist depth, evidence rule, review path, due-date/SLA guidance, closure criteria summary, audit note.                                                                                                      |
| ChecklistPreview         | Shows checklist items with required-for-closure marker and completion logic.                                                                                                                                                                                |
| EvidenceRuleCard         | Shows evidence required/optional, accepted evidence examples, missing evidence behaviour, closure impact.                                                                                                                                                   |
| WorkflowReviewPathCard   | Shows no review/review only/approval required, reviewer role, return/correction behaviour.                                                                                                                                                                  |
| ClosureCriteriaCard      | Shows what must be true before task closure: output, checklist, evidence, review, closure note.                                                                                                                                                             |
| TemplatePrefillBanner    | Banner inside task creation workflow showing selected template, template ID, category, checklist count, evidence rule, review path, closure criteria, and message: “This task has been prefilled from the selected template.”                               |
| EditablePrefilledField   | Field component showing prefilled value, edit state, and “Edited from template” marker when changed.                                                                                                                                                        |
| ProtectedGovernanceField | Locked or semi-locked field for mandatory checklist items, evidence rules, review path, and closure criteria. Shows lock icon and “Override requires reason.”                                                                                               |
| OverrideReasonPanel      | Appears when Associate changes protected template-derived governance logic. Requires reason before continuing.                                                                                                                                              |
| TemplateDeviationSummary | Review-step component listing fields changed from template baseline, grouped as editable changes and governance overrides.                                                                                                                                  |
| MasterTemplateNotice     | Small audit note: “Edits apply to this task only. The master template is unchanged.”                                                                                                                                                                        |
| TemplateContextBanner    | Banner inside task creation workflow showing selected template, category, checklist count, evidence rule, review path, and closure criteria.                                                                                                                |
| TaskCreationWizard       | Current wizard pattern reused; step count treated as current prototype behaviour, not permanent standard.                                                                                                                                                   |
| TaskConfirmationCard     | Shows generated task ID, owner, status, due date/SLA, evidence rule, review path, deviation marker, CTAs.                                                                                                                                                   |
| TaskStatusTimeline       | Timeline showing created, in progress, blocked, evidence attached, review requested, returned, closed.                                                                                                                                                      |
| ProgressUpdatePanel      | Lets Associate update progress, checklist state, evidence state, and notes in prototype mode.                                                                                                                                                               |
| ReviewerQueueTable       | Queue table/cards showing task ID, template, owner, evidence completeness, checklist completion, review state, deviation state, action.                                                                                                                     |
| ClosureQualityPanel      | Shows checklist completion, evidence completeness, expected output, review decision, template deviation summary, closure readiness.                                                                                                                         |
| ExecutiveTaskSignalStrip | KPI cards for template usage, created tasks, evidence missing, review bottlenecks, closure quality, at-risk tasks.                                                                                                                                          |
| StatusPill               | Use semantic colours only: success, warning, danger, info, draft/neutral. Do not use orange for semantic status.                                                                                                                                            |
| MonoId                   | JetBrains Mono for task IDs, template IDs, review IDs, evidence IDs.                                                                                                                                                                                        |
| EmptyState               | Icon, title, message, CTA; DQ card style.                                                                                                                                                                                                                   |
| Toast                    | Top-right; success/info auto-dismiss after 3s; error remains until dismissed.                                                                                                                                                                               |

---

## 8. Scope

### In Scope

1. Task Template Catalogue improvements for discovery and Use Template behaviour.
2. Dedicated Task Template Detail Page replacing the drawer as the primary template explanation surface.
3. Template-derived task fields are prefilled when **Use Template** is selected.
4. Prefilled task-instance fields are editable where appropriate.
5. Mandatory governance fields are protected or require override reason.
6. Edits to a created task instance do not update the master template.
7. Review/Create step includes a template deviation summary.
8. Task Detail / Closure Quality views show deviation markers where template governance was overridden.
9. Dynamic checklist and evidence requirements based on selected template.
10. Task created confirmation with generated task ID, status, owner, due date/SLA, evidence rule, review path, and template deviation state.
11. Associate Task Detail / Status View.
12. Progress update and evidence state in prototype mode.
13. Review request state.
14. Reviewer / Lead Review Queue thin slice.
15. Closure Quality State thin slice.
16. Executive Task Signal View thin slice.
17. Prototype state updates for task lifecycle demonstration.
18. DQ design system alignment across new and changed surfaces.

### Out of Scope

1. Real backend persistence or API integration.
2. Authentication, login, session management, or IAM changes.
3. Full task engine implementation.
4. Full workflow engine implementation.
5. Full executive dashboard build.
6. Full Workspace Admin configuration console.
7. Full template builder / template editor.
8. Editing and saving changes back to the master task template.
9. Full template versioning workflow.
10. Approval workflow for template override governance beyond prototype-level reason capture.
11. Full task dependency engine.
12. Microsoft Teams / SharePoint integration.
13. Rebuilding the global header, marketplace dropdown, persona switcher, or shell identity.
14. Treating the current 5-step task wizard as a permanent platform standard.
15. Creating a separate Task Owner persona.

---

## 9. Assumptions

1. The existing DWS.01 prototype shell remains the approved base.
2. Magic Patterns is the selected prototype tool.
3. This is a **Specific** stage feature, not a full shell rebuild.
4. The current Task Template Catalogue already has cards, filters, KPI strip, detail drawer, task wizard, progress update action, and review request action.
5. The detail drawer may remain as quick preview, but the dedicated Task Template Detail Page becomes the primary governed detail surface.
6. The current 5-step task creation workflow is current prototype behaviour only. The permanent platform may vary step count by task type/template complexity.
7. A task template is a reusable governance baseline, not a locked task record.
8. A created task is a task instance generated from a template.
9. Template-derived fields are prefilled in the created task instance.
10. Created task instance fields are editable according to governance rules.
11. Edits to the task instance do not modify the master template.
12. Mandatory checklist items, evidence rules, review paths, and closure criteria are protected or require override reason.
13. Any deviation from the template baseline is visible in the review step and closure-quality view.
14. Evidence files/links are not fully prefilled because evidence is normally produced during execution, not during template selection.
15. Closure note is not prefilled because it must be written after execution.
16. Associate and Task Owner are the same persona for this feature.
17. Reviewer / Lead is the downstream review persona for task output, evidence, and closure quality.
18. Workspace Admin configuration is referenced but not built in this feature.
19. Executives are oversight users only; they do not create, update, review, or close tasks in this feature.
20. All created task, progress, evidence, review, override, and closure changes are in-memory prototype state only.
21. The BRS requires task governance completeness: active tasks should include owner, purpose, expected output, due date/SLA, checklist/CLIs, current status, blocker state, and evidence expectation. 
22. The BRS also positions closure quality as a measurable outcome: closed tasks should include output statement, evidence, checklist completion, and closure-quality status. 
23. Phase 4 must use Magic Patterns Specific-stage Select Mode prompts. Atomic prompts should include fixture rows, state machine, interactions, and explicit do-not-change lists. 