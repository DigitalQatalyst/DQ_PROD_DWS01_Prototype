---
shared-source: shared/diagrams/platform-context.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# DQ Digital Business Platform — Diagram Context & Guardrails

Read this file before generating any architecture diagram in a DQ platform session. It establishes the platform's canonical structure, technology components, naming conventions, and architectural constraints that all diagrams must respect.

For deep detail on any section, read the relevant priming document from `ai-agent-rules/priming/` (see §6).

---

## 1. Platform Structure

### 1.1 Hierarchy

| Level | Type | Description |
|---|---|---|
| **PoP** | Platform of Platforms | Top-level meta-platform; governs all others |
| **PoS** | Platform of Solutions | A unified platform housing multiple solutions |
| **SoA** | Solution of Applications | A specific solution within a platform (e.g. workspace, sector, scope, services) |
| **AoF** | Application of Features | An individual application within a solution |

### 1.2 Platform Foundation

Platform Foundation sits above the five stages. It is shared infrastructure — not a stage, not a feature. All stages and solutions depend on it.

Foundation scope: global navigation and layout, design system and component library, IAM (authentication and authorisation), database architecture, API gateway and service orchestration, observability and logging, CI/CD pipelines, notifications and communication services, file storage and media delivery, unified analytics infrastructure.

### 1.3 Five Stages

| Stage | Name | Scope |
|---|---|---|
| 0 | Landing & Visitor Onboarding | Public entry point; anonymous visitors; discovery |
| 1 | Marketplace & Discovery | Catalogue, listings, search, visitor-to-lead conversion |
| 2 | Application & Account Experience | Signed-in workspace; requests, forms, documents, payments |
| 3 | Fulfilment & Operations | Workflow execution, task queues, approvals, orders, invoices |
| 4 | Specialised Verticals | One schema per vertical (e.g. licensing, lending, regulatory) |

---

## 2. Three Technology Layers

Use the canonical layer names exactly as shown in the table below. Do not rename, abbreviate, or substitute.

| # | Canonical label | Technologies | Role |
|---|---|---|---|
| 1 | **Client Tier** | React (web), Next.js (SSR / static generation), React Native (mobile); Tailwind CSS / shadcn/ui / Material UI; design system components | User-facing digital experience. Renders UI and makes API calls only. No business logic in the client. |
| 2 | **Data & Intelligence Layer** | PostgreSQL (system of record), Supabase / PostgREST / Hasura (Data API), Redis (cache and session state), analytics infrastructure | Data backbone and intelligence services. RLS and database roles are enforced at this boundary. System of record for all platform state. |
| 3 | **Application & Integration Layer** | Express.js / BFF APIs (layered: Routes → Controllers → Services → Repositories), domain services, background jobs, external API integrations, event streams | Operational foundation. Business logic, orchestration, validation, and access control live here. All cross-tier boundaries are API contracts. |

---

## 3. Database Schema Map

| PostgreSQL schema | Platform layer | Scope |
|---|---|---|
| `platform` | Foundation | IAM, audit, notifications, files, configuration — shared by all stages |
| `s1_discovery` | Stages 0–1 | Public content, marketplace listings, visitor leads, enquiries |
| `s2_account` | Stage 2 | Signed-in workspace: requests, forms, documents, payments |
| `s3_ops` | Stage 3 | Workflow execution, task queues, approvals, quoting, orders, invoices |
| `s4_{vertical}` | Stage 4 | One schema per vertical; e.g. `s4_licensing`, `s4_lending`, `s4_regulatory` |

**Dependency direction is strictly one-way:** `s4_*` → `s3_ops` → `s2_account` → `s1_discovery` → `platform`. Foreign keys never point in the reverse direction.

---

## 4. Architectural Guardrails

These are platform-wide constraints. If a requested diagram would require violating one, annotate the diagram with `[!] Guardrail conflict:` and confirm the exception with the user before finalising.

| # | Guardrail |
|---|---|
| G-01 | **No business logic in the Client Tier.** Clients render UI and call APIs. Controllers, services, and repositories are exclusively in the Application & Integration Layer. |
| G-02 | **All cross-tier boundaries are explicit API contracts.** REST, GraphQL, or event-based. No client makes direct database calls. No service bypasses the defined interface to reach another service's internals. |
| G-03 | **RLS and database roles are enforced at the Data & Intelligence Layer boundary.** Authentication is not the application tier's only security mechanism; the data layer must enforce row-level access independently. |
| G-04 | **Schema dependency direction is one-way.** `s4_*` → `s3_ops` → `s2_account` → `s1_discovery` → `platform`. A Stage 3 entity may reference a Stage 2 row; the reverse never happens. |
| G-05 | **Session state lives in Redis, not in application instance memory.** Application instances are stateless and horizontally scalable. |
| G-06 | **Platform Foundation is shared, never reimplemented.** IAM, audit, notifications, and file storage are Foundation services. Stages and solutions consume them; they do not build their own. |
| G-07 | **API-first.** Every component boundary is an explicit contract. Internal in-process coupling that bypasses a defined interface requires a design justification. |

---

## 5. Element Naming for Diagrams

| Element | Use in diagrams |
|---|---|
| Platform tiers | Exact canonical names: `Client Tier`, `Data & Intelligence Layer`, `Application & Integration Layer` |
| Platform hierarchy nodes | `PoP`, `PoS`, `SoA`, `AoF` with the formal name of the instance |
| PostgreSQL schemas | Label with schema name: `platform`, `s1_discovery`, `s2_account`, `s3_ops`, `s4_{vertical}` |
| Data API access | Label as `Data API (PostgREST)` or `Supabase Data API` — not as raw `PostgreSQL` when access is mediated |
| Application services | `Express API`, `BFF API`, or the service's own name if the user supplies it |
| Web clients | `React` or `Next.js` |
| Mobile clients | `React Native` |
| Cache / session | `Redis` |
| Avoid | Cloud-provider-specific names (AKS, Azure, AWS, GCP, Vercel, etc.) unless the user explicitly provides them in Step 0 inputs |

---

## 6. Applying This Context When Generating

1. **Platform context is the baseline.** User-provided Step 0 inputs extend and specialise it — they do not replace it.
2. **If the user's scope maps to a known stage:** apply the corresponding schema names and tier boundaries for that stage.
3. **If any element would violate a guardrail (§4):** insert `[!] Guardrail conflict: G-XX — [description]` as a diagram annotation, explain the conflict in a fenced note below the diagram source, and ask the user to confirm the exception before writing the final output.
4. **Do not invent component names, technology choices, or integration patterns** beyond what §2–§5 and Step 0 inputs support.
5. **For deeper detail**, read the relevant priming document from `ai-agent-rules/priming/`:
   - `priming-target-architecture.md` — architectural goals, full three-tier model, cross-cutting patterns
   - `priming-dbp-platfrom-design.md` — platform hierarchy (PoP/PoS/SoA/AoF) and stage model
   - `priming-accepted-tech-stack.md` — technology choices per tier, design system standards
   - `priming-database-architecture.md` — data model, schema structure, base entity conventions, naming rules
   - `priming-nonfunctional-specs.md` — NFRs: performance targets, scalability model, availability, security
   - `priming-development-rules.md` — development model, API-first, plan-first discipline
