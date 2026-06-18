# Supplement: doc-research — cross-cutting type

**Loaded by:** orchestrator when `report_type: cross-cutting`
**Overrides:** doc-research section 4.3 (Section 3 fields) and section 4.6 (Section 5 per-domain fields)
**Slot files produced:** `s3-concern-overview.md`, `s5/{concern-slug}.md`

Cross-cutting LLADs govern concerns that span all platform systems. There is no single repo owner. Research must draw from all in-scope repos and systems named in the platform document map.

---

## Section 3 — Concern Architecture Overview research

### Section 3.1 Concern Mandate

- State in 3-5 formal sentences why this concern exists as a cross-cutting document.
- Define what the platform risk or gap would be without this document.
- Source: HLAD section 3 or section 4 (architecture risks, cross-cutting obligations), RSR NFRs, and the platform document map gap register.
- Record `mandate_statement` (2-4 sentences, formal prose).
- Record `risk_without` (1-2 sentences): what breaks if this concern is not governed.

### Section 3.2 Governing Boundaries

- Define which repos and systems this concern governs.
- Record `in_scope_systems`: every repo and service in the platform document map that this concern applies to.
- Record `out_of_scope_systems`: anything explicitly excluded and the reason.
- Record `authority_statement` (1-2 sentences): what this document has authority over (e.g. "This document is the authoritative source for all authentication and authorisation decisions across the platform").

### Section 3.3 Relationship to Other Cross-Cutting Documents

- Identify dependencies between this document and other cross-cutting documents.
- Record `dependencies_table`: `this_document | depends_on | what_it_needs | why`.
- Record `consumed_by_table`: `document | what_it_takes_from_this_doc`.
- Source: platform-document-map cross-cutting docs list.

### Section 3.4 Design Principles

- Extract principles specific to this concern from HLAD section 4 and RSR NFRs.
- Each principle: `id` (AP-01 format), `statement`, `rationale`, `implication`, `baseline_ref`.
- Minimum 3 principles. Fewer = gap.

---

## Section 5 — Concern Domains research

**Unit kind:** `concern_domain`

Slot file path: `s5/{concern-slug}.md` — one file per concern domain.

The domain list for each document is defined in the registry. Use the domain list from the registry entry for the specific cross-cutting document being produced.

**Domain lists by document type:**

[Provide the equivalent list for your project here.]

For each domain, research the following five areas:

**Area 1 — Domain Scope:**
- Define what this concern domain governs — the specific aspect of the cross-cutting concern it addresses.
- Define what it does not govern (and what governs those aspects instead).
- Source: HLAD sections 3/4, platform-document-map, related documents.

**Area 2 — Design:**
- This is the substantive content of the domain — the specification, rules, or constraints.
- Research from all relevant repos and system sources. Cross-cutting means multi-repo.
- For IAM/identity domains: confirm from auth library config, identity provider config, authorisation library, token validation middleware.
- For data domains: confirm from schema files, entity definitions, store reference config.
- For integration/interoperability domains: confirm from API route files, error handler middleware, retry logic, correlation ID header injection.
- For security domains: confirm from security configs, secret storage mechanisms.
- For deployment domains: confirm from cluster manifests, CI/CD pipeline files, deployment docs.
- Record `design_content`: a structured summary of confirmed facts — not design intent.

**Area 3 — Per-System Application:**
- For each in-scope repo/system: how does this concern domain apply?
- Record `per_system_table`: `system | how_concern_applies | key_artefact | conformance_status`.
- **Conformance status values (pre-implementation specification):** `Specification conformant — [gate condition]` / `Gap — design decision outstanding (Gap-ID)` / `Not applicable` / `Deferred (CRD/AB-XC)`.
- **Never record:** "Partial", "not yet deployed", "not yet live", "not implemented", "not configured", "not in place", "Gap — not", "currently not". Cross-cutting LLADs are pre-implementation specifications — conformance status must describe what the design requires, not what has or has not been provisioned.

**Area 4 — Constraints and Obligations:**
- Hard rules that cannot be deviated from (compliance, security mandates, contractual obligations).
- Record `constraints_table`: `constraint | source | applies_to | consequence_of_breach`.
- Sources: relevant data protection legislation, platform security policy, HLAD section 5.3, RSR compliance NFRs.

**Area 5 — Open Items:**
- Unresolved decisions, missing artefacts, gaps discovered during research.
- Record `open_items_table`: `id (OI-nn) | description | owner | resolution_gate`.
- **Gap classification (mandatory — apply before recording):**
  - **Type 1 — Design decision outstanding:** The architect must still make an architectural choice. Record in section 4.4 and the annex with status `Open`. These are the only valid section 4.4 entries.
  - **Type 2 — Build/evidence task (design-complete):** The design is decided and documented, but provisioning, IaC authoring, drill execution, or evidence capture remains. These belong in section 6.5 CRD/AB-XC. Record in the annex with status `Deferred (CRD/AB-XC)`. Do not surface in section 4.4.
  - **Type 3 — Resolved during authoring:** The design choice was made and incorporated in this document. Record in the annex with status `Resolved` or `Deferred`.
