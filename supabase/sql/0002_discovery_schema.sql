-- =============================================================================
-- File: 0002_discovery_schema.sql
-- Purpose: Discovery catalog tables — marketplaces, listings, filters, service_details
-- Prerequisite: 0001_schema_foundation.sql
-- Safe to re-run: YES
-- Expected outcome: 11 tables in discovery schema
-- =============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS discovery;

CREATE TABLE IF NOT EXISTS discovery.marketplaces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  key         text NOT NULL,
  name        text NOT NULL,
  description text,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'hidden')),
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES platform.users(id),
  deleted_at  timestamptz,
  CONSTRAINT marketplaces_tenant_key_unique UNIQUE (tenant_id, key)
);
CREATE INDEX IF NOT EXISTS idx_marketplaces_tenant_id ON discovery.marketplaces (tenant_id);

CREATE TABLE IF NOT EXISTS discovery.submarketplaces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES platform.tenants(id),
  slug        text NOT NULL,
  name        text NOT NULL,
  tagline     text,
  zone        text NOT NULL CHECK (zone IN ('internal', 'external')),
  sort_order  int NOT NULL DEFAULT 0,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES platform.users(id),
  deleted_at  timestamptz,
  CONSTRAINT submarketplaces_tenant_slug_unique UNIQUE (tenant_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_submarketplaces_tenant_id ON discovery.submarketplaces (tenant_id);

CREATE TABLE IF NOT EXISTS discovery.listing_categories (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES platform.tenants(id),
  marketplace_id uuid NOT NULL REFERENCES discovery.marketplaces(id) ON DELETE CASCADE,
  parent_id      uuid REFERENCES discovery.listing_categories(id) ON DELETE SET NULL,
  name           text NOT NULL,
  slug           text NOT NULL,
  description    text,
  sort_order     int NOT NULL DEFAULT 0,
  status         text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  created_by     uuid REFERENCES platform.users(id),
  deleted_at     timestamptz,
  CONSTRAINT listing_categories_marketplace_slug_unique UNIQUE (marketplace_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_listing_categories_marketplace_id ON discovery.listing_categories (marketplace_id);
CREATE INDEX IF NOT EXISTS idx_listing_categories_parent_id ON discovery.listing_categories (parent_id);

CREATE TABLE IF NOT EXISTS discovery.listings (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES platform.tenants(id),
  workspace_id      uuid NOT NULL REFERENCES platform.workspaces(id),
  marketplace_id    uuid NOT NULL REFERENCES discovery.marketplaces(id) ON DELETE RESTRICT,
  submarketplace_id uuid REFERENCES discovery.submarketplaces(id) ON DELETE RESTRICT,
  category_id       uuid REFERENCES discovery.listing_categories(id) ON DELETE SET NULL,
  title             text NOT NULL,
  slug              text NOT NULL,
  summary           text,
  description       text,
  status            text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  owner_id          uuid REFERENCES platform.users(id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  created_by        uuid REFERENCES platform.users(id),
  deleted_at        timestamptz,
  CONSTRAINT listings_marketplace_slug_unique UNIQUE (marketplace_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_listings_tenant_id ON discovery.listings (tenant_id);
CREATE INDEX IF NOT EXISTS idx_listings_marketplace_id ON discovery.listings (marketplace_id);
CREATE INDEX IF NOT EXISTS idx_listings_submarketplace_id ON discovery.listings (submarketplace_id);
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON discovery.listings (category_id);
CREATE INDEX IF NOT EXISTS idx_listings_workspace_id ON discovery.listings (workspace_id);

CREATE TABLE IF NOT EXISTS discovery.listing_attributes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  listing_id uuid NOT NULL REFERENCES discovery.listings(id) ON DELETE CASCADE,
  key        text NOT NULL,
  value      text NOT NULL,
  data_type  text NOT NULL DEFAULT 'text',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listing_attributes_listing_key_unique UNIQUE (listing_id, key)
);
CREATE INDEX IF NOT EXISTS idx_listing_attributes_listing_id ON discovery.listing_attributes (listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_attributes_key_value ON discovery.listing_attributes (key, value);

CREATE TABLE IF NOT EXISTS discovery.listing_media (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  listing_id uuid NOT NULL REFERENCES discovery.listings(id) ON DELETE CASCADE,
  file_id    uuid REFERENCES platform.files(id) ON DELETE SET NULL,
  alt_text   text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_listing_media_listing_id ON discovery.listing_media (listing_id);

CREATE TABLE IF NOT EXISTS discovery.service_details (
  listing_id             uuid PRIMARY KEY REFERENCES discovery.listings(id) ON DELETE CASCADE,
  tenant_id              uuid NOT NULL REFERENCES platform.tenants(id),
  provider_department_id uuid REFERENCES platform.departments(id),
  approval               text NOT NULL DEFAULT 'not_required'
                         CHECK (approval IN ('not_required', 'conditional', 'required')),
  approval_detail        text,
  risk                   text CHECK (risk IN ('standard', 'governance_sensitive', 'review_sensitive', 'at_risk')),
  default_sla            text,
  purpose                text,
  when_to_use            text[] NOT NULL DEFAULT '{}',
  when_not_to_use        text[] NOT NULL DEFAULT '{}',
  required_inputs        text[] NOT NULL DEFAULT '{}',
  fulfilment_path        text,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  created_by             uuid REFERENCES platform.users(id),
  deleted_at             timestamptz
);
CREATE INDEX IF NOT EXISTS idx_service_details_tenant_id ON discovery.service_details (tenant_id);
CREATE INDEX IF NOT EXISTS idx_service_details_provider_dept ON discovery.service_details (provider_department_id);

CREATE TABLE IF NOT EXISTS discovery.listing_placements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES platform.tenants(id),
  listing_id uuid NOT NULL REFERENCES discovery.listings(id) ON DELETE CASCADE,
  slot       text NOT NULL CHECK (slot IN ('home_featured', 'category_hero', 'promoted', 'new')),
  rank       int NOT NULL DEFAULT 0,
  starts_at  timestamptz,
  ends_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES platform.users(id)
);
CREATE INDEX IF NOT EXISTS idx_listing_placements_listing_id ON discovery.listing_placements (listing_id);

CREATE TABLE IF NOT EXISTS discovery.listing_bundles (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES platform.tenants(id),
  marketplace_id uuid NOT NULL REFERENCES discovery.marketplaces(id) ON DELETE CASCADE,
  title          text NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  created_by     uuid REFERENCES platform.users(id)
);

CREATE TABLE IF NOT EXISTS discovery.listing_bundle_items (
  bundle_id  uuid NOT NULL REFERENCES discovery.listing_bundles(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES discovery.listings(id) ON DELETE CASCADE,
  quantity   int NOT NULL DEFAULT 1,
  PRIMARY KEY (bundle_id, listing_id)
);

CREATE TABLE IF NOT EXISTS discovery.filter_definitions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES platform.tenants(id),
  submarketplace_id uuid REFERENCES discovery.submarketplaces(id) ON DELETE CASCADE,
  key               text NOT NULL,
  label             text NOT NULL,
  filter_type       text NOT NULL DEFAULT 'single' CHECK (filter_type IN ('single', 'multi')),
  is_shared         boolean NOT NULL DEFAULT false,
  sort_order        int NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  created_by        uuid REFERENCES platform.users(id),
  CONSTRAINT filter_definitions_scope_key_unique UNIQUE (tenant_id, submarketplace_id, key)
);
CREATE INDEX IF NOT EXISTS idx_filter_definitions_submarketplace_id ON discovery.filter_definitions (submarketplace_id);

CREATE TABLE IF NOT EXISTS discovery.filter_values (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            uuid NOT NULL REFERENCES platform.tenants(id),
  filter_definition_id uuid NOT NULL REFERENCES discovery.filter_definitions(id) ON DELETE CASCADE,
  value                text NOT NULL,
  label                text NOT NULL,
  sort_order           int NOT NULL DEFAULT 0,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT filter_values_definition_value_unique UNIQUE (filter_definition_id, value)
);
CREATE INDEX IF NOT EXISTS idx_filter_values_definition_id ON discovery.filter_values (filter_definition_id);

-- updated_at triggers
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'discovery.marketplaces', 'discovery.submarketplaces', 'discovery.listing_categories',
    'discovery.listings', 'discovery.listing_attributes', 'discovery.listing_media',
    'discovery.service_details', 'discovery.listing_placements', 'discovery.listing_bundles',
    'discovery.filter_definitions', 'discovery.filter_values'
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
-- SELECT count(*) FROM information_schema.tables WHERE table_schema = 'discovery';  -- expect 11
