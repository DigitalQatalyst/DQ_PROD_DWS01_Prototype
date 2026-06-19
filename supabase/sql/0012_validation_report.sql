-- =============================================================================
-- File: 0012_validation_report.sql
-- Purpose: Read-only data quality report — all rows must show PASS
-- Prerequisite: 0011_ux_copy_refinement.sql
-- Safe to re-run: YES (SELECT only, no data changes)
-- =============================================================================

WITH drive_listings AS (
  SELECT l.*
  FROM discovery.listings l
  WHERE l.marketplace_id = 'b0000000-0000-4000-8000-000000000004'
    AND l.deleted_at IS NULL
),
checks AS (
  SELECT 1 AS check_id, 'drive_listings_have_service_details' AS check_name,
    76 AS expected,
    (SELECT count(*) FROM drive_listings dl
     JOIN discovery.service_details sd ON sd.listing_id = dl.id)::int AS actual

  UNION ALL SELECT 2, 'missing_core_attributes', 0,
    (SELECT count(*) FROM drive_listings dl
     WHERE NOT EXISTS (SELECT 1 FROM discovery.listing_attributes la WHERE la.listing_id = dl.id AND la.key = 'service_domain')
        OR NOT EXISTS (SELECT 1 FROM discovery.listing_attributes la WHERE la.listing_id = dl.id AND la.key = 'location')
        OR NOT EXISTS (SELECT 1 FROM discovery.listing_attributes la WHERE la.listing_id = dl.id AND la.key = 'approval'))::int

  UNION ALL SELECT 3, 'filter_definitions_have_values', 0,
    (SELECT count(*) FROM discovery.filter_definitions fd
     WHERE (SELECT count(*) FROM discovery.filter_values fv WHERE fv.filter_definition_id = fd.id) < 2)::int

  UNION ALL SELECT 4, 'invalid_delivery_team_codes', 0,
    (SELECT count(*) FROM discovery.listing_attributes la
     WHERE la.key = 'delivery_team_code'
       AND NOT EXISTS (SELECT 1 FROM platform.departments d WHERE d.slug = la.value))::int

  UNION ALL SELECT 5, 'submarketplace_count_transform', 12,
    (SELECT count(*) FROM drive_listings WHERE submarketplace_id = 'b0000000-0000-4000-8000-000000000011')::int

  UNION ALL SELECT 6, 'submarketplace_count_enable', 40,
    (SELECT count(*) FROM drive_listings WHERE submarketplace_id = 'b0000000-0000-4000-8000-000000000012')::int

  UNION ALL SELECT 7, 'submarketplace_count_commercial', 12,
    (SELECT count(*) FROM drive_listings WHERE submarketplace_id = 'b0000000-0000-4000-8000-000000000013')::int

  UNION ALL SELECT 8, 'submarketplace_count_delivery', 12,
    (SELECT count(*) FROM drive_listings WHERE submarketplace_id = 'b0000000-0000-4000-8000-000000000014')::int

  UNION ALL SELECT 9, 'duplicate_listing_slugs', 0,
    (SELECT count(*) FROM (
       SELECT marketplace_id, slug FROM drive_listings GROUP BY marketplace_id, slug HAVING count(*) > 1
     ) dup)::int

  UNION ALL SELECT 10, 'null_provider_department', 0,
    (SELECT count(*) FROM drive_listings dl
     JOIN discovery.service_details sd ON sd.listing_id = dl.id
     WHERE sd.provider_department_id IS NULL)::int

  UNION ALL SELECT 11, 'required_approval_elevated_risk', 0,
    (SELECT count(*) FROM drive_listings dl
     JOIN discovery.service_details sd ON sd.listing_id = dl.id
     WHERE sd.approval = 'required'
       AND coalesce(sd.risk, 'standard') NOT IN ('governance_sensitive', 'review_sensitive', 'at_risk'))::int

  UNION ALL SELECT 12, 'visa_only_non_both_location', 0,
    (SELECT count(*) FROM discovery.listing_attributes la
     JOIN drive_listings dl ON dl.id = la.listing_id
     WHERE la.key = 'location' AND la.value <> 'both'
       AND dl.slug <> 'visa-work-permit-support')::int

  UNION ALL SELECT 13, 'trgm_index_on_listings_title', 1,
    (SELECT count(*) FROM pg_indexes
     WHERE schemaname = 'discovery' AND tablename = 'listings' AND indexname = 'idx_listings_title_trgm')::int

  UNION ALL SELECT 14, 'service_details_with_purpose', 76,
    (SELECT count(*) FROM drive_listings dl
     JOIN discovery.service_details sd ON sd.listing_id = dl.id
     WHERE sd.purpose IS NOT NULL AND sd.purpose <> '')::int
)
SELECT
  check_id,
  check_name,
  expected,
  actual,
  CASE WHEN actual = expected THEN 'PASS' ELSE 'FAIL' END AS status
FROM checks
ORDER BY check_id;
