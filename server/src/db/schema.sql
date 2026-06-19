-- DWS.01 IAM canonical schema (ADR-DWS01-IAM-009, ADR-DWS01-IAM-012)
-- Target: Supabase / PostgreSQL. DWS is the application authorization authority;
-- Entra is the identity provider only.
--
-- Apply with:  psql "$DATABASE_URL" -f server/src/db/schema.sql

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Identity records
-- ---------------------------------------------------------------------------
create table if not exists iam_users (
  id                uuid primary key default gen_random_uuid(),
  entra_oid         text unique,                 -- Entra object id (set on first login)
  email             text unique not null,
  display_name      text not null,
  workspace_segment text not null default 'Associate',
  status            text not null default 'active',  -- active | suspended
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Canonical DWS role assignments (authoritative; Entra groups are bootstrap hints only)
create table if not exists iam_user_roles (
  user_id    uuid not null references iam_users(id) on delete cascade,
  dws_role   text not null,  -- Associate | Lead | ServiceOwner | GovernanceLead | Leadership | PlatformAdmin
  assigned_at timestamptz not null default now(),
  assigned_by text,
  primary key (user_id, dws_role)
);

-- Unit / team scope (least-privilege visibility boundary)
create table if not exists iam_user_scope (
  user_id uuid not null references iam_users(id) on delete cascade,
  unit    text,
  team    text
);

create unique index if not exists iam_user_scope_user_unit_team_uk
  on iam_user_scope (user_id, coalesce(unit, ''), coalesce(team, ''));

-- ---------------------------------------------------------------------------
-- Permission exceptions and delegations (governed, time-bound)
-- ---------------------------------------------------------------------------
create table if not exists iam_permission_exceptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references iam_users(id) on delete cascade,
  permission  text not null,
  reason      text,
  approved_by text,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists iam_delegations (
  id            uuid primary key default gen_random_uuid(),
  from_user_id  uuid not null references iam_users(id) on delete cascade,
  to_user_id    uuid not null references iam_users(id) on delete cascade,
  scope         text,
  expires_at    timestamptz,
  created_at    timestamptz not null default now()
);

-- Optional bootstrap mapping: Entra group/app-role -> DWS workspace segment.
-- Used only to seed a new user's initial segment; never the runtime authority.
create table if not exists iam_entra_group_map (
  entra_group_id    text primary key,
  workspace_segment text not null
);

-- ---------------------------------------------------------------------------
-- Audit evidence (ADR-DWS01-IAM-007). Non-deletable by application roles.
-- ---------------------------------------------------------------------------
create table if not exists iam_audit_events (
  id          uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  event_type  text not null,   -- login_success | login_failure | logout | session_denied | user_provisioned
  actor_email text,
  actor_oid   text,
  resource    text,
  decision    text,            -- allow | deny | n/a
  detail      jsonb not null default '{}'::jsonb
);

create index if not exists iam_audit_events_occurred_at_idx on iam_audit_events (occurred_at desc);
create index if not exists iam_audit_events_actor_email_idx on iam_audit_events (actor_email);

-- ---------------------------------------------------------------------------
-- Seed: a baseline directory mirroring the prototype personas
-- ---------------------------------------------------------------------------
insert into iam_users (email, display_name, workspace_segment)
values
  ('amina.hassan@digitalqatalyst.com', 'Amina Hassan', 'Associate')
on conflict (email) do nothing;
