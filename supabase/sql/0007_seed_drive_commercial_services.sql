-- =============================================================================
-- File: 0007_seed_drive_commercial_services.sql
-- Purpose: Seed 12 Commercial (Commercials) Drive services
-- Prerequisite: 0006_seed_drive_enable_services.sql
-- Safe to re-run: YES
-- Expected outcome: 12 listings + 12 service_details
-- =============================================================================

BEGIN;

INSERT INTO discovery.listings (id, tenant_id, workspace_id, marketplace_id, submarketplace_id, category_id, title, slug, summary, status) VALUES
  ('c0000000-0000-4000-8000-000000000053', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000105', 'Market Research Request', 'market-research-request', 'Request market intelligence or research support.', 'published'),
  ('c0000000-0000-4000-8000-000000000054', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000105', 'Brand Asset Request', 'brand-asset-request', 'Request brand assets, logos, or templates.', 'published'),
  ('c0000000-0000-4000-8000-000000000055', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000105', 'Campaign Request', 'campaign-request', 'Plan and launch a marketing campaign.', 'published'),
  ('c0000000-0000-4000-8000-000000000056', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000105', 'Content / Story Production', 'content-story-production', 'Produce content, stories, or thought leadership.', 'published'),
  ('c0000000-0000-4000-8000-000000000057', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000105', 'Lead Generation Request', 'lead-generation-request', 'Request lead generation campaign or support.', 'published'),
  ('c0000000-0000-4000-8000-000000000058', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000105', 'CX Improvement Request', 'cx-improvement-request', 'Improve customer experience for an account or journey.', 'published'),
  ('c0000000-0000-4000-8000-000000000059', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000106', 'Lead Qualification', 'lead-qualification', 'Qualify inbound or outbound sales leads.', 'published'),
  ('c0000000-0000-4000-8000-000000000060', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000106', 'Opportunity Registration', 'opportunity-registration', 'Register a new sales opportunity.', 'published'),
  ('c0000000-0000-4000-8000-000000000061', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000106', 'Sales Support / Proposal', 'sales-support-proposal', 'Request sales support or proposal development.', 'published'),
  ('c0000000-0000-4000-8000-000000000062', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000106', 'Account Setup / Review', 'account-setup-review', 'Set up or review a customer account.', 'published'),
  ('c0000000-0000-4000-8000-000000000063', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000106', 'Partner Onboarding', 'partner-onboarding', 'Onboard a new partner or alliance.', 'published'),
  ('c0000000-0000-4000-8000-000000000064', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000106', 'Ecosystem Engagement Request', 'ecosystem-engagement-request', 'Engage ecosystem partners or alliances.', 'published')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary, status = EXCLUDED.status;

INSERT INTO discovery.service_details (listing_id, tenant_id, provider_department_id, approval, risk, default_sla, fulfilment_path) VALUES
  ('c0000000-0000-4000-8000-000000000053', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000206', 'conditional', 'standard', '10_business_days', 'stories_market_research'),
  ('c0000000-0000-4000-8000-000000000054', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000206', 'conditional', 'standard', '5_business_days', 'stories_brand_assets'),
  ('c0000000-0000-4000-8000-000000000055', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000206', 'conditional', 'standard', '10_business_days', 'stories_campaign'),
  ('c0000000-0000-4000-8000-000000000056', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000206', 'conditional', 'standard', '10_business_days', 'stories_content_production'),
  ('c0000000-0000-4000-8000-000000000057', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000206', 'conditional', 'standard', '10_business_days', 'stories_lead_generation'),
  ('c0000000-0000-4000-8000-000000000058', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000206', 'conditional', 'standard', '10_business_days', 'stories_cx_improvement'),
  ('c0000000-0000-4000-8000-000000000059', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000207', 'conditional', 'standard', '5_business_days', 'deals_lead_qualification'),
  ('c0000000-0000-4000-8000-000000000060', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000207', 'conditional', 'standard', '3_business_days', 'deals_opportunity_registration'),
  ('c0000000-0000-4000-8000-000000000061', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000207', 'conditional', 'review_sensitive', '10_business_days', 'deals_proposal_support'),
  ('c0000000-0000-4000-8000-000000000062', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000207', 'conditional', 'standard', '5_business_days', 'deals_account_setup'),
  ('c0000000-0000-4000-8000-000000000063', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000207', 'conditional', 'review_sensitive', '10_business_days', 'deals_partner_onboarding'),
  ('c0000000-0000-4000-8000-000000000064', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000207', 'conditional', 'standard', '10_business_days', 'deals_ecosystem_engagement')
ON CONFLICT (listing_id) DO UPDATE SET
  provider_department_id = EXCLUDED.provider_department_id,
  approval = EXCLUDED.approval,
  risk = EXCLUDED.risk,
  default_sla = EXCLUDED.default_sla,
  fulfilment_path = EXCLUDED.fulfilment_path;

COMMIT;

-- CHECKPOINT
-- SELECT count(*) FROM discovery.listings WHERE submarketplace_id = 'b0000000-0000-4000-8000-000000000013';  -- expect 12
