---
name: doc-rsr
description: >
  Use when the user asks for an RSR, Requirements Specification Report, requirements
  document, or business-requirements-to-RSR translation. Triggers: 'RSR', 'requirements
  specification', 'requirements document', 'functional spec doc'.
---

# doc-rsr — Requirements Specification Report Skill

Produces a Requirements Specification Report (RSR) document following the standard
section structure: Introduction → Solution Architecture → Requirements Architecture →
Scope & Assumptions → Requirement Areas (7 stages + 5 NFR areas) → Appendices.

**Base directory** is provided in your context as `Base directory for this skill: <path>`.
Use that prefix for all `shared/` file references below.

## Shared references

| File | Read when |
|---|---|
| `<base_dir>/shared/pipeline/generate-architecture-docs.md` | At skill start, after Step 0 |
| `<base_dir>/shared/pipeline/doc-research.md` | During Research gates |
| `<base_dir>/shared/pipeline/doc-author.md` | During Author gates |
| `<base_dir>/shared/pipeline/doc-validate.md` | During Validate gates |
| `<base_dir>/supplements/rsr/doc-research-rsr.md` | Research: §3–§6 |
| `<base_dir>/supplements/rsr/doc-author-rsr.md` | Author: §3–§6 |
| `<base_dir>/supplements/rsr/doc-validate-rsr.md` | Validate gates |
| `<base_dir>/templates/rsr-skeleton.md` | Section list and gate boundaries |
| `<base_dir>/shared/gate-full.md` | Gate protocol at each section boundary |
| `<base_dir>/shared/step-0-doc.md` | Step 0 Questions 2–5 and read-back |
| `<base_dir>/shared/reference.docx` | DOCX export — passed to pandoc `--reference-doc` at final Save step |

---

## Step 0 — Brief and context

**Do not skip Step 0. No research or authoring begins before Step 0 is confirmed.**

### Question 1 — No sub-type selection

`doc-rsr` has a single document type. Skip Question 1 (no menu needed).
Proceed directly to Questions 2–5.

### Questions 2–5 and read-back

The inputs checklist for Question 3 (upstream inputs) for this skill:
- BRS or business requirements brief (primary source)
- Stakeholder interview notes (if available)
- Programme strategy documents (if available)
- Prior RSR (if extending an existing document)

Read `<base_dir>/shared/step-0-doc.md` and follow it exactly for Questions 2–5
and the read-back. Do not proceed until the user confirms with `yes`.

---

## Skill body

Execute after Step 0 is confirmed.

1. Read `<base_dir>/shared/pipeline/generate-architecture-docs.md` for the
   orchestration protocol.
2. Read `<base_dir>/templates/rsr-skeleton.md` to establish the section list
   and gate boundaries.
3. Read `<base_dir>/shared/gate-full.md` for the full gate protocol.
4. Work through each section in skeleton order. At each gate boundary:
   - Plan → Research → Author → Validate (per gate-full.md).
   - For all sections: use `doc-research-rsr.md` and `doc-author-rsr.md` from
     `supplements/rsr/`.
   - Note: RSR does not use shared `_shared` supplements for §1/§2. The RSR
     supplement governs §3–§6; §1 and §2 follow the primary doc-research and
     doc-author pipeline files directly.
5. RSR contains no diagrams. Do not emit diagram handoff blocks. If a user
   requests a diagram within an RSR session, advise that RSR is a prose and
   tables document and diagrams are not permitted per RSR-SC-03.

6. **Save and export**

   After all section gates are confirmed and the document is fully validated:

   a. Write the complete document as a markdown file using the filename convention
      `rsr-v<version>-draft.md` (e.g. `rsr-v1.0-draft.md`), saved to the
      project output folder or current working directory if not specified.

   b. Export to a styled DOCX using the DQ reference template:

      ```bash
      pandoc rsr-v<version>-draft.md \
        -o rsr-v<version>.docx \
        --reference-doc="<base_dir>/shared/reference.docx"
      ```

      Run from the folder containing the markdown file. Pandoc must be installed
      (`pandoc --version` to verify). If pandoc is not available, save the
      markdown only and note the DOCX export is pending.

   c. Report both saved paths, then tell the user the values to paste into
      the header and footer in Word (double-click the header/footer area to
      edit; the placeholders `{{DOC_HEADER}}` and `{{DOC_FOOTER}}` are
      visible and ready to replace):
      - **Header**: `<Platform Name> — <Doc ID> — RSR`  (e.g. `GPRC Platform — DWS.03 — RSR`)
      - **Footer**: `DQ | <Client Name> | <Month Year>`  (e.g. `DQ | STC Bank | May 2026`)
