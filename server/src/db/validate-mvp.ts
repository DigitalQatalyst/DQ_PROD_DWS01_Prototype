import { createPool } from './run-sql-files.js';

type CheckResult = {
  name: string;
  passed: boolean;
  detail: string;
};

const requiredTables = [
  'users',
  'roles',
  'user_roles',
  'departments',
  'admin_department_assignments',
  'marketplace_areas',
  'knowledge_categories',
  'knowledge_assets',
  'service_categories',
  'service_definitions',
  'service_required_inputs',
  'service_requests',
  'service_request_input_responses',
  'service_request_comments',
  'service_request_attachments',
  'service_request_activity',
  'service_request_status_history',
  'service_request_closures',
  'service_request_ratings',
  'feature_flags',
  'audit_events',
];

const forbiddenTables = [
  'trackers',
  'tracker_records',
  'tasks',
  'workflows',
  'analytics_assets',
  'approvals',
  'role_permissions',
  'permissions',
];

function pass(name: string, detail: string): CheckResult {
  return { name, passed: true, detail };
}

function fail(name: string, detail: string): CheckResult {
  return { name, passed: false, detail };
}

async function scalar<T>(query: (sql: string, values?: unknown[]) => Promise<{ rows: T[] }>, sql: string, values?: unknown[]): Promise<T> {
  const result = await query(sql, values);
  return result.rows[0];
}

async function main(): Promise<void> {
  const pool = createPool();
  const checks: CheckResult[] = [];
  const query = pool.query.bind(pool);

  try {
    const tableRows = await query<{ table_name: string }>(
      `
        select table_name
        from information_schema.tables
        where table_schema = 'public'
      `,
    );
    const tables = new Set(tableRows.rows.map((row) => row.table_name));
    const missingTables = requiredTables.filter((table) => !tables.has(table));
    checks.push(
      missingTables.length === 0
        ? pass('required tables', `${requiredTables.length} required tables exist`)
        : fail('required tables', `missing: ${missingTables.join(', ')}`),
    );

    const presentForbiddenTables = forbiddenTables.filter((table) => tables.has(table));
    checks.push(
      presentForbiddenTables.length === 0
        ? pass('post-MVP tables excluded', 'no forbidden post-MVP tables exist')
        : fail('post-MVP tables excluded', `unexpected: ${presentForbiddenTables.join(', ')}`),
    );

    const roles = await query<{ role_name: string }>('select role_name from roles order by role_name');
    const roleNames = roles.rows.map((row) => row.role_name);
    checks.push(
      roleNames.includes('Associate') && roleNames.includes('Admin')
        ? pass('launch roles', roleNames.join(', '))
        : fail('launch roles', `found: ${roleNames.join(', ')}`),
    );

    const adminAssignments = await scalar<{ count: string }>(
      query,
      `
        select count(*)::text
        from admin_department_assignments ada
        join user_roles ur on ur.user_id = ada.admin_user_id
        join roles r on r.role_id = ur.role_id
        where r.role_name = 'Admin'
          and ada.assignment_status = 'Active'
      `,
    );
    checks.push(
      Number(adminAssignments.count) >= 5
        ? pass('admin department assignments', `${adminAssignments.count} active Admin assignments`)
        : fail('admin department assignments', `${adminAssignments.count} active Admin assignments`),
    );

    const marketplace = await query<{ area_code: string; launch_visibility_status: string }>(
      `
        select area_code, launch_visibility_status
        from marketplace_areas
        where area_code in ('discern', 'deploy', 'design', 'drive')
      `,
    );
    const marketplaceState = new Map(marketplace.rows.map((row) => [row.area_code, row.launch_visibility_status]));
    checks.push(
      marketplaceState.get('discern') === 'active' &&
        marketplaceState.get('deploy') === 'active' &&
        marketplaceState.get('design') === 'hidden' &&
        marketplaceState.get('drive') === 'hidden'
        ? pass('marketplace visibility', 'Discern/Deploy active; Design/Drive hidden')
        : fail('marketplace visibility', JSON.stringify(Object.fromEntries(marketplaceState))),
    );

    const flags = await query<{ flag_key: string; enabled: boolean }>(
      `
        select flag_key, enabled
        from feature_flags
        where flag_key in (
          'marketplace.discern.enabled',
          'marketplace.deploy.enabled',
          'services.serviceHub.enabled',
          'services.requestQueues.enabled',
          'marketplace.design.enabled',
          'marketplace.drive.enabled',
          'trackers.enabled',
          'tasks.enabled',
          'workflows.enabled',
          'analytics.enabled'
        )
      `,
    );
    const flagState = new Map(flags.rows.map((row) => [row.flag_key, row.enabled]));
    const enabledOk =
      flagState.get('marketplace.discern.enabled') === true &&
      flagState.get('marketplace.deploy.enabled') === true &&
      flagState.get('services.serviceHub.enabled') === true &&
      flagState.get('services.requestQueues.enabled') === true;
    const disabledOk =
      flagState.get('marketplace.design.enabled') === false &&
      flagState.get('marketplace.drive.enabled') === false &&
      flagState.get('trackers.enabled') === false &&
      flagState.get('tasks.enabled') === false &&
      flagState.get('workflows.enabled') === false &&
      flagState.get('analytics.enabled') === false;
    checks.push(
      enabledOk && disabledOk
        ? pass('feature flags', 'launch flags match MVP visibility')
        : fail('feature flags', JSON.stringify(Object.fromEntries(flagState))),
    );

    const serviceDepartmentCount = await scalar<{ count: string }>(
      query,
      `
        select count(distinct department_id)::text
        from service_definitions
        where status = 'Published'
      `,
    );
    checks.push(
      Number(serviceDepartmentCount.count) >= 5
        ? pass('services map to departments', `${serviceDepartmentCount.count} departments have published services`)
        : fail('services map to departments', `${serviceDepartmentCount.count} departments have published services`),
    );

    const associateRequests = await scalar<{ request_count: string; department_count: string }>(
      query,
      `
        select count(*)::text as request_count, count(distinct sr.department_id)::text as department_count
        from service_requests sr
        join users u on u.user_id = sr.requester_user_id
        where u.email = 'amina.hassan@digitalqatalyst.com'
      `,
    );
    checks.push(
      Number(associateRequests.request_count) >= 6 && Number(associateRequests.department_count) >= 5
        ? pass('associate cross-department requests', `${associateRequests.request_count} requests across ${associateRequests.department_count} departments`)
        : fail('associate cross-department requests', `${associateRequests.request_count} requests across ${associateRequests.department_count} departments`),
    );

    const visibilityRows = await query<{ visibility: string; count: string }>(
      `
        select visibility, count(*)::text
        from service_request_comments
        group by visibility
      `,
    );
    const commentVisibility = new Map(visibilityRows.rows.map((row) => [row.visibility, Number(row.count)]));
    checks.push(
      (commentVisibility.get('requester_visible') ?? 0) > 0 && (commentVisibility.get('admin_internal') ?? 0) > 0
        ? pass('comment visibility', 'requester-visible and admin-internal comments exist')
        : fail('comment visibility', JSON.stringify(Object.fromEntries(commentVisibility))),
    );

    const activityRows = await query<{ visibility: string; count: string }>(
      `
        select visibility, count(*)::text
        from service_request_activity
        group by visibility
      `,
    );
    const activityVisibility = new Map(activityRows.rows.map((row) => [row.visibility, Number(row.count)]));
    checks.push(
      (activityVisibility.get('requester_visible') ?? 0) > 0 && (activityVisibility.get('admin_internal') ?? 0) > 0
        ? pass('activity visibility', 'requester-visible and admin-internal activity exists')
        : fail('activity visibility', JSON.stringify(Object.fromEntries(activityVisibility))),
    );

    const responseCount = await scalar<{ count: string }>(
      query,
      'select count(*)::text from service_request_input_responses',
    );
    checks.push(
      Number(responseCount.count) > 0
        ? pass('request input responses', `${responseCount.count} input response rows exist`)
        : fail('request input responses', 'no request input response rows exist'),
    );

    const closed = await scalar<{ closures: string; ratings: string }>(
      query,
      `
        select
          (select count(*)::text from service_request_closures) as closures,
          (select count(*)::text from service_request_ratings) as ratings
      `,
    );
    checks.push(
      Number(closed.closures) > 0 && Number(closed.ratings) > 0
        ? pass('closure and rating', `${closed.closures} closure rows, ${closed.ratings} rating rows`)
        : fail('closure and rating', `${closed.closures} closure rows, ${closed.ratings} rating rows`),
    );

    const audits = await scalar<{ count: string }>(
      query,
      'select count(*)::text from audit_events',
    );
    checks.push(
      Number(audits.count) >= 10
        ? pass('audit events', `${audits.count} audit events seeded`)
        : fail('audit events', `${audits.count} audit events seeded`),
    );
  } finally {
    await pool.end();
  }

  for (const check of checks) {
    console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.name}: ${check.detail}`);
  }

  if (checks.some((check) => !check.passed)) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('[db:validate:mvp] failed');
  console.error(error);
  process.exit(1);
});
