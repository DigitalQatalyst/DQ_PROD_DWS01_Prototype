# Supplement: doc-validate — cross-cutting type

**Loaded by:** orchestrator Stage V when `report_type: cross-cutting`
**Applies after:** doc-author Stage A is complete and all section gates are approved
**Output:** `.validation.md` with `STATUS: PASS` or `STATUS: FAIL — {rule list}`

This supplement defines the validation checks specific to cross-cutting LLAD documents. It is applied in addition to any universal validation rules. All checks below are mandatory; a single FAIL causes `STATUS: FAIL`.

---

## V-XC-01 — Cover page present

**Check:** The draft contains an OpenXML block with the navy cover fill colour before the first H1 heading.

**Pass condition:** At least one `{=openxml}` block containing the navy cover fill appears before the first H1 section heading.

**Fail action:** Flag "Missing cover page — OpenXML cover block absent. Add the navy cover block per the template."

---

## V-XC-02 — No inline horizontal rules in body

**Check:** The draft body (after the cover block and front-matter tables) contains no `---` horizontal rule markdown syntax.

**Pass condition:** Zero `---` lines appear after the TOC block.

**Fail action:** Flag each line number. "Horizontal rule at line {N} — remove `---` and rely on Heading 1 page-break-before for section separation."

---

## V-XC-03 — Authoring Progress absent from published document

**Check:** The draft contains no occurrence of `Authoring Progress` as a Markdown heading or as a standalone OpenXML paragraph label. Incidental occurrences inside table cells or within prose sentences are not flagged.

**Pass condition:** Zero occurrences of `Authoring Progress` as a section heading or standalone OpenXML paragraph label.

**Fail action:** Flag "Authoring Progress heading found in published draft at line {N} — this is an internal process-tracking artefact and must be removed entirely before publishing."

---

## V-XC-04 — Amendment History, Distribution List, Approval Record use OpenXML labels

**Check:** Each of Amendment History, Distribution List, and Approval Record is preceded by an OpenXML `{=openxml}` block, not a `##` Markdown heading.

**Pass condition:** All three strings appear inside `<w:t>` elements.

**Fail action:** Flag each missing block. "Replace `## {label}` with OpenXML styled paragraph."

---

## V-XC-05 — Section 1.1 Business Context present and complete

**Check:** A `## 1.1 Business Context` heading exists and is followed by a prose opener and a table with exactly 5 rows: Strategic Context, Sponsoring Organisation, User Communities, Data Sensitivity, Document Scope.

**Pass condition:** Section 1.1 present; table has 5 rows; all five row titles present.

**Fail action:** Flag missing rows. "Section 1.1 Business Context table must have exactly 5 rows: Strategic Context, Sponsoring Organisation, User Communities, Data Sensitivity, Document Scope."

---

## V-XC-06 — Section 1.2 Platform Vision present and complete

**Check:** A `## 1.2 Platform Vision` heading exists and is followed by a prose opener and a table with exactly 4 rows: Platform Objective, Platform Strategy, Technology Foundation, Architecture Model.

**Pass condition:** Section 1.2 present; table has 4 rows; all four row titles present.

**Fail action:** Flag missing rows. "Section 1.2 Platform Vision table must have exactly 4 rows: Platform Objective, Platform Strategy, Technology Foundation, Architecture Model."

---

## V-XC-07 — Section 1.3 sub-sections all present

**Check:** The draft contains `### 1.3.1 Design Scope`, `### 1.3.2 Platform Architecture Document Set`, and `### 1.3.3 Baseline References`.

**Pass condition:** All three H3 headings present.

**Fail action:** Flag missing heading(s). "Section 1.3 is missing required sub-sections."

---

## V-XC-08 — Section 1.3.2 table uses correct columns

**Check:** The Section 1.3.2 Platform Architecture Document Set table has columns `ID | Document | System / Scope | Type | Status`. The `#` row-numbering column is not used in this table (IDs are the identifier).

**Pass condition:** Header row matches the required column names (case-insensitive, order must match). Exactly 5 columns; no leading `#` column.

**Fail action:** "Section 1.3.2 table columns do not match required schema: `ID | Document | System / Scope | Type | Status`."

---

## V-XC-09 — Section 1.3.3 governing paragraph present

**Check:** After the `### 1.3.3 Baseline References` table, a governing paragraph exists containing the phrases "specified in the corresponding system LLAD" and "does not reproduce".

**Pass condition:** Both phrases present in the paragraph following the Section 1.3.3 table.

**Fail action:** "Section 1.3.3 governing paragraph absent or incomplete. Add the standard governing paragraph per doc-author section 4.1 step 10."

---

## V-XC-10 — Sections 3.1 through 3.4 all present

**Check:** The draft contains `## 3.1 Concern Mandate`, `## 3.2 Governing Boundaries`, `## 3.3 Relationship to Other Cross-Cutting Documents`, and `## 3.4 Design Principles`.

**Pass condition:** All four H2 headings present.

**Fail action:** Flag missing heading(s). "Section 3 is missing required sub-sections per doc-author-cross-cutting.md."

---

## V-XC-11 — Section 3.4 Design Principles table 5 columns or fewer

**Check:** The Section 3.4 Design Principles table does not exceed 5 columns. The correct schema is `ID | Principle | Rationale | Implication | Baseline reference` (no `#` column — `ID` is the row identifier, e.g. AP-01).

**Pass condition:** Column count 5 or fewer. First column is `ID`, not `#`.

**Fail action:** "Section 3.4 Design Principles table has {N} columns — maximum is 5. Drop the `#` column; use `ID` (AP-NN format) as the row identifier."

---

## V-XC-12 — Section 4 substantive content (all LLAD and MCR versions)

**Background:** Section 4 is required to be fully populated in all cross-cutting LLAD versions. Placeholder scaffolds are not accepted. Section 4.1 must describe the fit-gap methodology including Type 1/2/3 gap classification. Section 4.2 must trace HLAD/RSR baseline requirements. Section 4.3 must cover NFR requirements. Section 4.4 must contain only Type 1 (design-decision-outstanding) gaps.

**Check:** Sections 4.1, 4.2, 4.3, and 4.4 all exist as headings and contain substantive content — not italic placeholder sentences.

**Pass condition:** All four sub-sections present; Section 4.1 contains substantive prose (including gap classification methodology); Section 4.2 contains a table with at least 3 rows; Section 4.3 contains a table with at least 2 rows; Section 4.4 contains the mandatory opening sentence referencing the LLAD Traceability Annex followed by either a populated gap table or an explicit statement that no open design gaps exist.

**Fail action (placeholder found):** "Section 4.{N} contains placeholder/scaffold text — cross-cutting LLADs must populate section 4 in full."

**Fail action (missing heading):** "Section 4.{N} heading is absent entirely — all four sub-sections must be present and substantively authored."

**Fail action (section 4.4 missing mandatory opener):** "Section 4.4 does not open with the required sentence referencing the LLAD Traceability Annex — add the mandatory opener per doc-author-adgr.md section 1."

---

## V-XC-13 — Concern domains match registry

**Check:** The document has YAML front matter containing a `concern_domains` field, and every domain slug listed there is present as a `## 5.N` heading in the body.

**Pass condition:** YAML front matter is present; `concern_domains` field exists and is non-empty; every domain slug in `concern_domains` corresponds to a `## 5.N` section.

**Fail action (absent front matter):** "YAML front matter is missing — add front matter with at least `concern_domains` field before publishing."

**Fail action (missing domain):** Flag missing domain(s). "Concern domain `{slug}` listed in front matter has no corresponding section 5.N section."

---

## V-XC-14 — Each concern domain has sections 5.N.1 through 5.N.5

**Check:** For each `## 5.N` domain, the sub-sections `### 5.N.1 Domain Scope`, `### 5.N.2 Design`, `### 5.N.3 Per-System Application`, `### 5.N.4 Constraints and Obligations`, and `### 5.N.5 Architecture Decisions and Open Items` are all present.

**Note:** The last sub-section must be titled exactly `Architecture Decisions and Open Items` — not `Open Items` alone. The short form `Open Items` is a fail.

**Pass condition:** All five H3 sub-sections present for every domain, with the correct heading titles.

**Fail action:** Flag missing or misnamed sub-sections by domain. "Section 5.{N} is missing sub-section(s): {list}." / "Section 5.{N}.5 is titled '{actual}' — must be 'Architecture Decisions and Open Items'."

---

## V-XC-15 — No Markdown table exceeds 5 columns

**Check:** Every Markdown pipe table in the document body has at most 5 columns. OpenXML `{=openxml}` blocks are exempt.

**Detection pattern (grep):** Any pipe-table line with 6 or more column separators. Run against the body of the draft to find violating lines before beginning the pass/fail assessment.

**Known common offenders:**
- **Appendix C Reference Documents table** — if it has 6 columns, fold two adjacent columns.
- **Env var tables** — if a `#` row-numbering column is added to a 5-column env var table it becomes 6. Drop `#` from env var tables; use row order for numbering.
- **Section 3.4 Design Principles** — dropping the `#` column (using `ID` as the identifier) keeps it at exactly 5 columns.

**Pass condition:** Column count 5 or fewer for all Markdown pipe tables. OpenXML blocks are not counted.

**Fail action:** Flag each violating Markdown table with its heading context and column count. "Table under '{heading}' has {N} columns — maximum is 5. Split into paired tables linked by a shared identifier column, or merge two adjacent columns."

---

## V-XC-16 — No file paths in body prose

**Check:** Body prose (not table cells, not the cover block, not OpenXML blocks) contains no backtick-wrapped file paths beginning with `src/`, `middleware/`, `routes/`, `api/`, or similar repo-relative paths.

**Pass condition:** Zero occurrences of backtick-wrapped repo-relative paths in prose sentences outside table cells.

**Fail action:** Flag each occurrence with line number. "File path in body prose at line {N} — replace with formal system or component name."

---

## V-XC-17 — Section 5.N.3 Per-System Application table uses correct columns

**Check:** Every `### 5.N.3 Per-System Application` table uses columns `# | System | How concern applies | Key artefact | Conformance status`. The `#` column is required as the first column (row-numbering).

**Pass condition:** Header row matches (case-insensitive, order must match). `#` is present as column 1.

**Fail action:** Flag each non-conformant table. "Section 5.{N}.3 Per-System Application table has wrong columns — required schema: `# | System | How concern applies | Key artefact | Conformance status`."

---

## V-XC-18 — Section 5.N.4 Constraints table uses correct columns

**Check:** Every `### 5.N.4 Constraints and Obligations` table uses columns `# | Constraint | Source | Applies to | Consequence of breach`. The `#` column is required as the first column (row-numbering).

**Pass condition:** Header row matches (case-insensitive, order must match). `#` is present as column 1.

**Fail action:** Flag each non-conformant table. "Section 5.{N}.4 Constraints table has wrong columns — required schema: `# | Constraint | Source | Applies to | Consequence of breach`."

---

## V-XC-19 — Section 6.2 ADR table opens with correct intro sentence

**Check:** The Section 6.2 Architecture Decision Records section opens with a sentence containing "recorded in full in the LLAD Traceability Annex".

**Pass condition:** That phrase present in the Section 6.2 opening paragraph.

**Fail action:** "Section 6.2 intro does not reference the LLAD Traceability Annex."

---

## V-XC-20 — Section 4.4 Gap Register intro uses correct phrasing

**Check:** The Section 4.4 Gap Register section opens with a sentence beginning "Design gaps identified during the fit-gap assessment are recorded in full in the LLAD Traceability Annex".

**Pass condition:** That phrase present as the first sentence of Section 4.4.

**Fail action:** "Section 4.4 opening sentence does not match required phrasing."

---

## V-XC-21 — No pre-implementation evidence language in conformance status columns

**Background:** Cross-cutting LLADs are pre-implementation specifications. Conformance columns must describe what the specification requires, not what has or has not been provisioned.

**Check:** Scan all table cells in `Conformance status` columns (sections 4.2, 4.3) and `Conformance status` columns (sections 5.N.3). Flag any cell containing any of the following phrases (case-insensitive):
- "Partial"
- "not yet deployed"
- "not yet live"
- "not implemented"
- "not configured"
- "not in place"
- "Gap — not"
- "currently not"

**Pass condition:** Zero occurrences of any flagged phrase (case-insensitive) in conformance status cells.

**Fail action:** For each occurrence: "Pre-implementation evidence language in conformance cell at section {N}.{M}: '{text}' — replace with 'Specification conformant — [gate condition]' or 'Gap — design decision outstanding (SYS-G-NNN)'."

---

## V-XC-22 — Section 4.4 contains only open design decisions; build tasks are in section 6.5

**Background:** The Section 4.4 Design Gaps table must contain only items where the architect must still make a design choice. Items where the design is decided but provisioning, IaC authoring, drill execution, or evidence capture remains are build-and-evidence tasks — they belong in Section 6.5, not in Section 4.4.

**Check:** Review each row in the Section 4.4 table. Apply two checks:

**(a) Build-task indicators (case-insensitive):** Flag any row whose description contains any of the following phrases: "specified in section 5", "design-complete", "defined in section 5", "not provisioned", "IaC", "terraform", "bicep", "manifest", "drill execution", "evidence capture", "provisioning", "deployment pending", "not yet deployed".

**(b) Positive design-decision check:** Every Section 4.4 row description must represent an unresolved architectural choice. If a row does not describe a decision the architect must still make, flag it as a candidate Type 2 item.

**Pass condition:** Zero rows contain build-task indicator phrases. Every row description represents an unresolved architectural choice.

**Fail action:** "Section 4.4 row '{Gap ID}' describes a build task, not an open design decision — move to section 6.5 CRD/AB-XC backlog."

---

## V-XC-23 — Section 6.5 Configuration Record Backlog present

**Background:** Section 6.5 is required for all cross-cutting LLADs once any Type 2 (design-complete, build-task) items exist.

**Check:** The draft contains a `### 6.5 Configuration Record Backlog` heading. If Section 6.5 exists, verify it either contains a populated table or explicitly states "No build or evidence backlog items are recorded for this document version." Verify no row in the Section 6.5 table describes an unresolved design decision.

**Pass condition (Section 6.5 absent):** If Section 4.4 is also empty (no open gaps) and no Type 2 items were identified, Section 6.5 absence is acceptable — record advisory only.

**Pass condition (Section 6.5 present):** Section 6.5 heading exists; contains table or explicit no-items sentence; no row describes an open design decision.

**Fail action (Section 6.5 absent when Type 2 items exist):** "Section 6.5 Configuration Record Backlog is absent — if any design-complete build or evidence tasks exist, Section 6.5 must be present."

**Fail action (Type 1 item in Section 6.5):** "Section 6.5 row '{Item}' describes an open design decision — move to Section 4.4."

---

## Validation report format

Write `.validation.md` in the run folder with this structure:

```markdown
# Validation Report — {document_id}

**Status:** PASS | FAIL
**Date:** {ISO-8601}
**Checks run:** 23
**Passed:** {N}
**Failed:** {M}

## Failures

| Rule | Description | Location |
|------|-------------|----------|
| V-XC-{NN} | {Fail action text} | {Section / line ref} |

## Pass summary

| Rule | Result |
|------|--------|
| V-XC-01 | PASS |
...
```

If all 23 checks pass: `STATUS: PASS`. If any check fails: `STATUS: FAIL`.
