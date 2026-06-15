---
shared-source: shared/protocol/gate-light.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Light gate protocol (diag skills)

Diag skills run a two-halt flow. This file describes Halt 2 — the Review gate.
Halt 1 (Step 0 read-back) is described in `shared/step-0-diag.md`.

---

## Review gate (Halt 2)

After generating the diagram source (Mermaid / PlantUML / Structurizr DSL):

1. **Self-check against readability-rules.md.**
   Read `shared/readability-rules.md`. For each rule, state PASS or FAIL with a
   one-line note. A FAIL does not block output — note it for the user to decide.

2. **Output the diagram source** in a fenced code block with the correct language tag:
   ` ```mermaid `, ` ```plantuml `, or ` ```structurizr `.

3. **Output the notation legend** (if applicable): a short bullet list of the symbols,
   line styles, and colours used and what they mean.

4. **List self-check results**: one line per readability rule, PASS / FAIL / N/A.

5. **Halt with this prompt:**

   ```
   Diagram drafted. Review the source above and choose:
   1. yes — finalise and write to output target
   2. edit — describe what to change and I'll revise
   3. regenerate — discard and regenerate with different parameters
   ```

   Present this as a numbered menu. Accept only 1, 2, or 3. Re-present if the user
   gives a free-text answer that does not map to an option.

6. On `1 (yes)`:
   - If `output_target` is a file path: write the fenced block to that file.
   - If `output_target` is `chat`: echo "Diagram finalised above." and end.

7. On `2 (edit)`: apply the user's changes, re-run the self-check, re-output the
   revised diagram, and return to step 5.

8. On `3 (regenerate)`: re-run the skill body from the beginning using the same
   Step 0 brief (do not re-run Step 0), then return to step 5.
