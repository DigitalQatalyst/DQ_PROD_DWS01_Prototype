---
shared-source: shared/protocol/gate-full.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Full gate protocol (doc skills)

Doc skills produce multi-section documents. The gate runs at each section boundary.
Section boundaries are defined in the skill's `templates/<sub-type>-skeleton.md`.

---

## Per-section cycle

For each section, run steps A through D in order.

### Step A — Plan gate

State:
- The section heading and number being authored next.
- Which supplement file(s) will be consulted (by path relative to skill root).
- 3–5 bullet points describing the intended content.

Then halt:

```
Plan for §N ready. Choose:
1. yes — proceed to research
2. edit — describe what to change in the plan
3. skip — skip this section and move to the next
```

Accept only 1, 2, or 3. Re-present if the user gives a free-text answer.

- On `1 (yes)`: proceed to Step B.
- On `2 (edit)`: update the plan bullets per the user's description, re-state the
  updated plan, and re-halt at Step A.
- On `3 (skip)`: write `[SKIPPED]` at the section's position in the output file and
  advance to the next section (Step A for the next section).

### Step B — Research gate

Run the research supplement specified in Step A. Output findings in a fenced block
labelled ` ```research-findings `.

Then halt:

```
Research complete. Choose:
1. yes — proceed to author
2. edit — describe additional research needed
3. re-research — discard findings and re-run research
```

- On `1 (yes)`: proceed to Step C.
- On `2 (edit)`: run additional research as described, append to findings block,
  and re-halt at Step B.
- On `3 (re-research)`: discard findings, re-run the research supplement, output
  new findings block, and re-halt at Step B.

### Step C — Author gate

Run the author supplement for this section. Append the section content to
`output_path`. If the file does not yet exist, create it.

Then halt:

```
§N written to <output_path>. Choose:
1. yes — continue to next section
2. edit — describe what to change (I'll rewrite the section in place)
3. rewrite — discard this section and rewrite from the research findings
```

- On `1 (yes)`: advance to the next section (Step A).
- On `2 (edit)`: apply the user's edits to the section in the output file, re-halt
  at Step C.
- On `3 (rewrite)`: remove the section content from the output file, rewrite it
  using the research findings from Step B, append to file, re-halt at Step C.

### Step D — Validate gate

Run the validate supplement for the completed part (or end of document). Output
validation results as two lists:
- **PASS items**: one line each.
- **FAIL items**: one line each, with the specific failure described.

Then halt:

```
Validation complete. Choose:
1. yes — continue (or document complete if this is the final gate)
2. fix — I'll address the listed failures before continuing
```

- On `1 (yes)`: continue to the next part, or signal document complete if this
  is the final validate gate.
- On `2 (fix)`: address each FAIL item in the output file, re-run the validate
  supplement, output updated results, and re-halt at Step D.

---

## General rules

- The skill **never** proceeds past a halt without an explicit numbered selection.
- `edit` at any gate: the user provides corrections inline; apply them and re-halt
  at the **same** gate (not the previous or next one).
- `skip` is only available at the Plan gate (Step A). It is not available at B, C,
  or D.
- If the user gives a response that is not a valid option number, re-present the
  numbered menu for that gate without advancing.
