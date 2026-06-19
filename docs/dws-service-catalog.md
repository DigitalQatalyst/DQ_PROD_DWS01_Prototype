# DWS Marketplace — Catalog Model & Service Listing

How the DWS marketplace is structured, and the full listing of **Drive** services (the
user-facing requests). Organised so the same spine works across every marketplace.

---

## 1. Marketplaces (top level = the 4-D)

The four catalog stages are the **top-level marketplaces**. Each holds a *different type of
artifact* for the same underlying work. (Definitions per the 4-D catalog-page model; repo
routes these in `src/config/marketplace4dRoutes.ts`.)

| Marketplace | Purpose | What it holds |
|-------------|---------|----------------|
| **Discern** | Educate, inform, help users understand *why* the work matters | Knowledge, guides, explainers, context |
| **Design** | Provide the approved rules, frameworks, policies, controls, obligations, decision logic | Policies, frameworks, standards, control libraries |
| **Deploy** | Provide templates, tools, baselines, implementation artefacts to execute work correctly | Templates, tools, checklists, baselines |
| **Drive** | Provide user-facing services, requests, evidence flows, readiness access, cases, formal outputs | **Services / requests** (listed in §4) |

> The service listing below is the **Drive** marketplace. Discern / Design / Deploy are
> sketched in §5 using the same submarketplace spine.

---

## 2. Submarketplaces = the 4 Value Stream Domains

Every marketplace shares the **same 4 submarketplaces** — the Value Stream Domains:

| Zone | Submarketplace | Service Domains it covers |
|------|----------------|---------------------------|
| Transform & Enable *(Internal)* | **Transform** | Architecture & Governance · Cognitive Automation |
| Transform & Enable *(Internal)* | **Enable** | Finance & Admin · Operational Excellence |
| Commercial & Delivery *(External)* | **Commercial** | Marketing & Lead Generation · BD & Partners |
| Commercial & Delivery *(External)* | **Delivery** | Customer Delivery · Delivery Factory |

**Service Domain is a *filter*, not a section.** Inside a submarketplace, services are listed
flat and the user narrows down with that submarketplace's filters (§3).

---

## 3. Filters

### 3.1 Shared filters (apply to ALL Drive submarketplaces — 2 max)

| Filter | Values |
|--------|--------|
| **Location** | Dubai · Nairobi |
| **Approval** | Self-serve (no approval) · Manager approval · Governance / Owner approval |

### 3.2 Submarketplace-specific filters

Each submarketplace defines its own set (always including **Service Domain**):

**TRANSFORM**
| Filter | Values |
|--------|--------|
| Service Domain | Architecture & Governance · Cognitive Automation |
| Engagement Type | Review · Assessment · Build · Advisory |
| Discipline | Strategy · Architecture · Governance · Risk · AI & Automation · Innovation |

**ENABLE**
| Filter | Values |
|--------|--------|
| Service Domain | Finance & Admin · Operational Excellence |
| Category | Payroll · Leave & Attendance · HR Lifecycle · Tools & Access · Finance · Facilities · Operations |
| Frequency | One-off · Recurring |

**COMMERCIAL**
| Filter | Values |
|--------|--------|
| Service Domain | Marketing & Lead Generation · BD & Partners |
| Funnel Stage | Awareness · Demand · Pipeline · Account |
| Output Type | Campaign · Content · Brand Asset · Proposal · Partnership |

**DELIVERY**
| Filter | Values |
|--------|--------|
| Service Domain | Customer Delivery · Delivery Factory |
| Engagement Type | Assess · Design · Deploy · Manage |
| Engagement Model | Project · TMaaS |

---

## 4. DRIVE Marketplace — Service Listing

Flat per submarketplace; Service Domain shown as a column (it's a filter). All services default
to both locations unless flagged. Delivery team shown per submarketplace.

### Submarketplace: TRANSFORM  *(Internal)*

| Service | Service Domain | Functional Area | Engagement Type | Delivery Team |
|---------|----------------|-----------------|-----------------|---------------|
| Strategic Planning Support | Architecture & Governance | Strategy Management | Advisory | GOV (CoE) |
| Enterprise Architecture Review | Architecture & Governance | Enterprise Architecture | Review | GOV (CoE) |
| Platform Architecture Review | Architecture & Governance | Platform Architecture | Review | GOV (CoE) |
| Governance / Policy Exception | Architecture & Governance | Governance Management | Assessment | GOV (CoE) |
| Risk & Compliance Assessment | Architecture & Governance | Risk & Compliance | Assessment | GOV (CoE) |
| Benefits Realisation Review | Architecture & Governance | Benefits Management | Review | GOV (CoE) |
| Innovation Intake | Cognitive Automation | Innovation Management | Advisory | DEL (Intelligence) |
| AI Enablement Request | Cognitive Automation | AI Enablement | Build | DEL (Intelligence) |
| Process Automation Build | Cognitive Automation | Process Automation | Build | DEL (Intelligence) |
| Knowledge Engineering Request | Cognitive Automation | Knowledge Engineering | Build | DEL (Intelligence) |
| Decision Intelligence / Analytics Request | Cognitive Automation | Decision Intelligence | Build | DEL (Intelligence) |
| Continuous Improvement Initiative | Cognitive Automation | Continuous Improvement | Advisory | DEL (Intelligence) |

### Submarketplace: ENABLE  *(Internal)*

| Service | Service Domain | Category | Functional Area | Delivery Team |
|---------|----------------|----------|-----------------|---------------|
| Pay Slip (download / request) | Operational Excellence | Payroll | Workforce Operations | OPS (HRA) |
| Salary Certificate / Employment Letter | Operational Excellence | Payroll | Workforce Operations | OPS (HRA) |
| Change Bank Account for Payroll | Operational Excellence | Payroll | Workforce Operations | OPS (HRA) |
| Leave Request (annual / sick / unpaid) | Operational Excellence | Leave & Attendance | Workforce Operations | OPS (HRA) |
| Leave Balance Query | Operational Excellence | Leave & Attendance | Workforce Operations | OPS (HRA) |
| Work-From-Home / Remote Work Request | Operational Excellence | Leave & Attendance | Workforce Operations | OPS (HRA) |
| Timesheet / Attendance Correction | Operational Excellence | Leave & Attendance | Workforce Operations | OPS (HRA) |
| Overtime Request | Operational Excellence | Leave & Attendance | Workforce Operations | OPS (HRA) |
| Hiring Requisition (raise a new role) | Operational Excellence | HR Lifecycle | Workforce Operations | OPS (HRA) |
| New Joiner Onboarding | Operational Excellence | HR Lifecycle | Workforce Operations | OPS (HRA) |
| Employment Verification Letter | Operational Excellence | HR Lifecycle | Workforce Operations | OPS (HRA) |
| Role Transition / Internal Transfer | Operational Excellence | HR Lifecycle | Workforce Operations | OPS (HRA) |
| Offboarding / Resignation | Operational Excellence | HR Lifecycle | Workforce Operations | OPS (HRA) |
| HR Case / Grievance | Operational Excellence | HR Lifecycle | Workforce Operations | OPS (HRA) |
| Learning / Training Enrolment | Operational Excellence | HR Lifecycle | Workforce Operations | OPS (HRA) |
| Request New Tool / Software | Operational Excellence | Tools & Access | Platform Operations | DEL (SecDevOps) |
| Request Tool Privileges / Elevated Access | Operational Excellence | Tools & Access | Platform Operations | DEL (SecDevOps) |
| Software License Upgrade | Operational Excellence | Tools & Access | Platform Operations | DEL (SecDevOps) |
| Hardware / Device Request | Operational Excellence | Tools & Access | Platform Operations | DEL (SecDevOps) |
| Account / Password Reset | Operational Excellence | Tools & Access | Platform Operations | DEL (SecDevOps) |
| VPN / Remote Access | Operational Excellence | Tools & Access | Platform Operations | DEL (SecDevOps) |
| Access Deprovisioning (leaver) | Operational Excellence | Tools & Access | Platform Operations | DEL (SecDevOps) |
| Operational Reporting Request | Operational Excellence | Operations | Operational Insight | OPS (HRA) |
| Performance Review Setup | Operational Excellence | Operations | Performance Management | OPS (HRA) |
| Quality Audit Request | Operational Excellence | Operations | Quality Management | OPS (HRA) |
| Service Request / Incident Logging | Operational Excellence | Operations | Service Management | OPS (HRA) |
| Procurement / Purchase Request | Finance & Admin | Finance | Procurement Management | OPS (Finance) |
| Vendor Onboarding | Finance & Admin | Finance | Vendor Management | OPS (Finance) |
| Contract Review / Setup | Finance & Admin | Finance | Contract Management | OPS (Finance) |
| Legal Review Request | Finance & Admin | Finance | Legal Operations | OPS (Finance) |
| Expense Reimbursement | Finance & Admin | Finance | Financial Management | OPS (Finance) |
| Petty Cash Request | Finance & Admin | Finance | Financial Management | OPS (Finance) |
| Invoice / Payment Query | Finance & Admin | Finance | Financial Management | OPS (Finance) |
| Tax / Year-End Statement | Finance & Admin | Finance | Financial Management | OPS (Finance) |
| Salary Advance / Loan Request | Finance & Admin | Finance | Financial Management | OPS (Finance) |
| Desk / Workspace Booking | Finance & Admin | Facilities | Corporate Administration | OPS (Finance) |
| Travel Request | Finance & Admin | Facilities | Corporate Administration | OPS (Finance) |
| ID Badge / Access Card | Finance & Admin | Facilities | Corporate Administration | OPS (Finance) |
| Visa / Work Permit Support *(DXB / NBO specific)* | Finance & Admin | Facilities | Corporate Administration | OPS (Finance) |
| Business Cards / Stationery | Finance & Admin | Facilities | Corporate Administration | OPS (Finance) |

### Submarketplace: COMMERCIAL  *(External)*

| Service | Service Domain | Functional Area | Funnel Stage | Delivery Team |
|---------|----------------|-----------------|--------------|---------------|
| Market Research Request | Marketing & Lead Generation | Market Intelligence | Awareness | DEL (Stories) |
| Brand Asset Request | Marketing & Lead Generation | Brand Management | Awareness | DEL (Stories) |
| Campaign Request | Marketing & Lead Generation | Campaign Management | Demand | DEL (Stories) |
| Content / Story Production | Marketing & Lead Generation | Content Operations | Demand | DEL (Stories) |
| Lead Generation Request | Marketing & Lead Generation | Lead Generation | Demand | DEL (Stories) |
| CX Improvement Request | Marketing & Lead Generation | Customer Experience | Account | DEL (Stories) |
| Lead Qualification | BD & Partners | Lead Management | Pipeline | DEL (Deals) |
| Opportunity Registration | BD & Partners | Opportunity Management | Pipeline | DEL (Deals) |
| Sales Support / Proposal | BD & Partners | Sales Management | Pipeline | DEL (Deals) |
| Account Setup / Review | BD & Partners | Account Management | Account | DEL (Deals) |
| Partner Onboarding | BD & Partners | Partner Management | Account | DEL (Deals) |
| Ecosystem Engagement Request | BD & Partners | Ecosystem Development | Account | DEL (Deals) |

### Submarketplace: DELIVERY  *(External)*

| Service | Service Domain | Functional Area | Engagement Type | Engagement Model | Delivery Team |
|---------|----------------|-----------------|-----------------|------------------|---------------|
| Customer Onboarding Setup | Customer Delivery | Customer Onboarding | Deploy | Project | DEL Unit (DQ Account) |
| Order Fulfilment Request | Customer Delivery | Order Fulfilment | Deploy | Project | DEL Unit (DQ Account) |
| Customer Support Case | Customer Delivery | Customer Support | Manage | TMaaS | DEL Unit (DQ Account) |
| Case Setup / Routing | Customer Delivery | Case Management | Manage | TMaaS | DEL Unit (DQ Account) |
| Incident Escalation | Customer Delivery | Incident Management | Manage | TMaaS | DEL Unit (DQ Account) |
| Lifecycle / Renewal Request | Customer Delivery | Lifecycle Services | Manage | TMaaS | DEL Unit (DQ Account) |
| Product Build Request | Delivery Factory | Product Development | Deploy | Project | DEL (Products) |
| Solution Delivery Engagement | Delivery Factory | Solution Delivery | Design | Project | DEL (Solutions) |
| Project Setup Request | Delivery Factory | Project Delivery | Assess | Project | DEL Unit (DQ Deploys) |
| Managed Services Request | Delivery Factory | Managed Services | Manage | TMaaS | DEL Unit (DQ Deploys) |
| Production Operations Support | Delivery Factory | Production Operations | Manage | TMaaS | DEL (SecDevOps) |
| Delivery Performance Review | Delivery Factory | Performance Management | Manage | TMaaS | DEL (Products) |

---

## 5. The other three marketplaces (same spine, different artifacts)

Discern / Design / Deploy reuse the **same 4 submarketplaces** and the **same shared filters**
(Location, Approval). Worked example for the **Enable** submarketplace:

| Marketplace | Example content for "Enable" |
|-------------|------------------------------|
| **Discern** | "Why operational excellence matters", leave-policy explainer, finance-controls primer |
| **Design** | Leave Policy, Remote-Work Policy, Access Control Policy, Procurement Policy, DOA matrix |
| **Deploy** | Leave-request template, onboarding checklist, access-request form, expense template |
| **Drive** | Pay Slip, Leave Request, Hiring Requisition, Expense, Tool Access… *(the services in §4)* |

---

## 6. Notes / open points

- **Filters**: 2 shared sets only (Location, Approval); every other filter is
  submarketplace-specific. Service Domain is a filter, not a structural section.
- **Delivery teams are inferred**. Enable splits across OPS (HRA / Finance) + DEL (SecDevOps);
  Delivery splits across Products / Solutions / DQ Deploys / SecDevOps. Confirm before locking.
- **Locations**: all services default to both Dubai + Nairobi; only Visa / Work Permit is flagged
  site-specific so far.
- Source diagram listed "Benefitus Management" — recorded here as **Benefits Management**.
