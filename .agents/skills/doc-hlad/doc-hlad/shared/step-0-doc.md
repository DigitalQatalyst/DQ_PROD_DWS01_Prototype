---
shared-source: shared/protocol/step-0-doc.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Step 0 — Shared brief capture (doc skills, Questions 2–5)

This file is loaded by the SKILL.md after Question 1 (sub-type selection, where applicable) is complete.
Follow Questions 2–5 in order, then perform the read-back before proceeding.

---

**Question 2 — Project / system name**

Ask: "What is the project or system name? This will be used in document titles,
filenames, and frontmatter."

Free-text answer. Record as `system_name`.

---

**Question 3 — Upstream inputs**

Present the inputs checklist defined in the SKILL.md for this skill.
For each item in the checklist, ask the user for a file path or 'none'.

Record as `inputs` (key-value list: input name → path or 'none').

---

**Question 4 — Scope of this run**

Present this numbered menu exactly and ask the user to pick by number:

```
Scope options:
1. Full document end to end (all sections from the skeleton)
2. Specific section(s) only (I'll ask which sections after you pick this)
```

If option 2 is selected, ask: "Which sections? List by heading number (e.g. '§3, §5.2, §6')."

Record as `scope` (`full` | list of section refs).

---

**Question 5 — Output target**

Ask: "Where should the document be written? Provide the file path
(e.g. `docs/architecture/hlad.md`)."

Free-text answer. Record as `output_path`.

---

**Read-back (mandatory)**

Echo the captured brief in a fenced block:

```
=== Step 0 brief ===
Sub-type:       {answer from Q1 in SKILL.md, or 'N/A' if no sub-type}
System name:    {system_name}
Inputs:
{inputs — one line per item, e.g. "  - BRS: docs/requirements.md"}
Scope:          {scope}
Output path:    {output_path}
=== End brief ===
```

Then ask: **"Confirm to proceed? (yes / edit)"**

- If the user replies `yes`: proceed to the skill body.
- If the user replies `edit` or makes a correction: update the field, re-echo the brief, and ask again.
- Do not proceed until `yes` is received.
