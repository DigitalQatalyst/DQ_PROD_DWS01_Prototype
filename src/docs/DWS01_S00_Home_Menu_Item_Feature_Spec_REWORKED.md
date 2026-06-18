# DWS.01 Work.Space4.0 — S00 Home Menu Item Feature Spec

## Optimized Phase 3 + Phase 4 — Prototype Specific / Finesse

# Feature: Stage 0 — Home Menu Item

## 1. Platform Context

- **Platform:** DWS.01 Work.Space4.0
- **Type:** Generalised internal enterprise execution platform
- **Prototype Stage:** Specific + Finesse
- **Stage Coverage:** Stage 0 — **Home menu item only** under **S00 · ORIENTATION**
- **Industry:** Cross-industry / Internal enterprise execution
- **Prototype Tool:** Magic Patterns
- **Implementation Mode:** Select Mode on existing approved DWS.01 shell

### 1.1 Solution Outcomes

This feature validates that:

1. **Home** is the primary menu item under **S00 · ORIENTATION**.
2. **Onboarding** remains visible under S00 as a separate menu item, but is not built in this feature iteration.
3. **Operating Guide** is removed from the sidebar and its useful guidance is absorbed into Home and the future Onboarding page.
4. **Home** supports two user-state variants: **New Joiner** and **Returning User**.
5. **New Joiner Home** helps the user become workspace-ready through setup, onboarding entry, access readiness, first action guidance, DWS operating rhythm, 4D marketplace introduction, platform updates, and support routes.
6. **Returning User Home** supports execution re-entry through a personal time-based greeting, AI Discovery Search, Today’s Brief, Today’s Priorities, Work Overview, Platform Updates, and Support & Requests.
7. **Returning User Home** avoids duplicate priority/status sections and removes low-value concepts such as Saved Destinations, Recent Workspace Context, repeated AI Preview, and 4D Marketplace Shortcuts.
8. **Home** remains a routing and re-entry surface, not a full dashboard, marketplace, onboarding guide, support centre, or AI console.

### 1.2 Platform Positioning

DWS.01 is DQ’s internal agile enterprise execution platform and the digital operating layer of GHC. It supports structured tasks, requests, knowledge, workflows, approvals, governance, evidence, performance visibility, service fulfilment, and AI-assisted execution with human accountability.

---

## 2. Build Approach & References

- **Mode:** Existing Build Optimisation
- **Base Shell:** Existing approved DWS.01 shell
- **Builder Strategy:** One atomic Specific/Finesse iteration focused on the existing Stage 0 Home surface.
- **Prompt Strategy:** Use Magic Patterns **Select Mode** targeting:
  - Home main content area
  - S00 sidebar label/item only
  - Prototype state switcher behaviour only where already present

### 2.1 Internal References

- Existing DWS.01 shell / Stage 0 prototype screen
- Current New Joiner Home screenshot
- Current Returning User Home screenshot
- Latest generated Returning User Home direction with **Review Risks removed** from Today’s Priorities
- DQ Design System v1.2.0 / `DESIGN (3).md`
- DWS.01 Work.Space4.0 BRS
- DWS Platform Vision
- Feature iteration anatomy for Magic Patterns Specific/Finesse prompts
- Prototype learnings for builder-test quality

### 2.2 UX Principles Applied

- Progressive disclosure: Home shows what is needed to act now and routes deeper detail elsewhere.
- Dashboard restraint: Home must not duplicate Workspace, Execution, Governance, or Intelligence screens.
- Search-first discovery: AI Discovery Search is the primary discovery affordance.
- Role-aware routing: workspace entry and work content are derived from user segment and permissions.
- Action/visibility separation: Today’s Priorities shows what to act on now; Work Overview shows broader work visibility.
- AI as an enabler: AI appears as Discovery Search and Today’s Brief, not as a repeated preview module.

---

## 3. DevOps

- **Prototype Tool:** Magic Patterns
- **Prototype Repo:** N/A — not assigned for this prototype iteration
- **Prototype Link:** Existing DWS.01 shell route / current prototype route
- **Implementation Mode:** Magic Patterns Select Mode
- **Iteration Discipline:** Atomic feature optimisation only. Do not trigger a full shell rebuild.
- **Approval Gate:** Spec approved before applying the §10 build prompt.

---

## 4. Specification

## 4.1 Brand & Visual System

- **Design System Reference:** DigitalQatalyst Design System v1.2.0 / `DESIGN (3).md`
- **Visual Style:** Premium internal enterprise platform; clean, modern, dynamic, calm, and execution-focused.

### Colours

| Token | Value |
|---|---|
| Primary / DQ Navy | `#030F35` |
| Accent / DQ Orange | `#FB5535` |
| Background | `#FFFFFF` |
| Subtle background | `#F3F5FD` or `#F6F6FB` |
| Surface | `#FFFFFF` |
| Surface 2 | `#F6F6FB` |
| Text primary | `#030F35` / `#111118` |
| Text muted | `#454560` |
| Text tertiary | `#5F607F` |
| Text disabled | `#8385A1` |
| Border default | `#D8D9E6` |
| Border subtle | `#EEEFF6` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Error / Danger | `#DC2626` |
| Info | `#2563EB` |

### Colour Rules

- Use DQ Navy for sidebar, headings, authoritative surfaces, and main text.
- Use DQ Orange for primary CTA moments, active states, focus rings, small accent rails, and high-signal brand interactions.
- Do not use orange as a semantic warning colour.
- Do not introduce purple/pink AI colours or non-brand saturated colours.
- Use cool navy-gray surfaces and navy-tinted shadows.

### Typography

- **UI font:** Plus Jakarta Sans, weights 400, 500, 600, 700.
- **Mono font:** JetBrains Mono, weights 400, 500, used only for IDs, codes, technical values, version labels, and compact system labels.
- **Hero headline:** 36–44px, 700.
- **Section heading:** 20–24px, 600.
- **Card title:** 15–16px, 600.
- **Body:** 14–16px, 400.
- **Caption / metadata:** 12px, 400–500.
- **Sidebar group label:** 11px, 600, uppercase, 0.12em tracking.

### Radii, Spacing, Icons, Motion

- **Cards / panels / inputs:** 12px.
- **Hero container:** 16–24px.
- **Buttons:** 8px.
- **Badges / pills / avatars:** 999px.
- **Base grid:** 8px.
- **Standard card padding:** 24px.
- **Compact action card padding:** 16–20px.
- **Hero vertical padding:** 48–56px.
- **Section gap:** 20–28px.
- **Grid gap:** 24px desktop, 16px compact.
- **Icons:** Lucide, 20–24px, 1.5px stroke.
- **Motion:** subtle hover lift `translateY(-2px)`, 200ms ease, reduced-motion safe.

---

## 4.2 Layout Shell

### Viewport

- Desktop-first, optimised for 1440px+.
- Main content max-width: 1180–1240px.
- Main content padding: 32–48px.
- Background: white or very subtle navy/gray tint.

### Top Bar

Preserve the existing approved shell top bar.

- Height: 64px.
- Preserve search/notification/avatar patterns already approved.
- User-state toggle remains prototype-only if already present.

### Left Sidebar

Preserve the existing approved sidebar style with targeted label changes only.

Required S00 structure:

```text
S00 · ORIENTATION
  Home
  Onboarding
```

Rules:

- **Home** is active for this feature.
- **Onboarding** remains visible but is not built in this feature.
- **Operating Guide** must be removed from the sidebar.
- Do not create **Orientation Hub**.
- Active state should use DQ Orange rail/accent and approved active item styling.

### Main Content Layout Pattern

Use a **hybrid enterprise layout**:

1. Focused hero/search area at the top.
2. Operational/re-entry panels below.
3. Compact lower utility row for Platform Updates and Support & Requests.

Do not add a decorative right-side preview block.

---

## 4.3 Personas

The official DWS.01 user model remains role/archetype based. **New Joiner** and **Returning User** are user states, not personas.

| # | Segment | Role | Home Behaviour | Default Workspace Destination |
|---|---|---|---|---|
| 1 | Associate | Daily execution user | New Joiner or Returning based on onboarding/activity | My Work / Personal Execution Workspace |
| 2 | Scrum Master | Flow and task-discipline steward | Returning Home with flow/action emphasis | Agile Execution / Flow View |
| 3 | Team / Squad Lead | Team execution owner | Returning Home with team/risk/review emphasis | Team Execution View |
| 4 | Unit Lead / Value Stream Owner | Unit-level execution and governance owner | Returning Home with unit health/risk emphasis | Unit Visibility View |
| 5 | Functional / Value Stream Operator | Fulfilment/work-context operator | Returning Home with queue/action emphasis | Assigned Fulfilment / Work Queue |
| 6 | Platform Admin | Platform control/configuration owner | Returning Home with configuration/audit emphasis | Administration Console |
| 7 | Support Operator | Service fulfilment and issue-resolution operator | Returning Home with support queue emphasis | Support Operations View |
| 8 | CEO / Executive | Enterprise oversight and value monitor | Returning Home with enterprise signal emphasis | Enterprise Execution View |

Segment rule: **operators execute, leads/owners govern, executives monitor.**

Do not hardcode unconfirmed DQ value-stream/function contexts. HRA may appear only as a validated request/support category.

---

## 4.4 User States

| User State | Meaning | Home Variant | Production Logic |
|---|---|---|---|
| New Joiner | A user entering DWS.01 with incomplete onboarding/setup or requiring platform orientation. | Setup, onboarding, access readiness, first action checklist, DWS rhythm, 4D marketplace introduction, updates, support. | Inferred from onboarding status, profile completion, first-login history, role context, access readiness, and activity history. |
| Returning User | A user with previous DWS.01 activity and workspace context. | Personal time-based greeting, AI Discovery Search, Today’s Brief, Today’s Priorities, Work Overview, Platform Updates, Support & Requests. | Inferred from previous activity, assigned work, open requests, role context, recent events, last work item, and permissions. |

Prototype rule: the **New Joiner / Returning** toggle is for validation only. Production should infer state automatically.

---

## 4.5 Navigation Structure

Required left-sidebar structure for this iteration:

```text
S00 · ORIENTATION
  Home                         -> /stage-0/orientation OR /stage-0/home
  Onboarding                   -> /stage-0/onboarding

S01 · MARKETPLACES
  4D Marketplaces              -> /stage-1/marketplaces
  Discern Marketplace          -> /stage-1/discern
  Design Marketplace           -> /stage-1/design
  Deploy Marketplace           -> /stage-1/deploy
  Drive Marketplace            -> /stage-1/drive

S02 · WORKSPACE
  My Work                      -> /workspace/my-work
  My Tasks                     -> /workspace/my-tasks
  My Requests                  -> /workspace/my-requests
  My Updates                   -> /workspace/my-updates
  My Blockers                  -> /workspace/my-blockers
  Working Sessions             -> /workspace/working-sessions
  Notifications                -> /workspace/notifications

S03 · EXECUTION
  Tasks                        -> /execution/tasks
  Workflows                    -> /execution/workflows
  Trackers                     -> /execution/trackers
  Requests                     -> /execution/requests

S03 · GOVERNANCE & CONTROL
  Approvals                    -> /governance/approvals
  Handoffs                     -> /governance/handoffs
  Escalations                  -> /governance/escalations
  SLA Risks                    -> /governance/sla-risks
  Decision Log                 -> /governance/decision-log
  Closure Reviews              -> /governance/closure-reviews

S03 · INTELLIGENCE
  Execution Dashboard          -> /intelligence/execution-dashboard
  SLA Dashboard                -> /intelligence/sla-dashboard
  Governance Dashboard         -> /intelligence/governance-dashboard
  Team & Unit Performance      -> /intelligence/team-unit-performance
  Outcome Tracking             -> /intelligence/outcome-tracking

S03 · SERVICES & SUPPORT
  Support Queue                -> /services/support-queue
  Fulfilment Queues            -> /services/fulfilment-queues
  Service Requests             -> /services/service-requests
  Platform Support             -> /services/platform-support
  HRA Requests                 -> /services/hra-requests

FOUNDATION · ADMINISTRATION
  User & Role Management       -> /administration/users-roles
  Task Model Configuration     -> /administration/task-model
  Request Category Configuration -> /administration/request-categories
  Workflow & Approval Rules    -> /administration/workflow-approval-rules
  SLA & Notification Rules     -> /administration/sla-notification-rules
  Knowledge Taxonomy           -> /administration/knowledge-taxonomy
  Integration Settings         -> /administration/integrations
  AI / Automation Settings     -> /administration/ai-automation
  Audit Log                    -> /administration/audit-log
```

Navigation rules:

- Home must be the active S00 item.
- Onboarding remains visible but is not built in this Home feature.
- Remove Operating Guide as a menu item.
- Preserve S01 4D Marketplace items.
- If destination routes are not built, show branded placeholder/toast.

---

## 4.6 Feature Specification

### Screens In Scope

- Home menu item under S00 · ORIENTATION.
- Home main content with two states:
  - New Joiner Home
  - Returning User Home
- Prototype-only New Joiner / Returning state switcher behaviour.
- Sidebar label update: **DWS.01 Landing & Orientation → Home**.
- Remove **Operating Guide** from S00.

### Screens Out of Scope

- Onboarding page build.
- Operating Guide page.
- Orientation Hub.
- Full Stage 1 Marketplace pages.
- Full Workspace dashboard.
- Full AI module.
- Full Support console.
- Backend, auth, persistence, or API integration.

### Demo Storyline

1. User enters the DWS.01 shell.
2. Left sidebar shows S00 · ORIENTATION with Home active and Onboarding below.
3. Operating Guide is not visible.
4. Reviewer uses prototype state toggle to validate New Joiner and Returning User states.
5. New Joiner state shows a guided readiness experience.
6. Returning User state shows a clear execution re-entry experience.
7. AI Discovery Search supports permission-aware discovery.
8. Home routes users into Onboarding, 4D Marketplaces, role-based workspaces, requests, support, or placeholders.
9. Home remains clean, purposeful, and non-repetitive.

---

## 4.7 New Joiner Home Specification

### Purpose

Help a new user become workspace-ready.

### Final Page Flow

```text
1. Hero + AI Discovery Search
2. Setup Journey
3. DWS Operating Rhythm
4. Explore DWS Marketplaces
5. Platform Updates + Support & Requests
```

### Section 1 — Hero + AI Discovery Search

- **Layout:** centered hero block, max-width 900px, subtle premium background, no right-side preview card.
- **Headline:**

```text
Good morning, Stephane. Start your DWS.01 journey with clarity.
```

- **Subtext:**

```text
Set up your workspace, understand how work runs, and complete the first actions needed to begin execution.
```

- **AI Discovery Search placeholder:**

```text
Search onboarding guidance, services, access, knowledge, templates, or support.
```

- **Helper text:**

```text
Results are permission-aware and based on your workspace access.
```

- **CTA behaviour:** no large hero CTA buttons are required in the current visual direction. Primary routes are exposed through the Setup Journey cards and Marketplace cards below. If the existing shell requires hero CTAs, use only:
  - Start Onboarding
  - Explore 4D Marketplaces

### Section 2 — Setup Journey

- **Purpose:** show readiness path before daily execution.
- **Layout:** wide panel with progress indicator and four cards.
- **Progress label:**

```text
Setup progress: 2 of 6 steps complete
```

| Card | Description | Status | Destination / Behaviour |
|---|---|---|---|
| Complete Workspace Setup | Personalise workspace profile, role context, and preferences. | Completed | Opens setup/profile placeholder or toast. |
| Start Platform Onboarding | Learn DWS.01 basics and next steps. | Completed / recommended | Routes to `/stage-0/onboarding` or placeholder. |
| Request Access & Tools | Request systems, tools, and access needed. | In progress | Routes to service request / access placeholder. |
| Open First Action Checklist | Review and complete first action checklist. | Not started | Opens checklist drawer or toast. |

### Section 3 — DWS Operating Rhythm

- **Purpose:** explain how work moves in DWS.01 without creating a large guide page.
- **Layout:** compact horizontal rhythm with five steps.

```text
Discover → Start Work → Track Execution → Govern → Improve
```

| Step | Description |
|---|---|
| Discover | Find insights, services, knowledge, owners, and guidance. |
| Start Work | Initiate work using requests, tasks, workflows, and templates. |
| Track Execution | Monitor progress, evidence, blockers, updates, and status. |
| Govern | Apply approvals, quality checks, controls, and decisions. |
| Improve | Learn, adapt, and improve execution outcomes. |

### Section 4 — Explore DWS Marketplaces

- **Purpose:** introduce the 4D model for new users.
- **Layout:** four compact cards, not a full marketplace grid.

| Marketplace | Description | Route |
|---|---|---|
| Discern Marketplace | Discover insights, intelligence, services, knowledge, owners, and guidance. | `/stage-1/discern` |
| Design Marketplace | Design solutions, plans, templates, and setup guidance. | `/stage-1/design` |
| Deploy Marketplace | Deploy services, solutions, requests, tasks, workflows, and trackers. | `/stage-1/deploy` |
| Drive Marketplace | Drive performance, adoption, governance, and outcomes. | `/stage-1/drive` |

### Section 5 — Platform Updates + Support & Requests

- **Layout:** lower two-column utility row.
- **Left:** Platform Updates.
- **Right:** Support & Requests.

Platform Updates examples:

- DWS01 Q2 Platform Release — What’s New.
- Upcoming Maintenance Window.
- New Onboarding Resources Available.

Support & Requests actions:

- Start Service Request.
- IT & Access Requests.
- HRA & Onboarding.
- Platform Support.

Placement rule: Support & Requests remains lower unless an access blocker is detected.

---

## 4.8 Returning User Home Specification

### Purpose

Help a returning user re-enter execution quickly with clear, immediate value.

### Final Page Flow

```text
1. Hero + AI Discovery Search
2. Today’s Brief
3. Today’s Priorities
4. Work Overview
5. Platform Updates + Support & Requests
```

### Section 1 — Hero + AI Discovery Search

- **Layout:** compact centered hero, max-width 900px, restrained enterprise landing feel.
- **Headline:** time-based greeting with profile name.

Morning:

```text
Good morning, Stephane. Start the day with execution clarity.
```

Afternoon:

```text
Good afternoon, Stephane. Keep today’s priorities moving.
```

Evening:

```text
Good evening, Stephane. Close the day with visible progress.
```

- **Subtext:**

```text
Review priority actions, resolve risks early, and continue the work that moves DQ forward.
```

- **AI Discovery Search placeholder:**

```text
Search tasks, requests, services, templates, knowledge, dashboards, or owners.
```

- **Helper text:**

```text
Results are permission-aware and based on your workspace access.
```

- **CTA rule:** remove hero CTA buttons for this final Returning User direction. Do not show Enter Workspace or Explore 4D Marketplaces as large hero buttons on this screen version. Routing is available through sidebar, AI Discovery Search, Today’s Priorities, Work Overview, and row/card actions.

Do not include:

- Review Updates CTA.
- Marketplace shortcut section.
- Saved Destinations.
- Recent Workspace Context.
- Decorative AI Preview section.

### Section 2 — Today’s Brief

- **Purpose:** show AI-enabled work context immediately without requiring the user to click “Generate Brief.”
- **Layout:** one full-width insight panel under the hero/search.
- **Content:** concise work brief, recommended next step, source context, updated timestamp.

Example content:

```text
Today’s Brief
You have 4 priority actions today. One request is approaching SLA risk, and your last active work item is ready to resume.

Recommended next step
Review the returned access request and clear the pending evidence update before EoD.

Based on tasks, requests, risks, and reviews.
Updated 10:42 AM.
```

Actions:

- Open recommended item.
- View full brief.

AI accountability note may appear in tooltip or drawer:

```text
AI provides summaries and recommendations. Accountable owners remain responsible for decisions, approvals, and closure.
```

### Section 3 — Today’s Priorities

- **Purpose:** thin action layer for immediate work movement.
- **Layout:** three thin horizontal action cards in one row.
- **Important change:** remove **Review Risks** from this section.
- **Do not include:** Generate Work Brief as a card. The brief is already visible in Today’s Brief.

| Card | Description | Fixture Detail | Destination / Behaviour |
|---|---|---|---|
| Resume Last Work Item | Continue the last task, request, workflow, tracker, or review item opened. | `REQ-2401 · Access & Permission Request · Pending evidence update` | Opens last work item or fallback toast if none exists. |
| Open Action Queue | View priority items requiring update, evidence, response, or decision today. | `6 items require action today · 2 updates · 1 returned request` | Routes to filtered My Work / Action Queue or placeholder. |
| View Pending Reviews | Review approvals, returned items, closure reviews, and handoffs requiring input. | `3 reviews awaiting input · 1 closure review · 2 handoffs` | Routes to Pending Reviews / Approvals / placeholder. |

### Section 4 — Work Overview

- **Purpose:** show broader work visibility with item glimpses, not simple metric-only tiles.
- **Layout:** 2x2 bento-style card grid. Each card includes:
  - title
  - headline count/status
  - 3-item glimpse list
  - footer route/action

| Card | Headline | Glimpse List | Footer Action |
|---|---|---|---|
| Assigned Work | `18 active · 6 due this week` | DWS01 Service Marketplace refinement — due today; DIA Stage 01 validation — due tomorrow; Corp Web launch support — due Fri. | View all assigned work |
| Open Requests | `7 open · 2 need response` | REQ-2401 Access & Permission Request — Pending evidence; REQ-2398 Platform Support — In fulfilment; REQ-2389 HRA Onboarding — Waiting approval. | View requests |
| Recent Activity | `9 updates since last visit` | Comment added on Workflow Centre spec; Task status changed to Review; Mentioned in Service Marketplace thread. | View activity |
| Risk Watch | `3 active signals` | SLA risk: Access request due in 8h; Blocker: Missing approval owner; Overdue update: Task evidence pending. | View risk watch |

Important distinction:

- **Today’s Priorities** = what requires immediate user action.
- **Work Overview** = broader active-work visibility and signals.

### Section 5 — Platform Updates + Support & Requests

- **Layout:** lower two-column utility row.
- **Left:** Platform Updates.
- **Right:** Support & Requests.

Platform Updates examples:

- DWS01 Q2 Platform Release — What’s New.
- Upcoming Maintenance Window.
- New Onboarding Resources Available.

Support & Requests actions:

- View My Requests.
- Start Service Request.
- Platform Support.
- HRA & Onboarding.

Placement rule: keep this lower on the page. If there is a blocking access/setup issue, show a small alert near the hero instead of moving the whole Support section upward.

---

## 4.9 Components Per Screen

| Screen | Components | Primary Action | States Required |
|---|---|---|---|
| Home — New Joiner | SidebarActiveHome, StateToggle, HomeHero, AIDiscoverySearch, SetupJourneyPanel, DWSOperatingRhythm, MarketplaceIntroCards, PlatformUpdatesPanel, SupportRequestsPanel | Start/continue setup through Setup Journey | New Joiner default, loading, empty updates, access blocker, route unavailable, search empty, search results |
| Home — Returning User | SidebarActiveHome, StateToggle, HomeHero, AIDiscoverySearch, TodaysBriefPanel, TodaysPrioritiesPanel, WorkOverviewBento, PlatformUpdatesPanel, SupportRequestsPanel | Open recommended item / Resume Last Work Item / Open Action Queue | Returning default, no last item, no action items, no pending reviews, no assigned work, no open requests, no risks, empty updates, search results |
| Left Sidebar | StageGroupLabel, SidebarNavItem, SidebarIcon, ActiveIndicator | Open Home | Default, active, hover, collapsed, permission-filtered |
| Prototype State Toggle | NewJoinerPill, ReturningPill | Switch Home state | New Joiner selected, Returning selected |

---

## 5. User Journeys

### 5.1 Primary Flow — New Joiner Home

1. User enters DWS.01 shell.
2. Sidebar shows **S00 · ORIENTATION**.
3. **Home** is active.
4. Main content renders New Joiner Home.
5. User sees: “Good morning, Stephane. Start your DWS.01 journey with clarity.”
6. User can use AI Discovery Search.
7. User reviews Setup Journey.
8. User selects Start Platform Onboarding or Request Access & Tools.
9. System routes to the correct placeholder or built route.

### 5.2 Alternate Flow — New Joiner Explores 4D Marketplaces

1. User clicks a 4D Marketplace card.
2. System routes to the corresponding Stage 1 marketplace route if built.
3. If not built, show branded placeholder.

### 5.3 Alternate Flow — New Joiner Requests Access

1. User selects Request Access & Tools.
2. System routes to access request placeholder.
3. If unavailable, show toast: “Access request flow is not available in this prototype yet.”

### 5.4 Primary Flow — Returning User Home

1. User enters DWS.01 shell.
2. Sidebar shows **S00 · ORIENTATION**.
3. **Home** is active.
4. Main content renders Returning User Home.
5. User sees time-based greeting.
6. User reviews Today’s Brief immediately.
7. User selects Resume Last Work Item, Open Action Queue, or View Pending Reviews.
8. System routes to the correct placeholder or built route.

### 5.5 Alternate Flow — Returning User Opens Recommended Item

1. User clicks **Open recommended item** inside Today’s Brief.
2. System opens the recommended request/task placeholder.
3. If unavailable, show branded placeholder/toast.

### 5.6 Alternate Flow — Returning User Resumes Last Work Item

1. User clicks **Resume Last Work Item**.
2. If last work item exists, open that item.
3. If no last item exists, show: “No recent work item found. Open Action Queue instead.”

### 5.7 Alternate Flow — Returning User Opens Action Queue

1. User clicks **Open Action Queue**.
2. System routes to My Work filtered by today’s required actions.
3. If route is not built, show branded placeholder/toast.

### 5.8 Alternate Flow — Returning User Views Pending Reviews

1. User clicks **View Pending Reviews**.
2. System routes to pending reviews / approvals / handoffs placeholder.
3. If no reviews exist, show: “No pending reviews requiring input.”

### 5.9 Edge Cases

- No last work item.
- No action items.
- No pending reviews.
- No assigned work.
- No open requests.
- No recent activity.
- No risk items.
- No platform updates.
- Search empty.
- Search no results.
- Route unavailable.
- Onboarding route unavailable.
- Access blocker detected.
- Long labels.
- Permission-filtered user.
- AI brief unavailable.

---

## 6. Fixture Data

| Entity | ID | Field 1 | Field 2 | Field 3 | Links to |
|---|---|---|---|---|---|
| User Profile | U-001 | Stephane | DQ Team Member | Returning User | US-002, PS-001 |
| User State | US-001 | New Joiner | Onboarding incomplete | Setup 2/6 complete | NJ-001 to NJ-004 |
| User State | US-002 | Returning User | Has recent workspace context | Last active today | TB-001, TP-001 to TP-003, WO-001 to WO-004 |
| Persona | PS-001 | Associate | Daily execution user | My Work destination | U-001 |
| New Joiner Card | NJ-001 | Complete Workspace Setup | Personalise workspace/profile | Completed | Setup Journey |
| New Joiner Card | NJ-002 | Start Platform Onboarding | Learn DWS.01 basics | Completed / recommended | Onboarding |
| New Joiner Card | NJ-003 | Request Access & Tools | Request systems/tools/access | In progress | Service Request |
| New Joiner Card | NJ-004 | Open First Action Checklist | Review first actions | Not started | Checklist Drawer |
| Operating Step | OR-001 | Discover | Find insights, services, guidance | Step 1 | Stage 1 |
| Operating Step | OR-002 | Start Work | Initiate work with templates | Step 2 | Stage 2 |
| Operating Step | OR-003 | Track Execution | Monitor progress and evidence | Step 3 | Stage 2 |
| Operating Step | OR-004 | Govern | Ensure compliance and quality | Step 4 | Stage 3 |
| Operating Step | OR-005 | Improve | Learn and improve outcomes | Step 5 | Stage 3/4 |
| Marketplace Group | MK-001 | Discern Marketplace | Discover insights/intelligence/opportunities | `/stage-1/discern` | Stage 1 |
| Marketplace Group | MK-002 | Design Marketplace | Design solutions/plans/experiences | `/stage-1/design` | Stage 1 |
| Marketplace Group | MK-003 | Deploy Marketplace | Deploy services/solutions/changes | `/stage-1/deploy` | Stage 1 |
| Marketplace Group | MK-004 | Drive Marketplace | Drive performance/adoption/outcomes | `/stage-1/drive` | Stage 1 |
| Today Brief | TB-001 | 4 priority actions today | 1 request approaching SLA risk | Last work item ready to resume | TP-001, WO-004 |
| Priority Card | TP-001 | Resume Last Work Item | REQ-2401 Access & Permission Request | Pending evidence update | Today’s Priorities |
| Priority Card | TP-002 | Open Action Queue | 6 items require action today | 2 updates, 1 returned request | Today’s Priorities |
| Priority Card | TP-003 | View Pending Reviews | 3 reviews awaiting input | 1 closure review, 2 handoffs | Today’s Priorities |
| Work Overview | WO-001 | Assigned Work | 18 active | 6 due this week | My Work |
| Work Overview | WO-002 | Open Requests | 7 open | 2 need response | My Requests |
| Work Overview | WO-003 | Recent Activity | 9 updates since last visit | Comments, mentions, status changes | Activity |
| Work Overview | WO-004 | Risk Watch | 3 active signals | SLA, blocker, overdue update | Risk Watch |
| Assigned Item | AW-001 | DWS01 Service Marketplace refinement | Due today | Active | WO-001 |
| Assigned Item | AW-002 | DIA Stage 01 validation | Due tomorrow | Active | WO-001 |
| Assigned Item | AW-003 | Corp Web launch support | Due Fri | Active | WO-001 |
| Request Item | REQ-2401 | Access & Permission Request | Pending evidence | Needs response | WO-002 |
| Request Item | REQ-2398 | Platform Support | In fulfilment | Open | WO-002 |
| Request Item | REQ-2389 | HRA Onboarding | Waiting approval | Open | WO-002 |
| Activity Item | ACT-001 | Comment added on Workflow Centre spec | 10:12 AM | Comment | WO-003 |
| Activity Item | ACT-002 | Task status changed to Review | Yesterday | Status change | WO-003 |
| Activity Item | ACT-003 | Mentioned in Service Marketplace thread | Yesterday | Mention | WO-003 |
| Risk Signal | RSK-001 | SLA risk: Access request due in 8h | High | SLA | WO-004 |
| Risk Signal | RSK-002 | Blocker: Missing approval owner | High | Blocker | WO-004 |
| Risk Signal | RSK-003 | Overdue update: Task evidence pending | Medium | Overdue | WO-004 |
| Platform Update | PU-001 | DWS01 Q2 Platform Release — What’s New | May 10, 2024 | Release | Platform Updates |
| Platform Update | PU-002 | Upcoming Maintenance Window — May 18 | May 08, 2024 | Maintenance | Platform Updates |
| Platform Update | PU-003 | New Onboarding Resources Available | May 06, 2024 | Onboarding | Platform Updates |
| Support Action | SR-001 | View My Requests | Track requests and approvals | Returning User | Support & Requests |
| Support Action | SR-002 | Start Service Request | Raise support/assistance | All users | Support & Requests |
| Support Action | SR-003 | Platform Support | Connect with DWS01 support team | All users | Support & Requests |
| Support Action | SR-004 | HRA & Onboarding | HRA/onboarding/policy help | All users | Support & Requests |

---

## 7. Shared Components

### 7.1 HomeHero

- Personal greeting, short subtext, AI Discovery Search.
- Variants: New Joiner / Returning User.
- No decorative right-side preview block.
- Returning User variant has no large hero CTA buttons in final direction.

### 7.2 AIDiscoverySearch

- Search across permitted DWS objects.
- 720–820px desktop width, 44px height, 12px radius.
- States: default, focused, suggestions, loading, no results, permission-filtered.

### 7.3 SetupJourneyPanel

- New Joiner readiness path.
- Progress label/bar plus four setup cards.
- States: incomplete, completed, in progress, not started, access blocker.

### 7.4 DWSOperatingRhythm

- Five-step horizontal operating rhythm.
- Steps: Discover, Start Work, Track Execution, Govern, Improve.

### 7.5 MarketplaceIntroCards

- Four compact 4D cards for New Joiner Home.
- Cards: Discern, Design, Deploy, Drive.

### 7.6 TodaysBriefPanel

- Returning User AI-enabled brief shown by default.
- Includes summary, recommended next step, source context, updated time, and small actions.
- Replaces Generate Work Brief card.

### 7.7 TodaysPrioritiesPanel

- Returning User immediate action layer.
- Thin action cards only.
- Cards: Resume Last Work Item, Open Action Queue, View Pending Reviews.
- Excludes Review Risks and Generate Work Brief.

### 7.8 WorkOverviewBento

- Four bento-style cards with item glimpse lists.
- Cards: Assigned Work, Open Requests, Recent Activity, Risk Watch.
- Each card includes 3 rows and footer route/action.

### 7.9 PlatformUpdatesPanel

- Compact update list with 3 rows and View all updates.

### 7.10 SupportRequestsPanel

- Compact support/request action list.
- Actions: View My Requests, Start Service Request, Platform Support, HRA & Onboarding.

---

## 8. Scope

### In Scope

- Rename visible S00 menu item to Home.
- Keep S00 · ORIENTATION fixed.
- Keep Onboarding as second S00 menu item.
- Remove Operating Guide from sidebar.
- Build/optimise Home for New Joiner and Returning states.
- Add AI Discovery Search in hero.
- Add New Joiner Setup Journey, DWS Operating Rhythm, Marketplace Intro, Platform Updates, Support & Requests.
- Add Returning User Today’s Brief, Today’s Priorities, Work Overview, Platform Updates, Support & Requests.
- Preserve prototype-only New Joiner / Returning toggle.
- Keep Magic Patterns Select Mode scope narrow.

### Out of Scope

- Do not build Onboarding page.
- Do not build Orientation Hub.
- Do not build Operating Guide.
- Do not rebuild full shell.
- Do not rebuild top bar/sidebar outside S00 label/item changes.
- Do not build full Stage 1, Stage 2, Stage 3, Stage 4, or Foundation modules.
- Do not introduce backend, auth, API calls, persistence, Supabase, or real data.
- Do not create standalone AI module/dashboard.
- Do not add Saved Destinations, Recent Workspace Context, repeated AI Preview, 4D Marketplace Shortcuts on Returning Home, Review Risks card in Today’s Priorities, or Generate Work Brief card.

---

## 9. Assumptions

1. Existing DWS.01 shell is approved enough for Specific/Finesse iteration.
2. Magic Patterns Select Mode targets Home main content and S00 sidebar item only.
3. The current route may remain `/stage-0/orientation` for prototype safety while the visible label becomes Home.
4. Onboarding will be specified separately after Home is approved.
5. Stephane is used as the sample user profile name.
6. User-state toggle is prototype-only.
7. Production infers user state from onboarding status, profile completion, role context, previous activity, and permissions.
8. AI Discovery Search and Today’s Brief use fixture/mock data only.
9. AI outputs remain advisory and human-accountable.
10. Support & Requests stays lower unless a blocking access/setup issue is detected.
11. Every interactive element must route, open a meaningful panel/drawer, or show a branded placeholder/toast.
12. Home remains concise and avoids becoming a full dashboard.
13. Visual decisions follow the DQ design system.

---

# 10. Prototype Build Prompt — Magic Patterns Select Mode

## Screen

S00 Home

## Component

Home main content area + S00 sidebar label/item only

## One-Sentence Change

Replace the current Stage 0 Home content with a cleaner two-state Home experience for New Joiner and Returning User, removing the decorative preview blocks and updating Returning User to use Today’s Brief, Today’s Priorities, and rich Work Overview cards.

## Layout

- Keep the existing DWS.01 shell, top bar, sidebar styling, and page chrome.
- Update only the S00 sidebar group content:
  - Group label: `S00 · ORIENTATION`
  - Active item: `Home`
  - Second item: `Onboarding`
  - Remove `Operating Guide` from S00.
- Preserve S01, S02, S03, Services & Support, and Administration groups.
- Main content max-width: 1180–1240px.
- Main content padding: 32–48px.
- Use white/cool navy-gray background, 12px cards, navy text, orange accent only.
- Do not add a decorative right-side hero preview card.
- Do not rebuild the shell.

## Components

### HomeHero

- Render centered hero with personal greeting, subtext, and AI Discovery Search.
- New Joiner headline: `Good morning, Stephane. Start your DWS.01 journey with clarity.`
- New Joiner subtext: `Set up your workspace, understand how work runs, and complete the first actions needed to begin execution.`
- Returning headline: `Good afternoon, Stephane. Keep today’s priorities moving.`
- Returning subtext: `Review priority actions, resolve risks early, and continue the work that moves DQ forward.`
- Do not render large hero CTA buttons on Returning User state.

### AIDiscoverySearch

- White search bar, 720–820px wide desktop, 44px high, 12px radius.
- Left small AI/spark icon using DQ Orange accent.
- Right search icon.
- New Joiner placeholder: `AI Discovery Search — Search onboarding guidance, services, access, knowledge, templates or support...`
- Returning placeholder: `AI Discovery Search — Search tasks, requests, services, templates, knowledge, dashboards, or owners...`
- On focus: show suggestion dropdown with Tasks, Requests, Services, Templates, Knowledge, Dashboards, Owners.
- On Enter: show branded toast or placeholder result state.

### SetupJourneyPanel — New Joiner Only

- Wide white panel with section heading `Setup Journey`.
- Show `Setup progress: 2 of 6 steps complete` and a small orange progress bar.
- Render four cards:
  1. Complete Workspace Setup — status Completed — `3 of 3`
  2. Start Platform Onboarding — status Completed — `2 of 2`
  3. Request Access & Tools — status In progress — `1 of 2`
  4. Open First Action Checklist — status Not started — `0 of 1`
- Cards use compact icons, status pill, short description, and chevron.

### DWSOperatingRhythm — New Joiner Only

- Horizontal one-row rhythm with five steps:
  - Discover — Find insights, services and opportunities.
  - Start Work — Initiate work with the right templates.
  - Track Execution — Monitor progress and stay informed.
  - Govern — Ensure compliance and quality.
  - Improve — Learn, adapt and drive better outcomes.
- Use subtle arrows between steps.

### MarketplaceIntroCards — New Joiner Only

- Section heading: `Explore DWS Marketplaces`.
- Four compact cards:
  1. Discern Marketplace — Discover insights, intelligence and opportunities.
  2. Design Marketplace — Design solutions, plans and experiences.
  3. Deploy Marketplace — Deploy services, solutions and changes.
  4. Drive Marketplace — Drive performance, adoption and outcomes.
- Cards route to placeholders if routes are not built.

### TodaysBriefPanel — Returning User Only

- Full-width insight panel below hero.
- Title: `Today’s Brief`.
- Summary text: `You have 4 priority actions today. One request is approaching SLA risk, and your last active work item is ready to resume.`
- Recommended next step: `Review the returned access request and clear the pending evidence update before EoD.`
- Right metadata: `Based on tasks, requests, risks, and reviews` and `Updated 10:42 AM`.
- Actions: `Open recommended item` and `View full brief`.
- Do not render a separate Generate Work Brief card.

### TodaysPrioritiesPanel — Returning User Only

- Section heading: `Today’s Priorities`.
- Render three thin action cards, not four.
- Cards:
  1. Resume Last Work Item — `REQ-2401 · Access & Permission Request · Pending evidence update`
  2. Open Action Queue — `6 items require action today · 2 updates · 1 returned request`
  3. View Pending Reviews — `3 reviews awaiting input · 1 closure review · 2 handoffs`
- Remove `Review Risks` from this section.
- Do not render `Generate Work Brief` in this section.

### WorkOverviewBento — Returning User Only

- Section heading: `Work Overview`.
- Render 2x2 bento grid.
- Each card includes title, metric, 3-item list, footer action.
- Assigned Work:
  - `18 active · 6 due this week`
  - DWS01 Service Marketplace refinement — Due today
  - DIA Stage 01 validation — Due tomorrow
  - Corp Web launch support — Due Fri
  - footer: `View all assigned work`
- Open Requests:
  - `7 open · 2 need response`
  - REQ-2401 Access & Permission Request — Pending evidence
  - REQ-2398 Platform Support — In fulfilment
  - REQ-2389 HRA Onboarding — Waiting approval
  - footer: `View requests`
- Recent Activity:
  - `9 updates since last visit`
  - Comment added on Workflow Centre spec — 10:12 AM
  - Task status changed to Review — Yesterday
  - Mentioned in Service Marketplace thread — Yesterday
  - footer: `View activity`
- Risk Watch:
  - `3 active signals`
  - SLA risk: Access request due in 8h — High
  - Blocker: Missing approval owner — High
  - Overdue update: Task evidence pending — Medium
  - footer: `View risk watch`

### PlatformUpdatesPanel — Both States

- Lower left panel.
- Title: `Platform Updates`.
- Rows:
  1. DWS01 Q2 Platform Release — What’s New — May 10, 2024
  2. Upcoming Maintenance Window — May 18 — May 08, 2024
  3. New Onboarding Resources Available — May 06, 2024
- Footer link: `View all updates`.

### SupportRequestsPanel — Both States

- Lower right panel.
- Title: `Support & Requests`.
- New Joiner rows:
  1. Start Service Request
  2. IT & Access Requests
  3. HRA & Onboarding
  4. Platform Support
- Returning rows:
  1. View My Requests
  2. Start Service Request
  3. Platform Support
  4. HRA & Onboarding

## Fixture Data

Use exactly these visible sample records:

- User: Stephane, initials `SS`.
- New Joiner setup progress: 2 of 6 steps complete.
- Returning brief: 4 priority actions, 1 request approaching SLA risk, last active item ready to resume.
- Last work item: `REQ-2401 · Access & Permission Request · Pending evidence update`.
- Action queue: `6 items require action today · 2 updates · 1 returned request`.
- Pending reviews: `3 reviews awaiting input · 1 closure review · 2 handoffs`.
- Assigned Work rows:
  - DWS01 Service Marketplace refinement — Due today
  - DIA Stage 01 validation — Due tomorrow
  - Corp Web launch support — Due Fri
- Open Requests rows:
  - REQ-2401 Access & Permission Request — Pending evidence
  - REQ-2398 Platform Support — In fulfilment
  - REQ-2389 HRA Onboarding — Waiting approval
- Recent Activity rows:
  - Comment added on Workflow Centre spec — 10:12 AM
  - Task status changed to Review — Yesterday
  - Mentioned in Service Marketplace thread — Yesterday
- Risk Watch rows:
  - SLA risk: Access request due in 8h — High
  - Blocker: Missing approval owner — High
  - Overdue update: Task evidence pending — Medium
- Platform Updates rows:
  - DWS01 Q2 Platform Release — What’s New — May 10, 2024
  - Upcoming Maintenance Window — May 18 — May 08, 2024
  - New Onboarding Resources Available — May 06, 2024

## States

- New Joiner selected: render New Joiner Home sections.
- Returning selected: render Returning User Home sections.
- Search focused: show suggestions.
- Search no results: show permission-aware empty state.
- No last work item: replace card text with `No recent work item found. Open Action Queue instead.`
- No assigned work: show empty state and route to 4D Marketplaces.
- No open requests: show empty state and route to Start Service Request.
- No risks: show `No blockers or SLA risks detected.` inside Risk Watch.
- No updates: show `No platform updates available.`
- Route unavailable: show branded toast or placeholder card.

## Interactions

- Prototype state toggle click → switch between New Joiner and Returning content.
- Search focus → open suggestion dropdown.
- Search Enter → show placeholder search results/toast.
- Setup Journey card click → open route/placeholder/toast.
- Marketplace card click → route to Stage 1 placeholder.
- Today’s Brief `Open recommended item` click → open REQ-2401 placeholder/detail.
- Today’s Brief `View full brief` click → open lightweight brief drawer or toast.
- Resume Last Work Item click → open REQ-2401 placeholder/detail.
- Open Action Queue click → route to My Work/Action Queue placeholder.
- View Pending Reviews click → route to Pending Reviews placeholder.
- Work Overview card/footer click → route to relevant placeholder.
- Platform Updates row click → open update detail placeholder.
- Support & Requests row click → route to relevant placeholder.

## Do Not Change

- Do not rebuild the full shell.
- Do not change approved top bar styling.
- Do not change sidebar styling except S00 item labels and Operating Guide removal.
- Do not remove S01 4D Marketplace items.
- Do not build Onboarding page.
- Do not build Orientation Hub.
- Do not build Operating Guide.
- Do not build full Stage 1/2/3/4/Foundation modules.
- Do not add Saved Destinations, Recent Workspace Context, Marketplace Shortcuts on Returning Home, repeated AI Preview, Review Updates hero CTA, Review Risks card in Today’s Priorities, or Generate Work Brief card.
- Do not introduce non-DQ colours, purple/pink AI styling, or generic SaaS styling.
- Do not add backend/API/auth logic.

## Design System Alignment

Use existing DWS.01/DQ shell tokens:

- DQ Navy `#030F35`.
- DQ Orange `#FB5535`.
- White/cool navy-gray surfaces.
- Plus Jakarta Sans.
- JetBrains Mono only for IDs and technical strings.
- 8px spacing grid.
- 12px cards.
- 8px buttons.
- Lucide icons at 1.5px stroke.
- WCAG-friendly contrast and visible focus states.
