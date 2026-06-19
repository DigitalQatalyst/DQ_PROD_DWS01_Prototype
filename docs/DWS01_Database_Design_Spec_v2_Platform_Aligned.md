# DWS.01 Database Design — v2 (Platform‑Aligned, Hosted Supabase)

**Status:** Draft for review
**Date:** 2026-06-18
**Author:** Sharavi (with Claude Code)
**Supersedes:** `DWS01_Database_Design_Spec.md` + `DWS01_Database_Design_Spec_Ecommerce_Variation.md`
**Conforms to:** `ai-agent-rules/priming/priming-database-architecture.md`, `…/priming-dbp-platfrom-design.md`, `ai-agent-rules/databases/relational/schema-design.md`
**Driver:** `DWS01_Database_Design_Conformance_Review.md`
**Runtime:** **hosted Supabase PostgreSQL** (managed Postgres + PostgREST Data API + Storage + Auth available; identity provided by Microsoft Entra via the BFF)

---

## 1. What v2 is

v2 re‑bases the DWS.01 data model onto the **canonical stage‑schema platform model** and onto the realities of **hosted Supabase**. The two earlier specs modelled services bottom‑up with table‑name prefixes and a bespoke request/fulfilment lifecycle; v2 instead:

- places tables in **domain‑named PostgreSQL schemas** mapped to the platform stages (`platform` / `discovery` / `workspace` / `operations`; see §3.1),
- carries the **mandatory base fields** (`id`, `tenant_id`, `created_at`, `updated_at`, `created_by`) and **tenant‑scoped RLS**,
- models a service as a **`discovery.listings` row** + a service detail extension (the multi‑marketplace, config‑driven Stage‑1 pattern),
- anchors every request to **`workspace.requests`** (the universal anchor — no parallel order table),
- runs fulfilment through **`operations`** (workflows, queues, approvals, orders),
- and specifies how all of this works on **hosted Supabase with an Entra‑BFF identity model**.

The e‑commerce *experience* (browse/filter/feature/cart/checkout) is preserved — it is rendered over `listings`/`listing_attributes`, and checkout writes `requests`.

---

## 2. Hosted Supabase — runtime decisions

These are the Supabase‑specific choices that shape the DDL.

### 2.1 Identity & RLS — Entra‑BFF on Supabase (the crux)

Hosted Supabase RLS evaluates Postgres role + JWT claims (`auth.uid()`, `auth.jwt()`), which assume **Supabase Auth**. DWS uses **Entra via the BFF** (`server/`), so we bridge it. Two patterns; we adopt **B now**, keep **A open**.

- **Pattern B — BFF mediates, sets request context (adopted now).** All DB access goes through the BFF using a privileged connection. Per request, after the BFF resolves the Entra session → platform user, it sets transaction‑local context:
  ```sql
  select set_config('app.tenant_id',  :tenant_uuid, true);
  select set_config('app.user_id',    :user_uuid,   true);
  select set_config('app.dws_roles',  :roles_csv,   true);
  ```
  RLS policies read these via helper functions (§4.3). This matches today's prototype (BFF holds the connection; no Supabase Auth) and needs **no Supabase‑Auth coupling**.
- **Pattern A — BFF mints a Supabase‑compatible JWT (future).** When the frontend talks to the **PostgREST Data API directly**, the BFF signs a JWT with the project JWT secret carrying `sub`, `tenant_id`, `dws_roles`. RLS reads `auth.jwt() ->> 'tenant_id'`. Adopt when/if we expose the Data API to the browser.

Helper functions (§4.3) read from **either** source, so policies don't change when we move from B → A.

### 2.2 Schema exposure & grants

- Stage schemas (`platform`, `discovery`, `workspace`, `operations`) are **custom schemas**. Under Pattern B (BFF‑only) they need **not** be exposed to PostgREST — the BFF uses a direct connection. If/when Pattern A is enabled, add them to the project's **Exposed Schemas** (`PGRST_DB_SCHEMAS`) and grant `usage`/`select`/… to `authenticated`.
- `service_role` (BFF) is granted on all schemas; `anon` gets nothing on app schemas. RLS is still **enabled** on every table (service_role bypasses RLS — so the BFF must scope queries by tenant explicitly *and* we keep RLS as defense‑in‑depth for Pattern A).

### 2.3 Extensions

```sql
create extension if not exists pgcrypto;     -- gen_random_uuid() (already used by the prototype)
create extension if not exists moddatetime;  -- standard updated_at trigger (Supabase-provided)
create extension if not exists pg_trgm;      -- trigram search for catalogue/listings filtering
```

### 2.4 Files → Supabase Storage

`platform.files.storage_path` points at a **Supabase Storage** object (`bucket/key`); the row is the registry, the bytes live in Storage. Listing media and request documents reference `platform.files` by FK (never store bytes in Postgres).

### 2.5 Migrations → Supabase CLI

Versioned migrations as `supabase/migrations/NNNN_description.sql` (idempotent up scripts; a paired down script kept in `supabase/migrations/down/`). Local dev via `supabase db reset`; CI runs migrations before integration tests. The existing `server/src/db/schema.sql` becomes migration `0001` and is refactored into `platform.*` (§5.5).

### 2.6 Realtime (optional)

Supabase Realtime can publish `workspace.requests` / `operations.task_assignments` changes to power live queue/timeline UIs. Enable per‑table via the `supabase_realtime` publication when those surfaces are built; not required for the schema.

---

## 3. Conventions (canonical)

| Rule | v2 |
|---|---|
| Namespacing | domain‑named PG schemas mapped to stages (§3.1); **FKs flow downward only** (`operations`→`workspace`→`discovery`→`platform`) |
| Base fields (every tenant‑scoped table) | `id uuid pk default gen_random_uuid()`, `tenant_id uuid not null → platform.tenants`, `created_at timestamptz default now()`, `updated_at timestamptz` (**trigger**), `created_by uuid → platform.users` |
| `updated_at` | set by `moddatetime` trigger, never by app |
| Soft delete | `deleted_at timestamptz` (not `archived_at`) |
| Enum‑like values | **lowercase snake_case** (`'on_track'`, `'in_review'`); display labels live in UI/lookup |
| Tables | plural snake_case (`listings`, `service_details`) |
| FK columns | `{ref_table_singular}_id` |
| Indexes | `idx_{table}_{cols}`; all FK columns indexed explicitly |
| Constraints | `{table}_{cols}_unique`, `fk_{table}_{ref}` |
| Booleans | `is_/has_/can_` prefix |
| Lookup vs CHECK | CHECK for volatile flat value‑sets; lookup table where the value carries metadata |

### 3.1 Schema names — domain‑oriented (decision)

**Decision:** schemas are named by **domain / bounded context**, aligned to Postgres best practice — **not** stage‑numbered. The canonical primer's `s1_discovery` / `s2_account` / `s3_ops` are renamed:

| Platform stage | Canonical primer | This design | Domain |
|---|---|---|---|
| Foundation | `platform` | `platform` | identity, RBAC, audit, files, notifications, org chart |
| Stage 0–1 | `s1_discovery` | **`discovery`** | marketplaces, listings, categories, enquiries |
| Stage 2 | `s2_account` | **`workspace`** | the signed‑in working area: requests, forms, documents, conversations, payments |
| Stage 3 | `s3_ops` | **`operations`** | workflows, queues, approvals, orders |
| Stage 4 | `s4_{vertical}` | **(no special schema)** | a vertical is **just another workspace** (a feature group), not a privileged stage — see §4.6 |

> **Schema `workspace` vs the workspace *concept*.** The `workspace` **schema** holds the shared signed‑in primitives (requests etc.) used by *every* feature group. A **workspace** (a row in `platform.workspaces`, §4.6) is a *group of features* — Tasks, Finance, Sales, Services. The two share a word but are different things: the schema is where shared workspace data lives; the registry says which feature groups exist. A feature‑heavy workspace may additionally own its **own** domain‑named schema (e.g. `finance`) for bespoke tables — that is what "Stage 4" collapses into.

Rationale:
- **Domain names describe meaning, not a roadmap.** Stage/sequence prefixes (`s1_`, `s2_`) couple the schema name to delivery order — they age poorly when stages merge or a feature spans them, and numeric prefixes are exactly what naming guides warn against. (Original intent of `s1/s2` was stage traceability — that mapping is preserved in the table above, just not encoded in the name.)
- **Everything else the stage schemas gave us is retained:** one‑way FK dependency direction (`operations`→`workspace`→`discovery`→`platform`), schema‑scoped RLS, and unambiguous ownership.
- **Supabase‑safe:** avoids reserved schemas (`auth`, `storage`, `realtime`, `extensions`, `graphql`, `public`).

> **Propagate to the platform standard.** This diverges from `priming-database-architecture.md`. To keep the *whole platform* consistent (the reason stage schemas existed), the rename should be adopted in the canonical primer, not just DWS.01. Raised as §10.9 — needs platform‑owner sign‑off before other solutions follow.

### 3.2 RLS vs RBAC — what goes where (separation of concerns)

A deliberate boundary so authorization logic does **not** leak into row security:

| Concern | Mechanism | Why |
|---|---|---|
| **Tenant isolation** (`tenant_id`) | **RLS** | The one hard, invariant data boundary — must hold regardless of app code. Matches the platform standard (`tenant_id` is *the* RLS predicate). |
| **Workspace access** (which feature groups a user may use) | **RBAC** in the BFF/service layer | This is *entitlement*, not data isolation. It changes with roles. Pushing it into RLS means complex per‑table predicates + a membership check on every query, duplicating role logic. |
| **Company access** (which org's data a user may see) | **RBAC** in the BFF/service layer | Same — authorization, resolved from `user_roles` scope, applied as a query filter. |

**Consequences:**
- `workspace_id` and `company_id` are **columns** (for partitioning, the app's `WHERE` clauses, and reporting) — **not** RLS predicates by default.
- The BFF resolves a user's entitled workspaces/companies from `platform.user_roles` and composes the filter: `where tenant_id = :t and workspace_id = any(:entitled_ws) and (company_id is null or company_id = any(:entitled_co))`.
- RLS stays **minimal**: `using (tenant_id = app.current_tenant())`, plus genuinely data‑isolating row rules (e.g. "a user sees only their own notifications").
- Under **Pattern B** the BFF is `service_role` (bypasses RLS), so authorization *must* live in the service layer anyway. The helper functions `app.current_workspaces()` / `app.current_companies()` (§4.3) remain — but for **optional Pattern‑A defense‑in‑depth**, not as the primary gate.

> Net effect of your earlier instinct: `workspace_id` (and `company_id`) were over‑scoped into RLS in the first draft. v2 pulls them back to RBAC/query‑layer scoping and keeps RLS for tenant isolation + true row‑ownership rules only.

---

## 4. Foundation — `platform` schema

### 4.1 Reused canonical entities (do **not** reimplement)

Per the primer: `tenants`, `users`, `user_profiles`, `roles`, `permissions`, `role_permissions`, `user_roles` (RBAC, with `resource_id` + `expires_at`), `sessions`, `api_keys`, `audit_logs`, `notifications`, `files`, `feature_flags`, `platform_config`. DWS consumes these by FK. **All earlier `iam_*` / `app_audit_*` tables collapse into these.**

DWS role mapping into `platform.roles` (`scope='solution'`): `associate`, `lead`, `service_owner`, `governance_lead`, `leadership`, `platform_admin`, `support`. Unit/team scope → `user_roles.resource_id` referencing a department/team (§4.2).

### 4.2 Internal org chart (addition to `platform`)

**Tenancy (resolved §10.7):** DWS.01 is **single‑tenant** — one `platform.tenants` row. `tenant_id` is still carried on every table per the standard (constant value; trivial RLS predicate), so the model stays portable if multi‑tenant is ever needed. The **meaningful organisational boundary is the *company*** (resolved §10.1): one tenant contains **multiple companies**, each with its own departments/teams. `company_id` is therefore a real scoping dimension and a **secondary RLS predicate** wherever data is company‑private.

Org hierarchy: **tenant → company → department (unit) → team (squad) → user**. The canonical `workspace.organisations` = *external* applicant companies — distinct from this *internal* org chart, which is foundational (shared by RBAC, services, tasks, analytics) and so lives in `platform`.

```sql
create table if not exists platform.companies (          -- internal business entities under the single tenant
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references platform.tenants(id),
  name         text not null,
  slug         text not null,
  status       text not null default 'active' check (status in ('active','inactive')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references platform.users(id),
  deleted_at   timestamptz,
  constraint companies_tenant_slug_unique unique (tenant_id, slug)
);
create index if not exists idx_companies_tenant_id on platform.companies (tenant_id);

create table if not exists platform.departments (        -- DWS "units"
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references platform.tenants(id),
  company_id   uuid not null references platform.companies(id) on delete cascade,
  name         text not null,
  lead_user_id uuid references platform.users(id),
  health       text not null default 'on_track' check (health in ('on_track','watch','at_risk')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references platform.users(id),
  deleted_at   timestamptz,
  constraint departments_company_name_unique unique (company_id, name)
);

create table if not exists platform.teams (              -- DWS "squads"
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references platform.tenants(id),
  department_id uuid not null references platform.departments(id) on delete cascade,
  name          text not null,
  lead_user_id  uuid references platform.users(id),
  flow_health   text not null default 'on_track' check (flow_health in ('on_track','watch','at_risk')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references platform.users(id),
  deleted_at    timestamptz
);

-- User placement in the org chart. **A user CAN belong to multiple companies** (e.g. shared-
-- services staff, cross-company leadership): this is a membership table (not columns on users),
-- so each (user, company) home is one row. Exactly one row per user is the primary placement.
create table if not exists platform.user_org_placement (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references platform.tenants(id),
  user_id       uuid not null references platform.users(id) on delete cascade,
  company_id    uuid not null references platform.companies(id),
  department_id uuid references platform.departments(id),
  team_id       uuid references platform.teams(id),
  persona_id    text references platform.personas(id),
  is_primary    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references platform.users(id),
  constraint user_org_placement_user_company_unique unique (user_id, company_id)  -- one home per company
);
create index if not exists idx_user_org_placement_user on platform.user_org_placement (user_id);
create index if not exists idx_user_org_placement_company on platform.user_org_placement (company_id);
-- exactly one primary placement per user
create unique index if not exists uniq_user_primary_placement
  on platform.user_org_placement (user_id) where is_primary;

-- Personas are role-based entry points (Stage 0). Catalog table; maps to a default role + route.
create table if not exists platform.personas (
  id            text primary key,                          -- 'associate' | 'team_lead' | …
  name          text not null,
  tier          text not null check (tier in ('operator','domain_leader','platform_control','executive')),
  default_role  text not null,                             -- → platform.roles.name
  default_route text not null
);

create index if not exists idx_departments_tenant_id on platform.departments (tenant_id);
create index if not exists idx_departments_company_id on platform.departments (company_id);
create index if not exists idx_teams_tenant_id on platform.teams (tenant_id);
create index if not exists idx_teams_department_id on platform.teams (department_id);
```

### 4.3 RLS helper functions (source‑agnostic — Pattern A or B)

```sql
create schema if not exists app;

create or replace function app.current_tenant() returns uuid language sql stable as $$
  select coalesce(
    nullif(current_setting('app.tenant_id', true), '')::uuid,           -- Pattern B (BFF GUC)
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'tenant_id')::uuid  -- Pattern A
  );
$$;

create or replace function app.current_user_id() returns uuid language sql stable as $$
  select coalesce(
    nullif(current_setting('app.user_id', true), '')::uuid,
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid
  );
$$;

create or replace function app.has_role(p_role text) returns boolean language sql stable as $$
  select p_role = any (string_to_array(coalesce(current_setting('app.dws_roles', true), ''), ','));
$$;

-- Company scope (single tenant, multiple companies). BFF sets 'app.company_ids' (csv) for the
-- companies the user may see; company-private tables add `company_id = any(app.current_companies())`.
create or replace function app.current_companies() returns uuid[] language sql stable as $$
  select coalesce(
    string_to_array(nullif(current_setting('app.company_ids', true), ''), ',')::uuid[],
    '{}'::uuid[]);
$$;

-- Workspace scope (feature groups the user may access; §4.6). BFF sets 'app.workspace_ids' (csv);
-- workspace-scoped tables add `workspace_id = any(app.current_workspaces())`.
create or replace function app.current_workspaces() returns uuid[] language sql stable as $$
  select coalesce(
    string_to_array(nullif(current_setting('app.workspace_ids', true), ''), ',')::uuid[],
    '{}'::uuid[]);
$$;
```

### 4.4 Standard `updated_at` trigger (applied to every table)

```sql
-- per table:
create trigger set_updated_at before update on platform.departments
  for each row execute procedure moddatetime (updated_at);
```

### 4.6 Workspaces — feature groups & the second scoping axis

**A workspace is a group of features** (e.g. *Tasks*, *Finance*, *Sales*, *Services*, *Knowledge*) — not an org unit and not a marketplace. It is the **second scoping axis**, orthogonal to the org chart:

- **`company_id` = WHO** (org placement: tenant → company → department → team → user).
- **`workspace_id` = WHAT** (which feature group the data belongs to).

A workspace is a **vertical slice across the domain schemas**: a *Finance* workspace has its listings in `discovery`, its requests in `workspace`, its fulfilment in `operations` — all tagged `workspace_id`. **Stage‑4 verticals collapse into this** — a vertical (licensing, lending) is just another `platform.workspaces` row, with its own `discovery`/`workspace`/`operations` data and, *if* feature‑heavy, an optional bespoke schema (§4.6.3).

#### 4.6.1 Registry & company entitlement

```sql
create table if not exists platform.workspaces (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references platform.tenants(id),
  key         text not null,                       -- 'tasks' | 'finance' | 'sales' | 'services' | …
  name        text not null,
  description text,
  kind        text not null default 'standard' check (kind in ('standard','vertical')),  -- vertical = ex-"Stage 4"
  has_schema  boolean not null default false,      -- true → owns a bespoke schema (§4.6.3)
  status      text not null default 'active' check (status in ('active','inactive')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references platform.users(id),
  constraint workspaces_tenant_key_unique unique (tenant_id, key)
);

-- Which companies have which workspaces enabled (workspaces are platform-level; access is entitled per company).
create table if not exists platform.company_workspaces (
  company_id   uuid not null references platform.companies(id) on delete cascade,
  workspace_id uuid not null references platform.workspaces(id) on delete cascade,
  enabled_at   timestamptz not null default now(),
  enabled_by   uuid references platform.users(id),
  primary key (company_id, workspace_id)
);
```

#### 4.6.2 Access & scoping

- **Entitlement:** a workspace is visible to a company only if a `company_workspaces` row exists.
- **User access within a workspace:** via RBAC — `platform.user_roles` scoped with `resource_id = workspace_id` (a "Finance Lead" is a `lead` role resource‑scoped to the Finance workspace). The BFF resolves the user's accessible workspaces and **applies them as a query filter in the service layer** (see §3.2 — this is authorization, not RLS).
- **Scoping columns, not RLS predicates:** feature data across `discovery` / `workspace` / `operations` carries **`workspace_id`** (and `company_id` where org‑private) for partitioning, filtering and reporting. The BFF composes the access filter from the user's entitlements:
  ```sql
  -- service-layer query (BFF), NOT an RLS policy
  where tenant_id = :tenant
    and workspace_id = any (:entitled_workspaces)
    and (company_id is null or company_id = any (:entitled_companies))
  ```
  RLS on these tables is just `using (tenant_id = app.current_tenant())`; `app.current_workspaces()`/`current_companies()` are reserved for **optional Pattern‑A defense‑in‑depth** (§3.2).

#### 4.6.3 Bespoke schema for feature‑heavy workspaces (hybrid — adopted)

Most workspaces need **no** schema — they live in the shared domain schemas, distinguished by `workspace_id`. A workspace with substantial bespoke tables (typically a vertical: licensing, lending) sets `has_schema = true` and owns a **domain‑named schema** (e.g. `finance`, `licensing`) for *its* tables only, anchored to `workspace.requests`. This is the canonical "Stage‑4 extension pattern", renamed and de‑privileged:

```sql
-- example: the licensing workspace's bespoke tables (anchored to the shared request)
create schema if not exists licensing;
create table if not exists licensing.licenses (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references platform.tenants(id),
  workspace_id uuid not null references platform.workspaces(id),
  request_id   uuid not null references workspace.requests(id),   -- reuse the universal anchor
  license_no   text unique,
  status       text not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references platform.users(id)
);
```

**Rule:** shared schemas by default; a bespoke schema only when a workspace's domain tables are heavy/bounded enough to warrant isolation. Either way the workspace is one `platform.workspaces` row and reuses `workspace.requests` + `operations.*` — it never re‑creates the request/fulfilment spine.

### 4.5 Notifications delivery — Realtime (in‑app) + Microsoft Graph (email)

`platform.notifications` (canonical) is the single store/outbox for every notification; `channel` selects the transport. Two transports:

**In‑app → Supabase Realtime.** Enable the `supabase_realtime` publication on `platform.notifications`; the client subscribes to its own rows and renders a live bell/feed. "Mark read" updates `read_at`.

```sql
-- add notifications to the Realtime publication, scoped per-user by RLS below
alter publication supabase_realtime add table platform.notifications;

alter table platform.notifications enable row level security;
create policy notifications_own_read on platform.notifications
  for select using (tenant_id = app.current_tenant() and user_id = app.current_user_id());
create policy notifications_own_update on platform.notifications
  for update using (user_id = app.current_user_id())
  with check (user_id = app.current_user_id());     -- only allows toggling read_at, etc.
```

> Realtime authorization: under **Pattern A** the client's Supabase JWT drives Realtime RLS directly. Under **Pattern B** (BFF‑mediated, no Supabase Auth) the browser can't open an authenticated Realtime socket itself — so either (a) the BFF relays events over its own channel (SSE/WebSocket), or (b) we issue a **scoped Realtime JWT** from the BFF for the socket only. Decide at build time (§10.8); the table/publication design is the same either way.

**Email → Microsoft Graph API.** The notifications table is an **outbox**: a dispatcher (BFF worker or Supabase Edge Function on a schedule) picks up unsent `channel='email'` rows and sends via **Microsoft Graph** `POST /users/{sender}/sendMail`, reusing the **existing Entra app registration** (BFF identity) granted the `Mail.Send` **application** permission — no new mail infrastructure, consistent with the Entra/Microsoft stack.

```sql
-- delivery attempts / idempotency for the email outbox (sent_at on notifications is the success signal)
create table if not exists platform.notification_deliveries (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references platform.tenants(id),
  notification_id uuid not null references platform.notifications(id) on delete cascade,
  channel         text not null check (channel in ('in_app','email','push')),
  status          text not null default 'pending'
                  check (status in ('pending','sent','failed','retrying')),
  provider        text,                               -- 'microsoft_graph' for email
  provider_message_id text,                           -- Graph message id, for traceability
  attempts        int not null default 0,
  last_error      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_notification_deliveries_status
  on platform.notification_deliveries (status) where status in ('pending','retrying');
```

Dispatcher loop (described): claim `pending`/`retrying` email rows → call Graph `sendMail` with the org's app token → on 202 set `status='sent'`, record `provider_message_id`, set `notifications.sent_at` → on error increment `attempts`, store `last_error`, back off (`retrying`), dead‑letter after N. Idempotent on `notification_id + channel`. Push (future) plugs in as another `channel` with its own provider.

---

## 5. Stage 1 — discovery / marketplace (`discovery`)

### 5.1 Reuse the canonical listing model

Services are **not** a bespoke catalog. Per the primer's config‑driven multi‑marketplace pattern, reuse: `marketplaces`, `listing_categories` (self‑referencing tree), `listings` (one row per catalogue entry of any type), `listing_attributes` (key/value/data_type facets), `listing_media` (→ `platform.files`), `enquiries`. The **five DWS marketplaces** (Services, Knowledge, Trackers, Analytics, Task Library) are each a `marketplaces` row; their items are `listings`. *(This is the platform's native version of the v1 §15 supertype — that supertype is dropped.)*

### 5.2 Service‑specific detail (extension, Stage‑1‑local)

Service facets that are simple go in `listing_attributes` (`sla_band`, `approval`, `risk`, `owner_type`). Structured service fields that need their own columns get a 1:1 extension keyed to the listing:

```sql
create table if not exists discovery.service_details (
  listing_id      uuid primary key references discovery.listings(id) on delete cascade,
  tenant_id       uuid not null references platform.tenants(id),
  provider_department_id uuid references platform.departments(id),   -- the "merchant"
  approval        text not null default 'not_required'
                  check (approval in ('required','conditional','not_required')),
  approval_detail text,
  risk            text check (risk in ('standard','governance_sensitive','review_sensitive','at_risk')),
  default_sla     text,
  purpose         text,
  when_to_use     text[] not null default '{}',
  when_not_to_use text[] not null default '{}',
  required_inputs text[] not null default '{}',
  fulfilment_path text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references platform.users(id),
  deleted_at      timestamptz
);
create index if not exists idx_service_details_tenant_id on discovery.service_details (tenant_id);
create index if not exists idx_service_details_provider_dept on discovery.service_details (provider_department_id);
```

Service **variants** (Standard/Expedited) → `listing_attributes` rows or a small `discovery.service_variants` extension if they must be individually orderable. Variant **pricing** → only if chargeback exists, else omit (open decision §10).

### 5.3 Proposed shared marketplace extensions

To support the e‑commerce experience platform‑wide, propose adding to `discovery` (shared, not DWS‑local):

```sql
create table if not exists discovery.listing_placements (   -- featured/curated slots
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references platform.tenants(id),
  listing_id  uuid not null references discovery.listings(id) on delete cascade,
  slot        text not null check (slot in ('home_featured','category_hero','promoted','new')),
  rank        int not null default 0,
  starts_at   timestamptz,
  ends_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references platform.users(id)
);

create table if not exists discovery.listing_bundles (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references platform.tenants(id),
  marketplace_id uuid not null references discovery.marketplaces(id),
  title      text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references platform.users(id)
);
create table if not exists discovery.listing_bundle_items (
  bundle_id  uuid not null references discovery.listing_bundles(id) on delete cascade,
  listing_id uuid not null references discovery.listings(id) on delete cascade,
  quantity   int not null default 1,
  primary key (bundle_id, listing_id)
);
```

### 5.4 Example RLS (tenant isolation only — per §3.2)

```sql
alter table discovery.service_details enable row level security;

-- RLS = the hard data boundary only.
create policy service_details_tenant_isolation on discovery.service_details
  using (tenant_id = app.current_tenant())
  with check (tenant_id = app.current_tenant());
```

> Workspace/company scoping and **who may publish/edit a service** (role checks) are **not** in RLS — they are authorization, enforced in the BFF/service layer (§3.2). The earlier draft's `has_role(...)` write policy is removed; if Pattern A is later enabled, role/workspace checks may be re‑added to RLS as defense‑in‑depth, but the service layer stays the source of truth.

### 5.5 Prototype `iam_*` → `platform.*` migration note

`server/src/db/schema.sql` (`iam_users`, `iam_user_roles`, `iam_user_scope`, `iam_audit_events`, …) is refactored: `iam_users`→`platform.users` (+ Entra `entra_oid` retained on `users`), `iam_user_roles`→`platform.user_roles`+`roles`, `iam_user_scope`→`user_roles.resource_id` over departments/teams, `iam_audit_events`→`platform.audit_logs`. Delivered as migration `0002_migrate_iam_to_platform.sql` with data backfill.

---

## 6. The signed‑in working area — `workspace` schema (Stage 2)

### 6.1 The central anchor

A service request **is** a `workspace.requests` row (`type = 'service_request'`). Reuse canonical `requests`, `request_timeline`, `form_submissions` (captures `required_inputs`), `documents`/`document_wallet`, `conversations`/`messages`, `payments` (only if chargeback). Enquiry→request uses the canonical `requests.source_enquiry_id`.

### 6.2 Cart / multi‑service → requests (decision pending, §10.3)

The e‑commerce cart maps to **N `requests`** (one per service, clean lineage) grouped by a lightweight batch id. Proposed thin table:

```sql
create table if not exists workspace.request_batches (   -- "cart"/checkout grouping
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references platform.tenants(id),
  requester_id uuid not null references platform.users(id),
  status       text not null default 'open' check (status in ('open','submitted','abandoned')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references platform.users(id)
);
-- requests.batch_id (nullable) links each service request to its checkout batch.
alter table workspace.requests add column if not exists batch_id uuid references workspace.request_batches(id);
alter table workspace.requests add column if not exists listing_id uuid references discovery.listings(id);
```

Each `requests` row records which service (`listing_id`) and which checkout batch it came from. The single‑request and multi‑service flows are the same shape — a batch of one.

Request status value‑set (snake_case): `draft`, `submitted`, `pending_approval`, `in_review`, `in_fulfilment`, `returned_for_information`, `closed`, `cancelled`.

---

## 7. Stage 3 — fulfilment & operations (`operations`)

*"Delivered by people in departments; managed by owners; monitored by support."* All reuse canonical `operations`, anchored to a `requests` row.

| DWS concept | Canonical mapping |
|---|---|
| Delivery work item per service | `workflow_instances` + `workflow_steps` on the request (or an `orders` row) |
| Fulfiller (person delivering) | `task_assignments.assignee_id` |
| Routing queue | `task_queues` (e.g. `it_fulfilment`, `hra_requests`) |
| Approval | `approval_decisions` (per `workflow_step`) |
| Service owner manages delivery | `platform.user_roles` with `name='service_owner'`, `resource_id = listing_id` (resource‑scoped role) |
| Support monitors | `name='support'` role + `task_queues` scope; read access enforced in the service layer (§3.2) |
| Chargeback / payout (if any) | `quotes`/`orders`/`invoices`/`payouts` |

SLA on delivery: store `due_at` on `workflow_steps`; SLA **state** is computed (view), not stored as a frozen string.

RLS is tenant isolation only; **who may read/act** (support monitor, owner, assignee) is authorization resolved by the BFF (§3.2):

```sql
alter table operations.task_assignments enable row level security;
create policy task_assignments_tenant on operations.task_assignments
  using (tenant_id = app.current_tenant())
  with check (tenant_id = app.current_tenant());
-- Support/owner/assignee read scope is applied as a service-layer filter, e.g.:
--   where tenant_id = :t and (:is_support or assignee_id = :uid or :owns_workspace)
```

---

## 8. Worked example — service request end‑to‑end (Supabase, RLS‑on)

```sql
-- BFF sets context per request (Pattern B)
select set_config('app.tenant_id', :tenant, true),
       set_config('app.user_id',   :user,   true),
       set_config('app.dws_roles', 'associate', true);

-- 1. CAPTURE: service = a listing in the 'services' marketplace + detail
insert into discovery.listings (tenant_id, marketplace_id, owner_id, category_id, title, status, created_by)
  values (:tenant, :services_mkt, :owner, :cat, 'Issue laptop', 'published', :owner)
  returning id;                                            -- :listing
insert into discovery.service_details (listing_id, tenant_id, provider_department_id, approval, default_sla, created_by)
  values (:listing, :tenant, :it_dept, 'required', '2_business_days', :owner);
insert into discovery.listing_attributes (listing_id, key, value, data_type) values
  (:listing, 'sla_band', '2_business_days', 'text'), (:listing, 'risk', 'standard', 'text');

-- 2. REQUEST: the central anchor (one per service, grouped by a batch)
insert into workspace.requests (tenant_id, user_id, type, status, reference_no, listing_id, created_by)
  values (:tenant, :user, 'service_request', 'submitted', 'REQ-2045', :listing, :user)
  returning id;                                            -- :request

-- 3. FULFIL: Stage-3 ops on the request
insert into operations.workflow_instances (tenant_id, workflow_definition_id, request_id, status) values (...);
insert into operations.task_assignments (tenant_id, workflow_step_id, queue_id, assignee_id) values (...:fulfiller);
insert into operations.approval_decisions (tenant_id, workflow_step_id, approver_id, decision) values (...,'approved');
-- timeline + audit
insert into workspace.request_timeline (tenant_id, request_id, event_type, description, actor_id) values (...);
-- platform.audit_logs written by trigger/BFF on each state change
```

---

## 9. The DWS domains **are** workspaces (tasks / knowledge / trackers / analytics / services)

Each DWS domain is a **`platform.workspaces` row** (a feature group, §4.6), and its data is the same vertical slice across the shared schemas — distinguished by `workspace_id`, not a `dws_*` silo:

| Workspace (feature group) | `discovery` (catalogue) | `workspace` (anchor) | `operations` (fulfilment) |
|---|---|---|---|
| **Services** | `listings` (services mkt) + `service_details` | `requests` (`service_request`) | workflows/queues/approvals |
| **Tasks** | `listings` (task‑template mkt) | task instances anchored to `requests` | review/approval steps |
| **Knowledge** | `listings` (knowledge mkt) + `listing_attributes` | acknowledgements/feedback child tables | review queue = `task_queues` |
| **Trackers** | `listings` (tracker‑template mkt) | tracker instances + records | — |
| **Analytics** | `listings` (analytics mkt) | access grants via `user_roles` (`resource_id`=listing) | — |
| **(verticals: Finance, Sales, Licensing…)** | own `listings` | own `requests` + optional bespoke schema (§4.6.3) | own workflows |

Every row above carries `workspace_id`. The detailed per‑domain child tables (task checklist/evidence/closure, knowledge applicability/versioning, tracker records/RAG, KPI sets) carry over from the base spec's modelling, **re‑homed** into the shared schemas with base fields + `workspace_id` + RLS — or into the workspace's bespoke schema when it's feature‑heavy. Detailed per workspace when built. *(Open decision §10.2: which child tables hang directly off `requests` vs stand alone in `workspace`.)*

---

## 10. Open decisions

**Resolved (2026-06-18):**
- ✅ **§10.7 Tenancy** → **single‑tenant**; `tenant_id` carried but constant.
- ✅ **§10.1 Internal org chart** → `platform` is the home, with an added **`companies`** layer (one tenant, multiple companies); hierarchy tenant → company → department → team → user (§4.2).
- ✅ **§10.2 Workspace‑domain child tables** → follow the stage model; detailed per domain when built (§9).
- ✅ **§10.3 Cart → requests** → **N requests per batch** via `workspace.request_batches` (§6.2).
- ✅ **Workspaces (new)** → a workspace = a **group of features** (Tasks/Finance/Sales/Services…), modelled as `platform.workspaces` + `workspace_id` scoping (§4.6); **hybrid** adopted (bespoke schema only for feature‑heavy verticals). **Stage 4 collapses into "just another workspace."** Schema `account` renamed **`workspace`**.
- ✅ **Workspace × company** → workspaces are **platform‑level feature groups**, entitled per company via `platform.company_workspaces`; access within a workspace via resource‑scoped roles.
- ✅ **RLS vs RBAC (§3.2)** → **RLS = tenant isolation + true row‑ownership only.** Workspace and company access are **RBAC**, enforced in the BFF/service layer; `workspace_id`/`company_id` are scoping **columns**, not RLS predicates by default. (Corrects the first draft, which over‑scoped them into RLS.)

**Still open:**
4. **Shared marketplace extensions (§5.3):** add `listing_placements`/`listing_bundles` to platform `discovery` (preferred) vs DWS‑local.
5. **Chargeback/pricing:** any priced services? If not, drop variant pricing + `payments`.
6. **RLS rollout:** Pattern B now (BFF GUC) — confirm; Pattern A (Data API JWT) when the browser hits PostgREST directly.
7. **Company scoping depth:** which tables are company‑private (need `company_id` + the §4.3 `current_companies()` predicate) vs tenant‑wide visible (e.g. shared knowledge/service catalogue)?
8. **Realtime auth under Pattern B (§4.5):** BFF relays Realtime events over its own SSE/WebSocket vs issuing a scoped Realtime JWT for the browser socket.
9. **Schema naming (§3.1):** domain‑oriented names adopted in DWS.01 (`discovery`/`workspace`/`operations`). **Propagate to the canonical primer** so the whole platform stays consistent — needs platform‑owner sign‑off.

---

## 11. Trade‑offs & what I'd revisit

1. **Service as `listings` + `service_details` (two tables + join)** vs one fat services table — chosen for platform conformance and multi‑marketplace reuse; the join cost is negligible and the payoff is one discovery engine for all five marketplaces.
2. **Pattern B (BFF‑mediated RLS context)** keeps us decoupled from Supabase Auth and matches today's BFF, but means **service_role bypasses RLS** — so the BFF must still scope by tenant in queries; RLS is defense‑in‑depth until Pattern A. Revisit when the Data API is exposed to the browser.
3. **N requests per cart** gives clean per‑service lineage but a multi‑item "order" is a `request_batches` rollup, not a single row — reporting must group by batch. Revisit if business wants a single order artifact.
4. **`listing_attributes` EAV facets** — flexible, but heavier queries; add GIN/`pg_trgm` indexes and promote hot facets to `service_details` columns if they dominate filtering.
5. **Internal org chart in `platform`** assumes departments are foundational; if a future solution needs different org shapes, revisit as a shared‑but‑configurable structure.
6. **Computed SLA/KPI** (views/materialised views) over stored display strings — keep metrics truthful; refresh on schedule.

---

*Next: once §10.1–10.3 are confirmed, produce the migration set (`supabase/migrations/0001…`) — `platform` foundation + org chart, `discovery` service detail/extensions, `workspace` request linkage, `operations` mappings, RLS policies, and the `iam_*`→`platform.*` backfill.*
```

