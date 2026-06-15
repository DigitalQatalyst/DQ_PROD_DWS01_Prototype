# Supplement: doc-validate — RSR type

**Loaded by:** orchestrator Stage V when `report_type: rsr`  
**Applies after:** doc-author Stage A is complete and all section gates (Gates 1–2 from `doc-author-platform-context.md`, Gates 3–17 from `doc-author-rsr.md`) are approved  
**Output:** `.validation.md` in the run folder with `STATUS: PASS` or `STATUS: FAIL — {rule list}`

This supplement defines the validation checks specific to RSR documents. It is applied in addition to any universal validation rules in `doc-validate.md`. All checks below are mandatory; a single FAIL causes `STATUS: FAIL`.

---

## Check inventory

| Check | Description | Pass condition | Fail action |
|-------|-------------|----------------|-------------|
| V-RSR-01 | **Completeness:** Every in-scope item cited in Annex A (§6) maps to ≥1 entry in §5 Requirement Areas | §5 contains ≥1 populated row for each of the 12 unit types (7 stage-type + 5 NFR-area); Annex A contains ≥1 source citation row | Flag "V-RSR-01 FAIL — Annex A source '{Title}' has no corresponding §5 entries. Add §5 coverage or remove the Annex A citation if the source was not used." |
| V-RSR-02 | **Stage-type unit structure:** Every stage-type §5 unit (§5.1–§5.7, slugs: stage-00 through stage-y) contains all three sub-sections: `### Backlog`, `### Inclusions`, `### Exclusions` | Each of the seven stage-type `## 5.N` sections contains all three H3 headings with the exact names `Backlog`, `Inclusions`, `Exclusions` | Flag each missing sub-section: "V-RSR-02 FAIL — §5.{N} ({slug}) is missing required sub-section: `### {name}`. Stage-type units must have all three sub-tables." |
| V-RSR-03 | **NFR-area unit structure:** Every NFR-area §5 unit (§5.8–§5.12, slugs: nfr-*) contains only the NFR-NN table — no Backlog, Inclusions, or Exclusions sub-sections | Each of the five NFR-area `## 5.N` sections has zero occurrences of `### Backlog`, `### Inclusions`, or `### Exclusions` headings | Flag each non-conformant section: "V-RSR-03 FAIL — §5.{N} ({slug}) is an NFR-area unit but contains a `### {name}` sub-section. Remove it — NFR-area units use only the NFR-NN table pattern." |
| V-RSR-04 | **NFR measurable targets:** Every NFR-NN row has a `Measurable Target` value that is numeric (e.g. latency in ms, throughput in rps, availability as %) or boolean (Compliant / Non-compliant) | Zero NFR-NN rows have an empty, prose-only, or missing Measurable Target cell; `[TBD]` markers are flagged as warnings (not hard failures) but must be listed | Flag each non-conformant row: "V-RSR-04 FAIL — NFR-{NN} in §5.{N} has a non-measurable target: '{value}'. Replace with a numeric value (ms / rps / %) or a boolean (Compliant / Non-compliant)." Flag `[TBD]` rows as: "V-RSR-04 WARN — NFR-{NN} Measurable Target is `[TBD]` — must be resolved before UAT gate." |
| V-RSR-05 | **NFR-NN uniqueness:** Every `NFR-NN` ID is unique within the document — no duplicate NFR-NN numbers appear across §5.8–§5.12 | Zero duplicate NFR-ID values across all five NFR-area tables | Flag each duplicate: "V-RSR-05 FAIL — NFR-{NN} appears more than once (in §5.{A} and §5.{B}). Renumber to maintain a globally unique sequence." |
| V-RSR-06 | **Persona referential integrity:** Every persona name referenced in §5 Backlog or Inclusions rows exists in §3.2 People/Personas | Scan all §5 Backlog (Feature or Description) and Inclusions (Description) cells for named persona references. Each name found must appear in the §3.2 Personas table | Flag each missing persona: "V-RSR-06 FAIL — Persona '{name}' referenced in §5.{N} {sub-table} is not registered in §3.2 People/Personas. Add the persona to §3.2 or correct the §5 reference." |
| V-RSR-07 | **Annex A referential integrity:** Every row in Annex A (§6, Requirement Collection References) cites a real, named source document with a non-empty Title, Version, and Date | All Annex A rows have non-empty Title, Version, and Date cells; no row has placeholder values such as `[TBD]`, `Unknown`, or empty strings in these columns | Flag each non-conformant row: "V-RSR-07 FAIL — Annex A row {N} has missing or placeholder '{field}'. Provide the actual document title, version, and date, or remove the row." |
| V-RSR-08 | **§2 Platform Context structural consistency:** When both RSR and HLAD have been produced in the same pipeline session from the same upstream inputs, §2 structure in the RSR is structurally identical to §2 in the HLAD (same H2 headings, same three-layer model) | If a HLAD draft is present in the same run folder: §2.1–§2.4 heading names in RSR match §2.1–§2.4 heading names in HLAD exactly. If no HLAD draft is present: this check is waived — record "V-RSR-08 SKIP — HLAD draft not present in run folder; structural consistency check waived." | Flag any mismatch: "V-RSR-08 FAIL — RSR §2.{N} heading '{rsr_heading}' does not match HLAD §2.{N} heading '{hlad_heading}'. Both documents must use the same §2 structure when produced from shared upstream inputs." |
| V-RSR-09 | **§3 substantive prose:** Every §3 sub-section (§3.1–§3.7) has ≥1 substantive prose sentence before any table | For each of the seven `## 3.N` sections: at least 1 substantive prose sentence before the first table character in the section; a single sentence is sufficient | Flag each non-conformant sub-section: "V-RSR-09 FAIL — §3.{N} has no substantive prose before its table. Add ≥1 prose sentence sourced from the Writing Pack slot file." |
| V-RSR-10 | **NFR-area non-empty:** Every NFR-area unit (§5.8–§5.12) contains ≥1 NFR-NN row | Each of the five NFR-area `## 5.N` sections contains a table with at least 1 data row (not counting the header row) | Flag each empty section: "V-RSR-10 FAIL — §5.{N} ({slug}) NFR table has no rows. A minimum of 1 NFR-NN row is required. Apply gap protocol if the source is absent." |
| V-RSR-11 | **NFR-NN global sequence:** All NFR-NN IDs across §5.8–§5.12 form a gapless sequence: NFR-01, NFR-02, ..., NFR-N | Collect all NFR-ID values across §5.8–§5.12 in document order. Sort numerically. Confirm sequence is 1, 2, 3, ..., N with no gaps and no non-sequential jumps | Flag each gap: "V-RSR-11 FAIL — NFR sequence has a gap between NFR-{A} and NFR-{B}. Renumber NFR-IDs to maintain a gapless global sequence from NFR-01 to NFR-{N}." |
| V-RSR-12 | **Stage-type Inclusions non-empty:** Every stage-type unit's `### Inclusions` table has ≥1 row | For each of the seven stage-type `## 5.N` sections: the `### Inclusions` table contains at least 1 data row | Flag each empty Inclusions table: "V-RSR-12 FAIL — §5.{N} ({slug}) Inclusions table has no rows. An empty Inclusions table indicates an unresolved scope gap. Apply gap protocol: add `[TBD: inclusions source required]` row and record in writing-pack.gaps.md." |

---

## Validation report format

Write `.validation.md` in the run folder with this structure:

```markdown
# Validation Report — {document_id}

**Status:** PASS | FAIL  
**Date:** {ISO-8601}  
**Checks run:** 12  
**Passed:** {N}  
**Failed:** {M}  
**Warnings:** {W}

## Failures

| Rule | Description | Location |
|------|-------------|----------|
| V-RSR-{NN} | {Fail action text} | {Section / line ref} |

## Warnings

| Rule | Description | Location |
|------|-------------|----------|
| V-RSR-{NN} | {Warning text} | {Section / line ref} |

## Skipped checks

| Rule | Reason |
|------|--------|
| V-RSR-{NN} | {Skip reason} |

## Pass summary

| Rule | Result |
|------|--------|
| V-RSR-01 | PASS |
| V-RSR-02 | PASS |
...
```

If all 12 checks pass (warnings are not failures): `Status: PASS`. If any check fails: `Status: FAIL`. Warnings (V-RSR-04 `[TBD]` entries) do not cause FAIL but must be listed in the Warnings section.
