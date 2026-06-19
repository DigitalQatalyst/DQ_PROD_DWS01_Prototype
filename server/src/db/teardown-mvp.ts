import { createPool } from './run-sql-files.js';

const mvpTables = [
  'service_request_ratings',
  'service_request_closures',
  'service_request_status_history',
  'service_request_activity',
  'service_request_attachments',
  'service_request_comments',
  'service_request_input_responses',
  'service_requests',
  'service_required_inputs',
  'service_definitions',
  'service_categories',
  'knowledge_assets',
  'knowledge_categories',
  'feature_flags',
  'audit_events',
  'admin_department_assignments',
  'user_roles',
  'roles',
  'users',
  'departments',
  'marketplace_areas',
  'schema_migrations',
];

async function main(): Promise<void> {
  const pool = createPool();

  try {
    const existing = await pool.query<{ table_name: string }>(
      `
        select table_name
        from information_schema.tables
        where table_schema = 'public'
          and table_name = any($1::text[])
      `,
      [mvpTables],
    );

    const toDrop = existing.rows.map((row) => row.table_name);
    if (toDrop.length === 0) {
      console.log('[db:teardown] no MVP tables found in public schema');
    } else {
      for (const table of toDrop) {
        await pool.query(`drop table if exists public.${table} cascade`);
        console.log(`[db:teardown] dropped public.${table}`);
      }
    }

    await pool.query('drop function if exists public.dws_set_updated_at() cascade');
    console.log('[db:teardown] dropped public.dws_set_updated_at()');

    const schemas = await pool.query<{ schema_name: string }>(
      `
        select schema_name
        from information_schema.schemata
        where schema_name in ('discovery', 'platform', 'app')
      `,
    );

    for (const { schema_name } of schemas.rows) {
      await pool.query(`drop schema if exists ${schema_name} cascade`);
      console.log(`[db:teardown] dropped schema ${schema_name}`);
    }
  } finally {
    await pool.end();
  }

  console.log('[db:teardown] complete');
}

main().catch((error) => {
  console.error('[db:teardown] failed');
  console.error(error);
  process.exit(1);
});
