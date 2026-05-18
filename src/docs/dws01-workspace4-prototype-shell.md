# Feature: DWS.01 Work.Space4.0 -- Prototype Shell

## 10. Prototype Build Prompt

Paste the prompt below into Lovable as one complete Shell prompt.

---

# Lovable Build Prompt -- DWS.01 Work.Space4.0 Prototype Shell

## 1. Product Header

Build a high-fidelity clickable prototype of DWS.01 Work.Space4.0 -- an internal enterprise execution, workspace, workflow, governance, service/request, knowledge, collaboration, automation, and performance platform for DigitalQatalyst internal users.

The Shell must validate the complete navigation model, Stage 0 orientation entry, header-led Stage 1 marketplaces, role-based Stage 2 workspace surfaces, Stage 3 fulfilment/governance consoles, Stage 4 specialised governance placeholders, persona switching, mock data relationships, and in-memory interactions.

## 2. Tech Stack

Framework: React + Vite
Styling: Tailwind CSS with custom DQ design tokens
Router: React Router v6 using client-side routing
State: React useState and useContext only; no external state library
Data: Centralised mock data layer using src/types, src/mocks, and src/services
Icons: Lucide React, 1.5px stroke width, currentColor
Animation: CSS transitions and lightweight framer-motion only where already available; all motion must respect prefers-reduced-motion
Backend: none
Supabase: none
API calls: none
Authentication: no real authentication; use simulated persona context only
Persistence: in-memory only

## 3. Brand & Visual System

Implement all colours as CSS custom properties on :root and reference them through Tailwind config or utility classes. Do not introduce any colour outside the token set below.

### Colours

Primary: DQ Navy #030F35
Secondary: DQ Orange #FB5535
Background: #FFFFFF
Surface: #F6F6FB
Surface 2: #FFFFFF
Surface navy: #030F35
Text primary: #111118
Text secondary: #2E2E42
Text muted: #5F607F
Text disabled: #8385A1
Border subtle: #EEEFF6
Border default: #D8D9E6
Border strong: #B0B2C8
Status Success: #16A34A
Status Success surface: #DCFCE7
Status Success text: #15803D
Status Warning: #D97706
Status Warning surface: #FEF3C7
Status Warning text: #B45309
Status Danger: #DC2626
Status Danger surface: #FEE2E2
Status Danger text: #B91C1C
Status Info: #2563EB
Status Info surface: #DBEAFE
Status Info text: #1D4ED8
Navy-50: #F3F5FD
Navy-100: #E8EDFB
Navy-200: #B5C5F7
Orange-50: #FFF5F2
Orange-100: #FDE5DF
Orange-600: #F24C2A

### CSS custom properties

Create these in src/index.css or src/styles/tokens.css:

```css
:root {
  --color-primary: #030F35;
  --color-secondary: #FB5535;
  --color-background: #FFFFFF;
  --color-surface: #F6F6FB;
  --color-surface-2: #FFFFFF;
  --color-surface-navy: #030F35;
  --color-text-primary: #111118;
  --color-text-secondary: #2E2E42;
  --color-text-muted: #5F607F;
  --color-text-disabled: #8385A1;
  --color-border-subtle: #EEEFF6;
  --color-border-default: #D8D9E6;
  --color-border-strong: #B0B2C8;
  --color-success: #16A34A;
  --color-success-surface: #DCFCE7;
  --color-success-text: #15803D;
  --color-warning: #D97706;
  --color-warning-surface: #FEF3C7;
  --color-warning-text: #B45309;
  --color-danger: #DC2626;
  --color-danger-surface: #FEE2E2;
  --color-danger-text: #B91C1C;
  --color-info: #2563EB;
  --color-info-surface: #DBEAFE;
  --color-info-text: #1D4ED8;
  --color-navy-50: #F3F5FD;
  --color-navy-100: #E8EDFB;
  --color-navy-200: #B5C5F7;
  --color-orange-50: #FFF5F2;
  --color-orange-100: #FDE5DF;
  --color-orange-600: #F24C2A;
  --font-sans: "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, "SF Mono", monospace;
  --radius-card: 12px;
  --radius-modal: 12px;
  --radius-button: 8px;
  --radius-input: 8px;
  --radius-pill: 9999px;
  --space-grid: 8px;
  --space-card: 24px;
  --shadow-sm: 0 1px 2px rgba(3,15,53,0.05), 0 1px 3px rgba(3,15,53,0.08);
  --shadow-md: 0 4px 6px rgba(3,15,53,0.07), 0 2px 4px rgba(3,15,53,0.06);
  --shadow-lg: 0 10px 15px rgba(3,15,53,0.10), 0 4px 6px rgba(3,15,53,0.07);
  --shadow-xl: 0 20px 25px rgba(3,15,53,0.15), 0 10px 10px rgba(3,15,53,0.04);
  --focus-ring-orange: 0 0 0 3px rgba(251,85,53,0.30);
  --focus-ring-navy: 0 0 0 3px rgba(3,15,53,0.18);
}

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Typography

UI font: Plus Jakarta Sans, weights 400, 500, 600, 700; import from Google Fonts.
Mono font: JetBrains Mono, weights 400 and 500; use for IDs, task codes, request codes, SLA values, audit references, and technical values.

Type rules:
- Page title: 36px, 700, #030F35
- Section title: 24px, 600, #030F35
- Card title: 18px or 20px, 600, #030F35
- Body: 14px or 16px, 400, #2E2E42
- Label: 12px or 14px, 500, #5F607F
- Overline: 11px, 600, uppercase, 0.12em letter spacing
- Data table values: tabular numerals where possible

### Radii

Card: 12px
Modal: 12px
Button: 8px
Input: 8px
Badge/pill: 9999px
Hero container: 16px

### Spacing

Base grid: 8px
Standard card padding: 24px
Feature card padding: 32px
Dashboard card padding: 16px
Desktop page padding: 32px
Wide desktop page padding: 48px
Operational grid gap: 24px
Compact dashboard grid gap: 16px

### Logo

Render a text identity component named ProductIdentity.
Text: "DWS.01" in #030F35, 18px, 700.
Text: " / Work.Space4.0" in #454560, 15px, 500.
On dark surfaces: "DWS.01" in #FFFFFF and " / Work.Space4.0" in #B5C5F7.
No new symbol, icon mark, or decorative logo.

## 4. Application Architecture

### Folder structure

Create this structure:

```text
src/
  App.tsx
  main.tsx
  index.css
  context/PersonaContext.tsx
  types/platform.ts
  mocks/platform.mock.ts
  services/platform.service.ts
  layouts/AppLayout.tsx
  layouts/PortalLayout.tsx
  components/
    TopBar.tsx
    ProductIdentity.tsx
    MarketplaceDropdown.tsx
    DiscoverySearchCommand.tsx
    PersonaSwitcher.tsx
    NotificationBell.tsx
    UserMenu.tsx
    RoleScopedSidebar.tsx
    Footer.tsx
    KpiTile.tsx
    StatusPill.tsx
    SlaBadge.tsx
    OwnerBadge.tsx
    MonoId.tsx
    DataTable.tsx
    DetailPanel.tsx
    FilterBar.tsx
    ActionToast.tsx
    PlaceholderPage.tsx
    Stage0Hero.tsx
    NextStepCard.tsx
    EvidenceList.tsx
    Timeline.tsx
  pages/
    Stage0OrientationPage.tsx
    OperatingGuidePage.tsx
    ServicesMarketplacePage.tsx
    TaskTemplatesMarketplacePage.tsx
    KnowledgeMarketplacePage.tsx
    WorkDirectoryMarketplacePage.tsx
    AnalyticsMarketplacePage.tsx
    MarketplaceFeedbackPage.tsx
    MyWorkPage.tsx
    MyTasksPage.tsx
    MyRequestsPage.tsx
    AgileExecutionPage.tsx
    TeamExecutionPage.tsx
    UnitVisibilityPage.tsx
    HraWorkflowPage.tsx
    SupportOperationsPage.tsx
    AdminConsolePage.tsx
    WorkflowCentrePage.tsx
    SlaDashboardPage.tsx
    ExecutiveEnterprisePage.tsx
    AuditLogPage.tsx
```

### Layouts

PortalLayout:
- Used for Stage 0 and Stage 1 marketplace pages.
- Contains TopBar fixed at top, main content area, and Footer.
- No sidebar.
- Main content starts below 64px header.
- Page background #FFFFFF or #F6F6FB depending on page.

AppLayout:
- Used for Stage 2, Stage 3, and Stage 4 surfaces.
- Contains TopBar fixed at top, RoleScopedSidebar fixed on the left below TopBar, and scrollable main content.
- TopBar height: 64px.
- Sidebar width: 280px.
- Main content margin-left: 280px; padding: 32px; background #F6F6FB; min-height calc(100vh - 64px).
- AppLayout wraps all workspace, operations, support, intelligence, administration, audit, and executive routes.

### Routing table

Use React Router v6. Create all routes below.

| Route | Component | Layout | Accessible to |
|---|---|---|---|
| / | Redirect to /stage-0/orientation | None | All |
| /stage-0/orientation | Stage0OrientationPage | PortalLayout | All personas |
| /stage-0/operating-guide | OperatingGuidePage | PortalLayout | All personas |
| /marketplaces/services | ServicesMarketplacePage | PortalLayout | Associate, HRA, Admins, Support |
| /marketplaces/task-templates | TaskTemplatesMarketplacePage | PortalLayout | Associate, Scrum Master, Team / Squad Lead, Unit Lead, Admins |
| /marketplaces/knowledge | KnowledgeMarketplacePage | PortalLayout | Associate, Scrum Master, Team / Squad Lead, Unit Lead, HRA, Admins, Support |
| /marketplaces/work-directory | WorkDirectoryMarketplacePage | PortalLayout | Associate, Scrum Master, Team / Squad Lead, Unit Lead, HRA, Admins, Support |
| /marketplaces/analytics | AnalyticsMarketplacePage | PortalLayout | Scrum Master, Team / Squad Lead, Unit Lead, HRA, Admins, Support, CEO |
| /marketplaces/feedback | MarketplaceFeedbackPage | PortalLayout | Associate, HRA, Admins, Support |
| /workspace/my-work | MyWorkPage | AppLayout | Associate |
| /workspace/my-tasks | MyTasksPage | AppLayout | Associate, Scrum Master, Team / Squad Lead, Unit Lead |
| /workspace/my-requests | MyRequestsPage | AppLayout | Associate, HRA |
| /workspace/agile-execution | AgileExecutionPage | AppLayout | Scrum Master |
| /operations/team-execution | TeamExecutionPage | AppLayout | Team / Squad Lead |
| /operations/unit-visibility | UnitVisibilityPage | AppLayout | Unit Lead |
| /operations/hra-workflow | HraWorkflowPage | AppLayout | HRA |
| /support/operations | SupportOperationsPage | AppLayout | Support |
| /admin/console | AdminConsolePage | AppLayout | Admins |
| /execution/workflow | WorkflowCentrePage | AppLayout | Scrum Master, Team / Squad Lead, Unit Lead, HRA, Admins, Support, CEO |
| /intelligence/sla | SlaDashboardPage | AppLayout | Scrum Master, Team / Squad Lead, Unit Lead, HRA, Admins, Support, CEO |
| /executive/enterprise-execution | ExecutiveEnterprisePage | AppLayout | CEO |
| /admin/audit-log | AuditLogPage | AppLayout | Admins, CEO |
| * | PlaceholderPage | AppLayout or PortalLayout based on path | All permitted personas |

### Route guard behavior

No real auth. Use PersonaContext only.
If active persona lacks access to a route:
- Render a PermissionRestricted card inside the current layout.
- Title: "This view is outside the active persona scope"
- Body: "Switch persona or return to Stage 0 to choose a permitted route."
- Actions: "Return to Stage 0" and "Switch persona"

## 5. Persona / Segment System

Create PersonaContext in src/context/PersonaContext.tsx.

Store:
- activePersonaId
- activePersona object
- setActivePersona(id)
- getDefaultRoute(persona)
- hasRouteAccess(route, persona)

Default persona on first load: Associate.

Persona switcher:
- Top-right pill in TopBar.
- Text format: "Viewing as: Amina Hassan -- Associate"
- Click opens dropdown grouped by tier.
- Green check on active persona.
- On switch: update PersonaContext, redirect to new persona default route, re-render sidebar with that persona scope, show toast "Persona switched to [Role]".

| # | Name | Role | Persona ID | Default Route | Nav Domains Visible |
|---|---|---|---|---|---|
| 1 | Amina Hassan | Associate | associate | /workspace/my-work | Stage 0, Marketplaces, Workspace, My Tasks, My Requests, Knowledge, Notifications |
| 2 | David Mwangi | Scrum Master | scrum-master | /workspace/agile-execution | Stage 0, Task Templates, Tasks, Workflow Centre, Working Sessions, Intelligence |
| 3 | Priya Nair | Team / Squad Lead | team-lead | /operations/team-execution | Stage 0, Marketplaces, Tasks, Workflow Centre, Working Sessions, Intelligence |
| 4 | Omar Farouk | Unit Lead | unit-lead | /operations/unit-visibility | Stage 0, Tasks, Workflow Centre, Intelligence, Audit |
| 5 | Grace Wanjiru | HRA | hra | /operations/hra-workflow | Stage 0, Services Marketplace, Requests, HRA Workflow, Knowledge, Intelligence |
| 6 | Elena Costa | Admins | admin | /admin/console | Stage 0, Marketplaces, Workflow Centre, Services, Intelligence, Administration, Audit, Automation |
| 7 | Brian Otieno | Support | support | /support/operations | Stage 0, Services Marketplace, Support Queues, Knowledge, Workflow Centre, Intelligence |
| 8 | CEO View | CEO | ceo | /executive/enterprise-execution | Stage 0, Executive Intelligence, SLA, Governance, Audit, Stage 4 placeholders |

## 6. Navigation Structure

### TopBar component

TopBar is visible on every route.
Height: 64px.
Background: #FFFFFF.
Border-bottom: 1px solid #EEEFF6.
Sticky/fixed top: yes.
Z-index: 200.

TopBar left:
- ProductIdentity linking to /stage-0/orientation.
- MarketplaceDropdown button labelled "Marketplaces" with ChevronDown.

TopBar right:
- DiscoverySearchCommand trigger with Search icon and label "Discovery Search".
- NotificationBell with unread badge.
- PersonaSwitcher.
- UserMenu.

### MarketplaceDropdown component

Dropdown width: 720px on desktop.
Background: #FFFFFF.
Border: 1px solid #D8D9E6.
Radius: 12px.
Shadow: 0 10px 25px rgba(3,15,53,0.12), 0 4px 8px rgba(3,15,53,0.06).
Padding: 24px.
Grid: 2 columns.

Items:
- Service Catalogue -> /marketplaces/services
  Description: Discover HRA, IT/access, platform support, knowledge/content, admin, approval, and escalation requests.
- Task Template Catalogue -> /marketplaces/task-templates
  Description: Select governed task templates with checklist, evidence, SLA, and closure criteria.
- Knowledge Discovery -> /marketplaces/knowledge
  Description: Find GHC, 6xD, playbooks, templates, learning references, and workspace guides.
- Work Directory -> /marketplaces/work-directory
  Description: Find teams, owners, experts, fulfilment contacts, and responsibility points.
- Analytics Discovery -> /marketplaces/analytics
  Description: Discover permitted dashboards, SLA views, governance reports, and performance surfaces.
- Marketplace Feedback -> /marketplaces/feedback
  Description: Flag unclear services, missing templates, outdated knowledge, incorrect owners, or broken navigation.

Each item:
- Icon 20px, navy by default, orange on hover.
- Label 14px/600 #111118.
- Description 12px/400 #5F607F.
- Hover background #F3F5FD.
- Click navigates and closes dropdown.

### RoleScopedSidebar component

Visible only in AppLayout routes.
Width: 280px.
Background: #FFFFFF.
Border-right: 1px solid #EEEFF6.
Top: 64px.
Height: calc(100vh - 64px).
Overflow-y: auto.

Platform label at top: "DWS.01 WORKSPACE" in 11px uppercase, 600, #5F607F.

Nav is a 3-level collapsible tree:
- Group heading: uppercase, muted, not clickable.
- Menu item: icon + label + optional live badge.
- Submenu leaf: indented link.

Active state:
- 2px left inset border #FB5535.
- Text #030F35.
- Background #F3F5FD.
- Icon #FB5535.

Hover state:
- Background #F3F5FD.
- Text #030F35.

Live badges:
- Red pill for urgent: #DC2626 background, white text.
- Warning pill for SLA risk: #FEF3C7 background, #B45309 text.
- Neutral pill for counts: #E8EDFB background, #030F35 text.

Groups and items filtered by PersonaContext:

Workspace
- My Work -> /workspace/my-work [Associate]
  - My Tasks -> /workspace/my-tasks [Associate, Scrum Master, Team / Squad Lead, Unit Lead]
  - My Updates -> placeholder
  - My Blockers -> placeholder
  - My Working Sessions -> placeholder
- My Requests -> /workspace/my-requests [Associate, HRA]
  - Submitted Requests -> placeholder
  - Request Drafts -> placeholder
  - Request Status -> placeholder
- Notifications -> placeholder [All]
- Knowledge in Work Context -> placeholder [Associate, HRA, Support]

Execution
- Tasks -> /workspace/my-tasks [Associate, Scrum Master, Team / Squad Lead, Unit Lead]
  - All Tasks -> placeholder [Scrum Master, Team / Squad Lead, Unit Lead]
  - Create Task -> placeholder [Associate, Scrum Master, Team / Squad Lead]
  - Task Templates -> /marketplaces/task-templates
  - Task Review -> placeholder [Scrum Master, Team / Squad Lead, Unit Lead]
  - Closure Quality -> placeholder [Scrum Master, Team / Squad Lead, Unit Lead]
- Workflow Centre -> /execution/workflow [Scrum Master, Team / Squad Lead, Unit Lead, HRA, Admins, Support, CEO]
  - Pending Approvals -> /execution/workflow
  - Escalations -> /execution/workflow
  - SLA Risks -> /intelligence/sla
  - Handoffs -> placeholder
  - Decision Log -> placeholder

Services & Support
- Central Support Queue -> /support/operations [Support, Admins]
- Fulfilment Owner Queues -> /support/operations [HRA, Support, Admins]
- HRA Workflow View -> /operations/hra-workflow [HRA]
- Fulfilment Dashboard -> placeholder [HRA, Support, Admins]

Knowledge & Learning
- Knowledge Hub -> /marketplaces/knowledge [Associate, HRA, Support, Admins]
- GHC References -> /marketplaces/knowledge
- 6xD References -> /marketplaces/knowledge
- Playbooks & Templates -> /marketplaces/knowledge
- Learning References -> /marketplaces/knowledge
- Content Review Queue -> placeholder [HRA, Support, Admins]

Intelligence
- Execution Dashboard -> /executive/enterprise-execution [CEO] or /operations/unit-visibility [Unit Lead]
- SLA Dashboard -> /intelligence/sla [Scrum Master, Team / Squad Lead, Unit Lead, HRA, Admins, Support, CEO]
- Governance Dashboard -> /executive/enterprise-execution [CEO, Unit Lead, Admins]
- Associate Performance -> placeholder [Team / Squad Lead, Unit Lead, Admins, CEO]
- Team & Unit Performance -> /operations/team-execution or /operations/unit-visibility
- Outcome Tracking -> /executive/enterprise-execution [CEO, Unit Lead]
- Audit & Compliance View -> /admin/audit-log [Admins, CEO]

Administration
- User & Role Management -> /admin/console [Admins]
- Organisation / Unit / Team Setup -> /admin/console [Admins]
- Task Model Configuration -> /admin/console [Admins]
- Request Category Configuration -> /admin/console [Admins, HRA, Support]
- Workflow & Approval Rules -> /admin/console [Admins]
- SLA & Notification Rules -> /admin/console [Admins]
- Knowledge Taxonomy -> /admin/console [Admins]
- Integration Settings -> /admin/console [Admins]
- Audit Log -> /admin/audit-log [Admins, CEO]
- Change Governance -> placeholder [Admins, CEO]
- AI / Automation Settings -> placeholder [Admins]

## 7. Data Layer

Create one shared file for interfaces: src/types/platform.ts.
Create one mock file: src/mocks/platform.mock.ts.
Create one service file: src/services/platform.service.ts.
Components and pages must import data only from service functions, never from mocks directly.

### src/types/platform.ts

```ts
export type PersonaId = 'associate' | 'scrum-master' | 'team-lead' | 'unit-lead' | 'hra' | 'admin' | 'support' | 'ceo'

export interface Persona {
  id: PersonaId
  name: string
  role: string
  tier: 'Operator' | 'Domain Leader' | 'Platform Control' | 'Executive'
  unit: string
  defaultRoute: string
  navDomains: string[]
}

export interface User {
  id: string
  name: string
  role: string
  unitId: string
  teamId?: string
  personaId: PersonaId
}

export interface Unit {
  id: string
  name: string
  leadUserId: string
  health: 'On Track' | 'Watch' | 'At Risk'
  outcomeIds: string[]
}

export interface Team {
  id: string
  name: string
  unitId: string
  leadUserId: string
  flowHealth: 'On Track' | 'Watch' | 'At Risk'
}

export interface Task {
  id: string
  title: string
  purpose: string
  ownerUserId: string
  reviewerUserId?: string
  teamId: string
  status: 'Draft' | 'In Progress' | 'Blocked' | 'Missing Update' | 'Review Needed' | 'Closed'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  slaState: 'On Track' | 'At Risk' | 'Breached' | 'Met'
  dueDate: string
  expectedOutput: string
  checklistDone: number
  checklistTotal: number
  evidenceState: 'Missing' | 'Partial' | 'Attached' | 'Accepted'
  blockerId?: string
  requestId?: string
  knowledgeIds: string[]
}

export interface RequestRecord {
  id: string
  category: 'HRA Requests' | 'IT & Access Requests' | 'Platform Support' | 'Knowledge / Content Requests' | 'Task / Workflow Support' | 'Admin Requests' | 'Approvals' | 'Escalations'
  title: string
  requesterUserId: string
  ownerUserId?: string
  queueId: string
  status: 'Draft' | 'New' | 'Pending Info' | 'Routed' | 'In Review' | 'Returned' | 'Closed'
  urgency: 'Low' | 'Medium' | 'High'
  slaState: 'On Track' | 'At Risk' | 'Breached' | 'Met'
  expectedOutcome: string
  linkedTaskId?: string
}

export interface Approval {
  id: string
  type: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned' | 'Delegated'
  approverUserId: string
  linkedTaskId?: string
  linkedRequestId?: string
  rationale?: string
}

export interface WorkflowItem {
  id: string
  name: string
  state: string
  slaLabel: string
  linkedTaskId?: string
  linkedRequestId?: string
  approvalId?: string
}

export interface Queue {
  id: string
  name: string
  ownerPersonaIds: PersonaId[]
  newCount: number
  atRiskCount: number
  requestIds: string[]
}

export interface KnowledgeAsset {
  id: string
  title: string
  type: 'GHC Reference' | '6xD Reference' | 'Playbook' | 'Template' | 'Learning Reference' | 'Workspace Guide'
  status: 'Effective' | 'Under Review' | 'Draft' | 'Retired'
  tags: string[]
  linkedTaskIds: string[]
}

export interface AuditEvent {
  id: string
  event: string
  actorUserId: string
  timestamp: string
  entityType: string
  entityId: string
  severity: 'Info' | 'Warning' | 'Critical'
}

export interface KpiSet {
  id: string
  name: string
  scope: string
  metrics: { label: string; value: string; trend: string; status: 'success' | 'warning' | 'danger' | 'info' }[]
}
```

### src/mocks/platform.mock.ts

Use this seeded data. Include all rows exactly so pages feel connected and non-empty.

```ts
import type { Persona, User, Unit, Team, Task, RequestRecord, Approval, WorkflowItem, Queue, KnowledgeAsset, AuditEvent, KpiSet } from '../types/platform'

export const personas: Persona[] = [
  { id: 'associate', name: 'Amina Hassan', role: 'Associate', tier: 'Operator', unit: 'eCom.DXP', defaultRoute: '/workspace/my-work', navDomains: ['Workspace', 'Marketplaces', 'Knowledge'] },
  { id: 'scrum-master', name: 'David Mwangi', role: 'Scrum Master', tier: 'Domain Leader', unit: 'eCom.DXP', defaultRoute: '/workspace/agile-execution', navDomains: ['Tasks', 'Workflow Centre', 'Intelligence'] },
  { id: 'team-lead', name: 'Priya Nair', role: 'Team / Squad Lead', tier: 'Domain Leader', unit: 'eCom.DXP', defaultRoute: '/operations/team-execution', navDomains: ['Tasks', 'Workflow Centre', 'Intelligence'] },
  { id: 'unit-lead', name: 'Omar Farouk', role: 'Unit Lead', tier: 'Domain Leader', unit: 'Digital Platforms', defaultRoute: '/operations/unit-visibility', navDomains: ['Tasks', 'Workflow Centre', 'Intelligence', 'Audit'] },
  { id: 'hra', name: 'Grace Wanjiru', role: 'HRA', tier: 'Domain Leader', unit: 'HRA', defaultRoute: '/operations/hra-workflow', navDomains: ['Services', 'Requests', 'Knowledge', 'Intelligence'] },
  { id: 'admin', name: 'Elena Costa', role: 'Admins', tier: 'Platform Control', unit: 'Platform Governance', defaultRoute: '/admin/console', navDomains: ['Administration', 'Audit', 'Workflow Centre', 'Automation'] },
  { id: 'support', name: 'Brian Otieno', role: 'Support', tier: 'Operator', unit: 'Support Operations', defaultRoute: '/support/operations', navDomains: ['Services', 'Support Queues', 'Knowledge', 'Workflow Centre'] },
  { id: 'ceo', name: 'CEO View', role: 'CEO', tier: 'Executive', unit: 'Enterprise', defaultRoute: '/executive/enterprise-execution', navDomains: ['Executive Intelligence', 'Governance', 'Audit'] }
]

export const users: User[] = [
  { id: 'USR-001', name: 'Amina Hassan', role: 'Associate', unitId: 'UNT-001', teamId: 'TM-001', personaId: 'associate' },
  { id: 'USR-002', name: 'David Mwangi', role: 'Scrum Master', unitId: 'UNT-001', teamId: 'TM-001', personaId: 'scrum-master' },
  { id: 'USR-003', name: 'Priya Nair', role: 'Team / Squad Lead', unitId: 'UNT-001', teamId: 'TM-001', personaId: 'team-lead' },
  { id: 'USR-004', name: 'Omar Farouk', role: 'Unit Lead', unitId: 'UNT-001', personaId: 'unit-lead' },
  { id: 'USR-005', name: 'Grace Wanjiru', role: 'HRA', unitId: 'UNT-002', personaId: 'hra' },
  { id: 'USR-006', name: 'Elena Costa', role: 'Admins', unitId: 'UNT-003', personaId: 'admin' },
  { id: 'USR-007', name: 'Brian Otieno', role: 'Support', unitId: 'UNT-004', personaId: 'support' },
  { id: 'USR-008', name: 'CEO View', role: 'CEO', unitId: 'UNT-000', personaId: 'ceo' }
]

export const units: Unit[] = [
  { id: 'UNT-000', name: 'Enterprise', leadUserId: 'USR-008', health: 'Watch', outcomeIds: ['OUT-6001'] },
  { id: 'UNT-001', name: 'Digital Platforms', leadUserId: 'USR-004', health: 'Watch', outcomeIds: ['OUT-6001'] },
  { id: 'UNT-002', name: 'HRA', leadUserId: 'USR-005', health: 'On Track', outcomeIds: [] },
  { id: 'UNT-003', name: 'Platform Governance', leadUserId: 'USR-006', health: 'On Track', outcomeIds: [] },
  { id: 'UNT-004', name: 'Support Operations', leadUserId: 'USR-007', health: 'At Risk', outcomeIds: [] }
]

export const teams: Team[] = [
  { id: 'TM-001', name: 'eCom.DXP Squad', unitId: 'UNT-001', leadUserId: 'USR-003', flowHealth: 'At Risk' },
  { id: 'TM-002', name: 'DWS Core Squad', unitId: 'UNT-001', leadUserId: 'USR-004', flowHealth: 'On Track' }
]

export const tasks: Task[] = [
  { id: 'TSK-1001', title: 'Build Stage 0 orientation shell', purpose: 'Validate entry and orientation for all DWS.01 users', ownerUserId: 'USR-001', reviewerUserId: 'USR-003', teamId: 'TM-001', status: 'In Progress', priority: 'High', slaState: 'On Track', dueDate: '2026-05-13', expectedOutput: 'Clickable Stage 0 shell with role next-step routing', checklistDone: 4, checklistTotal: 6, evidenceState: 'Partial', knowledgeIds: ['KNO-001', 'KNO-002'] },
  { id: 'TSK-1002', title: 'Finalise request intake card patterns', purpose: 'Define request cards for services marketplace', ownerUserId: 'USR-001', reviewerUserId: 'USR-007', teamId: 'TM-001', status: 'Blocked', priority: 'Critical', slaState: 'At Risk', dueDate: '2026-05-14', expectedOutput: 'Service cards with category, owner, SLA, required inputs, and submit action', checklistDone: 2, checklistTotal: 7, evidenceState: 'Missing', blockerId: 'BLK-101', requestId: 'REQ-2001', knowledgeIds: ['KNO-003'] },
  { id: 'TSK-1003', title: 'Review closure quality model', purpose: 'Confirm closure criteria for governed task completion', ownerUserId: 'USR-002', reviewerUserId: 'USR-003', teamId: 'TM-001', status: 'Review Needed', priority: 'High', slaState: 'On Track', dueDate: '2026-05-15', expectedOutput: 'Closure quality matrix linked to task review console', checklistDone: 5, checklistTotal: 5, evidenceState: 'Attached', knowledgeIds: ['KNO-001'] },
  { id: 'TSK-1004', title: 'Prepare governance dashboard copy', purpose: 'Make governance health visible to leads and CEO', ownerUserId: 'USR-003', reviewerUserId: 'USR-004', teamId: 'TM-001', status: 'Missing Update', priority: 'Medium', slaState: 'Breached', dueDate: '2026-05-11', expectedOutput: 'Dashboard content for SLA, audit, closure, and blocker indicators', checklistDone: 3, checklistTotal: 8, evidenceState: 'Partial', knowledgeIds: [] },
  { id: 'TSK-1005', title: 'Align HRA onboarding request flow', purpose: 'Connect new joiner journey to HRA request fulfilment', ownerUserId: 'USR-005', reviewerUserId: 'USR-006', teamId: 'TM-002', status: 'In Progress', priority: 'High', slaState: 'On Track', dueDate: '2026-05-17', expectedOutput: 'HRA workflow view with onboarding checklist and readiness status', checklistDone: 6, checklistTotal: 9, evidenceState: 'Attached', requestId: 'REQ-2002', knowledgeIds: ['KNO-002'] },
  { id: 'TSK-1006', title: 'Map Discovery Search result groups with a deliberately long task name to test truncation behaviour in table and cards', purpose: 'Validate long string handling', ownerUserId: 'USR-006', teamId: 'TM-002', status: 'Draft', priority: 'Medium', slaState: 'On Track', dueDate: '2026-05-20', expectedOutput: 'Search groups for services, templates, knowledge, dashboards, and owners', checklistDone: 0, checklistTotal: 6, evidenceState: 'Missing', knowledgeIds: [] }
]

export const requests: RequestRecord[] = [
  { id: 'REQ-2001', category: 'Task / Workflow Support', title: 'Help resolve blocked request intake task', requesterUserId: 'USR-001', ownerUserId: 'USR-007', queueId: 'QUE-5001', status: 'Pending Info', urgency: 'High', slaState: 'At Risk', expectedOutcome: 'Request intake task unblocked and routed correctly', linkedTaskId: 'TSK-1002' },
  { id: 'REQ-2002', category: 'HRA Requests', title: 'New joiner onboarding checklist validation', requesterUserId: 'USR-001', ownerUserId: 'USR-005', queueId: 'QUE-5002', status: 'In Review', urgency: 'Medium', slaState: 'On Track', expectedOutcome: 'Onboarding checklist approved for DWS.01 orientation' },
  { id: 'REQ-2003', category: 'IT & Access Requests', title: 'Grant access to DWS prototype review workspace', requesterUserId: 'USR-003', ownerUserId: 'USR-007', queueId: 'QUE-5001', status: 'New', urgency: 'Medium', slaState: 'On Track', expectedOutcome: 'Reviewer can access prototype validation workspace' },
  { id: 'REQ-2004', category: 'Platform Support', title: 'Fix broken route in governance dashboard placeholder', requesterUserId: 'USR-004', ownerUserId: 'USR-007', queueId: 'QUE-5001', status: 'Routed', urgency: 'High', slaState: 'At Risk', expectedOutcome: 'Dashboard placeholder route resolves without dead end' },
  { id: 'REQ-2005', category: 'Knowledge / Content Requests', title: 'Update evidence attachment standard', requesterUserId: 'USR-005', ownerUserId: 'USR-006', queueId: 'QUE-5003', status: 'Closed', urgency: 'Low', slaState: 'Met', expectedOutcome: 'Evidence guidance updated and linked to task shell' }
]

export const approvals: Approval[] = [
  { id: 'APR-3001', type: 'Task Closure Review', status: 'Pending', approverUserId: 'USR-003', linkedTaskId: 'TSK-1003' },
  { id: 'APR-3002', type: 'HRA Request Approval', status: 'Returned', approverUserId: 'USR-005', linkedRequestId: 'REQ-2002', rationale: 'Policy acknowledgement evidence is missing.' },
  { id: 'APR-3003', type: 'SLA Rule Change', status: 'Approved', approverUserId: 'USR-006', rationale: 'Approved for prototype governance testing.' }
]

export const workflows: WorkflowItem[] = [
  { id: 'WF-4001', name: 'Task Closure Workflow', state: 'Evidence Review', slaLabel: '12h left', linkedTaskId: 'TSK-1003', approvalId: 'APR-3001' },
  { id: 'WF-4002', name: 'New Joiner Onboarding', state: 'Policy Check', slaLabel: '2d left', linkedRequestId: 'REQ-2002', approvalId: 'APR-3002' },
  { id: 'WF-4003', name: 'Escalation Review', state: 'Lead Intervention', slaLabel: 'Breached by 6h', linkedRequestId: 'REQ-2004' }
]

export const queues: Queue[] = [
  { id: 'QUE-5001', name: 'Central Support Queue', ownerPersonaIds: ['support', 'admin'], newCount: 8, atRiskCount: 3, requestIds: ['REQ-2001', 'REQ-2003', 'REQ-2004'] },
  { id: 'QUE-5002', name: 'HRA Fulfilment Queue', ownerPersonaIds: ['hra', 'admin'], newCount: 4, atRiskCount: 1, requestIds: ['REQ-2002'] },
  { id: 'QUE-5003', name: 'Knowledge Content Queue', ownerPersonaIds: ['support', 'hra', 'admin'], newCount: 2, atRiskCount: 0, requestIds: ['REQ-2005'] }
]

export const knowledgeAssets: KnowledgeAsset[] = [
  { id: 'KNO-001', title: 'Agile TMS Task Discipline Guide', type: 'GHC Reference', status: 'Effective', tags: ['GHC', 'Task Quality', 'Closure'], linkedTaskIds: ['TSK-1001', 'TSK-1003'] },
  { id: 'KNO-002', title: '6xD Execution Reference', type: '6xD Reference', status: 'Effective', tags: ['6xD', 'Orientation', 'DQ Ways of Working'], linkedTaskIds: ['TSK-1001', 'TSK-1005'] },
  { id: 'KNO-003', title: 'Evidence Attachment Standard', type: 'Playbook', status: 'Under Review', tags: ['Evidence', 'Audit', 'Closure Quality'], linkedTaskIds: ['TSK-1002'] },
  { id: 'KNO-004', title: 'Role Transition Checklist', type: 'Template', status: 'Draft', tags: ['HRA', 'Onboarding', 'Readiness'], linkedTaskIds: [] }
]

export const auditEvents: AuditEvent[] = [
  { id: 'AUD-7001', event: 'Role permission updated', actorUserId: 'USR-006', timestamp: '2026-05-13 09:25', entityType: 'Config', entityId: 'CFG-9001', severity: 'Info' },
  { id: 'AUD-7002', event: 'Closure review requested', actorUserId: 'USR-002', timestamp: '2026-05-13 10:15', entityType: 'Task', entityId: 'TSK-1003', severity: 'Info' },
  { id: 'AUD-7003', event: 'HRA request returned for missing policy evidence', actorUserId: 'USR-005', timestamp: '2026-05-13 11:05', entityType: 'Request', entityId: 'REQ-2002', severity: 'Warning' },
  { id: 'AUD-7004', event: 'SLA breach detected for governance dashboard copy', actorUserId: 'USR-006', timestamp: '2026-05-13 11:40', entityType: 'Task', entityId: 'TSK-1004', severity: 'Critical' }
]

export const kpiSets: KpiSet[] = [
  { id: 'KPI-8001', name: 'Enterprise Execution', scope: 'Enterprise', metrics: [
    { label: 'SLA On Track', value: '84%', trend: '+6%', status: 'success' },
    { label: 'Blocked Work', value: '11', trend: '-4', status: 'warning' },
    { label: 'Closure Quality', value: '76%', trend: '+9%', status: 'info' },
    { label: 'Governance Exceptions', value: '7', trend: '+2', status: 'danger' }
  ] },
  { id: 'KPI-8002', name: 'Team Execution', scope: 'eCom.DXP Squad', metrics: [
    { label: 'Open Tasks', value: '28', trend: '+5', status: 'info' },
    { label: 'Missing Updates', value: '6', trend: '-2', status: 'warning' },
    { label: 'Evidence Missing', value: '9', trend: '+1', status: 'danger' },
    { label: 'Ready for Review', value: '4', trend: '+3', status: 'success' }
  ] },
  { id: 'KPI-8003', name: 'Support Fulfilment', scope: 'Support Operations', metrics: [
    { label: 'New Requests', value: '8', trend: '+2', status: 'info' },
    { label: 'At Risk', value: '3', trend: '+1', status: 'warning' },
    { label: 'Closed Today', value: '12', trend: '+4', status: 'success' },
    { label: 'Pending Info', value: '5', trend: '-1', status: 'warning' }
  ] }
]
```

### src/services/platform.service.ts

```ts
import { personas, users, units, teams, tasks, requests, approvals, workflows, queues, knowledgeAssets, auditEvents, kpiSets } from '../mocks/platform.mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const getPersonas = async () => USE_MOCK ? personas : personas
export const getUsers = async () => USE_MOCK ? users : users
export const getUnits = async () => USE_MOCK ? units : units
export const getTeams = async () => USE_MOCK ? teams : teams
export const getTasks = async () => USE_MOCK ? tasks : tasks
export const getRequests = async () => USE_MOCK ? requests : requests
export const getApprovals = async () => USE_MOCK ? approvals : approvals
export const getWorkflows = async () => USE_MOCK ? workflows : workflows
export const getQueues = async () => USE_MOCK ? queues : queues
export const getKnowledgeAssets = async () => USE_MOCK ? knowledgeAssets : knowledgeAssets
export const getAuditEvents = async () => USE_MOCK ? auditEvents : auditEvents
export const getKpiSets = async () => USE_MOCK ? kpiSets : kpiSets
```

Add .env:

```text
VITE_USE_MOCK=true
```

## 8. Pages to Build

Every built page must have at least one empty state, loading skeleton, and error state component available in the component file, even if the default render shows filled data.

### Page 1 -- Stage 0 Orientation

Route: /stage-0/orientation
Component: Stage0OrientationPage.tsx
Layout: PortalLayout

Purpose: Introduce every user to DWS.01, explain the operating model, show role-specific next steps, and route users into their default workspace.

Hero:
- Dark navy hero #030F35.
- Eyebrow: "DWS.01 WORK.SPACE4.0" in orange #FB5535.
- Title: "DQ's internal execution workspace for governed daily work".
- Body: Explain that DWS.01 connects tasks, requests, knowledge, workflows, approvals, evidence, governance, and performance visibility.
- CTA: "Open my workspace" -> activePersona.defaultRoute.
- Secondary CTA: "Explore marketplaces" -> /marketplaces/services.

Sections:
1. Where am I? -- 3 cards: Internal execution layer, Digital operating layer of GHC, Source of truth for work.
2. What is DWS.01? -- bento grid covering Tasks, Requests, Approvals, Evidence, Knowledge, Dashboards.
3. What should I understand first? -- operating concept cards: Structured tasks, Requests, Updates, Blockers, Approvals, Evidence, Closure quality.
4. Guided onboarding path -- 5-step horizontal timeline: Understand DQ ways of working, Read tasks, Submit requests, Attach evidence, Close work.
5. My role in DWS.01 -- persona-aware role card using active persona.
6. Where do I go next? -- NextStepCard grid with route actions.
7. Quick resume -- 4 KpiTile cards showing pending actions, open requests, assigned work, recent alerts.

Interactions:
- Persona switcher changes the role guidance card and quick resume metrics.
- NextStepCard click navigates.
- Guided onboarding step click opens DetailPanel with short explanation.

### Page 2 -- Operating Guide

Route: /stage-0/operating-guide
Component: OperatingGuidePage.tsx
Layout: PortalLayout

Content:
- Page header with breadcrumb.
- Accordion sections: Task ownership, Updates, Blockers, Requests, Approvals, Evidence, Closure quality, Knowledge, Support routes.
- Each accordion item includes a short rule, why it matters, and one example.

Interactions:
- Accordion expand/collapse.
- "Start from my workspace" button -> activePersona.defaultRoute.

### Page 3 -- Service Catalogue Marketplace

Route: /marketplaces/services
Component: ServicesMarketplacePage.tsx
Layout: PortalLayout

Tab bar: All | HRA | IT & Access | Platform Support | Knowledge / Content | Task / Workflow | Admin | Approvals | Escalations

KPI strip:
- Available service categories: 8
- Avg routing time: < 1 business day
- At-risk requests: derive from requests slaState At Risk
- Closed this week: show 18

Content: 8 service cards.
Each card shows category, description, required inputs, SLA expectation, fulfilment owner type, and action button.

Cards:
- HRA Requests
- IT & Access Requests
- Platform Support
- Knowledge / Content Requests
- Task / Workflow Support
- Admin Requests
- Approvals
- Escalations

Interactions:
- Card click -> open DetailPanel with required inputs, routing, SLA, and related requests.
- "Start request" -> toast "Request draft started in prototype mode".
- Filter tabs filter visible cards.

### Page 4 -- Task Template Catalogue

Route: /marketplaces/task-templates
Component: TaskTemplatesMarketplacePage.tsx
Layout: PortalLayout

Tab bar: All | Personal Work | Team Delivery | Review | Governance | Closure Quality

KPI strip:
- Templates: 12
- P0 task templates: 5
- Templates with evidence rules: 9
- Closure criteria coverage: 82%

Content: template cards.
Each card shows template name, purpose, required fields, checklist count, evidence rules, and closure criteria.

Seeded template cards:
- Structured Delivery Task
- Review & Approval Task
- Governance Follow-up
- Closure Quality Review
- Working Session Action
- Onboarding Task

Interactions:
- Card click -> DetailPanel.
- "Use template" -> toast "Template selected; task draft simulated".

### Page 5 -- Knowledge Discovery Marketplace

Route: /marketplaces/knowledge
Component: KnowledgeMarketplacePage.tsx
Layout: PortalLayout

Tab bar: All | GHC | 6xD | Playbooks | Templates | Learning | Workspace Guides

KPI strip:
- Knowledge assets: use knowledgeAssets.length
- Effective references: count status Effective
- Under review: count status Under Review
- Linked to work: count assets with linkedTaskIds length > 0

Content: DataTable of knowledgeAssets.
Columns:
- ID using MonoId
- Title plain text
- Type using category badge
- Status using StatusPill
- Tags as small chips
- Linked tasks count
- Action: Open

Interactions:
- Row click -> DetailPanel with linked tasks.
- Search filters title, type, and tags.

### Page 6 -- Work Directory Marketplace

Route: /marketplaces/work-directory
Component: WorkDirectoryMarketplacePage.tsx
Layout: PortalLayout

Tab bar: Teams | Units | Owners | Experts | Fulfilment Contacts | Support Contacts

KPI strip:
- Units: count units
- Teams: count teams
- Owners: count users with lead roles
- Support queues: count queues

Content: split layout.
Left: directory filters.
Right: cards for users, units, teams, and queues.

Interactions:
- Directory card click -> DetailPanel.
- Filter by role, unit, team, queue ownership.

### Page 7 -- Analytics Discovery Marketplace

Route: /marketplaces/analytics
Component: AnalyticsMarketplacePage.tsx
Layout: PortalLayout

Tab bar: All | Personal | Team | Unit | SLA | Governance | Executive

KPI strip:
- Dashboards visible: persona-scoped count
- SLA views: 2
- Governance reports: 3
- Outcome views: 1

Content: dashboard catalogue cards.
Cards:
- My Performance Snapshot
- Team Execution Dashboard
- Unit Visibility Dashboard
- SLA Dashboard
- Governance Dashboard
- CEO Enterprise Dashboard

Interactions:
- Card click -> navigate to matching built route or placeholder.
- Restricted card for disallowed persona shows lock icon and tooltip.

### Page 8 -- Marketplace Feedback

Route: /marketplaces/feedback
Component: MarketplaceFeedbackPage.tsx
Layout: PortalLayout

Content:
- Feedback form card with category selector, affected area, description, suggested correction, urgency.
- Recent feedback table with 5 mock rows.

States:
- Empty description validation error on submit.
- Success toast on valid submit.

Interactions:
- Submit -> validate description and category.
- Valid submit -> toast "Marketplace feedback captured in prototype mode" and reset form.

### Page 9 -- My Work Dashboard

Route: /workspace/my-work
Component: MyWorkPage.tsx
Layout: AppLayout
Accessible to: Associate

Tab bar: Today | This Week | Blocked | Awaiting Review | Requests

KPI strip:
- Assigned tasks: count tasks owned by USR-001
- Due today: tasks due 2026-05-13
- Blocked: status Blocked
- Pending requests: requests requesterUserId USR-001 not Closed

Content:
- Left column: Priority task list using DataTable.
- Right column: Quick resume cards for requests, evidence, knowledge recommendations, recent alerts.
- Bottom: Knowledge in work context cards from knowledgeAssets linked to visible tasks.

Columns:
- Task ID using MonoId
- Task title
- Status using StatusPill
- SLA using SlaBadge
- Evidence using StatusPill
- Due date
- Action: Update

Interactions:
- Row click -> DetailPanel task view.
- Update button -> small modal with progress note textarea and Save.
- Save -> toast "Progress update saved in prototype mode".
- Attach evidence -> toast "Evidence attached in prototype mode".
- Request closure review -> toast "Closure review requested".

### Page 10 -- My Tasks

Route: /workspace/my-tasks
Component: MyTasksPage.tsx
Layout: AppLayout
Accessible to: Associate, Scrum Master, Team / Squad Lead, Unit Lead

Tab bar: All | In Progress | Blocked | Missing Update | Review Needed | Closed

KPI strip:
- Open tasks
- Blocked tasks
- Missing evidence
- Closure review ready

Content: DataTable of persona-visible tasks.
Columns:
- ID MonoId
- Title
- Owner OwnerBadge
- Team
- Status StatusPill
- Priority
- SLA SlaBadge
- Checklist progress
- Evidence
- Action

Interactions:
- Row click -> DetailPanel.
- Filter chips filter rows.
- Action button opens task action menu: Add update, Flag blocker, Attach evidence, Request review.

### Page 11 -- My Requests

Route: /workspace/my-requests
Component: MyRequestsPage.tsx
Layout: AppLayout
Accessible to: Associate, HRA

Tab bar: Submitted | Drafts | Pending Info | In Review | Closed

KPI strip:
- Submitted requests
- Pending info
- At risk
- Closed

Content: DataTable of requests where requester is active user or HRA owner.
Columns:
- Request ID MonoId
- Category
- Title
- Status StatusPill
- SLA SlaBadge
- Owner OwnerBadge
- Expected outcome
- Action

Interactions:
- Row click -> DetailPanel request view.
- New request button -> navigate /marketplaces/services.
- Provide info -> modal with text area and submit.

### Page 12 -- Agile Execution View

Route: /workspace/agile-execution
Component: AgileExecutionPage.tsx
Layout: AppLayout
Accessible to: Scrum Master

Tab bar: Flow Health | Blockers | Missing Updates | Missing Evidence | Closure Quality

KPI strip:
- Flow health: At Risk
- Blockers: count blocked tasks
- Missing updates: count Missing Update tasks
- Closure risks: count evidence Missing or Partial

Content:
- Flow health board with columns: Healthy, Watch, Intervention Needed.
- Task hygiene table.
- Reminder prompt panel.

Interactions:
- Send reminder -> toast "Reminder sent in prototype mode".
- Escalate hygiene issue -> toast "Escalation created in prototype mode".
- Row click -> DetailPanel.

### Page 13 -- Team Execution View

Route: /operations/team-execution
Component: TeamExecutionPage.tsx
Layout: AppLayout
Accessible to: Team / Squad Lead

Tab bar: Workload | Overdue | Blockers | Approvals | Closure Quality

KPI strip:
- Team workload: 28
- Overdue work: 4
- Blockers: 3
- Ready for review: 4

Content:
- Team workload table.
- Owner workload cards.
- Approval queue preview.
- Closure-quality risk list.

Interactions:
- Assign task button -> modal with owner select, output field, due date, checklist preview.
- Reassign owner -> toast.
- Add escalation -> toast and DetailPanel timeline update in memory.

### Page 14 -- Unit Visibility View

Route: /operations/unit-visibility
Component: UnitVisibilityPage.tsx
Layout: AppLayout
Accessible to: Unit Lead

Tab bar: Unit Health | SLA Trends | Governance Risks | Outcomes | Teams

KPI strip:
- Unit health: Watch
- SLA on track: 84%
- Governance exceptions: 7
- Outcome progress: 72%

Content:
- Unit KPI grid.
- Team health table.
- SLA exposure list.
- Outcome tracking card.

Interactions:
- Team row click -> DetailPanel.
- Trigger governance intervention -> toast "Governance intervention created in prototype mode".

### Page 15 -- HRA Workflow View

Route: /operations/hra-workflow
Component: HraWorkflowPage.tsx
Layout: AppLayout
Accessible to: HRA

Tab bar: Onboarding | Role Transition | HRA Requests | Policy Checks | Returned

KPI strip:
- HRA requests: count category HRA Requests
- Onboarding workflows: 5
- Policy checks pending: 2
- Returned items: count approvals Returned

Content:
- HRA request queue table.
- Onboarding checklist panel for REQ-2002.
- Workforce readiness cards.

Interactions:
- Approve request -> toast "HRA request approved in prototype mode".
- Return request -> modal asking rationale; submit shows warning toast.
- Checklist item click toggles in memory.

### Page 16 -- Support Operations View

Route: /support/operations
Component: SupportOperationsPage.tsx
Layout: AppLayout
Accessible to: Support

Tab bar: New | Pending Info | Routed | At Risk | Closed

KPI strip:
- New requests: queue newCount
- At risk: queue atRiskCount
- Pending info: count status Pending Info
- Closed today: 12

Content:
- Central support queue table.
- Request triage panel.
- Knowledge assistance side panel.

Interactions:
- Triage request -> open DetailPanel.
- Route to fulfilment owner -> modal with owner and queue select.
- Add evidence -> toast.
- Close request -> toast and row status changes to Closed in memory.

### Page 17 -- Administration Console

Route: /admin/console
Component: AdminConsolePage.tsx
Layout: AppLayout
Accessible to: Admins

Tab bar: Users & Roles | Task Model | Request Categories | Workflow Rules | SLA Rules | Integrations | AI Settings

KPI strip:
- Active users: count users
- Roles configured: count personas
- Active rules: 18
- Audit events today: count auditEvents

Content:
- Configuration cards.
- User & role management table.
- SLA rule preview.
- Integration settings placeholder cards for Teams, Outlook, SharePoint / OneDrive, Planner.

Interactions:
- Edit role -> modal with role scope checkboxes.
- Save -> toast "Configuration change saved in prototype mode" and creates visible audit event card.
- Integration card click -> DetailPanel describing boundary and source-of-truth rule.

### Page 18 -- Workflow Centre

Route: /execution/workflow
Component: WorkflowCentrePage.tsx
Layout: AppLayout
Accessible to: Scrum Master, Team / Squad Lead, Unit Lead, HRA, Admins, Support, CEO

Tab bar: Pending Approvals | Escalations | SLA Risks | Handoffs | Decision Log

KPI strip:
- Pending approvals: count Pending approvals
- Escalations: 3
- SLA risks: count At Risk + Breached tasks/requests
- Decisions logged: 14

Content:
- WorkflowItem table.
- Approval list.
- Escalation cards.

Interactions:
- Approve -> toast "Approval recorded in prototype mode".
- Return -> modal with rationale.
- Escalation card click -> DetailPanel.

### Page 19 -- SLA Dashboard

Route: /intelligence/sla
Component: SlaDashboardPage.tsx
Layout: AppLayout
Accessible to: Scrum Master, Team / Squad Lead, Unit Lead, HRA, Admins, Support, CEO

Tab bar: All | Tasks | Requests | Approvals | Escalations

KPI strip:
- On track
- At risk
- Breached
- Met

Content:
- SLA summary cards.
- SLA exposure table across tasks and requests.
- Aging distribution bars using simple div widths, no charting dependency required.

Interactions:
- SLA row click -> DetailPanel.
- Filter tabs update rows.

### Page 20 -- CEO Enterprise Execution View

Route: /executive/enterprise-execution
Component: ExecutiveEnterprisePage.tsx
Layout: AppLayout
Accessible to: CEO

Tab bar: Enterprise Health | Strategic Initiatives | Governance | SLA Exposure | Value Delivery

KPI strip:
- Strategy-to-work traceability: 90%
- Task governance completeness: 95%
- Request accountability: 85%
- Execution quality: 76%

Content:
- Executive KPI grid.
- Strategic initiative progress cards.
- Governance health panel.
- Unit/team performance table.
- SLA exposure list.
- Outcome tracking card for OUT-6001.

Interactions:
- KPI click -> DetailPanel with metric explanation.
- Unit row click -> DetailPanel.
- Escalate concern -> toast "Executive escalation created in prototype mode".

### Page 21 -- Audit Log

Route: /admin/audit-log
Component: AuditLogPage.tsx
Layout: AppLayout
Accessible to: Admins, CEO

Tab bar: All | Task | Request | Approval | Configuration | Access

KPI strip:
- Events today
- Warning events
- Critical events
- Configuration changes

Content: auditEvents DataTable.
Columns:
- Event ID MonoId
- Event
- Actor OwnerBadge
- Timestamp MonoId
- Entity type
- Entity ID MonoId
- Severity StatusPill

Interactions:
- Row click -> DetailPanel audit event.
- Filter by severity.

## 9. Shared Components

Create these components in src/components.

### TopBar

Props: none.
Behaviour: fixed header with ProductIdentity, MarketplaceDropdown, DiscoverySearchCommand, NotificationBell, PersonaSwitcher, UserMenu.
Dimensions: 64px height, full width, #FFFFFF background, border-bottom #EEEFF6.
States: default, dropdown open, search open.

### ProductIdentity

Props: variant?: 'light' | 'dark'.
Behaviour: renders DWS.01 / Work.Space4.0 text identity.
Dimensions: 18px/700 for DWS.01, 15px/500 for Work.Space4.0.

### MarketplaceDropdown

Props: none.
Behaviour: header dropdown listing six marketplace destinations.
Dimensions: 720px width desktop, 12px radius, 24px padding.
Animation: opacity 0 -> 1 and translateY(4px) -> 0, 150ms ease-out.

### DiscoverySearchCommand

Props: none.
Behaviour: command palette for services, templates, knowledge, tasks, requests, dashboards, owners.
Dimensions: 720px max width, centered modal-like command panel.
States: closed, empty, typing, results, no results.
Search groups:
- Services
- Task templates
- Knowledge
- Tasks
- Requests
- Dashboards
- Owners
Interactions: typing filters in memory; result click navigates or opens DetailPanel.

### PersonaSwitcher

Props: none.
Behaviour: dropdown grouped by tier. Updates PersonaContext and route.
Dimensions: pill height 40px, dropdown 360px.
States: closed, open, selected.

### NotificationBell

Props: count: number, urgentCount?: number.
Behaviour: icon button with badge; click opens notification dropdown.
Notifications:
- TSK-1004 breached SLA
- REQ-2001 pending information
- APR-3001 awaiting review
- KNO-003 under review

### UserMenu

Props: none.
Behaviour: dropdown with Profile & Preferences placeholder, Operating Guide, Return to Stage 0, Sign out simulated.
Sign out click: toast "Sign out is not built in Shell prototype".

### RoleScopedSidebar

Props: activePersona: Persona.
Behaviour: renders filtered navigation tree. Collapsible domain groups. Active route highlighted.
Dimensions: 280px width, fixed below TopBar.

### Footer

Props: none.
Behaviour: visible only in PortalLayout. Navy background #030F35. Contains ProductIdentity dark variant, short platform description, links to Stage 0, marketplaces, operating guide.

### KpiTile

Props: label: string; value: string; trend?: string; status: 'success' | 'warning' | 'danger' | 'info'.
Behaviour: compact metric card with status line and optional trend.
Dimensions: min-height 108px, 12px radius, 16px padding.
Colour logic:
- success -> green
- warning -> amber
- danger -> red
- info -> blue

### StatusPill

Props: status: string.
Behaviour: dot + label.
Colour logic:
- Closed, Approved, Effective, Met, On Track -> success
- In Progress, In Review, Pending, Pending Info, Review Needed, Under Review, At Risk -> warning
- Blocked, Breached, Missing Update, Returned, Critical -> danger
- Draft, New, Routed -> info or neutral
Dimensions: rounded-full, 12px dot, 12px/600 label, 6px 10px padding.

### SlaBadge

Props: state: 'On Track' | 'At Risk' | 'Breached' | 'Met'.
Behaviour: clock icon + SLA state.
Colour logic:
- On Track, Met -> success
- At Risk -> warning
- Breached -> danger

### OwnerBadge

Props: userId: string.
Behaviour: resolve user from service data; show initials avatar, name, role.
Fallback: "Unassigned" muted if missing.

### MonoId

Props: value: string.
Behaviour: JetBrains Mono, copyable on click.
Click: toast "[value] copied".

### DataTable

Props: columns, rows, onRowClick, emptyMessage.
Behaviour: reusable table with sticky header, row hover, clickable rows.
States: loading skeleton, error card, empty state, filled.

### DetailPanel

Props: entity: Task | RequestRecord | Approval | WorkflowItem | KnowledgeAsset | AuditEvent | KpiSet | null; onClose: () => void.
Behaviour: slides in from right. Width: 40vw, min-width 520px, max-width 720px. White background, shadow-xl, overflow-y-auto.
Animation: translateX(100%) -> translateX(0), 220ms ease-out.
Overlay: transparent click-catcher; page remains visible.
Close: x button and click outside.
Entity rendering:
- Task: header ID/title/status, owner, SLA, checklist, evidence, purpose, expected output, linked knowledge, timeline, actions.
- Request: category/status/SLA, requester, owner, expected outcome, linked task, queue, actions.
- Approval: type/status, approver, rationale, linked record, decision actions.
- Workflow: state, SLA label, linked task/request, approval.
- Knowledge: type/status/tags, linked tasks.
- Audit: event, actor, timestamp, entity, severity.
- KPI: label, value, trend, explanation, linked records.

### FilterBar

Props: tabs: string[]; activeTab: string; onTabChange: (tab: string) => void; search?: string; onSearchChange?: (value: string) => void.
Behaviour: tab row + optional search input.
Active tab: #030F35 background, white text or orange bottom border depending page context.

### ActionToast

Props: type: 'success' | 'warning' | 'error' | 'info'; title: string; body?: string.
Behaviour: top-right stack, 3s auto-dismiss for success/info/warning, manual close for error.
Animation: translateX(20px) -> 0 and opacity 0 -> 1, 300ms ease-out.

### PlaceholderPage

Props: title: string; description: string; phase: string.
Behaviour: branded placeholder for routes not fully built.
Style: white card, dashed 1px #D8D9E6 border, 48px Lucide icon in #FB5535, title 20px/700 #030F35, description 14px #5F607F, pill "Coming in [phase]" in orange-100 background and orange-900 text.

### Stage0Hero

Props: activePersona: Persona.
Behaviour: Stage 0 hero with persona-aware CTA.
Style: navy background, orange eyebrow, white heading, navy-200 body, orange primary CTA.

### NextStepCard

Props: title, description, icon, route, disabled?: boolean.
Behaviour: card action for Stage 0 next steps.
Hover: translateY(-2px), shadow-md.
Disabled: muted with lock icon.

### EvidenceList

Props: task: Task.
Behaviour: evidence state summary and linked evidence placeholder rows.
States: Missing, Partial, Attached, Accepted.

### Timeline

Props: events: AuditEvent[].
Behaviour: vertical timeline with event dot colour by severity.

## 10. Interaction Spec

Global rules:
- No real API calls.
- No Supabase.
- No real authentication.
- All data comes through src/services/platform.service.ts.
- All user actions update local component state only.
- All save/submit/approve/route/close actions show ActionToast.

Routing:
- ProductIdentity click -> /stage-0/orientation.
- MarketplaceDropdown item click -> corresponding /marketplaces route.
- Persona switch -> set active persona, navigate to persona default route, show toast.
- Restricted route -> render PermissionRestricted card.

Tables:
- All table rows are clickable.
- Row click -> open DetailPanel with row entity.
- Row hover -> #F3F5FD background.
- Empty table -> centered empty state with 48px icon, title, body, optional CTA.
- Loading table -> skeleton rows.
- Error table -> red-tinted error card with retry button; retry returns filled state.

Cards:
- Marketplace cards are clickable.
- Dashboard cards either open DetailPanel or navigate.
- Disabled cards show lock icon and muted text.

DetailPanel:
- x button -> close.
- Click outside -> close.
- Escape -> close.
- Action buttons inside panel show toasts.

Forms and modals:
- Required fields show inline validation on submit attempt.
- Cancel closes modal.
- x closes modal.
- Click outside closes standard modal, except wizard-like forms where click outside does nothing.
- Save/Submit shows toast and updates visible local state when simple.

Filter chips and tabs:
- Toggle active CSS class.
- Filter displayed rows/cards in component state.
- Search input filters by title, ID, category, owner, status, and tags where present.

Discovery Search:
- Opens from TopBar trigger.
- Typing filters across services, templates, knowledge, tasks, requests, dashboards, owners.
- Empty query shows suggested groups.
- No result state shows: "No permitted result found for this persona".
- Result click navigates or opens DetailPanel.

Notifications:
- NotificationBell click opens dropdown.
- Notification click navigates to linked record route or opens DetailPanel.
- Mark all read sets badge count to 0 in memory.

PersonaSwitcher:
- Updates PersonaContext.
- Re-renders sidebar scope.
- Redirects to persona default route.
- Shows toast.

Toasts:
- Position: top-right.
- Auto-dismiss after 3s for success/info/warning.
- Error stays until closed.

Keyboard and accessibility:
- Buttons are reachable by Tab.
- Dropdowns close on Escape.
- Modals trap focus and restore focus on close.
- Active nav item uses aria-current="page".
- Tabs use role="tablist" and aria-selected.
- Icons that are decorative use aria-hidden="true".

## 11. Unbuilt Pages -- Placeholder Component

For every route referenced in navigation but not listed in Pages to Build, render PlaceholderPage.

PlaceholderPage props:
- title: route label
- description: one sentence describing what will live there
- phase: "Prototype Shell"

Placeholder styling:
- Background: #FFFFFF.
- Border: dashed 1px #D8D9E6.
- Radius: 12px.
- Padding: 32px.
- Icon: 48px Lucide icon in #FB5535.
- Title: 20px/700 #030F35.
- Description: 14px/400 #5F607F.
- Pill: "Coming in Prototype Shell expansion" with #FDE5DF background and #A6270D text.
- Primary action: "Return to Stage 0" -> /stage-0/orientation.
- Secondary action: "Open my workspace" -> activePersona.defaultRoute.

Placeholder examples:
- /workspace/my-updates: "Progress update history and update-quality prompts will appear here."
- /workspace/my-blockers: "Assigned blockers, blocker owners, resolution path, and escalation signals will appear here."
- /execution/tasks/create: "Structured task creation with purpose, owner, output, checklist, SLA, evidence, and linked knowledge will appear here."
- /admin/ai-automation: "AI and automation guardrail configuration will appear here as a future controlled administration surface."

## 12. Do Not Build

Do not build any of the following:
- Real user authentication.
- Login screen with credential validation.
- Signup.
- Password reset.
- SSO.
- Session management.
- Supabase connection.
- PostgreSQL connection.
- Redis connection.
- Express or backend code.
- Real API calls.
- Real Microsoft Teams integration.
- Real Outlook integration.
- Real SharePoint or OneDrive integration.
- Real Planner integration.
- Real notification delivery.
- Real email sending.
- Real workflow execution.
- Real approval persistence.
- Real SLA timers.
- Real audit immutability.
- Real AI or LLM calls.
- AI-generated decisions.
- Production analytics event pipeline.
- HRMS, ERP, CRM, LMS, or ITSM functionality.
- Public customer-facing pages.
- External partner access.
- Mobile-native app.
- Database schema migration.
- Payment, billing, procurement, finance, or payroll features.

## 13. Component Architecture Rules

All components must be prop-driven.
No component should hardcode row values internally when those values exist in mock data.
Pages call service functions, then pass data into components.
Components never import directly from src/mocks.
Data shapes should mirror future API response objects.
Use realistic seeded data with IDs and cross-entity links.
Include edge-case data:
- Long task title in TSK-1006.
- Missing evidence in TSK-1002.
- Breached SLA in TSK-1004.
- Returned approval in APR-3002.
- Knowledge asset with no linked task in KNO-004.
- Permission-restricted analytics cards for personas without scope.

## 14. Final Build Quality Checks

Before finishing, verify:
- Header appears on all pages.
- Stage 0 and marketplace pages have no sidebar.
- Stage 2, Stage 3, and Stage 4 pages use AppLayout with sidebar.
- Marketplace access is only through the header dropdown, not as a sidebar group.
- Discovery Search is a header command panel, not a marketplace page.
- Persona switching changes default route and sidebar scope.
- Restricted routes show a branded restricted-state card.
- Every built table has loading, error, empty, and filled states available.
- Every action button has a visible result: toast, modal, detail panel, or navigation.
- Do Not Build exclusions are respected.
- DQ Navy and DQ Orange are used according to the token rules.
- No unapproved colours are introduced.
- No real backend, auth, Supabase, Microsoft, or AI integration is added.

