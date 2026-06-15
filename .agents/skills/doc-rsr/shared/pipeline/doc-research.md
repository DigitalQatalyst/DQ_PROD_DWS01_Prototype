---
shared-source: shared/docs/pipeline/doc-research.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Agent: doc-research

**Version:** 2.1 (Writing Pack protocol + supplement loading)  
**Pipeline position:** First agent invoked by generate-architecture-docs

> **Supplement override:** §4.3 (Section 3 fields) and §4.6 (Section 5 per-unit fields) in this file apply to `report_type: architecture` only. For all other report types, the orchestrator loads a supplement file from `supplements/{report_type}/doc-research-{report_type}.md` which **overrides** §4.3 and §4.6. The orchestrator passes the supplement content before this file is read — follow the supplement instructions for those sections. §4.1, §4.2, §4.4, §4.5, §4.7, §4.8 apply to all types unchanged.

---

## 1. Role and boundary

doc-research produces the **typed Writing Pack** — a set of structured slot files that doc-author assembles into the LLAD document. doc-research does not write prose, does not produce summaries, and does not emit free-form notes. Every output belongs to a named field in a named slot file conforming to `ai-agent-rules/schemas/writing-pack-schema.md`.

**Boundary:** doc-research reads source artefacts (SPEC files, code graph, config files, HLAD/RSR excerpts, priming docs). It does not make architecture decisions. Where source artefacts are ambiguous, it records the ambiguity in `writing-pack.gaps.md` and leaves the field open — it does not resolve ambiguity by inference.

---

## 2. Output contract (Writing Pack)

The Writing Pack is written to:

```
workspace/generated/v{version}-{timestamp}/writing-pack/
```

Slot files produced:

```
writing-pack/
  writing-pack.gaps.md           <- open gaps blocking closure (absent when resolved)
  writing-pack.complete.md       <- closure sentinel (written last, unlocks authoring)
  s1-overview.md
  s2-context-scope.md
  s3-architecture-principles.md
  s4-cross-cutting.md
  s5-platform-environment.md
  s6/{stage}/{slug}.md           <- one per feature
```

The pack is closed (and `writing-pack.complete.md` written) only when every REQUIRED field defined in writing-pack-schema.md is non-empty and passes its validation rule. See the Field-completeness gate (Section 7).

---

## 3. Input sources

| Source | Used for |
|--------|---------|
| `.ai/context.md` | Programme name, solution name, repository roots, key stakeholders |
| `.ai/priming/*.md` | Architecture principles, technology choices, target architecture |
| `docs/feature-delivery/{stage}/{slug}/SPEC.md` | Section 6 FR text, acceptance criteria, scope, assumptions (verbatim) |
| HLAD document (path from task ledger or user-supplied) | Section 2 context, Section 3 principles, Section 5 baseline references |
| RSR document (path from task ledger or user-supplied) | Section 4 requirement traceability, NFR references |
| Code graph (mandatory per in-scope repo) | Component discovery, import relationships, API route registration |
| Source file system | Config files, workflow files, package.json, environment docs |

If HLAD or RSR paths are not supplied, record the absence in `writing-pack.gaps.md` under `baseline_references` and continue with available sources. Do not fabricate baseline content.

---

## 4. Field-level research protocol

Work through each section slot in order. For each slot, populate every field using the query catalogue (Section 5) and verbatim extraction protocol (Section 6). Record fields that cannot be completed in `writing-pack.gaps.md`.

### 4.1 Section 1 fields (`s1-overview.md`)

- `document_title`: Read from task ledger or user instruction.
- `document_revision`: Read from task ledger.
- `programme_name`, `solution_name`: Read from `.ai/context.md`.
- `report_type`: Read from task ledger (`architecture` or `configuration`).
- `executive_summary_bullets`: Write 3–6 bullets summarising the system in formal phrases. Each 10–50 words. Derived from `.ai/context.md` and HLAD executive summary if available.
- `in_scope_systems`, `out_of_scope_systems`: Read from task ledger scope statement; confirm against `.ai/context.md`.
- `document_status`: Read from task ledger.
- `baseline_references`: Record HLAD version, RSR version, and paths. Each entry must include: name, version, path, and `formal_title` (the full official document title as it appears on the cover or in programme registers — not a short code). Confirm files exist.
- `out_of_scope_artefact_register`: For each system in `out_of_scope_systems`, look up its Artefact ID and Full Document Name from the companion artefact table in `section-guide.md` (Authoring rubrics — Companion artefact IDs). Record: system_name, artefact_id, artefact_full_name, artefact_status (Planned/Published). If no match, record artefact_id as "TBD — {system name} LLAD", status as Planned. This field is REQUIRED — an empty register = gap. See §4.7 for the full protocol.
- `business_context_rows`: Populate exactly 5 rows, each with a `title` and `description`. Row titles are fixed: **Strategic Context**, **Sponsoring Organisation**, **User Communities**, **Data Sensitivity**, **Document Scope**. Sources:
  - Strategic Context: HLAD §1 strategic mandate and programme objective (60–100 words).
  - Sponsoring Organisation: `.ai/context.md` — organisation name, type, mandate in relation to this system.
  - User Communities: Identify ≥3 named user groups from `.ai/context.md` and HLAD. State each group's role and what they do through the platform.
  - Data Sensitivity: Extract from HLAD data handling section or RSR NFR — data classification label, relevant legislation, and residency enforcement mechanism.
  - Document Scope: State precisely what this document covers (the in-scope system at its version) and what it does not cover (reference `out_of_scope_systems` list). 1–3 complete sentences.
  - If a row's source is absent from all research inputs, record it in `writing-pack.gaps.md` — do not fabricate.
- `platform_vision_rows`: Populate exactly 4 rows, each with a `title` and `description`. Row titles are fixed: **Platform Objective**, **Platform Strategy**, **Technology Foundation**, **Architecture Model**. Sources: HLAD §1–2 vision statements, `.ai/priming/priming-target-architecture.md`. Each description is 30–80 words, formal prose, specific to this system's role in the platform (not generic marketing language). If a source is absent, record in gaps.

### 4.2 Section 2 fields (`s2-context-scope.md`)

- `business_context_paragraph`: Extract verbatim from HLAD §1 or programme charter (first substantive paragraph describing the programme mandate). Apply WP-2.
- `business_context_citation`: The path to the source document.
- `platform_vision_paragraph`: Synthesise from HLAD §1–2 and `.ai/priming/` documents in formal prose, 60–200 words. Derived field — write complete sentences.
- `stakeholder_table`: Identify ≥3 stakeholder roles from `.ai/context.md` and HLAD. Each row: role, system they interact with, responsibility.
- `system_context_diagram_ref`: Locate or note the path to the context diagram (check `docs/architecture/` first).
- `external_dependencies`: Execute Q-CG-2 (integration targets); supplement with HLAD §5 integration view. Classify each by type.
- `frontend_layer_summary`, `frontend_tech_table`: Execute Q-FS-3. Populate areas relevant to the project's frontend: routing, auth boundary, state management, build toolchain, component model. The specific tools will vary by project — derive from `package.json` and build config. Write `frontend_layer_summary` as 4–8 complete sentences.
- `backend_layer_summary`, `backend_tech_table`: Execute Q-API-1; read API `package.json`. Write `backend_layer_summary` as 3–6 complete sentences.

### 4.3 Section 3 fields (`s3-architecture-principles.md`)

- `principles`: Extract from `.ai/priming/priming-target-architecture.md` and HLAD §4. Each principle: id (AP-01 format), statement, rationale, implication, baseline_ref (HLAD section or RSR NFR identifier). If fewer than 5 principles are extractable, record the gap — do not fabricate.
- `principle_source_citation`: Path to the priming or HLAD document used.

### 4.4 Section 4 fields (`s4-cross-cutting.md`)

- `decision_register`: For each key architectural decision resolved during research (not an open gap), write a 6-field ADR stub: id (ADR-nn), title, status (Accepted | Documented deviation), context (2–4 sentences), decision, rationale, consequences. Source: HLAD §3, priming docs, §4.3 conformance deviations, tech stack selections. Minimum 3 ADRs; fewer = gap. See §4.8 for the full protocol.
- `open_gaps_summary`: For each unresolved baseline mismatch or open decision found during research, write one row: gap_id, description, status. Source: writing-pack.gaps.md at point of gap register compilation.

For each of the eight concern sub-slots (auth_identity, authorisation, logging_observability, error_handling, performance, accessibility, i18n_locale, compliance):

- Execute the relevant graph and filesystem queries from the query catalogue.
- Populate every REQUIRED field. Record any missing field in gaps.
- All `component_refs` must be graph-confirmed (WP-4). Record `component_ref_query` with the exact query string used.
- `fr_refs` for auth and authorisation: cross-reference with RSR requirement IDs.

### 4.5 Section 5 fields (`s5-platform-environment.md`)

For each of the five sub-slots (environment_strategy, hosting_topology, network_topology, data_platform, ci_cd_pipeline):

- `summary_paragraph`: Derive from config files and infrastructure docs. Write in formal prose, 60–200 words, complete sentences, no shorthand or bullet notation.
- `facts_table`: Populate from config files relevant to the project — CI/CD workflow files, environment docs, build configs, hosting manifests. File names vary by project; confirm from `.ai/context.md` before searching. Each row's `source` is a citation.
- `diagram_ref`: Check `docs/architecture/llad/{solution}/` for existing diagrams. Record path if found; record gap if absent.
- `risks_and_mitigations`: Extract from HLAD risk register or programme risk log if available.
- `data_ownership_table` (under `data_platform` sub-slot): When two or more distinct data stores are identified, populate one row per store: store_name, owner, what_it_owns, what_system_may_not_do. Source: HLAD §5.5, RSR data handling requirements, integration docs, priming docs. Mandatory when ≥2 stores are present — absence is a gap.

### 4.6 Section 6 per-feature fields (`s6/{stage}/{slug}.md`)

Repeat for every feature in scope. Discovery order:

1. Enumerate stages and features from the task ledger or SPEC file listing in `docs/feature-delivery/`.
2. For each feature, execute all six lens research steps below in order.
3. A feature slot is not closed until all six lenses have at least their REQUIRED fields populated.

**Lens 1 — spec:**
- Read SPEC.md at the cited path (Q-FS-1).
- `feature_purpose`: Write 20–80 words in formal prose describing the feature's business purpose. Derive from SPEC §3. Complete sentences — no shorthand.
- `fr_ids`, `fr_text`: Extract SPEC §8 table verbatim (WP-2). Copy every row without modification, including FR identifier column.
- `nfr_ids`, `nfr_text`: Extract SPEC §9 verbatim if present.
- `acceptance_criteria_text`: Extract SPEC §9 acceptance criteria verbatim (WP-2), or the criteria column of §8 if §9 is absent.
- `out_of_scope_notes`: Extract SPEC §5 out-of-scope items verbatim if present.

**Lens 2 — component:**
- Execute Q-CG-1 (graph query for nodes in feature path).
- Execute Q-FS-2 (filesystem search for `.tsx`, `use*.ts`, `*Api.ts`, `*Service.ts` under feature directory).
- Classify results: `.tsx` → `ui_components` with role `page` or `container`; `use*.ts` → role `hook`; `*Api.ts`/`*Service.ts` → `shared_modules`.
- Execute Q-API-1 to find API routes registered for this feature.
- Record `component_ref_query` with the exact query strings used.
- Confirm every listed file exists on disk (WP-3).

**Lens 3 — data:**
- Execute Q-FS-4 to find managed data store entity references in feature source files.
- If entities found, extract field list from data platform schema source.
- Describe local state: client-side cache keys, context shape, local storage use, or equivalent state management constructs for the project's stack — write as 2–4 complete sentences in `local_state_description`.
- Identify external data sources from SPEC §10 or integration docs.

**Lens 4 — behaviour:**
- Extract SPEC §7.1 (Primary Flow) steps. Rewrite each to begin with an actor name using a complete sentence. These become `happy_path_steps`.
- Extract SPEC §7.2 (Alternate Flows) → `alt_flows`.
- Extract SPEC §7.3 (Edge Cases / Error Scenarios) → `error_flows`. If SPEC §7.3 has fewer than 1 error scenario, derive the most likely error path from the feature's interaction with auth, network, and data systems. Mark derived steps `(derived)`.

**Lens 5 — interop:**
- Execute Q-CG-2 to find upstream consumers. `upstream_consumers` may be an empty list; field must be present.
- Execute Q-FS-5 to find contract files. Each `downstream_dependencies` entry requires a `contract_ref` citation.
- Execute Q-API-1 to identify downstream API dependencies.

**Lens 6 — security:**
- Read SPEC §12 (security considerations) if present.
- Determine `auth_requirement` from route guard configuration (Q-FS-6) and SPEC narrative.
- Extract `required_roles` from the project's authorisation library config (e.g. ability definitions, role-guard config, policy files, or middleware). The authorisation mechanism is named in the Section 4b `model` field.
- Identify `pii_classes` from SPEC data description and data store entity fields. If none, record `["none"]`.
- Read `.ai/priming/security-baseline.md` for `control_refs`.

### 4.7 Scope Register protocol

For each system in `out_of_scope_systems`:

1. Match the system name to the companion artefact table in `section-guide.md` (Authoring rubrics — Companion artefact IDs).
2. Record: artefact_id, artefact_full_name, artefact_status (Planned/Published).
3. If no match: record artefact_id as "TBD — {system name} LLAD", status as Planned.

Write each system as a row in `out_of_scope_artefact_register` in `s1-overview.md`. This field is REQUIRED for all architecture report runs. An empty register is a gap — do not proceed to `writing-pack.complete.md`.

### 4.8 Decision Register protocol

For each key design decision identified during research that is NOT an open gap:

1. Assign an ADR-nn identifier (sequential).
2. Write all six fields: id, title, status, context (2–4 sentences), decision, rationale, consequences.
3. Source: HLAD §3, `.ai/priming/priming-target-architecture.md`, §4.3 conformance deviations, tech stack selections confirmed in §4.2.
4. For open decisions (unresolved at research time), set status = "Decision required (Gap G-nn)" and link the corresponding gap ID from writing-pack.gaps.md.
5. Minimum 3 ADRs required. Fewer = gap; record in writing-pack.gaps.md.

Write the complete decision_register to `s4-cross-cutting.md`. Each ADR stub must pass the completeness gate in §7 before writing-pack.complete.md is written.

---

## 5. Query catalogue

Platform-agnostic query descriptions. The executing agent uses its available tools (code graph, file search, file read) to execute each query. Record the exact query string used in the adjacent `_query` field.

| ID | Query | Writing Pack target |
|----|-------|-------------------|
| Q-CG-1 | Query the code graph for all nodes whose file path starts with `{repo}/src/features/{stage}/{slug}/` or `{repo}/src/{slug}/` | Lens 2 component lists |
| Q-CG-2 | Query the code graph for edges of type `imports` targeting nodes from Q-CG-1 results; return importing file paths | Lens 5 upstream_consumers |
| Q-CG-3 | Query the code graph for edges of type `imports` from Q-CG-1 nodes targeting `{repo}/src/shared/` | Lens 2 shared_modules |
| Q-FS-1 | Read the file at `docs/feature-delivery/{stage}/{slug}/SPEC.md` in full | Lens 1 all fields |
| Q-FS-2 | Search for files matching `*.tsx`, `use*.ts`, `*Api.ts`, `*Service.ts` under the feature source directory | Lens 2 component classification |
| Q-FS-3 | Read `package.json` (or equivalent dependency manifest), the build config file (e.g. `vite.config.*`, `webpack.config.*`, `next.config.*`), and the root router or entry file in the frontend repository. File names are project-specific — confirm from `.ai/context.md` before searching. | Section 2 frontend fields |
| Q-FS-4 | Search feature source files for managed data store entity references. The naming pattern is project-specific. Read `.ai/context.md` `data_platform` field to determine the pattern before searching. | Lens 3 data_entities |
| Q-FS-5 | Search for `*.contract.json`, `*.contract.yaml`, or `openapi.yaml` under `docs/integration/` for the feature | Lens 5 contract_ref |
| Q-FS-6 | Locate the feature route definition in the router file; identify auth guard and role requirements | Lens 6 auth_requirement, required_roles |
| Q-API-1 | Search API handler registration files for path prefixes matching the feature slug or API base path | Lens 2 api_endpoints; Lens 5 downstream |

---

## 6. Verbatim extraction protocol

For any field marked `verbatim:true` in the schema (WP-2 applies):

1. Locate the source document at the citation path.
2. Identify the exact passage to extract (SPEC §8 table rows, FR sentence, acceptance criterion).
3. Copy the passage character-for-character. Do not correct spelling, punctuation, or formatting. Do not remove markdown table pipes or column separators.
4. Record the citation path in the adjacent `_citation` field or in the slot's `source` field.
5. If the passage contains encoding artefacts, copy them and add a `_source_note` field explaining the artefact. Do not silently correct.

---

## 7. Field-completeness gate

Before writing `writing-pack.complete.md`, perform this gate in order:

1. Enumerate every REQUIRED field from writing-pack-schema.md for every slot file produced.
2. For each field, confirm it is non-empty and contains no placeholder text (`TBD`, `TODO`, `N/A`, `-`, `—`, empty string, whitespace-only).
3. For every `citation` type field, confirm the cited path exists on disk.
4. For every `component_ref` field, confirm at least one referenced file exists on disk.
5. Record any failing field in `writing-pack.gaps.md` with field path and reason.

If `writing-pack.gaps.md` has any entries, **do not write** `writing-pack.complete.md`. Halt and surface gaps for human resolution or further research.

If all fields pass, write `writing-pack.complete.md` with the manifest defined in writing-pack-schema.md §Completeness signal file.

---

## 8. Prohibited outputs

- Prose summaries or narrative paragraphs outside a slot field designated `markdown` or `verbatim`
- Free-form "research notes" or bullet lists not mapped to a slot field
- Paraphrases of verbatim fields (WP-2 violation)
- Component names, file paths, or FR identifiers not confirmed by a query or file read
- Hedging language in any field (`likely`, `probably`, `may be`, `appears to`)
- Placeholder values in REQUIRED fields — use `writing-pack.gaps.md` instead
- `writing-pack.complete.md` when any REQUIRED field fails the completeness gate

---

## 9. Failure modes and recovery

| Failure | Action |
|---------|--------|
| SPEC file missing for a feature | Record in gaps.md; mark feature slot incomplete; do not fabricate FR text |
| Code graph unavailable for a repo | `STATUS: BLOCKED — GRAPH UNAVAILABLE FOR {repo}`. Do not proceed without graph-backed component discovery |
| HLAD or RSR not supplied | Continue with available sources; record missing baseline in gaps.md under `baseline_references` |
| Component file listed in graph does not exist on disk | Remove from component list; record in gaps.md |
| FR text in SPEC is malformed | Copy verbatim with `_source_note` explaining the issue; do not clean up |
| Fewer than 3 behaviour steps in SPEC §7.1 | Extract what exists; derive remaining steps from feature context; mark derived steps `(derived)` |
