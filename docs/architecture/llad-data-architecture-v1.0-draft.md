---
document_id: DWS.01-LLAD-XC-DATA
title: DWS.01 Data Architecture - Cross-Cutting Architecture Design
version: 1.0
date: 2026-06-18
status: Draft
system: DWS.01 Work.Space4.0
classification: Internal DQ use only
llad_subtype: cross-cutting
cross_cutting_topic: Data architecture
concern_domains:
  - Canonical Data Model
  - Universal Transaction Anchor
  - Audit Evidence and Retention
  - Permission-Aware Data Access
  - Analytics and Reporting Records
---

```{=openxml}
<w:p>
  <w:pPr><w:shd w:fill="001035"/><w:spacing w:before="360" w:after="360"/></w:pPr>
  <w:r><w:rPr><w:color w:val="FFFFFF"/><w:sz w:val="44"/><w:b/></w:rPr><w:t>DWS.01 Data Architecture</w:t></w:r>
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
| 1.0 | 2026-06-18 | Codex | Initial data architecture cross-cutting LLAD draft for DWS.01 canonical records, database design, audit evidence, and reporting data. |

```{=openxml}
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:spacing w:before="240" w:after="120"/></w:pPr><w:r><w:rPr><w:color w:val="001035"/><w:sz w:val="28"/><w:szCs w:val="28"/><w:b/></w:rPr><w:t>Distribution List</w:t></w:r></w:p>
```

| Role | Distribution purpose | Status |
|---|---|---|
| Product Owner | Business review and data scope confirmation | Pending |
| Technical Lead | Database architecture and implementation planning | Pending |
| Platform Administrator | Data governance and configuration planning | Pending |
| Governance Lead | Audit, retention, and compliance review | Pending |

```{=openxml}
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:spacing w:before="240" w:after="120"/></w:pPr><w:r><w:rPr><w:color w:val="001035"/><w:sz w:val="28"/><w:szCs w:val="28"/><w:b/></w:rPr><w:t>Approval Record</w:t></w:r></w:p>
```

| Role | Name | Date | Status |
|---|---|---|---|
| Product Owner | Pending | Pending | Pending |
| Technical Lead | Pending | Pending | Pending |
| Governance Lead | Pending | Pending | Pending |

# 1. Overview and Introduction

This section establishes the business and programme context for the DWS.01 Data Architecture cross-cutting concern, describes the platform vision it enables, and defines the baseline references governing this document.

This document specifies the low-level data architecture for canonical operational records, database ownership boundaries, transaction anchors, audit evidence, data access controls, and analytics records across DWS.01 Work.Space4.0. It converts the HLAD and RSR data requirements into implementable database design rules for the target Supabase-backed PostgreSQL platform and the application services that access it. Companion LLADs govern identity, API, deployment, security, observability, and feature-level behaviour outside the data architecture concern.

## 1.1 Business Context

The data architecture concern exists because DWS.01 must preserve governed operating truth across work records, requests, approvals, evidence, audit trails, performance views, and administration controls.

| # | Title | Description |
|---|---|---|
| 1 | Strategic Context | DWS.01 is DigitalQatalyst's internal agile enterprise execution platform and the workspace layer of the wider Digital Workspace Solution. The data architecture protects the source of truth for ownership, SLA state, workflow state, approval decisions, evidence links, audit trails, and reporting truth. |
| 2 | Sponsoring Organisation | DigitalQatalyst sponsors DWS.01 as an internal execution platform for DQ teams, governance roles, service operators, administrators, and leadership. Data architecture is a foundation concern because platform trust depends on shared records rather than fragmented local page state or companion-tool data. |
| 3 | User Communities | The governed user communities are Associates, Scrum Masters, Team / Squad Leads, Unit Leads, HRA, Admins, Support, and CEO users. Each community consumes records through role, unit, team, queue, dashboard, and workflow scopes that must resolve against the same canonical data model. |
| 4 | Data Sensitivity | The platform handles workspace data, personal data, performance data, audit logs, evidence, access records, request records, and governance records. The data architecture must enforce hosting, retention, sensitivity, permission, and audit controls before records are visible or altered. |
| 5 | Document Scope | This document covers database design, canonical entities, schema ownership, transaction anchors, audit events, evidence links, retention, reporting records, and permission-aware data access. It does not specify detailed API payload contracts, Entra authentication flows, production hosting topology, or Microsoft Graph integration behaviour. |

## 1.2 Platform Vision

The data architecture vision supports DWS.01 as a secure internal workspace where execution, request, approval, performance, and governance activity is stored once, governed consistently, and reused safely across modules.

| # | Title | Description |
|---|---|---|
| 1 | Platform Objective | DWS.01 translates DQ strategy, priorities, services, knowledge, learning, governance, and collaboration into governed daily work. Data architecture ensures those activities create durable records with clear ownership, lifecycle state, evidence, and audit history. |
| 2 | Platform Strategy | The platform follows a staged delivery model where foundation controls are established before deeper marketplace, execution, fulfilment, governance, and specialised internal execution capabilities expand. The data model anchors those stages through reusable users, roles, tasks, requests, approvals, SLAs, audit events, and knowledge references. |
| 3 | Technology Foundation | The target technology model uses Supabase-backed PostgreSQL database operations, Data API access, row-level security, service roles, and Redis patterns where cache or session state is required. The current prototype uses TypeScript interfaces and mock records as source material for schema planning. |
| 4 | Architecture Model | The architecture separates client rendering, application-owned business logic, and governed data access. The client does not read the database directly; application services own validation and orchestration; the data layer stores canonical records and enforces policy-aware persistence controls. |

## 1.3 Document Scope and References

This section defines the system boundaries for this document and the approved baseline documents it traces against.

### 1.3.1 Design Scope

The Data Architecture LLAD governs the cross-cutting database and record-model obligations that DWS.01 systems and future service layers must observe.

| # | System | Stage coverage |
|---|---|---|
| 1 | DWS.01 Work.Space4.0 Client Tier | Prototype shell, Stage 0 entry, marketplaces, workspace, task, request, governance, administration, analytics, support, HRA, and executive routes. |
| 2 | DWS.01 Application and Integration Layer | Target BFF, domain services, workflow services, request services, approval services, audit services, reporting services, and integration adapters. |
| 3 | DWS.01 Data and Intelligence Layer | Target Supabase-backed PostgreSQL records for users, roles, units, teams, tasks, requests, approvals, workflows, SLAs, evidence, knowledge, audit events, and KPIs. |
| 4 | Platform Foundation Services | Shared IAM, audit, notification, configuration governance, session, reporting, and operational monitoring services consumed by DWS.01. |

### 1.3.2 Platform Architecture Document Set

The platform is documented across system-level and cross-cutting architecture artefacts. The table below is the authoritative register for this document version and records the known architecture documents in the programme.

| ID | Document | System / Scope | Type | Status |
|---|---|---|---|---|
| HLAD-DWS01 | DWS.01 Work.Space4.0 High Level Architecture Design | DWS.01 | Architecture Baseline | Review v2.0 |
| RSR-DWS01 | DWS.01 Work.Space4.0 Requirements Specification Report | DWS.01 | Requirements Baseline | Draft v2.0 |
| LLAD-XC-IAM | Identity and Access Management LLAD | Cross-cutting | Cross-cutting Design | Draft v1.0 |
| LLAD-XC-DATA | Data Architecture LLAD | Cross-cutting | Cross-cutting Design | This document |
| GAP-ANNEX | LLAD Traceability Annex (Gap Register + ADR Register) | Cross-cutting | Traceability and Decision Register | Planned |

### 1.3.3 Baseline References

The baseline documents below govern the data architecture decisions in this LLAD and provide the traceability source for Section 4.

| # | Document | Version | Formal Title |
|---|---|---|---|
| 1 | HLAD | 2.0 | DWS.01 Work.Space4.0 - High Level Architecture Design |
| 2 | RSR | 2.0 draft | DWS.01 Work.Space4.0 - Requirements Specification Report |
| 3 | Source code baseline | Current working tree | DWS.01 React / Vite prototype source |

API contracts, endpoint definitions, payload schemas, and backend data models are specified in the corresponding system LLAD. This document specifies the DWS.01 Data Architecture concern at the boundary defined in Section 3 and does not reproduce upstream service internals. Where a contract dependency is currently unresolved, it is tracked as an open item in the governance sections with a named owner and resolution gate that must be satisfied before the dependent feature enters implementation.

# 2. Platform Context

DWS.01 uses a three-tier platform model with a client workspace, an application and integration layer, and a governed data and intelligence layer. Data architecture cuts across all tiers because every user-facing journey, workflow action, approval decision, evidence link, audit trail, and dashboard must resolve to the same record authority. This section places the data concern in the platform context and identifies the platform systems and user communities subject to the concern.

## 2.1 Platform Architecture Model

The platform architecture model separates interaction, orchestration, and system-of-record responsibilities so that operational truth is not distributed across page components or companion tools. Authenticated users enter through the client tier, application services validate and orchestrate work, and the data layer stores canonical records, audit evidence, and analytics signals. All persisted work-control data in this model is governed by the data architecture framework defined in this document.

| # | Layer | Data responsibility |
|---|---|---|
| 1 | Client Tier | Renders records received from governed services, maintains temporary UI state, and does not become the authority for tasks, requests, approvals, evidence, audit, or reporting truth. |
| 2 | Application and Integration Layer | Validates commands, applies workflow rules, resolves ownership, emits audit events, mediates external evidence links, and accesses the data layer through governed service patterns. |
| 3 | Data and Intelligence Layer | Stores canonical PostgreSQL records, applies row-level and service-role controls, supports immutable audit evidence, and feeds reporting and analytics. |
| 4 | Platform Foundation | Provides shared IAM, audit, retention, configuration, operational monitoring, and data governance services that constrain database operations. |

## 2.2 Solution Landscape

The solution landscape positions DWS.01 as the governed work-control authority while Microsoft 365 services remain companion channels for communication, evidence, and collaboration context. Data architecture keeps the canonical state inside DWS.01 and uses integration records to link external artefacts without transferring ownership of work status, approval state, SLA state, or governance reporting.

### 2.2.1 The Hub

DWS.01 is the hub for internal execution records, approvals, requests, evidence links, workflow state, SLA state, audit events, and reporting truth. The data architecture protects the hub by defining canonical tables, ownership references, lifecycle states, audit events, retention controls, and reporting snapshots.

| # | Hub component | Data obligation |
|---|---|---|
| 1 | Workspace Experience | Displays governed records and temporary UI state without storing authoritative work-control data in the browser. |
| 2 | API and Domain Boundary | Converts validated commands into canonical data changes and emits the audit records required for review. |
| 3 | Canonical Data and Audit | Maintains record identity, relationships, lifecycle status, permission scope, retention state, and review evidence. |

### 2.2.2 Application Spokes

Application spokes are the user-facing and domain-service capabilities that create, update, and read DWS.01 data. Each spoke must use shared entity identities and lifecycle states rather than creating separate task, request, approval, or audit models.

| # | Application spoke | Data dependency |
|---|---|---|
| 1 | Stage 0 Workspace Entry | Uses user, role, unit, team, and next-action records to route users into the workspace. |
| 2 | Task and Request Services | Stores task, request, evidence, blocker, SLA, comment, closure, and fulfilment records under common ownership rules. |
| 3 | Governance and Administration | Stores controlled configuration changes, workflow rules, permissions, taxonomies, audit events, and review records. |
| 4 | Analytics and Executive Visibility | Reads governed events and record snapshots to produce permitted metrics for users, teams, units, and leadership. |

### 2.2.3 Platform Service Spokes

Platform service spokes provide identity, persistence, evidence, session, and integration capabilities. Data architecture defines how DWS.01 stores durable records and how companion systems are referenced without becoming the data authority for platform state.

| # | Platform service spoke | Data relationship |
|---|---|---|
| 1 | Microsoft Entra ID | Supplies identity material that maps into canonical user, role, unit, team, and permission records. |
| 2 | Supabase PostgreSQL | Provides the target system-of-record store, Data API, row-level security, database roles, and audit persistence. |
| 3 | Redis State Store | Supports target cache or session-state patterns where volatile state is required outside PostgreSQL. |
| 4 | Microsoft 365 | Provides evidence and collaboration artefacts that are linked from DWS.01 records rather than copied as work authority. |

## 2.3 User Communities

The following user communities are subject to the data ownership, access, retention, and reporting controls defined in this document. Data architecture governs how each community creates, reads, updates, and reviews records according to role, unit, team, queue, dashboard, and workflow responsibility.

| # | User community | Data treatment |
|---|---|---|
| 1 | Associates | Create and update personal tasks, requests, evidence, updates, blockers, comments, and closure records within assigned scope. |
| 2 | Scrum Masters and Team / Squad Leads | Review team work, blocker, workflow, SLA, evidence, closure, and performance records within team scope. |
| 3 | Unit Leads and CEO | Consume unit, enterprise, governance, SLA, performance, and outcome records through controlled dashboard and reporting scopes. |
| 4 | HRA and Support | Manage request, queue, fulfilment, onboarding, policy, support, evidence, and closure records for their service responsibilities. |
| 5 | Admins and Platform Administrators | Govern users, roles, permissions, workflow rules, taxonomies, integration settings, AI settings, audit records, and platform configuration data. |

# 3. Concern Architecture Overview

This section establishes the mandate, governing boundaries, and design principles for the Data Architecture cross-cutting concern, and defines its relationship to companion cross-cutting architecture documents. Data architecture is a foundation control because every sensitive route, workflow action, request, approval, SLA, evidence link, audit entry, configuration change, and dashboard depends on a consistent record model.

## 3.1 Concern Mandate

The data architecture concern mandates how DWS.01 models, stores, protects, relates, audits, and reports operational records. The current client prototype demonstrates the domain shape through TypeScript interfaces and mock entities for personas, users, units, teams, tasks, requests, approvals, workflows, queues, knowledge assets, audit events, KPI sets, service requests, and assigned task evidence. The target architecture converts those prototype structures into Supabase-backed PostgreSQL schemas, Data API access, row-level security, lifecycle constraints, immutable audit evidence, and governed reporting records.

Without a cross-cutting data architecture, task, request, approval, SLA, evidence, audit, and performance records could fragment across feature modules, local state, companion tools, and future services. That would weaken reporting trust, ownership accountability, permission enforcement, retention control, workflow traceability, and governance review readiness.

## 3.2 Governing Boundaries

The following systems and repositories are within the governance scope of this document. Data architecture governs the persistence, relationship, access, and retention obligations that each system must satisfy before production use.

| # | System | Type | Concern applicability |
|---|---|---|---|
| 1 | DWS.01 Client Prototype | React / Vite application | Uses mock records and local UI state to validate journeys while deferring authoritative persistence to services. |
| 2 | DWS.01 Application API | Target Express / BFF services | Validates commands, maps DTOs to canonical records, emits audit events, and blocks direct client database access. |
| 3 | DWS.01 Domain Services | Target Node.js services | Owns task, request, workflow, approval, knowledge, evidence, reporting, and administration data mutations. |
| 4 | Supabase PostgreSQL | Target data platform | Stores canonical records, RLS policies, service-role access, database constraints, migrations, and audit evidence. |
| 5 | Microsoft 365 | Companion services | Provides linked evidence and collaboration context while DWS.01 retains work-control state. |

Public customer datasets, external partner master data, corporate HRMS source-of-record administration, and enterprise-wide Microsoft tenant data governance remain outside this document. Those domains are governed by DQ corporate data policy and any future integration-specific LLADs.

This document is the authoritative source for DWS.01 canonical entity design, database ownership boundaries, transaction anchors, audit data, retention obligations, data access controls, and reporting record governance until superseded by an approved Data Architecture LLAD revision.

## 3.3 Relationship to Other Cross-Cutting Documents

Data architecture depends on IAM, security architecture, deployment architecture, and observability architecture for controls that are adjacent to persistence but not wholly owned by it. Those documents consume data decisions because they must apply canonical identities, permission scopes, audit events, retention rules, schema ownership, and reporting events consistently.

| # | This document | Depends on | What it needs | Why |
|---|---|---|---|---|
| 1 | Data Architecture LLAD | IAM LLAD | Canonical user, role, permission, unit, team, session, and access-review controls | Data access and RLS depend on resolved identity and scope. |
| 2 | Data Architecture LLAD | Security architecture | Encryption, secrets, backup protection, threat controls, and data classification | Persistence controls must align with security obligations. |
| 3 | Data Architecture LLAD | Deployment architecture | Environment topology, Supabase project separation, migration promotion, and backup configuration | Database design requires environment-specific operational controls. |
| 4 | Data Architecture LLAD | Observability architecture | Audit, metrics, tracing, and operational event taxonomy | Reporting and monitoring depend on consistent event structures. |

The data concern is consumed by system and cross-cutting design documents that need canonical records and persistence rules.

| # | Document | What it takes from this document |
|---|---|---|
| 1 | IAM LLAD | User, role, permission, access-scope, audit, and retention data model obligations. |
| 2 | Security architecture LLAD | Data classification, retention, audit, encryption, backup, and sensitive record obligations. |
| 3 | Interoperability LLAD | Entity ownership, API data contracts, transaction anchors, and event payload boundaries. |
| 4 | Feature-level LLADs | Canonical entity references, lifecycle state rules, ownership foreign keys, and evidence linkage patterns. |

## 3.4 Design Principles

The design principles below are derived from the HLAD architecture principles and RSR data requirements. They are enforced constraints for every DWS.01 feature, service, migration, and reporting surface that creates or consumes governed data.

The principles preserve DWS.01 as the data authority, prevent domain-level record fragmentation, keep browser state non-authoritative, make requests the universal Stage 2 and above transaction anchor, and require immutable audit evidence for governed actions.

| ID | Principle | Rationale | Implication | Baseline reference |
|---|---|---|---|---|
| AP-DATA-01 | Canonical operational records are shared platform assets. | Reporting, workflow, evidence, and governance depend on common identifiers and relationships. | Tasks, requests, approvals, SLAs, audit events, knowledge references, units, teams, and users use one governed model. | HLAD AP-03; RSR 3.6 |
| AP-DATA-02 | Browser and mock records are non-authoritative. | Client-local state supports prototype validation but cannot provide production trust or auditability. | Production persistence occurs through application services and the Data API, not direct browser storage. | HLAD AP-02; RSR 3.5 |
| AP-DATA-03 | Requests anchor Stage 2 and above transactions. | Request, approval, escalation, support, and specialised workflows need one transaction spine. | `s2_account.requests` acts as the universal transaction anchor for Stage 2 and later workflows. | RSR 3.6 |
| AP-DATA-04 | Audit events are immutable governed records. | Governance review and compliance readiness depend on durable evidence for state changes. | Normal users cannot delete audit events; audit writes are service-controlled and retention-governed. | HLAD AP-05; RSR NFR-03 |
| AP-DATA-05 | Data visibility is permission-aware by design. | Personal, performance, evidence, and governance records require least-privilege access. | RLS, service roles, scoped queries, and dashboard permissions enforce role, unit, team, record, and sensitivity boundaries. | HLAD AP-04; RSR NFR-02 |

# 4. Fit-Gap Analysis

The fit-gap analysis maps the baseline data requirements from the HLAD and RSR to the data architecture decisions specified in this LLAD. It separates conformant design decisions from open design gaps and design-complete build or evidence tasks. The assessment is design-time architecture traceability, not a statement of production deployment status.

## 4.1 Methodology

The fit-gap assessment traces HLAD architecture principles, RSR data requirements, and RSR non-functional requirements against the concern domains in Section 5. Coverage is assessed across canonical model design, transaction anchoring, audit evidence, permission-aware access, retention, and reporting data. The result classifies each issue as a design gap, a design-complete implementation backlog item, or a resolved design decision.

Type 1 gaps are unresolved architectural decisions and are the only valid entries in Section 4.4. Type 2 items are design-complete build or evidence tasks that belong in Section 6.5, not in the design-gap table. Type 3 items are decisions resolved within this document and recorded as accepted architecture decisions.

## 4.2 Baseline Traceability

The baseline traceability confirms that the LLAD maps the RSR and HLAD data obligations to explicit design domains. Functional and architectural requirements are treated as conformant when a Section 5 domain specifies the data structure, ownership boundary, or governance control required to realise the baseline.

**Table 1 - Summary count:**

| # | Status | Count | Notes |
|---|---|---|---|
| 1 | Specification conformant | 7 | Core data requirements are mapped to Section 5 domains. |
| 2 | Gap | 0 | No unresolved data architecture decision is recorded in this draft. |
| 3 | Not applicable | 1 | Public customer data ownership is outside DWS.01 scope. |
| Total |  | 8 | Baseline traceability covers RSR data, technology, process, and governance requirements. |

No gap or deviation rows are recorded for baseline traceability in this document version.

## 4.3 NFR Coverage

The NFR assessment covers security, privacy, auditability, growth, maintainability, operability, compliance, and data handling requirements that directly affect the database design.

**Table 1 - Summary count:**

| # | Status | Count | Notes |
|---|---|---|---|
| 1 | Specification conformant | 8 | Data controls are mapped to target database and service-layer obligations. |
| 2 | Gap | 0 | No unresolved NFR design decision is recorded in this draft. |
| 3 | Not applicable | 0 | All reviewed NFRs apply to DWS.01 data architecture. |
| Total |  | 8 | Coverage includes audit, permissions, growth, monitoring, retention, and hosting policy. |

Key NFRs map to the concern domains below.

| # | NFR | Requirement | Mapped domain | Status |
|---|---|---|---|---|
| 1 | NFR-02 | Enforce role, unit, team, record, and dashboard permissions. | Permission-Aware Data Access | Specification conformant |
| 2 | NFR-03 | Record non-deletable audit events for governed changes. | Audit Evidence and Retention | Specification conformant |
| 3 | NFR-09 | Support growth in core operational records. | Canonical Data Model | Specification conformant |
| 4 | NFR-14 | Expose operational health and permission exceptions. | Analytics and Reporting Records | Specification conformant |
| 5 | NFR-16 | Apply data-handling, hosting, access, and retention policies. | Audit Evidence and Retention | Specification conformant |

## 4.4 Design Gaps

Design gaps identified during the fit-gap assessment are recorded in full in the LLAD Traceability Annex (`workspace/llad-annex/annex-gap-register.md`). The table below summarises gaps relevant to this document.

No open Type 1 data architecture design gaps are recorded for this document version.

# 5. Concern Domains

The data architecture concern is organised into five domains that together govern how DWS.01 represents, persists, protects, audits, and reports operational records. Each domain defines its design boundary, per-system application, constraints, and architecture decisions so implementation teams can convert the target data model into migrations, services, and tests without creating competing record authorities.

## 5.1 Canonical Data Model

The Canonical Data Model domain governs the shared entities that carry DWS.01 operating truth across stages and user roles. The platform obligation is to keep these entities reusable across feature modules, services, dashboards, and governance reviews.

### 5.1.1 Domain Scope

This concern domain governs the following aspects of Canonical Data Model: entity identity, table ownership, core relationships, lifecycle state, common status vocabulary, and record ownership. The following aspects are out of scope for this domain: API payload versioning, physical environment provisioning, and UI display state.

| # | Aspect |
|---|---|
| 1 | Canonical users, roles, units, teams, personas, queues, and permission scopes. |
| 2 | Canonical tasks, requests, approvals, workflows, SLAs, blockers, evidence, comments, and closure records. |
| 3 | Canonical knowledge references, service catalogue records, task templates, and marketplace feedback records. |
| 4 | Canonical audit events, KPI sets, analytics events, governance reviews, and configuration changes. |

Adjacent concerns own the exclusions listed below.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | REST contract payloads and endpoint versioning | Interoperability LLAD |
| 2 | Supabase project, environment, and backup provisioning | Deployment architecture LLAD |
| 3 | Page-level component state and rendering behaviour | System architecture LLAD |

### 5.1.2 Design

The target design uses PostgreSQL schemas to group records by platform responsibility while preserving cross-domain relationships through stable identifiers. Foundation records hold users, roles, units, teams, personas, permissions, and queues; work-control records hold tasks, requests, approvals, workflows, SLAs, blockers, evidence, comments, and closure state; knowledge and service records hold reusable guidance, catalogue, and template data; reporting records hold analytics events, KPI snapshots, and dashboard aggregates.

| # | Entity group | Owner | Contents | Constraints |
|---|---|---|---|---|
| 1 | Identity and organisation | Platform Foundation | Users, roles, units, teams, personas, permissions | Keys support IAM and access review. |
| 2 | Work execution | Task domain services | Tasks, checklists, blockers, updates, closure records | Owner, reviewer, team, status, SLA, and evidence references are mandatory where applicable. |
| 3 | Request and fulfilment | Request domain services | Requests, queues, fulfilment notes, approvals, escalations | Requests anchor Stage 2 and above transactions. |
| 4 | Knowledge and catalogue | Knowledge and service services | Knowledge assets, service catalogue, templates, guidance links | Records are permission-aware and link to tasks or requests. |
| 5 | Audit and reporting | Foundation and analytics services | Audit events, KPI sets, analytics events, snapshots | Audit records are immutable to normal users. |

The prototype entity types provide the planning baseline for initial schema entities.

| # | Prototype source | Target database entity | Key relationships | Design note |
|---|---|---|---|---|
| 1 | User | users | role, unit, team, persona | Maps authenticated identities to workspace scope. |
| 2 | Task | tasks | owner, reviewer, team, request, knowledge | Preserves task execution and closure state. |
| 3 | RequestRecord | requests | requester, owner, queue, linked task | Anchors request, support, and escalation transactions. |
| 4 | Approval | approvals | approver, task, request | Stores decision, rationale, delegation, and status. |
| 5 | AuditEvent | audit_events | actor, entity type, entity id | Preserves non-deletable governed evidence. |

### 5.1.3 Per-System Application

The canonical data model applies uniformly to all DWS.01 systems that create or consume governed records. Each system must reference canonical identities and lifecycle records instead of introducing local equivalents.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | DWS.01 Client Prototype | Renders records from service responses and treats mock data as journey validation material. | TypeScript interfaces and mock records | Specification conformant - prototype validation gate |
| 2 | DWS.01 Application API | Maps API commands and queries to canonical entities. | DTO-to-entity mapping | Specification conformant - API design gate |
| 3 | DWS.01 Domain Services | Owns mutations for task, request, approval, workflow, knowledge, and reporting entities. | Service ownership catalogue | Specification conformant - build design gate |
| 4 | Supabase PostgreSQL | Stores canonical schemas, tables, keys, constraints, policies, and migrations. | Database migration set | Deferred (CRD/AB-XC) |
| 5 | Reporting Services | Reads canonical events and snapshots for dashboards. | Analytics entity map | Specification conformant - reporting design gate |

### 5.1.4 Constraints and Obligations

These constraints are mandatory because DWS.01 requires one reusable record model for workflow traceability, permission enforcement, reporting trust, and governance review.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | Domain modularity must not fragment shared records. | RSR 3.6 | All feature domains | Reporting and workflow history diverge. |
| 2 | The client must not own business rules or direct database access. | RSR 3.5 | Client and API | Browser state can bypass governance controls. |
| 3 | Shared entities must remain canonical across modules. | HLAD AP-03 | Database and services | Duplicate task or request models emerge. |
| 4 | Record relationships must support audit and ownership review. | RSR NFR-17 | Data and audit stores | Review packs cannot be produced reliably. |

### 5.1.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | DWS.01 uses a canonical PostgreSQL model for operational records. | ADR-DWS01-DATA-001 | Accepted |
| 2 | Prototype mock entities form schema planning input but not production authority. | ADR-DWS01-DATA-002 | Accepted |

The items below record unresolved design and implementation questions arising from the Canonical Data Model domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Produce the first Supabase migration set for canonical users, units, teams, tasks, requests, approvals, audit events, and KPI records. |  | Technical Lead | Before Build data-layer implementation |
| 2 | Produce entity-level migration tests for required keys, status values, ownership fields, and lifecycle constraints. |  | Technical Lead | Before UAT data model gate |

## 5.2 Universal Transaction Anchor

The Universal Transaction Anchor domain governs the request spine that connects Stage 2 and above transactions across services, approvals, escalations, support cases, and specialised workflows. The platform obligation is to prevent later workflow domains from creating isolated transaction lifecycles.

### 5.2.1 Domain Scope

This concern domain governs the following aspects of Universal Transaction Anchor: request identity, requester ownership, fulfilment ownership, queue assignment, SLA state, linked task references, approval references, escalation references, and closure outcome. The following aspects are out of scope for this domain: service catalogue presentation, detailed API payloads, and external ticketing systems.

| # | Aspect |
|---|---|
| 1 | Universal request records for Stage 2 and above transactions. |
| 2 | Links from requests to tasks, approvals, queues, fulfilment notes, evidence, and audit events. |
| 3 | Request categories covering HRA, IT and access, platform support, knowledge, task support, administration, approvals, and escalations. |
| 4 | SLA and lifecycle states used by fulfilment queues, dashboards, and governance review. |

Adjacent concerns own the exclusions listed below.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | Service marketplace UI rendering | System architecture LLAD |
| 2 | Request API request and response payloads | Interoperability LLAD |
| 3 | External service desk or ticketing integration | Integration architecture LLAD |

### 5.2.2 Design

The target design treats `s2_account.requests` as the universal transaction anchor for Stage 2 and above workflows. A request records category, requester, owner, queue, status, urgency, SLA state, expected outcome, linked task, approval, escalation, evidence, audit events, and closure outcome so downstream workflows can attach to one transaction spine.

| # | Anchor field group | Purpose | Data owner | Constraint |
|---|---|---|---|---|
| 1 | Identity and category | Identifies transaction type and ownership context. | Request services | Category uses governed catalogue values. |
| 2 | Routing and ownership | Assigns fulfilment queue, owner, approver, and service responsibility. | Workflow services | Queue and owner references are canonical. |
| 3 | Lifecycle and SLA | Tracks request state, urgency, SLA state, and closure. | Request services | State changes emit audit events. |
| 4 | Linkage and evidence | Connects tasks, approvals, escalation, evidence, comments, and knowledge. | Domain services | Linked records retain their own lifecycle. |
| 5 | Reporting and review | Feeds support, HRA, SLA, governance, and executive dashboards. | Analytics services | Dashboard visibility remains permission-aware. |

Request categories are governed values because they drive routing, reporting, and fulfilment responsibility.

| # | Category | Primary owner | Typical linked records | Design rule |
|---|---|---|---|---|
| 1 | HRA Requests | HRA | Onboarding, readiness, policy approvals | People data requires scoped access. |
| 2 | IT & Access Requests | Support and Admin | Access, equipment, platform permissions | Access changes require audit evidence. |
| 3 | Platform Support | Support | Defects, user support, route issues | Support activity links to request history. |
| 4 | Task / Workflow Support | Scrum Master or Support | Task unblock, workflow help, closure support | Linked task remains canonical. |
| 5 | Approvals and Escalations | Approver or Lead | Decision, rationale, escalation path | Decisions remain native DWS.01 records. |

### 5.2.3 Per-System Application

The request anchor applies to every system that submits, routes, fulfils, approves, escalates, or reports service transactions. Systems must attach their domain-specific records to the request spine instead of creating independent transaction roots.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | Service Marketplace | Creates request records from selected services and required inputs. | Request intake model | Specification conformant - marketplace design gate |
| 2 | Request Services | Owns request lifecycle, queue routing, SLA state, and closure outcome. | Request service model | Specification conformant - service design gate |
| 3 | Workflow Services | Links approvals, escalations, handoffs, and decisions to request records. | Workflow linkage model | Specification conformant - workflow design gate |
| 4 | Supabase PostgreSQL | Stores request anchor tables, foreign keys, and lifecycle constraints. | Request migration set | Deferred (CRD/AB-XC) |
| 5 | Reporting Services | Uses request status and SLA state for support and executive dashboards. | Request analytics model | Specification conformant - dashboard design gate |

### 5.2.4 Constraints and Obligations

These constraints are mandatory because request fragmentation would break fulfilment accountability, approval traceability, SLA reporting, and support governance.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | Stage 2 and above transactions use the universal request anchor. | RSR 3.6 | Request, approval, escalation, support | Transaction history fragments. |
| 2 | Requests preserve category, requester, owner, SLA, status, evidence, and audit trail. | RSR 3.3 | Request services | Fulfilment cannot be governed. |
| 3 | Approvals and escalations remain native platform records. | HLAD AP-06 | Workflow services | Companion tools become work-control authorities. |
| 4 | Request data must be role and queue scoped. | RSR NFR-02 | Data and reporting | Sensitive requests become overexposed. |

### 5.2.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | Stage 2 and above transactions use `s2_account.requests` as the anchor. | ADR-DWS01-DATA-003 | Accepted |
| 2 | Approvals and escalations attach to requests without replacing request ownership. | ADR-DWS01-DATA-004 | Accepted |

The items below record unresolved design and implementation questions arising from the Universal Transaction Anchor domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Produce the request anchor migration with governed category, status, urgency, SLA, queue, and linkage constraints. |  | Technical Lead | Before Build request-service implementation |
| 2 | Produce request lifecycle fixtures for HRA, IT and access, support, task support, approvals, and escalations. |  | Product Owner | Before UAT request lifecycle gate |

## 5.3 Audit Evidence and Retention

The Audit Evidence and Retention domain governs durable evidence for governed state changes, access-sensitive actions, workflow decisions, and configuration changes. The platform obligation is to prove what changed, who changed it, when it changed, and which record or policy was affected.

### 5.3.1 Domain Scope

This concern domain governs the following aspects of Audit Evidence and Retention: audit event identity, actor reference, entity reference, timestamp, severity, event type, retention classification, evidence link, and review pack availability. The following aspects are out of scope for this domain: infrastructure log transport, telemetry metric design, and external evidence file storage.

| # | Aspect |
|---|---|
| 1 | Immutable audit events for task, request, approval, workflow, access, knowledge, performance, and configuration changes. |
| 2 | Evidence links from tasks, requests, approvals, governance reviews, and closure records to companion storage. |
| 3 | Retention and deletion constraints for normal users and privileged service roles. |
| 4 | Review-ready data packs for governance, access review, closure review, and compliance checks. |

Adjacent concerns own the exclusions listed below.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | Infrastructure logging and tracing pipeline | Observability architecture LLAD |
| 2 | External file storage configuration | Deployment architecture LLAD |
| 3 | Encryption and key management | Security architecture LLAD |

### 5.3.2 Design

The target design stores audit events as append-only records written by trusted services. Normal users cannot delete or alter audit events, and application services emit events for lifecycle changes, approvals, returns, escalations, access-sensitive actions, evidence changes, permission changes, workflow rule changes, and configuration updates.

| # | Audit field | Purpose | Required source | Constraint |
|---|---|---|---|---|
| 1 | actor_user_id | Identifies who initiated the action. | IAM context | Must map to canonical user. |
| 2 | event_type | Classifies the action performed. | Domain service | Uses governed event taxonomy. |
| 3 | entity_type and entity_id | Identifies affected record. | Domain service | Must reference canonical entity. |
| 4 | timestamp and severity | Supports timeline and risk review. | Service clock and rule | Uses consistent time standard. |
| 5 | evidence_ref | Links proof or external artefact. | Evidence service | Link is access controlled. |

Retention is applied by record class rather than by feature page.

| # | Record class | Retention treatment | Reviewer | Design note |
|---|---|---|---|---|
| 1 | Audit events | Non-deletable by normal users | Governance Lead | Service-controlled corrections use new events. |
| 2 | Evidence links | Retained with linked task or request | Owner and reviewer | External file access remains permission-aware. |
| 3 | Approval decisions | Retained with rationale and timestamp | Approver and governance | Decision history is review-ready. |
| 4 | Configuration changes | Retained for release and access review | Platform Administrator | Changes require controlled governance. |
| 5 | Analytics snapshots | Retained by reporting policy | Leadership and operators | Snapshots preserve report reproducibility. |

### 5.3.3 Per-System Application

Audit and retention obligations apply wherever governed data is created, changed, approved, routed, closed, or reported. Evidence must remain available to authorised reviewers without exposing sensitive audit trails to ordinary users.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | DWS.01 Client Prototype | Shows audit timelines, evidence states, and closure cues for journey validation. | Audit and evidence views | Specification conformant - prototype validation gate |
| 2 | DWS.01 Application API | Emits audit events for state changes and evidence-sensitive actions. | Audit event middleware | Specification conformant - API audit gate |
| 3 | Supabase PostgreSQL | Stores audit records with append-only policy and retention metadata. | Audit schema and policies | Deferred (CRD/AB-XC) |
| 4 | Governance Dashboards | Presents review packs and audit summaries to authorised reviewers. | Review pack model | Specification conformant - governance review gate |
| 5 | Microsoft 365 | Stores external artefacts referenced by DWS.01 evidence links. | Evidence link reference | Specification conformant - integration design gate |

### 5.3.4 Constraints and Obligations

These constraints are mandatory because DWS.01 must preserve review-ready evidence for workflow, approval, access, configuration, performance, and governance activity.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | Normal users must not delete audit records. | RSR NFR-03 | Audit store | Review evidence can be lost. |
| 2 | Governed actions require evidence traceability. | RSR NFR-15 | Task, request, approval | Closure and review packs are incomplete. |
| 3 | Data handling and retention policies must apply to workspace data. | RSR NFR-16 | All record classes | Sensitive data can be mishandled. |
| 4 | Review packs must be available to authorised reviewers. | RSR NFR-17 | Governance reports | Compliance readiness cannot be demonstrated. |

### 5.3.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | Audit records are append-only service-written records. | ADR-DWS01-DATA-005 | Accepted |
| 2 | Evidence files are linked records, not replacement work-control authorities. | ADR-DWS01-DATA-006 | Accepted |

The items below record unresolved design and implementation questions arising from the Audit Evidence and Retention domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Produce the audit event taxonomy covering task, request, approval, workflow, access, knowledge, performance, and configuration changes. |  | Governance Lead | Before Build audit-service implementation |
| 2 | Produce retention classifications for audit events, evidence links, approval decisions, and reporting snapshots. |  | Governance Lead | Before UAT data governance gate |

## 5.4 Permission-Aware Data Access

The Permission-Aware Data Access domain governs how records are exposed through services, row-level policies, dashboard scopes, and reporting queries. The platform obligation is to ensure sensitive data is filtered before visibility, not merely hidden in navigation.

### 5.4.1 Domain Scope

This concern domain governs the following aspects of Permission-Aware Data Access: RLS policy design, service-role boundaries, query scoping, dashboard permissions, record ownership, unit scope, team scope, queue scope, and sensitivity filtering. The following aspects are out of scope for this domain: Entra token issuance, credential login, and user-facing access-denied copy.

| # | Aspect |
|---|---|
| 1 | Role, unit, team, queue, record, dashboard, and sensitivity filters applied to data retrieval. |
| 2 | RLS policy boundaries and service-role access to privileged records. |
| 3 | Scoped reporting queries for personal, team, unit, executive, HRA, support, and admin views. |
| 4 | Data-layer alignment with IAM permission catalogue and access-review obligations. |

Adjacent concerns own the exclusions listed below.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | Identity provider authentication and claim issuance | IAM LLAD |
| 2 | Access-denied experience design | System architecture LLAD |
| 3 | Secret storage and credential hardening | Security architecture LLAD |

### 5.4.2 Design

The target design enforces data access in layers. The client filters navigation and renders restricted states, the application tier validates the user's resolved permission context, and the database enforces record visibility through RLS, service roles, and constrained query patterns.

| # | Control layer | Enforcement responsibility | Input | Output |
|---|---|---|---|---|
| 1 | Client route guard | Prevents ordinary route exposure and supports user guidance. | Role and permission context | Permitted navigation state |
| 2 | Application service | Validates command and query authorisation. | User, role, unit, team, permission | Scoped service result |
| 3 | Database policy | Enforces row visibility and mutation constraints. | Claims or service context | Allowed record set |
| 4 | Reporting scope | Filters dashboard aggregates and details. | Dashboard permission and scope | Permitted metric view |
| 5 | Audit evidence | Records denied or sensitive actions. | Decision context | Reviewable audit event |

The permission model maps prototype permission keys into data access scopes.

| # | Permission family | Data scope | Applies to | Gate |
|---|---|---|---|---|
| 1 | workspace and tasks | Personal, team, and all-task records | Tasks and work updates | Permission matrix gate |
| 2 | workflows and governance | Workflow, approval, escalation, and review records | Workflow Centre and governance | Governance review gate |
| 3 | services and people | Personal requests, queue requests, and people references | Services, support, HRA | Fulfilment UAT gate |
| 4 | reports and performance | Personal, team, unit, and executive metrics | Dashboards and analytics | Reporting access gate |
| 5 | admin | Configuration, role, permission, and audit controls | Administration Console | Admin governance gate |

### 5.4.3 Per-System Application

Permission-aware data access applies to every component that returns records or aggregates. Systems may render user-specific experiences, but final access must be enforced through services and data policies.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | DWS.01 Client Prototype | Uses route guards and permission filtering to validate access journeys. | Permission catalogue and routes | Specification conformant - prototype validation gate |
| 2 | DWS.01 Application API | Validates command and query access before data retrieval or mutation. | Access middleware | Specification conformant - API access gate |
| 3 | Supabase PostgreSQL | Applies RLS and service-role boundaries for protected records. | RLS policy set | Deferred (CRD/AB-XC) |
| 4 | Reporting Services | Applies dashboard and scope permissions before metrics are returned. | Reporting policy map | Specification conformant - dashboard access gate |
| 5 | Administration Console | Governs permission catalogue, role mapping, and access-review data. | Permission configuration records | Specification conformant - admin governance gate |

### 5.4.4 Constraints and Obligations

These constraints are mandatory because DWS.01 contains personal, performance, governance, request, evidence, and audit data that must be least-privilege by design.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | Data access must enforce role, unit, team, record, dashboard, and sensitivity permissions. | RSR NFR-02 | Services and database | Sensitive records are overexposed. |
| 2 | Client route filtering is not the final authority. | HLAD AP-02 | Client and API | Browser manipulation can bypass controls. |
| 3 | Access decisions must be auditable. | HLAD AP-05 | Services and audit store | Permission review lacks evidence. |
| 4 | AI and automation must inherit permitted data scope. | HLAD AP-08 | Automation services | AI can access unauthorised records. |

### 5.4.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | Sensitive data access is enforced through application and database controls. | ADR-DWS01-DATA-007 | Accepted |
| 2 | Dashboard aggregates inherit the viewer's permitted scope. | ADR-DWS01-DATA-008 | Accepted |

The items below record unresolved design and implementation questions arising from the Permission-Aware Data Access domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Produce the RLS policy matrix for users, teams, tasks, requests, approvals, audit events, and dashboards. |  | Technical Lead | Before Build data policy implementation |
| 2 | Produce permission-scoped query tests for Associate, Lead, Governance Lead, Leadership, and Platform Admin roles. |  | Technical Lead | Before UAT permission matrix gate |

## 5.5 Analytics and Reporting Records

The Analytics and Reporting Records domain governs the events, snapshots, and aggregates used for operational dashboards, SLA visibility, governance review, workload reporting, and executive oversight. The platform obligation is to derive metrics from governed records without exposing unauthorised details.

### 5.5.1 Domain Scope

This concern domain governs the following aspects of Analytics and Reporting Records: analytics events, KPI sets, dashboard scopes, SLA exposure metrics, governance risk metrics, workload snapshots, closure quality metrics, and executive outcome signals. The following aspects are out of scope for this domain: visual chart design, external BI platform provisioning, and AI recommendation prompts.

| # | Aspect |
|---|---|
| 1 | Analytics events emitted from task, request, workflow, approval, audit, knowledge, and performance activities. |
| 2 | KPI sets and snapshots for enterprise, team, support, governance, SLA, closure, and workload reporting. |
| 3 | Permission-aware dashboard aggregates for personal, team, unit, executive, HRA, support, and admin views. |
| 4 | Data quality controls for report reproducibility and review readiness. |

Adjacent concerns own the exclusions listed below.

| # | Exclusion | Governing document |
|---|---|---|
| 1 | Dashboard visual component design | System architecture LLAD |
| 2 | External analytics provider configuration | Deployment architecture LLAD |
| 3 | AI prompt and recommendation controls | AI governance LLAD |

### 5.5.2 Design

The target design generates analytics records from canonical operational events rather than from standalone dashboard state. KPI sets record scope, metric, value, trend, status, timestamp, and source event references so reporting can be reproduced and traced to governed platform activity.

| # | Reporting record | Purpose | Source records | Constraint |
|---|---|---|---|---|
| 1 | Analytics event | Captures reportable platform action. | Tasks, requests, workflows, audit | Emits from domain services. |
| 2 | KPI set | Groups metrics for a dashboard scope. | Analytics events and snapshots | Scope must be permission-aware. |
| 3 | SLA snapshot | Preserves SLA health at a point in time. | Tasks, requests, workflows | Supports trend reporting. |
| 4 | Governance signal | Flags evidence, audit, permission, or closure risk. | Audit and operational records | Reviewer access is controlled. |
| 5 | Outcome signal | Connects execution activity to strategic outcomes. | Tasks, requests, initiatives | Attribution remains governed. |

Dashboard records are scoped by audience.

| # | Audience | Permitted reporting scope | Typical metric | Design rule |
|---|---|---|---|---|
| 1 | Associate | Personal tasks, requests, updates, evidence | Assigned work and blockers | No team or enterprise leakage. |
| 2 | Lead | Team tasks, workflows, blockers, SLA | Workload and flow health | Team scope is enforced. |
| 3 | Unit Lead | Unit performance and governance signals | SLA and delivery health | Unit scope is enforced. |
| 4 | Support and HRA | Queue and fulfilment records | Request volume and SLA risk | Queue ownership is enforced. |
| 5 | CEO | Enterprise summaries and outcome signals | Governance and value delivery | Detail drill-down is permission-aware. |

### 5.5.3 Per-System Application

Analytics and reporting records apply wherever the platform produces operational visibility. Systems must derive metrics from canonical data, respect permissions, and preserve traceable source references for review.

| # | System | How concern applies | Key artefact | Conformance status |
|---|---|---|---|---|
| 1 | DWS.01 Client Prototype | Displays KPI sets and dashboard surfaces for stakeholder validation. | Mock KPI and dashboard data | Specification conformant - prototype validation gate |
| 2 | Analytics Services | Builds events, snapshots, aggregates, and dashboard-scoped results. | Analytics event model | Specification conformant - analytics design gate |
| 3 | Supabase PostgreSQL | Stores analytics events, KPI snapshots, and reporting scopes. | Reporting schema | Deferred (CRD/AB-XC) |
| 4 | Governance Dashboards | Presents audit, SLA, closure, and governance metrics to authorised reviewers. | Governance reporting model | Specification conformant - governance review gate |
| 5 | Automation Services | Reads permitted events for reminders, risk signals, summaries, and recommendations. | Automation event feed | Specification conformant - AI guardrail gate |

### 5.5.4 Constraints and Obligations

These constraints are mandatory because reporting must be trusted, permission-aware, reproducible, and traceable to governed records.

| # | Constraint | Source | Applies to | Consequence of breach |
|---|---|---|---|---|
| 1 | Leadership and governance views must use role-controlled platform records. | RSR SO-04 | Dashboards | Unauthorised visibility can occur. |
| 2 | Performance data must follow permission and sensitivity controls. | RSR NFR-02 | Reporting services | Personal or team data can leak. |
| 3 | Operational health and audit activity must be visible to authorised operators. | RSR NFR-14 | Operations dashboards | Support and governance cannot triage. |
| 4 | AI assistance must preserve permission filtering and audit logging. | RSR NFR-04 | Automation services | AI outputs can bypass governance. |

### 5.5.5 Architecture Decisions and Open Items

The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex.

| # | Decision | ADR ref | Status |
|---|---|---|---|
| 1 | Reporting derives from canonical events and snapshots. | ADR-DWS01-DATA-009 | Accepted |
| 2 | Automation and AI consume governed event feeds only. | ADR-DWS01-DATA-010 | Accepted |

The items below record unresolved design and implementation questions arising from the Analytics and Reporting Records domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery.

| # | Open item | Gap ref | Owner | Resolution gate |
|---|---|---|---|---|
| 1 | Produce the analytics event taxonomy for SLA, blocker, closure quality, workload, governance, knowledge, and outcome reporting. |  | Product Owner | Before Build analytics-service implementation |
| 2 | Produce reporting fixtures that prove dashboard scopes for personal, team, unit, queue, and executive views. |  | Technical Lead | Before UAT reporting access gate |

# 6. Architecture Governance

Architecture governance defines how the data architecture design is controlled after this LLAD is approved. The governance model keeps principles, ADRs, NFR coverage, open items, and design-complete backlog items visible so schema, migration, policy, retention, and reporting work do not drift as DWS.01 expands.

## 6.1 Architecture Principles Conformance

The data architecture design conforms to the governing HLAD principles by keeping DWS.01 as the work-control authority, separating client rendering from persistence, normalising shared records, and requiring immutable audit evidence for sensitive actions. Any future change that weakens canonical records, request anchoring, permission-aware access, or auditability requires architecture review.

| # | Principle | Conformance position |
|---|---|---|
| 1 | AP-01 Governed Work Source of Truth | DWS.01 owns tasks, requests, approvals, SLAs, evidence links, audit trails, and reporting truth. |
| 2 | AP-02 Three-Tier Responsibility Separation | The client renders data while application services and data controls own persistence and access. |
| 3 | AP-03 Canonical Object Model | Users, roles, tasks, requests, approvals, SLAs, audit events, units, teams, and performance records remain canonical. |
| 4 | AP-04 Role-Based Access and Visibility | Data visibility is constrained by role, unit, team, record, dashboard, queue, and sensitivity scope. |
| 5 | AP-05 Embedded Auditability | Data changes, access-sensitive actions, approvals, and configuration changes produce audit evidence. |

## 6.2 Architecture Decision Records

Architecture decisions governing this system are recorded in full in the LLAD Traceability Annex. The following decisions are relevant to this document.

| ID | Title | Status | Decision summary |
|---|---|---|---|
| ADR-DWS01-DATA-001 | Canonical PostgreSQL model | Accepted | DWS.01 uses a canonical PostgreSQL model for operational records. |
| ADR-DWS01-DATA-002 | Prototype entities are planning inputs | Accepted | Mock entities and TypeScript types guide schema design but are not production authorities. |
| ADR-DWS01-DATA-003 | Universal request anchor | Accepted | Stage 2 and above transactions use `s2_account.requests` as the transaction anchor. |
| ADR-DWS01-DATA-004 | Approvals attach to requests | Accepted | Approvals and escalations attach to request records without replacing request ownership. |
| ADR-DWS01-DATA-005 | Append-only audit records | Accepted | Audit records are service-written and non-deletable by normal users. |
| ADR-DWS01-DATA-006 | Evidence links are governed references | Accepted | External evidence artefacts are linked from DWS.01 records rather than owning work state. |
| ADR-DWS01-DATA-007 | Layered data access enforcement | Accepted | Sensitive data access is enforced through application and database controls. |
| ADR-DWS01-DATA-008 | Scoped dashboard aggregates | Accepted | Dashboard aggregates inherit the viewer's permitted role, unit, team, queue, and record scope. |
| ADR-DWS01-DATA-009 | Reporting from canonical events | Accepted | Reporting derives from canonical events and snapshots, not standalone dashboard state. |
| ADR-DWS01-DATA-010 | Governed automation event feed | Accepted | Automation and AI consume governed event feeds filtered by permission scope. |

## 6.3 Non-Functional Requirements Summary

The data architecture NFR summary consolidates the security, privacy, governance, operability, growth, and compliance requirements that must be tested during Build and UAT. The measurable targets remain owned by the RSR baseline and are realised through the database and service controls specified in Section 5.

| # | NFR | Data architecture control |
|---|---|---|
| 1 | NFR-02 Role-Based Authorisation | RLS, service-role boundaries, scoped queries, and dashboard permissions constrain data visibility. |
| 2 | NFR-03 Immutable Auditability | Audit events are non-deletable by normal users and written by trusted services. |
| 3 | NFR-09 Record Volume Growth | Canonical tables and analytics events support growth without changing the core record model. |
| 4 | NFR-10 Role and Unit Growth | User, role, unit, team, and permission records scale without rebuilding navigation or record ownership. |
| 5 | NFR-14 Operational Monitoring | Audit, SLA, permission exception, and integration health records feed authorised dashboards. |
| 6 | NFR-16 Data Handling Compliance | Retention, hosting, access, and sensitivity controls apply by record class. |
| 7 | NFR-17 Review Readiness | Audit logs, decision records, change records, evidence links, and permission histories remain review-ready. |

## 6.4 Open Items Summary

Open items are tracked by type so that unresolved architecture decisions remain separate from design-complete implementation and evidence work. No Type 1 data architecture design gaps are recorded in this version; the remaining items are Type 2 build or evidence tasks controlled through the CRD/AB-XC backlog.

| # | Item | Type | Resolution gate |
|---|---|---|---|
| 1 | Produce first Supabase migration set for canonical records. | Type 2 build/evidence | Before Build data-layer implementation |
| 2 | Produce RLS policy matrix and permission-scoped query tests. | Type 2 build/evidence | Before UAT permission matrix gate |
| 3 | Produce audit event taxonomy and retention classifications. | Type 2 build/evidence | Before UAT data governance gate |
| 4 | Produce analytics event taxonomy and reporting fixtures. | Type 2 build/evidence | Before UAT reporting access gate |

### 6.5 Configuration Record Backlog (CRD/AB-XC)

The following items represent fully specified design decisions that require provisioning, IaC authoring, or evidence capture work to be completed. These are not open design gaps - the design is decided and documented in the referenced sections. Progress is tracked in the CRD/AB-XC companion record.

| # | Item | Design reference | Gate |
|---|---|---|---|
| 1 | Create Supabase schemas, tables, keys, constraints, and migrations for canonical users, units, teams, tasks, requests, approvals, audit events, and KPI records. | Section 5.1.2 | Before Build data-layer implementation |
| 2 | Create the `s2_account.requests` anchor migration and lifecycle fixtures for request, approval, escalation, support, and HRA transactions. | Section 5.2.2 | Before Build request-service implementation |
| 3 | Create append-only audit policies and event taxonomy for task, request, approval, workflow, access, knowledge, performance, and configuration changes. | Section 5.3.2 | Before UAT audit evidence gate |
| 4 | Create RLS policies and permission-scoped query tests for personal, team, unit, queue, dashboard, and admin access. | Section 5.4.2 | Before UAT permission matrix gate |
| 5 | Create analytics event and KPI snapshot tables with reporting fixtures for personal, team, unit, queue, governance, and executive dashboards. | Section 5.5.2 | Before UAT reporting access gate |

# Appendix A - Glossary

| Term | Definition |
|---|---|
| Canonical record | A governed DWS.01 record that acts as the platform authority for a business object or operational event. |
| Data API | The governed application or Supabase access boundary through which services access persisted data. |
| Evidence link | A governed DWS.01 reference to proof or artefacts that support task, request, approval, or governance review. |
| RLS | Row-Level Security; database policy enforcement used to constrain row visibility and mutation rights. |
| Transaction anchor | A record that acts as the durable root for a workflow, request, approval, escalation, or support lifecycle. |

# Appendix B - Acronyms

| Acronym | Expansion |
|---|---|
| ADR | Architecture Decision Record |
| API | Application Programming Interface |
| BFF | Backend for Frontend |
| DQ | DigitalQatalyst |
| DWS | Digital Workspace Solution |
| IAM | Identity and Access Management |
| KPI | Key Performance Indicator |
| LLAD | Low Level Architecture Design |
| NFR | Non-Functional Requirement |
| RLS | Row-Level Security |
| RSR | Requirements Specification Report |
| SLA | Service Level Agreement |
| UAT | User Acceptance Testing |

# Appendix C - Reference Documents

| # | Document | Version | Reference |
|---|---|---|---|
| 1 | DWS.01 Work.Space4.0 - High Level Architecture Design | 2.0 | docs/architecture/hlad-v2.0-draft.md |
| 2 | DWS.01 Work.Space4.0 - Requirements Specification Report | 2.0 draft | docs/rsr-v2.0-draft.md |
| 3 | Identity and Access Management LLAD | 1.0 draft | docs/architecture/llad-cross-cutting-iam-v1.0-draft.md |
| 4 | Platform mock entity source | Current source | src/mocks/platform.mock.ts |
| 5 | Platform entity type definitions | Current source | src/types/platform.ts |
| 6 | Service lifecycle type definitions | Current source | src/types/serviceLifecycle.ts |
| 7 | Permission catalogue | Current source | src/config/permissions.ts |

# Appendix D - Architecture Decision Records (Full)

Architecture decisions governing this system are recorded in full in the LLAD Traceability Annex. The full entries below are included in this draft until the annex is initialised for this repository.

## ADR-DWS01-DATA-001 - Canonical PostgreSQL model

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The HLAD and RSR require DWS.01 to own official work, request, approval, SLA, evidence, audit, and reporting records. |
| Decision | DWS.01 uses a canonical PostgreSQL model for operational records. |
| Rationale | A shared model prevents fragmentation across feature modules and supports traceability, reporting, and governance review. |
| Consequences | Production implementation requires schema ownership, migration governance, foreign-key design, RLS policy design, and lifecycle tests. |

## ADR-DWS01-DATA-002 - Prototype entities are planning inputs

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The current React prototype contains TypeScript interfaces and mock data for users, units, teams, tasks, requests, approvals, workflows, queues, knowledge, audit, and KPI records. |
| Decision | Mock entities and TypeScript types guide schema design but are not production authorities. |
| Rationale | Prototype records validate journeys and domain language, while production trust requires governed persistence and data policies. |
| Consequences | Schema implementation must convert prototype shapes into reviewed migrations rather than persisting local mock state. |

## ADR-DWS01-DATA-003 - Universal request anchor

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The RSR states that `s2_account.requests` must anchor Stage 2 and above transactions including requests, approvals, escalations, support cases, and specialised workflows. |
| Decision | Stage 2 and above transactions use `s2_account.requests` as the transaction anchor. |
| Rationale | A common anchor preserves fulfilment accountability, SLA reporting, linked task history, and approval traceability. |
| Consequences | Request migrations and services must support category, requester, owner, queue, SLA, lifecycle state, evidence, audit, and linked records. |

## ADR-DWS01-DATA-004 - Approvals attach to requests

| Field | Value |
|---|---|
| Status | Accepted |
| Context | DWS.01 requires approvals, returns, rejections, delegations, escalations, rationale capture, and audit linkage to execute natively. |
| Decision | Approvals and escalations attach to request records without replacing request ownership. |
| Rationale | Approval and escalation history must remain connected to the initiating transaction while preserving independent decision records. |
| Consequences | Approval and escalation tables require foreign keys to request and task records where applicable. |

## ADR-DWS01-DATA-005 - Append-only audit records

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The RSR requires non-deletable audit events for task, request, approval, workflow, access, knowledge, performance, and configuration changes. |
| Decision | Audit records are service-written and non-deletable by normal users. |
| Rationale | Governance review and compliance readiness depend on durable, reviewable evidence. |
| Consequences | Audit tables require append-only controls, service-role write patterns, retention metadata, and review-ready reporting. |

## ADR-DWS01-DATA-006 - Evidence links are governed references

| Field | Value |
|---|---|
| Status | Accepted |
| Context | DWS.01 integrates with Microsoft 365 as a companion collaboration and evidence channel while retaining DWS.01 as the work-control authority. |
| Decision | External evidence artefacts are linked from DWS.01 records rather than owning work state. |
| Rationale | Evidence can live in companion storage while task, request, approval, and closure state remains governed inside DWS.01. |
| Consequences | Evidence records need link metadata, ownership, access scope, retention treatment, and audit event references. |

## ADR-DWS01-DATA-007 - Layered data access enforcement

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The RSR requires role, unit, team, record, dashboard, sensitivity, retention, and hosting controls before sensitive data is visible. |
| Decision | Sensitive data access is enforced through application and database controls. |
| Rationale | Client-side filtering improves user experience but cannot be trusted as the final access boundary. |
| Consequences | Services require access middleware, RLS policies, service-role constraints, and permission-scoped query tests. |

## ADR-DWS01-DATA-008 - Scoped dashboard aggregates

| Field | Value |
|---|---|
| Status | Accepted |
| Context | DWS.01 exposes personal, team, unit, support, governance, and executive reporting views with different sensitivity levels. |
| Decision | Dashboard aggregates inherit the viewer's permitted role, unit, team, queue, and record scope. |
| Rationale | Aggregates can still leak sensitive operational and performance data if they ignore viewer scope. |
| Consequences | Reporting services must apply scope filters before aggregate generation and dashboard drill-down. |

## ADR-DWS01-DATA-009 - Reporting from canonical events

| Field | Value |
|---|---|
| Status | Accepted |
| Context | The platform requires SLA, closure quality, workload, blocker, governance, knowledge, outcome, and executive reporting from governed platform records. |
| Decision | Reporting derives from canonical events and snapshots, not standalone dashboard state. |
| Rationale | Dashboard trust depends on reproducible metrics that trace back to governed records. |
| Consequences | Analytics events, KPI snapshots, source references, and reporting fixtures are required for production reporting. |

## ADR-DWS01-DATA-010 - Governed automation event feed

| Field | Value |
|---|---|
| Status | Accepted |
| Context | AI and automation may support routing, reminders, triage, recommendations, SLA risk detection, and closure-quality review while preserving permissions and audit logging. |
| Decision | Automation and AI consume governed event feeds filtered by permission scope. |
| Rationale | Automated recommendations must not bypass data permissions or act on hidden records. |
| Consequences | Automation services require event-feed filters, source traceability, rationale capture, and audit evidence. |
