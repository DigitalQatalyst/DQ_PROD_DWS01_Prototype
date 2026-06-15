---
shared-source: shared/docs/pipeline/generate-architecture-docs.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Agent: generate-architecture-docs (Orchestrator)

**Version:** 2.0 (Writing Pack + Gate protocol)  
**Purpose:** Drive the LLAD pipeline — doc-research → Writing Pack → doc-author (section by section, gated) → doc-validate → targeted fix → completion.

---

## 0. How to invoke this pipeline

This pipeline is prompt-based and runs on any AI agent platform (Claude, GPT, Gemini, etc.). It is **not** a slash command or CLI tool. The only requirement is that the agent reads this file before starting — this is what anchors it to the v2.0 Writing Pack protocol rather than inferring an approach from existing workspace artefacts.

### Invocation prompt (copy and adapt)

```
Read `ai-agent-rules/agents/architecture-documentation/generate-architecture-docs.md`
and follow it as the orchestrator for a new LLAD pipeline run.

Inputs:
- HLAD: <path to hlad.md>
- RSR: <path to rsr.md>
- Target version: <e.g. 1.0>
- In-scope repo: <repo folder name>
- Report type: <architecture | interoperability | configuration | cross-cutting>
- DOCX export: yes
```

**Example (a REST API repo, v1.0, interoperability type):**

```
Read `ai-agent-rules/agents/architecture-documentation/generate-architecture-docs.md`
and follow it as the orchestrator for a new LLAD pipeline run.

Inputs:
- HLAD: ../<platform>/.ai/hlad.md
- RSR: ../<platform>/.ai/rsr.md
- Target version: 1.0
- In-scope repo: <api-repo-name>
- Report type: interoperability
- DOCX export: yes
```

**Example (a frontend SPA, v2.2 amendment, architecture type):**

```
Read `ai-agent-rules/agents/architecture-documentation/generate-architecture-docs.md`
and follow it as the orchestrator for a new LLAD pipeline run.

Inputs:
- HLAD: .ai/hlad.md
- RSR: .ai/rsr.md
- Target version: 2.2
- In-scope repo: <spa-repo-name>
- Report type: architecture
- DOCX export: yes
```

### Why "read this file first" is mandatory

Without an explicit directive to read this file, an agent will infer its approach from:
- Existing workspace artefacts (e.g. old `.research-bundle-*.md` files → triggers v1.x free-form pipeline)
- Training priors about what architecture documents look like

Neither produces the v2.0 Writing Pack output. The explicit file read is the pipeline anchor.

### DOCX export: run pandoc from repo root

Pandoc must be invoked from the **repo root** (the repo containing `workspace/` and `.ai/`), not from the run folder. Running from the run folder causes relative image paths (e.g. `.ai/assets/`) to fail to resolve and produces a document without embedded images.

```bash
# Correct — run from repo root
cd <your-repo>
python ai-agent-rules/templates/docx/strip-export.py \
  workspace/generated/{run}/draft.md \
  workspace/generated/{run}/draft-export.md
pandoc workspace/generated/{run}/draft-export.md \
  -o workspace/generated/{run}/report.docx \
  --reference-doc=ai-agent-rules/templates/docx/reference.docx \
  --lua-filter=ai-agent-rules/templates/docx/strip-source-comments.lua
```

### Blockers to check before invoking on a new repo

| Blocker | Affects type | Impact | Resolution |
|---------|-------------|--------|------------|
| No `docs/feature-delivery/{stage}/{slug}/SPEC.md` files | `architecture` | doc-author blocks at §5 feature modules (Lens 1 has no source) | Author SPEC files first, or waive: "waive §5 Feature Modules — no SPECs exist; note absence in §4 gap register" |
| No exported solution artefacts in repo | `configuration` | doc-research cannot confirm as-built state | Export current solution from the relevant environment and commit to repo before running |
| No route files or router entry point discoverable | `interoperability` | doc-research §3.2 API Surface Overview cannot be populated | Confirm repo entry point and router registration files before running |
| `.ai/platform-document-map.md` absent | `cross-cutting` | §1.3.1 in-scope systems table cannot be populated | Run platform inventory first; commit platform-document-map.md |
| Old v1.x artefacts in `workspace/generated/` | all | Agent may drift back to v1.x pipeline format | Clear or ignore old artefacts; new run folder is the only state source |
| HLAD / RSR not yet produced | all | Pipeline halts at Stage R with BLOCKED status | Supply paths or record waiver in task ledger |
| `workspace/llad-annex/` absent or empty | all | Stage 0 (Annex Sync) cannot read existing Gap IDs / ADR IDs; new entries risk ID collision | Run the annex initialisation first; at minimum `annex-gap-register.md` and `annex-adr.md` must exist |

---

## 1. Role

The orchestrator is the entry point. It maintains the task ledger, enforces stage gates, and coordinates the three specialist agents. It does not author prose or validate content — it manages state and transitions.

The orchestrator is stateless across sessions. On any resume, it reads the run folder's gate files to determine the current pipeline position and continues from there.

---

## 2. Inputs required before starting

| Input | Source | Required? |
|-------|--------|-----------|
| HLAD document path | User-supplied | Required (waiver must be recorded in ledger) |
| RSR document path | User-supplied | Required (waiver must be recorded in ledger) |
| Target LLAD version | User-supplied | Required |
| In-scope repo root(s) | `.ai/context.md` | Required |
| Report type | User-supplied | Required (default: `architecture` if omitted) |
| Feature stage list / domain list / concern domain list | User-supplied or task ledger | Required for §5; varies by report type |
| DOCX export flag | User-supplied | Optional |

### 2.1 Required upstream input validation

Before any stage executes, the orchestrator validates that all required upstream inputs declared in the matched registry row have been supplied.

**Parsing rule:** Read the `Required upstream inputs` field from the registry row. It is a comma-separated list of descriptors in the form `{NAME} (path)`, where `{NAME}` is either an uppercase slug (e.g. `BRS`, `HLAD`, `RSR`, `BASELINE_LLA`) or a lowercase relative path (e.g. `.ai/platform-document-map.md`). To extract `{NAME}` from a descriptor, strip the literal suffix ` (path)` from the end of the descriptor string; everything before that suffix is the `{NAME}` to match against the task ledger Inputs table (case-insensitive). For each descriptor:

1. Search the task ledger Inputs table for a row whose `Input` column matches `{NAME}` (exact, case-insensitive) or matches the relative-path form of the descriptor.
2. If found with a non-empty path value or `Status: Waived` — check passes.
3. If the row is missing, or `Status: —` (placeholder/unspecified), halt immediately with:
   > `STATUS: BLOCKED — REQUIRED UPSTREAM INPUT NOT PROVIDED: {NAME}. Supply path or record waiver in task ledger.`

**Waiver protocol:** Any required input may be waived by recording a row in the task ledger Inputs table with `Status: Waived` and a waiver rationale in the Notes column. The orchestrator must confirm the waiver rationale text is present before accepting the waived status; a row with `Status: Waived` and an empty Notes column does not satisfy the check.

This rule applies to all report types. Existing types that declare `Required upstream inputs: HLAD (path), RSR (path)` continue to require both by default; the LLAD/MCR pipelines therefore behave identically to the previous hardcoded `HLAD/RSR NOT PROVIDED` halt.

### 2.2 Supplement loading

**Before invoking doc-research or doc-author**, the orchestrator must:

1. Read `ai-agent-rules/templates/registry.md` (exact path — registry lives in `templates/`, not `supplements/`) and find the row matching `report_type`. If this file is absent: halt with `STATUS: BLOCKED — REGISTRY FILE MISSING: ai-agent-rules/templates/registry.md. Verify submodule is initialised.`
2. Read the `Supplements` field — it lists one or more supplement file paths.
3. Load each supplement file in the order listed. For configuration sub-types, the shared protocol file is always listed first.
4. Record which supplement files were loaded in the task ledger under a "Supplements loaded" table.
5. Pass the loaded supplement content to doc-research as an override for §4.3 and §4.6 instructions, and to doc-author as an override for §4.3 and §4.6 instructions.

The supplement files live at: `ai-agent-rules/agents/architecture-documentation/{supplement-path}`.

If `report_type` is not in the registry, halt: `STATUS: BLOCKED — UNKNOWN REPORT TYPE: {value}. Check registry.md for valid slugs.`

---

## 3. Run folder

On each new run, create:

```
workspace/generated/v{version}-{YYYYMMDDTHHmmss}/
  draft.md                         <- assembled LLAD document
  writing-pack/                    <- Writing Pack (produced by doc-research)
  gates/                           <- gate sentinel files
  .validation.md                   <- validation report (produced by doc-validate)
  task-ledger.md                   <- orchestrator state log
```

All agents write to and read from this folder. The run folder is the single source of state for a pipeline run.

---

## 4. Pipeline stages

### Stage 0 — Annex Sync (mandatory prerequisite — runs before every LLAD and MCR pipeline)

**Purpose:** The LLAD Traceability Annex (`workspace/llad-annex/`) is the single authoritative source for all platform Gap IDs and ADR IDs. Stage 0 ensures the orchestrator knows the current state of the annex before research begins, and that any new gaps or decisions discovered during the run are committed to the annex before authoring starts.

**Step 0a — Read annex state (before Stage R):**

**Participation check:** Read the `annex_participation` field from the matched registry row (default: `full` if the field is absent). If `none`, skip Stage 0a entirely and log: `Stage 0a — Annex skipped (annex_participation: none)`. Otherwise proceed.

1. Read `workspace/llad-annex/annex-gap-register.md` — extract all existing Gap IDs and their Status. Pass this list to doc-research as `annex_gap_ids` context so research can reference existing gaps and avoid ID collision when identifying new ones.
2. Read `workspace/llad-annex/annex-adr.md` — extract all existing ADR IDs. Pass as `annex_adr_ids` context to doc-research.
3. Record in task ledger: `Stage 0a — Annex read: {N} gaps, {M} ADRs loaded`.
4. If either file is absent: halt with `STATUS: BLOCKED — ANNEX FILE MISSING: {filename}. Create the file in workspace/llad-annex/ before running the pipeline.`

**Step 0b — Append new entries (after Stage R, before Stage A):**

After doc-research completes and `writing-pack.complete.md` exists:

**Participation check:** Read the `annex_participation` field from the matched registry row (default: `full`). If `none`, skip Stage 0b entirely and log: `Stage 0b — Annex skipped (annex_participation: none)`; proceed to Stage A. If `open-items-only`, the gap-append steps run unchanged but the ADR-append step is skipped — log: `Stage 0b — ADR append skipped (annex_participation: open-items-only)`.

1. Read `writing-pack/annex-gaps.md` (produced by doc-research — see below). For each new gap entry, append one row to `workspace/llad-annex/annex-gap-register.md`. Allocate the next sequential Gap ID for the system prefix.
2. **ADR append check:** If `annex_participation == open-items-only`, skip this step (do not read `writing-pack/annex-adrs.md` and do not append to `workspace/llad-annex/annex-adr.md`). Otherwise: read `writing-pack/annex-adrs.md` (produced by doc-research). For each new ADR entry, append one row to `workspace/llad-annex/annex-adr.md`. Allocate the next sequential ADR ID for the system prefix.
3. If neither file exists or both are empty, record `Stage 0b — No new gaps or ADRs identified` in task ledger. Proceed.
4. Regenerate the Excel workbook to include the new rows:
   ```bash
   python scripts/generate_annex_xlsx.py
   ```
5. Record in task ledger: `Stage 0b — Annex updated: {N} gaps appended, {M} ADRs appended; Excel regenerated`.

**Step 0c — Update on resolution and regenerate Excel (after Stage C, LLAD/MCR complete):**

After the LLAD or MCR is completed and validated:

**Participation check:** Read the `annex_participation` field from the matched registry row (default: `full`). If `none`, skip Stage 0c entirely and log: `Stage 0c — Annex skipped (annex_participation: none)`. If `open-items-only`: run the gap-update and Excel-regeneration steps unchanged (no ADR-side steps apply to Stage 0c for this type). Log: `Stage 0c — ADR steps not applicable (annex_participation: open-items-only)`.

1. For any gap whose Status changed during this run (e.g. Open → Resolved, Open → Deferred): update the corresponding row in `annex-gap-register.md`. Populate the Evidence column for resolved items.
2. Regenerate the Excel workbook:
   ```bash
   python scripts/generate_annex_xlsx.py
   ```
   This overwrites `workspace/llad-annex/{{system-name}} LLAD Gap Assessment.xlsx` with all six sheets (four traceability matrices + Gap Register + ADR Register) from the current markdown source files.
3. Record in task ledger: `Stage 0c — Annex resolution update: {N} rows updated; Excel regenerated`.

**doc-research annex output (mandatory for Stage 0b):**

doc-research must produce two slot files in `writing-pack/` when new gaps or ADRs are identified:

`writing-pack/annex-gaps.md` — one row per new gap. Must include `Type` and `Initial Status` columns so the orchestrator can set the correct annex status on append:
```
| {SYS}-G-{NNN} | {System} | {Title} | {Description} | {Priority} | {Remediation} | {Owner} | {Resolution gate} | {Type: 1|2|3} | {Initial Status: Open|Deferred|Resolved} | {Evidence if Type 2/3} | {Source document} | {ADR reference if any} |
```

`writing-pack/annex-adrs.md` — one row per new ADR (all columns from the ADR schema):
```
| ADR-{SYS}-{NNN} | {System scope} | {Title} | {Status} | {Date} | {Context} | {Decision} | {Rationale} | {Consequences} | {Gap reference if any} | {Source document} |
```

If no new gaps or ADRs are identified, create the files with a single line: `<!-- No new entries for this run -->`.

**Stage 0b orchestrator actions (detailed):**

**Participation check:** Read the `annex_participation` field from the matched registry row (default: `full`). If `none`, skip the entire detailed block below and log `Stage 0b — Annex skipped (annex_participation: none)`. If `open-items-only`, run gap-side steps unchanged and skip the ADR-append step (noted inline below).

1. Read `writing-pack/annex-gaps.md`. For each row: validate that Gap ID matches `{SYS}-G-{NNN}` format; validate Type is 1, 2, or 3; validate Initial Status is one of `Open`, `Resolved`, `Deferred`. On any schema mismatch: halt with `STATUS: BLOCKED — ANNEX SLOT FILE MALFORMED: writing-pack/annex-gaps.md row {N}. Fix doc-research output before proceeding.`
2. Append each valid gap row to `workspace/llad-annex/annex-gap-register.md`. Set the annex `Status` column from `Initial Status` (not defaulting all to `Open`). Type 2 items must arrive in the annex as `Deferred`.
3. **ADR append check:** If `annex_participation == open-items-only`, skip this step and log `Stage 0b — ADR append skipped (annex_participation: open-items-only)`. Otherwise: read `writing-pack/annex-adrs.md` and append each row to `workspace/llad-annex/annex-adr.md`.
4. Regenerate the Excel workbook from **repo root**:
   ```bash
   python scripts/generate_annex_xlsx.py
   ```
   If script exits non-zero: halt with `STATUS: BLOCKED — ANNEX EXCEL REGENERATION FAILED. Check scripts/generate_annex_xlsx.py and Python environment.`
5. Regenerate the §4 fit-gap Writing Pack slot (`writing-pack/s4-fit-gap.md` or equivalent) to include the newly allocated Gap IDs so doc-author's §4.4 assembly has the complete gap list. If this slot does not exist for the current report type, record "No §4 fit-gap slot for this report type" in the ledger.
6. Record in task ledger: `Stage 0b — Annex updated: {N} gaps appended ({K} Type 1 Open, {M} Type 2 Deferred), {P} ADRs appended; Excel regenerated`.

**Stage 0c orchestrator actions:**

After the LLAD or MCR is completed and validated:

**Participation check:** Read the `annex_participation` field from the matched registry row (default: `full`). If `none`, skip the entire block below and log `Stage 0c — Annex skipped (annex_participation: none)`. If `annex_participation == open-items-only`: proceed normally — gap-update steps apply; ADR steps are not present in Stage 0c and no skip is needed. Log: `Stage 0c — ADR steps not applicable (annex_participation: open-items-only)`.

1. For any gap whose Status changed during this run: update the corresponding row in `annex-gap-register.md`. Populate the Evidence column for resolved/deferred items.
2. Regenerate the Excel workbook from **repo root**:
   ```bash
   python scripts/generate_annex_xlsx.py
   ```
   If script exits non-zero: halt with `STATUS: BLOCKED — ANNEX EXCEL REGENERATION FAILED at Stage 0c.`
3. Record in task ledger: `Stage 0c — Annex resolution update: {N} rows updated; Excel regenerated`.

**ORCH-0:** The orchestrator must not invoke doc-author (Stage A) until Step 0b is complete, the annex files are updated, the Excel has been successfully regenerated, and the §4 fit-gap slot reflects the current annex gap list. Authoring blocks on annex sync.

> **Participation note:** For `annex_participation == open-items-only` types, ORCH-0 is satisfied when gap-sync (and Excel regeneration) is complete; ADR sync is not required. For `annex_participation == none` types, ORCH-0 is auto-satisfied (no annex sync required) — the orchestrator may proceed directly to Stage A once Stage R and Stage P clear.

---

### Stage R — Research

**Invoke:** doc-research with the run folder path and input list.

**doc-research produces:** `writing-pack/` slot files and ultimately `writing-pack.complete.md`.

**Orchestrator action on completion:** Proceed to Stage P.

**Orchestrator action on gap:** If doc-research writes `writing-pack.gaps.md` without `writing-pack.complete.md`, surface gaps to the user. On user resolution (user supplies missing information or grants a waiver), re-invoke doc-research for the gap fields only, then re-run Stage P.

---

### Stage P — Pre-flight

**Invoke:** `ai-agent-rules/protocols/writing-pack-completeness-check.md` checks PF-1 through PF-6.

**Orchestrator action on PASS:** Record `Pre-flight: PASS` in task ledger. Proceed to Stage A.

**Orchestrator action on FAIL:** Record failures in task ledger. Return to Stage R with the pre-flight report as input. Do not proceed to authoring.

**ORCH-1:** The orchestrator must not invoke doc-author until `writing-pack.complete.md` exists, Stage P reports PASS, and `gates/preflight.report.md` records OVERALL: PASS.

**ORCH-1a (supplement verification):** Before invoking doc-author, confirm the supplements listed in the registry for this `report_type` were loaded and recorded in the task ledger "Supplements loaded" table. If any supplement is missing from the ledger: halt with `STATUS: BLOCKED — SUPPLEMENT NOT LOADED: {filename}. Re-run §2.1 supplement loading before authoring.`

**ORCH-1b (slot file verification):** Verify every slot file referenced by the concern domain list (or feature list / route domain list for other types) exists in `writing-pack/` and is non-empty. If any slot file is missing or empty: surface the gap to the user before proceeding to authoring. Do not allow doc-author to hallucinate content for an empty slot.

**Halt response protocol:** For any `STATUS: BLOCKED — ...` halt, end the response turn after surfacing the block reason and the exact remediation step. Do not infer remediation or attempt to work around the block. Wait for the user to supply the missing input or explicitly waive the requirement.

---

### Stage A — Authoring (section by section, gated)

**Invoke:** doc-author with the run folder path.

doc-author processes one section at a time. After each section, it fires a gate per `ai-agent-rules/protocols/stage-gate-protocol.md`. In a single-agent conversational run, "monitors the gates folder" means: after writing `.gate-request-{N}.md` and pasting the gate summary in the response turn, end the response. The human's next reply is the only valid gate signal. The agent must never self-approve by writing `.gate-approved-{N}.md` or by continuing authoring in the same response turn as the gate request (GATE-2).

**Section order:**

All types follow §1 → §2 → §3 → §4 → §5 (one gate per unit) → §6 Appendices.

| Section | architecture | interoperability | configuration | cross-cutting |
|---------|-------------|-----------------|--------------|---------------|
| §1 | Overview and Introduction | ← same | ← same | ← same |
| §2 | Platform Context | ← same | ← same | ← same |
| §3 | [System] Architecture | API Architecture | System Configuration Architecture | Concern Architecture Overview |
| §4 | Fit-Gap Analysis | ← same | ← same | Fit-Gap Analysis (full — Type 1/2/3 per `doc-author-cross-cutting.md §4`) |
| §5 gates | One gate per feature_module | One gate per route_domain | One gate per config_group | One gate per concern_domain |
| §6 | Appendices A–E | Appendices A–E + F (API Catalog) | Appendices A–E | Appendices A–E |

Gate numbering:
- Gate 1 = §1; Gate 2 = §2; Gate 3 = §3; Gate 4 = §4; Gates 5-N = §5 units (one gate per unit); Gate N+1 = §6 Appendices.

**ORCH-2:** After doc-author writes `.gate-request-{N}.md`, the orchestrator halts. It must not invoke doc-author for the next section until `.gate-approved-{N}.md` exists in the gates folder.

> **Conversational AI context:** "Halts" means the agent ends its response turn after writing the gate request and pasting the gate summary for the user to read. The agent must not continue authoring in the same response. The user's next reply is the gate signal — an explicit approval triggers `.gate-approved-{N}.md` and the next section; a rejection or revision request triggers ORCH-3. An agent must never write `.gate-approved-{N}.md` itself (GATE-2). See `ai-agent-rules/protocols/stage-gate-protocol.md` for the full conversational halt definition.

**ORCH-3:** On `.gate-rejected-{N}.md` appearing, the orchestrator re-invokes doc-author with the rejection instructions scoped to the rejected section only. It does not re-author any previously approved section.

**ORCH-4:** The orchestrator records each gate outcome in the task ledger:

```
Gate {N} | Section {ID} | {APPROVED | REJECTED (n) | STUCK} | {timestamp}
```

**ORCH-5 (resume):** On resume after a gap (new session, agent restart), the orchestrator reads the gates folder, finds the highest-numbered `.gate-approved-{N}.md`, and instructs doc-author to continue from the next section. No approved section is re-authored.

---

### Stage V — Validation

**Supplement loading (mandatory before invoking doc-validate):**

Before invoking doc-validate, check whether a type-specific validation supplement exists:

```
supplements/{report_type}/doc-validate-{report_type}.md
```

If the file exists, load it and pass it to doc-validate as an override — the supplement defines additional checks specific to the report type. The supplement checks run **in addition to** any universal validation rules.

| Report type | Validate supplement | Checks added |
|-------------|--------------------|----|
| `architecture` | — (no supplement) | Universal checks only |
| `interoperability` | — (no supplement) | Universal checks only |
| `cross-cutting` | `supplements/cross-cutting/doc-validate-cross-cutting.md` | V-XC-01 through V-XC-23 |
| `configuration` | — (no supplement) | Universal checks only |

**Invoke:** doc-validate with the run folder path and the loaded supplement (if any).
**DOCX export (if requested):** Convert `draft.md` to DOCX using Pandoc with `reference.docx`. Strip `<!-- src: … -->` citation comments via Lua filter before export. Do not include `--toc` flag (TOC is embedded as OpenXML block).
**Orchestrator action on PASS:** `.validation.md` must exist with first line `STATUS: PASS`. Record `Validation: PASS` in task ledger. Proceed to Stage C.

**Orchestrator action on FAIL:** Invoke `ai-agent-rules/protocols/targeted-fix-protocol.md`. Do not re-run doc-author end-to-end.

**ORCH-6:** Completion requires `.validation.md` to exist with first non-empty line `STATUS: PASS`. A missing file, a file with `STATUS: FAIL`, or a file with any other content means the document is not complete regardless of prose quality.

---

### Stage F — Targeted fix loop

**Invoke:** `ai-agent-rules/protocols/targeted-fix-protocol.md` with the validation report as input.

**Loop:** Fix → re-run doc-validate scoped to cited sections → check `.validation.md`. Repeat until `STATUS: PASS` or until TF-6 escalation.

**ORCH-7:** On TF-6 escalation (three consecutive failures on the same span), the orchestrator halts and surfaces `.fix-stuck-{section}-{rule}.md` to the user. It does not attempt further automated fixes.

---

### Stage C — Completion

**Conditions for completion:**
1. Re-scan the `gates/` folder and verify `.gate-approved-{N}.md` sentinel files exist for every gate number up to and including the §6 Appendices gate. Do not rely on the task ledger alone — derive completion state from the sentinel files on disk. If any gate sentinel is missing: halt with `STATUS: BLOCKED — GATE SENTINEL MISSING: .gate-approved-{N}.md not found. Gate {N} must be formally approved before completion.`
2. `.validation.md` exists with `STATUS: PASS`.
3. Approval Record and Distribution List are expanded from Writing Pack front matter.

**Annex Excel regeneration (always):** Run the annex generation script from **repo root** to keep the Excel workbook in sync with the markdown source:
```bash
python scripts/generate_annex_xlsx.py
```
If script exits non-zero: halt with `STATUS: BLOCKED — ANNEX EXCEL REGENERATION FAILED at Stage C.`

This is always run at completion — whether or not new gaps or ADRs were added during this run.

**DOCX export (if requested):** Convert `draft.md` to DOCX using the mandatory export procedure above for **all report types**. Always run from repo root, always use `strip-export.py`, always pass `--reference-doc`, and always apply `strip-source-comments.lua`. Do not include `--toc` flag (TOC is embedded as OpenXML block).

**Publish checklist (cross-cutting documents only — `report_type: cross-cutting`):**

After a cross-cutting LLAD reaches Stage C COMPLETE, four external artefacts must be updated. Record each as done in the task ledger:

1. **`.ai/platform-document-map.md`** — change the document's status from `Planned` or `Draft` to `Published — vX.Y (YYYY-MM-DD)` and add the `workspace/generated/` path.
2. **Workspace `CLAUDE.md`** — add the document to the "Published cross-cutting architecture documents" table with ID, version, date, and path.
3. **Per-repo `CLAUDE.md` files** (all repos in scope per §1.3.1) — add a "Cross-cutting architecture" section referencing the new document, scoped to that repo's specific obligations (not a generic reference).
4. **`.ai/deployment-design.md` (or equivalent primer)** — if the published document supersedes content in any `.ai/` primer, add a reconciliation note stating what the new document supersedes.

If any of the four steps cannot be completed (e.g. a repo is not accessible), record it as an open action in the task ledger: `POST-C — {artefact}: update pending`.

**Final record:** Write `STATUS: COMPLETE` and the run summary to task ledger.

---

## 5. Task ledger format

Maintain `task-ledger.md` in the run folder throughout the pipeline:

```markdown
# Task Ledger

**Run:** workspace/generated/{run}/
**Version:** {document version}
**Started:** {ISO-8601}
**formal-submission:** true | false

## Inputs

| Input | Value | Status |
|-------|-------|--------|
| HLAD | {path} | Supplied / Waived |
| RSR | {path} | Supplied / Waived |
| Repos in scope | {list} | — |

## Stage log

| Stage | Status | Timestamp | Notes |
|-------|--------|-----------|-------|
| 0a — Annex read | COMPLETE / BLOCKED | | {N} gaps, {M} ADRs loaded |
| 0b — Annex append | COMPLETE | | {N} gaps appended, {M} ADRs appended |
| R — Research | COMPLETE / IN PROGRESS / BLOCKED | | |
| P — Pre-flight | PASS / FAIL | | |
| A — §1 Gate 1 | APPROVED / REJECTED (n) / STUCK | | |
| A — §2 Gate 2 | APPROVED / REJECTED (n) / STUCK | | |
| ... | | | |
| V — Validation | PASS / FAIL | | |
| F — Fix loop | {N} fixes applied | | |
| C — Complete | COMPLETE | | |

## Waivers

{Any formal waivers recorded here with approver name and date}

## Open gaps

{Gaps from writing-pack.gaps.md that required human resolution — record resolution here}
```

---

## 6. Halting rules

**ORCH-HALT-1:** If doc-research cannot close the Writing Pack after two research passes and human gap resolution, halt with `STATUS: BLOCKED — WRITING PACK INCOMPLETE`. List unresolved gaps.

**ORCH-HALT-2:** If Stage P pre-flight fails after two research-fix cycles, halt with `STATUS: BLOCKED — PRE-FLIGHT CANNOT PASS`. The Writing Pack has systematic gaps requiring human input.

**ORCH-HALT-3:** If any gate reaches `.gate-stuck-{N}.md` state (three rejections), halt and surface for human resolution. Do not advance.

**ORCH-HALT-4:** If TF-6 escalation occurs during Stage F, halt and surface `.fix-stuck-*.md` for human resolution.

**ORCH-HALT-5:** If doc-validate runs and `.validation.md` is absent after the run completes, halt: `STATUS: BLOCKED — VALIDATION REPORT NOT PRODUCED`. Re-invoke doc-validate.

---

## 7. SDLC inputs

Treat programme baselines as mandatory unless explicitly waived:

| Artefact | Role in pipeline |
|----------|----------------|
| RSR (Requirements Specification Report) | Authoritative requirements; drives Writing Pack `fr_refs` and Section 4 traceability |
| HLAD (High Level Architecture Design) | Authoritative system context; drives Writing Pack `baseline_references` and Section 3 principles |
| Feature SPEC files | Canonical source for Writing Pack Section 6 slots; FR text extracted verbatim |
| Code graph | Mandatory per repo; drives Writing Pack component and API fields |

---

## 8. Migration from prior pipeline versions

Documents produced under pipeline v1.x (free-form research bundle + end-to-end authoring) cannot be upgraded in place. To migrate:

1. Tag the existing draft branch `pre-writing-pack`.
2. Open a new branch for the v2.0 run.
3. Run doc-research from scratch to produce a typed Writing Pack.
4. Run doc-author section by section with gates.

The old `doc-validate` V-* checks (V-BORE-1, V-CLONE-1, V-SHORTHAND-1 etc.) are retired. They are not re-added to the new pipeline.
