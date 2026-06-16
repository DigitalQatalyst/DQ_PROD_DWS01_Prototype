---
shared-source: shared/docs/pipeline/doc-validate.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Agent: doc-validate

**Version:** 2.0 (Writing Pack protocol)  
**Pipeline position:** Invoked by generate-architecture-docs after all doc-author gates are approved

---

## 1. Role

Validate the completed draft against the Writing Pack (source of truth), the code graph (factual accuracy), and the transformation exemplar (style conformance). Report findings with precise citations so targeted-fix-protocol.md can scope repairs to the exact failing span.

doc-validate does not rewrite the draft. It reports only.

---

## 2. Inputs required

- Draft markdown at `workspace/generated/{run}/draft.md` — REQUIRED
- Writing Pack at `workspace/generated/{run}/writing-pack/` — REQUIRED
- `writing-pack.complete.md` must be present (confirms research was closed) — REQUIRED
- Code graph for each in-scope repo — REQUIRED (hard gate; no degraded mode)
- `ai-agent-rules/templates/style-exemplar/llad-transformation-exemplar.md` — REQUIRED for Track 8
- Task ledger (confirms `formal-submission: true` status if applicable)

**Pre-flight:** For each in-scope repo, confirm the code graph is available. If not, run the graph build command from that repo root. If the build fails: `STATUS: BLOCKED — GRAPH UNAVAILABLE FOR {repo}`. Do not issue PASS without graph-backed cross-reference.

---

## 3. Tracks

### Track 1 — Reader testing

**Goal:** The document works for a reader who has no prior context about the programme.

**Steps:**
1. For each section §1 through §6, predict 3–5 questions a reader unfamiliar with the programme would ask.
2. Answer those questions using only the draft text.
3. Record questions that cannot be answered from the draft as Track 1 findings.

**Finding format:** `T1-{N}: §{section} — Reader question "{question}" cannot be answered from the draft text alone. Missing: {what is needed}.`

**Gate:** Any unanswerable question about a core architectural concern (what the system is, how authentication works, what environments exist, what a feature does) = FAIL.

---

### Track 2 — Cross-reference validation (graph-backed)

**Goal:** Every component, endpoint, FR identifier, and external dependency named in the draft exists in the codebase, code graph, or Writing Pack.

**Steps:**
1. Extract all component names from Section 6 feature blocks (all Lens 2 tables).
2. For each component name, confirm it appears as a node in the code graph for the in-scope repo OR exists as a file on disk.
3. Extract all API endpoint paths from Section 6 Lens 5 tables.
4. For each endpoint path, confirm it is registered in the API route handler files.
5. Extract all FR identifiers from Section 6 Lens 1 tables.
6. For each FR identifier, confirm it appears in the corresponding `s6/{stage}/{slug}.md` Writing Pack `fr_ids` field.
7. Check that major integrations named in §5 match the HLAD mapping in the Writing Pack `s2-context-scope.md` `external_dependencies` field.

**Finding format:** `T2-{N}: §{section} — {type} "{name}" not found in {code graph | file system | Writing Pack field}. Expected at: {location}.`

**Gate:** Any dangling reference = FAIL.

---

### Track 3 — Not defined

Track 3 is intentionally vacant in this version of the pipeline. The numbering gap is preserved to maintain stable track IDs across pipeline versions.

---

### Track 4 — Completeness against Writing Pack

**Goal:** Every REQUIRED Writing Pack slot is represented in the rendered document, and no rendered fact is absent from the Writing Pack.

**Steps:**

1. **Slot coverage check.** For every slot file in the Writing Pack, confirm the corresponding section exists in the draft and is non-empty. A slot with content that produces no corresponding draft section = FAIL.

2. **Feature lens coverage.** For every `s6/{stage}/{slug}.md`, confirm all seven lens subsections (`#### 6.x.y.1` through `#### 6.x.y.7`) are present in the draft and non-empty. Lens 7 (Risks and Open Items) may be intentionally absent for a feature only when the Writing Pack `risks_and_mitigations` and `threat_notes` fields are both empty — record this as an expected absence in the validation report, not a finding.

3. **FR verbatim check.** For each feature's Lens 1 table, extract the FR text from the draft and compare it against the `fr_text` field in the Writing Pack. If the draft text differs from the Writing Pack field by more than whitespace or markdown formatting: FAIL. Report: `T4-FR-{N}: §{section} Lens 1 — FR {id} draft text differs from Writing Pack fr_text. Draft: "{draft text}". Pack: "{pack text}".`

4. **Acceptance criteria verbatim check.** For each feature's Lens 1 table acceptance criteria column, extract the criteria text and compare against `acceptance_criteria_text` in the Writing Pack. Filler phrases (`Applies across stages`, `Align to platform security baseline`, `Per platform standard`, `As per HLAD`) = automatic FAIL regardless of Writing Pack content.

5. **Component grounding check.** For each component name in Lens 2 tables, confirm it appears in the Writing Pack `ui_components`, `api_endpoints`, or `shared_modules` fields. A component in the draft not present in the Writing Pack = FAIL (fabrication).

6. **Table width check.** For every markdown table in the draft, count pipe-delimited columns on the header row. If count > 5: FAIL. `T4-W-{N}: Table at line {N} has {count} columns; maximum is 5. Split into paired tables.`

7. **Section intro presence.** For every H2 heading in Sections 2–6, confirm at least one prose sentence appears before the first H3, table, or figure. A heading followed directly by another heading or a table = FAIL.

8. **No boilerplate preambles.** Scan the full draft for the following strings. Any occurrence = FAIL:
   - `"The table that follows summarises structured evidence for this subsection"`
   - `"The following tables are split deliberately so that catalogue-style fields remain readable"`
   - `"Feature behaviour and contracts derive from the mapped feature-delivery specification"`
   - `"bound the statements in this subsection"`

9. **No meta-references.** Scan Sections 1–6 for the following patterns. Any occurrence = FAIL:
   - `"research bundle"` (any capitalisation)
   - `"Writing Pack"` (any capitalisation)
   - `"this revision"` used to refer to the document itself rather than a version number
   - `"as identified in the research"` or similar agent-workflow language
   - Markdown file paths in the format `workspace/`, `ai-agent-rules/`, `docs/feature-delivery/` appearing in body prose or table cells (not in Appendix 7.3)

10. **No shorthand notation.** Scan table cells and prose paragraphs (excluding fenced code blocks and diagram blocks) for:
    - Arrow notation: ` → `, ` -> `, ` => ` — any occurrence = FAIL
    - SPEC label leakage: `Primary Flow:`, `Edge Cases:`, `Happy Path:`, `Alt Flow:` appearing in body text outside a heading

11. **Behaviour table minimum.** For each `#### 6.x.y.4 Behaviour` section, count table body rows (excluding header). If fewer than 3 = FAIL. Confirm at least 1 row represents an error or failure scenario (Trigger column contains a failure indicator).

12. **Core-body path ban.** Confirm Sections 1–6 contain no repository paths, markdown file paths, or source code paths in prose or table cells. Paths are permitted only in Appendix 7.3.

**Finding format:** `T4-{code}-{N}: §{section} — {description}. Writing Pack field: {field path}. Rule: {rule ID}.`

---

### Track 5 — Style conformance

**Goal:** Heading structure, table column patterns, and document front matter are correct.

**Steps:**
1. **Heading hierarchy.** Confirm H1 sections are numbered (`# 1.`, `# 2.`, etc.); H2/H3 use Title Case; no heading levels are skipped.
2. **Table column patterns.** For each table, identify its type and confirm columns match the canonical pattern in `table-conventions.md`. Data tables with ≥3 columns must have a leading `#` column.
3. **Front matter completeness.** Confirm Amendment History, Distribution List, and Approval Record tables are present and use canonical columns.
4. **No horizontal rules in body.** Scan for `---` lines outside YAML front matter delimiters. Any occurrence = FAIL.
5. **Cover block.** Confirm a recognised cover block (OpenXML fenced or Title div fence) appears before `# 1.`.

**Finding format:** `T5-{N}: §{section} — {style issue}. Expected: {pattern}. Found: "{text}".`

---

### Track 6 — Component and heading name verification

**Goal:** H4 heading names in §6 match the component or entity names confirmed in the code graph, and are not generic placeholders.

**Steps:**
1. For each H4 heading in §6, extract the heading text.
2. If the heading names a component (e.g. a UI component, entity, or service), confirm that name appears as a graph node or file in the in-scope repository.
3. If the heading is a generic placeholder (e.g. "Component", "Entity", "Module") without a specific name: FAIL.

**Finding format:** `T6-{N}: §{section} — H4 heading "{text}" is a generic placeholder or is not confirmed in the code graph. Expected: a specific component or entity name.`

**Gate:** Any generic placeholder heading = FAIL.

---

### Track 7 — Not defined

Track 7 is intentionally vacant in this version of the pipeline. The numbering gap is preserved to maintain stable track IDs across pipeline versions.

---

### Track 9 — Structural completeness sweep

**Goal:** Mandatory sections are present and not all-TBD when source Writing Pack fields are non-empty.

**Steps:**
1. **§1 document purpose paragraph:** Confirm a second prose paragraph exists in §1 before the first H2, covering what the document specifies and naming companion artefacts. Absence = FAIL.
2. **Data Store Ownership:** Confirm a sub-section exists in §3.3 or §5.3 with a table of ≥2 rows. Absence when `data_ownership_table` is non-empty = FAIL.
3. **Test Strategy:** Confirm a Test Strategy section exists (§3.10, §5.9, or equivalent heading). Absence when `test_strategy_table` is non-empty = FAIL.
4. **ADR appendix:** Confirm §7.2 or an appendix headed "Architecture Decision Records" has ≥1 ADR with all six fields (Status, Context, Decision, Rationale, Consequences present and non-empty). Absence or partial ADRs = FAIL.
5. **§4.3.x TBD density:** For each `#### 4.3.x` conformance sub-section, count cells containing TBD. If >2 TBD values appear in the Count column = FAIL.
6. **Approval Record blank gate:** Confirm the Approval Record contains a Status column. If any row has empty Name/Date/Signature AND the Status cell does not contain "Pending" = FAIL.

**Finding format:** `T9-{N}: Structure completeness — {section}: {issue}. Required by: {rule}.`

**Gate:** Any finding = FAIL.

---

### Track 10 — Scope and ADR linkage

**Goal:** Out-of-scope systems declare their governing artefact; open gaps cross-link to ADRs.

**Steps:**
1. **§1.3.2 Architecture Artefact column:** Confirm every row in the out-of-scope table is populated (not blank, not "—"). Any blank = FAIL.
2. **Gap-to-ADR linkage:** For each §4.4 row classified as `Gap`, confirm a corresponding ADR exists in §7.2 with a Status field containing the matching Gap ID (format: "Decision required (Gap G-nn)"). Missing ADR = FAIL.
3. **ADR-to-Gap linkage:** For each ADR with Status = "Decision required (Gap G-nn)", confirm the Gap ID exists in §4.4. Dangling ID = FAIL.

**Finding format:** `T10-{N}: Scope/ADR linkage — {system or Gap ID}: {issue}.`

**Gate:** Any finding = FAIL.

---

### Track 8 — Exemplar conformance

**Goal:** Prose and tables match the transformation patterns demonstrated in `llad-transformation-exemplar.md`.

**Pre-condition:** Read all 20 transformation rules (TR-01 through TR-20) from the exemplar before running this track.

**Steps:**
1. **Feature block opener.** For each `### 6.x.y` feature block, confirm the opening prose contains at least 3 sentences covering: (1) purpose, (2) mechanism, (3) platform relationship. Fewer than 3 sentences = FAIL.
2. **Layer vocabulary.** In each Lens 2 component table, confirm Layer column values are drawn from the vocabulary {Presentation, Container, State orchestration, Data access, Utility}. Any other value = FAIL.
3. **Interop empty list.** For each Lens 5 section where `upstream_consumers` was empty in the Writing Pack, confirm the draft contains the sentence "This feature has no upstream consumers within the {solution_name} at this revision." Absence of this sentence = FAIL.
4. **Risk narration.** Confirm that `risks_and_mitigations` from Section 5 Writing Pack slots are rendered as prose sentences in the draft (not as a raw `{risk} | {mitigation}` table row pair). Risk listed as a table entry without prose narration = FAIL.
5. **Diagram references.** For each `diagram_ref` citation in the Writing Pack, confirm the draft contains a figure reference sentence and figure block for that diagram. Missing figure reference = FAIL.
6. **Banned intro patterns.** Confirm no H2 or H3 section opens with a bullet, a table, or a generic phrase from the never-do list in doc-author.md §6.

**Finding format:** `T8-{N}: §{section} — Exemplar rule TR-{rule} violated. Found: "{quoted text}". Expected pattern: {description}.`

---

## 4. Report format

Write to `workspace/generated/{run}/.validation.md`:

```markdown
# Validation Report

**Document:** {document title and revision}
**Run:** {run folder}
**Timestamp:** {ISO-8601}

STATUS: PASS | FAIL

## Summary

| Track | Findings | Status |
|-------|----------|--------|
| Track 1 — Reader testing | {N} | PASS / FAIL |
| Track 2 — Cross-reference | {N} | PASS / FAIL |
| Track 3 — Vacant | — | N/A |
| Track 4 — Completeness | {N} | PASS / FAIL |
| Track 5 — Style | {N} | PASS / FAIL |
| Track 6 — Component names | {N} | PASS / FAIL |
| Track 7 — Vacant | — | N/A |
| Track 8 — Exemplar conformance | {N} | PASS / FAIL |
| Track 9 — Structural completeness | {N} | PASS / FAIL |
| Track 10 — Scope/ADR linkage | {N} | PASS / FAIL |

## Track 1 findings
{findings or "None"}

## Track 2 findings
{findings or "None"}

## Track 4 findings
{findings or "None"}

## Track 5 findings
{findings or "None"}

## Track 8 findings
{findings or "None"}

## Track 9 findings
{findings or "None"}

## Track 10 findings
{findings or "None"}

## Recommended fixes (by section ID)

| Priority | Section | Finding ID | Writing Pack field | Required action |
|----------|---------|------------|-------------------|----------------|
```

The report is always written, even on PASS. A missing `.validation.md` file is itself a pipeline failure.

---

## 5. PASS / FAIL semantics

**PASS:** All five tracks report zero findings. STATUS line reads `STATUS: PASS`.

**FAIL:** Any track has one or more findings. STATUS line reads `STATUS: FAIL`. The orchestrator invokes targeted-fix-protocol.md.

Every finding must cite:
- Section ID (e.g. `§6.S2.checkout-flow`)
- Subsection or lens (e.g. `Lens 2 — Component Architecture`)
- Writing Pack field the failure relates to (e.g. `ui_components`)
- Rule ID violated (e.g. `WP-4`, `A-6`, `TR-12`)

A finding without all four citations is invalid and must be rewritten before targeted-fix-protocol.md can act on it.

---

## 6. Removed checks and rationale

The following checks from prior versions of doc-validate are removed. They addressed symptoms that the Writing Pack gates now prevent upstream:

| Removed check | Replaced by |
|---------------|------------|
| V-BORE-1 (specific boilerplate string) | Track 4 step 8 (banned preamble scan covers all variants) |
| V-SHORTHAND-1 (arrow notation scanner) | Track 4 step 10 (covers all shorthand patterns) |
| V-FEATINTRO-1 (feature intro sentence count) | Track 8 step 1 (exemplar conformance check) |
| V-ACCEPT-1 (acceptance criteria filler) | Track 4 step 4 (verbatim check + filler phrase list) |
| V-CLONE-1 (identical feature blocks) | Prevented by Writing Pack — each feature has its own slot with graph-confirmed components |
| V-META-1 (meta-reference scanner) | Track 4 step 9 (meta-reference scan) |
| V-COMP-1 (generic component descriptions) | Prevented by Writing Pack WP-4 (component grounding gate) |

These symptom checks are not reinstated. If the Writing Pack gates are properly enforced by doc-research and the gate protocol is properly enforced by doc-author, these classes of failure cannot reach the draft.
