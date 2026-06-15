---
shared-source: shared/protocol/step-0-diag.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Step 0 — Shared brief capture (diag skills, Questions 2–5)

This file is loaded by the SKILL.md after Question 1 (diagram type selection) is complete.
Follow Questions 2–5 in order, then perform the read-back before proceeding.

---

**Question 2 — System / scope**

Ask: "What system or sub-system is being drawn? Please bound the scope — name the
container, service, or boundary you want to represent, not the whole estate."

Free-text answer. Record as `scope`.

---

**Question 3 — Available inputs**

Ask: "What inputs can you share? List any of the following that exist:
- Existing documents (architecture docs, requirement specs, design docs) — provide file paths
- Written descriptions of the system
- Prior diagrams to extend
- Repo paths with relevant code

Answer 'none' if starting from scratch."

Free-text answer. Record as `inputs`.

---

**Question 4 — Renderer preference**

Present this numbered menu exactly and ask the user to pick by number:

```
Renderer options:
1. Mermaid (default — best for most diagrams, renders in GitHub/Notion)
2. PlantUML (best for UML sequence and class diagrams)
3. Structurizr DSL (best for C4 context and container diagrams)
4. Let the skill choose (uses standards-map.md defaults)
```

If the user gives a free-text answer instead of a number, re-present the menu.
Record answer as `renderer` (one of: `mermaid` | `plantuml` | `structurizr` | `auto`).

---

**Question 5 — Output target**

Ask: "Where should the diagram be written?
- Provide a file path (e.g. `docs/architecture/context.md`), OR
- Reply 'chat' to receive the output as a chat response only."

Free-text answer. Record as `output_target`.

---

**Read-back (mandatory)**

Echo the captured brief in a fenced block:

```
=== Step 0 brief ===
Diagram type:   {answer from Q1 in SKILL.md}
Scope:          {scope}
Inputs:         {inputs}
Renderer:       {renderer}
Output target:  {output_target}
=== End brief ===
```

Then ask: **"Confirm to proceed? (yes / edit)"**

- If the user replies `yes`: proceed to the skill body.
- If the user replies `edit` or makes a correction: update the relevant field, re-echo the brief, and ask again.
- Do not proceed until `yes` is received.
