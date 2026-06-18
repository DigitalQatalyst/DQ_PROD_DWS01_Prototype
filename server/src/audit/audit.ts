import { getPool } from '../db/pool.js';

export type AuditEventType =
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'session_denied'
  | 'user_provisioned';

export interface AuditEvent {
  eventType: AuditEventType;
  actorEmail?: string | null;
  actorOid?: string | null;
  resource?: string | null;
  decision?: 'allow' | 'deny' | 'n/a';
  detail?: Record<string, unknown>;
}

/**
 * Emit a non-deletable IAM audit event (ADR-DWS01-IAM-007).
 * Writes to Postgres when configured; always mirrors to stdout so prototype
 * runs still produce access evidence. Audit failures never block the request.
 */
export async function recordAudit(event: AuditEvent): Promise<void> {
  const enriched = {
    occurred_at: new Date().toISOString(),
    ...event,
  };
  console.log('[iam-audit]', JSON.stringify(enriched));

  const pool = getPool();
  if (!pool) return;

  try {
    await pool.query(
      `insert into iam_audit_events (event_type, actor_email, actor_oid, resource, decision, detail)
       values ($1, $2, $3, $4, $5, $6)`,
      [
        event.eventType,
        event.actorEmail ?? null,
        event.actorOid ?? null,
        event.resource ?? null,
        event.decision ?? 'n/a',
        JSON.stringify(event.detail ?? {}),
      ],
    );
  } catch (err) {
    console.error('[iam-audit] failed to persist audit event', err);
  }
}
