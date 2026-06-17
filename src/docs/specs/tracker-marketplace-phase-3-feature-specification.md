# Phase 3 — Feature Specification: Tracker Marketplace

# Feature: Tracker Marketplace — Prototype Specific

## 1. Platform Context

* **Platform:** DWS.01 / Work.Space4.0
* **Type:** Specialised internal operations platform
* **Prototype Stage:** Specific
* **Stage Coverage:** Marketplace discovery flow for available trackers and monitoring views
* **Industry:** Internal operations / DQ operating model

## Solution Outcomes

* Users can discover available trackers and understand the purpose of each tracker before using it.
* Users can evaluate whether a tracker is relevant by reviewing its scope, owner, monitored activity, and intended working practice.
* Users can identify the correct tracker workspace without relying on manual guidance, shared links, or scattered documentation.
* Tracker owners and leads can make tracker ownership, usage, and monitoring responsibilities visible to teams.
* Teams can reduce spreadsheet-based tracking by directing work into governed DWS tracker workspaces with clearer ownership and traceability.

---

## 2. Build Approach & References

* **Mode:** Existing Build Optimization
* **Reference Builds Internal:** Existing DWS.01 marketplace pages, Tracker Hub, Active Tracker workspace, and Tracker Record Maintenance page
* **Reference Builds External:** N/A — internal DWS prototype direction is the source of truth
* **Base Shell:** Existing DWS.01 prototype shell
* **Input Documents / Context:**

  * MVP marketplace scope provided by product owner
  * 4D marketplace sidebar pattern
  * Existing Tracker Hub direction
  * Existing Active Tracker workspace direction
  * Existing Tracker Record Maintenance direction
  * DWS.01 visual system and navigation rules

---

## 3. DevOps

* **Prototype Tool:** Codex / existing DWS.01 prototype implementation
* **Prototype Repo:** N/A — to be filled after build
* **Prototype Link:** Existing DWS.01 prototype link / to be updated after build

---

# 4. Specification

## 4.1 Brand & Visual System

* **Design System Reference:** Existing DWS.01 design system

### Colours

* **Primary / DQ Navy:** `#030f35`
* **Secondary / DQ Orange:** `#fb5535`
* **White:** `#ffffff`
* **Background:** `#f6f6fb`
* **Surface:** `#ffffff`
* **Surface 2:** `#f3f5fd`
* **Border:** `#d8d9e6`
* **Text Primary:** `#111118`
* **Text Muted:** `#5f607f`
* **Text Disabled:** `#9ca3af`
* **Success:** `#16a34a`
* **Warning:** `#d97706`
* **Danger:** `#dc2626`
* **Info:** `#2563eb`

### Typography

* **UI Font:** Plus Jakarta Sans
* **Mono Font:** JetBrains Mono — used for tracker IDs, record IDs, SLA codes, and system identifiers

### Radii

* **Cards:** 12px
* **Buttons:** 8px
* **Inputs:** 8px
* **Badges / Pills:** Full pill radius
* **Modals / Drawers:** 12px

### Spacing

* **Base Grid:** 8px
* **Standard Page Padding:** 24px
* **Card Padding:** 16px to 20px
* **Section Gap:** 16px to 24px

### Logo

Use the existing DWS.01 / Work.Space4.0 identity from the current shell. Do not redesign the logo or topbar identity.

---

## 4.2 Layout Shell

The Tracker Marketplace must use the existing DWS.01 shell.

### Topbar

* Use the existing sticky DWS.01 topbar.
* Do not change global topbar layout, global search, notifications, role switcher, user menu, or profile area.
* Tracker Marketplace should be reachable through the existing 4D Marketplace catalogue flow.

### Sidebar

The sidebar should follow the existing 4D marketplace pattern.

The sidebar should show:

```text
MARKETPLACE
  Catalogue
    Discern
    Design
    Deploy
    Drive
```

The Tracker Marketplace should **not** appear as a standalone sidebar item.

The Tracker Marketplace should be reached from the **Drive** marketplace page as a marketplace card.

Do not add tracker execution actions into the marketplace sidebar.

The sidebar should not contain low-level tracker items such as:

* Open Items
* At-Risk Items
* Recently Closed Items
* Add Record
* Save View
* Export Tracker
* Tracker Record Maintenance

These belong inside tracker pages as tabs, CTAs, filters, or contextual actions.

### Main Content

* Background: `#f6f6fb`
* Page padding: 24px
* Use clean marketplace cards, list views, filters, and preview/detail pages.
* Keep the marketplace as a discovery layer, not an execution dashboard.

---

## 4.3 Personas

| # | Name           | Role                                                          | Landing Page              | Nav Scope                                                                     |
| - | -------------- | ------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| 1 | Associate      | Internal DQ user who needs to find and use trackers           | Home / My Work            | Can browse Tracker Marketplace, preview trackers, and open permitted trackers |
| 2 | Lead           | Team or workstream lead responsible for monitoring work       | MyDashboard / Tracker Hub | Can browse, preview, open, and use team trackers                              |
| 3 | Service Owner  | Owner of operational service or tracker domain                | MyDashboard / Tracker Hub | Can view owned tracker types, active trackers, and monitoring views           |
| 4 | Platform Admin | DWS admin responsible for content and marketplace maintenance | Platform Admin            | Can maintain tracker marketplace content where admin capability exists        |

---

## 4.4 Navigation Structure

### Marketplace Sidebar Navigation

The Tracker Marketplace is accessed through the existing 4D Marketplace catalogue navigation.

The marketplace sidebar should follow this structure:

```text
MARKETPLACE
  Catalogue
    Discern
    Design
    Deploy
    Drive
```

### Tracker Marketplace Placement

Tracker Marketplace should sit inside the **Drive** marketplace area because it helps users discover what can be tracked, monitored, reviewed, and followed up through DWS.

Recommended navigation path:

```text
Marketplace
  Catalogue
    Drive
      Tracker Marketplace
```

### User Navigation Flow

```text
User opens Marketplace Catalogue
User selects Drive
User sees Drive marketplace cards
User selects Tracker Marketplace
User lands on Tracker Marketplace
User previews a tracker
User opens the tracker workspace from the tracker details page
```

### Route Pattern

Use a route pattern aligned to the existing marketplace structure.

Recommended Tracker Marketplace landing route:

```text
/marketplace/drive/tracker-marketplace
```

Recommended Tracker Details / Preview route:

```text
/marketplace/drive/tracker-marketplace/:trackerSlug
```

Open Tracker action route:

```text
/tracker/active-tracker/:trackerSlug
```

### Navigation Rule

The sidebar should not list Tracker Marketplace as a separate top-level item.

The MVP scope list should not be treated as sidebar navigation.

The actual marketplace sidebar navigation should remain:

```text
MARKETPLACE
  Catalogue
    Discern
    Design
    Deploy
    Drive
```

Tracker Marketplace should be reached from the **Drive** marketplace page as a marketplace card, not as a direct sidebar item.

---

## 4.5 Feature Specification

## Screens in Scope This Iteration

1. **Drive Marketplace Entry Card**
2. **Tracker Marketplace Landing**
3. **Tracker Card / Tracker Catalogue View**
4. **Tracker Details / Preview Page**
5. **Open Tracker Navigation**
6. **Start Tracker from Template — MVP simulated flow**

---

# Screen 1 — Drive Marketplace Entry Card

## Purpose

The Drive marketplace page is the entry point into the Tracker Marketplace.

Users should first select **Drive** from the 4D marketplace sidebar. The Drive page should then show marketplace cards, including the Tracker Marketplace card.

## Content

On the Drive marketplace page, include a card for:

```text
Tracker Marketplace
```

Card description:

```text
Discover available trackers, monitoring views, and governed tracking templates used across DWS.
```

The card should communicate that the Tracker Marketplace helps users know what can be tracked and where to view or manage it.

## Card Fields

The Drive page Tracker Marketplace card should show:

* Marketplace name: `Tracker Marketplace`
* Short description
* Marketplace category: `Drive`
* Optional icon
* CTA: `Open Marketplace`

## Interaction

When the user clicks `Open Marketplace`, navigate to:

```text
/marketplace/drive/tracker-marketplace
```

---

# Screen 2 — Tracker Marketplace Landing

## Purpose

The Tracker Marketplace landing page helps users understand what trackers are available in DWS and choose the correct tracker to preview.

## Content

The page should include:

* Breadcrumb: `Marketplace / Drive / Tracker Marketplace`
* Page title: `Tracker Marketplace`
* Description: `Discover available trackers, monitoring views, and governed tracking templates used across DWS.`
* Search input
* Category filters
* Recommended trackers
* Recently used trackers
* Tracker catalogue grid or list
* Empty state if no trackers match filters

## Suggested Header Actions

* `View Tracker Hub`
* `Recently Opened`
* `Request New Tracker` — optional MVP CTA, can show toast only

## Tracker Categories

```text
Workload & Capacity
Backlog & Delivery
Project Health
Strategic Initiatives
Governance Follow-up
Actions & Decisions
Risk & Issues
```

---

# Screen 3 — Tracker Card / Tracker Catalogue View

## Purpose

Tracker cards help the user identify the tracker they want to learn more about.

## Important CTA Decision

The tracker card primary CTA should be:

```text
Preview
```

The card should **not** use `Open Tracker` as the primary CTA.

Opening a tracker should only happen after the user previews the tracker details.

## Tracker Card Fields

Each card should show:

* Tracker name
* Short purpose
* Category
* Owner
* Tracker type
* Active tracker count
* Last updated
* Availability / health indicator
* Primary CTA: `Preview`

## Example Card

```text
Project Health Tracker

Monitor project health signals, RAG status, overdue updates, blockers, and evidence.

Category: Project Health
Owner: DQ Operations
Active trackers: 18
Last updated: Today
Health: Amber

CTA: Preview
```

## Card Interaction

* Clicking `Preview` opens the Tracker Details / Preview page.
* The entire card may also be clickable if consistent with existing marketplace behaviour.
* Do not navigate directly into Active Tracker from the card.

---

# Screen 4 — Tracker Details / Preview Page

## Purpose

The details page gives the user enough context before they enter the tracker workspace.

This is where `Open Tracker` should appear.

## Header

* Breadcrumb: `Marketplace / Drive / Tracker Marketplace / {Tracker Name}`
* Title: `{Tracker Name}`
* Description: `{Tracker Purpose}`
* Status indicator: Available / Active / Recommended / Amber / Green

## Primary CTA

```text
Open Tracker
```

## Secondary CTA

```text
Start Tracker
```

Only show `Start Tracker` where the tracker is template-based or where no active tracker exists.

## Details Page Sections

### Overview

* Tracker purpose
* Who should use it
* What it monitors
* Typical update frequency
* Governance owner
* Linked DWS workspace

### Tracker Structure

Show the default fields, for example:

```text
Record ID
Title
Owner
Team / Squad
Priority
Status
Due Date
RAG
Latest Update
Next Action
Evidence
Last Updated
```

### Default Statuses

Example:

```text
Open
In Progress
At Risk
Overloaded
Blocked
Completed
Closed
```

### Example Records

Show 3–5 example tracker records.

Example:

```text
WLD-1001 — Squad Alpha capacity rebalance
PHR-204 — Q2 project health review pending update
GOV-077 — Governance follow-up awaiting owner response
ACT-144 — Working session action overdue
DEC-031 — Decision awaiting confirmation
```

### Related Views

Show related monitoring views where useful:

```text
My Tracker Overview
Team Tracker Overview
Tracker Insights
Active Tracker Workspace
```

### Guidance

Explain how the tracker should be used:

```text
Use this tracker to maintain active records, update ownership, track RAG, capture next actions, attach evidence, and support follow-up governance.
```

---

# Screen 5 — Open Tracker Navigation

## Purpose

The `Open Tracker` CTA moves the user from marketplace discovery into tracker execution.

## Behaviour

When the user clicks `Open Tracker` from the Tracker Details page:

```text
Navigate to /tracker/active-tracker/:trackerSlug
```

Example:

```text
/tracker/active-tracker/project-health-tracker
```

## Rule

Do not open a modal or drawer.

This action should navigate to the selected tracker workspace.

---

# Screen 6 — Start Tracker from Template

## Purpose

For MVP, this is a lightweight simulated action that allows users to start from a tracker template without building full tracker configuration.

## Behaviour

When the user clicks `Start Tracker`:

* Show a confirmation message or toast.
* Create or simulate an active tracker instance in local state.
* Navigate to:

```text
/tracker/active-tracker/:trackerSlug
```

## MVP Rule

Do not build a full tracker template builder in this feature.

---

# 5. Components Per Screen

| Screen                       | Components                                                                                         | Primary Action                    | States Required                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------- |
| Drive Marketplace Entry Card | Drive page card, title, description, icon, Open Marketplace CTA                                    | Open Marketplace                  | Default, hover, focused                                               |
| Tracker Marketplace Landing  | Header, search, filters, category chips, tracker cards, recommended section, recently used section | Search / filter tracker catalogue | Default, filtered, empty, loading-style skeleton if already supported |
| Tracker Card / Catalogue     | Tracker card, owner label, category label, active count, health indicator, Preview CTA             | Preview                           | Default, hover, selected/focused, unavailable                         |
| Tracker Details / Preview    | Header, overview section, tracker structure, statuses, example records, related views, guidance    | Open Tracker                      | Default, unavailable tracker, no example records                      |
| Open Tracker Navigation      | CTA button, route transition                                                                       | Open Tracker                      | Success navigation, unavailable tracker message                       |
| Start Tracker                | Secondary CTA, confirmation/toast                                                                  | Start Tracker                     | Success toast, simulated instance created, route transition           |

---

# 6. User Journeys

## 6.1 Primary Flow

```text
User opens Marketplace Catalogue
User selects Drive from the 4D sidebar
User sees the Drive marketplace page
User selects Tracker Marketplace
User lands on Tracker Marketplace
User sees available tracker cards
User searches or filters trackers
User clicks Preview on a tracker card
User lands on Tracker Details / Preview page
User reviews purpose, owner, fields, example records, and guidance
User clicks Open Tracker
User lands on Active Tracker Workspace for the selected tracker
```

---

## 6.2 Alternate Flows

### Alternate Flow 1 — Start Tracker from Template

```text
User opens Tracker Marketplace
User previews a tracker template
User clicks Start Tracker
System shows confirmation
System simulates creation of tracker instance
User lands on Active Tracker Workspace
```

### Alternate Flow 2 — No Matching Tracker

```text
User searches for a tracker
No tracker matches the search/filter
System shows empty state
User can clear filters or request a new tracker
```

### Alternate Flow 3 — Recently Used Tracker

```text
User opens Tracker Marketplace
User sees Recently Used Trackers
User previews a recently used tracker
User clicks Open Tracker from details page
User lands on Active Tracker Workspace
```

### Alternate Flow 4 — Unavailable Tracker

```text
User previews a tracker marked unavailable
System shows tracker details but disables Open Tracker
System explains that the tracker is not currently active or requires admin setup
```

---

## 6.3 Edge Cases

N/A — this is a Specific stage specification. Detailed edge cases can be covered during Finesse.

However, the prototype should still handle:

```text
No trackers available
No search results
Unavailable tracker
Missing owner
Long tracker names
Long tracker descriptions
Users without permission to open a tracker
```

---

# 7. Fixture Data

| Entity      | ID          | Name                          | Category              | Owner                | Status / Health | Links to                                                |
| ----------- | ----------- | ----------------------------- | --------------------- | -------------------- | --------------- | ------------------------------------------------------- |
| Marketplace | MKT-DRV-TRK | Tracker Marketplace           | Drive                 | DWS / DQ Operations  | Available       | `/marketplace/drive/tracker-marketplace`                |
| Tracker     | TRK-TPL-001 | Workload Distribution Tracker | Workload & Capacity   | DQ Operations        | Amber           | `/tracker/active-tracker/workload-distribution-tracker` |
| Tracker     | TRK-TPL-002 | Squad Backlog Tracker         | Backlog & Delivery    | Delivery Operations  | Green           | `/tracker/active-tracker/squad-backlog-tracker`         |
| Tracker     | TRK-TPL-003 | Project Backlog Tracker       | Backlog & Delivery    | PMO / Delivery Leads | Amber           | `/tracker/active-tracker/project-backlog-tracker`       |
| Tracker     | TRK-TPL-004 | Strategic Initiatives Tracker | Strategic Initiatives | Strategy Office      | Green           | `/tracker/active-tracker/strategic-initiatives-tracker` |
| Tracker     | TRK-TPL-005 | Project Health Tracker        | Project Health        | DQ Operations        | Amber           | `/tracker/active-tracker/project-health-tracker`        |
| Tracker     | TRK-TPL-006 | Governance Follow-up Tracker  | Governance Follow-up  | Governance Lead      | Red             | `/tracker/active-tracker/governance-follow-up-tracker`  |
| Tracker     | TRK-TPL-007 | Action Log Tracker            | Actions & Decisions   | Workstream Leads     | Green           | `/tracker/active-tracker/action-log-tracker`            |
| Tracker     | TRK-TPL-008 | Decision Tracker              | Actions & Decisions   | Governance Lead      | Green           | `/tracker/active-tracker/decision-tracker`              |
| Tracker     | TRK-TPL-009 | Risk / Issue Tracker          | Risk & Issues         | Risk Owner           | Amber           | `/tracker/active-tracker/risk-issue-tracker`            |

## Example Tracker Details Fixture

| Field                    | Value                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Tracker Name             | Workload Distribution Tracker                                                                                    |
| Purpose                  | Track workload allocation, ownership, capacity pressure, overload signals, and rebalancing actions across teams. |
| Owner                    | DQ Operations                                                                                                    |
| Category                 | Workload & Capacity                                                                                              |
| Active Trackers          | 12                                                                                                               |
| Default Update Frequency | Weekly or when ownership changes                                                                                 |
| Typical Users            | Leads, associates, delivery owners, operations coordinators                                                      |
| Default Statuses         | Open, In Progress, Balanced, Overloaded, Blocked, Completed                                                      |
| Primary CTA              | Preview on card; Open Tracker on details page                                                                    |

---

# 8. Shared Components

## Drive Marketplace Card

* Appears on the Drive marketplace page.
* Represents Tracker Marketplace as one marketplace option within Drive.
* CTA: `Open Marketplace`.
* Navigates to `/marketplace/drive/tracker-marketplace`.

## Marketplace Header

* Shows breadcrumb, title, short description, and optional page-level actions.
* Must follow existing marketplace styling.
* Should not use dashboard KPI tiles unless they directly support discovery.

## Tracker Card

* Compact marketplace card.
* Shows tracker name, short purpose, owner, category, active count, health, and last updated.
* Primary CTA: `Preview`.
* Should not include `Open Tracker` as primary card action.

## Category Filters

* Use category chips or dropdown filters.
* Active filter uses subtle orange state.
* Clear filters should be available when filters are applied.

## Search

* Searches by tracker name, purpose, category, owner, and typical use case.
* Empty state should guide the user to clear filters or request a new tracker.

## Tracker Details / Preview Page

* Uses clear sections, not heavy dashboards.
* Shows tracker context, structure, example records, and related views.
* Primary CTA: `Open Tracker`.

## Toasts

Use existing toast behaviour.

Example messages:

* `Tracker marketplace opened`
* `Tracker opened`
* `Tracker started`
* `No trackers match your filters`
* `Tracker unavailable`

---

# 9. Scope

## In Scope

```text
Drive marketplace entry card for Tracker Marketplace
Tracker Marketplace landing page
Tracker catalogue cards/list
Tracker search and category filters
Tracker card primary CTA: Preview
Tracker details / preview page
Open Tracker CTA on details page
Start Tracker simulated MVP flow
Navigation into Active Tracker Workspace
Recommended trackers
Recently used trackers
Empty state for no results
Unavailable tracker state
```

## Out of Scope

```text
Tracker record editing
Tracker record maintenance
Tracker comments and evidence
Tracker lifecycle closure
Advanced tracker configuration
Tracker template builder
Database-backed tracker creation
Role-based permission engine
Authentication implementation
Analytics dashboards
Full admin content editing
```

## Scope Boundary

Tracker Marketplace helps users **discover and enter** tracker workspaces.

It does not manage the tracker records themselves.

Record execution belongs to the tracker working area, including:

```text
Tracker Hub
Active Tracker Workspace
Tracker Record Maintenance
Tracker Execution & Lifecycle Management
```

---

# 10. Assumptions

```text
The existing DWS.01 shell, topbar, sidebar, marketplace styling, and visual system remain in place.
The marketplace sidebar follows the 4D pattern: Discern, Design, Deploy, Drive.
Tracker Marketplace is reached through the Drive marketplace page.
Tracker Marketplace is not a standalone sidebar item.
Tracker cards use Preview as the primary CTA.
Open Tracker only appears inside the Tracker Details / Preview page.
Start Tracker is simulated for MVP and does not require a full template builder.
Tracker execution pages already exist or will be implemented separately.
The marketplace can use static or local fixture data for prototype purposes.
Platform Admin content editing is part of broader MVP scope but not part of this marketplace feature spec.
Authentication and database are broader platform features and are not built inside this feature.
```
