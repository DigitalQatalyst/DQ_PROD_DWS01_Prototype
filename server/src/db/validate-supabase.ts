import { createPool } from './run-sql-files.js';

const pool = createPool();

try {
  const schemas = await pool.query<{ schema_name: string }>(
    `select schema_name from information_schema.schemata
     where schema_name in ('app', 'platform', 'discovery')
     order by 1`,
  );
  console.log('Schemas:', schemas.rows.map((r) => r.schema_name).join(', '));

  const categories = await pool.query<{ count: string }>(
    'select count(*)::text from discovery.listing_categories',
  );
  console.log('Listing categories:', categories.rows[0]?.count, '(expect 15)');

  const services = await pool.query<{ slug: string; service_count: string }>(
    `select sm.slug, count(l.id)::text as service_count
     from discovery.submarketplaces sm
     left join discovery.listings l on l.submarketplace_id = sm.id
     group by sm.slug order by sm.slug`,
  );
  console.log('Drive services by submarketplace:');
  for (const row of services.rows) {
    console.log(`  ${row.slug}: ${row.service_count}`);
  }

  const attributes = await pool.query<{ count: string }>(
    'select count(*)::text from discovery.listing_attributes',
  );
  console.log('Listing attributes:', attributes.rows[0]?.count);

  const migrations = await pool.query('select version from app.supabase_migrations order by version');
  console.log('Applied migrations:', migrations.rows.length);
} finally {
  await pool.end();
}
