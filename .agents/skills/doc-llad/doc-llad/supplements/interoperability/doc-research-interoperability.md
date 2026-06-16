# Supplement: doc-research — interoperability type

**Loaded by:** orchestrator when `report_type: interoperability`  
**Overrides:** doc-research §4.3 (Section 3 fields) and §4.6 (Section 5 per-domain fields)  
**Slot files produced:** `s3-api-architecture.md`, `s5/{domain-slug}.md`

This supplement defines the research protocol for document §3 (API Architecture) and §5 (Route Domain Architecture). §1, §2, and §4 research follows the primary doc-research file unchanged.

---

## §3 — API Architecture research (`s3-api-architecture.md`)

### §3.1 Design Principles

- Extract API design principles from HLAD §4 and any API standards or versioning policy docs in the repo.
- Each principle: `id` (AP-01 format), `statement`, `rationale`, `implication`, `baseline_ref`.
- Include: API-first contract rule, versioning strategy, error response standard, correlation ID contract, idempotency expectations.
- Minimum 5 principles. Fewer = gap.

### §3.2 API Surface Overview

**Domain derivation — mandatory order (do NOT skip to route files first):**

1. Read the feature backlog document. Identify every feature assigned to this repo (check `repo` or `system` column, or feature tags).
2. Group the assigned features by RSR requirement cluster (read the RSR or requirements context for the cluster structure). Each cluster or coherent group of clusters becomes one logical domain.
3. Verify route evidence: for each domain, confirm that route files or route handler code exists in the repo that serves that feature group. Record the primary route prefix.
4. If route files exist in the repo that are NOT covered by any feature-backlog entry: record them as Programme Services or unscoped routes — do NOT create a domain for them. Flag as a gap: "Route group `{prefix}` exists in codebase but has no feature-backlog entry assigned to this repo. Product-owner scoping decision required."

The domain list must come from steps 1–2 (design intent), verified by step 3 (code evidence). It must NOT be derived by reading route files first and inductively grouping them — that produces an as-built view, not a design-intent LLAD.

- Record `route_domain_map`: a table of logical domains — `domain_name | route_prefix | upstream_dependency | estimated_route_count`.
- This is the high-level index only — per-domain detail goes in §5 slot files.

### §3.3 Data Architecture (Upstream Store Ownership)

- Confirm all data stores the API reads from or writes to: CRM entities, blob containers, database schemas, external services.
- Record `upstream_store_table`: `store | type | access_mode (read/write/read-write) | owned_entities_or_containers`.
- Record the server-side credential model for each store (environment variables, managed identity, etc.).

### §3.4 Middleware Architecture

- Enumerate all middleware registered in the Express app (or equivalent) from entry point file and router setup.
- Record `middleware_stack`: `order | middleware | purpose | applies_to (global/route-group/route)`.
- Confirm: auth token validation middleware, CORS config, rate limiting, request logging, correlation ID injection, error handler.

### §3.5 Integration Boundary

- Define what the API owns: request validation, auth enforcement, upstream orchestration, response shaping.
- Define what it delegates: identity token issuance, data storage, business rules in CRM.
- Record `boundary_table`: `concern | owned_by | mechanism`.
- Confirm that no data store credentials are exposed to API consumers (confirm from env var usage — no credentials in responses).

### §3.6 Security Architecture

- Confirm token validation mechanism: library, token type (JWT), validation steps (signature, audience, issuer, expiry).
- Record RBAC enforcement: where authZ checks happen, what roles are recognised, how roles are extracted from token claims.
- Confirm secrets management: all credentials loaded from environment variables; no hardcoded secrets (scan for literals in source).
- Record `security_control_table`: `control | mechanism | enforcement_point | baseline_ref`.

### §3.7 Deployment and Environment Strategy

- Confirm from `package.json` scripts, deployment docs, and HLAD §6.
- Record: Node long-running mode (container/k8s), serverless mode if applicable, environment variable injection.
- Record `environment_table`: `environment | runtime | hosting | deployment_trigger`.

### §3.8 DevOps and CI/CD

- Extract pipeline stages from CI/CD workflow files.
- Record `pipeline_stage_table`: `stage | trigger | action | gate`.

### §3.9 Performance and Observability

- Extract API-level performance constraints from RSR NFRs.
- Confirm observability: request logging format, correlation ID propagation, error monitoring.
- Record `nfr_table`: `nfr_id | constraint | threshold | mechanism`.

### §3.10 Test Strategy

- Confirm test framework from `package.json` devDependencies.
- Record: unit test framework + version, integration/supertest coverage, contract test approach.
- Note: does a Postman collection or OpenAPI spec exist? Record path or gap.

---

## §5 — Route Domain Architecture research (`s5/{domain-slug}.md`)

**Unit kind:** `route_domain`

Slot file path: `s5/{domain-slug}.md` — one file per logical route domain.

Domain identification: use the domain list derived in §3.2 (feature-backlog → RSR cluster grouping → route evidence). Each domain from the `route_domain_map` becomes one slot file. Do NOT create slot files for unscoped route groups flagged as gaps in §3.2.

For each domain, research the following six areas:

**Area 1 — Domain Scope:**
- Define what this domain is responsible for (the business capability it serves).
- List routes explicitly in scope for this domain.
- List any routes or sub-resources explicitly out of scope (handled by another domain or system).

**Area 2 — Route Inventory:**
- For each route in this domain: `method | path | auth_required (yes/no) | description`.
- Auth column: reference the specific token claim or role required, not just "yes".
- Do NOT include request/response schemas here — those belong in the OpenAPI spec.
- If no OpenAPI spec exists, record as open item: "OpenAPI spec for {domain} domain — required before implementation gate."

**Area 3 — Middleware and Enforcement:**
- Identify which global middleware applies to all routes in this domain.
- Identify any domain-specific middleware applied to the route group (additional auth checks, rate limits, etc.).
- Record `middleware_table`: `middleware | scope (global/domain) | purpose`.

**Area 4 — Upstream Integration:**
- For each route in this domain, confirm the upstream service or data store it reads from or writes to.
- Record `upstream_table`: `route_method_path | upstream_service | entity_or_container | access_mode`.
- Source: route handler files, service layer files, SDK call sites.

**Area 5 — Security:**
- Confirm auth requirement per route (public / bearer token required / specific role required).
- Identify where the authZ check occurs for protected routes (middleware vs handler vs service).
- Note any routes with elevated sensitivity (PII, financial data, document upload).
- Record `security_table`: `route_method_path | auth_requirement | authz_check_location | sensitivity`.

**Area 6 — Architectural Decisions:**
- Record any domain-specific design decisions: why certain routes are grouped this way, versioning decisions, pagination model, caching strategy.
- Record open items: unresolved contract dependencies, missing OpenAPI spec, routes with no handler yet.
- `contract_reference`: path to OpenAPI spec or Postman collection for this domain, or "Open item — not yet published".
