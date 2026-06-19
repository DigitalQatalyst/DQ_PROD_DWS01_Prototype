-- =============================================================================
-- File: 0010_seed_listing_attributes.sql
-- Purpose: Listing attributes for all 76 Drive services (filters + metadata)
-- Prerequisite: 0009_seed_filter_definitions_and_values.sql
-- Safe to re-run: YES
-- =============================================================================

BEGIN;

-- Location (Visa / Work Permit = dubai only; all others = both)
INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT
  l.tenant_id,
  l.id,
  'location',
  CASE WHEN l.slug = 'visa-work-permit-support' THEN 'dubai' ELSE 'both' END,
  'text',
  10
FROM discovery.listings l
WHERE l.marketplace_id = 'b0000000-0000-4000-8000-000000000004'
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Approval (mirrors service_details for filter UI)
INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, l.id, 'approval', sd.approval, 'text', 20
FROM discovery.listings l
JOIN discovery.service_details sd ON sd.listing_id = l.id
WHERE l.marketplace_id = 'b0000000-0000-4000-8000-000000000004'
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Service domain (from category slug)
INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, l.id, 'service_domain', lc.slug, 'text', 30
FROM discovery.listings l
JOIN discovery.listing_categories lc ON lc.id = l.category_id
WHERE l.marketplace_id = 'b0000000-0000-4000-8000-000000000004'
  AND lc.parent_id IS NULL
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Service domain for Enable leaf-category services (use parent domain)
INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, l.id, 'service_domain', parent.slug, 'text', 30
FROM discovery.listings l
JOIN discovery.listing_categories lc ON lc.id = l.category_id
JOIN discovery.listing_categories parent ON parent.id = lc.parent_id
WHERE l.marketplace_id = 'b0000000-0000-4000-8000-000000000004'
  AND lc.parent_id IS NOT NULL
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Delivery team code (from provider department)
INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, l.id, 'delivery_team_code', d.slug, 'text', 50
FROM discovery.listings l
JOIN discovery.service_details sd ON sd.listing_id = l.id
JOIN platform.departments d ON d.id = sd.provider_department_id
WHERE l.marketplace_id = 'b0000000-0000-4000-8000-000000000004'
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Per-service facets (functional area + submarketplace-specific filters)
CREATE TEMP TABLE _svc_facets (
  listing_id uuid PRIMARY KEY,
  functional_area text NOT NULL,
  engagement_type text,
  discipline text,
  category text,
  frequency text,
  funnel_stage text,
  output_type text,
  engagement_model text
) ON COMMIT DROP;

INSERT INTO _svc_facets (listing_id, functional_area, engagement_type, discipline, category, frequency, funnel_stage, output_type, engagement_model) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'Strategy Management', 'advisory', 'strategy', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000002', 'Enterprise Architecture', 'review', 'architecture', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000003', 'Platform Architecture', 'review', 'architecture', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000004', 'Governance Management', 'assessment', 'governance', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000005', 'Risk & Compliance', 'assessment', 'risk', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000006', 'Benefits Management', 'review', 'governance', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000007', 'Innovation Management', 'advisory', 'innovation', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000008', 'AI Enablement', 'build', 'ai_and_automation', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000009', 'Process Automation', 'build', 'ai_and_automation', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000010', 'Knowledge Engineering', 'build', 'ai_and_automation', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000011', 'Decision Intelligence', 'build', 'ai_and_automation', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000012', 'Continuous Improvement', 'advisory', 'innovation', NULL, NULL, NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000013', 'Workforce Operations', NULL, NULL, 'payroll', 'recurring', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000014', 'Workforce Operations', NULL, NULL, 'payroll', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000015', 'Workforce Operations', NULL, NULL, 'payroll', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000016', 'Workforce Operations', NULL, NULL, 'leave_and_attendance', 'recurring', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000017', 'Workforce Operations', NULL, NULL, 'leave_and_attendance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000018', 'Workforce Operations', NULL, NULL, 'leave_and_attendance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000019', 'Workforce Operations', NULL, NULL, 'leave_and_attendance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000020', 'Workforce Operations', NULL, NULL, 'leave_and_attendance', 'recurring', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000021', 'Workforce Operations', NULL, NULL, 'hr_lifecycle', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000022', 'Workforce Operations', NULL, NULL, 'hr_lifecycle', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000023', 'Workforce Operations', NULL, NULL, 'hr_lifecycle', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000024', 'Workforce Operations', NULL, NULL, 'hr_lifecycle', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000025', 'Workforce Operations', NULL, NULL, 'hr_lifecycle', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000026', 'Workforce Operations', NULL, NULL, 'hr_lifecycle', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000027', 'Workforce Operations', NULL, NULL, 'hr_lifecycle', 'recurring', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000028', 'Platform Operations', NULL, NULL, 'tools_and_access', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000029', 'Platform Operations', NULL, NULL, 'tools_and_access', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000030', 'Platform Operations', NULL, NULL, 'tools_and_access', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000031', 'Platform Operations', NULL, NULL, 'tools_and_access', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000032', 'Platform Operations', NULL, NULL, 'tools_and_access', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000033', 'Platform Operations', NULL, NULL, 'tools_and_access', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000034', 'Platform Operations', NULL, NULL, 'tools_and_access', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000035', 'Operational Insight', NULL, NULL, 'operations', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000036', 'Performance Management', NULL, NULL, 'operations', 'recurring', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000037', 'Quality Management', NULL, NULL, 'operations', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000038', 'Service Management', NULL, NULL, 'operations', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000039', 'Procurement Management', NULL, NULL, 'finance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000040', 'Vendor Management', NULL, NULL, 'finance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000041', 'Contract Management', NULL, NULL, 'finance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000042', 'Legal Operations', NULL, NULL, 'finance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000043', 'Financial Management', NULL, NULL, 'finance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000044', 'Financial Management', NULL, NULL, 'finance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000045', 'Financial Management', NULL, NULL, 'finance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000046', 'Financial Management', NULL, NULL, 'finance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000047', 'Financial Management', NULL, NULL, 'finance', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000048', 'Corporate Administration', NULL, NULL, 'facilities', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000049', 'Corporate Administration', NULL, NULL, 'facilities', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000050', 'Corporate Administration', NULL, NULL, 'facilities', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000051', 'Corporate Administration', NULL, NULL, 'facilities', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000052', 'Corporate Administration', NULL, NULL, 'facilities', 'one_off', NULL, NULL, NULL),
  ('c0000000-0000-4000-8000-000000000053', 'Market Intelligence', NULL, NULL, NULL, NULL, 'awareness', 'content', NULL),
  ('c0000000-0000-4000-8000-000000000054', 'Brand Management', NULL, NULL, NULL, NULL, 'awareness', 'brand_asset', NULL),
  ('c0000000-0000-4000-8000-000000000055', 'Campaign Management', NULL, NULL, NULL, NULL, 'demand', 'campaign', NULL),
  ('c0000000-0000-4000-8000-000000000056', 'Content Operations', NULL, NULL, NULL, NULL, 'demand', 'content', NULL),
  ('c0000000-0000-4000-8000-000000000057', 'Lead Generation', NULL, NULL, NULL, NULL, 'demand', 'campaign', NULL),
  ('c0000000-0000-4000-8000-000000000058', 'Customer Experience', NULL, NULL, NULL, NULL, 'account', 'content', NULL),
  ('c0000000-0000-4000-8000-000000000059', 'Lead Management', NULL, NULL, NULL, NULL, 'pipeline', 'proposal', NULL),
  ('c0000000-0000-4000-8000-000000000060', 'Opportunity Management', NULL, NULL, NULL, NULL, 'pipeline', 'proposal', NULL),
  ('c0000000-0000-4000-8000-000000000061', 'Sales Management', NULL, NULL, NULL, NULL, 'pipeline', 'proposal', NULL),
  ('c0000000-0000-4000-8000-000000000062', 'Account Management', NULL, NULL, NULL, NULL, 'account', 'partnership', NULL),
  ('c0000000-0000-4000-8000-000000000063', 'Partner Management', NULL, NULL, NULL, NULL, 'account', 'partnership', NULL),
  ('c0000000-0000-4000-8000-000000000064', 'Ecosystem Development', NULL, NULL, NULL, NULL, 'account', 'partnership', NULL),
  ('c0000000-0000-4000-8000-000000000065', 'Customer Onboarding', 'deploy', NULL, NULL, NULL, NULL, NULL, 'project'),
  ('c0000000-0000-4000-8000-000000000066', 'Order Fulfilment', 'deploy', NULL, NULL, NULL, NULL, NULL, 'project'),
  ('c0000000-0000-4000-8000-000000000067', 'Customer Support', 'manage', NULL, NULL, NULL, NULL, NULL, 'tmaas'),
  ('c0000000-0000-4000-8000-000000000068', 'Case Management', 'manage', NULL, NULL, NULL, NULL, NULL, 'tmaas'),
  ('c0000000-0000-4000-8000-000000000069', 'Incident Management', 'manage', NULL, NULL, NULL, NULL, NULL, 'tmaas'),
  ('c0000000-0000-4000-8000-000000000070', 'Lifecycle Services', 'manage', NULL, NULL, NULL, NULL, NULL, 'tmaas'),
  ('c0000000-0000-4000-8000-000000000071', 'Product Development', 'deploy', NULL, NULL, NULL, NULL, NULL, 'project'),
  ('c0000000-0000-4000-8000-000000000072', 'Solution Delivery', 'design', NULL, NULL, NULL, NULL, NULL, 'project'),
  ('c0000000-0000-4000-8000-000000000073', 'Project Delivery', 'assess', NULL, NULL, NULL, NULL, NULL, 'project'),
  ('c0000000-0000-4000-8000-000000000074', 'Managed Services', 'manage', NULL, NULL, NULL, NULL, NULL, 'tmaas'),
  ('c0000000-0000-4000-8000-000000000075', 'Production Operations', 'manage', NULL, NULL, NULL, NULL, NULL, 'tmaas'),
  ('c0000000-0000-4000-8000-000000000076', 'Performance Management', 'manage', NULL, NULL, NULL, NULL, NULL, 'tmaas');

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, f.listing_id, 'functional_area', f.functional_area, 'text', 40
FROM _svc_facets f JOIN discovery.listings l ON l.id = f.listing_id
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, f.listing_id, 'engagement_type', f.engagement_type, 'text', 60
FROM _svc_facets f JOIN discovery.listings l ON l.id = f.listing_id
WHERE f.engagement_type IS NOT NULL
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, f.listing_id, 'discipline', f.discipline, 'text', 70
FROM _svc_facets f JOIN discovery.listings l ON l.id = f.listing_id
WHERE f.discipline IS NOT NULL
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, f.listing_id, 'category', f.category, 'text', 80
FROM _svc_facets f JOIN discovery.listings l ON l.id = f.listing_id
WHERE f.category IS NOT NULL
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, f.listing_id, 'frequency', f.frequency, 'text', 90
FROM _svc_facets f JOIN discovery.listings l ON l.id = f.listing_id
WHERE f.frequency IS NOT NULL
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, f.listing_id, 'funnel_stage', f.funnel_stage, 'text', 100
FROM _svc_facets f JOIN discovery.listings l ON l.id = f.listing_id
WHERE f.funnel_stage IS NOT NULL
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, f.listing_id, 'output_type', f.output_type, 'text', 110
FROM _svc_facets f JOIN discovery.listings l ON l.id = f.listing_id
WHERE f.output_type IS NOT NULL
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT l.tenant_id, f.listing_id, 'engagement_model', f.engagement_model, 'text', 120
FROM _svc_facets f JOIN discovery.listings l ON l.id = f.listing_id
WHERE f.engagement_model IS NOT NULL
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

COMMIT;

-- CHECKPOINT
-- SELECT key, count(*) FROM discovery.listing_attributes GROUP BY key ORDER BY key;
