# Supplement: doc-research — architecture type

**Loaded by:** orchestrator when `report_type: architecture`  
**Overrides:** doc-research §4.3 (Section 3 fields) and §4.6 (Section 5 per-feature fields)  
**Slot files produced:** `s3-architecture.md`, `s5/{stage}/{slug}.md`

This supplement defines the research protocol for document §3 ([System] Architecture) and §5 (Feature Modules) in an architecture-type LLAD. §1, §2, and §4 research follows the primary doc-research file unchanged.

---

## §3 — [System] Architecture research (`s3-architecture.md`)

The slot file name is `s3-architecture.md`. Produce one slot file containing all sub-slots below.

### §3.1 Design Principles

- Extract from platform priming/architecture documents and HLAD §4.
- Each principle: `id` (AP-01 format), `statement`, `rationale`, `implication`, `baseline_ref` (HLAD section or RSR NFR identifier).
- Minimum 5 principles. Fewer = gap — do not fabricate.

### §3.2 Component and Structural Architecture

- Execute Q-CG-1 (graph query for all nodes in the repo's primary source tree).
- Execute Q-FS-2 (filesystem search for component, page, hook, service, and adapter directories under `src/`).
- Map the directory structure to logical tiers: entry points, page containers, feature modules, shared services, adapters/integrations.
- Record `folder_structure_summary`: one row per top-level `src/` directory — `directory | role | key_contents`.
- Record `component_tier_summary`: classify component types present (page, container, hook, service, adapter).

### §3.3 Data Architecture

- Identify all data stores the system reads from or writes to: confirm from `.env.example`, integration docs, and HLAD §5.5.
- For each store: `store_name | owner | what_system_owns | what_system_may_not_do`.
- Record `local_state_description`: describe client-side state management approach (cache library, context, store) in 2–4 formal sentences.
- If two or more distinct stores are identified, `data_ownership_table` is REQUIRED — absence is a gap.

### §3.4 Behaviour and Dynamic View

- Identify the primary session and routing model from route config files.
- Record `auth_guard_model`: how authenticated vs unauthenticated routes are separated.
- Record `routing_strategy`: routing library and approach (client-side, hash, file-based, etc.).
- Extract at least 2 sequence or state-transition flows at the platform level (not feature level) — these cover shell initialisation, auth handshake, and session expiry.

### §3.5 Integration and Interoperability

- Confirm all upstream API contracts from `.env.example` and `src/config/endpoints.ts` (or equivalent).
- Record each integration point: `service | env_var | protocol | direction | auth_mechanism`.
- Note the server-side vs client-side credential model for each integration.

### §3.6 Security and Access Architecture

- Confirm the identity provider from HLAD §5.3 and from the auth library config.
- Record `auth_library`, `auth_flow` (PKCE, implicit, etc.), `token_storage_mechanism`.
- Confirm authorisation library (e.g. CASL, OPA, role-guard middleware) from package.json and usage in source.
- Record RBAC model: `role | permissions | enforcement_point`.

### §3.7 Deployment and Environment Strategy

- Confirm from `package.json` scripts, CI/CD workflow files, and deployment docs.
- Record: dev runtime, staging hosting, production hosting, environment variable injection mechanism.
- Note serverless vs long-running distinction if applicable.

### §3.8 DevOps and CI/CD

- Extract pipeline stages from CI/CD workflow files (pipeline YAML, GitHub Actions, etc.).
- Record: `stage | trigger | action | gate`.
- Confirm test stages and deployment approval gates.

### §3.9 Performance, Observability, and Quality Constraints

- Extract NFRs from RSR that apply at platform level (not feature level): performance budgets, accessibility standard, i18n scope.
- Confirm observability tooling from HLAD §5 or deployment docs.
- Record `nfr_id | constraint | threshold | mechanism`.

### §3.10 Test Strategy

- Confirm test framework from `package.json` devDependencies.
- Record: unit test framework + version, component test framework, e2e framework, test runner.
- Extract test coverage targets from CI config if present.

---

## §5 — Feature Modules research (`s5/{stage}/{slug}.md`)

**Unit kind:** `feature_module`

Slot file path: `s5/{stage}/{slug}.md` — one file per feature.

Discovery order:
1. Enumerate stages and features from `docs/feature-delivery/` SPEC files or task ledger.
2. For each feature, execute all six lens research steps below in order.
3. A feature slot is not closed until all six lenses have at least their REQUIRED fields populated.

**Lens 1 — Feature Specifications:**
- Read `SPEC.md` at the cited path (Q-FS-1).
- `feature_purpose`: 20–80 words formal prose describing business purpose. Derive from SPEC §3.
- `fr_ids`, `fr_text`: Extract SPEC §8 table verbatim (WP-2). Every row without modification.
- `nfr_ids`, `nfr_text`: Extract SPEC §9 verbatim if present.
- `acceptance_criteria_text`: Extract SPEC §9 acceptance criteria verbatim, or criteria column of §8 if §9 absent.
- `out_of_scope_notes`: Extract SPEC §5 out-of-scope items verbatim if present.
- `user_journeys`: Extract SPEC §6 or §7 journey descriptions if present.

**Lens 2 — Component Architecture:**
- Execute Q-CG-1 (graph query for nodes in feature path).
- Execute Q-FS-2 (filesystem search for `.tsx`, `use*.ts`, `*Api.ts`, `*Service.ts` under feature directory).
- Classify: `.tsx` → `ui_components` (page or container); `use*.ts` → hook; `*Api.ts`/`*Service.ts` → shared_module.
- Execute Q-API-1 to find API routes registered for this feature.
- Record `component_ref_query` with the exact query strings used.
- Confirm every listed file exists on disk (WP-3).

**Lens 3 — Data Architecture:**
- Execute Q-FS-4 to find CRM entity references in feature source files.
- If entities found: extract field list from data platform schema or solution XML.
- `local_state_description`: 2–4 formal sentences describing client-side cache keys, context shape, local storage use.
- Identify external data sources from SPEC §10 or integration docs.

**Lens 4 — Behaviour:**
- Extract SPEC §7.1 (Primary Flow) steps. Rewrite each to begin with actor name using a complete sentence → `happy_path_steps`.
- Extract SPEC §7.2 (Alternate Flows) → `alt_flows`.
- Extract SPEC §7.3 (Edge Cases / Error Scenarios) → `error_flows`. Minimum 1 error scenario; if absent in SPEC, derive most likely error from auth/network/data interaction and mark `(derived)`.

**Lens 5 — Integration and Interoperability:**
- Execute Q-CG-2 to find upstream consumers. `upstream_consumers` may be empty; field must be present.
- Execute Q-FS-5 to find contract files. Each `downstream_dependencies` entry requires a `contract_ref` citation.
- Execute Q-API-1 to identify downstream API dependencies.

**Lens 6 — Security and Access:**
- Read SPEC §12 (security considerations) if present.
- Determine `auth_requirement` from route guard configuration (Q-FS-6) and SPEC narrative.
- Extract `required_roles` from authorisation library config (ability definitions, role-guard config, policy files).
- Identify `pii_classes` from SPEC data description and CRM entity fields. If none, record `["none"]`.
- Read security baseline for `control_refs`.
