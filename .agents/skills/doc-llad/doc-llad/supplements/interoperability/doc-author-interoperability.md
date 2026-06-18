# Supplement: doc-author — interoperability type

**Loaded by:** orchestrator when `report_type: interoperability`  
**Overrides:** doc-author §4.2 (§2 assembly), doc-author §4.3 (§3 assembly), doc-author §4.4 (§4 assembly), doc-author §4.6 (§5 assembly)  
**Slot files consumed:** `s3-api-architecture.md`, `s5/{domain-slug}.md`

This supplement defines the assembly protocol for document §2 (Platform Context), §3 (API Architecture), §4 (Fit-Gap Analysis), and §5 (Route Domain Architecture). §1 assembly follows the primary doc-author file unchanged.

---

## MANDATORY FORMAT RULES (apply before writing any section)

### Cover block

Do NOT use custom fence syntax. The cover block MUST be the raw OpenXML `{=openxml}` fence block from the report template. Copy it verbatim, substituting only the product name, version, and date values. Any other format will break the DOCX export. This is a hard requirement — doc-validate Track 4 FAIL if missing or wrong.

### Heading format

All section headings follow the numbered format. Examples:

```
# 1. Overview and Introduction
## 1.1 Business Context
# 3. API Architecture
## 3.1 Design Principles
# 5. Route Domain Architecture
## 5.1 Authentication and Account Management
### 5.1.1 Domain Scope
```

**Do NOT prefix headings with `§`.** The `§` symbol is used in prose references to sections (e.g. "as defined in §3.5") but never appears in the heading itself. A heading written as `## §3.1 Design Principles` is non-conformant — write `## 3.1 Design Principles`.

### H2 section opener rule (mandatory)

Every H2 sub-section (`##`) must open with **2–3 prose sentences before the first table**. There are no exceptions. A heading followed immediately by a table, a bold label, or a bullet list is non-conformant. The opener must:
- State what the sub-section covers (not a repeat of the heading)
- Set context for why this aspect of the architecture is important
- Never begin with "This section describes…" (banned Pattern-B per A-8)

### §1 conformance (supplement reminder — primary doc-author §4.1 governs)

The primary doc-author §4.1 defines §1 structure. This supplement reinforces the following non-negotiable rules to prevent agent drift:

- `# 1. Overview and Introduction` must open with **two prose paragraphs** before `## 1.1 Business Context`. The first paragraph is one orientation sentence. The second paragraph (2–3 sentences) states: what the document covers, what it specifies, and that the full platform architecture document set is recorded in §1.3.2.
- `## 1.1 Business Context` table format is **`# | Title | Description`** with exactly 5 numbered rows (Strategic Context, Sponsoring Organisation, User Communities, Data Sensitivity, Document Scope). Never use a 2-column `Field | Value` format.
- `## 1.2 Platform Vision` table format is **`# | Title | Description`** with exactly 4 numbered rows (Platform Objective, Platform Strategy, Technology Foundation, Architecture Model). Never use a `Principle | Application` format or any other 2-column variant.
- `### 1.3.1 Design Scope` table format is **`# | System | Stage coverage`**. No other columns. List only in-scope systems — do NOT list out-of-scope systems in this table.
- `### 1.3.2 Platform Architecture Document Set` is the authoritative register of ALL platform architecture documents. Format: **`ID | Document | System / Scope | Type | Status`**. Mark `Status` as `This document` for the current LLAD, `Published` for other released documents, `Planned` for future documents.
- `### 1.3.3 Baseline References` table must include a **Formal Title** column: `# | Document | Version | Formal Title`. The opening sentence must note that the full architecture document set is in §1.3.2.

---

## §2 — Platform Context assembly override (overrides doc-author §4.2)

§2 is a **platform-level section**, not a system-specific section. The heading structure must match the platform LLAD benchmark exactly:

```
## 2.1 Platform Architecture Model
## 2.2 Solution Landscape
### 2.2.1 The Hub
### 2.2.2 Application Spokes
### 2.2.3 Platform Service Spokes
## 2.3 User Communities
```

**Non-conformant §2 section names (reject immediately):**
- `## 2.2 Stakeholders and Context` — this is system-specific, not platform context
- `## 2.3 External Dependencies` — belongs in §3, not §2
- `## 2.4 Frontend Application Layer` — system-specific, not platform context
- `## 2.5 Backend and Integration Layer` — system-specific, belongs in §3

**What changes for each LLAD in §2:**
- §2.1 prose: adjust the closing sentence to state the API's specific role in the platform layer
- §2.2.1 Hub table: add `In scope` annotation for the API system being documented
- §2.2.2 Application Spokes: same platform-wide table; no system-specific additions
- §2.2.3 Platform Service Spokes: list only the third-party services the **API tier** consumes directly (not SPA-only services)
- §2.3: reframe the user communities table from the API's perspective — the API does not serve users directly; it mediates for them

---

## §4 — Fit-Gap Analysis assembly (interoperability supplement)

§4 structure must follow the hierarchical model:

```
# 4. Fit-Gap Analysis
## 4.1 Methodology            ← status vocabulary table (5 rows)
## 4.2 Requirements Traceability
### 4.2.1 Technical Requirements      ← count summary table + gap detail table
### 4.2.2 Non-Functional Requirements ← count summary table + gap detail table
## 4.3 Architecture Conformance
### 4.3.1 Integration Model           ← count summary table + gap detail table
### 4.3.2 Security Architecture       ← count summary table + gap detail table
### 4.3.3 Deployment Topology         ← count summary table
### 4.3.4 DevOps and CI/CD            ← count summary table + gap detail if any
## 4.4 Gap Register
```

**Count summary table format (mandatory for every §4.2.x and §4.3.x subsection):**

```markdown
| # | Status | Count | Notes |
|---|--------|-------|-------|
| 1 | Conformant | {N} | {summary} |
| 2 | Documented deviation | {N} | — |
| 3 | Gap | {N} | {gap IDs} |
| 4 | Deferred | {N} | — |
| 5 | Not applicable | {N} | {reason} |
| **Total** | | **{N}** | |
```

Followed immediately by a detail table **only if Gap count > 0 OR Documented deviation count > 0**:

```markdown
| Ref | Requirement (RSR/HLAD) | Status | Note |
|-----|----------------------|--------|------|
```

**Detail table rule (mandatory):** Only `Gap` and `Documented deviation` items appear in detail tables. `Conformant`, `Deferred`, and `Not applicable` items do NOT appear in detail tables. If a sub-section has neither gaps nor documented deviations, omit the detail table entirely and close with: "No gap or deviation items are recorded in this sub-section."

**§4.4 Gap Register — summary reference table (no full register in the LLAD):**

Open with: "Design gaps identified during the fit-gap assessment are recorded in full in the LLAD Traceability Annex. The table below summarises gaps relevant to this document."

```markdown
| Gap ID | Description | Priority | Status | ADGR reference |
|--------|-------------|----------|--------|----------------|
```

Do NOT reproduce Remediation, Owner, or Resolution gate columns here. Status values: Open / Resolved / Deferred.

**Plan-time tone requirement:** §4 is assessed plan-time. Do NOT use past tense ("is implemented", "was configured"). Use "the design specifies", "the current specified approach", "is required before", "is not yet specified in v1.0".

---

## §3 — API Architecture assembly

**Slot file:** `s3-api-architecture.md`  
**Section heading:** `# 3. API Architecture`

Open `# 3. API Architecture` with one orientation sentence: "This section describes the architecture of the {solution_name}, covering its API design principles, surface overview, data store integration, middleware controls, integration boundary, security model, deployment strategy, and quality obligations."

Assemble sub-sections in order. Every sub-section opens with 2–3 prose sentences before any table (H2 opener rule above — no exceptions).

### 3.1 Design Principles

1. Open with 2–3 sentences on the governing philosophy — the set of principles applied and why they matter for an API gateway tier.
2. Render `principles` as: `# | Principle | Rationale | Implementation constraint`. One row per principle. The `#` column is the row counter (01, 02, …); embed the principle ID (AP-01, AP-02, …) in the Principle column text as a prefix (e.g. "AP-01 — API-first contract boundary…"). Do NOT add a separate ID column alongside `#` — that creates two identifier columns.

### 3.2 API Surface Overview

1. Open with 2–3 sentences on the domain model — how the API is structured, the rationale for grouping routes into domains, and what the grouping achieves for consumers and maintainers.
2. Render `route_domain_map` as: `# | Domain | Route prefix | Upstream dependency | Estimated route count`.
3. Add a bridging sentence before proceeding: "Each domain is described in full in §5; the table above provides the platform-level index."

### 3.3 Data Architecture

1. Open with 2–3 sentences on the upstream store ownership model — what the API reads and writes, how credentials are managed, and the separation between structured and binary stores.
2. Render `upstream_store_table` as: `# | Store | Type | Access mode | Owned entities or containers | Credential model`.

### 3.4 Middleware Architecture

1. Open with 2–3 sentences on the request pipeline — the layered enforcement model, the registration order, and the distinction between global and route-group application.
2. Render `middleware_stack` as: `# | Middleware | Purpose | Applies to`. The `#` column is the row counter and implicitly gives registration order. Do NOT add a separate `Order` column — the row number is the order.

### 3.5 Integration Boundary

1. Open with 2–3 sentences on the boundary principle — what the API tier owns and what it explicitly delegates to external systems, and why this separation matters for security and maintainability.
2. Render `boundary_table` as: `# | Concern | Owned by | Mechanism`.

### 3.6 Real-time Layer (WebSocket/Socket.IO) — if applicable

This section is present only when the system includes a WebSocket or Socket.IO layer. If no real-time layer exists, omit this section entirely and proceed directly to §3.7.

1. Open with 2–3 sentences on the real-time layer's purpose, its relationship to the REST layer (shared process, separate middleware pipeline), and the upstream store used for message persistence.
2. Render a specification table: `# | Concern | Specification`. Rows: Transport, Auth model, Message persistence, Events handled, Upstream store.
3. Reference the relevant security gap by Gap ID if it also applies to the real-time connection auth model.

### 3.7 Security Architecture

1. Open with 2–3 sentences on the layered security posture — the token validation chain, RBAC enforcement model, and the gap between current state and production-ready state (referencing gap IDs where applicable).
2. Render `security_control_table` as: `# | Control | Mechanism | Enforcement point | Baseline reference`.

### 3.8 Deployment and Environment Strategy

1. Open with 2–3 sentences on the dual-mode deployment model — what the two runtime environments are, why they exist, and what the codebase-sharing strategy is.
2. Render `environment_table` as: `# | Environment | Runtime | Hosting | Deployment trigger`.

### 3.9 DevOps and CI/CD

1. Open with 2–3 sentences on the pipeline model — the trigger strategy, the gate approach, and the rollback mechanism.
2. Render `pipeline_stage_table` as: `# | Stage | Trigger | Action | Gate`.

### 3.10 Performance and Observability

1. Open with 2–3 sentences on the quality obligations and the current observability posture — what is in place, what is missing, and what is tracked as a gap.
2. Render `nfr_table` as: `# | Constraint | Target | Measurement approach`. The `#` column holds the NFR identifier (NFR-05, NFR-06, …) — not a sequential row number. Do NOT add a separate `NFR ID` column alongside `#`.

### 3.11 Test Strategy

1. Open with 2–3 sentences on the test pyramid approach and the contract testing gap.
2. Render toolchain table: `# | Test type | Tool | Gate | Evidence artefact`.
3. If no OpenAPI spec or Postman collection exists: the Contract row must be present with `Tool: Not yet authored` and `Gate: Per domain implementation gate`. Reference the gap ID.

---

## §5 — Route Domain Architecture assembly

**Slot files:** `s5/{domain-slug}.md` — one per domain.  
**Section heading:** `# 5. Route Domain Architecture`

Open `# 5. Route Domain Architecture` with 2–3 prose sentences introducing the domain model — the number of domains, the grouping rationale, and what the section covers per domain.

Process one domain at a time. Gate fires after each domain is complete.

### Domain heading format

```
## 5.N Domain Name
### 5.N.1 Domain Scope
### 5.N.2 Operation Model
### 5.N.3 Middleware and Enforcement
### 5.N.4 Upstream Integration
### 5.N.5 Security
### 5.N.6 Architectural Decisions and Open Items
```

**Design-time principle (mandatory):** §5 is a design document, not a configuration report. It must NOT contain:
- Specific route paths (e.g. `GET /api/v1/auth/signin`) — those are implementation details that belong in the OpenAPI spec or configuration report
- Specific code-level file names in prose — they may appear in table cells as design specifications but not in running prose
- Per-route auth columns — auth is specified at the capability-group level, not per-route

H2 for domain group (`## 5.N`). H3 for sub-sections (`### 5.N.M`). No `§` prefix anywhere. Do not skip heading levels.

### Domain block opener (mandatory — 3 sentences)

**The domain opener is 3 complete prose sentences. It is NOT a bold label, NOT a key-value pair, NOT a bullet list.**

The three sentences follow this pattern:
1. What business capability this domain serves — name the user outcome or programme function, not the implementation.
2. What the domain's scope boundary is — what it includes and what adjacent domains or systems handle instead.
3. One architectural fact that characterises this domain — its auth model, its upstream dependency, or its design decision that distinguishes it from other domains.

### 5.N.1 Domain Scope

1. 2–3 sentences stating what this domain covers, what it excludes, and why those exclusions are owned elsewhere.
2. Render in-scope capabilities as a table: `# | Capability`. Each capability is a business function or operation group — not a route path. Do NOT add a `**In scope:**` bold label above the table.
3. **Bridging sentence (mandatory):** After the in-scope table and before the out-of-scope table, write one prose sentence that introduces the exclusions.
4. Render out-of-scope items as a separate table: `# | Exclusion | Owning domain`. Name the owning domain for every exclusion. Do NOT use a bullet list for either in-scope or out-of-scope items — tables are mandatory.
5. Do NOT list specific route paths — capability names only.

### 5.N.2 Operation Model

1. Open with 1–2 sentences on the auth model for this domain at the capability-group level.
2. Render `# | Capability group | Operation type | Auth requirement`. Auth requirement column describes the auth PATTERN (e.g. "Bearer token required", "Bearer token + claim validation", "Bearer token + organisation-scoped ownership check"), not middleware names.
3. Do NOT include a "Contract reference" line.

### 5.N.3 Middleware and Enforcement

1. Open with 1–2 sentences on the middleware profile — what is applied globally vs per-route, and any notable domain-specific controls.
2. Render `# | Middleware | Scope | Purpose`.

### 5.N.4 Upstream Integration

1. Open with 2–3 sentences on what this domain reads from and writes to, and the credential model used.
2. Render `# | Route group | Upstream service | Entity or container | Access mode`.

### 5.N.5 Security

1. Open with 2–3 sentences on the security posture of this domain — the sensitivity of the data it handles, the auth enforcement approach, and any gaps.
2. Render `# | Route group | Auth requirement | AuthZ check location | Sensitivity`.

### 5.N.6 Architectural Decisions and Open Items

This section always uses a two-table structure. Do NOT use prose paragraphs for ADR descriptions — the full ADR record lives in Appendix D and the ADR annex, not in §5.

**Table 1 — Governing decisions (mandatory if any ADRs apply to this domain):**

Open with: "The following architectural decisions govern this domain. Full records are in Appendix D and the ADR annex."

Render as:

```markdown
| # | Decision | ADR ref | Status |
|---|---------|---------|--------|
| 1 | {one-line statement of what was decided} | ADR-XXX-NNN | Accepted |
```

If no ADRs apply to this domain: omit Table 1 and the opening sentence. Begin the section directly with the standard narrative.

**Standard narrative (mandatory, verbatim, precedes the open items table):**

> "The items below record unresolved design and implementation questions arising from the {domain name} domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery."

**Table 2 — Open items (mandatory):**

Render as:

```markdown
| # | Open item | Gap ref | Owner | Resolution gate |
|---|-----------|---------|-------|----------------|
| 1 | {description} | {gap ID (Staging blocker) or —} | {owner} | {gate} |
```

If no open items: write "No open items are recorded for this domain." Do NOT omit the section entirely.

---

## Appendix F — API Catalog

**Appendix F does not appear in the LLAD.** The LLAD is a design-time document — no OpenAPI contract exists yet and the route surface has not been finalised. An API Catalog built at design time would be speculative and would create a maintenance burden as the implementation evolves.

The API Catalog belongs in the **Configuration Report (MCR)** for this system, assembled after implementation is confirmed.
