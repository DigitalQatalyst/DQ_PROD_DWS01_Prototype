# DWS Discovery Schema — Manual Migration Runbook

Run these SQL files **in numbered order** in the Supabase Dashboard → **SQL Editor** (or via `psql`).

## Pre-flight

1. Confirm you are on the correct Supabase project (staging vs production).
2. Take a database backup before starting.
3. **Greenfield project:** run `0001` → `0012` in order.
4. **Existing MVP tables** (`departments`, `service_definitions`, `iam_*` in `public`): these scripts create new `platform.*` and `discovery.*` schemas **alongside** legacy tables. Nothing is dropped automatically.

## Run order

| # | File | Expected outcome |
|---|------|------------------|
| 1 | `0001_schema_foundation.sql` | `app` + `platform` schemas, org chart tables |
| 2 | `0002_discovery_schema.sql` | 11 tables in `discovery` schema |
| 3 | `0003_rls_and_indexes.sql` | RLS enabled, indexes + triggers |
| 4 | `0004_seed_platform_and_hierarchy.sql` | 1 tenant, 11 departments, 4 marketplaces, 4 submarketplaces, 15 categories |
| 5 | `0005_seed_drive_transform_services.sql` | 12 Transform services |
| 6 | `0006_seed_drive_enable_services.sql` | 40 Enable services |
| 7 | `0007_seed_drive_commercial_services.sql` | 12 Commercial services |
| 8 | `0008_seed_drive_delivery_services.sql` | 12 Delivery services |
| 9 | `0009_seed_filter_definitions_and_values.sql` | Filter definitions + values |
| 10 | `0010_seed_listing_attributes.sql` | Attributes for all 76 services |
| 11 | `0011_ux_copy_refinement.sql` | UX copy on service_details |
| 12 | `0012_validation_report.sql` | 10-check PASS/FAIL report (read-only) |

## How to run each file

1. Open Supabase Dashboard → SQL Editor → New query.
2. Paste the entire file contents.
3. Click **Run**.
4. Confirm no errors and `COMMIT` succeeded.
5. Run the checkpoint queries at the bottom of the file (or below).
6. Proceed to the next file only when the checkpoint passes.

## Checkpoint queries (quick reference)

After **0003**:
```sql
SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('app', 'platform', 'discovery');
```

After **0004**:
```sql
SELECT slug, name FROM discovery.submarketplaces ORDER BY sort_order;
SELECT count(*) FROM discovery.listing_categories;  -- expect 15
```

After **0005–0008** (all four service files):
```sql
SELECT sm.slug, count(l.id) AS service_count
FROM discovery.submarketplaces sm
LEFT JOIN discovery.listings l ON l.submarketplace_id = sm.id
GROUP BY sm.slug ORDER BY sm.slug;
-- expect: commercial=12, delivery=12, enable=40, transform=12
```

After **0012**:
All 10 rows must show `PASS`.

## UUID prefix reference

| Prefix | Entity |
|--------|--------|
| `a0000000-…0001` | Tenant |
| `a0000000-…0010` | Services workspace |
| `a0000000-…0201–0211` | Delivery departments |
| `b0000000-…0001–0004` | Marketplaces (discern–drive) |
| `b0000000-…0011–0014` | Submarketplaces |
| `b0000000-…0101–0108` | Service domain categories |
| `b0000000-…0201–0207` | Enable leaf categories |
| `c0000000-…0001–0076` | Drive service listings |
| `d0000000-…` | Filter definitions / values |

## Troubleshooting

| Problem | Action |
|---------|--------|
| Extension not available | Enable `pgcrypto`, `pg_trgm` in Supabase Dashboard → Database → Extensions; re-run 0001 |
| FK violation on seed | Ensure previous file completed; check checkpoint queries |
| Partial failure mid-file | Re-run the same file (all scripts are idempotent) |
| Need to start over | Restore from Supabase backup, or `DROP SCHEMA discovery, platform, app CASCADE` on a dev project only |

## Optional CLI

From `server/` with `DATABASE_URL` in the repository-root `.env`:

```bash
npm run db:migrate:supabase          # applies 0001–0010
npm run db:migrate:supabase 0012     # apply up to a specific file
npm run db:validate:supabase         # row-count checkpoints
```

Migration progress is tracked in `app.supabase_migrations` (not in `public`).

## Viewing data in the Supabase Dashboard

The SQL scripts create tables in **`discovery`** and **`platform`** schemas — not in `public`.
The Table Editor defaults to `public`, which is why you may only see legacy `iam_*` tables there.

1. Open **Table Editor** → use the **schema** dropdown (top-left).
2. Select **`discovery`** to browse `listings`, `service_details`, `listing_categories`, etc.
3. Select **`platform`** to browse `tenants`, `departments`, `workspaces`, etc.

Or run this in **SQL Editor** to confirm seed data:

```sql
SELECT count(*) AS listings FROM discovery.listings;           -- expect 76
SELECT count(*) AS categories FROM discovery.listing_categories; -- expect 15
SELECT count(*) AS attributes FROM discovery.listing_attributes; -- expect 532
```

To expose these schemas to the Supabase Data API (for `@supabase/supabase-js`):
**Project Settings → API → Exposed schemas** → add `discovery` and `platform`.

## Optional psql

```bash
psql "$DATABASE_URL" -f supabase/sql/0001_schema_foundation.sql
# … repeat for each file in order
```
