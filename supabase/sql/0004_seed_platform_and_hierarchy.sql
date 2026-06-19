-- =============================================================================
-- File: 0004_seed_platform_and_hierarchy.sql
-- Purpose: Tenant, company, departments, workspace, marketplaces, submarketplaces, categories
-- Prerequisite: 0003_rls_and_indexes.sql
-- Safe to re-run: YES (ON CONFLICT DO UPDATE)
-- Expected outcome: 1 tenant, 11 departments, 4 marketplaces, 4 submarketplaces, 15 categories
-- =============================================================================

BEGIN;

-- Constants (deterministic UUIDs)
-- Tenant:  a0000000-0000-4000-8000-000000000001
-- Company: a0000000-0000-4000-8000-000000000002
-- Workspace: a0000000-0000-4000-8000-000000000010

INSERT INTO platform.tenants (id, name, slug, status)
VALUES ('a0000000-0000-4000-8000-000000000001', 'Digital Qatalyst', 'digital-qatalyst', 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

INSERT INTO platform.companies (id, tenant_id, name, slug, status)
VALUES ('a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Digital Qatalyst', 'digital-qatalyst', 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO platform.workspaces (id, tenant_id, key, name, description, kind, status)
VALUES (
  'a0000000-0000-4000-8000-000000000010',
  'a0000000-0000-4000-8000-000000000001',
  'services',
  'Services',
  'DWS Services marketplace and service request workspace',
  'standard',
  'active'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO platform.company_workspaces (company_id, workspace_id)
VALUES ('a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000010')
ON CONFLICT DO NOTHING;

-- Delivery departments (slug stored for attribute mapping)
INSERT INTO platform.departments (id, tenant_id, company_id, slug, name, health) VALUES
  ('a0000000-0000-4000-8000-000000000201', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'gov_coe', 'Architecture & Governance CoE', 'on_track'),
  ('a0000000-0000-4000-8000-000000000202', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'del_intelligence', 'Cognitive Automation Delivery', 'on_track'),
  ('a0000000-0000-4000-8000-000000000203', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'ops_hra', 'HR & People Operations', 'on_track'),
  ('a0000000-0000-4000-8000-000000000204', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'del_secdevops', 'SecDevOps Platform Delivery', 'on_track'),
  ('a0000000-0000-4000-8000-000000000205', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'ops_finance', 'Finance & Admin Operations', 'on_track'),
  ('a0000000-0000-4000-8000-000000000206', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'del_stories', 'Marketing & Story Delivery', 'on_track'),
  ('a0000000-0000-4000-8000-000000000207', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'del_deals', 'BD & Partner Delivery', 'on_track'),
  ('a0000000-0000-4000-8000-000000000208', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'del_dq_account', 'Customer Delivery — DQ Account', 'on_track'),
  ('a0000000-0000-4000-8000-000000000209', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'del_products', 'Product Delivery', 'on_track'),
  ('a0000000-0000-4000-8000-000000000210', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'del_solutions', 'Solution Delivery', 'on_track'),
  ('a0000000-0000-4000-8000-000000000211', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'del_dq_deploys', 'Deployment Unit — DQ Deploys', 'on_track')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

-- 4-D Marketplaces
INSERT INTO discovery.marketplaces (id, tenant_id, key, name, description, status, sort_order) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'discern', 'Discern', 'Educate, inform, help users understand why the work matters', 'active', 10),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'design', 'Design', 'Approved rules, frameworks, policies, controls, and decision logic', 'active', 20),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'deploy', 'Deploy', 'Templates, tools, baselines, and implementation artefacts', 'active', 30),
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'drive', 'Drive', 'User-facing services, requests, evidence flows, and formal outputs', 'active', 40)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

-- Submarketplaces (internal slug → user-facing name)
INSERT INTO discovery.submarketplaces (id, tenant_id, slug, name, tagline, zone, sort_order, status) VALUES
  ('b0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000001', 'transform', 'Strategy & Innovation', 'Architecture, governance, AI and automation', 'internal', 10, 'active'),
  ('b0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000001', 'enable', 'Operations Support', 'People, finance, admin and IT support', 'internal', 20, 'active'),
  ('b0000000-0000-4000-8000-000000000013', 'a0000000-0000-4000-8000-000000000001', 'commercial', 'Commercials', 'Marketing, leads, BD and partnerships', 'external', 30, 'active'),
  ('b0000000-0000-4000-8000-000000000014', 'a0000000-0000-4000-8000-000000000001', 'delivery', 'Customer Delivery & Operations', 'Delivery engagements and managed services', 'external', 40, 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, zone = EXCLUDED.zone;

-- Service domain categories (Drive marketplace)
INSERT INTO discovery.listing_categories (id, tenant_id, marketplace_id, parent_id, name, slug, sort_order, status) VALUES
  ('b0000000-0000-4000-8000-000000000101', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', NULL, 'Architecture & Governance', 'architecture_and_governance', 10, 'active'),
  ('b0000000-0000-4000-8000-000000000102', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', NULL, 'Cognitive Automation', 'cognitive_automation', 20, 'active'),
  ('b0000000-0000-4000-8000-000000000103', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', NULL, 'Finance & Admin', 'finance_and_admin', 30, 'active'),
  ('b0000000-0000-4000-8000-000000000104', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', NULL, 'Operational Excellence', 'operational_excellence', 40, 'active'),
  ('b0000000-0000-4000-8000-000000000105', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', NULL, 'Marketing & Lead Generation', 'marketing_and_lead_gen', 50, 'active'),
  ('b0000000-0000-4000-8000-000000000106', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', NULL, 'BD & Partners', 'bd_and_partners', 60, 'active'),
  ('b0000000-0000-4000-8000-000000000107', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', NULL, 'Customer Delivery', 'customer_delivery', 70, 'active'),
  ('b0000000-0000-4000-8000-000000000108', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', NULL, 'Delivery Factory', 'delivery_factory', 80, 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

-- Enable leaf categories (under service domains)
INSERT INTO discovery.listing_categories (id, tenant_id, marketplace_id, parent_id, name, slug, sort_order, status) VALUES
  ('b0000000-0000-4000-8000-000000000201', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000104', 'Payroll', 'payroll', 10, 'active'),
  ('b0000000-0000-4000-8000-000000000202', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000104', 'Leave & Attendance', 'leave_and_attendance', 20, 'active'),
  ('b0000000-0000-4000-8000-000000000203', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000104', 'HR Lifecycle', 'hr_lifecycle', 30, 'active'),
  ('b0000000-0000-4000-8000-000000000204', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000104', 'Tools & Access', 'tools_and_access', 40, 'active'),
  ('b0000000-0000-4000-8000-000000000205', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000104', 'Operations', 'operations', 50, 'active'),
  ('b0000000-0000-4000-8000-000000000206', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000103', 'Finance', 'finance', 60, 'active'),
  ('b0000000-0000-4000-8000-000000000207', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000103', 'Facilities', 'facilities', 70, 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

COMMIT;

-- CHECKPOINT
-- SELECT slug, name, zone FROM discovery.submarketplaces ORDER BY sort_order;
-- SELECT count(*) FROM discovery.listing_categories;  -- expect 15
