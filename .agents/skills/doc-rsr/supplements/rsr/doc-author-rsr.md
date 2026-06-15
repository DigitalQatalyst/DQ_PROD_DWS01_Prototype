# Supplement: doc-author — RSR type

**Loaded by:** orchestrator when `report_type: rsr` — loaded SECOND, after `doc-author-platform-context.md`.  
**Extends:** doc-author primary file  
**Slot files consumed:** `writing-pack/s3-requirements-architecture.md`, `writing-pack/s4-scope-assumptions.md`, `writing-pack/s5/{slug}.md` (12 files), `writing-pack/s6-appendices.md`  
**Gate range:** Gates 3–17 (Gates 1 and 2 are owned by `doc-author-platform-context.md`)

> **Scope notice:** This supplement governs §3 through §6 only. §1 and §2 are assembled exclusively by `doc-author-platform-context.md`. Do not re-author §1 or §2 content here.

> **RSR §1.3 override:** RSR §1.3 heading is `### 1.3 Strategic Objectives` (not "Architecture Principles"). IDs use the format `SO-01`, `SO-02`, etc. This overrides the shared supplement's `architecture_principles` field rendering for the RSR type.

---

## Intro narrative length rules (§3–§6)

| Heading level | What it covers | Minimum length | Common rejection pattern |
|---------------|---------------|---------------|--------------------------|
| **H1** (`# 3.`, `# 4.`, `# 5.`, `# 6.`) | Section openers | 2–3 sentences; frame the section's purpose | Single sentence naming the section |
| **H2** (`## 3.1`–`## 3.7`, `## 4.1`–`## 4.5`) | Sub-section openers | 1 substantive sentence before any table | "The following table describes…" alone |
| **H2** (`## 5.N` stage-type) | Stage unit openers | 2–3 sentences: (a) what the stage is, (b) its objective, (c) what it excludes | Fewer than 2 sentences or a single table with no opener |
| **H2** (`## 5.N` nfr-area type) | NFR area opener | 1 sentence stating what the platform must achieve in this area | Absent opener or generic "This section covers…" |
| **H3** (`### Backlog`, `### Inclusions`, `### Exclusions`) | Stage sub-table openers | 1 sentence before the table | Table with no preceding sentence |

RSR is a prose + tables document. No diagrams are permitted. Do not insert Mermaid blocks, PlantUML, or any diagram syntax in RSR output.

---

## RSR-specific pre-write self-checks

Before appending any §3–§6 block to the draft, confirm all of the following in addition to the base 15-point self-check from `doc-author.md`:

| # | RSR-specific check |
|---|-------------------|
| RSR-SC-01 | All requirement content traces to a named Writing Pack field from a `s3-`, `s4-`, `s5/`, or `s6-` slot file. No requirement is invented in the authoring stage. |
| RSR-SC-02 | All requirement statements are written as obligations ("The platform must…", "Users must be able to…") — not aspirations ("should aim to") and not past-tense implementation records. |
| RSR-SC-03 | No diagram or visual element is present in any RSR block. The RSR is prose + tables only. |
| RSR-SC-04 | All NFR-NN IDs rendered in §5.8–§5.12 are globally sequential across all five NFR-area units; no gaps, no duplicates. |
| RSR-SC-05 | Every persona name referenced in §5 Backlog or Inclusions rows exists in the persona register extracted in `s3-requirements-architecture.md` §3.2 (validated at authoring time, not only at validate time). |
| RSR-SC-06 | All §5 stage-type units have been checked against the section guide before choosing the authoring pattern. Stage-type units use the three-table pattern; NFR-area units use the NFR-NN table pattern. |
| RSR-SC-07 | No table in the RSR draft exceeds 5 columns. |
| RSR-SC-08 | §4.1 Implementation Scope is consistent with the §5 stage backlog items — no stage commitment in §5 Inclusions contradicts the scope statement in §4.1. |

---

## §3 — Business and Product Requirements assembly

**Slot file:** `writing-pack/s3-requirements-architecture.md`

Open `# 3. Business and Product Requirements` with 2–3 sentences that state this section formalises the business, people, process, and technology requirements sourced from the business requirements brief, establishing the requirement baseline the platform delivery programme must satisfy.

### §3.1 Product Outcomes

1. Write one substantive H2 opener sentence asserting what the product outcomes sub-section establishes.
2. Render `product_outcomes_intro` as a prose paragraph.
3. Render `product_outcomes_table` as a numbered table: `# | Outcome | Detail | Metric or Signal | Phase Tag`.

### §3.2 People / Personas

1. Write one substantive H2 opener sentence asserting the stakeholder communities the platform serves.
2. Render `personas_intro` as a prose paragraph.
3. Render `personas_table` as: `Persona Group | Persona | Purpose` (no leading `#` — Persona Group is the identifier column).

### §3.3 Process Requirements

1. Write one substantive H2 opener sentence asserting the process obligations the platform must satisfy.
2. Render `process_requirements_intro` as a prose paragraph.
3. Render `process_requirements_table` as a numbered table: `# | Process Requirement | Description`.

### §3.4 Service Requirements

1. Write one substantive H2 opener sentence asserting the service capabilities the platform must provide.
2. Render `service_requirements_intro` as a prose paragraph.
3. Render `service_requirements_table` as a numbered table: `# | Service Requirement | Description`.

### §3.5 Technology Requirements

1. Write one substantive H2 opener sentence asserting the technology obligations.
2. Render `technology_requirements_intro` as a prose paragraph.
3. Render `technology_requirements_table` as a numbered table: `# | Technology Requirement | Description`.

### §3.6 Data Requirements

1. Write one substantive H2 opener sentence asserting the data handling obligations.
2. Render `data_requirements_intro` as a prose paragraph.
3. Render `data_requirements_table` as a numbered table: `# | Data Requirement | Description`.

### §3.7 Experience Requirements

1. Write one substantive H2 opener sentence asserting the experience obligations.
2. Render `experience_requirements_intro` as a prose paragraph.
3. Render `experience_requirements_table` as a numbered table: `# | Experience Requirement | Description`.

**Gate 3 — §3 complete:** Write `.gate-request-3.md` and halt for approval before proceeding to §4.

---

## §4 — Scope, Assumptions, and Constraints assembly

**Slot file:** `writing-pack/s4-scope-assumptions.md`

Open `# 4. Scope, Assumptions, and Constraints` with 2–3 sentences that state this section defines the implementation boundary, the assumptions the programme relies on, and the constraints that govern delivery.

### §4.1 Implementation Scope

1. Write one substantive H2 opener sentence asserting the implementation boundary this sub-section defines.
2. Render `implementation_scope_intro` as a prose paragraph.
3. Render `implementation_scope_note` as a prose paragraph (already formal prose — render as-is or adjust for document register). Do not convert to a table.

### §4.2 Assumptions and Dependencies

1. Write one substantive H2 opener sentence asserting the assumption and dependency context.
2. Render `assumptions_dependencies_intro` as a prose paragraph.
3. Render `assumptions_dependencies_table` as: `# | Type | Item | Description`.

### §4.3 Key Assumptions

1. Write one substantive H2 opener sentence asserting which assumptions are load-bearing for the programme.
2. Render `key_assumptions_table` as: `# | Assumption | Description`.

### §4.4 Constraints

1. Write one substantive H2 opener sentence asserting the nature of the constraints (regulatory, contractual, technical, and operational).
2. Render `constraints_table` as: `# | Constraint | Description`.

### §4.5 Dependencies

1. Write one substantive H2 opener sentence asserting the external systems and platform preconditions the programme relies on.
2. Render `dependencies_table` as: `# | Dependency | Description`.

**Gate 4 — §4 complete:** Write `.gate-request-4.md` and halt for approval before proceeding to §5.

---

## §5 — Requirement Areas assembly

**Slot files:** `writing-pack/s5/{slug}.md` — one per unit.

Open `# 5. Requirement Areas` with 2–3 sentences that state this section formalises the functional requirements and non-functional requirements for each delivery stage and platform quality area, sourced from the business requirements brief.

**CRITICAL — check unit type before authoring.** Consult the section guide for the unit's `Unit Type` field before selecting the authoring pattern. Stage-type units use the three-table pattern; NFR-area units use the NFR-NN table pattern. Applying the wrong pattern is a validation failure (V-RSR-02, V-RSR-03).

Process units in section-guide order (§5.1 through §5.12). After each unit is complete, write the corresponding gate request file and halt for approval before proceeding to the next unit.

### Pattern A — Stage-type units (§5.1–§5.7)

**Applies to slugs:** stage-00, stage-01, stage-02, stage-03, stage-123, stage-x, stage-y

**H2 heading:** `## 5.N [Stage Name]` (use `stage_name` from slot file)

**Authoring steps:**

1. Write the H2 opener using `stage_intro` from the slot file: render as 2–3 sentences covering (a) what the stage is, (b) its objective, and (c) what it does not include.

2. Write `### Backlog`. Open with one sentence: "The following candidate requirements are registered for this stage, pending prioritisation and sprint assignment." Render `backlog_rows` as: `# | Feature | Description | Priority`. Priority values: P1, P2, P3, P4.

3. Write `### Inclusions`. Open with one sentence: "The following capabilities are explicitly within the scope of this stage." Render `inclusions_rows` as: `# | Inclusion Area | Description`.

4. Write `### Exclusions`. Open with one sentence: "The following capabilities are explicitly excluded from this stage." Render `exclusions_rows` as: `# | Exclusion Area | Description`.

**Gate per unit:** Write `.gate-request-{N}.md` where N = the gate number (Gate 5 for §5.1, Gate 6 for §5.2, ..., Gate 11 for §5.7). Halt for approval before the next unit.

### Pattern B — NFR-area units (§5.8–§5.12)

**Applies to slugs:** nfr-security-privacy, nfr-performance-availability, nfr-scalability-growth, nfr-maintainability-operability, nfr-compliance-governance

**H2 heading:** `## 5.N [NFR Area Name]` (use `nfr_area_name` from slot file)

**Authoring steps:**

1. Write the H2 opener using `nfr_area_intro` from the slot file: render as 1 sentence stating what the platform must achieve in this area.

2. Render `nfr_rows` as a single table: `# | NFR-ID | Non-Functional Requirement | Description | Measurable Target`.
   - Column 1 (`#`): row sequence number within this table (1, 2, 3…).
   - Column 2 (`NFR-ID`): the globally sequential ID from the slot file (e.g. `NFR-01`).
   - Column 3 (`Non-Functional Requirement`): the `requirement_name` field.
   - Column 4 (`Description`): the `description` field — must be an obligation statement ("The platform must…").
   - Column 5 (`Measurable Target`): the `measurable_target` field — must be numeric or boolean. A `[TBD]` value is rendered as-is but flagged in the validation report.

3. Do not add Backlog, Inclusions, or Exclusions sub-tables to NFR-area units. The three-table pattern is only for stage-type units.

**Gate per unit:** Write `.gate-request-{N}.md` where N = the gate number (Gate 12 for §5.8, Gate 13 for §5.9, ..., Gate 16 for §5.12). Halt for approval before the next unit.

---

## §6 — Appendices assembly

**Slot file:** `writing-pack/s6-appendices.md`

Open `# 6. Appendices` with 1–2 sentences stating this section records the source documents from which requirements were collected and the document change history.

### Annex A — Requirement Collection References

1. Write one substantive H2 opener sentence asserting that this annex records the source documents from which requirements in this RSR were extracted.
2. Render `annex_a_rows` as: `# | Title | Version | Date | Section References`.

### Annex B — Change Log

1. Write one substantive H2 opener sentence asserting that this annex records the version history of this document.
2. Render `change_log_rows` as: `# | Version | Date | Author | Description`.

**Gate 17 — §6 complete:** Write `.gate-request-17.md` and halt for approval. After gate approval, signal document assembly complete to the orchestrator.
