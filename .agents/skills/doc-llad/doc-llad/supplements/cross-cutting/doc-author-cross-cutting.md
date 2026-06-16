# Supplement: doc-author — cross-cutting type

**Loaded by:** orchestrator when `report_type: cross-cutting`
**Overrides:** doc-author section 4.2 (section 2 assembly), doc-author section 4.3 (section 3 assembly), doc-author section 4.6 (section 5 assembly)
**Slot files consumed:** `s3-concern-overview.md`, `s5/{concern-slug}.md`

---

## Intro narrative length rules (cross-cutting type)

These rules are calibrated against a benchmark system LLAD. Apply to every heading level in every cross-cutting document.

| Heading level | What it covers | Minimum length | Common rejection pattern |
|---------------|---------------|---------------|--------------------------|
| **H1** (top-level sections 1, 2, 3) | Top-level section openers | 3+ sentences; enumerate sub-sections by name | One sentence that just names the section |
| **H2** (sub-sections 3.1-3.4, 4.N, 6.N) | Sub-section openers | 2-3 substantive sentences before first table or H3 | "The following table describes..." alone is too short |
| **H3** (concern domain openers, section 5.N) | What the domain governs | 2 sentences minimum: (1) what the domain governs; (2) the platform's obligation | Single sentence or absent opener |
| **H4** (sub-section openers 5.N.M) | Domain Scope, Design, Per-System, Constraints, Open Items | At least 1 sentence before the first table | Table with no preceding sentence |

**Section 3.4 Design Principles** requires 2 full paragraphs: paragraph 1 states what the principles are and their baseline source; paragraph 2 explains they are enforced constraints and summarises each principle's intent. A single-paragraph opener is rejected.

**Section 5.N.1 Domain Scope** opener: "This concern domain governs the following aspects of {domain name}: [brief list]. The following aspects are out of scope for this domain: [brief list]."

**Section 5.N.4 Constraints opener:** 1 sentence before the constraints table explaining why these are non-negotiable (compliance, contractual, security mandate).

---

## Section 2 — Platform Context assembly override (overrides doc-author section 4.2)

Section 2 is a **platform-level section**, not a system-specific section. The heading structure must match the platform LLAD benchmark exactly:

```
## 2.1 Platform Architecture Model
## 2.2 Solution Landscape
### 2.2.1 The Hub
### 2.2.2 Application Spokes
### 2.2.3 Platform Service Spokes
## 2.3 User Communities
```

**Non-conformant section 2 section names (reject immediately):**
- `## 2.4 Frontend Application Layer` — system-specific, not platform context
- `## 2.5 Backend and Integration Layer` — system-specific, belongs in section 3
- `## 2.2 Stakeholders and Context` — system-specific, not platform context

**What changes for each cross-cutting document in section 2:**
- Section 2.1 prose: adjust the closing sentence to state how this cross-cutting concern governs the platform architecture model (e.g. for an IAM document: "All authenticated interactions in this model are governed by the identity and access management framework defined in this document.")
- Sections 2.2.1-2.2.3: same platform-wide tables as in system LLADs; no concern-specific additions to the solution landscape tables
- Section 2.3: reframe the user communities table from the concern's governance perspective — a cross-cutting document governs how users are served, rather than directly serving them; the prose opener must reflect this (e.g. "The following user communities are subject to the access controls and identity policies defined in this document.")

---

## Section 3 — Concern Architecture Overview assembly

**Slot file:** `s3-concern-overview.md`

Open section 3 with one sentence: "This section establishes the mandate, governing boundaries, and design principles for the {concern name} cross-cutting concern, and defines its relationship to companion cross-cutting architecture documents."

### Section 3.1 Concern Mandate

1. Render `mandate_statement` as a prose paragraph (already formal prose — render as-is).
2. Add one sentence rendering `risk_without`.

### Section 3.2 Governing Boundaries

1. Open with 1 sentence: "The following systems and repositories are within the governance scope of this document."
2. Render `in_scope_systems` as: `# | System | Type | Concern applicability`.
3. If `out_of_scope_systems` non-empty: add "The following are explicitly excluded." then render `# | System | Reason`.
4. Render `authority_statement` as a prose paragraph.

### Section 3.3 Relationship to Other Cross-Cutting Documents

1. Open with 2 sentences on the interdependency model — what this document depends on and what depends on it.
2. Render `dependencies_table` as: `# | This document | Depends on | What it needs | Why`.
3. Render `consumed_by_table` as: `# | Document | What it takes from this document`.
4. If no dependencies: state "This document has no dependency on other cross-cutting documents." — do not omit the section.

### Section 3.4 Design Principles

Render `principles` as: `ID | Principle | Rationale | Implication | Baseline reference` (5 columns; no leading `#` — `ID` in AP-NN format is the row identifier).

---

## Section 4 — Fit-Gap Analysis

**Note:** Section 4 is populated in full for all cross-cutting LLAD versions. Do not render a placeholder scaffold. All four sub-sections must be substantively authored.

### Section 4.1 Methodology

Open with 2-3 sentences describing the fit-gap approach: which baseline documents were assessed (HLAD, RSR NFRs, and any prior LLADs for this concern), what dimensions were evaluated (functional coverage, constraint compliance, and open design decisions), and how gaps are classified.

**Gap classification (mandatory — include in section 4.1 prose):**
- **Type 1 — Design decision outstanding:** The architect must still make an architectural choice. These are the only valid entries in section 4.4. Registered in the annex with status `Open`.
- **Type 2 — Build/evidence task (design-complete):** The design is decided and documented in this LLAD, but provisioning, IaC authoring, drill execution, or evidence capture remains. These belong in section 6.5 CRD/AB-XC — **not in section 4.4**. Registered in the annex with status `Deferred (CRD/AB-XC)`.
- **Type 3 — Resolved:** The design choice was made and incorporated into this document. Registered in the annex with status `Resolved` or `Deferred`.

### Section 4.2 Baseline Traceability

Open with 1-2 sentences on which baseline documents were traced and what the trace confirms.

Use the **two-table pattern**:

**Table 1 — Summary count (mandatory first):**

`# | Status | Count | Notes`
- One row per status value present; Notes column: 1 sentence maximum.
- Final row: `Total | | {N} |`

**Table 2 — Gap and deviation rows only (omit if no gaps exist):**

`# | Requirement ref | Baseline statement | Concern domain | Status | Note`
- Include ONLY rows where Status is `Gap` or `Not applicable` — conformant rows are covered by Table 1 count.
- **Note column: 1 sentence maximum.**
- **Requirement ref:** HLAD section-N or RSR section-N code.
- **Baseline statement:** the specific requirement being traced (15 words maximum).
- **Concern domain:** the section 5.N domain that satisfies this requirement.

Minimum 5 total requirements traced across both tables. Fewer = underdeveloped traceability.

### Section 4.3 NFR Coverage

Open with 1 sentence on the NFR scope for this concern.

Use the same **two-table pattern** as section 4.2:

**Table 1 — Summary count:**

`# | Status | Count | Notes` — one row per status; 1-sentence Notes; Total row.

**Table 2 — Gap rows only:**

`# | NFR ID | Requirement | Mapped domain | Status | Gate`
- **NFR ID:** from RSR NFR codes.
- **Requirement:** the NFR text (15 words maximum).
- **Mapped domain:** the section 5.N domain that governs compliance.
- **Status:** `Specification conformant` / `Gap — design decision outstanding ({Gap-ID})` / `Not applicable`.
- **Gate:** the promotion gate at which conformance is verified.

Minimum 3 NFRs traced. Include at least one data-residency NFR and one security NFR.

### Section 4.4 Design Gaps

Open with the mandatory sentence: "Design gaps identified during the fit-gap assessment are recorded in full in the LLAD Traceability Annex (`workspace/llad-annex/annex-gap-register.md`). The table below summarises gaps relevant to this document."

**CRITICAL — section 4.4 contains only Type 1 gaps.** Every row must represent an unresolved architectural choice — a decision the architect still needs to make. Design-complete provisioning, IaC authoring, drill execution, or evidence capture tasks are Type 2 items and belong in section 6.5, not here.

Render: `# | Gap ID | Description | Priority | Owner | Resolution gate`

- **Gap ID:** prefixed form `{SYS}-G-{NNN}` from the annex.
- **Description:** what architectural decision is still outstanding (not what has not been deployed).
- **Priority:** Critical / High / Medium / Low.
- **Owner:** architect role responsible for resolving the design decision.
- **Resolution gate:** specific promotion gate or artefact trigger.

**Fail indicator:** If a row description says "specified in section 5", "design-complete", "defined in section 5", "not provisioned", or similar, it is a build task — move it to section 6.5.

---

## Section 5 — Concern Domains assembly

**Slot files:** `s5/{concern-slug}.md` — one per domain.

Process one domain at a time. Gate fires after each domain is complete.

**Domain heading:** H2 `## 5.N Domain Name`. Sub-sections: H3 `### 5.N.M Sub-section Name`. Do not skip heading levels.

**Domain block opener (mandatory — 2-3 sentences):**
State what this concern domain governs, its position within the broader cross-cutting concern, and what the platform's obligation is in this domain. Do not open with a table. Do not list sub-section names.

### Section 5.N.1 Domain Scope

1. 2-3 sentences stating what this concern domain governs, its scope boundary, and what adjacent documents or domains own the excluded areas.
2. Render in-scope aspects as a table: `# | Aspect`. Each row is a governed area or obligation — not a heading.
3. Render out-of-scope aspects as a separate table: `# | Exclusion | Governing document`. Name the governing document for every exclusion. Do NOT use bullet or prose lists for either in-scope or out-of-scope items — tables are mandatory.

### Section 5.N.2 Design

1. Open with 2-3 sentences framing the design — the governing model, the key decisions, and the constraints applied.
2. Render `design_content` as the substantive specification. This section's structure varies by domain:
   - For identity/auth domains: use tables with columns appropriate to the content (e.g. `# | Flow | Trigger | Steps | Token result` for AuthN flows; `# | Role | Permissions | Enforcement point` for RBAC).
   - For schema/data domains: use `# | Entity/Schema | Owner | Contents | Constraints` and field tables where needed.
   - For standards/contract domains: use `# | Standard | Rule | Example | Enforcement`.
   - For topology/infrastructure domains: use `# | Component | Purpose | Configuration | Dependencies`.
3. No prescribed table columns — choose columns appropriate to the content. Maximum 5 columns.

### Section 5.N.3 Per-System Application

1. Open with 1-2 sentences on how uniformly or variably this domain applies across the platform.
2. Render `per_system_table` as: `# | System | How concern applies | Key artefact | Conformance status`.
3. **Conformance status values (pre-implementation specification):**
   - `Specification conformant — [gate condition]` — the design as specified satisfies this system's concern obligation; state the gate or artefact at which conformance is verified.
   - `Gap — design decision outstanding ({Gap-ID})` — a registered Type 1 gap exists; include the Gap ID.
   - `Not applicable` — the concern domain does not apply to this system.
   - `Deferred (CRD/AB-XC)` — design is complete but provisioning or evidence capture is tracked in section 6.5.
   - **Never use:** "Partial", "not yet deployed", "not yet live", "not implemented", "not configured", "not in place", "Gap — not deployed", "currently not". These are post-implementation evidence phrases.

### Section 5.N.4 Constraints and Obligations

1. Open with 1-2 sentences on the nature and source of the constraints.
2. Render `constraints_table` as: `# | Constraint | Source | Applies to | Consequence of breach`.

### Section 5.N.5 Architecture Decisions and Open Items

This section always uses a two-table structure.

**Table 1 — Governing decisions (if any ADRs or cross-cutting design decisions apply to this concern domain):**

Open with: "The following architectural decisions govern this concern domain. Full records are in Appendix D and the ADR annex."

Render as: `# | Decision | ADR ref | Status`
- Decision column: one declarative sentence stating what was decided. Do not reproduce rationale — that is in Appendix D.
- Status: Accepted / Superseded.
- If no decisions apply: omit Table 1 and proceed directly to the narrative.

**Standard narrative (mandatory, verbatim, precedes the open items table):**

> "The items below record unresolved design and implementation questions arising from the {concern domain name} domain. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery."

**Table 2 — Open items (mandatory):**

Render as: `# | Open item | Gap ref | Owner | Resolution gate`
- Gap ref: registered gap ID if this item resolves a gap, or `—` if not. Append `(Staging blocker)` for Critical or High gaps.
- Resolution gate: specific and actionable.
- If no open items: "No open items are recorded for this concern domain." — do not omit the section.

---

## Section 6.5 — Configuration Record Backlog (CRD/AB-XC)

Section 6.5 is the designated location for **Type 2 (build/evidence)** items — design decisions that are fully specified in this LLAD but whose provisioning, IaC authoring, drill execution, or evidence capture remains outstanding.

**Section 6.5 must not contain Type 1 items (open design decisions) — those belong in section 4.4.**

Heading: `### 6.5 Configuration Record Backlog (CRD/AB-XC)`

Open with: "The following items represent fully specified design decisions that require provisioning, IaC authoring, or evidence capture work to be completed. These are not open design gaps — the design is decided and documented in the referenced sections. Progress is tracked in the CRD/AB-XC companion record."

**Role names** used in the Owner column must come from the platform role taxonomy. Use role names, not person names (e.g. `DevOps Engineer`, `Technical Lead`, `Platform`).

Render: `# | Item | Design reference | Gate`

- **Item:** the specific build or evidence task (not an architectural choice).
- **Design reference:** the section 5.N.M section where the design is specified — proves the design is complete.
- **Gate:** the promotion gate at which this item must be done.

If no Type 2 items exist: "No build or evidence backlog items are recorded for this document version." — do not omit the section once it has been established in the document.
