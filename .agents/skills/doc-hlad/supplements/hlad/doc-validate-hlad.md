# Supplement: doc-validate — HLAD type

**Loaded by:** orchestrator Stage V when `report_type: hlad`  
**Applies after:** doc-author Stage A is complete and all section gates are approved  
**Output:** `.validation.md` in the run folder with `STATUS: PASS` or `STATUS: FAIL — {rule list}`

This supplement defines the validation checks specific to HLAD documents. It is applied in addition to any universal validation rules from the base `doc-validate.md`. All checks below are mandatory; a single FAIL causes `STATUS: FAIL`.

---

## V-HLAD-01 — Every §5 view unit has a non-empty H2 opener

**Check:** For every `## 5.N` heading in the document, the line immediately following the heading (or the next non-blank line) is a prose sentence — not a table row (`|`), not a comment (`<!--`), and not a heading (`#`).

**Pass condition:** Every `## 5.N` section opens with at least one prose sentence before any table, list, diagram comment, or sub-heading.

**Fail action:** Flag each violating unit. "§5.{N} [{view name}] opens with a non-prose element — insert a 1–2 sentence view description before the first table or diagram placeholder per doc-author-hlad.md Architecture View Unit Pattern step 1."

---

## V-HLAD-02 — Every §5 view unit has a diagram placeholder block

**Check:** For every `## 5.N` heading, the section body contains at least one comment block matching the two-line placeholder pattern:

```
<!-- TODO: Invoke diagram skill for this view. See composition-contract.md when available. -->
<!-- [{VIEW_SLUG}_DIAGRAM] -->
```

Both lines must be present. A single-line placeholder is insufficient.

**Pass condition:** Every one of the 13 `## 5.N` sections contains a matching two-line diagram placeholder block.

**Fail action:** Flag each missing or malformed placeholder. "§5.{N} [{view name}] is missing the diagram placeholder block — insert the two-line placeholder block per doc-author-hlad.md §5 Architecture View Unit Pattern, step 3."

---

## V-HLAD-02b — §5.4 System Journeys has at least one per-flow journey diagram placeholder

**Check:** The §5.4 System Journeys section contains at least one comment block matching the per-flow journey placeholder pattern:

```
<!-- [{JOURNEY_SLUG}_JOURNEY_DIAGRAM] -->
```

This is in addition to the view-level placeholder checked by V-HLAD-02. Individual journey flows each require their own placeholder.

**Pass condition:** At least 1 per-flow journey placeholder (matching `<!-- [{JOURNEY_SLUG}_JOURNEY_DIAGRAM] -->`) is present in §5.4.

**Fail action:** "§5.4 System Journeys is missing per-flow journey diagram placeholders — insert journey-level placeholders (one `<!-- [{JOURNEY_SLUG}_JOURNEY_DIAGRAM] -->` block per named flow)."

---

## V-HLAD-03 — Every AD-NN entry in §6.1 has all six fields populated

**Check:** For every AD block in §6.1, verify that all six fields are present and non-empty: Decision Area, Decision Statement, Rationale, Impact, Status, and the AD-NN ID itself.

**Pass condition:** Every AD block in §6.1 contains all six fields with non-empty values.

**Fail action:** Flag each incomplete block. "AD-{NN} in §6.1 is missing field(s): {field list}. A partial AD must not appear in the published document — either complete all fields from the research slot or remove the block and record it as a gap in `writing-pack.gaps.md`."

---

## V-HLAD-04 — Every CL-NN entry in §6.2 has all five columns populated

**Check:** For every CL row in §6.2, verify that all five values are present and non-empty: CL-ID, Clarification Area, Clarification, Rationale, Impact.

**Pass condition:** Every CL row in §6.2 has all five values populated.

**Fail action:** Flag each incomplete row. "CL-{NN} in §6.2 is missing value(s) in column(s): {column list}. Populate all five CL fields before publishing."

---

## V-HLAD-05 — Every AD-NN ID is unique within the document

**Check:** Extract all AD-NN identifiers from §6.1. Verify that no two blocks share the same AD-NN identifier.

**Pass condition:** The set of AD-NN IDs contains no duplicates.

**Fail action:** Flag all duplicates. "Duplicate AD-NN ID detected: {AD-NN} appears {count} times in §6.1. Every architectural decision must have a unique ID — renumber or merge duplicate entries."

---

## V-HLAD-06 — Every architecture principle in §1.3 is cited by at least one entry in §3, §4, or §5

**Check:** Extract all AP-NN IDs from the §1.3 Architecture Principles table. For each AP-NN, verify it appears at least once as a reference in §3, §4, or §5 body text (in the form `AP-NN` within a prose line or a principles list in a §5 unit).

**Pass condition:** Every AP-NN listed in §1.3 appears ≥1 time in the body of §3, §4, or §5.

**Fail action:** Flag each uncited principle. "AP-{NN} in §1.3 is not cited in §3, §4, or §5 — add at least one citation in the applicable §5 view unit's architecture principles list, or remove the principle from §1.3 if it does not apply to any architecture view."

---

## V-HLAD-07 — Every acronym or glossary term used in §3–§5 has a definition in §6 Annexes

**Check:** Scan §3–§5 body text for tokens matching the pattern `[A-Z]{2,5}` (2–5 consecutive uppercase letters, not followed by a digit). Exclude the following reserved patterns: `AP-\d+`, `AD-\d+`, `CL-\d+`, `NFR-\d+`, `§\d`, section markers, and heading-level capitalised nouns. For each remaining qualifying token, verify that a definition appears in a Glossary table in §6.3 Annexes.

**Pass condition:** Every token matching `[A-Z]{2,5}` that appears in §3–§5 prose — excluding the reserved patterns and heading-level capitalised nouns — is defined in the §6.3 Annexes glossary table. If no glossary table exists in §6.3, the check fails unless §3–§5 contain zero qualifying tokens.

**Fail action:** Flag each undefined token. "Token '{token}' appears in §{section} and is not defined in the §6.3 Annexes glossary table. Add a Glossary table to §6.3 Annexes with columns `Term | Definition | First Used In` for each undefined token."

---

## V-HLAD-08 — §6 Annexes references `annex-adrs.md` for ADR propagation

**Check:** The §6.3 Annexes section contains a reference to `annex-adrs.md` (the shared ADR annex). The reference must be an explicit path mention: `annex-adrs.md` or `workspace/llad-annex/annex-adrs.md`.

**Pass condition:** The string `annex-adrs.md` appears in the §6.3 Annexes section.

**Fail action:** "§6.3 Annexes does not reference `annex-adrs.md` — HLAD documents have `annex_participation: full` and must cross-reference the shared ADR annex."

---

## V-HLAD-09 — §4.1 Technology Stack table has at least one row per technology layer

**Check:** The §4.1 Technology Stack table contains at least one row for each of the following layers (case-insensitive match in the Layer column): Frontend, Backend, Data, Integration, Identity, DevOps, Infrastructure.

**Pass condition:** At least one row for each of the 7 mandatory layers is present in the §4.1 table.

**Fail action:** Flag each missing layer. "§4.1 Technology Stack table is missing a row for the '{layer}' layer — every technology layer must have at least one entry. Add the row or record a gap if the layer does not apply to this platform configuration."

---

## V-HLAD-10 — §2 Platform Context is structurally identical to RSR §2 when both pipelines run from the same upstream inputs

**Check:** If an RSR document for the same programme exists in the run context (i.e. `writing-pack/s2-platform-context.md` was shared as input to both pipelines), verify that the §2 headings and their tables are structurally consistent: same layer names, same column schema, same row count in the platform context layers table.

**Waiver condition:** If RSR has not yet been produced for this programme, do not fail — record in the `## Skipped checks` table with reason "RSR not yet produced". Document: "V-HLAD-10 waived — RSR not yet produced. Validate §2 structural consistency when RSR is authored."

**Pass condition:** §2 heading structure and platform context tables in HLAD match RSR §2 (when RSR exists), or waiver is recorded.

**Fail action:** Flag each structural difference. "§2 in HLAD and RSR do not match — {specific difference}. Both documents must render §2 from the same `s2-platform-context.md` slot file without modification."

---

## V-HLAD-11 — §5 contains exactly 13 architecture view units (§5.1 through §5.13)

**Check:** Count the `## 5.N` headings in the document body. Verify the count is exactly 13, numbered sequentially from `## 5.1` through `## 5.13` with no gaps.

**Pass condition:** Exactly 13 `## 5.N` headings present, numbered 5.1 through 5.13.

**Fail action:** Flag the count and any missing or extra sections. "§5 contains {N} view unit headings — expected 13 (§5.1 through §5.13). Missing units: {list}. Every unit defined in the skeleton template must be present."

---

## V-HLAD-12 — §3 contains both §3.1 and §3.2 headings

**Check:** The document contains both `## 3.1 Capability Canvas` and `## 3.2 Capability Canvas —` (partial match on §3.2 to allow for the variable platform name).

**Pass condition:** Both §3.1 and §3.2 headings are present.

**Fail action:** Flag missing heading(s). "§3 is missing required sub-section(s): {list}. Both §3.1 Capability Canvas and §3.2 Capability Canvas — [Platform Variant] must be present per doc-author-hlad.md."

---

## V-HLAD-13 — §4 contains §4.1, §4.2, and §4.3 headings

**Check:** The document contains `## 4.1 Technology Stack`, `## 4.2 Modules & Functions`, and `## 4.3 Deployment Stack`.

**Pass condition:** All three §4 sub-section headings are present.

**Fail action:** Flag missing heading(s). "§4 is missing required sub-section(s): {list}. All three sub-sections (§4.1, §4.2, §4.3) must be present per doc-author-hlad.md."

---

## V-HLAD-14 — §1.3 heading reads "Architecture Principles" and IDs use AP-NN format

**Check:** The `### 1.3` heading text is exactly `### 1.3 Architecture Principles` (not "Strategic Objectives" or any RSR variant). The §1.3 table's ID column contains values matching the pattern `AP-\d\d` (e.g. AP-01, AP-02).

**Pass condition:** `### 1.3 Architecture Principles` heading present; at least one `AP-NN` format ID in the §1.3 table.

**Fail action:** Flag each violation. "§1.3 heading reads '{actual}' — must be '### 1.3 Architecture Principles' for HLAD documents (not 'Strategic Objectives', which is RSR-specific). / §1.3 table IDs do not use AP-NN format — correct the ID column."

---

## Validation report format

Write `.validation.md` in the run folder with this structure:

```markdown
# Validation Report — {document_id}

**Status:** PASS | FAIL  
**Date:** {ISO-8601}  
**Checks run:** 14  
**Passed:** {N}  
**Failed:** {M}

## Failures

| Rule | Description | Location |
|------|-------------|----------|
| V-HLAD-{NN} | {Fail action text} | {Section / line ref} |

## Skipped checks

| Check | Reason skipped | Advisory |
|-------|---------------|----------|
| V-HLAD-10 | RSR not yet produced | §2 cross-check deferred — re-run after RSR is complete |

## Pass summary

| Rule | Result |
|------|--------|
| V-HLAD-01 | PASS |
...
```

If all 14 checks pass: `STATUS: PASS`. If any check fails: `STATUS: FAIL`.
