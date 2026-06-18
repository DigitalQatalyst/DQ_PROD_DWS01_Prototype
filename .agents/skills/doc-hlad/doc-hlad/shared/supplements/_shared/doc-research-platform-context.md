---
shared-source: shared/docs/supplements/_shared/doc-research-platform-context.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Supplement: doc-research — platform context (shared §1/§2 protocol)

**Loaded by:** orchestrator when `report_type: rsr` or `report_type: hlad` — loaded FIRST, before any type-specific supplement.  
**Extends:** doc-research primary file  
**Slot files produced:** `writing-pack/s1-overview.md`, `writing-pack/s2-platform-context.md`

> **Override notice:** For `report_type: rsr` and `report_type: hlad`, this supplement defines §1 research (slots `s1-overview.md` and `s2-platform-context.md`). Base `doc-research.md` §4.1 and §4.2 behaviour is superseded for these types. Do not execute base §4.1 or §4.2 after loading this supplement — this supplement redefines the `business_context_rows` field shape (4 rows, not 5) and the `platform_vision_rows` field shape (6 rows, not 4), and replaces the base §2 slot file (`s2-context-scope.md`) with `s2-platform-context.md`. For `rsr`/`hlad` types, `s2-context-scope.md` is not produced.

This supplement defines the research protocol for §1 (Project Overview) and §2 (Solution Architecture) — the two opening sections that are structurally identical across RSR and HLAD document types. Because both sections are sourced from the same upstream inputs (your organisation's requirements baseline and `.ai/context.md`), research is performed once and the results are shared by construction.

Load this supplement first. The type-specific supplement that follows may extend §3 and beyond; it must not re-research §1 or §2.

---

## Upstream inputs for §1 and §2

**Platform priming documents** (path: `ai-agent-rules/priming/` relative to the DQ_DBP repo root — read all six before beginning research):

| Priming document | Used for |
|-------|---------|
| `priming-dbp-platfrom-design.md` | Platform hierarchy (PoP/PoS/SoA/AoF), five-stage model (0–4), Platform Foundation scope |
| `priming-target-architecture.md` | Architectural goals, three-tier application model (Client / Data & Intelligence / Application & Integration), cross-cutting patterns |
| `priming-accepted-tech-stack.md` | Technology layer descriptions, default stack choices per tier (React/Next.js/React Native, Express, PostgreSQL/Supabase/Redis) |
| `priming-database-architecture.md` | Data model, PostgreSQL schema structure, stage-to-schema mapping, base entity conventions |
| `priming-nonfunctional-specs.md` | NFRs: performance targets, scalability model, availability and reliability standards, security patterns |
| `priming-development-rules.md` | Development model, agent-first approach, plan-first discipline, code quality standards |

**System-specific inputs** (resolve paths from the task ledger or user-supplied step 0 brief):

| Input | Used for |
|-------|---------|
| Project/system-specific baseline document (user-supplied) | System-level functional requirements, design decisions, and constraints specific to the system being documented — extends and specialises the platform priming baseline |
| `.ai/context.md` (path from task ledger) | Programme name, solution name, sponsoring organisation, platform role taxonomy, repository landscape |

If any priming document is absent or inaccessible, record the absence in `writing-pack.gaps.md` under `baseline_references` and continue with available sources. If the system-specific baseline is absent, note it and derive content from the priming documents only. Do not fabricate content from any absent source.

---

## §1 — Project Overview research (`s1-overview.md`)

Produce `writing-pack/s1-overview.md`. This slot feeds §1 of the assembled document.

### §1.1 Business Context

Extract from the requirements baseline §1 (or equivalent opening section describing the programme mandate):

- `business_context_intro`: 2–4 formal prose sentences summarising the programme's business rationale — what problem or opportunity it addresses, the domain it operates in, and who it serves. Derive from the requirements baseline executive summary or §1 business context. Do not paraphrase marketing language; use the formal programme vocabulary established in the baseline document.
- `business_context_rows`: Populate exactly 4 rows, each with a `title` and `description`. Row titles are fixed:

  | # | Title | Source |
  |---|-------|--------|
  | 01 | Strategic Objectives | Requirements baseline §1 — strategic mandate, sponsoring body's economic or mission objectives |
  | 02 | Market Dynamics | Requirements baseline §1 — competitive landscape, demand drivers, and contextual trends |
  | 03 | Stakeholder Segments | Requirements baseline §1 or `.ai/context.md` — named user groups and their roles (minimum 3 groups) |
  | 04 | Current Challenges | Requirements baseline §1 — operational or technical challenges the platform addresses |

  Each `description` is 30–80 words, formal prose, specific to this programme. If a row's source is absent from all research inputs, record it in `writing-pack.gaps.md` — do not fabricate.

### §1.2 Platform Vision

Extract from the requirements baseline §2 (or equivalent vision / strategic direction section):

- `platform_vision_intro`: 2–3 formal prose sentences describing the platform's strategic purpose, the value it delivers, and its intended future state.
- `platform_vision_rows`: Populate exactly 6 rows, each with a `title` and `description`. Row titles are fixed:

  | # | Title | Source |
  |---|-------|--------|
  | 01 | Platform Objective | Requirements baseline §2 — the primary capability goal or service mission |
  | 02 | Platform Strategy | Requirements baseline §2 — how the platform achieves its objective (approach, methodology) |
  | 03 | Platform Technology | Requirements baseline §2 or `.ai/context.md` — core technology choices that underpin the platform |
  | 04 | Platform Architecture | Requirements baseline §2 or HLAD §2 — the architectural model or paradigm |
  | 05 | Platform Implementation | Requirements baseline §2 — implementation methodology, delivery model |
  | 06 | Platform Deployment | Requirements baseline §2 — deployment model and phasing strategy |

  Each `description` is 30–80 words, formal prose. If a source is absent, record in gaps.

### §1.3 Architecture Principles (HLAD) / Strategic Objectives (RSR)

This sub-section is populated differently per document type. The shared research task here is to extract the raw material; the type-specific supplement defines how it is used.

- `architecture_principles`: Extract from the requirements baseline §3 (or equivalent principles/objectives section) and `.ai/context.md`. Each entry: `id` (AP-01 format for HLAD; SO-01 format for RSR), `title`, `description`. Minimum 6 entries. Fewer = gap — do not fabricate.
- `principles_source_citation`: Path to the baseline document section or `.ai/context.md` entry used. <!-- Used by doc-validate-{type}.md for source traceability checks; not assembled into document prose. -->

Record the raw list in `s1-overview.md`. The type-specific supplement selects and renders the appropriate sub-set for each document type.

---

## §2 — Solution Architecture research (`s2-platform-context.md`)

Produce `writing-pack/s2-platform-context.md`. This slot feeds §2 of the assembled document.

§2 describes the platform at the level of its three technology layers and the overall platform context. Research must draw from the requirements baseline §2–§3 (or equivalent architectural overview sections) and `.ai/context.md`.

### §2.1 Platform Context

- `platform_context_summary`: 3–5 formal prose sentences describing the overall platform architecture model — what the platform centralises, how it is structured, and what its three-layer model achieves. Extract from the requirements baseline §2 platform context narrative.
- `platform_context_layers_table`: One row per technology layer (names and roles are fixed — derive descriptions from the priming documents):

  | # | Layer | Role |
  |---|-------|------|
  | 01 | Client Tier | Extract from `priming-target-architecture.md` §3 and `priming-accepted-tech-stack.md` §1–§2 — the digital engagement and experience layer; Web (React / Next.js) and mobile (React Native) applications that render UI and make API calls with no business logic in the client. |
  | 02 | Data & Intelligence Layer | Extract from `priming-target-architecture.md` §3 and `priming-database-architecture.md` §1–§2 — the data and analytics backbone; PostgreSQL (system of record via Supabase / PostgREST / Hasura), Redis (cache and session state), and analytics infrastructure. RLS and database roles enforced at this boundary. |
  | 03 | Application & Integration Layer | Extract from `priming-target-architecture.md` §3 and `priming-accepted-tech-stack.md` §4 — the integration and operational foundation; Express / BFF APIs, domain services, background jobs, and external integrations. Business logic, orchestration, validation, and access control live in this layer. |

  `Role` is 30–60 words closely paraphrased from the relevant priming documents. Do not invent layer descriptions beyond what the priming documents support.

- `digital_transformation_pillars`: **OPTIONAL.** Extract from the requirements baseline §2 (if present) the strategic transformation pillars the platform delivers against. Record as a list: `pillar_name | description`. If absent from the baseline, leave the field empty (do not apply gap protocol — absence is not a blocker). The doc-author supplement will omit the pillars table if this field is empty.

### §2.2 Client Tier

Extract from `priming-target-architecture.md` §3, `priming-accepted-tech-stack.md` §1–§3, and any system-specific baseline:

- `tier1_intro`: 2–3 formal prose sentences describing what the Client Tier governs — the user-facing experience layer, the channels it provides (web via React/Next.js, mobile via React Native), and the capabilities that distinguish it (design system, accessibility, no business logic in the client).
- `tier1_features_table`: One row per named feature or capability. Columns: `# | Feature | Description`. Extract from the priming documents and any system-specific baseline. Minimum 3 rows; if fewer are extractable, record gap. Each `Description` is 15–40 words.

### §2.3 Data & Intelligence Layer

Extract from `priming-target-architecture.md` §3, `priming-database-architecture.md` §1–§4, `priming-nonfunctional-specs.md` §2, and any system-specific baseline:

- `tier2_intro`: 2–3 formal prose sentences describing what the Data & Intelligence Layer governs — the data infrastructure (PostgreSQL via Supabase/PostgREST/Hasura), caching and session state (Redis), RLS enforcement, and analytics capabilities.
- `tier2_features_table`: One row per named feature or capability. Columns: `# | Feature | Description`. Extract from the priming documents and any system-specific baseline. Minimum 3 rows; if fewer, record gap. Each `Description` is 15–40 words.

### §2.4 Application & Integration Layer

Extract from `priming-target-architecture.md` §3–§4, `priming-accepted-tech-stack.md` §4–§6, `priming-nonfunctional-specs.md` §2–§3, and any system-specific baseline:

- `tier3_intro`: 2–3 formal prose sentences describing what the Application & Integration Layer governs — Express / BFF APIs, domain services (Routes → Controllers → Services → Repositories), background jobs, external API integrations, and event streams.
- `tier3_features_table`: One row per named feature or capability. Columns: `# | Feature | Description`. Extract from the priming documents and any system-specific baseline. Minimum 3 rows; if fewer, record gap. Each `Description` is 15–40 words.

---

## Gap protocol

If a field in either slot file cannot be populated from the available upstream inputs:

1. Leave the field value as `<!-- GAP: {field_name} — source absent from requirements baseline and .ai/context.md -->`.
2. Add a row to `writing-pack.gaps.md`:
   - `gap_id`: allocate next sequential ID from `annex-gap-register.md`.
   - `section`: `§1` or `§2` as appropriate.
   - `field`: the field name.
   - `source_searched`: which baseline sections and `.ai/context.md` were examined.
   - `resolution_required`: what additional input is needed to populate this field.
3. Do not fabricate content for any gap field.

---

## Closure check

`s1-overview.md` and `s2-platform-context.md` are REQUIRED slot files produced by this supplement.

Before signalling to the type-specific supplement that §1/§2 research is complete, confirm both `writing-pack/s1-overview.md` and `writing-pack/s2-platform-context.md` exist and contain no unfilled placeholder markers (no `TBD`, `TODO`, empty strings, or un-gapped `<!-- GAP: … -->` entries that have not been recorded in `writing-pack.gaps.md`).

Do not write `writing-pack.complete.md` — that is the base orchestrator's responsibility, performed after all sections across all supplements are complete.
