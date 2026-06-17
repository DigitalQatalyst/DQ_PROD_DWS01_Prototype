# DWS.01 IAM MVP Decision Record

Date: 2026-06-17

This record closes the open IAM implementation gaps identified in `llad-cross-cutting-iam-v1.0-draft.md` for the MVP build.

## Decisions

| Gap | MVP decision |
|---|---|
| DWS01-IAM-G-001 | DWS uses Entra ID as the identity provider and DWS as the application authorization authority. Entra authenticates the user and may provide bootstrap group/app-role mappings, but DWS stores and enforces app roles, permissions, unit/team scopes, feature access, exceptions, delegations, and audit rules in the platform database. |
| DWS01-IAM-G-002 | The frontend does not hold Entra tokens. Sessions are managed by the BFF using secure `httpOnly` cookies, and the client retrieves session context through `/api/session/me`. |
| DWS01-IAM-G-003 | For MVP, service authorization remains inside the BFF. |
| DWS01-IAM-G-004 | Supabase/Postgres holds canonical IAM and audit records. Redis is introduced only if distributed sessions, caching, or scale requirements justify it. |

## Implementation Consequences

- Client route guards are presentation controls only.
- The BFF owns login, callback, logout, session validation, role/permission resolution, access-denied audit events, and exception request submission.
- Active role selection is constrained to roles returned by the authenticated DWS session.
- Browser storage can remember a preferred active role only when it remains part of the authenticated assigned-role set.
