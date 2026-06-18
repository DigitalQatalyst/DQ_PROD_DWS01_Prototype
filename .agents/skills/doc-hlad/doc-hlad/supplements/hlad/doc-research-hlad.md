# Supplement: doc-research — HLAD type

**Loaded by:** orchestrator when `report_type: hlad`  
**Overrides:** doc-research §4.3 (Section 3 fields), §4.4 (Section 4 fields), §4.5 (Section 5 per-unit fields), §4.6 (Section 6 fields)  
**Slot files produced:** `writing-pack/s3-architecture-context.md`, `writing-pack/s4-architecture-software.md`, `writing-pack/s5/{unit-slug}.md` (13 files), `writing-pack/s6-appendices.md`

> **Scope notice:** This supplement covers §3–§6 only. §1 and §2 are researched by `supplements/_shared/doc-research-platform-context.md`, which is loaded before this supplement. Do not re-research §1 or §2 here.

The shared supplement (`doc-research-platform-context.md`) owns §1 and §2 research. This supplement covers §3 through §6. Do not re-research §1 or §2 content here.

---

## Platform context reference for §3–§6

Before researching any §3–§6 section, read `<base_dir>/shared/platform-context.md`. It provides:

- **§2** — the three canonical platform tiers (Client Tier, Data & Intelligence Layer, Application & Integration Layer) with their exact technology components. Use these tier names and technology labels verbatim in all §4 and §5 content.
- **§3** — the database schema map (`platform`, `s1_discovery`, `s2_account`, `s3_ops`, `s4_{vertical}`). Use these schema names when researching §5.9 Data Architecture.
- **§4** — guardrails G-01–G-07. These are platform-wide architectural constraints. §3–§6 research must not produce content that conflicts with a guardrail — flag and record any conflict as a Type 1 gap.

For deeper detail on any platform aspect, read the relevant priming document from `ai-agent-rules/priming/` (all six are listed in `doc-research-platform-context.md`). The priming documents are the authoritative source for technology choices, development rules, and NFRs that inform §4 and §5 research.

---

## §3 — Architecture Spec — Context research (`s3-architecture-context.md`)

### §3.1 Capability Canvas

Extract the platform's capability areas from the business requirements brief and platform context documents:

- Identify each major capability area the platform delivers (e.g. user onboarding, programme management, marketplace, analytics, identity).
- For each capability area: state the description (what the platform does in this area) and the responsible component (which system or module owns it).
- Record as a list of rows for the capability canvas table: `Capability Area | Description | Responsible Component`.
- Minimum 5 capability areas. Fewer = gap; record in `writing-pack.gaps.md`.
- Source: business requirements brief (functional scope), platform context documents (repo landscape and system roles).

**Slot fields to populate in `s3-architecture-context.md`:**

```yaml
section: "3.1"
capability_canvas_intro: "[1–2 sentences framing the capability canvas scope]"
capability_canvas_rows:
  - capability_area: ""
    description: ""
    responsible_component: ""
```

### §3.2 Capability Canvas — Platform Variant

Extract the platform-specific view of the same capability areas:

- Identify which capabilities are directly impacted by the platform delivery programme versus which are enabled (background infrastructure, shared services, etc.).
- This variant highlights the programme's delivery priorities within the full capability canvas.
- Record as the same three-column structure as §3.1 but scoped to the platform programme lens.
- Source: business requirements programme scope statements, platform context stage indicators.

**Slot fields (append to `s3-architecture-context.md`):**

```yaml
section: "3.2"
platform_variant_name: "[SHORT_NAME from context]"
capability_canvas_variant_intro: "[1–2 sentences framing the platform-variant scope]"
capability_canvas_variant_rows:
  - capability_area: ""
    description: ""
    responsible_component: ""
```

---

## §4 — Architecture Spec — Software research (`s4-architecture-software.md`)

### §4.1 Technology Stack

Extract the technology decisions from the platform priming documents and any system-specific baseline:

- **Primary source:** `platform-context.md` §2 (canonical tier technology components) and `priming-accepted-tech-stack.md` (default stack per layer with rationale). Use these as the baseline; the system-specific baseline document extends or specialises them.
- For each technology layer (frontend, backend, data, integration, identity, DevOps, infrastructure): identify the specific technology, its purpose within the platform, and any notes on version, licensing, or constraints.
- Use the canonical DQ platform technology labels: React / Next.js / React Native (frontend), Express.js (backend), PostgreSQL via Supabase / PostgREST / Hasura (data), Redis (cache/session). Do not substitute different technologies unless the system-specific baseline explicitly documents a deviation with rationale.
- Minimum 8 technology rows across all layers. Fewer = gap.
- Source (in priority order): `priming-accepted-tech-stack.md`, `platform-context.md` §2, system-specific baseline, deployment design documents.

**Slot fields in `s4-architecture-software.md`:**

```yaml
section: "4.1"
technology_stack_intro: "[1–2 sentences framing technology selection context]"
technology_stack_rows:
  - layer: ""
    technology: ""
    purpose: ""
    notes: ""
```

### §4.2 Modules & Functions

Extract the module and function decomposition:

- For each module (logical grouping of functionality): identify the technology stack it runs on, the function it performs, and the responsible actor or role.
- Modules correspond to major system components (e.g. SPA frontend, API server, analytics server, CRM, marketplace, AI Agent layer).
- Source: HLAD implementation architecture, platform context repo roles.

**Slot fields (append to `s4-architecture-software.md`):**

```yaml
section: "4.2"
modules_intro: "[1–2 sentences framing module structure]"
module_rows:
  - module: ""
    function: ""
    description: ""
    responsible_actor: ""
```

### §4.3 Deployment Stack

Extract deployment topology for each environment:

- For each environment (Dev, Staging, UAT, Production): identify the component, deployment target, and any notes on topology or tenancy.
- Source: platform context deployment headlines, deployment design documents.

**Slot fields (append to `s4-architecture-software.md`):**

```yaml
section: "4.3"
deployment_stack_intro: "[1–2 sentences framing deployment topology context]"
deployment_stack_rows:
  - environment: ""
    component: ""
    deployment_target: ""
    notes: ""
```

---

## §5 — Architecture Views research (`writing-pack/s5/{unit-slug}.md`)

Research each of the 13 architecture view units from `templates/hlad-skeleton.md`. Produce one slot file per unit. Diagram content is not researched here — diagrams are deferred to the diagram phase; record a placeholder reference only.

Process units in registry order (§5.1 through §5.13).

### Common slot file structure for each unit

```yaml
unit_slug: "{slug}"
gate: {N}
spec_group: "{Business Spec | Technology Spec | DevOps Spec}"
diagram_skill: "{diag-hlad | diag-integration | diag-data | diag-security | diag-deployment}"

view_description: >
  [2–4 sentences describing what this architecture view shows, why it matters,
   and which aspect of the platform it illuminates. Source from the business
   requirements brief and platform context documents.]

applicable_principles:
  - id: "AP-01"
    relevance: "[one sentence on how this principle constrains or shapes this view]"

ad_decisions:
  - id: "AD-NN"
    decision_area: ""
    decision_statement: ""
    rationale: ""
    impact: ""
    status: "Accepted | Decision required (Gap G-nn)"

cl_clarifications:
  - id: "CL-NN"
    clarification_area: ""
    clarification: ""
    rationale: ""
    impact: ""

view_specific_content: {}
  # Unit-specific keys; see per-unit research requirements below.
```

### Per-unit research requirements

**5.1 system-context (Gate 5)**  
- Identify the platform's purpose, scope, and key outputs at system level.
- Record rows for: Purpose (why the platform exists), Scope (what is in scope at system level), Key Outputs (what the platform produces).
- `view_specific_content.context_rows` (3 rows).

**5.2 system-actors (Gate 6)**  
- Identify all actor groups that interact with the platform (human and system actors).
- For each actor group: title and description of their role and interaction.
- `view_specific_content.actor_rows` (minimum 5 actor groups from business requirements personas and system integrations).

**5.3 system-interfaces (Gate 7)**  
- Identify all interface types the platform exposes or consumes (REST APIs, webhooks, CRM connectors, identity flows, marketplace APIs, etc.).
- For each interface type: title and description.
- `view_specific_content.interface_rows`.

**5.4 system-journeys (Gate 8)**  
- Identify the named user flows / journeys the platform supports (minimum 3 from business requirements).
- For each journey: name, description, and a one-line summary of the flow sequence.
- `view_specific_content.journey_blocks` (each has `name`, `description`, `flow_summary`).

**5.5 conceptual-architecture (Gate 9)**  
- Identify 5–9 component groups at conceptual level (not implementation detail).
- Each group: purpose.
- `view_specific_content.component_groups` (5–9 rows with `component_group`, `purpose`).

**5.6 logical-architecture (Gate 10)**  
- Identify the logical layers and which component groups belong to each layer.
- Each layer: component group and its purpose within the layer.
- `view_specific_content.logical_layers` (rows with `component_group`, `purpose`).

**5.7 implementation-architecture (Gate 11)**  
- Map the implementation layers to the DQ platform's three canonical tiers from `platform-context.md` §2. The layer names must align with the platform model:
  - **Client Tier** — React / Next.js (web), React Native (mobile); design system; no business logic
  - **Application & Integration Layer** — Express / BFF APIs (Routes → Controllers → Services → Repositories); domain services; background jobs; external integrations
  - **Data & Intelligence Layer** — PostgreSQL (via Supabase / PostgREST / Hasura); Redis; analytics infrastructure
  - **Platform Foundation** — IAM, audit, notifications, file storage, CI/CD, observability (cross-cutting; not a runtime layer but present in the implementation view)
- Each layer: purpose drawn from `platform-context.md` §2 and `priming-target-architecture.md` §3, extended with any system-specific detail.
- Guardrail check: confirm no layer description assigns business logic to the Client Tier (G-01) or describes direct client-to-database access (G-02). Flag as Type 1 gap if found.
- `view_specific_content.implementation_layers` (rows with `layer`, `purpose`).

**5.8 integration-architecture (Gate 12)**  
- Identify all key integration points between system components.
- For each integration: source, target, purpose, and interface details (protocol, format).
- `view_specific_content.integration_rows` (rows with `source`, `target`, `purpose`, `interface_details`).

**5.9 data-architecture (Gate 13)**  
- Use the platform database schema map from `platform-context.md` §3 and `priming-database-architecture.md` §1–§4 as the structural baseline:
  - `platform` schema — IAM, audit, notifications, files, config (Foundation)
  - `s1_discovery` schema — public content, listings, leads (Stages 0–1)
  - `s2_account` schema — workspace, requests, documents, payments (Stage 2)
  - `s3_ops` schema — workflow, tasks, approvals, orders, invoices (Stage 3)
  - `s4_{vertical}` schema — one schema per specialised vertical (Stage 4)
- Identify key entities and their data stores. Label each entity with its owning schema (e.g. `s2_account.requests`).
- Guardrail check: confirm that no foreign key reference crosses schema boundaries in the wrong direction — `s4_*` → `s3_ops` → `s2_account` → `s1_discovery` → `platform` only (G-04). Flag violations as Type 1 gap.
- Source: `priming-database-architecture.md`, `platform-context.md` §3, system-specific data model or ERD.
- For each entity: title, group (schema / entity category), and detail (what the entity represents and which schema and store owns it).
- `view_specific_content.data_rows` (rows with `title`, `group`, `detail`).

**5.10 security-architecture (Gate 14)**  
- Derive security principles from `platform-context.md` guardrails (G-01–G-07) and `priming-nonfunctional-specs.md` §4–§5 (security and data protection NFRs). These are the platform baseline; system-specific principles extend them.
- Key platform security principles to include (sourced from `platform-context.md` §4):
  - G-02: All cross-tier boundaries are explicit API contracts — no client makes direct database calls
  - G-03: RLS and database roles enforced at the Data & Intelligence Layer boundary — the data layer enforces row-level access independently of application-tier auth checks
  - G-05: Stateless application instances — no session state in memory; Redis is the session store
  - G-06: Platform Foundation IAM is the single identity and access management service — not reimplemented per stage or solution
- Identify data security and compliance obligations from the system-specific baseline and `priming-nonfunctional-specs.md`.
- Source: `platform-context.md` §4, `priming-nonfunctional-specs.md`, system-specific security requirements.
- `view_specific_content.security_principles` and `view_specific_content.data_security_compliance` (two tables).

**5.11 deployment-environment (Gate 15)**  
- Identify each deployment environment and its purpose.
- Source from deployment design documents.
- `view_specific_content.deployment_env_rows` (rows with `environment`, `purpose`).

**5.12 source-code-branching (Gate 16)**  
- Identify repository structure, branching strategy, PR process, versioning approach, and merge governance.
- `view_specific_content.branching_rows` (rows with `item`, `detail`).

**5.13 cicd-pipelines (Gate 17)**  
- Identify CI/CD pipeline stages from the pipeline configuration.
- For each stage: title and description.
- `view_specific_content.pipeline_rows` (rows with `title`, `description`).

---

## §6 — Appendices research (`writing-pack/s6-appendices.md`)

### AD-NN Architectural Decisions

- Review the business requirements brief for explicit architecture decisions recorded or implied.
- Review any prior HLAD version if available.
- For each decision: populate all six fields (ID, Decision Area, Decision Statement, Rationale, Impact, Status).
- Minimum 3 AD-NN entries. Fewer = gap.
- Status values: `Accepted` | `Documented deviation` | `Decision required (Gap G-nn)`.
- A partial AD (any field blank) must NOT be written to draft — record as a gap in `writing-pack.gaps.md` instead.
- Record `ad_rows` in `s6-appendices.md`.

### CL-NN Architectural Clarifications

- Identify clarifications raised during research (questions resolved between architect and stakeholders, or unresolved items that affect architecture).
- For each: ID, Clarification Area, Clarification statement, Rationale, Impact.
- Minimum 3 CL-NN entries where clarifications were raised during this research.
- Record `cl_rows` in `s6-appendices.md`.

### Annex references

- Record that `annex-gaps.md` and `annex-adrs.md` exist as companion cross-cutting annex files (since HLAD `annex_participation: full`).
- Do not reproduce annex content — reference their paths only.

**Slot fields in `s6-appendices.md`:**

```yaml
ad_rows:
  - id: "AD-01"
    decision_area: ""
    decision_statement: ""
    rationale: ""
    impact: ""
    status: ""

cl_rows:
  - id: "CL-01"
    clarification_area: ""
    clarification: ""
    rationale: ""
    impact: ""

annex_gaps_path: "workspace/llad-annex/annex-gaps.md"
annex_adrs_path: "workspace/llad-annex/annex-adrs.md"
```

---

## Gap protocol

During §3–§6 research, apply the following gap classification before recording any gap:

- **Type 1 — Design decision outstanding:** Architect must still make an architectural choice. Record in `writing-pack.gaps.md` with status `Open`. Flag for §6 AD-NN with `Decision required (Gap G-nn)`.
- **Type 2 — Evidence / confirmation task:** The design intent is clear from the business requirements brief and platform context, but a specific artefact or configuration needs confirmation. Record in `writing-pack.gaps.md` with status `Needs confirmation`.
- **Type 3 — Resolved during research:** The gap was investigated and closed during this research pass. Record as `Resolved` in `writing-pack.gaps.md`.

## Closure check

Before signalling research complete:

- Confirm all 13 `s5/{slug}.md` slot files are produced (one per unit in the registry).
- Confirm `s3-architecture-context.md` has both §3.1 and §3.2 populated.
- Confirm `s4-architecture-software.md` has §4.1, §4.2, and §4.3 populated.
- Confirm `s6-appendices.md` has ≥3 AD-NN rows and ≥3 CL-NN rows (or gaps recorded).
- Confirm no `[TBD]` values remain without a corresponding gap entry in `writing-pack.gaps.md`.
- Confirm each AP-NN ID listed in §1.3 is cited in at least one §5 slot file (s5/{slug}.md). An uncited principle is a gap — record in writing-pack.gaps.md.
