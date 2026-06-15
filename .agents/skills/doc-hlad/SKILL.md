---
name: doc-hlad
description: >
  Use when the user asks for an HLAD, High Level Architecture Design, or system
  architecture document. Triggers: 'HLAD', 'high level architecture', 'architecture
  document', 'system architecture doc'.
---

# doc-hlad — High Level Architecture Design Skill

Produces a High Level Architecture Design (HLAD) document following the standard
section structure: Introduction → Solution Architecture → Architecture Context →
Architecture Software → Architecture Views (13 views) → Appendices.

**Base directory** is provided in your context as `Base directory for this skill: <path>`.
Use that prefix for all `shared/` file references below.

## Shared references

| File | Read when |
|---|---|
| `<base_dir>/shared/pipeline/generate-architecture-docs.md` | At skill start, after Step 0 |
| `<base_dir>/shared/pipeline/doc-research.md` | During Research gates |
| `<base_dir>/shared/pipeline/doc-author.md` | During Author gates |
| `<base_dir>/shared/pipeline/doc-validate.md` | During Validate gates |
| `<base_dir>/shared/supplements/_shared/doc-research-platform-context.md` | Research: §1 and §2 |
| `<base_dir>/shared/supplements/_shared/doc-author-platform-context.md` | Author: §1 and §2 |
| `<base_dir>/supplements/hlad/doc-research-hlad.md` | Research: §3–§6 |
| `<base_dir>/supplements/hlad/doc-author-hlad.md` | Author: §3–§6 |
| `<base_dir>/supplements/hlad/doc-validate-hlad.md` | Validate gates |
| `<base_dir>/shared/composition-contract.md` | When emitting a diagram handoff block |
| `<base_dir>/templates/hlad-skeleton.md` | Section list and gate boundaries |
| `<base_dir>/shared/gate-full.md` | Gate protocol at each section boundary |
| `<base_dir>/shared/step-0-doc.md` | Step 0 Questions 2–5 and read-back |
| `<base_dir>/shared/reference.docx` | DOCX export — passed to pandoc `--reference-doc` at final Save step |

---

## Step 0 — Brief and context

**Do not skip Step 0. No research or authoring begins before Step 0 is confirmed.**

### Question 1 — No sub-type selection

`doc-hlad` has a single document type. Skip Question 1 (no menu needed).
Proceed directly to Questions 2–5.

### Questions 2–5 and read-back

The inputs checklist for Question 3 (upstream inputs) for this skill:
- BRS or business brief (primary requirement source)
- RSR (if it exists — provides requirements context)
- Prior HLAD (if extending an existing document)
- List of systems and services in scope
- Environment/infrastructure description

Read `<base_dir>/shared/step-0-doc.md` and follow it exactly for Questions 2–5
and the read-back. Do not proceed until the user confirms with `yes`.

---

## Skill body

Execute after Step 0 is confirmed.

1. Read `<base_dir>/shared/pipeline/generate-architecture-docs.md` for the
   orchestration protocol.
2. Read `<base_dir>/templates/hlad-skeleton.md` to establish the section list
   and gate boundaries.
3. Read `<base_dir>/shared/gate-full.md` for the full gate protocol.
4. Work through each section in skeleton order. At each gate boundary:
   - Plan → Research → Author → Validate (per gate-full.md).
   - For §1–§2: use `doc-research-platform-context.md` and
     `doc-author-platform-context.md` from `shared/supplements/_shared/`.
   - For §3–§6: use `doc-research-hlad.md` and `doc-author-hlad.md` from
     `supplements/hlad/`. At Validate gates, also load `doc-validate-hlad.md`
     from `supplements/hlad/`.
5. When a section requires a diagram, emit a **handoff block** and halt:

```
=== Diagram handoff ===
To produce the diagram for this section, invoke the following skill in a new turn:

  Skill: <diag-slug>
  Recommended diagram type: <numbered menu option>
  System / scope: <pre-filled from Step 0 system_name and scope>
  Available inputs to pass:
    - <relevant input from Step 0>
  Renderer preference: let skill choose

After the diagram is finalised, paste the fenced ```mermaid / ```plantuml /
```structurizr block back into this conversation and reply "continue".
=== End handoff ===
```

   When the user pastes the diagram block and replies "continue", insert the
   fenced block at the diagram placeholder position in the output file and
   proceed to the next gate.

6. **Save and export**

   After all section gates are confirmed and the document is fully validated:

   a. Write the complete document as a markdown file using the filename convention
      `hlad-v<version>-draft.md` (e.g. `hlad-v1.0-draft.md`), saved to the
      project output folder or current working directory if not specified.

   b. Export to a styled DOCX using the DQ reference template:

      ```bash
      pandoc hlad-v<version>-draft.md \
        -o hlad-v<version>.docx \
        --reference-doc="<base_dir>/shared/reference.docx"
      ```

      Run from the folder containing the markdown file. Pandoc must be installed
      (`pandoc --version` to verify). If pandoc is not available, save the
      markdown only and note the DOCX export is pending.

   c. Report both saved paths, then tell the user the values to paste into
      the header and footer in Word (double-click the header/footer area to
      edit; the placeholders `{{DOC_HEADER}}` and `{{DOC_FOOTER}}` are
      visible and ready to replace):
      - **Header**: `<Platform Name> — <Doc ID> — HLAD`  (e.g. `GPRC Platform — DWS.03 — HLAD`)
      - **Footer**: `DQ | <Client Name> | <Month Year>`  (e.g. `DQ | STC Bank | May 2026`)
