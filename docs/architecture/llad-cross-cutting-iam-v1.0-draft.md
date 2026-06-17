---
document_id: DWS.01-LLAD-XC-IAM
title: DWS.01 Identity and Access Management - Cross-Cutting Architecture Design
version: 1.0
date: 2026-06-17
status: Draft
system: DWS.01 Work.Space4.0
classification: Internal DQ use only
llad_subtype: cross-cutting
cross_cutting_topic: Identity and Access Management
concern_domains:
  - Identity and Session Management
  - Role and Permission Model
  - Access Enforcement and Route Guarding
  - Session Token and Claim Handling
  - Audit Exceptions and Access Review
---

```{=openxml}
<w:p>
  <w:pPr><w:shd w:fill="001035"/><w:spacing w:before="360" w:after="360"/></w:pPr>
  <w:r><w:rPr><w:color w:val="FFFFFF"/><w:sz w:val="44"/><w:b/></w:rPr><w:t>DWS.01 Identity and Access Management</w:t></w:r>
</w:p>
<w:p>
  <w:pPr><w:shd w:fill="001035"/><w:spacing w:after="360"/></w:pPr>
  <w:r><w:rPr><w:color w:val="FFFFFF"/><w:sz w:val="28"/></w:rPr><w:t>Cross-Cutting Low Level Architecture Design</w:t></w:r>
</w:p>
```

```{=openxml}
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:spacing w:before="240" w:after="120"/></w:pPr><w:r><w:rPr><w:color w:val="001035"/><w:sz w:val="28"/><w:szCs w:val="28"/><w:b/></w:rPr><w:t>Amendment History</w:t></w:r></w:p>
```

| Version | Date | Author | Description |
|---|---|---|---|
| 1.0 | 2026-06-17 | Codex | Initial IAM cross-cutting LLAD draft for DWS.01 authentication and access control. |

```{=openxml}
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:spacing w:before="240" w:after="120"/></w:pPr><w:r><w:rPr><w:color w:val="001035"/><w:sz w:val="28"/><w:szCs w:val="28"/><w:b/></w:rPr><w:t>Distribution List</w:t></w:r></w:p>
```

| Role | Distribution purpose | Status |
|---|---|---|
| Product Owner | Business review and scope confirmation | Pending |
| Technical Lead | Architecture review and implementation planning | Pending |
| Platform Administrator | IAM configuration and access review planning | Pending |
| Governance Lead | Control, audit, and compliance review | Pending |

```{=openxml}
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:spacing w:before="240" w:after="120"/></w:pPr><w:r><w:rPr><w:color w:val="001035"/><w:sz w:val="28"/><w:szCs w:val="28"/><w:b/></w:rPr><w:t>Approval Record</w:t></w:r></w:p>
```

| Role | Name | Date | Status |
|---|---|---|---|
| Product Owner | Pending | Pending | Pending |
| Technical Lead | Pending | Pending | Pending |
| Governance Lead | Pending | Pending | Pending |

# 1. Overview and Introduction

This section establishes the business and programme context for the DWS.01 Identity and Access Management cross-cutting concern, describes the platform vision it enables, and defines the baseline references governing this document.

This document specifies the low-level IAM architecture for authentication, session context, role and permission mapping, protected-route enforcement, and access governance across DWS.01 Work.Space4.0. It turns the HLAD and RSR requirement baseline into implementable rules for the prototype shell, the target Microsoft Entra ID authentication flow, the application access boundary, and permission-aware data access. Companion system LLADs govern feature, API, data, deployment, and integration details outside the IAM concern.

## 1.1 Business Context

The IAM concern exists because DWS.01 handles internal execution records, personal data, approval decisions, evidence, audit records, performance visibility, and governance controls that must be visible only to authorised users.

| # | Title | Description |
|---|---|---|
| 1 | Strategic Context | DWS.01 is DigitalQatalyst's internal agile enterprise execution platform and the workspace layer of the wider Digital Workspace Solution. The IAM design protects the source of truth for work records, ownership, SLA state, approval decisions, evidence links, audit trails, and reporting truth while allowing users to operate through a governed workspace. |
| 2 | Sponsoring Organisation | DigitalQatalyst sponsors DWS.01 as an internal execution platform for DQ teams, governance roles, service operators, administrators, and leadership. IAM is a foundation control because platform use depends on credential login, role context, permission scope, and controlled access to sensitive operating records. |
| 3 | User Communities | The governed user communities are Associates, Scrum Masters, Team / Squad Leads, Unit Leads, HRA, Admins, Support, and CEO users. The target role model also normalises these workspace segments into canonical DWS roles for navigation, reporting, service ownership, governance control, and platform administration. |
| 4 | Data Sensitivity | The platform handles workspace data, personal data, performance data, audit logs, evidence, access records, request records, and governance records. IAM must enforce role, unit, team, record, dashboard, sensitivity, retention, hosting, and data-handling controls before data is visible or actions are available. |
| 5 | Document Scope | This document covers authentication, authorisation, session, claim, role, permission, route-guard, audit, exception, and access-review design for DWS.01. It does not specify detailed API payload contracts, database schema migrations, production hosting topology, or Microsoft Graph integration behaviour. |

## 1.2 Platform Vision

The IAM vision supports DWS.01 as a secure internal workspace where execution, request, approval, performance, and governance activity is traceable to authenticated identity and authorised responsibility.

| # | Title | Description |
|---|---|---|
| 1 | Platform Objective | DWS.01 translates DQ strategy, priorities, services, knowledge, learning, governance, and collaboration into governed daily work. IAM ensures every workspace action is performed by an authenticated user with an approved role, unit, team, and permission scope. |
| 2 | Platform Strategy | The platform follows a staged delivery model where foundation controls are established before deeper marketplace, execution, fulfilment, governance, and specialised internal execution capabilities expand. IAM is part of the foundation layer and applies across every stage. |
| 3 | Technology Foundation | The target technology model uses Microsoft Entra ID for identity, OIDC / OAuth2 for authentication, an Express / BFF access boundary for request validation, Redis patterns for session state where required, and Supabase-backed PostgreSQL controls for canonical records and audit evidence. |
| 4 | Architecture Model | The architecture separates client rendering, application-owned access control, and governed data access. The client renders protected routes and role-aware navigation, the application tier enforces business and authorisation rules, and the data layer applies permission-aware persistence controls. |

## 1.3 Document Scope and References

This section defines the system boundaries for this document and the approved baseline documents it traces against.

### 1.3.1 Design Scope

The IAM LLAD governs the cross-cutting authentication and access-control obligations that DWS.01 systems and future service layers must observe.

| # | System | Stage coverage |
|---|---|---|
| 1 | DWS.01 Work.Space4.0 Client Tier | Prototype shell, Stage 0 entry, marketplace, workspace, task, request, governance, administration, analytics, support, HRA, and executive routes. |
| 2 | DWS.01 Application and Integration Layer | Target BFF, access boundary, workflow services, request services, approval services, audit services, notification services, and integration adapters. |
| 3 | DWS.01 Data and Intelligence Layer | Target Supabase-backed user, role, permission, unit, team, work, request, approval, audit, performance, and analytics records. |
| 4 | Platform Foundation Services | Shared IAM, audit, notification, configuration governance, session, and operational monitoring services consumed by DWS.01. |

### 1.3.2 Platform Architecture Document Set

The platform is documented across system-level and cross-cutting architecture artefacts. The table below is the authoritative register for this document version and records the known architecture documents in the programme.

| ID | Document | System / Scope | Type | Status |
|---|---|---|---|---|
| HLAD-DWS01 | DWS.01 Work.Space4.0 High Level Architecture Design | DWS.01 | Architecture Baseline | Review v2.0 |
| RSR-DWS01 | DWS.01 Work.Space4.0 Requirements Specification Report | DWS.01 | Requirements Baseline | Draft v2.0 |
| LLAD-XC-IAM | Identity and Access Management LLAD | Cross-cutting | Cross-cutting Design | This document |
| GAP-ANNEX | LLAD Traceability Annex (Gap Register + ADR Register) | Cross-cutting | Traceability and Decision Register | Planned |

### 1.3.3 Baseline References

The baseline documents below govern the IAM decisions in this LLAD and provide the traceability source for Section 4.

| # | Document | Version | Formal Title |
|---|---|---|---|
| 1 | HLAD | 2.0 | DWS.01 Work.Space4.0 - High Level Architecture Design |
| 2 | RSR | 2.0 draft | DWS.01 Work.Space4.0 - Requirements Specification Report |
| 3 | Source code baseline | Current working tree | DWS.01 React / Vite prototype source |

API contracts, endpoint definitions, payload schemas, and backend data models are specified in the corresponding system LLAD. This document specifies the DWS.01 IAM concern at the boundary defined in Section 3 and does not reproduce upstream service internals. Where a contract dependency is currently unresolved, it is tracked as an open item in the governance sections with a named owner and resolution gate that must be satisfied before the dependent feature enters implementation.

# 2. Platform Context

DWS.01 uses a three-tier platform model with a client workspace, an application and integration layer, and a governed data and intelligence layer. IAM cuts across all tiers because authenticated identity, role context, permission scope, session controls, and audit evidence must be preserved from browser entry through application services and data persistence. This section places IAM in that platform context and identifies the platform systems and user communities subject to the concern.

## 2.1 Platform Architecture Model

The platform architecture model separates interaction, orchestration, and system-of-record responsibilities so that access control is not left to a single user interface component. Authenticated users enter through the client tier, application services validate and authorise requests, and the data layer stores canonical users, roles, permissions, records, and audit evidence. All authenticated interactions in this model are governed by the identity and access management framework defined in this document.

| # | Layer | IAM responsibility |
|---|---|---|
| 1 | Client Tier | Renders login, protected routes, role-aware navigation, active role context, restricted-page handling, and user identity display without owning final authorisation decisions. |
| 2 | Application and Integration Layer | Validates identity claims, resolves roles and permissions, enforces route and action authorisation, records access decisions, and mediates Microsoft ecosystem integrations. |
| 3 | Data and Intelligence Layer | Stores canonical identity-related records, applies permission-aware data access, supports RLS and database role controls, and preserves immutable audit evidence. |
| 4 | Platform Foundation | Provides Microsoft Entra ID integration, session policy, access review, exception management, audit controls, and configuration governance. |

## 2.2 Solution Landscape

The solution landscape positions DWS.01 as the governed work-control authority while Microsoft 365 services remain companion channels. IAM must authenticate the user before workspace access, prevent companion systems from becoming access-control authorities for DWS.01 records, and ensure downstream services receive only validated identity and permission context.

### 2.2.1 The Hub

DWS.01 is the hub for internal execution records, approvals, requests, evidence links, workflow state, SLA state, audit events, and reporting truth. IAM protects the hub by requiring authenticated entry, role-based navigation, permission-aware data retrieval, and audit evidence for access-sensitive actions.

| # | Hub component | IAM obligation |
|---|---|---|
| 1 | Workspace Experience | Requires successful authentication before protected workspace routes render. |
| 2 | API and Access Boundary | Validates identity, session, role, unit, team, and permission claims before serving commands or queries. |
| 3 | Canonical Data and Audit | Enforces record, dashboard, and action visibility using application and data-layer controls. |

### 2.2.2 Application Spokes

Application spokes are the user-facing and domain-service capabilities that consume IAM context. Each spoke must accept a resolved identity context rather than deriving identity from local UI state or untrusted client input.

| # | Application spoke | Access-control dependency |
|---|---|---|
| 1 | Stage 0 Workspace Entry | Uses identity and role context to route users to orientation, next steps, and quick resume. |
| 2 | Task and Request Services | Requires requester, owner, contributor, approver, and fulfilment-scope permissions before records are shown or changed. |
| 3 | Governance and Administration | Requires elevated roles for roles, permissions, workflows, taxonomy, integrations, audit settings, and platform change controls. |
| 4 | Analytics and Executive Visibility | Requires dashboard, unit, team, record, and performance-data permissions before metrics are visible. |

### 2.2.3 Platform Service Spokes

Platform service spokes provide identity, data, evidence, session, and integration capabilities. IAM defines how DWS.01 consumes those services without moving work-control authority away from the platform.

| # | Platform service spoke | IAM relationship |
|---|---|---|
| 1 | Microsoft Entra ID | Provides authenticated identity, OIDC / OAuth2 flows, and claim material for DWS.01 access decisions. |
| 2 | Supabase PostgreSQL | Stores canonical records and supports RLS, service roles, audit records, and permission-aware data access. |
| 3 | Redis State Store | Supports target cache or session-state patterns where server-side session state is required. |
| 4 | Microsoft 365 | Provides collaboration and evidence context through governed integration boundaries, not primary work-control authority. |

## 2.3 User Communities

The following user communities are subject to the access controls and identity policies defined in this document. IAM governs how each community enters the workspace, what role context is resolved, and which surfaces, records, dashboards, and actions become available.

| # | User community | IAM treatment |
|---|---|---|
| 1 | Associates | Authenticated internal users with personal workspace, assigned work, requests, knowledge, and personal performance visibility. |
| 2 | Scrum Masters and Team / Squad Leads | Execution leads with team-level task, blocker, workflow, approval, and performance visibility according to assigned team scope. |
| 3 | Unit Leads and CEO | Leadership users with unit, enterprise, governance, SLA, performance, and outcome visibility controlled by role and dashboard permissions. |
| 4 | HRA and Support | Fulfilment and people-workflow users with request, queue, onboarding, policy, support, and closure responsibilities. |
| 5 | Admins and Platform Administrators | Control users with governed access to role, permission, workflow, SLA, taxonomy, integration, AI, audit, and platform configuration settings. |

# 3. Concern Architecture Overview

This section establishes the mandate, governing boundaries, and design principles for the Identity and Access Management cross-cutting concern, and defines its relationship to companion cross-cutting architecture documents. IAM is a foundation control because every sensitive route, record, dashboard, workflow action, configuration change, and audit-sensitive operation depends on a trustworthy user identity and permission context.

## 3.1 Concern Mandate

The IAM concern mandates how DWS.01 authenticates internal users, resolves role and permission context, controls route and action access, manages session state, and records access-related evidence. The current client prototype demonstrates the desired user journey with Microsoft-branded sign-in simulation, session-scoped local auth state, protected routes, active workspace role context, persona-scoped route checks, and permission-aware navigation. The target architecture replaces prototype-local trust with Microsoft Entra ID authentication, application-tier access enforcement, canonical role and permission records, Supabase-backed audit evidence, and governed session controls.

Without a cross-cutting IAM design, role-based access could fragment across page components, persona switches, local storage, navigation registries, API handlers, and data-layer policies. That would weaken least privilege, auditability, sensitive performance visibility, and governance review readiness.

## 3.2 Governing Boundaries

The following systems and repositories are within the governance scope of this document. IAM governs the access-control obligations that each system must satisfy before it can be promoted into production use.

| # | System | Type | Concern applicability |
|---|---|---|---|
| 1 | DWS.01 Client Prototype | React / Vite application | Login simulation, protected routes, role context, persona routing, permission-aware navigation, and restricted-view rendering. |
| 2 | DWS.01 Application API | Target Express / BFF services | Identity validation, request authorisation, action permissions, service-to-service trust, and audit event emission. |
| 3 | DWS.01 Data Layer | Target Supabase PostgreSQL | User, role, permission, unit, team, session, audit, and record-scope enforcement. |
| 4 | Microsoft Entra ID | External identity provider | Internal DQ credential authentication, OAuth2 / OIDC token issuance, and group or claim source for role mapping. |
| 5 | Microsoft 365 | Companion services | Evidence and collaboration context using controlled integration permissions. |

No DWS.01 production user group is excluded from this IAM concern. Public customer identity, external partner identity, full HRMS identity lifecycle, and enterprise-wide Microsoft tenant administration remain outside this document and are governed by DQ corporate identity and technology policies.

This document is the authoritative source for DWS.01 authentication, role mapping, permission model, session handling, access enforcement, and access-governance decisions until superseded by an approved IAM LLAD revision.

## 3.3 Relationship to Other Cross-Cutting Documents

IAM depends on data architecture, security architecture, deployment architecture, and observability architecture for controls that are adjacent to identity but not wholly owned by it. Those documents consume IAM decisions because they must apply the resolved user, role, permission, and session context consistently across records, environments, logs, metrics, traces, and integrations.

| # | This document | Depends on | What it needs | Why |
|---|---|---|---|---|
| 1 | IAM LLAD | Data architecture | Canonical user, role, permission, unit, team, audit, and retention model | IAM decisions require persistent records and data-layer enforcement. |
| 2 | IAM LLAD | Security architecture | Credential, token, secret, encryption, threat, and hardening controls | Authentication and authorisation must align with security controls. |
| 3 | IAM LLAD | Deployment architecture | Environment, callback URL, secret storage, Redis, and hosting boundaries | Identity flows and session controls require environment-specific configuration. |
| 4 | IAM LLAD | Observability architecture | Access event, exception, audit, and monitoring event patterns | IAM must produce evidence for review readiness and operational monitoring. |

The following companion architecture documents consume the IAM decisions defined here.

| # | Document | What it takes from this document |
|---|---|---|
| 1 | Data architecture LLAD | Role, permission, user, audit, and RLS obligations for the data model. |
| 2 | Security architecture LLAD | Authentication, authorisation, session, exception, and access-review control requirements. |
| 3 | Interoperability LLAD | Bearer, session, service-auth, and integration-auth expectations for API and connector routes. |
| 4 | Deployment architecture LLAD | Entra app registration, environment variables, redirect URIs, Redis settings, and secret configuration obligations. |

## 3.4 Design Principles

The IAM design principles are derived from the HLAD architecture principles and RSR security, privacy, process, technology, data, experience, and NFR requirements. They are enforced constraints for all feature, API, data, integration, and administration workstreams that handle authenticated DWS.01 users or access-sensitive records.

AP-04 establishes role-based access and visibility, AP-05 establishes embedded auditability, AP-02 separates client rendering from application-owned business logic, and AP-08 requires automation to preserve permissions and human accountability. The principles below convert those baselines into IAM-specific design obligations.

| ID | Principle | Rationale | Implication | Baseline reference |
|---|---|---|---|---|
| IAM-01 | Authentication precedes workspace access. | RSR requires successful authentication before any workspace route, record, dashboard, or action is available. | All protected DWS.01 routes require authenticated session context before rendering workspace content. | RSR NFR-01; RSR 3.3.1 |
| IAM-02 | Authorisation is enforced beyond the client. | The HLAD requires the client to render UI only and keeps business rules in application services. | Client route guards improve experience, while application and data-layer checks remain the authority for sensitive actions and records. | HLAD AP-02; RSR 3.5.2 |
| IAM-03 | Roles and permissions are canonical records. | DWS.01 must avoid fragmented user, role, team, unit, and permission records. | Workspace segments, canonical DWS roles, groups, and permissions are normalised through a governed mapping model. | HLAD AP-03; RSR 3.6.1 |
| IAM-04 | Least-privilege visibility is mandatory. | Sensitive workspace, performance, governance, evidence, and audit data must be permission-controlled. | Navigation, records, dashboards, reports, actions, and search results use role, unit, team, record, and dashboard scope. | HLAD AP-04; RSR NFR-02 |
| IAM-05 | Access decisions are auditable. | Permission, performance, knowledge, workflow, approval, and configuration changes require non-deletable evidence. | Login, logout, denied access, role changes, permission exceptions, and admin configuration changes emit audit events. | HLAD AP-05; RSR NFR-03 |
| IAM-06 | Automation inherits user permissions. | AI and automation must not bypass permissions, rationale, human override, or audit logging. | Automated routing, recommendations, summaries, and risk checks execute under explicit service and user permission context. | HLAD AP-08; RSR 3.5.6 |

# 4. Fit-Gap Analysis

The fit-gap analysis maps the IAM concern against HLAD and RSR baselines and classifies the remaining architecture work required for production readiness. It distinguishes unresolved design decisions from design-complete implementation and evidence tasks so that the gap register remains a design control rather than a delivery checklist. The analysis covers baseline functional obligations, security and privacy NFRs, operability NFRs, and the open IAM decisions that must be resolved before production promotion.

## 4.1 Methodology

The assessment traces HLAD v2.0 and RSR v2.0 draft statements to the IAM concern domains in Section 5. Functional coverage is assessed against authentication-first access, role-based routing, permission-aware navigation, application-tier access control, data-layer permission enforcement, auditability, and governance of role and permission changes. NFR coverage is assessed against security, privacy, performance, availability, maintainability, operability, compliance, governance, scalability, and data-handling requirements.

Type 1 gaps are design decisions that remain outstanding and are listed in Section 4.4 with status Open in the LLAD Traceability Annex. Type 2 items are design-complete build or evidence tasks; they are not design gaps and are tracked in Section 6.5 as CRD/AB-XC backlog items. Type 3 items are design choices resolved in this LLAD and recorded through the ADR summary in Section 6.2 and Appendix D.

## 4.2 Baseline Traceability

The IAM traceability baseline confirms that the RSR and HLAD require authenticated workspace entry, permission-aware navigation, application-owned access control, governed data access, and immutable audit evidence. Conformant items are mapped to Section 5 domains, while open design decisions are summarised separately in Section 4.4.

| # | Status | Count | Notes |
|---|---|---|---|
| 1 | Specification conformant | 7 | IAM domains in Section 5 specify the target design obligations for the baseline requirements. |
| 2 | Gap | 3 | Claim mapping, session ownership, and service-auth model require architecture decisions. |
| 3 | Not applicable | 1 | Public customer identity is outside the internal DQ user boundary. |
| Total |  | 11 |  |

The traceability rows below list only gaps or non-applicable items; conformant requirements are covered by the summary count and Section 5 design.

| Requirement ref | Baseline statement | Concern domain | Status | Note |
|---|---|---|---|---|
| HLAD 5.2 | Claim mapping and group source TBC. | 5.2 Role and Permission Model | Gap | The source for role, unit, team, and permission claims is unresolved. |
| HLAD 5.2 | Bearer or session model TBC. | 5.4 Session Token and Claim Handling | Gap | The production session authority must be selected before API build. |
| HLAD 5.4 | Service auth TBC. | 5.3 Access Enforcement and Route Guarding | Gap | The internal service-to-service trust model must be selected. |
| RSR 4.1 | Public customer-facing experiences excluded. | 5.1 Identity and Session Management | Not applicable | IAM covers internal DQ users and associates only. |

## 4.3 NFR Coverage

The IAM NFR scope covers authenticated access, role-based authorisation, immutable auditability, AI data guardrails, operational monitoring, change governance, review readiness, and approved data handling.

| # | Status | Count | Notes |
|---|---|---|---|
| 1 | Specification conformant | 9 | Section 5 specifies controls for protected routes, permissions, sessions, audit, exceptions, access reviews, and automation inheritance. |
| 2 | Gap | 2 | Data-residency and session-state implementation details require production architecture decisions. |
| 3 | Not applicable | 0 | All identified IAM NFRs apply to DWS.01. |
| Total |  | 11 |  |

The NFR gap rows below identify the outstanding decisions that affect conformance gates.

| NFR ID | Requirement | Mapped domain | Status | Gate |
|---|---|---|---|---|
| NFR-01 | Require successful authentication before any workspace access. | 5.1 Identity and Session Management | Specification conformant | UAT security test gate |
| NFR-02 | Enforce role, unit, team, record, and dashboard permissions. | 5.2 Role and Permission Model | Specification conformant | UAT permission matrix gate |
| NFR-03 | Record non-deletable audit events. | 5.5 Audit Exceptions and Access Review | Specification conformant | UAT audit evidence gate |
| NFR-08 | Route requests and approvals to the correct owner. | 5.3 Access Enforcement and Route Guarding | Specification conformant | UAT workflow routing gate |
| NFR-10 | Support growth in users, roles, units, and teams. | 5.2 Role and Permission Model | Specification conformant | Build data-model review gate |
| NFR-14 | Expose permission exceptions to operators. | 5.5 Audit Exceptions and Access Review | Specification conformant | UAT operations gate |
| NFR-16 | Apply hosting, access, retention, and transfer policies. | 5.4 Session Token and Claim Handling | Gap - design decision outstanding (DWS01-IAM-G-004) | Deployment architecture sign-off |
| NFR-17 | Provide permission histories for review. | 5.5 Audit Exceptions and Access Review | Specification conformant | UAT access-review gate |

## 4.4 Design Gaps

Design gaps identified during the fit-gap assessment are recorded in full in the LLAD Traceability Annex (`workspace/llad-annex/annex-gap-register.md`). The table below summarises gaps relevant to this document.

| Gap ID | Description | Priority | Owner | Resolution gate |
|---|---|---|---|---|
| DWS01-IAM-G-001 | Decide whether Entra groups, app roles, or platform records are the authoritative source for DWS.01 role, unit, team, and permission claims. | High | Technical Lead | Before Build API access-boundary implementation |
| DWS01-IAM-G-002 | Decide whether the production application uses bearer-only validation, server-managed sessions, or a hybrid model for browser-to-BFF access. | High | Technical Lead | Before Build authentication middleware implementation |
| DWS01-IAM-G-003 | Decide the internal service-auth model for BFF, domain services, audit services, automation jobs, and integration adapters. | Medium | Solution Architect | Before integration-service design sign-off |
| DWS01-IAM-G-004 | Decide the production data-residency and session-state placement policy for identity, session, audit, and access records. | Medium | Governance Lead | Before deployment architecture sign-off |

# 5. Concern Domains

The IAM concern domains define the implementable rules for authenticated access across DWS.01. Each domain states the scope boundary, target design, per-system application, constraints, decisions, and open items required to govern the client prototype and future production services.

## 5.1 Identity and Session Management

Identity and Session Management governs how DWS.01 establishes authenticated user identity, starts a workspace session, and ends user access. The platform obligation is to replace prototype-local session simulation with Entra-backed authentication while preserving the validated sign-in journey and protected workspace entry model.

### 5.1.1 Domain Scope

This concern domain governs user sign-in, sign-out, authenticated route entry, session bootstrap, identity display, and first landing after authentication. It does not govern full Microsoft tenant administration, HR master data lifecycle, public customer identity, or low-level token cryptography, which belong to corporate identity and security policies.

| # | Aspect |
|---|---|
| 1 | Microsoft Entra ID authentication for internal DQ users. |
| 2 | Workspace route protection before DWS.01 pages render. |
| 3 | Session bootstrap for identity, role, unit, team, and permission context. |
| 4 | Sign-out and local session cleanup. |
| 5 | Stage 0 and home routing after successful authentication. |

The excluded aspects are governed outside the IAM LLAD boundary and remain referenced only as dependencies.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | Microsoft tenant administration and conditional access policy | DQ corporate identity policy |
| 2 | Public customer identity | Out of scope for DWS.01 internal platform |
| 3 | HR source-of-record lifecycle | HRMS / people operations policy |
| 4 | Token cryptographic hardening | Security architecture LLAD |

### 5.1.2 Design

The target design uses Microsoft Entra ID as the production identity provider and OIDC / OAuth2 as the authentication protocol. The current prototype sign-in flow is retained as a user-experience reference only, because production trust must come from Entra-issued identity and application-side validation rather than client-local session storage.

| # | Flow | Trigger | Steps | Session result |
|---|---|---|---|---|
| 1 | Workspace sign-in | User selects Microsoft sign-in | Browser starts Entra authentication; Entra validates credentials; callback reaches the application; BFF validates token and resolves access context | Authenticated DWS.01 session context is available to the workspace. |
| 2 | Protected route entry | User opens a protected route | Client checks session presence; BFF validates session or token; route renders only after authenticated context is resolved | User enters the requested route or is redirected to login. |
| 3 | First landing | User completes sign-in | Application resolves role context; Stage 0 or home route is selected; permitted next-step destinations render | User receives role-aware entry context. |
| 4 | Sign-out | User selects logout | Client calls sign-out endpoint; server clears session state; client clears local UI state; browser returns to login | Workspace access ends and protected routes redirect. |

The prototype implementation uses an AuthProvider, Microsoft-styled login page, protected route component, session-scoped browser storage, and a mock internal user. The production design treats these as client shell responsibilities and moves identity validation, session authority, and claim trust to the application boundary.

| # | Design element | Target rule | Enforcement point | Evidence |
|---|---|---|---|---|
| 1 | Identity provider | Microsoft Entra ID is the confirmed production identity provider. | BFF authentication middleware | Login success and failure audit events |
| 2 | Login method | DQ-issued Microsoft credentials are required for internal users. | Entra authentication flow | Entra sign-in logs and DWS.01 access events |
| 3 | Workspace protection | All workspace routes require authenticated context. | Client route guard and BFF access guard | Protected route test results |
| 4 | Local session data | Client-local state is a rendering convenience, not a trust source. | BFF request validation | Security review evidence |

### 5.1.3 Per-System Application

Identity and session rules apply uniformly across the client, application boundary, data layer, and foundation services. The client controls user experience, while the application boundary and identity provider establish production trust.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | DWS.01 Client Prototype | Provides login experience, protected routes, sign-out action, and local UI session context. | AuthProvider and ProtectedRoute | Specification conformant - prototype validation gate |
| 2 | DWS.01 Application API | Validates Entra identity, establishes access context, and mediates protected API calls. | Authentication middleware | Gap - design decision outstanding (DWS01-IAM-G-002) |
| 3 | Microsoft Entra ID | Authenticates DQ users and issues identity material for DWS.01. | Entra app registration | Specification conformant - deployment security gate |
| 4 | Redis State Store | Supports target server-side session or cache state when selected. | Session store configuration | Gap - design decision outstanding (DWS01-IAM-G-002) |
| 5 | Supabase PostgreSQL | Stores identity-related platform records and audit evidence. | User and audit records | Specification conformant - data-model review gate |

### 5.1.4 Constraints and Obligations

The constraints in this domain are non-negotiable because unauthenticated access would expose sensitive workspace, governance, performance, and evidence data.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | Every user must authenticate before workspace access. | RSR NFR-01 | Client routes and API routes | Access to protected platform data is invalid. |
| 2 | DQ-issued Microsoft credentials are required for staff access. | RSR identity dependency | Internal DQ users | Identity trust cannot be established. |
| 3 | Client-local session state cannot be treated as an authority. | HLAD AP-02 | Client and BFF | Users could bypass application access control. |
| 4 | Sign-in and sign-out outcomes must be auditable. | RSR NFR-03 | Foundation services | Governance review lacks access evidence. |

### 5.1.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | DWS.01 uses Microsoft Entra ID as the production identity provider for internal user authentication. | ADR-DWS01-IAM-001 | Accepted |
| 2 | Client-local authentication state remains a prototype and rendering concern, not a production trust boundary. | ADR-DWS01-IAM-002 | Accepted |

The items below record unresolved design and implementation questions arising from the Identity and Session Management domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Select the production browser-to-BFF session authority and token validation model. | DWS01-IAM-G-002 (Staging blocker) | Technical Lead | Before Build authentication middleware implementation |
| 2 | Register Entra application settings, callback URLs, and logout URLs for each environment. |  | DevOps Engineer | Before UAT environment readiness |

## 5.2 Role and Permission Model

Role and Permission Model governs how workspace segments, canonical DWS roles, route permissions, action permissions, and record scopes are represented. The platform obligation is to normalise the prototype's role vocabularies into a single governed model that supports least privilege, team and unit scope, administration, and future data-layer enforcement.

### 5.2.1 Domain Scope

This concern domain governs role taxonomy, segment normalisation, permission keys, route visibility, dashboard visibility, record scope, and administration of role assignments. It does not govern HR employment records, organisation master-data ownership, or detailed database schema design, which are governed by people operations and data architecture.

| # | Aspect |
|---|---|
| 1 | Workspace segment model for Associates, Scrum Masters, Team / Squad Leads, Unit Leads, HRA, Admins, Support, and CEO users. |
| 2 | Canonical DWS role model for Associate, Lead, ServiceOwner, GovernanceLead, Leadership, and PlatformAdmin. |
| 3 | Permission catalogue for workspace, task, workflow, tracker, performance, governance, knowledge, service, people, reports, and administration areas. |
| 4 | Role and permission mapping between Entra claims, platform records, navigation, APIs, and data policies. |

The exclusions below remain outside this domain because they are not IAM design authorities.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | HR employee lifecycle and employment status | HRMS / people operations policy |
| 2 | Physical organisation hierarchy ownership | Data architecture LLAD |
| 3 | Database table design for users and roles | Data architecture LLAD |

### 5.2.2 Design

The target design treats roles and permissions as canonical platform records resolved at session bootstrap and enforced by application and data services. The client may keep role-aware navigation and active persona controls for prototype validation, but final permission decisions are derived from governed records and Entra-backed identity context.

| # | Role layer | Purpose | Examples | Authority |
|---|---|---|---|---|
| 1 | Workspace segment | Persona-specific experience and validation journeys | Associate, HRA, Admin, CEO | Product configuration |
| 2 | Canonical DWS role | Stable access category for navigation and platform scope | Associate, Lead, GovernanceLead | IAM role mapping |
| 3 | Permission key | Action, route, dashboard, and record-access decision | admin:full, tasks:review | Platform permission catalogue |
| 4 | Record scope | Unit, team, owner, requester, approver, service, or dashboard boundary | Team task view, executive report | Application and data policy |

Role normalisation is required because the current source code contains both the eight-segment workspace taxonomy and the six-role DWS taxonomy. The production design maps Entra identity and group or app-role material into canonical platform role assignments, then derives workspace segment presentation and permission keys from that canonical assignment.

| # | Mapping rule | Source | Target | Enforcement |
|---|---|---|---|---|
| 1 | Admin maps to PlatformAdmin. | Workspace segment | Canonical DWS role | Session bootstrap |
| 2 | Scrum Master, Team / Squad Lead, and Unit Lead map to Lead. | Workspace segment | Canonical DWS role | Session bootstrap |
| 3 | HRA and Support map to GovernanceLead unless service ownership is separately assigned. | Workspace segment | Canonical DWS role | Session bootstrap |
| 4 | CEO maps to Leadership. | Workspace segment | Canonical DWS role | Session bootstrap |
| 5 | ServiceOwner is assigned through service ownership records. | Platform record | Canonical DWS role | Application access boundary |

### 5.2.3 Per-System Application

The role and permission model applies to route configuration, navigation configuration, API authorisation, data policies, and administration workflows. Each system consumes the same resolved access context rather than maintaining independent role truth.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | DWS.01 Client Prototype | Provides active workspace role, persona access checks, role-aware navigation, and permission-aware route metadata. | Role and permission configuration | Specification conformant - prototype validation gate |
| 2 | DWS.01 Application API | Resolves canonical role, permission, unit, team, and service ownership scope before action execution. | Authorisation middleware | Gap - design decision outstanding (DWS01-IAM-G-001) |
| 3 | Supabase PostgreSQL | Stores and enforces user, role, unit, team, permission, and record-scope policies. | RLS and canonical records | Gap - design decision outstanding (DWS01-IAM-G-001) |
| 4 | Administration Console | Governs role assignment, permission exception, and access-review workflows. | User and role management views | Specification conformant - admin governance gate |
| 5 | Microsoft Entra ID | Supplies identity and group or role source material. | Entra groups or app roles | Gap - design decision outstanding (DWS01-IAM-G-001) |

### 5.2.4 Constraints and Obligations

The role and permission constraints are mandatory because DWS.01 handles personal work, performance data, governance records, audit records, and administration controls.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | Users must see only authorised menu groups, dashboards, records, actions, reports, and routes. | RSR 3.7.3 | Client, API, data layer | Sensitive records or actions can be exposed. |
| 2 | Role, unit, team, record, and dashboard permissions must be enforced before sensitive data displays. | RSR NFR-02 | API and data layer | Least privilege is not satisfied. |
| 3 | Changes to roles and permissions must pass controlled governance. | RSR 3.3.7; NFR-13 | Administration Console | Configuration change cannot be trusted. |
| 4 | Role and permission records must not fragment across modules. | HLAD AP-03 | All DWS.01 systems | Reporting and audit truth becomes inconsistent. |

### 5.2.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | DWS.01 normalises workspace segments into canonical DWS roles before permissions are evaluated. | ADR-DWS01-IAM-003 | Accepted |
| 2 | Permission keys remain explicit platform configuration rather than implicit page ownership. | ADR-DWS01-IAM-004 | Accepted |

The items below record unresolved design and implementation questions arising from the Role and Permission Model domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Select the authoritative source for role, unit, team, and permission claims. | DWS01-IAM-G-001 (Staging blocker) | Technical Lead | Before Build API access-boundary implementation |
| 2 | Create the production permission matrix for routes, actions, dashboards, records, and administration controls. |  | Product Owner | Before UAT permission matrix gate |

## 5.3 Access Enforcement and Route Guarding

Access Enforcement and Route Guarding governs where DWS.01 denies access, redirects users, renders restricted views, and blocks unauthorised actions. The platform obligation is to apply defence in depth so that client route guards improve user experience while application and data controls remain authoritative.

### 5.3.1 Domain Scope

This concern domain governs route protection, route-to-permission mapping, denied-access handling, action enforcement, service-auth expectations, and permission-aware search and dashboard access. It does not govern detailed page layout, feature copy, or service-level API contract payloads.

| # | Aspect |
|---|---|
| 1 | Protected route handling for workspace routes. |
| 2 | Persona-scoped and role-scoped navigation checks. |
| 3 | Permission checks for route, action, dashboard, and report access. |
| 4 | API and service access boundary enforcement. |
| 5 | Denied-access and restricted-view user experience. |

The adjacent areas below are excluded from this domain.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | Detailed API payload and endpoint catalogues | Interoperability LLAD |
| 2 | UI component styling and copy | System UI design specification |
| 3 | Database RLS implementation details | Data architecture LLAD |

### 5.3.2 Design

The target design uses layered access enforcement. The client checks authentication state and role-aware route metadata before rendering, the application boundary validates identity and permission context before executing requests, and the data layer constrains record access through policies and service roles.

| # | Enforcement layer | Rule | Denial behaviour | Evidence |
|---|---|---|---|---|
| 1 | Client route guard | Unauthenticated users are redirected to login before workspace content renders. | Login redirect with original route context | Route guard test |
| 2 | Persona route guard | Users outside persona scope receive a restricted-view page or placeholder. | Restricted page or permitted fallback | Route access test |
| 3 | Permission route guard | Users lacking required permission or segment receive an access restricted page. | AccessRestrictedPage pattern | Permission matrix test |
| 4 | API access guard | Requests without valid identity and required permission are rejected. | 401 or 403 API response | API security test |
| 5 | Data policy | Queries return only records within resolved scope. | Empty result or policy denial | RLS policy test |

The current prototype includes ProtectedRoute, persona route access, DWS route guards, navigation metadata, permission keys, and access-restricted rendering. Production implementation retains those client patterns but requires server-side authorisation and data-layer policies before sensitive records, dashboards, approvals, and administration actions are available.

### 5.3.3 Per-System Application

Access enforcement applies consistently to workspace routes, domain service routes, data reads, data writes, and administration actions. Client-only enforcement is sufficient for prototype validation, while production promotion requires authoritative checks outside the browser.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | DWS.01 Client Prototype | Protects routes, filters navigation, and renders restricted pages based on active role and permission metadata. | ProtectedRoute and DwsRouteGuard | Specification conformant - prototype validation gate |
| 2 | DWS.01 Application API | Enforces authentication, action permissions, service ownership, workflow permission, and admin controls. | Authorisation middleware | Gap - design decision outstanding (DWS01-IAM-G-003) |
| 3 | Domain Services | Execute task, request, approval, escalation, and configuration commands only after authorisation. | Domain access policies | Specification conformant - API security gate |
| 4 | Supabase PostgreSQL | Enforces record-level visibility for users, teams, units, dashboards, audit, and performance data. | RLS policies | Specification conformant - data policy gate |
| 5 | Automation Jobs | Inherit service permissions and user context where automation acts on behalf of a user. | Automation access policy | Gap - design decision outstanding (DWS01-IAM-G-003) |

### 5.3.4 Constraints and Obligations

The constraints in this domain protect least privilege and prevent route, API, search, dashboard, and automation bypass.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | The client must not own business rules or final authorisation. | HLAD AP-02 | Client and BFF | Browser manipulation can bypass controls. |
| 2 | Sensitive views must be permission-checked before display. | RSR NFR-02 | Routes, dashboards, records | Sensitive data can be exposed. |
| 3 | Search and discovery must respect permissions. | RSR 3.4.6; RSR 3.7.3 | Marketplace, knowledge, dashboards | Users can discover unauthorised records. |
| 4 | Automation must not alter governance records without authorised human confirmation. | RSR 5.5 exclusion | Automation jobs | Governance authority can be bypassed. |

### 5.3.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | DWS.01 applies layered access enforcement across client, application, and data controls. | ADR-DWS01-IAM-005 | Accepted |
| 2 | Access-denied behaviour uses explicit restricted routes rather than silent navigation hiding alone. | ADR-DWS01-IAM-006 | Accepted |

The items below record unresolved design and implementation questions arising from the Access Enforcement and Route Guarding domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Select the internal service-auth model for BFF, domain services, audit services, automation, and integration adapters. | DWS01-IAM-G-003 | Solution Architect | Before integration-service design sign-off |
| 2 | Expand route and action permission tests across all protected routes and restricted pages. |  | QA Lead | Before UAT permission matrix gate |

## 5.4 Session Token and Claim Handling

Session Token and Claim Handling governs how Entra-issued identity material, application sessions, permission claims, and local UI state are created, validated, refreshed, and cleared. The platform obligation is to prevent stale, forged, or over-privileged claims from driving workspace access.

### 5.4.1 Domain Scope

This concern domain governs ID token and access token validation, claim mapping, session TTL, refresh behaviour, browser storage rules, Redis session or cache use, and claim propagation to APIs. It does not govern low-level encryption policy, corporate key management, or Microsoft tenant-wide token policy.

| # | Aspect |
|---|---|
| 1 | OIDC / OAuth2 identity token validation. |
| 2 | Application session model and expiry rules. |
| 3 | Role, unit, team, and permission claim mapping. |
| 4 | Browser-side storage limits for UI state. |
| 5 | Redis session or cache usage where selected. |

The adjacent exclusions remain governed by security and deployment architecture.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | Cryptographic algorithm and key rotation policy | Security architecture LLAD |
| 2 | Secret storage and environment variable mechanics | Deployment architecture LLAD |
| 3 | Microsoft tenant token lifetime policy | DQ corporate identity policy |

### 5.4.2 Design

The target design treats Entra tokens and server-side validation as the trust source, while client storage carries only presentation state and non-authoritative hints. The BFF validates token signatures, issuer, audience, expiry, nonce or state, and role mapping before issuing or accepting an application session.

| # | Claim or state | Source | Use | Trust rule |
|---|---|---|---|
| 1 | Subject identifier | Microsoft Entra ID | User identity binding | Trusted only after BFF validation |
| 2 | Email and display name | Microsoft Entra ID | User display and audit attribution | Trusted only after BFF validation |
| 3 | Group or app-role claims | Microsoft Entra ID or platform records | Role mapping input | Authority pending DWS01-IAM-G-001 |
| 4 | Active workspace segment | Platform record and user selection | UI perspective and route defaults | Non-authoritative until validated by permissions |
| 5 | Session identifier | BFF or session service | API access continuity | Authority pending DWS01-IAM-G-002 |

Session storage in the browser is acceptable only for prototype validation or short-lived UI state. Production session and claim handling must keep secrets out of browser storage, apply expiry, support sign-out cleanup, and invalidate stale permission context after role or permission changes.

| # | Rule | Design requirement | Gate | Owner |
|---|---|---|---|---|
| 1 | Token validation | Validate issuer, audience, signature, expiry, and nonce or state before access. | API security gate | Technical Lead |
| 2 | Claim refresh | Refresh role and permission context after login and after governed role changes. | UAT access-review gate | Platform Administrator |
| 3 | Session expiry | Define idle and absolute expiry for browser sessions. | Deployment security gate | Security Lead |
| 4 | Data placement | Place identity, session, and access records according to approved hosting and residency policy. | Deployment sign-off | Governance Lead |

### 5.4.3 Per-System Application

Claim and session handling crosses identity provider, browser client, application boundary, session store, and data layer. Each system consumes the minimum identity material required for its role.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | Microsoft Entra ID | Issues identity tokens and source claim material for authenticated users. | OIDC app registration | Specification conformant - identity configuration gate |
| 2 | DWS.01 Client Prototype | Stores prototype session state and active role presentation state for UI rendering. | Browser session and role context | Specification conformant - prototype validation gate |
| 3 | DWS.01 Application API | Validates tokens, establishes sessions, maps claims, and authorises API calls. | Token validation middleware | Gap - design decision outstanding (DWS01-IAM-G-002) |
| 4 | Redis State Store | Maintains target session or cache state where the approved model requires it. | Session state keys | Gap - design decision outstanding (DWS01-IAM-G-004) |
| 5 | Supabase PostgreSQL | Stores user, role, permission, access-review, and audit records. | Canonical IAM records | Gap - design decision outstanding (DWS01-IAM-G-004) |

### 5.4.4 Constraints and Obligations

Session and claim constraints are mandatory because access context can become stale, over-privileged, or invalid if session policy is not explicit.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | The client must not call Supabase or Redis directly. | HLAD integration baseline | Client and data layer | Access controls can be bypassed. |
| 2 | Session state must not depend on application instance memory. | HLAD technology baseline | BFF and hosting | Sessions can fail across scale or restart events. |
| 3 | Role and permission changes must invalidate or refresh affected access context. | RSR change governance | BFF and client | Removed permissions can remain active. |
| 4 | Hosting, retention, and data-residency controls must apply to identity and access records. | RSR NFR-16 | Data and session stores | Compliance evidence is incomplete. |

### 5.4.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | Browser storage is not a production trust boundary for DWS.01 IAM. | ADR-DWS01-IAM-002 | Accepted |
| 2 | Server-side validation is required before claims drive protected API or data access. | ADR-DWS01-IAM-005 | Accepted |

The items below record unresolved design and implementation questions arising from the Session Token and Claim Handling domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Decide the bearer-only, server-managed, or hybrid browser-to-BFF access model. | DWS01-IAM-G-002 (Staging blocker) | Technical Lead | Before Build authentication middleware implementation |
| 2 | Decide identity, session, audit, and access-record data placement under hosting and residency policy. | DWS01-IAM-G-004 | Governance Lead | Before deployment architecture sign-off |

## 5.5 Audit Exceptions and Access Review

Audit Exceptions and Access Review governs how IAM actions, denied access, permission changes, exceptions, and periodic access reviews are evidenced. The platform obligation is to make identity and access decisions reviewable without allowing normal users to delete or rewrite audit evidence.

### 5.5.1 Domain Scope

This concern domain governs login audit, logout audit, denied access, permission exceptions, role changes, access reviews, administration changes, and access history. It does not govern full observability telemetry, infrastructure logs, or non-IAM business event design.

| # | Aspect |
|---|---|
| 1 | Authentication and session lifecycle events. |
| 2 | Denied access and restricted-route events. |
| 3 | Role, permission, and access-scope changes. |
| 4 | Permission exception requests and approvals. |
| 5 | Periodic access review evidence and permission history. |

The adjacent exclusions are governed by other architecture documents.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | Full telemetry metrics and tracing model | Observability architecture LLAD |
| 2 | Infrastructure audit logs | Deployment architecture LLAD |
| 3 | Business workflow event taxonomy | Data architecture LLAD |

### 5.5.2 Design

The target design emits audit events for access-sensitive outcomes and stores them as non-deletable records for authorised review. Normal users cannot delete audit events, and administration actions that alter roles, permissions, workflows, integrations, or AI settings require controlled governance and evidence.

| # | Event | Trigger | Required fields | Review use |
|---|---|---|---|---|
| 1 | Login success or failure | User authentication attempt | User, time, result, provider, reason code | Security and access history |
| 2 | Logout | User session ends | User, time, session id, route context | Session review |
| 3 | Access denied | Route, API, record, or dashboard rejection | User, permission, resource, decision | Permission exception review |
| 4 | Role or permission change | Admin or governed workflow updates access | Subject, old value, new value, approver | Access review and audit |
| 5 | Permission exception | Temporary or exceptional access is requested | Requester, scope, approver, expiry | Governance review |

Access review is a scheduled governance process that compares active users, assigned roles, unit and team scopes, service ownership, permission exceptions, and access history. Reviews produce evidence packs for authorised reviewers and feed remediation actions into administration workflows.

| # | Review control | Frequency | Owner | Evidence |
|---|---|---|---|---|
| 1 | Role assignment review | Monthly or release gate | Platform Administrator | Role assignment report |
| 2 | Permission exception review | Weekly for active exceptions | Governance Lead | Exception expiry and approval report |
| 3 | Admin action review | Release gate | Governance Lead | Configuration change audit |
| 4 | Access-denied pattern review | Monthly | Support Operations | Denied access and support trend report |

### 5.5.3 Per-System Application

Audit and access review obligations apply wherever identity, role, permission, route access, data access, or administration changes occur. Evidence must remain available to authorised reviewers without exposing sensitive logs to ordinary users.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | DWS.01 Client Prototype | Shows audit and access-related administration surfaces for validation of review journeys. | Audit, users, roles, exceptions pages | Specification conformant - prototype validation gate |
| 2 | DWS.01 Application API | Emits audit events for access decisions, role changes, exceptions, and admin actions. | Audit event service | Specification conformant - API audit gate |
| 3 | Supabase PostgreSQL | Stores non-deletable audit events and access-review records. | Audit records and policies | Specification conformant - data policy gate |
| 4 | Administration Console | Manages role assignments, permission exceptions, and access review actions. | User and role management | Specification conformant - admin governance gate |
| 5 | Governance Dashboards | Presents authorised access, exception, and control-review evidence. | Review-ready dashboards | Specification conformant - UAT review gate |

### 5.5.4 Constraints and Obligations

These constraints are mandatory because DWS.01 must prove who accessed, changed, denied, approved, or governed sensitive workspace permissions and records.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | Normal users must not delete audit records. | RSR NFR-03 | Audit store | Review evidence can be lost. |
| 2 | Permission and configuration changes require controlled governance. | RSR NFR-13 | Administration Console | Access changes lack approval evidence. |
| 3 | Permission histories must be available for authorised review. | RSR NFR-17 | Audit and reports | Review readiness cannot be demonstrated. |
| 4 | Operational health must expose permission exceptions to authorised operators. | RSR NFR-14 | Operations dashboards | Access issues cannot be triaged. |

### 5.5.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | IAM access decisions and permission changes produce non-deletable audit evidence. | ADR-DWS01-IAM-007 | Accepted |
| 2 | Permission exceptions are governed workflow records with expiry and review ownership. | ADR-DWS01-IAM-008 | Accepted |

The items below record unresolved design and implementation questions arising from the Audit Exceptions and Access Review domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Define the access-review report pack and evidence fields for monthly governance review. |  | Governance Lead | Before UAT access-review gate |
| 2 | Align IAM audit events with the platform observability and audit event taxonomy. |  | Technical Lead | Before Build audit-service implementation |

# 6. Architecture Governance

Architecture governance defines how the IAM design is controlled after this LLAD is approved. The governance model keeps principles, ADRs, NFR coverage, open items, and design-complete backlog items visible so that authentication and access control do not drift as features, APIs, data policies, and integrations expand.

## 6.1 Architecture Principles Conformance

The IAM design conforms to the governing HLAD principles by keeping DWS.01 as the work-control authority, separating client rendering from application access control, normalising role and permission records, and requiring audit evidence for sensitive actions. Any future change that weakens authentication-first access, role-based visibility, application-side authorisation, or auditability requires architecture review.

| # | Principle | Conformance position |
|---|---|---|
| 1 | AP-02 Three-Tier Responsibility Separation | Client route guards support user experience, while application and data controls remain authoritative. |
| 2 | AP-03 Canonical Object Model | Role, permission, unit, team, user, and audit records are treated as canonical platform records. |
| 3 | AP-04 Role-Based Access and Visibility | Navigation, dashboards, records, actions, reports, and search use role, unit, team, and permission scope. |
| 4 | AP-05 Embedded Auditability | Access decisions, role changes, permission exceptions, and configuration changes produce audit evidence. |
| 5 | AP-08 Automation with Human Accountability | Automation inherits permissions and cannot bypass human governance for controlled changes. |

## 6.2 Architecture Decision Records

Architecture decisions governing this system are recorded in full in the LLAD Traceability Annex. The following decisions are relevant to this document.

| ID | Title | Status | Decision summary |
|---|---|---|---|
| ADR-DWS01-IAM-001 | Microsoft Entra ID for authentication | Accepted | DWS.01 uses Microsoft Entra ID as the production identity provider for internal users. |
| ADR-DWS01-IAM-002 | Browser storage is non-authoritative | Accepted | Client-local auth state supports rendering only and does not establish production trust. |
| ADR-DWS01-IAM-003 | Role taxonomy normalisation | Accepted | Workspace segments are normalised into canonical DWS roles before permissions are evaluated. |
| ADR-DWS01-IAM-004 | Explicit permission catalogue | Accepted | Permission keys are governed platform configuration rather than implicit page ownership. |
| ADR-DWS01-IAM-005 | Layered access enforcement | Accepted | DWS.01 enforces access across client, application, and data controls. |
| ADR-DWS01-IAM-006 | Explicit access-denied handling | Accepted | Restricted access is rendered explicitly rather than hidden only through navigation filtering. |
| ADR-DWS01-IAM-007 | IAM audit evidence | Accepted | Login, access decisions, permission changes, and exceptions produce non-deletable audit records. |
| ADR-DWS01-IAM-008 | Governed permission exceptions | Accepted | Permission exceptions are workflow records with approval, expiry, owner, and review evidence. |

## 6.3 Non-Functional Requirements Summary

The IAM NFR summary consolidates the security, privacy, governance, operability, and growth requirements that must be tested during Build and UAT. The measurable targets remain owned by the RSR baseline and are realised through the controls specified in Section 5.

| # | NFR | IAM control |
|---|---|---|
| 1 | NFR-01 Authenticated Access | Protected routes and BFF authentication guards are required before workspace access. |
| 2 | NFR-02 Role-Based Authorisation | Role, unit, team, record, dashboard, and action permissions are enforced before sensitive visibility. |
| 3 | NFR-03 Immutable Auditability | Access and permission events produce non-deletable audit evidence. |
| 4 | NFR-10 Role and Unit Growth | Canonical role, permission, unit, and team records support user growth without rebuilding navigation. |
| 5 | NFR-13 Change Governance | Role, permission, workflow, integration, and AI control changes require controlled review. |
| 6 | NFR-16 Data Handling Compliance | Identity, access, audit, and session records follow approved hosting, retention, and residency controls. |
| 7 | NFR-17 Review Readiness | Permission histories, access decisions, and exception records are available to authorised reviewers. |

## 6.4 Open Items Summary

Open items are tracked by type so that unresolved architecture decisions remain separate from design-complete implementation and evidence work. Type 1 items are promoted through the design-gap register, while Type 2 items are promoted through CRD/AB-XC backlog controls.

| # | Item | Type | Resolution gate |
|---|---|---|---|
| 1 | Select authority for role, unit, team, and permission claims. | Type 1 design decision | Before Build API access-boundary implementation |
| 2 | Select bearer-only, server-managed, or hybrid browser-to-BFF session model. | Type 1 design decision | Before Build authentication middleware implementation |
| 3 | Select internal service-auth model for BFF, services, jobs, and adapters. | Type 1 design decision | Before integration-service design sign-off |
| 4 | Decide production data-residency and session-state placement policy. | Type 1 design decision | Before deployment architecture sign-off |
| 5 | Configure Entra application registrations and callback URLs. | Type 2 build/evidence | Before UAT environment readiness |
| 6 | Produce access-review report pack and evidence fields. | Type 2 build/evidence | Before UAT access-review gate |

### 6.5 Configuration Record Backlog (CRD/AB-XC)

The following items represent fully specified design decisions that require provisioning, IaC authoring, or evidence capture work to be completed. These are not open design gaps - the design is decided and documented in the referenced sections. Progress is tracked in the CRD/AB-XC companion record.

| # | Item | Design reference | Gate |
|---|---|---|---|
| 1 | Configure Microsoft Entra application registration, redirect URI, logout URI, and environment-specific app settings. | Section 5.1.2 | Before UAT environment readiness |
| 2 | Implement route and permission matrix tests for protected routes, persona guards, DWS route guards, and restricted views. | Section 5.3.2 | Before UAT permission matrix gate |
| 3 | Implement audit event emission for login, logout, access denied, role change, permission exception, and admin configuration change. | Section 5.5.2 | Before UAT audit evidence gate |
| 4 | Capture access-review report evidence for role assignments, permission exceptions, admin actions, and denied-access patterns. | Section 5.5.2 | Before UAT access-review gate |

# Appendix A - Glossary

| Term | Definition |
|---|---|
| IAM | Identity and Access Management; the cross-cutting concern governing authentication, authorisation, sessions, roles, permissions, and access evidence. |
| Microsoft Entra ID | The target identity provider for DWS.01 internal user authentication. |
| BFF | Backend for Frontend; the application access boundary that validates identity and enforces API access rules. |
| RLS | Row-Level Security; data-layer policy enforcement used to constrain record access in the target Supabase-backed model. |
| CRD/AB-XC | Configuration Record Backlog for cross-cutting design-complete implementation and evidence items. |

# Appendix B - Acronyms

| Acronym | Expansion |
|---|---|
| ADR | Architecture Decision Record |
| API | Application Programming Interface |
| BFF | Backend for Frontend |
| DQ | DigitalQatalyst |
| DWS | Digital Workspace Solution |
| IAM | Identity and Access Management |
| LLAD | Low Level Architecture Design |
| NFR | Non-Functional Requirement |
| OIDC | OpenID Connect |
| RSR | Requirements Specification Report |
| SSO | Single Sign-On |
| UAT | User Acceptance Testing |

# Appendix C - Reference Documents

| # | Document | Version | Reference |
|---|---|---|---|
| 1 | DWS.01 Work.Space4.0 - High Level Architecture Design | 2.0 | docs/architecture/hlad-v2.0-draft.md |
| 2 | DWS.01 Work.Space4.0 - Requirements Specification Report | 2.0 draft | docs/rsr-v2.0-draft.md |
| 3 | Auth Context implementation | Current source | src/context/AuthContext.tsx |
| 4 | Protected route implementation | Current source | src/components/ProtectedRoute.tsx |
| 5 | Permission catalogue | Current source | src/config/permissions.ts |
| 6 | Workspace role context | Current source | src/context/WorkspaceRoleContext.tsx |
| 7 | Persona route context | Current source | src/context/PersonaContext.tsx |
| 8 | Navigation configuration | Current source | src/config/navigation.ts |

# Appendix D - Architecture Decision Records (Full)

Architecture decisions governing this system are recorded in full in the LLAD Traceability Annex. The full entries below are included in this draft until the annex is initialised for this repository.

## ADR-DWS01-IAM-001 - Microsoft Entra ID for authentication

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The HLAD confirms Microsoft Entra ID as the target IAM provider for DWS.01. The RSR requires DQ-issued credential login before any workspace access. |
| Decision | DWS.01 uses Microsoft Entra ID as the production identity provider for internal users. |
| Rationale | Entra aligns with the Microsoft ecosystem dependency, supports OIDC / OAuth2 integration, and provides the identity foundation for internal DQ users. |
| Consequences | Production implementation requires app registration, redirect URI configuration, token validation, and claim mapping. |

## ADR-DWS01-IAM-002 - Browser storage is non-authoritative

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The prototype stores a mock user in browser session storage to validate the user journey. Production IAM requires validated identity and server-side trust. |
| Decision | Browser storage may support UI state, but it is not an authority for production authentication or authorisation. |
| Rationale | Browser state can be manipulated and must not bypass application or data-layer enforcement. |
| Consequences | Production APIs must validate identity and permissions independently of client state. |

## ADR-DWS01-IAM-003 - Role taxonomy normalisation

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The prototype contains eight workspace segments and a six-role canonical DWS role model. The RSR requires role, unit, team, and permission context. |
| Decision | Workspace segments are normalised into canonical DWS roles before permissions are evaluated. |
| Rationale | A canonical role layer prevents access rules from fragmenting across persona, navigation, data, and API implementations. |
| Consequences | A governed role-mapping table is required for production claim resolution and access review. |

## ADR-DWS01-IAM-004 - Explicit permission catalogue

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The prototype defines explicit permission keys for workspace, tasks, workflows, trackers, performance, governance, knowledge, services, people, reports, and administration. |
| Decision | DWS.01 uses an explicit platform permission catalogue rather than deriving permissions only from page ownership. |
| Rationale | Explicit permissions support least privilege, testing, access review, and data-layer alignment. |
| Consequences | Product and governance owners must maintain the permission matrix through controlled change. |

## ADR-DWS01-IAM-005 - Layered access enforcement

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The HLAD requires client rendering, application-owned business logic, and governed data access. The prototype already includes client route and permission guards. |
| Decision | DWS.01 enforces access across client, application, and data controls. |
| Rationale | Client checks support user experience, but sensitive access must be enforced by trusted service and data boundaries. |
| Consequences | API middleware, data policies, and route tests are required before production promotion. |

## ADR-DWS01-IAM-006 - Explicit access-denied handling

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The prototype contains restricted and placeholder experiences for disallowed persona or route access. |
| Decision | DWS.01 renders explicit denied-access or restricted-view outcomes rather than relying only on hidden navigation. |
| Rationale | Explicit denial supports user clarity, support triage, permission exception handling, and audit evidence. |
| Consequences | Denied-access flows must emit audit or support events where access-sensitive decisions occur. |

## ADR-DWS01-IAM-007 - IAM audit evidence

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The RSR requires non-deletable audit events for access, workflow, permission, performance, knowledge, and configuration changes. |
| Decision | IAM access decisions and permission changes produce non-deletable audit evidence. |
| Rationale | Governance review and compliance readiness depend on traceable evidence for authentication, denied access, role changes, and exceptions. |
| Consequences | An audit event service and access-review evidence model are required in the production architecture. |

## ADR-DWS01-IAM-008 - Governed permission exceptions

| Field | Value |
|---|---|
| Status | Accepted |
| Context | DWS.01 administration and governance views include permission exceptions and role management surfaces. RSR change governance requires controlled review for role and permission changes. |
| Decision | Permission exceptions are workflow records with approval, expiry, owner, and review evidence. |
| Rationale | Temporary access must remain visible, time-bound, and reviewable rather than becoming permanent unmanaged privilege. |
| Consequences | Exception workflows, expiry checks, and review reports are required before UAT access-review sign-off. |
