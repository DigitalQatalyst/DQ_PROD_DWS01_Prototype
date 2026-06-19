-- =============================================================================
-- File: 0005_seed_drive_transform_services.sql
-- Purpose: Seed 12 Transform (Strategy & Innovation) Drive services
-- Prerequisite: 0004_seed_platform_and_hierarchy.sql
-- Safe to re-run: YES
-- Expected outcome: 12 listings + 12 service_details
-- =============================================================================

BEGIN;

INSERT INTO discovery.listings (id, tenant_id, workspace_id, marketplace_id, submarketplace_id, category_id, title, slug, summary, status) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000101', 'Strategic Planning Support', 'strategic-planning-support', 'Strategic alignment support for programmes and initiatives.', 'published'),
  ('c0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000101', 'Enterprise Architecture Review', 'enterprise-architecture-review', 'Independent review of enterprise architecture decisions and alignment.', 'published'),
  ('c0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000101', 'Platform Architecture Review', 'platform-architecture-review', 'Review of platform architecture designs and technical direction.', 'published'),
  ('c0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000101', 'Governance / Policy Exception', 'governance-policy-exception', 'Request an exception to governance policy or control requirements.', 'published'),
  ('c0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000101', 'Risk & Compliance Assessment', 'risk-compliance-assessment', 'Assessment of risk and compliance posture for a programme or change.', 'published'),
  ('c0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000101', 'Benefits Realisation Review', 'benefits-realisation-review', 'Review of benefits tracking and realisation for active initiatives.', 'published'),
  ('c0000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000102', 'Innovation Intake', 'innovation-intake', 'Submit an innovation idea for assessment and prioritisation.', 'published'),
  ('c0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000102', 'AI Enablement Request', 'ai-enablement-request', 'Request AI capability enablement for a team or use case.', 'published'),
  ('c0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000102', 'Process Automation Build', 'process-automation-build', 'Build automated workflow or RPA solution for a business process.', 'published'),
  ('c0000000-0000-4000-8000-000000000010', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000102', 'Knowledge Engineering Request', 'knowledge-engineering-request', 'Design and build knowledge bases or retrieval systems.', 'published'),
  ('c0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000102', 'Decision Intelligence / Analytics Request', 'decision-intelligence-analytics-request', 'Analytics or decision-support capability for business decisions.', 'published'),
  ('c0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000102', 'Continuous Improvement Initiative', 'continuous-improvement-initiative', 'Advisory support for continuous improvement programmes.', 'published')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary, status = EXCLUDED.status;

INSERT INTO discovery.service_details (listing_id, tenant_id, provider_department_id, approval, risk, default_sla, fulfilment_path) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000201', 'conditional', 'governance_sensitive', '5_business_days', 'governance_coe_advisory'),
  ('c0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000201', 'required', 'governance_sensitive', '10_business_days', 'governance_coe_review'),
  ('c0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000201', 'required', 'governance_sensitive', '10_business_days', 'governance_coe_review'),
  ('c0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000201', 'required', 'governance_sensitive', '5_business_days', 'governance_exception_review'),
  ('c0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000201', 'required', 'governance_sensitive', '10_business_days', 'governance_risk_assessment'),
  ('c0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000201', 'conditional', 'review_sensitive', '5_business_days', 'governance_benefits_review'),
  ('c0000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000202', 'conditional', 'standard', '5_business_days', 'intelligence_innovation_intake'),
  ('c0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000202', 'conditional', 'review_sensitive', '15_business_days', 'intelligence_ai_enablement'),
  ('c0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000202', 'conditional', 'review_sensitive', '20_business_days', 'intelligence_process_automation'),
  ('c0000000-0000-4000-8000-000000000010', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000202', 'conditional', 'review_sensitive', '15_business_days', 'intelligence_knowledge_engineering'),
  ('c0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000202', 'conditional', 'review_sensitive', '15_business_days', 'intelligence_decision_analytics'),
  ('c0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000202', 'conditional', 'standard', '5_business_days', 'intelligence_continuous_improvement')
ON CONFLICT (listing_id) DO UPDATE SET
  provider_department_id = EXCLUDED.provider_department_id,
  approval = EXCLUDED.approval,
  risk = EXCLUDED.risk,
  default_sla = EXCLUDED.default_sla,
  fulfilment_path = EXCLUDED.fulfilment_path;

COMMIT;

-- CHECKPOINT
-- SELECT count(*) FROM discovery.listings WHERE submarketplace_id = 'b0000000-0000-4000-8000-000000000011';  -- expect 12
