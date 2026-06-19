-- =============================================================================
-- File: 0001_schema_foundation.sql
-- Purpose: Extensions, app RLS helpers, platform schema, org chart, workspaces
-- Prerequisite: None (greenfield Supabase project)
-- Safe to re-run: YES (IF NOT EXISTS / OR REPLACE)
-- Expected outcome: app + platform schemas with core tables
-- =============================================================================

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- moddatetime may already exist on Supabase; create if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'moddatetime') THEN
    CREATE EXTENSION IF NOT EXISTS moddatetime;
  END IF;
END $$;

-- App schema + RLS helpers (Pattern B — BFF GUC context)
CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.current_tenant() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT coalesce(
    nullif(current_setting('app.tenant_id', true), '')::uuid,
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'tenant_id')::uuid
  );
$$;

CREATE OR REPLACE FUNCTION app.current_user_id() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT coalesce(
    nullif(current_setting('app.user_id', true), '')::uuid,
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid
  );
$$;

CREATE OR REPLACE FUNCTION app.has_role(p_role text) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT p_role = any(string_to_array(coalesce(current_setting('app.dws_roles', true), ''), ','));
$$;

CREATE OR REPLACE FUNCTION app.current_companies() RETURNS uuid[] LANGUAGE sql STABLE AS $$
  SELECT coalesce(
    string_to_array(nullif(current_setting('app.company_ids', true), ''), ',')::uuid[],
    '{}'::uuid[]
  );
$$;

CREATE OR REPLACE FUNCTION app.current_workspaces() RETURNS uuid[] LANGUAGE sql STABLE AS $$
  SELECT coalesce(
    string_to_array(nullif(current_setting('app.workspace_ids', true), ''), ',')::uuid[],
    '{}'::uuid[]
  );
$$;

-- Platform schema
CREATE SCHEMA IF NOT EXISTS platform;

CREATE TABLE IF NOT EXISTS platform.tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tenants_slug_unique UNIQUE (slug)
);

CREATE TABLE IF NOT EXISTS platform.users (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  entra_oid    text UNIQUE,
  email        text NOT NULL,
  display_name text NOT NULL,
  status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz,
  CONSTRAINT users_tenant_email_unique UNIQUE (tenant_id, email)
);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON platform.users (tenant_id);

CREATE TABLE IF NOT EXISTS platform.roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  name        text NOT NULL,
  scope       text NOT NULL DEFAULT 'solution',
  description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT roles_tenant_name_unique UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS platform.user_roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  user_id     uuid NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
  role_id     uuid NOT NULL REFERENCES platform.roles(id) ON DELETE CASCADE,
  resource_id uuid,
  expires_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_user_role_resource_unique UNIQUE (user_id, role_id, resource_id)
);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON platform.user_roles (user_id);

CREATE TABLE IF NOT EXISTS platform.audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  event_type  text NOT NULL,
  actor_id    uuid REFERENCES platform.users(id),
  resource    text,
  decision    text,
  detail      jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_occurred_at ON platform.audit_logs (occurred_at DESC);

CREATE TABLE IF NOT EXISTS platform.files (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  storage_path text NOT NULL,
  file_name    text NOT NULL,
  mime_type    text,
  size_bytes   bigint,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  created_by   uuid REFERENCES platform.users(id)
);

CREATE TABLE IF NOT EXISTS platform.feature_flags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  flag_key    text NOT NULL,
  name        text NOT NULL,
  description text,
  enabled     boolean NOT NULL DEFAULT false,
  scope       text NOT NULL DEFAULT 'global',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT feature_flags_tenant_key_unique UNIQUE (tenant_id, flag_key)
);

CREATE TABLE IF NOT EXISTS platform.companies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  name        text NOT NULL,
  slug        text NOT NULL,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES platform.users(id),
  deleted_at  timestamptz,
  CONSTRAINT companies_tenant_slug_unique UNIQUE (tenant_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_companies_tenant_id ON platform.companies (tenant_id);

CREATE TABLE IF NOT EXISTS platform.departments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES platform.tenants(id),
  company_id   uuid NOT NULL REFERENCES platform.companies(id) ON DELETE CASCADE,
  slug         text NOT NULL,
  name         text NOT NULL,
  lead_user_id uuid REFERENCES platform.users(id),
  health       text NOT NULL DEFAULT 'on_track' CHECK (health IN ('on_track', 'watch', 'at_risk')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  created_by   uuid REFERENCES platform.users(id),
  deleted_at   timestamptz,
  CONSTRAINT departments_company_slug_unique UNIQUE (company_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_departments_tenant_id ON platform.departments (tenant_id);
CREATE INDEX IF NOT EXISTS idx_departments_company_id ON platform.departments (company_id);

CREATE TABLE IF NOT EXISTS platform.teams (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  department_id uuid NOT NULL REFERENCES platform.departments(id) ON DELETE CASCADE,
  name          text NOT NULL,
  lead_user_id  uuid REFERENCES platform.users(id),
  flow_health   text NOT NULL DEFAULT 'on_track' CHECK (flow_health IN ('on_track', 'watch', 'at_risk')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES platform.users(id),
  deleted_at    timestamptz
);
CREATE INDEX IF NOT EXISTS idx_teams_department_id ON platform.teams (department_id);

CREATE TABLE IF NOT EXISTS platform.personas (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  tier          text NOT NULL CHECK (tier IN ('operator', 'domain_leader', 'platform_control', 'executive')),
  default_role  text NOT NULL,
  default_route text NOT NULL
);

CREATE TABLE IF NOT EXISTS platform.user_org_placement (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES platform.tenants(id),
  user_id       uuid NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
  company_id    uuid NOT NULL REFERENCES platform.companies(id),
  department_id uuid REFERENCES platform.departments(id),
  team_id       uuid REFERENCES platform.teams(id),
  persona_id    text REFERENCES platform.personas(id),
  is_primary    boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES platform.users(id),
  CONSTRAINT user_org_placement_user_company_unique UNIQUE (user_id, company_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_primary_placement
  ON platform.user_org_placement (user_id) WHERE is_primary;

CREATE TABLE IF NOT EXISTS platform.workspaces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  key         text NOT NULL,
  name        text NOT NULL,
  description text,
  kind        text NOT NULL DEFAULT 'standard' CHECK (kind IN ('standard', 'vertical')),
  has_schema  boolean NOT NULL DEFAULT false,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES platform.users(id),
  CONSTRAINT workspaces_tenant_key_unique UNIQUE (tenant_id, key)
);

CREATE TABLE IF NOT EXISTS platform.company_workspaces (
  company_id   uuid NOT NULL REFERENCES platform.companies(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES platform.workspaces(id) ON DELETE CASCADE,
  enabled_at   timestamptz NOT NULL DEFAULT now(),
  enabled_by   uuid REFERENCES platform.users(id),
  PRIMARY KEY (company_id, workspace_id)
);

-- updated_at triggers (moddatetime)
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'platform.tenants', 'platform.users', 'platform.roles', 'platform.files',
    'platform.feature_flags', 'platform.companies', 'platform.departments',
    'platform.teams', 'platform.user_org_placement', 'platform.workspaces'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %s', t);
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at)',
      t
    );
  END LOOP;
END $$;

COMMIT;

-- CHECKPOINT
-- SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('app', 'platform');
