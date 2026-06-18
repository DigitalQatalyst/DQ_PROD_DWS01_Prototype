import { getPool } from '../db/pool.js';
import { recordAudit } from '../audit/audit.js';
import {
  normalizeSegmentToRole,
  permissionsForSegment,
  type DwsRole,
  type Permission,
  type WorkspaceSegment,
} from './permissions.js';
import { DEFAULT_SEGMENT, seedDirectory } from './seed.js';

export interface EntraIdentity {
  oid: string;
  email: string;
  displayName: string;
  groups?: string[];
}

export interface AccessContext {
  userId: string | null;
  email: string;
  displayName: string;
  workspaceSegment: WorkspaceSegment;
  dwsRoles: DwsRole[];
  permissions: Permission[];
  unit: string | null;
  team: string | null;
}

function buildContext(params: {
  userId: string | null;
  email: string;
  displayName: string;
  segment: WorkspaceSegment;
  extraRoles?: DwsRole[];
  extraPermissions?: Permission[];
  unit?: string | null;
  team?: string | null;
}): AccessContext {
  const baseRole = normalizeSegmentToRole(params.segment);
  const dwsRoles = Array.from(new Set<DwsRole>([baseRole, ...(params.extraRoles ?? [])]));
  const permissions = Array.from(
    new Set<Permission>([...permissionsForSegment(params.segment), ...(params.extraPermissions ?? [])]),
  );
  return {
    userId: params.userId,
    email: params.email,
    displayName: params.displayName,
    workspaceSegment: params.segment,
    dwsRoles,
    permissions,
    unit: params.unit ?? null,
    team: params.team ?? null,
  };
}

/**
 * Resolve the DWS access context for an authenticated Entra identity.
 *
 * DWS is the authorization authority (ADR-DWS01-IAM-009): Entra group claims are
 * only used to seed a brand-new user's initial segment. Roles, permissions, and
 * scope come from DWS records (Postgres) or the in-memory seed directory.
 */
export async function resolveAccessContext(identity: EntraIdentity): Promise<AccessContext> {
  const pool = getPool();
  const email = identity.email.toLowerCase();

  if (!pool) {
    const seeded = seedDirectory[email];
    const segment = seeded?.segment ?? DEFAULT_SEGMENT;
    const displayName = seeded?.displayName ?? identity.displayName ?? email;
    return buildContext({ userId: null, email, displayName, segment });
  }

  // 1. Find or just-in-time provision the user.
  const found = await pool.query<{
    id: string;
    display_name: string;
    workspace_segment: string;
    status: string;
  }>(
    `select id, display_name, workspace_segment, status
       from iam_users
      where entra_oid = $1 or lower(email) = $2
      limit 1`,
    [identity.oid, email],
  );

  let userId: string;
  let segment: WorkspaceSegment;
  let displayName: string;

  if (found.rowCount && found.rows[0]) {
    const row = found.rows[0];
    if (row.status !== 'active') {
      throw new Error(`User ${email} is not active (status=${row.status}).`);
    }
    userId = row.id;
    segment = (row.workspace_segment as WorkspaceSegment) ?? DEFAULT_SEGMENT;
    displayName = row.display_name;
    // Backfill the Entra oid on first real login.
    await pool.query(
      `update iam_users set entra_oid = coalesce(entra_oid, $1), updated_at = now() where id = $2`,
      [identity.oid, userId],
    );
  } else {
    segment = await bootstrapSegmentFromGroups(identity.groups);
    displayName = identity.displayName || email;
    const inserted = await pool.query<{ id: string }>(
      `insert into iam_users (entra_oid, email, display_name, workspace_segment)
       values ($1, $2, $3, $4)
       returning id`,
      [identity.oid, email, displayName, segment],
    );
    userId = inserted.rows[0].id;
    await recordAudit({
      eventType: 'user_provisioned',
      actorEmail: email,
      actorOid: identity.oid,
      decision: 'allow',
      detail: { segment, source: 'just-in-time' },
    });
  }

  // 2. Explicit role assignments (override / augment the segment-derived role).
  const roleRows = await pool.query<{ dws_role: string }>(
    `select dws_role from iam_user_roles where user_id = $1`,
    [userId],
  );
  const extraRoles = roleRows.rows.map((r) => r.dws_role as DwsRole);

  // 3. Active permission exceptions (time-bound, governed).
  const exceptionRows = await pool.query<{ permission: string }>(
    `select permission from iam_permission_exceptions
      where user_id = $1 and (expires_at is null or expires_at > now())`,
    [userId],
  );
  const extraPermissions = exceptionRows.rows.map((r) => r.permission as Permission);

  // 4. Unit / team scope.
  const scopeRow = await pool.query<{ unit: string | null; team: string | null }>(
    `select unit, team from iam_user_scope where user_id = $1 limit 1`,
    [userId],
  );
  const scope = scopeRow.rows[0];

  return buildContext({
    userId,
    email,
    displayName,
    segment,
    extraRoles,
    extraPermissions,
    unit: scope?.unit ?? null,
    team: scope?.team ?? null,
  });
}

async function bootstrapSegmentFromGroups(groups?: string[]): Promise<WorkspaceSegment> {
  const pool = getPool();
  if (!pool || !groups || groups.length === 0) return DEFAULT_SEGMENT;
  const mapped = await pool.query<{ workspace_segment: string }>(
    `select workspace_segment from iam_entra_group_map where entra_group_id = any($1) limit 1`,
    [groups],
  );
  return (mapped.rows[0]?.workspace_segment as WorkspaceSegment) ?? DEFAULT_SEGMENT;
}
