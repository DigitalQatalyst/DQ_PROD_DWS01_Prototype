---
name: diag-llad
description: >
  Use when the user asks for a component diagram, sequence diagram, class diagram,
  or state machine. Triggers: 'C4 L3', 'sequence diagram', 'class diagram',
  'state machine', 'component diagram for'.
---

# diag-llad — Low Level Architecture Diagram Skill

Produces C4 Level 3 (Component), UML Sequence, UML Class, and State machine diagrams.

**Base directory** for this skill is provided in your context as
`Base directory for this skill: <path>`. Use that path prefix for all `shared/`
file references below (e.g. `<base_dir>/shared/house-style.md`).

## Shared references (read on demand, not upfront)

| File | Read when |
|---|---|
| `<base_dir>/shared/platform-context.md` | Before generating any diagram — DQ platform guardrails, canonical tier/technology names, architectural constraints (G-01–G-07) |
| `<base_dir>/shared/house-style.md` | Before generating any diagram |
| `<base_dir>/shared/rendering-guide.md` | When choosing renderer |
| `<base_dir>/shared/c4-reference.md` | When `diagram_type` is C4 L3 |
| `<base_dir>/shared/mermaid-primer.md` | When renderer = Mermaid |
| `<base_dir>/shared/plantuml-primer.md` | When renderer = PlantUML |
| `<base_dir>/shared/structurizr-primer.md` | When `diagram_type` is C4 L3 AND renderer = Structurizr DSL |
| `<base_dir>/shared/standards-map.md` | When renderer = auto (Q4 option 4) |
| `<base_dir>/shared/readability-rules.md` | During Review gate self-check |
| `<base_dir>/lld-checklist.md` | Before outputting diagram (quality check) |
| `<base_dir>/lld-template.md` | As starting structure for the diagram |
| `<base_dir>/notation-cheatsheet.md` | When selecting notation for a new diagram type or answering a notation question |

---

## Step 0 — Brief and context

**Do not skip Step 0. Capture the brief below before doing anything else.**

> This skill produces **one diagram at a time**. For a complete LLAD document, use the `doc-llad` skill instead.

### Question 1 — Diagram type (forced numbered menu)

Present this menu exactly. Ask the user to pick by number. Re-present if the
user gives a free-text answer that does not map to a number.

Diagram type options:
1. C4 L3 — Component (shows the internal components of a container)
2. UML Sequence (shows message flows between participants over time)
3. UML Class (shows classes, attributes, operations, and relationships)
4. State machine (shows states, transitions, guards, and actions)

Record the answer as `diagram_type`.

### Questions 2–5 and read-back

Read `<base_dir>/shared/step-0-diag.md` and follow it exactly. Do not proceed
past the read-back until the user confirms with `yes`.

---

## Skill body

Execute after Step 0 is confirmed.

1. Read `<base_dir>/shared/platform-context.md` and `<base_dir>/shared/house-style.md`.
2. Determine renderer:
   - If `renderer` = `auto`: read `<base_dir>/shared/standards-map.md` and follow its default for the chosen `diagram_type`.
   - If `renderer` = `mermaid`: read `<base_dir>/shared/mermaid-primer.md`.
   - If `renderer` = `plantuml`: read `<base_dir>/shared/plantuml-primer.md`.
   - If `renderer` = `structurizr`: read `<base_dir>/shared/structurizr-primer.md`.
3. If `diagram_type` is C4 L3: read `<base_dir>/shared/c4-reference.md`.
4. Read `<base_dir>/lld-template.md` as the structural starting point.
5. Generate the diagram source using the inputs from Step 0, the house style, the renderer primer, and the platform guardrails from `platform-context.md`. Use the canonical DQ platform tier names and technology labels (§2 and §5 of `platform-context.md`). Extend the platform baseline with user-provided Step 0 inputs — do not invent elements beyond what `platform-context.md` and Step 0 inputs support. If any element would violate a guardrail (G-01–G-07), annotate with `[!] Guardrail conflict:` and confirm the exception with the user before finalising.
6. Read `<base_dir>/lld-checklist.md` and verify each checklist item. Note any FAIL.
7. Execute the **Review gate**: read `<base_dir>/shared/gate-light.md` and follow it.
