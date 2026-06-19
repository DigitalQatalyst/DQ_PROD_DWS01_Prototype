-- =============================================================================
-- File: 0008_seed_drive_delivery_services.sql
-- Purpose: Seed 12 Delivery (Customer Delivery & Operations) Drive services
-- Prerequisite: 0007_seed_drive_commercial_services.sql
-- Safe to re-run: YES
-- Expected outcome: 12 listings + 12 service_details
-- =============================================================================

BEGIN;

INSERT INTO discovery.listings (id, tenant_id, workspace_id, marketplace_id, submarketplace_id, category_id, title, slug, summary, status) VALUES
  ('c0000000-0000-4000-8000-000000000065', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000107', 'Customer Onboarding Setup', 'customer-onboarding-setup', 'Set up customer onboarding for a new account.', 'published'),
  ('c0000000-0000-4000-8000-000000000066', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000107', 'Order Fulfilment Request', 'order-fulfilment-request', 'Request order fulfilment for a customer.', 'published'),
  ('c0000000-0000-4000-8000-000000000067', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000107', 'Customer Support Case', 'customer-support-case', 'Raise a customer support case.', 'published'),
  ('c0000000-0000-4000-8000-000000000068', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000107', 'Case Setup / Routing', 'case-setup-routing', 'Configure case routing or escalation paths.', 'published'),
  ('c0000000-0000-4000-8000-000000000069', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000107', 'Incident Escalation', 'incident-escalation', 'Escalate a customer or production incident.', 'published'),
  ('c0000000-0000-4000-8000-000000000070', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000107', 'Lifecycle / Renewal Request', 'lifecycle-renewal-request', 'Manage customer lifecycle or renewal.', 'published'),
  ('c0000000-0000-4000-8000-000000000071', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000108', 'Product Build Request', 'product-build-request', 'Request product development or enhancement.', 'published'),
  ('c0000000-0000-4000-8000-000000000072', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000108', 'Solution Delivery Engagement', 'solution-delivery-engagement', 'Engage solution delivery team for a customer programme.', 'published'),
  ('c0000000-0000-4000-8000-000000000073', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000108', 'Project Setup Request', 'project-setup-request', 'Set up a new delivery project.', 'published'),
  ('c0000000-0000-4000-8000-000000000074', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000108', 'Managed Services Request', 'managed-services-request', 'Request managed services engagement.', 'published'),
  ('c0000000-0000-4000-8000-000000000075', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000108', 'Production Operations Support', 'production-operations-support', 'Production operations and platform support.', 'published'),
  ('c0000000-0000-4000-8000-000000000076', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000108', 'Delivery Performance Review', 'delivery-performance-review', 'Review delivery performance and KPIs.', 'published')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary, status = EXCLUDED.status;

INSERT INTO discovery.service_details (listing_id, tenant_id, provider_department_id, approval, risk, default_sla, fulfilment_path) VALUES
  ('c0000000-0000-4000-8000-000000000065', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000208', 'conditional', 'standard', '10_business_days', 'dq_account_onboarding'),
  ('c0000000-0000-4000-8000-000000000066', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000208', 'conditional', 'standard', '5_business_days', 'dq_account_fulfilment'),
  ('c0000000-0000-4000-8000-000000000067', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000208', 'not_required', 'standard', '4_business_hours', 'dq_account_support'),
  ('c0000000-0000-4000-8000-000000000068', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000208', 'conditional', 'standard', '5_business_days', 'dq_account_case_routing'),
  ('c0000000-0000-4000-8000-000000000069', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000208', 'conditional', 'review_sensitive', '4_business_hours', 'dq_account_incident_escalation'),
  ('c0000000-0000-4000-8000-000000000070', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000208', 'conditional', 'standard', '10_business_days', 'dq_account_lifecycle'),
  ('c0000000-0000-4000-8000-000000000071', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000209', 'conditional', 'review_sensitive', '20_business_days', 'products_build_queue'),
  ('c0000000-0000-4000-8000-000000000072', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000210', 'conditional', 'review_sensitive', '15_business_days', 'solutions_delivery_engagement'),
  ('c0000000-0000-4000-8000-000000000073', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000211', 'conditional', 'standard', '5_business_days', 'dq_deploys_project_setup'),
  ('c0000000-0000-4000-8000-000000000074', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000211', 'conditional', 'review_sensitive', '10_business_days', 'dq_deploys_managed_services'),
  ('c0000000-0000-4000-8000-000000000075', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000204', 'conditional', 'review_sensitive', '4_business_hours', 'secdevops_production_ops'),
  ('c0000000-0000-4000-8000-000000000076', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000209', 'conditional', 'standard', '10_business_days', 'products_performance_review')
ON CONFLICT (listing_id) DO UPDATE SET
  provider_department_id = EXCLUDED.provider_department_id,
  approval = EXCLUDED.approval,
  risk = EXCLUDED.risk,
  default_sla = EXCLUDED.default_sla,
  fulfilment_path = EXCLUDED.fulfilment_path;

COMMIT;

-- CHECKPOINT
-- SELECT sm.slug, count(l.id) FROM discovery.submarketplaces sm
-- LEFT JOIN discovery.listings l ON l.submarketplace_id = sm.id GROUP BY sm.slug;
-- expect: commercial=12, delivery=12, enable=40, transform=12
