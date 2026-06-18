# Supplement: doc-author — architecture type

**Loaded by:** orchestrator when `report_type: architecture`  
**Overrides:** doc-author §4.3 (§3 assembly) and §4.6 (§5 feature module assembly)  
**Slot files consumed:** `s3-architecture.md`, `s5/{stage}/{slug}.md`

This supplement defines the assembly protocol for document §3 ([System] Architecture) and §5 (Feature Modules) in an architecture-type LLAD. §1, §2, and §4 assembly follows the primary doc-author file unchanged.

---

## §3 — [System] Architecture assembly

**Slot file:** `s3-architecture.md`

Open §3 with one sentence: "This section describes the architecture of the {solution_name}, covering its structural, data, behavioural, integration, security, deployment, and quality dimensions."

Assemble sub-sections in order. Each sub-section opens with 2–3 sentences of formal prose (not a table recap) before any table. Follow A-11 and A-20 from the primary doc-author assembly rules.

### §3.1 Design Principles

Render `principles` as a table: `# | ID | Principle | Rationale | Implication | Baseline reference`. One row per principle. `baseline_ref` populates the Baseline reference column directly.

### §3.2 Component and Structural Architecture

1. Open with 2–3 sentences describing the structural character of the solution — the tier model, the role of adapters/services, and the rationale for the separation.
2. Render `folder_structure_summary` as `# | Directory | Role | Key contents`.
3. Render `component_tier_summary` as `# | Tier | Type | Description`.

### §3.3 Data Architecture

1. Open with 2–3 sentences on the data domain: what the system owns, what it delegates, and what the residency constraints are.
2. Render `data_ownership_table` as `# | Store | Owner | What this system owns | What this system may not do`.
3. Render `local_state_description` as a prose paragraph (already formal prose from doc-research — render as-is).

### §3.4 Behaviour and Dynamic View

1. Open with 2–3 sentences on the session model and routing strategy.
2. Render `auth_guard_model` and `routing_strategy` as a facts table: `# | Attribute | Value | Source`.
3. Render platform-level sequence flows as a behaviour table: `# | Flow | Type | Trigger | Steps | Outcome`.

### §3.5 Integration and Interoperability

1. Open with 2–3 sentences on the integration surface — how many upstream services, the credential model, and the boundary the system enforces.
2. Render each integration point as: `# | Service | Env var | Protocol | Direction | Auth mechanism`.

### §3.6 Security and Access Architecture

1. Open with 2–3 sentences on the security posture — identity provider, auth flow, and authorisation model.
2. Render auth facts: `# | Attribute | Value | Source` (auth_library, auth_flow, token_storage_mechanism).
3. Render RBAC model: `# | Role | Permissions | Enforcement point`.

### §3.7 Deployment and Environment Strategy

1. Open with 2–3 sentences on the deployment model and environment boundary.
2. Render deployment facts: `# | Environment | Runtime | Hosting | Env var injection`.

### §3.8 DevOps and CI/CD

1. Open with 2–3 sentences on the pipeline philosophy and gate model.
2. Render pipeline stages: `# | Stage | Trigger | Action | Gate`.

### §3.9 Performance, Observability, and Quality Constraints

1. Open with 2–3 sentences on the quality obligations at platform level.
2. Render NFR table: `# | NFR ID | Constraint | Threshold | Mechanism`.

### §3.10 Test Strategy

1. Open with 2–3 sentences on the test pyramid and the rationale for the toolchain selection.
2. Render toolchain table: `# | Test type | Tool | Gate | Evidence artefact`.

---

## §4 — Fit-Gap Analysis — detail table rule

**Detail table rule (mandatory across all §4 sub-sections):** After the count summary table in each sub-section, include a detail table **only** if the sub-section contains `Gap` or `Documented deviation` items. The detail table lists only those two statuses.

- `Conformant` items: recorded in the count summary only — never in the detail table.
- `Deferred` items: recorded in the count summary only — never in the detail table.
- `Not applicable` items: recorded in the count summary only — never in the detail table.

If a sub-section has no Gaps and no Documented deviations: close with a single sentence such as "No gap or deviation items are recorded in this sub-section." Do not add a detail table.

Detail table format:

```markdown
| Ref | Requirement (RSR/HLAD) | Status | Note |
|-----|----------------------|--------|------|
```

---

## §5 — Feature Modules assembly

**Slot files:** `s5/{stage}/{slug}.md` — one per feature.

Process one stage at a time, then one feature at a time within the stage. Gate fires after each feature is complete.

**Stage block (mandatory — before first feature in stage):**
1. Write a 2–3 sentence intro describing the stage's scope and user context — what audience this stage serves, what access model applies, and what the features collectively achieve.
2. Immediately after intro paragraph: render a feature scope table `# | Feature | Scope | Notes`. One row per feature. Scope values: In scope / Out of scope / Deferred.
3. No back-to-back tables. Stage intro must appear before the scope table.

**Feature block heading:** H3 `### 5.x.y Feature Name`. Stage group: H2 `## 5.N Stage Name`. Lens subsections: H4 `#### 5.x.y.z Lens Name`. Do not skip heading levels.

**Feature block opener (mandatory — 3 sentences minimum):**
1. Sentence 1 — Programme value: state the role this feature plays for the user or programme. Name the user outcome, not the implementation.
2. Sentence 2 — Experience and interaction character: describe what the visitor or user encounters and how the feature guides them.
3. Sentence 3 — Platform or routing relationship: state a single architectural fact that distinguishes this feature.

Do not begin with a table. Do not begin with a bullet. Do not name components or file paths in the opener.

**Out-of-scope table position:** If `out_of_scope_notes` is non-empty, render as `# | Out of scope` immediately after the opener paragraph and before Lens 1.

**Lens 1 — Feature Specifications (`#### 5.x.y.1 Feature Specifications`):**
1. Opening: 2–3 sentence substantive intro framing the problem space — not a count of FR names.
2. If user journeys defined: render journey table `# | Journey | Description` with lead-in. Add bridging sentence before FR table.
3. Render `fr_text` as `ID | Requirement | Acceptance Criteria | Journey Ref`.
4. Before NFR table: bridging sentence on quality context. Then render `ID | Requirement | Threshold`.
5. Before assumptions table: bridging sentence. Then render `# | Assumption`.
6. Do not paraphrase FR or NFR text. No back-to-back tables.

**Lens 2 — Component Architecture (`#### 5.x.y.2 Component Architecture`):**
1. 2–3 sentences on structural character of the component set and modification rationale. Do not name individual components or file paths.
2. Render all components: `# | Component | File | Role | Change | Notes`. Change column: Reuse / Modify / New. Maximum 5 columns.

**Lens 3 — Data Architecture (`#### 5.x.y.3 Data Architecture`):**
1. 2–3 sentences on the data domain.
2. If `crm_entities` non-empty: render `# | Entity | Role | Description` then field table `# | Entity | Field | Type | Required | Notes`.
3. If empty: render data domain table `# | Store | Access pattern | State key | Notes`.
4. If `external_data_sources` non-empty: render `# | System | Protocol | Direction`.

**Lens 4 — Behaviour (`#### 5.x.y.4 Behaviour`):**
1. 2–3 sentences on session contexts and dominant interaction model. Do not list individual flow names.
2. Render behaviour table: `# | Flow | Type | Trigger | Steps | Outcome`. Type: Happy path / Alternate / Error. Minimum 3 rows.
3. No arrow notation (`→`) in table cells.

**Lens 5 — Integration and Interoperability (`#### 5.x.y.5 Integration and Interoperability`):**
1. 2–3 sentences on the feature's position in the integration graph.
2. Render `downstream_dependencies` as `# | Dependency | Contract type | Purpose`.
3. If `upstream_consumers` empty: state this in prose — do not use a prescribed template sentence.

**Lens 6 — Security and Access (`#### 5.x.y.6 Security and Access`):**
1. 2–3 sentences on security posture and access model rationale.
2. Render `# | Control | Detail`. Omit rows where Detail is "None".

**Lens 7 — Architectural Decisions and Open Items (`#### 5.x.y.7 Architectural Decisions and Open Items`):**

This lens always uses a two-table structure. Follows the same pattern as all other LLAD types (doc-author.md Lens 7 canonical definition). Replaces the former "Risks and Open Items" combined table.

**Table 1 — Governing decisions (if any ADRs apply to this feature):**

Open with: "The following architectural decisions govern this feature. Full records are in Appendix D and the ADR annex."

Render as: `# | Decision | ADR ref | Status`
- One row per ADR. Decision column: one declarative sentence — no rationale prose.
- If no ADRs apply: omit Table 1 and proceed directly to the narrative.

**Standard narrative (mandatory, verbatim):**

> "The items below record unresolved design and implementation questions arising from the {feature name} feature. Items flagged as resolving a registered gap are Staging promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery."

**Table 2 — Open items:**

Render as: `# | Open item | Gap ref | Owner | Resolution gate`
- Gap ref: registered gap ID or `—`. Append `(Staging blocker)` for Critical or High gaps.
- If no open items: "No open items are recorded for this feature." — do not omit the section.
