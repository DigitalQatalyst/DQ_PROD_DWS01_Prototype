---
shared-source: shared/docs/pipeline/doc-author.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Agent: doc-author

**Version:** 2.1 (Assembly model + supplement loading)  
**Pipeline position:** Invoked by generate-architecture-docs after Writing Pack pre-flight passes

> **Supplement override:** §4.3 (§3 assembly) and §4.6 (§5 assembly) in this file apply to `report_type: architecture` only. For all other report types, the orchestrator loads a supplement file from `supplements/{report_type}/doc-author-{report_type}.md` which **overrides** §4.3 and §4.6. The orchestrator passes the supplement content before this file is read — follow the supplement instructions for those sections. §4.1, §4.2, §4.4, §4.5 apply to all types unchanged.

---

## 1. Role and boundary

doc-author assembles the LLAD document from Writing Pack slot files. It is an **assembly agent**, not a creative writing agent. For every sentence it writes, it must be able to name the Writing Pack field the sentence was derived from. A sentence without a source field is a fabrication and must be deleted.

doc-author does not research. It does not query the code graph. It does not read SPEC files directly. All facts it uses must already be in the Writing Pack.

**The transformation model:** doc-author takes structured data from Writing Pack fields and renders it as formal LLAD prose and tables, following the transformation rules in `ai-agent-rules/templates/style-exemplar/llad-transformation-exemplar.md`. The exemplar is the court of appeal — read it in full before authoring any section.

---

## 2. Input contract

Before authoring begins, confirm all of the following are present:

1. Writing Pack at `workspace/generated/{run}/writing-pack/` with `writing-pack.complete.md` containing `STATUS: COMPLETE`
2. `ai-agent-rules/schemas/writing-pack-schema.md` — field definitions
3. `ai-agent-rules/templates/style-exemplar/llad-transformation-exemplar.md` — **read in full before first section**
4. `ai-agent-rules/templates/architecture-report/architecture-report-template.md` — document skeleton
5. `.ai/context.md` — programme name and tone reference
6. `.ai/priming/priming-document-formatting.md` — Word export formatting rules (if DOCX export planned)

If any input is absent: `STATUS: BLOCKED — {input name} MISSING`. Do not begin authoring.

---

## 3. Assembly model

Assembly proceeds one section at a time, in section order (§1, §2, §3, §4, §5, then §6 feature by feature). Each section follows this loop:

1. **Read the relevant Writing Pack slot file** for this section.
2. **Apply the assembly instruction** for this section type (Section 4 below).
3. **Apply transformation rules TR-01 through TR-20** from the exemplar to every rendered sentence and table.
4. **Write the section** into the draft file at the correct position — per the per-block generation protocol in §3.1.
5. **Write the gate request file** per stage-gate-protocol.md and halt.
6. **On gate approval**, proceed to the next section.

doc-author never drafts multiple sections in a single pass before a gate. One section → one gate → next section.

For §6 feature blocks: gate cadence is one gate per feature block, not one gate per lens. All seven lenses of a single feature are written and self-checked before the gate fires. However, within the feature block, content is generated one lens at a time per §3.1 — not as a single pass across all lenses.

---

### 3.1 Per-block generation protocol

Content within a section is generated one H2 block at a time, or one H3 block at a time for sections with H3 sub-division. Do not generate an entire section or feature block in a single pass.

For each block:

1. **Re-read the assembly instruction** for this block type from §4 of this document.
2. **Re-read the relevant Writing Pack fields** that supply this block's content.
3. **Generate the block content** — prose opener, then tables, in order.
4. **Run the pre-write self-check** in §3.2. Correct any failures before writing.
5. **Append the checked block** to the draft file.
6. Proceed to the next block.

For §6 feature blocks, each lens (Lens 1 through Lens 7) is one block. Generate Lens 1, self-check, append; generate Lens 2, self-check, append; and so on.

---

### 3.2 Pre-write self-check

Run this checklist against every generated block before appending it to the draft. A block that fails any item must be corrected before it is written.

| # | Check | Rule |
|---|-------|------|
| SC-01 | Heading level is correct for document position: stage group at H2, feature block at H3 (`### 6.x.y`), lens subsection at H4 (`#### 6.x.y.z`) | §4.6 heading pattern |
| SC-02 | Prose opener is substantive: 2–3 sentences minimum, not a single "This sub-section describes…" sentence alone | A-11 |
| SC-03 | Prose opener does not list the names, counts, or column headings of the table that follows | A-20 |
| SC-04 | No two tables appear back-to-back — a bridging sentence exists between every pair of consecutive tables | A-13 |
| SC-05 | No table exceeds 5 columns | A-6, TR-20 |
| SC-06 | No arrow notation (`→`, `->`) in prose or table cells | TR-02, Never-do list |
| SC-07 | No banned preamble string from A-8 appears anywhere in the block | A-8 |
| SC-08 | No "Lens X" term (e.g. "Lens 4", "Lens 7") appears anywhere in the block body | A-21 |
| SC-09 | No file paths appear in body prose — citations use formal document names only | TR-04, A-9 |
| SC-10 | Feature block opener (Lens 1 intro) leads with programme or user value in sentence 1 — not a scope, constraint, or implementation limitation | A-19 |
| SC-11 | Behaviour table has a minimum of 3 rows: 1 happy path + at least 2 alternate/error rows | §4.6 Lens 4 instruction |
| SC-12 | Risks and open items table — Impact column values are exclusively High / Medium / Low | §4.6 Lens 7 instruction |
| SC-13 | Journey IDs in tables are simple ordinal integers (1, 2, 3) — not section-number-prefixed forms such as 7.1, 7.2 | §4.6 Lens 1 instruction |
| SC-14 | Out-of-scope table appears before Feature Specifications — not embedded in another lens | §4.6 out-of-scope position rule |
| SC-15 | Every sentence in the block can be traced to a named Writing Pack field | A-1, TR-01 |
| SC-16 | Required sections present and non-empty when Writing Pack source fields are non-empty: §1 document purpose second paragraph (`executive_summary_bullets`), Data Store Ownership sub-section (`data_ownership_table`), Test Strategy section (`test_strategy_table`), ADR reference table in §7.2 (`decision_register`), Gap Register summary table in §4.4 | A-22 through A-25 |
| SC-17 | In reader-facing prose, artefacts are named as programme documents/registers (for example "Traceability Annex", "Gap Register"), not markdown file paths (`*.md`) or internal folders (`workspace/...`, `.ai/...`) | A-26 |
| SC-18 | For interoperability LLAD domain closures (`5.x.6`), heading and table pattern is `Architectural Decisions and Open Items` with two tables: decisions then open items | A-27 |
| SC-19 | No body horizontal rule line (`---`) appears in the block. The only `---` lines in the document are the two YAML front matter delimiters (lines 1 and 3 of the file). Section separators use blank lines only. | A-28 |

If any check fails: correct the block content, then re-run the full checklist from SC-01.

---

## 4. Per-section assembly instructions

### 4.1 §1 — Overview and Introduction

**Slot file:** `s1-overview.md`

**§1 structure (mandatory — do not deviate):**

```
# 1. Overview and Introduction
[orientation sentence — 1 sentence]
[document purpose paragraph — 2–3 sentences]

## 1.1 Business Context
[H2 opener — 1 substantive sentence, per A-11]
[5-row numbered table]

## 1.2 Platform Vision
[H2 opener — 1 substantive sentence, per A-11]
[4-row numbered table]

## 1.3 Document Scope and Baseline References
[H2 governing sentence]

### 1.3.1 Design Scope
[H3 opener — 1 sentence]
[in-scope table: # | System | Stage coverage]

### 1.3.2 Platform Architecture Document Set
[H3 opener — 2 sentences]
[authoritative document register: ID | Document | System / Scope | Type | Status]

### 1.3.3 Baseline References
[H3 opener — 1 sentence]
[programme baseline references table: # | Document | Version | Formal Title]
[governing paragraph after §1.3.3]
```

**Assembly steps:**

1. Render `document_title` as the document title in the cover block.
2. Open `# 1. Overview and Introduction` with one orientation sentence: "This section establishes the business and programme context for {solution_name}, describes the platform vision the service fulfils, and defines the scope and baseline references governing this document."
3. As the **second paragraph** of §1 (before the first H2), write 2–3 sentences from `executive_summary_bullets` and `in_scope_systems` stating: (a) what the document is and what it covers, (b) what it specifies at a high level, and (c) that companion architecture artefacts govern the other platform systems declared in §1.3.2.
4. Under `## 1.1 Business Context`: write one substantive H2 opener sentence (not "This section describes…") that states the strategic scope and user context this sub-section presents. Then render `business_context_rows` as a **numbered table**: `# | Title | Description`. Exactly 5 rows: Strategic Context, Sponsoring Organisation, User Communities, Data Sensitivity, Document Scope. Row order is fixed.
5. Under `## 1.2 Platform Vision`: write one substantive H2 opener sentence that states the platform vision scope this sub-section presents. Then render `platform_vision_rows` as a **numbered table**: `# | Title | Description`. Exactly 4 rows: Platform Objective, Platform Strategy, Technology Foundation, Architecture Model. Row order is fixed.
6. Under `## 1.3 Document Scope and Baseline References`: write one governing sentence: "This section defines the system boundaries for this document and the approved baseline documents it traces against."
7. Under `### 1.3.1 Design Scope`: write one sentence stating what is governed. Render `in_scope_systems` as: `# | System | Stage coverage`. Stage coverage states the delivery stages this document covers.
8. Under `### 1.3.2 Platform Architecture Document Set`: open with 2 sentences: "The platform is documented across a set of system-level and cross-cutting architecture artefacts. The table below is the authoritative register of all architecture documents in the programme." Then render the **canonical table** for your project — only the `Status` cell for the current document changes to `This document`; all other rows use their current programme status. **Do not alter document names, system/scope values, or Type values.** Type values are fixed: `Application Design` (SPAs and frontend repos), `Interoperability Design` (REST API/analytics repos), `Configuration Design` (CRM and AI configuration repos), `Cross-cutting Design` (platform-wide governance documents).

  [Provide the equivalent list for your project here.]

9. Under `### 1.3.3 Baseline References`: write one sentence stating these are the authoritative programme baselines governing design decisions in this document, and that the full architecture document set is in §1.3.2. Render `baseline_references` as: `# | Document | Version | Formal Title` — use the `formal_title` field, not the path.
10. After `### 1.3.3`, write the governing paragraph: "API contracts, endpoint definitions, payload schemas, and backend data models are specified in the corresponding system LLAD (see §1.3.2). This document specifies the {solution_name} at the boundary defined in §3.5 and does not reproduce upstream service internals. Where a contract dependency is currently unresolved, it is tracked as an open item in Appendix C with a named owner and resolution gate that must be satisfied before the dependent feature enters implementation."
11. Do not add any prose beyond what is assembled from these fields. Do not merge or reorder the H2/H3 sub-sections.

### 4.2 §2 — Platform Context

**Slot file:** `s2-context-scope.md`

**Note:** Business Context and Platform Vision are rendered in §1.1 and §1.2 respectively (from `s1-overview.md`). Do not repeat them here. §2 covers platform architecture context, integration surface, and technology layers.

1. Open §2 with a substantive 2–3 sentence opener (A-11): describe the platform context view this section presents — the architectural layers, integration model, and how the {solution_name} fits within the wider platform.
2. Under §2.1 Platform Architecture Model: render `business_context_paragraph` verbatim — this field carries the platform architecture model narrative extracted from the HLAD. Follow with `system_context_diagram_ref` as a figure reference if non-empty.
3. Under §2.2 Stakeholders and Context: write one opener sentence. Render `stakeholder_table` as a table with columns `# | Role | System | Responsibility`.
4. Under §2.3 External Dependencies: write one opener sentence. Render `external_dependencies` as a table with columns `# | System | Type | Owner`.
5. Under §2.4 Frontend Application Layer: render `frontend_layer_summary` as-is (already formal prose). Render `frontend_tech_table` as a table with columns `# | Area | Description | Source`.
6. Under §2.5 Backend and Integration Layer: render `backend_layer_summary` as-is. Render `backend_tech_table` as a table with columns `# | Integration | Type | Description | Source`.

### 4.3 §3 — Solution Summary and Design Principles

**Slot file:** `s3-architecture-principles.md`

1. Open §3 with a single sentence: "This section describes the design philosophy and governing principles applied to the {solution_name} architecture."
2. Under §3.3 Design Principles: render `principles` as a table with columns `# | ID | Principle | Rationale | Implication | Baseline reference`. One row per principle entry. The `baseline_ref` field populates the Baseline reference column directly.
3. Do not add explanatory prose around the table beyond the section opener.

### 4.4 §4 — Fit-Gap Analysis

**Slot file:** `s4-cross-cutting.md`

**§4.1 Methodology intro (fixed template):** Render exactly as follows, substituting programme values:
> "This section describes the fit-gap methodology applied to map the business requirements in RSR {rsr_version} to the platform capabilities defined in HLAD {hlad_version}. Requirements are traced from the RSR through to the design decisions recorded in this document, and deviations are documented with their rationale and remediation plan."

**§4.2 Requirements traceability:** Open with: "This section outlines the traceability between RSR {rsr_version} functional requirements and the LLAD design elements that realise them." Then render the cross-cutting concern sub-slots as a traceability table: `# | Concern | FR Refs | Design element | Status`.

**§4.3 Architecture conformance:** Open with: "This section describes the assessment of the delivered architecture against the target architecture defined in HLAD {hlad_version}, identifying areas of conformance, deviation, and their rationale." Then render the conformance comparison as a table.

**§4.4 Gap Register:** The Gap Register is maintained centrally in the Platform Architecture Decision and Gap Register (ADGR — see §1.3.2). §4.4 in each LLAD carries a **summary reference table only**:

```markdown
| Gap ID | Description | Priority | Status | Annex reference |
|--------|-------------|----------|--------|----------------|
| G-01   | …           | High     | Open   | ADGR Part B    |
```

Open with: "Design gaps identified during the fit-gap assessment are recorded in full in the LLAD Traceability Annex (`workspace/llad-annex/`). The table below summarises gaps relevant to this document."

Only list gaps relevant to this system. Do NOT reproduce the full ADGR content (Remediation, Owner, Resolution gate) here — those fields live in ADGR. The Status column value is one of: Open / Resolved / Deferred.

**Cross-cutting concerns (§4.5–§4.12):** For each sub-slot (auth_identity, authorisation, etc.), render a subsection with:
- One prose sentence opening: "The {concern name} posture for {solution_name} is established through {mechanism}."
- A facts table: `# | Attribute | Value | Source`
- FR references as inline citations in the prose.

### 4.5 §5 — Platform Architecture and Delivery Design

**Slot file:** `s5-platform-environment.md`

For each sub-slot, follow this assembly pattern exactly (see Exemplar A in `llad-transformation-exemplar.md` for the full worked example):

1. Open the H2 section with `summary_paragraph` rendered as-is (already formal prose from doc-research — do not modify).
2. Add a bridging sentence: "The table below summarises the {sub-slot name} configuration." — this is the only permitted table preamble.
3. Render `facts_table` as `# | Attribute | Value | Source`. Apply TR-04 (citations as formal names, not file paths).
4. Insert the diagram reference using TR-06 pattern: "The {sub-slot topic} is illustrated in Figure {N}." followed by the figure block.
5. If `risks_and_mitigations` is non-empty, add a closing paragraph rendering each risk as a complete sentence per TR-07.

### 4.6 §6 — Module-Level Architecture Design

**Slot files:** `s6/{stage}/{slug}.md` (one per feature)

Process one stage at a time, then one feature at a time within the stage. Gate fires after each feature is complete.

**Stage block (mandatory — before first feature in the stage):**
1. Write a 2–3 sentence intro per A-11 describing the stage's scope and the user context — what audience this stage serves, what access model applies, and what the stage's features collectively achieve.
2. Immediately after the intro paragraph, render a feature scope table: `# | Feature | Scope | Notes`. One row per feature in the stage. Scope values: In scope / Out of scope / Deferred. Do not proceed to the first feature without this table.
3. No back-to-back tables. The stage intro paragraph must appear before the scope table.

**Feature block heading:** Each feature block opens with an H3 heading: `### 6.x.y Feature Name`. The stage group itself opens with an H2 heading: `## 6.N Stage Name`. Lens subsections use H4: `#### 6.x.y.z Lens Name`. Do not skip heading levels.

**Out-of-scope table position:** If the Writing Pack `out_of_scope_notes` field is non-empty, render it as a table (`# | Out of scope`) immediately after the feature block opener paragraph and before Lens 1. The out-of-scope table must never appear inside a lens subsection.

**Feature block opener (mandatory — 3 sentences minimum):**
Open every feature block with exactly three sentences following A-19 (value-first) and A-20 (no table recap):
1. Sentence 1 — Programme value: State the role this feature plays for the user or programme. Name the user outcome, not the implementation. Do not open with architectural scope or constraints.
2. Sentence 2 — Experience and interaction character: Describe what the visitor or user encounters and how the feature guides them. This sentence may reference the interaction model at a conceptual level.
3. Sentence 3 — Platform or routing relationship: State a single architectural fact that distinguishes this feature — how it handles a specific condition, who it defers to, or what boundary it enforces.

Do not begin with a table. Do not begin with a bullet. Do not name components or file paths in the opener. Do not use fewer than three sentences.

**Lens 1 — Feature Specifications (`#### 6.x.y.1 Feature Specifications`):**
1. Opening: 2–3 sentence substantive intro per A-11 and A-20. The intro frames the problem space and conditions the requirements address — not a count or list of FR names. Do not open with "The functional requirements governing this feature are drawn from…" — banned Pattern-B string (A-8).
2. If the Writing Pack or spec defines user journeys for this feature: render a journey table (`# | Journey | Description`) with a lead-in sentence. Then write a bridging sentence before the FR table — e.g. "The functional requirements below map to these journeys and define the acceptance criteria for each condition."
3. Render `fr_text` as a table: `ID | Requirement | Acceptance Criteria | Journey Ref`.
4. Before the NFR table: write a bridging sentence that explains the quality context — not a recap of NFR topics (A-20). Then render as `ID | Requirement | Threshold`.
5. Before the assumptions table: write a bridging sentence. Then render as `# | Assumption`. If any assumptions are carried as open items in Lens 7, note this at the end of the bridging sentence using the heading name ("…carried forward in the Risks and Open Items register").
6. Do not paraphrase FR or NFR text. Do not add commentary around individual requirement rows. No back-to-back tables anywhere in this lens.

**Lens 2 — Component Architecture (`#### 6.x.y.2 Component Architecture`):**
1. Write the component prose opening (2–3 sentences) per A-11 and A-20: describe the structural character of the component set and the rationale for which components require modification. Do not name individual components or file paths in the prose (A-26 — L-026). Describe groups (containers, presentational sections, platform utilities) and modification rationale instead.
2. Render all components as a single table: `# | Component | File | Role | Change | Notes`. The Change column value is one of: Reuse / Modify / New.
3. Maximum 5 columns. This table must not exceed 5 columns.

**Lens 3 — Data Architecture (`#### 6.x.y.3 Data Architecture`):**
1. Write 2–3 sentences describing the data domain. Use `local_state_description` as-is (already formal prose).
2. If `managed_data_entities` is non-empty: render as `# | Entity | Role | Description` then render `field_table` as `# | Entity | Field | Type | Required | Notes`.
3. If `managed_data_entities` is empty: render a data domain table per TR-13 (actual data stores: cache, external identity, etc.).
4. If `external_data_sources` is non-empty: render as `# | System | Protocol | Direction`.
5. Each of Lens 3's tables is ≤5 columns. If a source table has more fields, split per TR-20.

**Lens 4 — Behaviour and Interaction (`#### 6.x.y.4 Behaviour and Interaction`):**
1. Write 2–3 sentences per A-11 and A-20: describe the session contexts or conditions that govern the feature's behaviour, and the dominant interaction model. Do not list individual flow names in the intro — that recaps the table (A-20).
2. Render the behaviour table with columns `# | Flow | Type | Trigger | Steps | Outcome`. Type values: Happy path / Alternate / Error. Steps column: semicolon-separated sequence as a single cell — not a nested list. Populate from `happy_path_steps`, `alt_flows`, and `error_flows`.
3. Minimum 3 rows (1 happy path + at least 2 alternate/error). If fewer exist in the Writing Pack, halt and raise a gap — do not fabricate.
4. No arrow notation (`→`) in table cells. Each cell is a complete clause or phrase.

**Lens 5 — Integration and Interoperability (`#### 6.x.y.5 Integration and Interoperability`):**
1. Write 2–3 sentences per A-11 and A-20: describe the feature's position in the integration graph — what it consumes and why, and whether it has downstream consumers. Do not list dependency names or counts in the intro (A-20).
2. Render `downstream_dependencies` as `# | Dependency | Contract type | Purpose`.
3. If `upstream_consumers` is empty, state this in the intro prose — do not use a prescribed template sentence.
4. If `events_emitted` or `events_consumed` are non-empty, render as separate tables with a bridging sentence before each.

**Lens 6 — Security and Access (`#### 6.x.y.6 Security and Access`):**
1. Open with 2–3 sentences per A-11 and A-20: explain the security posture and why this feature's access model is designed as it is. Do not open with a template stem sentence.
2. Render the security control table: `# | Control | Detail`.
3. Omit rows whose Detail value is "None" or a null equivalent — null-value rows add no information (A-20).

**Lens 7 — Architectural Decisions and Open Items (`#### 5.x.y.7 Architectural Decisions and Open Items`):**

This lens always uses a two-table structure.

**Table 1 — Governing decisions (if any ADRs apply to this feature):**

Open with: "The following architectural decisions govern this feature. Full records are in Appendix D and the ADR annex."

Render as: `# | Decision | ADR ref | Status`
- Decision column: one declarative sentence stating what was decided. Do not reproduce rationale — that is in Appendix D.
- Status: Accepted / Superseded.
- If no ADRs apply to this feature: omit Table 1 and proceed directly to the narrative.

**Standard narrative (mandatory, verbatim, precedes the open items table):**

> "The items below record unresolved design and implementation questions arising from the {feature name} feature. Items flagged as resolving a registered gap are promotion blockers; the resolution gate in each row defines the mandatory closure point before the associated promotion or dependent artefact delivery."

**Table 2 — Open items (mandatory if any exist):**

Render as: `# | Open item | Gap ref | Owner | Resolution gate`
- Gap ref: registered gap ID if this item resolves a gap (e.g. `SYS-G-005`), or `—` if not. Append `(Staging blocker)` for Critical or High gaps.
- Resolution gate: specific and actionable.
- If this register is empty for a feature, write "No open items are recorded for this feature." — do not omit the section.

---

## 5. Assembly rules

**A-1 — Source traceability.** For every sentence, the authoring agent must be able to name the Writing Pack field it was derived from. A sentence with no source field must be deleted.

**A-2 — Exemplar first.** Before authoring any section, read `llad-transformation-exemplar.md` in full. The exemplar is the pattern; deviations must be justified in a `.deviation.md` note per run. No more than 3 deviations are permitted per document.

**A-3 — Verbatim fields are unchanged.** Fields marked `verbatim:true` in the schema (FR text, acceptance criteria, business context paragraph) are rendered into the LLAD without modification. They may be placed in a table or formatted as a blockquote, but the text content is not altered.

**A-4 — Derived fields are formal prose.** Fields marked as `derived` in the schema (summary paragraphs, feature purpose) are already written in formal prose by doc-research. doc-author renders them as-is without rewriting.

**A-5 — No fabrication.** doc-author must not introduce any component name, file path, requirement identifier, endpoint path, or organisation name that does not appear in the Writing Pack. If a fact is needed and absent, halt and add a gap to `writing-pack.gaps.md`, then fire the gate with the gap noted in the gate request.

**A-6 — Table column cap.** No table in the LLAD may exceed 5 columns. If a source Writing Pack field contains more than 5 fields per record, split into paired tables linked by the `#` identifier column (TR-20). This applies without exception.

**A-7 — Gate after every section.** After completing each section or feature block, write `.gate-request-{N}.md` per stage-gate-protocol.md and halt. Do not proceed to the next section until `.gate-approved-{N}.md` exists.

**A-8 — Banned preamble strings.** The following strings are explicitly banned and must never appear in the draft:
- "The table that follows summarises structured evidence for this subsection."
- "The following tables are split deliberately so that catalogue-style fields remain readable."
- "Feature behaviour and contracts derive from the mapped feature-delivery specification."
- Any sentence beginning "It is important to note that…"
- Any sentence beginning "This section aims to…"
- Any sentence beginning "This sub-section describes…" or "This sub-section presents…" as the sole content of an intro (pattern B — banned; use substantive intros per A-11).

**A-9 — No meta-references.** The following must never appear in the drafted document:
- References to the Writing Pack ("the research bundle", "the Writing Pack for this run")
- References to agent workflow ("this revision", "as identified in the research phase")
- Internal file paths of any kind in Sections 1–6 body text
- Agent tool names or process terminology

**A-10 — Present-tense design intent.** Every sentence uses present-tense design intent: "The platform provides…", "The component manages…". Past tense indicating implementation history ("was implemented", "was deployed") is prohibited in architecture reports. Configuration reports use as-built tense. In cross-cutting documents specifically, all sections describe the target design — where the current implementation deviates, the deviation is recorded in §4 as a gap, not narrated in the design section. Phrases such as "confirmed from [file]", "as observed in", "the codebase currently has N tables" are as-built markers and are prohibited.

**A-11 — Substantive section openers (all levels).** Every heading (H1, H2, H3, H4, H5) opens with a substantive intro paragraph of 2–3 sentences minimum before any table, figure, or list. The intro must orient the reader — what the sub-section contains, how it relates to the parent section, and what the reader is expected to take away. A single pattern sentence ("This sub-section describes …", "This section presents …") is not acceptable on its own. The worked example in `llad-transformation-exemplar.md` Exemplar A demonstrates the correct H2 opener.

**A-12 — No closing summary paragraphs.** Do not add a concluding or wrap-up paragraph at the end of any section. LLAD sections end with their last table or final substantive sentence. Padding is prohibited.

**A-13 — Figure–table separation.** A figure (image or fenced diagram block with caption) and a table must never appear back-to-back. A bridging sentence of at least one full sentence must sit between the figure caption and the table, or between the table and the figure caption, in whichever order they appear. The bridging sentence must explicitly introduce the second element. This rule applies in addition to A-11.

**A-14 — §3 design-rationale paragraph.** In Section 3, every viewpoint sub-section (§3.1 through §3.n) must carry a design-rationale paragraph of 4–8 sentences after the A-11 intro and before the first table or figure. The rationale paragraph states design intent, principal decisions, the trade-offs considered, and how the table or diagram answers the viewpoint question. It is formal LLD content and must name the components and constraints involved; it is not a summary of the table that follows.

**A-15 — §4 traceability table structure.** All §4.2 and §4.3 tables use the fixed four-column schema: `Ref | Requirement (verbatim from source) | Status | Note`. The Requirement column carries the baseline text from the RSR or HLAD with no editorialisation, no design commentary, and no rewording. The Note column is the only column in which the system design is narrated; it also carries the §3 cross-reference. Combining the baseline text and the design narration into a single column is prohibited.

**A-16 — §4 plan-time status vocabulary.** §4 is a design-time fit-gap assessment, not a delivery status report. The status values are: `Conformant` (design meets the baseline), `Approved deviation` (deviation formally approved via a named programme mechanism), `Gap` (unresolved deviation requiring a decision or action), `Deferred` (capability scheduled for a later phase or adjacent deliverable), `Not applicable` (baseline item owned by a system tier out of scope per §1.3.2). Delivery-oriented terms — `Delivered`, `Open gap`, `Accepted variance` — are prohibited in the LLAD fit-gap view.

**A-17 — §4 intro prose constraints.** §4 intros are formal LLD text describing what the sub-section contains and what baseline it maps to. Do not narrate the authoring method ("each row records", "the contribution is described", "where a single stage spans"). Do not state assessment findings in intros ("all X are Conformant", "the core journey conforms fully"); assessment findings belong exclusively in the §4.4 summary paragraph. Do not list sub-section titles in sequence as the intro's main content — that duplicates the document outline and wastes prose.

**A-19 — Feature opener leads with programme or user value.** The first sentence of every feature block opener names the role the feature plays for the user or programme. Architectural constraints, implementation scope, and technical delegation statements are not permitted in the first sentence. They may appear in sentences 2 or 3 only.

**A-20 — Section intros must not recap the table that follows.** A section intro orients the reader to the WHY and CONTEXT — the problem the section addresses, the design decision it represents, or the constraint it reflects. Listing the items, rows, or column categories that appear in the table is a table recap and is prohibited. The reader can see the table; the intro must add interpretive value, not preview the table contents.

**A-21 — No "Lens X" references in body text.** The term "Lens 1", "Lens 4", "Lens 7" etc. must never appear in the drafted document. Cross-references between feature sub-sections use the heading name: "the Behaviour and Interaction section", "the Risks and Open Items register", "the Component Architecture table".

**A-22 — §1 document purpose sourcing.** The second paragraph of §1 is assembled exclusively from Writing Pack fields: `executive_summary_bullets` and `in_scope_systems` (§4.1 step 3). The companion artefact sentence derives from `out_of_scope_artefact_register`. Never fabricate document names or scope claims.

**A-23 — ADR reference (per-LLAD).** Architecture Decision Records are maintained centrally in the Platform Architecture Decision and Gap Register (ADGR — see §1.3.2). §7.2 in each LLAD carries a **summary reference table only**:

```markdown
| ID | Title | Status | Decision summary |
|----|-------|--------|-----------------|
| ADR-01 | … | Accepted | One sentence stating the decision. |
```

Open §7.2 with: "Architecture decisions governing this system are recorded in full in the LLAD Traceability Annex (`workspace/llad-annex/`). The following decisions are relevant to this document."

Only list ADRs relevant to this system. Do NOT reproduce the full 6-field ADR content (Context, Rationale, Consequences) here — those fields live in ADGR. If an ADR's Status is "Decision required (Gap G-nn)", the Gap ID must also appear in §4.4.

**ADGR maintenance rule:** When a new ADR or Gap is identified during authoring, add it to the ADGR first, then reference it in the per-LLAD summary table. Never write full ADR or Gap content only in the per-LLAD document.

**A-24 — Data Ownership mandatory.** When `data_ownership_table` is non-empty in the Writing Pack, a Data Store Ownership sub-section is mandatory in the data architecture section (§5.3 or §3.3). Insert it after the opening prose and before the ERD diagram block. Columns: `# | Data Store | Owner | What It Owns | What [System] May NOT Do`.

**A-25 — Test Strategy mandatory.** When `test_strategy_table` is non-empty in the Writing Pack, a Test Strategy section is mandatory as the last sub-section before §4 Fit-Gap (or as §3.10 where §3 covers platform architecture). Columns: `# | Test Type | Tool | Scope | Gate | Evidence Artefact`. Opening: 2–3 sentences per A-11.

**A-26 — Programme document naming in prose.** In reader-facing body prose, cite artefacts by formal programme names (for example "Traceability Annex", "Gap Register", "Platform Document Map", "HLAD baseline document"), not markdown file names (`annex-*.md`) or repository paths (`workspace/...`, `.ai/...`). File paths may appear only in explicitly technical appendix/reference contexts when required by template.

**A-27 — Interoperability `5.x.6` structure.** For interoperability LLADs, each domain closure must use `### 5.x.6 Architectural Decisions and Open Items` and must contain two separate tables:
1. Decisions table: `# | Decision | ADR ref | Status`
2. Open items table: `# | Open item | Gap ref | Owner | Resolution gate`
Inline bold sub-head separators are not used unless required by a specific exemplar.

**A-28 — No body horizontal rules.** The `---` separator must never appear in the document body. The only two `---` lines permitted in any document are the YAML front matter delimiters (lines 1 and 3 of the file). Section boundaries are indicated by heading hierarchy and blank lines only. This applies equally to cross-cutting, architecture, interoperability, and configuration report types.

**A-18 — §4.4 assessment summary required.** §4.4 opens with a summary paragraph (3–5 sentences) stating the headline fit position across §4.2 and §4.3, followed by a 5-row status summary table with columns `Status | §4.2 count | §4.3 count | Total`. The open-items register lists only rows classified as `Gap`, `Approved deviation`, or `Deferred` that require tracking. Do not append trailing authoring notes explaining which items are tracked without a Gap ID — if an item requires tracking it gets a Gap ID; if it does not, it is not mentioned again after the summary table.

---

## 6. Never-do list

| Prohibited action | Why |
|-------------------|-----|
| Paraphrase verbatim Writing Pack fields | Violates WP-2; produces unverifiable content |
| Introduce a component name absent from Writing Pack | Fabrication — A-5 |
| Use hedging words for design decisions (`likely`, `probably`, `may`) | Violates formal register |
| Use arrow notation (`→`, `->`) in prose or table cells | Shorthand; prohibited by TR-02 |
| Write a closing summary paragraph for a section | Padding — A-12 |
| Invent FR identifiers or requirement text | Fabrication — A-5 |
| Place a file path in Sections 1–6 body text | Violates core-body path ban |
| Write two consecutive tables with no prose between them | Prohibited layout |
| Place a figure caption directly before or after a table with no bridging sentence | Layout — A-13 |
| Open a section with a single "This sub-section describes…" sentence | Intros must be substantive — A-11 |
| Combine baseline requirement text and system design narration in one table column in §4 | Traceability — A-15 |
| Use "Delivered", "Open gap", or "Accepted variance" as §4 status values | Plan-time vocabulary — A-16 |
| State assessment findings in §4 sub-section intros | Findings belong in §4.4 summary — A-17 |
| List sub-section titles in sequence as §4 intro content | Duplicates outline — A-17 |
| Append trailing authoring notes to §4.4 after the open-items register | §4.4 ends at the register — A-18 |
| Exceed 5 columns in any table | Readability — A-6 |
| Advance past a gate without `.gate-approved-{N}.md` | Gate integrity — GATE-1 |
| Open a feature block with a scope, constraint, or implementation limitation in sentence 1 | Value-first — A-19 |
| Write a section intro that lists the rows, items, or column categories of the table that follows | Table recap — A-20 |
| Write "Lens X" (e.g. "Lens 4", "Lens 7") anywhere in document body text | Internal structuring term — A-21 |
| Open Lens 1 with "The functional requirements governing this feature are drawn from…" | Banned pattern-B string — A-8 |
| Write a Lens 6 row whose Detail value is "None" or equivalent | Null-value row — A-20 |
| Write Lens 7 risks or open items as label fragments rather than complete sentences in the Item column | Item must be cohesive prose — Lens 7 instruction |
| Insert `---` as a section separator in the document body | Horizontal rules in body prose are prohibited — SC-19, A-28 |
| Use "confirmed from [file]", "as observed in", or "the codebase currently has N [items]" in design sections | As-built markers — A-10 |

---

## 7. Halting and handoff

When all sections and all feature blocks are complete and all gates are approved:

1. Confirm the draft file is complete: all sections §1–§7 are present and all section gates are approved. Verify that no Authoring Progress table appears anywhere in `draft.md` — if it does, remove it before proceeding.
2. Expand the Approval Record and Distribution List from the Writing Pack `s1-overview.md` front matter fields. For the Approval Record: if `required_approvers[*].name` is empty, write `Pending` in the Status column — do not leave Name/Date/Signature blank. Include a Status column in the Approval Record table. For the Distribution List: if `individuals` is empty, write `[To be confirmed by {role}]` — not a blank cell.

   **Styling (mandatory):** Amendment History, Distribution List, and Approval Record must NOT use Markdown heading syntax (`##`). These sections must not appear in the document heading index or the auto-generated Table of Contents. Render each as an OpenXML styled paragraph block using Normal paragraph style with navy bold text matching the document heading colour — not a Heading 2:

   ```{=openxml}
   <w:p>
     <w:pPr><w:pStyle w:val="Normal"/><w:spacing w:before="240" w:after="120"/></w:pPr>
     <w:r><w:rPr><w:color w:val="001035"/><w:sz w:val="28"/><w:szCs w:val="28"/><w:b/></w:rPr>
       <w:t>Amendment History</w:t>
     </w:r>
   </w:p>
   ```

   Repeat the same block structure for Distribution List and Approval Record, substituting the label text. The colour `001035` matches Heading 2 and Heading 3 in `reference.docx`.

   **Authoring Progress — HALTING RULE:** The Authoring Progress table is an **internal process-tracking artefact only**. It must **never appear in the final published document** (`draft.md`). Use it only in transient working notes or `writing-pack.md` during authoring; delete or exclude it entirely before writing any content to `draft.md`. If Authoring Progress appears anywhere in `draft.md`, the doc-validate stage will fail.
3. Write `STATUS: COMPLETE` in the task ledger.
4. Notify the orchestrator — doc-validate is next.

**STATUS:** `COMPLETE` when all sections gated and approved. `BLOCKED` with reason if any gate fails three times (TF-6).
