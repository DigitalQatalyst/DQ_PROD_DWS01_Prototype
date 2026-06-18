---
name: doc-llad
description: >
  Use when the user asks for an LLAD, Low Level Architecture Design, system
  design document, API design document, or cross-cutting architecture design.
  Triggers: 'LLAD', 'low level architecture', 'system design doc', 'API
  architecture', 'cross-cutting design', 'IAM design', 'data design', 'DDD',
  'interoperability design', 'IDD'.
---

# doc-llad — Low Level Architecture Design Skill

Produces a Low Level Architecture Design (LLAD) document in one of three
sub-types: Architecture (system-specific views), Interoperability (API/route
domain design), or Cross-Cutting (platform-wide concern governance).

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
| `<base_dir>/shared/composition-contract.md` | When emitting a diagram handoff block |
| `<base_dir>/shared/gate-full.md` | Gate protocol at each section boundary |
| `<base_dir>/shared/step-0-doc.md` | Step 0 Questions 2–5 and read-back |
| `<base_dir>/shared/reference.docx` | DOCX export — passed to pandoc `--reference-doc` at final Save step |

### Architecture sub-type supplements

| File | Read when |
|---|---|
| `<base_dir>/supplements/architecture/doc-research-architecture.md` | Research: §3–§6 (architecture sub-type) |
| `<base_dir>/supplements/architecture/doc-author-architecture.md` | Author: §3–§6 (architecture sub-type) |
| `<base_dir>/templates/llad-architecture-skeleton.md` | Section list and gate boundaries (architecture) |

### Interoperability sub-type supplements

| File | Read when |
|---|---|
| `<base_dir>/supplements/interoperability/doc-research-interoperability.md` | Research: §3–§6 (interoperability sub-type) |
| `<base_dir>/supplements/interoperability/doc-author-interoperability.md` | Author: §3–§6 (interoperability sub-type) |
| `<base_dir>/templates/llad-interoperability-skeleton.md` | Section list and gate boundaries (interoperability) |

### Cross-cutting sub-type supplements

| File | Read when |
|---|---|
| `<base_dir>/supplements/cross-cutting/doc-research-cross-cutting.md` | Research: §3–§6 (cross-cutting sub-type) |
| `<base_dir>/supplements/cross-cutting/doc-author-cross-cutting.md` | Author: §3–§6 (cross-cutting sub-type, base) |
| `<base_dir>/supplements/cross-cutting/doc-author-ddd.md` | Author: §3–§6 (DDD concern only — loads after base) |
| `<base_dir>/supplements/cross-cutting/doc-author-adgr.md` | Author: §4.4 and ADR appendix (all sub-types) |
| `<base_dir>/supplements/cross-cutting/doc-validate-cross-cutting.md` | Validate gates (cross-cutting sub-type) |
| `<base_dir>/templates/llad-cross-cutting-skeleton.md` | Section list and gate boundaries (cross-cutting) |

---

## Step 0 — Brief and context

**Do not skip Step 0. No research or authoring begins before Step 0 is confirmed.**

### Question 1 — Sub-type selection

Present this menu and wait for the user to choose:

```
Which LLAD sub-type are you producing?

  1. Architecture   — system-specific architecture views (functional decomposition,
                      data, security, deployment, observability, resilience, etc.)
  2. Interoperability — API and route domain design (REST/WebSocket layer, §3 API
                        architecture, §5 route domain domains)
  3. Cross-cutting  — platform-wide concern governance (IAM, data design, deployment
                      design, integration design, security design, etc.)

Reply with the number (1, 2, or 3).
```

Record the chosen sub-type as `llad_subtype`. Do not proceed until the user answers.

### Question 1b — Cross-cutting concern topic (only if Q1 = option 3)

If `llad_subtype` = Cross-cutting, present this follow-up and wait for the answer:

```
Which cross-cutting concern are you documenting?

  1. Identity & Access Management (IAM)
  2. Data architecture
  3. Deployment architecture
  4. Security architecture
  5. Other (describe)

Reply with the number (or describe for option 5).
```

Record as `cross_cutting_topic`. Skip this question if `llad_subtype` is not Cross-cutting.

### Questions 2–5 and read-back

The inputs checklist for Question 3 (upstream inputs) for this skill varies by sub-type:

**Architecture:**
- HLAD (mandatory — architecture views derive from it)
- RSR (for NFR coverage in §4.3)
- Prior LLAD for this system (if extending an existing document)
- List of systems and services in scope
- Database schema / entity model (if available)

**Interoperability:**
- HLAD (mandatory)
- RSR (for NFR coverage in §4.3)
- Prior LLAD-API or LLAD-ANA (if extending)
- Route/endpoint inventory or API surface list (if available)
- Auth and middleware configuration details

**Cross-cutting:**
- HLAD (mandatory)
- RSR (for NFR coverage in §4.3)
- Platform document map (to identify in-scope systems and sibling cross-cutting docs)
- Prior version of this cross-cutting document (if extending)
- Concern-specific source material (e.g. identity provider config, schema files, CI/CD manifests)

Read `<base_dir>/shared/step-0-doc.md` and follow it exactly for Questions 2–5
and the read-back. Do not proceed until the user confirms with `yes`.

---

## Skill body

Execute after Step 0 is confirmed.

1. Read `<base_dir>/shared/pipeline/generate-architecture-docs.md` for the
   orchestration protocol.
2. Based on `llad_subtype`, read the corresponding skeleton file to establish
   the section list and gate boundaries:
   - Architecture: `<base_dir>/templates/llad-architecture-skeleton.md`
   - Interoperability: `<base_dir>/templates/llad-interoperability-skeleton.md`
   - Cross-cutting: `<base_dir>/templates/llad-cross-cutting-skeleton.md`
3. Read `<base_dir>/shared/gate-full.md` for the full gate protocol.
4. Work through each section in skeleton order. At each gate boundary:
   - Plan → Research → Author → Validate (per gate-full.md).
   - For §1–§2 (all sub-types): use `doc-research-platform-context.md` and
     `doc-author-platform-context.md` from `shared/supplements/_shared/`.
   - For §3–§6: load the supplement pair for the chosen sub-type (see tables above).
   - For §4.4 and the ADR appendix (all sub-types): also load
     `supplements/cross-cutting/doc-author-adgr.md`.
   - Cross-cutting sub-type only — DDD concern: after loading the base
     cross-cutting author supplement, also load `doc-author-ddd.md`.
   - Cross-cutting sub-type: use `doc-validate-cross-cutting.md` at Validate gates.
5. When a section requires a diagram (architecture and interoperability sub-types
   only), emit a **handoff block** and halt:

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

6. Cross-cutting sub-type: after all concern domain gates (§5.N) are complete,
   run the full 23-check validation pass using `doc-validate-cross-cutting.md`
   before closing the document.

7. **Save and export**

   After all section gates are confirmed and the document is fully validated:

   a. Write the complete document as a markdown file using the filename convention
      `llad-<subtype>-v<version>-draft.md` (e.g. `llad-architecture-v1.0-draft.md`),
      saved to the project output folder or current working directory if not specified.

   b. Export to a styled DOCX using the DQ reference template:

      ```bash
      pandoc llad-<subtype>-v<version>-draft.md \
        -o llad-<subtype>-v<version>.docx \
        --reference-doc="<base_dir>/shared/reference.docx"
      ```

      Run from the folder containing the markdown file. Pandoc must be installed
      (`pandoc --version` to verify). If pandoc is not available, save the
      markdown only and note the DOCX export is pending.

   c. Report both saved paths, then tell the user the values to paste into
      the header and footer in Word (double-click the header/footer area to
      edit; the placeholders `{{DOC_HEADER}}` and `{{DOC_FOOTER}}` are
      visible and ready to replace):
      - **Header**: `<Platform Name> — <Doc ID> — LLAD`  (e.g. `GPRC Platform — DWS.03 — LLAD`)
      - **Footer**: `DQ | <Client Name> | <Month Year>`  (e.g. `DQ | STC Bank | May 2026`)
