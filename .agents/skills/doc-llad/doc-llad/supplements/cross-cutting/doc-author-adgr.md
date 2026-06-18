# Supplement: doc-author — Gap Register and ADR (Annex-Backed)

**Loaded by:** orchestrator for all report types (architecture, interoperability, configuration, cross-cutting)  
**Applies to:** §4.4 Gap Register and ADR appendix (Appendix B or Appendix E) in every LLAD and MCR

The **LLAD Traceability Annex** (`workspace/llad-annex/`) is the single authoritative source for all platform-wide Gap IDs and Architecture Decision Records:

- `annex-gap-register.md` — full gap entries: Gap ID, System, Title, Description, Priority, Remediation, Owner, Resolution gate, Status, Evidence, Source document, ADR reference
- `annex-adr.md` — full ADR entries: ADR ID, System scope, Title, Status, Date, Context, Decision, Rationale, Consequences, Gap reference, Source document

**Individual LLADs and MCRs carry summary reference tables only** — not the full content. The annex is the home of record.

The annex is maintained by the orchestrator (Stage 0 — Annex Sync). doc-author does not write to the annex directly; it reads the gap and ADR IDs provided in the Writing Pack.

---

## 1. §4.4 Gap Register (per-LLAD and per-MCR)

### Gap classification (apply before populating §4.4)

Every gap must be classified before it is entered anywhere. Classification determines where it goes:

| Type | Definition | Where it belongs | Annex status |
|------|-----------|-----------------|--------------|
| **Type 1 — Design decision outstanding** | The architect must still make an architectural choice. No design has been committed. | §4.4 in the LLAD (or MCR) | `Open` |
| **Type 2 — Build/evidence task (design-complete)** | The design is decided and documented in the LLAD, but provisioning, IaC authoring, drill execution, or evidence capture remains. | §6.5 CRD/AB-XC Configuration Record Backlog — **never §4.4** | `Deferred (CRD/AB-XC)` |
| **Type 3 — Resolved** | The design choice was made and incorporated into the current document version. | Annex only; no §4.4 row | `Resolved` or `Deferred` |

**§4.4 must contain only Type 1 gaps.** If a row description says "specified in §5", "design-complete", "defined in §5", or "not provisioned", it is a Type 2 item — move it to §6.5.

### Assembly instruction

Open §4.4 with:

> "Design gaps identified during the fit-gap assessment are recorded in full in the LLAD Traceability Annex (`workspace/llad-annex/annex-gap-register.md`). The table below summarises gaps relevant to this document."

Then render a summary reference table — **one row per gap whose System field matches the current document's system scope**:

```markdown
| Gap ID | Title | Priority | Status |
|--------|-------|----------|--------|
| SYS-G-001 | [gap title] | Critical | Open |
| SYS-G-002 | [gap title] | Critical | Open |
```

**Columns:**
- **Gap ID** — from the annex `Gap ID` column (format: `{SYS}-G-{NNN}`)
- **Title** — from the annex `Title` column (≤ 10 words)
- **Priority** — from the annex `Priority` column
- **Status** — from the annex `Status` column (`Open` / `Resolved` / `Deferred`)

**Do NOT reproduce** Remediation, Owner, Resolution gate, or Evidence columns — those live in the annex only.

**Gap ID format (LLAD vs previous convention):**

The annex uses `{SYS}-G-{NNN}` prefixed IDs (e.g. `SPA-G-001`, `API-G-001`). When referencing gaps in prose within the LLAD body (§3, §4 sub-sections), use the prefixed form. Prose references in existing LLAD drafts that use the short form (e.g. `G-01`) are acceptable as legacy; new entries use the prefixed form.

### MCR extension (§4.4 in Configuration Reports)

The MCR §4.4 extends the LLAD summary table with two additional columns:

```markdown
| Gap ID | Title | Priority | Status | Evidence |
|--------|-------|----------|--------|----------|
| SYS-G-001 | [gap title] | Critical | Resolved | PR #NN merged; implementation complete |
| SYS-G-005 | [gap title] | Medium | Remains open | Deferred to domain implementation gates |
```

**Status values in MCR:** `Resolved` / `Remains open` / `New gap`  
**Evidence:** For `Resolved` — artefact reference (PR, commit, test). For `Remains open` — brief reason. For `New gap` — discovery context.

When a new gap is found at implementation time: the orchestrator Stage 0b appends it to the annex first; then reference it here with `New gap` status.

---

## 2. ADR appendix (per-LLAD and per-MCR)

### Placement

- **Architecture type LLAD:** Appendix E — Architecture Decision Records
- **Interoperability type LLAD:** Appendix B — Architecture Decision Records
- **MCR:** Appendix B — Architecture Decision Records (or Appendix E if no API Catalog present)

### Assembly instruction

Open the appendix with:

> "Architecture decisions governing this system are recorded in full in the LLAD Traceability Annex. The following decisions are relevant to this document."

Then render a summary reference table — **one row per ADR whose System scope matches the current document's system**:

```markdown
| ID | Title | Status | Decision summary |
|----|-------|--------|-----------------|
| ADR-SYS-001 | [Title] | Accepted | [One sentence stating what was decided.] |
| ADR-SYS-002 | [Title] | Accepted | [One sentence stating what was decided.] |
```

**Columns:**
- **ID** — from the annex `ADR ID` column
- **Title** — from the annex `Title` column
- **Status** — from the annex `Status` column
- **Decision summary** — one sentence derived from the annex `Decision` column. Do not reproduce Context, Rationale, or Consequences here.

Cross-cutting ADRs (`ADR-XC-*`) that affect the current system are included in the per-LLAD summary table.

---

## 3. §1.3.2 registration

Every LLAD and MCR §1.3.2 Platform Architecture Document Set table must include a GAP-ANNEX row that covers both the gap register and the ADR register:

| ID | Document | System / Scope | Type | Status |
|----|----------|----------------|------|--------|
| GAP-ANNEX | LLAD Traceability Annex (Gap Register + ADR Register) | Cross-cutting | Traceability and Decision Register | Living document |

The annex consists of markdown source files in `workspace/llad-annex/`. It does not have its own document version — it is updated in place and the source files are version-controlled in the project repository.

---

## 4. Maintenance rules (for doc-author awareness)

1. **Annex-first.** New gaps and ADRs are written to the annex by the orchestrator (Stage 0b) — not by doc-author. doc-author reads Gap IDs and ADR IDs from the Writing Pack and renders them in the per-document summary tables.
2. **Never reproduce full content.** The full gap row (8+ columns) and full ADR entry (6 fields) exist in the annex only. Per-document tables are always summaries.
3. **Resolution in annex.** When a gap is resolved at implementation (MCR run), the orchestrator Stage 0c updates the annex `Status` and `Evidence` columns. The MCR §4.4 table reflects the updated status.
4. **Permanent IDs.** Gap IDs and ADR IDs are never reassigned, renumbered, or deleted.
