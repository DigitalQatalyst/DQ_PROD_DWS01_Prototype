import type { WorkspaceSegment } from './permissions.js';

/**
 * In-memory IAM directory used only when DATABASE_URL is not configured
 * (prototype validation). Mirrors the personas used by the frontend prototype.
 * In production the canonical directory lives in Supabase/Postgres.
 */
export const seedDirectory: Record<string, { displayName: string; segment: WorkspaceSegment }> = {
  'amina.hassan@digitalqatalyst.com': { displayName: 'Amina Hassan', segment: 'Associate' },
};

/** Segment assigned to a first-time authenticated user not present in the directory. */
export const DEFAULT_SEGMENT: WorkspaceSegment = 'Associate';
