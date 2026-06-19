const fs = require('fs');
const data = JSON.parse(fs.readFileSync('docs/service-ux-copy-refined.json', 'utf8'));
const esc = (s) => s.replace(/'/g, "''");
const arr = (a) => 'ARRAY[' + a.map((x) => `'${esc(x)}'`).join(', ') + ']';
const rows = data.services
  .map(
    (s) =>
      `  ('${s.listing_id}', '${esc(s.service_name)}', '${esc(s.display_name)}', '${esc(s.short_description)}', '${esc(s.purpose)}', ${arr(s.when_to_use)}, ${arr(s.when_not_to_use)}, ${arr(s.required_inputs)})`
  )
  .join(',\n');

const sql = `-- =============================================================================
-- File: 0011_ux_copy_refinement.sql
-- Purpose: User-facing display copy for all 76 Drive services (ux-copy refined)
-- Source: docs/service-ux-copy-refined.json
-- Prerequisite: 0010_seed_listing_attributes.sql
-- Safe to re-run: YES
-- Rules: Preserves slug/keys/IDs. Updates display fields only.
-- =============================================================================

BEGIN;

UPDATE discovery.submarketplaces SET tagline = CASE slug
  WHEN 'transform' THEN 'Plan smarter, automate wisely, and stay aligned with strategy'
  WHEN 'enable' THEN 'Everyday people, finance, facilities, and IT support in one place'
  WHEN 'commercial' THEN 'Win attention, grow pipeline, and build lasting partnerships'
  WHEN 'delivery' THEN 'Onboard customers, deliver work, and keep operations running smoothly'
END
WHERE tenant_id = 'a0000000-0000-4000-8000-000000000001';

CREATE TEMP TABLE _ux_display (
  listing_id uuid PRIMARY KEY,
  service_name text NOT NULL,
  display_name text NOT NULL,
  short_description text NOT NULL,
  purpose text NOT NULL,
  when_to_use text[] NOT NULL,
  when_not_to_use text[] NOT NULL,
  required_inputs text[] NOT NULL
) ON COMMIT DROP;

INSERT INTO _ux_display (
  listing_id, service_name, display_name, short_description,
  purpose, when_to_use, when_not_to_use, required_inputs
) VALUES
${rows};

UPDATE discovery.listings l
SET title = u.display_name, summary = u.short_description
FROM _ux_display u WHERE l.id = u.listing_id;

UPDATE discovery.service_details sd
SET
  purpose = u.purpose,
  when_to_use = u.when_to_use,
  when_not_to_use = u.when_not_to_use,
  required_inputs = u.required_inputs
FROM _ux_display u WHERE sd.listing_id = u.listing_id;

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT 'a0000000-0000-4000-8000-000000000001', u.listing_id, 'service_name', u.service_name, 'text', 1
FROM _ux_display u
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO discovery.listing_attributes (tenant_id, listing_id, key, value, data_type, sort_order)
SELECT 'a0000000-0000-4000-8000-000000000001', l.id, 'primary_action_label', 'Request Service', 'text', 2
FROM discovery.listings l
WHERE l.marketplace_id = 'b0000000-0000-4000-8000-000000000004'
ON CONFLICT (listing_id, key) DO UPDATE SET value = EXCLUDED.value;

COMMIT;

-- CHECKPOINT
-- SELECT l.title, la.value AS primary_action FROM discovery.listings l
-- JOIN discovery.listing_attributes la ON la.listing_id = l.id AND la.key = 'primary_action_label' LIMIT 5;
`;

fs.writeFileSync('supabase/sql/0011_ux_copy_refinement.sql', sql);
console.log(`Generated 0011 with ${data.services.length} services`);
