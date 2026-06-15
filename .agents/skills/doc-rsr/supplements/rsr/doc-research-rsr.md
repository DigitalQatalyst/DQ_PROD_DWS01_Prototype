# Supplement: doc-research — RSR type

**Loaded by:** orchestrator when `report_type: rsr` — loaded SECOND, after `doc-research-platform-context.md`.  
**Extends:** doc-research primary file  
**Slot files produced:** `writing-pack/s3-requirements-architecture.md`, `writing-pack/s4-scope-assumptions.md`, `writing-pack/s5/{unit-slug}.md` (12 files), `writing-pack/s6-appendices.md`

> **Scope notice:** This supplement governs §3 through §6 only. §1 and §2 are researched exclusively by `doc-research-platform-context.md`. Do not re-research §1 or §2 content here; do not write to `s1-overview.md` or `s2-platform-context.md`.

**Primary sources for §3–§6:**
- Business requirements brief (path from task ledger or user-supplied)
- Platform context documents (path from task ledger)

No HLAD input is used for RSR research. If the user provides a HLAD path, note it for §6 Annex A citation only; do not draw architectural design content from HLAD into RSR sections.

---

## §3 — Business and Product Requirements research (`s3-requirements-architecture.md`)

Produce `writing-pack/s3-requirements-architecture.md`. This slot feeds §3 of the assembled document.

§3 is sourced exclusively from the business requirements brief. Extract each sub-section field directly. Do not infer or supplement from HLAD or platform-document-map.md.

### §3.1 Product Outcomes

Extract from the business requirements brief product outcomes / objectives section:

- `product_outcomes_intro`: 1–2 formal prose sentences framing what outcomes the platform delivers and for whom.
- `product_outcomes_table`: One row per named outcome. Columns: `# | Outcome | Detail | Metric or Signal | Phase Tag`. Extract directly from the brief. Minimum 3 rows; if fewer are extractable, apply gap protocol. Each `Metric or Signal` must be a measurable indicator or `[TBD: metric definition required]` if absent from the brief.

### §3.2 People / Personas

Extract from the business requirements brief stakeholder / persona section:

- `personas_intro`: 1–2 formal prose sentences stating the stakeholder communities the platform serves.
- `personas_table`: One row per persona. Columns: `Persona Group | Persona | Purpose`. Extract group names and persona names verbatim from the brief. Minimum 3 persona rows. If a persona has no explicit name in the brief, apply gap protocol — do not invent persona names.

> **Persona register:** Record all persona names extracted here in a field `persona_register` (flat list). V-RSR-06 checks that every persona name referenced in §5 FR rows exists in this register.

### §3.3 Process Requirements

Extract from the business requirements brief process / workflow requirements section:

- `process_requirements_intro`: 1 formal prose sentence framing the process obligations the platform must satisfy.
- `process_requirements_table`: One row per requirement. Columns: `# | Process Requirement | Description`. Use IDs in the Description column only if the brief assigns them. Minimum 4 rows; apply gap protocol if fewer.

### §3.4 Service Requirements

Extract from the business requirements brief service requirements section:

- `service_requirements_intro`: 1 formal prose sentence framing the service capabilities the platform must provide.
- `service_requirements_table`: One row per requirement. Columns: `# | Service Requirement | Description`. Minimum 3 rows; apply gap protocol if fewer.

### §3.5 Technology Requirements

Extract from the business requirements brief technology requirements section:

- `technology_requirements_intro`: 1 formal prose sentence framing the technology obligations.
- `technology_requirements_table`: One row per requirement. Columns: `# | Technology Requirement | Description`. Minimum 3 rows; apply gap protocol if fewer.

### §3.6 Data Requirements

Extract from the business requirements brief data requirements section:

- `data_requirements_intro`: 1 formal prose sentence framing the data handling obligations.
- `data_requirements_table`: One row per requirement. Columns: `# | Data Requirement | Description`. Minimum 3 rows; apply gap protocol if fewer.

### §3.7 Experience Requirements

Extract from the business requirements brief UX / experience requirements section:

- `experience_requirements_intro`: 1 formal prose sentence framing the experience obligations.
- `experience_requirements_table`: One row per requirement. Columns: `# | Experience Requirement | Description`. Minimum 3 rows; apply gap protocol if fewer.

---

## §4 — Scope, Assumptions, and Constraints research (`s4-scope-assumptions.md`)

Produce `writing-pack/s4-scope-assumptions.md`. This slot feeds §4 of the assembled document.

### §4.1 Implementation Scope

Extract from the business requirements brief scope statement:

- `implementation_scope_intro`: 1–2 formal prose sentences defining the boundary of the implementation commitment.
- `implementation_scope_note`: Extract the explicit statement of what is and is not in scope for the initial implementation. If the brief uses stage labels (e.g. Pilot, Phase 1), record them here. This field informs §5 Inclusions/Exclusions and must be consistent with the §5 stage backlog items — flag contradictions for the gap protocol.

### §4.2 Assumptions and Dependencies

Extract from the business requirements brief assumptions section:

- `assumptions_dependencies_intro`: 1 sentence framing the assumption and dependency context.
- `assumptions_dependencies_table`: Columns: `# | Type | Item | Description`. `Type` is one of: `Assumption`, `Dependency`. Extract from the brief. Minimum 3 rows; apply gap protocol if fewer.

### §4.3 Key Assumptions

Extract from the business requirements brief key assumptions sub-section:

- `key_assumptions_table`: Columns: `# | Assumption | Description`. Extract only assumptions that have explicit coverage in the brief. Minimum 3 rows; apply gap protocol if fewer.

### §4.4 Constraints

Extract from the business requirements brief constraints section:

- `constraints_table`: Columns: `# | Constraint | Description`. Include regulatory, contractual, technical, and operational constraints named in the brief. Minimum 3 rows; apply gap protocol if fewer.

### §4.5 Dependencies

Extract from the business requirements brief dependencies section:

- `dependencies_table`: Columns: `# | Dependency | Description`. Include external systems, third-party services, and platform preconditions named in the brief. Minimum 3 rows; apply gap protocol if fewer.

---

## §5 — Requirement Areas research (`writing-pack/s5/{slug}.md`)

Produce one slot file per unit: `writing-pack/s5/{slug}.md`. The 12 unit slugs and their types are defined in `templates/rsr-skeleton.md`.

**CRITICAL — determine the unit type before extracting content.** The unit type determines the extraction shape:

| Unit type | Slugs | Extraction shape |
|-----------|-------|-----------------|
| `stage` | stage-00, stage-01, stage-02, stage-03, stage-123, stage-x, stage-y | Three lists: Backlog, Inclusions, Exclusions |
| `nfr-area` | nfr-security-privacy, nfr-performance-availability, nfr-scalability-growth, nfr-maintainability-operability, nfr-compliance-governance | NFR-NN rows with measurable targets |

### Stage-type unit extraction (slugs: stage-00 through stage-y)

For each stage-type unit, produce a slot file with these fields:

- `unit_slug`: the slug string (e.g. `stage-00`).
- `unit_type`: `stage`.
- `stage_name`: the human-readable stage name extracted from the brief (e.g. "Pre-Application", "Registration").
- `stage_intro`: 2–3 formal prose sentences covering (a) what the stage is, (b) its objective, and (c) what it does not include.
- `backlog_rows`: one entry per candidate requirement. Each entry: `feature` (noun phrase), `description`, `priority` (`P1`, `P2`, `P3`, or `P4`). Extract from the brief. Minimum 4 entries; apply gap protocol if fewer.
  - Priority vocabulary: `P1` = Critical, in Pilot; `P2` = High, not in Pilot; `P3` = Medium; `P4` = Low.
  - Feature names must be nouns or noun phrases, not verbs.
- `inclusions_rows`: one entry per in-scope capability boundary. Each entry: `inclusion_area`, `description`. Minimum 3 entries; apply gap protocol if fewer. Each inclusion is a capability boundary statement, not a feature list item.
- `exclusions_rows`: one entry per explicitly out-of-scope item. Each entry: `exclusion_area`, `description`. Minimum 3 entries; apply gap protocol if fewer. Exclusion areas must not overlap with another stage's Inclusions.

### NFR-area unit extraction (slugs: nfr-security-privacy through nfr-compliance-governance)

For each NFR-area unit, produce a slot file with these fields:

- `unit_slug`: the slug string (e.g. `nfr-security-privacy`).
- `unit_type`: `nfr-area`.
- `nfr_area_name`: the human-readable area name (e.g. "Security and Privacy").
- `nfr_area_intro`: 1 formal prose sentence stating what the platform must achieve in this area.
- `nfr_rows`: one entry per NFR. Each entry: `nfr_id` (globally sequential, e.g. `NFR-01`), `requirement_name`, `description`, `measurable_target`.
  - `nfr_id` must continue the global sequence across all NFR-area units (NFR-01, NFR-02, ..., NFR-N with no gaps or duplicates). Process NFR slot files in section-guide order: §5.8 (security-privacy) first, then §5.9, §5.10, §5.11, §5.12 last. The NFR-ID counter is global and carries across files — do not reset it per file.
  - `description` must be an obligation statement: "The platform must…" not "The platform should…".
  - `measurable_target` must be numeric (e.g. latency in ms, throughput in requests per second, availability as %) or boolean (e.g. `Compliant` / `Non-compliant`). If the brief does not provide a measurable target, record `[TBD: numeric target required]` and apply gap protocol.
  - Minimum 1 NFR per area; apply gap protocol if no NFRs are extractable.

---

## §6 — Appendices research (`s6-appendices.md`)

Produce `writing-pack/s6-appendices.md`. This slot feeds §6 of the assembled document.

### Annex A — Requirement Collection References

Extract source citations for the requirement collection:

- `annex_a_rows`: one entry per referenced source document. Each entry: `title` (full document title), `version`, `date` (publication or approved date), `section_references` (comma-separated section numbers used as sources for this RSR). Extract from the brief front matter or reference list. Minimum 1 entry (the brief itself). If additional stakeholder interviews or programme strategy documents were used, add them.

### Annex B — Change Log

Initialise the change log table:

- `change_log_rows`: one entry for the current document version. Fields: `version` (from task ledger or user-supplied version string), `date` (today's date, ISO-8601), `author` (from task ledger or leave as `[Author]`), `description` (`Initial release` or the change description supplied for this version).

---

## Gap protocol

If a field in any slot file cannot be populated from the available inputs:

1. Leave the field value as `<!-- GAP: {field_name} — source absent from brief and platform context -->`.
2. Add a row to `writing-pack.gaps.md`:
   - `gap_id`: allocate next sequential ID.
   - `section`: the RSR section (e.g. `§3.2`, `§5/stage-01/backlog`).
   - `field`: the field name.
   - `source_searched`: which sections were examined.
   - `resolution_required`: what additional content or stakeholder input is needed.
3. Do not fabricate requirements, personas, NFR targets, or scope statements. Use `[TBD: what is needed]` placeholders strictly as the gap marker — not as invented content.
4. Stage boundary gaps (§5 Inclusions/Exclusions) that fall below the minimum row count are stage-level gaps. Flag them with priority `High` in `writing-pack.gaps.md`.
5. NFR measurable target gaps must always be flagged; a `[TBD]` target renders the NFR row non-conformant for V-RSR-04. Flag with priority `High`.

---

## Closure check

Before signalling that §3-onwards research is complete, confirm all of the following:

| # | Check |
|---|-------|
| C1 | `writing-pack/s3-requirements-architecture.md` exists and all 7 sub-section fields are populated or gapped. |
| C2 | `writing-pack/s4-scope-assumptions.md` exists and all §4.1–§4.5 sub-sections are populated or gapped, including both named fields in §4.1 (`implementation_scope_intro` and `implementation_scope_note`). |
| C3 | All 12 `writing-pack/s5/{slug}.md` files exist — one per unit slug in the section-guide registry. |
| C4 | Every stage-type slot file contains `backlog_rows`, `inclusions_rows`, and `exclusions_rows`. |
| C5 | Every NFR-area slot file contains `nfr_rows` with globally sequential `nfr_id` values. |
| C6 | NFR-NN IDs are globally sequential across all five NFR-area files with no gaps or duplicates. |
| C7 | `writing-pack/s6-appendices.md` exists and contains at least 1 Annex A row (the brief itself) and 1 Annex B change log entry. |
| C8 | All gaps identified during §3–§6 research are recorded in `writing-pack.gaps.md`. |
| C9 | `persona_register` in `s3-requirements-architecture.md` lists every unique persona name extracted in §3.2. |
| C10 | No slot file contains fabricated requirements, personas, or NFR targets — all absent content uses the `[TBD: …]` gap marker. |

Do not write `writing-pack.complete.md` — that is the base orchestrator's responsibility, performed after all sections across all supplements are complete.
