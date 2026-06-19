-- =============================================================================
-- File: 0003_rls_and_indexes.sql
-- Purpose: RLS tenant-isolation policies + search index on listings.title
-- Prerequisite: 0002_discovery_schema.sql
-- Safe to re-run: YES (DROP POLICY IF EXISTS before CREATE)
-- Expected outcome: RLS enabled on all tenant-scoped tables
-- =============================================================================

BEGIN;

-- Trigram search index
CREATE INDEX IF NOT EXISTS idx_listings_title_trgm
  ON discovery.listings USING gin (title gin_trgm_ops);

-- Helper to idempotently create tenant-isolation policy
CREATE OR REPLACE FUNCTION discovery._ensure_tenant_policy(p_table regclass, p_policy_name text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', p_table);
  EXECUTE format('DROP POLICY IF EXISTS %I ON %s', p_policy_name, p_table);
  EXECUTE format(
    'CREATE POLICY %I ON %s FOR ALL USING (tenant_id = app.current_tenant()) WITH CHECK (tenant_id = app.current_tenant())',
    p_policy_name, p_table
  );
END $$;

-- Platform tenant-scoped tables
SELECT discovery._ensure_tenant_policy('platform.users'::regclass, 'users_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.roles'::regclass, 'roles_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.user_roles'::regclass, 'user_roles_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.audit_logs'::regclass, 'audit_logs_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.files'::regclass, 'files_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.feature_flags'::regclass, 'feature_flags_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.companies'::regclass, 'companies_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.departments'::regclass, 'departments_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.teams'::regclass, 'teams_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.user_org_placement'::regclass, 'user_org_placement_tenant_isolation');
SELECT discovery._ensure_tenant_policy('platform.workspaces'::regclass, 'workspaces_tenant_isolation');

-- Discovery tenant-scoped tables
SELECT discovery._ensure_tenant_policy('discovery.marketplaces'::regclass, 'marketplaces_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.submarketplaces'::regclass, 'submarketplaces_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.listing_categories'::regclass, 'listing_categories_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.listings'::regclass, 'listings_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.listing_attributes'::regclass, 'listing_attributes_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.listing_media'::regclass, 'listing_media_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.service_details'::regclass, 'service_details_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.listing_placements'::regclass, 'listing_placements_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.listing_bundles'::regclass, 'listing_bundles_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.filter_definitions'::regclass, 'filter_definitions_tenant_isolation');
SELECT discovery._ensure_tenant_policy('discovery.filter_values'::regclass, 'filter_values_tenant_isolation');

-- tenants table: special case (no tenant_id column)
ALTER TABLE platform.tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenants_self ON platform.tenants;
CREATE POLICY tenants_self ON platform.tenants
  FOR ALL USING (id = app.current_tenant()) WITH CHECK (id = app.current_tenant());

DROP FUNCTION IF EXISTS discovery._ensure_tenant_policy(regclass, text);

COMMIT;

-- CHECKPOINT
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'discovery' ORDER BY tablename;
