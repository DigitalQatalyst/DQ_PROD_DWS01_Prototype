# Supplement: doc-author — HLAD type

**Loaded by:** orchestrator when `report_type: hlad` — loaded SECOND, after `doc-author-platform-context.md`.  
**Extends:** doc-author primary file  
**Slot files consumed:** `writing-pack/s3-architecture-context.md`, `writing-pack/s4-architecture-software.md`, `writing-pack/s5/{slug}.md` (13 files), `writing-pack/s6-appendices.md`  
**Gate range:** Gates 3–18 (Gates 1 and 2 are owned by `doc-author-platform-context.md`)

> **Scope notice:** This supplement governs §3 through §6 only. §1 and §2 are assembled exclusively by `doc-author-platform-context.md`. Do not re-author §1 or §2 content here.

> **HLAD §1.3 override:** HLAD §1.3 heading is `### 1.3 Architecture Principles` (not "Strategic Objectives"). IDs use the format `AP-01`, `AP-02`, etc. Render `architecture_principles` from the shared slot using: `# | ID | Principle | Description` — 6–8 rows as required by the section-guide. This overrides the shared supplement's default §1.3 rendering for the HLAD type.

> **Diagram delegation:** Every §5 view unit requires a diagram. Invoke the appropriate diagram skill per the composition contract. Embed the returned `diagram_block` and `legend_block` verbatim. Capture any `open_items` and `checklist_results` FAILs as gap rows in `writing-pack/annex-gaps.md`.

---

## Intro narrative length rules (§3–§6)

| Heading level | What it covers | Minimum length | Common rejection pattern |
|---------------|---------------|---------------|--------------------------|
| **H1** (`# 3.`, `# 4.`, `# 5.`, `# 6.`) | Section openers | 2–3 sentences; frame the section's purpose | Single sentence naming the section |
| **H2** (`## 3.1`–`## 3.2`, `## 4.1`–`## 4.3`) | Sub-section openers | 1–2 substantive sentences before any table | "The following table describes…" alone |
| **H2** (`## 5.N` architecture view) | View openers | 1–2 sentences: what the view shows and why it matters | Single table with no opener; missing view description |
| **H3** (within §5 if subdivided) | Sub-section openers | 1 sentence before any table | Table with no preceding sentence |

HLAD is a design specification document. Write in present-tense design intent throughout: "The platform provides…", "The component manages…", "The design follows…". Never use past-tense implementation language ("Was implemented", "Has been configured").

---

## HLAD-specific pre-write self-checks

Before appending any §3–§6 block to the draft, confirm all of the following in addition to the base 15-point self-check from `doc-author.md`:

| # | HLAD-specific check |
|---|---------------------|
| HLAD-SC-01 | Every §5 view unit opens with a 1–2 sentence prose description before any table, list, or diagram placeholder. Never open a §5 unit with a table or comment block. |
| HLAD-SC-02 | Every §5 view unit (except `source-code-branching`) contains a rendered diagram block produced by the designated diagram skill per the composition contract. The `diagram_block` must be embedded verbatim; the `legend_block` must follow immediately. Do not omit either block unless the diagram skill is `none` (Source Code & Branching only). |
| HLAD-SC-03 | Every AD-NN entry has all six fields populated (ID, Decision Area, Decision Statement, Rationale, Impact, Status). A partial AD must not be written to draft — record the gap and write the AD block only when all fields are confirmed from the slot file. |
| HLAD-SC-04 | No Markdown table in §3–§6 exceeds 5 columns. Check the column count of every table before writing it. |
| HLAD-SC-05 | All AP-NN IDs cited in §5 view units exist in the §1.3 Architecture Principles table. Do not cite a principle not registered in §1.3. |
| HLAD-SC-06 | Gate numbers in `.gate-request-{N}.md` files match the registry in the skeleton template. Gate 3 = §3, Gate 4 = §4, Gates 5–17 = §5.1–§5.13 in order, Gate 18 = §6. |
| HLAD-SC-07 | §6.1 AD-NN IDs are globally unique within the document. No two AD blocks share the same ID. |
| HLAD-SC-08 | §3–§6 content does not violate platform architectural guardrails G-01–G-07 from `<base_dir>/shared/platform-context.md`. Specifically: no business logic attributed to the Client Tier (G-01); all cross-tier communication described as API contracts (G-02); RLS described as enforced at the Data & Intelligence Layer (G-03); schema foreign-key direction one-way inward toward `platform` (G-04); session state in Redis not in-memory (G-05); IAM and Foundation services not reimplemented per stage (G-06). Any content that would require violating a guardrail must be flagged with `[!] Guardrail conflict: G-XX` inline and recorded as a Type 1 gap before the block is written. |
| HLAD-SC-09 | Technology names in §4.1 and §5.7 use the canonical DQ platform labels from `platform-context.md` §2 and §5 (e.g. `React / Next.js`, `Express.js`, `PostgreSQL via Supabase / PostgREST / Hasura`, `Redis`). Deviations require an AD-NN entry in §6.1 with rationale. |

---

## §3 — Architecture Spec — Context assembly

**Slot file:** `writing-pack/s3-architecture-context.md`

Open `# 3. Architecture Spec — Context` with 2–3 sentences that: (1) state that this section establishes the platform's capability architecture at the context level; (2) identify the two capability canvas variants (general and platform-specific); (3) state that capabilities provide the basis for the architecture views in §5.

### §3.1 Capability Canvas

1. Write one substantive H2 opener sentence asserting what the capability canvas represents — the full set of platform capabilities organised by delivery component.
2. Render `capability_canvas_intro` as a prose paragraph.
3. Render `capability_canvas_rows` as a numbered table: `# | Capability Area | Description | Responsible Component`.

### §3.2 Capability Canvas — [PLATFORM_SHORT_NAME] Variant

Use `platform_variant_name` from the slot file for the heading. Do not invent the platform name.

1. Write one substantive H2 opener sentence asserting that this variant focuses on the programme's priority delivery areas within the broader capability canvas.
2. Render `capability_canvas_variant_intro` as a prose paragraph.
3. Render `capability_canvas_variant_rows` as a numbered table: `# | Capability Area | Description | Responsible Component`.
4. Invoke the appropriate diagram skill using the composition contract:
   - `view_name`: `capability-canvas-variant` (treat as a supporting Business Capability View)
   - `diagram_type`: `Business Capability View` (capability flowchart — TOGAF Business Architecture slice)
   - `scope`: from `capability_canvas_variant_rows` (the platform-specific capability areas)
   - `context`: from §2 Platform Context slot
   - `constraints`: from §1.3 Architecture Principles
   - `renderer_hint`: `mermaid`

   Embed the returned `diagram_block` verbatim after the capability canvas variant table. Embed `legend_block` immediately after. For any `open_items` write gap rows with `gap_id` `DIAG-capability-canvas-variant-{N}` in `writing-pack/annex-gaps.md`.

**Gate 3 — §3 complete:** Write `.gate-request-3.md` and halt for approval before proceeding to §4.

---

## §4 — Architecture Spec — Software assembly

**Slot file:** `writing-pack/s4-architecture-software.md`

Open `# 4. Architecture Spec — Software` with 2–3 sentences that: (1) state this section defines the technology stack, module decomposition, and deployment topology that implement the capabilities in §3; (2) clarify that §4 is an implementation-level specification, not a detail design — component internals are specified in system detail design documents.

### §4.1 Technology Stack

1. Write one substantive H2 opener sentence asserting that the technology stack defines the technology choices by layer for the full platform.
2. Render `technology_stack_intro` as a prose paragraph.
3. Render `technology_stack_rows` as a numbered table: `# | Layer | Technology | Purpose | Notes`.

### §4.2 Modules & Functions

1. Write one substantive H2 opener sentence asserting that the modules and functions view identifies the logical decomposition of the platform's software.
2. Render `modules_intro` as a prose paragraph.
3. Render `module_rows` as a numbered table: `# | Module | Function | Description | Responsible Actor`.

### §4.3 Deployment Stack

1. Write one substantive H2 opener sentence asserting that the deployment stack maps the platform's components to their target environments and hosting infrastructure.
2. Render `deployment_stack_intro` as a prose paragraph.
3. Render `deployment_stack_rows` as a numbered table: `# | Environment | Component | Deployment Target | Notes`.

**Gate 4 — §4 complete:** Write `.gate-request-4.md` and halt for approval before proceeding to §5.

---

## §5 — Architecture Views assembly

**Slot files:** `writing-pack/s5/{slug}.md` — one per unit.

Open `# 5. Architecture Views` with 2–3 sentences that: (1) state this section presents the 13 architecture views that together specify the platform's architecture; (2) name the three view groups (Business Spec, Technology Spec, DevOps Spec); (3) state that 12 of the 13 views include a diagram produced by the designated diagram skill via the composition contract (Source Code & Branching is prose-only).

**CRITICAL — check references before authoring each unit:**
1. The skeleton template — for the unit's `Diagram Skill`, `Gate No.`, and `Spec Group`
2. The composition contract — for the `diagram_type` value to pass to the skill

Apply the unit pattern below for every unit.

Process units in registry order (§5.1 through §5.13). After each unit is complete, write the corresponding gate request file and halt for approval before proceeding to the next unit.

### Architecture View Unit Pattern (applies to all 13 units)

**H2 heading:** `## 5.N [View Name]`

**Authoring steps:**

1. Write the H2 opener using `view_description` from the slot file: render as 1–2 sentences stating what this view shows and why it matters for understanding the platform architecture.

2. If `applicable_principles` is non-empty: write one bridging sentence ("The following architecture principles from §1.3 govern this view:") then render as a plain prose list: `AP-NN — [principle statement]` (one line per principle). Do not use a table for principles within §5 view units.

3. **Diagram block — invoke the designated skill via the composition contract:**

   **If `diagram_skill` is `none` (Source Code & Branching only):** skip this step entirely. Author prose and tables per step 5.

   **For all other units:** invoke the `{diagram_skill}` skill using the composition contract. Pass the appropriate `scope`, `context`, `constraints`, `view_name`, `renderer_hint`, and `diagram_type` values.

   After the skill returns:
   - Embed the `diagram_block` verbatim immediately after the principles list (or after the prose opener if `applicable_principles` is empty)
   - Embed the `legend_block` immediately after the `diagram_block`, before any `view_specific_content` tables
   - Use `diagram_id` as the figure reference in prose (e.g. "see Figure `{diagram_id}`")
   - If `checklist_results` contains any FAIL: do not embed the diagram; write a gap row in `writing-pack/annex-gaps.md` with `gap_id` `DIAG-{view_slug}-CHK-{N}` and mark the view unit blocked pending gap resolution
   - If `open_items` is non-empty: convert each to a gap row in `writing-pack/annex-gaps.md`

4. If `ad_decisions` non-empty in the slot file: render the Decisions table for this view:

```
| # | AD-ID | Decision Area | Decision Statement | Status |
|---|-------|---------------|-------------------|--------|
```

Note: A 7-column Decisions table exceeds the 5-column maximum. Always split into two paired tables linked by AD-ID: Table 1 = `AD-ID | Decision Area | Decision Statement | Status`; Table 2 = `AD-ID | Rationale | Impact`.

5. Render any `view_specific_content` tables as defined in the slot file.

**Gate per unit:** Write `.gate-request-{N}.md` where N = the gate number (Gate 5 for §5.1, Gate 6 for §5.2, ..., Gate 17 for §5.13). Halt for approval before the next unit.

### Unit-specific table requirements

| Unit | Table columns |
|------|---------------|
| 5.1 System Context | `# \| Title \| Description` — rows: Purpose, Scope, Key Outputs |
| 5.2 System Actors | `# \| Title \| Description` — one row per actor group |
| 5.3 System Interfaces | `# \| Title \| Description` — one row per interface type |
| 5.4 System Journeys | Named flow blocks with prose description; one `diagram_block` per flow |
| 5.5 Conceptual Architecture | `# \| Component Group \| Purpose` — 5–9 groups |
| 5.6 Logical Architecture | `# \| Component Group \| Purpose` — layers with group assignment |
| 5.7 Implementation Architecture | `# \| Layer \| Purpose` — deployment layers |
| 5.8 Integration Architecture | `# \| Source \| Target \| Purpose \| Interface Details` |
| 5.9 Data Architecture | `# \| Title \| Group \| Detail` — one row per key entity |
| 5.10 Security Architecture | Two tables: Security Principles + Data Security & Compliance |
| 5.11 Deployment Environment | `# \| Environment \| Purpose` |
| 5.12 Source Code & Branching | `# \| Item \| Detail` |
| 5.13 CI/CD Pipelines | `# \| Title \| Description` |

**For §5.4 System Journeys:** invoke the diagram skill **once per named journey flow** from the slot file. Each invocation uses `diagram_type`: `Mermaid journey` and `view_name`: `system-journeys`. Embed each `diagram_block` immediately after the prose paragraph for that journey flow.

---

## §6 — Appendices assembly

**Slot file:** `writing-pack/s6-appendices.md`

Open `# 6. Appendices` with 1–2 sentences stating this section records the architectural decisions and clarifications that govern the platform design, together with cross-reference links to the shared annex files.

### §6.1 Architectural Decisions

1. Write one substantive H2 opener sentence asserting that this sub-section catalogues all architectural decisions made during this design pass and the rationale behind each.
2. Render `ad_rows` as a block-per-decision format (not a single wide table — individual AD blocks prevent 6-column table violations):

For each AD entry, render:

```
**AD-NN — [Decision Area]**

| Field | Detail |
|-------|--------|
| Decision Area | {decision_area} |
| Decision Statement | {decision_statement} |
| Rationale | {rationale} |
| Impact | {impact} |
| Status | {status} |
```

Do not use a single 6-column table for all ADs — the 5-column table maximum applies. Use the per-AD block format above.

### §6.2 Architectural Clarifications

1. Write one substantive H2 opener sentence asserting that this sub-section records clarifications raised and resolved (or outstanding) during the design process.
2. Render `cl_rows` using the mandatory paired-table format (6-column tables are not permitted): Table 1 = `# | CL-ID | Clarification Area | Clarification`; Table 2 = `CL-ID | Rationale | Impact`.

### §6.3 Annexes

1. Write one sentence stating that the HLAD participates fully in the shared annex structure.
2. Render two pointers:

```
- **Gap Register:** `workspace/llad-annex/annex-gaps.md` — all Type 1 and Type 2 gaps identified across the platform architecture document set.
- **ADR Annex:** `workspace/llad-annex/annex-adrs.md` — full ADR propagation records cross-referencing AD-NN decisions in this document.
```

**Gate 18 — §6 complete:** Write `.gate-request-18.md` and halt for approval. After gate approval, signal document assembly complete to the orchestrator.
