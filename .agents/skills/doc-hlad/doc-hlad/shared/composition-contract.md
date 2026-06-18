---
shared-source: shared/docs/composition-contract.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
title: Composition Contract — arch-diagrams-* skills and the doc-authoring pipeline
status: Active
phase: P4 complete
date: 2026-05-14
scope: HLAD §5 architecture views only
---

# Composition Contract — arch-diagrams-* and doc-authoring pipeline

## Preamble

**Purpose.** This file defines how `doc-author-hlad.md §5` invokes arch-diagrams-* skills and how their output integrates into the Writing Pack. It is the single coupling point between the two systems; both sides remain independently usable outside this contract.

**Scope.** HLAD §5 architecture views only. RSR does not produce diagrams and does not use this contract. §3 and §4 of the HLAD supplement produce prose and tables only; any diagram capability in those sections is handled inline by the relevant skill if ever needed.

**Path resolution.** All file paths in this contract (including references to `arch-diagrams-core/house-style.md`, `arch-diagrams-core/rendering-guide.md`, and `arch-diagrams-hld/hld-checklist.md`) are relative to the `ai-agent-rules/` repository root (the directory containing the `.claude/` and `agents/` folders). Resolve accordingly from whichever working directory the agent is running in.

**Status.** Active — P4 complete. This file is the authoritative composition contract for all arch-diagrams-* invocations from the pipeline until superseded.

---

## §1 — Invocation inputs (what the calling supplement provides)

When `doc-author-hlad.md §5` invokes an arch-diagrams-* skill for a view unit, it **must** supply the following structured inputs. The skill uses these to produce a diagram grounded in the document's own upstream content rather than generic defaults.

| Input field | Type | Source in the HLAD document | Notes |
|-------------|------|-----------------------------|-------|
| `scope` | string (prose) | HLAD §3 Capability Canvas (`capability_canvas_rows`) and scope list | Summarise the platform scope relevant to this view; 2–4 sentences |
| `context` | string (prose) | HLAD §2 Platform Context (`platform_context` slot, technology layer breakdown) | The technology context that frames the view; 2–4 sentences |
| `constraints` | string (prose) | HLAD §1.3 Architecture Principles (`architecture_principles`) and any technology/deployment constraints recorded in §4 | List the operative principles and constraints that must be respected in this diagram |
| `view_name` | string (slug) | The exact section-guide slug for this view (see §4 mapping table below) | e.g. `system-context`, `conceptual-architecture`. Used by the skill to select the correct view template and checklist |
| `renderer_hint` | enum: `mermaid` \| `plantuml` | Determined by the authoring agent per `arch-diagrams-core/rendering-guide.md` thresholds | Default: `mermaid`. Use `plantuml` only when the rendering guide's decision flowchart directs it (e.g. node count > 6 for C4 container views, or C4-PlantUML stdlib required) |
| `house_style_ref` | string (path) | Fixed at `arch-diagrams-core/house-style.md` | Always this value; do not vary per view |
| `diagram_type` | string | From the §4 Per-view skill mapping table (Diagram Type column) | e.g. `C4 L1 Context`, `C4 Container`, `Actor map`. Tells the skill which of its supported view types to produce |

All seven fields are required for a pipeline invocation. An ad-hoc (standalone) call may omit any or all of these fields — see §5 for the full compatibility rules.

---

## §2 — Outputs (what the skill returns)

Every arch-diagrams-* skill invoked from the pipeline must return all five output fields listed below. The authoring agent embeds or processes each field as described.

| Output field | Type | Description | How the authoring agent uses it |
|--------------|------|-------------|--------------------------------|
| `diagram_block` | fenced code block (Mermaid or PlantUML) | The complete renderable diagram with theme directive and title, ready to embed verbatim | Insert directly into the draft after the view's prose opener and principles list. Do not reformat or reindent |
| `legend_block` | markdown table | Legend table per house-style legend format (`arch-diagrams-core/house-style.md`): columns vary by diagram type (arrow labels / protocols / element types) | Insert immediately after `diagram_block`, before any view-specific content tables |
| `checklist_results` | list of pass/fail items | Pass/fail result per mandatory element from the skill's checklist file (e.g. `arch-diagrams-hld/hld-checklist.md`) | If any item is FAIL: do not embed the diagram in the draft. Mark the view unit as blocked. Record a gap row per §3 for each failed item using gap ID `DIAG-{view_slug}-CHK-{N}`. See §3 for the full gap row format |
| `open_items` | list of strings | Items the skill could not resolve from the provided inputs (e.g. missing actor names, unknown external system owners, unconfirmed SLAs) | Convert each item to a gap row per §3 Gap handling below |
| `diagram_id` | string | Stable identifier for this diagram in the format `{view_slug}-v{N}` (e.g. `system-context-v1`). For multi-invocation views (§5.4 System Journeys), the format is `{view_slug}-{flow_slug}-v{N}` with N tracked per flow slug | Use as the figure reference ID in §5 prose (e.g. "see Figure `system-context-v1`"). N starts at 1; increment on each regeneration of the same view (or flow slug for §5.4) |

---

## §3 — Gap handling

Any items in `open_items` become gap rows in `writing-pack/annex-gaps.md`. The authoring agent appends one row per open item using the following format:

| Field | Value |
|-------|-------|
| `gap_id` | `DIAG-{view_slug}-{N}` where N is a sequential integer starting at 1 per view slug (e.g. `DIAG-system-context-1`, `DIAG-system-context-2`) |
| `section` | `§5.{unit_number} {View Name}` (e.g. `§5.1 System Context`) |
| `field` | The specific element that could not be resolved (verbatim from the skill's `open_items` entry) |
| `source_searched` | The skill invoked (e.g. `arch-diagrams-hld`) and the `view_name` input provided |
| `resolution_required` | Description of what a human reviewer must provide to close the gap (e.g. "Confirm the name and owning team for the external IdP system in the Context View") |

Gap rows written during §5 view authoring are picked up by the Stage 0b annex append in `generate-architecture-docs.md` (because the HLAD type has `annex_participation: full`).

If `checklist_results` contains any FAIL items, also write a gap row for each failed check:
- `gap_id`: `DIAG-{view_slug}-CHK-{N}`
- `field`: the failed checklist element text
- `resolution_required`: "Re-invoke the skill after addressing the failed element, then re-embed the returned `diagram_block`"

---

## §4 — Per-view skill mapping table

The table below is the authoritative mapping for all 13 HLAD §5 architecture view units. `doc-author-hlad.md §5` consults this table for `diagram_skill` and `diagram_type` before every invocation.

| §5 Unit Slug | View Name | Diagram Skill | Diagram Type | Notes |
|--------------|-----------|---------------|--------------|-------|
| `system-context` | System Context | `arch-diagrams-hld` | C4 L1 Context | Maps to 4+1 Context View; show all human actors and external systems |
| `system-actors` | System Actors | `arch-diagrams-hld` | Actor map | Use arch-diagrams-hld Business Capability View pattern; capability groups = actor groups |
| `system-interfaces` | System Interfaces | `arch-diagrams-idd` | Interface dependency | IDD Integration Map pattern; one node per interface type |
| `system-journeys` | System Journeys | `arch-diagrams-hld` | Mermaid journey | Invoke once per named journey flow (see §4.1 below). Maps to 4+1 Scenarios View |
| `conceptual-architecture` | Conceptual Architecture | `arch-diagrams-hld` | C4 L1/L2 | Use Context View for L1 and Logical View for L2 groupings |
| `logical-architecture` | Logical Architecture | `arch-diagrams-hld` | C4 L2 / UML Package | Maps to 4+1 Logical View; subgraph per layer or bounded context |
| `implementation-architecture` | Implementation Architecture | `arch-diagrams-hld` | C4 Container | Maps to 4+1 Process View; all containers with runtime annotations |
| `integration-architecture` | Integration Architecture | `arch-diagrams-idd` | Integration | IDD Integration Map; all external integrations with protocol and auth |
| `data-architecture` | Data Architecture | `arch-diagrams-ddd` | ER/DFD | Entity-Relationship or Data Flow Diagram at conceptual level |
| `security-architecture` | Security Architecture | `arch-diagrams-sdd` | Security threat model | Threat model with trust boundaries and data classification |
| `deployment-environment` | Deployment Environment | `arch-diagrams-ddr` | Deployment topology | DDR physical deployment view; cloud regions, VPCs, HA annotations |
| `source-code-branching` | Source Code & Branching | none | (prose + tables only) | No diagram delegation; skip the composition-contract invocation step entirely and author prose and tables as defined in `section-guide.md` |
| `cicd-pipelines` | CI/CD Pipelines | `arch-diagrams-ddr` | Pipeline view | DDR pipeline view; stages, triggers, and environment promotion path |

### §4.1 System Journeys — multi-invocation pattern

For §5.4 System Journeys, the skill is invoked **once per named journey flow** identified in the slot file `writing-pack/s5/system-journeys.md` field `journey_flows`. Each invocation:

- Sets `diagram_type` to `Mermaid journey`
- Sets `view_name` to `system-journeys`
- Sets a `journey_flow_name` context annotation so the skill knows which flow to render (pass the flow name from `journey_flows` as part of the `context` input)
- Returns one `diagram_block` per invocation

> **`journey_flows` slot schema:** The `journey_flows` field in `writing-pack/s5/system-journeys.md` must be a YAML list of objects. Each object must have two string fields: `flow_name` (human-readable name for the journey, e.g. `"Customer Registration"`) and `flow_slug` (URL-safe lowercase-hyphenated identifier, e.g. `"customer-registration"`). Example:
> ```yaml
> journey_flows:
>   - flow_name: "Customer Registration"
>     flow_slug: "customer-registration"
>   - flow_name: "Order Submission"
>     flow_slug: "order-submission"
> ```
> The authoring agent iterates this list in order; each `flow_name` / `flow_slug` pair drives one arch-diagrams-hld invocation.

Embed each returned `diagram_block` immediately after the prose paragraph for that journey flow. Assign `diagram_id` as `system-journeys-{flow_slug}-v{N}` where N is the per-flow regeneration counter: start at 1 for the first invocation of each flow slug; increment N by 1 on each subsequent regeneration of that same flow slug. N is tracked per flow slug independently — do not carry the counter across different flow slugs. Write gap rows per §3 for any `open_items` from each invocation independently, using `gap_id` `DIAG-system-journeys-{flow_slug}-{N}`.

---

## §5 — Standalone skill compatibility

**arch-diagrams-* skills remain independently invocable** for ad-hoc diagram requests outside the pipeline. The composition contract inputs (§1) are a **superset** of what any single skill requires:

- An ad-hoc call may omit `scope`, `context`, `constraints`, `view_name`, `renderer_hint`, `house_style_ref`, and `diagram_type`. The skill uses its internal defaults from its own `SKILL.md`, checklist, and templates.
- An ad-hoc call may omit `diagram_id`. The skill does not require a stable ID for non-pipeline use.
- The skill's checklist and notation standards apply equally in both modes.

Only the pipeline invocation pattern (triggered from `doc-author-hlad.md §5`) supplies all seven contract inputs. This ensures pipeline-produced diagrams are grounded in the HLAD's own upstream content rather than generic examples.

This design means the two systems have exactly one coupling point: this file. Neither the pipeline nor the skills need to know each other's internal implementation. Any future skill can join the pipeline by satisfying the §2 output contract; the pipeline can switch renderers by changing `renderer_hint` without touching skill internals.
