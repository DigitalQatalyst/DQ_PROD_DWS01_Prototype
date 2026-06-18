---
shared-source: shared/docs/supplements/_shared/doc-author-platform-context.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Supplement: doc-author — platform context (shared §1/§2 protocol)

**Loaded by:** orchestrator when `report_type: rsr` or `report_type: hlad` — loaded FIRST, before any type-specific supplement.  
**Extends:** doc-author primary file  
**Slot files consumed:** `writing-pack/s1-overview.md`, `writing-pack/s2-platform-context.md`

This supplement defines the assembly protocol for §1 (Project Overview) and §2 (Solution Architecture) — the two opening sections that are structurally identical across RSR and HLAD document types. Assembly runs once from the shared Writing Pack slots; the type-specific supplement governs §3 and beyond.

Load this supplement first. The type-specific supplement that follows may override §3 assembly; it must not re-author §1 or §2.

---

## Intro narrative length rules (§1 and §2)

| Heading level | What it covers | Minimum length | Common rejection pattern |
|---------------|---------------|---------------|--------------------------|
| **H1** (`# 1.` and `# 2.`) | Section openers | 2–3 sentences; frame what the section establishes | Single sentence naming the section |
| **H2** (`## 1.1`, `## 1.2`, `## 1.3`, `## 2.1`–`## 2.4`) | Sub-section openers | 1 substantive sentence before any table; states what the sub-section presents, not what it "describes" | "This sub-section describes…" opener alone |
| **H3** (within §1.3 if sub-divided) | Principle or objective group openers | 1 sentence minimum | Table with no preceding sentence |

The H2 opener sentence must be substantive — it must assert the content in the sub-section, not announce it. Rejected: "This section outlines the architecture principles." Accepted: "The architecture principles governing this platform establish the design constraints and technology choices that every delivery workstream must observe."

---

## §1 — Project Overview assembly

**Slot file:** `writing-pack/s1-overview.md`

Open `# 1. Project Overview` with 2–3 sentences that:
1. State the document type and the programme it documents.
2. Identify the platform's primary purpose and the users it serves.
3. State that §1 establishes the business context, platform vision, and the governing principles (HLAD) or strategic objectives (RSR) for the platform.

Do not name sub-sections in the opener (SC-03 equivalent: do not announce what is in each H2).

### §1.1 Business Context

1. Write one substantive H2 opener sentence stating the strategic and stakeholder context this sub-section presents. Do not begin with "This sub-section…".
2. Render `business_context_intro` as a prose paragraph (already formal prose — render as-is or lightly adjust for document-level register consistency).
3. Render `business_context_rows` as a numbered table: `# | Title | Description`. Exactly 4 rows in fixed order: Strategic Objectives, Market Dynamics, Stakeholder Segments, Current Challenges.

### §1.2 Platform Vision

1. Write one substantive H2 opener sentence stating the vision scope this sub-section presents.
2. Render `platform_vision_intro` as a prose paragraph.
3. Render `platform_vision_rows` as a numbered table: `# | Title | Description`. Exactly 6 rows in fixed order: Platform Objective, Platform Strategy, Platform Technology, Platform Architecture, Platform Implementation, Platform Deployment.

### §1.3 Architecture Principles / Strategic Objectives

**Fully deferred to the type-specific supplement.** This shared supplement does not assemble §1.3 content. The research slot `s1-overview.md` field `architecture_principles` is populated by `doc-research-platform-context.md`. The type-specific supplement (`doc-author-rsr.md` or `doc-author-hlad.md`) owns the §1.3 heading name and all rendering instructions. Do not write any §1.3 content here.

---

## §2 — Solution Architecture assembly

**Slot file:** `writing-pack/s2-platform-context.md`

**Note:** §2 is a platform-level section describing the three-layer architecture model. It is not system-specific. Do not introduce system-level detail (individual repos, API endpoints, deployment manifests) into §2 — those belong in §3 and beyond.

Open `# 2. Solution Architecture` with 2–3 sentences that:
1. State that §2 presents the platform-level architecture context — the three technology layers and the strategic model they serve.
2. Name the three layers (Client Tier, Data & Intelligence Layer, Application & Integration Layer) as the organising structure.
3. Write a single statement that the remaining sections of this document elaborate the specific requirements or architecture for this programme (do not name or reference any numbered section).

### §2.1 Platform Context

1. Write one substantive H2 opener sentence stating what the platform context sub-section presents — the overall architecture model and how its layers work together.
2. Render `platform_context_summary` as a prose paragraph.
3. Render `platform_context_layers_table` as a numbered table: `# | Layer | Role`. 3 rows: {{platform-tier-1}}, {{platform-tier-2}}, {{platform-tier-3}}.
4. If `digital_transformation_pillars` is non-empty: write one bridging sentence ("The platform delivers against strategic digital transformation pillars:" or equivalent), then render as a table: `# | Pillar | Description`. If empty or gapped, omit — do not leave a gap notice in the assembled document; the gap is tracked in `writing-pack.gaps.md`.

### §2.2 Client Tier

The sub-section heading is `## 2.2 Client Tier`. Do not rename or subtitle this layer; use the name exactly as it appears in `s2-platform-context.md`.

1. Write one substantive H2 opener sentence stating what the Client Tier governs and why it is the user-facing boundary of the platform (web via React/Next.js and mobile via React Native, enforcing no business logic in the client).
2. Render `tier1_intro` as a prose paragraph.
3. Render `tier1_features_table` as a numbered table: `# | Feature | Description`.

### §2.3 Data & Intelligence Layer

The sub-section heading is `## 2.3 Data & Intelligence Layer`. Do not rename or subtitle this layer; use the name exactly as it appears in `s2-platform-context.md`.

1. Write one substantive H2 opener sentence stating what the Data & Intelligence Layer governs and its role as the data backbone of the platform (PostgreSQL via Supabase/PostgREST/Hasura, Redis, analytics infrastructure, RLS enforcement).
2. Render `tier2_intro` as a prose paragraph.
3. Render `tier2_features_table` as a numbered table: `# | Feature | Description`.

### §2.4 Application & Integration Layer

The sub-section heading is `## 2.4 Application & Integration Layer`. Do not rename or subtitle this layer; use the name exactly as it appears in `s2-platform-context.md`.

1. Write one substantive H2 opener sentence stating what the Application & Integration Layer governs and its role in ensuring business logic, orchestration, and secure external integration (Express/BFF APIs, domain services, background jobs, event streams).
2. Render `tier3_intro` as a prose paragraph.
3. Render `tier3_features_table` as a numbered table: `# | Feature | Description`.

---

## Self-check obligations (§1 and §2 blocks)

Before appending any §1 or §2 block to the draft, confirm all of the following:

| # | Check |
|---|-------|
| SC-01 | Every sentence traces to a named Writing Pack field from `s1-overview.md` or `s2-platform-context.md` |
| SC-02 | No H2 opener begins with "This section describes", "This sub-section outlines", or "The following table" alone — 1 substantive sentence required for each H2 in §1 and §2. <!-- This overrides the base doc-author.md H2 prose-opener rule for §1 and §2: 1 sentence for shared platform-context sections. --> |
| SC-03 | No two tables appear back-to-back without a bridging sentence between them |
| SC-04 | No table exceeds 5 columns |
| SC-05 | No arrow notation (`→`, `->`) in prose or tables |
| SC-06 | No file paths appear in body prose — layer names and programme document names only |
| SC-07 | No system-specific facts (individual repos, API routes, environment variables) appear in §2 |
| SC-08 | §1 opener does not list the names of H2 sub-sections |
| SC-09 | §2 opener does not repeat the §1 vision content — §2 addresses architectural structure, not business rationale |
| SC-10 | Layer names in §2.2–§2.4 headings are exactly `Client Tier`, `Data & Intelligence Layer`, `Application & Integration Layer` — no variants, no subtitles added |

A block that fails any item must be corrected before it is appended to the draft.

---

## Gate position

§1 and §2 are the first two gate points in the RSR and HLAD pipelines. The type-specific supplement defines gate numbering. This supplement's obligation:

- §1 complete → write `.gate-request-1.md` per `stage-gate-protocol.md` → halt for approval.
- On §1 gate approval → assemble §2 → write `.gate-request-2.md` per `stage-gate-protocol.md` → halt for approval.
- On §2 gate approval → signal readiness to the orchestrator; type-specific supplement takes over from §3.

Do not assemble §3 or beyond until §2 gate approval is received.
